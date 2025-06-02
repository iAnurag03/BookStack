import { generateOtpEmailTemplate } from "./emailTemplate.js";
import { sendEmail } from "./sendEmail.js";
export async function sendVerificationCode(verificationCode, email, res){
   try{
     const message = generateOtpEmailTemplate(verificationCode);
     await sendEmail({
        email,
        subject:"bookstack verification code",
        message
     });
     res.status(200).json({
        success:true,
        message: "otp sent successfully"
     })
   }catch(error){
    return res.status(500).json({
        success:false,
        message: "failed to generate verification code"
    });
   }
}