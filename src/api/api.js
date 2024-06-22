import {
  _request
} from '../axios/index';

// 发布历史
export const getBuildHistoryApi = (params) => {
  return _request('get', `/app-deploy-version/version/records`, undefined, params);
};
// 重启日志
export const getBuildRestartList = (params) => {
  return _request('post', `/appDeploy/reload/list`, params);
};

// 回滚版本 
export const rollbackApi = (params) => {
  return _request('post', `/app-deploy-version/version/rollback/${params.appDeployId}`, params);
};
// 获取环境列表
export const roleEnvPermissonAPi = (env) => {
  return _request('get', `/env/get/permission/${env}`);
};
// 动态扩缩容列表
export const hpaListApi = (params,appId) => {
  return _request('post', `/hosts/dynamic/size/list/condition/`+appId, params);
};

// 获取环境列表
export const envListAPi = () => {
  return _request('get', `/env/get`);
};

// 获取命名空间
export const namespaceListAPi = (appId) => {
  return _request('get', `/appDeploy/deploy/${appId}`);
};

// 新增hpa
export const addNewHpaAPi = (params) => {
  return _request('post', `/hosts/dynamic/size/add`, params);
};

// 修改hpa
export const modifyHpaAPi = (params) => {
  return _request('post', `/hosts/dynamic/size/update`, params);
};

// 删除hpa
export const deleteHpaAPi = (params) => {
  return _request('post', `/hosts/dynamic/size/delete`, params);
};

// 新增应用关联
export const addDependAPi = (params) => {
  return _request('post', `/apprelmiddleware/rel/middleware`, params);
};

// 删除应用关联
export const deleteDependAPi = (id,appId) => {
  return _request('get', `/apprelmiddleware/rel/middleware/del/${id}/${appId}`);
};

// 应用关联查询
export const getDependAPi = (appCode,appId) => {
  return _request('get', `/apprelmiddleware/rel/middleware/list/${appCode}/${appId}`);
};

//获取集群
export const getMysqlApi = (type,dev) => {
  return _request('get', `/middleware/${type}/${dev}`);
};

// 获取数据库列表
export const getDmsApi = (ip) => {
  return _request('get', `/middleware/middlewares/dms/${ip}`);
};
// 添加中间件
export const addMiddleApi = (data) => {
  return _request('post', `/middleware/save`, data);
};

// 修改中间件
export const modifyMiddleApi = (data) => {
  return _request('post', `/middleware/update`, data);
};

// 删除主从节点
export const deleteNodeApi = (id) => {
  return _request('get', `/middleware/middlewares/delete/node/${id}`);
};

// 主从节点设置列表
export const getNodeListApi = (id) => {
  return _request('get', `/middleware/middlewares/list/node/${id}`);
};
// 新增主从节点
export const addNodeApi = (data) => {
  return _request('post', `/middleware/middlewares/add/node`, data);
};


