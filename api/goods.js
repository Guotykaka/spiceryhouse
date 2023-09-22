import { axiosGet, axiosPost, axiosPostJson } from '@/utils/api'
import { URL } from '@/utils/api'

export function getGoodsList(query) {
	return axiosGet(`${URL}/biz/weixin/productInfo/selectProductInfoList`, query)
}
export function getGoodsInfo(query) {
	return axiosGet(`${URL}/biz/weixin/productInfo/selectProductInfoById_01`, query)
}
export function getGoodsShops(query) {
	return axiosGet(`${URL}/biz/weixin/productInfo/selectAllShop`, query)
}
