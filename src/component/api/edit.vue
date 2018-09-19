<template>
    <div style="width: 100%;height: 100%">
        <div style="width: 100%;height: 64px;text-align: left;">
            <Button type="primary" @click="apiSave" ghost>保存API</Button>
            <Button type="success" @click="apiTemplate" ghost>模板API</Button>
            <Button type="warning" @click="openJsonModel" ghost>JSON格式化</Button>
        </div>
        <div style="width: 100%;height: 64px;text-align: left;" >
            <Form :model="formItem" :label-width="80" inline>
                <FormItem label="API名称" style="width: 20%">
                    <Input v-model="formItem.api_name" placeholder="请输入API名称..."  :value="formItem.api_name"></Input>
                </FormItem>
                <FormItem label="分类" style="width: 20%">
                    <Select v-model="formItem.sort_id" style="z-index: 1002">
                        <Option v-for="sort in sort_list" :value="sort.sort_id" >{{sort.sort_name}}</Option>
                    </Select>
                </FormItem>
            </Form>
        </div>
        <div style="width:auto;max-width: 900px;height:100%;">
            <mavon-editor :toolbars="toolbars1" :ishljs = "true" v-model="value" @change="editData" style="height:600px;z-index:899"/>
        </div>
        <Modal v-model="json_modal" width="360">
            <p slot="header" style="color:#f60;text-align:center">
                <Icon type="ios-information-circle"></Icon>
                <span>JSON 格式化</span>
            </p>
            <div style="text-align:center">
                <Input v-model="json_str" placeholder="请输入项目名称..." type="textarea" :autosize="{minRows: 15,maxRows: 30}"></Input>
            </div>
            <div slot="footer">

            </div>
        </Modal>
    </div>
</template>

<script>
    import { mavonEditor } from 'mavon-editor'
    import 'mavon-editor/dist/css/index.css'
    export default {
        name: "edit",
        inject:["reload"],
        data() {
            return {
                text: this.$store.state.text,
                split1: 0.5,
                value:'',
                api_edit_content: '',
                api_show_content: '',
                json_str:'',
                json_modal: false,
                formItem : {
                    api_name : '',
                    sort_id : '',
                },
                sort_list: '',
               templateApi:'### 请求类型： get\n' +
                   '\n' +
                   '### 请求路径： http://127.0.0.1/login\n' +
                   '\n' +
                   '### 请求参数：\n' +
                   '|字段名|字段类型|备注|\n' +
                   '|-|-|-|\n' +
                   '|test|varchar(255)|测试|\n' +
                   '|name|varchar(255)|名称|\n' +
                   '|age|int|年龄|\n' +
                   '\n' +
                   '### 返回数据：\n' +
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
                toolbars1: {
                    bold: true, // 粗体
                    italic: true, // 斜体
                    header: true, // 标题
                    underline: true, // 下划线
                    strikethrough: true, // 中划线
                    mark: true, // 标记
                    superscript: true, // 上角标
                    subscript: true, // 下角标
                    quote: true, // 引用
                    ol: true, // 有序列表
                    ul: true, // 无序列表
                    link: true, // 链接
                    imagelink: true, // 图片链接
                    code: true, // code
                    table: true, // 表格
                    fullscreen: false, // 全屏编辑
                    readmodel: true, // 沉浸式阅读
                    htmlcode: true, // 展示html源码
                    help: true, // 帮助
                    /* 1.3.5 */
                    undo: true, // 上一步
                    redo: true, // 下一步
                    trash: true, // 清空
                    save: false, // 保存（触发events中的save事件）
                    /* 1.4.2 */
                    navigation: true, // 导航目录
                    /* 2.1.8 */
                    alignleft: true, // 左对齐
                    aligncenter: true, // 居中
                    alignright: true, // 右对齐
                    /* 2.2.1 */
                    subfield: true, // 单双栏模式
                    preview: true, // 预览
                }
            }
        },
        components: {
            mavonEditor
        },
        mounted: function(){
            this.apiContent();
            this.sortList();
        },
        watch:{
            json_str : function (v) {
                console.log(v);
                this.json_str = JSON.stringify(JSON.parse(v), null, 4);
            }
        },
        methods: {
            apiContent: function () {
                console.log("api_id:");
                console.log(this.$route.query.api_id);
                if (this.$route.query.api_id !== undefined &&  this.$route.query.api_id !== null && this.$route.query.api_id !== "") {
                    this.$http.get("/api/content",{
                        params: {
                            api_id: this.$route.query.api_id
                        }
                    })
                        .then(res=>{
                            this.formItem.api_name = res.data.api_name;
                            this.formItem.sort_id = res.data.sort_id;
                            this.value = res.data.api_edit_content
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
                if(juser.project_id == undefined || juser.project_id == null || juser.project_id== ""){
                    this.$Message.error('项目id丢失');
                    return;
                }
                this.$http.get("/sort/list",{
                    params: {
                        project_id: juser.project_id
                    }
                })
                    .then(res=>{
                        this.sort_list = res.data
                    })
                    .catch(err=>{
                        console.log(err)
                    })
            },
            apiSave: function () {
                let user = sessionStorage.getItem("user");
                let juser = JSON.parse(user);
                if(this.formItem.sort_id == undefined || this.formItem.sort_id == null || this.formItem.sort_id == ""){
                    this.$Message.error('请选择分类');
                    return;
                }else if(juser.project_id == undefined || juser.project_id == null || juser.project_id== ""){
                    this.$Message.error('项目id丢失');
                    return;
                }else if(this.formItem.api_name == undefined || this.formItem.api_name == null || this.formItem.api_name == ""){
                    this.$Message.error('API名称不能为空');
                    return;
                }else if(this.api_edit_content == undefined || this.api_edit_content == null || this.api_edit_content == ""){
                    this.$Message.error('API内容不能为空');
                    return;
                }
                this.$http.post("/api/save",{
                    api_id : this.$route.query.api_id,
                    sort_id : this.formItem.sort_id,
                    project_id: juser.project_id,
                    api_name : this.formItem.api_name,
                    api_edit_content: this.api_edit_content,
                    api_show_content: this.api_show_content
                })
                    .then(res=>{
                        this.$router.push({path:'/home/api/content', query: { api_id: res.data }})
                        this.reload();
                    })
                    .catch(err=>{
                        console.log(err)
                    })
            },
            apiTemplate: function () {
                this.value = this.templateApi;
            },
            openJsonModel: function () {
                this.json_modal = true
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