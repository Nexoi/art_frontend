/**
 * Created by neo on 12/3/2018.
 */
import { message } from 'antd';
import {
  listWithShow,
  listWithShowReverse,
  appendInShow,
  removeFromShow,
} from '../../services/api_install_beacon';

export default {
  namespace: 'installBeacon2Show',

  state: {
    page: {},
    list: [],
    pagination: {
      total: 0,
      current: 1,
      pageSize: 10,
      showSizeChanger: true,
    },
    appendBox: {
      page: {},
      list: [],
      pagination: {
        total: 0,
        current: 1,
        pageSize: 10,
        showSizeChanger: true,
      },
    },
  },

  effects: {
    *fetchList({ payload }, { call, put }) {
      const { showId, page, size } = payload;
      const response = yield call(listWithShow, { showId, page, size });
      yield put({
        type: 'refreshUI',
        payload: response.data,
      });
    },
    *fetchListReverse({ payload }, { call, put }) {
      const { showId, page, size } = payload;
      const response = yield call(listWithShowReverse, { showId, page, size });
      yield put({
        type: 'refreshAppendBoxUI',
        payload: response.data,
      });
    },
    *appendInShow({ payload }, { call, put }) {
      const {
        showId,
        beaconIds,
      } = payload;
      const response = yield call(
        appendInShow,
        {
          showId,
          beaconIds,
        }
      );
      if (response.status === 200) {
        message.info('添加成功！');
        // refresh
        // const response2 = yield call(listWithShow, { page: 0, size: 10 });
        // yield put({
        //   type: 'refreshUI',
        //   payload: response2.data,
        // });
      }
    },
    *removeBeacon({ payload }, { call, put, select }) {
      const {
        showId,
        beaconId,
      } = payload;
      const response = yield call(
        removeFromShow,
        {
          showId,
          beaconId,
        }
      );
      if (response.status === 200) {
        message.info('移除成功！');
        // refresh
        const page = yield select(state => state.installBeacon2Show.page.number);
        const size = yield select(state => state.installBeacon2Show.page.size);
        const response2 = yield call(listWithShow, { showId, page, size });
        yield put({
          type: 'refreshUI',
          payload: response2.data,
        });
      }
    },
  },
  reducers: {
    refreshUI(state, action) {
      return {
        ...state,
        page: action.payload,
        list: action.payload.content,
        pagination: {
          total: action.payload.totalElements,
          current: action.payload.number + 1,
          pageSize: action.payload.size,
          showSizeChanger: true,
        },
      };
    },
    refreshAppendBoxUI(state, action) {
      return {
        ...state,
        appendBox: {
          page: action.payload,
          list: action.payload.content,
          pagination: {
            total: action.payload.totalElements,
            current: action.payload.number + 1,
            pageSize: action.payload.size,
            showSizeChanger: true,
          },
        },
      };
    },
  },
};
