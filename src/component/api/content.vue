
<template>
    <div style="max-width: 900px">
        <div style="width: 100%;height: 64px;text-align: left;">
            <Button type="primary" @click="apiEdit" ghost>编辑API</Button>
            <Button type="error" @click="openDelete" ghost>删除API</Button>
            <Button type="success"  @click="exportApi" ghost>导出API</Button>
        </div>
        <div v-html="api_show_content">
        </div>


        <Modal
                v-model="delete_modal"
                title="删除API"
                :loading="loading"
                @on-ok="closeDelete">
                <div style="margin: 5px">
                    你确定要删除该API吗？
                </div>
        </Modal>
    </div>
</template>

<script>

    import utils from '../../assets/js/utils';


    export default {
        inject:["reload"],
        data() {
            return {
                api_show_content:"",
                delete_modal: false,
                loading: true,
                api_name : ''
            }
        },
        mounted: function(){
            this.apiContent()
            //setTimeout(this.apiContent(),100)
            //this.apiContent();
        },
        methods: {
            openDelete: function () {
                this.delete_modal = true;
            },
            closeDelete: function(){
                this.$http.get("/api/delete",{
                    params: {
                        api_id: this.$route.query.api_id
                    }
                })
                    .then(res=>{
                        this.$router.push({path:'/home'})
                        this.delete_modal = false;
                        sessionStorage.setItem('menu_opennames',"");
                        sessionStorage.setItem('active_name',"");
                        this.reload();
                    })
                    .catch(err=>{
                        console.log(err)
                    })
            },
            apiContent: function () {
                console.log("api_id:");
                console.log(this.$route.query.api_id);
                if(this.$route.query.api_id !== undefined && this.$route.query.api_id !== null && this.$route.query.api_id !== ""){
                    this.$http.get("/api/content",{
                        params: {
                            api_id: this.$route.query.api_id
                        }
                    })
                        .then(res=>{
                            this.api_name = res.data.api_name;
                            this.api_show_content = res.data.api_show_content;
                        })
                        .catch(err=>{
                            console.log(err)
                        })
                }
            },
            apiEdit: function () {
                this.$router.push({path:'/home/api/edit', query: { api_id: this.$route.query.api_id }})
            },
            exportApi: function () {
                let name = '<h2>' + this.api_name + '</h2>';
                name = name + this.api_show_content;
                utils.h2d(name)
            },


        },

    }
</script>
<style scoped>
    >>> table
    {
        border-collapse: collapse;
        margin: 1%;
        text-align: center;
    }
    >>> table td, table th
    {
        border: 1px solid #cad9ea;
        color: #666;
        height: 30px;
    }
    >>> table thead th
    {
        background-color: #CCE8EB;
        width: 100px;
    }
    >>> table tr:nth-child(odd)
    {
        background: #fff;
    }
    >>> table tr:nth-child(even)
    {
        background: #F5FAFA;
    }
</style>

