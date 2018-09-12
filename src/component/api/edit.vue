<template>
    <div>
        <Card  style="min-height: 800px">
            <div style="width: 100%;height: 64px;text-align: left;">
                <Button type="primary" @click="apiSave" ghost>保存API</Button>
                <Button type="success" @click="apiTemplate" ghost>模板API</Button>
            </div>
            <div style="width: 100%;height: 64px;text-align: left;z-index:9999" >
                <Form :model="formItem" :label-width="80" inline>
                    <FormItem label="API名称" style="width: 20%">
                        <Input v-model="formItem.api_name" placeholder="请输入API名称..."  :value="formItem.api_name"></Input>
                    </FormItem>
                    <FormItem label="分类" style="width: 20%">
                        <Select v-model="formItem.sort_id">
                            <Option v-for="sort in sort_list" :value="sort.sort_id" >{{sort.sort_name}}</Option>
                        </Select>
                    </FormItem>
                </Form>
            </div>
            <div >
                <mavon-editor :ishljs = "true" v-model="value" @change="editData" style="height:600px;z-index:100"/>
            </div>
        </Card>
    </div>
</template>

<script>
    import { mavonEditor } from 'mavon-editor'
    import 'mavon-editor/dist/css/index.css'
    export default {
        name: "edit",
        data() {
            return {
                text: this.$store.state.text,
                split1: 0.5,
                value:'',
                api_edit_content: '',
                api_show_content: '',
                formItem : {
                    api_name : '',
                    sort_id : '',
                },
                sort_list: '',
               templateApi:'请求类型： get\n' +
                    '\n' +
                    '请求参数：\n' +
                    '|字段名|字段类型|备注|\n' +
                    '|-|-|-|\n' +
                    '|test|varchar(255)|测试|\n' +
                    '\n' +
                    '返回数据：\n' +
                    '```\n' +
                    '{\n' +
                    '    "code":200,\n' +
                    '    "msg":"OK",\n' +
                    '    "total":5,\n' +
                    '    "data":[\n' +
                    '        {\n' +
                    '            "project_id":"1",\n' +
                    '            "project_name":"测试项目",\n' +
                    '            "project_state":1,\n' +
                    '            "created_at":0,\n' +
                    '            "updated_at":0\n' +
                    '        },\n' +
                    '        {\n' +
                    '            "project_id":"2",\n' +
                    '            "project_name":"测试项目2",\n' +
                    '            "project_state":1,\n' +
                    '            "created_at":0,\n' +
                    '            "updated_at":0\n' +
                    '        }\n' +
                    '    ]\n' +
                    '}\n' +
                    '```',
            }
        },
        components: {
            mavonEditor
        },
        mounted: function(){
            this.apiContent();
            this.sortList();
        },
        methods: {
            apiContent: function () {
                console.log("api_id:");
                console.log(this.$route.query.api_id);
                if (this.$route.query.api_id !== undefined || this.$route.query.api_id !== null || this.$route.query.api_id !== "") {
                    this.$http.get("/api/content",{
                        params: {
                            api_id: this.$route.query.api_id
                        }
                    })
                        .then(res=>{
                            this.formItem.api_name = res.api_name;
                            this.formItem.sort_id = res.sort_id;
                            this.value = res.api_edit_content
                        })
                        .catch(err=>{
                            console.log(err)
                        })
                }

            },
            editData: function(value,render) {
                this.api_edit_content = value;
                this.api_show_content = render;
                console.log(value);
                console.log(render)
            },
            sortList: function () {
                let user = sessionStorage.getItem("user");
                let juser = JSON.parse(user);
                this.$http.get("/sort/list",{
                    params: {
                        project_id: juser.project_id
                    }
                })
                    .then(res=>{
                        this.sort_list = res
                    })
                    .catch(err=>{
                        console.log(err)
                    })
            },
            apiSave: function () {
                let user = sessionStorage.getItem("user");
                let juser = JSON.parse(user);

                this.$http.post("/api/save",{
                    api_id : this.$route.query.api_id,
                    sort_id : this.formItem.sort_id,
                    project_id: juser.project_id,
                    api_name : this.formItem.api_name,
                    api_edit_content: this.api_edit_content,
                    api_show_content: this.api_show_content
                })
                    .then(res=>{
                        this.$router.push({path:'/home/api/content', query: { api_id: res }})
                    })
                    .catch(err=>{
                        console.log(err)
                    })
            },
            apiTemplate: function () {
                this.value = this.templateApi;
            }
        }
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