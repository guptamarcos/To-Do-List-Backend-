
// TO CHECK USER IS LOGGED IN OR NOT BEFORE PERFORMING ANY OPERATIONS
const isLoggedIn = (req,res,next)=>{
    if(!req.isAuthenticated()){
       req.flash("error","You must had to logIn to access Todo list App!!")
       return res.redirect("/api/users/login");
    }
    next();
}

module.exports =  isLoggedIn ;