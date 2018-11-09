<template>
    <div style="height: 100%;">
        <Header style="position: fixed; width: 100%;z-index:1000;min-width: 800px;">
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
                        <MenuItem name="3">
                            <Icon type="ios-download-outline" />
                            <span @click="exportProjectApi"> 导出API</span>
                        </MenuItem>
                    </div>
                </div>
                <Dropdown trigger="click"  style="float:right;" >
                    <a href="javascript:void(0)" style="color: white">
                        <!--<Avatar style="background-color: #87d068" icon="ios-person" />-->
                        {{username}}
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

        <Layout style="min-height: 100vh">
            <Sider hide-trigger style="margin-top: 88px;background: white;">
                <Menu ref="side_menu"  theme="light" width="auto" :open-names="openNames" :active-name="activeName" :accordion="isAccordion"  @on-select="apiContent"  @on-open-change="openMenu" style="position: static;">
                    <Submenu v-for="(menu,index) in menuList" :key="index" :name="menu.sort_id"  >
                        <template slot="title">
                            <span class="spanStyle"><Icon type="ios-navigate"></Icon>{{menu.sort_name}}</span>
                        </template>
                        <MenuItem v-for="(child,index) in menuChildList" :key="index" :name="child.api_id" v-if="menu.sort_id == child.sort_id" >
                            <span >{{child.api_name}}</span>
                        </MenuItem>
                        <Submenu v-for="(m,index) in menu.children" :key="index" :name="m.sort_id"  >
                            <template slot="title">
                                <span >{{m.sort_name}}</span>
                            </template>
                            <MenuItem v-for="(c,index) in menuChildList" :key="index" :name="c.api_id" v-if="m.sort_id == c.sort_id" >
                                <span >{{c.api_name}}</span>
                            </MenuItem>
                        </Submenu>
                    </Submenu>
                </Menu>
            </Sider>
            <Content style="margin-top:88px;background: #fff;padding: 1% 5%">
                <keep-alive>
                    <router-view :key="$route.fullPath"></router-view>
                </keep-alive>

            </Content>

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
    import utils from '../../assets/js/utils';
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
                    project_id:'',
                    sort_id:'',
                    sort_name: ''
                },
                Height:0,
                openNames:[],
                activeName:'',
                username:''
            }
        },
        watch : {

        },
        mounted : function(){
            this.sortApiList();
            let user = localStorage.getItem("user");
            let juser = JSON.parse(user);
            this.username = juser.UserUsername;
            this.userId = juser.UserId;
            this.formItem.project_id = juser.project_id;
        },
        methods : {
            openEdit: function () {
                //this.edit_modal = true;
                this.$router.push({path:'/home/sort/list', query: { project_id: this.formItem.project_id }})
            },
            closeEdit: function(){
                if(this.formItem.sort_name == undefined || this.formItem.sort_name == null || this.formItem.sort_name == ""){
                    this.edit_modal = false;
                    this.$Message.error('分类名称不能为空');
                    return;
                }else if(this.formItem.sort_name.length > 6){
                    this.edit_modal = false;
                    this.$Message.error('不能超过6个字');
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
                        console.log(res.data.sort);
                        console.log(res.data.api);
                        this.menuList = res.data.sort;
                        this.menuList = this.toTree(this.menuList);
                        this.menuChildList = res.data.api;

                        let open_names = sessionStorage.getItem('menu_opennames').split("");
                        let active_name = sessionStorage.getItem('active_name');
                        if(open_names || active_name) {
                            this.openNames = open_names || [];
                            this.activeName = active_name || 0;
                            this.$nextTick(function() {
                                this.$refs.side_menu.updateOpened();
                                this.$refs.side_menu.updateActiveName();
                            })
                        }
                    })
                    .catch(err=>{
                        console.log(err)
                    })
            },
            openMenu:function(id){
                console.log("openmenu");
                console.log(id);
                sessionStorage.setItem('menu_opennames',id);
            },
            apiContent: function (id) {
                console.log("apiContent");
                console.log(id);
                sessionStorage.setItem('active_name',id);
                this.$router.push({path:'/home/api/content', query: { api_id: id }})
            },
            apiEdit: function () {
                this.$router.push({path:'/home/api/edit'})
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
            },
            project: function () {
                this.$router.push({path: '/project'})
            },
            exportProjectApi: function () {
                let user = localStorage.getItem("user");
                let juser = JSON.parse(user);
                let allContent = '';
                this.$http.get("/api/list",{
                    params: {
                        userId:  juser.project_id
                    }
                    })
                    .then(res=>{
                        for(let i=0;i<res.data.length;i++){
                            let name = '<h2>' + res.data[i].api_name + '</h2>';
                            name = name + res.data[i].api_show_content + '</br>';
                            name = name + '<span>-----------------------------------------------------------------------------</span>';
                            allContent = allContent + name;
                        }
                        console.log("======================");
                        console.log(allContent);
                        utils.h2d(allContent)
                    })
                    .catch(err=>{
                        console.log(err)
                    })
            },
            toTree: function (data) {
                // 删除 所有 children,以防止多次调用
                data.forEach(function (item) {
                    delete item.children;
                });

                // 将数据存储为 以 id 为 KEY 的 map 索引数据列
                var map = {};
                data.forEach(function (item) {
                    map[item.sort_id] = item;
                });
//        console.log(map);
                var val = [];
                data.forEach(function (item) {
                    // 以当前遍历项，的pid,去map对象中找到索引的id
                    var parent = map[item.sort_pid];
                    // 好绕啊，如果找到索引，那么说明此项不在顶级当中,那么需要把此项添加到，他对应的父级中
                    if (parent) {
                        (parent.children || ( parent.children = [] )).push(item);
                    } else {
                        //如果没有在map中找到对应的索引ID,那么直接把 当前的item添加到 val结果集中，作为顶级
                        val.push(item);
                    }
                });
                return val;
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

    .menu-item span{
        display: inline-block;
        overflow: hidden;
        width: 69px;
        text-overflow: ellipsis;
        white-space: nowrap;
        vertical-align: bottom;
        transition: width .2s ease .2s;
    }
    .menu-item i{
        transform: translateX(0px);
        transition: font-size .2s ease, transform .2s ease;
        vertical-align: middle;
        font-size: 16px;
    }
    .layout-footer-center{
        text-align: center;
    }

    .spanStyle{
        display:inline-block;/*内联对象需加*/
        width:120px;
        word-break:keep-all;/* 不换行 */
        white-space:nowrap;/* 不换行 */
        overflow:hidden;/* 内容超出宽度时隐藏超出部分的内容 */
        text-overflow:ellipsis;/* 当对象内文本溢出时显示省略标记(...) ；需与overflow:hidden;一起使用。*/
    }



</style>