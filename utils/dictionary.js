/**
 * 全局设置
 */
import { AjaxApi } from '@/utils/api'
const Mixins = {
	data() {
		return {
			// 店铺状态,0:休息中,1:营业中,2:暂停营业,3:关闭
			shopStatus: {
				0: '休息中',
				1: '营业中',
				2: '休息中',
				3: '关闭'
			},
			orderStatus: {
				// 1待使用,2:已完成,6已退款
				0: '待支付',
				1: '待使用',
				2: '已核销',
				6: '已退款'
			},
			statusColor: {
				//0:待确认,1:已预约,2:已完成
				0: 'orange',
				1: 'yellow',
				2: 'green'
			},
			week: [
				// {
				// 	date: '2023-04-06',
				// 	dateMsg: '04-06',
				// 	weekMsg: '今天'
				// }
			],
			times: [
				// {
				// actualTime: "16:45:00",
				// status: 0,
				//1 禁用 0 可用
				// time: "16:45:00",
				// timeMsg: "16:45",
				// }
			],
			reserveDate: '',
			reserveTime: '',
			errText: '',
			timeIndex: 0,
			dateIndex: 0
		}
	},
	methods: {
		getReserveDate() {
			let params = {
				shopId: getApp().globalData.currentShopId
			}
			let successFuc = res => {
				this.errText = ''
				uni.hideLoading()
				this.week = res.data || []
				this.reserveDate = this.week[0]?.date ?? ''
				this.reserveTime = ''
				this.dateIndex = 0
				this.getReserveTime()
			}
			let elseFuc = res => {
				uni.hideLoading()
				this.week = []
				this.reserveDate = ''
				this.reserveTime = ''
				this.dateIndex = 0
				if (res.code == 499) {
					this.errText = res.msg
				} else {
					this.errText = ''
				}
			}
			AjaxApi('GetReserveDate', params, successFuc, elseFuc)
		},
		getReserveTime() {
			let params = {
				shopId: getApp().globalData.currentShopId,
				date: this.reserveDate
			}
			let successFuc = res => {
				uni.hideLoading()
				this.times = res.data || []
				this.reserveTime = this.times.filter(it => !it.status)[0]?.time ?? ''
				this.timeIndex = this.times.findIndex(it => it.status == 0)
			}
			AjaxApi('GetReserveTime', params, successFuc)
		}
	},
	filters: {
		filTime: value => {
			return value?.slice(0, 16) ?? ''
		}
	}
}

export default Mixins
