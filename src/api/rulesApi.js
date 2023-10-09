import axios from "axios";

export const getRules = async () => {
  try {
    const response = await axios.get("http://127.0.0.1:8000/rule");
    const rules = response.data;
    console.log("getRules", rules);

    return rules;
  } catch (error) {
    console.log("getRules", error);
  }
};

export const getRuleDetail = async (ruleId) => {
  try {
    const response = await axios.get(`http://127.0.0.1:8000/rule/${ruleId}`);
    const ruleDetail = response.data;
    console.log("getRuleDetail", ruleDetail);

    return ruleDetail;
  } catch (error) {
    console.log("getRuleDetail", error);
  }
};
