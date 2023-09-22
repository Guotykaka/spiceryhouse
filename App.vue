<script>
	import { AjaxApi } from '@/utils/api'
	import { getPrivacySetting } from '@/utils'
	export default {
		data() {
			return {
				getToken: ''
			}
		},
		globalData: {
			resolvePrivacyAuthorization: () => {},
			needAuthorization: false, //用户隐私许可
			privacyContractName: '', //隐私许可
			locationPermission: false, //用户位置许可
			fast: false,
			UserInfo: {
				phone: null
			},
			currentShopId: 0,
			previewImage: false, //是否因预览照片触发hide
			location: {
				latitude: 0, //纬度
				longitude: 0 //经度
			},
			tabNum: 0
		},
		onLaunch: function () {
			const { statusBarHeight, platform } = uni.getSystemInfoSync()
			const { top, height } = uni.getMenuButtonBoundingClientRect()
			// 状态栏高度
			uni.setStorageSync('statusBarHeight', statusBarHeight)
			// 判断胶囊按钮信息是否成功获取
			if (top && top !== 0 && height && height !== 0) {
				const navigationBarHeight = (top - statusBarHeight) * 2 + height
				// 导航栏高度
				uni.setStorageSync('navigationBarHeight', navigationBarHeight)
			} else {
				uni.setStorageSync('navigationBarHeight', platform === 'android' ? 48 : 40)
			}
			// 保持屏幕常亮
			uni.setKeepScreenOn({
				keepScreenOn: true
			})
			this.onLogin()
			if (wx.onNeedPrivacyAuthorization) {
				wx.onNeedPrivacyAuthorization(resolve => {
					console.log('隐私触发')
					this.globalData.resolvePrivacyAuthorization = resolve
					getPrivacySetting()
				})
			}
		},
		onShow: function () {
			this.autoUpdate()
		},
		onHide: function () {},
		methods: {
			autoUpdate: function () {
				var self = this
				// 获取小程序更新机制兼容
				if (uni.canIUse('getUpdateManager')) {
					const updateManager = uni.getUpdateManager()
					//1. 检查小程序是否有新版本发布
					updateManager.onCheckForUpdate(function (res) {
						// 请求完新版本信息的回调
						if (res.hasUpdate) {
							//检测到新版本，需要更新，给出提示
							uni.showModal({
								title: '更新提示',
								content: '检测到新版本，是否下载新版本并重启小程序？',
								success: function (res) {
									if (res.confirm) {
										//2. 用户确定下载更新小程序，小程序下载及更新静默进行
										self.downLoadAndUpdate(updateManager)
									} else if (res.cancel) {
										//用户点击取消按钮的处理，如果需要强制更新，则给出二次弹窗，如果不需要，则这里的代码都可以删掉了
										uni.showModal({
											title: '温馨提示',
											content: '本次版本更新涉及到新的功能添加，旧版本无法正常访问',
											showCancel: false, //隐藏取消按钮
											confirmText: '确定更新', //只保留确定更新按钮
											success: function (res) {
												if (res.confirm) {
													//下载新版本，并重新应用
													self.downLoadAndUpdate(updateManager)
												}
											}
										})
									}
								}
							})
						}
					})
				} else {
					// 如果希望用户在最新版本的客户端上体验您的小程序，可以这样子提示
					uni.showModal({
						title: '提示',
						content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
					})
				}
			},
			/**
			 * 下载小程序新版本并重启应用
			 */
			downLoadAndUpdate: function (updateManager) {
				var self = this
				uni.showLoading()
				//静默下载更新小程序新版本
				updateManager.onUpdateReady(function () {
					uni.hideLoading()
					//新的版本已经下载好，调用 applyUpdate 应用新版本并重启
					updateManager.applyUpdate()
				})
				updateManager.onUpdateFailed(function () {
					// 新的版本下载失败
					uni.showModal({
						title: '已经有新版本',
						content: '新版本已经上线啦，请您删除当前小程序，重新搜索打开'
					})
				})
			},
			onLogin(...args) {
				// 登录
				const that = this
				uni.login({
					success: function (res) {
						let successFuc = res => {
							getPrivacySetting()
							that.getToken = res.data.token
							uni.setStorageSync('token', that.getToken)
							that.setUserInfo()
						}
						let params = {
							code: res.code
						}
						let elseFuc = () => {
							that.globalData.fast = true
						}
						AjaxApi('AuthUrl', params, successFuc, elseFuc)
					},
					fail(err) {
						console.log('wx.login登录失败', err)
						that.globalData.fast = true
						if (getApp().employIdCallback) {
							getApp().employIdCallback()
						}
					}
				})
			},
			setUserInfo() {
				const that = this
				let successFuc = res => {
					this.globalData.wxPublicNumberAppid = res.data.wxPublicNumberAppid
					this.globalData.UserInfo = res.data
					uni.getSystemInfo({
						success: function (res) {
							that.globalData.statusBarHeight = res.statusBarHeight
							that.globalData.fast = true
							if (getApp().employIdCallback) {
								getApp().employIdCallback()
							}
							// if (getObjType(getApp().globalData.UserInfo.phone) == 'null') {
							// 	uni.reLaunch({
							// 		url: '/pagesLogin/login/login'
							// 	})
							// 	return
							// }
						}
					})
				}
				AjaxApi('QueryUserInfo', {}, successFuc)
			},
			watch(method, istr) {
				var obj = this.globalData
				let temporaryVar
				Object.defineProperty(obj, istr, {
					configurable: true,
					enumerable: true,
					set: function (value) {
						temporaryVar = value
						method(value)
					},
					get: function (value) {
						return temporaryVar
					}
				})
			}
		}
	}
</script>

<style lang="scss">
	/* 注意要写在第一行，同时给style标签加入lang="scss"属性 */
	@import 'uview-ui/index.scss';

	/* 解决头条小程序组件内引入字体不生效的问题 */
	/* #ifdef MP-TOUTIAO */
	@font-face {
		font-family: uniicons;
		src: url('/static/uni.ttf');
	}

	/* #endif */

	@import '/common/common.scss';
	@keyframes dropdown {
		0% {
			transform: translateY(-150rpx);
			-ms-transform: translateY(-150rpx);
			-webkit-transform: translateY(-150rpx);
		}
		100% {
			transform: translateY(120vh);
			-ms-transform: translateY(120vh);
			-webkit-transform: translateY(120vh);
		}
	}
</style>
