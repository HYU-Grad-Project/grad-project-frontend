import axios from "axios";

export const getAlerts = async (resolved) => {
  try {
    const response = await axios.get(
      `http://127.0.0.1:8000/alert/?resolved=${resolved}`
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
