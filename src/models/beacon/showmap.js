/**
 * Created by neo on 12/3/2018.
 */
import { message } from 'antd';
import {
  listShowMaps,
  addShowMap,
  getShowMap,
  updateShowMap,
  deleteShowMap,
} from '../../services/api_showmap';

export default {
  namespace: 'showmap',

  state: {
    page: {},
    list: [],
    pagination: {
      total: 0,
      current: 1,
      pageSize: 10,
      showSizeChanger: true,
    },
  },

  effects: {
    *initList(_, { call, put }) {
      const response = yield call(listShowMaps, { page: 0, size: 10 });
      yield put({
        type: 'refreshUI',
        payload: response.data,
      });
    },
    *fetchList({ payload }, { call, put }) {
      const { page, size } = payload;
      const response = yield call(listShowMaps, { page, size });
      yield put({
        type: 'refreshUI',
        payload: response.data,
      });
    },
    *addOneShowMap({ payload }, { call, put }) {
      const { name, showHallName, width, height, imageId } = payload;
      const response = yield call(
        addShowMap,
        { name, showHallName, width, height, imageId }
      );
      if (response.status === 201) {
        message.info('添加成功！');
        // refresh
        const response2 = yield call(listShowMaps, { page: 0, size: 10 });
        yield put({
          type: 'refreshUI',
          payload: response2.data,
        });
      }
    },
    *updateOneShowMap({ payload }, { call, put, select }) {
      const { mapId, name, showHallName, width, height, imageId } = payload;
      const response = yield call(
        updateShowMap,
        { mapId, name, showHallName, width, height, imageId }
      );
      if (response.status === 200) {
        message.info('修改成功！');
        // refresh
        const page = yield select(state => state.showmap.page.number);
        const size = yield select(state => state.showmap.page.size);
        const response2 = yield call(listShowMaps, { page, size });
        yield put({
          type: 'refreshUI',
          payload: response2.data,
        });
      }
    },
    *deleteShowMap({ payload }, { call, put, select }) {
      const { mapId } = payload;
      const response = yield call(deleteShowMap, mapId);
      if (response.status === 200) {
        message.info('删除成功！');
        // refresh
        const page = yield select(state => state.showmap.page.number);
        const size = yield select(state => state.showmap.page.size);
        const response2 = yield call(listShowMaps, { page, size });
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
  },
};
