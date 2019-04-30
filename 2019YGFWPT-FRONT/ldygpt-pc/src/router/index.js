import Vue from 'vue'
import VueRouter from 'vue-router'


Vue.use(VueRouter);
const router = new VueRouter({
    routes: [
        {
            path: '/ld',
            redirect: '/ld/login'
        },
        {
            path: '/ld/login',
            component: resolve => require(['@/page/login/login.vue'], resolve),
            meta: {
                title: '登陆'
            }
        },
        {
            path: '/ld/404',
            component: resolve => require(['../components/common/404.vue'], resolve)
        },
        {
            path: '/ld/403',
            component: resolve => require(['../components/common/403.vue'], resolve)
        },
        {
            path: '*',
            redirect: '/ld/404'
        }
    ],
    mode: 'history'
});

//全局路由守卫
router.beforeEach((to, from, next) => {
    //debugger
    console.log('跳转到:', to);
    console.log('跳转到123:', next);
    if (to.path == '/tree') {
        next();
    } else {
        var token = sessionStorage.getItem('token');
        window.addEventListener('load', () => {
            next({ path: '/ld/home' })
        })
        //如果没登录,都导向登录页
        if (!token) {
            if (to.path !== '/ld/login') {
                next({path: '/ld/login'})
            } else {
                next();
            }
        } else {
            console.log('跳转到111:', to);
            console.log(9999)
            console.log('跳转到456:', next);
            next();
        }
    }

})

export default router
