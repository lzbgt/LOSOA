function taskApp($rootScope) {
    $scope = $rootScope;
    $scope.G = G;

    fileAction($rootScope);

    $scope.msgclick = function(msg, $event){
        if(msg.msgType == $scope.GetFileMsgType()){
            $scope.fileclick(msg);
        }else if(msg.msgType == $scope.GetTaskMsgType()){

        }else if (msg.msgType == $scope.GetCheckInMsgType()){

        }else{
          debug.log("clicked: ", $event, msg);
        }
    };

    $scope.MsgTypeToCssClass = function(msg){
      if(!msg.receivers||msg.receivers.length === 0){
        msg.receivers = [G.uid];
      }
      if(msg.msgType == OAApp.GetTaskMsgType()){
        if(msg.receivers[0].uid == G.uid)
          return "bor-top";
      }else if (msg.msgType == OAApp.GetFileMsgType()){
        return "bor-topz";
      }else if (msg.msgType == OAApp.GetCheckInMsgType()){
        return "bor-topl";
      }
    };

    //
    $scope.Date = function(ts) {
        if (ts)
            return new Date(ts);
        else
            return new Date();
    };
    //
    $scope.TimeFromNow = function(ts) {
      d = Date.now() - ts;
      var ret = "";
      var suffix = "前";
      if (d < 0) {
        suffix = "后";
        d = -d;
      }
      if (d < 2 * 60 * 1000) {
        ret = "刚刚";
      } else if (d < 60 * 1000 * 60) {
        ret = "" + (Math.floor(d / 1000 / 60)) + "分钟" + suffix;
      } else if (d < 60 * 1000 * 60 * 24) {
        ret = "" + (Math.floor(d / 1000 / 60 / 60)) + "小时" + suffix;
      } else if (d < 60 * 1000 * 60 * 24 * 365) {
        ret = "" + (Math.floor(d / 1000 / 60 / 60 / 24)) + "天" + suffix;
      } else {
        ret = "" + (Math.floor(d / 1000 / 60 / 60 / 24 / 365)) + "年" + suffix;
      }
      return ret;
    };

    //
    $scope.GetTaskMsgType = OAApp.GetTaskMsgType;
    $scope.GetFileMsgType = OAApp.GetFileMsgType;
    $scope.GetCheckInMsgType = OAApp.GetCheckInMsgType;
    $scope.GetUserbyUid = OAApp.GetUserbyUid;
    //
    $scope.ampm = new Date().getHours() >= 11 ? "下午" : "上午";
    $scope.users = OAApp.GetUserList();
    // users
    var users = $scope.users;
    var userBids = OAApp.GetUserBids();
    $scope.userBids = userBids;
    $scope.multiSelOAUsers = users.map(function(e) {
        var tmp = {};
        tmp.id = e.uid;
        tmp.label = e.fullName;

        return tmp;
    });
    // messages lists
    $scope.messagesList = [];
    $scope.cachedMsgsList = [];

    //
    $scope.taskFlow = [];

    // tasks List
    $scope.tasksAboutMe = [];
    $scope.tasksToMe = [];
    $scope.tasksCCMe = [];
    $scope.tasksICreated = [];
    $scope.tasksTodo = [];
    $scope.tasksFinished = [];
        //
    $scope.messageAlert = {};
    $scope.messageAlert.users = [];
    $scope.messageAlert.count = 0;
    // $scope.messageAlert.msg = 'messageAlert';

    $scope.MsgAlertOnClick = function() {
        $scope.messageAlert.users = [];
        $scope.messageAlert.count = 0;
        $scope.$apply();
    };

    // message struct
    // it must contain at least below fields:
    // msg.timestamp type: ts
    // msg.user type: user
    // msg.receivers type: []user
    // msg.msgType type: string
    //
    $scope.AddMessageToLists = function(msg) {
        // check valid
        if (msg.user && msg.user.fullName) {
            if (msg.user.uid != G.uid) {
              $scope.$apply(function(){
                if ($scope.messageAlert.users
                    .every(function(e) {
                        return e.uid != msg.user.uid;
                    })) {
                    $scope.messageAlert.users
                        .push(msg.user);
                }

                $scope.messageAlert.count++;
              });
            }

            // check msgType and take application defined
            // Actions
            // case TaskMsg:
            if (msg.msgType == OAApp.GetTaskMsgType()) {
                // TODO: in future relase it may be put into
                // a cachedMsgsList,
                // but now we simple put it into the real
                // List
                $scope.messagesList.push(msg);
                if (msg.user.uid == G.uid) {
                    $scope.tasksICreated.push(msg);
                }
                if (msg.receivers[0].uid == G.uid) {
                    $scope.tasksToMe.push(msg);
                    // check if it's finished
                    if (!msg.status || msg.status != OAApp.GenTaskStatusFinished()) {
                        OAApp.GetTaskById(msg.nextUid).then(function(s) {
                          $scope.tasksFinished.push(msg);
                        }, function(e) {
                            $scope.tasksTodo.push(msg);
                        });
                    }else{
                      $scope.tasksFinished.push(msg);
                    }
                }
                if (msg.receivers.length > 1 && msg.receivers.slice(1).some(
                        function(e) {
                            return e.uid == G.uid;
                        })) {
                    $scope.tasksCCMe.push(msg);
                }
            } else {
                // other messages
                debug.log("pushed msg: ", msg);
                $scope.messagesList.push(msg);
            }
        }
    };

    // TODO: remove me. debug
    OAApp.taskscope = $scope;

    //
    $scope.user = null;
    for (var i = 0; i < $scope.users.length; i++) {
        if ($scope.users[i].uid == G.uid) {
            $scope.user = $scope.users[i];
        }
    }

    debug.log("scope.users: ", $scope.users);

    if ($scope.user === null) {
        $scope.user = {
            uid: G.uid,
            fullName: '游客',
            email: '',
            picId: '',
            status: 'active'
        };
        // $scope.users.push($scope.user);
        // users.push($scope.user);
        OAApp.allUsers.push($scope.user);
    }

    //
    $scope.newTask = {};
    $scope.newTask.toUser = $scope.user.uid;
    $scope.newTask.ccUsers = [];
    $scope.deadLineDays = {value:7};
    $scope.newTask.finished = false;

    $scope.newTaskRep = angular.copy($scope.newTask);

    // get usercfg
    // OAApp.GetUserConfig(G.uid).then(function(s){
    // $scope.user = s;
    // $scope.apply();
    // });
    $scope.CreateTask = function(lastObj, taskObj, callback) {
        var task = {};
        if (lastObj) {
            if (lastObj.root) {
                task.root = lastObj.root;
            } else {
                task.root = lastObj.uid;
            }
            task.uid = lastObj.nextUid;
        } else {
            task.title = taskObj.title;
        }
        task.body = taskObj.body;
        task.receivers = [];
        // debug.log(taskObj.ccUsers);
        if (taskObj.toUser) {
            task.receivers.push(taskObj.toUser);
        }

        if (taskObj.ccUsers.length > 0) {
            task.receivers = task.receivers.concat(taskObj.ccUsers.map(function(e) {
                        return e.id;
                    }));
        }

        task.receivers = task.receivers.filter(function(item, pos, a) {
            return a.indexOf(item) == pos;
        });

        // TODO: we need date picker for deadline
        debug.log("deadLineDays: ", $scope.deadLineDays.value);
        task.deadline = Date.now() + 1000 * 60 * 60 * 24 * $scope.deadLineDays.value;
        debug.log("create new task: ", task);
        if (!task.body || (!lastObj && !task.title)) {
            alert("标题和内容不能为空");
            return;
        }
        if(taskObj.finished) {
          task.status = true;
        }else{
          task.status = false;
        }

        OAApp.NewTask(task).then(
            function(obj) {
                debug.log("new task: ",obj);
                $(".form-main").hide();
                $(".built-alert").hide();
                var nt = OAApp.GetViewObjFromTask(obj);
                if (lastObj) {
                    if (lastObj.rootTask) {
                        nt.rootTask = lastObj.rootTask;
                    } else {
                        nt.rootTask = lastObj;
                    }
                }

                if (typeof(callback) == "function") {
                    callback(obj);
                }

                var idx = 0;
                if (nt.receivers[0].uid == G.uid) {
                    idx = 1;
                }

                nt.msgType = OAApp.GetTaskMsgType();
                // debug.log("nt: ", nt);
                // add message to self
                $scope.AddMessageToLists(nt);
                $scope.$apply(function() {
                    // TODO: live update is turned off here. enable it as needed.
                    $scope.newTask = {};
                    $scope.newTaskRep = {};
                    $scope.newTask.ccUsers = [];
                    $scope.newTaskRep.ccUsers = [];
                    $scope.newTask.finished = false;
                    $scope.newTaskRep.finished = false;
                    debug.log("deadlineindays 2:", $scope.deadLineDays.value);
                    $scope.deadLineDays.value = 7;
                    $scope.newTaskRep.status = false;
                    $scope.newTask.status = false;
                });

                // send msg to others
                if (nt.receivers.length > idx) {
                    nt.receivers.slice(idx).forEach(
                        function(user) {
                            OAApp.SendMsg(user.uid, nt).then();
                        });
                }
            });
    };

    // Tasks List
    function BuildTasks(tasks) {
        $scope.tasksAboutMe = tasks;
        $scope.tasksICreated = tasks.filter(function(e) {
            return e.user.uid == G.uid;
        });

        $scope.tasksToMe = tasks.filter(function(e) {
            return e.receivers[0].uid == G.uid;
        });

        $scope.tasksCCMe = tasks.filter(function(e) {
            if (e.receivers.length > 1) {
                return e.receivers.slice(1).some(
                    function(e) {
                        return e.uid == G.uid;
                    });
            }
            return false;
        });
    }

    //
    OAApp.GetTasksAboutUser(userBids, G.uid, 1, function(item){
      if(item && item.receivers && item.receivers.length && item.receivers[0] !== null){
        return true;
      }
      return false;
    }).then(
        function(tasks) {
            var _tasks = tasks.map(function(item) {
                debug.log("task me: ", item);
                var temp = OAApp.GetViewObjFromTask(item);
                temp.rootTask = null;
                if (item.root && item.root.body) {
                    temp.rootTask = OAApp.GetViewObjFromTask(item.root);
                }
                return temp;
            });

            //$scope.$apply(function() {
                debug.log("list, _tasks: ", $scope.messagesList, _tasks);
                $scope.messagesList = OAApp.MergeSortedArray($scope.messagesList, _tasks, "timestamp"); // .sort(OAApp.taskCompare);
                // build tasksToMe, tasksAboutMe, tasksCCMe, tasksICreated
                BuildTasks(_tasks);
                debug.log("messageList:", $scope.messagesList);
            //});

            // all tasks "todo"
            var fa = $scope.tasksToMe.map(function(item) {
                var f = new hprose.Future();
                if (!item.status || item.status != OAApp.GenTaskStatusFinished()) {
                    OAApp.GetTaskById(item.nextUid).then(function(s) {
                        //debug.log("tasks todo resolve empty");
                        f.resolve({});
                    }, function(e) {
                        //debug.log("tasks todo resolve ", item);
                        f.resolve(item);
                    });
                } else {
                    //debug.log("tasks todo resolve null 2");
                    f.resolve({});
                }

                return f;
            });

            //debug.log("tasks todo fa: ", fa);
            hprose.Future.all(fa).then(function(s){
              //debug.log("tasks todo all: ", s);
              //$scope.$apply(function(){
                $scope.tasksTodo = s.filter(function(item){
                  return item.uid;
                });
                $scope.$apply();
              //});
            }, function(e){
              //debug.log("tasks todo all: error ",e);
            });
            //debug.log("end tasks todo");

        });

    //
    $scope.ToggleNewTask = function(toUid){
      if(toUid) {
        $scope.newTask.toUser = toUid;
      }
      // 发起任务弹出层
      //$(".built-task").click(function() {
          $(".built-alert").animate({
              width: 'toggle'
          }, "fast");
      //});
    };


    // task flow
    $scope.ToggleFlow = function(uid) {
        if ($(".form-main").is(":visible")) {
            $(".form-main").animate({
                width: "toggle"
            }, "fast",function(){
              //$(".form-main").css("position", "");
            });
        } else {
            OAApp.GetFlowByTaskId(uid).then(function(s) {
                debug.log("s: ", s);
                $scope.$apply(function() {
                    $scope.taskFlow = s;
                    $(".form-main").animate({
                        width: "toggle"
                    }, "fast", function(){
                      //$(".form-main").css("position", "absolute");
                    });
                });
            }, function(e) {});
        }
    };

    //
    $scope.ToggleRootTask = function($event) {
        var self = $($event.target);
        debug.log("self: ", self);
        if (self.context.className.indexOf('tb-down') > -1) {
            self.toggle();
            self.parent(".task-up").next(".task-more").toggle();
            self.next(".task-down").toggle();
        } else if (self.context.className.indexOf('task-down') > -1) {
            self.toggle();
            self.parent(".task-up").next(".task-more").toggle();
            debug.log('task down');
            self.prev('.tb-down').toggle();
        } else if (self.context.parentElement.className.indexOf('task-down') > -1) {
            self = $(self.context.parentElement);
            self.toggle();
            self.parent(".task-up").next(".task-more").toggle();
            debug.log('task down');
            self.prev('.tb-down').toggle();
        }
        $event.stopPropagation();
    };

    $scope.SwitchTasksTab = function($event) {
        var self = $event.target;
        $(self).addClass("my-active").siblings().removeClass("my-active");
        var name = self.getAttribute('name');
        //debug.log("self, name:", self, name);
        $("#" + name).show().siblings().hide();
    };

    // Chen Yong added for sign-in
    $scope.alertsign=function(){
    	//debugger;
        window.aa_3 = function(){
            $(".sign-alert").animate({ width: "toggle"}, "fast");
        };
        if ($(".sign-alert").is(":visible")) {
            $(".sign-alert").animate({ width: "toggle"}, "fast");
        } else {
            setTimeout(aa_3(),20);
        }

    };

    $scope.newRegUser = {};
    $scope.newRegUser.errmsg = null;
    $scope.RegisterNewUser = function(userObj){
      $scope.newRegUser = {};
      $scope.newRegUser.status = userObj.status = "active";
      $scope.newRegUser.errmsg = null;
      if(!userObj.fullName) {
        $scope.newRegUser.success = false;
        $scope.newRegUser.errmsg = "填写用户名";
        return;
      }
      OAApp.RegisterUser(userObj).then(function(s){
        $scope.$apply(function(){
          // s.success = true;
          $scope.newRegUser = s;
          debug.log("new user: ", s);
        });
      }, function(e){
        debug.warn(e);
        $scope.$apply(function(){
          s.success = false;
          s.errmsg = "" + e;
          $scope.newRegUser = s;
        });
      });
    };

    // pagination
    // homepage

    // message handler
    var msgHandler = function(msgs) {
        if (msgs !== null) {
            msgs.forEach(function(msg) {
                if (msg.msg) {
                    debug.log("MessageMan in callback");
                    if (msg.msg.msgType == OAApp.GetTaskMsgType() || msg.msg.msgType == OAApp.GetFileMsgType() || msg.msg.msgType == OAApp.GetCheckInMsgType()) {
                        //$scope.$apply(function() {
                            $scope.AddMessageToLists(msg.msg);
                        //});
                    } else {
                        debug.warn("MessageMan: unhandled message - ", msg);
                    }
                }
            });
        }
    };

    $scope.messageMan = new OAApp.MessageMan(50000, msgHandler);
    $scope.messageMan.start();

    // 点击周边关闭弹出层
    $(document).bind(
      "click",
      function(e) {
    	//  debugger;
        var target = $(e.target);
        // 创建任务
        if (target.closest(".built-alert").length === 0 && target.closest(".built-task").length === 0 && target.context.name!="taskstatus" ) {
          $(".built-alert").hide();
        }
        // 打印报表的任务
        if (target.closest(".form-main").length === 0 && target.closest(".task-alert").length === 0 && target.context.name!="taskstatus" ) {
          $(".form-main").hide();
          //$(".form-main").css("position", "");
        }

        if(target.closest(".sign-alert").length === 0 && target.closest(".sign-info").length === 0  && target.context.name!="taskstatus"){
                    $(".sign-alert").hide();
                 }
                //资源弹出
                if(target.closest(".access-alert").length === 0 && target.closest(".access-info").length === 0  && target.context.name!="taskstatus"){
                    $(".access-alert").hide();
                 }

/*
      if (target.closest(".sign-alert").length === 0  ) {
            $(".sign-alert").hide();
            //$(".form-main").css("position", "");
          }*/
        // 标记完成未完成
        if (target.closest(".no-end").length === 0) {
          $(".mark-list").hide();
        }
      });
}

// system APIs
function initSysAPI(Apps, $, Cfg) {
    debug.log('init OA');

    // APIs
    Array.prototype.flatten = function() {
        return this.reduce(function(prev, cur) {
            var more = [].concat(cur).some(Array.isArray);
            return prev.concat(more ? cur.flatten() : cur);
        }, []);
    };

    var OAApp = {};
    OAApp.oaBid = 'QMOi5VdWUC2DeXGEoLs7XQ4gcVMYwkJcuSweW_QjnLI';
    OAApp.TEST = {};
    OAApp.TEST.taskAppBid = 'goxfgK36ZF66gokA9GXlom1VxX75ujQPZw_Mp5jQ9YM';
    OAApp.appsListKey = OAApp.oaBid + '_AppsList';

    Apps[OAApp.oaBid] = OAApp;
    window.OAApp = OAApp;

    //
    OAApp.MergeSortedArray = function(a, b, field) {
            var answer = [];
            if (!a || !a.length) {
                return b || [];
            } else if (!b || !b.length) {
                return a || [];
            }

            var i = a.length - 1,
                j = b.length - 1,
                k = a.length + b.length;

            function checkab(a, field, i, j) {
                while (a[i]!== undefined && typeof(a[i][field]) == 'undefined') {
                    debug.warn("member ", field, "not defined in: ", a[i]);
                    i--;
                }
                while (b[j]!==undefined &&typeof(b[j][field]) == 'undefined') {
                    debug.warn("member ", field, "not defined in: ", b[i]);
                    j--;
                }

                var flag = 0;
                if(!a[i]) flag = -1;
                if(!b[j]) flag = 1;

                var ret = false;
                if(flag > 0) {
                    ret = true;
                }else if(flag < 0){
                    ret = false;
                }else{
                    ret = (a[i][field] >= b[j][field]);
                }

                return {flag: ret, ti: i, tj: j};
            }

            var obj = {flag: false, ti:99, tj:99};
            while (k > 0) {
                if(i >= 0) {
                    obj = checkab(a, field, i, j);
                }else {
                    obj.flag = false;
                }
                answer[--k] =  (j < 0 || (i >= 0 && obj.flag && ((i = obj.ti) !== null &&(j=obj.tj) !== null))) ? a[i--] : b[j--];
            }

            return answer;
        };
        //
    OAApp.adminUsers = [ {
        uid: 'M5pB6BlrAvbtz1z6bo52Z05FAu7NIy0NbKhPXxqMltI',
        fullName: "Bruce的自用测试",
        nickName: "测试",
        email: "rikusouhou@gmail.com",
        picId: "",
        status: "active"
    }];
    // admin uid
    OAApp.GetUsersListKey = function(){
      return "oa_users_list";
    };

    OAApp.GetUsersRegisteredByAdmin = function(adminUid){
      var future = new hprose.Future();
      Cfg.api.hgetall(G.sid, adminUid, OAApp.GetUsersListKey(), function (users) {
        if (!users) {
          console.log("hgetall data=null");
          future.resulve([]);
        }else{
          debug.log("GetUsersRegisteredByAdmin: ", users);
          future.resolve(users.map(function(item){
            var u = JSON.parse(item.value);
            u.url = OAApp.BuildUserUrlFromUid(u.uid);
            return u;
          }));
        }
      }, function (name, err) {
        console.warn(name+err);
        future.resolve([]);
      });

      return future;
    };

    OAApp.adminUid = OAApp.adminUsers[0].uid;
    OAApp.RegisterUser = function(obj) {
        var future = new hprose.Future();
        if(G.uid != OAApp.adminUid) {
          future.resolve({success:false, uid: null, fullName: null, errmsg:"当前用户没有权限进行此操作"});
        } else {
          // check if user already existed
          Cfg.api.register(function(data) {
              debug.log("register userid=", data);
              // save user to store block
              obj.uid = data;
              Cfg.api.hset(G.sid, G.uid, OAApp.GetUsersListKey(), data, JSON.stringify(obj), function (result) {
                debug.log("hset ok num=", result);
                obj.url = OAApp.BuildUserUrlFromUid(obj.uid);
                obj.success = true;
                obj.errmsg = null;
                debug.log("registered new user:" , obj);
                future.resolve(obj);
              }, function (name, err) {
                console.log(name+err);
                future.resolve({success:false, uid: null, fullName: null, errmsg:name+err});
              });
          }, function(name, err) {
              debug.warn(name + err);
              future.reject(name+err);
          });
        }

        return future;
    };

    OAApp.allUsers = [];
    OAApp.GetUserListAsync = function(){
      var future = new hprose.Future();
      OAApp.GetUsersRegisteredByAdmin(OAApp.adminUid).then(function(s){
        OAApp.allUsers = [];
        s.forEach(function(e){
          OAApp.allUsers.push(e);
        });
        OAApp.allUsers = OAApp.allUsers.concat(OAApp.adminUsers.map(function(item){
          item.url = OAApp.BuildUserUrlFromUid(item.uid);
          return item;
        }));
        debug.log("OAApp users: ", OAApp.allUsers);
        future.resolve(OAApp.allUsers);
      },function(e){
        future.reject();
      });

      return future;
    };

    OAApp.GetUserList = function() {
        return OAApp.allUsers;
    };

    OAApp.GetUserBids = function() {
        return OAApp.GetUserList().map(function(m) {
            return m.uid;
        });
    };

    OAApp.GetUserbyUid = function(uid) {
        var users = OAApp.GetUserList();
        var user = null;
        for (var i = 0; i < users.length; i++) {
            if (users[i].uid == uid) {
                user = users[i];
                break;
            }
        }
        if(user === null) {
          user = {uid: null, fullName:"此用户已被删除", url:null};
        }
        return user;
    };

    OAApp.BuildUserUrlFromUid = function(uid) {
      return "http://"+G.IPList[0] + "/loadres?type=text/html&AppName=OA&AppBid=" + G.AppBid +
      "&ip=" + G.IPList[0] + "&bid=" + G.SystemBid+ "&name=AppTemplate&ver=last&userid=" + uid;
    };

    //
    OAApp.GetViewObjFromTask = function(taskObj) {
        var temp = {};
        temp.uid = taskObj.uid;
        temp.title = taskObj.title;
        temp.body = taskObj.body;
        temp.user = OAApp.GetUserbyUid(taskObj.creator);
        temp.nextUid = taskObj.nextUid;
        temp.deadline = taskObj.deadline;
        temp.status = taskObj.status;
        temp.root = taskObj.root;
        temp.timestamp = taskObj.timestamp;
        temp.msgType = OAApp.GetTaskMsgType();
        debug.log("error element: ", taskObj);
        if(!taskObj.receivers ||taskObj.receivers.length === 0|| taskObj.receivers[0] === null ){
          taskObj.receivers = [G.uid];
          debug.warn("invalid task: ", taskOjb);
        }
        temp.receivers = taskObj.receivers.map(function(e) {
            return OAApp.GetUserbyUid(e);
        });

        // debug.log("GetViewObjFromTask: ", temp);
        return temp;
    };

    //
    OAApp.GenTaskStatusFinished = function() {
        return true;
    };

    //
    OAApp.GetUserKey = function(userid) {
        return userid + '_UserCfgKey';
    };

    //
    OAApp.CreateObjectStore = function(dbName, storeName) {
            var request = indexedDB.open(dbName);
            request.onsuccess = function(e) {
                var database = e.target.result;
                var version = parseInt(database.version);
                database.close();
                var secondRequest = indexedDB.open(dbName, version + 1);
                secondRequest.onupgradeneeded = function(e) {
                    var database = e.target.result;
                    var objectStore = database.createObjectStore(storeName, {
                        keyPath: 'id'
                    });
                };
                secondRequest.onsuccess = function(e) {
                    e.target.result.close();
                };
            };
        };
        //
    OAApp.GenTasksDBKey = function(ts) {
        return 'oa_taskslist_' + G.uid + '::' + ts;
    };

    OAApp.GenTasksDBKey = function(ts) {
        return 'oa_taskslist_' + G.uid + '::' + ts;
    };

    //
    OAApp.GetTasksFromIDB = function(key) {
        var table = "oatasks";
        var tr = G.LeitherDb.transaction(table, 'readwrite');
        var store = tr.objectStore(table);
        var future = new hprose.Future();
        debug.log('GetDataFromIDB: ', table, key);
        request = store.get(key);
        request.onerror = function(e) {
            future.reject(e);
        };
        request.onsuccess = function(e) {
            future.resolve(e.target.result);
            debug.log('GetDataFromIDB: ', e.target.result);
        };
        return future;
    };

    OAApp.SaveTasksToIDB = function(value) {
        var table = "oatasks";
        var future = new hprose.Future();
        var tr = G.LeitherDb.transaction(table, 'readwrite');
        var store = tr.objectStore(table);

        request = store.add(value);
        request.onerror = function(e) {
            debug.log('SetDataToIDB err ', e, table, value);
            future.reject(e);
        };
        request.onsuccess = function(e) {
            future.resolve(e.target.result);
            debug.log('SetDataToIDB table:', table, e.target.result);
        };
        return future;
    };

    //
    OAApp.GenerateUID = function(uid) {
        if (arguments.length > 0) {}

        if (typeof(uid) == 'undefined' || uid === null) {
            uid = G.uid;
        }

        return uid + "::" + Date.now() + Date.now() + Math.floor(Math.random() * 10000000);
    };

    OAApp.GetTaskMsgType = function() {
        return "TaskMsg";
    };

    OAApp.GetFileMsgType = function() {
        return "FileMsg";
    };

    OAApp.GetCheckInMsgType = function() {
        return "CheckInMsg";
    };

    //
    OAApp.GetTaskSetKey = function(uid) {
        return uid + '_TasksSet';
    };

    OAApp.SendMsg = function(toUid, obj) {
        var future = new hprose.Future();

        function Message() {}
        var msg = new Message();
        msg.from = G.uid;
        msg.to = toUid;
        msg.Msg = JSON.stringify(obj);
        msg.Data = 1;
        Cfg.api.sendmsg(G.sid, msg, function() {
            debug.log("SendMsg: ", msg);
            future.resolve(msg);
        }, function(name, err) {
            debug.warn("SendMsg: ", name + err);
            future.reject(name + err);
        });

        return future;
    };

    OAApp.MessageMan = function(interval, callback) {
        var self = this;
        this.interval = interval;
        this.oldInterval = -1;
        this.callback = callback;
        this.timer = null;
        this.running = 0;
        this.setInterval = function(interval) {
            self.interval = interval;
        };

        this.stop = function() {
            if (self.interval != -1) {
                self.oldInterval = self.interval;
            }
            self.interval = -1;
            if (self.timer !== null) {
                clearTimeout(self.timer);
                self.timer = null;
            }
        };

        this.start = function(interval) {
            if (!interval && self.oldInterval != -1) {
                self.interval = self.oldInterval;
            } else {
                self.interval = interval;
            }
            self._exec();
        };

        this.setCallback = function() {};
        this._readMsg = function() {
            debug.log("MessageMan: waiting for messages");
            Cfg.api.readmsg(G.sid, function(msgs) {
                debug.log("MessageMan readmsg ok:", msgs);
                if (typeof(self.callback) == 'function') {
                    //debug.log("MessageMan callback: ", self.callback);
                    if (msgs !== null) {
                        var m = msgs.map(function(e) {
                            e.msg = JSON.parse(e.msg);
                            return e;
                        });
                        self.callback(m);
                    }
                    if (self.interval != -1) {
                        self._readMsg();
                    }
                }
            }, function(name, err) {
                debug.warn("MessageMan readMsg error: ", name + err);
                self._readMsg();
            });
        };

        //
        this._pullMsg = function() {
            debug.log("start pulling: ", self.interval / 1000,
                self.callback);
            Cfg.api.pullmsg(G.sid, self.interval, function(value) {
                debug.log("pullmsg value: ", value);
                if (typeof(self.callback) == 'function') {
                    self.callback(msg);
                }
                debug.log("pullmsg value: ", msg);
                if (self.interval != -1) {
                    self._pullMsg();
                }
            }, function(name, err) {
                debug.warn("failed pullmsg: ", name + err);
            });
        };

        this._exec = this._readMsg;

        return this;
    };

    //
    OAApp.CreateHashEntry = function(key, obj) {
        var future = new hprose.Future();
        // entity can be filterred by timestamp
        var mykey = key;
        if (!mykey) {
            mykey = OAApp.GenerateUID();
        }
        obj.uid = mykey;
        obj.timestamp = Date.now();
        if (!obj.receivers || !obj.receivers.length) {
            obj.receivers = [G.uid];
        }

        obj.nextUid = OAApp.GenerateUID(obj.receivers[0]);
        obj.creator = G.uid;

        Cfg.api.set(G.sid, G.uid, obj.uid, JSON.stringify(obj), function(
            data) {
            future.resolve(obj);
        }, function(name, err) {
            future.reject(name + err);
        });

        return future;
    };

    //
    OAApp.NewSortedEntry = function(key, score, member) {
        var future = new hprose.Future();
        var sc = {};
        sc.score = score;
        sc.member = member;
        Cfg.api.zadd(G.sid, G.uid, key, sc, function(data) {
            future.resolve(sc);
        }, function(name, err) {
            debug.warn("NewSortedEntry: ", name + err);
            future.reject(name + err);
        });

        return future;
    };

    // obj = {next, timestamp, uid, creator, /*user provided*/ rootUid,
    // deadline, title, body, receivers[], status}
    // next, timestamp, uid, creator are system inserted, all others are
    // user provided
    OAApp.NewTask = function(obj) {
        var future = new hprose.Future();
        if (!obj.uid) {
            obj.uid = null;
        }
        OAApp.CreateHashEntry(obj.uid, obj).then(function(obj) {
            // debug.log("NewTask: ", obj);
            // insert into sorted set
            var fa = [];
            if (typeof(obj.receivers) != 'undefined' && typeof(obj.receivers.length) != 'undefined') {
                for (var i = 0; i < obj.receivers.length; i++) {
                    if (i === 0 && obj.receivers[0] == G.uid) {
                        continue;
                    }
                    fa.push(OAApp.NewSortedEntry(
                        OAApp.GetTaskSetKey(obj.receivers[i]),
                        obj.timestamp,
                        obj.uid));
                }
            } else {
                obj.receivers = [];
                obj.receivers.push(G.uid);
            }

            fa.push(OAApp.NewSortedEntry(OAApp.GetTaskSetKey(G.uid), obj.timestamp,
                obj.uid));

            hprose.Future.all(fa).then(function(data) {
                debug.log("NewTask all:", data);
                future.resolve(obj);
            }, function(e) {
                debug.warn("NewTask: ", e);
                future.reject(e);
            });
        }, function(e) {
            debug.warn("NewTask: ", e);
            future.reject(e);
        });

        return future;
    };

    OAApp.GetTaskById = function(taskid) {
        var future = new hprose.Future();
        if (!taskid) {
            future.reject("GetTaskById: taskid is null");
        }
        var m = taskid.split("::");
        if (m.length != 2) {
            future.reject("no :: in key: ", taskid);
            return future;
        }

        Cfg.api.get(G.sid, m[0], taskid, function(data) {
            // debug.log(data);
            if (!data) {
                future.reject("null data");
            } else {
                future.resolve(JSON.parse(data));
            }
        }, function(name, err) {
            debug.warn(name + err);
            future.reject(name + err);
        });

        return future;
    };

    OAApp.GetTaskByIdWithRoot = function(taskid) {
        var future = new hprose.Future();
        OAApp.GetTaskById(taskid).then(function(s) {
            if (s.root) {
                OAApp.GetTaskById(s.root).then(function(s1) {
                    s.root = s1;
                    debug.log("GetTaskByIdWithRoot: ", s);
                    future.resolve(s);
                }, function(e1) {
                    debug.warn("GetTaskByIdWithRoot e1: ", e1);
                    future.reject(e1);
                });
            } else {
                future.resolve(s);
            }
        }, function(e) {
            debug.warn("GetTaskByIdWithRoot e: ", e);
            future.reject(e);
        });

        return future;
    };

    //
    OAApp.GetFlowByTaskId = function(taskid) {
        var future = new hprose.Future();
        var getNext = function(uid, _results) {
            var results = _results || [];
            // debug.log("getNext:", uid, results);
            OAApp.GetTaskById(uid).then(function(s) {
                // debug.log("Get: ", uid, s);
                // debug.log("Next: ", s.nextUid);
                if (!s) {
                    future.resolve(results);
                } else {
                    debug.log("push: ", s);
                    results.push(OAApp.GetViewObjFromTask(s));
                    if (s.nextUid) {
                        getNext(s.nextUid, results);
                    } else {
                        future.resolve(results);
                    }
                }
            }, function(e) {
                // debug.log("rejected: ", e);
                future.resolve(results);
            });
        };

        //
        OAApp.GetTaskById(taskid).then(function(s) {
            debug.log("s.root: ", s.root);
            if (!s.root) {
                getNext(taskid);
            } else {
                getNext(s.root);
            }
        }, function(e) {
            future.reject(e);
        });

        return future;
    };

    //
    function taskCompare(a, b) {
        if (a.timestamp < b.timestamp)
            return -1;
        if (a.timestamp > b.timestamp)
            return 1;
        return 0;
    }

    //
    OAApp.GetTasksAboutUser = function(bids, userid, withRoot, funFilter, start, end) {
        var future = new hprose.Future();
        // TODO: zrange should be zrangebyscore
        var fa = bids.map(function(bid) {
            var f = new hprose.Future();
            var _end = end,
                _start = start;
            // debug.log("GetTasksAboutUser1");
            if (!start && !end) {
                // debug.log("GetTasksAboutUser2");
                Cfg.api.zrange(G.sid, bid, OAApp.GetTaskSetKey(userid), 0, -1, function(data) {
                    result = {
                        bid: bid,
                        items: data.map(function(i) {
                            return i.member;
                        })
                    };
                    f.resolve(result);
                }, function(n, e) {
                    debug.warn(n + e);
                    f.resolve(null);
                });
            } else {
                if (!end) {
                    _end = Date.now();
                }
                // debug.log("GetTasksAboutUser3");
                Cfg.api.zrangebyscore(G.sid, bid, OAApp
                    .GetTaskSetKey(userid), _start, _end, 0, -1,
                    function(data) {
                        result = {
                            bid: bid,
                            items: data.map(function(i) {
                                return i.member;
                            })
                        };
                        // debug.log("GetTasksAboutUser4: ", data);
                        f.resolve(result);
                    },
                    function(n, e) {
                        debug.warn(n + e);
                        f.resolve(null);
                    });
            }

            return f;
        });
        // debug.log(fa);
        hprose.Future.all(fa).then(function(values) {
            var tasksFa = values.filter(function(value) {
                return value.items.length > 0;
            }).map(function(obj) {
                if (obj.items.length > 0) {
                    return obj.items.map(function(item) {
                        // get tasks
                        var f = new hprose.Future();
                        // Cfg.api.get(G.sid, obj.bid, item, function(data){
                        // f.resolve(JSON.parse(data));
                        // },function(n,e){
                        // debug.warn("GetTasksAboutUser: ",n,e);
                        // f.reject(n,e);
                        // });
                        var funGetTask = null;
                        if (withRoot) {
                            funGetTask = OAApp.GetTaskByIdWithRoot;
                        } else {
                            funGetTask = OAApp.GetTaskById;
                        }
                        funGetTask(item).then(function(s) {
                            f.resolve(s);
                        }, function(e) {
                            f.reject(e);
                        });
                        return f;
                    });
                }
            });
            hprose.Future.all(tasksFa.flatten()).then(function(values) {
                // store to indexedDB
                values.sort(taskCompare);
                // SetDbData()
                debug.log("GetTasksAboutUser all:", values);
                if( typeof(funFilter) == 'function' ){
                  var filtered = values.filter(funFilter);
                  debug.log("GetTasksAboutUser all filtered: ", filtered);
                  future.resolve(filtered);
                }else{
                  future.resolve(values);
                }
            }, function(e) {
                debug.warn(e);
                future.reject(e);
            });
        }, function(e) {
            debug.warn("reject GetTasksAboutUser: ", e);
            future.reject(e);
        });

        return future;
    };

    //
    OAApp.RebuildTaskMessagesForUser = function(bids, userid) {
        var future = new hprose.Future();
        OAApp.GetTasksAboutUser(bids, userid).then(function(tasks) {
            if (tasks) {
                // debug.log("tasks: ", tasks);
                tasks.forEach(function(task) {
                    debug.log("task: ", task, "\n\n", task.receivers);
                    task.receivers.forEach(function(r) {
                        debug.log("r: ", r);
                        OAApp.SendMsg(r, task).then(function(s) {
                            future.resolve(s);
                        }, function(e) {
                            debug.warn("RebuildTaskMessagesForUser: ", e);
                            future.reject(s);
                        });
                    });
                });
            }
        });

        return future;
    };

    // OAApp.GetTasksUserCreated = function(userid) {
    // var future = new hprose.Future();
    //
    // Cfg.api.zrange(G.sid, userid, OAApp.GetTaskSetKey(userid), 0, -1,
    // function (data) {
    // debug.log("GetTasksUserCreated: ",data);
    // future.resolve(data);
    // }, function (name, err) {
    // debug.warn("GetTasksUserCreated: ", name+err);
    // future.resolve(null);
    // });
    //
    // return future;
    // }

    // user data: {fullName, picId, email, status}
    OAApp.ModifyCurrentUser = function(userData) {
        var future = new hprose.Future();
        userData.uid = G.uid;
        Cfg.api.set(G.sid, G.uid, OAApp.GetUserKey(G.uid), JSON
            .stringify(userData),
            function(s) {
                future.resolve(userData);
            },
            function(n, e) {
                future.resolve(null);
            });

        return future;
    };

    OAApp.GetUserConfig = function(userid) {
        var future = new hprose.Future();
        Cfg.api.get(G.sid, userid, OAApp.GetUserKey(userid),
            function(data) {
                future.resolve(JSON.parse(data));
            },
            function(n, e) {
                debug.warn("GetUserConfig: ", n + e);
                future.reject(n + e);
            });

        return future;
    };

    // get all registered Apps in OA system
    OAApp._GetUsersList = function() {
        var future = new hprose.Future();
        G.api.getvar(G.sid, "usernearby", function(data) {
            future.resolve(data);
        }, function(n, e) {
            debug.warn(n + e);
            future.reject(n + e);
        });
        return future;
    };

    OAApp.load = function(callback) {};

    return OAApp;
}
