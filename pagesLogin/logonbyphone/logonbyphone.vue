<template>
	<view class="auth-box">
		<view class="auth-title u-flex u-row-left u-col-center">
			<text class="title">您好，欢迎登录！</text>
		</view>
		<form @submit="formSubmit" class="login-form u-m-t-27">
			<view class="input-box-lg">
				<view class="input-box u-m-t-20 u-flex">
					<input placeholder-style="color:#D5D5D5; font-size: 32rpx;" :value="userPhone" @input="getPhone" name="phone" placeholder="请输入手机号" />
				</view>
			</view>
			<view class="input-box-lg">
				<view class="input-box u-m-t-20 u-flex u-row-between">
					<input placeholder-style="color:#D5D5D5; font-size: 32rpx;" name="code" placeholder="请输入验证码" />
					<text @tap="getCode">{{ tips }}</text>
				</view>
			</view>
			<button class="login-btn" form-type="submit">登录</button>
			<u-verification-code :keep-running="true" :seconds="seconds" ref="uCode" @change="codeChange" :startText="startText" :changeText="changeText" :endText="endText"></u-verification-code>
		</form>
	</view>
</template>

<script>
	import { AjaxApi, PromiseAll, SHARE_URL } from '@/utils/api'
	import { getToken } from '@/utils'
	export default {
		data() {
			return {
				token: '',
				tips: '获取验证码',
				seconds: 120,
				startText: '获取验证码',
				changeText: 'X秒重新获取',
				endText: '重新获取',
				userPhone: null
			}
		},
		onShareAppMessage: function (res) {
			return {
				title: '芳香世家购美',
				imageUrl: SHARE_URL,
				path: `/pages/index/index`
			}
		},
		methods: {
			formSubmit: function (e) {
				//登录
				let token = getToken()
				let isPhone = /^0?1[3|4|5|6|7|8|9][0-9]\d{8}$/
				let params = {
					phone: e.detail.value.phone,
					code: e.detail.value.code,
					token: token
				}
				if (!isPhone.test(params.phone)) {
					uni.showToast({
						title: '请输入正确的手机号码',
						icon: 'none'
					})
					return
				}
				if (!params.phone || !params.code) {
					uni.showToast({
						title: '请输入验证码后登录！',
						icon: 'none'
					})
					return
				}
				let successFuc = () => {
					uni.showToast({
						title: '登录成功',
						icon: 'success',
						success: () => {
							let successFuc = res => {
								getApp().globalData.UserInfo = res.data
								setTimeout(() => {
									uni.reLaunch({
										url: '/pages/index/index'
									})
								}, 1500)
							}
							AjaxApi('QueryUserInfo', {}, successFuc)
						}
					})
				}
				AjaxApi('LoginByPhoneAndCode', params, successFuc)
			},
			getPhone(e) {
				this.userPhone = e.detail.value
			},
			codeChange(text) {
				this.tips = text
			},
			getCode: function () {
				//获取验证码
				// if(this.userPhone)
				let isPhone = /^0?1[3|4|5|6|7|8|9][0-9]\d{8}$/
				if (!isPhone.test(this.userPhone)) {
					this.$u.toast('请输入正确的手机号！')
					return
				}
				if (this.$refs.uCode.canGetCode) {
					let params = {
						phone: this.userPhone
					}
					let successFuc = res => {
						if (res.code == 0) {
							this.$refs.uCode.start()
						}
					}
					AjaxApi('GetLoginMsgCode', params, successFuc)
				} else {
					this.$u.toast('倒计时结束后再发送')
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.auth-box {
		width: 100%;
		height: 100%;
		background-color: #ffffff;
		padding: 22rpx 40rpx 0 40rpx;
		box-sizing: border-box;
		.auth-title {
			color: $uni-color-primary;
			.title {
				font-size: 50rpx;
				margin-top: 48rpx;
				text-align: center;
				width: 100%;
			}
		}
		.login-form {
			margin-top: 128rpx;
			.input-box-lg {
				border-bottom: 2rpx solid rgba(226, 226, 226, 1);
				padding: 56rpx 32rpx 28rpx;
				.input-box {
					input {
						flex: 1;
					}
					text {
						font-size: 32rpx;
						font-weight: bold;
						color: $uni-color-primary;
					}
				}
			}
		}
		.login-btn {
			height: 100rpx;
			background: $uni-color-primary;
			border-radius: 16rpx;
			width: 100%;
			line-height: 100rpx;
			color: #ffffff;
			font-size: 36rpx;
			margin: 160rpx auto 0;
			font-weight: bold;
		}
		.login-btn::after {
			border: none;
		}
	}
</style>
