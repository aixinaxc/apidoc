<style scoped>
    .layout{
        border: 1px solid #d7dde4;
        background: #f5f7f9;
        position: relative;
        border-radius: 4px;
        overflow: hidden;
    }
    .layout-header-bar{
        background: #fff;
        box-shadow: 0 1px 1px rgba(0,0,0,.1);
    }
    .layout-logo-left{
        width: 90%;
        height: 30px;
        background: #5b6270;
        border-radius: 3px;
        margin: 15px auto;
    }
    .menu-icon{
        transition: all .3s;
    }
    .rotate-icon{
        transform: rotate(-90deg);
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
    .collapsed-menu span{
        width: 0px;
        transition: width .2s ease;
    }
    .collapsed-menu i{
        transform: translateX(5px);
        transition: font-size .2s ease .2s, transform .2s ease .2s;
        vertical-align: middle;
        font-size: 22px;
    }
</style>
<template>
    <div class="layout">
        <Layout style="position: absolute;top: 0;bottom: 0;left: 0;right: 0;">

            <Sider ref="side1" hide-trigger collapsible :collapsed-width="78" v-model="isCollapsed">
                <div style="width:100%;height: 64px;text-align: center;color:#F00">
                    此处logo
                </div>
                <Menu active-name="1-2" theme="dark" width="auto" :open-names="['1']" accordion="true" :active-name="menuName">
                    <Submenu v-for="menu in menuList" :name="menu.name"  >
                        <template slot="title">
                            <Icon type="ios-navigate"></Icon>
                            {{menu.name}}
                        </template>
                        <MenuItem  v-for="child in menu.childList" :name="child.name" >
                            {{child.name}}
                        </MenuItem>
                    </Submenu>
                </Menu>
            </Sider>
            <Layout>
                <Header :style="{padding: 0}" class="layout-header-bar">
                    <Icon @click.native="collapsedSider" :class="rotateIcon" :style="{margin: '0 20px'}" type="md-menu" size="24"></Icon>
                    <span style="font-size: large">api文档后台管理系统</span>
                    <Dropdown style="float:right;margin-right: 1%">
                        <a href="javascript:void(0)">
                            <Avatar style="background-color: #87d068" icon="ios-person" />
                            <Icon type="md-arrow-dropdown" />
                        </a>
                        <DropdownMenu slot="list">
                            <DropdownItem>用户中心</DropdownItem>
                            <DropdownItem>退出系统</DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                </Header>
                <Content :style="{margin: '20px', background: '#fff', minHeight: '260px'}">
                    <router-view></router-view>
                </Content>
            </Layout>
        </Layout>
    </div>
</template>
<script>
    export default {
        data () {
            return {
                isCollapsed: false,
                menuName:"",
                childName:"",
                menuList: [{name:"专家管理",childList:[{name:"专家列表"}]},{name:"专家体系管理",childList:[{name:"专家体系列表"}]}]
            }
        },
        computed: {
            rotateIcon () {
                return [
                    'menu-icon',
                    this.isCollapsed ? 'rotate-icon' : ''
                ];
            },
            menuitemClasses () {
                return [
                    'menu-item',
                    this.isCollapsed ? 'collapsed-menu' : ''
                ]
            }
        },
        methods: {
            collapsedSider () {
                this.$refs.side1.toggleCollapse();
            }
        }
    }
</script>
<style>

</style>