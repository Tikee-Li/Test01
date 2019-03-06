// 变量设置
// var apiUrl = 'http://localhost:8080/xss-api';
// var apiUrl = 'http://192.168.1.86/xss-api';
// var fileUrl = 'http://192.168.1.86:81';
// var apiUrl = 'http://192.168.1.106:8080/xss-api';

var apiUrl = 'http://47.92.192.52:8081/xss-api';
var fileUrl = 'http://47.92.192.52:8082';

var accessToken = localStorage.getItem("token");
var MSG = JSON.parse(localStorage.getItem("MSG"));

// 计时器
var timer

// 首页初始化
// 左上角用户显示
function indexInit() {
  var wStatus
  var headimg = localStorage.headimg
  var data
  if(accessToken){
    // $$(".login-status-show").hide()
    wStatus = false;
    headimg = localStorage.headimg;
    if (!headimg) {
      headimg = "./img/index-head.png";
    }
  }else{
    wStatus = true;
    headimg = "./img/index-head.png";
  }
  data = {
    head: headimg,
    Status: wStatus
  };
  temp('#homePageUserHeadTemplate','#homePageUserHead',data)
}



  document.addEventListener("backbutton",gohome, false); 

// 监听buttonback点击事件
// document.addEventListener("backbutton",gohome goback, false); 
// 返回上一级
function gohome(){
  navigator.Backbutton.goHome(function() {
    console.log('success')
  }, function() {
    console.log('fail')
  });
}
// 返回上一个APP
function goback() {
  navigator.Backbutton.goBack(function() {
    console.log('success')
  }, function() {
    console.log('fail')
  });
}

function sureLoginOut() {
  if (accessToken) {
    app.dialog.confirm('确定退出吗',function(){
      clearLoginStatus();
    })
  } else {
    showNotificationFull("您还未登录！或已经退出登录。")
  }
}

function clearLoginStatus() {
 
    app.request({
      headers:{accessToken: accessToken},
      url: apiUrl + '/logout',
      type: 'post',
      async: true,
      // data: data,
      dataType: "json",
      success: function (response) {
      }
    })
    localStorage.clear();
    accessToken = ""; 
    showNotificationFull('退出成功！');
    setTimeout(function(){
      window.location.href = './index.html'
    },2000)
}



// 判断登录状态
function statusCode(response) {
  if(response.res401){
    unAuth()
  }
}

// 401 无权限弹窗
function unAuth() {
  app.dialog.alert("您还未登录！或者登录状态已过期，请重新登录。")
}
// 404 加载失败弹窗
function notFound() {
  app.dialog.alert("请求失败！请检查网络或稍后再试。")
}

//template7 模板处理
function temp(tempId, id, response) {
  var template = $$(tempId).html();
  var compiledTemplate = Template7.compile(template);
  var html = compiledTemplate(response);
  $$(id).html(html);
}

// 发送请求封装（同步）
function Ajax(url, sData) {
  var res;
  var accessToken = localStorage.getItem("token");
  var headers = {'accessToken': accessToken};
  app.request({
    headers:headers,
    url: apiUrl + url,
    type: 'post',
    async: false,
    data: sData,
    dataType: "json",
    success: function (response) {
      if (response.status) {
        res = response
        return res
      } else {
        app.dialog.alert(response.message);
      }
    },
    statusCode: {
      401: function() {
        unAuth()
      },
      404: function() {
        notFound()
      }
    }
  });
  return res
}

// 初始化 配置请求
app.request.setup({
  async: true,
  headers: {'accessToken': accessToken}
});
// 用户登录函数
function login(data) {
  app.request({
    url: apiUrl + '/login/mobile',
    type: 'post',
    data: data,
    dataType: "json",
    success: function (response) {
      if (response.status) {
        accessToken = response.data.accessToken;

        localStorage.setItem("token", response.data.accessToken);
        localStorage.setItem("loginName", response.data.loginUser.loginName);
        localStorage.setItem("id", response.data.loginUser.id);
        if (response.data.loginUser.headImg) {
          var head = fileUrl+response.data.loginUser.headImg
          localStorage.setItem("headimg", head);
        } else {
          var nohead = './img/index-head.png'
          localStorage.setItem("headimg", nohead);
        }
        // app.dialog.alert('登陆成功！')
        showNotificationFull('登录成功！');
        
        setTimeout(function(){
          window.location.href = "./index.html"
        },1000)

        indexInit(); 
        getUserInfoPersonal();
      } else {
        app.dialog.alert("登录失败，请重试！")
      }
    },
    statusCode: {
      404: function() {
        notFound()
      }
    }
  });
};

// 退出函数
function logout() {
  if (accessToken) {
    clearLoginStatus();
    if (!accessToken) {
      showNotificationFull('退出成功！');
    }
    setTimeout(function(){
      window.location.href = './index.html'
    },2000)
  } else {
    showNotificationFull('您还未登录！或已经退出登录。');
  }
};

function showNotificationFull(talk) {
  
  // Create notification
  if (!notificationFull) {
    var notificationFull = app.notification.create({
      // icon: '<i class="icon icon-f7"></i>',
      title: '友情提示',
      // titleRightText: 'now',
      subtitle: '',
      text: talk,
      closeTimeout: 3000,
    });
  }
  // Open it
  notificationFull.open();
}
// 购买产品激活
function buyToActivate(data) {
  app.request({
    headers:{accessToken: accessToken},
    url: apiUrl + '/order/add/prefecture',
    type: 'post',
    async: true,
    data: data,
    dataType: "json",
    success: function (response) {
      if (response.status) {
        showNotificationFull("注册成功！");
      } else {
        app.dialog.alert(response.message+",请登录激活！");
      }
    },
    error: function() {
      app.dialog.alert("注册失败，请重新注册！");
    },
    complete: function() {
      setTimeout(function(){
        window.location.href = "./index.html"
      },2000)
    }
  });
};

// 获取首页商品列表
function getIndexProduct() {
  app.request({
    url: apiUrl + '/pub/product/specialList',
    type: 'post',
    async: true,
    // data: data,
    dataType: "json",
    success: function (response) {
      if (response.status) {
        for (var i = 0; i < response.data.length; i++) {
          if (response.data[i].iconAttachment) {
            response.data[i].image = fileUrl + response.data[i].iconAttachment.filePath
          } else {
            response.data.image = './img/app-logo.png'
          }
        }
        temp('#indexProductTemplate','#indexProductShow',response)
      } else {
        app.dialog.alert("请求首页数据失败！请检查网络。");
      }
    },
    statusCode: {
      401: function() {
        res = {'res401':true}
      },
      404: function() {
        res = {'res404':true}
      }
    }
  });
}

// 购买
function indexBuy(type) {
  homeView.router.navigate('/index-buy/?type='+type)
}

// 首页 轮播图详情
function getIndexPic() {
  app.request({
    url: apiUrl + '/pub/carousel/list',
    type: 'post',
    async: true,
    // data: {id: id},
    dataType: "json",
    success: function (response) {
      if (response.status) {
        if (response.data.length>0) {
          for (var i = 0; i < response.data.length; i++) {
            response.data[i].img = fileUrl + response.data[i].commAttachment.filePath
          }
        } else {
          var data = [{img:'./img/app-logo.png'}];
          response.data = data;
        }
        temp('#showIndexPicTemplate','#showIndexPic',response)
        initSwiper();
      } else {
        app.dialog.alert(response.message);
      }
    },
    statusCode: {
      401: function() {
        unAuth()
      },
      404: function() {
        notFound()
      }
    }
  });
}

// 轮播图 动态实现封装
function initSwiper() {
  var swiper = new Swiper('.swiper-container', {
    spaceBetween: 30,
    centeredSlides: true,
    autoplay: {
      delay: 5000,
      disableOnInteraction: false,
    },
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    },
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
  });
}
// 商品 产品详情
function getProductDetail(id) {
  app.request({
    headers:{accessToken: accessToken},
    url: apiUrl + '/product/detail',
    type: 'post',
    async: true,
    data: {id: id},
    dataType: "json",
    success: function (response) {
      if (response.status) {
        if (response.data.introductionAttachment) {
          response.data.detailImg = fileUrl + response.data.introductionAttachment.filePath
        }else{
          response.data.detailImg = './img/app-logo.png'
        }
        if (response.data.imageList.length>0) {
          for (var i = 0; i < response.data.imageList.length; i++) {
            response.data.imageList[i].filePath = fileUrl + response.data.imageList[i].filePath
          }
          response.data.banner = response.data.imageList
        }else{
          response.data.banner = [{filePath: './img/app-logo.png'}]
        }
        temp('#showProductDetailTemplate','#showProductDetail',response.data);
        initSwiper();
      } else {
        app.dialog.alert(response.message);
      }
    }
  });
}


// 团队获取个人信息
function userTeamSelfContent(id) {
  app.request({
    headers:{accessToken: accessToken},
    url: apiUrl + '/pub/user/detail',
    type: 'post',
    async: true,
    data: {id:id},
    dataType: "json",
    success: function (response) {
      if (response.status) {
        if (response.data.head_image) {
          response.data.headImg = fileUrl + response.data.head_image
        } else {
          response.data.headImg = "./img/index-head.png"
        }
        temp('#userTeamSelfContentTemplate','#userTeamSelfContent',response.data)
      } 
    },
    error: function () {localStorage.clear();accessToken=""},
  });
}


// 我的团队【需登录】
function getMyTeam(id) {
  app.request({
    headers: {accessToken: accessToken},
    url: apiUrl + '/pub/sellerRelation/list',
    type: 'post',
    async: true,
    data: {id: id},
    dataType: "json",
    success: function (response) {
      if (response.status) {
        for (var i = 0; i < response.data.length; i++) {
          if (!response.data[i].HEAD_IMG_PATH) {
            response.data[i].HEAD_IMG_PATH = './img/index-head.png'
          }else{
            response.data[i].HEAD_IMG_PATH = fileUrl+response.data[i].HEAD_IMG_PATH
          }
          if (!response.data[i].USER_NAME) {
            response.data[i].USER_NAME = ""
          }
        }
        temp('#userTeamContentTemplate','#userTeamContent',response)
      } else {
        app.dialog.alert("获取我的团队列表失败！");
      }
    },
    statusCode: {
      401: function() {
        unAuth()
      },
      404: function() {
        notFound()
      }
    }
  });
}

// 我的团队数据加载
function userGetTeamMember(id) {
  userTeamSelfContent(id);
  getMyTeam(id);
}

// 我的推荐【需登录】
function getMyRecommend() {
  app.request({
    headers:{accessToken: accessToken},
    url: apiUrl + '/pub/apply/list',
    type: 'post',
    async: true,
    // data: {id: id},
    dataType: "json",
    success: function (response) {
      if (response.status) {
        temp('#myRecommendTemplate','#userRecommendHis',response.data)
      } else {
        app.dialog.alert(response.message);
      }
    },
    statusCode: {
      401: function() {
        unAuth()
      },
      404: function() {
        notFound()
      }
    }
  });
}

function openThird() {
  var id = localStorage.id
  app.request({
    headers:{accessToken: accessToken},
    url: apiUrl + '/seller/open',
    type: 'post',
    async: true,
    data: {userId: id},
    dataType: "json",
    success: function (response) {
      if (response.status) {
        showNotificationFull("开通第三市场成功！");
        personalView.router.refreshPage();
      } else {
        app.dialog.alert(response.message);
      }
    },
    statusCode: {
      401: function() {
        unAuth()
      },
      404: function() {
        notFound()
      }
    }
  });
}


// 提现申请
function userWithdrawApply(num) {
  app.request({
    headers:{accessToken: accessToken},
    url: apiUrl + '/extract/apply',
    type: 'post',
    async: true,
    data: {money: num},
    dataType: "json",
    success: function (response) {
      if (response.status) {
        showNotificationFull("提交成功！");
        personalView.router.back()
      } else {
        app.dialog.alert(response.message);
      }
    },
    statusCode: {
      401: function() {
        unAuth()
      },
      404: function() {
        notFound()
      }
    }
  });
}


// 当前登录用户详情-个人资料
function getUserInfo(){
  var id = localStorage.id
  app.request({
    headers:{accessToken: accessToken},
    url: apiUrl + '/user/detail',
    type: 'post',
    async: true,
    data: {id:id},
    dataType: "json",
    success: function (response) {
      if (response.status) {
        response.data.headImg = localStorage.headimg
        var mobile = response.data.mobile
        var NewMobile =""
        for (var i = 0; i < mobile.length; i++) {
          if(i < 3 || i >= mobile.length-4){
                NewMobile += mobile[i];
            }else{
                NewMobile += '*';
            }
        }
        response.data.mobile = NewMobile
        temp('#userInfoShowTemplate','#userInfoShow',response.data)
      } else {
        app.dialog.alert(response.message);
      }
    },
    statusCode: {
      401: function() {
        unAuth()
      },
      404: function() {
        notFound()
      }
    }
  });
}
// 我的页面-个人资料
function getUserInfoPersonal(){
  var id = localStorage.id
  app.request({
    headers:{accessToken: accessToken},
    url: apiUrl + '/pub/user/detail',
    type: 'post',
    async: true,
    data: {id:id},
    dataType: "json",
    success: function (response) {
      if (response.status) {
        var head = response.data.head_image;
        if (head) {
          response.data.headImg =fileUrl +  head;
        } else {
          response.data.headImg = './img/index-head.png';
        }
        localStorage.setItem("activate_status",response.data.activate_status)
        temp('#userPersonalInfoTemplate','#userPersonalInfo',response.data)
      } else {
        app.dialog.alert("加载用户信息失败！");
      }
    },
    error: function () {localStorage.clear();accessToken=""},
    statusCode: {
      401: function() {
        showNotificationFull("未登录！")
      },
      404: function() {
        showNotificationFull("网络连接失败。")
      }
    }
  });
}

// 更换手机号
function userChangePhone(mobile){
  var id = localStorage.id
  app.request({
    headers:{accessToken: accessToken},
    url: apiUrl + '/pub/user/update',
    type: 'post',
    async: true,
    data: {id:id,mobile:mobile},
    dataType: "json",
    success: function (response) {
      if (response.status) {
        app.dialog.alert('手机号码更换成功！请使用新号码重新登录！');
        clearLoginStatus();
        setTimeout(function(){
          window.location.href = "./index.html"
        },2000)
      } else {
        showNotificationFull('手机号码更换失败！');
      }
    },
    error: function () {localStorage.clear();accessToken=""},
    statusCode: {
      401: function() {
        unAuth()
      },
      404: function() {
        notFound()
      }
    }
  });
}

// 获取验证码
function getVerifyCode(data) {
  app.request({
    url: apiUrl + '/comm/sms/send/code',
    type: 'post',
    async: true,
    data: {mobile:data},
    dataType: "json",
    success: function (response) {
      if (response.status) {
        showNotificationFull("发送成功！")
      } else {
        showNotificationFull("发送失败！请重试。")
      }
    },
  })
}

// 上传图片
function changeHeadImg() {
  formData = new FormData($$('#upfile')[0])
  if (formData) {
    app.request({
      headers: {accessToken: accessToken},
      url: apiUrl + '/attachment/upload',
      type: 'post',
      contentType:"multipart/form-data",
      async: true,
      data: formData,
      dataType: "json",
      success: function (response) {
        if (response.status) {
          if (response.data) {
            updateUserHeadImg(response.data[0].id);
            if (response.data[0].filePath) {
              var newHead = fileUrl+response.data[0].filePath
              localStorage.setItem("headimg", newHead);
            }
            personalView.router.refreshPage();
            indexInit();
            getUserInfoPersonal();
          } else {
            showNotificationFull("上传头像失败！")
          }
            
        }
      },
    }) 
  }             
}

// 更新头像
function updateUserHeadImg(picid) {
  var id = localStorage.id
  app.request({
    headers: {accessToken: accessToken},
    url: apiUrl + '/pub/user/update',
    type: 'post',
    async: true,
    data: {id:id,headPortrait:picid},
    dataType: "json",
    success: function (response) {
      if (response.status) {
        showNotificationFull("更换头像成功！");
      } else {
        app.dialog.alert("更换头像失败！请重试。");
      }
    }
  }) 
}
