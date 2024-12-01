import axios from 'axios';
import request from '@/utils/request'

// 获取环境变量中的 API 地址
const api = import.meta.env.VITE_API_URL;
export default {

  //

  
  webNxDisGetTodayOrderCustomer(data) {
      return request({
          url: 'api/nxdepartmentorders/webNxDisGetTodayOrderCustomer/'+ data,
          method: 'get',
      })
  },

  webNxDisGetTodayReturnCustomer(data) {
      return request({
          url: 'api/nxdepartmentorders/webNxDisGetTodayReturnCustomer/'+ data,
          method: 'get',
      })
  },


  /**
   * 保存出货部门
   */
  disGetToFillDepOrders(data) {
      return request({
          url: 'api/nxdepartmentorders/printerGetPrintOrders',
          method: 'post',
          data
      })
  },

  disGetToFillDepOrdersReturn(data) {
      return request({
          url: 'api/nxdepartmentorders/getToFillDepOrdersReturn',
          method: 'post',
          data
      })
  },

  webGetOrderPageSubDep(data) {
      return request({
          url: 'api/nxdepartmentorders/webGetSubDepOrderPageSubDep',
          method: 'post',
          data
      })
  },
  webGetOrderPageSubDepRetrun(data) {
      return request({
          url: 'api/nxdepartmentorders/webGetSubDepOrderPageSubDepReturn',
          method: 'post',
          data
      })
  },

  webGetOrderPage(data) {
      return request({
          url: 'api/nxdepartmentorders/webGetSubDepOrderPage',
          method: 'post',
          data
      })
  },


  webGetOrderPageReturn(data) {
      return request({
          url: 'api/nxdepartmentorders/webGetSubDepOrderPageReturn',
          method: 'post',
          data
      })
  },
  //

  saveToFillPriceOrder(data) {
      return request({
          url: 'api/nxdepartmentorders/giveOrderPrice',
          method: 'post',
          data
      })
  },

  giveOrderWeight(data) {
      return request({
          url: 'api/nxdepartmentorders/giveOrderWeight',
          method: 'post',
          data
      })
  },

  saveAccountBill(data) {
      return request({
          url: 'api/nxdepartmentbill/saveAccountBillPrinter',
          method: 'post',
          data
      })
  },


  saveAccountReturnBill(data) {
      return request({
          url: 'api/nxdepartmentbill/saveAccountReturnBill',
          method: 'post',
          data
      })
  },




  checkLoginStatus(data) {
    return axios({
      url: `${api}/nxdistributeruser/checkLoginStatus/${data}`,  // 确保这里拼接正确
      method: 'get',
    });
  },

  
  


};