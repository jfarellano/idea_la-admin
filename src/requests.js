//import {SERVER_URL} from "./variables.js"
// Se debe eliminar el recurso de variables debido a que se puede usar este mismo
// servicio para el manejo de variables como se muestra en este ejemplo
const r = require('axios');
const SERVER_URL = 'http://34.226.46.43'
import auth from './authentication.js'

function getHeaders() {
  return {headers: {"Authorization": 'Token token=' + auth.storage.get('secret')}}
}   

export default {
  variable: {
    URL: SERVER_URL,
    locations: function(){
      return r.get(SERVER_URL + '/locations')
    }
  },
  utils: {
    upcase: function (str) {
      var splitStr = str.toLowerCase().split(' ');
      for (var i = 0; i < splitStr.length; i++) {
          splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);     
      }
      return splitStr.join(' '); 
    }
  },
  challenges: {
    index: function () {
      return r.get(SERVER_URL + '/challenges')
      },
    create: function (body) {
      return r.post(SERVER_URL + '/challenges', body ,getHeaders)
    }
  },
  ideas: {
    index: function(){
      return r.get(SERVER_URL + '/ideas')
    }
  },
  challenge: {
    getInfo: function(challengeID) {
      return r.get(SERVER_URL + '/challenges/' + challengeID)
    },
    getIdeas: function(challengeID) {
      return r.get(SERVER_URL + '/challenges/' + challengeID + '/ideas')
    }
  },
  createEditIdea: {
    createIdea: function(body) {
      return r.post(SERVER_URL + '/ideas', body, getHeaders)
    }
  },
  idea: {
    getInfo: function(ideaID) {
      return r.get(SERVER_URL + '/ideas/' + ideaID)
    },
    vote: function(ideaID) {
      return r.post(SERVER_URL + '/ideas/' + ideaID + '/vote')
    },
    getComments: function(ideaID) {
      return r.get(SERVER_URL + '/ideas/' + ideaID + '/comments')
    },
    postComment: function(ideaID, body) {
      return r.post(SERVER_URL + '/ideas/' + ideaID + '/comments', body, getHeaders())
    }
  },
  myProfile: {
    getIdeas: function() {
      return r.get(SERVER_URL + '/users_ideas', getHeaders())
    }
  },
  user: {
    create: function(body){
      return r.post(SERVER_URL + '/users', body)
    },
    get: function(){
      return r.get(SERVER_URL + '/users', getHeaders())
    },
    delete: function(id){
      return r.delete(SERVER_URL + '/users/' + id, getHeaders())
    }
  }
}