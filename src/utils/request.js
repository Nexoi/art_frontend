import fetch from 'dva/fetch';
import { notification, message } from 'antd';
import { routerRedux } from 'dva/router';
import store from '../index';
import { domain_api, domain_web } from './utils';

const codeMessage = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '请求错误，请确认参数后重试',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。',
};
function checkStatus(response) {
  // console.log(response);

  if ((response.status >= 200 && response.status < 300) || response.status === 400 || response.status === 423) {
    return response;
  }
  const errortext = codeMessage[response.status] || response.statusText;
  if (response.status === 401) {
    notification.error({
      message: `无权限访！请使用正确的账号登录之后操作`,
      description: errortext,
    });
    // message.warn('无权限访！请使用正确的账号登录之后操作');
  } else {
    notification.error({
      message: `请求错误 ${response.status}: ${response.url}`,
      description: errortext,
    });
  }
  const error = new Error(errortext);
  error.name = response.status;
  error.response = response;
  throw error;
}

/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 * @return {object}           An object containing either "data" or "err"
 */
export default function request(url, options) {
  // console.log(`start==> ${url}`);
  // let finalUrl = url;
  const finalUrl = `${domain_api}${url}`;
  // if (url.startsWith('/api/admin/v1')) {
  //   finalUrl = `http://art.seeuio.com${url}`;
  // }
  const defaultOptions = {
    credentials: 'include',
    // credentials: '*',
  };
  const newOptions = { ...defaultOptions, ...options };

  if (newOptions.method === 'POST'
    || newOptions.method === 'PUT'
    || newOptions.method === 'DELETE'
    || newOptions.method === 'GET') {
    if (!(newOptions.body instanceof FormData)) {
      newOptions.headers = {
        Accept: 'application/json',
        'Content-Type': 'application/json; charset=utf-8',
        ...newOptions.headers,
      };
      newOptions.body = JSON.stringify(newOptions.body);
    } else {
      // newOptions.body is FormData
      newOptions.headers = {
        Accept: 'application/json',
        'Content-Type': 'multipart/form-data',
        ...newOptions.headers,
      };
    }
  }

  return fetch(finalUrl, newOptions)
    .then(checkStatus)
    .then((response) => {
      if (newOptions.method === 'DELETE' || response.status === 204) {
        // return response.text();
        return response.json();
      }
      return response.json();
    })
    .then((json) => {
      // console.log('--------------------^^--------------')
      // console.log(json);
      if (json.status !== undefined && json.status === 400 && newOptions.method !== 'GET') {
        message.warn(json.message);
        // console.log('----------------------&&------------')
      }
      return json;
    })
    .catch((e) => {
      const { dispatch } = store;
      const status = e.name;
      if (status === 401) {
        dispatch({
          type: 'login/logout',
        });
        return;
      }
      // if (status === 400) {
      //   message.warn(e.message);
      // }
      if (status === 403) {
        dispatch(routerRedux.push('/exception/403'));
        return;
      }
      if (status <= 504 && status >= 500) {
        dispatch(routerRedux.push('/exception/500'));
        return;
      }
      if (status >= 404 && status < 422) {
        dispatch(routerRedux.push('/exception/404'));
      }
    });
}
