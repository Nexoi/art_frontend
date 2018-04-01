/**
 * Created by neo on 15/3/2018.
 */
import request from '../utils/request';

export async function startAsync(payload) {
  const { showId } = payload;
  return request(`/api/admin/v1/wx/async/${showId}`, {
    method: 'POST',
  });
}

export async function getAsyncResult(payload) {
  const { showId } = payload;
  return request(`/api/admin/v1/wx/async/${showId}`, {
    method: 'GET',
  });
}
