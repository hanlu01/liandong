// import Vue from 'vue'
/**权限指令**/
const has = Vue.directive('has', { inserted: function (el, binding, vnode) {   
  // 获取按钮权限
   let btnPermission = binding.arg
   if(!Vue.prototype.$_has(btnPermission)) {        
        el.parentNode.removeChild(el);    
   }
}});
// 权限检查方法
Vue.prototype.$_has = function (value) {
     let isExist = false;
     let btnPermissionsStr = sessionStorage.getItem("btnPermissions")
      if(btnPermissionsStr == undefined || btnPermissionsStr ==null) {         
          return false;
      }
      if(btnPermissionsStr.indexOf(value) > -1) {
          isExist =true;   
      }
     return isExist;
}
export {has};
