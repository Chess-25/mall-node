const express = require("express");
const router = express.Router();
const pool = require('../../service/pool')
const moment = require('moment');
//编辑用户
router.post('/edit', (req, res) => {
  let {id,username,realname,password,cellphone,depName,postName} = req.body
  pool.getConnection(function(err,conn){
    if (err) {
      console.log('连接失败');
    } else {
      console.log('连接成功');
      //单个修改
      // let userAddSql = `update user_table set username ='${username}',realname='${realname}',password='${password}',cellphone='${cellphone}',depName ='${depName}',postName='${postName}',updateAt='${moment().format('YYYY-MM-DD')}' where id = '${id}'`
      //批量修改
      let userAddSql = `update user_table set username = ?,realname = ?,password = ?,cellphone = ?,depName = ?,postName =?,updateAt=? where id = ?`
      //批量新增
      let values = [username,realname,password,cellphone,depName,postName,moment().format('YYYY-MM-DD'),id]
      conn.query(userAddSql,values, (err, results, fields)=>{
        if (err) {
          res.send({
            data: null,
            success: false,
            message: '修改失败'
          })
          console.log('[login ERROR] - ', err.message);
          return
        }
        let data = {
          data : null,
          success: true,
          message: '修改成功'
        }
        res.send(data)
        conn.release()
      })
    }
  })
})
  
module.exports = router;