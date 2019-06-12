import Vue from 'vue'
import App from './App.vue'

import CalendarAxis from './components/calendarAxis/calendar-axis.vue'
Vue.use(CalendarAxis)

new Vue({
  el: '#app',
  render: h => h(App)
})
