import { _request } from '../axios/index';

// 登录
export const authFallbackLogin = (params) => {
	return _request('post', `/auth_fallback/login`, params);
};

// 获取tenantID
export const tenantList = (params) => {
	return _request('get', `/auth_fallback/tenant/list`);
};
