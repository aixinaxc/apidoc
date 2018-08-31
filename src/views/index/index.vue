<template>
    <div class="main">
        <router-view></router-view>
    </div>
</template>

<script>
export default {
    data() {
        return {
        }
    }
}
</script>

<style lang=less>
html,body {
    * {
        margin: 0;
        padding: 0;
    }
    width: 100%;
    height: 100%;
    .main {
        width: 100%;
        height: 100%;
    }
}
</style>
