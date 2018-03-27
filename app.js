const express = require('express')
const bodyParser = require('body-parser')
const router = require('./router')
const session = require('express-session')
const MySQLStore = require('express-mysql-session')(session)

const options = {
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: '123456',
  database: 'ithub'
}
 
const sessionStore = new MySQLStore(options)

const app = express()

// 配置 Session 插件
// 只要配置了该插件，则在后续请求的任何处理函数中都可以使用 req.session 来访问或者设置 Session 数据了
app.use(session({
  key: "connect.sid", // 配置 Cookie 的名字，默认就是 connect.sid
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  store: sessionStore // 将 Session 数据存储到数据库中（默认是内存存储）
}))

// 1. 配置模板引擎
// 2. 渲染页面
// 3. 开放静态资源
// 4. 下载第三方包
//     bootstrap@3.3.7
//     jquery
app.use('/public', express.static('./public/'))
app.use('/node_modules', express.static('./node_modules/'))

// 配置 body-parser 解析表单 POST 请求体
// 只有配置了该插件，就可以在请求处理函数中使用 req.body 来访问请求体数据了
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())

// 配置使用 art-template 模板引擎
app.engine('html', require('express-art-template'))

app.use(router)

app.listen(3000, () => console.log('running 3000...'))
