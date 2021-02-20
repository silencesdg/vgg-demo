const path = require("path");
const querystring = require("querystring");
const FormData = require("form-data");
const sendToWormhole = require("stream-wormhole");
const URL = require("url");
const _ = require("lodash");

module.exports = app => {
  return class extends app.Controller {
    async index() {
      await this.ctx.render(
        "vue-ssr-server-bundle.json",
        // local context
        {
          // 页面url
          url: this.ctx.url.replace(app.config.easyvue.siteRoot, ""),
          // 站点根目录
          siteRoot: app.config.easyvue.siteRoot,
          // cookies
          cookies: this.ctx.cookies,
          // koa ctx
          ctx: this.ctx
        },
        // render options
        {
          renderOptions: {
            // https://ssr.vuejs.org/zh/api.html#runinnewcontext
            runInNewContext: false
          }
        }
      );
    }

    async proxy() {
      await simpleProxy(this.ctx, app.config.proxy.baseUrl);
    }
  };

  /**
   * 简单的代理转发:
   *
   * - 保留http headers
   * - 添加跨域请求头
   * - 将访问路径转发到baseURL上
   *
   * @param  {[type]} baseURL [description]
   * @return {[type]}         返回接口响应内容。
   */
  async function simpleProxy(ctx, baseURL, regPath = "api/proxy") {
    const proxiedURL = ctx.url.substr(
      ctx.path.indexOf(regPath) + regPath.length
    );
    const proxiedBaseURL = baseURL || app.config.proxy.baseUrl;
    const method = ctx.method;
    const url = proxiedBaseURL + proxiedURL;
    let httpHeaders = getHttpHeaders(ctx.headers);
    if (httpHeaders.Host) {
      httpHeaders.Host = URL.parse(proxiedBaseURL).host;
    }

    let options = {
      method: method,
      // dataType: 'json',
      headers: httpHeaders
    };

    // 添加代理token
    const headerToken = app.config.proxy.headerToken;
    if (headerToken && _.isObject(headerToken)) {
      options.headers[headerToken["key"]] = headerToken.value;
    }

    let filestream;

    if (method != "GET") {
      if (ctx.is("application/x-www-form-urlencoded")) {
        options.data = querystring.stringify(ctx.request.body);
      } else if (ctx.is("multipart/form-data")) {
        let form = new FormData();
        filestream = await ctx.getFileStream();
        // append file
        form.append("file", filestream, {
          filename: filestream.filename
        });
        // append fields
        if (filestream) await sendToWormhole(filestream);
        if (filestream.fields) {
          for (let key in filestream.fields) {
            form.append(key, filestream.fields[key]);
          }
        }
        options.headers = form.getHeaders();
        options.stream = form;
      } else {
        options.data = ctx.request.body;
      }
    }
    options.timeout = 30000;
    // 开始代理转发。
    const result = await ctx.curl(url, options);
    // if(filestream) sendToWormhole(filestream);
    ctx.set("Access-Control-Allow-Credentials", "true");
    ctx.set("Access-Control-Allow-Origin", ctx.host);
    delete result.headers["content-encoding"];
    ctx.set(result.headers);
    ctx.status = result.status;
    ctx.body = result.data;
  }
};

// 获取符合http标准的头。
function getHttpHeaders(headers = {}) {
  let httpHeaders = {};
  for (let key in headers) {
    httpHeaders[upFirst(key)] = headers[key];
  }
  return httpHeaders;
}

function upFirst(str) {
  let rst = str.split("-").map(i => {
    return _.upperFirst(i);
  });
  return rst.join("-");
}
