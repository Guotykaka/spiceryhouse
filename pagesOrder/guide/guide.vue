<template>
	<view class="container">
		<view class="f32 u-m-t-10 u-m-b-10">1、打开“抖音APP"，进入“芳香世家 抖音团购”， 点击“购买”</view>
		<image src="https://dc.guobi.com.cn/fxsj-oss/douyin/yuyue1.png" class="bnimg" mode="widthFix" />
		<view class="f32 u-m-t-10 u-m-b-10">2、点击券号后面的复制图标：<image src="../../static/img/copy.jpg" class="copy" mode="widthFix" /></view>
		<image src="https://dc.guobi.com.cn/fxsj-oss/douyin/yuyue2.png" class="bnimg" mode="widthFix" />
	</view>
</template>

<script>
	import { AjaxApi, PromiseAll, SHARE_URL } from '@/utils/api'
	import { onLogin, getToken } from '@/utils'
	export default {
		data() {
			return {}
		},
		onShareAppMessage: function (res) {
			return {
				title: '芳香世家购美',
				imageUrl: SHARE_URL,
				path: `/pages/index/index`
			}
		},
		methods: {}
	}
</script>

<style lang="scss" scoped>
	.container {
		min-height: 100vh;
		width: 100vw;
		background: #ffffff;
		padding: 20rpx;
		.copy {
			width: 32rpx;
			height: 32rpx;
			display: inline-block;
			margin-left: 6rpx;
			vertical-align: bottom;
		}
		.bnimg {
			width: 100%;
			vertical-align: bottom;
		}
	}
</style>
