<template>
	<!-- 预约 -->
	<view class="container">
		<!-- 店铺提示 -->
		<u-modal
			v-model="showShopModal"
			:title-style="{
				color: '#333333',
				fontSize: '40rpx'
			}"
			title="确认预约门店"
			show-cancel-button
			confirm-text="确定"
			cancel-text="其他店铺"
			:confirm-style="confirmStyle"
			:mask-close-able="true"
			@confirm="confirmShopInfo"
			@cancel="toShops">
			<view class="slot-content slot-shop">
				<view class="shop-top">
					<view class="shop-img">
						<image src="http://110.40.221.174:9000/fxsj-oss/douyin/fxsj-logo.png" mode="aspectFill"></image>
					</view>
					<view class="shop-info">
						<view class="shop-name u-line-2">{{ currentShop.shopName }}</view>
						<view class="shop-distance">距离{{ currentShop.distance || '0m' }}</view>
					</view>
				</view>
				<view class="shop-address u-line-2">{{ currentShop.province || '' }}{{ currentShop.city || '' }}{{ currentShop.area || '' }}{{ currentShop.address || '' }}</view>
			</view>
		</u-modal>
		<view>
			<image class="banner" :src="currentShop.shopHeadPic || '../../static/img/shopHeadPic.jpg'" mode="aspectFit"></image>
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
						<view class="g-flex iconfont icon-location u-m-r-30" @tap="lookMap()"></view>
						<view class="g-flex iconfont icon-phone" @tap="phoneCall()" v-if="currentShop.relationPhone"></view>
					</view>
				</view>
				<text :class="['statusbox', { 'green bg-green': currentShop.status == 1 }, { 'red bg-red': currentShop.status !== 1 }]">{{ shopStatus[currentShop.status] }}</text>
			</view>
			<view class="white-box ticket u-m-t-20" v-if="ticketInfo.code">
				<image class="cover u-m-r-12 fs0" :src="ticketInfo.pic || '../../static/img/default.png'" mode="aspectFill"></image>
				<view class="g-col-between">
					<view class="f32">{{ ticketInfo.skuName }}</view>
					<view class="c66">有效期至：{{ ticketInfo.usedExpireTime }}</view>
				</view>
			</view>
			<view class="white-box cantdo u-m-t-20" v-if="errText">
				<image class="cantimg fs0" src="../../static/img/cantdo.png" mode="widthFix"></image>
				<view class="canttext"> {{ errText }} </view>
			</view>
			<view class="white-box scroll u-m-t-20" v-if="week.length">
				<view class="f32">预约时间</view>
				<view class="scroll-right u-m-t-40 u-flex">
					<scroll-view scroll-x class="scroll-view">
						<view class="u-flex scroll-box">
							<view :class="['date', { active: dateIndex == i }]" v-for="(it, i) in week" :key="i" @tap="clickDate(i)">
								<view class="f24">{{ it.weekMsg }}</view>
								<view>{{ it.dateMsg }}</view>
							</view>
						</view>
					</scroll-view>
					<view class="calendar g-col-center" @tap="tcCalendar">
						<u-icon name="calendar" color="#666666" size="40"></u-icon>
						<view class="f24 c66 u-m-t-20">更多</view>
					</view>
				</view>
				<view class="time-box">
					<view :class="['time f32 g-flex c66', { active: timeIndex == i, gray: it.status == 1 }]" v-for="(it, i) in times" :key="i" @tap="clickTime(i)">
						{{ it.time }}
					</view>
				</view>
			</view>
		</view>
		<view class="bottom u-flex u-row-between">
			<view class="f32">
				<text v-if="currentShop.status == 1">预约时间：{{ reserveDate }} {{ reserveTime }}</text>
			</view>
			<!-- <view class="btn f32 g-flex" @tap="$u.throttle(reservationFuc, 3000)">确定</view> -->
			<view class="btn f32 g-flex" :class="[{ gray: currentShop.status !== 1 || errText }]" @tap="doFuc">确定</view>
		</view>
		<g-get-phone :show="showPhoneGet"></g-get-phone>
	</view>
</template>
<script>
	import { AjaxApi, SHARE_URL } from '@/utils/api'
	import { getTTLocation } from '@/utils'
	import gGetPhone from '@/components/g-get-phone/g-get-phone'

	export default {
		components: { gGetPhone },
		data() {
			return {
				orderId: null,
				show: true,
				showShopModal: false, //店铺提示框: true,
				confirmStyle: {
					//输入模态框确认按钮的颜色
					color: '#fe2b54'
				},
				currentShop: {
					shopId: 0,
					shopName: '',
					shopHeadPic: '',
					relationPhone: '',
					province: '',
					city: '',
					area: '',
					address: '',
					location: '',
					saleStartTime: '',
					saleEndTime: '',
					status: 0
				},
				ticketInfo: {
					code: '', //券码
					skuId: '', //规格Id
					skuName: '', //规格名称
					usedExpireTime: '', //使用有效期
					pic: '' //图片
				},
				showSetting: true,
				showPhoneGet: false
			}
		},
		onUnload() {
			getApp().globalData.currentShopId = 0
		},
		onLoad(query) {
			this.orderId = query?.orderId ?? null
			let openFuc = () => {
				this.showSetting = false
			}
			getTTLocation(this.init, openFuc, this.showSetting)
		},
		onPullDownRefresh() {
			uni.stopPullDownRefresh()
			let page = getCurrentPages().pop() //获取当前页面实例
			if (page == undefined || page == null) return
			Object.assign(this.$data, this.$options.data())
			page.onLoad()
		},
		onShareAppMessage: function (res) {
			return {
				title: '芳香世家小程序',
				imageUrl: SHARE_URL,
				path: `/pages/index/index`
			}
		},
		computed: {},
		methods: {
			init() {
				uni.showLoading({
					title: '加载中',
					mask: true
				})
				let params = {
					shopId: getApp().globalData.currentShopId,
					userLatitude: getApp().globalData.location.latitude * 1,
					userLongitude: getApp().globalData.location.longitude * 1
				}
				let successFuc = res => {
					uni.hideLoading()
					this.currentShop = res.data ?? this.currentShop
					getApp().globalData.currentShopId = this.currentShop.shopId
					this.getReserveDate()
				}
				AjaxApi('GetShopInfo', params, successFuc)
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
			tcCalendar() {
				uni.navigateTo({
					url: '/pagesOrder/calendar/calendar'
				})
			},
			toShops() {
				uni.navigateTo({
					url: '/pagesShop/shopList/shopList'
				})
			},
			toFind() {
				uni.navigateTo({
					url: '/pagesOrder/guide/guide'
				})
			},
			closeMask() {
				this.showPhoneGet = false
			},
			doFuc() {
				if (this.currentShop.status !== 1 || this.errText) return
				this.closeMask()
				if (!getApp().globalData.UserInfo?.phone) {
					this.showPhoneGet = true
					return
				}
				if (!this.reserveTime) {
					uni.showToast({
						title: '请选择预约时间！',
						icon: 'none'
					})
					return
				}
				this.showShopModal = true
			},
			confirmShopInfo() {
				this.$u.throttle(this.reservationFuc, 3000)
			},
			reservationFuc() {
				// this.closeMask()
				// if (!getApp().globalData.UserInfo?.phone) {
				// 	this.showPhoneGet = true
				// 	return
				// }
				// if (!this.reserveTime) {
				// 	uni.showToast({
				// 		title: '请选择预约时间！',
				// 		icon: 'none'
				// 	})
				// 	return
				// }
				uni.showLoading({
					title: '加载中',
					mask: true
				})
				let params = {
					reserveTime: this.reserveDate + ' ' + this.reserveTime,
					shopId: getApp().globalData.currentShopId,
					thirdOrderId: this.orderId
				}
				let successFuc = res => {
					uni.redirectTo({
						url: `/pagesReservation/confirm/confirm?orderId=${res.data}`
					})
					// uni.showToast({
					// 	title: '已预约，待门店确认',
					// 	icon: 'none',
					// 	duration: 2000,
					// 	success: () => {
					// 		setTimeout(function () {
					// 			getApp().globalData.tabNum = 0
					// 			uni.reLaunch({
					// 				url: '/pages/order/order'
					// 			})
					// 		}, 2000)
					// 	}
					// })
				}
				let elseFuc = () => {
					this.getReserveDate()
				}
				AjaxApi('CreatOrder', params, successFuc, elseFuc)
			},
			clickDate(i) {
				this.dateIndex = i
				this.timeIndex = 0
				this.reserveDate = this.week[i].date
				this.reserveTime = ''
				this.getReserveTime()
			},
			clickTime(i) {
				if (this.times[i].status == 1) return
				this.timeIndex = i
				this.reserveTime = this.times[i].time
			}
		}
	}
</script>

<style lang="scss" scoped>
	.container {
		background: #f9fafb;
		min-height: 100vh;
		padding-bottom: 160rpx;
		.bottom {
			width: 100vw;
			height: 140rpx;
			padding: 0 40rpx;
			background: white;
			position: fixed;
			bottom: 0;
			left: 0;
			.btn {
				width: 200rpx;
				height: 80rpx;
				background: $uni-color-primary;
				border-radius: 16rpx;
				color: white;
				&.gray {
					background: #d5d5d5;
					color: #ffffff;
				}
			}
		}
		.banner {
			width: 100vw;
			height: 56.25vw;
			vertical-align: bottom;
			background: white;
		}

		.cover {
			width: 136rpx;
			height: 136rpx;
			border-radius: 8rpx;
		}
		.cantdo {
			height: 400rpx;
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			.cantimg {
				width: 250rpx;
				height: auto;
			}
			.canttext {
				font-size: 28rpx;
				color: #999999;
			}
		}
		.info-box {
			padding: 0 20rpx;
			background: transparent;
			position: relative;
			top: -20rpx;
		}
		.white-box {
			width: auto;
			background: white;
			border-radius: 16rpx;
			&.padding {
				padding: 32rpx 28rpx;
			}
			&.ticket {
				display: flex;
				padding: 20rpx;
			}
			&.scroll {
				padding: 24rpx 0 24rpx 24rpx;
			}
			.scroll-right {
				width: 100%;
				height: 120rpx;
				position: sticky;
				top: 0;
				background: white;
				.scroll-view {
					width: calc(100% - 120rpx);
				}
				.calendar {
					width: 120rpx;
					height: 120rpx;
					border-bottom: 2rpx solid #eeeeee;
					box-shadow: -16px 0px 10px -15px #00000020;
				}
				// .scroll-box {
				// }
				.date {
					height: 120rpx;
					display: flex;
					flex-direction: column;
					justify-content: center;
					align-items: center;
					color: $uni-color-primary;
					padding: 20rpx 30rpx;
					flex-shrink: 0;
					border-bottom: 2rpx solid #eeeeee;
					&.active {
						position: relative;
						&:after {
							content: '';
							display: block;
							position: absolute;
							bottom: 0;
							left: 50%;
							transform: translate(-50%, -50%);
							width: 28rpx;
							height: 4rpx;
							background: $uni-color-primary;
							border-radius: 4rpx;
						}
					}
				}
			}
			.time-box {
				display: flex;
				flex-wrap: wrap;
				gap: 30rpx;
				padding: 30rpx 0;
			}
			.time {
				width: 148rpx;
				height: 72rpx;
				background: #f9fafb;
				border-radius: 16rpx;
				&.active {
					background: rgba(254, 43, 84, 0.1);
					border: 2rpx solid #ff869e;
					color: $uni-color-primary;
				}
				&.gray {
					color: #cccccc;
				}
			}
		}
		.searchtext {
			height: 108rpx;
			padding: 0 30rpx;
			flex: 1;
		}
		.slot-content {
			padding: 20rpx 44rpx 44rpx;
		}
		.slot-shop {
			.shop-top {
				display: flex;
				align-items: center;
				margin-bottom: 20rpx;
				.shop-img {
					width: 85rpx;
					height: 85rpx;
					border-radius: 50%;
					margin-right: 20rpx;
					image {
						width: 85rpx;
						height: 85rpx;
						border-radius: 50%;
					}
				}
				.shop-info {
					// height: 85rpx;
					width: 330rpx;
					display: flex;
					flex-direction: column;
					justify-content: space-between;
					.shop-name {
						font-size: 32rpx;
						color: #333333;
					}
					.shop-distance {
						font-size: 26rpx;
						color: $uni-color-primary;
					}
				}
			}
			.shop-address {
				font-size: 26rpx;
				color: #ccc;
				margin-bottom: 6px;
			}
		}
	}
</style>
