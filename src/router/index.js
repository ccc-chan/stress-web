import Vue from 'vue'
import Router from 'vue-router'
import Index from '@/page/Index/index.vue'
// import Test from '../components/test.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Index',
      component: Index
    },
    // {
    //   path: '/test',
    //   name: 'Test',
    //   component: Test
    // }
  ]
})
