<template>
    <div class="layout">
        <Layout>
            <Header>
                <Menu mode="horizontal" theme="dark" active-name="1">
                    <div class="layout-logo" style="float: left"></div>
                    <div class="layout-nav" style="float: left">
                        <MenuItem name="1">
                            <Icon type="ios-navigate"></Icon>
                            新增分类
                        </MenuItem>
                        <MenuItem name="2">
                            <Icon type="ios-keypad"></Icon>
                            新增API
                        </MenuItem>
                    </div>

                    <Dropdown trigger="click" @on-click="menuClick" style="float:right;margin-right: 1%" >
                        <a href="javascript:void(0)">
                            <Avatar style="background-color: #87d068" icon="ios-person" />
                            <Icon type="md-arrow-dropdown" />
                        </a>
                        <DropdownMenu slot="list">
                            <DropdownItem name="修改密码">修改密码</DropdownItem>
                            <DropdownItem name="退出系统">退出系统</DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                </Menu>
            </Header>
            <Layout :style="{padding: '0 50px'}">
                <Breadcrumb :style="{margin: '16px 0'}">
                    <BreadcrumbItem>Home</BreadcrumbItem>
                    <BreadcrumbItem>Components</BreadcrumbItem>
                    <BreadcrumbItem>Layout</BreadcrumbItem>
                </Breadcrumb>
                <Content :style="{padding: '24px 0', minHeight: '280px', background: '#fff'}">
                    <Layout>
                        <Sider hide-trigger :style="{background: '#fff'}">
                            <Menu  active-name="1-2" theme="light" width="auto" :open-names="['专家管理']" :accordion="isAccordion" :active-name="menuName">
                                <Submenu v-for="menu in menuList" :name="menu.name"  >

                                    <template slot="title">
                                        <Icon type="ios-navigate"></Icon>
                                        <span>{{menu.name}}</span>
                                    </template>
                                    <MenuItem  v-for="child in menu.childList" :name="child.name" >
                                        <router-link tag="li" :to="child.url">
                                            <span>{{child.name}}</span>
                                        </router-link>
                                    </MenuItem>
                                </Submenu>
                            </Menu>
                        </Sider>
                        <Content :style="{padding: '24px', background: '#fff'}">
                            <router-view></router-view>
                        </Content>
                    </Layout>
                </Content>
            </Layout>
            <Footer class="layout-footer-center">2011-2016 &copy; ApiDoc</Footer>
        </Layout>


        <Modal
                v-model="edit_modal"
                title="编辑分类"
                :loading="loading"
                @on-ok="closeEdit">
            <Form :model="formItem" :label-width="80">
                <div style="margin: 5px">
                    <FormItem label="分类名称">
                        <Input v-model="formItem.project_name" placeholder="请输入分类名称..."></Input>
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
                menuList: [{name:"专家管理",childList:[{name:"专家列表",url:"/home/user/list"}]},{name:"专家体系管理",childList:[{name:"专家体系列表",url:"/home/sort/list"}]},
                    {name:"查询统计",childList:[{name:"查询统计列表",url:"/home/statisticsList/list"}]},{name:"评价指标管理",childList:[{name:"评价指标列表",url:"/home/indicator/list"}]},
                    {name:"行为数据管理",childList:[{name:"行为数据列表",url:"/home/user/list"}]},{name:"评价模型",childList:[{name:"评价模型列表",url:"/home/user/list"}]},
                    {name:"特征库管理",childList:[{name:"特征库列表",url:"/home/feature/list"}]},{name:"管理员管理",childList:[{name:"管理员列表",url:"/home/admin/list"}]},
                    {name:"角色管理",childList:[{name:"角色列表",url:"/home/role/list"}]},{name:"资源管理",childList:[{name:"资源列表",url:"/home/res/list"}]},
                    {name:"日志管理",childList:[{name:"操作日志列表",url:"/home/log/list"}]}],
                edit_modal: false,
                loading: true,
                formItem: {
                    project_id:'',
                    project_name: ''
                }
            }
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
                        this.projectList();
                    })
                    .catch(err=>{
                        console.log(err)
                    })
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
    .layout-logo{
        width: 200px;
        height: 100%;
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