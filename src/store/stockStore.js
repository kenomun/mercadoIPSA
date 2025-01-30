// store.js
import { defineStore } from "pinia";

export const useAppStore = defineStore("app", {
  state: () => ({
    // Estado global para los datos generales
    generalData: {
      name: "IPSA",
      shortName: "IPSA",
      countryName: "Chile",
      codeInstrument: "IPSA",
    },
    // Estado global para el instrumento seleccionado
    selectedInstrument: null,
    chartData: [],
    selectedInstrumentData: {},
    instrumentList: [],
    instrumentItems: [],
  }),
  actions: {
    setInstrumentList(data) {
      this.instrumentList = data;
    },
    setInstrumentItems(data) {
      this.instrumentItems = data;
    },
    setSelectedInstrument(instrument) {
      this.selectedInstrument = instrument;
    },

    setGeneralData(data) {
      this.generalData = data;
    },

    setChartData(data) {
      this.chartData = data;
    },

    setSelectedInstrumentData(data) {
      this.selectedInstrumentData = data;
    },
  },
  getters: {
    getInstrumentList: (state) => state.instrumentList,
    getInstrumentItems: (state) => state.instrumentItems,
    getSelectedInstrument: (state) => state.selectedInstrument,
    getGeneralData: (state) => state.generalData,
    getChartData: (state) => state.chartData,
    getSelectedInstrumentData: (state) => state.selectedInstrumentData,
  },
  persist: true,
});
