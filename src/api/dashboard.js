import { _request } from '../axios/index';

// 应用列表
export const getMyAppsApi = () => {
  return _request('get', `/home-page/myapps`);
};

export const getMyAppsRole = () => {
  return _request('get', `/home-page/apps/role`);
};

// 获取token
export const getTokenApi = () => {
  return _request('get', `/api/1.0/getToken`);
};

// 看板数据
export const getDashboardInfoApi = () => {
  return _request('get', `/dashboard/cluster/info`);
};

// 业务域数据
export const singleDataApi = (data) => {
  return _request('post', `/dashboard/cluster/info/single`, data);
};

// 应用详情
export const appDetailApi = (data) => {
  return _request('get', `/dashboard/cluster/info/cluster/${data.clusterId}/team/${data.domainId}/${data.domainName}`);
};
