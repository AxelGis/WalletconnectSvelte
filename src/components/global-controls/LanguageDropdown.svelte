<script lang="ts">
  import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'sveltestrap';

  import { getCurrentLocale, setupI18n } from '../../services/i18n';
  import languages from '../../../data/languages';
  import setDayjsSelectedLocale from '../../services/datetime';

  export let selectedLang = getCurrentLocale();

  let isOpen = false;

  let flagPath;
  handleLocaleChange(selectedLang);

  function handleLocaleChange(lang) {
    setDayjsSelectedLocale(lang);
    setupI18n({ withLocale: lang });
    localStorage.setItem('I18N_LANGUAGE', lang);
    flagPath = findFlagPathBy(lang);
  }

  function findFlagPathBy(lang) {
    return languages.find((item) => item.value == lang).flag;
  }
</script>

<Dropdown {isOpen} toggle="{() => (isOpen = !isOpen)}" class="d-inline-block">
  <DropdownToggle class="btn header-item headerbtn" tag="button" color="">
    <img src="{flagPath}" alt="Skote" height="16" class="d-block" />
  </DropdownToggle>
  <DropdownMenu class="language-switch dropdown-menu-end">
    {#each languages as language}
      <DropdownItem
        on:click="{() => handleLocaleChange(language.value)}"
        class="{`notify-item language ${
          selectedLang === language.value ? 'active' : 'none'
        }`}">
        <img src="{language.flag}" alt="Skote" class="me-2" height="12" />
        <span class="align-middle">
          {language.label}
        </span>
      </DropdownItem>
    {/each}
  </DropdownMenu>
</Dropdown>
