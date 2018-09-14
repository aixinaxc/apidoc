<template>
    <div id="index">
        <router-view v-if="isRouterAlive"></router-view>
    </div>
</template>

<script>
export default {
    provide (){
        return{
            reload : this.reload
        }
    },
    data() {
        return {
            isRouterAlive : true
        }
    },
    methods:{
        reload : function () {
            this.isRouterAlive = false;
            this.$nextTick(function () {
                this.isRouterAlive = true;
            })
        }
    }
}
</script>

<style lang=less>
    html,body,#index {
        width: 100%;
        height: 100%;
    }
</style>
