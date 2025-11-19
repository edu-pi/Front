import { worker } from "./browser";

export const setupMSW = async () => {
  const shouldUseMSW = import.meta.env.VITE_APP_USE_MSW === "true";

  if (!shouldUseMSW) {
    console.log("MSW is disabled. Using real API server.");
    return;
  }

  try {
    await worker.start({
      onUnhandledRequest: "bypass",
      serviceWorker: {
        url: `${window.location.origin}/mockServiceWorker.js`,
      },
    });
    console.log("MSW started successfully - Using mock API");
  } catch (error) {
    console.error("Failed to start MSW:", error);
    console.log("Falling back to real API server");
  }
};
