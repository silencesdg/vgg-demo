import base from "./config.base";

export default type => {
  return Object.assign({}, base(type), {
    http: {
      baseURL: "/api"
    },
    // 日志
    logger: {
      // 日志记录级别
      level: "debug"
    }
  });
};
