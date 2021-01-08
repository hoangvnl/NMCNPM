var express = require('express');
var router = express.Router();
var abcModel = require('../../model/DSmuchoc.model');
var userModel = require('../../model/thanhvien.model');

router.get('/:idBH', (req, res, next) => {
    var id2 = req.params.idBH;
    for (const c of res.locals.MucHoc) {
        if (c.idLoaiBai === +5) {
            c.isActive = true;
        }
    }
    Promise.all([
        abcModel.bainghe(id2),
        userModel.commentBN(id2),
    ])

        .then(([row, row2]) => {
            res.render('user/listening', {
                Bainghe: row,
                CommentBN: row2,
                layout: './index'
            })
        }).catch(next);
});

router.post('/:idBH', (req, res, next) => {
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
});


module.exports = router;