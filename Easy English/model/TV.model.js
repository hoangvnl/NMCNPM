const db = require('../utils/Database');

module.exports = {
    allByUserID(id) {
        return db.loat(`select * from dstuvung where idbotv in (select idbotv from botv where idbotv in (select idbotv from botvluu where idtaikhoan = ${id}) or idtaikhoantao = ${id})`)
    }
}