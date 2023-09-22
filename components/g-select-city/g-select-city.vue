<template>
	<u-mask :show="show" :zoom="false" @click="show = false" :duration="0">
		<view class="mask-slot">
			<view class="picker-view">
				<picker-view class="picker-box" indicator-class="indicator" immediate-change @change="changeView" :value="chooseArr">
					<picker-view-column @touchstart="touchProvince">
						<view class="item" v-for="(item, index) in provinceList" :key="index">{{ item }}</view>
					</picker-view-column>
					<picker-view-column @touchstart="touchCity">
						<view class="item" v-for="(item, index) in cityList" :key="index">{{ item }}</view>
					</picker-view-column>
				</picker-view>
				<view class="btn-box u-flex u-row-between">
					<view class="btn" @tap="reset">查看全部</view>
					<view class="btn" :class="{ active: !btnLoading }" @tap="confirm">确认</view>
				</view>
			</view>
		</view>
	</u-mask>
</template>
<script>
	import { AjaxApi } from '@/utils/api'
	export default {
		data() {
			return {
				show: false,
				ifGetCity: true,
				btnLoading: false,
				chooseArr: [0, 0],
				cityList: [],
				provinceList: []
			}
		},
		watch: {},
		mounted() {},
		methods: {
			init() {
				this.chooseArr = [0, 0]
				this.ifGetCity = true
				this.btnLoading = false
				uni.showLoading({
					title: '加载中',
					mask: true
				})
				this.getProvinceList()
			},
			getProvinceList() {
				this.btnLoading = true
				let successFuc = res => {
					this.btnLoading = false
					uni.hideLoading()
					if (!res.data) return
					this.provinceList = res.data.map(it => it.province)
					this.getCityList(res.data[0].province)
				}
				AjaxApi(
					'GetProvinceList',
					{
						userLatitude: getApp().globalData.location.latitude * 1,
						userLongitude: getApp().globalData.location.longitude * 1
					},
					successFuc
				)
			},
			getCityList(province) {
				this.btnLoading = true
				let successFuc = res => {
					this.btnLoading = false
					uni.hideLoading()
					if (!res.data) return
					this.cityList = res.data.map(it => it.city)
					this.chooseArr[1] = 0
					this.show = true
				}
				AjaxApi(
					'GetProvinceCityList',
					{
						province: province,
						userLatitude: getApp().globalData.location.latitude * 1,
						userLongitude: getApp().globalData.location.longitude * 1
					},
					successFuc
				)
			},
			touchProvince() {
				this.btnLoading = true
			},
			touchCity() {
				this.ifGetCity = false
			},
			changeView(e) {
				this.chooseArr = e.detail.value
				if (this.ifGetCity) this.getCityList(this.provinceList[e.detail.value[0]])
				this.ifGetCity = true
			},
			reset() {
				this.show = false
				this.$parent.cityCode = ''
				this.$parent.init(true)
			},
			confirm() {
				if (this.btnLoading) return
				this.show = false
				this.$parent.cityCode = this.cityList[this.chooseArr[1]]
				this.$parent.init(true)
			}
		}
	}
</script>
<style lang="scss" scoped>
	/deep/ .mask-slot {
		width: 100vw;
		height: 100vh;
		padding: 0 16rpx 78rpx;
		display: flex;
		flex-direction: column;
		justify-content: flex-end;
		.picker-view {
			width: 100%;
			height: 564rpx;
			padding: 0 30rpx;
			background: #ffffff;
			border-radius: 26rpx;
			.picker-box {
				height: 424rpx;
			}
			.btn-box {
				.btn {
					width: 320rpx;
					height: 80rpx;
					line-height: 80rpx;
					text-align: center;
					background: #ffffff;
					border-radius: 36rpx;
					border: 2rpx solid #ebeced;
					font-size: 28rpx;
					color: #252627;
					&.active {
						background: #fe2b54;
						border: none;
						color: #ffffff;
					}
				}
			}
		}
		.indicator {
			color: red;
			height: 104rpx;
		}
		.item {
			line-height: 104rpx;
			font-size: 32rpx;
			color: #212223;
			text-align: center;
		}
	}
</style>
