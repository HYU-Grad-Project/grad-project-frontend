import axios from "axios";

export const getAlerts = async (resolved, ruleId) => {
  try {
    const response = await axios.get(
      `http://127.0.0.1:8000/alert/?resolved=${resolved}&rule_id=${ruleId}`
    );
    const alerts = response.data;
    console.log("getAlerts", alerts);

    return alerts;
  } catch (error) {
    console.log("getAlerts", error);
  }
};

export const getAlertDetail = async (alertId) => {
  try {
    const response = await axios.get(`http://127.0.0.1:8000/alert/${alertId}`);
    const alertDetail = response.data;
    console.log("getAlertDetail", alertDetail);

    return alertDetail;
  } catch (error) {
    console.log("getAlertDetail", error);
  }
};
export const getAlertAdvice = async (alertId) => {
  try {
    const response = await axios.post("http://127.0.0.1:8000/alert/advice/", {
      alert_id: alertId,
    });
    const alertAdvice = response.data;
    console.log("getAlertAdvice", alertAdvice);

    return alertAdvice;
  } catch (error) {
    console.log("getAlertAdvice", error);
  }
};

export const resolveAlert = async (alertId, value) => {
  try {
    const response = await axios.post(
      "http://127.0.0.1:8000/alert/follow_up/",
      {
        alert_id: alertId,
        value: value,
      }
    );
    const responseMessage = response.data;
    console.log("resolveAlert", responseMessage);

    return responseMessage;
  } catch (error) {
    console.log("resolveAlert", error);
  }
};
