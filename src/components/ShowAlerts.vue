<script setup>
import { ref } from "vue";
import { getAlerts } from "../api/alertsApi";

const alerts = ref([]);
const resolvedAlerts = ref([]);
const expanded = ref({});

const showAlerts = async () => {
  alerts.value = await getAlerts(0);
  alerts.value.forEach((alert) => {
    expanded.value[alert.id] = false;
  });
};
const showResolvedAlerts = async () => {
  resolvedAlerts.value = await getAlerts(1);
};
const toggleAlertDetails = (alertId) => {
  expanded.value[alertId] = !expanded.value[alertId];
};
</script>

<template>
  <div class="h-full">
    <div class="flex justify-center">
      <button
        type="button"
        class="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800"
        @click="showAlerts"
      >
        Get Unresolved Alerts
      </button>
      <button
        type="button"
        class="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
        @click="showResolvedAlerts"
      >
        Get Resolved Alerts
      </button>
    </div>
    <div class="rounded-lg bg-purple-100 p-4 m-4 h-1/2">
      <div class="font-bold text-purple-800">Unresolved Alerts</div>
      <div class="overflow-auto h-5/6 m-4">
        <div v-if="alerts" v-for="alert in alerts" :key="alert.id">
          <div
            class="border-solid border-2 border-pink-300 bg-pink-50 rounded-lg p-4 m-4"
          >
            <div class="cursor-pointer" @click="toggleAlertDetails(alert.id)">
              <span v-if="!expanded[alert.id]">▷ </span>
              <span v-else>▽ </span>
              <strong>Rule Name: {{ alert.rule_name }} </strong> ({{
                alert.id
              }})
            </div>
            <div v-if="expanded[alert.id]">
              <div><strong>Pod Name:</strong> {{ alert.pod_name }}</div>
              <div><strong>Status:</strong> {{ alert.status }}</div>
              <div><strong>Created At:</strong> {{ alert.created_at }}</div>
              <div><strong>Resolved:</strong> {{ alert.resolved }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="rounded-lg bg-blue-100 p-4 m-4 h-1/2">
      <div class="font-bold text-blue-800">Resolved Alerts</div>
      <div class="overflow-auto h-5/6 m-4">
        <div
          v-if="resolvedAlerts"
          v-for="alert in resolvedAlerts"
          :key="alert.id"
        >
          <div
            class="border-solid border-2 border-green-300 bg-green-50 rounded-lg p-4 m-4"
          >
            <div class="cursor-pointer" @click="toggleAlertDetails(alert.id)">
              <span v-if="!expanded[alert.id]">▷ </span>
              <span v-else>▽ </span>
              <strong>Rule Name: {{ alert.rule_name }} </strong> ({{
                alert.id
              }})
            </div>
            <div v-if="expanded[alert.id]">
              <div><strong>Pod Name:</strong> {{ alert.pod_name }}</div>
              <div><strong>Status:</strong> {{ alert.status }}</div>
              <div><strong>Created At:</strong> {{ alert.created_at }}</div>
              <div><strong>Resolved:</strong> {{ alert.resolved }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
