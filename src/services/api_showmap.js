/**
 * Created by neo on 12/3/2018.
 */
import request from '../utils/request';

export async function listShowMaps(payload) {
  const { page, size } = payload;
  return request(`/api/admin/v1/show/maps?page=${page}&size=${size}`, {
    method: 'GET',
  });
}

export async function addShowMap(payload) {
  const { name, showHallName, width, height, imageId } = payload;
  return request(`/api/admin/v1/show/maps?name=${name}&showHallName=${showHallName}&width=${width}&height=${height}&imageId=${imageId}`, {
    method: 'POST',
  });
}

export async function getShowMap(mapId) {
  return request(`/api/admin/v1/show/maps/${mapId}`, {
    method: 'GET',
  });
}

export async function updateShowMap(payload) {
  const { mapId, name, showHallName, width, height, imageId } = payload;
  return request(`/api/admin/v1/show/maps/${mapId}?name=${name}&showHallName=${showHallName}&width=${width}&height=${height}&imageId=${imageId}`, {
    method: 'PUT',
  });
}

export async function deleteShowMap(mapId) {
  return request(`/api/admin/v1/show/maps/${mapId}`, {
    method: 'DELETE',
  });
}
