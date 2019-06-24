let EventsEmitter = require('events')
let http = require('http')
let context = require('./context')
let request = require('./request')
let response = require('./response')

class Application extends EventsEmitter {
    constructor() {
        super();
        this.middlewares = [];
        this.context = context;
        this.request = request;
        this.response = response;
    }
    use(middleware) {
        this.middlewares.push(middleware);
    }

    compose() {
        //处理middleware
        return async ctx => {
            function createNext(middleware,oldNext) {
                return async ()=>{
                    await middleware(ctx,oldNext)
                }

            }
            let len = this.middlewares.length;
            //给出默认值
            let next = async()=>{
                return Promise.resolve()
            }
            for (let i = len - 1; i >= 0; i--) {
                let currentMiddleware = this.middlewares[i];
                next = createNext(currentMiddleware,next)
            }
            await next();
        }
    }

    createContext(req,res){
        let ctx = Object.create(this.context)
        ctx.request = Object.create(this.request)
        ctx.response = Object.create(this.response)
        ctx.req = ctx.request.req = req;
        ctx.res = ctx.response.res = res;

        return ctx
    }

    callback() {
        return (req,res) => {
            let ctx = this.createContext(req,res);
            let response = () => this.responseBody(ctx)
            let onerror = err => this.onerror(err,ctx)
            //ctx 
            let fn = this.compose();
            return fn(ctx).then(response).catch(onerror)
        }

    }


    responseBody(ctx){
        let context = ctx.body;
        if(typeof context === 'string'){
            ctx.res.end(context)
        }else if(typeof context =='object'){
            ctx.res.end(JSON.stringify(context))
        }
    }

    onerror(err,ctx){
        if(err.code = 'ENOENT'){
            ctx.status = 404;
        }else{
            ctx.status = 500;
        }
        let msg = err.message || '服务器错误'
        ctx.res.end(msg)
        this.emit('error',err)


    }

    listen(...args) {
        let server = http.createServer(this.callback())
        server.listen(...args);
    }
}


module.exports = Application;