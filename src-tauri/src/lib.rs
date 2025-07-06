// ✅ Add all required imports
use std::{
    fs::{self, File},
    io::BufReader,
    path::PathBuf,
};

use zip::ZipArchive;

#[tauri::command]
fn unzip_file(file: String, destination: String) -> Result<(), String> {
    // 👇 Use the full paths passed from frontend (do NOT prepend data_dir anymore)
    let zip_path = PathBuf::from(file);
    let dest_path = PathBuf::from(destination);

    fs::create_dir_all(&dest_path).map_err(|e| format!("Failed to create directory: {}", e))?;

    let file = File::open(&zip_path).map_err(|e| format!("Failed to open zip file: {}", e))?;
    let mut archive = ZipArchive::new(BufReader::new(file))
        .map_err(|e| format!("Failed to read zip archive: {}", e))?;

    for i in 0..archive.len() {
        let mut file = archive
            .by_index(i)
            .map_err(|e| format!("Zip index error: {}", e))?;
        let outpath = dest_path.join(file.sanitized_name());

        if file.name().ends_with('/') {
            fs::create_dir_all(&outpath).map_err(|e| format!("Dir error: {}", e))?;
        } else {
            if let Some(parent) = outpath.parent() {
                if !parent.exists() {
                    fs::create_dir_all(parent).map_err(|e| format!("Parent dir error: {}", e))?;
                }
            }
            let mut outfile =
                File::create(&outpath).map_err(|e| format!("File create error: {}", e))?;
            std::io::copy(&mut file, &mut outfile).map_err(|e| format!("Copy error: {}", e))?;
        }
    }

    Ok(())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_http::init())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![unzip_file])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
