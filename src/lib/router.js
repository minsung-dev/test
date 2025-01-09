const MobileDetect = require("mobile-detect");
const moment = require("moment");
const menu = require("./menutree");

// 모든 페이지에서 공용으로 사용되는 파라미터
exports.setCommonParameter = (req, res) => {
  const API_URL_BASE = process.env.API_URL_BASE;
  const md = new MobileDetect(req.headers['user-agent']);
  let {menuTree, pageTitle, breadcrumb} = menu.getCurrentMenuInfo(req.originalUrl.split('?')[0]);

  if (!res.p) {
    res.p = {};
  }

  res.locals.global = {
    userAgent: req.get('User-Agent'),
    url: req.originalUrl,
    menu: menuTree,
    pageTitle: pageTitle,
    breadcrumb: breadcrumb,
    fullUrl: `${req.protocol}://${req.get('host')}${req.originalUrl}`,
    route: req.url.split('?')[0],
    device: md.tablet() ? 3 : (md.mobile() ? 2 : 1),
    currentDateStr: moment().format('YYYY-MM-DD'),
    currentTimeStr: moment().format('HH:mm:ss'),
    user: req.user,
    apiBase: API_URL_BASE,
  }
}