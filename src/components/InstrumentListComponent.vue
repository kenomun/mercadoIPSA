<template>
  <div>
    <table>
      <thead>
        <tr>
          <th>
            <button @click="sortTable('name')">
              Nombre
              <span class="sort-arrow">&#x2191;</span
              ><span class="sort-arrow">&#x2193;</span>
            </button>
          </th>
          <th>
            <button @click="sortTable('lastPrice')">
              Último*
              <span class="sort-arrow">&#x2191;</span
              ><span class="sort-arrow">&#x2193;</span>
            </button>
          </th>
          <th>
            <button @click="sortTable('performanceRelative')">
              Monto (MM)
              <span class="sort-arrow">&#x2191;</span
              ><span class="sort-arrow">&#x2193;</span>
            </button>
          </th>
          <th>
            <button @click="sortTable('pctDay')">
              Var día
              <span class="sort-arrow">&#x2191;</span
              ><span class="sort-arrow">&#x2193;</span>
            </button>
          </th>
          <th>
            <button @click="sortTable('pct30D')">
              Var 30d
              <span class="sort-arrow">&#x2191;</span
              ><span class="sort-arrow">&#x2193;</span>
            </button>
          </th>
          <th>
            <button @click="sortTable('pctCY')">
              Año Actual
              <span class="sort-arrow">&#x2191;</span
              ><span class="sort-arrow">&#x2193;</span>
            </button>
          </th>
          <th>
            <button @click="sortTable('pct1Y')">
              12 meses
              <span class="sort-arrow">&#x2191;</span
              ><span class="sort-arrow">&#x2193;</span>
            </button>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(instrument, index) in sortedInstruments" :key="index">
          <td>{{ instrument.shortName }}</td>
          <td>{{ instrument.lastPrice }}</td>
          <td>{{ instrument.performanceRelative }}</td>
          <td :class="getPercentageClass(instrument.pctDay)">
            {{ formatPercentage(instrument.pctDay) }}
          </td>
          <td :class="getPercentageClass(instrument.pct30D)">
            {{ formatPercentage(instrument.pct30D) }}
          </td>
          <td :class="getPercentageClass(instrument.pctCY)">
            {{ formatPercentage(instrument.pctCY) }}
          </td>
          <td :class="getPercentageClass(instrument.pct1Y)">
            {{ formatPercentage(instrument.pct1Y) }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  props: {
    instruments: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      sortField: "name",
      sortDirection: "asc",
    };
  },
  computed: {
    sortedInstruments() {
      return this.instruments.sort((a, b) => {
        let comparison = 0;
        if (a[this.sortField] < b[this.sortField]) {
          comparison = -1;
        } else if (a[this.sortField] > b[this.sortField]) {
          comparison = 1;
        }

        return this.sortDirection === "asc" ? comparison : -comparison;
      });
    },
  },
  methods: {
    sortTable(field) {
      if (this.sortField === field) {
        this.sortDirection = this.sortDirection === "asc" ? "desc" : "asc";
      } else {
        this.sortField = field;
        this.sortDirection = "asc";
      }
    },

    formatPercentage(value) {
      if (typeof value !== "number" || isNaN(value)) {
        return "N/A";
      }
      return value >= 0 ? `+${value.toFixed(2)}%` : `${value.toFixed(2)}%`;
    },
    getPercentageClass(value) {
      return value >= 0 ? "positive" : "negative";
    },
  },
};
</script>

<style scoped>
* {
  color: white;
  margin-right: 5px;
}
.positive {
  color: rgb(99, 237, 99);
}

.negative {
  color: rgb(248, 95, 95);
}
</style>
