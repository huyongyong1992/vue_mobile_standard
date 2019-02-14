<template>
    <div class="login" :style="{height: height+ 'px'}">
        <img src="../assets/images/logo.png" class="logo"/>
        <div class="content">
            <div class="input">
                <input placeholder="请输入手机号" v-model="form.phone" type="tel" maxlength="11" ref="input"/>
            </div>
            <div class="input">
                <input placeholder="请输入验证码" v-model="form.smsCode" type="tel" maxlength="6" ref="input"/>
                <p :class="`${disabled ? 'decode' : 'code'}`" @click="onGetCode">{{codeText}}</p>
            </div>
        </div>
        <div @click="onLogin" :class="`bind ${!btnIsDisabled ? 'btnIsDisabled' : ''}`">
            绑定并登录
        </div>

        <div class="confirm_self" v-show="isModalShow" :style="{height: height+ 'px'}">
            <div class="confirm_self_content">
                <p class="title">报名</p>
                <p class="context">该手机号暂未报名任何课程，请先完成报名哦</p>
                <div class="footer">
                    <p class="cancel" @click="isModalShow = false">取消</p>
                    <p class="ok" @click="onConfirm">确认</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { checkPhone, getQuery } from '../config/util';
import { login, sendSmsCode } from '../api/data';
import { Confirm, TransferDomDirective as TransferDom } from 'vux';

export default {
    name: 'login',
    components: {
        Confirm
    },
    directives: {
        TransferDom
    },
    data() {
        return {
            form: {
                channel: 'WX_MP',
                phone: '',
                smsCode: '',
                openId: ''
            },
            link: '',
            codeText: '获取验证码',
            disabled: false,
            time: 60,
            isModalShow: false
        };
    },
    computed: {
        btnIsDisabled() {
            return checkPhone(this.form.phone) && this.form.smsCode.length === 6;
        }
    },
    created() {
        this.link = this.$route.query.back || '/center';                              // 过程中token失效来登录的
        this.form.openId = getQuery('openId') || window.localStorage.getItem('openId');
        if (!this.form.openId) {
            this.$outer.push('/index');
        }
        this.height = window.innerHeight;
    },
    methods: {
        onLogin() {
            if (!this.btnIsDisabled) return;
            this.$refs.input.blur();                // 解决 未报名用户 未收起输入框（ios）点击登录导致的浮层错误
            login(this.form).then(data => {
                window.localStorage.setItem('accessToken', data.accessToken);
                window.localStorage.setItem('userId', data.id);
                this.$router.push('/center');
            }).catch(e => {
                console.log(e);
                if (e.errorCode === 104) {
                    this.isModalShow = true;
                }
                if (e.errorMessage === '授权过期,请重新授权!') {
                    window.localStorage.removeItem('accessToken');
                    this.$router.push('/index');
                }
            });
            // this.$router.push(this.link);
        },
        onConfirm() {
            if (process.env.NODE_ENV === 'production') {
                window.location.href = 'https://mkt.pdabc.com/pages/entryFlow/introduction.html?channelId=53182'; // 去报名短期班
            } else {
                window.location.href = 'http://192.168.10.156:7777/pages/entryFlow/introduction.html?channelId=49760'; // 去报名短期班
            }
        },
        onGetCode() {
            const that = this;
            if (!checkPhone(this.form.phone)) {
                this.$vux.toast.text('请输入正确的手机号');
                return;
            }
            if (that.disabled) return;
            that.disabled = true;
            sendSmsCode({
                phone: this.form.phone,
                type: 1
            }).then(data => {
                let timer = setInterval(() => {
                    that.time -= 1;
                    if (that.time === 0) {

                        that.codeText = `重新获取`;
                        that.disabled = false;
                        that.time = 60;
                        clearInterval(timer);
                    } else {
                        that.codeText = `${that.time}s后重新获取`;
                    }

                }, 1000);
            });

        }
    }
};
</script>

<style lang="less">
    .login{
        width: 100%;
        // height: 100vh;
        background-color: #fff;
        .weui-dialog__btn_primary{
            color: #2EB872 !important;
        }
        .logo{
            width: 68%;
            margin: 70px 16% 0;
        }
        .content{
            width: 85%;
            padding-top: 35px;
            margin-left: 7.5%;
            .input{
                padding: 10px 14px;
                height: 20px;
                border-radius: 20px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                font-size: 14px;
                box-shadow:0px 3px 9px 0px rgba(233,233,233,1);
                margin-top: 20px;
                input{
                    height: 20px ;
                    padding: 0;
                    margin: 0;
                    line-height: 20px;
                    border:none;
                    outline: none;
                }
                ::-webkit-input-placeholder { /* WebKit, Blink, Edge */
                    color:#B3B3B3;
                }
                p{
                    border-left: 1px solid #DEDEDE;
                    padding-left: 15px;
                }
                .code{
                    color: #FF433F;
                    font-weight: 500;
                }
                .decode{
                    color: #ababab;
                }
            }
        }
        .bind{
            font-size:16px;
            color:#fff;
            font-weight: bold;
            width: 67%;
            height: 48px;
            line-height: 48px;
            text-align: center;
            margin-left: 16.5%;
            margin-top: 60px;
            border-radius: 24px;
            // background: #FF433F;
            background:linear-gradient(0deg,rgba(255,68,58,1),rgba(248,116,116,1));
            box-shadow: 0 0 24px #FE9D9B;
            letter-spacing: 2px;
        }
        .btnIsDisabled{
            background: #D8D8D8;
            box-shadow: 0 0 24px #D8D8D8;
        }

    }
    .confirm_self{
        width: 100%;
        // height: 100vh;
        position: absolute;
        z-index: 11;
        top: 0;
        left: 0;
        background-color: rgba(0, 0, 0, 0.3);
        .confirm_self_content{
            width: 80%;
            border-radius: 3px;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%,-50%);
            background-color: #fff;
            .title{
                font-weight: 400;
                font-size: 18px;
                text-align: center;
                padding-top:30px;
                padding-bottom: 12px;
            }
            .context{
                color: #999;
                font-size: 15px;
                line-height:1.3;
                width: 80%;
                padding:0 10%;
                padding-bottom: 12px;
                text-align: center;
            }
            .footer{
                display:flex;
                height: 48px;
                line-height: 48px;
                border-top: 1px solid #efefef;
                font-size: 18px;
                p{
                    width: 50%;
                    text-align: center;
                }
                .ok{
                    color: #0bb20c;
                    border-left: 1px solid #efefef;
                    box-sizing: border-box;
                }
            }
        }
    }
</style>
