Date.prototype.Format = function(fmt) { // author: meizz
    var o = {
        "M+": this.getMonth() + 1, // 月份
        "d+": this.getDate(), // 日
        "h+": this.getHours(), // 小时
        "m+": this.getMinutes(), // 分
        "s+": this.getSeconds(), // 秒
        "q+": Math.floor((this.getMonth() + 3) / 3), // 季度
        "S": this.getMilliseconds() // 毫秒
    };
    if (/(y+)/.test(fmt))
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "")
            .substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt))
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
};

// app
function main() {
    addcss = function(css) {
        var cs = document.createElement("style");
        cs.rel = "stylesheet";
        cs.type = "text/css";
        cs.textContent = css;
        document.getElementsByTagName("head")[0].appendChild(cs);
    };
    addcss(appcss);
    G.app = angular.module("appModule", ["ui.router",
        "angularjs-dropdown-multiselect", 'ngSanitize', 'ui.bootstrap'
    ]);

	loadFileControllers();

    G.app.filter('marked', function() {
        return function(rawString) {
            if (rawString) {
                return marked(rawString);
                // return '<p>' + rawString.replace(/\r\n/g,
                // "</p><p>").replace(/\n/g, "</p><p>") + '</p>';
            } else {
                return "";
            }
        };
    })
    .filter('formatTime', function() {
        return function(time) {
        	var newDate = new Date();
    		newDate.setTime(time);
        	return newDate.toLocaleTimeString();
        };
    })
    .filter('onedayformatTime', function() {
        return function(time) {
        	if(!isNaN(time)){
        		var date = new Date(time);
            	Y = date.getFullYear() + '-';
            	M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
            	D = date.getDate() + ' ';
            	h = date.getHours() + ':';
            	m = date.getMinutes() + ':';
            	s = date.getSeconds();
            	return Y+M+D+h+m+s;
        	}else{
        		return time;

        	}
        }   ;
    })
    .filter('formatWorkTime', function() {
        return function(time) {
        	if(time===0){
        		return time+"h" ;
        	}else{
        		var hour=null;
        		if((time/1000)%3600===0){
        			 hour =(time/1000/3600)+"h";
        		}else{
        			 hour =(time/1000/3600).toFixed(1)+"h";
        		}
            	return hour;
        	}
        };
    });


    var div = document.getElementById("LeitherBody");
    div.innerHTML = mainhtml;

    // init SysAPI
    initSysAPI(window.OAAppInstances = window.OAAppInstances || {}, jQuery, G).load();
    OAApp.GetUserListAsync().then(function(s){
      startup();
      angular.bootstrap(document, ['appModule']);
      initAction();
    },function(e){
      debug.warn(e);
    });

    // jQuery Actions, needs to be reimplemented in controllers
    // 左侧导航栏
    $(".leftnav li").click(function() {
        $(this).children().children("span").removeClass("hide");
        $(this).siblings().children().children("span").addClass("hide");
    });

    // 标记完成未完成
    $(".mark").click(function() {
        $(this).children(".mark-list").show();
    });

    $(".mark-list li").click(function() {
        var mys = $(this).html();
        $(this).parents(".mark-list").siblings(".no-end").html(mys);
    });

    // 打印报表的任务弹出层
    $(".task-alert").click(function() {
        $(".form-main").animate({
            width: 'toggle'
        }, "fast");
    });

}

function startup() {
    debug.log("app startup ...");
    G.app.config(
      [
        "$stateProvider",
        "$logProvider",
        "$urlRouterProvider",
        "$compileProvider",
        function($stateProvider, $logProvider,
            $urlRouterProvider, $compileProvider) {
            $stateProvider.state("home", {
                url: "/home",
                templateUrl: "home.html",
                controller: "homeController"
            }).state("task", {
                url: "/task",
                templateUrl: "task.html",
                controller: "appController"
            }).state("sign", {
                url: "/sign",
                templateUrl: "sign.html",
                controller: "signController"
            }).state("file", {
                url: "/file",
                templateUrl: "file.html",
                controller: "fileController"
            }).state("apps", {
                url: "/apps",
                templateUrl: "apps.html",
                controller: "appsController"
            }).state("newuser", {
                url: "/newuser",
                templateUrl: "newuser.html",
                controller: "newUser"
            });
           var urlstate= location.href.slice(location.href.lastIndexOf("#/")+2);
         if(urlstate=="task"){
        	 $("#taskpage").children("span").removeClass("hide");
        	 $("#taskpage").siblings().children("span").addClass("hide");

         }else if(urlstate=="home"){
        	 $("#homepage").children("span").removeClass("hide");
        	 $("#homepage").siblings().children("span").addClass("hide");
         }else if(urlstate=="sign"){
        	 $("#signpage").children("span").removeClass("hide");
        	 $("#signpage").siblings().children("span").addClass("hide");
         }else if(urlstate=="file"){
        	 $("#filepage").children("span").removeClass("hide");
        	 $("#filepage").siblings().children("span").addClass("hide");
         }else if(urlstate=="apps"){
        	 $("#apps").children("span").removeClass("hide");
        	 $("#apps").siblings().children("span").addClass("hide");
         }
            $urlRouterProvider.otherwise("/home");

          }
      ]).controller("appController", function($rootScope, $sce) {
        taskApp($rootScope);
        fileApp($rootScope);
      }).controller("homeController", function($scope, $sce) {
        $scope.homeNumBtns = 10;
        $scope.homeItemsPerPage = 10;
        $scope.homeCurrentPage = $scope.homeCurrentPage||1;
        $scope.homeChangePage = function() {
          debug.log('Page changed to: ' + $scope.homeCurrentPage);
        };
      }).controller("signController",function($scope, $q) {
        checkinApp($scope, $q);
      }).controller("newUser",function($scope, $q) {

      });
}

// load content here
function loadAppContent(bid, key, $scope, $sce) {
    // TODO:
    G.api.getvar(G.sid, "usernearby", function(data) {
        console.log(data);
    }, function(n, e) {
        console.log(n + e);
    });
}
