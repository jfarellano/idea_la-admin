const r = require('axios');
import api from './requests'

function getHeaders() {
  return { headers: { "Authorization": 'Token token=' + localStorage.getItem('secret') } }
}
export default {
  oauth: {
    
  },
  session: {
    login: function (body) {
      return r.post(api.variable.URL + '/sessions', body)
    },
    logout: function () {
      return r.delete(api.variable.URL + '/sessions', getHeaders())
    },
    stage: function() {
      return r.get(api.variable.URL + '/current_stage')
    },
    wrong_attempt: function() {
      let attempts = localStorage.getItem('attempt')
      let time = localStorage.getItem('time')
      if ( attempts == null ) {
        localStorage.setItem('attempt', 1)
        localStorage.setItem('time', Date.now())
      }else{
        if (Date.now() - time < 60000){
          if(attempts >= 9){
            localStorage.setItem('blocked', true)
            localStorage.setItem('blockTime', Date.now())
            return false
          }else{
            localStorage.setItem('attempt', ++attempts)
            return true
          }
        }else{
          localStorage.setItem('time', Date.now())
          localStorage.setItem('attempt', 1)
          return true
        }
      }
    },
    blocked(){
      let blocked = localStorage.getItem('blocked')
      let blockTime = localStorage.getItem('blockTime')
      if (blocked == null || !blocked){
        return false
      }else{
        if (Date.now() - blockTime > 60000){
          localStorage.setItem('blocked', false)
          return false
        }else{
          return blockTime
        }
      }
    }
  },
  storage: {
    setImage: function (url) {
      localStorage.setItem('picture', url)
    },
    set: function (user_id, secret, expire, admin) {
      localStorage.setItem('user_id', user_id)
      localStorage.setItem('secret', secret)
      localStorage.setItem('expire', expire)
      localStorage.setItem('admin', admin)
    },
    set_name: function (name, lastname) {
      localStorage.setItem('name', api.utils.upcase(name + ' ' + lastname))
    },
    set_stage: function (stage) {
      localStorage.setItem('stage', stage)
    },
    logged: function () {
      if (localStorage.getItem('secret') != null) {
        var exp = new Date(localStorage.getItem('expire'))
        if (exp > Date.now()){
          return true
        }else{
          localStorage.clear()
          return false
        }
      } else {
        return false
      }
    },
    get: function (name) {
      return localStorage.getItem(name)
    },
    clear: function(){
      localStorage.clear()
    }
  }
}