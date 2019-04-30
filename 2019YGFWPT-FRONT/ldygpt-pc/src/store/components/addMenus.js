/**
 * 动态添加菜单
 * author:qlx
 */
const addMenus = {
    state: {
        menuList: []
    },
    mutations: {
        add_Menus(state, param) {
            if (param) {
                var menuList = [];
                _addMenu(menuList, param);
                console.log(menuList)
                let buttons = "";
                if(menuList[0].hasOwnProperty('subs')){
                  buttons = menuList[0].subs;
                  if(buttons.length != 0 && menuList[0].subs[0].hasOwnProperty('subs')){
                    buttons = menuList[0].subs[0].subs;
                  }
                }
                sessionStorage.setItem('buttons', JSON.stringify(buttons))
                state.menuList = menuList;
            }

            function _addMenu(menuList, params) {
                for (var i = 0; i < params.length; i++) {
                    var menu = {
                        icon: 'el-icon-tickets',
                        index: '1',
                        title: '工作台',
                        subs: []
                    };
                    var menuParam = params[i];
                    if (menuParam.isShow == 0) {
                        continue;
                    }
                    menu.icon = menuParam.ico;
                    // menu.index=menuParam.orderBy;
                    menu.index = menuParam.permission;
                    menu.title = menuParam.pname;
                    if (menuParam.children && menuParam.children.length > 0) {
                        _addMenu(menu.subs, menuParam.children);
                    }
                    menuList.push(menu);
                }
            }
        }
    },
    actions: {
        add_Menus({commit}, param) {
            commit('add_Menus', param)
        }
    }
}
export default addMenus
