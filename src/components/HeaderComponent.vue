<template>
  <div class="header-container text-white p-3">
    <div class="header-title mb-3">
      <h2>{{ name }}, {{ country }}</h2>
      <span>Índice</span>
    </div>
    <div class="separator mb-3"></div>
    <div class="header-values d-flex gap-3">
      <span class="price sort-arrow"
        >Valor Actual &#x2191;<strong>{{
          lastPrice.toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })
        }}</strong>
      </span>
      <span :class="['variation', pctDay < 0 ? 'text-danger' : 'text-success']">
        Var.% Actual {{ pctDay.toFixed(2) }}%
      </span>
      <span :class="['points', pointsVar < 0 ? 'text-danger' : 'text-success']">
        Var. Puntos Actual {{ pointsVar.toFixed(2) }}
      </span>
    </div>
    <div class="separator mb-3"></div>
  </div>
</template>

<script setup>
import { defineProps } from "vue";

defineProps({
  name: String,
  country: String,
  lastPrice: Number,
  pctDay: Number,
  pointsVar: Number,
});
</script>

<style scoped></style>
