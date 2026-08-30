import mongoose, { MongooseError } from "mongoose";
import { BaseError } from "../utils/BaseError";

export const connectDB = async () => {
    try {
        const uri = process.env.MONGO_URI;
        if(!uri) {
            throw new BaseError("Server configration error : Missing Mongo uri" , 500);
        }
        await mongoose.connect(uri);
        console.log("Mongo db running successfully");
    }catch(err : unknown) {
        const error = err as MongooseError;
        throw new BaseError(error.message , 500);
    }
}