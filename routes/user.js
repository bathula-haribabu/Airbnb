import express from "express";
const router = express.Router({ mergeParams: true });
import user from "../models/user.js";
import wrapAsync from "../utils/wrapAsync.js";
import passport from "passport";
import { savedRedirectUrl } from "../middleware.js";

router.get("/signup", (req, res) => {
  res.render("users/signup");
});

router.post(
  "/signup",
  wrapAsync(async (req, res) => {
    try {
      let { username, email, password } = req.body;
      const newUser = new user({ email, username });
      const registeredUser = await user.register(newUser, password);
      console.log(registeredUser);
      req.login(registeredUser, (err) => {
        if (err) {
          return next(err);
        }
        req.flash("success", "Welcome to Wonderla");
        res.redirect("/listings");
      });
    } catch (er) {
      req.flash("error", er.message);
      res.redirect("/listings");
    }
  })
);

router.get("/login", (req, res) => {
  res.render("users/login");
});

router.post(
  "/login",
  savedRedirectUrl,
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  wrapAsync(async (req, res) => {
    req.flash("success", "Welcome to wonderla");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
  })
);

router.get("/logout", async (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.flash("success", "Log Out successfully!");
    res.redirect("/listings");
  });
});

export default router;
