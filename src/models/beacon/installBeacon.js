/**
 * Created by neo on 12/3/2018.
 */
import { message } from 'antd';
import {
  listBeacons,
  getBeacon,
  addBeacon,
  updateBeacon,
  deleteBeacon,
  listWithShow,
  listWithShowReverse,
  appendInShow,
  removeFromShow,
} from '../../services/api_install_beacon';

export default {
  namespace: 'installBeacon',

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
        uuid,
        majorValue,
        minorValue,
      } = payload;
      const response = yield call(
        addBeacon,
        {
          uuid,
          majorValue,
          minorValue,
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
        id,
        uuid,
        majorValue,
        minorValue,
      } = payload;
      const response = yield call(
        updateBeacon,
        {
          id,
          uuid,
          majorValue,
          minorValue,
        }
      );
      if (response.status === 200) {
        message.info('修改成功！');
        // refresh
        const page = yield select(state => state.installBeacon.page.number);
        const size = yield select(state => state.installBeacon.page.size);
        const response2 = yield call(listBeacons, { page, size });
        yield put({
          type: 'refreshUI',
          payload: response2.data,
        });
      }
    },
    *deleteBeacon({ payload }, { call, put, select }) {
      const { id } = payload;
      const response = yield call(deleteBeacon, id);
      if (response.status === 200) {
        message.info('删除成功！');
        // refresh
        const page = yield select(state => state.installBeacon.page.number);
        const size = yield select(state => state.installBeacon.page.size);
        const response2 = yield call(listBeacons, { page, size });
        yield put({
          type: 'refreshUI',
          payload: response2.data,
        });
      }
      if (response.status === 423) {
        message.info('删除失败！该 Beacon 在其余地方被使用，请先解除关联');
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
