<template>
    <div class="layout">
        <Layout style="height: 100%">
            <Header>
                <Menu mode="horizontal" theme="dark" active-name="1">
                    <div class="layout-logo"></div>
                    <div class="layout-nav">
                        <MenuItem name="1">
                            <Icon type="ios-navigate"></Icon>
                            用户管理
                        </MenuItem>
                        <MenuItem name="1">
                            <Icon type="ios-navigate"></Icon>
                            权限管理
                        </MenuItem>
                    </div>
                </Menu>
            </Header>
            <Layout >
                <Sider hide-trigger :style="{background: '#fff'}">
                    <Menu active-name="1-2" theme="light" width="auto" :open-names="['1']">
                        <Submenu name="1">
                            <template slot="title">
                                <Icon type="ios-navigate"></Icon>
                                Item 1
                            </template>
                            <MenuItem name="1-1"  >Option 1</MenuItem>
                            <MenuItem name="1-2">Option 2</MenuItem>
                            <MenuItem name="1-3">Option 3</MenuItem>
                        </Submenu>
                        <Submenu name="2">
                            <template slot="title">
                                <Icon type="ios-keypad"></Icon>
                                Item 2
                            </template>
                            <MenuItem name="2-1">Option 1</MenuItem>
                            <MenuItem name="2-2">Option 2</MenuItem>
                        </Submenu>
                        <Submenu name="3">
                            <template slot="title">
                                <Icon type="ios-analytics"></Icon>
                                Item 3
                            </template>
                            <MenuItem name="3-1">Option 1</MenuItem>
                            <MenuItem name="3-2">Option 2</MenuItem>
                        </Submenu>
                    </Menu>
                </Sider>
                <Layout :style="{padding: '0 24px 24px'}">
                    <Breadcrumb :style="{margin: '24px 0'}">
                        <BreadcrumbItem>Home</BreadcrumbItem>
                        <BreadcrumbItem>Components</BreadcrumbItem>
                        <BreadcrumbItem>Layout</BreadcrumbItem>
                    </Breadcrumb>
                    <Content :style="{padding: '24px', minHeight: '280px', background: '#fff'}">
                        <mavon-editor :ishljs = "true" v-model="value" @change="c"/>
                        <Button v-on:click="showHtml()">
                            查看
                        </Button>
                    </Content>
                </Layout>
            </Layout>
        </Layout>
    </div>
</template>

<script>
    import { mavonEditor } from 'mavon-editor'
    import 'mavon-editor/dist/css/index.css'
export default {
    data() {
        return {
            text: this.$store.state.text,
            split1: 0.5,
            value:'欢迎'
        }
    },
    components: {
        mavonEditor
        // or 'mavon-editor': mavonEditor
    },
    methods: {
        showHtml: function () {
            console.log("开始")
            console.log(this.value)
            this.$http.get("http://api.douban.com/v2/movie/top250")
                .then(res=>{
                    console.log(res)
                })
                .catch(err=>{
                    console.log(err)
                })
            //data contains html string for render
        },
        c: function(value,render) {
            console.log(value)
            console.log(render)
        }
    }
}
</script>

<style lang=less>

    .layout{
        height: 100%;
        border: 1px solid #d7dde4;
        background: #f5f7f9;
        position: relative;
        border-radius: 4px;
        overflow: hidden;
    }
    .layout-logo{
        width: 100px;
        height: 30px;
        background: #5b6270;
        border-radius: 3px;
        float: left;
        position: relative;
        top: 15px;
        left: 20px;
    }
    .layout-nav{
        width: 420px;
        margin: 0 20px 0 auto;
    }


</style>
