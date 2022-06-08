const express = require('express')
const app = express()
const port = 3001
const fs = require('fs')
const cors = require('cors')
const { type } = require('express/lib/response')
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.get('/home/multidata', (req, res) => {
  let f = fs.readFile("./data/home/home_data.json", "utf-8", function (err, data) {
    let j = JSON.parse(data);
    // console.log(data);
    res.json(j)
    // console.log(j);
  })
})

app.get('/home/data', (req, res) => {
  params = req.query
  type = params[Object.keys(params)[0]]
  page = params[Object.keys(params)[1]]

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
  params = req.query
  cate = params[Object.keys(params)[0]]
  type = params[Object.keys(params)[1]]
  page = params[Object.keys(params)[2]]

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
  params = req.query
  iid = params[Object.keys(params)[0]]


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
  params = req.query

  listType = params[Object.keys(params)[0]]
  cate = params[Object.keys(params)[1]]
  page = params[Object.keys(params)[2]]

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