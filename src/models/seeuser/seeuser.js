/**
 * Created by neo on 19/3/2018.
 */
import { listUsers } from '../../services/api_user';

export default {
  namespace: 'seeuser',

  state: {
    word: '',
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
    *listUsers({ payload }, { call, put }) {
      const { word, page, size } = payload;
      const response = yield call(listUsers, { word, page, size });
      yield put({
        type: 'refreshUI',
        payload: {
          word,
          data: response.data,
        },
      });
    },
  },

  reducers: {
    refreshUI(state, action) {
      return {
        ...state,
        word: action.payload.word,
        page: action.payload.data,
        list: action.payload.data.content,
        pagination: {
          total: action.payload.data.totalElements,
          current: action.payload.data.number + 1,
          pageSize: action.payload.data.size,
          showSizeChanger: true,
        },
      };
    },
  },
};
