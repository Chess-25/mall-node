const mysql = require('mysql')

const config = {
  // 数据库配置
  host: '127.0.0.1',
  user: 'root',
  password: '123456',
  port: '3306',
  database: 'mysql',
}
// 连接数据库，使用mysql连接池的方式
  // 连接对象
const sqlConnect = (sql, sqlArr, callBack)=> {
  let pool = mysql.createPool(config)
  pool.getConnection((err,conn) =>{
    if (err) {
      console.log('连接失败');
      return
      } else {
        console.log('连接成功');
      }

      // 事件驱动回调
      conn.query(sql,sqlArr, callBack)
      conn.release()
    })
  }
module.exports = {
  sqlConnect
}