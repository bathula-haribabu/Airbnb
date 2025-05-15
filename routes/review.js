import express from 'express';
const router = express.Router({ mergeParams: true });
import Review from "../models/review.js";
import expressError from "../utils/expressError.js";
import wrapAsync from "../utils/wrapAsync.js";
import { reviewSchema } from "../schema.js";
import Listing from "../models/listing.js";

const validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new expressError(400, errMsg);
  } else {
    next();
  }
};


router.post("/",wrapAsync( async (req, res) => {
  const listing = await Listing.findById(req.params.id);
  let newReview = new Review(req.body.review);
  listing.review.push(newReview);
  await newReview.save();
  await listing.save();
  req.flash("success", "Review Created Successfully");
  res.redirect(`/listings/${listing._id}`);
}));

router.delete(
  "/:reviewId",
  validateReview,
  wrapAsync(async (req, res) => {
    let { id, reviewId } = req.params;
    Listing.findByIdAndUpdate(id, { $pull: { review: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Review Deleted Successfully");
    res.redirect(`/listings/${id}`);
  })
);
export default router;