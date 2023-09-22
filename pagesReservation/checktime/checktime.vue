<template>
	<!-- 预约时间 -->
	<view class="container"> </view>
</template>
<script>
	import { AjaxApi, SHARE_URL } from '@/utils/api'
	export default {
		components: {},
		data() {
			return {}
		},
		onLoad(query) {},
		onPullDownRefresh() {
			uni.stopPullDownRefresh()
			this.currentShop.shopId = null
			let page = getCurrentPages().pop() //获取当前页面实例
			if (page == undefined || page == null) return
			page.onLoad()
		},
		onReachBottom(e) {},
		onPageScroll(e) {},
		onShareAppMessage: function (res) {
			return {
				title: '芳香世家购美',
				imageUrl: SHARE_URL,
				path: `/pages/index/index`
			}
		},
		computed: {},
		methods: {}
	}
</script>

<style lang="scss" scoped>
	.container {
		background: #f9fafb;
	}
</style>
