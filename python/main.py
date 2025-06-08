import json
import pyaudio
import asyncio
import websockets
import threading
from vosk import Model, KaldiRecognizer
import pyperclip
import pyautogui
import time
import sys

sys.stdout.reconfigure(encoding="utf-8")  # Ensure UTF-8 encoding

# Load the same model
model = Model("./vosk-model-ar-mgb2-0.4")
recognizer = KaldiRecognizer(model, 16000)

# Initialize microphone stream
mic = pyaudio.PyAudio()
stream = None
running = False
transcription_task = None
BUFFER_SIZE = 4096


async def handle_connection(websocket):
    global stream, running, transcription_task

    print("\n✅ Connected to frontend...\n")
    async for message in websocket:
        if message == "start":
            if not running:
                running = True
                stream = mic.open(
                    format=pyaudio.paInt16,
                    channels=1,
                    rate=16000,
                    input=True,
                    frames_per_buffer=BUFFER_SIZE,
                )
                print("🔴 Recording started... Transcribing...")
                transcription_task = threading.Thread(
                    target=transcribe_thread, daemon=True
                )
                transcription_task.start()

        elif message == "stop":
            if running:
                running = False
                stream.stop_stream()
                stream.close()
                stream = None
                print("🛑 Recording stopped")

                if transcription_task:
                    transcription_task.join()
                    transcription_task = None


def transcribe_thread():
    global stream, running

    while running:
        data = stream.read(BUFFER_SIZE)
        if recognizer.AcceptWaveform(data):
            result = json.loads(recognizer.Result())
        else:
            result = json.loads(recognizer.PartialResult())  # Faster processing

        text = result.get("text", "")
        if text:
            print(f"📝 {text}")  # Instant transcription output
            pyperclip.copy(f"{text} ")
            time.sleep(0.2)
            pyautogui.hotkey("ctrl", "v")


async def main():
    async with websockets.serve(handle_connection, "localhost", 8765):
        await asyncio.Future()


asyncio.run(main())
