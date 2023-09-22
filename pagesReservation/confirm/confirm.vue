<template>
	<!-- 预约成功 -->
	<view class="container">
		<view class="confirm-img"><img class="img" :src="`../../static/img/confirm_green.svg`" alt="" /></view>
		<view class="text-done">预约成功!</view>
		<view class="white-box">
			<view class="flex u-row-between">
				<view class="fs0 u-m-r-30">预约门店</view>
				<view class="u-line-2">{{ order.shopName }}</view>
			</view>
			<view class="flex u-row-between u-m-t-30">
				<view class="fs0 u-m-r-10">预约项目</view>
				<view>{{ order.itemName }}</view>
			</view>
			<view class="flex u-row-between u-m-t-30">
				<view>预约时间</view>
				<view>{{ order.reserveTime }}</view>
			</view>
			<view class="flex u-row-between u-m-t-30">
				<view>联系电话</view>
				<view>{{ order.phone }}</view>
			</view>
			<view class="qrcode u-m-t-40" v-if="order.shop.companyWeixinCode">
				<image class="code" :src="order.shop.companyWeixinCode" mode="widthFix" show-menu-by-longpress @tap="preImg"></image>
			</view>
		</view>
		<view class="confirm-btn">
			<view class="f32 u-flex u-row-center" @tap.stop="backTo">返回</view>
			<view class="f32 u-flex u-row-center" @tap.stop="toOrder">查看我的预约</view>
		</view>
	</view>
</template>
<script>
	import { AjaxApi } from '@/utils/api'
	export default {
		data() {
			return {
				order: {
					shopName: '',
					itemName: '',
					reserveTime: '',
					phone: '',
					shop: { companyWeixinCode: '' }
				}
			}
		},
		onLoad(query) {
			uni.showLoading({
				title: '加载中',
				mask: true
			})
			let params = {
				orderId: query?.orderId
			}
			let successFuc = res => {
				this.order = res.data
			}
			AjaxApi('GetReservationDetail', params, successFuc)
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
				uni.switchTab({
					url: '/pages/index/index'
				})
			},
			toOrder() {
				getApp().globalData.tabNum = 0
				uni.reLaunch({
					url: '/pages/order/order'
				})
			},
			preImg() {
				const that = this
				wx.previewImage({
					urls: [that.order.shop.companyWeixinCode],
					showmenu: true
				})
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
		.confirm-btn {
			margin-top: 100rpx;
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
		.white-box {
			padding: 30rpx;
			width: 670rpx;
			background: linear-gradient(221deg, rgba(255, 255, 255, 0.98) 0%, #ffffff 100%);
			box-shadow: 0rpx 10rpx 60rpx 2rpx rgba(197, 202, 213, 0.15), inset 0rpx 4rpx 20rpx 2rpx rgba(254, 43, 84, 0.1);
			border-radius: 24rpx;
			font-size: 26rpx;
			.flex {
				display: flex;
			}
			.qrcode {
				width: 610rpx;
				height: 220rpx;
				background: url(@/static/img/scancode.png);
				background-size: contain;
				background-repeat: no-repeat;
				box-shadow: 0rpx 10rpx 60rpx 2rpx rgba(197, 202, 213, 0.15);
				border-radius: 16rpx;
				position: relative;
				.code {
					position: absolute;
					left: 42rpx;
					top: 31rpx;
					width: 144rpx;
				}
			}
		}
	}
</style>
