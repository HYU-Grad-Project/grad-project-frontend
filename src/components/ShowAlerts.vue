<script setup>
import { ref } from "vue";
import { getAlertAdvice, getAlerts, resolveAlert } from "../api/alertsApi";
import { getRules } from "../api/rulesApi";

const unresolvedAlerts = ref([]);
const resolvedAlerts = ref([]);
const expanded = ref({});
const selectedRule_resolved = ref("0");
const selectedRule_unresolved = ref("0");

const rules = ref([]);

const showUnresolvedAlerts = async (ruleId) => {
  unresolvedAlerts.value = await getAlerts(0, ruleId);
};
const showResolvedAlerts = async (ruleId) => {
  resolvedAlerts.value = await getAlerts(1, ruleId);
};
const toggleAlertDetails = (alertId) => {
  expanded.value[alertId] = !expanded.value[alertId];
};
const getAdviceAndResolveAlert = async (alertId) => {
  const alertAdvice = await getAlertAdvice(alertId);
  const userInput = prompt(
    `Enter value for ${alertAdvice.relevant_key_name}.\n(Current Value: ${alertAdvice.current_value}, Recommended Value: ${alertAdvice.recommended_value})`
  );
  if (isNaN(userInput)) {
    alert("Enter a number.");
    return;
  }

  resolveAlert(alertId, Number(userInput));
};

const retrieveRules = async () => {
  rules.value = await getRules();
};
</script>

<template>
  <div class="h-full">
    <div class="flex justify-center">
      <!-- <button
        type="button"
        class="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800"
        @click="showUnresolvedAlerts(selectedRule_unresolved)"
      >
        Get Unresolved Alerts
      </button>
      <button
        type="button"
        class="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
        @click="showResolvedAlerts(selectedRule_resolved)"
      >
        Get Resolved Alerts
      </button> -->

      <button
        type="button"
        class="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800"
        @click="
          () => {
            showUnresolvedAlerts(selectedRule_unresolved);
            showResolvedAlerts(selectedRule_resolved);
          }
        "
      >
        Refresh Alerts
      </button>
    </div>
    <div class="rounded-lg bg-purple-100 p-4 m-4 h-1/2">
      <div class="flex justify-between">
        <span class="font-bold text-purple-800">
          Unresolved Alerts ({{ unresolvedAlerts.length }})
        </span>
        <select
          @click="retrieveRules"
          @change="showUnresolvedAlerts(selectedRule_unresolved)"
          v-model="selectedRule_unresolved"
          class="p-1 w-48"
        >
          <option value="0">All</option>
          <option v-for="rule in rules" :key="rule.id" :value="rule.id">
            {{ rule.name }}
          </option>
        </select>
      </div>

      <div class="overflow-auto h-5/6 m-4">
        <div
          v-if="unresolvedAlerts"
          v-for="alert in unresolvedAlerts"
          :key="alert.id"
        >
          <div
            class="border-solid border-2 border-pink-300 bg-pink-50 rounded-lg p-4 m-4"
          >
            <div class="cursor-pointer" @click="toggleAlertDetails(alert.id)">
              <span v-if="!expanded[alert.id]">▷ </span>
              <span v-else>▽ </span>
              <strong>Rule Name: {{ alert.rule_name }} </strong> (count:
              {{ alert.count }})
            </div>
            <div v-if="expanded[alert.id]">
              <div>------------------------------------------</div>
              <div><strong>Fingerprint:</strong> {{ alert.fingerprint }}</div>
              <div><strong>Pod Name:</strong> {{ alert.pod_name }}</div>
              <div><strong>Created At:</strong> {{ alert.created_at }}</div>
              <div class="text-center">
                <button
                  type="button"
                  class="mt-4 text-yellow-400 hover:text-white border border-yellow-400 hover:bg-yellow-500 focus:ring-4 focus:outline-none focus:ring-yellow-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:border-yellow-300 dark:text-yellow-300 dark:hover:text-white dark:hover:bg-yellow-400 dark:focus:ring-yellow-900"
                  @click="getAdviceAndResolveAlert(alert.id)"
                >
                  Resolve
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="rounded-lg bg-blue-100 p-4 m-4 h-1/2">
      <div class="flex justify-between">
        <span class="font-bold text-blue-800">
          Resolved Alerts ({{ resolvedAlerts.length }})
        </span>
        <select
          @click="retrieveRules"
          @change="showResolvedAlerts(selectedRule_resolved)"
          v-model="selectedRule_resolved"
          class="p-1 w-48"
        >
          <option value="0">All</option>
          <option v-for="rule in rules" :key="rule.id" :value="rule.id">
            {{ rule.name }}
          </option>
        </select>
      </div>

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
              <strong>Rule Name: {{ alert.rule_name }} </strong> (count:
              {{ alert.count }})
            </div>
            <div v-if="expanded[alert.id]">
              <div>------------------------------------------</div>
              <div><strong>Fingerprint:</strong> {{ alert.fingerprint }}</div>
              <div><strong>Pod Name:</strong> {{ alert.pod_name }}</div>
              <div><strong>Created At:</strong> {{ alert.created_at }}</div>
              <div><strong>Resolved At:</strong> {{ alert.resolved_at }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
