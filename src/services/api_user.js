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

// admin

export async function listAdmins(payload) {
  const { word, page, size } = payload;
  if (word === undefined || word.length < 1) {
    return request(`/api/admin/v1/admins/list?page=${page}&size=${size}`, {
      method: 'GET',
    });
  } else {
    return request(`/api/admin/v1/admins/list?page=${page}&size=${size}&word=${word}`, {
      method: 'GET',
    });
  }
}

export async function addAdmin(payload) {
  const { username, password, phone, gender } = payload;
  return request(`/api/admin/v1/admins?username=${username}&password=${password}&phone=${phone}&gender=${gender}`, {
    method: 'POST',
  });
}
export async function deleteAdmin(uid) {
  return request(`/api/admin/v1/admins/${uid}`, {
    method: 'DELETE',
  });
}

// admin shows auth

export async function listShowAuths(uid) {
  return request(`/api/admin/v1/admins/${uid}/shows`, {
    method: 'GET',
  });
}

export async function updateShowAuths(payload) {
  const { uid, showIds } = payload;
  return request(`/api/admin/v1/admins/${uid}/shows?showIds=${showIds}`, {
    method: 'PUT',
  });
}

export async function deleteAllShowAuths(uid) {
  return request(`/api/admin/v1/admins/${uid}/shows`, {
    method: 'DELETE',
  });
}
