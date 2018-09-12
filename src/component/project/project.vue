<template>
    <div class="layout">
        <Layout >
            <Header :style="{position: 'fixed', width: '100%'}">
                <div style="width: 100%;height: 100%;">
                    <div class="logo" style="float:left"></div>
                    <div style="float:right ">
                        <Dropdown >
                            <a href="javascript:void(0)">
                                <Avatar style="background-color: #87d068" icon="ios-person" />
                                <Icon type="md-arrow-dropdown" />
                            </a>
                            <DropdownMenu slot="list">
                                <!--<DropdownItem name="修改密码">修改密码</DropdownItem>-->
                                <!--<div @click="useradmin" v-if="this.userId == 1">
                                    <DropdownItem name="用户中心" >用户中心</DropdownItem>
                                </div>-->
                                <div @click="logout">
                                    <DropdownItem name="退出系统" >退出系统</DropdownItem>
                                </div>

                            </DropdownMenu>
                        </Dropdown>
                    </div>
                </div>
            </Header>
            <Content :style="{margin: '88px 20% 0px 20%', background: '#fff', minHeight: '500px'}">
                <div style="width: 100%;height: 100%;display: flex;flex-wrap: wrap">
                    <div  v-for="item in projectListArr"  v-on:click="homePage(item.project_id)">
                        <Card  class="card" >
                            {{item.project_name}}
                        </Card>
                    </div>
                    <div class="card" @click="openEdit">
                        <Card   class="project_add">
                        </Card>
                    </div>
                </div>
            </Content>
            <Footer class="layout-footer-center"></Footer>
        </Layout>


        <Modal
                v-model="edit_modal"
                title="编辑项目"
                :loading="loading"
                @on-ok="closeEdit">
            <Form :model="formItem" :label-width="80">
                <div style="margin: 5px">
                    <FormItem label="项目名称">
                        <Input v-model="formItem.project_name" placeholder="请输入项目名称..."></Input>
                    </FormItem>
                </div>
            </Form>
        </Modal>
    </div>

</template>

<script>
    export default {
        name: "project",
        inject:["reload"],
        data() {
            return {
                projectListArr : [],
                edit_modal: false,
                loading: true,
                formItem: {
                    project_id:'',
                    project_name: ''
                },
                userId:''
            }
        },
        mounted: function(){
            this.projectList();
            let user = sessionStorage.getItem("user");
            let juser = JSON.parse(user);
            this.userId = juser.UserId;
        },
        methods: {
            projectList: function(){
                let user = sessionStorage.getItem("user");
                let juser = JSON.parse(user);
                this.$http.get("/project/list",{
                    params: {
                        userId:  juser.UserId
                    }
                })
                    .then(res=>{
                        this.projectListArr = res;
                        console.log(this.projectListArr);
                    })
                    .catch(err=>{
                        console.log(err)
                    })
            },
            homePage: function (id) {
                let user = sessionStorage.getItem("user");
                var juser = JSON.parse(user);
                juser.project_id = id;
                sessionStorage.setItem("user",JSON.stringify(juser));
                console.log('/home/api/list');
                this.$router.push({path:'/home', query: { project_id: id }})
            },
            openEdit: function () {
                this.edit_modal = true;
            },
            closeEdit: function(){
                this.$http.post("/project/save",{
                    project_id: this.formItem.project_id,
                    project_name: this.formItem.project_name
                })
                    .then(res=>{
                        this.edit_modal = false;
                        this.$Message.success('编辑成功');
                        this.reload();
                    })
                    .catch(err=>{
                        console.log(err)
                    });
            },
            logout: function () {
                this.$http.get("/logout")
                    .then(res=>{
                        sessionStorage.removeItem('user');
                        this.$router.push({path:'/'})
                    })
                    .catch(err=>{
                        console.log(err)
                    })
            },
            useradmin: function () {
                this.$router.push({path:'/home/user/list'})
            }
        }
    }
</script>

<style scoped>
    .card {
        width: 180px;
        height: 180px;
        margin: 10px;
        text-align: center;
        position:relative;
        vertical-align: middle;
        display:inline-block;
        line-height:150px;
    }
    .layout{
        border: 1px solid #d7dde4;
        background: #f5f7f9;
        position: relative;
        border-radius: 4px;
        overflow: hidden;
    }
    .layout-footer-center{
        text-align: center;
    }
    .logo {
        width: 200px;
        height: 100%;
        margin-top: 6px;
        background: url("../../assets/img/logo.png") no-repeat;
        background-size: 80% 80%;
    }

    .project_add{
        width: 180px;
        height: 180px;
        text-align: center;
        position:relative;
        vertical-align: middle;
        display:inline-block;
        line-height:150px;
        background: url("../../assets/img/add_icon.png") no-repeat center ;
        background-size: 30% 30%;
    }
</style>