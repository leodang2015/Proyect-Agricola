import mongoose from "mongoose";
import { config } from "./env.js";

export const connectDB = async () => {
  await mongoose.connect(config.mongodbUri);
  console.log("Conexión exitosa a MongoDB");
};
