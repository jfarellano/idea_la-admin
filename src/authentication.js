// import VueAuthenticate from 'vue-authenticate'

// Vue.use(VueAuthenticate, {
//   baseUrl: 'http://localhost:3000', // Your API domain
  
//   providers: {
//     github: {
//       clientId: '',
//       redirectUri: 'http://localhost:8080/auth/callback' // Your client app URL
//     }
//   }
// })

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
    user_info(user_id){
      return r.get(api.variable.URL + '/users/' + user_id)
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
      const nameCapitalized =
        name.charAt(0).toUpperCase() +
        name.slice(1);
      const lastnameCapitalized =
        lastname.charAt(0).toUpperCase() +
        lastname.slice(1);
      localStorage.setItem('name', nameCapitalized + " " + lastnameCapitalized)
    },
    loged: function () {
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