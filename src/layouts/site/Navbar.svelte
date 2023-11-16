<script lang="ts">
  import { link } from 'svelte-spa-router';
  import active from 'svelte-spa-router/active';
  import { _ } from 'svelte-i18n';

  import { PAGES, isPageAvailable } from 'src/routes';
</script>

<!-- ========== Left Sidebar Start ========== -->
<div class="vertical-menu">
  <div class="h-100" data-simplebar>
    <!-- - Sidemenu -->
    <div id="sidebar-menu">
      <!-- Left Menu Start -->
      <ul class="metismenu list-unstyled" id="side-menu">
        {#each PAGES as page, index}
          {#if !index || (PAGES[index - 1] && PAGES[index - 1].group !== page.group)}
            <li class="menu-title">
              {$_(`menuitems.${page.group}.text`)}
            </li>
          {/if}

          {#if page.leftMenu && isPageAvailable(page)}
            <li
              use:active="{{
                path: page.path,
                className: 'mm-active',
                inactiveClassName: '',
              }}">
              <a
                class="side-nav-link-ref"
                href="{page.menuPath || page.path}"
                use:link
                use:active="{{
                  path: page.path,
                  className: 'active',
                  inactiveClassName: '',
                }}">
                <i class="{page.icon}"></i>
                <span>{page.menuItem || $_(`menuitems.${page.langKeySuffix}.text`)}</span>
              </a>
            </li>
          {/if}
        {/each}
      </ul>
    </div>
    <!-- Sidebar -->
  </div>
</div>
<!-- Left Sidebar End -->
