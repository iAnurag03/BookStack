import mongoose from "mongoose";

const connectDB = async () => {
    mongoose
    .connect(process.env.MONGO_URI,{
        dbName : "bookStack",
    })
    .then(()=>{
        console.log(`db connected successfully`);
    })
    .catch((err)=>{
            console.log("error connecting to db", err)
    })
}
export default connectDB;
