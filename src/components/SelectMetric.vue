<script setup>
import { ref, onMounted } from "vue";

import {
  getCategory,
  getCategoryDetail,
  getMetrics,
  getMetricDetail,
} from "../api/metricsApi";

// onMounted(() => {
//   showCategories();
// });

const categories = ref([{ id: 0, name: "All" }]);
const category = ref();
const categoryShown = ref(false);

const metrics = ref([]);
const metric = ref();
const metricShown = ref(false);

const showCategories = async () => {
  categories.value = await getCategory();
  // const newCategories = await getCategory();
  // categories.value.push(...newCategories);
  categoryShown.value = true;
};
const selectCategory = async (chosenCategory) => {
  categoryShown.value = false;
  category.value = await getCategoryDetail(chosenCategory.id);
};

const showMetrics = async () => {
  console.log(category.value.id);
  metrics.value = await getMetrics(category.value.id);
  metricShown.value = true;
};
const selectMetric = async (chosenMetric) => {
  metricShown.value = false;
  metric.value = await getMetricDetail(chosenMetric.id);
};
</script>

<template>
  <div class="flex justify-around">
    <div>
      <!-- <label for="category-select">Choose a category:</label>
      <select id="category-select" v-model="category">
        <option value="">--Please choose an option--</option>
        <option
          v-for="category of categories"
          :key="category.id"
          @click="selectCategory(category)"
        >
          {{ category.name }}
        </option>
      </select> -->
      <button
        id="dropdownCategoryButton"
        @click="showCategories"
        class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        type="button"
      >
        Select Category
        <svg
          class="w-2.5 h-2.5 ml-2.5"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 10 6"
        >
          <path
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="m1 1 4 4 4-4"
          />
        </svg>
      </button>
      <div
        v-if="categoryShown"
        id="dropdownCategory"
        class="z-10 bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700"
      >
        <a
          v-for="category in categories"
          :key="category.id"
          href="#"
          @click="selectCategory(category)"
          class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
          >{{ category.name }}
        </a>
      </div>
    </div>

    <div v-if="category">
      <button
        id="dropdownMetricButton"
        @click="showMetrics"
        class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        type="button"
      >
        Select Metric
        <svg
          class="w-2.5 h-2.5 ml-2.5"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 10 6"
        >
          <path
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="m1 1 4 4 4-4"
          />
        </svg>
      </button>
      <div
        v-if="metricShown"
        id="dropdownMetric"
        class="z-10 bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700"
      >
        <a
          v-for="metric in metrics"
          :key="metric.id"
          href="#"
          @click="selectMetric(metric)"
          class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
          >{{ metric.name }}
        </a>
      </div>
    </div>
  </div>
  <div v-if="category" class="m-4">
    <div>Category: {{ category.name }}</div>
    <div>Description: {{ category.description }}</div>
  </div>
  <div v-if="metric" class="m-4">
    <div>Metric: {{ metric.name }}</div>
    <div>Description: {{ metric.description }}</div>
  </div>
</template>
