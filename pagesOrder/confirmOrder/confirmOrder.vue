<template>
	<!-- 确认订单 -->
	<view class="container">
		<view class="goodsbox">
			<view class="c66 f24">{{ goodsDetail.buyShopDto.shopName }}等{{ goodsDetail.shopCount }}家门店通用</view>
			<view class="u-flex u-m-t-30">
				<image class="cover u-m-r-20 fs0" :src="goodsDetail.pic || '../../static/img/default.png'" mode="aspectFill"></image>
				<view class="g-col-between">
					<view>
						<view class="f32 u-line-1">{{ goodsDetail.productName }}</view>
						<view class="tags u-flex u-flex-wrap u-m-t-10">
							<view class="f20 c99" v-if="goodsDetail.availableTimeType == 0">门店营业时间</view>
							<view class="f20 c99" v-if="goodsDetail.availableTimeType == 1">{{ goodsDetail.availableStartTime + '-' + goodsDetail.availableEndTime }}</view>
							<view class="f20 c99" v-if="goodsDetail.reserveTimeType == 0"> 提前{{ goodsDetail.reserveTime }}天预约 </view>
							<view class="f20 c99" v-if="goodsDetail.reserveTimeType == 1"> 不需要预约 </view>
							<view class="f20 c99" v-if="goodsDetail.reserveTimeType == 2"> 当天可预约 </view>
							<view class="f20 c99">
								<text v-if="goodsDetail.applyRefund == 0">随时退·</text>
								<text v-if="goodsDetail.applyRefund == 1">审核后退·</text>
								<text v-if="goodsDetail.expireRefund == 0">自动退</text>
							</view>
						</view>
					</view>
					<view class="price">
						<text class="g-line-through c99 u-m-r-20">¥{{ goodsDetail.originAmount }}</text>
						<text class="f32 red">¥{{ goodsDetail.actualAmount }}</text>
					</view>
				</view>
			</view>
			<view class="u-flex u-row-between u-col-center nums">
				<view class="titile">购买数量</view>
				<view class="quantities u-flex">
					<view class="iconfont icon-jianshao1 u-flex u-row-center" @tap="sub()"></view>
					<view class="quantity u-flex u-row-center">{{ quantity }}</view>
					<view class="iconfont icon-xinzeng u-flex u-row-center" :class="{ gray: quantity >= goodsDetail.orderBuyLimit }" @tap="add()"></view>
				</view>
			</view>
		</view>
		<view class="u-flex u-row-between u-col-center mobile u-m-t-20">
			<view class="titile fs0">联系电话</view>
			<view>
				<u-field v-model="mobile" placeholder="请输入" :border-bottom="false" :label-width="0" placeholder-style="font-size: 28rpx;color: #D5D5D5;"> </u-field>
			</view>
		</view>
		<view class="btn u-text-center" @tap="checkBeforeAddOrder">
			<text class="u-m-r-12 f32">微信支付</text>
			<text style="font-size: 34rpx">¥{{ getPrice() }}</text>
		</view>
	</view>
</template>
<script>
	import { AjaxApi, SHARE_URL } from '@/utils/api'
	import {} from '@/utils'
	import { Decimal } from 'decimal.js'

	export default {
		data() {
			return {
				orderId: '',
				quantity: 1,
				mobile: '',
				goodsDetail: {
					productId: 0, //商品Id
					typeId: 0, //类型Id
					productName: '', //商品名称
					originAmount: 30.0, //原价
					actualAmount: 0, //实际价格
					channel: 1, //渠道,0:抖音,1:微信
					status: 1, //状态,1:在线,2:下线
					availableTimeType: 0, //可用时间,0:门店营业时间,1:自定义时间
					availableStartTime: null, //可用开始时间
					availableEndTime: null, //可用结束时间
					validDays: 10, //有效期
					inventory: 20, //商品总库存
					accountBuyLimit: 0, //每个账户最大购买数
					orderBuyLimit: 10, //单笔订单限购
					useCount: 2, //单次使用张数
					useScope: 0, //使用范围,0:全场通用
					shopWindowStatus: 1,
					discountsShare: 0, //是否与其它优惠同享
					reserveTimeType: 0, //预约时间,0:提前预约,1:不需要预约,2:当天可预约
					reserveTime: 1, //预约时间
					isRefund: 0, //能否退款,0:可以
					applyRefund: 0, //申请退款,0:未使用随时退,1:审核通过后退款
					expireRefund: 0, //过期退款,0:自动退款
					pic: '', //商品主图 单张
					detailPic: '', //详情图片 多张
					shopScope: 0, //门店范围,0:全部门店,1:部分门店
					shopIds: '0', //门店范围,0:全部门店,1:部分门店
					createTime: null, //创建时间
					list: [],
					shopCount: 0,
					buyShopDto: {
						shopName: ''
					},
					listShop: null
				},
				payOnly: false, //防抖拦截
				apiType: 'requestPayment'
			}
		},
		onLoad(query) {
			this.goodsId = query?.goodsId ?? this.goodsId
			this.mobile = getApp().globalData.UserInfo?.phone ?? ''
			this.init()
		},
		onShow() {
			this.payOnly = false
		},
		onShareAppMessage: function () {
			return {
				title: '芳香世家购美',
				imageUrl: SHARE_URL,
				path: `/pages/index/index`
			}
		},
		computed: {},
		methods: {
			init() {
				this.getGoods()
			},
			getGoods() {
				let successFuc = res => {
					this.goodsDetail = res.data ?? this.goodsDetail
				}
				AjaxApi(
					'GetGoodsInfo',
					{
						productId: this.goodsId,
						userLatitude: getApp().globalData.location.latitude * 1,
						userLongitude: getApp().globalData.location.longitude * 1
					},
					successFuc
				)
			},
			checkBeforeAddOrder() {
				if (this.mobile && !this.$u.test.digits(this.mobile)) {
					// 只校验数字
					uni.showToast({
						title: '请输入正确的联系电话！',
						icon: 'none'
					})
					return
				}
				if (this.payOnly) return
				this.payOnly = true
				uni.showLoading({
					title: '正在下单',
					mask: true
				})
				const that = this
				wx.checkBeforeAddOrder({
					success(res) {
						if (res.data.requireOrder == 1 && res.data.requiredFundType == 4) {
							that.apiType = 'requestOrderPayment'
						} else {
							that.apiType = 'requestPayment'
						}
						that.payFuc(res.data.requireOrder == 1 ? res.data.traceId : '')
					},
					fail() {
						this.payOnly = false
					}
				})
			},
			async payFuc(traceId) {
				const that = this
				uni.showLoading({
					title: '正在下单',
					mask: true
				})
				let params = {
					path: `pagesOrder/goodsDetail/goodsDetail?goodsId=${that.goodsId}`,
					phone: that.mobile,
					productId: that.goodsId,
					quantity: that.quantity,
					traceId: traceId,
					type: !traceId?.length ? 0 : 1 // 订单类型(0小程序下单,1视频号下单)
				}
				let successFuc = res => {
					this.orderId = res.data.orderId
					this.payOrder(res.data)
				}
				let elseFuc = () => {
					this.payOnly = false
				}
				AjaxApi('CreatGoodsOrder', params, successFuc, elseFuc)
			},
			payOrder(it) {
				const that = this
				uni.showLoading({
					title: '正在支付',
					mask: true
				})
				uni.showNavigationBarLoading()
				let params = {
					orderId: it.orderId,
					payType: 1
				}
				let successFuc = res => {
					uni.hideNavigationBarLoading()
					let respons = res.data.payResp
					that.totalMenu(respons.timeStamp, respons.nonceStr, respons.packageValue, respons.signType, respons.paySign)
				}
				let elseFuc = () => {
					that.payOnly = false
				}
				AjaxApi('PayOrder', params, successFuc, elseFuc)
			},
			totalMenu(timeStampa, nonceStra, packageValue, signTypea, paySigna) {
				const that = this
				uni[that.apiType]({
					timeStamp: timeStampa,
					nonceStr: nonceStra,
					package: packageValue,
					signType: signTypea,
					paySign: paySigna,
					success() {
						that.payOnly = false
						uni.showToast({
							title: '支付成功！',
							icon: 'success',
							mask: true,
							duration: 1500,
							success: function () {
								setTimeout(function () {
									that.goTo()
								}, 1500)
							}
						})
					},
					fail(err) {
						that.payOnly = false
						// uni.showModal({
						// 	title: '支付失败',
						// 	content: JSON.stringify(err),
						// 	showCancel: false,
						// 	success(res) {
						// 		if (res.confirm) {
						// 			that.backTo()
						// 		}
						// 	}
						// })
						uni.showToast({
							title: '支付失败',
							icon: 'none',
							mask: true,
							duration: 1500,
							success: function () {
								setTimeout(function () {
									that.backTo()
								}, 1500)
							}
						})
					}
				})
			},
			getPrice() {
				return new Decimal(this.quantity ?? 0).mul(new Decimal(this.goodsDetail.actualAmount ?? 0))
			},
			add() {
				if (this.quantity < this.goodsDetail.orderBuyLimit) this.quantity++
			},
			sub() {
				if (this.quantity > 1) this.quantity--
			},
			backTo() {
				uni.navigateBack()
			},
			goTo() {
				uni.redirectTo({
					url: `/pagesOrder/paySuccess/paySuccess?orderId=${this.orderId}`
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
		.goodsbox {
			padding: 30rpx;
			width: auto;
			background: white;
			border-radius: 16rpx;
			.cover {
				border-radius: 16rpx;
				width: 164rpx;
				height: 164rpx;
			}
			.g-col-between {
				min-height: 164rpx;
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
			.titile {
				font-size: 28rpx;
				color: #302929;
			}
			.quantities {
				.icon-jianshao1 {
					color: #302929;
					width: 40rpx;
					height: 40rpx;
					background: #ffffff;
					border-radius: 8rpx;
					border: 2rpx solid #d5d5d5;
					font-size: 20rpx;
				}
				.quantity {
					min-width: 40rpx;
				}
				.icon-xinzeng {
					width: 40rpx;
					height: 40rpx;
					background: #fe2b54;
					color: #ffffff;
					border-radius: 8rpx;
					font-size: 20rpx;
					&.gray {
						background: #dddddd;
						color: #b3b3b3;
					}
				}
			}
			.price {
				text-align: right;
				> text {
					&:nth-of-type(1) {
						font-size: 28rpx;
					}
				}
			}
		}
		.nums {
			margin-top: 60rpx;
		}
		.mobile {
			padding: 0 30rpx;
			width: auto;
			height: 112rpx;
			background: white;
			border-radius: 16rpx;
		}
		.btn {
			margin-top: 140rpx;
			color: white;
			width: auto;
			height: 90rpx;
			line-height: 90rpx;
			background: $uni-color-primary;
			border-radius: 16rpx;
			color: #ffffff;
		}
	}
</style>
