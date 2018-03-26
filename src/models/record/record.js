/**
 * Created by neo on 26/3/2018.
 */
import {
  listDevices,
  listResourceGroups,
  listResourceItems,
  listShows,
  listUsers,
} from '../../services/api_record';

export default {
  namespace: 'record',

  state: {
    devices: {},
    resourceGroups: [],
    resourceItems: [],
    shows: [],
    users: {},
  },

  effects: {
    *listDevices({ payload }, { call, put }) {
      const { startDay, endDay } = payload;
      const response = yield call(listDevices, { startDay, endDay });
      if (response.status === 200) {
        yield put({
          type: 'reloadDevices',
          payload: response.data,
        });
      }
    },
    *listResourceGroups({ payload }, { call, put }) {
      const { groupIds, startDay, endDay } = payload;
      const response = yield call(listResourceGroups, { groupIds, startDay, endDay });
      if (response.status === 200) {
        yield put({
          type: 'reloadGroups',
          payload: response.data,
        });
      }
    },
    *listResourceItems({ payload }, { call, put }) {
      const { itemIds, startDay, endDay } = payload;
      const response = yield call(listResourceItems, { itemIds, startDay, endDay });
      if (response.status === 200) {
        yield put({
          type: 'reloadItems',
          payload: response.data,
        });
      }
    },
    *listShows({ payload }, { call, put }) {
      const { showIds, startDay, endDay } = payload;
      const response = yield call(listShows, { showIds, startDay, endDay });
      if (response.status === 200) {
        yield put({
          type: 'reloadShows',
          payload: response.data,
        });
      }
    },
    *listUsers({ payload }, { call, put }) {
      const { startDay, endDay } = payload;
      const response = yield call(listUsers, { startDay, endDay });
      if (response.status === 200) {
        yield put({
          type: 'reloadUsers',
          payload: response.data,
        });
      }
    },
  },

  reducers: {
    reloadDevices(state, action) {
      return {
        ...state,
        devices: action.payload,
      };
    },
    reloadGroups(state, action) {
      return {
        ...state,
        resourceGroups: action.payload,
      };
    },
    reloadItems(state, action) {
      return {
        ...state,
        resourceItems: action.payload,
      };
    },
    reloadShows(state, action) {
      return {
        ...state,
        shows: action.payload,
      };
    },
    reloadUsers(state, action) {
      return {
        ...state,
        users: action.payload,
      };
    },
  },
};
