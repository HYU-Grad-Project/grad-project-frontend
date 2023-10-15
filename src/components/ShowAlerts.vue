<script setup>
// import { initFlowbite } from "flowbite";
// onMounted(() => {
//   initFlowbite();
// });

import { ref, onMounted } from "vue";
import { getAlertAdvice, getAlerts, resolveAlert } from "../api/alertsApi";
import { getRules } from "../api/rulesApi";

const showModal = ref(false);
const showResolved = ref(false);

const unresolvedAlerts = ref([]);
const resolvedAlerts = ref([]);
const expanded = ref({});
const selectedRule_resolved = ref("0");
const selectedRule_unresolved = ref("0");

const rules = ref([]);
const userInput = ref("");
const expandedRules = ref({});

onMounted(async () => {
  rules.value = await getRules();
});

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
    `Enter value for ${alertAdvice.relevant_key_name}.\n(Current Value: ${alertAdvice.current_value}, Recommended Value: ${alertAdvice.recommended_value})`,
    alertAdvice.recommended_value
  );

  if (isNaN(userInput) || userInput === "") {
    alert("Enter a number.");
    return;
  }
  if (userInput === null) {
    return;
  }
  console.log(Number(userInput));
  resolveAlert(alertId, Number(userInput));
};

const toggleRuleDetails = (ruleId) => {
  expandedRules.value[ruleId] = !expandedRules.value[ruleId];
};
</script>

<template>
  <div class="h-full">
    <div class="flex justify-center">
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
      <button
        type="button"
        class="focus:outline-none text-white bg-yellow-700 hover:bg-yellow-800 focus:ring-4 focus:ring-yellow-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-yellow-600 dark:hover:bg-yellow-700 dark:focus:ring-yellow-800"
        @click="
          () => {
            showResolved = !showResolved;
          }
        "
      >
        Toggle Unresolved/Resolved
      </button>
    </div>

    <div v-if="!showResolved" class="rounded-lg bg-purple-100 p-4 m-4 h-1/2">
      <div class="flex justify-between">
        <span class="font-bold text-purple-800">
          Unresolved Alerts ({{ unresolvedAlerts.length }})
        </span>
        <select
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
              <strong>{{ alert.rule.name }}</strong> (count: {{ alert.count }})
            </div>
            <div v-if="expanded[alert.id]">
              <div>------------------------------------------</div>
              <div><strong>Fingerprint:</strong> {{ alert.fingerprint }}</div>
              <div><strong>Pod Name:</strong> {{ alert.pod_name }}</div>
              <div><strong>Created At:</strong> {{ alert.created_at }}</div>
              <div class="text-center">
                <!-- <button
                  type="button"
                  class="mt-4 text-yellow-400 hover:text-white border border-yellow-400 hover:bg-yellow-500 focus:ring-4 focus:outline-none focus:ring-yellow-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:border-yellow-300 dark:text-yellow-300 dark:hover:text-white dark:hover:bg-yellow-400 dark:focus:ring-yellow-900"
                  @click="getAdviceAndResolveAlert(alert.id)"
                > -->
                <button
                  type="button"
                  class="mt-4 text-yellow-400 hover:text-white border border-yellow-400 hover:bg-yellow-500 focus:ring-4 focus:outline-none focus:ring-yellow-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:border-yellow-300 dark:text-yellow-300 dark:hover:text-white dark:hover:bg-yellow-400 dark:focus:ring-yellow-900"
                  @click="
                    () => {
                      showModal = true;
                    }
                  "
                >
                  Resolve
                </button>
                <!-- Main modal -->
                <div
                  v-if="showModal"
                  class="flex flex-col justify-between fixed top-1/2 left-4 transform -translate-y-1/2 w-1/2 h-1/2 p-4 rounded-lg shadow-gray-700 shadow-2xl bg-blue-50"
                >
                  <div class="text-left">
                    <strong>Rule Name:</strong> {{ alert.rule.name }}
                  </div>
                  <div class="text-left">
                    <strong>Expression:</strong> {{ alert.rule.expr }}
                  </div>
                  <div class="text-left"><strong>Metrics:</strong></div>
                  <div
                    class="text-left"
                    v-for="metric in alert.rule.metrics"
                    :key="metric.id"
                  >
                    <button
                      class="text-green-900 bg-green-50 border-green-300 border-[1px] rounded-lg p-1"
                      @click="
                        $emit('emitMetric', [metric.category_id, metric.id])
                      "
                    >
                      {{ metric.name }}
                    </button>
                  </div>
                  <div class="text-left"><strong>Query Value:</strong></div>
                  <div class="text-left">
                    <strong>Recommended Value:</strong>
                  </div>
                  <div>
                    <strong>Enter Value:</strong
                    ><input class="ml-4" v-model="userInput" />
                  </div>
                  <div>
                    <button
                      class="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
                      @click="
                        () => {
                          showModal = false;
                        }
                      "
                    >
                      Submit
                    </button>
                    <button
                      class="focus:outline-none text-white bg-gray-700 hover:bg-gray-800 focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-gray-600 dark:hover:bg-gray-700 dark:focus:ring-gray-800"
                      @click="
                        () => {
                          showModal = false;
                        }
                      "
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-if="showResolved" class="rounded-lg bg-blue-100 p-4 m-4 h-1/2">
      <div class="flex justify-between">
        <span class="font-bold text-blue-800">
          Resolved Alerts ({{ resolvedAlerts.length }})
        </span>
        <select
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
              <strong>{{ alert.rule.name }}</strong> (count: {{ alert.count }})
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

    <div class="rounded-lg bg-gray-200 p-4 m-4 h-1/2">
      <div>
        <span class="font-bold text-black"> Rule Descriptions </span>
      </div>
      <div class="overflow-auto h-5/6 m-4">
        <div v-for="rule in rules" :key="rule.id">
          <div
            class="border-solid border-2 border-gray-500 bg-gray-50 rounded-lg p-4 m-4"
          >
            <div class="cursor-pointer" @click="toggleRuleDetails(rule.id)">
              <span v-if="!expandedRules[rule.id]">▷ </span>
              <span v-else>▽ </span>
              <strong>{{ rule.name }}</strong>
            </div>
            <div v-if="expandedRules[rule.id]">
              <div>------------------------------------------</div>
              <div><strong>Expression:</strong> {{ rule.expr }}</div>
              <div><strong>Severity:</strong> {{ rule.severity }}</div>
              <div><strong>Description:</strong> {{ rule.description }}</div>
              <div>
                <strong>Relevant Key Name:</strong> {{ rule.relevant_key_name }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
