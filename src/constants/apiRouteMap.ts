export type ApiRouteMap = typeof apiRouteMap;

const apiRouteMap = {
  bookmark: '/api/bookmark', // get 获取书签， post 保存书签
  login: '/api/login', // post 登陆，delete 登出
};

export default apiRouteMap;
