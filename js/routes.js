var routes = [
  // Index page
  {
    path: '/',
    componentUrl: './pages/home.html',
  },
  // 重定向到 home
  {
    path: '/re-home/',
    redirect: '/',
  },
  // 重定向到 personal
  {
    path: '/re-personal/',
    redirect: '/personal/',
  },
  // 社区 Tab
  {
    path: '/community/',
    componentUrl: './pages/community.html',
  },
  // 商城 Tab
  {
    path: '/shop/',
    componentUrl: './pages/shop.html',
  },
  // 我的 Tab
  {
    path: '/personal/',
    componentUrl: './pages/personal.html',
  },
  // 登录 页面
  {
    path: '/login/',
    componentUrl: './pages/login.html',
  },
  // 找回密码 页面
  {
    path: '/find-pass/',
    componentUrl: './pages/find-back-pass.html',
  },
  // 注册 页面
  {
    path: '/signin/',
    componentUrl: './pages/signin.html',
  },
  // 招商加盟 页面
  {
    path: '/attract-inv/',
    componentUrl: './pages/attract-investment.html',
  },
  // 推荐购买 页面
  {
    path: '/index-recomm-buy/',
    componentUrl: './pages/index-recomm-buy.html',
  },
  // 专区购买 页面
  {
    path: '/index-buy/',
    componentUrl: './pages/index-buy.html',
  },
  // 财务管理 页面
  {
    path: '/financial-management/',
    componentUrl: './pages/financial-management.html',
  },
  // 积分提现 页面
  {
    path: '/withdraw-user-count/',
    componentUrl: './pages/withdraw-user-count.html',
  },
  // 添加银行卡 页面
  {
    path: '/add-bank-card/',
    componentUrl: './pages/add-bank-card.html',
  },
  // 提现记录 页面
  {
    path: '/withdraw-history/',
    componentUrl: './pages/withdraw-history.html',
  },
  // 积分明细 页面
  {
    path: '/with-count-detail/',
    componentUrl: './pages/with-count-detail.html',
  },
  // 我的推荐 页面
  {
    path: '/user-recommend/',
    componentUrl: './pages/user-recommend-history.html',
  },
  // 关于我们 页面
  {
    path: '/about-us/',
    componentUrl: './pages/about-us.html',
  },
  // 个人资料 页面
  {
    path: '/user-info/',
    componentUrl: './pages/user-info.html',
  },
  // 更改手机号 前的验证密码 页面
  {
    path: '/user-change-phone-before/',
    componentUrl: './pages/user-change-phone-sure-pass.html',
  },
  // 更改手机号 页面
  {
    path: '/user-change-phone/',
    componentUrl: './pages/user-change-phone.html',
  },
  // 账号转让 页面
  {
    path: '/user-account-transfer/',
    componentUrl: './pages/user-account-transfer.html',
  },
  // 修改密码 页面
  {
    path: '/user-change-pass/',
    componentUrl: './pages/user-change-pass.html',
  },
  // 我的团队 页面
  {
    path: '/user-team/',
    componentUrl: './pages/user-team.html',
  },
  // 我的 激活页面
  {
    path: '/user-activate/',
    componentUrl: './pages/user-activate.html',
  },
  // Default route (404 page). MUST BE THE LAST
  {
    path: '(.*)',
    url: './pages/404.html',
  },
];
