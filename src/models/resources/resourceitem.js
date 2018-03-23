/**
 * Created by neo on 18/3/2018.
 */
/**
 * Created by neo on 16/3/2018.
 */
import { message } from 'antd';
import {
  listResourceItems,
  addResourceAudio,
  addResourceImage,
  addResourceVideo,
  addResourceWebPage,
  changeName,
  deleteResourceItem,
} from '../../services/api_resourceitem';

export default {
  namespace: 'resourceitem',

  state: {
    list: [],
    pagination: {
      // total: 0,
      // current: 1,
      // pageSize: 10,
      showSizeChanger: true,
    },
    webSaveSuccess: false,
  },

  effects: {
    *listItems({ payload }, { call, put }) {
      const { showId, groupId } = payload;
      const response = yield call(listResourceItems, { showId, groupId });
      yield put({
        type: 'refreshUI',
        payload: response.data,
      });
    },
    *addAudio({ payload }, { call, put }) {
      const { showId, groupId, audioId } = payload;
      const response = yield call(addResourceAudio, { showId, groupId, audioId });
      if (response.status === 201) {
        message.info('添加成功！');
        const response2 = yield call(listResourceItems, { showId, groupId });
        yield put({
          type: 'refreshUI',
          payload: response2.data,
        });
      }
    },
    *addVideo({ payload }, { call, put }) {
      const { showId, groupId, videoId } = payload;
      const response = yield call(addResourceVideo, { showId, groupId, videoId });
      if (response.status === 201) {
        message.info('添加成功！');
        const response2 = yield call(listResourceItems, { showId, groupId });
        yield put({
          type: 'refreshUI',
          payload: response2.data,
        });
      }
    },
    *addImage({ payload }, { call, put }) {
      const { showId, groupId, imageId } = payload;
      const response = yield call(addResourceImage, { showId, groupId, imageId });
      if (response.status === 201) {
        message.info('添加成功！');
        const response2 = yield call(listResourceItems, { showId, groupId });
        yield put({
          type: 'refreshUI',
          payload: response2.data,
        });
      }
    },
    *addWebPage({ payload }, { call, put }) {
      const { showId, groupId, title, author, coverImageUrl, introduce, contentHtml } = payload;
      const response = yield call(
        addResourceWebPage,
        { showId, groupId, title, author, coverImageUrl, introduce, contentHtml }
      );
      if (response.status === 201) {
        message.info('添加成功！');
        const response2 = yield call(listResourceItems, { showId, groupId });
        yield put({
          type: 'webSaveSuccess',
          payload: response2.data,
        });
      }
    },
    *changeName({ payload }, { call, put }) {
      const { showId, groupId, itemId, name } = payload;
      const response = yield call(changeName, { showId, groupId, itemId, name });
      if (response.status === 200) {
        message.info('修改成功！');
        const response2 = yield call(listResourceItems, { showId, groupId });
        yield put({
          type: 'refreshUI',
          payload: response2.data,
        });
      }
    },
    *deleteItem({ payload }, { call, put }) {
      const { showId, groupId, itemId } = payload;
      const response = yield call(deleteResourceItem, { showId, groupId, itemId });
      if (response.status === 200) {
        message.info('删除成功！');
        const response2 = yield call(listResourceItems, { showId, groupId });
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
        list: action.payload,
        pagination: {
          total: action.payload.length,
          current: 1,
          pageSize: 10,
          showSizeChanger: true,
        },
      };
    },
    webSaveSuccess(state, action) {
      return {
        ...state,
        list: action.payload,
        pagination: {
          total: action.payload.length,
          current: 1,
          pageSize: 10,
          showSizeChanger: true,
        },
        webSaveSuccess: true,
      };
    }
  },
};
