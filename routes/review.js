import express from "express";
const router = express.Router({ mergeParams: true });
import Review from "../models/review.js";
import wrapAsync from "../utils/wrapAsync.js";
import { validateReview, isLoggedIn, isAuthor } from "../middleware.js";
import Listing from "../models/listing.js";

router.post(
  "/",
  isLoggedIn,
  wrapAsync(async (req, res) => {
    const listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    await listing.review.push(newReview);
    await newReview.save();
    await listing.save();
    req.flash("success", "Review Created Successfully");
    res.redirect(`/listings/${listing._id}`);
  })
);

router.delete(
  "/:reviewId",
  isLoggedIn,
  isAuthor,
  validateReview,
  wrapAsync(async (req, res) => {
    let { id, reviewId } = req.params;
    Listing.findByIdAndUpdate(id, { $pull: { review: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Review Deleted Successfully");
    res.redirect(`/listings/${id}`);
  })
)
export default router;
