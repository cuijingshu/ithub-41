# 41期 Node.js 综合案例

## 准备

1. 创建 github 仓库
2. 克隆到本地
3. 创建 `.gitignore`，并配置忽略 `node_modules` 目录
3. npm init -y
4. npm i express

## 创建 `app.js` 编写一个响应 `hello world` 的服务

```javascript
// 0. 加载 Express
const express = require('express')

// 1. 调用 express() 得到一个 app
//    类似于 http.createServer()
const app = express()

// 2. 设置请求对应的处理函数
//    当客户端以 GET 方法请求 / 的时候就会调用第二个参数：请求处理函数
app.get('/', (req, res) => {
  res.send('hello world')
})

// 3. 监听端口号，启动 Web 服务
app.listen(3000, () => console.log('app listening on port 3000!'))
```

## 抽取路由模块 `router.js`

```javascript
// 0. 加载 express
const express = require('express')

// 1. 调用 express.Router() 创建一个路由实例
const router = express.Router()

// 2. 配置路由规则
router.get('/', (req, res) => {
  res.send('hello world')
})

// 3. 导出路由对象
module.exports = router

// 4. 在 app.js 中通过 app.use(路由对象) 挂载使之生效
```

## 设计路由表

| 请求方法 |        请求路径        |       说明       |
|----------|------------------------|------------------|
| GET      | /                      | 渲染首页         |
| GET      | /signin                | 渲染登陆页面     |
| POST     | /signin                | 处理登陆请求     |
| GET      | /signup                | 渲染注册页面     |
| POST     | /signup                | 处理注册请求     |
| POST     | /signout               | 处理退出请求     |
| GET      | /topic/create          | 渲染发布话题页面 |
| POST     | /topic/create          | 处理发布请求请求 |
| GET      | /topic/:topicID        | 渲染话题详情页面 |
| GET      | /topic/:topicID/edit   | 渲染编辑话题页面 |
| POST     | /topic/:topicID/edit   | 处理编辑话题请求 |
| POST     | /topic/:topicID/delete | 处理删除话题请求 |
| POST     |                        | 发表评论         |
|          |                        | 修改评论         |
|          |                        | 删除评论         |
|          |                        | 个人主页         |
|          |                        | 基本信息         |
|          |                        | 设置             |

## 根据路由表配置路由规则

```javascript
// 首页路由
router
  .get('/', index.showIndex)

// 用户路由
router
  .get('/signin', user.showSignin)
  .post('/signin', user.signin)
  .get('/signup', user.showSignup)
  .post('/signup', user.signup)
  .post('/signout', user.signout)

// 话题相关
router
  .get('/topic/create', topic.showCreate)
  .post('/topic/create', topic.create)
  .get('/topic/:topicID', topic.show)
  .get('/topic/:topicID/edit', topic.showEdit)
  .post('/topic/:topicID/edit', topic.edit)
  .post('/topic/:topicID/delete', topic.delete)
```

## 创建控制器（处理函数）模块

- 创建 `controllers` 目录
- 在 `controllers` 目录中根据业务划分创建处理函数模块

`index.js` 文件：

```javascript
exports.showIndex = (req, res) => {
  res.send('showIndex')
}
```

`user.js` 文件：

```javascript
exports.showSignin = (req, res) => {
  res.send('showSignin')
}

exports.signin = (req, res) => {
  res.send('signin')
}

exports.showSignup = (req, res) => {
  res.send('showSignup')
}

exports.signup = (req, res) => {
  res.send('singup')
}

exports.signout = (req, res) => {
  res.send('signout')
}
```

`topic.js` 文件:

```javascript
exports.showCreate = (req, res) => {
  res.send('showCreate')
}

exports.create = (req, res) => {
  res.send('create')
}

exports.show = (req, res) => {
  res.send('show')
}

exports.showEdit = (req, res) => {
  res.send('showEdit')
}

exports.edit = (req, res) => {
  res.send('edit')
}

exports.delete = (req, res) => {
  res.send('delete')
}
```

然后访问几个路由规则测试一下。

## 拷贝静态资源到项目中

下载项目需要的静态资源：

```shell
git clone https://github.com/lipengzhou/itcast-resource.git
```

把下面的目录拷贝到项目中：

- public/
- views/
- ithub.sql

## 配置模板引擎，渲染发送页面

- 配置 `art-template` 模板引擎
- 渲染登陆、注册、首页、创建话题... 页面

页面渲染出来，发现没有样式。

## 公开静态资源、下载第三方包

下载：

```shell
npm i bootstrap@3.3.7 jquery
```

公开：

```javascript
app.use('/public', express.static('./public/'))
app.use('/node_modules', express.static('./node_modules/'))
```

再测试页面样式。

## 用户注册

### 前端页面处理

```
// 异步提交表单
// 1. 监听表单的 submit 提交事件
//    设置事件处理函数
// 2. 在事件处理函数中
//    阻止表单默认的提交行为
//    采集表单数据
//    表单验证
//      https://github.com/jquery-validation/jquery-validation
//      自己尝试一下这个 jQuery 表单验证插件
//    发起 ajax 异步请求
//    根据服务端响应结果做交互处理
```

```javascript
$('#signup_form').on('submit', handleSubmit)

function handleSubmit(e) {
  e.preventDefault()
  var formData = $(this).serialize()
  $.ajax({
    url: '/signup',
    type: 'post',
    data: formData,
    dataType: 'json',
    success: function (data) {
      console.log(data)
      switch(data.code) {
        case 200:
          window.location.href = '/'
          break
        case 1:
          window.alert('邮箱已存在，请更换重试')
          break
        case 2:
          window.alert('昵称已存在，请更换重试')
          break
        case 500:
          window.alert('服务器内部错误，请稍后重试')
          break
      }
      // 判断 data 中的数据是否成功，成功则跳转到首页
    },
    error: function () {
    }
  })
}
```

### 服务端后台处理

1. 接收处理
2. 处理请求
3. 发送响应

```
// 1. 接收获取客户端提交的表单数据
//    配置 body-parser 插件用来解析获取表单 POST 请求体数据

// 2. 数据验证
//    普通数据校验，例如数据有没有，格式是否正确
//    业务数据校验，例如校验用户名是否被占用
//    这里校验邮箱和昵称是否被占用

// 邮箱和昵称都校验没有问题了，可以注册了
// 3. 当数据验证都通过之后，在数据库写入一条新的用户数据

// 4. 注册成功，发送成功响应
```

```javascript
exports.signup = (req, res) => {
  // 1. 接收获取客户端提交的表单数据
  //    配置 body-parser 插件用来解析获取表单 POST 请求体数据
  const body = req.body

  // 2. 数据验证
  //    普通数据校验，例如数据有没有，格式是否正确
  //    业务数据校验，例如校验用户名是否被占用
  //    这里校验邮箱和昵称是否被占用

  // 校验邮箱是否被占用
  connection.query(
    'SELECT * FROM `users` WHERE `email`=?', [body.email],
    (err, results) => {
      if (err) {
        return res.send({
          code: 500,
          message: err.message // 把错误对象中的错误消息发送给客户端
        })
      }
      if (results[0]) {
        return res.send({
          code: 1,
          message: '邮箱已被占用了'
        })
      }

      // 校验昵称是否存在
      connection.query(
        'SELECT * FROM `users` WHERE `nickname`=?',
        [body.nickname],
        (err, results) => {
          if (err) {
            return res.send({
              code: 500,
              message: err.message // 把错误对象中的错误消息发送给客户端
            })
          }

          if (results[0]) {
            return res.send({
              code: 2,
              message: '昵称已被占用'
            })
          }

          // 邮箱和昵称都校验没有问题了，可以注册了
          // 3. 当数据验证都通过之后，在数据库写入一条新的用户数据
          
          // 添加更新时间
          // moment 是一个专门处理时间的 JavaScript 库，这个库既可以在浏览器使用，也可以在 Node 中使用
          // JavaScript 被称之为全栈式语言
          // moment() 用来获取当前时间
          // format() 方法用来格式化输出
          body.createdAt = moment().format('YYYY-MM-DD HH:mm:ss')

          const sqlStr = 'INSERT INTO `users` SET ?'

          connection.query(sqlStr, body, (err, results) => {
            if (err) {
              // 服务器异常，通知客户端
              return res.send({
                code: 500,
                message: err.message
              })
            }


            // 注册成功，告诉客户端成功了
            res.send({
              code: 200,
              message: 'ok'
            })

            // 用户注册成功之后需要跳转到首页
            // 1. 服务端重定向（只对同步请求有效）
            // res.send('注册成功')
            // 2. 让客户端自己跳
            // res.redirect('/')
          })
        }
      )
    }
  )
}
```

## 提取 `db-helper.js` 文件模块

```javascript
const mysql = require('mysql')

const connection = mysql.createConnection({
  host: 'localhost', // 要连接的主机名
  user: 'root', // 要连接的数据库的用户名
  password: '123456', // 数据库密码
  database: 'ithub' // 数据库
})

module.exports = connection
```

## 划分 MVC

1. 在项目根目录下创建 `models` 目录
2. 在 `models` 目录中分别创建 `user.js`、`topic.js`、`comment.js` 等文件
3. 把所有的数据库操作都封装到 Model 对应的业务模块中

例如，`model/user.js`:

```javascript
// 我们把用户相关的数据库操作方法都封装到当前模块

const db = require('../controllers/db-helper')

exports.findAll = callback => {
  const sqlStr = 'SELECT * FROM `users`'
  db.query(sqlStr, (err, results) => {
    if (err) {
      return callback(err)
    }
    callback(null, results)
  })
}

exports.getByEmail = (email, callback) => {
  const sqlStr = 'SELECT * FROM `users` WHERE `email`=?'
  db.query(
    sqlStr,
    [email],
    (err, results) => {
      if (err) {
        return callback(err)
      }
      callback(null, results[0])
    }
  )
}

exports.getByNickname = (nickname, callback) => {
  const sqlStr = 'SELECT * FROM `users` WHERE `nickname`=?'
  db.query(
    sqlStr,
    [nickname],
    (err, results) => {
      if (err) {
        return callback(err)
      }
      callback(null, results[0])
    }
  )
}

exports.create = (user, callback) => {
  const sqlStr = 'INSERT INTO `users` SET ?'
  db.query(
    sqlStr,
    user,
    (err, results) => {
      if (err) {
        return callback(err)
      }
      callback(null, results)
    }
  )
}
```

## 用户登陆（客户端处理）

```javascript
$('#signin_form').on('submit', handleSubmit)

function handleSubmit (e) {
  e.preventDefault()
  var formData = $(this).serialize()
  $.post('/signin', formData, function (data) {
    switch(data.code) {
      case 200:
        window.location.href = '/'
        break
      case 1:
        window.alert('用户名不存在')
        break
      case 2:
        window.alert('密码不正确')
        break
    }
  })
}
```

## 用户登陆（没有存储登陆状态）

```javascript
exports.signin = (req, res) => {
  const body = req.body

  // TODO: 基本数据校验

  User.getByEmail(body.email, (err, user) => {
    if (err) {
      return res.send({
        code: 500,
        message: err.message
      })
    }

    // 如果用户不存在，告诉客户端
    if (!user) {
      return res.send({
        code: 1,
        message: '用户不存在'
      })
    }

    // 如果用户存在了，则校验密码
    if (md5(body.password) !== user.password) {
      return res.send({
        code: 2,
        message: '密码不正确'
      })
    }

    // TODO: 使用Session保存会话状态

    // 代码执行到这里，就意味着验证通过，可以登陆了
    res.send({
      code: 200,
      message: '恭喜你，登陆成功'
    })
  })
}
```

## 用户登陆（使用 Session 存储登陆状态）

express 需要安装配置 [express-session](https://github.com/expressjs/session) 插件才可以使用 Session 功能。

安装：

```shell
npm i express-session
```

在 `app.js` 入口模块中配置：

```javascript
// ...
const session = require('express-session')
// ...

// 配置 session
// 只要配置了该插件，则在后续请求的任何处理函数中都可以使用 req.session 来访问或者设置 Session 数据了
// req.session 就是一个对象，所以：
//    读取 Session 数据：req.session.xxx
//    保存 Session 数据：req.session.xxx = xxx
app.use(session({
  secret: 'keyboard cat', // 加密规则私钥，用来保证不同的丰巢快递柜的密码规则都是不一样的，
  resave: false,
  saveUninitialized: true // 是否在初始化的时候就给客户端发送一个 Cookie
}))

// ...
```

接下来找到 `controllers/user.js` 文件中，将 `sign` 方法修改为：

```javascript
// ...

// TODO: 使用Session保存会话状态
req.session.user = user

// ...
```

## 根据用户登陆状态动态展示网页头部内容

- 登陆前：显示登陆和注册按钮
- 登陆后：显示个人中心和发起按钮

找到 `controllers/index.js` 文件，将 `showIndex` 方法修改为：

```javascript
exports.showIndex = (req, res) => {
  res.render('index.html', {
    user: req.session.user // 把会话用户信息传递到模板中，模板就可以使用当前登陆的用户了
  })
}
```

然后找到 `views/_incldes/header.html` 文件进行条件判定渲染：

```html
<!-- 如果用户已登陆，则显示如下内容块 -->
{{ if user }}
<a class="btn btn-default navbar-btn" href="/topic/new">发起</a>
<li class="dropdown">
  <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false"><img width="20" height="20" src="../public/img/avatar-max-img.png" alt=""> <span class="caret"></span></a>
  <ul class="dropdown-menu">
    <li class="dropdown-current-user">
      当前登录用户: {{ user.nickname }}
    </li>
    <li role="separator" class="divider"></li>
    <li><a href="#">个人主页</a></li>
    <li><a href="/settings/profile">设置</a></li>
    <li><a href="/signout">退出</a></li>
  </ul>
</li>
{{ else }}
<!-- 如果用户未登录，则显示该内容块 -->
<a class="btn btn-primary navbar-btn" href="/signin">登录</a>
<a class="btn btn-success navbar-btn" href="/signup">注册</a>
{{ /if }}
```

## 持久化存储 Session 数据到 MySQL 数据库

默认Session是内存存储，服务器一旦重启就会导致Session数据丢失，用户就需要重新登陆。
为了解决这个，我们只需要将 Session 数据持久化存储到数据库中就可以了。

这里我们需要使用一个插件：[express-mysql-session](https://www.npmjs.com/package/express-mysql-session)。

安装：

```shell
npm i express-mysql-session
```

在 `app.js` 中配置如下：

```javascript
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
  key: 'session_cookie_name',
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  store: sessionStore // 将 Session 数据存储到数据库中（默认是内存存储）
}))

// ...
```

## 用户退出

```javascript
exports.signout = (req, res) => {
  // 1. 清除登陆状态
  delete req.session.user
  
  // 2. 跳转到登录页
  res.redirect('/signin')
}
```

---

## 发布话题

- 处理前端页面
- 处理服务端

### 处理创建话题的客户端

```javascript
$('#form').on('submit', handleSubmit)

function handleSubmit(e) {
  e.preventDefault()
  var formData = $(this).serialize()
  $.post('/topic/create', formData, function (data) {
    console.log(data)
  })
}
```

### 编写话题数据库操作模块 `models/topic/js`

```javascript
// 我们把话题相关的数据库操作方法都封装到当前模块
const db = require('../controllers/db-helper')

/**
 * 获取所有话题列表
 * @param  {Function} callback 回调函数
 * @return {undefined}            没有返回值
 */
exports.findAll = callback => {
  const sqlStr = 'SELECT * FROM `topics`'
  db.query(sqlStr, (err, results) => {
    if (err) {
      return callback(err)
    }
    callback(null, results)
  })
}

/**
 * 插件一个话题
 * @param  {Object}   topic    话题对象
 * @param  {Function} callback 回调函数（返回值都是通过回调函数来接收）
 * @return {undefined}            没有返回值
 */
exports.create = (topic, callback) => {
  const sqlStr = 'INSERT INTO `topics` SET ?'
  db.query(
    sqlStr,
    topic,
    (err, results) => {
      if (err) {
        return callback(err)
      }
      callback(null, results)
    }
  )
}

/**
 * 根据话题id更新话题内容
 * @param  {Object}   topic    要更新话题对象
 * @param  {Function} callback 回调函数
 * @return {undefined}            没有返回值
 */
exports.updateById = (topic, callback) => {
  const sqlStr = 'UPDATE `topics` SET `title`=?, `content`=? WHERE `id`=?'
  db.query(
    sqlStr,
    [
      topic.title,
      topic.content,
      topic.id
    ],
    (err, results) => {
      if (err) {
        return callback(err)
      }
      callback(null, results)
    }
  )
}

/**
 * 根据话题id删除某个话题
 * @param  {Number}   id       话题id
 * @param  {Function} callback 回调函数
 * @return {undefined}            没有返回值
 */
exports.deleteById = (id, callback) => {
  const sqlStr = 'DELETE FROM `topics` WHERE `id`=?'
  db.query(
    sqlStr,
    [
      id
    ],
    (err, results) => {
      if (err) {
        return callback(err)
      }
      callback(null, results)
    }
  )
}
```

### 处理创建话题服务端

```javascript
exports.create = (req, res) => {
  const body = req.body
  
  body.userId = req.session.user.id // 话题的作者，就是当前登陆用户
  body.createdAt = moment().format('YYYY-MM-DD HH:mm:ss') // 话题的创建时间

  Topic.create(body, (err, results) => {
    if (err) {
      return res.send({
        code: 500,
        message: err.message
      })
    }
    res.send({
      code: 200,
      message: '创建话题成功了'
    })
  })
}
```

---

## 配置全局错误处理中间件

在 `app.js` 挂载路由之后添加以下代码：

```javascript
// ...

app.use(router)

// 一个特殊的中间件：错误处理中间件
// 一般一个 Express 应用，配一个就够了
// 作用：全局统一错误处理
app.use((err, req, res, next) => {
  res.send({
    code: 500,
    message: err.message
  })
})

// ...
```

---

## 配置处理 404 页面

```javascript
// 挂载路由...

app.use((req, res, next) => {
  res.render('404.html')
})

// ...
```

---

## 使用 `app.locals` 结合中间件挂载公共的模板数据

```javascript
// 前面的代码略...

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

// 后面的代码略...
```

---

## 演示配置其它第三方中间件

- [morgan](https://github.com/expressjs/morgan) 日志中间件
- [serve-index](https://github.com/expressjs/serve-index) 处理目录列表中间件
- [errorhandler](https://github.com/expressjs/errorhandler) 错误处理中间件
- ...
- 具体查看官方的中间件资源列表：http://expressjs.com/en/resources/middleware.html

---

## 渲染首页话题列表

`controllers/index.js`:

```javascript
exports.showIndex = (req, res, next) => {
  // 读取话题列表，渲染首页
  Topic.findAll((err, topics) => {
    if (err) {
      return next(err)
    }

    res.render('index.html', {
      // user: req.session.user, // 把会话用户信息传递到模板中，模板就可以使用当前登陆的用户了
      topics
    })
  })
}
```

`views/index.html`:

```html
<ul class="media-list">
{{ each topics }}
<li class="media">
  <div class="media-left">
    <!-- 
      <a href="/topic/1"></a>
     -->
    <a href="/topic/{{ $value.id }}">
        <img width="40" height="40" class="media-object" src="../public/img/avatar-max-img.png" alt="...">
      </a>
  </div>
  <div class="media-body">
    <h4 class="media-heading"><a href="/topic/{{ $value.id }}">{{ $value.title }}</a></h4>
    <p>sueysok 回复了问题 • 2 人关注 • 1 个回复 • 187 次浏览 • {{ $value.createdAt }}</p>
  </div>
</li>
{{ /each }}
</ul>
```

## 查看话题

---

## 删除话题

---

## 编辑话题

