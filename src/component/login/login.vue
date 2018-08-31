<template>
    <div  class="loginbackground" >

    </div>
</template>

<script>

    export default {
        data() {
            return {
                text: this.$store.state.text,
                split1: 0.5,
                value:'欢迎',
                imgSrc: require("../../assets/img/loginbackground.jpeg")
            }
        },
    }
</script>

<style scoped>
.loginbackground {
    height: 100%;
    background: url("../../assets/img/loginbackground.jpeg") no-repeat;
}
</style>