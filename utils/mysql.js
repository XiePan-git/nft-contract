const mysql = require('mysql');
const config = {
  // host: '127.0.0.1',
  host: '81.71.137.202',
  user: 'crystal',
  password: 'ji43X7jMSjLZSX2w',
  port: '3306',
  database: 'crystal',
}
const pool = mysql.createPool(config);

function query(sql, param = [], callback) {
  pool.getConnection(function(conn_err, conn){
    if(conn_err){
      callback(conn_err, null, null)
    }else{
      conn.query(sql, param, function(query_err, rows, fields){
        conn.release()
        callback(query_err, rows, fields)
      })
    }
  })
}

function syncQuery(sql, params = []) {
  return new Promise((resolve, reject) => {
    query(sql, params, (err, data) => {
      if (err) reject(err);
      else resolve(data);
    });
  });
}

module.exports = {
  query,
  syncQuery
}