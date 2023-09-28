import axios from "axios";

export const getCategory = async () => {
  try {
    const response = await axios.get(`http://127.0.0.1:8000/category/`);
    const categories = response.data;
    console.log("getCategory", categories);

    return categories;
  } catch (error) {
    console.log("getCategory", error);
  }
};

export const getCategoryDetail = async (categoryId) => {
  try {
    const response = await axios.get(
      `http://127.0.0.1:8000/category/${categoryId}/`
    );
    const categoryDetail = response.data;
    console.log("getCategoryDetail", categoryDetail);

    return categoryDetail;
  } catch (error) {
    console.log("getCategoryDetail", error);
  }
};

export const getMetrics = async (categoryId) => {
  try {
    const response = await axios.get(
      `http://127.0.0.1:8000/metric/list_category/?category_id=${categoryId}`
    );
    const metrics = response.data;
    console.log("getMetrics", metrics);

    return metrics;
  } catch (error) {
    console.log("getMetrics", error);
  }
};

export const getMetricDetail = async (metricId) => {
  try {
    const response = await axios.get(
      `http://127.0.0.1:8000/metric/${metricId}/`
    );
    const metricDetail = response.data;
    console.log("getMetricDetail", metricDetail);

    return metricDetail;
  } catch (error) {
    console.log("getMetricDetail", error);
  }
};

export const getMonitorValues = async (metricId) => {
  try {
    const response = await axios.post(
      `http://127.0.0.1:8000/metric/monitor/?metric_id=${metricId}`
    );
    const monitorValues = response.data;
    console.log("getMonitorValues", monitorValues);

    return monitorValues;
  } catch (error) {
    console.log("getMonitorValues", error);
  }
};
