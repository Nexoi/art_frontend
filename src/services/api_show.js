/**
 * Created by neo on 15/3/2018.
 */
import request from '../utils/request';

export async function searchShows(payload) {
  const { page, size, word } = payload;
  if (word === undefined || word.length === 0) {
    return request(`/api/admin/v1/show/search?page=${page}&size=${size}`, {
      method: 'GET',
    });
  } else {
    return request(`/api/admin/v1/show/search?page=${page}&size=${size}&word=${word}`, {
      method: 'GET',
    });
  }
}

export async function addShow(payload) {
  const { title, showHallName, startTime, endTime, posterImageId, introduceText } = payload;
  return request(`/api/admin/v1/show?posterImageId=${posterImageId}&title=${title}&showHallName=${showHallName}&startTime=${startTime}&endTime=${endTime}&introduceText=${introduceText}`, {
    method: 'POST',
  });
}

export async function updateShow(payload) {
  const { showId, title, showHallName, startTime, endTime, posterImageId, introduceText } = payload;
  return request(`/api/admin/v1/show/${showId}?posterImageId=${posterImageId}&title=${title}&showHallName=${showHallName}&startTime=${startTime}&endTime=${endTime}&introduceText=${introduceText}`, {
    method: 'PUT',
  });
}

export async function getShow(showId) {
  return request(`/api/admin/v1/show/${showId}`, {
    method: 'GET',
  });
}

export async function deleteShow(showId) {
  return request(`/api/admin/v1/show/${showId}`, {
    method: 'DELETE',
  });
}
