<template>
	<view class="content" v-if="ifshow">
		<view class="dialog">
			<view class="title">查看隐私政策</view>
			<view class="airticle">
				尊敬的用户，在您使用本小程序服务之前，请仔细阅读<text class="red" @tap="openPrivacyContract">{{ name() }}</text
				>。我们将严格遵守您同意的各项条款使用您的信息，以便为您提供更好的服务。 如您同意本隐私政策，请点击“同意”开始使用本小程序。我们将严格保护您的个人信息，确保信息安全。
			</view>
			<view class="btns">
				<view @tap="fail">拒绝</view>
				<button id="agree-btn" class="btn" plain="true" open-type="agreePrivacyAuthorization" @agreeprivacyauthorization="handleAgreePrivacyAuthorization" style="border: 0">同意</button>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: 'privacySetting',
		props: {},
		data() {
			return {
				ifshow: false
			}
		},
		computed: {},
		mounted() {
			this.ifshow = getApp().globalData.needAuthorization
			getApp().watch(this.getNeedAuthorization, 'needAuthorization')
			getApp().watch(this.getNeedAuthorization, 'privacyContractName')
		},
		watch: {},
		methods: {
			openPrivacyContract() {
				wx.openPrivacyContract()
			},
			show() {
				return getApp().globalData.needAuthorization
			},
			name() {
				return getApp().globalData.privacyContractName
			},
			getNeedAuthorization(val) {
				this.ifshow = getApp().globalData.needAuthorization
				this.$forceUpdate()
			},
			handleAgreePrivacyAuthorization() {
				getApp().globalData.needAuthorization = false
				getApp().globalData.resolvePrivacyAuthorization({ buttonId: 'agree-btn', event: 'agree' })
			},
			fail() {
				getApp().globalData.resolvePrivacyAuthorization({ event: 'disagree' })
				getApp().globalData.needAuthorization = false
			}
		}
	}
</script>
<style lang="scss" scoped>
	.content {
		z-index: 10099;
		padding: 0 16rpx 80rpx;
		height: 100vh;
		width: 100vw;
		position: fixed;
		top: 0;
		left: 0;
		background: #00000070;
		display: flex;
		align-items: flex-end;
		.red {
			color: #fe2b54;
		}
		.dialog {
			padding: 52rpx 30rpx 40rpx;
			width: 100%;
			height: 700rpx;
			background: #ffffff;
			border-radius: 26rpx;
			display: flex;
			flex-direction: column;
			.title {
				font-size: 40rpx;
				color: #212223;
				text-align: center;
			}
			.airticle {
				margin-top: 36rpx;
				width: 640rpx;
				height: 356rpx;
				font-size: 32rpx;
				font-family: PingFang SC-Regular, PingFang SC;
				font-weight: 400;
				color: #212223;
				line-height: 52rpx;
			}
			.btns {
				margin-top: auto;
				display: flex;
				justify-content: space-between;
				> view {
					width: 320rpx;
					height: 92rpx;
					line-height: 92rpx;
					background: #ffffff;
					border-radius: 24rpx;
					border: 2rpx solid #ebeced;
					font-size: 28rpx;
					color: #252627;
					text-align: center;
				}
				.btn {
					width: 320rpx;
					height: 92rpx;
					line-height: 92rpx;
					background: $uni-color-primary;
					border-radius: 24rpx;
					font-size: 28rpx;
					color: #ffffff;
				}
			}
		}
	}
</style>
