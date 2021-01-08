var db = require('../utils/Database');

module.exports = {
    list: () => {
        return db.load('SELECT * FROM dsbainghe bn, chudebaihoc cd WHERE bn.CDBaiHoc = cd.idCDBaiHoc and bn.Xoa = 0');
    },
    getListById: id => {
        return db.load(`SELECT * FROM dsbainghe WHERE Xoa = 0 and idBaiNghe = ${id}`)
    },
    update: entity => {
        return db.update('dsbainghe', 'idBaiNghe', entity);
    },
    add: entity => {
        return db.add('chudebaihoc', entity);
    },
    GetLoai: () => {
        return db.load('select * from chudebaihoc where LoaiBai = 5 and Xoa = 0')
    },
    listBaiKTbyLoai: id => {
        return db.load(`SELECT * FROM dsbainghe bn, chudebaihoc cd WHERE bn.CDBaiHoc = cd.idCDBaiHoc and bn.Xoa = 0 and bn.CDBaiHoc ='${id}'`)
    },
    addBaiNge: entity => {
        return db.add('dsbainghe', entity);
    },
}