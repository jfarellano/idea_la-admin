import Vue from 'vue'
import Router from 'vue-router'
// import HelloWorld from './components/HelloWorld.vue'
import Login from './components/Login.vue'
import Dashboard from './components/Dashboard.vue'
import Users from './components/Users'
import Challenges from './components/Challenges.vue'
import CreateEditChallenge from './components/CreateEditChallenge.vue'

Vue.use(Router)
export default new Router ({
    routes: [
        {
            path: '/',
            name: 'Login',
            component: Login
        },
        {
            path: '/dashboard',
            name: 'Dashboard',
            component: Dashboard
        },
        {
            path: '/users',
            name: 'Users',
            component: Users
        },
        {
            path: '/challenges',
            name: 'Challenges',
            component: Challenges
        },
        {
            path: '/add_edit_challenge/:challengeID',
            name: 'CreateEditChallenge',
            component: CreateEditChallenge
        },
    ]
})