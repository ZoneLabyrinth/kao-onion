// const Koa = require('koa');
const Koa = require('./koa-onion/application')
const app = new Koa();

// logger

app.use(async (ctx, next) => {
  console.log(1);
  await next();
  console.log(5)

});

// x-response-time

app.use(async (ctx, next) => {
  console.log(2);
  await next();
  console.log(4)
});


// response

app.use(async ctx => {
  console.log(3);
  ctx.response.status = 'xxxxx'
  ctx.body = 'Hello World' 
});

app.on('error',err=>{
  console.log("发生错误")
})

app.listen(3000);