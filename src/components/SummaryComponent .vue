<template>
  <div v-if="instrumentData" class="instrument-container">
    <!-- Botones de navegación -->
    <div class="btn-container">
      <button
        class="btn"
        :class="{ active: vista === 'resumen' }"
        @click="mostrarResumen"
      >
        RESUMEN
      </button>
      <button
        class="btn"
        :class="{ active: vista === 'detalle' }"
        @click="mostrarDetalle"
      >
        DETALLE
      </button>
    </div>

    <!-- Vista de detalle -->
    <div v-if="vista === 'detalle'" class="content-box">
      <div class="quote-info">
        <p>
          <strong>Cotización:</strong>
          <span>{{ instrumentData.datetimeLastPrice }}</span>
        </p>
      </div>
      <hr />
      <div class="market-info">
        <p>
          <strong>MERCADO:</strong> <span>{{ instrumentData.marketName }}</span>
        </p>
        <p>
          <strong>APERTURA:</strong> <span>{{ instrumentData.openPrice }}</span>
        </p>
        <p>
          <strong>CIERRE ANTERIOR:</strong>
          <span>{{ instrumentData.closePrice }}</span>
        </p>
        <p>
          <strong>MAXIMO DIARIO:</strong>
          <span>{{ instrumentData.maxDay }}</span>
        </p>
        <p>
          <strong>MINIMO DIARIO:</strong>
          <span>{{ instrumentData.minDay }}</span>
        </p>
        <p>
          <strong>MAXIMO 52 SEMANAS:</strong>
          <span>{{ instrumentData.max52W }}</span>
        </p>
        <p>
          <strong>MINIMO 52 SEMANAS:</strong>
          <span>{{ instrumentData.min52W }}</span>
        </p>
        <p>
          <strong>Variación:</strong>
          <span>{{ instrumentData.performanceRelative }} %</span>
        </p>
      </div>
      <hr />
      <div class="variation-info">
        <p>
          <strong>1 MES:</strong> <span>{{ instrumentData.pct30D }}%</span>
        </p>
        <p>
          <strong>1 AÑO:</strong> <span>{{ instrumentData.pctRelW52 }}%</span>
        </p>
        <p>
          <strong>AÑO A LA FECHA:</strong>
          <span>{{ instrumentData.pctRelCY }}%</span>
        </p>
      </div>
    </div>

    <div v-if="vista === 'resumen'" class="content-box">
      <p>Resumen del instrumento seleccionado.</p>
    </div>
  </div>
  <p v-else>Selecciona un instrumento para ver el resumen.</p>
</template>

<script setup>
import { defineProps, ref, onMounted } from "vue";

const props = defineProps({
  instrumentData: {
    type: Object,
    required: true,
  },
});

const vista = ref("detalle");

onMounted(() => {
  console.log("Instrument Data:", props.instrumentData);
  if (!props.instrumentData) {
    console.log("instrumentData está vacío");
  } else {
    console.log("instrumentData contiene datos");
  }
});

const mostrarResumen = () => (vista.value = "resumen");
const mostrarDetalle = () => (vista.value = "detalle");
</script>

<style scoped>
* {
  color: white;
}
.btn {
  padding: 5px 50px;
  background: none;
  border: none;
  cursor: pointer;
  position: relative;
}

button.active::after {
  content: "";
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 100%;
  height: 3px;
  background-color: #007bff;
  border-radius: 2px;
}
</style>
