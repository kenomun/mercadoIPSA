<template>
  <div class="search-bar position-relative">
    <div class="input-container">
      <i class="fas fa-search search-icon"></i>
      <input
        type="text"
        v-model="searchQuery"
        class="form-control text-white"
        placeholder="Busca un instrumento"
        @input="onSearch"
      />
    </div>
    <ul
      v-if="filteredItems.length > 0"
      class="list-group position-absolute w-100"
    >
      <li
        v-for="(item, index) in filteredItems"
        :key="index"
        class="list-group-item list-group-item-action"
        @click="selectItem(item)"
      >
        {{ itemLabel(item) }}
      </li>
    </ul>
    <p
      v-if="filteredItems.length === 0 && searchQuery.length > 0"
      class="text-center bg-dark text-white p-2"
    >
      No se encontraron resultados
    </p>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";

const emit = defineEmits(["item-selected"]);

const props = defineProps({
  items: {
    type: Array,
    required: true,
  },
  itemLabel: {
    type: Function,
    required: true,
  },
  itemKey: {
    type: String,
    required: true,
  },
});

const searchQuery = ref("");

const filteredItems = computed(() => {
  if (!searchQuery.value) return [];
  const filtered = props.items.filter((item) => {
    const itemValue = item[props.itemKey]?.toLowerCase() || "";
    return itemValue.includes(searchQuery.value.toLowerCase());
  });
  return filtered;
});

const selectItem = (item) => {
  emit("item-selected", item);
  searchQuery.value = "";
};
</script>

<style scoped></style>
