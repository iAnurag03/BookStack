import  {app} from "./app.js"
import {v2 as cloudinary} from "cloudinary"

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLIENT_NAME,
    api_key: process.env.CLOUDINARY_CLIENT_APIKEY,
    api_secret: process.env.CLOUDINARY_CLIENT_SECRET,
})
app.listen(4000,()=>{
    console.log(`server is running at port 4000`);

})