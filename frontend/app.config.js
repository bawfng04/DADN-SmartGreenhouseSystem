import "dotenv/config";

export default {
  expo: {
    name: "my-app",
    slug: "my-app",
    version: "1.0.0",
    extra: {
      apiUrl: process.env.API_URL,
      token: process.env.TOKEN,
    },
  },
};
