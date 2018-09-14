<template>
    <div class="loginbackground">
        <Card class="login">
            <p slot="title">
                欢迎登录
            </p>
            <Form ref="formInline" :model="formInline" :rules="ruleInline" >
                <FormItem prop="user" style="width: 100%">
                    <Input type="text" v-model="formInline.user" placeholder="Username" style="width: 100%">
                        <Icon type="ios-person-outline" slot="prepend"></Icon>
                    </Input>
                </FormItem>
                <FormItem prop="password" style="width: 100%">
                    <Input type="password" v-model="formInline.password" placeholder="Password" style="width: 100%">
                        <Icon type="ios-lock-outline" slot="prepend"></Icon>
                    </Input>
                </FormItem>
                <FormItem style="width: 100%">
                    <Button type="primary" @click="login('formInline')" style="width: 100%">登录</Button>
                </FormItem>
            </Form>

        </Card>
    </div>
</template>

<script>
    import md5 from 'js-md5';
    export default {
        data() {
            return {
                imgSrc: require("../../assets/img/loginbackground.jpeg"),
                formInline: {
                    user: '',
                    password: ''
                },
                ruleInline: {
                    user: [
                        { required: true, message: '请输入用户名', trigger: 'blur' }
                    ],
                    password: [
                        { required: true, message: '请输入密码', trigger: 'blur' },
                        { type: 'string', min: 6, message: '密码必须大于6位', trigger: 'blur' }
                    ]
                },
            }
        },
        mounted: function(){
            /*const user = sessionStorage.getItem("user");
            if (user !== undefined && user !== null && user !== "") {
                this.$router.push({path: '/project'});
            }*/
        },
        methods: {
            login: function (name) {
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        console.log(md5('123456'));
                        this.formInline.password = md5(this.formInline.password);
                        console.log('new');
                        console.log(this.formInline);
                        this.$http.post("/login",{
                            username: this.formInline.user,
                            password: this.formInline.password
                        })
                            .then(res=>{
                                console.log("res:");
                                console.log(res);
                                sessionStorage.setItem("user",JSON.stringify(res));
                                this.$router.push({path: '/project'})
                            })
                            .catch(err=>{
                                console.log(err)
                            });
                    } else {
                        this.$Message.error('Fail!');
                    }
                })
            }
        }
    }
</script>

<style  scoped>


    .loginbackground {
        width: 100%;
        height: 100%;
        background-size: cover;
        background: url("../../assets/img/loginbackground.jpeg") no-repeat  ;
    }
    .login {
        width: 300px;
        height: 250px;
        margin: auto;
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
    }

</style>