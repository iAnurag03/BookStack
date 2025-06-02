import cron from "node-cron";
import { User } from "../models/user.model.js";

export const removeUnverified = () => {
  // Run every 30 minutes
  cron.schedule("*/30 * * * *", async () => {
    try {
      const thirtyMinAgo = new Date(Date.now() - 30 * 60 * 1000);
      const result = await User.deleteMany({
        accountVerified: false,
        createdAt: { $lt: thirtyMinAgo },
      });
      console.log(`Deleted ${result.deletedCount} unverified users.`);
    } catch (error) {
      console.error("Error while deleting unverified users:", error);
    }
  });
};
