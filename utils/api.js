// import i18n from "@/main";
import store from '@/store'
import { getToken, getObjType, onLogin } from '@/utils'
// import qs from "qs";
const service = {
	get: (url, params, header) => {
		return uni.request({
			url: url, //仅为示例，并非真实接口地址。
			data: params,
			header
		})
	},
	post: (url, params, header) => {
		return uni.request({
			url: url, //仅为示例，并非真实接口地址。
			data: params,
			method: 'POST',
			header
		})
	}
}
export async function axiosPost(url, params) {
	try {
		let token = getToken()
		let [error, res] = await service.post(url, params, {
			'content-type': 'application/x-www-form-urlencoded',
			token: token ? token : 'f356aebba6cec92c53f5bf7f38de7ef5'
		})
		if (res.statusCode !== 200) {
			console.error('🚀', url, res)
			return {
				code: 99999,
				data: {},
				message: res?.data?.msg ?? ''
			}
		} else if (getObjType(res?.data) === 'object') {
			return res.data
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
export async function axiosPostJson(url, params, header = {}) {
	try {
		let token = getToken()
		let [error, res] = await service.post(url, params, {
			'content-type': 'application/json;charset=UTF-8',
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
			return res.data
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
export async function axiosGet(url, _params, header = {}) {
	try {
		let token = getToken()
		let [error, res] = await service.get(url, _params, {
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
			return res.data
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
export default service
export const CODE_OK = [0, 81203] //后台接口数据返回正常时的状态码
export const SHARE_URL = '' //分享使用的封面图片

// 正式环境;
// "appid" : "wx4a7405ea1259af05",
export const URL = 'https://api.guobi.com.cn' //
//测试环境
// "appid" : "wx4a7405ea1259af05",
// export const URL = 'https://testfxsjapi.whxiaoshi.com' //

export function PromiseAll(
	proarr,
	thenFuc,
	catchFuc = err => {
		console.log('PromiseAllErr', err)
		return { data: {} }
	}
) {
	Promise.all(
		proarr.map(p =>
			p.catch(e => {
				console.log(e)
				catchFuc(e)
			})
		)
	)
		.then(res => {
			const errList = res.map(ele => ele.message)
			const codeList = res.map(ele => ele.code)
			const inx = codeList.findIndex(ele => ele === 1001)
			const err = codeList.findIndex(ele => ele === 99999)
			uni.hideLoading()
			if (inx !== -1) {
				uni.login({
					success: function (res) {
						let params = {
							code: res.code
						}
						let successFuc = res => {
							uni.setStorageSync('token', res.data.token)
							catchFuc(1001)
						}
						AjaxApi('AuthUrl', params, successFuc)
					},
					fail: function (res) {
						console.log(res)
					}
				})
				return
			} else if (err !== -1) {
				let pages = getCurrentPages()
				let prevPage = pages[pages.length - 1]
				if (prevPage?.$vm?.loadingMask) prevPage.$vm.loadingMask = false
				uni.showToast({
					title: errList + '',
					icon: 'none',
					duration: 2000,
					success: () => {
						setTimeout(function () {
							thenFuc(res)
						}, 2000)
					}
				})
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
export function AjaxApi(
	api,
	params,
	successFuc,
	elseFuc = (err = { code: 2001, data: [], msg: 'Error!' }) => {
		console.log(err)
	}
) {
	//公共axios方法`
	store
		.dispatch(api, params)
		.then(res => {
			const OK = CODE_OK.findIndex(element => element === res.code)
			uni.hideLoading()
			if (OK !== -1) {
				successFuc(res)
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
			} else if (res.code === 1) {
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
			} else if (res.code === 10010) {
				elseFuc(res)
			} else if (res.code === 10020001) {
				elseFuc(res)
			} else if (res.code === 499) {
				// GetReserveDate
				elseFuc(res)
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
