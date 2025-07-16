const isLoggedIn = (req,res,next)=>{
      if(!req.isAuthenticated()){
      req.session.redirectUrl = req.originalUrl;
      req.flash("error","You must logged in for create listing");
      res.redirect("/login");
    }
    next();
}

const savedRedirectUrl = (req,res,next)=>{
  if(req.session.redirectUrl){
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
}

export { isLoggedIn, savedRedirectUrl };