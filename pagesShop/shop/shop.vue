<template>
	<!-- 店铺首页 -->
	<view class="container">
		<u-navbar immersive :back-icon-color="navBackColor" :is-back="true" :title="navTit" :border-bottom="false" :background="navBackground"></u-navbar>
		<view>
			<image class="banner" :src="currentShop.shopHeadPic || '../../static/img/shopHeadPic.jpg'" mode="aspectFill"></image>
		</view>
		<view class="info-box">
			<view class="white-box padding g-shop-info">
				<view class="u-flex u-row-between">
					<view class="u-line-2 f32">{{ currentShop.shopName }}</view>
					<view class="red fs0" @tap="toShops()">更多门店 <text class="iconfont icon-arrow-right u-m-l-10"></text></view>
				</view>
				<view class="c66 f24 u-m-t-20" v-if="currentShop.saleStartTime">
					<text class="iconfont icon-clock u-m-r-10"></text>
					周一至周日 {{ currentShop.saleStartTime | filTime }} - {{ currentShop.saleEndTime | filTime }}
				</view>
				<view class="u-flex u-row-between u-m-t-12 u-m-b-16">
					<view class="c66 f24 addrs"><text class="iconfont icon-gps u-m-r-10"></text>{{ currentShop.province }}{{ currentShop.city }}{{ currentShop.area }}{{ currentShop.address }}</view>
					<view class="g-flex u-m-l-30">
						<view class="g-flex iconfont icon-qrcode u-m-r-30" @tap="lookQrCode()" v-if="currentShop.companyWeixinCode"></view>
						<view class="g-flex iconfont icon-location u-m-r-30" @tap="lookMap()"></view>
						<view class="g-flex iconfont icon-phone" @tap="phoneCall()" v-if="currentShop.relationPhone"></view>
					</view>
				</view>
				<text :class="['statusbox', { 'green bg-green': currentShop.status == 1 }, { 'red bg-red': currentShop.status !== 1 }]">{{ shopStatus[currentShop.status] }}</text>
			</view>
			<view class="white-box padding u-m-20">
				<view class="g-titile"> 优惠团购 </view>
				<view class="goods-list">
					<view class="goodsbox" :class="{ 'u-m-b-20': i < goodsList.left - 1 }" v-for="(item, i) in goodsList" :key="i">
						<view class="u-flex" :class="{ 'u-m-b-40': i < goodsList.left - 1 }">
							<image class="cover u-m-r-24 fs0" :src="item.iconPic || '../../static/img/default.png'" mode="aspectFill"></image>
							<view class="g-col-between">
								<view>
									<view class="f32 u-line-1">{{ item.productName }}</view>
									<view class="tags u-flex u-flex-wrap u-m-t-10">
										<view class="f20 c99" v-if="item.availableTimeType == 0">门店营业时间</view>
										<view class="f20 c99" v-if="item.availableTimeType == 1">{{ item.availableStartTime + '-' + item.availableEndTime }}</view>
										<view class="f20 c99" v-if="item.reserveTimeType == 0"> 提前{{ item.reserveTime }}天预约 </view>
										<view class="f20 c99" v-if="item.reserveTimeType == 1"> 不需要预约 </view>
										<view class="f20 c99" v-if="item.reserveTimeType == 2"> 当天可预约 </view>
										<view class="f20 c99">
											<text v-if="item.applyRefund == 0">随时退·</text>
											<text v-if="item.applyRefund == 1">审核后退·</text>
											<text v-if="item.expireRefund == 0">自动退</text>
										</view>
									</view>
								</view>
								<view class="u-flex u-row-between">
									<view class="price">
										<text class="f32">¥{{ item.actualAmount }}</text>
										<text class="g-line-through c99 u-m-l-12">¥{{ item.originAmount }}</text>
									</view>
									<view class="btn g-flex fs0" @tap.stop="toGoods(item)">抢购</view>
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<privacy-setting v-if="showprivacy"></privacy-setting>
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
				showprivacy: false,
				goodsList: [],
				currentShop: {
					shopId: 0,
					shopName: '',
					shopHeadPic: '',
					relationPhone: '',
					province: '',
					city: '',
					area: '',
					address: '',
					saleStartTime: '',
					saleEndTime: '',
					companyWeixinCode: '',
					status: 0
				},
				navBackground: {
					background: 'transparent',
					backgroundSize: 'cover'
				},
				navBackColor: '#ffffff',
				navTit: ' '
			}
		},
		onPageScroll(e) {
			if (e.scrollTop > 100) {
				this.navBackground.background = '#ffffff'
				this.navBackColor = '#333333'
				this.navTit = '详情'
			} else {
				this.navBackground.background = 'transparent'
				this.navBackColor = '#ffffff'
				this.navTit = ' '
			}
		},
		onUnload() {
			getApp().globalData.currentShopId = 0
		},
		onLoad(query) {
			getApp().globalData.currentShopId = query?.shopId ?? getApp().globalData.currentShopId
		},
		onShow() {
			uni.showLoading({
				title: '加载中',
				mask: false
			})
			Object.assign(this.$data, this.$options.data())
			this.showprivacy = true
			getTTLocation(this.init)
		},
		onHide() {
			this.showprivacy = false
		},
		onPullDownRefresh() {
			this.showprivacy = false
			getApp().globalData.currentShopId = 0
			uni.stopPullDownRefresh()
			let page = getCurrentPages().pop() //获取当前页面实例
			if (page == undefined || page == null) return
			Object.assign(this.$data, this.$options.data())
			page.onShow()
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
			init() {
				this.getShop()
				this.getGoods()
			},
			getShop() {
				let params = {
					shopId: getApp().globalData.currentShopId,
					userLatitude: getApp().globalData.location.latitude * 1,
					userLongitude: getApp().globalData.location.longitude * 1
				}
				let successFuc = res => {
					uni.hideLoading()
					this.currentShop = res.data ?? this.currentShop
					getApp().globalData.currentShopId = this.currentShop.shopId
				}
				AjaxApi('GetShopInfo', params, successFuc)
			},
			getGoods() {
				let successFuc = res => {
					this.goodsList = res.data
				}
				AjaxApi('GetGoodsList', { shopId: getApp().globalData.currentShopId }, successFuc)
			},
			phoneCall() {
				const phoneNumber = this.currentShop.relationPhone || ''
				uni.makePhoneCall({
					phoneNumber: phoneNumber
				})
			},
			lookMap() {
				let currentShop = this.currentShop
				uni.openLocation({
					latitude: currentShop.location.split(',')[1] * 1,
					longitude: currentShop.location.split(',')[0] * 1,
					name: currentShop.shopName,
					address: currentShop.province + currentShop.city + currentShop.area + currentShop.address,
					fail(err) {
						if (err.errNo == 10200) {
							uni.showModal({
								title: '提示',
								content: '请先打开小程序定位权限',
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
			toShops() {
				uni.navigateTo({
					url: `/pagesShop/shopList/shopList?shopId=${getApp().globalData.currentShopId}`
				})
			},
			toGoods(it) {
				uni.navigateTo({
					url: `/pagesOrder/goodsDetail/goodsDetail?goodsId=${it.productId}`
				})
			},
			lookQrCode() {
				this.$refs.qrcode.init()
			}
		}
	}
</script>

<style lang="scss" scoped>
	.container {
		background: #f9fafb;
		min-height: 100vh;
		.banner {
			width: 100vw;
			height: 56.25vw;
			vertical-align: bottom;
			background: white;
		}
		.info-box {
			background: transparent;
			position: relative;
			top: -20rpx;
		}
		.white-box {
			width: auto;
			background: white;
			border-radius: 24rpx;
			&.padding {
				padding: 36rpx 30rpx;
			}
		}
		.goods-list {
			.goodsbox {
				padding-top: 30rpx;
				width: auto;
				.cover {
					width: 188rpx;
					height: 188rpx;
					border-radius: 16rpx;
				}
				.g-col-between {
					min-height: 188rpx;
					flex: 1;
					width: 0;
				}
				.tags {
					gap: 16rpx;
					> view {
						background: #f0f0f0;
						padding: 2rpx 4rpx;
					}
				}
				.btn-phone {
					margin: 0;
					padding: 0;
					font-size: 28rpx;
				}
				.price {
					> text {
						&:nth-of-type(1) {
							color: $uni-color-primary;
						}
						&:nth-of-type(2) {
							font-size: 28rpx;
						}
					}
				}
				.btn {
					min-width: 136rpx;
					padding: 0 14rpx;
					height: 68rpx;
					background: $uni-color-primary;
					border-radius: 8rpx;
					color: white;
				}
			}
		}
	}
</style>
