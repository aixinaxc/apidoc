<template>
    <div class="layout">
        <Layout >
            <Header :style="{position: 'fixed', width: '100%'}">
                <Dropdown style="float:right ">
                    <a href="javascript:void(0)">
                        <Avatar style="background-color: #87d068" icon="ios-person" />
                        <Icon type="md-arrow-dropdown" />
                    </a>
                    <DropdownMenu slot="list">
                        <DropdownItem>用户中心</DropdownItem>
                    </DropdownMenu>
                </Dropdown>
            </Header>
            <Content :style="{margin: '88px 20% 0px 20%', background: '#fff', minHeight: '500px'}">
                <div class="card" v-for="item in randomMovieList"  v-on:click="homePage()">
                    <Card  >
                        {{item}}
                    </Card>
                </div>
            </Content>
            <Footer class="layout-footer-center"></Footer>
        </Layout>
    </div>
</template>

<script>
    export default {
        name: "project",
        data() {
            return {
                randomMovieList : ["测试项目1","测试项目2","测试项目3","测试项目3","测试项目3","测试项目3","测试项目3","测试项目3","测试项目3","测试项目3"]
            }
        },
        methods: {
            homePage: function () {
                console.log('/home/api/list');
                this.$router.push({path:'/home/api/list', query: { project_id: 123 }})
            }
        }
    }
</script>

<style scoped>
    .card {
        width: 200px;
        height: 200px;
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
    .layout-footer-center{
        text-align: center;
    }
</style>