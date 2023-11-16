<script lang="ts">
  import { chart } from 'svelte-apexcharts';
  import { onMount } from 'svelte';

  import { currencies } from '../../../data/currency';

  import { PP_MINI_CHART_COLOR } from 'src/constants/styles';

  export let data: any[] = [];
  export let currency: string = null;

  $: symbol = currencies.find((c) => c.value === currency)?.label;
  const style = getComputedStyle(document.body);
  const ppMiniChartColor = style.getPropertyValue(PP_MINI_CHART_COLOR);
  let width = '0';
  // https://apexcharts.com/docs/options/
  $: balance_apex = {
    series: [
      {
        name: symbol,
        data,
      },
    ],
    chart: {
      type: 'area',
      width,
      height: 40,
      sparkline: {
        enabled: true,
      },
    },
    stroke: {
      curve: 'smooth',
      width: 2,
    },
    colors: [ppMiniChartColor],
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        inverseColors: true,
        opacityFrom: 0.45,
        opacityTo: 0.05,
        stops: [25, 100, 100, 100],
      },
    },
    tooltip: {
      custom: function ({ series, seriesIndex, dataPointIndex, w }) {
        const value = series[seriesIndex][dataPointIndex];
        // TODO: в дальнейшем необходимо передавать актуальную локаль
        const data = `${symbol} ${value.toLocaleString()}`;
        return `
          <div
            class="apexcharts-tooltip-series-group apexcharts-active"
            style="order: 1; display: flex;"
          >
            <span
              class="apexcharts-tooltip-marker"
              style="background-color: rgb(117, 134, 199); display: none;"
            ></span>
            <div
              class="apexcharts-tooltip-text"
              style="font-family: Helvetica, Arial, sans-serif; font-size: 12px;"
            >
              <div class="apexcharts-tooltip-y-group">
                <span class="apexcharts-tooltip-text-y-value">${data}</span>
              </div>
              <div class="apexcharts-tooltip-goals-group">
                <span class="apexcharts-tooltip-text-goals-label"></span>
                <span class="apexcharts-tooltip-text-goals-value"></span>
              </div>
              <div class="apexcharts-tooltip-z-group">
                <span class="apexcharts-tooltip-text-z-label"></span>
                <span class="apexcharts-tooltip-text-z-value"></span>
              </div>
            </div>
          </div>
        `;
      },
      fixed: {
        enabled: false,
      },
      x: {
        show: false,
      },
      marker: {
        show: false,
      },
    },
  };

  onMount(() => {
    setTimeout(() => {
      width = '100%';
    }, 100);
  });
</script>

<div class="apex-charts {$$props.class}">
  <div use:chart="{balance_apex}"></div>
</div>
