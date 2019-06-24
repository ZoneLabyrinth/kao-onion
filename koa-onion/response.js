module.exports = {
    get body(){
        return this._body;
    },
    set body(data){
        this._body = data
    },

    get status(){
        //this.res是外部http模块传递
        return this.res.statusCode
    },

    set status(statusCode){
        console.log(statusCode)
        if(typeof statusCode !== 'number'){
            throw new Error('statusCode must be number')
        }
        this.res.statusCode = statusCode
    }

}

