var express = require('express');
var router = express.Router();
var passport = require('passport');
var userModel = require('../../model/thanhvien.model')

router.get('/', (req, res,next) => {
    res.render('user/login', {
        layout: './index'
    });
})

router.post('/', (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err)
            return next(err);

        if (!user) {
            return res.render('user/login.hbs', {
                err_message: info.message,
                layout: './index'
            })
        }
        req.logIn(user, err => {
            if (err) {
                return next(err);
            }
            else {
                
                userModel.getPassbyEmail(user.email).then(tk => {
                    if (tk[0].phanhe === 2) {
                         return res.redirect('/');
                    }
                    else {
                        return res.redirect('/admin')
                    }
                })
                
            }

        });
    })(req, res, next);

})

module.exports = router;