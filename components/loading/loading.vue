<template>
	<view v-if="show" class="content" catchtouchmove="return false">
		<image class="load" src="../../static/img/loading.gif" mode="aspectFill"></image>
	</view>
</template>

<script>
	export default {
		name: 'loading',
		props: {
			show: {
				//是否显示
				type: Boolean,
				default: false
			}
		},
		data() {
			return {}
		},
		computed: {},
		mounted() {},
		watch: {},
		methods: {}
	}
</script>
<style lang="scss" scoped>
	.content {
		height: 100vh;
		position: absolute;
		top: 0;
		left: 0;
		width: 100vw;
		background: #00000050;
		z-index: 1;
		.load {
			width: 180rpx;
			height: 180rpx;
			position: absolute;
			top: 30vh;
			left: 50%;
			transform: translate(-50%, 0);
		}
	}
</style>
