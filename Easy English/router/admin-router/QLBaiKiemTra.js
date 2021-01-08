var express = require('express');
var router = express.Router();
var baikiemtraModel = require('../../model/BaiKiemTra.model');
var moment = require('moment');

router.get('/', (req, res) => {
    Promise.all([
        baikiemtraModel.list(),
        baikiemtraModel.GetLoai()
    ]).then(([row, row1]) => {
        var i = 0;
        var stt = 0;
        for (const c of row) {
            stt += 1;
            row[i].a = stt;
            i += 1;
        }
        res.render('admin/BaiKiemTra/QLBaiKiemTra', {
            Loai: row1,
            ListKT: row,
            layout: './indexAdmin'
        })
    })
})

router.post('/delete/:id', (req, res) => {
    var id = req.params.id;
    var entity = {
        idBaiTest: id,
        Xoa: 1,
    }
    baikiemtraModel.update(entity).then(id => {
        res.redirect('/admin/baikiemtra')
    })
})

router.get('/editbaikt/:id', (req, res) => {
    var id = req.params.id;
    Promise.all([
        baikiemtraModel.getListById(id),
        baikiemtraModel.GetLoai()
    ]).then(([row, row1]) => {
        for (const c of row1) {
            if (c.idLoaiBai === +row[0].LoaiBai) {
                c.isselect = true;
            }
        }
        res.render('admin/BaiKiemTra/EditBaiKiemTra', {
            detail: row,
            LoaiBai: row1,
            layout: './indexAdmin'
        })
    })
})

router.post('/editbaikt/:id', (req, res) => {
    var id = req.params.id;
    var temp = req.body;
    var dob = moment(temp.date, 'DD/MM/YYYY').format('YYYY/MM/DD');
    var entity = {
        idBaiTest: id,
        LoaiBai: temp.Loai,
        NgayDang: dob,
        TieuDe: temp.TieuDe,
        DapAn: temp.DapAn,
        NoiDung: temp.NoiDung
    }
    baikiemtraModel.update(entity).then(id => {
        res.redirect('/admin/baikiemtra')
    })
})

router.post('/LocBaiKT', (req, res) => {
    var id = req.body.select;
    if (isNaN(id)) {
        res.redirect('/admin/baikiemtra')
    }
    else {
        Promise.all([
            baikiemtraModel.GetLoai(),
            baikiemtraModel.listBaiKTbyLoai(id)
        ]).then(([cate1, cate2]) => {
            var stt = 0;
            var i = 0;
            for (const c of cate2) {
                stt += 1;
                cate2[i].a = stt;
                i += 1;
            }
            for (const c of cate1) {
                if (c.idLoaiBai === +id) {
                    c.isSelected = true;
                }
            }
            res.render('admin/BaiKiemTra/QLBaiKiemTra', {
                Loai: cate1,
                ListKT: cate2,
                layout: './indexAdmin'
            });
        })
    }
})


router.get('/addKT', (req, res) => {
    baikiemtraModel.GetLoai().then(row => {
        res.render('admin/BaiKiemTra/AddBaiKiemTra',{
            Loai : row,
            layout: './indexAdmin'
        })
    })    
})

router.post('/addKT', (req, res) => {
    var temp = req.body;
    var dob = moment(temp.date,'DD/MM/YYYY').format('YYYYY/MM/DD');
    var entity = {
        DapAn: temp.DapAn,
        NgayDang : dob,
        LoaiBai : temp.Loai,
        TieuDe : temp.TieuDe,
        NoiDung : temp.NoiDung,
        Xoa: 0,
    }
    baikiemtraModel.add(entity).then(row => {
        res.redirect('/admin/baikiemtra')
    })
})




module.exports = router;