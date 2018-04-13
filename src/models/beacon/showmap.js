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
    *initList({ payload }, { call, put }) {
      const { showId } = payload;
      const response = yield call(listShowMaps, { showId, page: 0, size: 10 });
      yield put({
        type: 'refreshUI',
        payload: response.data,
      });
    },
    *fetchList({ payload }, { call, put }) {
      const { showId, page, size } = payload;
      const response = yield call(listShowMaps, { showId, page, size });
      yield put({
        type: 'refreshUI',
        payload: response.data,
      });
    },
    *addOneShowMap({ payload }, { call, put }) {
      const { showId, floor, name, showHallName, width, height, imageId } = payload;
      const response = yield call(
        addShowMap,
        { showId, floor, name, showHallName, width, height, imageId }
      );
      if (response.status === 201) {
        message.info('添加成功！');
        // refresh
        const response2 = yield call(listShowMaps, { showId, page: 0, size: 10 });
        yield put({
          type: 'refreshUI',
          payload: response2.data,
        });
      }
    },
    *updateOneShowMap({ payload }, { call, put, select }) {
      const { showId, mapId, floor, name, showHallName, width, height, imageId } = payload;
      const response = yield call(
        updateShowMap,
        { showId, mapId, floor, name, showHallName, width, height, imageId }
      );
      if (response.status === 200) {
        message.info('修改成功！');
        // refresh
        const page = yield select(state => state.showmap.page.number);
        const size = yield select(state => state.showmap.page.size);
        const response2 = yield call(listShowMaps, { showId, page, size });
        yield put({
          type: 'refreshUI',
          payload: response2.data,
        });
      }
    },
    *deleteShowMap({ payload }, { call, put, select }) {
      const { showId, mapId } = payload;
      const response = yield call(deleteShowMap, mapId);
      if (response.status === 200) {
        message.info('删除成功！');
        // refresh
        const page = yield select(state => state.showmap.page.number);
        const size = yield select(state => state.showmap.page.size);
        const response2 = yield call(listShowMaps, { showId, page, size });
        yield put({
          type: 'refreshUI',
          payload: response2.data,
        });
      }
      if (response.status === 423) {
        message.info('删除失败！该地图在其余地方被使用，请先解除关联');
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
