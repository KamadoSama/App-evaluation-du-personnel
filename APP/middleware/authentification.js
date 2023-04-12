exports.isAuthenticated = (req, res, next) => {
    if (typeof req.session !== 'undefined' && req.session.isAuthenticated) {
        console.log(`isAuthenticated ${req.session.isAuthenticated}`)
        return next();
    }  
    res.redirect("/login");
    
  }

exports.isNotAuthenticated = (req, res, next)=> {
    if (typeof req.session !== 'undefined' && req.session.isAuthenticated) {
        console.log(`isNotAuthenticated ${req.session.isAuthenticated}`)
      res.redirect("/");
    } 
    return next();
    
}