export const sendToken=(user, statusCode, message, res)=>{
    const token = user.generateToken()
    res.status(statusCode).cookie("token", token,{
        expires: new Date(Date.now()+Number(process.env.COOKIE_EXPIRE)*24*60*60*1000),
        httpOnly:true,
        sameSite: "strict",

    }).json({
        success:true,
        user,
        message,
        token
    });

}