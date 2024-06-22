const getters = {
  sidebar: (state) => state.app.sidebar,
  device: (state) => state.app.device,
  token: (state) => state.user.token,
  avatar: (state) => state.user.avatar,
  name: (state) => state.user.username,
  roles: (state) => state.user.roles,
  permission_routers: (state) => state.permission.routers,
  addRouters: (state) => state.permission.addRouters,
	
	// 存储  处理与参与者中心解耦-登录的值
	authLoginToken: (state) => state.authLogin.authLoginToken,
	authLoginTenantId: (state) => state.authLogin.authLoginTenantId,
	authLoginUserId: (state) => state.authLogin.authLoginUserId,
	authLoginUserName: (state) => state.authLogin.authLoginUserName,
}
export default getters
