import mongoose from "mongoose";
import "dotenv/config";
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
  const listingsWithOwner = getListings().map((obj) => ({
    ...obj,
    owner: "6875cf7da17dbf37f0ba89e3",
  }));
  await listing.insertMany(listingsWithOwner);
  console.log("Data inserted");
  console.log("Data initialized");
};

const initDatabase = async () => {
  await main();
  await init();
  mongoose.connection.close();
};
initDatabase();
