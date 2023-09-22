import { axiosGet, axiosPost, axiosPostJson } from '@/utils/api'
import { URL } from '@/utils/api'

//查询店铺
export function getShopInfo(query) {
	return axiosGet(`${URL}/biz/weixin/shop/selectReserveShop`, query)
}
export function fetchShoreCityLite(query) {
	//门店城市列表
	return axiosGet(`${URL}/biz/weixin/shop/selectShopCityListByPosition`, query)
}

export function getStoreList(query) {
	//获取附近门店列表
	return axiosGet(`${URL}/biz/weixin/shop/selectLatestShop`, query)
}
export function getReserveDate(query) {
	return axiosGet(`${URL}/biz/weixin/shop/getReserveDate`, query)
}
export function getReserveTime(query) {
	return axiosGet(`${URL}/biz/weixin/shop/getReserveTime`, query)
}

export function getProvinceList(query) {
	//获取附近省份列表
	return axiosGet(`${URL}/biz/weixin/shop/selectProvinceList`, query)
}
export function getProvinceCityList(query) {
	//获取省份下城市列表
	return axiosGet(`${URL}/biz/weixin/shop/selectCityList`, query)
}
