var express = require('express');
var router = express.Router();
var bcrypt = require('bcryptjs');
var moment = require('moment');
var passport = require('passport');
var userModel = require('../../model/thanhvien.model')
var phanHeModel = require('../../model/PhanHe.model');
var TVModel = require('../../model/TuVung.model');


router.get('/', (req, res, next) => {

    res.render('admin/index-Admin', {
        layout: './index'
    })
})

router.get('/taikhoan', (req, res, next) => {
    Promise.all([
        userModel.all(),
        phanHeModel.all()
    ]).then(([rows1, rows2]) => {
        var stt = 0;
        var i = 0;
        for (const c of rows1) {
            stt += 1;
            rows1[i].a = stt;
            i += 1;
        }
        res.render('admin/TaiKhoan/QLTaiKhoan', {
            listTk: rows1,
            listPH: rows2,
            layout: './index'
        })
    }).catch(next);
})

router.post('/taikhoan', (req, res, next) => {
    var id = req.body.phanhe;
    if (isNaN(id)) {
        res.redirect('/admin/taikhoan')
    }
    else {
        Promise.all([
            phanHeModel.all(),
            userModel.getListbyPH(id)
        ]).then(([cate1, cate2]) => {
            var stt = 0;
            var i = 0;
            for (const c of cate2) {
                stt += 1;
                cate2[i].a = stt;
                i += 1;
            }
            for (const c of cate1) {
                if (c.idPhanHe === +id) {
                    c.isSelected = true;
                }
            }


            res.render('admin/TaiKhoan/QLTaiKhoan', {
                listPH: cate1,
                listTk: cate2,
                layout: './index'
            });
        })
    }

})

router.post('/them', (req, res, next) => {
    var saltRounds = 10;
    var nowDate = new Date();
    var hash = bcrypt.hashSync(req.body.pass, saltRounds);
    var dob = req.body.bdate;
    var entity = {
        hoten: req.body.HoTen,
        ngaysinh: dob,
        NgayTaoTK: nowDate,
        matkhau: hash,
        email: req.body.email,
        phanhe: 1,
        Xoa: 0,
    }
    userModel.add(entity).then(id => {
        res.redirect('/admin/taikhoan');
    })
})

router.post('/themtv', (req, res) => {
    var temp = req.body;
    var a = temp.chude;
    entity = {
        CDBaiHoc: temp.chude,
        TenTuVung: temp.tentv,
        PhienAm: temp.CachPhatAm,
        FileAmThanh: temp.fileAmThanh,
        FileHinhAnh: temp.fileHinh,
        YNghia: temp.YNghia,
        ViDu: temp.Vidu,
        LoaiTu: temp.LoaiTu,
        Xoa: 0,
    }

    TVModel.addds(entity).then(id => {
        res.redirect('/admin/tuvung')
    })
})


router.get('/profile', (req, res) => {
    var a = req.user.ngaysinh;
    res.render('admin/profile', {
        ns: a,
        layout: './index'
    })
})

router.post('/profile', (req, res) => {
    var pro = req.body;
    var dob = moment(pro.Date, "DD/MM/YYYY").format("YYYY/MM/DD");
    userModel.getIDByEmail(pro.email).then(row => {
        var entity = {
            idTaiKhoan: row[0].idTaiKhoan,
            hoten: pro.HoTen,
            ngaysinh: dob
        }
        userModel.update(entity);
    })
    req.user.hoten = pro.HoTen;
    req.user.ngaysinh = pro.Date;
    res.redirect('/admin');
})



module.exports = router;