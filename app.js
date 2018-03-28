const express = require('express')
const bodyParser = require('body-parser')
const router = require('./router')
const session = require('express-session')
const MySQLStore = require('express-mysql-session')(session)
const morgan = require('morgan')
const serveIndex = require('serve-index')
const errorhandler = require('errorhandler')

const options = {
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: '123456',
  database: 'ithub'
}
 
const sessionStore = new MySQLStore(options)

const app = express()

// app.use(morgan('tiny'))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms'))

// 现在你访问 /views 就会得到 views 目录列表了
app.use('/views', serveIndex('./views/', {'icons': true}))

// 配置 Session 插件
// 只要配置了该插件，则在后续请求的任何处理函数中都可以使用 req.session 来访问或者设置 Session 数据了
// 为什么配置了 Session 中间件之后，然后在后续的请求处理函数中就可以使用 req.session 了
// 其实在这个中间件内部动态的为 req 对象增加了一个 session 对象成员
// req.session = {}
// session 插件内部有一套业务逻辑
app.use(session({
  key: "connect.sid", // 配置 Cookie 的名字，默认就是 connect.sid
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  store: sessionStore // 将 Session 数据存储到数据库中（默认是内存存储）
}))


// app 有一个 locals 属性对象
// app.locals 属性对象中的成员可以直接在页面模板中访问
// 我们可以把一些公共的成员，多个页面都需要的模板成员放到 app.locals 中
// 我们每个页面都需要session中的user
// 所以我们就把这个 session 中的 user 添加到 app.locals 中
// 这个中间件的职责就是往 app.locals 中添加公共的模板成员
// 注意：一定要在配置 session 中间件之后，和挂载路由之前
app.use((req, res, next) => {
  app.locals.sessionUser = req.session.user

  // 千万不要忘记调用 next()，否则请求进来就不往后走了
  next()
})

// 1. 配置模板引擎
// 2. 渲染页面
// 3. 开放静态资源
// 4. 下载第三方包
//     bootstrap@3.3.7
//     jquery
app.use('/public', express.static('./public/'))
app.use('/node_modules', express.static('./node_modules/'))


// 配置使用 art-template 模板引擎
app.engine('html', require('express-art-template'))

// 配置 body-parser 解析表单 POST 请求体
// 只有配置了该插件，就可以在请求处理函数中使用 req.body 来访问请求体数据了
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())

// 路由也是中间件
// 为了保险，最好把路由挂载写到代码的最后
// 因为中间件的执行是有顺序的
app.use(router)

// 当前面没有任何一个中间件能处理该请求的时候，则会进入这个中间件
// 注意：一定要在路由之后，否则整站都是 404 了
app.use((req, res, next) => {
  res.render('404.html')
})

// 第三方统一错误处理中间件
app.use(errorhandler())

// 一个特殊的中间件：错误处理中间件
// 一般一个 Express 应用，配一个就够了
// 作用：全局统一错误处理
// app.use((err, req, res, next) => {
//   res.send({
//     code: 500,
//     message: err.message
//   })
// })

app.listen(3000, () => console.log('running 3000...'))
