<template>
	<view class="container">
		<image src="../../static/img/logo.png" class="bnimg" mode="widthFix" />
		<button class="login-wx-btn u-text-center" open-type="getPhoneNumber" @getphonenumber="getPhoneNumber">
			<view class="u-flex u-row-center">
				<text class="iconfont icon-wechat"></text>
				<view class="u-font-18 u-m-l-8">快捷登录</view>
			</view>
		</button>
		<view class="phone u-text-center" @tap="jumpPage"> 手机号登录/注册 </view>
	</view>
</template>

<script>
	import { AjaxApi, PromiseAll, SHARE_URL } from '@/utils/api'
	import { onLogin, getToken } from '@/utils'
	export default {
		data() {
			return {}
		},
		onShow() {
			// uni.hideHomeButton();
		},
		onReady: function () {
			onLogin()
		},
		onShareAppMessage: function (res) {
			return {
				title: '芳香世家购美',
				imageUrl: SHARE_URL,
				path: `/pages/index/index`
			}
		},
		methods: {
			getPhoneNumber(e) {
				// 手机号码授权
				if (e.detail.encryptedData && e.detail.iv) {
					let params = {
						encryptedData: e.detail.encryptedData,
						iv: e.detail.iv
					}
					let successFuc = res => {
						uni.showToast({
							title: '登录成功',
							icon: 'none',
							duration: 1500,
							success: () => {
								setTimeout(function () {
									let successFuc = res => {
										getApp().globalData.UserInfo = res.data
										uni.switchTab({
											url: '/pages/index/index'
										})
									}
									AjaxApi('QueryUserInfo', {}, successFuc)
								}, 1500)
							}
						})
					}
					AjaxApi('GetUserPhone', params, successFuc)
				} else {
					uni.showModal({
						title: '温馨提示',
						content: '您点击了拒绝授权，将无法进入小程序，请授权之后再进入',
						showCancel: false,
						confirmText: '确定',
						confirmColor: '#fe2b54'
					})
				}
			},
			jumpPage: function () {
				uni.navigateTo({
					url: '/pagesLogin/logonbyphone/logonbyphone'
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.container {
		height: 100vh;
		width: 100vw;
		background: #ffffff;
		padding: 0 40rpx;
		box-sizing: border-box;
		.bnimg {
			position: relative;
			left: 50%;
			top: 200rpx;
			transform: translate(-50%, 50%);
			width: 410rpx;
			z-index: 1;
		}
		.login-wx-btn {
			font-weight: bold;
			z-index: 10;
			height: 90rpx;
			background: #fe2b54;
			border-radius: 16rpx;
			width: 100%;
			line-height: 90rpx;
			color: #ffffff;
			font-size: 32rpx;
			margin: 400rpx auto 0;
		}
		.phone {
			font-weight: bold;
			z-index: 10;
			border-radius: 8rpx;
			width: 100%;
			color: #fe2b54;
			font-size: 28rpx;
			margin: 28rpx auto 0;
			text-align: center;
		}
	}
</style>
