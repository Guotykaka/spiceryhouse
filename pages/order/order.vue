<template>
	<!-- 我的订单 -->
	<view class="container">
		<view class="tabs">
			<u-tabs
				:list="listTabs"
				:is-scroll="false"
				:current="currentTab"
				@change="clickTabs"
				:height="90"
				:font-size="32"
				duration="0.2"
				active-color="#FE2B54"
				inactive-color="#999999"
				:gutter="0"></u-tabs>
		</view>
		<view class="order-list">
			<scroll-view scroll-y @scrolltolower="init(false)" class="scroll-height" :scrollTop="scrollTop" @scroll="scrollFuc">
				<view class="order u-m-b-20" v-for="(item, i) in pageList" :key="i" @tap.stop="toDetail(item)">
					<view class="u-flex u-m-b-20">
						<image class="cover u-m-r-20 fs0" :src="item.pic || '../../static/img/default.png'" mode="aspectFill"></image>
						<view class="g-col-between flex1">
							<view class="f32">{{ item.itemName }}</view>
							<view class="f34 u-flex u-row-between">
								<view class="red bold">¥{{ item.payAmount }}</view>
								<view>× {{ item.status == 6 ? item.quantity : item.count }}</view>
							</view>
						</view>
					</view>
					<view class="c66 f30 u-m-b-10" v-if="item.status == -1">有效期至：{{ item.usedExpireTime | filTime }}</view>
					<view class="c66 f30 u-m-b-10" v-if="item.status == 0 || item.status == 1">预约时间：{{ item.reserveTime | filTime }}</view>
					<view class="c66 f30 u-m-b-10" v-if="item.status == 2">核销时间：{{ item.verifyTime | filTime }}</view>
					<view class="c66 f30 u-m-b-10" v-if="item.status == 6">退款时间：{{ item.refundConfirmTime | filTime }}</view>
					<view class="u-flex u-row-between u-flex-wrap u-col-top">
						<view class="yellow" v-if="item.status == -1"> 待预约 </view>
						<view class="yellow" v-if="item.status == 0"> 待确认 </view>
						<view class="green" v-if="item.status == 1"> 已预约 </view>
						<view class="red" v-if="item.status == 2"> 已使用 </view>
						<view class="red" v-if="item.status == 6"> 已退款 </view>
						<view>
							<button class="btn-phone" @tap.stop="stop(item)" v-if="!phone && item.status == -1" plain open-type="getPhoneNumber" @getphonenumber="getPhoneNumber($event, item)">
								<view class="btn g-flex">前往预约</view>
							</button>
							<!-- 状态, 预约status -1:待使用(待预约),0:待确认,1:已预约,2:已使用,6:已退款 -->
							<view class="btn g-flex fs0" @tap.stop="toReservation(item)" v-if="phone && item.status == -1">前往预约</view>
							<view class="btn cancel g-flex fs0" @tap.stop="rejectFuc(item)" v-if="item.status == 1 || item.status == 0">取消预约</view>
							<view class="btn g-flex fs0 u-m-l-20" @tap.stop="toDetail(item)" v-if="item.status == 2 || item.status == 6">查看详情</view>
						</view>
					</view>
				</view>
			</scroll-view>
		</view>
	</view>
</template>
<script>
	import { AjaxApi, SHARE_URL } from '@/utils/api'
	import { appInit, paramConversion } from '@/utils'
	export default {
		data() {
			return {
				scrollTop: 0,
				oldScrollTop: 0,
				currentTab: 0,
				listTabs: [
					{
						name: '待使用'
					},
					{
						name: '已使用'
					},
					{
						name: '已退款'
					}
				],
				pageParams: {
					pageIndex: 1,
					pageSize: 10
				},
				pageList: [],
				pageDown: false,
				phone: getApp().globalData.UserInfo?.phone ?? '',
				orderParams: {}
			}
		},
		computed: {},
		onShow() {
			this.currentTab = getApp().globalData.tabNum || 0
			uni.showLoading({
				title: '加载中',
				mask: true
			})
			let fuc = async () => {
				this.phone = getApp().globalData.UserInfo?.phone
				uni.hideLoading()
				this.init(true)
			}
			appInit(fuc)
		},
		onPullDownRefresh() {
			uni.stopPullDownRefresh()
			let page = getCurrentPages().pop() //获取当前页面实例
			if (page == undefined || page == null) return
			page.onShow()
		},
		onShareTimeline: function (res) {
			return {
				title: '芳香世家购美',
				imageUrl: SHARE_URL
			}
		},
		onShareAppMessage: function (res) {
			return {
				title: '芳香世家购美',
				imageUrl: SHARE_URL,
				path: `/pages/index/index`
			}
		},
		methods: {
			init(first) {
				//订单列表
				if (!first && !this.pageDown) return
				if (first) {
					this.pageParams.pageIndex = 1
					this.pageList = []
				} else {
					this.pageParams.pageIndex++
				}
				uni.showLoading({
					title: '加载中',
					mask: true
				})
				let params = this.pageParams
				let successFuc = res => {
					getApp().globalData.tabNum = 0
					uni.hideLoading()
					if (!res.data) return
					let { pages, current, total } = res.data
					this.pageList = first ? res.data.records : this.pageList.concat(res.data.records)
					this.pageParams.pageIndex = current
					this.pageDown = Boolean(pages > current)
				}
				// 状态,0:初始(待接受预定),1:已预约,2:已完成
				AjaxApi(this.currentTab == 2 ? 'GetRefundOrderList' : 'GetOrderList', { ...params, status: this.currentTab + 1 }, successFuc)
			},
			clickTabs(index) {
				this.scrollTop = this.oldScrollTop
				this.$nextTick(() => {
					this.scrollTop = 0
				})
				this.currentTab = index
				this.init(true)
			},
			toReservation(it) {
				uni.navigateTo({
					url: `/pagesReservation/reservation/reservation?orderId=${it.orderId}`
				})
			},
			toDetail(it) {
				uni.navigateTo({
					url: `/pagesOrder/orderDetail/orderDetail?orderId=${it.status == 6 ? it.outOrderId : it.thirdOrderId}`
				})
			},
			rejectFuc(it) {
				const that = this
				uni.showModal({
					title: '提示',
					content: '是否确认取消预约！',
					success: function (res) {
						if (res.confirm) {
							uni.showLoading({
								title: '加载中',
								mask: true
							})
							let successFuc = () => {
								uni.hideLoading()
								uni.showToast({
									title: '已取消预约！',
									icon: 'none',
									mask: true,
									duration: 2000,
									success: () => {
										setTimeout(function () {
											that.init(true)
										}, 2000)
									}
								})
							}
							AjaxApi('RejectOrder', { orderId: it.orderId }, successFuc)
						}
					}
				})
			},
			stop() {
				return
			},
			getPhoneNumber(e, item) {
				// 手机号码授权
				const that = this
				if (e.detail.encryptedData && e.detail.iv) {
					let params = {
						encryptedData: e.detail.encryptedData,
						iv: e.detail.iv
					}
					let successFuc = () => {
						uni.showToast({
							title: '登录成功',
							icon: 'none',
							duration: 1500,
							success: () => {
								setTimeout(function () {
									let successFuc = res => {
										getApp().globalData.UserInfo = res.data
										that.phone = getApp().globalData.UserInfo?.phone ?? ''
										that.toReservation(item)
									}
									AjaxApi('QueryUserInfo', {}, successFuc)
								}, 1500)
							}
						})
					}
					AjaxApi('GetUserPhone', params, successFuc)
				} else {
					this.toReservation(item)
				}
			},
			scrollFuc(e) {
				this.oldScrollTop = e.detail.scrollTop
			}
		}
	}
</script>

<style lang="scss" scoped>
	.container {
		background: #f9fafb;
		min-height: 100vh;
		.tabs {
			width: 100vw;
			padding-right: 30vw;
			background: white;
			height: 90rpx;
		}
		.order-list {
			padding: 20rpx;
			background: #f9fafb;
			.scroll-height {
				height: calc(100vh - 160rpx);
			}
			.order {
				padding: 28rpx;
				width: auto;
				background: white;
				border-radius: 16rpx;
				.cover {
					width: 164rpx;
					height: 164rpx;
					border-radius: 16rpx;
				}
				.g-col-between {
					min-height: 164rpx;
				}
				.btn-phone {
					margin: 0;
					padding: 0;
					font-size: 28rpx;
				}
				.btn {
					border: none;
					width: 152rpx;
					height: 68rpx;
					background: $uni-color-primary;
					border-radius: 8rpx;
					color: white;
					&.cancel {
						border: 2rpx solid #fe2b54;
						color: #fe2b54;
						background: white;
					}
				}
			}
		}
	}
</style>
