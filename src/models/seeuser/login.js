import { routerRedux } from 'dva/router';
import { message } from 'antd';
import { queryCurrent, adminLogin } from '../../services/api_user_login';
import { setAuthority } from '../../utils/authority';
import { reloadAuthorized } from '../../utils/Authorized';

export default {
  namespace: 'login',

  state: {
    status: undefined,
    currentUser: {},
  },

  effects: {
    *queryCurrent(_, { call, put }) {
      const response = yield call(queryCurrent);
      yield put({
        type: 'saveCurrentUser',
        payload: response.data,
      });
    },
    *login({ payload }, { call, put }) {
      const response = yield call(adminLogin, payload);
      console.log('==================================  LOGIN ING  ====================================')
      console.log(response);
      // Login successfully
      if (response.status === 200) {
        yield put({
          type: 'changeLoginStatus',
          payload: {
            currentAuthority: response.data.currentAuthority === 'adminx' ? 'admin' : 'user',
            type: 'account',
            status: 'ok',
          },
        });
        reloadAuthorized();
        yield put(routerRedux.push('/'));
      // } else if (response.status === 400) {
      //   message.info(response.message);
      } else {
        message.warn(response.message);
      }
    },
    *logout(_, { put, select }) {
      try {
        // get location pathname
        const urlParams = new URL(window.location.href);
        const pathname = yield select(state => state.routing.location.pathname);
        // add the parameters in the url
        urlParams.searchParams.set('redirect', pathname);
        window.history.replaceState(null, 'login', urlParams.href);
      } finally {
        yield put({
          type: 'changeLoginStatus',
          payload: {
            status: false,
            currentAuthority: 'guest',
          },
        });
        reloadAuthorized();
        yield put(routerRedux.push('/user/login'));
        yield put(routerRedux.push('/user/login'));
      }
    },
  },

  reducers: {
    changeLoginStatus(state, { payload }) {
      console.log('===登录状态修改！===')
      setAuthority(payload.currentAuthority);
      // setAuthority(undefined);
      return {
        ...state,
        status: payload.status,
        type: payload.type,
      };
    },
    saveCurrentUser(state, action) {
      return {
        ...state,
        currentUser: action.payload,
      };
    },
  },
};
