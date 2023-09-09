<script setup>
import { ref } from "vue";
</script>

<template>
  <div>
    <div class="flex justify-center">
      <button
        type="button"
        class="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
      >
        Get Alerts
      </button>
    </div>
    <div class="flex justify-center">
      <ul>
        <li>Alert 1</li>
        <li>Alert 2</li>
        <li>Alert 3</li>
      </ul>
    </div>
  </div>
</template>
