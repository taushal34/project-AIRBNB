module.exports.loogedin = (req, res, next) => {
    console.log(req.path,"but we comes to",req.originalUrl);
    if (!req.isAuthenticated()) {
        req.session.redirecturl=req.originalUrl;
        req.flash("error", "You must be signed in");
        return res.redirect("/login");
    }
    next();
}

module.exports.saveredirectUrl=(req,res,next)=>{
    if(req.session.redirecturl){
        res.locals.redirecturl=req.session.redirecturl;
    }
    next();
}