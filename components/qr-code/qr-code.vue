<template>
	<view class="content" v-if="show" @tap="show = false">
		<view class="modal g-col-center">
			<view class="f32 tit u-p-b-30 u-text-center">{{ shopName }}</view>
			<image show-menu-by-longpress class="cavimg" mode="aspectFit" :src="shopCode" @tap="preImg"></image>
			<!-- <image class="cavimg" mode="aspectFit" :src="tempFilePath"></image> -->
			<view class="u-m-t-40">扫一扫二维码，加入群聊</view>
		</view>
	</view>
</template>

<script>
	import drawQrcode from '@/utils/qrcode'
	export default {
		name: 'qr-code',
		props: {
			shopName: {
				type: String,
				default: ''
			},
			shopCode: {
				type: String,
				default: ''
			}
		},
		data() {
			return {
				show: false,
				tempFilePath: ''
			}
		},
		computed: {},
		mounted() {},
		watch: {},
		methods: {
			preImg() {
				const that = this
				wx.previewImage({
					urls: [that.shopCode],
					showmenu: true
				})
			},
			init() {
				this.show = true
				this.tempFilePath = ''
				// const that = this
				// this.$nextTick(() => {
				// 	drawQrcode({
				// 		width: (400 / 750) * uni.getSystemInfoSync().windowWidth,
				// 		height: (400 / 750) * uni.getSystemInfoSync().windowWidth,
				// 		foreground: '#333333',
				// 		canvasId: 'myQrcode',
				// 		text: that.shopCode || '失效码',
				// 		callback: () => {
				// 			setTimeout(() => {
				// 				uni.canvasToTempFilePath({
				// 					width: (400 / 750) * uni.getSystemInfoSync().windowWidth,
				// 					height: (400 / 750) * uni.getSystemInfoSync().windowWidth,
				// 					canvasId: 'myQrcode',
				// 					success(res) {
				// 						that.tempFilePath = res.tempFilePath
				// 					},
				// 					fail(err) {
				// 						console.log(err)
				// 					}
				// 				})
				// 			}, 200)
				// 		}
				// 	})
				// })
			}
		}
	}
</script>
<style lang="scss" scoped>
	.content {
		width: 100vw;
		height: 100vh;
		background: #00000065;
		position: fixed;
		top: 0;
		padding-top: 278rpx;
		.modal {
			position: relative;
			left: 50%;
			transform: translate(-50%, 0);
			width: 570rpx;
			height: 760rpx;
			background: #ffffff;
			box-shadow: 0rpx 6rpx 12rpx 2rpx rgba(0, 0, 0, 0.16);
			border-radius: 16rpx;
			padding: 50rpx 30rpx;
			.tit {
				border-bottom: 2rpx solid #eeeeee;
			}
		}
		.cavimg {
			width: 400rpx;
			height: 400rpx;
			background: white;
		}
	}
</style>
