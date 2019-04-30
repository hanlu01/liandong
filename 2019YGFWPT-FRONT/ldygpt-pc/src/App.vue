<template>
    <div id="app">
        <router-view></router-view>
    </div>
</template>
<style lang="scss">
    @import "../static/css/main.css";
    @import "../static/css/theme-blue/color-blue.css";
    @import '../static/css/theme-blue/index.css';
    @import "./assets/css/element.scss"; /*引用全局element-ui样式*/

    /*diy*/
    .el-form-item.is-success .el-input__inner, .el-form-item.is-success .el-input__inner:focus, .el-form-item.is-success .el-textarea__inner, .el-form-item.is-success .el-textarea__inner:focus {
        border-color: #00AFEB !important;
    }

    .el-button--primary {
        background-color: #00AFEB !important;
        border-color: #00AFEB !important;
    }

    .el-button--primary.is-plain {
        color: #FFFFFF !important;
    }

    .el-pagination.is-background .el-pager li:not(.disabled).active {
        background-color: #00AFEB !important;
    }

    .el-pagination.is-background .el-pager li:not(.disabled):hover {
        color: #00AFEB !important;
    }

    .el-radio__input.is-checked .el-radio__inner {
        color: #00AFEB !important;
        background-color: #00AFEB !important;
        border-color: #00AFEB !important;
    }

    .el-radio__input.is-checked + .el-radio__label {
        color: #00AFEB !important;
    }
</style>
