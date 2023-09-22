<template>
	<!-- 预约时间 -->
	<view class="container">
		<view class="uni-calendar white-box" @touchmove.stop.prevent="clean">
			<view v-if="!insert" class="uni-calendar__mask" @click="clean"></view>
			<view v-if="insert" class="uni-calendar__content" :class="{ 'uni-calendar--fixed': !insert }">
				<view class="uni-calendar__header">
					<view class="uni-calendar__header-btn-box" @click="pre">
						<view class="uni-calendar__header-btn uni-calendar--left"></view>
					</view>
					<text class="uni-calendar__header-text">{{ (nowDate.year || '') + '年' + (nowDate.month || '') + '月' }}</text>
					<view class="uni-calendar__header-btn-box" @click="next">
						<view class="uni-calendar__header-btn uni-calendar--right"></view>
					</view>
				</view>
				<view class="uni-calendar__box">
					<view v-if="showMonth" class="uni-calendar__box-bg">
						<text class="uni-calendar__box-bg-text">{{ nowDate.month }}</text>
					</view>
					<view class="uni-calendar__weeks">
						<view class="uni-calendar__weeks-day">
							<text class="uni-calendar__weeks-day-text red">日</text>
						</view>
						<view class="uni-calendar__weeks-day">
							<text class="uni-calendar__weeks-day-text">一</text>
						</view>
						<view class="uni-calendar__weeks-day">
							<text class="uni-calendar__weeks-day-text">二</text>
						</view>
						<view class="uni-calendar__weeks-day">
							<text class="uni-calendar__weeks-day-text">三</text>
						</view>
						<view class="uni-calendar__weeks-day">
							<text class="uni-calendar__weeks-day-text">四</text>
						</view>
						<view class="uni-calendar__weeks-day">
							<text class="uni-calendar__weeks-day-text">五</text>
						</view>
						<view class="uni-calendar__weeks-day">
							<text class="uni-calendar__weeks-day-text red">六</text>
						</view>
					</view>
					<view class="uni-calendar__weeks" v-for="(item, weekIndex) in weeks" :key="weekIndex">
						<view class="uni-calendar__weeks-item" v-for="(weeks, weeksIndex) in item" :key="weeksIndex">
							<uni-calendar-item :weeks="weeks" :calendar="calendar" :selected="selected" :lunar="lunar" @change="choiceDate"></uni-calendar-item>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="white-box scroll u-m-t-20">
			<view class="f32">预约时间</view>
			<view class="time-box">
				<view :class="['time f32 g-flex c66', { active: timeIndex == i, gray: it.status == 1 }]" v-for="(it, i) in times" :key="i" @tap="clickTime(i)">
					{{ it.time }}
				</view>
			</view>
		</view>
		<view class="bottom u-flex u-row-between">
			<view class="f32">预约时间：{{ reserveDate }} {{ reserveTime }}</view>
			<view class="btn f32 g-flex" @tap="confirm">确定</view>
		</view>
	</view>
</template>

<script>
	import Calendar from './util.js'
	import uniCalendarItem from './uni-calendar-item.vue'
	import { AjaxApi } from '@/utils/api'
	export default {
		components: {
			uniCalendarItem
		},
		data() {
			return {
				date: '',
				startDate: '',
				endDate: '',
				range: false,
				insert: true,
				selected: [],
				lunar: false,
				showMonth: true,
				weeks: [],
				calendar: {},
				nowDate: ''
			}
		},
		watch: {
			selected(newVal) {
				this.cale.setSelectInfo(this.nowDate.fullDate, newVal)
				this.weeks = this.cale.weeks
			}
		},
		created() {},
		onLoad() {
			uni.showLoading({
				title: '加载中',
				mask: true
			})
			this.initDate()
		},
		methods: {
			// 取消穿透
			clean() {},
			initDate() {
				let params = {
					shopId: getApp().globalData.currentShopId
				}
				let successFuc = res => {
					uni.hideLoading()
					this.reserveDate = res.data?.[0]?.date ?? ''
					this.startDate = res.data?.[0]?.date ?? ''
					this.getReserveTime()
					// 获取日历方法实例
					this.cale = new Calendar({
						date: this.reserveDate,
						selected: this.selected,
						startDate: this.startDate,
						endDate: this.endDate,
						range: this.range
					})
					this.init(this.cale.date.fullDate)
				}
				AjaxApi('GetReserveDate', params, successFuc)
			},
			init(date) {
				this.weeks = this.cale.weeks
				this.nowDate = this.calendar = this.cale.getInfo(date)
			},
			change() {
				if (!this.insert) return
				this.timeIndex = 0
				this.reserveDate = this.calendar.fullDate
				this.dateIndex = this.getDays(this.startDate, this.calendar.fullDate)
				this.reserveTime = ''
				this.getReserveTime()
			},
			monthSwitch() {
				let { year, month } = this.nowDate
				this.$emit('monthSwitch', {
					year,
					month: Number(month)
				})
			},
			setEmit(name) {
				let { year, month, date, fullDate, lunar, extraInfo } = this.calendar
				this.$emit(name, {
					range: this.cale.multipleStatus,
					year,
					month,
					date,
					fulldate: fullDate,
					lunar,
					extraInfo: extraInfo || {}
				})
			},
			choiceDate(weeks) {
				if (weeks.disable) return
				this.calendar = weeks
				// 设置多选
				this.cale.setMultiple(this.calendar.fullDate)
				this.change()
			},
			backtoday() {
				this.cale.setDate(this.date)
				this.weeks = this.cale.weeks
				this.nowDate = this.calendar = this.cale.getInfo(this.date)
				this.change()
			},
			pre() {
				const preDate = this.cale.getDate(this.nowDate.fullDate, -1, 'month').fullDate
				this.setDate(preDate)
				this.monthSwitch()
			},
			next() {
				const nextDate = this.cale.getDate(this.nowDate.fullDate, +1, 'month').fullDate
				this.setDate(nextDate)
				this.monthSwitch()
			},
			setDate(date) {
				this.cale.setDate(date)
				this.weeks = this.cale.weeks
				this.nowDate = this.cale.getInfo(date)
			},
			clickTime(i) {
				if (this.times[i].status == 1) return
				this.timeIndex = i
				this.reserveTime = this.times[i].time
			},
			confirm() {
				let pages = getCurrentPages() //获取当前页面js里面的pages里的所有信息。
				let prevPage = pages[pages.length - 2]
				prevPage.$vm.reserveDate = this.reserveDate
				prevPage.$vm.reserveTime = this.reserveTime
				prevPage.$vm.times = this.times
				prevPage.$vm.timeIndex = this.timeIndex
				prevPage.$vm.dateIndex = this.dateIndex
				uni.navigateBack()
			},
			getDays(strDateStart, strDateEnd) {
				let strSeparator = '-'
				//日期分隔符   var oDate1;   var oDate2;
				let iDays
				let oDate1 = strDateStart.split(strSeparator)
				let oDate2 = strDateEnd.split(strSeparator)
				let strDateS = new Date(oDate1[0], oDate1[1] - 1, oDate1[2])
				let strDateE = new Date(oDate2[0], oDate2[1] - 1, oDate2[2])
				iDays = parseInt(Math.abs(strDateS - strDateE) / 1000 / 60 / 60 / 24)
				//把相差的毫秒数转换为天数
				return iDays
			}
		}
	}
</script>

<style lang="scss" scoped>
	.container {
		background: #f9fafb;
		min-height: 100vh;
		padding: 20rpx;
		padding-bottom: 160rpx;
	}
	.white-box {
		width: auto;
		background: white;
		border-radius: 16rpx;
		&.scroll {
			padding: 24rpx 0 24rpx 24rpx;
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
	.uni-calendar {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: column;
	}

	.uni-calendar__mask {
		position: fixed;
		bottom: 0;
		top: 0;
		left: 0;
		right: 0;
		background-color: rgba(0, 0, 0, 0.4);
		transition-property: opacity;
		transition-duration: 0.3s;
		opacity: 0;
		/* #ifndef APP-NVUE */
		z-index: 99;
		/* #endif */
	}

	.uni-calendar--mask-show {
		opacity: 1;
	}

	.uni-calendar--fixed {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		transition-property: transform;
		transition-duration: 0.3s;
		transform: translateY(460px);
		/* #ifndef APP-NVUE */
		z-index: 99;
		/* #endif */
	}

	.uni-calendar--ani-show {
		transform: translateY(0);
	}

	.uni-calendar__content {
		background-color: #fff;
	}

	.uni-calendar__header {
		position: relative;
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
		justify-content: center;
		align-items: center;
		height: 50px;
		border-bottom-color: #e5e5e5;
		border-bottom-style: solid;
		border-bottom-width: 1px;
	}

	.uni-calendar--fixed-top {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
		justify-content: space-between;
		border-top-color: #e5e5e5;
		border-top-style: solid;
		border-top-width: 1px;
	}

	.uni-calendar--fixed-width {
		width: 50px;
		/* padding: 0 15px;
 */
	}

	.uni-calendar__header-text {
		text-align: center;
		width: 100px;
		font-size: 32rpx;
		color: #333;
	}

	.uni-calendar__header-btn-box {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
		align-items: center;
		justify-content: center;
		width: 50px;
		height: 50px;
	}

	.uni-calendar__header-btn {
		width: 10px;
		height: 10px;
		border-left-color: #808080;
		border-left-style: solid;
		border-left-width: 2px;
		border-top-color: #555555;
		border-top-style: solid;
		border-top-width: 2px;
	}

	.uni-calendar--left {
		transform: rotate(-45deg);
	}

	.uni-calendar--right {
		transform: rotate(135deg);
	}

	.uni-calendar__weeks {
		position: relative;
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
	}

	.uni-calendar__weeks-item {
		flex: 1;
		width: 80rpx;
		height: 80rpx;
		box-sizing: border-box;
	}

	.uni-calendar__weeks-day {
		flex: 1;
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: column;
		justify-content: center;
		align-items: center;
		height: 45px;
		border-bottom-color: #f5f5f5;
		border-bottom-style: solid;
		border-bottom-width: 1px;
	}

	.uni-calendar__weeks-day-text {
		font-size: 28rpx;
	}

	.uni-calendar__box {
		position: relative;
	}

	.uni-calendar__box-bg {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		justify-content: center;
		align-items: center;
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
	}

	.uni-calendar__box-bg-text {
		font-size: 200px;
		font-weight: bold;
		color: #999;
		opacity: 0.1;
		text-align: center;
		/* #ifndef APP-NVUE */
		line-height: 1;
		/* #endif */
	}
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
</style>
