const db = require('../utils/Database');

module.exports = {
    allByUserID(id) {
        return db.load(`select * from dstuvung where idbotv in (select idbotv from botv where idbotv in (select idbotv from botvluu where idtaikhoan = ${id}) or idtaikhoantao = ${id})`)
    },
    allByChuDe(id) {
        return db.load(`select * from dstuvung where idbotv = ${id} and Xoa = 0`)
    },
    add: entity => {
        return db.add('dstuvung', entity);
    }
}