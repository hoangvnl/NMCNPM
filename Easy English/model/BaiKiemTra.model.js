var db = require('../utils/Database');

module.exports = {
  list: () => {
    return db.load('SELECT * FROM baitest bt, LoaiBai lb WHERE bt.LoaiBai = lb.idLoaiBai and bt.Xoa = 0');
  },
  getListById: idBV =>{
    return db.load(`SELECT * FROM baitest bt, LoaiBai lb WHERE bt.LoaiBai = lb.idLoaiBai and bt.Xoa = 0 and bt.idBaiTest = '${idBV}'`)
  },
  update: entity => {
    return db.update('baitest', 'idBaiTest', entity);
  },
  add: entity => {
    return db.add('baitest', entity);
  },
  GetLoai: () => {
    return db.load('select * from loaibai where LBCha = 6 and Xoa = 0')
  },
  listBaiKTbyLoai : id =>{
    return db.load(`SELECT * FROM baitest bt, LoaiBai lb WHERE bt.LoaiBai = lb.idLoaiBai and bt.Xoa = 0 and bt.LoaiBai = '${id}'`)
  }
}