<template>
    <div class="layout">
        <Layout>
            <Header>
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
                    <Dropdown trigger="click"  style="float:right;margin-right: 1%" >
                        <a href="javascript:void(0)">
                            <Avatar style="background-color: #87d068" icon="ios-person" />
                            <Icon type="md-arrow-dropdown" />
                        </a>
                        <DropdownMenu slot="list">
                            <DropdownItem name="修改密码">修改密码</DropdownItem>
                            <div @click="useradmin">
                                <DropdownItem name="用户中心" >用户中心</DropdownItem>
                            </div>
                            <div @click="logout">
                                <DropdownItem name="退出系统" >退出系统</DropdownItem>
                            </div>

                        </DropdownMenu>
                    </Dropdown>
                </Menu>
            </Header>
            <Layout :style="{padding: '0 50px'}">
                <!--<Breadcrumb :style="{margin: '16px 0'}">
                    <BreadcrumbItem>Home</BreadcrumbItem>
                    <BreadcrumbItem>Components</BreadcrumbItem>
                    <BreadcrumbItem>Layout</BreadcrumbItem>
                </Breadcrumb>-->
                <Content :style="{padding: '24px 0', minHeight: '800px', background: '#fff'}">
                    <Layout>
                        <Sider hide-trigger :style="{background: '#fff'}">
                            <Menu  active-name="1-2" theme="light" width="auto"  :accordion="isAccordion" :active-name="menuName">
                                <Submenu v-for="menu in menuList" :name="menu.SortName"  >
                                    <template slot="title">
                                        <Icon type="ios-navigate"></Icon>
                                        <span>{{menu.SortName}}</span>
                                    </template>
                                    <MenuItem  v-for="child in menuChildList" :name="child.api_name" v-if="menu.SortId == child.sort_id">
                                        <span @click="apiContent(child.api_id)">{{child.api_name}}</span>
                                    </MenuItem>
                                </Submenu>
                            </Menu>
                        </Sider>
                        <Content :style="{padding: '24px', background: '#fff'}">
                            <keep-alive>
                                <router-view :key="$route.fullPath"></router-view>
                            </keep-alive>
                        </Content>
                    </Layout>
                </Content>
            </Layout>
            <!--<Footer class="layout-footer-center">2011-2016 &copy; ApiDoc</Footer>-->
        </Layout>


        <Modal
                v-model="edit_modal"
                title="编辑分类"
                :loading="loading"
                @on-ok="closeEdit">
            <Form :model="formItem" :label-width="80">
                <div style="margin: 5px">
                    <FormItem label="分类名称">
                        <Input v-model="formItem.sort_name" placeholder="请输入分类名称..."></Input>
                    </FormItem>
                </div>
            </Form>
        </Modal>


    </div>
</template>
<script>
    export default {
        data () {
            return {
                isCollapsed: false,
                isAccordion: true,
                menuName:"",
                childName:"",
                menuList: [],
                menuChildList:[],
                edit_modal: false,
                loading: true,
                formItem: {
                    sort_id:'',
                    sort_name: ''
                }
            }
        },
        mounted : function(){
            this.sortApiList();
        },
        methods : {
            openEdit: function () {
                this.edit_modal = true;
            },
            closeEdit: function(){
                this.$http.post("/sort/save",{
                    project_id: this.formItem.project_id,
                    project_name: this.formItem.project_name
                })
                    .then(res=>{
                        this.edit_modal = false;
                        this.$Message.success('编辑成功');
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
                this.$router.push({path:'user/list'})
            }
        }
    }
</script>
<style scoped>
    .layout{
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
        margin: 0 20px 0 auto;
    }
    .layout-footer-center{
        text-align: center;
    }
</style>