<template>
    <div>
        我是im
        <Button @click="openImMedal">打开</Button>
        接收人：
        <Select v-model="to_user_id" style="z-index: 1002;width: 200px">
            <Option v-for="user in user_list" :value="user.user_id" >{{user.user_username}}</Option>
        </Select>
        <Modal v-model="im_modal" draggable scrollable title="聊天" >
            <p slot="header" style="text-align:center">
                <span>聊天</span>
            </p>
            <div ref="imContent" style="text-align:center;height: 270px;overflow-y: auto;margin-bottom: 10px">
                <!-- Left -->
                <div v-for="(msg,index) in msg_list">
                    <div class="sender" v-if="msg.msg_from_id !== user.UserId">
                        <div>
                            <Icon type="md-boat" size="36"/>
                        </div>
                        <div style="max-width: 260px;text-align: left;word-break:break-all; ">
                            <div class="left_triangle"></div>
                            <span v-if="msg.msg_content_type == 'im_text'">
                            {{msg.msg_content.text}}
                            </span>
                            <span v-else>
                            <img :src="baseImgUrl + msg.msg_content.file_name" style="max-width: 200px;max-height: 150px"  :preview="index"/>
                            </span>
                        </div>
                    </div>
                    <!-- Right -->
                    <div class="receiver" v-else>
                        <div>
                            <Icon type="md-boat" size="36"/>
                        </div>
                        <div style="max-width: 260px;text-align: left;word-break:break-all;">
                            <div class="right_triangle"></div>
                            <span v-if="msg.msg_content_type == 'im_text'">
                            {{msg.msg_content.text}}
                            </span>
                            <span v-else>
                            <img :src="baseImgUrl + msg.msg_content.file_name" style="max-width: 200px;max-height: 150px" :preview="index"/>
                            </span>
                        </div>
                    </div>
                </div>
            </div>
            <div slot="footer" style="margin: -5px -16px">
                <div style="width: 100%;height: 20px;text-align:left;margin-bottom: 5px;padding: 0 5px">
                    <Icon type="ios-happy-outline" size="20"/>
                    <input type="file" ref="img_file" style="display:none" @change="sendImg">
                    <Icon type="ios-image-outline" size="20" @click="openImgFile" />
                </div>
                <div>
                    <textarea style="border: white 0 solid ;height: 80px;width: 100%;" autofocus="autofocus" v-model="im_text"></textarea>
                </div>
                <div style="margin-top: 5px">
                    <Button>关闭</Button>
                    <Button type="primary" @click="sendTxt" >发送</Button>
                </div>

            </div>

        </Modal>
    </div>
</template>

<script>
    import utils from "../../assets/js/utils"
    import ReconnectingWebSocket from 'reconnecting-websocket';
    const browserMD5File = require('browser-md5-file');
    export default {
        name: "list",
        inject:["reload"],
        data() {
            return {
                baseImgUrl:'http://192.168.2.223:9001/img/',
                wsUrl: 'ws://192.168.2.223:9001/ws',
                msg_list:[],
                im_text: '',
                im_modal:false,
                rws:'',
                user: JSON.parse(localStorage.getItem("user")),
                to_user_id:'',
                user_list:[]
            }
        },
        mounted: function(){
                this.userList();
        },
        watch:{
          msg_list: function () {
              this.$nextTick(() => {
                  this.$refs.imContent.scrollTop = this.$refs.imContent.scrollHeight
              })
          }
        },
        methods:{
            openImMedal: function(){
                this.im_modal = true;
                this.WS();
            },
            WS:function(){
                this.rws = new ReconnectingWebSocket(this.wsUrl);
                this.rws.addEventListener('open', () => {
                    this.msgSend('client','','im_text',this.msgTextContent('大家好'));
                    console.log('连接')
                });
                this.rws.addEventListener('message', (msg) => {
                   console.log(msg.data);
                   let msgData = JSON.parse(msg.data);
                   if(msgData.msg_type != 'client'){
                       this.msg_list.push(msgData);
                   }
                });
            },
            sendTxt: function(){
                this.msgSend('p2p',this.to_user_id,'im_text',this.msgTextContent(this.im_text));
                this.im_text = '';
            },
            openImgFile: function(){
                this.$refs.img_file.click();
            },
            sendImg: function(){
                let _this = this;
                let file = this.$refs.img_file.files[0];
                let filename = '';
                if(file == undefined || file == null){
                    return;
                }
                let fileType = file.name.substring(file.name.lastIndexOf('.')+1,file.name.length);
                if(fileType == undefined || fileType == null || fileType == ""){
                    this.$Message.error('文件不能为空');
                    return;
                }else if(fileType.toLocaleLowerCase() != 'jpg' && fileType.toLocaleLowerCase() != 'jpeg' && fileType.toLocaleLowerCase() != 'png'){
                    this.$Message.error('文件格式不支持');
                    return;
                }

                browserMD5File(file, function (err, md5) {
                    filename = md5 + '.' + fileType;
                    console.log(md5); // 97027eb624f85892c69c4bcec8ab0f11
                });
                let reader = new FileReader();
                //以二进制形式读取文件
                reader.readAsArrayBuffer(file);
                //文件读取完毕后该函数响应
                reader.onload = function loaded(evt) {
                    console.log("file");
                    let binaryString = evt.target.result;
                    let x = new Uint8Array(binaryString);
                    console.log(binaryString);
                    let arr = [].slice.call(x);
                    console.log(arr);
                    _this.msgSend('p2p',_this.to_user_id,'im_img',_this.msgImgContent(filename,file.length,arr));
                }
            },
            msgSend: function (msgType,toUserId,msgContentType,msgContent) {
                console.log(utils.uuid());
                console.log(utils.time10());
                let msg = {};
                msg.msg_id = utils.uuid();
                msg.msg_type = msgType;
                msg.msg_from_id = this.user.UserId;
                msg.msg_from_content = this.userContent('','','');
                msg.created_at = utils.time10();
                msg.msg_to_id = toUserId;
                msg.msg_to_content = this.userContent('','','');
                msg.msg_content_type = msgContentType;
                msg.msg_content = msgContent;
                this.rws.send(JSON.stringify(msg));
            },
            userContent:function (id,name,icon) {
                let userContent = {};
                userContent.id = id;
                userContent.name = name;
                userContent.icon = icon;
                return userContent;
            },
            msgTextContent:function (text) {
                let msgContent = {};
                msgContent.text = text;
                return msgContent;
            },
            msgImgContent:function (fileName,fileSize,file) {
                let msgContent = {};
                msgContent.file_name = fileName;
                msgContent.file_size = fileSize;
                msgContent.file = file;
                return msgContent;
            },
            userList: function(){
                this.$http.get("/user/list",{
                    params: {
                        page_num: this.pageNum,
                        page_size: this.pageSize
                    }
                })
                    .then(res=>{
                        this.user_list = res.data
                    })
                    .catch(err=>{
                        console.log(err)
                    });
            },

        }
    }
</script>

<style scoped>
    .sender{clear:both;}
    .sender div:nth-of-type(1){
        float: left;
    }
    .sender div:nth-of-type(2){
        background-color: aquamarine;
        float: left;
        margin: 0 20px 10px 15px;
        padding: 10px 10px 10px 0px;
        border-radius:7px;
    }
    .receiver div:first-child img,
    .sender div:first-child img{
        width:50px;
        height: 50px;
    }
    .receiver{
        clear:both;
    }
    .receiver div:nth-child(1){
        float: right;
    }
    .receiver div:nth-of-type(2){
        float:right;
        background-color: gold;
        margin: 0 10px 10px 20px;
        padding: 10px 0 10px 10px;
        border-radius:7px;
    }
    .left_triangle{
        height:0;
        width:0;
        border: 8px solid transparent;
        border-right-color: aquamarine;
        position: relative;
        left:-16px;
        top:3px;
    }
    .right_triangle{
        height:0;
        width:0;
        border: 8px solid transparent;
        border-left-color: gold;
        position: relative;
        right:-16px;
        top:3px;        }

</style>