import { authUrl, getLoginMsgCode, loginByPhoneAndCode, loginByPhone, getUserPhone, queryUserInfo, updateUser } from '@/api/login'
import {
	getOrderList,
	getRefundOrderList,
	getTicketInfo,
	getOrderDetail,
	getOrderDetailByOrderId,
	getReservationDetail,
	creatGoodsOrder,
	creatOrder,
	rejectOrder,
	refundOrder,
	payOrder
} from '@/api/order'
import { getGoodsList, getGoodsInfo, getGoodsShops } from '@/api/goods'
import { getShopInfo, fetchShoreCityLite, getStoreList, getReserveDate, getReserveTime, getProvinceList, getProvinceCityList } from '@/api/shop'
import { getToken, getObjType } from '@/utils'
import { URL } from '@/utils/api'
const account = {
	state: {},
	mutations: {},
	actions: {
		//Auth
		async AuthUrl({ dispatch, commit }, params) {
			let res = await authUrl(params)
			return res
		},
		//获取验证码
		async GetLoginMsgCode({ dispatch, commit }, params) {
			let res = await getLoginMsgCode(params)
			return res
		},
		//账号验证码登录
		async LoginByPhoneAndCode({ dispatch, commit }, params) {
			let res = await loginByPhoneAndCode(params)
			return res
		},
		//账号密码登录
		async LoginByPhone({ dispatch, commit }, params) {
			let res = await loginByPhone(params)
			return res
		},
		//微信登录
		async GetUserPhone({ dispatch, commit }, params) {
			let res = await getUserPhone(params)
			return res
		},
		//用户信息
		async QueryUserInfo({ dispatch, commit }, params) {
			let res = await queryUserInfo(params)
			return res
		},
		async UpdateUser({ dispatch, commit }, params) {
			let res = await updateUser(params)
			return res
		},
		async GetOrderList({ dispatch, commit }, params) {
			let res = await getOrderList(params)
			return res
		},
		async GetRefundOrderList({ dispatch, commit }, params) {
			let res = await getRefundOrderList(params)
			return res
		},
		async GetShopInfo({ dispatch, commit }, params) {
			let res = await getShopInfo(params)
			return res
		},
		async FetchShoreCityLite({ dispatch, commit }, params) {
			let res = await fetchShoreCityLite(params)
			return res
		},
		async GetStoreList({ dispatch, commit }, params) {
			let res = await getStoreList(params)
			return res
		},
		async GetTicketInfo({ dispatch, commit }, params) {
			let res = await getTicketInfo(params)
			return res
		},
		async GetOrderDetail({ dispatch, commit }, params) {
			let res = await getOrderDetail(params)
			return res
		},
		async GetOrderDetailByOrderId({ dispatch, commit }, params) {
			let res = await getOrderDetailByOrderId(params)
			return res
		},
		async GetReservationDetail({ dispatch, commit }, params) {
			let res = await getReservationDetail(params)
			return res
		},
		async CreatOrder({ dispatch, commit }, params) {
			let res = await creatOrder(params)
			return res
		},
		async CreatGoodsOrder({ dispatch, commit }, params) {
			let res = await creatGoodsOrder(params)
			return res
		},
		async RejectOrder({ dispatch, commit }, params) {
			let res = await rejectOrder(params)
			return res
		},
		async RefundOrder({ dispatch, commit }, params) {
			let res = await refundOrder(params)
			return res
		},
		async PayOrder({ dispatch, commit }, params) {
			let res = await payOrder(params)
			return res
		},
		async GetReserveTime({ dispatch, commit }, params) {
			let res = await getReserveTime(params)
			return res
		},
		async GetProvinceList({ dispatch, commit }, params) {
			let res = await getProvinceList(params)
			return res
		},
		async GetProvinceCityList({ dispatch, commit }, params) {
			let res = await getProvinceCityList(params)
			return res
		},
		async GetReserveDate({ dispatch, commit }, params) {
			let res = await getReserveDate(params)
			return res
		},
		async GetGoodsList({ dispatch, commit }, params) {
			let res = await getGoodsList(params)
			return res
		},
		async GetGoodsInfo({ dispatch, commit }, params) {
			let res = await getGoodsInfo(params)
			return res
		},
		async GetGoodsShops({ dispatch, commit }, params) {
			let res = await getGoodsShops(params)
			return res
		}
	}
}

export default account
