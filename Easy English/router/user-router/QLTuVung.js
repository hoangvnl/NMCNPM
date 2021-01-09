var express = require('express');
var router = express.Router();
var moment = require('moment');
var passport = require('passport');
var TVModel = require('../../model/TuVung.model')

router.get('/', (req, res) => {

    Promise.all([
        TVModel.listBaiHoc(),
        TVModel.all(),

    ]).then(([rows1, rows2]) => {
        var dem = 0;
        var i = 0;
        for (const c of rows2) {
            dem += 1;
            rows2[i].stt = dem;
            i += 1;
        }
        res.render('user/TuVung/QLTuVung', {
            chude: rows1,
            listTV: rows2,
            layout: './index'
        })
    })
})

router.post('/loc', (req, res, next) => {
    var id = req.body.LoaiTu;
    const idcd = id;

    if (isNaN(id)) {
        res.redirect('/quanly/tuvung')
    }
    else {
        Promise.all([
            TVModel.listBaiHoc(),
            TVModel.listTVbyLoai(id)
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
            res.render('user/TuVung/QLTuVung', {
                chude: cate1,
                listTV: cate2,
                daloc: true,
                idcd,
                layout: './index'
            });
        })
    }
})

router.post('/addCate', (req, res, next) => {
    var ten = req.body.Cate;
    var entity = {
        TenBai: ten,
        LoaiBai: 1,
        Xoa: 0
    }
    TVModel.add(entity).then(id => {
        res.redirect('/quanly/tuvung')
    })

})

router.post('/delCate', (req, res, next) => {
    var idcd = req.body.idcd;
    console.log(idcd);
    var entity = {
        idCDBaiHoc: idcd,
        LoaiBai: 1,
        Xoa: 1
    }
    var newEntity = {
        CDBaiHoc: idcd,
        Xoa: 1
    }
    TVModel.updatetvcd(newEntity).then().catch();
    TVModel.updatecd(entity).then(id => {
        res.redirect('/quanly/tuvung')
    })

})

router.get('/is-exsist', (req, res, next) => {
    var Cate = req.query.Cate;
    TVModel.getLoaibyTen(Cate).then(rows => {
        if (rows.length > 0) {
            return res.json(false);
        }
        return res.json(true);
    })
})

router.post('/delete/:id', (req, res, next) => {
    var id = req.params.id;
    var entity = {
        idTuVung: id,
        Xoa: 1
    }
    TVModel.update(entity).then(n => {
        res.redirect('/quanly/tuvung');
    }).catch(err => {
        console.log(err);
        res.end('error occured.')
    });

})

router.get('/chinhsua/:ida', (req, res, next) => {
    var id = req.params.ida;
    Promise.all([
        TVModel.getTVbyID(id),
        TVModel.listBaiHoc()
    ]).then(([rows1, rows2]) => {
        for (const c of rows2) {
            if (c.idCDBaiHoc === +rows1[0].CDBaiHoc) {
                c.isSelected = true;
            }
        }

        res.render('user/TuVung/EditTuVung', {
            tuvung: rows1[0],
            chude: rows2,
            layout: './index'
        })
    })

})

router.post('/chinhsua', (req, res) => {
    var temp = req.body;
    TVModel.getIDByTenTV(temp.tentv).then(row => {
        var entity = {
            idTuVung: row[0].idTuVung,
            CDBaiHoc: temp.chude,
            TenTuVung: temp.tentv,
            PhienAm: temp.CachPhatAm,
            FileAmThanh: temp.fileAmThanh,
            FileHinhAnh: temp.fileHinh,
            YNghia: temp.YNghia,
            ViDu: temp.Vidu,
            LoaiTu: temp.LoaiTu,
            Xoa: 0

        }
        TVModel.update(entity).then(id => {
            res.redirect('/quanly/tuvung')
        })
    })
})


module.exports = router;