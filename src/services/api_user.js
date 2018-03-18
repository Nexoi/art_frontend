/**
 * Created by neo on 12/3/2018.
 */
import request from '../utils/request';

export async function listUsers(payload) {
  const { word, page, size } = payload;
  if (word === undefined || word.length < 1) {
    return request(`/api/admin/v1/users/search?page=${page}&size=${size}`, {
      method: 'GET',
    });
  } else {
    return request(`/api/admin/v1/users/search?page=${page}&size=${size}&word=${word}`, {
      method: 'GET',
    });
  }
}
