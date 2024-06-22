import { _request } from '../axios/index';

// 保存
export const blackAdd = (params) => {
  return _request('post', `/deploy/black/add`, params);
};

// 删除
export const blackDelete = (params) => {
	return _request('get', `/deploy/black/delete?ids=${params}`);
};

// 删除
export const blackBatchDeletion = (params) => {
	return _request('get', `/deploy/black/delete?ids=${params}`);
};

// 列表
export const queryConditionList = (params) => {
	return _request('post', `/deploy/black/list/condition`, params);
};

// 更新
export const blackUpdate = (params) => {
	return _request('post', `/deploy/black/update`, params);
};

// 获取环境
export const queryEnvs = () => {
	return _request('get', `/env/get`);
};

// 获取人
export const queryPersonnel = (param) => {
	return _request('get', `/user/tenant-member/${param}`);
};
