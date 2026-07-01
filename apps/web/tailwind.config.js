import sharedConfig from "../../packages/ui/tailwind.config.js";

export default {
  ...sharedConfig,
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "../../packages/ui/src/**/*.{js,ts,jsx,tsx}",
  ],
};
