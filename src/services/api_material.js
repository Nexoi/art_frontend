/**
 * Created by neo on 7/3/2018.
 */
import request from '../utils/request';

/* 素材／文件夹 */
export async function listFolders(type) {
  return request(`/api/admin/v1/material/folder/${type}`, {
    method: 'GET',
  });
}

export async function addFolder(payload) {
  const { type, folderName } = payload;
  return request(`/api/admin/v1/material/folder/${type}?name=${folderName}`, {
    method: 'POST',
  });
}

export async function changeFolderName(payload) {
  const { type, folderId, folderName } = payload;
  return request(`/api/admin/v1/material/folder/${type}/${folderId}?name=${folderName}`, {
    method: 'PUT',
  });
}

export async function deleteFolder(payload) {
  const { type, folderId } = payload;
  return request(`/api/admin/v1/material/folder/${type}/${folderId}`, {
    method: 'DELETE',
  });
}

/* 素材／音频 */
export async function addAudio(payload) {
  const { folderId, url, size, name, length } = payload;
  return request(`/api/admin/v1/material/audio?folderId=${folderId}&url=${url}&size=${size}&name=${name}&length=${length}`, {
    method: 'POST',
  });
}

export async function listAudios(payload) {
  const { folderId, page, size } = payload;
  if (folderId === 0) {
    return request(`/api/admin/v1/material/audio/list?page=${page}&size=${size}`, {
      method: 'GET',
    });
  } else {
    return request(`/api/admin/v1/material/audio/list?folderId=${folderId}&page=${page}&size=${size}`, {
      method: 'GET',
    });
  }
}

export async function getAudio(audioId) {
  return request(`/api/admin/v1/material/audio/${audioId}`, {
    method: 'GET',
  });
}

export async function changeAudioName(payload) {
  const { audioId, name } = payload;
  return request(`/api/admin/v1/material/audio/${audioId}?name=${name}`, {
    method: 'PUT',
  });
}

export function deleteAudio(audioId) {
  return request(`/api/admin/v1/material/audio/${audioId}`, {
    method: 'DELETE',
  });
}
export async function deleteAllAudios(audioIds) {
  return request(`/api/admin/v1/material/audio?audioIds=${audioIds}`, {
    method: 'DELETE',
  });
}

/* 素材／视频 */
export async function addVideo(payload) {
  const { folderId, url, size, name, length } = payload;
  return request(`/api/admin/v1/material/video?folderId=${folderId}&url=${url}&size=${size}&name=${name}&length=${length}`, {
    method: 'POST',
  });
}

export async function listVideos(payload) {
  const { folderId, page, size } = payload;
  if (folderId === 0) {
    return request(`/api/admin/v1/material/video/list?page=${page}&size=${size}`, {
      method: 'GET',
    });
  } else {
    return request(`/api/admin/v1/material/video/list?folderId=${folderId}&page=${page}&size=${size}`, {
      method: 'GET',
    });
  }
}

export async function getVideo(videoId) {
  return request(`/api/admin/v1/material/video/${videoId}`, {
    method: 'GET',
  });
}

export async function changeVideoName(payload) {
  const { videoId, name } = payload;
  return request(encodeURI(`/api/admin/v1/material/video/${videoId}?name=${name}`), {
    method: 'PUT',
  });
}

export async function deleteVideo(videoId) {
  return request(`/api/admin/v1/material/video/${videoId}`, {
    method: 'DELETE',
  });
}
export async function deleteAllVideos(videoIds) {
  return request(`/api/admin/v1/material/video?videoIds=${videoIds}`, {
    method: 'DELETE',
  });
}

/* 素材／图片 */
export async function addImage(payload) {
  const { folderId, url, name, width, height } = payload;
  return request(`/api/admin/v1/material/image?folderId=${folderId}&width=${width}&height=${height}&url=${url}&name=${name}`, {
    method: 'POST',
  });
}

export async function listImages(payload) {
  const { folderId, page, size } = payload;
  if (folderId === 0) {
    return request(`/api/admin/v1/material/image/list?page=${page}&size=${size}`, {
      method: 'GET',
    });
  } else {
    return request(`/api/admin/v1/material/image/list?folderId=${folderId}&page=${page}&size=${size}`, {
      method: 'GET',
    });
  }
}

export async function getImage(imageId) {
  return request(`/api/admin/v1/material/image/${imageId}`, {
    method: 'GET',
  });
}

export async function changeImageName(payload) {
  const { imageId, name } = payload;
  return request(`/api/admin/v1/material/image/${imageId}?name=${name}`, {
    method: 'PUT',
  });
}

export async function deleteImage(imageId) {
  return request(`/api/admin/v1/material/image/${imageId}`, {
    method: 'DELETE',
  });
}
export async function deleteAllImages(imageIds) {
  return request(`/api/admin/v1/material/image?imageIds=${imageIds}`, {
    method: 'DELETE',
  });
}
