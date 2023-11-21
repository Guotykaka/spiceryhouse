import store from '@/store'
import { getToken, getObjType, onLogin } from '@/utils'
const urlList = ['scOrderInfo/userCancelReserverOrder']
// 正式环境;
// "appid" : "wx4a7405ea1259af05",
// export const URL = 'https://api.guobi.com.cn' //
//测试环境
// "appid" : "wx4a7405ea1259af05",
export const URL = 'https://testfxsjapi.whxiaoshi.com' //
const service = {
	get: (url, params, header) => {
		return uni.request({
			url: url,
			data: params,
			header
		})
	},
	post: (url, params, header) => {
		return uni.request({
			url: url,
			data: params,
			method: 'POST',
			header
		})
	}
}
const trycatch = async (key, url, params, header) => {
	try {
		let token = getToken()
		let type = ''
		switch (key) {
			case 'get':
				type = 'application/json;charset=UTF-8'
				break
			case 'post':
				type = 'application/x-www-form-urlencoded'
				break
			case 'postjson':
				type = 'application/json;charset=UTF-8'
				break

			default:
				break
		}
		let [error, res] = await service[key == 'get' ? 'get' : 'post'](url, params, {
			'content-type': type,
			token: token ? token : 'f356aebba6cec92c53f5bf7f38de7ef5',
			...header
		})
		if (res.statusCode !== 200) {
			console.error('🚀', url, res)
			return {
				code: 99999,
				data: {},
				message: res?.data?.msg ?? ''
			}
		} else if (getObjType(res?.data) === 'object') {
			let showModal = urlList.some(it => url.includes(it))
			if (showModal) {
				return { ...res.data, alert: true }
			} else {
				return res.data
			}
		} else {
			return res
		}
	} catch (error) {
		return {
			code: 99999,
			message: error
		}
	}
}
export async function axiosPost(url, params, header = {}) {
	return await trycatch('post', url, params, header)
}
export async function axiosPostJson(url, params, header = {}) {
	return await trycatch('postjson', url, params, header)
}
export async function axiosGet(url, params, header = {}) {
	return await trycatch('get', url, params, header)
}
export default service
export const SHARE_URL = '' //分享使用的封面图片

export function PromiseAll(
	arr,
	thenFuc,
	catchFuc = err => {
		console.log('PromiseAllErr', err)
		return { data: {} }
	}
) {
	Promise.all(
		arr.map(p =>
			p.catch(e => {
				console.log(e)
				catchFuc(e)
			})
		)
	)
		.then(res => {
			const codeList = res.map(ele => ele.code)
			const expire = codeList.some(ele => ele === 1001)
			uni.hideLoading()
			if (expire) {
				onLogin()
			} else {
				thenFuc(res)
			}
		})
		.catch(err => {
			uni.hideLoading()
			catchFuc(err)
			return { data: {} }
		})
}
export const CODE_OK = [0]
export const CODE_NO = [499]
export function AjaxApi(
	api,
	params,
	successFuc,
	elseFuc = (err = { code: 2001, data: [], msg: '错误!' }) => {
		console.log(err)
	}
) {
	//公共axios方法`
	store
		.dispatch(api, params)
		.then(res => {
			const OK = CODE_OK.some(element => element === res.code)
			const NO = CODE_NO.some(element => element === res.code)
			uni.hideLoading()
			if (OK) {
				successFuc(res)
			} else if (NO) {
				// shop/getReserveDate
				elseFuc(res)
			} else if (res.code === 1) {
				if (res?.alert) {
					uni.showModal({
						title: '提示',
						content: res.msg,
						showCancel: false,
						confirmColor: '#fe2b54',
						success: function (res) {
							elseFuc(res)
						}
					})
				} else {
					uni.showToast({
						title: res.msg + '',
						icon: 'none',
						mask: true,
						duration: 2000,
						success: () => {
							setTimeout(function () {
								elseFuc(res)
							}, 2000)
						}
					})
				}
			} else if (res.code === 1001) {
				uni.showToast({
					title: 'Token失效！',
					icon: 'none',
					mask: true,
					duration: 2000,
					success: () => {
						setTimeout(function () {
							onLogin()
						}, 2000)
					}
				})
			} else if (res.code === 99999) {
				uni.showToast({
					title: `${res.message ? res.message : '网络错误!！'}`,
					icon: 'none',
					mask: true,
					duration: 2000,
					success: () => {
						setTimeout(function () {
							elseFuc(res)
						}, 2000)
					}
				})
			} else {
				uni.showToast({
					title: res.msg,
					icon: 'none',
					mask: true,
					duration: 2000,
					success: () => {
						setTimeout(function () {
							elseFuc(res)
						}, 2000)
					}
				})
			}
			let pages = getCurrentPages()
			let prevPage = pages[pages.length - 1]
			if (prevPage?.$vm?.loadingMask) prevPage.$vm.loadingMask = false
		})
		.catch(error => {
			uni.hideLoading()
			console.log(error)
		})
}
