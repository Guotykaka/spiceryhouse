<template>
	<!-- 我的 -->
	<view class="container">
		<view class="nav" :style="{ 'padding-top': `${lineHeight}px` }">
			<view class="title">我的</view>
			<view class="user">
				<button class="g-button" plain open-type="chooseAvatar" @chooseavatar="wxChooseAvatar">
					<image class="avatar" :src="userInfo.avatarUrl || `../../static/img/avatar.png`" mode="aspectFill"></image>
				</button>
				<view class="info">
					<view>
						<view class="name u-line-2" @tap="nameInt">{{ userInfo.wxNickName || '匿名' }}</view>
					</view>
					<button class="g-button" v-if="!userInfo.phone" open-type="getPhoneNumber" @getphonenumber="getPhoneNumber" plain>
						<view class="phone u-m-t-12">点击获取手机号</view>
					</button>
					<view class="phone u-m-t-12" v-else> {{ userInfo.phone }} </view>
				</view>
			</view>
		</view>
		<view class="last">
			<button open-type="contact" class="g-button" plain="true">
				<view class="im">
					<text><text class="iconfont icon--kefu u-m-r-16"></text>联系客服</text>
					<text class="iconfont icon-arrow-right" style="color: #d5d5d5"></text>
				</view>
			</button>
		</view>
		<u-modal v-model="nameint" title="修改昵称" :title-style="{ color: '#fe2b54' }" confirm-color="#fe2b54" show-cancel-button @confirm="changeName">
			<view class="slot-content">
				<input :value="userInfo.wxNickName" placeholder="请填写您的昵称" type="nickname" confirm-type="done" inputmode="text" @input="blurName" />
			</view>
		</u-modal>
		<privacy-setting v-if="showprivacy"></privacy-setting>
	</view>
</template>
<script>
	import store from '@/store'
	import { AjaxApi, SHARE_URL } from '@/utils/api'
	import { appInit, wxChooseAvatar, getPrivacySetting } from '@/utils'
	export default {
		data() {
			return {
				showprivacy: false,
				lineHeight: uni.getStorageSync('statusBarHeight'),
				userInfo: {
					wxNickName: '',
					phone: '',
					avatarUrl: ''
				},
				nickName: '',
				nameint: false
			}
		},
		computed: {},
		onShow() {
			this.showprivacy = true
			let fuc = () => {
				this.userInfo = { ...this.userInfo, ...getApp().globalData.UserInfo }
			}
			appInit(fuc)
		},
		onHide() {
			this.showprivacy = false
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
			nameInt() {
				getPrivacySetting()
				this.nickName = this.userInfo.wxNickName
				this.nameint = true
			},
			wxChooseAvatar(e) {
				wxChooseAvatar(e)
			},
			blurName(e) {
				const { value } = e.detail
				this.nickName = value
			},
			async changeName() {
				await store.dispatch('UpdateUser', {
					userId: getApp().globalData.UserInfo.userId,
					wxNickName: this.nickName
				})
				let user = await store.dispatch('QueryUserInfo', {})
				getApp().globalData.UserInfo = user.data
				this.userInfo = { ...this.userInfo, ...getApp().globalData.UserInfo }
			},
			// 手机号码授权
			getPhoneNumber(e) {
				if (e.detail.encryptedData && e.detail.iv) {
					let params = {
						encryptedData: e.detail.encryptedData,
						iv: e.detail.iv
					}
					let successFuc = async () => {
						let user = await store.dispatch('QueryUserInfo', {})
						getApp().globalData.UserInfo = user.data
						this.userInfo = { ...this.userInfo, ...getApp().globalData.UserInfo }
					}
					AjaxApi('GetUserPhone', params, successFuc)
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.container {
		background: #f9fafb;
		height: 100vh;
		.nav {
			width: 100vw;
			height: 424rpx;
			background: linear-gradient(180deg, #fe2b54 0%, #ffaebe 100%);
			border-radius: 0rpx 0rpx 16rpx 16rpx;
			.title {
				text-align: center;
				font-size: 36rpx;
				line-height: 70rpx;
				color: #ffffff;
			}
			.user {
				display: flex;
				margin-top: 60rpx;
				padding: 0 40rpx;
				.avatar {
					width: 92rpx;
					height: 92rpx;
					background-color: #ffffff;
					margin-right: 20rpx;
					border-radius: 50%;
				}
				.info {
					.name {
						color: #353535;
						font-size: 32rpx;
						color: #ffffff;
					}
					.phone {
						font-size: 26rpx;
						color: rgba(255, 255, 255, 0.85);
					}
				}
			}
		}
	}
	.slot-content {
		padding: 20rpx 8rpx;
	}
	.g-button {
		border: red 2rpx transparent !important;
	}
	.last {
		display: flex;
		justify-content: center;
		margin-top: -60rpx;
	}
	.im {
		width: 710rpx;
		height: 112rpx;
		background: #ffffff;
		border-radius: 24rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
		font-size: 32rpx;
		color: #333333;
		padding: 0 40rpx;
	}
</style>
