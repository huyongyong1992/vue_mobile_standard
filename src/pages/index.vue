<template>
    <div class="index">
        首页
    </div>
</template>

<script>
// import { getWxAuthUrl } from '../api/data';
// import { getQuery } from '../config/util';
export default {
    name: 'index',
    data() {
        return {
        };
    },
    created() {
        // const accessToken = window.localStorage.getItem('accessToken');
        // const openId = getQuery('openId');
        // console.log('url', window.location.href);
        // if (accessToken) {                                              // 该用户登录过，不必再次授权
        //     this.$router.push('/center');
        //     return;
        // }
        // if (openId) {                                                   // 授权回调，有openId,不必再授权,防止循环授权
        //     window.localStorage.setItem('openId', openId);
        //     this.$router.push(`/login?openId=${openId}`);
        //     return;
        // }
        // getWxAuthUrl().then(data => {
        //     console.log(data.url);
        //     window.location.href = data.url;
        // });
    },
    methods: {
        //
    }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less">
body {
	margin: 0;
}
</style>
