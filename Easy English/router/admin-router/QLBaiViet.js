var express = require('express');
var router = express.Router();
var baivietModel = require('../../model/BaiViet.model');
var moment = require('moment');

router.get("/",(req, res) => {
    baivietModel.list().
    then (row =>{
        var i=0;
        var stt=0;
        for (const c of row) {
            stt += 1;
            row[i].a = stt;
            i += 1;
        }
        res.render("admin/BaiViet/QLBaiViet",{
            List:row,
            layout: './indexAdmin'
        })
    }).catch();
})

router.get("/edit/:idBV", (req,res,next) =>{
    var id = req.params.idBV;

    baivietModel.chitiet(id)
    .then(row =>{
        res.render("admin/BaiViet/EditBaiViet",{
            detail: row,
            layout: './indexAdmin'
        })
    })
})

router.post("/edit/:idBV", (req,res,next) =>{
    var id = req.params.idBV;
    var temp = req.body;
    var day = moment(temp.date,'DD/MM/YYYY').format('YYYY-MM-DD');
    var entity = {
        idTips : id,
        NoiDung : temp.NoiDung,
        TieuDe : temp.TieuDe,
        NoiDungTomTat : temp.TomTat,
        NgayDang : day
    }
    baivietModel.update(entity).then(id => {
        res.redirect('/admin/baiviet')
    })
})
router.get("/addBaiViet", (req,res,next) =>{
    res.render('admin/BaiViet/AddBaiViet', {
        layout: './indexAdmin'
    })
})
router.post("/addBaiViet", (req,res,next) =>{
    var temp = req.body;
    var dob = moment(temp.date,'DD/MM/YYYY').format('YYYY/MM/DD');
    var entity = {
        TieuDe : temp.TieuDe,
        AnhDaiDien : temp.anh,
        NoiDungTomTat : temp.TomTat,
        NoiDung : temp.NoiDung,
        NgayDang : dob,
        NguoiDang: req.user.idTaiKhoan,
        LoaiBai: 10,
        Xoa: 0

    }
    baivietModel.add(entity).then(id =>{
        res.redirect('/admin/baiviet');
    })
})

router.post("/:id",(req,res) => {
    var id = req.params.id;
    var entity = {
        idTips : id,
        Xoa: 1,
    }
    baivietModel.update(entity).then(id => {
        res.redirect('/admin/baiviet');
    });
})
module.exports = router;