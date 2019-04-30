import axios from 'axios'
import baseURL from '../plugins/ipConfig'
import qs from 'qs'
import router from '../router'

// axios 配置
axios.defaults.timeout = 100000
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8'

// POST传参序列化 拦截
axios.interceptors.request.use((config) => {
    let token = sessionStorage.getItem('token')
    if (config.method === 'post' && !config.url.endsWith('file/excelFileUpload')) {
        config.data = qs.stringify(config.data)
    } else {
        config.data = config.data
    }
    if (config.method === 'get') {
        config.url += '?timestamp=' + Date.now()
    }
    // 判断是否存在token，如果存在的话，则每个http header都加上token
    if (token) {
        config.headers['token'] = token
    }
    config.headers['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8'
    return config
}, (error) => {
    return Promise.reject(error)
})

// 返回状态判断
axios.interceptors.response.use((res) => {
    let token = sessionStorage.getItem('token')
    if (!res) {
        return Promise.reject(res)
    }
    console.log(token)
    if (res.data.code == 3 || res.data.code == 10 || res.data.code == 2) {
        setTimeout(function () {
            sessionStorage.removeItem('token')
            router.push({
                path: '/ld/login'
            })
        }, 1000)
    }
    if (token && res.data.code == 0) {
        sessionStorage.setItem('token', res.data.token)
    }
    return res
}, (error) => {
    return Promise.reject(error)
})

// 获取数据
export function fetchData(url, params, method = 'get', ContentType) {
    return new Promise((resolve, reject) => {
        let config = {
            method: method,
            url: url
        }
        if (ContentType) {
            axios.defaults.headers.post['Content-Type'] = ''
        }
        axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8'
        method === 'get' ? config.params = params : config.data = params
        axios(config)
            .then(response => {
                if (response.data.state !== 200) {
                    if (response.data.msg) {
                    }
                }
                resolve(response.data)
            }, err => {
                console.log(err)
            })
            .catch((error) => {
                console.log(error)
            })
    })
}

export function codeData(url, params, method = 'get', ContentType) {
    return new Promise((resolve, reject) => {
        let config = {
            method: method,
            url: url,
            responseType: 'arraybuffer'
        }
        if (ContentType) {
            axios.defaults.headers.post['Content-Type'] = ''
        }
        axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8'
        method === 'get' ? config.params = params : config.data = params
        axios(config)
            .then(response => {
                if (response.data.state !== 200) {
                    if (response.data.msg) {
                    }
                }
                resolve(response.data)
            }, err => {
                console.log(err)
            })
            .catch((error) => {
                console.log(error)
            })
    })
}

export function loginData(url, params, method = 'get', ContentType) {
    return new Promise((resolve, reject) => {
        let config = {
            method: method,
            url: url
        }
        if (ContentType) {
            axios.defaults.headers.post['Content-Type'] = ''
        }
        axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8'
        method === 'get' ? config.params = params : config.data = params
        if (params.isLogin) {
            config.url += '?uuid=' + params.uuid + '&validateCode=' + params.validateCode
        }
        axios(config)
            .then(response => {
                if (response.data.state !== 200) {
                    if (response.data.msg) {
                    }
                }
                resolve(response.data)
            }, err => {
                console.log(err)
            })
            .catch((error) => {
                console.log(error)
            })
    })
}

export default {
    //登录
    login(params) {
        return loginData(baseURL.basicApi + '/ldygpt-pc-web/api/sys/user/login', params, 'post')
    },
    //登录获取验证码
    getValidateCode(params) {
        return codeData(baseURL.basicApi + '/ldygpt-pc-web/api/sys/validateCode/getValidateCode', params)
    },
    //登录获取菜单
    getMenus(params) {
        return fetchData(baseURL.basicApi + '/ldygpt-pc-web/api/sys/user/menus', params, 'post')
    },
    //登录获取菜单
    getTreeMenus(params) {
        return fetchData(baseURL.basicApi + '/ldygpt-pc-web/api/sys/syspermission/getMenuTree', params, 'post')
    },
    //新增菜单
    addTreeMenus(params) {
        return fetchData(baseURL.basicApi + '/ldygpt-pc-web/api/sys/syspermission/addSave', params, 'post')
    },
    //修改菜单
    modifyTreeMenus(params) {
        return fetchData(baseURL.basicApi + '/ldygpt-pc-web/api/sys/syspermission/editSave', params, 'post')
    },
    //删除菜单
    deleteTreeMenus(params) {
        return fetchData(baseURL.basicApi + '/ldygpt-pc-web/api/sys/syspermission/deleteData', params, 'post')
    },
    //删除租户
    deleteTenement(params) {
        return fetchData(baseURL.basicApi + '/ldygpt-pc-web/api/sys/tenement/deleteData', params, 'post')
    },
    //内部账号列表
    getLdUserList(params) {
        return fetchData(baseURL.basicApi + '/ldygpt-pc-web/api/sys/user/findLdUserPage', params)
    },
    //重置密码
    resetPwd(params) {
        return fetchData(baseURL.basicApi + '/ldygpt-pc-web/api/sys/user/resetPwd', params, 'post')
    },
    //新增用户
    addSaveUser(params) {
        return fetchData(baseURL.basicApi + '/ldygpt-pc-web/api/sys/user/addSaveUser', params, 'post')
    },
    //用户详情
    getUserDetails(params) {
        return fetchData(baseURL.basicApi + '/ldygpt-pc-web/api/sys/user/getDetails', params)
    },
    //修改用户信息
    editSaveUser(params) {
        return fetchData(baseURL.basicApi + '/ldygpt-pc-web/api/sys/user/editSaveUser', params, 'post')
    },
    //修改用户状态
    modifyUserStatus(params) {
        return fetchData(baseURL.basicApi + '/ldygpt-pc-web/api/sys/user/modifyStatus', params, 'post')
    },
    //修改用户对应角色
    updateUserRole(params) {
        return fetchData(baseURL.basicApi + '/ldygpt-pc-web/api/sys/user/updateUserRole', params, 'post')
    },
    //查找组织树
    findGroupAndUser(params) {
        return fetchData(baseURL.basicApi + '/ldygpt-pc-web/api/sys/user/findGroupAndUser', params)
    },
    //删除用户
    deleteUser(params) {
        return fetchData(baseURL.basicApi + '/ldygpt-pc-web/api/sys/user/deleteData', params, 'post')
    },
    //数据字典
    getDictionnaire(params) {
        return fetchData(baseURL.basicApi + '/ldygpt-pc-web/api/sys/dictionnaire/findPage', params)
    },
    //新增数据字典
    addDictionnaire(params) {
        return fetchData(baseURL.basicApi + '/ldygpt-pc-web/api/sys/dictionnaire/addDictionnaire', params, 'post')
    },
    //修改字典信息
    modifyDictionnaire(params) {
        return fetchData(baseURL.basicApi + '/ldygpt-pc-web/api/sys/dictionnaire/modifyDictionnaire', params, 'post')
    },
    //修改字典状态
    modifyDictionnaireStatus(params) {
        return fetchData(baseURL.basicApi + '/ldygpt-pc-web/api/sys/dictionnaire/modifyDictionnaireStatus', params, 'post')
    },
    //批量删除字典数据
    deleteDictionnaire(params) {
        return fetchData(baseURL.basicApi + '/ldygpt-pc-web/api/sys/dictionnaire/deleteData', params, 'post')
    },
    //获取字典,明细列表
    queryDictListById(params) {
        return fetchData(baseURL.basicApi + '/ldygpt-pc-web/api/sys/dictionnaire/queryListById', params)
    },
    //新增字典明细
    addDictById(params) {
        return fetchData(baseURL.basicApi + '/ldygpt-pc-web/api/sys/dictionnaire/addById', params, 'post')
    },
    //修改字典明细
    modifyDictDdetail(params) {
        return fetchData(baseURL.basicApi + '/ldygpt-pc-web/api/sys/dictionnaire/modifyDdetail', params, 'post')
    },
    //修改字典明细状态
    modifyDdetailStatus(params) {
        return fetchData(baseURL.basicApi + '/ldygpt-pc-web/api/sys/dictionnaire/modifyDdetailStatus', params, 'post')
    },
    //删除字典明细
    deleteDictdetailData(params) {
        return fetchData(baseURL.basicApi + '/ldygpt-pc-web/api/sys/dictionnaire/deleteDetailData', params, 'post')
    },
    //角色列表
    getRoleList(params) {
        return fetchData(baseURL.basicApi + '/ldygpt-pc-web/api/sys/role/findPage', params)
    },
    //新增角色
    addRole(params) {
        return fetchData(baseURL.basicApi + '/ldygpt-pc-web/api/sys/role/addRole', params, 'post')
    },
    //查询角色详情
    getRoleDetails(params) {
        return fetchData(baseURL.basicApi + '/ldygpt-pc-web/api/sys/role/getDetails', params)
    },
    //修改角色信息
    modifyRole(params) {
        return fetchData(baseURL.basicApi + '/ldygpt-pc-web/api/sys/role/modifyRole', params, 'post')
    },
    //保存角色对应菜单关系接口
    updateRolePermission(params) {
        return fetchData(baseURL.basicApi + '/ldygpt-pc-web/api/sys/role/updateRolePermission', params, 'post')
    },
    //删除角色
    deleteRole(params) {
        return fetchData(baseURL.basicApi + '/ldygpt-pc-web/api/sys/role/deleteData', params, 'post')
    },
    //修改角色状态
    modifyRoleStatus(params) {
        return fetchData(baseURL.basicApi + '/ldygpt-pc-web/api/sys/role/modifyRoleStatus', params, 'post')
    },
    //获取当前角色已拥有的权限
    getRoleHasMenus(params) {
        return fetchData(baseURL.basicApi + '/ldygpt-pc-web/api/sys/role/getRoleHasMenus', params)
    },
    //系统参数列表
    sysParamsList(params) {
        return fetchData(baseURL.basicApi + '/ldygpt-pc-web/api/sys/sysParams/findPage', params)
    },
    //新增系统参数
    addSysParams(params) {
        return fetchData(baseURL.basicApi + '/ldygpt-pc-web/api/sys/sysParams/addSysParams', params, 'post')
    },
    //修改系统参数
    modifySysParams(params) {
        return fetchData(baseURL.basicApi + '/ldygpt-pc-web/api/sys/sysParams/modifySysParams', params, 'post')
    },
    //修改状态
    modifySysParamsStatus(params) {
        return fetchData(baseURL.basicApi + '/ldygpt-pc-web/api/sys/sysParams/modifySysParamsStatus', params, 'post')
    },
    //删除系统参数
    deleteSysParams(params) {
        return fetchData(baseURL.basicApi + '/ldygpt-pc-web/api/sys/sysParams/deleteData', params, 'post')
    },
    //新增组织
    addGroupTrees(params) {
        return fetchData(baseURL.basicApi + '/ldygpt-pc-web/api/sys/group/addGroup', params, 'post')
    },
    //删除组织
    deleteGroupTrees(params) {
        return fetchData(baseURL.basicApi + '/ldygpt-pc-web/api/sys/group/deleteGroup', params, 'post')
    },
    //修改组织
    updateGroupTrees(params) {
        return fetchData(baseURL.basicApi + '/ldygpt-pc-web/api/sys/group/updateGroup', params, 'post')
    },
    //文件下载
    downLoadTempFileByName(fileName,iframe) {
        window.open(baseURL.basicApi + '/ldygpt-pc-web/api/file/downloadTempFile?fileName=' + fileName,iframe);
    },
    //导入文件
    excelFileUpload(params) {
        return fetchData(baseURL.basicApi + '/ldygpt-pc-web/api/file/excelFileUpload', params, 'post')
    },
    //获取文件上传进度
    getExportExcelSchedule(params) {
        return fetchData(baseURL.basicApi + '/ldygpt-pc-web/api/file/getExportExcelSchedule', params, 'post')
    },
    //文件上传信息获取
    getImportParameter(params) {
        return fetchData(baseURL.basicApi + '/ldygpt-pc-web/api/basics/temporaryShopRel/getImportParameter', params)
    },
    //查询人员积分
    getUserIntegralList(params) {
        return fetchData(baseURL.basicApi + '/ldygpt-pc-web/api/integral/findUserIntegralList', params, 'post')
    },
    //查询人员积分记录
    getIntegerRecord(params) {
        return fetchData(baseURL.basicApi + '/ldygpt-pc-web/api/integral/getIntegerRecord', params)
    },
    //获取导入员工积分参数
    getImportUserIntegralParameter(params) {
        return fetchData(baseURL.basicApi + '/ldygpt-pc-web/api/integral/getImportParameter', params)
    },
    // 获取组织结构树
    getEnterpriseTrees(params) {
        return fetchData(baseURL.basicApi + '/ldygpt-pc-web/api/sys/enterpriseInfo/getEnterpriseTrees', params)
    },
    //通过项目加载企业
    getEnterByProject(params){
        return fetchData(baseURL.basicApi + '/ldygpt-pc-web/api/basic/emp/getEnterByProject', params,'post')
    },
    //员工列表
    getEmpList(params) {
     return fetchData(baseURL.basicApi + '/ldygpt-pc-web/api/basic/emp/findPage', params)
    },
    //新增企业员工
    addSaveEmp(params) {
      return fetchData(baseURL.basicApi + '/ldygpt-pc-web/api/basic/emp/addSaveEmp', params, 'post')
    },
    //获取员工详情
    getEmpDetails(params) {
      return fetchData(baseURL.basicApi + '/ldygpt-pc-web/api/basic/emp/getDetails', params)
    },
    //修改员工信息
    editSaveEmp(params) {
      return fetchData(baseURL.basicApi + '/ldygpt-pc-web/api/basic/emp/editSaveUser', params, 'post')
    },
    //标记为管理员
    assignAdmin(params) {
      return fetchData(baseURL.basicApi + '/ldygpt-pc-web/api/basic/emp/assignAdmin', params, 'post')
    },
    //删除员工信息
    deleteEmp(params) {
      return fetchData(baseURL.basicApi + '/ldygpt-pc-web/api/basic/emp/deleteEmp', params, 'post')
    },
    //获取员工导入数据信息
    getImportEmpParameter(params){
      return fetchData(baseURL.basicApi + '/ldygpt-pc-web/api/basic/emp/getImportEmpParameter', params, 'post')
    },
    //导出企业员工数据
    exportEmpData(params) {
      return fetchData(baseURL.basicApi + '/ldygpt-pc-web/api/basic/emp/exportEmpData', params, 'post')
    },
    //获取企业组织
    getEmpTrees(params) {
        return fetchData(baseURL.basicApi + '/ldygpt-pc-web/api/basic/emp/empTrees', params)
    },
    // 添加用户园区关系
    addEmpUser(params) {
        return fetchData(baseURL.basicApi + '/ldygpt-pc-web/api/basic/emp/addEmpUser', params,'post')
    },
    // 选择园区
    selected(params) {
        return fetchData(baseURL.basicApi + '/ldygpt-pc-web/api/basic/emp/selected', params)
    },
    // 企业列表
    getEnterprisePage(params) {
      return fetchData(baseURL.basicApi + '/ldygpt-pc-web/api/sys/enterpriseInfo/findPage', params)
    },

    // 校验企业手机号
    validateEnterPhone(params) {
      return fetchData(baseURL.basicApi + '/ldygpt-pc-web/api/sys/enterpriseInfo/validateEnterPhone', params)
    },

    //修改企业信息
    modifyEnterprise(params) {
      return fetchData(baseURL.basicApi + '/ldygpt-pc-web/api/sys/enterpriseInfo/modifyEnterprise', params, 'post')
    },

    //餐厅管理员分页列表
    findDiningUserPage(params) {
      return fetchData(baseURL.basicApi + '/ldygpt-pc-web/api/basic/diningRoomInfo/findDiningUserPage', params)
    },

    //餐厅管理员分页列表
    getDiningTreeList(params) {
      return fetchData(baseURL.basicApi + '/ldygpt-pc-web/api/basic/diningRoomInfo/getDiningTreeList', params)
    },

    //新增餐厅管理员
    addDiningUser(params) {
      return fetchData(baseURL.basicApi + '/ldygpt-pc-web/api/basic/diningRoomInfo/addDiningUser', params)
    },
    // 获取园区列表
    getParkList(params) {
        return fetchData(baseURL.basicApi + '/ldygpt-pc-web/api/basic/activity/getProjectList',params,'post')
      },
    // 获取活动评分列表
    getActivityScoreList() {
        return fetchData(baseURL.basicApi + '/ldygpt-pc-web/api/basic/activity/getActivityScoreList')
      },
    //添加活动
    getActivity(params) {
        return fetchData(baseURL.basicApi + '/ldygpt-pc-web/api/basic/activity/addActivity',params,'post')
    },

    //更新餐厅管理员--餐厅关联关系
    updateUserDiningRoomRel(params) {
      return fetchData(baseURL.basicApi + '/ldygpt-pc-web/api/basic/diningRoomInfo/updateUserDiningRoomRel', params, 'post')
    },

    //更新餐厅管理员--餐厅关联关系
    getUserRelDingRoom(params) {
      return fetchData(baseURL.basicApi + '/ldygpt-pc-web/api/basic/diningRoomInfo/getUserRelDingRoom', params,)
    },

    //获取所有的项目信息
    findAllProject() {
      return fetchData(baseURL.basicApi + '/ldygpt-pc-web/api/basic/diningRoomInfo/findAllProject')
    },
    //餐厅分页列表
    getDiningRoomInfoPage(params) {
      return fetchData(baseURL.basicApi + '/ldygpt-pc-web/api/basic/diningRoomInfo/findDinningRoomPage', params)
    },

    //餐厅列表
    findDiningRoomList(params) {
      return fetchData(baseURL.basicApi + '/ldygpt-pc-web/api/basic/diningRoomInfo/findDiningRoomList', params)
    },

    //获取餐厅设备厂商列表
    getDictTerminalManufacturer() {
      return fetchData(baseURL.basicApi + '/ldygpt-pc-web/api/basic/diningRoomInfo/getDictTerminalManufacturer')
    },

    //新增餐厅信息
    addDiningRoomInfo(params) {
      return fetchData(baseURL.basicApi + '/ldygpt-pc-web/api/basic/diningRoomInfo/addDiningRoomInfo', params, 'post')
    },

    //修改餐厅信息
    modifyDiningRoomInfo(params) {
      return fetchData(baseURL.basicApi + '/ldygpt-pc-web/api/basic/diningRoomInfo/modifyDiningRoomInfo', params, 'post')
    },

    //批量修改餐厅状态
    modifyDiningRoomInfoStatus(params) {
      return fetchData(baseURL.basicApi + '/ldygpt-pc-web/api/basic/diningRoomInfo/modifyDiningRoomInfoStatus', params, 'post')
    },

    //批量删除餐厅
    deleteDiningRoomInfo(params) {
      return fetchData(baseURL.basicApi + '/ldygpt-pc-web/api/basic/diningRoomInfo/deleteDiningRoomInfo', params, 'post')
    },

    //组装上传参数-导入餐厅
    getParamUploadDiningRoom() {
      return fetchData(baseURL.basicApi + '/ldygpt-pc-web/api/basic/diningRoomInfo/getParamUploadDiningRoom')
    },


  //餐厅档口分页列表
    findDinningStallPage(params) {
      return fetchData(baseURL.basicApi + '/ldygpt-pc-web/api/basic/diningStallInfo/findDinningStallPage', params)
    },

    //档口列表
    findDiningStallList(params) {
      return fetchData(baseURL.basicApi + '/ldygpt-pc-web/api/basic/diningStallInfo/findDiningStallList', params)
    },

    //新增餐厅档口信息
    addDiningStallInfo(params) {
      return fetchData(baseURL.basicApi + '/ldygpt-pc-web/api/basic/diningStallInfo/addDiningStallInfo', params, 'post')
    },

    //修改餐厅档口信息
    modifyDiningStallInfo(params) {
      return fetchData(baseURL.basicApi + '/ldygpt-pc-web/api/basic/diningStallInfo/modifyDiningStallInfo', params, 'post')
    },

    //批量修改餐厅档口状态
    modifyDiningStallInfoStatus(params) {
      return fetchData(baseURL.basicApi + '/ldygpt-pc-web/api/basic/diningStallInfo/modifyDiningStallInfoStatus', params, 'post')
    },

    //批量删除餐厅档口
    deleteDiningStallInfo(params) {
      return fetchData(baseURL.basicApi + '/ldygpt-pc-web/api/basic/diningStallInfo/deleteDiningStallInfo', params, 'post')
    },

    //组装上传参数-导入档口
    getParamUploadDiningStall() {
      return fetchData(baseURL.basicApi + '/ldygpt-pc-web/api/basic/diningStallInfo/getParamUploadDiningStall')
    },

    //餐厅档口终端设备分页列表
    findDiningTerminalPage(params) {
      return fetchData(baseURL.basicApi + '/ldygpt-pc-web/api/basic/diningTerminalInfo/findDiningTerminalPage', params)
    },

    //餐厅档口终端设备列表
    findDiningTerminalList(params) {
      return fetchData(baseURL.basicApi + '/ldygpt-pc-web/api/basic/diningTerminalInfo/findDiningTerminalList', params)
    },

    //新增餐厅档口终端设备信息
    addDiningTerminalInfo(params) {
      return fetchData(baseURL.basicApi + '/ldygpt-pc-web/api/basic/diningTerminalInfo/addDiningTerminalInfo', params, 'post')
    },

    //修改餐厅档口终端设备信息
    modifyDiningTerminalInfo(params) {
      return fetchData(baseURL.basicApi + '/ldygpt-pc-web/api/basic/diningTerminalInfo/modifyDiningTerminalInfo', params, 'post')
    },

    //批量修改餐厅档口终端设备状态
    modifyDiningTerminalStatus(params) {
      return fetchData(baseURL.basicApi + '/ldygpt-pc-web/api/basic/diningTerminalInfo/modifyDiningTerminalStatus', params, 'post')
    },

    //批量删除餐厅终端设备档口
    deleteDiningTerminalInfo(params) {
      return fetchData(baseURL.basicApi + '/ldygpt-pc-web/api/basic/diningStallInfo/deleteDiningTerminalInfo', params, 'post')
    },


    //组装上传参数-导入终端设备
    getParamUploadDiningTerminal() {
      return fetchData(baseURL.basicApi + '/ldygpt-pc-web/api/basic/diningTerminalInfo/getParamUploadDiningTerminal')
    },


    // 活动评分项分页列表
    getActivityScoreInfoList(params) {
      return fetchData(baseURL.basicApi + '/ldygpt-pc-web/api/activity/activityScoreInfo/findPage', params)
    },
    // 新增活动评分项
    addSaveActivityScoreInfo(params) {
      return fetchData(baseURL.basicApi + '/ldygpt-pc-web/api/activity/activityScoreInfo/addScoreInfo', params, 'post')
    },
    // 活动评分项 启用/禁用
    modifyScoreInfo(params) {
      return fetchData(baseURL.basicApi + '/ldygpt-pc-web/api/activity/activityScoreInfo/modifyScoreInfo', params, 'post')
    },
    // 获取评分项详情
    getActivityScoreDetails(params) {
      return fetchData(baseURL.basicApi + '/ldygpt-pc-web/api/activity/activityScoreInfo/getActivityScoreDetails', params)
    },
    // 修改活动评分项名称
    editSaveActivityScoreInfo(params) {
      return fetchData(baseURL.basicApi + '/ldygpt-pc-web/api/activity/activityScoreInfo/modifyScoreItemName', params, 'post')
    },
    // 停车场管理分页列表
    getParkLotInfoList(params) {
      return fetchData(baseURL.basicApi + '/ldygpt-pc-web/api/parkLot/parkLotInfo/findPage', params)
    },
    // 新增停车场信息
    addSaveLdParkLotInfo(params) {
      return fetchData(baseURL.basicApi + '/ldygpt-pc-web/api/parkLot/parkLotInfo/addParkLotInfo', params, 'post')
    },
    // 修改停车场信息
    editSaveLdParkLotInfo(params) {
      return fetchData(baseURL.basicApi + '/ldygpt-pc-web/api/parkLot/parkLotInfo/modifyParkLotInfo', params, 'post')
    },
    // 获取停车场信息详情
    getParkLotDetails(params) {
      return fetchData(baseURL.basicApi + '/ldygpt-pc-web/api/parkLot/parkLotInfo/getParkLotDetails', params)
    },
    // 批量删除停车场信息
    deleteParkLots(params) {
      return fetchData(baseURL.basicApi + '/ldygpt-pc-web/api/parkLot/parkLotInfo/deleteParkLots', params, 'post')
    },
    // 获取所属项目列表
    getProjectList(params) {
      return fetchData(baseURL.basicApi + '/ldygpt-pc-web/api/parkLot/parkLotInfo/findProjectList', params)
    },
    // 从数据字典获取评分项类型
    getScoreItemTypeList(params) {
      return fetchData(baseURL.basicApi + '/ldygpt-pc-web/api/activity/activityScoreInfo/getScoreItemTypeList', params)
    },
    // 从数据字典获取启用状态
    getScoreItemStatusList(params) {
      return fetchData(baseURL.basicApi + '/ldygpt-pc-web/api/activity/activityScoreInfo/getScoreItemStatusList', params)
    },
    // 从数据字典获取有无充电桩
    getIsChargingPileList(params) {
      return fetchData(baseURL.basicApi + '/ldygpt-pc-web/api/parkLot/parkLotInfo/getIsChargingPileList', params)
    },
    // 从数据字典获取有无地下车位
    getIsUnderSpaceList(params) {
      return fetchData(baseURL.basicApi + '/ldygpt-pc-web/api/parkLot/parkLotInfo/getIsUnderSpaceList', params)
    },
    // 从数据字典获取是否对外开放
    getIsOpenList(params) {
      return fetchData(baseURL.basicApi + '/ldygpt-pc-web/api/parkLot/parkLotInfo/getIsOpenList', params)
    },
    //查询活动列表信息
    getActivityList(params) {
      return fetchData(baseURL.basicApi + '/ldygpt-pc-web/api/basic/activity/findPage', params)
    },
    //修改活动状态
    upperActivityStatus(params) {
      return fetchData(baseURL.basicApi + '/ldygpt-pc-web/api/basic/activity/upperActivityStatus', params,'post')
    },
    //查询活动报名人员
    getActivityApplyUserList(params){
      return fetchData(baseURL.basicApi + '/ldygpt-pc-web/api/basic/activity/getActivityApplyUserList', params,'post')
    },
    //获取用户报名信息详情
    getFeedbackApplyInfoByUser(params){
      return fetchData(baseURL.basicApi + '/ldygpt-pc-web/api/basic/activity/getFeedbackApplyInfoByUser', params,'post')
    },
    //获取用户活动评分信息详情
    getFeedbackScoreInfoByUser(params){
      return fetchData(baseURL.basicApi + '/ldygpt-pc-web/api/basic/activity/getFeedbackScoreInfoByUser', params,'post')
    },
    // 从数据字典获取终端设备类型
    getDictTerminalType(params) {
      return fetchData(baseURL.basicApi + '/ldygpt-pc-web/api/basic/diningTerminalInfo/getDictTerminalType', params)
    },
    //获取用户报名信息详情
    getActivityCommentList(params){
      return fetchData(baseURL.basicApi + '/ldygpt-pc-web/api/basic/activity/getActivityCommentList', params,'post')
    },
    //活动置顶
    roofPlacement(params){
      return fetchData(baseURL.basicApi + '/ldygpt-pc-web/api/basic/activity/roofPlacement', params,'post')
    },
    //作废活动评论
    cancelComment(params){
      return fetchData(baseURL.basicApi + '/ldygpt-pc-web/api/basic/activity/cancelComment', params,'post')
    },
    //获取分账商户号信息
    getProjectChinaPayList(params){
        return fetchData(baseURL.basicApi + '/ldygpt-pc-web/api/basic/projectchinapay/findpage', params)
    },
    // 获取长租卡列表
    getLeaseCardInfoList(params) {
      return fetchData(baseURL.basicApi + '/ldygpt-pc-web/api/leaseCard/leaseCardInfo/findPage', params)
    },
  // 通过项目id获取停车场列表
    getParkLotInfoListByProjectId(params) {
      return fetchData(baseURL.basicApi + '/ldygpt-pc-web/api/leaseCard/leaseCardInfo/getParkLotInfoListByProjectId', params)
    },
    // 获取长租卡详情
    getLeaseCardDetails(params) {
      return fetchData(baseURL.basicApi + '/ldygpt-pc-web/api/leaseCard/leaseCardInfo/getLeaseCardDetails', params)
    },
    // 批量删除长租卡信息
    deleteLeaseCard(params) {
      return fetchData(baseURL.basicApi + '/ldygpt-pc-web/api/leaseCard/leaseCardInfo/deleteLeaseCard', params, 'post')
    },
    // 获取所属停车场信息
    findParkLotList(params) {
      return fetchData(baseURL.basicApi + '/ldygpt-pc-web/api/leaseCard/leaseCardInfo/findParkLotList', params)
    },
    // 数据字典获取长租卡类型
    getLeaseCardTypeList(params) {
      return fetchData(baseURL.basicApi + '/ldygpt-pc-web/api/leaseCard/leaseCardInfo/getLeaseCardTypeList', params)
    },
    // 数据字典获取长租卡出售范围
    getSallScopeList(params) {
      return fetchData(baseURL.basicApi + '/ldygpt-pc-web/api/leaseCard/leaseCardInfo/getSallScopeList', params)
    },
    // 保存长租卡信息
    saveLeaseCard(params) {
      return fetchData(baseURL.basicApi + '/ldygpt-pc-web/api/leaseCard/leaseCardInfo/saveLeaseCard', params, 'post')
    },
    // 上架/下架 长租卡
   updateCardStatus(params) {
      return fetchData(baseURL.basicApi + '/ldygpt-pc-web/api/leaseCard/leaseCardInfo/updateCardStatus', params, 'post')
    },
    // 获取餐厅充值规则列表
    getDiningRoomCzRuleList(params) {
      return fetchData(baseURL.basicApi + '/ldygpt-pc-web/api/basic/diningRoomCzRule/findPage', params)
    },

    // 根据所属餐厅批量删除餐厅充值规则
    deleteByDiningRoomIds(params) {
      return fetchData(baseURL.basicApi + '/ldygpt-pc-web/api/basic/diningRoomCzRule/deleteByDiningRoomIds', params)
    },

    // 新增餐厅充值规则信息
    addSaveDiningRoomCzRule(params) {
      return fetchData(baseURL.basicApi + '/ldygpt-pc-web/api/basic/diningRoomCzRule/add', params, 'post')
    },
    // 修改餐厅充值规则信息
    editSaveDiningRoomCzRule(params) {
      return fetchData(baseURL.basicApi + '/ldygpt-pc-web/api/basic/diningRoomCzRule/edit', params, 'post')
    },

    // 获取园区列表
    findProjectInfoList(params) {
      return fetchData(baseURL.basicApi + '/ldygpt-pc-web/api/basic/diningRoomCzRule/findProjectList', params)
    },
    // 通过项目id获取餐厅列表
    getDiningRoomListByProjectId(params) {
      return fetchData(baseURL.basicApi + '/ldygpt-pc-web/api/basic/diningRoomCzRule/getDiningRoomListByProjectId', params)
    },

  // 根据餐厅id获取餐厅充值规则列表详情
  getDiningRoomCzRuleInfo(params) {
    return fetchData(baseURL.basicApi + '/ldygpt-pc-web/api/basic/diningRoomCzRule/getDetail', params)
  },
  // 获取长租卡充值记录分页列表
  getLeaseCardOrderInfoList(params) {
    return fetchData(baseURL.basicApi + '/ldygpt-pc-web/api/leaseCard/leaseCardOrderInfo/findPage', params)
  },
  // 获取长租卡购买明细
  getLeaseCardOrderItemList(params) {
    return fetchData(baseURL.basicApi + '/ldygpt-pc-web/api/leaseCard/leaseCardOrderInfo/getLeaseCardOrderItemListByOrderNo', params)
  },
  // 处理长租卡时间
  dealLeaseCardTime(params) {
    return fetchData(baseURL.basicApi + '/ldygpt-pc-web/api/leaseCard/leaseCardOrderInfo/dealLeaseCardTime', params,'post')
  },
  // 根据开始时间计算截止时间
  getEndTimeByBegTime(params) {
    return fetchData(baseURL.basicApi + '/ldygpt-pc-web/api/leaseCard/leaseCardOrderInfo/getEndTimeByBegTime', params)
  },

    //获取园区绑定的餐厅设备厂商
    getManufacturerIdByProId(params) {
      return fetchData(baseURL.basicApi + '/ldygpt-pc-web/api/basic/diningRoomInfo/getManufacturerIdByProId', params)
    },

    //微信用户分页列表
    findWxAccountPage(params){
      return fetchData(baseURL.basicApi + '/ldygpt-pc-web/api/basic/wxAccount/findWxAccountPage', params)
    },

    //餐卡充值订单记录分页列表
    findDinningCardOrderPage(params){
      return fetchData(baseURL.basicApi + '/ldygpt-pc-web/api/basic/diningCardOrder/findDinningCardOrderPage', params)
    },
    //新增企业人员信息验证手机号是否使用
    validateEmpPhone(params){
      return fetchData(baseURL.basicApi + '/ldygpt-pc-web/api/basic/emp/validateempphone', params,'post')
    },
    //新增企业人员信息验证身份证号
    validateIdCardNumber(params){
      return fetchData(baseURL.basicApi + '/ldygpt-pc-web/api/basic/emp/validateidcardnumber', params,'post')
    },

    //餐卡充值订单记录分页列表
    findDiningConsumerRecordPage(params){
      return fetchData(baseURL.basicApi + '/ldygpt-pc-web/api/basic/diningConsumeRecord/findDiningConsumerRecordPage', params)
    },

    //修改餐厅管理员密码
    changeDiningUserPwd(params){
      return fetchData(baseURL.basicApi + '/ldygpt-pc-web/api/basic/diningRoomInfo/changeDiningUserPwd', params,'post')
    },
    //删除分账商户号信息
    deleteProjectChinaPay(params){
      return fetchData(baseURL.basicApi + '/ldygpt-pc-web/api/basic/projectchinapay/deleteprojectchinapay', params,'post')
    },
    //新增商户分帐号
    addAssetCorpAccount(params){
      return fetchData(baseURL.basicApi + '/ldygpt-pc-web/api/basic/projectchinapay/addassetcorpaccount', params,'post')
    },

    //pc后台手动餐卡充值
    diningCharge(params){
      return fetchData(baseURL.basicApi + '/ldygpt-pc-web/api/basic/diningCardOrder/diningCharge', params,'post')
    },
    //判断该园区是否已存在要添加的分账商户号
    checkAssetCorpAccount(params){
      return fetchData(baseURL.basicApi + '/ldygpt-pc-web/api/basic/projectchinapay/checkassetcorpaccount', params,'post')
    },
    exportChinaPayRelData(params){
      return fetchData(baseURL.basicApi + '/ldygpt-pc-web/api/basic/projectchinapay/exportprojectchinapay', params,'post')
    },
    //获取园区的分账商户号
    getAssetCorpAccount(params){
      return fetchData(baseURL.basicApi + '/ldygpt-pc-web/api/basic/projectchinapay/getassetcorpaccount', params,'post')
    },
    //获取活动详细信息
    getActivityDetail(params){
      return fetchData(baseURL.basicApi + '/ldygpt-pc-web/api/basic/activity/getActivityDetail', params,'post')
    },

    //餐厅列表导出
    roomExport(params){
      return fetchData(baseURL.basicApi + '/ldygpt-pc-web/api/basic/diningRoomInfo/roomExport', params,'post')
    },

    //档口列表导出
    stallExport(params){
      return fetchData(baseURL.basicApi + '/ldygpt-pc-web/api/basic/diningStallInfo/stallExport', params,'post')
    },

    //终端列表导出
    terminalExport(params){
      return fetchData(baseURL.basicApi + '/ldygpt-pc-web/api/basic/diningTerminalInfo/terminalExport', params,'post')
    },

  //系统公告分页列表
  getAnnouncementList(params){
    return fetchData(baseURL.basicApi + '/ldygpt-pc-web/api/sys/announcement/findPage', params)
  },
  //保存系统公告
  saveAnnouncement(params){
    return fetchData(baseURL.basicApi + '/ldygpt-pc-web/api/sys/announcement/saveOrUpdate', params,'post')
  },
  //系统公告 批量上架/批量下架
  updateAnnouncementStatus(params){
    return fetchData(baseURL.basicApi + '/ldygpt-pc-web/api/sys/announcement/updateAnnouncementStatus', params,'post')
  },
  //删除公告
  deleteAnnouncements(params){
    return fetchData(baseURL.basicApi + '/ldygpt-pc-web/api/sys/announcement/delete', params,'post')
  },
  //获取公告详情
  getAnnouncementDetails(params){
    return fetchData(baseURL.basicApi + '/ldygpt-pc-web/api/sys/announcement/getDetail', params)
  },
  //后台取消报名
  cancelSignUp(params){
    return fetchData(baseURL.basicApi + '/ldygpt-pc-web/api/basic/activity/cancelsignup', params,'post')
  },
  //车辆出入记录列表
  getParkingRecordList(params){
    return fetchData(baseURL.basicApi + '/ldygpt-pc-web/api/parkLot/parkingRecord/findPage', params)
  },
  //删除长租卡订单记录
  deleteOrder(params){
    return fetchData(baseURL.basicApi + '/ldygpt-pc-web/api/leaseCard/leaseCardOrderInfo/deleteOrder', params,'post')
  },
  //批量审批人员
  approvalEmp(params){
    return fetchData(baseURL.basicApi + '/ldygpt-pc-web/api/basic/emp/approvalemp', params,'post')
  }
}
