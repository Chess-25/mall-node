const express = require('express')
const app = express()
const port = 3001
const fs = require('fs')
const cors = require('cors')
const uuid = require('node-uuid')
const moment = require('moment');
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

// 简单连接
// 连接数据库
// const mysql = require('mysql')

// let connection = mysql.createConnection({
//   host: '127.0.0.1',
//   user: 'root',
//   password: '123456',
//   port: '3306',
//   database: 'mysql',
// })

// connection.query('select * from goods_table', (error, results, fields)=>{
//   if (error) throw error;
//   console.log(results,57);
// })

// app.get('/showInfo', (req, res) => {
//   res.setHeader('Access-Control-Allow-Origin', '*')
//   connection.query('select * from goods_table', (err, results, fields)=>{
//     if (err) {
//       console.log('[login ERROR] - ', err.message);
//       return
//     }
    
//     res.send(results)
//     connection.end();
//   })
// })

// 使用连接池连接
const pool = require('./service/pool')
app.get('/homeData', (req, res) => {
  pool.getConnection(function(err,conn){
    if (err) {
      console.log('连接失败');
    } else {
      console.log('连接成功');
      conn.query('select * from home_data', (err, results, fields)=>{
        if (err) {
          console.log('[login ERROR] - ', err.message);
          return
        }
        let message = {
          data : results,
          success: true
        }
        console.log(message,444);
        res.send(message)
        conn.release()
      })
    }
  })
})

app.get('/userList', (req, res) => {
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
        console.log(data,444);
        res.send(data)
        conn.release()
      })
    }
  })
})
app.post('/user/add', (req, res) => {
  let {username,realname,password,cellphone,depName,postName,avatar} = req.body
  pool.getConnection(function(err,conn){
    if (err) {
      console.log('连接失败');
    } else {
      console.log('连接成功');//(0,1,2,3,4,5,6,7,8,9)
      let userAddSql = `insert into user_table(id,username,realname,password,cellphone,depName,postName,status,avatar,createAt) values `
      let userAddSql_Params = `('${uuid().replace(/-/g,'')}','${username}','${realname}',${password},${cellphone},'${depName}','${postName}',1,'${avatar}','${moment().format('YYYY-MM-DD')}')`

      console.log(userAddSql + userAddSql_Params,userAddSql_Params,59);
      conn.query(userAddSql + userAddSql_Params, (err, results, fields)=>{
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
        console.log(data,444);
        res.send(data)
        conn.release()
      })
    }
  })
})

app.get('/home/multidata', (req, res) => {
  let f = fs.readFile("./data/home/home_data.json", "utf-8", function (err, data) {
    let j = JSON.parse(data);
    // console.log(data);
    res.json(j)
    // console.log(j);
  })
})

app.get('/home/data', (req, res) => {
  let params = req.query
  let type = params[Object.keys(params)[0]]
  let page = params[Object.keys(params)[1]]
  
  let f = fs.readFile(`./data/${type}/${type}_page${page}.json`, "utf-8", function (err, data) {
    if (err) {
      res.json(err)
    } else {
      let j = JSON.parse(data);
      res.json(j)
    }
  })
})

app.get('/category/multidata', (req, res) => {
  let f = fs.readFile("./data/category/category_data.json", "utf-8", function (err, data) {
    let j = JSON.parse(data);
    // console.log(data);
    res.json(j)
    // console.log(j);
  })
})

app.get('/category/data', (req, res) => {
  let params = req.query
  let cate = params[Object.keys(params)[0]]
  let type = params[Object.keys(params)[1]]
  let page = params[Object.keys(params)[2]]

  let f = fs.readFile(`./data/category/${cate}/${type}/${type}_page${page}.json`, "utf-8", function (err, data) {
    if (err) {
      res.json(err)
    } else {
      let j = JSON.parse(data);
      res.json(j)
    }
  })
})

app.get('/detail', (req, res) => {
  let params = req.query
  let iid = params[Object.keys(params)[0]]


  let f = fs.readFile(`./data/detail/${iid}.json`, "utf-8", function (err, data) {
    if (err) {
      res.json(err)
    } else {
      let j = JSON.parse(data);
      // console.log(data);
      res.json(j)
      // console.log(j);
    }
  })
})

app.get('/recommend', (req, res) => {
  let f = fs.readFile("./data/detail/recommend.json", "utf-8", function (err, data) {
    let j = JSON.parse(data);
    res.json(j)
  })
})

app.get('/tableData', (req, res) => {
  let params = req.query

  let listType = params[Object.keys(params)[0]]
  let cate = params[Object.keys(params)[1]]
  let page = params[Object.keys(params)[2]]

  let file = `./data/tableData/${listType}/${cate}/page${page}.json`
  if (listType =='goods') {
    
  }
  let f = fs.readFile(file, "utf-8", function (err, data) {
    if (err) {
      res.json(err)
    } else {
      let j = JSON.parse(data);
      res.json(j)
    }
  })
})

app.get('/goods/amount/list', (req, res) => {
  let f = fs.readFile("./data/statisticData/statistic.json", "utf-8", function (err, data) {
    let j = JSON.parse(data);
    // console.log(data);
    res.json(j)
    // console.log(j);
  })
})

app.post('/table/operate', (req, res) => {
  let opType = req.query.opType //获取操作类型
  let listType = req.query.listType //获取列表类型
  let tabData = req.body //获取前端的数据
  console.log(req.query,req.body);

  //文件路径
  let fileUrl = `./data/table/${listType}/data.json`
  //读取文件
  fs.readFile(fileUrl, (err, data) => {
    // 判断操作类型
    let tableList = JSON.parse(data);
    if (opType==='add') {
      tabData.status = '启用',
      tabData.cfav = (parseInt(tableList.data[0].cfav) + 1) + ''
      tabData.iid = (parseInt(tableList.data[0].iid) + 1) + ''
      tabData.createAt = '2022-05-19 10:20:00'
      tableList.data.unshift(tabData)
    }
    if (opType==='detail') {
      const dataIndex = tableList.data.findIndex(item => item.iid === tabData.iid)
      tableList.data.splice(dataIndex,1,tabData)
    }
    if (opType==='delete') {
      const dataIndex = tableList.data.findIndex(item => item.iid === tabData.iid)
      tableList.data.splice(dataIndex,1)
      if (tableList.data.length===0) {
        return res.json({success:false,message:"数据不能全部删掉"})
      }
    }
    if (opType==='batch_delete') {
      for(let iid of tabData) {
        const dataIndex = tableList.data.findIndex(item => item.iid === iid)
        tableList.data.splice(dataIndex,1)
      }
      if (tableList.data.length===0) {
        return res.json({success:false,message:"数据不能全部删掉"})
      }
    }
    //重新写入文件
    fs.writeFile(fileUrl, JSON.stringify(tableList), (err) => {
      if (err) {
        console.log(err);
      }
      res.json(tableList)
      console.log('写入成功！');
    })
  })
})



app.listen(port, () => console.log(`应用启动,监听端口${port}!`))