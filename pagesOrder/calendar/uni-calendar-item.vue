<template>
	<view
		class="uni-calendar-item__weeks-box"
		:class="{
			'uni-calendar-item--disable': weeks.disable,
			'uni-calendar-item--isDay uni-calendar-item--isDay-text': calendar.fullDate === weeks.fullDate && weeks.isDay,
			'uni-calendar-item--checked': calendar.fullDate === weeks.fullDate && !weeks.isDay,
			'uni-calendar-item--multiple': weeks.multiple
		}"
		@click="choiceDate(weeks)">
		<view class="uni-calendar-item__weeks-box-item">
			<text v-if="selected && weeks.extraInfo" class="uni-calendar-item__weeks-box-circle"></text>
			<text
				class="uni-calendar-item__weeks-box-text"
				:class="{
					'uni-calendar-item--multiple': weeks.multiple,
					'uni-calendar-item--disable': weeks.disable
				}"
				>{{ weeks.date }}</text
			>
			<text
				v-if="weeks.extraInfo && weeks.extraInfo.info"
				class="uni-calendar-item__weeks-lunar-text"
				:class="{
					'uni-calendar-item--extra': weeks.extraInfo.info,
					'uni-calendar-item--multiple': weeks.multiple,
					'uni-calendar-item--disable': weeks.disable
				}"
				>{{ weeks.extraInfo.info }}</text
			>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			weeks: {
				type: Object,
				default() {
					return {}
				}
			},
			calendar: {
				type: Object,
				default: () => {
					return {}
				}
			},
			selected: {
				type: Array,
				default: () => {
					return []
				}
			},
			lunar: {
				type: Boolean,
				default: false
			}
		},
		methods: {
			choiceDate(weeks) {
				this.$emit('change', weeks)
			}
		}
	}
</script>

<style lang="scss" scoped>
	.uni-calendar-item__weeks-box {
		flex: 1;
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}

	.uni-calendar-item__weeks-box-text {
		font-size: 28rpx;
	}

	.uni-calendar-item__weeks-lunar-text {
		font-size: 24rpx;
	}

	.uni-calendar-item__weeks-box-item {
		position: relative;
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: column;
		justify-content: center;
		align-items: center;
		width: 80rpx;
		height: 80rpx;
		box-sizing: border-box;
	}

	.uni-calendar-item__weeks-box-circle {
		position: absolute;
		top: 5px;
		right: 5px;
		width: 8px;
		height: 8px;
		border-radius: 8px;
		background-color: $uni-color-primary;
	}

	.uni-calendar-item--disable {
		color: #d5d5d5;
	}

	.uni-calendar-item--isDay-text {
		color: $uni-color-primary;
	}

	.uni-calendar-item--isDay {
		background: rgba(254, 43, 84, 0.1);
		border-radius: 8rpx;
		border: 2rpx solid $uni-color-primary;
		color: $uni-color-primary;
	}

	.uni-calendar-item--extra {
		color: $uni-color-primary;
		opacity: 0.8;
	}

	.uni-calendar-item--checked {
		background: rgba(254, 43, 84, 0.1);
		border-radius: 8rpx;
		border: 2rpx solid $uni-color-primary;
		color: $uni-color-primary;
	}

	.uni-calendar-item--multiple {
		background: rgba(254, 43, 84, 0.1);
		border-radius: 8rpx;
		border: 2rpx solid $uni-color-primary;
		color: $uni-color-primary;
	}
</style>
