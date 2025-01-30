<template>
  <div ref="chartDiv" style="width: 60%; height: 300px">
    <div class="chart-container"></div>
  </div>
  <div class="container mt-3 text-start">
    <button class="btn btn-primary rounded-start" @click="setTimePeriod(1)">
      1M
    </button>
    <button class="btn btn-primary" @click="setTimePeriod(3)">3M</button>
    <button class="btn btn-primary" @click="setTimePeriod(6)">6M</button>
    <button class="btn btn-primary rounded-end" @click="setTimePeriod(12)">
      1A
    </button>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from "vue";
import { useAppStore } from "../store/stockStore";
import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";

const appStore = useAppStore();
const chartDiv = ref(null);
const chartData = computed(() => appStore.getChartData);
const selectedPeriod = ref(1);
let filteredData = ref(chartData.value);

onMounted(() => {
  createChart();
});

let chartInstance = null;
let series = null;

const createChart = () => {
  if (!chartDiv.value) {
    console.error("chartDiv es null");
    return;
  }

  const chartContainer = chartDiv.value;
  while (chartContainer.firstChild) {
    chartContainer.removeChild(chartContainer.firstChild);
  }

  const root = am5.Root.new(chartContainer);
  root.setThemes([am5themes_Animated.new(root)]);

  chartInstance = root.container.children.push(
    am5xy.XYChart.new(root, {
      panX: true,
      panY: true,
      wheelX: "pan",
      wheelY: "zoom",
    })
  );

  // Crear el eje X (Fecha)
  const xAxis = chartInstance.xAxes.push(
    am5xy.DateAxis.new(root, {
      baseInterval: { timeUnit: "day", count: 1 },
      renderer: am5xy.AxisRendererX.new(root, {
        minGridDistance: 50,
      }),
      dateFields: ["datetimeLastPriceTs"],
      tooltip: am5.Tooltip.new(root, { labelText: "{valueX}" }),
    })
  );

  // Quitar todas las líneas verticales del eje X
  xAxis.get("renderer").grid.template.setAll({
    strokeOpacity: 0,
  });

  // Crear el eje Y (Valor de la acción)
  const yAxis = chartInstance.yAxes.push(
    am5xy.ValueAxis.new(root, {
      renderer: am5xy.AxisRendererY.new(root, {
        minGridDistance: 40,
      }),
    })
  );

  // 🔥 FORZAR la línea vertical en el eje Y (para que se vea la "L")
  yAxis.get("renderer").grid.template.setAll({
    stroke: am5.color(0xffffff), // Blanco para que se vea
    strokeOpacity: 0.2, // Opacidad máxima
    visible: true, // Asegurar que aparezca
    location: 0, // Colocar al inicio
    strokeWidth: 1, // Grosor más grande
  });

  // 🔥 HACER QUE LOS NÚMEROS SEAN BLANCOS
  yAxis.get("renderer").labels.template.setAll({
    strokeOpacity: 1,
    fontSize: 16,
    fill: am5.color(0xffffff), // Blanco para que resalten
    visible: true, // Que siempre se vean
  });

  // Crear la serie de precios
  series = chartInstance.series.push(
    am5xy.LineSeries.new(root, {
      name: "Precio de la acción",
      xAxis: xAxis,
      yAxis: yAxis,
      valueYField: "lastPrice",
      valueXField: "datetimeLastPriceTs",
      tooltip: am5.Tooltip.new(root, {
        labelText: "{valueX}: {valueY}",
      }),
    })
  );

  series.fills.template.setAll({
    visible: true,
    fillOpacity: 0.5, // Opacidad del relleno (ajústalo a gusto)
    fill: am5.color("#00BFFF"), // Color celeste
  });

  series.fills.template.set(
    "fillGradient",
    am5.LinearGradient.new(root, {
      stops: [
        { color: am5.color("#00BFFF"), opacity: 0.5 }, // Color celeste fuerte arriba
        { color: am5.color("#00BFFF"), opacity: 0 }, // Transparente abajo
      ],
      rotation: 90, // Orientación del gradiente
    })
  );

  // Agregar los datos a la serie
  series.data.setAll(
    filteredData.value.map((item) => ({
      datetimeLastPriceTs: item.datetimeLastPriceTs * 1000,
      lastPrice: item.lastPrice,
    }))
  );
};

// Función para actualizar el período de tiempo
function setTimePeriod(period) {
  selectedPeriod.value = period;
  updateCutoffDate(period);
}

// Función para actualizar la fecha de corte
function updateCutoffDate(period) {
  const currentDate = new Date("2024-11-06");
  currentDate.setMonth(currentDate.getMonth() - period);
  const cutoffDate = currentDate.toISOString();
  filterData(cutoffDate);
}

function filterData(cutoffDate) {
  const filtered = chartData.value.filter(
    (item) => new Date(item.datetimeLastPriceTs * 1000) >= new Date(cutoffDate)
  );
  updateChart(filtered);
}

// Función para actualizar el gráfico con los nuevos datos filtrados
function updateChart(filteredData) {
  if (series) {
    series.data.setAll(
      filteredData.map((item) => ({
        datetimeLastPriceTs: item.datetimeLastPriceTs * 1000,
        lastPrice: item.lastPrice,
      }))
    );
  }
}

// Escuchar cambios en los datos de la store y actualizar el gráfico
watch(
  () => appStore.getChartData,
  (newData) => {
    filteredData.value = newData;
    if (chartInstance && series) {
      series.data.setAll(
        filteredData.value.map((item) => ({
          datetimeLastPriceTs: item.datetimeLastPriceTs * 1000,
          lastPrice: item.lastPrice,
        }))
      );
    }
  },
  { immediate: true }
);
</script>

<style scoped>
.btn-primary {
  border-radius: 0;
  margin: 0;
  padding: 8px 16px;
  background-color: transparent;
  border-color: aliceblue;
}
</style>
