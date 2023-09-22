import Vue from 'vue'
import App from './App'
import store from './store'
import './static/iconfont/iconfont.css'

import uView from 'uview-ui'
Vue.use(uView)
Vue.config.productionTip = false

import Mixins from '@/utils/dictionary'
Vue.mixin(Mixins)
import privacySetting from './components/privacySetting/privacySetting.vue'
Vue.component('privacy-setting', privacySetting)

App.mpType = 'app'

const app = new Vue({
	...App,
	store
})
app.$mount()
