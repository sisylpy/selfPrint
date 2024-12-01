// 一些全局的config配置
const modeUrlObj = {
  // 生产环境
  'production': {
    baseURL: 'https://grainservice.club:8445/nongxinle/',
    baseURLIMG: 'https://grainservice.club:8445/nongxinle/captcha.jpg',
    authBaseURL: ''
  },
  // 开发环境
  'development': {
    baseURL: 'https://grainservice.club:8445/nongxinle/',
    // baseURL: 'https://grainservice.club:8443/nongxinle/',
    // baseURLIMG: 'https://grainservice.club:8443/nongxinle/captcha.jpg',
    authBaseURL: ''
  },
  // 测试环境
  'test': {
    baseURL: 'http://localhost:8080/nongxinle_master_war_exploded/',
    authBaseURL: ''
  }
}
export default modeUrlObj[process.env.NODE_ENV]
