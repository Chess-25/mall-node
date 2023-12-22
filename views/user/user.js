const uuid = require('node-uuid')
const express = require("express");
const router = express.Router();
const pool = require('../../service/pool')
const moment = require('moment');

//查询用户列表
router.get('/list', (req, res) => {
  pool.getConnection(function(err,conn){
    if (err) {
      console.log('连接失败');
    } else {
      console.log('连接成功');
      conn.query('select * from user_table', (err, results, fields)=>{
        if (err) {
          console.log('[login ERROR] - ', err.message);
          return
        }
        let data = {
          data : results,
          success: true,
          message: '加载成功'
        }
        res.send(data)
        conn.release()
      })
    }
  })
})
//添加用户
router.post('/add', (req, res) => {
  let {username,realname,password,cellphone,depName,postName,avatar} = req.body
  pool.getConnection(function(err,conn){
    if (err) {
      console.log('连接失败');
    } else {
      console.log('连接成功');
      let userAddSql = `insert into user_table(id,username,realname,password,cellphone,depName,postName,status,avatar,createAt) values ?`

      //单个新增
      let userAddSql_Params = `('${uuid().replace(/-/g,'')}','${username}','${realname}',${password},${cellphone},'${depName}','${postName}',1,'${avatar}','${moment().format('YYYY-MM-DD')}')`
      
      //批量新增
      let values = [
        [uuid().replace(/-/g,''),username,realname,password,cellphone,depName,postName,1,avatar,moment().format('YYYY-MM-DD')]
      ]
      console.log(userAddSql + userAddSql_Params,values,59);
      conn.query(userAddSql ,[values], (err, results, fields)=>{
        if (err) {
          res.send({
            data: null,
            success: false,
            message: '添加失败'
          })
          console.log('[login ERROR] - ', err.message);
          return
        }
        let data = {
          data : null,
          success: true,
          message: '添加成功'
        }
        res.send(data)
        conn.release()
      })
    }
  })
})
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
//删除用户
router.post('/delete', (req, res) => {
  let { id } = req.body
  pool.getConnection(function(err,conn){
    if (err) {
      console.log('连接失败');
    } else {
      console.log('连接成功');
      let userAddSql = `delete from user_table where id = '${id}'`

      console.log(userAddSql, id,59);
      conn.query(userAddSql, (err, results, fields)=>{
        if (err) {
          res.send({
            data: null,
            success: false,
            message: '删除失败'
          })
          console.log('[login ERROR] - ', err.message);
          return
        }
        let data = {
          data : null,
          success: true,
          message: '删除成功'
        }
        res.send(data)
        conn.release()
      })
    }
  })
})
module.exports = router;