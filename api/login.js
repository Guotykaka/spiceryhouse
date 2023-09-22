import { axiosGet, axiosPost, axiosPostJson } from '@/utils/api'
import { URL } from '@/utils/api'

//Auth
export function authUrl(query) {
	return axiosPost(`${URL}/biz/weixin/wxuser/auth`, { ...query, userType: 'customer', clientType: 'weixin' })
}
//账号密码登录
export function loginByPhone(query = { password: '', phone: '', token: '' }) {
	return axiosPost(`${URL}/biz/weixin/wxuser/loginByPhone`, query)
}
//抖音登录
export function getUserPhone(query = { password: '', phone: '', token: '' }) {
	return axiosPost(`${URL}/biz/weixin/douyinUser/getPhoneNumber`, query)
}
//获取验证码
export function getLoginMsgCode(query) {
	return axiosGet(`${URL}/biz/weixin/wxuser/getLoginMsgCode`, query)
}
//验证码手机号登录
export function loginByPhoneAndCode(query) {
	return axiosPost(`${URL}/biz/weixin/wxuser/loginByPhoneAndCode`, query)
}
export function queryUserInfo(query) {
	//查询用户
	return axiosGet(`${URL}/biz/weixin/wxuser/userInfo`, query)
}
export function updateUser(query) {
	return axiosPostJson(`${URL}/biz/weixin/wxuser/updateUser`, query)
}
