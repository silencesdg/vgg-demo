export default type => {
  return {
    // axios配置 @see ~/common/context/http
    http: {
      baseURL: ""
    },

    // 权限验证设置 @see ~/router/index.js
    auth: {
      // 是否进行单点登录
      enabled: false,
      // 单点登录不成功跳转的登录页
      authURL: "/login"
    },

    // 日志 https://eggjs.org/zh-cn/core/logger.html
    logger: {
      // 日志打印的级别：
      // - none 不进行打印
      // - debug debug及其以上
      // - info
      // - warn
      // - error
      level: "error"
    }
  };
};
