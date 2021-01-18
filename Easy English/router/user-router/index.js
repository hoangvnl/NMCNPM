var express = require('express');
var router = express.Router();
var bcrypt = require('bcryptjs');
var moment = require('moment');
var passport = require('passport');
var userModel = require('../../model/thanhvien.model');
var abcModel = require('../../model/DSmuchoc.model');
var randomstring = require("randomstring");
var nodemailer = require('nodemailer')
const botvModel = require('../../model/BoTV.model');

router.get('/getnewpassword', (req, res) => {
    res.render('user/LayLaiMatKhau', {
        layout: './index'
    })
})

router.post('/changePass', (req, res) => {
    var infor = req.body;
    var id = req.user.idTaiKhoan
    var newPass = bcrypt.hashSync(infor.newPass, 10);
    var entity = {
        idTaiKhoan: id,
        matKhau: newPass
    }
    userModel.update(entity);
    if (req.user.phanhe === +2) {
        res.redirect('/trangchu');
    }
    else res.redirect('/admin')


})

router.get('/checkPass', (req, res) => {
    var pass = req.query.oldPass;
    var email = req.user.email;
    userModel.getPassbyEmail(email).then(rows => {
        var ret = bcrypt.compareSync(pass, rows[0].matKhau);
        if (ret) {
            return res.json(true);
        }
        return res.json(false);
    })
})



router.post('/infor', (req, res) => {
    var infor = req.body;
    var dob = moment(infor.NgaySinh, "DD/MM/YYYY").format("YYYY/MM/DD");
    userModel.getIDByEmail(infor.Email).then(row => {
        var a = 2;
        entity = {
            idTaiKhoan: row[0].idTaiKhoan,
            hoten: infor.HoTen,
            ngaysinh: dob,
        }
        req.user.hoten = infor.HoTen;
        req.user.ngaysinh = infor.NgaySinh;
        userModel.update(entity);
        res.redirect('/trangchu');
    })
})

router.post('/register', (req, res, next) => {
    var saltRounds = 10;
    var nowDate = new Date();
    var hash = bcrypt.hashSync(req.body.pass, saltRounds);
    var dob = moment(req.body.bdate, 'DD/MM/YYYY').format('YYYY-MM-DD');
    var nowday = moment(nowDate, 'DD/MM/YYYY').format('YYYY-MM-DD');
    var entity = {
        hoten: req.body.HoTen,
        ngaysinh: dob,
        NgayTaoTK: nowday,
        matkhau: hash,
        email: req.body.email,
        phanhe: 2,
        KeyPass: randomstring.generate(10),
        Xoa: 0,
    }
    userModel.add(entity).then(id => {
        res.redirect('/');
    })

})

router.get('/isAvailable', (req, res, next) => {
    var email = req.query.email;
    userModel.getPassbyEmail(email).then(rows => {
        if (rows.length > 0) {
            return res.json(false);
        }
        return res.json(true);
    })
})

router.get('/logout', (req, res, next) => {
    req.logOut();
    res.redirect('/login')
})

router.post('/logout', (req, res, next) => {
    req.logOut();
    req.session.userAuth = null;
    console.log(1);
    console.log('da thoat');
    res.redirect('/login')
})

router.get('/', (req, res) => {


    abcModel.baiviet()
        .then(row => {
            res.render('TrangChu', {
                Baiviet: row,
                layout: './index'
            })
        }).catch(err => {
            console.log(err);
            res.end('error occured!')
        })
});
router.get('/trangchu', (req, res) => {

    abcModel.baiviet()
        .then(row => {
            res.render('TrangChu', {
                Baiviet: row,
                layout: './index'
            })
        }).catch(err => {
            console.log(err);
            res.end('error occured!')
        })
});
router.get('/0', (req, res) => {

    abcModel.baiviet()
        .then(row => {
            res.render('TrangChu', {
                Baiviet: row,
                layout: './index'
            })
        }).catch(err => {
            console.log(err);
            res.end('error occured!')
        })
});

router.get('/:idCM', (req, res, next) => {
    var id = req.params.idCM;
    var page = req.query.page || 1;
    if (page < 1) page = 1;

    var limit = 6;
    var offset = (page - 1) * limit;

    Promise.all([
        abcModel.baiviet(),
        botvModel.allPublic(),
        abcModel.dsbaiviet(limit, offset),
        abcModel.countbaiviet(id),
        abcModel.dsbaikt(id),
        abcModel.loaibai(id)
    ]).then(([row, row2, row3, count_rows, row4, row5]) => {
        for (const c of res.locals.MucHoc) {
            if (c.idLoaiBai === +id) {
                c.isActive = true;
            }
        }

        var total = count_rows[0].total;
        var nPages = Math.floor(total / limit);
        if (total % limit > 0) nPages++;
        var pages = [];
        for (i = 1; i <= nPages; i++) {
            var obj = { value: i, active: i === +page };
            pages.push(obj);
        }

        if (id == 0) {
            res.render('TrangChu', {
                Baiviet: row,
                layout: './index'
            })
        }
        if (id == 1 || id == 3 || id == 4 || id == 5) {
            console.log(row2);
            res.render('user/introduction', {
                Chude: row2,
                layout: './index'
            })
        }
        if (id == 7) {
            res.render("user/testtrinhdo", {
                layout: './index'
            })
        }
        if (id == 8 || id == 9) {
            res.render("user/testlist", {
                DSbaitest: row4,
                Loaibai: row5,
                layout: './index'
            })
        }
        if (id == 10) {
            res.render("user/tips", {
                DSbaiviet: row3,
                pages,
                layout: './index'
            });
        }
    }).catch(next);
})

router.get('/:idCM/:idCD', (req, res, next) => {
    var id = req.params.idCM;
    var id2 = req.params.idCD;

    var page = req.query.page || 1;
    if (page < 1) page = 1;
    var limit = 6;
    var offset = (page - 1) * limit;

    Promise.all([
        abcModel.baiviet(),
        botvModel.allPublic(),
        abcModel.tuvung(id2),
        abcModel.nguphap(id2),
        abcModel.dsluyennghe(id2, limit, offset),
        abcModel.countdsbainghe(id2),
        abcModel.chitietbaiviet(id2, id),
        abcModel.baivietlienquan(id2),
        abcModel.baikt(id2),
        userModel.commentBH(id2),
        userModel.commentBN(id2),
        userModel.commentBV(id2)
    ]).then(([row, row2, row3, row4, row5, count_rows, row6, row7, row8, row9, row10, row11]) => {
        for (const c of res.locals.MucHoc) {
            if (c.idLoaiBai === +id) {
                c.isActive = true;
            }
        }

        for (const d of row2) {
            if (d.idCDBaiHoc === +id2) {
                d.isSelected = true;
            }
        }

        var total = count_rows[0].total;
        var nPages = Math.floor(total / limit);
        if (total % limit > 0) nPages++;
        var pages = [];
        for (i = 1; i <= nPages; i++) {
            var obj = { value: i, active: i === +page };
            pages.push(obj);
        }

        if (id == 0) {
            res.render('TrangChu', {
                Baiviet: row,
                layout: './index'
            })
        }
        if (id == 1) {
            res.render('user/vocabulary', {
                Chude: row2,
                Tuvung: row3,
                CommentBH: row9,
                layout: './index'
            })
        }
        if (id == 3 || id == 4) {
            res.render('user/grammar', {
                Chude: row2,
                Nguphap: row4,
                CommentBH: row9,
                layout: './index'
            })
        }
        if (id == 5) {
            res.render('user/listening-list', {
                Chude: row2,
                DSluyennghe: row5,
                pages,
                CommentBN: row10,
                layout: './index'
            });
        }
        if (id == 8 || id == 9) {
            res.render("user/test-detail", {
                Chitietbaikt: row8,
                layout: './index'
            });
        }
        if (id == 10) {
            res.render("user/detail-tip", {
                Chitiet: row6,
                lienquan: row7,
                CommentBV: row11,
                layout: './index'
            });
        }
    }).catch(next);
})

router.post('/:idCM/:idBH', (req, res, next) => {
    var datetime = new Date();
    var id = req.params.idBH;
    var entity = {
        NoiDung: req.body.comment,
        ViTri: id,
        NgayDang: datetime,
        NguoiDang: req.user.idTaiKhoan
    }


    abcModel.addComment(entity)
        .then(n => {
            res.redirect('back');
        })
        .catch(err => {
            console.log(err);
            res.end('error occured!')
        });
})

router.post('/login', (req, res, next) => {
    passport.authenticate('local', (err, email, info) => {
        if (err)
            return next(err);

        if (!email) {
            return res.render('/', {
                err_message: info.message,
            })
        }

        req.logIn(email, err => {
            if (err)
                return next(err);
            return res.redirect('/trangchu');
        });
    })(req, res, next);
})



router.post('/QuenMatKhau', (req, res, next) => {
    var email = req.body.email;
    var transporter = nodemailer.createTransport({ // config mail server
        service: 'Gmail',
        auth: {
            user: 'lehung03091997@gmail.com',
            pass: '0309hung'
        }
    });

    var user = new Object();
    userModel.getPassbyEmail(email).then(row => {
        var url = 'http://localhost:5517/getnewpassword?email=' + email + '&key=' + row[0].KeyPass;
        var mainOptions = { // thiết lập đối tượng, nội dung gửi mail
            from: 'ENGLISHWORLD',
            to: email,//đến đâu
            subject: 'Email lấy lại mật khẩu từ website ENGLISHWORLD',
            html: '<a href="' + url + '"><b>Click here to reset password</b></a>',
        }
        transporter.sendMail(mainOptions, function (err, info) {
            if (err) {
                console.log(err);
                res.redirect('/');
            } else {
                console.log('Message sent: ' + info.response);
                res.redirect('/');
            }
        });
    });
})



router.post('/getnewpassword', (req, res) => {
    var mail = req.query.email;
    var key = req.query.key;
    var thaydoi = false;
    var thatbai = false;
    userModel.getPassbyEmail(mail).then(row => {

        if (row[0].KeyPass == key) {
            var pass = req.body.NewPass;
            var hash = bcrypt.hashSync(pass, 10);
            userModel.getPassbyEmail(mail).then(row => {
                var entity = {
                    idTaiKhoan: row[0].idTaiKhoan,
                    matkhau: hash,
                }
                userModel.update(entity).then(id => {
                    thaydoi = true
                    res.render('user/LayLaiMatKhau', {
                        thaydoi: thaydoi,
                        layout: './index'

                    })
                })
            })
        }
        else {
            thatbai = true;
            res.render('user/LayLaiMatKhau', {
                thatBai: thatbai,
                layout: './index'

            })

        }
    })


})








module.exports = router;