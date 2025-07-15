import express from "express";
const router = express.Router({ mergeParams: true });
import user from "../models/user.js";
import wrapAsync from "../utils/wrapAsync.js";

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
      req.flash("success", "Welcome to Wonderla");
      res.redirect("/listings");
    } catch (er) {
      req.flash("error", er.message);
      res.redirect("/listings");
    }
  })
);

router.get("/login", (req, res) => {
  res.render("users/login");
});

export default router;
