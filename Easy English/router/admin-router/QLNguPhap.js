var express = require('express');
var router = express.Router();
var NPModel = require('../../model/NguPhap.model')
var moment = require('moment');

router.get('/', (req, res) => {
    NPModel.all().then(rows => {
        var dem = 0;
        var i = 0;
        for (const c of rows) {
            dem += 1;
            rows[i].stt = dem;
            i += 1;
        }
        res.render('admin/NguPhap/QLNguPhap', {
            dsCauTruc: rows,
            layout: './indexAdmin'
        })
    })

})

router.get('/chitiet/:id', (req, res) => {
    var id = req.params.id;
    var check = true;
    NPModel.getNPbyID(id).then(row => {

        res.render('admin/NguPhap/EditNguPhap', {
            Check: check,
            chitiet: row,
            layout: './indexAdmin'
        })
    })
})


router.post('/chinhsua', (req, res) => {
    var temp = req.body;
    var dob = moment(temp.NgayDang, 'DD/MM/YYYY').format('YYYY-MM-DD');
    NPModel.getNPbyID(temp.Ma).then(row => {
        var entity = {
            idCauTruc: temp.Ma,
            CDBaiHoc: row[0].CDBaiHoc,
            NoiDung: temp.NoiDung,
            NgayDang: dob,
            Xoa: 0
        }
        var entity1 = {
            idCDBaiHoc: row[0].idCDBaiHoc,
            TenBai: temp.ChuDe,
            LoaiBai: row[0].LoaiBai,
            Xoa: 0,
        }
        NPModel.updateCT(entity).then(id1 => {
        });
        NPModel.updateCD(entity1).then(id2 => {
        });
        res.redirect('/admin/nguphap');

    })

})

router.get('/add', (req, res) => {
    var check = false;
    var date = new Date();
    var nowday = moment(date, 'DD/MM/YYYY').format('YYYY/MM/DD')
    res.render('admin/NguPhap/EditNguPhap', {
        Check: check,
        Nowday: nowday,
        layout: './indexAdmin'
    })
})

router.post('/add', (req, res) => {
    var temp = req.body;
    entitya = {
        TenBai: temp.ChuDe,
        LoaiBai: temp.LoaiBai,
        Xoa: 0,
    }
    NPModel.addChuDe(entitya).then(row => {
        var dob = moment(temp.NgayDang, 'DD/MM/YYYY').format('YYYY-MM-DD');
        entityb = {
            CDBaiHoc: row,
            NoiDung: temp.NoiDung,
            NgayDang: dob,
            Xoa: 0,
        };

        NPModel.addCauTruc(entityb);
        res.redirect('/admin/nguphap')
    });

    
})




// router.get('/is-exist', (req, res, next) => {
//     var ten = req.query.ChuDe;
//     NPModel.GetCDByten(ten).then(rows => {
//         if (rows.length > 0) {
//             return res.json(false);
//         }
//         return res.json(true);
//     })
// })

router.post('/delete/:id', (req, res) => {
    var id = req.params.id;
    NPModel.getNPbyID(id).then(row => {
        var entityNP = {
            idCauTruc: id,
            Xoa: 1,
        }
        var entityCD = {
            idCDBaiHoc: row[0].CDBaiHoc,
            Xoa: 1,
        }
        Promise.all([
            NPModel.updateCT(entityNP),
            NPModel.updateCD(entityCD),
        ]).then(([id, id1]) => {
            res.redirect('/admin/nguphap');
        });

    })
})


module.exports = router;