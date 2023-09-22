<template>
	<!-- 支付完成 -->
	<view class="container">
		<view class="confirm-img"><img class="img" :src="`../../static/img/confirm_green.svg`" alt="" /></view>
		<view class="text-done">支付成功!</view>
		<view class="text-tip c66 f24">支付成功，您可以去订单页面查看订单详情，</view>
		<view class="text-tip c66 f24"> 或者点击预约按钮立即使用</view>
		<view class="confirm-btn">
			<view class="f32 u-flex u-row-center" @tap.stop="backTo">返回</view>
			<view class="f32 u-flex u-row-center" @tap.stop="toReservation">预约</view>
		</view>
	</view>
</template>
<script>
	import { AjaxApi } from '@/utils/api'
	export default {
		data() {
			return {
				orderId: ''
			}
		},
		onLoad() {},
		onLoad(query) {
			this.orderId = query?.orderId ?? this.orderId
		},
		onShareAppMessage: function (res) {
			return {
				title: '芳香世家购美',
				imageUrl: SHARE_URL,
				path: `/pages/index/index`
			}
		},
		computed: {},
		methods: {
			backTo() {
				getApp().globalData.tabNum = 0
				uni.reLaunch({
					url: '/pages/order/order'
				})
			},
			toReservation() {
				uni.showLoading({
					title: '加载中',
					mask: true
				})
				let successFuc = res => {
					uni.redirectTo({
						url: `/pagesReservation/reservation/reservation?orderId=${res.data.outOrderId}`
					})
				}
				AjaxApi('GetOrderDetailByOrderId', { orderId: this.orderId }, successFuc)
			}
		}
	}
</script>

<style lang="scss" scoped>
	.container {
		background: #f9fafb;
		min-height: 100vh;
		padding-top: 5vh;
		display: flex;
		flex-direction: column;
		align-items: center;
		.confirm-img {
			height: 190rpx;
			.img {
				margin: 0 auto;
				width: 239rpx;
				height: 146rpx;
			}
		}
		.text-done {
			height: 56rpx;
			color: #54eab7;
			font-size: 36rpx;
			line-height: 56rpx;
			margin-bottom: 24rpx;
		}
		.text-tip {
			line-height: 30rpx;
			margin-bottom: 12rpx;
		}
		.confirm-btn {
			margin-top: 140rpx;
			display: flex;
			justify-content: space-between;
			> view {
				&:nth-of-type(1) {
					width: 296rpx;
					height: 90rpx;
					background: #ffffff;
					border-radius: 16rpx;
					border: 2rpx solid $uni-color-primary;
					color: $uni-color-primary;
					margin-right: 32rpx;
				}
				&:nth-of-type(2) {
					width: 296rpx;
					height: 90rpx;
					background: $uni-color-primary;
					border-radius: 16rpx;
					color: white;
				}
			}
		}
	}
</style>
