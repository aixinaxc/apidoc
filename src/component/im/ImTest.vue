<template>
    <div>
        <ImList :im_user_list="user_list" :im_from_user="user"></ImList>
        <!--<ImContent  ></ImContent>-->
    </div>
</template>

<script>
    /*import ImContent from './ImContent.vue';*/
    import ImList from './ImList.vue'
    export default {
        name: "ImTest",
        components:{
            ImList
        },
        data() {
            return {
                user_list:[],
                user: new Object(),
            }
        },
        mounted: function(){
            let usernew = JSON.parse(localStorage.getItem("user"));
            this.user.user_id = usernew.UserId;
            this.user.user_username = usernew.UserUsername;
            this.userList();
        },

        methods:{
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

</style>