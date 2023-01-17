import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
const path = require("path");

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      "@src": path.resolve(__dirname, "src"),
      "@assets": path.resolve(__dirname, "assets"),
      "@contexts": path.resolve(__dirname, "src/contexts"),
      "@views": path.resolve(__dirname, "src/views"),
      "@components": path.resolve(__dirname, "src/components"),
      "@cc": path.resolve(__dirname, "src/components"),
      "@configs": path.resolve(__dirname, "src/configs"),
      "@utils": path.resolve(__dirname, "src/utility/Utils"),
      "@store": path.resolve(__dirname, "src/redux"),
      "@layouts": path.resolve(__dirname, "src/@core/layouts"),
    },
  },
  plugins: [react()],
  server: {
    proxy: {
      "/api/auth/current-session/": {
        target: "http://localhost:5000",
      },
      "/api/auth": {
        target: "http://localhost:5000",
      },
      "/api/auth/logout/": {
        target: "http://localhost:5000",
      },
      "/api/user/getallusers": {
        target: "http://localhost:5000",
      },
      "^/api/user/.*": {
        target: "http://localhost:5000",
      },
      "/api/user/addfriend/": {
        target: "http://localhost:5000",
      },
      "/api/user/cancelreq": {
        target: "http://localhost:5000",
      },
      "/api/user/acceptreq": {
        target: "http://localhost:5000",
      },
      "/api/rooms/create": {
        target: "http://localhost:5000",
      },
      "/api/user/messages": {
        target: "http://localhost:5000",
      },
      "^/api/rooms/user/.*/rooms": {
        target: "http://localhost:5000",
      },
      "^/api/rooms/.*": {
        target: "http://localhost:5000",
      },
    },
  },
});
