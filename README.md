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
