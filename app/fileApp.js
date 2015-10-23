function loadFileControllers(){
    G.app.controller("recentlyFileController", ["$rootScope",function ($rootScope) {
        debug.log("into recentlyFileController");

        getFiles(getUids(OAApp.GetUserList()), 7).then(function(v){
              v.sort(function(a,b){return b.createTime - a.createTime;});
              $scope.recentlyFiles = v.slice(0,5);
              $scope.$apply();
          },function(e){debug.log("err is",e);});
    }])
    .controller("appsController", function($scope, $rootScope,$sce) {

    })
    .controller("fileController", function($scope, $rootScope,$sce) {
//        debug.log("$sce is",$sce);
      getFiles(getUids(OAApp.GetUserList()), 7).then(function(v){
          v.sort(function(a,b){return b.createTime - a.createTime;});
          $scope.fileList = v;

          var myfileList = [];
          for(var i=0; i<v.length; i++){
            if(v[i].uid == G.uid){
              myfileList.push(v[i]);
            }
          }

          $scope.myfileList = myfileList;

          $scope.$apply();
      },function(e){debug.log("err is",e);});


//        debug.log("$rootScope is",$rootScope);
      fileAction($rootScope);

//      $scope.fileclick = fileAction;

      $scope.onupload = function(){
//        $("#fileName").click();
        var e = document.createEvent("MouseEvents");
        e.initEvent("click", true, true);
        document.getElementById("fileName").dispatchEvent(e);
      };

     $("#fileName").change(function(){
          $scope.upload();

     });

     $(".my-nav li").click(function(){
       $(this).addClass("my-active").siblings().removeClass("my-active");
       $(".my-info>div:eq("+$(this).index()+")").show().siblings().hide();
     });

      $scope.upload = function(){
          var x = document.getElementById("fileName").files[0];
  //        debug.log("x.name ",x.name);
          var r = new FileReader();
          r.onloadend = function (e) {
  //           debug.log(e.target.result.byteLength);
             G.api.setdata(G.sid, G.uid, e.target.result, function (data) {
                 var time = new Date().getTime();
                 var filejson = {};
                 filejson.fid = data;
  //               <p><a href="{{host}}getres?sid={{sid}}&bid={{bid}}&key={{resid}}">getres</a></p>
                 filejson.url = "http://"+G.IPList[0]+"/getres?bid="+G.uid+"&key="+data;
                 filejson.fileName = x.name;
                 filejson.type = 1; // 1 是 上传  2 是 来自任务；
                 filejson.uid = G.uid;
                 filejson.createTime = time;
                 debug.log(filejson,"upload ok");
                 var filekey = gen__MY_FILE_LIST__key(G.uid,time);

                 G.api.hset(G.sid, G.uid, __MY_FILE_LIST__, filekey ,JSON.stringify(filejson), function() {
                   debug.log("hset success");
                   addToFileQueue(filekey,filejson);
                   addToDom();
                 }, function(name, err) {
                      debug.warn(err);
                 });
             }, function (name, err) {
                 debug.log(err,"upload error");
             });
          };
          r.readAsArrayBuffer(x);
          debug.log("good");
      };

      function addToDom(){
//        $scope
//         $('#allfileList >div').each
            getFiles(getUids(OAApp.GetUserList()), 7).then(function(v){
                      v.sort(function(a,b){return b.createTime - a.createTime;});
                      $scope.fileList = v;

                      var myfileList = [];
                      for(var i=0; i<v.length; i++){
                        if(v[i].uid == G.uid){
                          myfileList.push(v[i]);
                        }
                      }

                      $scope.myfileList = myfileList;

                      $scope.$apply();
                  },function(e){debug.log("err is",e);});
      }

      function addToFileQueue(filekey,file){

        debug.log("file = ",file);

        var createTime = new Date().getTime();
  //
        angular.forEach($scope.users, function(user) {
          var uid = user.uid;
          function ScorePair(){
            this.score = 0;
            this.member = null;
          }

          var sp = new ScorePair();
          sp.score = createTime;
          sp.member = filekey;

          G.api.zadd(G.sid, G.uid, gen__MY_FILE_QUEUE__key(uid),sp,function(){
              debug.log("self zadd success");
          },function(name, err) {
              debug.warn(err);
          });
        });
  //
        //写到总的消息队列
        angular.forEach($scope.users, function(user) {
          var uid = user.uid;
          function ScorePair(){
              this.score = 0;
              this.member = null;
          }

          var oamsg = new OAMessage();
          oamsg.appid = __APP_TYPE_FILE__;		//根据appid，获得消息类型
          oamsg.brif = $scope.user.fullName +"，上传了 《"+file.fileName+"》";		//
          oamsg.contentId = filekey;		//
          oamsg.createTime = createTime;	//time message received or sent


          var sp = new ScorePair();
          sp.score = createTime;
          sp.member = JSON.stringify(oamsg);

          G.api.zadd(G.sid, G.uid, gen__MY_QUEUE__key(uid),sp,function(){
              debug.log("sum zadd success");
          },function(name, err) {
              debug.warn(err);
          });


        });
  //
        // 通知
        angular.forEach($scope.users, function(user) {
          var uid = user.uid;
          var oamsg = new OAMessage();
          oamsg.appid = __APP_TYPE_FILE__;		//根据appid，获得消息类型
          oamsg.brif = $scope.user.fullName +"，上传了 《"+file.fileName+"》";
          oamsg.contentId = filekey;		//
          oamsg.createTime = createTime;	//time message received or sent
          oamsg.msgType = OAApp.GetFileMsgType();

          //todo:
          oamsg.msgType = OAApp.GetFileMsgType();
          oamsg.user = $scope.user;
          oamsg.receivers = $scope.users;
          oamsg.timestamp = createTime;

          var msg = new Message();
          msg.from = G.uid;
          msg.to = uid;
          msg.msg = JSON.stringify(oamsg);
  //
          G.api.sendmsg(G.sid, msg, function () {
              debug.log("In send request, msg sent OK",msg);
          }, function (name, err) {
              debug.error("In send request, err=" + err);
          });
        });
      }
    });



}

angular.element(document).ready(function () {

});

function fileApp($scope){
  var time = new Date().getTime() - (1000 * 60 * 60 * 24 * 2);
  var fs = [];
  angular.forEach($scope.users, function(user) {
    var uid = user.uid;
    var future = new hprose.Future();
    G.api.zrangebyscore(G.sid, uid,gen__MY_QUEUE__key(G.uid), time, new Date().getTime(), 0, -1,
        function(fileQueue) {
          debug.log("all promise  zrangebyscore",fileQueue);
          future.resolve(fileQueue);
        }, function(name, err) {
          debug.warn(err);
          future.reject(err);
        });
    fs.push(future);
  });

  var Future = hprose.Future;
  Future.all(fs).then(
  function(values) {
    debug.log("homeController values",values);
    var fileQueue = [];
    for (var i = 0; i < values.length; i++) {
      Array.prototype.push.apply(
          fileQueue, values[i]);
    }

    var fq = [];
    debug.log("fileQueue: ");
    for (i = 0; i < fileQueue.length; i++) {
      var f = JSON
          .parse(fileQueue[i].member);
      // TODO:
      f.timestamp = f.createTime;
      debug.log("fileQueue: 1");
      f.user = OAApp.GetUserbyUid(f.fromUid);
      debug.log("fileQueue: 2");

        if (f.appid == __APP_TYPE_FILE__) {
            f.msgType = OAApp.GetFileMsgType();
        } else {
          // TODO:
            f.msgType = OAApp.GetCheckInMsgType();
        }

debug.log("fileQueue: 3");
      f.createTime = f.createTime;
      if (f.contentId) {
        f.fromUid = f.contentId.split(":")[1];
      }
      fq.push(f);
    }

    fq.sort(function(a,b){
        return a.timestamp - b.timestamp;
    });

     debug.log("all promisehomeController", fq,fq.length);
    $scope.fq = fq;
    debug.log("merged2 pre list, fq: ",
        $scope.messagesList, fq);
    $scope.$apply(function() {
          $scope.messagesList = OAApp.MergeSortedArray(
                  $scope.messagesList,
                  fq,
                  "timestamp");// .sort(OAApp.taskCompare);
          // debug.log("merged 2:
          // ",
          // $scope.messagesList);
        });
  },
  function(e) {
    debug.log("all promise homeController errs is ",e);
    // return e;
  });


}



function fileAction($rootScope){
    debug.log("into fileAction");

    $rootScope.fileclickByFileInfo = function(c){

        window.aa_2 = c;
        window.aa_1 = function(){
            var v = window.aa_2;
            debug.log("into fileAction",v);
            var fileInfoDetail = {};
            fileInfoDetail.fileInfo = v;
            fileInfoDetail.actionInfoCount = _getActionInfoCount(v);
            fileInfoDetail.actionInfoDetail = _getActionInfoDetail(v);
            $rootScope.fileInfoDetail = fileInfoDetail;
            $rootScope.$apply();
            $(".access-alert").animate({ width: "toggle"}, "fast");
            debug.log("into fileAction",v);
        };

        if ($(".access-alert").is(":visible")) {
            $(".access-alert").animate({ width: "toggle"}, "fast");
        } else {
            setTimeout(aa_1(),20);
        }
    };

    $rootScope.fileclick = function(msg){
        debug.log("into fileclick",msg);
        getFileByFileKey(msg.contentId).then(function(v){
            debug.log("msg is = ",v);
            var fileInfoDetail = {};
            fileInfoDetail.fileInfo = v;
            fileInfoDetail.actionInfoCount = _getActionInfoCount(v);
            fileInfoDetail.actionInfoDetail = _getActionInfoDetail(v);
            $rootScope.fileInfoDetail = fileInfoDetail;
            $rootScope.$apply();
            $(".access-alert").animate({ width: "toggle"}, "fast");
        },function(e){

        });
    };

    function _getActionInfoDetail(v){
        if(!v.actionInfos || v.actionInfos.length===0) return "";
        v.actionInfos.sort(function(a,b){return b.time - a.time;});
        var ret = "<dt class='mb10'>最近日志</dt>";
        for(var i=0; i<v.actionInfos.length; i++){
            if(v.actionInfos[i].type == "viewDateTime"){
                ret += "<dd>@"+OAApp.GetUserbyUid(v.actionInfos[i].uid).fullName + " <span class='c-999'>" + $rootScope.TimeFromNow(v.actionInfos[i].time) +"</span> 查看了文件</dd>";
            }
            if(v.actionInfos[i].type == "downloadDateTime"){
                ret += "<dd>@"+OAApp.GetUserbyUid(v.actionInfos[i].uid).fullName + " <span class='c-999'>" + $rootScope.TimeFromNow(v.actionInfos[i].time) +"</span> 下载了文件</dd>";
            }
            if(v.actionInfos[i].type == "shareDateTime"){
                ret += "<dd>@"+OAApp.GetUserbyUid(v.actionInfos[i].uid).fullName + " <span class='c-999'>" + $rootScope.TimeFromNow(v.actionInfos[i].time) +"</span> 分享了文件</dd>";
            }

            if(i==4) break;
        }
        return ret;
    }

    function _getActionInfoCount(v){
        if(!v.actionInfos || v.actionInfos.length===0) return "没有日志信息";
        var vcount = 0;
        var dcount = 0;
        var scount = 0;
        for(var i=0; i<v.actionInfos.length; i++){
            if(v.actionInfos[i].type == "viewDateTime"){vcount++;}
            if(v.actionInfos[i].type == "downloadDateTime"){dcount++;}
            if(v.actionInfos[i].type == "shareDateTime"){scount++;}
        }
        return "本文件，累计被查看 "+vcount+" 次, 下载 "+dcount+" 次, 分享 "+ scount + " 次";
    }


    $scope.download = function(fileInfo){
        var fileKey = gen__MY_FILE_LIST__key(fileInfo.uid,fileInfo.createTime);
        G.api.get(G.sid, fileInfo.uid, fileInfo.fid, function(data) {
            if (data) {
                saveAs(new Blob([data], {type: 'image/png'}),fileInfo.fileName);
            }
        }, function(name, err) {
            debug.error(err);
        });
        downloadAddOne(fileKey);
        debug.log("into download");
      };
      $scope.share = function(fileInfo){
        var fileKey = gen__MY_FILE_LIST__key(fileInfo.uid,fileInfo.createTime);
        shareAddOne(fileKey);
        debug.log("share url is ", fileInfo.url);
        debug.log("into share");
      };
      $scope.view = function(fileInfo){
        var fileKey = gen__MY_FILE_LIST__key(fileInfo.uid,fileInfo.createTime);
        debug.log("view url is ", fileInfo.url);
        viewAddOne(fileKey);
        debug.log("into view",fileKey);
      };
}

function getUids(users){
    var uids = [];
    for(var i=0; i<users.length; i++){uids.push(users[i].uid);}
    return uids;
}

function getFiles(uids, beforeDays){

  var future = new hprose.Future();
  var fs = [];

  //拿文件队列
  angular.forEach(uids, function(uid) {
    var future = new hprose.Future();
    var time =  new Date().getTime() - (86400000*beforeDays);
    G.api.zrangebyscore(G.sid, uid,gen__MY_FILE_QUEUE__key(uid),time,new Date().getTime(),0,-1,function(fileQueue){
      future.resolve(fileQueue);
    }, function(name, err) {debug.warn(err);future.reject(err);});
    fs.push(future);
  });

  //合并文件队列的列表
  var Future = hprose.Future;
  Future.all(fs).then(function (values) {
      var fileQueue = [];
      for(var i=0; i < values.length; i++){
        Array.prototype.push.apply(fileQueue, values[i]);
      }
      debug.log("all files", fileQueue);
      return fileQueue;
    }, function (e) {debug.log("all promise errs is ",e);return e;})
  .then(function (fileQueue) {
    var fs = [];
    var Future = hprose.Future;
    //拿文件队列中的 具体的文件信息
    angular.forEach(fileQueue, function(fq) {
      debug.log("all promise  fileQueue1 ",fq);
      var future = new hprose.Future();
      G.api.hget(G.sid, fq.member.split(":")[1], __MY_FILE_LIST__, fq.member, function(data){
        debug.log("all G.api.hget ",data);

        if(data){future.resolve(data);}else{future.resolve();}

      }, function(err) {debug.log("err1, ", err);future.reject(err);});
      fs.push(future);
    });
    debug.log("all promise  fileQueue 3");
    //todo:
    Future.all(fs).then(function (fileInfos) {

      var fs = [];
      angular.forEach(fileInfos, function(fileInfo) {
        if(!fileInfo) return;
//        debug.log("all promise fileInfo", fileInfo);
        var f = getFile(JSON.parse(fileInfo));
        fs.push(f);
      });

      Future.all(fs).then(function(fileInfos) {
        //这里是最终返回
        future.resolve(fileInfos);
      },function(e){debug.log("err is ",e);future.reject(err);});

//      callback();
    }, function (e) {
      debug.log("all promise errs is ",e);
      future.reject(err);
//      return e;
    });
    debug.log("all promise 1", values);

  }, function (e) {
    debug.log("all promise errs is",e);
    future.reject(err);
  });

  return future;
}

function getFile(fileInfo){
    var future = new hprose.Future();
    fileInfo.filekey = gen__MY_FILE_LIST__key(fileInfo.uid,fileInfo.createTime);
    getFileActionInfo(fileInfo).then(function(v){
//      debug.log("e,",v);
      future.resolve(v);
    }, function(name, err) {debug.error("err, ", err);future.reject(err);});
    return future;
}

function getFileByFileKey(filekey){
  var future = new hprose.Future();

  function getFileInfo(){
    var future = new hprose.Future();
    G.api.hget(G.sid, filekey.split(":")[1], __MY_FILE_LIST__, filekey, function(data){
      future.resolve(JSON.parse(data));
    }, function(name, err){debug.error("err, ", err);future.reject(err);});
    return future;
  }

  getFileInfo().then(function(fileInfo){
//    debug.log("e fileInfo,",fileInfo);
//    fileInfo.filekey = gen__MY_FILE_LIST__key(fileInfo.uid,fileInfo.createTime);
    fileInfo.filekey = filekey;
    getFileActionInfo(fileInfo).then(function(v){
      debug.log("e,",v);
      future.resolve(v);
    }, function(err) {debug.error("err, ", err);future.reject(err);});
  }, function(err) {debug.error("err, ", err);future.reject(err);});
  return future;
}

function getFileActionInfo(fileInfo){

  var future = new hprose.Future();
  var fs = [];
  angular.forEach(getUids(OAApp.GetUserList()), function(uid) {
    var future = new hprose.Future();
    G.api.hget(G.sid, uid, __FILE_ACTION_INFO__, fileInfo.filekey, function(data){
      var fai = JSON.parse(data);
      debug.log("fai,",fai);
      if(!fai){future.resolve(); return;}
      fai.uid = uid;

      var actionInfos = [], obj, i;
      if(fai.downloadDateTimes){
        for(i=0; i<fai.downloadDateTimes.length; i++){
            obj = {};
            obj.time = fai.downloadDateTimes[i];
            obj.uid = uid;
            obj.type = "downloadDateTime";
            actionInfos.push(obj);
        }
      }

      if(fai.viewDateTimes){
          for(i=0; i<fai.viewDateTimes.length; i++){
              obj = {};
              obj.time = fai.viewDateTimes[i];
              obj.uid = uid;
              obj.type = "viewDateTime";
              actionInfos.push(obj);
          }
      }

      if(fai.shareDateTimes){
        for(i=0; i<fai.shareDateTimes.length; i++){
            obj = {};
            obj.time = fai.shareDateTimes[i];
            obj.uid = uid;
            obj.type = "shareDateTime";
            actionInfos.push(obj);
        }
      }
      future.resolve(actionInfos);
    }, function(name, err) {
      debug.warn(err);
      future.reject(err);
    });
    fs.push(future);
  });
  var Future = hprose.Future;
  Future.all(fs).then(function (values) {
      var actionInfos = [];
      for(var i=0; i < values.length; i++){
        Array.prototype.push.apply(actionInfos, values[i]);
      }
      fileInfo.actionInfos = actionInfos;
      future.resolve(fileInfo);
      debug.log("all actionInfos", actionInfos);
  }, function (e) {
    debug.log("all errs is ",e);
    future.reject(err);
  });
  return future;
}


function viewAddOne(filekey){updateFileActionInfo(filekey,1,0,0);}
function downloadAddOne(filekey){updateFileActionInfo(filekey,0,1,0);}
function shareAddOne(filekey){updateFileActionInfo(filekey,0,0,1);}

function updateFileActionInfo(filekey, view, download, share){
G.api.hget(G.sid, G.uid, __FILE_ACTION_INFO__, filekey, function(data){
  if(!data){
      data = new FileActionInfo();
  } else {
      data = JSON.parse(data);
  }
  var time = new Date().getTime();
  if(view==1){
      data.viewDateTimes.push(time);
  }
  if(download==1){
      data.downloadDateTimes.push(time);
  }
  if(share==1){
      data.shareDateTimes.push(time);
  }

  G.api.hset(G.sid, G.uid, __FILE_ACTION_INFO__, filekey, JSON.stringify(data), function() {
      debug.log("hset success");
  }, function(name, err) {
      debug.warn(err);
  });
}, function(name, err) {
  debug.warn(err);
});
}

















