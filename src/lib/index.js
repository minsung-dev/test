const axios = require('axios');

exports.API_URL_BASE = process.env.API_URL_BASE;
exports.router = require('./router');

function getApiHeader(token) {
  let header = {
    'Content-Type': 'application/json',
    'reqVersion': 1,
  };

  if (token) {
    header['x-access-token'] = token;
  }

  return header;
}

exports.getApiHeader = getApiHeader;


async function apiCall({token, header = getApiHeader(token), method = 'GET', url, data}) {
  if (!url) {
    throw new Error(`url is empty`);
  }

  if (!(url.includes('https://') || url.includes('http://'))) {
    if (url[0] !== '/') {
      url = '/' + url;
    }

    url = process.env.API_URL_BASE_INTERNAL + url;
  }

  let result = await axios({
    headers: header,
    method: method,
    url: url,
    data: JSON.stringify(data),
  });

  if (!result.data.success) {
    let e = new Error(result.data.error);
    e = {...e, ...result.data};
    throw e;
  }

  return result.data;
}

exports.apiCall = apiCall;

function getOnlyInNames(body, names) { // 요소 검사 & API 대량 할당 공격 방지의 목적
  const result = {}
  names.forEach((key) => {
    if (!body[key]) { // 키값이 없으면 오류 반환
      throw Error(key + ' is empty');
    }
    result[key] = body[key];
  });

  return result;
}

exports.getOnlyInNames = getOnlyInNames;