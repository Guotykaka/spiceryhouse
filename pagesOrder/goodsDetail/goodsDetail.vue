<template>
	<!-- 团购详情 -->
	<view class="container">
		<view>
			<swiper
				class="swiper"
				circular
				:indicator-dots="goodsDetail.pic.length == 1 ? false : true"
				:autoplay="true"
				interval="3000"
				duration="300"
				indicator-color="rgba(255, 255, 255, 0.34)"
				indicator-active-color="#FFFFFF">
				<swiper-item v-if="goodsDetail.pic.length == 0">
					<view class="swiper-item">
						<image class="banner" src="../../static/img/default.png" mode="aspectFill"></image>
					</view>
				</swiper-item>
				<swiper-item v-else v-for="(item, i) in goodsDetail.pic" :key="i">
					<view class="swiper-item">
						<image class="banner" :src="`${item}`" mode="aspectFill"></image>
					</view>
				</swiper-item>
			</swiper>
		</view>
		<view class="info-box">
			<view class="white-box goods-padding">
				<view class="goods-name"> {{ goodsDetail.productName }} </view>
				<view class="goods-price u-m-t-30">
					<text class="f32">¥{{ goodsDetail.actualAmount }}</text>
					<text class="g-line-through c99 u-m-l-12">¥{{ goodsDetail.originAmount }}</text>
				</view>
			</view>
			<view class="white-box padding u-m-t-20">
				<view class="g-titile"> 套餐详情 </view>
				<view class="u-p-t-40">
					<view class="f32 u-m-b-20">深层清洁[限时优惠]</view>
					<view class="c66 u-flex u-row-between u-m-t-20" v-for="(item, i) in goodsDetail.list" :key="i">
						<view>{{ item.skuName }}</view>
						<view class="u-flex fs0">
							<view>× {{ item.count }}</view>
							<view class="u-text-right u-m-l-12" style="min-width: 98rpx">¥{{ item.originAmount }}</view>
						</view>
					</view>
				</view>
			</view>
			<view class="white-box padding u-m-t-20">
				<view class="g-titile"> 图文详情 </view>
				<view>
					<image class="imgs" :src="item" mode="widthFix" v-for="(item, i) in goodsDetail.detailPicList" :key="i"></image>
				</view>
			</view>
			<view class="white-box padding u-m-t-20">
				<view class="g-titile u-m-b-30">
					<view>适用门店({{ goodsDetail.shopCount }}家)</view>
					<view class="u-flex" @tap="toGoodsShops()">
						全部适用门店
						<text class="iconfont icon-arrow-right u-m-l-10" style="display: block; padding-top: 6rpx"></text>
					</view>
				</view>
				<view class="g-shop-info">
					<view class="u-flex u-row-between">
						<image class="iconimg u-m-r-16 fs0" :src="goodsDetail.buyShopDto.shopLogo || 'http://dc.guobi.com.cn/fxsj-oss/douyin/fxsj-logo.png'" mode="aspectFill"></image>
						<view class="u-flex goods-shop">
							<view class="u-line-2 f32">{{ goodsDetail.buyShopDto.shopName }}</view>
							<text class="f20 tag">离我最近</text>
						</view>
					</view>
					<view class="u-flex u-row-between u-m-t-12 u-m-b-16">
						<view class="c66 f24 addrs">
							<text class="iconfont icon-gps u-m-r-10"></text>
							{{ goodsDetail.buyShopDto.province }}{{ goodsDetail.buyShopDto.city }}{{ goodsDetail.buyShopDto.area }}{{ goodsDetail.buyShopDto.address }}
						</view>
						<view class="g-flex u-m-l-30">
							<view class="g-flex iconfont icon-location u-m-r-30" @tap="lookMap()"></view>
							<view class="g-flex iconfont icon-phone" @tap="phoneCall()" v-if="goodsDetail.buyShopDto.relationPhone"></view>
						</view>
					</view>
				</view>
			</view>
			<view class="white-box padding">
				<view class="g-titile"> 购买须知 </view>
				<view class="u-m-t-40">
					<view class="c66">·可用时间</view>
					<!-- 0:门店营业时间,1:自定义时间 -->
					<view class="u-m-t-8"> {{ goodsDetail.availableTimeType == 0 ? '营业时间均可使用' : goodsDetail.availableStartTime + '~' + goodsDetail.availableEndTime }} </view>
				</view>
				<view class="u-m-t-40">
					<view class="c66">·有效期</view>
					<view class="u-m-t-8"> 购买之日起{{ goodsDetail.validDays }}天内可用 </view>
				</view>
				<view class="u-m-t-40">
					<view class="c66">·限购政策</view>
					<view class="u-m-t-8"> 每个账户最多购买{{ goodsDetail.accountBuyLimit }}张，每笔订单限购{{ goodsDetail.orderBuyLimit }}张 </view>
				</view>
				<view class="u-m-t-40">
					<view class="c66">·预约规则</view>
					<!-- reserveTimeType: 0, //预约时间,0:提前预约,1:不需要预约,2:当天可预约 -->
					<view class="u-m-t-8" v-if="goodsDetail.reserveTimeType == 0"> 到店消费，需提前{{ goodsDetail.reserveTime }}天预约 </view>
					<view class="u-m-t-8" v-if="goodsDetail.reserveTimeType == 1"> 到店消费，不需要预约 </view>
					<view class="u-m-t-8" v-if="goodsDetail.reserveTimeType == 2"> 到店消费，当天可预约 </view>
				</view>
				<view class="u-m-t-40">
					<view class="c66">·使用规则</view>
					<!-- useScope: 0, //使用范围,0:全场通用 -->
					<view class="u-m-t-8"> 使用范围：{{ goodsDetail.useScope == 0 ? '全场通用' : '' }} </view>
					<view class="u-m-t-8"> 单次最多使用{{ goodsDetail.useCount }}张团购券 </view>
					<!-- discountsShare: 0, //是否与其它优惠同享 -->
					<view class="u-m-t-8"> 是否与其他优惠同享：{{ goodsDetail.discountsShare == 1 ? '可以' : '不可以' }} </view>
				</view>
				<view class="u-m-t-40">
					<view class="c66">·退款规则</view>
					<!-- applyRefund: 0, //申请退款,0:未使用随时退,1:审核通过后退款 -->
					<!-- expireRefund: 0, //过期退款,0:自动退款 -->
					<view class="u-m-t-8" v-if="goodsDetail.applyRefund == 0"> 未使用随时退{{ goodsDetail.expireRefund == 0 ? '、过期自动退' : '' }} </view>
					<view class="u-m-t-8" v-if="goodsDetail.applyRefund == 1"> 审核通过后退款{{ goodsDetail.expireRefund == 0 ? '、过期自动退' : '' }} </view>
				</view>
				<view class="u-m-t-40 u-m-b-20">
					<view class="c66">·核销方式</view>
					<view class="u-m-t-8"> 到店消费后，联系工作人员扫码核销 </view>
				</view>
			</view>
		</view>
		<view class="bottom u-flex u-row-between">
			<view class="goods-price">
				<text class="f32">¥{{ goodsDetail.actualAmount }}</text>
				<text class="g-line-through c99 u-m-l-12">¥{{ goodsDetail.originAmount }}</text>
			</view>
			<button class="g-button" open-type="getPhoneNumber" @getphonenumber="getPhoneNumber" v-if="!phone">
				<view class="btn f32 g-flex" @tap="doFuc">优惠购买</view>
			</button>
			<view v-else class="btn f32 g-flex" @tap="doFuc">优惠购买</view>
		</view>
		<privacy-setting v-if="showprivacy"></privacy-setting>
		<g-get-phone :show="showPhoneGet"></g-get-phone>
	</view>
</template>
<script>
	import store from '@/store'
	import { AjaxApi, SHARE_URL } from '@/utils/api'
	import { getTTLocation, paramConversion } from '@/utils'
	import gGetPhone from '@/components/g-get-phone/g-get-phone'

	export default {
		components: { gGetPhone },
		data() {
			return {
				goodsId: 0,
				showprivacy: false,
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
					listShop: null,
					shopCount: 0,
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
				showSetting: true,
				showPhoneGet: false,
				phone: ''
			}
		},
		onPageScroll(e) {},
		onLoad(query) {
			if (query?.q) {
				let link = paramConversion(decodeURIComponent(query?.q))
				this.goodsId = link?.goodsId ?? this.goodsId
			}
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
		onPullDownRefresh() {
			this.showprivacy = false
			uni.stopPullDownRefresh()
			let page = getCurrentPages().pop() //获取当前页面实例
			if (page == undefined || page == null) return
			this.showprivacy = true
			page.onLoad()
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
				this.phone = getApp().globalData.UserInfo?.phone ?? ''
				this.getGoods()
			},
			getGoods() {
				let successFuc = res => {
					this.goodsDetail = res.data ?? this.goodsDetail
					this.goodsDetail.pic = res.data?.pic.split(',')
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
			toShops() {
				uni.navigateTo({
					url: '/pagesShop/shopList/shopList'
				})
			},
			toGoodsShops() {
				uni.navigateTo({
					url: `/pagesShop/goodsShop/goodsShop?goodsId=${this.goodsId}`
				})
			},
			toPay() {
				uni.navigateTo({
					url: `/pagesOrder/confirmOrder/confirmOrder?goodsId=${this.goodsId}`
				})
			},
			lookMap() {
				let currentShop = this.goodsDetail.buyShopDto
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
			phoneCall() {
				const phoneNumber = this.goodsDetail.buyShopDto.relationPhone || ''
				uni.makePhoneCall({
					phoneNumber: phoneNumber
				})
			},
			closeMask() {
				this.showPhoneGet = false
			},
			doFuc() {
				this.closeMask()
				this.confirmShopInfo()
			},
			confirmShopInfo() {
				// this.$u.throttle(this.checkBeforeAddOrder, 3000)
				uni.navigateTo({
					url: `/pagesOrder/confirmOrder/confirmOrder?goodsId=${this.goodsId}`
				})
			},
			getPhoneNumber(e) {
				// 手机号码授权
				if (e.detail.encryptedData && e.detail.iv) {
					let params = {
						encryptedData: e.detail.encryptedData,
						iv: e.detail.iv
					}
					let successFuc = async () => {
						let user = await store.dispatch('QueryUserInfo', {})
						getApp().globalData.UserInfo = user.data
						this.phone = getApp().globalData.UserInfo?.phone ?? ''
						this.doFuc()
					}
					AjaxApi('GetUserPhone', params, successFuc)
				} else {
					this.doFuc()
				}
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
			}
		}
		.info-box {
			background: transparent;
			position: relative;
			top: -20rpx;
		}
		.banner {
			width: 100vw;
			height: 360rpx;
			vertical-align: bottom;
			background: white;
		}
		.imgs {
			width: 100%;
		}
		.goods-name {
			font-size: 40rpx;
		}
		.goods-padding {
			padding: 30rpx 40rpx;
		}
		.padding {
			padding: 30rpx;
		}
		.goods-price {
			> text {
				&:nth-of-type(1) {
					font-size: 48rpx;
					color: $uni-color-primary;
				}
				&:nth-of-type(2) {
					font-size: 28rpx;
				}
			}
		}
		.white-box {
			width: auto;
			background: white;
			border-radius: 24rpx;
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
	}
</style>
