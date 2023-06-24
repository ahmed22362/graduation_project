const axios = require("axios")
async function callPredictionAPI(data) {}
exports.callPredictionAPI = async () => {
  try {
    const apiUrl = "http://your-api-url/predict" // Replace with your API endpoint URL
    const response = await axios.post(apiUrl, data)
    return response.data.result
  } catch (error) {
    console.error("Error calling the prediction API:", error)
    throw error
  }
}
