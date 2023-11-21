<template>
	<view v-if="show">
		<u-mask :show="show" class="mask" :zoom="false" mask-click-able @click="closeMask" :duration="0">
			<view class="mask-slot" @click.stop="stop">
				<view class="g-col-between u-col-center">
					<image class="logo" src="../../static/img/logo.png" mode="aspectFill"></image>
					<form @submit="formSubmit" class="login-form">
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
						<button class="btn g-flex u-m-t-20" form-type="submit">确认</button>
						<u-verification-code :keep-running="true" :seconds="seconds" ref="uCode" @change="codeChange" :startText="startText" :changeText="changeText" :endText="endText"></u-verification-code>
					</form>
				</view>
			</view>
		</u-mask>
	</view>
</template>
<script>
	import { AjaxApi } from '@/utils/api'
	import { getToken } from '@/utils'
	import { htmlUrl } from '@/utils/api'
	export default {
		props: {
			show: {
				type: Boolean,
				default: true
			}
		},
		data() {
			return {
				tips: '获取验证码',
				seconds: 120,
				startText: '获取验证码',
				changeText: 'X秒重新获取',
				endText: '重新获取',
				userPhone: null,
				click: false
			}
		},
		watch: {},
		mounted() {},
		methods: {
			closeMask() {
				this.$parent.closeMask()
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
			},
			formSubmit(e) {
				//登录
				const that = this
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
					uni.showLoading({
						title: '加载中',
						mask: true
					})
					let successFuc = res => {
						uni.hideLoading()
						getApp().globalData.UserInfo = res.data
						that.$parent.doFuc()
					}
					AjaxApi('QueryUserInfo', {}, successFuc)
				}
				AjaxApi('LoginByPhoneAndCode', params, successFuc)
			},
			stop() {}
		}
	}
</script>
<style lang="scss" scoped>
	.mask-slot {
		position: fixed;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		color: #333333;
		background: #ffffff;
		width: 570rpx;
		height: auto;
		border-radius: 16rpx;
		.btn {
			width: 490rpx;
			height: 90rpx;
			background: $uni-color-primary;
			color: white;
			border-radius: 16rpx;
		}
		> view {
			width: 100%;
			height: 100%;
			height: auto;
			position: relative;
			padding: 60rpx 40rpx;
			.logo {
				width: 320rpx;
				height: 264rpx;
			}
		}
		.login-form {
			.input-box-lg {
				border-bottom: 2rpx solid rgba(226, 226, 226, 1);
				padding: 20rpx 0;
				.input-box {
					input {
						flex: 1;
					}
					text {
						font-size: 32rpx;
						font-weight: bold;
						color: #fe2b54;
					}
				}
			}
		}
	}
</style>
