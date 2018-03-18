/**
 * Created by neo on 12/3/2018.
 */
import { message } from 'antd';
import {
  listBeacons,
  addBeacon,
  getBeacon,
  updateBeacon,
  changeBeaconStatus,
  deleteBeacon,
} from '../../services/api_beacon';

export default {
  namespace: 'beacon',

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
      const response = yield call(listBeacons, { page: 0, size: 10 });
      yield put({
        type: 'refreshUI',
        payload: response.data,
      });
    },
    *fetchList({ payload }, { call, put }) {
      const { page, size } = payload;
      const response = yield call(listBeacons, { page, size });
      yield put({
        type: 'refreshUI',
        payload: response.data,
      });
    },
    *addBeacon({ payload }, { call, put }) {
      const {
        name,
        uuid,
        majorValue,
        minorValue,
        availableRange,
        status,
        mapId,
        width,
        height,
      } = payload;
      const response = yield call(
        addBeacon,
        {
          name,
          uuid,
          majorValue,
          minorValue,
          availableRange,
          status,
          mapId,
          width,
          height,
        }
      );
      if (response.status === 201) {
        message.info('添加成功！');
        // refresh
        const response2 = yield call(listBeacons, { page: 0, size: 10 });
        yield put({
          type: 'refreshUI',
          payload: response2.data,
        });
      }
    },
    *updateBeacon({ payload }, { call, put, select }) {
      const {
        name,
        uuid,
        majorValue,
        minorValue,
        availableRange,
        status,
        mapId,
        width,
        height,
      } = payload;
      const response = yield call(
        updateBeacon,
        {
          name,
          uuid,
          majorValue,
          minorValue,
          availableRange,
          status,
          mapId,
          width,
          height,
        }
      );
      if (response.status === 200) {
        message.info('修改成功！');
        // refresh
        const page = yield select(state => state.beacon.page.number);
        const size = yield select(state => state.beacon.page.size);
        const response2 = yield call(listBeacons, { page, size });
        yield put({
          type: 'refreshUI',
          payload: response2.data,
        });
      }
    },
    *changeStatus({ payload }, { call, put, select }) {
      const { uuid } = payload;
      const response = yield call(changeBeaconStatus, uuid);
      if (response.status === 200) {
        message.info('状态更改成功！请刷新页面以更新数据');
        // refresh
        const page = yield select(state => state.beacon.page.number);
        const size = yield select(state => state.beacon.page.size);
        const response2 = yield call(listBeacons, { page, size });
        yield put({
          type: 'refreshUI',
          payload: response2.data,
        });
      }
    },
    *deleteBeacon({ payload }, { call, put, select }) {
      const { uuid } = payload;
      const response = yield call(deleteBeacon, uuid);
      if (response.status === 200) {
        message.info('删除成功！');
        // refresh
        const page = yield select(state => state.beacon.page.number);
        const size = yield select(state => state.beacon.page.size);
        const response2 = yield call(listBeacons, { page, size });
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
