import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)
const home = resolve => require.ensure([], () => resolve(require('@/page/home')), 'home')
const boundenterprise = resolve => require.ensure([], () => resolve(require('@/page/EnterpriseBinding/boundenterprise')), 'boundenterprise')
const information = resolve => require.ensure([], () => resolve(require('@/page/EnterpriseBinding/information')), 'information')
const topUp = resolve => require.ensure([], () => resolve(require('@/page/cardForMeal/topUp')), 'topUp')
const mealCard = resolve => require.ensure([], () => resolve(require('@/page/cardForMeal/mealCard')), 'mealCard')

const topUpMoney = resolve => require.ensure([], () => resolve(require('@/page/cardForMeal/topUpMoney')), 'topUpMoney')
const myMealCard = resolve => require.ensure([], () => resolve(require('@/page/cardForMeal/myMealCard')), 'myMealCard')
const rechargesuccess = resolve => require.ensure([], () => resolve(require('@/page/cardForMeal/rechargesuccess')), 'rechargesuccess')
const leaseCardsuccess = resolve => require.ensure([], () => resolve(require('@/page/cardForMeal/leaseCardsuccess')), 'leaseCardsuccess')
const activitysuccesspage = resolve => require.ensure([], () => resolve(require('@/page/cardForMeal/activitysuccesspage')), 'activitysuccesspage')
const Parkingspace = resolve => require.ensure([], () => resolve(require('@/page/ParkingSpace/Parkingspace')), 'Parkingspace')
const parkingspacelist = resolve => require.ensure([], () => resolve(require('@/page/ParkingSpace/parkingspaceList')), 'parkingspaceList')
const Parkingcarddetails = resolve => require.ensure([], () => resolve(require('@/page/ParkingSpace/Parkingcarddetails')), 'Parkingcarddetails')
const parkingstubmy = resolve => require.ensure([], () => resolve(require('@/page/ParkingSpace/parkingstubmy')), 'parkingstubmy')
const cardnumber = resolve => require.ensure([], () => resolve(require('@/page/ParkingSpace/cardnumber')), 'cardnumber')
const edit = resolve => require.ensure([], () => resolve(require('@/page/editBox/edit')), 'edit')
const activitydetails = resolve => require.ensure([], () => resolve(require('@/page/activityChild/activitydetails')), 'activitydetails')
const activityApply = resolve => require.ensure([], () => resolve(require('@/page/activityChild/activityApply')), 'activityApply')
const activitygrade = resolve => require.ensure([], () => resolve(require('@/page/activityChild/activitygrade')), 'activitygrade')
const activityMy = resolve => require.ensure([], () => resolve(require('@/page/activityChild/activityMy')), 'activityMy')
const Bindingapproval = resolve => require.ensure([], () => resolve(require('@/page/BindingApproval/Bindingapproval')), 'Bindingapproval')
const approvaldetails = resolve => require.ensure([], () => resolve(require('@/page/BindingApproval/approvaldetails')), 'approvaldetails')
const expensecalendar = resolve => require.ensure([], () => resolve(require('@/page/expenseCalendar/expensecalendar')), 'expensecalendar')
const activity = resolve => require.ensure([], () => resolve(require('@/page/switchingPage/activity')), 'activity')
const indexhome = resolve => require.ensure([], () => resolve(require('@/page/switchingPage/indexhome')), 'indexhome')
const personal = resolve => require.ensure([], () => resolve(require('@/page/switchingPage/personal')), 'personal')
const bulletinList = resolve => require.ensure([], () => resolve(require('@/page/systemBulletin/bulletinList')), 'bulletinList')
const bulletindetails = resolve => require.ensure([], () => resolve(require('@/page/systemBulletin/bulletindetails')), 'bulletindetails')
const defeated = resolve => require.ensure([], () => resolve(require('@/page/defeated/defeated')), 'defeated')
export default new Router({
  // mode: 'history',
  routes: [
    { path: '/', redirect: '/home' }, // 重定向,指向了home组件
    {
      path: '/home',
      name: 'home',
      component: home,
      redirect: '/indexhome',
      children: [
        {
          path: '/indexhome',
          name: 'indexhome',
          component: indexhome,
          meta: {
            title: '联东员工服务平台',
            homeShow: false
          }
        },
        {
          path: '/topUp',
          name: 'topUp',
          component: topUp,
          meta: {
            title: '就餐',
            homeShow: false
          }
        },
        {
          path: '/activity',
          name: 'activity',
          component: activity,
          meta: {
            title: '活动',
            homeShow: false
          }
        },
        {
          path: '/personal',
          name: 'personal',
          component: personal,
          meta: {
            title: '个人中心',
            homeShow: false
          }
        }
      ]
    },
    {
      path: '/boundenterprise',
      name: 'boundenterprise',
      component: boundenterprise,
      meta: {
        title: '企业绑定',
        homeShow: true
      }
    },
    {
      path: '/information',
      name: 'information',
      component: information,
      meta: {
        title: '企业绑定',
        homeShow: true
      }
    },
    {
      path: '/topup',
      name: 'topUp',
      component: topUp,
      meta: {
        title: '我的餐卡',
        homeShow: true
      }
    },
    {
      path: '/mealCard',
      name: 'mealCard',
      component: mealCard,
      meta: {
        title: '绑定餐卡',
        homeShow: true
      }
    },
    {
      path: '/topUpMoney',
      name: 'topUpMoney',
      component: topUpMoney,
      meta: {
        title: '餐卡充值',
        homeShow: true
      }
    },
    {
      path: '/rechargesuccess',
      name: 'rechargesuccess',
      component: rechargesuccess,
      meta: {
        title: '充值状态',
        homeShow: true
      }
    },
    {
      path: '/leaseCardsuccess',
      name: 'leaseCardsuccess',
      component: leaseCardsuccess,
      meta: {
        title: '车位长租充值状态',
        homeShow: true
      }
    },
    {
      path: '/activitysuccesspage',
      name: 'activitysuccesspage',
      component: activitysuccesspage,
      meta: {
        title: '活动报名充值状态',
        homeShow: true
      }
    },
    {
      path: '/Parkingspace',
      name: 'Parkingspace',
      component: Parkingspace,
      meta: {
        title: '车位长租',
        homeShow: true
      }
    },
    {
      path: '/parkingspacelist',
      name: 'parkingspacelist',
      component: parkingspacelist,
      meta: {
        title: '停车卡',
        homeShow: true
      }
    },
    {
      path: '/Parkingcarddetails',
      name: 'Parkingcarddetails',
      component: Parkingcarddetails,
      meta: {
        title: '停车卡详情',
        homeShow: true
      }
    },
    {
      path: '/edit',
      name: 'edit',
      component: edit,
      meta: {
        title: '编辑',
        homeShow: true
      }
    },
    {
      path: '/activitydetails',
      name: 'activitydetails',
      component: activitydetails,
      meta: {
        title: '活动详情',
        homeShow: true
      }
    },
    {
      path: '/activityApply',
      name: 'activityApply',
      component: activityApply,
      meta: {
        title: '报名',
        homeShow: true
      }
    },
    {
      path: '/activitygrade',
      name: 'activitygrade',
      component: activitygrade,
      meta: {
        title: '评分',
        homeShow: true
      }
    },
    {
      path: '/Bindingapproval',
      name: 'Bindingapproval',
      component: Bindingapproval,
      meta: {
        title: '绑定审批',
        homeShow: true
      }
    },
    {
      path: '/approvaldetails',
      name: 'approvaldetails',
      component: approvaldetails,
      meta: {
        title: '审批详情',
        homeShow: true
      }
    },
    {
      path: '/expensecalendar',
      name: 'expensecalendar',
      component: expensecalendar,
      meta: {
        title: '消费记录',
        homeShow: true
      }
    },
    {
      path: '/activityMy',
      name: 'activityMy',
      component: activityMy,
      meta: {
        title: '我的活动',
        homeShow: true
      }
    },
    {
      path: '/parkingstubmy',
      name: 'parkingstubmy',
      component: parkingstubmy,
      meta: {
        title: '我的停车卡',
        homeShow: true
      }
    },
    {
      path: '/cardnumber',
      name: 'cardnumber',
      component: cardnumber,
      meta: {
        title: '我的停车卡',
        homeShow: true
      }
    },
    {
      path: '/myMealCard',
      name: 'myMealCard',
      component: myMealCard,
      meta: {
        title: '我的餐卡',
        homeShow: true
      }
    },
    {
      path: '/bulletinList',
      name: 'bulletinList',
      component: bulletinList,
      meta: {
        title: '公告',
        homeShow: true
      }
    },
    {
      path: '/bulletindetails',
      name: 'bulletindetails',
      component: bulletindetails,
      meta: {
        title: '公告详情',
        homeShow: true
      }
    },
    {
      path: '/defeated',
      name: 'defeated',
      component: defeated,
      meta: {
        title: '',
        homeShow: true
      }
    }
  ]
})
