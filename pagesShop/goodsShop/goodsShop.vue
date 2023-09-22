<template>
	<!-- 适用门店 -->
	<view class="wrapper">
		<view class="container">
			<view v-for="(it, i) in shopList" :key="i" class="shop u-flex" :class="{ 'u-m-b-20': i < shopList.length - 1 }">
				<image class="img u-m-r-12 fs0" :src="it.shopLogo || 'http://dc.guobi.com.cn/fxsj-oss/douyin/fxsj-logo.png'" mode="aspectFill"></image>
				<view class="u-flex info">
					<view class="u-line-1" style="color: #302929">{{ it.shopName }}</view>
					<view class="u-line-1">{{ it.distance }} | {{ it.province }}{{ it.city }}{{ it.area }}{{ it.address }}</view>
				</view>
				<view class="g-flex iconfont icon-phone u-m-l-26" @tap="phoneCall(it)" v-if="it.relationPhone"></view>
			</view>
		</view>
		<privacy-setting v-if="showprivacy"></privacy-setting>
	</view>
</template>
<script>
	import { AjaxApi } from '@/utils/api'
	import { appInit, getTTLocation } from '@/utils'
	export default {
		data() {
			return {
				showprivacy: false,
				showSetting: true,
				params: {
					pageIndex: 1,
					pageSize: 30
				},
				goodsId: 0,
				pageDown: false,
				shopList: []
			}
		},
		onReachBottom(e) {
			if (!this.pageDown) return
			this.params.pageIndex++
			this.init()
		},
		onLoad(query) {
			this.goodsId = query?.goodsId ?? this.goodsId
			uni.showLoading({
				title: '加载中',
				mask: false
			})
			let openFuc = () => {
				this.showSetting = false
			}
			getTTLocation(this.init, openFuc, this.showSetting)
		},
		onShow() {
			this.showprivacy = true
		},
		onHide() {
			this.showprivacy = false
		},
		methods: {
			init() {
				uni.showLoading({
					title: '加载中',
					mask: this.params.pageIndex > 1 ? true : false
				})
				let successFuc = res => {
					this.shopList = this.shopList.concat(res.data.records)
					this.pageDown = Boolean(res.data.pages > res.data.current)
				}
				AjaxApi(
					'GetGoodsShops',
					{
						productId: this.goodsId,
						userLatitude: getApp().globalData.location.latitude * 1,
						userLongitude: getApp().globalData.location.longitude * 1,
						...this.params
					},
					successFuc
				)
			},
			phoneCall(it) {
				const phoneNumber = it.relationPhone || ''
				uni.makePhoneCall({
					phoneNumber: phoneNumber
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.container {
		background: #f9fafb;
		min-height: 100vh;
		padding: 20rpx;
	}
	.shop {
		width: auto;
		padding: 30rpx 40rpx;
		background: #ffffff;
		border-radius: 8rpx;
		.img {
			width: 96rpx;
			height: 96rpx;
			border-radius: 16rpx;
		}
	}
	.info {
		flex: 1;
		width: 0;
		height: 96rpx;
		flex-direction: column;
		justify-content: space-between;
		align-items: flex-start;
	}
	.u-line-1 {
		width: 100%;
	}
	.icon-phone {
		width: 64rpx;
		height: 64rpx;
		background: #f5f5f5;
		border-radius: 50%;
		align-self: flex-end;
	}
</style>
