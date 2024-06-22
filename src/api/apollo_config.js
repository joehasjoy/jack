import { _request } from '../axios/index';

// 保存
export const apolloAdd = (params) => {
  return _request('post', `/apollo/history/add`, params);
};

// 保存
export const apolloUpadte = (params) => {
  return _request('post', `/apollo/history/update`, params);
};

// 删除
export const apolloDel = (params) => {
	return _request('post', `/apollo/history/delete`, params);
};
// 获取历史记录
export const queryChangeHistory = (params) => {
	return _request('post', `/apollo/history/changeHistory`, params);
};

// 获取历史记录详情
export const queryChangeHistoryDetail = (params) => {
	return _request('post', `/apollo/history/changeHistoryDetail`, params);
};

// 发布
export const apolloPublish = (params) => {
	return _request('post', `/apollo/history/publish`, params);
};
// 列表
export const apolloAllConfigList = (params) => {
	return _request('post', `/apollo/history/all/config`, params);
};

export const queryEnvs = () => {
	return _request('get', `/env/get`);
};
