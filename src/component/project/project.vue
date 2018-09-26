<template>
    <Layout >
        <Layout >
            <Header style="position: fixed; width: 100%;z-index:1000">
                <div style="width: 100%;height: 100%;">
                    <div class="logo" style="float:left"></div>
                    <div style="float:right ">
                        <Dropdown >
                            <a href="javascript:void(0)" style="color: white">
                                <!--<Avatar style="background-color: #87d068" icon="ios-person" />-->
                                {{username}}
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
            <Content :style="{margin: '88px 20% 0px 20%',  minHeight: '700px'}">
                <Row :gutter="16" type="flex" >
                    <div v-for="item in projectListArr"  >
                        <Col span="4" >
                            <Card  class="card" >
                                {{item.project_name}}
                                <div class="demo-cover">
                                    <Icon  type="ios-eye-outline" @click.native="homePage(item.project_id)"></Icon>
                                    <Icon  type="ios-trash-outline" @click.native="deleteProject(item.project_id)"></Icon>
                                </div>
                            </Card>
                        </Col>
                    </div>
                    <div  class="card" @click="openEdit">
                        <Col span="4" >
                            <Card   class="project_add">
                            </Card>
                        </Col>
                    </div>
                </Row>
            </Content>
            <Footer class="layout-footer-center"></Footer>
        </Layout>
        <Footer class="layout-footer-center">2018-2028 &copy; API文档管理系统</Footer>

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

        <Modal
                v-model="delete_model"
                title="删除项目"
                @on-ok="closeDelete"
        >
            <p>您确定要删除该项目吗？</p>
            <p style="color: red">（删除项目后,该项目下所有API将被删除）</p>
        </Modal>
    </Layout>

</template>

<script>
    export default {
        name: "project",
        inject:["reload"],
        data() {
            return {
                projectListArr : [],
                edit_modal: false,
                delete_model: false,
                loading: true,
                formItem: {
                    project_id:'',
                    project_name: ''
                },
                userId:'',
                delete_project_id: '',
                username:''
            }
        },
        mounted: function(){
            this.projectList();
            let user = localStorage.getItem("user");
            let juser = JSON.parse(user);
            this.username = juser.UserUsername;
            this.userId = juser.UserId;
        },
        methods: {
            projectList: function(){
                let user = localStorage.getItem("user");
                let juser = JSON.parse(user);
                this.$http.get("/project/list",{
                    params: {
                        userId:  juser.UserId
                    }
                })
                    .then(res=>{
                        this.projectListArr = res.data;
                        console.log(this.projectListArr);
                    })
                    .catch(err=>{
                        console.log(err)
                    })
            },
            homePage: function (id) {
                let user = localStorage.getItem("user");
                var juser = JSON.parse(user);
                juser.project_id = id;
                localStorage.setItem("user",JSON.stringify(juser));
                console.log('/home/api/list');
                this.$router.push({path:'/home', query: { project_id: id }})
            },
            deleteProject: function(id){
                console.log("project_id:");
                console.log(id);
                this.delete_project_id = id;
                this.delete_model = true
            },
            openEdit: function () {
                this.edit_modal = true;
            },
            closeEdit: function(){
                this.formItem.project_id = '';
                if( this.formItem.project_name == undefined ||  this.formItem.project_name == null ||  this.formItem.project_name == ""){
                    this.edit_modal = false;
                    this.$Message.error('项目名称不能为空');
                    return;
                }else if(this.formItem.project_name.length > 15){
                    this.edit_modal = false;
                    this.$Message.error('不能超过15个字');
                    return;
                }
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
            closeDelete: function(){
                if(this.delete_project_id == undefined || this.delete_project_id==null || this.delete_project_id==""){
                    this.$Message.error('项目id不能为空');
                    return;
                }
                console.log("closeDelete:");
                console.log(this.delete_project_id);
                this.$http.get("/project/delete",{
                    params: {
                        project_id: this.delete_project_id
                    }
                })
                    .then(res=>{
                        this.delete_model = false;
                        this.$Message.success('删除成功');
                        this.reload();
                    })
                    .catch(err=>{
                        console.log(err)
                    });
            },
            logout: function () {
                this.$http.get("/logout")
                    .then(res=>{
                        localStorage.removeItem('user');
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
        margin-bottom: 10px;
        text-align: center;
        position:relative;
        vertical-align: middle;
        display:inline-block;
        line-height:150px;
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

    .demo-cover{
        display: none;
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        background: rgba(0,0,0,.6);
    }
    .card:hover .demo-cover{
        display: block;
    }
    .demo-cover i{
        color: #fff;
        font-size: 40px;
        cursor: pointer;
        margin: 0 2px;
    }
</style>