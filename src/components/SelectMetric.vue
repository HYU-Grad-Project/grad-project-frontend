<script setup>
import { ref, onMounted } from "vue";

import {
  getCategory,
  getCategoryDetail,
  getMetrics,
  getMetricDetail,
  getMonitorValues,
} from "../api/metricsApi";

const categories = ref([{ id: 0, name: "All" }]);
const category = ref();
const categoryShown = ref(false);

const metrics = ref([]);
const metric = ref();
const metricShown = ref(false);

const monitorValues = ref([]);

const showCategories = async () => {
  categories.value = await getCategory();
  categoryShown.value = !categoryShown.value;
  metricShown.value = false;
};
const selectCategory = async (chosenCategory) => {
  categoryShown.value = false;
  category.value = await getCategoryDetail(chosenCategory.id);

  metric.value = "";
  monitorValues.value = [];
};

const showMetrics = async () => {
  console.log(category.value.id);
  metrics.value = await getMetrics(category.value.id);
  metricShown.value = !metricShown.value;
  categoryShown.value = false;
};
const selectMetric = async (chosenMetric) => {
  metricShown.value = false;
  metric.value = await getMetricDetail(chosenMetric.id);
  monitorValues.value = await getMonitorValues(chosenMetric.id);
};
</script>

<template>
  <div class="h-full">
    <div class="flex justify-center">
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
          class="mr-2 mb-2 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
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
          class="absolute z-10 bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700"
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

      <div>
        <button
          id="dropdownMetricButton"
          @click="showMetrics"
          class="mr-2 mb-2 text-white bg-indigo-700 hover:bg-indigo-800 focus:ring-4 focus:outline-none focus:ring-indigo-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-indigo-600 dark:hover:bg-indigo-700 dark:focus:ring-indigo-800"
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
          class="absolute z-10 bg-white divide-y divide-gray-100 rounded-lg shadow dark:bg-gray-700"
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

    <div>
      <div class="border-solid border-2 border-sky-500 rounded-lg p-4 m-4">
        <div>
          <span class="font-bold">Category : </span>
          <span v-if="category">{{ category.name }}</span>
        </div>
        <div>
          <span class="font-bold">Description : </span>
          <span v-if="category">{{ category.description }}</span>
        </div>
      </div>
      <div class="border-solid border-2 border-green-500 rounded-lg p-4 m-4">
        <div>
          <span class="font-bold">Metric : </span>
          <span v-if="metric">{{ metric.name }}</span>
        </div>
        <div>
          <span class="font-bold">Description : </span>
          <span v-if="metric">{{ metric.description }}</span>
        </div>
      </div>
      <div
        v-if="monitorValues"
        v-for="monitorValue in monitorValues"
        :key="monitorValue.id"
      >
        <div class="border-solid border-2 border-pink-500 rounded-lg p-4 m-4">
          <div>
            <span class="font-bold">Pod name : </span>
            <span v-if="monitorValue">{{ monitorValue.pod_name }}</span>
          </div>
          <div>
            <span class="font-bold">Value : </span>
            <span v-if="monitorValue">{{ monitorValue.value }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
