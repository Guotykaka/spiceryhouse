<template>
	<!-- 订单详情 -->
	<view class="container">
		<view class="topbox">
			<view class="u-flex">
				<image class="statusimg" :src="`../../static/img/status-${order.reserveStatus == 0 || order.reserveStatus == -1 || order.status == 0 ? 'red' : 'green'}.png`" mode="aspectFit"></image>
				<!-- 订单status   0待支付1待使用,2:已完成,6已退款 -->
				<text class="f32 u-m-l-12" v-if="order.status !== 1">{{ orderStatus[order.status] }}</text>
				<!-- reserveStatus  -1 待预约 , 0 待确认, 1已预约 -->
				<text class="f32 u-m-l-12" v-else>
					{{ order.reserveStatus == -1 ? '待预约' : order.reserveStatus == 0 ? '待确认' : '已预约' }}
				</text>
			</view>
			<view class="c99 u-m-t-16" v-if="order.status == 1 && order.reserveStatus == -1">请在 {{ order.validityTimeStr | filTime }} 到店使用</view>
			<view class="c99 u-m-t-16" v-if="order.status == 1 && order.reserveStatus !== -1">预约时间： {{ order.reserveTime | filTime }} 到店使用</view>
			<view class="c99 u-m-t-16" v-if="order.status == 2">核销时间： {{ order.completeTime | filTime }} </view>
			<view class="c99 u-m-t-16" v-if="order.status == 6">退款时间： {{ order.refundConfirmTime | filTime }} </view>
			<view class="c99 u-m-t-16" v-if="order.status == 0">下单时间： {{ order.createTime | filTime }} </view>
		</view>
		<view class="paddingbox">
			<view class="u-flex">
				<view class="g-col-center operate" @tap.stop="payOrder()" v-if="order.status == 0">
					<view><text class="iconfont icon-pay"></text></view>
					<view class="u-m-t-20">去支付</view>
				</view>
				<view class="g-col-center operate" @tap.stop="rejectFuc()" v-if="order.status == 1 && order.reserveStatus !== -1">
					<view><text class="iconfont icon-clock"></text></view>
					<view class="u-m-t-20">取消预约</view>
				</view>
				<!-- <button class="imbtn g-col-center operate" plain open-type="contact" >
					<view><text class="iconfont icon--kefu"></text></view>
					<view class="u-m-t-20">联系客服</view>
				</button> -->
			</view>
		</view>
		<view class="paddingbox">
			<view class="casket">
				<view class="f32 tit">项目信息</view>
				<view class="info-box">
					<view class="name">
						<image class="goods-pic fs0 u-m-r-20" :src="order.pic || '../../static/img/default.png'" mode="aspectFill"></image>
						<view class="g-col-between goods-text flex1">
							<view>
								<view class="f32 u-line-1">{{ order.itemName }}</view>
								<view class="c66 u-m-t-8">
									<text class="u-m-r-20">共计: {{ order.quantity }}份</text>
									<text>剩余可用: {{ order.surplusNum }}份</text>
								</view>
							</view>
							<view class="u-flex u-row-between">
								<text class="f34 bold">¥{{ order.payAmount }}</text>
								<text class="c66" @tap="toGoods">项目详情 <text class="iconfont icon-arrow-right u-m-l-10"></text></text>
							</view>
						</view>
					</view>
				</view>
			</view>
			<view class="u-flex u-row-between u-m-t-20 reservation" v-if="order.status == 1 && order.reserveStatus == -1">
				<view class="g-col-between">
					<view class="bold" v-if="order.productInfoDto.reserveTimeType == 1">可到店使用</view>
					<view class="bold" v-else>预约后，可到店使用</view>
					<!-- reserveTimeType: 0, //预约时间,0:提前预约,1:不需要预约,2:当天可预约 -->
					<view class="u-m-t-6 c99 f24" v-if="order.productInfoDto.reserveTimeType == 0">需提前{{ order.productInfoDto.reserveTime }}天预约</view>
					<view class="u-m-t-6 c99 f24" v-if="order.productInfoDto.reserveTimeType == 1">不需要预约</view>
					<view class="u-m-t-6 c99 f24" v-if="order.productInfoDto.reserveTimeType == 2">当天可预约</view>
				</view>
				<view class="res-btn u-text-center" @tap="toReservation">前往预约</view>
			</view>
			<view class="casket u-m-t-20" v-if="order.status == 1">
				<view class="f32 tit">使用凭证</view>
				<view class="info-box">
					<view class="u-flex u-row-center">
						<image class="cavimg" mode="aspectFit" :src="tempFilePath"></image>
					</view>
					<view class="u-row-between u-p-t-30" style="display: flex">
						<view>
							<!-- //1 待使用 2 已使用 3已退款 -->
							<view class="u-m-t-8" :class="{ 'g-line-through': code.status !== 1 }" v-for="(code, i) in order.orderDetails" :key="i" :style="{ color: code.status !== 1 ? '#D5D5D5' : '#333333' }">
								<text class="f32">
									券号{{ i + 1 }}:
									<text class="f34 bold u-m-r-8" :user-select="code.status == 1"> {{ code.originCode }}</text>
								</text>
							</view>
						</view>
						<view class="u-m-t-8 c66 refund-btn u-text-center" @tap="refundFuc" v-if="order.status == 1 && order.reserveStatus == -1">申请退款</view>
					</view>
				</view>
			</view>
			<view class="white-box u-m-t-20" v-if="Boolean((order.status == 1 && order.reserveStatus == -1) || order.status == 6)">
				<view class="g-titile u-m-b-30">
					<view>适用门店({{ order.productInfoDto.shopCount }}家)</view>
					<view class="u-flex" @tap="toGoodsShops()">
						全部适用门店
						<text class="iconfont icon-arrow-right u-m-l-10" style="display: block; padding-top: 6rpx"></text>
					</view>
				</view>
				<view class="g-shop-info">
					<view class="u-flex u-row-between">
						<image class="iconimg u-m-r-16 fs0" :src="order.productInfoDto.buyShopDto.shopLogo || 'http://dc.guobi.com.cn/fxsj-oss/douyin/fxsj-logo.png'" mode="aspectFill"></image>
						<view class="u-flex goods-shop">
							<view class="u-line-2 f32">{{ order.productInfoDto.buyShopDto.shopName }}</view>
							<text class="f20 tag">离我最近</text>
						</view>
					</view>
					<view class="u-flex u-row-between u-m-t-28 u-m-b-16">
						<view class="c66 f24 addrs">
							<text class="iconfont icon-gps u-m-r-10"></text>
							{{ order.productInfoDto.buyShopDto.province }}{{ order.productInfoDto.buyShopDto.city }}{{ order.productInfoDto.buyShopDto.area }}{{ order.productInfoDto.buyShopDto.address }}
						</view>
						<view class="g-flex u-m-l-30">
							<view class="g-flex iconfont icon-location u-m-r-30" @tap="lookMap()"></view>
							<view class="g-flex iconfont icon-phone" @tap="phoneCall()" v-if="order.productInfoDto.buyShopDto.relationPhone"></view>
						</view>
					</view>
				</view>
			</view>
			<view class="white-box u-m-t-20" v-if="Boolean(order.status == 1 && order.reserveStatus !== -1)">
				<view class="g-titile u-m-b-30">
					<view>预约门店</view>
				</view>
				<view class="g-shop-info">
					<view class="u-flex u-row-between">
						<image class="iconimg u-m-r-16 fs0" :src="order.buyShopDto.shopLogo || 'http://dc.guobi.com.cn/fxsj-oss/douyin/fxsj-logo.png'" mode="aspectFill"></image>
						<view class="u-flex goods-shop">
							<view class="u-line-2 f32">{{ order.buyShopDto.shopName }}</view>
							<text class="f20">距离: {{ order.buyShopDto.distance }}</text>
						</view>
					</view>
					<view class="u-flex u-row-between u-m-t-28 u-m-b-16">
						<view class="c66 f24 addrs">
							<text class="iconfont icon-gps u-m-r-10"></text>
							{{ order.buyShopDto.province }}{{ order.buyShopDto.city }}{{ order.buyShopDto.area }}{{ order.buyShopDto.address }}
						</view>
						<view class="g-flex u-m-l-30">
							<view class="g-flex iconfont icon-location u-m-r-30" @tap="lookMap()"></view>
							<view class="g-flex iconfont icon-phone" @tap="phoneCall()" v-if="order.buyShopDto.relationPhone"></view>
						</view>
					</view>
				</view>
			</view>
			<view class="white-box u-m-t-20">
				<view class="g-titile u-m-b-15"> 套餐使用说明 </view>
				<view class="u-m-t-40">
					<view class="c66">·可用时间</view>
					<!-- 0:门店营业时间,1:自定义时间 -->
					<view class="u-m-t-8"> {{ order.productInfoDto.availableTimeType == 0 ? '营业时间均可使用' : order.productInfoDto.availableStartTime + '~' + order.productInfoDto.availableEndTime }} </view>
				</view>
				<view class="u-m-t-40">
					<view class="c66">·预约规则</view>
					<!-- reserveTimeType: 0, //预约时间,0:提前预约,1:不需要预约,2:当天可预约 -->
					<view class="u-m-t-8" v-if="order.productInfoDto.reserveTimeType == 0"> 到店消费，需提前{{ order.productInfoDto.reserveTime }}天预约 </view>
					<view class="u-m-t-8" v-if="order.productInfoDto.reserveTimeType == 1"> 到店消费，不需要预约 </view>
					<view class="u-m-t-8" v-if="order.productInfoDto.reserveTimeType == 2"> 到店消费，当天可预约 </view>
				</view>
				<view class="u-m-t-40">
					<view class="c66">·使用规则</view>
					<!-- useScope: 0, //使用范围,0:全场通用 -->
					<view class="u-m-t-8"> 使用范围：{{ order.productInfoDto.useScope == 0 ? '全场通用' : '' }} </view>
					<view class="u-m-t-8"> 单次最多使用{{ order.productInfoDto.useCount }}张团购券 </view>
					<!-- discountsShare: 0, //是否与其它优惠同享 -->
					<view class="u-m-t-8"> 是否与其他优惠同享：{{ order.productInfoDto.discountsShare == 1 ? '可以' : '不可以' }} </view>
				</view>
				<view class="u-m-t-40">
					<view class="c66">·退款规则</view>
					<!-- applyRefund: 0, //申请退款,0:未使用随时退,1:审核通过后退款 -->
					<!-- expireRefund: 0, //过期退款,0:自动退款 -->
					<view class="u-m-t-8" v-if="order.productInfoDto.applyRefund == 0"> 未使用随时退{{ order.productInfoDto.expireRefund == 0 ? '、过期自动退' : '' }} </view>
					<view class="u-m-t-8" v-if="order.productInfoDto.applyRefund == 1"> 审核通过后退款{{ order.productInfoDto.expireRefund == 0 ? '、过期自动退' : '' }} </view>
				</view>
				<view class="u-m-t-40 u-m-b-20">
					<view class="c66">·核销方式</view>
					<view class="u-m-t-8"> 到店消费后，联系工作人员扫码核销 </view>
				</view>
			</view>
			<view class="white-box u-m-t-20">
				<view class="g-titile u-m-b-15">订单信息</view>
				<view class="event u-flex u-row-between f32">
					<view>订单编号</view>
					<text user-select>{{ order.outOrderId }}</text>
				</view>
				<view class="event u-flex u-row-between f32">
					<view>下单时间</view>
					<view>{{ order.createTime | filTime }}</view>
				</view>
				<view class="event u-flex u-row-between f32" v-if="order.status == 1 && order.reserveStatus !== -1">
					<view>预约时间</view>
					<view>{{ order.reserveTime | filTime }}</view>
				</view>
				<view class="event u-flex u-row-between f32">
					<view>联系电话</view>
					<view>{{ order.phone }}</view>
				</view>
				<view class="event u-flex u-row-between f32">
					<view>购买份数</view>
					<view>{{ order.quantity }}</view>
				</view>
				<view class="event u-flex u-row-between f32">
					<view>订单金额</view>
					<view>¥{{ order.originalAmount }}</view>
				</view>
				<view class="event u-flex u-row-between f32" v-if="!order.status == 0">
					<view>商品优惠</view>
					<view>-¥{{ order.discountAmount }}</view>
				</view>
				<view class="event u-flex u-row-between f32" v-if="!order.status == 0">
					<view>实付金额</view>
					<view>¥{{ order.payAmount }}</view>
				</view>
				<view class="event u-flex u-row-between f32" v-if="order.status == 6">
					<view>退款时间</view>
					<view>{{ order.refundConfirmTime | filTime }}</view>
				</view>
				<view class="event u-flex u-row-between f32" v-if="order.status == 6">
					<view>退款方式</view>
					<view>原路返还</view>
				</view>
				<view class="event u-flex u-row-between f32" v-if="order.status == 6">
					<view>退款金额</view>
					<view>¥{{ order.payAmount }}</view>
				</view>
			</view>
			<view class="white-box u-m-t-20" v-if="verificationCode.length">
				<view class="g-titile u-m-b-15">核销信息</view>
				<view v-for="(code, i) in verificationCode" :class="{ dotted: i !== verificationCode.length - 1 }" :key="i">
					<view class="event u-flex u-row-between f32">
						<view>核销券号</view>
						<text user-select>{{ code.originCode }}</text>
					</view>
					<view class="event u-flex u-row-between f32">
						<view>核销时间</view>
						<view>{{ code.verifyTime | filTime }}</view>
					</view>
					<view class="event u-flex u-row-between f32">
						<view>核销店铺</view>
						<view>{{ code.shopName }}</view>
					</view>
				</view>
			</view>
		</view>
		<canvas class="g-cav" canvas-id="myQrcode"></canvas>
		<privacy-setting v-if="showprivacy"></privacy-setting>
	</view>
</template>
<script>
	import { AjaxApi, SHARE_URL } from '@/utils/api'
	import { getTTLocation, paramConversion } from '@/utils'
	import drawQrcode from '@/utils/qrcode'
	export default {
		components: {},
		data() {
			return {
				orderId: '',
				showprivacy: false,
				order: {
					cellStyleMap: {},
					orderDetails: [],
					orderId: 0,
					userName: null,
					phone: '',
					itemName: '',
					outOrderId: '',
					quantity: 0,
					payAmount: 0,
					statusName: '',
					verificationStatusName: '',
					typeStr: '',
					shopName: '',
					finderNickname: '',
					createTime: '',
					payTime: '',
					thirdOrderId: '',
					traceId: '',
					userId: 4,
					transId: 19,
					payType: '',
					status: '',
					shopId: '',
					productId: 0,
					skuId: '',
					price: 0,
					pic: '', //商品缩略图 单张
					path: '',
					originalAmount: 0,
					discountAmount: 0,
					qrCode: '',
					originCode: '',
					expireTime: '',
					cancelTime: '',
					completeTime: '',
					refundTime: '',
					refundConfirmTime: '',
					validityTime: '',
					validityTimeStr: '',
					type: 0,
					surplusNum: 0,
					promoterId: '',
					reserveStatus: 0,
					reserveTime: '',
					productInfoDto: {
						//待预约和退款 适用门店
						availableTimeType: 0,
						reserveTimeType: 1,
						shopCount: 0,
						useCount: 0,
						discountsShare: 0,
						expireRefund: 0,
						applyRefund: 0,
						buyShopDto: {
							shopName: '',
							shopLogo: '',
							shopHeadPic: '',
							province: '',
							city: '',
							area: '',
							address: '',
							relationPhone: ''
						}
					},
					buyShopDto: {
						//已预约和已核销 预约门店
						shopName: '',
						shopLogo: '',
						shopHeadPic: '',
						province: '',
						city: '',
						distance: '',
						area: '',
						address: '',
						relationPhone: ''
					}
				},
				tempFilePath: '',
				verificationCode: [],
				payOnly: false //防抖拦截
			}
		},
		onLoad(query) {
			if (query?.q) {
				let link = paramConversion(decodeURIComponent(query?.q))
				this.orderId = link?.orderId ?? this.orderId
			}
			this.orderId = query?.orderId ?? this.orderId
			uni.showLoading({
				title: '加载中',
				mask: false
			})
			getTTLocation(this.init)
		},
		onShow() {
			this.showprivacy = true
			this.payOnly = false
		},
		onHide() {
			this.showprivacy = false
		},
		onPullDownRefresh() {
			uni.stopPullDownRefresh()
			let page = getCurrentPages().pop() //获取当前页面实例
			if (page == undefined || page == null) return
			page.onLoad({ orderId: this.orderId })
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
				uni.showLoading({
					title: '加载中',
					mask: true
				})
				let params = {
					outOrderId: this.orderId,
					userLatitude: getApp().globalData.location.latitude * 1,
					userLongitude: getApp().globalData.location.longitude * 1
				}
				let successFuc = res => {
					this.order = res.data
					this.verificationCode = this.order?.orderDetails?.filter(it => it.status == 2) ?? []
					this.drawCode()
				}
				AjaxApi('GetOrderDetail', params, successFuc)
			},
			drawCode() {
				const that = this
				this.tempFilePath = ''
				if (this.order.status == 1) {
					this.$nextTick(() => {
						drawQrcode({
							width: (398 / 750) * uni.getSystemInfoSync().windowWidth,
							height: (398 / 750) * uni.getSystemInfoSync().windowWidth,
							foreground: '#333333',
							canvasId: 'myQrcode',
							text: that.order.qrCode || '失效码',
							callback: () => {
								setTimeout(() => {
									uni.canvasToTempFilePath({
										width: (398 / 750) * uni.getSystemInfoSync().windowWidth,
										height: (398 / 750) * uni.getSystemInfoSync().windowWidth,
										canvasId: 'myQrcode',
										success(res) {
											that.tempFilePath = res.tempFilePath
										},
										fail(err) {
											console.log(err)
										}
									})
								}, 200)
							}
						})
					})
				}
			},
			toGoods() {
				uni.navigateTo({
					url: `/pagesOrder/goodsDetail/goodsDetail?goodsId=${this.order.productId}`
				})
			},
			phoneCall() {
				let item = this.order.productInfoDto.buyShopDto
				uni.makePhoneCall({
					phoneNumber: item.relationPhone
				})
			},
			lookMap() {
				let item = this.order.productInfoDto.buyShopDto
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
								showCancel: false,
								confirmColor: '#fe2b54',
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
			toReservation() {
				uni.navigateTo({
					url: `/pagesReservation/reservation/reservation?orderId=${this.order.outOrderId}`
				})
			},
			toGoodsShops() {
				uni.navigateTo({
					url: `/pagesShop/goodsShop/goodsShop?goodsId=${this.order.productId}`
				})
			},
			rejectFuc() {
				let it = this.order
				uni.showModal({
					title: '提示',
					content: '是否确认取消预约！',
					confirmColor: '#fe2b54',
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
											uni.reLaunch({
												url: '/pages/order/order'
											})
										}, 2000)
									}
								})
							}
							AjaxApi('RejectOrder', { orderId: it.reserveId }, successFuc)
						}
					}
				})
			},
			refundFuc() {
				let it = this.order
				uni.showModal({
					title: '提示',
					content: '是否确认退款！',
					confirmColor: '#fe2b54',
					success: function (res) {
						if (res.confirm) {
							uni.showLoading({
								title: '加载中',
								mask: true
							})
							let successFuc = () => {
								uni.hideLoading()
								uni.showToast({
									title: '已退款！',
									icon: 'none',
									mask: true,
									duration: 2000,
									success: () => {
										setTimeout(function () {
											uni.reLaunch({
												url: '/pages/order/order'
											})
										}, 2000)
									}
								})
							}
							AjaxApi('RefundOrder', { orderId: it.orderId }, successFuc)
						}
					}
				})
			},
			payOrder() {
				const that = this
				uni.showLoading({
					title: '正在支付',
					mask: true
				})
				uni.showNavigationBarLoading()
				let params = {
					orderId: that.order.orderId,
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
				uni.requestOrderPayment({
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
									let page = getCurrentPages().pop() //获取当前页面实例
									if (page == undefined || page == null) return
									this.showprivacy = true
									page.onLoad()
								}, 1500)
							}
						})
					},
					fail(err) {
						that.payOnly = false
						uni.showToast({
							title: '支付失败',
							icon: 'none',
							mask: true,
							duration: 1500,
							success: function () {
								setTimeout(function () {
									let page = getCurrentPages().pop() //获取当前页面实例
									if (page == undefined || page == null) return
									this.showprivacy = true
									page.onLoad()
								}, 1500)
							}
						})
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.container {
		background: #f9fafb;
		min-height: 100vh;
		padding-bottom: 60rpx;
		.topbox {
			background: white;
			padding: 20rpx 40rpx 40rpx;
			height: 250rpx;
			margin-bottom: -120rpx;
			.statusimg {
				width: 44rpx;
				height: 44rpx;
			}
		}
		.paddingbox {
			margin: 20rpx;
			background: transparent;
			> view {
				background: white;
				box-shadow: 0rpx 10rpx 60rpx 2rpx rgba(197, 202, 213, 0.15);
				border-radius: 16rpx;
			}
		}
		.casket {
			padding: 0 32rpx;
		}
		.tit {
			padding: 30rpx 0;
			border-bottom: 2rpx solid #eeeeee;
		}
		.info-box {
			padding: 30rpx 0;
		}
		.refund-btn {
			width: 152rpx;
			height: 68rpx;
			line-height: 68rpx;
			background: #ffffff;
			border-radius: 8rpx;
			border: 2rpx solid #d5d5d5;
		}
		.cavimg {
			width: 398rpx;
			height: 398rpx;
			background: white;
		}
		.name {
			display: flex;
		}
		.event {
			padding: 15rpx 0;
		}
		.cover {
			width: 136rpx;
			height: 136rpx;
			border-radius: 8rpx;
		}
		.goods-pic {
			width: 164rpx;
			height: 164rpx;
			border-radius: 16rpx;
		}
		.goods-text {
			width: 0;
			height: 164rpx;
			color: #302929;
		}
		.reservation {
			padding: 24rpx 30rpx;
			.res-btn {
				width: 152rpx;
				height: 68rpx;
				line-height: 68rpx;
				background: #fe2b54;
				border-radius: 8rpx;
				color: white;
			}
		}
		.operate {
			width: 150rpx;
			margin: 0 30rpx;
			padding: 30rpx 0;
			text {
				font-size: 34rpx;
			}
		}
		.imbtn {
			border: 0;
			margin: 0 30rpx;
			padding: 30rpx 0;
			background: white;
			font-size: 28rpx;
			color: #333333;
			line-height: 1;
			&::after {
				display: none;
			}
		}
		.white-box {
			width: auto;
			background: white;
			border-radius: 24rpx;
			padding: 30rpx;
		}
		.g-shop-info {
			.iconimg {
				width: 88rpx;
				height: 88rpx;
				border-radius: 8rpx;
			}
			.goods-shop {
				min-height: 88rpx;
				flex: 1;
				.tag {
					background: #fee4d8;
					color: #fe5500;
					padding: 2rpx 4rpx;
				}
				flex-direction: column;
				align-items: flex-start;
				justify-content: space-between;
			}
			.addrs {
				line-height: 36rpx;
			}
		}
		.dotted {
			border-bottom: 2rpx #eeeeee dotted;
		}
	}
</style>
