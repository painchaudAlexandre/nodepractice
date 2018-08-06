require('babel-register');
require('dotenv').config()
const request = require('request')

class ApiClient {

    constructor() {
        this.apiUrl =  process.env.API_HTTP + '://'  + process.env.API_HOST + '/' + process.env.API_BASE_ROUTE
    }
    createUser(user) {
        let body = JSON.stringify(user)
        return new Promise((resolve, reject) => {
            request({
                uri: this.apiUrl + '/users',
                method: 'POST',
                body: body,
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'text/json'
                }
            }, (error, response, body) => {
                this._requestCallback(error, response, body, reject, resolve)
            })
        })
    }

    authenticate(email, password) {
        let body = JSON.stringify({'email': email, 'password': password})
        return new Promise((resolve, reject) => {
            request({
                uri: this.apiUrl + '/auth/login',
                method: 'POST',
                body: body,
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'text/json'
                }
            }, (error, response, body) => {
               this._requestCallback(error, response, body, reject, resolve)
            })
        })
    }

    _requestCallback(error, response, body, reject, resolve) {
        if (error) reject(error)
        else resolve({'body' : JSON.parse(body), 'response' : response})
    }

}


module.exports = new ApiClient();