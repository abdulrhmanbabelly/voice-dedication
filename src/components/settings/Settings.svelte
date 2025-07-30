<script lang="ts">
  import SettingUi from "./SettingUi.svelte";
  import SettingsButton from "../icons/SettingsButton.svelte";
  import DarkMode from "./DarkMode.svelte";
  import Language from "./Language.svelte";
  import { translate } from "../../helpers/translate";
  import Dialog, { Content, Title, Header } from "@smui/dialog";
  import ModelSetting from "./ModelSetting.svelte";
  import ModelDialog from "./ModelDialog.svelte";

  let open: boolean = $state(false);
</script>

<SettingsButton bind:open />
<Dialog fullscreen bind:open>
  <Header>
    <Title id="event-title" style="text-transform : capitalize"
      >{translate("settings")}</Title
    >
  </Header>
  <Content>
    <SettingUi><Language /></SettingUi>
    <SettingUi>
      <DarkMode />
    </SettingUi>
    <SettingUi>
      <ModelSetting />
    </SettingUi>
  </Content>
</Dialog>

<ModelDialog />
