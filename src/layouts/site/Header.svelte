<script lang="ts">
  import { _ } from 'svelte-i18n';

  import CurrenciesDropdown from 'src/components/global-controls/CurrenciesDropdown.svelte';
  import LanguageDropdown from 'src/components/global-controls/LanguageDropdown.svelte';
  import ProfileMenu from 'src/components/global-controls/ProfileMenu.svelte';

  function tToggle() {
    var body = document.body;

    body.classList.toggle('sidebar-enable');
    body.classList.toggle('vertical-collpsed');

    if (window.innerWidth >= 992) {
      if (body.getAttribute('data-sidebar-size') == 'sm') {
        body.setAttribute('data-sidebar-size', 'lg');
      } else {
        body.setAttribute('data-sidebar-size', 'sm');
      }
    }
  }
</script>

<header id="page-topbar">
  <div class="navbar-header">
    <div class="d-flex">
      <!-- LOGO -->
      <div class="navbar-brand-box">
        <a class="logo logo-dark" href="index">
          <span class="logo-sm">
            <img alt="" height="22" src="/assets/images/logo.svg" />
          </span>
          <span class="logo-lg">
            <img alt="" height="17" src="/assets/images/logo-dark.png" />
          </span>
        </a>

        <a class="logo logo-light" href="index">
          <span class="logo-sm">
            <img alt="" height="22" src="/assets/images/logo-light.svg" />
          </span>
          <span class="logo-lg">
            <img alt="" height="19" src="/assets/images/logo-light.png" />
          </span>
        </a>
      </div>

      <button
        id="vertical-menu-btn"
        class="btn btn-sm px-3 font-size-16 vertinav-toggle header-item waves-effect"
        on:click="{tToggle}">
        <i class="fa fa-fw fa-bars"></i>
      </button>
    </div>

    <div class="d-flex">
      <CurrenciesDropdown />

      <LanguageDropdown />

      <ProfileMenu />
    </div>
  </div>
</header>
