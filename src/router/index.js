import Vue from 'vue'
import Router from 'vue-router'
import Home from '../views/home.vue'
import User from '../components/user/users.vue'
import GoodsList from '../components/goods/goodsList.vue'
import Notice from '../components/catagory/notice.vue'
import Aboutus from '../components/catagory/aboutus.vue'
import OrderList from '../components/orders/orderList.vue'
import Factory_catagories from '../components/catagory/factory_catagories.vue'
import Goods_catagories from '../components/catagory/goods_catagories.vue'
import Login from '../views/Login.vue'
Vue.use(Router)
// 解决ElementUI导航栏中的vue-router在3.0版本以上重复点菜单报错问题
const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)

}
const router = new Router({
	routes: [
		{path: '/', redirect: '/login' },
		{path:'/login', component: Login},
		{
		path: '/home',
		component: Home,
		children: [
			{path: '/', component: User},
			{path: '/users', component: User},
			{path: '/goods', component: GoodsList},
			{path: '/order', component: OrderList},
			{path: '/factory_catagoreis', component: Factory_catagories},
			{path: '/goods_catagoreis', component: Goods_catagories},
			{path: '/notice', component: Notice},
			{path: '/aboutus', component: Aboutus}
		 ],
	}]
})
// 挂在路由导航守卫
router.beforeEach((to, from, next) => {
  // if (to.path == '/login') return next()
  // // 获取token
  // const token = window.sessionStorage.getItem('token')
  // if (!token) return next('/login')
  next()
})

export default router
