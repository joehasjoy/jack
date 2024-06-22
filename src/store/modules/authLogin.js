const authLogin = {
	state: {
		authLoginTenantId: localStorage.authLoginTenantId ? localStorage.authLoginTenantId : '',
		authLoginUserId: localStorage.authLoginUserId ? localStorage.authLoginUserId : '',
		authLoginUserName: localStorage.authLoginUserName ? localStorage.authLoginUserName : '',
		authLoginToken: localStorage.authLoginToken ? localStorage.authLoginToken : '',
	
	},
	
	mutations: {
		changeLogin (state, user) {
			state.authLoginToken = user.authLoginToken;
			state.authLoginUserId = user.authLoginUserId;
			state.authLoginTenantId = user.authLoginTenantId;
			state.authLoginUserName = user.authLoginUserName;
			
			localStorage.setItem('authLoginToken', user.authLoginToken);
			localStorage.setItem('authLoginUserId', user.authLoginUserId);
			localStorage.setItem('authLoginTenantId', user.authLoginTenantId);
			localStorage.setItem('authLoginUserName', user.authLoginUserName);
		},
		
		removeStorage: (state) => {
			localStorage.clear();
		},
	},
	actions: {
	
	},
}

export default authLogin
