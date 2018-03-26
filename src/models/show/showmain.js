/**
 * Created by neo on 2/3/2018.
 */
import { message } from 'antd';
import { searchShows, addShow, updateShow, getShow, deleteShow } from '../../services/api_show';

export default {
  namespace: 'showmain',

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
    *initList(_, { call, put }) {
      const response = yield call(searchShows, { page: 0, size: 10 });
      yield put({
        type: 'refreshUI',
        payload: {
          word: '',
          data: response.data,
        },
      });
    },
    *searchShowList({ payload }, { call, put }) {
      const { word, page, size } = payload;
      const response = yield call(searchShows, { word, page, size });
      yield put({
        type: 'refreshUI',
        payload: {
          word: '',
          data: response.data,
        },
      });
    },
    *addShow({ payload }, { call, put }) {
      const {
        title,
        startTime,
        endTime,
        introduceText,
        imageHeight,
        imageWidth,
        imageUrl,
        imageThumbUrl,
      } = payload;
      const response = yield call(
        addShow,
        { title,
          startTime,
          endTime,
          introduceText,
          imageHeight,
          imageWidth,
          imageUrl,
          imageThumbUrl, }
      );
      if (response.status === 201) {
        message.info('添加成功！');
        const response2 = yield call(searchShows, { page: 0, size: 10 });
        yield put({
          type: 'refreshUI',
          payload: {
            word: '',
            data: response2.data,
          },
        });
      }
    },
    *updateShow({ payload }, { call, put, select }) {
      const {
        showId,
        title,
        startTime,
        endTime,
        introduceText,
        imageHeight,
        imageWidth,
        imageUrl,
        imageThumbUrl,
      } = payload;
      const response = yield call(
        updateShow,
        { showId,
          title,
          startTime,
          endTime,
          introduceText,
          imageHeight,
          imageWidth,
          imageUrl,
          imageThumbUrl, }
      );
      if (response.status === 200) {
        message.info('更新成功！');
        const page = yield select(state => state.showmain.page.number);
        const size = yield select(state => state.showmain.page.size);
        const word = yield select(state => state.showmain.word);
        const response2 = yield call(searchShows, { page, size, word });
        yield put({
          type: 'refreshUI',
          payload: {
            word,
            data: response2.data,
          },
        });
      }
    },
    *getShow({ payload }, { call, put }) {
      const { showId } = payload;
      const response = yield call(getShow, showId);
      yield put({
        type: 'refreshUI',
        payload: response.data,
      });
    },
    *deleteShow({ payload }, { call, put, select }) {
      const { showId } = payload;
      const response = yield call(deleteShow, showId);
      if (response.status === 200) {
        message.info('删除成功！');
        const page = yield select(state => state.showmain.page.number);
        const size = yield select(state => state.showmain.page.size);
        const word = yield select(state => state.showmain.word);
        const response2 = yield call(searchShows, { page, size, word });
        yield put({
          type: 'refreshUI',
          payload: {
            word,
            data: response2.data,
          },
        });
      }
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
