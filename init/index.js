import mongoose from "mongoose";
import "dotenv";
import { getListings } from "./data.js";
import listing from "../models/listing.js";

const URL = process.env.DB_URL;
async function main() {
  try {
    await mongoose.connect(URL);
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error("Error connecting to MongoDB", err);
  }
}

const init = async () => {
  await listing.deleteMany({});
  await listing.insertMany(getListings());
  console.log("Data inserted");
  console.log("Data initialized");
};

const initDatabase = async () => {
  await main();
  await init();
  mongoose.connection.close();
};
initDatabase();
