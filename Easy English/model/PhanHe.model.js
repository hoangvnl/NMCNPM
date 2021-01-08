var db = require('../utils/Database');
module.exports = {
    all: () => {
        return db.load('select * from phanhe');
    },

    getIdbyTen: id =>{
        return db.load(`select * form phanhe where TenPhanHe = '${id}` )
    }
};

