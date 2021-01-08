module.exports = (req, res, next) => {
    if (req.user) {
        res.locals.isAuthenticated = true;
        res.locals.authUser = req.user;
        if(req.user.phanhe == 1)
        {
            res.locals.isAdmin = true;
        }
    } next();
}