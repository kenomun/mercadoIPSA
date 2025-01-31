<template>
  <div class="tab-container">
    <button
      v-for="index in indices"
      :key="index.code"
      @click="selectTab(index)"
      :class="{ active: selectedIndex === index.code }"
    >
      {{ index.name }}
    </button>
  </div>
</template>

<script setup>
import { defineProps, defineEmits, ref, watch } from "vue";

const props = defineProps({
  indices: Array,
  selectedTab: String,
});

const emit = defineEmits(["tab-selected"]);

const selectedIndex = ref(props.selectedTab || props.indices[0]?.code);

watch(
  () => props.selectedTab,
  (newValue) => {
    selectedIndex.value = newValue;
  }
);

const selectTab = (index) => {
  if (!index.hasData) {
    alert(`⚠️ No hay información disponible para ${index.name}`);
    return;
  }
  selectedIndex.value = index.code;
  emit("tab-selected", index.code);
};
</script>

<style scoped>
button {
  padding: 10px 20px;
  border: none;
  background-color: transparent;
  color: white;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  margin-left: 2rem;
}
</style>
