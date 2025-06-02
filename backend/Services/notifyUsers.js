import cron from "node-cron"
import { Borrow } from "../models/borrow.model.js";
import { User } from "../models/user.model.js";
import { sendEmail } from "../utils/sendEmail.js";

export const notifyUsers = () => {
    // Run every 30 minutes
    cron.schedule("*/30 * * * *", async () => {
        try {
            const oneDayAgo = new Date(Date.now()-24*60*60*1000);
            const borrowers = await Borrow.find({
                dueDate: {
                    $lt: oneDayAgo
                },
                returnDate: null,
                notified: false
            });
            for(const element of borrowers) {
                if(element.user && element.user.email) {
                    await sendEmail({
                        email: element.user.email,
                        subject: "Book Return Reminder",
                        message: `Dear ${element.user.name},\n\n The book you have issued from BookStack is due for return. Kindly return the book, A Late Return Fine may be imposed due to the late return.\n Thank You` 
                    });
                    element.notified = true;
                    await element.save();
                }
            }
        } catch(error) {
            console.error("Error in notifyUsers service:", error);
        }
    });
}
