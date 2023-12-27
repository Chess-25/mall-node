const uuid = require('node-uuid')
const express = require("express");
const router = express.Router();
const pool = require('../service/pool')
const moment = require('moment');
const dbCongif = require('../config/dbconfig')

//查询用户列表(封装方法)
router.get('/list', (req, res) => {
  let queryList = ['username','realname','cellphone','depName','postName','status'] //能搜索的参数
  // 查总数
  let sqlTotal = `select count(*) as total from user_table `
  let sqlTotalArr = []

  // 查列表
  let sql = `select * from user_table `
  let sqlArr = []
  // 遍历参数
  for (let key in req.query) {
    // 判断是否为可搜索参数
    if (queryList.some(i=>i==key)) {
      if (sqlArr.length == 0) {
        sql += `where ${key} like ? `
        sqlTotal += `where ${key} like ? `
      } else {
        sql += `and ${key} like ? `
        sqlTotal += `and ${key} like ? `
      }
      sqlArr.push("%"+req.query[key]+"%")
      sqlTotalArr.push("%"+req.query[key]+"%")
    }
  }
  if (req.query.pageNum || req.query.pageSize) {
    let pageNum = req.query.pageNum || 1
    let pageSize = req.query.pageSize || 10
    sql += 'limit ?,?'
    sqlArr.push((pageNum-1)*pageSize,parseInt(pageSize))
  }
  let total = 0
  let callBack = (err,results)=>{
    if (err) {
      console.log('连接失败')
    } else {
      let data = {
        data: results,
        total: total,
        success: true,
        message: '加载成功'
      }
      res.send(data)
    }
  }
  dbCongif.sqlConnect(sqlTotal,sqlTotalArr,(err,res)=>{
    total = res[0].total
    dbCongif.sqlConnect(sql,sqlArr,callBack)
  })
})
//查询用户列表
// router.get('/list', (req, res) => {
//   pool.getConnection(function(err,conn){
//     if (err) {
//       console.log('连接失败');
//     } else {
//       console.log('连接成功');
//       // let sql = `select * from user_table where username = '${params.username}'` //单条
//       let sql = `select * from user_table `
//       let sqlArr = []
//       let queryList = ['username','realname','cellphone','depName','postName','status'] //能搜索的参数
//       for (let key in req.query) {
//         // 判断是否为可搜索参数
//         if (queryList.some(i => i == key)) {
//           if (sqlArr.length == 0) {
//             sql += `where ${key} like ? `
//           } else {
//             sql += `and ${key} like ? `
//           }
//           sqlArr.push("%"+req.query[key]+"%")
//         }
//       }
//       conn.query(sql,sqlArr, (err, results, fields)=>{
//         if (err) {
//           console.log('[login ERROR] - ', err.message);
//           return
//         }
//         let data = {
//           data : results,
//           success: true,
//           message: '加载成功'
//         }
//         res.send(data)
//       })
//       conn.release()
//     }
//   })
// })
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
  let {id,username,realname,password,cellphone,depName,postName,status} = req.body
  pool.getConnection(function(err,conn){
    if (err) {
      console.log('连接失败');
    } else {
      console.log('连接成功');
      //单个修改
      // let userAddSql = `update user_table set username ='${username}',realname='${realname}',password='${password}',cellphone='${cellphone}',depName ='${depName}',postName='${postName}',updateAt='${moment().format('YYYY-MM-DD')}' where id = '${id}'`
      //批量修改
      let userAddSql = `update user_table set username = ?,realname = ?,password = ?,cellphone = ?,depName = ?,postName =?,status=?,updateAt=? where id = ?`
      //批量新增
      let values = [username,realname,password,cellphone,depName,postName,status,moment().format('YYYY-MM-DD'),id]
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