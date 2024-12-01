<template>
  <div class="login-container">
    <div class="login-box">
      <div class="login-logo">
        <b>请用微信扫描</b>
      </div>
      <div class="login-box-body">
        <p class="login-box-msg">晶晶送货小程序登录</p>

        <!-- 显示二维码 -->
        <div class="qr-code-container">
          <img :src="qrCodeUrl" alt="扫码登录" class="qr-code" />
        </div>

        <!-- 登录提示 -->
        <p class="login-instructions">使用微信扫描二维码进行登录</p>
      </div>
    </div>
  </div>
</template>

<script>
import api from '../api/all.js'
import QRCode from 'qrcode'
import { useRouter } from 'vue-router';

export default {
  name: "Home",
  data() {
    return {
      qrCodeUrl: '',  // 保存二维码生成的 URL
      sessionId: '',  // 会话ID
      pollInterval: null,  // 保存定时器ID
    }
  },
  mounted() {
    this.generateQRCode();  // 页面加载后生成二维码
    this.startPolling();    // 启动轮询
  },
  beforeDestroy() {
    // 清除定时器，防止内存泄漏
    if (this.pollInterval) {
      clearInterval(this.pollInterval);
    }
  },
  methods: {
    generateQRCode() {
      this.sessionId = this.generateUniqueSessionId();  // 生成唯一会话 ID
      this.sessionId = "124abc"
      const qrCodeUrl = `https://grainservice.club:8445/nongxinle/api/nxdistributer/printerLogin?scene=${this.sessionId}`;
      QRCode.toDataURL(qrCodeUrl, (err, qrCodeUrl) => {
        if (err) {
          console.error('二维码生成失败', err)
        } else {
          this.qrCodeUrl = qrCodeUrl;  // 设置二维码 URL
        }
      })
    },

    // 生成唯一的 sessionId
    generateUniqueSessionId() {
      return `session-${Math.random().toString(36).substr(2, 9)}`;  // 简单的唯一 ID 生成方式
    },

    // 启动轮询检查登录状态
    startPolling() {
      const sessionId = this.sessionId;
      this.pollForUserInfo(sessionId);
    },

    // 定义轮询函数
    pollForUserInfo(sessionId) {
      this.pollInterval = setInterval(() => {
        api.checkLoginStatus(sessionId).then((response) => {
          const data = response.data;
          if (data.loggedIn) {
            console.log('用户登录成功，用户ID:', data.user);
            // 用户登录成功，停止轮询
            clearInterval(this.pollInterval);
            this.$store.commit('$_setDisUser', data.user);
            this.$router.push({ name: 'Bills', query: { disId: data.user.nxDiuDistributerId, disName: data.user.nxDistributerEntity.nxDistributerName} });
          } else {
            console.log('用户未登录，继续轮询...');
          }
        }).catch(error => {
          console.error('检查登录状态失败:', error);
        });
      }, 5000);  // 每 5 秒轮询一次
    },
  }
}
</script>

<style scoped>
/* 设置背景渐变和屏幕居中 */
.login-container {
  background: linear-gradient(to right, #6a11cb, #2575fc);
  /* 渐变色 */
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

/* 登录框样式 */
.login-box {
  background-color: rgba(255, 255, 255, 0.9);
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  width: 350px;
  text-align: center;
}

/* 登录框标题 */
.login-logo b {
  font-size: 24px;
  color: #333;
  font-weight: bold;
  margin-bottom: 10px;
  display: block;
}

/* 登录框内容 */
.login-box-body {
  margin-top: 20px;
}

/* 二维码容器 */
.qr-code-container {
  margin: 20px 0;
}

/* 二维码样式 */
.qr-code {
  width: 150px;
  height: 150px;
  object-fit: contain;
  margin-bottom: 10px;
}

/* 登录提示文字 */
.login-instructions {
  font-size: 14px;
  color: #666;
  margin-top: 10px;
}

/* 响应式设计：适配不同屏幕尺寸 */
@media (max-width: 400px) {
  .login-box {
    width: 90%;
    padding: 20px;
  }

  .qr-code {
    width: 120px;
    height: 120px;
  }
}
</style>