import {lazy} from './lazyLoading'

/**
 * 拼接动态路由
 */
export default (routerList, routeHideList, sysMenuList) => {
    toRoutes(routerList, routeHideList, sysMenuList)
}

function toRoutes(routerList, routeHideList, sysMenuList) {
    if (sysMenuList) {
        for (var i = 0; i < sysMenuList.length; i++) {
            var sysMenuNode = sysMenuList[i];
            if (sysMenuNode.resourceType == 'menu' || sysMenuNode.resourceType == 'redirect') {
                var code = sysMenuNode.permission;
                var routeNode = {
                    name: code,
                    path: '/ld/' + code,
                    component: lazy(code),
                    meta: {title: sysMenuNode.pname},
                    children: []
                };
                //子节点存在
                if (sysMenuNode.children && sysMenuNode.children.length > 0) {
                    toRoutes(routerList, routeHideList, sysMenuNode.children);
                }
                if (code && code != '') {
                    routerList.push(routeNode);
                }
            } else {
                //子节点存在
                if (sysMenuNode.children && sysMenuNode.children.length > 0) {
                    toRoutes(routerList, routeHideList, sysMenuNode.children);
                }
            }
        }
    }
}
