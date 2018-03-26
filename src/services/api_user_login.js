import md5 from 'js-md5';
import request from '../utils/request';

export async function queryCurrent() {
  return request('/api/v1/user', {
    method: 'GET',
  });
}

export async function adminLogin(payload) {
  const { username, password } = payload;
  const pw = md5(password).toUpperCase();
  return request(`/signin/admin?username=${username}&password=${pw}`, {
    method: 'POST',
  })
}
