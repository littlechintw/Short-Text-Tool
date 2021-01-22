import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify';

Vue.config.productionTip = false

// axios
import axios from 'axios'
Vue.prototype.$axios = axios

new Vue({
  el: '#app',
  data() {
    return {
      windowHeight: window.innerHeight,
      txt: ''
    }
  },
  watch: {
    windowHeight(newHeight, oldHeight) {
     this.txt = `it changed to ${newHeight} from ${oldHeight}`;
    }
  },
  mounted() {
    window.addEventListener('resize', () => {
      this.windowHeight = window.innerHeight
    })
    console.log('Show Height!')
    console.log(this.windowHeight)
  },
  beforeDestroy() { 
    window.removeEventListener('resize', this.onResize); 
  },
  methods: {  
    onResize() {
      this.windowHeight = window.innerHeight
    }
  },
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')