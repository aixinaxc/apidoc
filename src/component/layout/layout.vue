<template>
    <Layout style="height: 100%;">
        <Layout>
            <Header style="position: fixed; width: 100%;z-index:1000">
                <Menu mode="horizontal" theme="dark" active-name="1">
                    <div style="float: left;display: flex">
                        <div class="logo" ></div>
                        <div class="layout-nav" >
                            <MenuItem name="1" >
                                <Icon type="ios-navigate"></Icon>
                                <span @click="openEdit"> 新增分类</span>
                            </MenuItem>
                            <MenuItem name="2">
                                <Icon type="ios-keypad"></Icon>
                                <span @click="apiEdit"> 新增API</span>
                            </MenuItem>
                        </div>
                    </div>
                    <Dropdown trigger="click"  style="float:right;" >
                        <a href="javascript:void(0)">
                            <Avatar style="background-color: #87d068" icon="ios-person" />
                            <Icon type="md-arrow-dropdown" />
                        </a>
                        <DropdownMenu slot="list">
                            <!--<DropdownItem name="修改密码">修改密码</DropdownItem>-->
                            <div @click="project">
                                <DropdownItem name="项目列表" >项目列表</DropdownItem>
                            </div>
                            <div @click="useradmin">
                                <DropdownItem name="用户中心" v-if="this.userId == 1">用户中心</DropdownItem>
                            </div>
                            <div @click="logout">
                                <DropdownItem name="退出系统" >退出系统</DropdownItem>
                            </div>

                        </DropdownMenu>
                    </Dropdown>
                </Menu>
            </Header>
            <Layout>
                <Sider hide-trigger :style="{background: '#fff',margin: '64px'}">
                    <Menu  active-name="1-2" theme="light" width="auto"  :accordion="isAccordion" :active-name="menuName" @on-select="apiContent">
                        <Submenu v-for="menu in menuList" :name="menu.sort_name"  >
                            <template slot="title">
                                <Icon type="ios-navigate"></Icon>
                                <span>{{menu.sort_name}}</span>
                            </template>
                            <MenuItem v-for="child in menuChildList" :name="child.api_id" v-if="menu.sort_id == child.sort_id" >
                                <span >{{child.api_name}}</span>
                            </MenuItem>

                        </Submenu>
                    </Menu>
                </Sider>

                <Card :style="{margin: '88px 20px 0',padding: '10px', background: '#fff', minHeight: '500px',width: '100%'}">
                    <Content >
                        <keep-alive>
                            <router-view :key="$route.fullPath"></router-view>
                        </keep-alive>
                    </Content>
                </Card>


            </Layout>
            <Footer class="layout-footer-center">2018-2028 &copy; API文档管理系统</Footer>
        </Layout>
    </Layout>
</template>
<script>
    export default {
        inject:["reload"],
        data () {
            return {
                isCollapsed: false,
                isAccordion: true,
                menuName:"",
                childName:"",
                menuList: [],
                menuChildList:[],
                userId:'',
                edit_modal: false,
                loading: true,
                formItem: {
                    sort_id:'',
                    sort_name: ''
                },
                Height:0,
            }
        },
        mounted : function(){
            this.sortApiList();
            let user = sessionStorage.getItem("user");
            let juser = JSON.parse(user);
            this.userId = juser.UserId;
        },
        methods : {
            openEdit: function () {
                this.edit_modal = true;
            },
            closeEdit: function(){
                if(this.formItem.sort_name == undefined || this.formItem.sort_name == null || this.formItem.sort_name == ""){
                    this.$Message.error('分类名称不能为空');
                    return;
                }
                this.$http.post("/sort/save",{
                    project_id: this.formItem.project_id,
                    sort_name: this.formItem.sort_name
                })
                    .then(res=>{
                        this.edit_modal = false;
                        this.$Message.success('编辑成功');
                        this.reload();
                    })
                    .catch(err=>{
                        console.log(err)
                    })
            },
            sortApiList: function () {
                this.$http.get("/sort/sort_api_list")
                    .then(res=>{
                        console.log(res);
                        console.log(res.sort);
                        console.log(res.api);
                        this.menuList = res.sort;
                        this.menuChildList = res.api;
                    })
                    .catch(err=>{
                        console.log(err)
                    })
            },
            apiContent: function (id) {
                this.$router.push({path:'/home/api/content', query: { api_id: id }})
            },
            apiEdit: function () {
                this.$router.push({path:'/home/api/edit'})
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
            },
            project: function () {
                this.$router.push({path: '/project'})
            }
        }
    }
</script>

<style scoped>
    .layout{
        height: 100%;
        border: 1px solid #d7dde4;
        background: #f5f7f9;
        position: relative;
        border-radius: 4px;
        overflow: hidden;
    }
    .logo{
        width: 200px;
        height: 60px;
        margin-top: 6px;
        background: url("../../assets/img/logo.png") no-repeat;
        background-size: 80% 80%;
    }
    .layout-nav{
        width: 420px;
        margin: 0 20px 0 0;
    }
    .layout-footer-center{
        text-align: center;
    }
</style>