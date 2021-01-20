var express = require('express');
var router = express.Router();
var moment = require('moment');
var passport = require('passport');
var TVModel = require('../../model/TuVung.model')
const botvModel = require('../../model/BoTV.model')
const tvModel = require('../../model//TV.model')

//req.session.userAuth;

router.get('/', (req, res) => {


    // console.log(req.session.userAuth)
    // console.log('-----------------------------------')
    Promise.all([
        botvModel.allByUserID(req.session.userAuth.idTaiKhoan),
        TVModel.all(),

    ]).then(([rows1, rows2]) => {

        // console.log(rows1);

        var dem = 0;
        var i = 0;
        for (const c of rows2) {
            dem += 1;
            rows2[i].stt = dem;
            i += 1;
        }
        for(const botv of rows1) {
            // console.log(botv);
            if(botv.idtaikhoantao == req.session.userAuth.idTaiKhoan) {
                botv['sohuu'] = true;
                // console.log(botv);
            }
        }
        res.render('user/TuVung/QLTuVung', {
            chude: rows1,
            listTV: rows2,
            sohuu: false,
            all: true,
            layout: './index'
        })
    })
})

router.post('/loc', (req, res, next) => {
    var id = req.body.LoaiTu;
    const idcd = id;
    
    // console.log(`------------------------`)
    // console.log(id);
    // console.log(`------------------------`)

    if (isNaN(id)) {
        res.redirect('/quanly/tuvung')
    }
    else {
        Promise.all([
            botvModel.allByUserID(req.session.userAuth.idTaiKhoan),
            tvModel.allByChuDe(id),
            botvModel.single(id)
        ]).then(([cate1, cate2, cate3]) => {
            let sohuu = false;
            if(cate3[0].idtaikhoantao == req.session.userAuth.idTaiKhoan) {
                sohuu = true;
                for(const c of cate2) {
                    c['sohuu'] = true;
                }
            }
            for (const c of cate1) {
                // console.log(c);
                if(c.idtaikhoantao == req.session.userAuth.idTaiKhoan) {
                    c['sohuu'] = true;
                }
                if (c.idbotv === +id) {
                    c.isSelected = true;
                }
            }
            
            res.render('user/TuVung/QLTuVung', {
                chude: cate1,
                listTV: cate2,
                daloc: true,
                idcd,
                sohuu,
                layout: './index'
            });
        })
    }
})

router.post('/addCate', (req, res, next) => {
    var ten = req.body.Cate;
    // console.log(ten);
    // console.log(req.body.congkhai);
    var entity = {
        tenBoTV: ten,
        idtaikhoantao: req.session.userAuth.idTaiKhoan,
        congkhai: req.body.congkhai
    }
    // console.log(entity);
    // var entity = {
    //     TenBai: ten,
    //     LoaiBai: 1,
    //     Xoa: 0
    // }
    botvModel.add(entity).then(id => {
        res.redirect('/quanly/tuvung')
    })

})

router.post('/delCate', (req, res, next) => {
    var idcd = req.body.idcd;
    botvModel.del(idcd).then(id => {
        res.redirect('/quanly/tuvung')
    })
    // console.log(idcd);
    // var entity = {
    //     idCDBaiHoc: idcd,
    //     LoaiBai: 1,
    //     Xoa: 1
    // }
    // var newEntity = {
    //     CDBaiHoc: idcd,
    //     Xoa: 1
    // }
    // TVModel.updatetvcd(newEntity).then().catch();
    // TVModel.updatecd(entity).then(id => {
    //     res.redirect('/quanly/tuvung')
    // })

})

router.post('/unsaveCate', (req, res, next) => {
    var idcd = req.body.idcd;
    botvModel.unsave(req.session.userAuth.idTaiKhoan, idcd).then(id => {
        res.redirect('/quanly/tuvung')
    })
    // console.log(idcd);
    // var entity = {
    //     idCDBaiHoc: idcd,
    //     LoaiBai: 1,
    //     Xoa: 1
    // }
    // var newEntity = {
    //     CDBaiHoc: idcd,
    //     Xoa: 1
    // }
    // TVModel.updatetvcd(newEntity).then().catch();
    // TVModel.updatecd(entity).then(id => {
    //     res.redirect('/quanly/tuvung')
    // })

})

router.post('/luuBoTV', (req, res, next) => {
    var idcd = req.body.idcd;
    const entity = {
        idtaikhoan: req.session.userAuth.idTaiKhoan, 
        idbotv: idcd
    };
    botvModel.save(entity).then(id => {
        res.redirect(`/1/${idcd}`)
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
        // console.log(err);
        res.end('error occured.')
    });

})

router.get('/chinhsua/:ida', (req, res, next) => {
    var id = req.params.ida;
    Promise.all([
        TVModel.getTVbyID(id),
        botvModel.allByUserID(req.session.userAuth.idTaiKhoan)
    ]).then(([rows1, rows2]) => {
        for (const c of rows2) {
            if (c.idbotv === +rows1[0].idbotv) {
                c.isSelected = true;
            }
        }
        console.log(rows1, rows2);
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

router.post('/themtv',(req,res)=>{
    var temp = req.body;
    var a = temp.chude;
    entity = {
        idbotv : temp.chude,
        TenTuVung : temp.tentv,
        // PhienAm : temp.CachPhatAm,
        // FileAmThanh: temp.fileAmThanh,
        // FileHinhAnh: temp.fileHinh,
        YNghia: temp.YNghia,
        ViDu: temp.Vidu,
        LoaiTu : temp.LoaiTu,
        Xoa:  0,
    }
    // tvModel.add(entity);
    tvModel.add(entity).then(id => {
        res.redirect('/quanly/tuvung')
    })
})

router.get('/search', (req, res) => {
    // console.log(req.query);
    const searchStr = '%' + req.query.search + '%';
    // console.log(searchStr);
    botvModel.search(searchStr).then(rows => {
        console.log(rows);
        res.render('user/TuVung/TimKiem', {
            listBoTV: rows,
            layout: './index'
        })
    }).catch(err => {
        res.end('error occured')
    });
})


module.exports = router;