// Dom7
var $$ = Dom7;

// Theme
var theme = 'ios';
// if (document.location.search.indexOf('theme=') >= 0) {
//   theme = document.location.search.split('theme=')[1].split('&')[0];
// }

// Init App
var app = new Framework7({
  id: 'io.framework7.testapp',
  root: '#app',
  theme: theme,
  precompileTemplates: true,
  template7Pages: true,
  view: {
    stackPages: true, 
  },
  dialog: {
    title: '提示',
    buttonOk: '确定',
    buttonCancel: '取消'
  },
  data: function () {
    return {
      noEvent: "no-event",
      user: {
        firstName: 'John',
        lastName: 'Doe',
      },
    };
  },
  methods: {
    helloWorld: function () {
      app.dialog.alert('Hello World!');
    },
  },
  routes: routes,
  vi: {
    placementId: 'pltd4o7ibb9rc653x14',
  },
});

// Init/Create views
var homeView = app.views.create('#view-home', {
  url: '/'
});
var communityView = app.views.create('#view-community', {
  url: '/community/'
});
var discussView = app.views.create('#view-shop', {
  url: '/shop/'
});
var personalView = app.views.create('#view-personal', {
  url: '/personal/'
});

function clickToPage(){
  app.router.navigate({  //加载单独页面page
    url: '/calendar-page/?page=1',
  })
};


// 首页幻灯片设定
// var swiper = app.swiper.create('.swiper-container', {
//   autoplay: {
//     delay: 500,
//   },
//   speed: 500,
//   spaceBetween:00 ,
//   loop: true,

// });


function goToLogin() {
  var id = localStorage.id
  app.request({
    headers: {accessToken: accessToken},
    url: apiUrl + '/pub/user/detail',
    type: 'post',
    async: true,
    data: {id:id},
    dataType: "json",
    success: function (response) {
        showNotificationFull("您已登录!")
    },
    error: function() {
    },
    statusCode: {
      400: function() {
        homeView.router.navigate('/login/')
      },
      401: function() {
        homeView.router.navigate('/login/')
      },
    }
  });
}

// 正则
var reg = {
  // 去空格
  deleteSpace: function(str) {
    return str.replace(/\s/g,"");
  },
  // 检测是否包含空格
  noSpace: function(str) {
    return this.deleteSpace(str)==str;
  },
  // 手机
  checkPhone:function(phone){ 
    return (/^1[34578]\d{9}$/.test(phone));
  },
  // 验证码
  checkCode:function(code) {
    return  (/^\d{6}\b/.test(code));
  },
  // 银行卡
  checkBankCard:function(code) {
    return  (/^(\d{16}|\d{17}|\d{18}|\d{19})$/.test(code));
  },
  // 第一位为字母
  checkFirstLetter: function(str) {
    return (/^([a-zA-Z][a-zA-Z0-9]{5})$/.test(str));
  },
  // 控制密码位数
  checkPassNum: function(str) {
    return (/^[a-zA-Z0-9]{6,18}$/.test(str));
  }
}

//双击退出应用
//调用h5+
function plusReady() {
// 监听“返回”按钮事件
    plus.key.addEventListener("backbutton", function() {
      homeView.router.back()
    }); // 在这里调用plus api
}
if (window.plus) {
    plusReady();
} else {
    document.addEventListener('plusready', plusReady, false);
}
var first = null;
mui.back = function() {
//首次按键，提示‘再按一次退出应用’
    if (!first) {
        first = new Date().getTime();
        // mui.toast('再按一次退出应用');
        setTimeout(function() {
            first = null;
        }, 1000);
    } else {
        if (new Date().getTime() - first < 1000) {
            plus.runtime.quit();
        }
    }
};
