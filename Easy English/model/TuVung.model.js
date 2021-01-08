var db = require('../utils/Database');
module.exports = {

  add: entity => {
    return db.add('chudebaihoc', entity);
  },

  all: () => {
    return db.load('select tv.*, cd.TenBai as ChuDe from dstuvung as tv, chudebaihoc as cd where tv.Xoa = 0 and tv.CDBaiHoc = cd.idCDBaiHoc');
  },

  listBaiHoc: () => {
    return db.load('select * from chudebaihoc where LoaiBai = 1 and Xoa = 0');
  },
  listTVbyLoai: id => {
    return db.load(`select * from chudebaihoc as cd , dstuvung as tv WHERE tv.Xoa = 0 and tv.CDBaiHoc = cd.idCDBaiHoc and cd.idCDBaiHoc = '${id}'`);
  },

  getLoaibyTen : ten =>{
    return db.load(`select * from chudebaihoc where TenBai = '${ten}' and Xoa = 0`)
  },

  update: entity => {
    return db.update('dstuvung', 'idTuVung', entity);
  },
  addds: entity => {
    return db.add('dstuvung', entity);
  },
  getTVbyID : id => {
    return db.load(`select * from dstuvung where Xoa = 0 and idTuVung = '${id}' and Xoa = 0`)
  },
  getIDByTenTV: ten => {
    return db.load(`select * from dstuvung where TenTuVung = '${ten}' and Xoa = 0`)
  }

};