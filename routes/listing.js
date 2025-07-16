import express from "express";
const router = express.Router();
import wrapAsync from "../utils/wrapAsync.js";
import expressError from "../utils/expressError.js";
import { listingSchema } from "../schema.js";
import Listing from "../models/listing.js";

import {isLoggedIn} from "../middleware.js";

const validateListing = (req, res, next) => {
  const { error } = listingSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new expressError(400, errMsg);
  } else {
    next();
  }
};

router.get(
  "/",
  wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
  })
);

router.get(
  "/new",
  isLoggedIn,
  wrapAsync(async (req, res) => {
    const listing = new Listing();
    res.render("listings/new.ejs", { listing });
  })
);

router.post(
  "/",
  validateListing,
  wrapAsync(async (req, res) => {
    const listing = new Listing(req.body.listing);
    await listing.save();
    req.flash("success", "New Listing Created Successfully");
    res.redirect("/listings");
  })
);

router.get(
  "/:id",
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id).populate("review");
    if (!listing) {
      req.flash("error", "Listing Does Not Exist!");
      res.redirect("/listings");
    }

    res.render("listings/show.ejs", { listing });
  })
);

router.get(
  "/:id/edit",
  isLoggedIn,
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
      req.flash("error", "Listing Does Not Exist!");
      res.redirect("/listings");
    }
    res.render("listings/edit.ejs", { listing });
  })
);

router.patch(
  "/:id",
  isLoggedIn,
  validateListing,
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    if (req.body.listing.image && typeof req.body.listing.image === "string") {
      req.body.listing.image = { url: req.body.listing.image };
    }
    const listing = await Listing.findByIdAndUpdate(id, {
      ...req.body.listing,
    });
    req.flash("success", "Listing Updated Successfully");
    res.redirect(`/listings/${id}`);
  })
);

router.delete(
  "/:id",
  isLoggedIn,
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted Successfully");
    res.redirect("/listings");
  })
);

export default router;
