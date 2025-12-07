import { BetaAnalyticsDataClient } from "@google-analytics/data";
import path from "path";

const keyFilename =
  process.env.GA_SERVICE_KEYFILE || path.join(__dirname, "..", "..", "utils", "service-key.json");

const propertyId = process.env.GA4_PROPERTY_ID;

if (!propertyId) {
  throw new Error("GA4_PROPERTY_ID is not defined in environment variables");
}

const analyticsDataClient = new BetaAnalyticsDataClient({
  keyFilename,
});

interface DateRangeParams {
  startDate?: string;
  endDate?: string;
}

const analyticsService = {
  getActiveUsersByCity: async ({
    startDate = "30daysAgo",
    endDate = "today",
  }: DateRangeParams = {}) => {
    const request = {
      property: `properties/${propertyId}`,
      dimensions: [{ name: "city" }],
      metrics: [{ name: "activeUsers" }],
      dateRanges: [{ startDate, endDate }],
    };

    const [response] = await analyticsDataClient.runReport(request);

    return response;
  },
};

export default analyticsService;
