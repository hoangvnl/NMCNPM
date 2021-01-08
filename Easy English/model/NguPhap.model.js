var db = require('../utils/Database');
module.exports = {
    all: () => {
        return db.load('select ct.*, cd.TenBai as ChuDe from dscautruc as ct, chudebaihoc as cd where ct.Xoa = 0 and ct.CDBaiHoc = cd.idCDBaiHoc');
    },
    getNPbyID: id => {
        return db.load(`select ct.* , cd.* from dscautruc as ct,chudebaihoc as cd where ct.idCauTruc = '${id}' and ct.Xoa = 0 and ct.CDBaiHoc = cd.idCDBaiHoc`)
    },
    updateCT: entity => {
        return db.update('dscautruc', 'idCauTruc', entity);
    },
    updateCD: entity => {
        return db.update('chudebaihoc', 'idCDBaiHoc', entity);
    },
    GetCDByten: ten => {
        return db.load(`select * from chudebaihoc where TenBai = '${ten}' and Xoa = 0`)
    },
    addChuDe: chude => {
        return db.add('chudebaihoc', chude);
    },
    addCauTruc: cauTruc => {
        return db.add('dscautruc', cauTruc);
    },
    
    


}