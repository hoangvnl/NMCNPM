var db = require('../utils/Database');

module.exports = {
  menu: () => {
    return db.load('SELECT * FROM loaibai WHERE Xoa =0 AND LBcha = 0');
  },
  dropdown: () => {
    return db.load(`SELECT lb1.*, lb2.TenLoaiBai as cha FROM loaibai AS lb1, loaibai AS lb2 WHERE lb1.Xoa=0 AND lb1.LBcha !=0 AND lb1.LBcha = lb2.idLoaiBai`);
  },
  baiviet: () => {
    return db.load(`SELECT * FROM tips ORDER BY NgayDang DESC LIMIT 2`)
  },
  chude: (idCM) => {
    return db.load(`SELECT cd.* FROM chudebaihoc as cd, loaibai AS lb WHERE lb.idLoaiBai = cd.LoaiBai AND lb.idLoaiBai= ${idCM} AND lb.Xoa=0 AND cd.Xoa=0`)
  },
  tuvung: (idCD) => {
    return db.load(`SELECT dstv.* FROM dstuvung AS dstv WHERE dstv.CDBaiHoc = ${idCD} AND dstv.Xoa=0`);
  },
  nguphap: (idCD) => {
    return db.load(`SELECT dsct.*, cd.TenBai FROM dscautruc AS dsct, chudebaihoc AS cd WHERE dsct.CDBaiHoc = ${idCD} AND cd.idCDBaiHoc = dsct.CDBaiHoc AND dsct.Xoa=0 AND cd.Xoa=0`)
  },
  dsluyennghe: (idCD,limit,offset) =>{
    return db.load(`SELECT ds.*, cd.LoaiBai FROM dsbainghe AS ds, chudebaihoc AS cd WHERE ds.CDBaiHoc = ${idCD} AND ds.Xoa =0 AND ds.CDBaiHoc = cd.idCDBaiHoc LIMIT ${limit} OFFSET ${offset}`)
  },
  bainghe: (idBH) =>{
    return db.load(`SELECT * FROM dsbainghe AS ds WHERE ds.idBaiNghe = ${idBH} AND ds.Xoa =0`);
  },
  dsbaiviet: (limit,offset) =>{
    return db.load(`SELECT * FROM tips WHERE Xoa = 0 ORDER BY NgayDang DESC LIMIT ${limit} OFFSET ${offset}`)
  },
  countbaiviet: (idCM) =>{
    return db.load(`select count(*) as total from tips where LoaiBai = ${idCM} AND Xoa =0`)
  },
  countdsbainghe: (idCD) =>{
    return db.load(`Select count(*) as total from dsbainghe where CDBaiHoc = ${idCD} AND Xoa =0`)
  },
  chitietbaiviet: (idBV, idCM) =>{
    return db.load(`SELECT t.*, tk.hoten FROM tips AS t, taikhoan AS tk WHERE t.Xoa = 0 AND tk.Xoa =0 AND t.idTips = ${idBV} AND t.LoaiBai =${idCM} AND t.NguoiDang = tk.idTaiKhoan`)
  },
  baivietlienquan: (idBV) => {
    return db.load(`SELECT t2.* FROM tips as t1, tips AS t2 WHERE t1.idTips = ${idBV} AND t2.idTips != t1.idTips ORDER BY t2.NgayDang DESC LIMIT 2`)
  },
  dsbaikt: (idCM)=>{
    return db.load(`SELECT bt.* FROM baitest AS bt, loaibai AS lb WHERE bt.LoaiBai = ${idCM} AND bt.Xoa = 0 AND lb.idLoaiBai = bt.LoaiBai AND lb.Xoa=0 ORDER BY bt.NgayDang DESC`)
  },
  loaibai: (idCM)=>{
    return db.load(`SELECT * FROM loaibai WHERE idLoaiBai = ${idCM}`)
  },
  baikt: (idBH) =>{
    return db.load(`SELECT * FROM baitest AS bt WHERE bt.idBaiTest = ${idBH} AND bt.Xoa = 0`);
  },
  addComment: entity => {
    return db.add(`binhluan`, entity);
  }
}