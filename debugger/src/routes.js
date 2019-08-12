import Home from './components/Home.vue'
import Context from './components/Context.vue'

export default [
    { path: '/', component: Home },
    { path: '/context/:id', component: Context }
]