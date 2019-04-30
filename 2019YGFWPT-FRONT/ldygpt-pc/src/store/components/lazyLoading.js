/**
 *
 * 懒加载动态路由
 */
function lazy(code) {

    //return  resolve => require(["@/components/" + name + ".vue"], resolve)
    return getComponetByPath('/' + code);


}

function getComponetByPath(path) {
    for (var i = 0; i < dynamicRouter.length; i++) {
        var route = dynamicRouter[i];
        if (route.path == path) {
            return route.component;
        }
    }
}

/**
 * 路由定义
 * path跟配置里的资源标示对应,同时跟url地址对应
 */
const dynamicRouter = [
    {
        name: 'logInfomanager',
        path: '/logInfomanager',
        component: resolve => require.ensure([], () => resolve(require('@/page/systemManage/logInfomanager/index.vue')), 'logInfomanager'),
        meta: {
            title: '系统日志'
        }
    },
    {
        name: 'orgGroupManage',
        path: '/orgGroupManage',
        component: resolve => require.ensure([], () => resolve(require('@/page/systemManage/orgGroupManage/orgGroupManage.vue')), 'orgGroupManage'),
        meta: {
            title: '组织管理'
        }
    },
    {
        name: 'menuInfoManager',
        path: '/menuInfoManager',
        component: resolve => require.ensure([], () => resolve(require('@/page/systemManage/menuInfoManager/menuInfoManager.vue')), 'menuInfoManager'),
        meta: {
            title: '菜单管理'
        }
    },
    {
        name: 'ldUserInfoManager',
        path: '/ldUserInfoManager',
        component: resolve => require.ensure([], () => resolve(require('@/page/basic/ldUser/ldUserInfoManagement.vue')), 'ldUserInfoManager'),
        meta: {
            title: '内部账号管理'
        }
    },
    {
        name: 'dictionnaireManage',
        path: '/dictionnaireManage',
        component: resolve => require.ensure([], () => resolve(require('@/page/systemManage/dictionnaireManage/dictionnaireManage.vue')), 'dictionnaireManage'),
        meta: {
            title: '数据字典'
        }
    },
    {
        name: 'roleInfoManager',
        path: '/roleInfoManager',
        component: resolve => require.ensure([], () => resolve(require('@/page/systemManage/roleInfoManager/roleInfoManager.vue')), 'roleInfoManager'),
        meta: {
            title: '角色管理'
        }
    },
    {
        name: 'systemData',
        path: '/systemData',
        component: resolve => require.ensure([], () => resolve(require('@/page/systemManage/systemData/systemData.vue')), 'systemData'),
        meta: {
            title: '系统参数管理'
        }
    },
    {
        name: 'integralManage',
        path: '/integralManage',
        component: resolve => require.ensure([], () => resolve(require('@/page/systemManage/integralManage/integralManage.vue')), 'integralManage'),
        meta: {
            title: '积分管理'
        }
    },
    {
        name: 'integralRecord',
        path: '/integralRecord',
        component: resolve => require.ensure([], () => resolve(require('@/page/systemManage/integralManage/integralRecord.vue')), 'integralRecord'),
        meta: {
            title: '积分记录'
        }
    },
  {
    name: 'enterpriseEmpManager',
    path: '/enterpriseEmpManager',
    component: resolve => require.ensure([], () => resolve(require('@/page/basic/emp/enterpriseEmpInfo.vue')), 'enterpriseEmpManager'),
    meta: {
      title: '企业人员管理'
    }
  },
  {
    name: 'activityInfo',
    path: '/activityInfo',
    component: resolve => require.ensure([], () => resolve(require('@/page/basic/activity/activityInfo.vue')), 'activityInfo'),
    meta: {
      title: '园区活动管理'
    }
  },
  {
      name: 'enterprisePage',
      path: '/enterprisePage',
      component: resolve => require.ensure([], () => resolve(require('@/page/basic/enterprise/enterprisePage.vue')), 'enterprisePage'),
      meta: {
        title: '企业信息管理'
      }
  },
  {
        name: 'diningRoomInfo',
        path: '/diningRoomInfo',
        component: resolve => require.ensure([], () => resolve(require('@/page/basic/dining/diningRoomInfo.vue')), 'diningRoomInfo'),
        meta: {
          title: '餐厅信息管理'
        }
  },
  {
      name: 'diningStallInfo',
      path: '/diningStallInfo',
      component: resolve => require.ensure([], () => resolve(require('@/page/basic/dining/diningStallInfo.vue')), 'diningStallInfo'),
      meta: {
        title: '餐厅档口信息管理'
      }
  },
  {
      name: 'diningTerminalInfo',
      path: '/diningTerminalInfo',
      component: resolve => require.ensure([], () => resolve(require('@/page/basic/dining/diningTerminalInfo.vue')), 'diningTerminalInfo'),
      meta: {
        title: '档口终端设备信息管理'
      }
  },
  {
      name: 'activityScore',
      path: '/activityScore',
      component: resolve => require.ensure([], () => resolve(require('@/page/basic/activity/activityScoreInfo.vue')), 'activityScore'),
      meta: {
        title: '活动评分项管理'
      }
  },
  {
      name: 'parkLotInfo',
      path: '/parkLotInfo',
      component: resolve => require.ensure([], () => resolve(require('@/page/basic/parkLot/parkLotInfo.vue')), 'parkLotInfo'),
      meta: {
        title: '停车场管理'
      }
  },
  {
    name: 'activityApplyUserInfo',
    path: '/activityApplyUserInfo',
    component: resolve => require.ensure([], () => resolve(require('@/page/basic/activity/activityApplyUserInfo.vue')), 'activityApplyUserInfo'),
    meta: {
      title: '活动报名管理'
    }
  },
  {
    name: 'activityAdd',
    path: '/activityAdd',
    component: resolve => require.ensure([], () => resolve(require('@/page/basic/activity/activityAdd.vue')), 'activityAdd'),
    meta: {
      title: '新增活动'
    }
  },
  {
    name: 'activityCommentInfo',
    path: '/activityCommentInfo',
    component: resolve => require.ensure([], () => resolve(require('@/page/basic/activity/activityCommentInfo.vue')), 'activityCommentInfo'),
    meta: {
      title: '活动评论管理'
    }
  },
  {
    name: 'activityChinaPay',
    path: '/activityChinaPay',
    component: resolve => require.ensure([], () => resolve(require('@/page/basic/activity/activityChinaPay.vue')), 'activityChinaPay'),
    meta: {
      title: '活动分账管理'
    }
  },
  {
    name: 'leaseCardInfo',
    path: '/leaseCardInfo',
    component: resolve => require.ensure([], () => resolve(require('@/page/basic/leaseCard/leaseCardInfo.vue')), 'leaseCardInfo'),
    meta: {
      title: '长租卡管理'
    }
  },
  {
    name: 'diningRoomCzRule',
    path: '/diningRoomCzRule',
    component: resolve => require.ensure([], () => resolve(require('@/page/basic/dining/diningRoomCzRule.vue')), 'diningRoomCzRule'),
    meta: {
      title: '餐厅充值规则管理'
    }
  },
  {
    name: 'leaseCardOrderInfo',
    path: '/leaseCardOrderInfo',
    component: resolve => require.ensure([], () => resolve(require('@/page/basic/leaseCard/leaseCardOrderInfo.vue')), 'leaseCardOrderInfo'),
    meta: {
      title: '长租卡充值记录管理'
    }
  },
  {
    name: 'wxAccount',
    path: '/wxAccount',
    component: resolve => require.ensure([], () => resolve(require('@/page/basic/wx/wxAccount.vue')), 'wxAccount'),
    meta: {
      title: '微信用户管理'
    }
  },
  {
    name: 'cardOrder',
    path: '/cardOrder',
    component: resolve => require.ensure([], () => resolve(require('@/page/basic/dining/cardOrder.vue')), 'cardOrder'),
    meta: {
      title: '餐卡充值订单记录'
    }
  },
  {
    name: 'diningUserManager',
    path: '/diningUserManager',
    component: resolve => require.ensure([], () => resolve(require('@/page/basic/dining/diningUserManager.vue')), 'diningUserManager'),
    meta: {
      title: '餐卡充值订单记录'
    }
  },
  {
    name: 'diningConsumerRecord',
    path: '/diningConsumerRecord',
    component: resolve => require.ensure([], () => resolve(require('@/page/basic/dining/diningConsumerRecord.vue')), 'diningConsumerRecord'),
    meta: {
      title: '餐卡消费记录'
    }
  },
  {
    name: 'announcement',
    path: '/announcement',
    component: resolve => require.ensure([], () => resolve(require('@/page/systemManage/announcement/announcement.vue')), 'announcement'),
    meta: {
      title: '系统公告'
    }
  },
  {
    name: 'parkingRecord',
    path: '/parkingRecord',
    component: resolve => require.ensure([], () => resolve(require('@/page/basic/parkLot/parkingRecord.vue')), 'parkingRecord'),
    meta: {
      title: '车辆出入记录'
    }
  },

]
export {lazy}

