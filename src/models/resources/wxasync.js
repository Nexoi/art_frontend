/**
 * Created by neo on 1/4/2018.
 */
import { message } from 'antd';
import {
  startAsync,
  getAsyncResult,
} from '../../services/api_wxasync';

export default {
  namespace: 'wxasync',

  state: {
    list: [],
  },

  effects: {
    *startAsync({ payload }, { call, put }) {
      const { showId } = payload;
      const response = yield call(startAsync, { showId });
      yield put({
        type: 'refreshUI',
        payload: response.data,
      });
    },
    *listAsyncResult({ payload }, { call, put }) {
      const { showId } = payload;
      const response = yield call(getAsyncResult, { showId });
      yield put({
        type: 'refreshUI',
        payload: response.data,
      });
    },
  },

  reducers: {
    refreshUI(state, action) {
      return {
        ...state,
        list: action.payload,
      };
    },
  },
};
