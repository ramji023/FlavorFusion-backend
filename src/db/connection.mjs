import mongoose from "mongoose";
import { dB_NAME } from "../constant.mjs";

const connect = async() => {
    try {
        const mongoConnectionURL = `${process.env.MONGODB_URL}/${dB_NAME}`
        // console.log(mongoConnectionURL);
        const connectionData =await mongoose.connect(mongoConnectionURL);
        console.log("connection successfull....");
        console.log(connectionData.connection.host);
    } catch (err) {
        console.log("error in connection : ", err);
    }
}

export { connect };