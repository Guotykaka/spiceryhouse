import { axiosGet, axiosPost, axiosPostJson } from '@/utils/api'
import { URL } from '@/utils/api'

//订单列表 我的预约
export function getOrderList(query) {
	return axiosGet(`${URL}/biz/weixin/scOrderInfo/selectScOrderInfoByPage`, {
		...query,
		// 平台,0:抖音,1:快手,2:美团,3:微信,
		platform: 3
	})
}
//订单列表 退款列表
export function getRefundOrderList(query) {
	return axiosGet(`${URL}/biz/weixin/orderInfo/refund/list`, query)
}
//根据券号查询券详情
export function getTicketInfo(query) {
	return axiosPostJson(`${URL}/biz/weixin/scOrderInfo/verifyCouponCode`, {
		...query,
		// 平台,0:抖音,1:快手,2:美团,3:微信,
		platform: 3
	})
}
//订单详情(传短id)orderId
export function getOrderDetailByOrderId(query) {
	return axiosGet(`${URL}/biz/weixin/orderInfo/detail`, query)
}
//订单详情(传长id)outOrderId
export function getOrderDetail(query) {
	return axiosGet(`${URL}/biz/weixin/orderInfo/detail/outOrderId`, query)
}
//预约详情
export function getReservationDetail(query) {
	return axiosGet(`${URL}/biz/weixin/scOrderInfo/selectScOrderInfoById`, query)
}
//创建预约订单
export function creatOrder(query) {
	return axiosPostJson(`${URL}/biz/weixin/scOrderInfo/createReserveOrder`, {
		...query,
		// 平台,0:抖音,1:快手,2:美团,3:微信,
		platform: 3
	})
}
//取消订单
export function rejectOrder(query) {
	return axiosPostJson(`${URL}/biz/weixin/scOrderInfo/userCancelReserverOrder`, query)
}
//订单退款
export function refundOrder(query) {
	return axiosGet(`${URL}/biz/weixin/orderInfo/refund`, query)
}

//下单
export function creatGoodsOrder(query) {
	return axiosPostJson(`${URL}/biz/weixin/orderInfo`, query)
}
export function payOrder(query) {
	return axiosPostJson(`${URL}/biz/weixin/pay/order`, query)
}
