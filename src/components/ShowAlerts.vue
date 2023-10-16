<script setup>
import { ref, onMounted } from "vue";
import {
  getAlertAdvice,
  getAlertDetail,
  getAlerts,
  resolveAlert,
} from "../api/alertsApi";
import { getRuleValues, getRules } from "../api/rulesApi";

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
const ruleValueList = ref([]);

const advice = ref();
const alertDetail = ref();
const metricList = ref({});
const convertedExpr = ref({});

onMounted(async () => {
  rules.value = await getRules();
  rules.value.forEach((rule) => {
    rule.metrics.forEach((metric) => {
      metricList.value[metric.name] = [metric.category_id, metric.id];
    });

    convertedExpr.value[rule.id] = convertExpr(rule.expr);
  });
});
const convertExpr = (expression) => {
  const metricRegex = /([a-zA-Z_]+)/g;
  const expressionParts = [];

  let matches;
  let currentIndex = 0;
  while ((matches = metricRegex.exec(expression)) !== null) {
    const match = matches[0];
    const startIndex = matches.index;
    const endIndex = startIndex + match.length;

    // Text before the metric
    if (startIndex > currentIndex) {
      expressionParts.push({
        type: "text",
        text: expression.substring(currentIndex, startIndex),
      });
    }

    // Metric itself
    expressionParts.push({ type: "metric", metric: match });

    currentIndex = endIndex;
  }

  // Add any remaining text after the last metric
  if (currentIndex < expression.length) {
    expressionParts.push({
      type: "text",
      text: expression.substring(currentIndex),
    });
  }

  return expressionParts;
};

const showUnresolvedAlerts = async (ruleId) => {
  unresolvedAlerts.value = await getAlerts(0, ruleId);
};
const showResolvedAlerts = async (ruleId) => {
  resolvedAlerts.value = await getAlerts(1, ruleId);
};
const toggleAlertDetails = (alertId) => {
  expanded.value[alertId] = !expanded.value[alertId];
};

const getAdviceAndAlertDetail = async (alertId) => {
  advice.value = await getAlertAdvice(alertId);
  alertDetail.value = await getAlertDetail(alertId);
};

const resolveChosenAlert = async (alertId) => {
  if (isNaN(userInput.value) || userInput.value === "") {
    alert("Enter a number.");
    return;
  }
  console.log(Number(userInput.value));
  resolveAlert(alertId, Number(userInput.value));
  showModal.value = false;
};

const toggleRuleDetails = (ruleId) => {
  expandedRules.value[ruleId] = !expandedRules.value[ruleId];
};
const setRuleValueList = async (ruleId) => {
  ruleValueList.value = await getRuleValues(ruleId);
};
</script>

<template>
  <div class="h-full">
    <div class="flex justify-center">
      <button
        type="button"
        class="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2"
        @click="
          () => {
            showUnresolvedAlerts(selectedRule_unresolved);
            showResolvedAlerts(selectedRule_resolved);
            showModal = false;
          }
        "
      >
        Refresh Alerts
      </button>
      <button
        type="button"
        class="focus:outline-none text-white bg-yellow-700 hover:bg-yellow-800 focus:ring-4 focus:ring-yellow-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2"
        @click="
          () => {
            showResolved = !showResolved;
            showModal = false;
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
                <button
                  type="button"
                  class="mt-4 text-yellow-400 hover:text-white border border-yellow-400 hover:bg-yellow-500 focus:ring-4 focus:outline-none focus:ring-yellow-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                  @click="
                    async () => {
                      await getAdviceAndAlertDetail(alert.id);
                      await setRuleValueList(alert.rule.id);
                      userInput = advice.recommended_value;
                      showModal = true;
                    }
                  "
                >
                  Resolve
                </button>
                <div
                  v-if="showModal"
                  class="flex flex-col justify-between fixed top-1/2 left-4 transform -translate-y-1/2 w-1/2 h-fit p-4 rounded-lg shadow-gray-700 shadow-2xl bg-blue-50"
                >
                  <div class="text-left">
                    <strong>Rule Name:</strong> {{ alertDetail.rule.name }}
                  </div>
                  <hr class="border-blue-900 border-[1px] my-2" />
                  <!-- <div class="text-left">
                    <strong>Expression:</strong> {{ alertDetail.rule.expr }}
                  </div> -->
                  <div class="text-left">
                    <strong>Expression:</strong>
                    <div>
                      <span
                        v-for="(part, index) in convertedExpr[
                          alertDetail.rule.id
                        ]"
                        :key="index"
                      >
                        <span v-if="part.type === 'text'">{{ part.text }}</span>
                        <button
                          v-else
                          class="text-blue-600 hover:text-blue-900"
                          @click="$emit('emitMetric', metricList[part.metric])"
                        >
                          {{ part.metric }}
                        </button>
                      </span>
                    </div>
                  </div>
                  <hr class="border-blue-900 border-[1px] my-2" />
                  <div class="text-left">
                    <strong>Current Status:</strong>
                    <div class="flex justify-center">
                      <div
                        class="border-2 rounded-lg bg-white border-blue-400 p-2 w-fit my-2"
                      >
                        <div v-for="ruleValue in ruleValueList">
                          <strong>Pod: </strong>{{ ruleValue.pod_name }},
                          <strong>Value: </strong>{{ ruleValue.value }}
                        </div>
                      </div>
                    </div>
                  </div>
                  <hr class="border-blue-900 border-[1px] my-2" />
                  <!-- <div class="flex">
                    <div><strong>Metrics:</strong></div>
                    <div>
                      <button
                        class="text-green-900 bg-green-50 border-green-300 border-[1px] rounded-lg px-1 m-1 hover:border-green-500"
                        v-for="metric in alertDetail.rule.metrics"
                        :key="metric.id"
                        @click="
                          $emit('emitMetric', [metric.category_id, metric.id])
                        "
                      >
                        {{ metric.name }}
                      </button>
                    </div>
                  </div> -->
                  <!-- <hr class="border-blue-900 border-[1px] my-2" /> -->
                  <div class="text-left">
                    <strong>Key to modify: </strong>
                    {{ alertDetail.rule.relevant_key_name }} (current:
                    {{ advice.current_value }},
                    <span class="text-purple-700">
                      recommended: {{ advice.recommended_value }}</span
                    >)
                  </div>
                  <div class="my-2">
                    <strong
                      >Enter new '{{
                        alertDetail.rule.relevant_key_name
                      }}':</strong
                    ><input class="ml-4 p-1" v-model="userInput" />
                  </div>
                  <div class="mt-2">
                    <button
                      class="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2"
                      @click="resolveChosenAlert(alertDetail.id)"
                    >
                      Submit
                    </button>
                    <button
                      class="focus:outline-none text-white bg-gray-700 hover:bg-gray-800 focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2"
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
              <div class="text-center">
                <button
                  type="button"
                  class="mt-4 text-yellow-400 hover:text-white border border-yellow-400 hover:bg-yellow-500 focus:ring-4 focus:outline-none focus:ring-yellow-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                  @click="
                    async () => {
                      await getAdviceAndAlertDetail(alert.id);
                      await setRuleValueList(alert.rule.id);
                      showModal = true;
                    }
                  "
                >
                  Rule Detail
                </button>
                <div
                  v-if="showModal"
                  class="flex flex-col justify-between fixed top-1/2 left-4 transform -translate-y-1/2 w-1/2 h-fit p-4 rounded-lg shadow-gray-700 shadow-2xl bg-green-50"
                >
                  <div class="text-left">
                    <strong>Rule Name:</strong> {{ alertDetail.rule.name }}
                  </div>
                  <hr class="border-blue-900 border-[1px] my-2" />
                  <!-- <div class="text-left">
                    <strong>Expression:</strong> {{ alertDetail.rule.expr }}
                  </div> -->
                  <div class="text-left">
                    <strong>Expression:</strong>
                  </div>
                  <div>
                    <span
                      v-for="(part, index) in convertedExpr[
                        alertDetail.rule.id
                      ]"
                      :key="index"
                    >
                      <span v-if="part.type === 'text'">{{ part.text }}</span>
                      <button
                        v-else
                        class="text-blue-600 hover:text-blue-900"
                        @click="$emit('emitMetric', metricList[part.metric])"
                      >
                        {{ part.metric }}
                      </button>
                    </span>
                  </div>
                  <hr class="border-blue-900 border-[1px] my-2" />
                  <div class="text-left">
                    <strong>Current Status:</strong>
                    <div class="flex justify-center">
                      <div
                        class="border-2 rounded-lg bg-white border-blue-400 p-2 w-fit my-2"
                      >
                        <div v-for="ruleValue in ruleValueList">
                          <strong>Pod: </strong>{{ ruleValue.pod_name }},
                          <strong>Value: </strong>{{ ruleValue.value }}
                        </div>
                      </div>
                    </div>
                  </div>
                  <!-- <div class="flex">
                    <div><strong>Metrics:</strong></div>
                    <div>
                      <button
                        class="text-blue-900 bg-blue-50 border-blue-300 border-[1px] rounded-lg px-1 m-1 hover:border-blue-500"
                        v-for="metric in alertDetail.rule.metrics"
                        :key="metric.id"
                        @click="
                          $emit('emitMetric', [metric.category_id, metric.id])
                        "
                      >
                        {{ metric.name }}
                      </button>
                    </div>
                  </div> -->
                  <div class="mt-4">
                    <button
                      class="focus:outline-none text-white bg-gray-700 hover:bg-gray-800 focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2"
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
              <!-- <div><strong>Expression:</strong> {{ rule.expr }}</div> -->
              <div><strong>Expression:</strong></div>
              <div>
                <span
                  v-for="(part, index) in convertedExpr[rule.id]"
                  :key="index"
                >
                  <span v-if="part.type === 'text'">{{ part.text }}</span>
                  <button
                    v-else
                    class="text-blue-600 hover:text-blue-900"
                    @click="$emit('emitMetric', metricList[part.metric])"
                  >
                    {{ part.metric }}
                  </button>
                </span>
              </div>
              <div><strong>Severity:</strong> {{ rule.severity }}</div>
              <div><strong>Description:</strong> {{ rule.description }}</div>
              <div>
                <strong>Relevant Key Name:</strong> {{ rule.relevant_key_name }}
              </div>
              <!-- <div><strong>Metrics:</strong></div>
              <div>
                <button
                  class="text-black bg-gray-100 border-gray-400 border-[1px] rounded-lg px-1 m-1 hover:border-gray-500 hover:bg-gray-200"
                  v-for="metric in rule.metrics"
                  :key="metric.id"
                  @click="$emit('emitMetric', [metric.category_id, metric.id])"
                >
                  {{ metric.name }}
                </button>
              </div> -->
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
