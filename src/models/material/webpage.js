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
import {
  uploadFile,
} from '../../services/api_material';

export default {
  namespace: 'webpage',

  state: {
    currentWebPage: {},
  },

  effects: {
    *addWebPage({ payload }, { call, put }) {
      const { showId, groupId, title, author, link, coverImageUrl, introduce, contentHtml } = payload;
      const response = yield call(
        addResourceWebPage,
        { showId, groupId, title, author, link, coverImageUrl, introduce, contentHtml }
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
      const { itemId, author, link, contentHtml, coverImageUrl, introduce, title } = payload;
      const response = yield call(updateWebPage, { itemId, author, link, contentHtml, coverImageUrl, introduce, title });
      if (response.status === 200) {
        message.info('修改成功！');
        yield put(routerRedux.goBack());
      }
    },
    *uploadFile({ payload }, { call, put }) {
      const { file, success } = payload;
      const response = yield call(uploadFile, { file });
      if (response.status !== 200) {
        message.error('文件上传失败！');
      } else {
        success({
          url: response.data.url,
        });
      }
      return response;
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
