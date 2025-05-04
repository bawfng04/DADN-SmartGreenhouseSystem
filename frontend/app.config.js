import "dotenv/config";

export default {
  expo: {
    name: "smart-greenhouse",
    slug: "smart-greenhouse",
    version: "1.0.0",
    extra: {
      apiUrl: process.env.API_URL,
      token: process.env.TOKEN,
      websocketUrl: process.env.WEBSOCKET_URL,
    },
  },
};
