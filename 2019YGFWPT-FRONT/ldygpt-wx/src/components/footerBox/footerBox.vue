<template>
  <div class="footer">
    <ul>
      <li :class="{active:$route.path === '/'}" @click="$router.push('/')">
        <i></i>
        <span>首页</span>
      </li>
      <li :class="{active:$route.path === '/topup'}" @click="$router.push('/topup')">
        <i></i>
        <span>就餐</span>
      </li>
      <li :class="{active:$route.path === '/bindingPhone'}" @click="$router.push('/bindingPhone')">
        <i></i>
        <span>活动</span>
      </li>
      <li :class="{active:$route.path === '/topup'}" @click="$router.push('/topup')">
        <i></i>
        <span>我的</span>
      </li>
    </ul>
  </div>
</template>
<script>
export default {
  data () {
    return {
      // active: 0
    }
  }
}
</script>

<style lang="less">
// .footer {
//   width: 100%;
//   height: 50px;
//   position: fixed;
//   left: 0;
//   bottom: 0;
//   background: #fff;
//   ul{
//     display: flex;
//     li{
//       flex: 1;
//       padding: 8px 0;
//       text-align: center;
//       span{
//         font-size: 14px;
//       }
//       i{
//         display: block;
//         width:20px;
//         height: 20px;
//         margin: 0 auto;
//         background-size: cover;
//       }
//       &:nth-child(1) {
//         i{
//             background-image: url(../../assets/images/menu_home_normal@2x.png);
//           }
//       }
//       &:nth-child(2) {
//         i{
//             background-image: url(../../assets/images/menu_food_normal@2x.png);
//           }
//       }
//       &:nth-child(3) {
//         i{
//             background-image: url(../../assets/images/menu_activity_normal@2x.png);
//           }
//       }
//       &:nth-child(4) {
//         i{
//             background-image: url(../../assets/images/menu_user_normal@2x.png);
//           }
//       }
//       &.active{
//         &:nth-child(1) {
//           span{
//             color: red;
//           }
//           i{
//             &:nth-child(1){
//               background-image: url(../../assets/images/menu_home_selected@2x.png);
//             }
//           }
//         }
//         &:nth-child(2) {
//           span{
//             color: red;
//           }
//           i{
//             &:nth-child(1){
//               background-image: url(../../assets/images/menu_food_selected@2x.png);
//             }
//           }
//         }
//         &:nth-child(3) {
//           span{
//             color: red;
//           }
//           i{
//             &:nth-child(1){
//               background-image: url(../../assets/images/menu_activity_selected@2x.png);
//             }
//           }
//         }
//         &:nth-child(4) {
//           span{
//             color: red;
//           }
//           i{
//             &:nth-child(1){
//               background-image: url(../ );
//             }
//           }
//         }
//       }
//     }
//   }
// }
</style>
