const db = require('../utils/Database');

module.exports = {
    allPublic() {
        return db.load('select * from botv where congkhai = 1');
    },
    allByUserID(id) {
        if(id == undefined) {
            return db.load('select * from botv where congkhai = 1');
        }
        return db.load(`select * from botv where idbotv in (select idbotv from botvluu where idtaikhoan = ${id}) or idtaikhoantao = ${id}`)
    },
    nguoiTao(id) {
        return db.load(`select * from taikhoan where idtaikhoan in (select idtaikhoantao from botv where idbotv = ${id})`)
    },
    single(id) {
        return db.load(`select * from botv where idbotv = ${id}`)
    },
    add: entity => {
        return db.add('botv', entity);
    },
    del: entity => {
        return db.delete('botv', 'idbotv', entity);
    },
    unsave(idtaikhoan, idbotv) {
        return db.load(`delete from botvluu where idtaikhoan = ${idtaikhoan} and idbotv = ${idbotv}`)
    },
    save(entity) {
        return db.add('botvluu', entity);
    },
    checkSave(idtaikhoan, idbotv) {
        return db.load(`select * from botvluu where idtaikhoan = ${idtaikhoan} and idbotv = ${idbotv}`);
    },
    checkAvailable(idtaikhoan, idbotv) {
        return db.load(`select * from botv where idtaikhoantao <> ${idtaikhoan} and congkhai = 1 and idbotv not in (select idbotv from botvluu where idtaikhoan = 1) and idbotv = ${idbotv}`)
    },
    search(string) {
        return db.load(`Select botv.*, taikhoan.hoten from botv join taikhoan on botv.idtaikhoantao = taikhoan.idTaiKhoan where tenBoTV LIKE "${string}" and congkhai = 1`);
    }
}