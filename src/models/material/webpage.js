/**
 * Created by neo on 26/3/2018.
 */
import { message } from 'antd';
import { routerRedux } from 'dva/router';
import {
  getWebPage,
  updateWebPage,
  addResourceWebPage,
} from '../../services/api_resourceitem';

export default {
  namespace: 'webpage',

  state: {
    currentWebPage: {},
  },

  effects: {
    *addWebPage({ payload }, { call, put }) {
      const { showId, groupId, title, author, coverImageUrl, introduce, contentHtml } = payload;
      const response = yield call(
        addResourceWebPage,
        { showId, groupId, title, author, coverImageUrl, introduce, contentHtml }
      );
      if (response.status === 201) {
        message.info('添加成功！');
        // const response2 = yield call(listResourceItems, { showId, groupId });
        yield put(routerRedux.goBack());
        // yield put({
        //   type: 'webSaveSuccess',
        //   payload: response2.data,
        // });
      }
    },
    *getWebPage({ payload }, { call, put }) {
      const { itemId } = payload;
      const response = yield call(getWebPage, itemId);
      if (response.status === 200) {
        yield put({
          type: 'loadCurrentWebPage',
          payload: response.data,
        });
      }
    },
    *updateWebPage({ payload }, { call, put }) {
      const { itemId, author, contentHtml, coverImageUrl, introduce, title } = payload;
      const response = yield call(updateWebPage, { itemId, author, contentHtml, coverImageUrl, introduce, title });
      if (response.status === 200) {
        message.info('修改成功！');
        yield put(routerRedux.goBack());
      }
    },
  },

  reducers: {
    loadCurrentWebPage(state, action) {
      return {
        currentWebPage: action.payload,
      };
    },
  },
};
