/**
 * Created by neo on 12/3/2018.
 */
import { message } from 'antd';
import {
  listBeacons,
  getBeacon,
  updateBeacon,
  changeBeaconStatus,
  removeBeacon,
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
    *fetchList({ payload }, { call, put }) {
      const { showId, page, size } = payload;
      const response = yield call(listBeacons, { showId, page, size });
      yield put({
        type: 'refreshUI',
        payload: response.data,
      });
    },
    *updateBeacon({ payload }, { call, put, select }) {
      const {
        showId,
        name,
        uuid,
        availableRange,
        status,
        mapId,
        width,
        height,
      } = payload;
      const response = yield call(
        updateBeacon,
        {
          showId,
          name,
          uuid,
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
        const response2 = yield call(listBeacons, { showId, page, size });
        yield put({
          type: 'refreshUI',
          payload: response2.data,
        });
      }
    },
    *changeStatus({ payload }, { call, put, select }) {
      const { showId, uuid } = payload;
      const response = yield call(changeBeaconStatus, { showId, uuid });
      if (response.status === 200) {
        message.info('状态更改成功！');
        // refresh
        const page = yield select(state => state.beacon.page.number);
        const size = yield select(state => state.beacon.page.size);
        const response2 = yield call(listBeacons, { showId, page, size });
        yield put({
          type: 'refreshUI',
          payload: response2.data,
        });
      }
    },
    *removeBeacon({ payload }, { call, put, select }) {
      const { showId, uuid } = payload;
      const response = yield call(removeBeacon, { showId, uuid });
      if (response.status === 200) {
        message.info('取消绑定成功！');
        // refresh
        const page = yield select(state => state.beacon.page.number);
        const size = yield select(state => state.beacon.page.size);
        const response2 = yield call(listBeacons, { showId, page, size });
        yield put({
          type: 'refreshUI',
          payload: response2.data,
        });
      }
      if (response.status === 423) {
        message.info('取消绑定失败！');
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
