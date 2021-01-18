const db = require('../utils/Database');

module.exports = {
    allPublic() {
        return db.load('select * from botv where congkhai = 1');
    },
    allByUserID(id) {
        return db.load(`select * from botv where idbotv in (select idbotv from botvluu where idtaikhoan = ${id}) or idtaikhoantao = ${id}`)
    },
    nguoiTao(id) {
        return db.load(`select * from taikhoan where idtaikhoan in (select idtaikhoantao from botv where idbotv = ${id})`)
    }
}