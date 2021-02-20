module.exports = app => {
  const siteRoot = app.config.easyvue.siteRoot;
  app.get("/api/proxy/(.+)?", "app.app.proxy");
  app.post("/api/proxy/(.+)?", "app.app.proxy");
  app.get(`${siteRoot}(.+)?`, "app.app.index");
};
