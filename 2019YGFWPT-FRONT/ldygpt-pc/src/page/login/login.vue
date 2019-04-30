<template>
    <div class="login_wrapper">
        <div class="login">
            <el-form :model="formLogin" :rules="rules" ref="ruleForm">
                <el-form-item>
                    <h2 class="title">联东园区服务平台</h2>
                </el-form-item>
                <el-form-item prop="loginName">
                    <el-input v-model="formLogin.loginName" placeholder="账号"></el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input v-model="formLogin.password" placeholder="密码" type="password"></el-input>
                </el-form-item>
                <el-form-item prop="code">
                    <el-col :span="14">
                        <el-input v-model="formLogin.code" placeholder="验证码"></el-input>
                    </el-col>
                    <el-col :span="10">
                        <img :src="codeImg" alt="" style="height:38px;cursor:pointer;margin-left: 22px;" @click="changeCode">
                    </el-col>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="login" :loading="loading">登陆</el-button>
                    <span v-show="this.errorInfo.isShowError" class='error'>
                        {{this.errorInfo.text}}
                    </span>
                </el-form-item>

            </el-form>

        </div>
    </div>
</template>

<style lang="scss">
    $input_width: 300px;

    .login_wrapper {
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;

        .login {
            width: 460px;
            height: 375px;
            margin-top: -150px;
            border: 1px solid #eaeaea;
            box-shadow: 0 0 25px #cac6c6;

            .title {
                text-align: center;
                color: #505458;
            }

            .el-form-item__content {
                width: $input_width;
            }

            .el-button {
                width: $input_width;
            }

            .el-form {
                margin: 30px 80px auto 80px;

                .error {
                    display: block;
                    text-align: center;
                    color: red;
                }
            }
        }
    }

    .recover {
        position: absolute;
        bottom: 0px;
        cursor: pointer;
        color: #E6A23C;
        display: none;
    }

    .bei {
        position: absolute;
        bottom: 20px;
        cursor: pointer;
        color: #505458;
    }
</style>

<script>
    export default {
        name: 'login',
        data() {
            return {
                loading: false,
                codeImg: '',
                timestamp: null,
                formLogin: {   //表单对象
                    loginName: '',
                    password: '',
                    code: ''
                },
                rules: {
                    loginName: [
                        {required: true, message: '请输入帐号', trigger: 'blur'}
                    ],
                    password: [
                        {required: true, message: '请输入密码', trigger: 'blur'}
                    ],
                    code: [
                        {required: true, message: '请输入验证码', trigger: 'blur'}
                    ]
                },
                errorInfo: {
                    text: '登陆失败,请重试',
                    isShowError: false //显示错误提示
                }
            }
        },
        created() {
            this.$common.removeSessionStorage('token');
            this.timestamp = Date.now()
        },
        mounted() {
            document.onkeydown = (event) => {
                var e = event || window.event || arguments.callee.caller.arguments[0];
                if (e && e.keyCode == 13) { // enter 键
                    this.login();
                }
            };
            this.getValidateCode()
        },
        methods: {
            changeCode() {
                this.timestamp = Date.now()
                this.getValidateCode()
            },
            getValidateCode() {
                let params = {
                    uuid: this.timestamp,
                    loginCode: 'code'
                }
                this.$api.getValidateCode(params).then(res => {
                    this.codeImg = 'data:image/png;base64,' + btoa(new Uint8Array(res).reduce((data, byte) => data + String.fromCharCode(byte), ''))
                })
            },
            login() {
                //调用后端登陆接口
                let _this = this
                this.$refs['ruleForm'].validate((valid) => {
                    if (valid) {
                        _this.loading = true
                        let params = {
                            acctName: this.formLogin.loginName,
                            password: this.formLogin.password,
                            uuid: this.timestamp,
                            validateCode: this.formLogin.code,
                            isLogin: true
                        }
                        _this.$api.login(params).then(res => {
                            if (res.code == 0) {
                                _this.$common.setSessionStorage('username', res.data.username);
                                _this.$common.setSessionStorage('token', res.data.token);
                                _this.$common.setSessionStorage('dics', res.data.dics);
                                _this.$common.setSessionStorage('btnPermissions', res.data.btnPermissions);
                                _this.getMenus()
                            } else {
                                _this.loading = false
                                _this.$message.error(res.msg)
                            }
                        })
                    }
                });
            },
            //获取菜单
            getMenus() {
                let params = {
                    parentId: 0
                }
                this.$api.getMenus(params).then(res => {
                    if (res.code == 0) {
                        this.$store.dispatch("add_Menus", JSON.parse(res.data));
                        this.$store.dispatch("add_Routes", JSON.parse(res.data));
                        this.$router.replace({path: "/ld/home"});
                        this.loading = false
                    }
                })
            }
        }
    }
</script>
