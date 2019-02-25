var mysql = require("mysql");
var db = {};
db.query = function (sql,queryArray, callback) {
    var connect = mysql.createConnection({
        host:'localhost',
        user: 'root',
        password: 'abc123456',
        database:'graduateproject',
        port: 3306,
        multipleStatements: true //可以插入多条sql语句
    });
    connect.connect();
    connect.query(sql,queryArray, function (err,rows) {
      console.log(sql)
        if(err)console.log(err);
        callback(rows);
    });
    connect.end();
};

module.exports = db;
