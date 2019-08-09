import Vue from 'vue'
import App from './App.vue'

Vue.config.productionTip = false

var vm = new Vue({
  render: h => h(App),
  allContext: [{ "source": "demo", "id": "1" }],
})
vm.$mount('#app')
