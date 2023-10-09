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

export const resolveAlert2 = async (maxIncomingConnections) => {
  try {
    const response = await axios.post(
      "http://127.0.0.1:8000/alert/follow_up_2/",
      {
        maxIncomingConnections: maxIncomingConnections,
      }
    );
    const responseMessage = response.data;
    console.log("resolveAlert2", responseMessage);

    return responseMessage;
  } catch (error) {
    console.log("resolveAlert2", error);
  }
};
