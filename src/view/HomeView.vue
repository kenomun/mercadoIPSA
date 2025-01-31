<template>
  <div>
    <div class="mb-4">
      <SearchBarComponent
        :items="instruments"
        :itemLabel="getInstrumentLabel"
        itemKey="name"
        @item-selected="handleInstrumentSelected"
      />
    </div>

    <div class="row">
      <div class="col-md-8">
        <HeaderComponent
          v-if="selectedInstrument"
          :name="selectedInstrument.name"
          :country="country"
          :lastPrice="selectedInstrument.lastPrice"
          :pctDay="selectedInstrument.pctDay"
          :pointsVar="selectedInstrument.performanceAbsolute"
        />
      </div>
      <div class="col-md-3 mt-5">
        <SummaryComponent :instrumentData="selectedInstrumentData" />
      </div>
      <div class="col-md-1"></div>
    </div>

    <div class="mb-4">
      <ChartComponent v-if="chartData.length > 0" :chartData="chartData" />
    </div>

    <div class="mb-4">
      <TabComponent
        :indices="indices"
        :selectedTab="selectedIndex"
        @tab-selected="handleTabSelection"
      />
    </div>

    <div class="row">
      <div class="col-6">
        <InstrumentListComponent :instruments="instrumentList" />
      </div>
      <div class="col-6">
        <InstrumentItemComponent :instruments="instrumentItems" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useAppStore } from "../store/stockStore";
import SearchBarComponent from "../components/SearchBarComponent.vue";
import HeaderComponent from "../components/HeaderComponent.vue";
import ChartComponent from "../components/ChartComponent.vue";
import TabComponent from "../components/TabComponent.vue";
import SummaryComponent from "../components/SummaryComponent .vue";
import InstrumentListComponent from "../components/InstrumentListComponent.vue";
import InstrumentItemComponent from "../components/InstrumentItemComponent.vue";

import axios from "axios";

const appStore = useAppStore();

// Lista de instrumentos disponibles
const instruments = ref([]);
const country = ref("");

// Lista de índices
const indices = ref([
  { name: "IPSA", code: "IPSA", hasData: true },
  { name: "IGPA", code: "IGPA", hasData: false },
  { name: "NASDAQ", code: "NASDAQ", hasData: false },
  { name: "DOW JONES", code: "DOWJONES", hasData: false },
  { name: "SP/BVL", code: "SPBVL", hasData: false },
]);

const selectedIndex = ref("IPSA");

// Acceder al instrumento seleccionado desde la store
const selectedInstrument = computed(() => appStore.getSelectedInstrument);
const chartData = computed(() => appStore.getChartData);
const selectedInstrumentData = computed(
  () => appStore.getSelectedInstrumentData
);
const instrumentList = computed(() => appStore.getInstrumentList);
const instrumentItems = computed(() => appStore.getInstrumentItems);

onMounted(async () => {
  loadInstruments();
  if (appStore.selectedInstrument && appStore.chartData.length > 0) {
    return;
  }
  loadInstrumentsItemsList();
  loadInicial();
});

const loadInicial = async () => {
  try {
    const response = await axios.get("history/history-IPSA.json");
    const info = response.data.data.info;
    const chartData = response.data.data.chart.find(
      (item) => item.datetimeLastPrice === "06-11-2024 14:33:47"
    );
    if (chartData) {
      const instrumentInicial = {
        ...info,
        lastPrice: chartData.lastPrice,
        performanceAbsolute: chartData.performanceAbsolute,
        performanceRelative: chartData.performanceRelative,
        tend: chartData.tend,
        datetimeLastPrice: chartData.datetimeLastPrice,
        volumeMoney: chartData.volumeMoney,
        pctDay: -0.3517,
      };
      handleInstrumentSelected(instrumentInicial);
    }
  } catch (error) {
    console.error("Error cargando el instrumento IPSA:", error);
  }
};

// Cargar los instrumentos desde el JSON
const loadInstruments = async () => {
  try {
    const response = await axios.get("/constituyentes/constituensList.json");
    if (response.data.code === 200) {
      instruments.value = response.data.data.constituents;
      country.value = response.data.data.info.countryName;
    }
  } catch (error) {
    console.error("Error fetching instruments", error);
  }
};

// Cargar los instrumentos desde el JSON
const loadInstrumentsItemsList = async () => {
  try {
    const response = await axios.get("/constituyentes/constituensList.json");
    if (response.data.code === 200) {
      appStore.setInstrumentList(response.data.data.constituents);
      appStore.setInstrumentItems(response.data.data.constituents);
    }
  } catch (error) {
    console.error("Error fetching instruments", error);
  }
};

const loadInstrumentSummary = async (instrument) => {
  const codeInstrument = instrument.codeInstrument;
  try {
    const response = await axios.get(`/resumen/${codeInstrument}.json`);

    if (response.data.code === 200) {
      const info = response.data.data.info;
      const price = response.data.data.price;

      // Asignar el objeto directamente a selectedInstrumentdata
      const instrumentSummaryData = {
        datetimeLastPrice: price.datetimeLastPrice,
        marketName: info.marketName,
        openPrice: price.openPrice,
        closePrice: price.closePrice,
        maxDay: price.maxDay,
        minDay: price.minDay,
        max52W: price.max52W,
        min52W: price.min52W,
        performanceRelative: price.performanceRelative,
        pct30D: price.pct30D,
        pctRelW52: price.pctRelW52,
        pctRelCY: price.pctRelCY,
      };
      console.log("Datos cargados del instrumento:", instrumentSummaryData);
      appStore.setSelectedInstrumentData(instrumentSummaryData);
    }
  } catch (error) {
    console.error("Error fetching instruments", error);
  }
};

// Función para mostrar el nombre de un instrumento en el buscador
const getInstrumentLabel = (instrument) => {
  return `${instrument.name} (${instrument.codeInstrument})`;
};

// Manejo de la selección de instrumento
const handleInstrumentSelected = async (instrument) => {
  loadInstrumentSummary(instrument);

  const codeInstrument = instrument.codeInstrument;
  try {
    const response = await axios.get(`/history/history-${codeInstrument}.json`);

    if (response.status === 200) {
      const chartData = response.data.data.chart.map((item) => ({
        datetimeLastPrice: item.datetimeLastPrice,
        lastPrice: item.lastPrice,
        datetimeLastPriceTs: item.datetimeLastPriceTs,
      }));

      appStore.setSelectedInstrument(instrument);
      appStore.setChartData(chartData);
    } else {
      console.error("Datos inválidos o no encontrados en el archivo.");
    }
  } catch (error) {
    console.error("Error al cargar los datos del gráfico:", error);
  }
};

// Manejar selección de tab
const handleTabSelection = (code) => {
  selectedIndex.value = code;
};
</script>
