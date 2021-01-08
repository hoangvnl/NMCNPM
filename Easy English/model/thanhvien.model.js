var db = require('../utils/Database');
module.exports = {

  add: entity => {
    return db.add('taikhoan', entity);
  },
  
  getPassbyEmail: email =>{
    return db.load(`select * from taikhoan where email = '${email}' and Xoa = 0`);
  },
  checkPass: pass => {
    return db.load(`select * from taikhoan where matKhau = '${pass}' and Xoa = 0`);
  },

  all: () => {
    return db.load('select * from taikhoan where Xoa = 0');
  },

  getListbyPH: id =>{
    return db.load(`select * FROM phanhe as ph , taikhoan as tk where tk.Xoa = 0 and ph.idPhanHe = '${id}' and tk.phanhe = ph.idPhanHe`  )
  },

  delete: id => {
    return db.delete('taikhoan', 'idTaiKhoan', id);
  }
  ,
  update: entity => {
    return db.update('taikhoan', 'idTaiKhoan', entity);
  },

  GetAllById: id => {
    return db.load(`select * from taikhoan where idTaiKhoan = '${id}' and Xoa = 0`);
  },

  getIDByEmail: email => {
    return db.load(`select * from taikhoan where email = '${email}' and Xoa = 0`);
  },

  commentBV: (idBV) => {
    return db.load(`SELECT bl.*, tk.hoten FROM binhluan AS bl, taikhoan AS tk, tips AS t WHERE t.idTips = ${idBV} AND t.idTips = bl.ViTri AND bl.NguoiDang = tk.idTaiKhoan AND bl.Xoa =0 order by bl.NgayDang desc`);
  },
  commentBH: (idBH) => {
    return db.load(`SELECT bl.*, tk.hoten FROM binhluan AS bl, taikhoan AS tk, chudebaihoc AS cdbh WHERE cdbh.idCDBaiHoc = ${idBH} AND cdbh.idCDBaiHoc = bl.ViTri AND bl.NguoiDang = tk.idTaiKhoan AND bl.Xoa =0 order by bl.NgayDang desc`);
  },
  commentBN: (idBN)=>{
    return db.load(`SELECT bl.*, tk.hoten FROM binhluan AS bl, taikhoan AS tk, dsbainghe AS bn WHERE bn.idBaiNghe = ${idBN} AND bn.idBaiNghe = bl.ViTri AND bl.NguoiDang = tk.idTaiKhoan AND bl.Xoa =0 order by bl.NgayDang desc`)
  },

  addComment: entity => {
    return db.add(`binhluan`, entity);
  },

  getRowByid: id => {
    return db.load(`select * from taikhoan where idTaiKhoan = '${id}' and Xoa = 0`);
  },
};