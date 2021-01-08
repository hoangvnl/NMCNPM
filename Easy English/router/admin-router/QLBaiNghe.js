var express = require('express');
var router = express.Router();
var baingheModel = require('../../model/BaiNghe.model');
var moment = require('moment');

router.get('/', (req, res) => {
    Promise.all([
        baingheModel.list(),
        baingheModel.GetLoai(),
    ]).then(([row, row1]) => {
        var stt = 0;
        var i = 0;
        for (const c of row) {
            stt += 1;
            row[i].a = stt;
            i += 1;
        }
        res.render('admin/BaiNghe/QLBaiNghe', {
            MucDo: row1,
            listBN: row,
            layout: './indexAdmin'
        })
    })

})

router.post('/delete/:id', (req, res) => {
    var id = req.params.id;
    var entity = {
        idBaiNghe: id,
        Xoa: 1,
    }
    baingheModel.update(entity).then(id => {
        res.redirect('/admin/bainghe')
    })
})

router.get('/edit/:id', (req, res) => {
    var id = req.params.id;
    Promise.all([
        baingheModel.GetLoai(),
        baingheModel.getListById(id)
    ]).then(([row, row1]) => {
        for (const c of row) {
            if (c.idCDBaiHoc === +row1[0].CDBaiHoc) {
                c.isSelected = true;
            }
        }
        res.render('admin/BaiNghe/EditBaiNghe', {
            dsLoai: row,
            baiNghe : row1[0],
            layout: './indexAdmin'
        })
    })

})

router.post('/edit/:id', (req, res) => {
    var id = req.params.id;
    var temp = req.body;
    var nd = moment(temp.date,'DD/MM/YYYY').format('YYYY/MM/DD');
    var entity = {
        idBaiNghe : id,
        CDBaiHoc : temp.Loai,
        NgayDang : nd,
        tenBai: temp.TenBai,
        FileAmThanh: temp.AmThanh,
        HinhAnh : temp.Anh,
        Script: temp.script,
        DapAn: temp.DapAn,
        BaiTap: temp.NoiDung
    }
    baingheModel.update(entity).then(id => {
        res.redirect('/admin/bainghe')
    })
})


router.post('/LocBaiNghe', (req, res) => {
    var id = req.body.select;
    if (isNaN(id)) {
        res.redirect('/admin/bainghe')
    }
    else {
        Promise.all([
            baingheModel.GetLoai(),
            baingheModel.listBaiKTbyLoai(id)
        ]).then(([cate1, cate2]) => {
            var stt = 0;
            var i = 0;
            for (const c of cate2) {
                stt += 1;
                cate2[i].a = stt;
                i += 1;
            }
            for (const c of cate1) {
                if (c.idCDBaiHoc === +id) {
                    c.isSelected = true;
                }
            }
            res.render('admin/BaiNghe/QLBaiNghe', {
                MucDo: cate1,
                listBN: cate2,
                layout: './indexAdmin'
            });
        })
    }
})

router.post('/addLoai', (req, res) => {
    var temp = req.body.newCD
    var entity = {
        TenBai: temp,
        LoaiBai: 5,
        Xoa: 0
    }
    baingheModel.add(entity).then(row => {
        res.redirect('/admin/bainghe')
    })
})

router.get('/addBai', (req, res) => {
    baingheModel.GetLoai().then(row => {
        var a = 2;
        res.render('admin/BaiNghe/AddBaiNghe', {
            MucDo : row,
            layout: './indexAdmin'
        })
    })
})


router.post('/addBai', (req, res) => {
    var temp = req.body;
    var nd = moment(temp.date,'DD/MM/YYYY').format('YYYY/MM/DD');
    var entity = {
        CDBaiHoc : temp.Loai,
        NgayDang : nd,
        tenBai: temp.TenBai,
        FileAmThanh: temp.AmThanh,
        HinhAnh : temp.Anh,
        Script: temp.script,
        DapAn: temp.DapAn,
        BaiTap: temp.NoiDung,
        Xoa: 0
    }
    baingheModel.addBaiNge(entity).then(id => {
        res.redirect('/admin/bainghe')
    })
})



module.exports = router;