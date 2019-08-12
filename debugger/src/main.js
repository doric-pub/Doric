import Vue from 'vue'
import App from './App.vue'
import VueRouter from 'vue-router'
import routes from './routes'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(VueRouter)
Vue.use(ElementUI)
new Vue({
  router: new VueRouter({
    routes
  }),
  render: h => h(App),
}).$mount('#app')
