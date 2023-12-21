// 连接数据库
const mysql = require('mysql')

const pool = mysql.createPool({
  host: '127.0.0.1',
  user: 'root',
  password: '123456',
  port: '3306',
  database: 'mysql',
})

module.exports  = pool 