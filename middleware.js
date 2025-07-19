import Listing from "./models/listing.js";
import expressError from "./utils/expressError.js";
import { listingSchema } from "./schema.js";
import { reviewSchema } from "./schema.js";
import Review from "./models/review.js";

const isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.redirectUrl = req.originalUrl;
    req.flash("error", "You must logged in for create listing");
    return res.redirect("/login");
  }
  next();
};

const savedRedirectUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
};

const isOwner = async (req, res, next) => {
  const { id } = req.params;
  let listing = await Listing.findById(id);
  if (!listing.owner.equals(res.locals.currUser._id)) {
    req.flash("error", "You Don't have  Permission to edit the listing!");
    return res.redirect(`/listings/${id}`);
  }
  return next();
};

const validateListing = (req, res, next) => {
  const { error } = listingSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new expressError(400, errMsg);
  } else {
    next();
  }
};

const validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new expressError(400, errMsg);
  } else {
    next();
  }
};


const isAuthor = async (req, res, next) => {
  const { id,reviewId } = req.params;
  let review = await Review.findById(reviewId);
  if (!review.author.equals(res.locals.currUser._id)) {
    req.flash("error", "You Don't have  Permission to edit the review!");
    return res.redirect(`/listings/${id}`);
  }
  return next();
};

export {
  isLoggedIn,
  savedRedirectUrl,
  isOwner,
  validateListing,
  validateReview,
  isAuthor,
};
