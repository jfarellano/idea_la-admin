//import {SERVER_URL} from "./variables.js"
// Se debe eliminar el recurso de variables debido a que se puede usar este mismo
// servicio para el manejo de variables como se muestra en este ejemplo
const r = require('axios');
// const SERVER_URL = 'https://prod.jfarellano.xyz'
const SERVER_URL = 'https://dev-api.imaginatuciuda.org'
// const SERVER_URL = 'https://api.imaginatuciuda.org'
// const SERVER_URL = 'http://192.168.100.124:3000/'
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
    indexAll: function () {
      return r.get(SERVER_URL + '/all_challenges', getHeaders())
    },
    index: function () {
      return r.get(SERVER_URL + '/challenges')
    },
    create: function (body) {
      return r.post(SERVER_URL + '/challenges', body, getHeaders())
    },
    update: function (body, challengeID) {
      return r.put(SERVER_URL + '/challenges/' + challengeID, body, getHeaders())
    },
    delete: function(challengeID) {
      return r.delete(SERVER_URL + '/challenges/' + challengeID, getHeaders())
    },
  },
  ideas: {
    indexAll: function(){
      return r.get(SERVER_URL + '/all_ideas', getHeaders())
    },
    indexChallenge: function(challengeID) {
      return r.get(SERVER_URL + '/challenges/' + challengeID + '/ideas', getHeaders())
    },
    delete: function(ideaID) {
      return r.delete(SERVER_URL + '/ideas/' + ideaID, getHeaders())
    },
    indexPicked: function() {
      return r.get(SERVER_URL + '/picked_ideas', getHeaders())
    },
    indexPickedByChallenge: function(id) {
      return r.get(SERVER_URL + '/challenges/' + id + '/picked_ideas', getHeaders())
    },
    indexVotesByLocation: function(body, id) {
      return r.post(SERVER_URL + '/challenges/' + id + '/index_ideas_winners', body)
    },
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
      return r.post(SERVER_URL + '/ideas', body, getHeaders())
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
    },
    pick: function(ideaID) {
      return r.put(SERVER_URL + '/pick_ideas/' + ideaID, {}, getHeaders())
    },
    unpick: function(ideaID) {
      return r.put(SERVER_URL + '/un_pick_ideas/' + ideaID, {}, getHeaders())
    },
    pickWinner: function(ideaID) {
      return r.put(SERVER_URL + '/pick_winner_ideas/' + ideaID, {}, getHeaders())
    },
    unpickWinner: function(ideaID) {
      return r.put(SERVER_URL + '/un_pick_winner_ideas/' + ideaID, {}, getHeaders())
    },
  },
  comments: {
    getAll: function() {
      return r.get(SERVER_URL + '/all_comments', getHeaders())
    },
    getFromIdea: function(id) {
      return r.get(SERVER_URL + '/ideas/' + id + '/comments')
    },
    delete: function(id) {
      return r.delete(SERVER_URL + '/comments/' + id, getHeaders())
    },
  },
  myProfile: {
    getIdeas: function() {
      return r.get(SERVER_URL + '/users_ideas', getHeaders())
    }
  },
  user: {
    create: function(body) {
      return r.post(SERVER_URL + '/users', body)
    },
    get: function() {
      return r.get(SERVER_URL + '/users', getHeaders())
    },
    delete: function(id) {
      return r.delete(SERVER_URL + '/users/' + id, getHeaders())
    },
    block: function(id) {
      return r.put(SERVER_URL + '/users/' + id + '/block', {}, getHeaders())
    },
    unblock: function(id) {
      return r.put(SERVER_URL + '/users/' + id + '/unblock', {}, getHeaders())
    },
    show: function(id){
      return r.get(SERVER_URL + '/users/' + id, getHeaders())
    }
  },
  stages: {
    getCurrent: function(){
      return r.get(SERVER_URL + '/current_stage')
    },
    setNext: function(){
      return r.put(SERVER_URL + '/next_stage', {}, getHeaders())
    },
    changeText: function(body) {
      return r.put(SERVER_URL + '/change_text', body, getHeaders())
    }
  },
  surveys: {
    getResultsByHood: function(body) {
      return r.post(SERVER_URL + '/count_hood_statistics', body, getHeaders())
    },
  }
}