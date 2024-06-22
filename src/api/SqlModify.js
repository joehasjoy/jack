import { _request } from '../axios/index';

// 在线查询 库名
export const queryLibraryTables = (params) => {
	return _request('post', `/dms/execute/query/tables`, params);
};

// 根据sql 查询数据
export const queryDataBySql = (params) => {
	return _request('post', `/middleware/middlewares/dms/queryDataBySql`, params);
};

/*export const  = () => {
	return _request('get', ``);
};*/
