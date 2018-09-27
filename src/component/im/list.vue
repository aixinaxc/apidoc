<template>
    <div>
        我是im
        <Button @click="openImMedal">打开</Button>
        <Modal v-model="im_modal" draggable scrollable title="聊天" >
            <p slot="header" style="text-align:center">
                <span>聊天</span>
            </p>
            <div style="text-align:center;height: 270px;">
                <p>聊天内容</p>
                

            </div>
            <div slot="footer" style="margin: -5px -16px">
                <div style="width: 100%;height: 20px;text-align:left;margin-bottom: 5px;padding: 0 5px">
                    <Icon type="ios-happy-outline" size="20"/>
                    <Icon type="ios-image-outline" size="20"/>
                </div>
                <div>
                    <textarea style="border: white 0 solid ;height: 80px;width: 100%;" autofocus="autofocus"></textarea>
                </div>
                <div style="margin-top: 5px">
                    <Button>关闭</Button>
                    <Button type="primary"  >发送</Button>
                </div>

            </div>

        </Modal>
    </div>
</template>

<script>
    import utils from "../../assets/js/utils"
    export default {
        name: "list",
        inject:["reload"],
        data() {
            return {
                msg_list:[],
                im_modal:false,
            }
        },
        mounted: function(){

        },
        methods:{
            openImMedal: function(){
                this.im_modal = true;
            },
            msgSend: function (msgType,toUserId,msgContentType,msgContent) {
                let msg = {};
                msg.msg_id = utils.uuid();
                msg.msg_type = msgType;
                msg.msg_from_id = "";
                msg.msg_from_content = "";
                msg.created_at = utils.time10();
                msg.msg_to_id = toUserId;
                msg.msg_to_content = "";
                msg.msg_content_type = msgContentType;
                msg.msg_content = msgContent;
            },

        }
    }
</script>

<style scoped>

</style>