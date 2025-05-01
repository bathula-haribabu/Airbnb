import express from "express";
import mongoose from "mongoose";
import methodOverride from "method-override";
import path from "path";
import ejsMate from "ejs-mate";
import expressError from "./utils/expressError.js";
import listings from "./routes/listing.js";
import reviews from "./routes/review.js";
import "dotenv";

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use("/listings", listings);
app.use("/listings/:id/reviews", reviews);

const URL = process.env.DB_URL;
async function main() {
  try {
    await mongoose.connect(URL);
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error("Error connecting to MongoDB", err);
  }
}

main();

app.all("*", (req, res, next) => {
  next(new expressError(404, "Page Not Found"));
});

app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Something Went Wrong!" } = err;
  res.status(statusCode).render("error.ejs", { message });
});

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.listen(8080, () => {
  console.log("Server started on port 8080");
});
