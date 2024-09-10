import LlamaAI from "llamaai";

const apiToken =
  "LL-LgkD4x2Lozk6vGtUIEKd9L1B2UiyRhmKuOaAt1jwJDeGFLbb4wgx2iiLiPZph0M7";
const llamaAPI = new LlamaAI(apiToken);

const apiRequestJson = {
  messages: [{ role: "user", content: "What is the weather like in Boston?" }],
  functions: [
    {
      name: "get_current_weather",
      description: "Get the current weather in a given location",
      parameters: {
        type: "object",
        properties: {
          location: {
            type: "string",
            description: "The city and state, e.g. San Francisco, CA",
          },
          days: {
            type: "number",
            description: "for how many days ahead you wants the forecast",
          },
          unit: { type: "string", enum: ["celsius", "fahrenheit"] },
        },
      },
      required: ["location", "days"],
    },
  ],
  stream: false,
  function_call: "get_current_weather",
};

llamaAPI
  .run(apiRequestJson)
  .then((response) => {
    // Process response
    console.log(response);
  })
  .catch((error) => {
    // Handle errors
  });
