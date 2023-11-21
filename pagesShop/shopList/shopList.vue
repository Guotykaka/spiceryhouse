<template>
	<!-- 店铺列表 -->
	<view class="container">
		<g-select-city ref="cityies"></g-select-city>
		<view class="u-flex u-row-between citys">
			<view @tap="initPicker"> {{ cityCode ? cityCode : '全部城市' }}<u-icon :name="showPicker ? 'arrow-up-fill' : 'arrow-down-fill'" color="#BBBBBB" size="28" class="u-m-l-8"></u-icon> </view>
			<view class="search g-flex" :style="{ width: intWidth }">
				<u-icon name="search" color="#BBBBBB" size="28" class="u-m-l-8"></u-icon>
				<input type="text" placeholder="搜索" confirm-type="search" inputmode="search" @focus="intWidth = '424rpx'" @blur="intWidth = '124rpx'" @input="searchFuc" @confirm="searchFuc" />
			</view>
		</view>
		<view class="shop-list">
			<scroll-view scroll-y @scrolltolower="init(false)" class="scroll-height">
				<view v-for="(shop, i) in pageList" :key="i" :class="[{ gray: shop.status !== 1, active: shop.shopId == currentShopId }, 'g-shop-info u-m-b-20']" @tap.stop="chengeShop(shop)">
					<view class="u-flex u-row-between">
						<view class="u-p-r-32">
							<view class="u-line-2 f32">{{ shop.shopName }}</view>
							<view class="u-flex u-row-between u-m-t-12">
								<view class="c66 f24 addrs"><text class="iconfont icon-gps u-m-r-10"></text>{{ shop.province }}{{ shop.city }}{{ shop.area }}{{ shop.address }}</view>
							</view>
							<view class="c66 f24 u-m-t-20" v-if="shop.saleStartTime"><text class="iconfont icon-clock u-m-r-10"></text> {{ shop.saleStartTime }} - {{ shop.saleEndTime }}</view>
						</view>
						<view class="shop-right u-p-l-22 fs0">
							<view class="u-text-center">
								<view class="red f32">进店</view>
								<view class="f20 u-m-t-18">距离{{ shop.distance }}</view>
								<view class="f20 red" v-if="!i">离我最近</view>
							</view>
						</view>
					</view>
					<view class="u-flex u-row-between">
						<text :class="['statusbox u-m-t-16', { 'green bg-green': shop.status == 1 }, { 'red bg-red': shop.status !== 1 }]">{{ shopStatus[shop.status] }}</text>
						<view class="g-flex u-m-t-34">
							<view class="g-flex iconfont icon-qrcode u-m-r-30" @tap.stop="lookQrCode(shop)" v-if="shop.companyWeixinCode"></view>
							<view class="g-flex iconfont icon-location" @tap.stop="lookMap(shop)"></view>
							<view class="g-flex iconfont icon-phone u-m-l-30" @tap.stop="phoneCall(shop)" v-if="shop.relationPhone"></view>
						</view>
					</view>
				</view>
			</scroll-view>
		</view>
		<qr-code ref="qrcode" :shop-name="currentShop.shopName" :shop-code="currentShop.companyWeixinCode"></qr-code>
		<canvas class="g-cav" canvas-id="myQrcode"></canvas>
	</view>
</template>
<script>
	import { AjaxApi, SHARE_URL } from '@/utils/api'
	import { getTTLocation } from '@/utils'
	import qrCode from '@/components/qr-code/qr-code'
	export default {
		components: { qrCode },
		data() {
			return {
				currentShopId: 0,
				intWidth: '124rpx',
				shopName: '',
				cityCode: '',
				cityList: [],
				currentShop: {
					shopName: '',
					companyWeixinCode: ''
				},
				showPicker: false,
				pageParams: {
					pageIndex: 1,
					pageSize: 10
				},
				pageList: [],
				pageDown: false,
				showSetting: true
			}
		},
		onLoad() {
			this.currentShopId = getApp().globalData.currentShopId
			let fuc = () => {
				this.init(true)
			}
			let openFuc = () => {
				this.showSetting = false
			}
			getTTLocation(fuc, openFuc, this.showSetting)
		},
		onShareAppMessage: function () {
			return {
				title: '芳香世家小程序',
				imageUrl: SHARE_URL,
				path: `/pages/index/index`
			}
		},
		methods: {
			init(first) {
				//订单列表
				if (!first && !this.pageDown) return
				first ? (this.pageParams.pageIndex = 1) : this.pageParams.pageIndex++
				uni.showLoading({
					title: '加载中',
					mask: true
				})
				let params = {
					userLatitude: getApp().globalData.location.latitude * 1,
					userLongitude: getApp().globalData.location.longitude * 1,
					type: 0,
					shopName: this.shopName,
					cityCode: this.cityCode,
					...this.pageParams
				}

				let successFuc = res => {
					uni.hideLoading()
					if (!res.data) return
					let { pages, current, total } = res.data
					this.pageList = first ? res.data.records : this.pageList.concat(res.data.records)
					this.pageList = this.pageList.map(it => {
						return {
							...it,
							active: Boolean(it.shipId == getApp().globalData.currentShopId)
						}
					})
					this.pageParams.pageIndex = current
					this.pageDown = Boolean(pages > current)
				}
				AjaxApi('GetStoreList', params, successFuc)
			},
			phoneCall(item) {
				uni.makePhoneCall({
					phoneNumber: item.relationPhone
				})
			},
			lookMap(item) {
				uni.openLocation({
					latitude: item.location.split(',')[1] * 1,
					longitude: item.location.split(',')[0] * 1,
					name: item.shopName,
					address: item.province + item.city + item.area + item.address,
					fail(err) {
						if (err.errNo == 10200) {
							uni.showModal({
								title: '提示',
								content: '请先打开小程序定位权限',
								confirmColor: '#fe2b54',
								showCancel: false,
								success(res) {
									if (res.confirm) {
										uni.openSetting()
									}
								}
							})
						}
					}
				})
			},
			searchFuc(e) {
				this.shopName = e.detail.value
				this.init(true)
			},
			chengeShop(shop) {
				// 店铺状态,0:休息中,1:营业中,2:暂停营业,3:关闭
				if (shop.status == 3 || shop.status == 2) {
					uni.showToast({
						title: '该门店暂未开启预约权限！',
						icon: 'none',
						duration: 3000
					})
					return
				}
				getApp().globalData.currentShopId = shop.shopId
				let pages = getCurrentPages() //获取当前页面js里面的pages里的所有信息。
				let prevPage = pages[pages.length - 2]
				switch (prevPage?.route) {
					case 'pages/index/index':
						uni.redirectTo({
							url: `/pagesShop/shop/shop`
						})
						break
					case 'pagesReservation/reservation/reservation':
						prevPage.$vm.init()
						uni.navigateBack()
						break

					default:
						uni.navigateBack()
						break
				}
			},
			initPicker() {
				this.$refs.cityies.init()
			},
			lookQrCode(it) {
				this.currentShop = it
				this.$refs.qrcode.init()
			}
		}
	}
</script>

<style lang="scss" scoped>
	.container {
		background: #f9fafb;
		min-height: 100vh;
		.scroll-height {
			height: calc(100vh - 180rpx);
		}
		.citys {
			background: white;
			padding: 24rpx 30rpx;
		}
		.search {
			width: 124rpx;
			height: 58rpx;
			background: #99999910;
			border-radius: 16rpx;
			transition: width 0.3s ease-in-out 0s;
			&.grow {
				transform: translateX(133.3333333%);
			}
			> input {
				background: transparent;
				text-align: center;
			}
		}
		.shop-list {
			padding: 20rpx;
			background: transparent;
			.g-shop-info {
				&.active {
					border: 2rpx solid $uni-color-primary;
				}
				padding: 32rpx 44rpx;
				background: white;
				&.gray {
					color: #c0b9ad;
					.c66,
					.red {
						color: #c0b9ad;
					}
					.bg-red {
						background: #c0b9ad15;
					}
				}
			}
			.shop-right {
				justify-content: space-between;
			}
		}
	}
</style>
