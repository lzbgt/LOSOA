function checkinApp($scope, $q){
	getSign();
	function getSign() {
		var ps = [];
		angular.forEach($scope.users,function(user) {
			var df1 = $q.defer();
			G.leClient.lrange(G.sid,user.uid,user.uid+ "sign",0,1,function(signdata) {
								var datas = [];
								if (signdata.length !== 0) {
									angular.forEach(signdata,function(d) {
										datas.push({
												"name" : d.name,
												"signtime" :d.signtime ,
												"address":d.address,
												"status" : "签到",
												"sorttime":d.signtime
													});
											});
								}
								df1.resolve(datas);
							},
							function(name,err) {
								console.log(err);
							});
			ps.push(df1.promise);
		});
		angular.forEach($scope.users,function(user) {
			var df2 = $q.defer();
			G.leClient.lrange(G.sid,user.uid,user.uid+ "workoff",0,1,function(workoffdata) {
								var datas = [];
								if (workoffdata.length !== 0) {
									angular.forEach(workoffdata,function(w) {
														datas.push({
																	"name" : w.name,
																	"workofftime" :w.workofftime,
																	"address":w.address,
																	"status" : "签退",
																	"sorttime":w.workofftime
																});
													});
								}
								df2.resolve(datas);
							},
							function(name,err) {
								console.log(err);
							});
			ps.push(df2.promise);
		});
		$q.all(ps).then(function(data) {

			var time1 = new Date(GetDateStr(-1) + " 00:00:00").getTime();
			var time2 = new Date(GetDateStr(0) + " 00:00:00").getTime();
			var time3 = new Date(GetDateStr(1) + " 00:00:00").getTime();
			var todayarr = [];
			var yesterdayarr = [];
			for (var i = 0; i < data.length; i++) {
				for (var j = 0; j < data[i].length; j++) {
				//	debugger;
					if(data[i][j].sorttime<time2&&data[i][j].sorttime>time1){
						yesterdayarr=yesterdayarr.concat(data[i][j]);
					}else if(data[i][j].sorttime<time3&&data[i][j].sorttime>time2){
						todayarr=todayarr.concat(data[i][j]);
					}
				}
			}
			$scope.todaysign = todayarr.sort(getSortFun(
					'desc', 'sorttime'));
			if(yesterdayarr.length===0){
				$scope.yesterdaysign =[{"name" : "方超","workofftime" :"1445250304516","address":"北京市","status" : "签退","sorttime":""},
				                       {"name" : "李四保","workofftime" :"1445250130000","address":"杭州市","status" : "签退","sorttime":""},
				                       {"name" : "谢忠持","workofftime" :"1445250234516","address":"杭州市","status" : "签退","sorttime":"" },
				                       {"name" : "陆宗宝","workofftime" :"1445250014516","address":"杭州市","status" : "签退","sorttime":""}];
			}else{
				$scope.yesterdaysign = yesterdayarr.sort(getSortFun(
						'desc', 'sorttime'));
			}
		});
	}
	// 最早榜
	earlylist();
	function earlylist() {
		var ds = [];
		var time1 = new Date(GetDateStr(-7) + " 00:00:00").getTime();
		var time2 = new Date(GetDateStr(0) + " 00:00:00").getTime();
		angular.forEach($scope.users,function(user) {
			var deferred = $q.defer();
			G.leClient.lrange(G.sid,user.uid,user.uid+ "sign",0,6,function(data) {
				//debugger;
						var earlyjson =null;
								if (data.length !== 0) {
									var hours=null;
									var minutes=null;
									var seconds=null;
									var count=null;
									angular.forEach(data,function(d) {
										if(d.signtime<time2&&d.signtime>time1){
											var date = new Date(d.signtime);
											hours += date.getHours() ;
											minutes += date.getMinutes();
											seconds += date.getSeconds();
											count += 1;
										}
									});
									if(hours !==null&&minutes !==null&&seconds !==null){
										earlyjson = {
												"name" : data[0].name,
												"earlytime" : (hours/count).toFixed(0)+":"+(minutes/count).toFixed(0)+":"+(seconds/count).toFixed(0),
												"earliest":((hours/count).toFixed(0)*3600+(minutes/count).toFixed(0)*60+(seconds/count).toFixed(0))
											};
									}
									 
								}
								deferred.resolve(earlyjson);
							},
							function(name,err) {
								console.log(err);
							});
			ds.push(deferred.promise);
		});
		$q.all(ds).then(function(data) {
			var tempdata=[];
			for (var i = 0; i < data.length; i++) {
				if (data[i]) {
					tempdata.push(data[i]);
				}
			}
				if (tempdata.length!==0) {
						$scope.earliest = tempdata.sort(getSortFun(
								'asc', 'earliest'));	
					}
					
				});
	}

	// 最勤榜
	frequentlylist();
	function frequentlylist() {
		//debugger;
		var time1 = new Date(GetDateStr(-7) + " 00:00:00").getTime();
		var time2 = new Date(GetDateStr(0) + " 00:00:00").getTime();
		var promises = [];
		angular.forEach($scope.users, function(user) {
			var deffered1 = $q.defer();
			G.leClient.lrange(G.sid, user.uid, user.uid + "sign", 0, 7,function(signdata) {
				var tempdata=[];
				if (signdata.length !== 0) {
						for (var i = 0; i < signdata.length; i++) {
							if (signdata[i].signtime < time2&& signdata[i].signtime > time1) {
								tempdata.push(signdata[i]);
							}
						}
				}
				deffered1.resolve(tempdata);
					}, function(name, err) {
						console.log(err);
					});
			promises.push(deffered1.promise);
			var deffered2 = $q.defer();
			G.leClient.lrange(G.sid, user.uid, user.uid + "workoff", 0, 7,function(workoffdata) {
				var tempdata=[];
				if (workoffdata.length !== 0) {
						for (var i = 0; i < workoffdata.length; i++) {
							if (workoffdata[i].workofftime < time2&& workoffdata[i].workofftime > time1) {
								tempdata.push(workoffdata[i]);
							}
						}

				}
				deffered2.resolve(tempdata);
					}, function(name, err) {
						console.log(err);
					});
			promises.push(deffered2.promise);
		});

		$q.all(promises).then(function(data) {
		//	debugger;
			var frequentlyArr = [], date;

				for (var i = 0; i < data.length; i++) {					
						if(i<(data.length-1)/2){
							var signhours=null;									
							var signminutes=null;
							var signseconds=null;
							var signcount=null;
							var workoffhours=null;									
							var workoffminutes=null;
							var workoffseconds=null;
							var workoffcount=null;
							if(data[2*i].length!==0){
								for (var j = 0; j < data[2*i].length; j++) {
									date = new Date(data[2*i][j].signtime);
									signhours += date.getHours() ;
									signminutes += date.getMinutes();
									signseconds += date.getSeconds();
									signcount += 1;
									
								}
							}
							
							if(data[2*i+1].length!==0){
								for (var k = 0; k < data[2*i+1].length; k++) {
									date = new Date(data[2*i+1][k].workofftime);
									workoffhours += date.getHours() ;
									workoffminutes += date.getMinutes();
									workoffseconds += date.getSeconds();
									workoffcount += 1;
								}
							}
							
						//	debugger;
						
							var avgsigntime=((signhours/signcount)*3600+(signminutes/signcount)*60+signseconds/signcount).toFixed(1);
							var avgworkofftime=((workoffhours/workoffcount)*3600+(workoffminutes/workoffcount)*60+workoffseconds/workoffcount).toFixed(1);							
							var worktime=(((avgworkofftime-avgsigntime)/3600)*7).toFixed(1);
							if(worktime>=0){
								frequentlyArr.push({"name":data[2*i][0].name,"frequentlytime":worktime,"sorttime":worktime*3600});
							}														
						}				

				}

				$scope.frequentlyTime =frequentlyArr.sort(getSortFun(
						'desc', 'sorttime'));

			});
	}
	$scope.sign = function() {
		//debugger;
		console.log(returnCitySN.cip+','+returnCitySN.cname);
		var s = new Signfun();
		s.id = Date.now();
		s.name = $scope.user.fullName;
		s.signtime = Date.now();
		s.address=returnCitySN.cname;
		s.status = 0;
		var time = new Date(GetDateStr(0) + " 00:00:00").getTime();
		var createTime = new Date().getTime();
		G.leClient.lrange(G.sid,G.uid,G.uid + "sign",0,0,function(signdata) {
							// debugger;
		if (signdata.length !== 0&& signdata[0].signtime > time) {
			alert("你已签过到了！！");
		} else {
			G.leClient.lpush(G.sid,G.uid,G.uid+ "sign",s,function(data) {
					console.log("lpush sign ok");
					getSign();
					$scope.users.forEach(function(user) {
								OAApp.SendMsg(user.uid,s).then();
							});

					angular.forEach($scope.users,function(user) {
							var uid = user.uid;
							var oamsg = new OAMessage();
							oamsg.appid = __APP_TYPE_CHECK_IN__; // 根据appid，获得消息类型
							oamsg.brif =s; //
							oamsg.contentId = null; //
							oamsg.createTime = createTime;
							oamsg.msgType = OAApp.GetCheckInMsgType();

							// todo:
						//	oamsg.msgType = OAApp.GetCheckInMsgType();
							oamsg.user = $scope.user;
							oamsg.receivers = $scope.users;
							oamsg.timestamp = createTime;

							var msg = new Message();
							msg.from = G.uid;
							msg.to = uid;
							msg.msg = JSON.stringify(oamsg);
							//
							G.api.sendmsg(G.sid,msg,function() {
										debug.log("In send request, msg sent OK",msg);
									},
									function(name,err) {
										debug.error("In send request, err="+ err);
									});
							});

							angular.forEach($scope.users,function(user) {
									var uid = user.uid;
									function ScorePair() {
										this.score = 0;
										this.member = null;
									}

									var oamsg = new OAMessage();
									oamsg.appid = __APP_TYPE_CHECK_IN__; // 根据appid，获得消息类型
									oamsg.brif =s; //
									oamsg.contentId = null; //
									oamsg.createTime = createTime;


									var sp = new ScorePair();
									sp.score = createTime;
									sp.member = JSON.stringify(oamsg);

									G.api.zadd(G.sid,G.uid,gen__MY_QUEUE__key(uid),sp,function() {
														debug.log("sum zadd success");
													},
													function(name,err) {
														debug.warn(err);
													});

											});
									//document.location.reload();
								},
								function(name,err) {
									console.log(err);
								});
						}

					}, function(name, err) {
						console.log(err);
					});
	};
	$scope.offwork = function() {
		var s = new Signfun();
		s.id = Date.now();
		s.name = $scope.user.fullName;
		s.workofftime = Date.now();
		s.address=returnCitySN.cname;
		s.status = 1;
		var time = new Date(GetDateStr(0) + " 00:00:00").getTime();
		var createTime = new Date().getTime();
		G.leClient.lrange(G.sid,G.uid,G.uid + "workoff",0,0,function(workoffdata) {
			if (workoffdata.length !== 0&& workoffdata[0].workofftime > time) {
				alert("你已下班了！！");
			} else {
				G.leClient.lpush(G.sid,G.uid,G.uid+ "workoff",s,function(data) {
					console.log("lpush workoff ok");
					getSign();
					$scope.users.forEach(function(	user) {
								OAApp.SendMsg(user.uid,s).then();
							});

					angular.forEach($scope.users,	function(user) {
						var uid = user.uid;
						var oamsg = new OAMessage();
						oamsg.appid = __APP_TYPE_CHECK_IN__; //根据appid，获得消息类型
						oamsg.brif =s; //
						oamsg.contentId = null; //
						oamsg.createTime = createTime; //time message received or sent
						oamsg.msgType = OAApp.GetCheckInMsgType();

						//todo:
						//oamsg.msgType = OAApp.GetCheckInMsgType();
						oamsg.user = $scope.user;
						oamsg.receivers = $scope.users;
						oamsg.timestamp = createTime;

						var msg = new Message();
						msg.from = G.uid;
						msg.to = uid;
						msg.msg = JSON.stringify(oamsg);
						//
						G.api.sendmsg(G.sid,msg,function() {
											debug.log("In send request, msg sent OK",msg);
										},
										function(name,err) {
											debug.error("In send request, err="+ err);
										});
							});

					angular.forEach($scope.users,function(user) {
								var uid = user.uid;
								function ScorePair() {
									this.score = 0;
									this.member = null;
								}

								var oamsg = new OAMessage();
								oamsg.appid = __APP_TYPE_CHECK_IN__; //根据appid，获得消息类型
								oamsg.brif =s; //
								oamsg.contentId = null; //
								oamsg.createTime = createTime; //time message received or sent

								var sp = new ScorePair();
								sp.score = createTime;
								sp.member = JSON.stringify(oamsg);

								G.api.zadd(G.sid,G.uid,gen__MY_QUEUE__key(uid),sp,function() {
												debug.log("sum zadd success");
											},
											function(name,err) {
												debug.warn(err);
											});

									});

					//document.location.reload();
				},
				function(name,err) {
					console.log(err);
				});
			}
		}, function(name, err) {
			console.log(err);
		});
	};

	$scope.onedays = function() {
		var time1 = new Date(GetDateStr(-1) + " 00:00:00").getTime();
		var time2 = new Date(GetDateStr(0) + " 00:00:00").getTime();
		var promises = [];
		angular.forEach($scope.users, function(user) {
			var deffered1 = $q.defer();
			G.leClient.lrange(G.sid, user.uid, user.uid + "sign", 0, 1,function(signdata) {
						var tempdata = null;
						var tempjson={};
						if (signdata.length !== 0) {
							for (var i = 0; i < signdata.length; i++) {
								if (signdata[i].signtime < time2&& signdata[i].signtime > time1) {
									tempdata = signdata[i];
								}
							}
						}
						tempjson.signtime=tempdata;
						tempjson.name=user.fullName;
						deffered1.resolve(tempjson);

					}, function(name, err) {
						console.log(err);
					});
			promises.push(deffered1.promise);
			var deffered2 = $q.defer();
			G.leClient.lrange(G.sid, user.uid, user.uid + "workoff", 0, 1,function(workoffdata) {
						var tempdata = null;
						var tempjson={};
						if (workoffdata.length !== 0) {
							for (var i = 0; i < workoffdata.length; i++) {
								if (workoffdata[i].workofftime < time2&& workoffdata[i].workofftime > time1) {
									tempdata = workoffdata[i];
								}
							}
						}
						tempjson.workofftime=tempdata;
						tempjson.name=user.fullName;
						deffered2.resolve(tempjson);
					}, function(name, err) {
						console.log(err);
					});
			promises.push(deffered2.promise);
		});

		$q.all(promises).then(function(data) {
							var datas = [];
							for (var i = 0; i < data.length; i++) {
								if (i < (data.length - 1) / 2) {
									if (data[2 * i + 1].workofftime !== null && data[2 * i].signtime !== null) {
										datas.push({
													"name" : data[2 * i].name,
													"signtime" : data[2 * i].signtime.signtime,
													"workofftime" : data[2 * i + 1].workofftime.workofftime,
													"worktime" : data[2 * i + 1].workofftime.workofftime - data[2 * i].signtime.signtime
												});
									} else if (data[2 * i + 1].workofftime === null && data[2 * i].signtime === null) {
										datas.push({
											"name" : data[2 * i].name,
											"signtime" : "未签到",
											"workofftime" : "未签退",
											"worktime" : "0"
										});
									} else if (data[2 * i + 1].workofftime !== null && data[2 * i].signtime === null) {
										datas.push({
													"name" : data[2 * i].name,
													"signtime" : "未签到",
													"workofftime" : data[2 * i + 1].workofftime.workofftime,
													"worktime" : "14400000"
												});
									} else if (data[2 * i + 1].workofftime === null && data[2 * i].signtime !== null) {
										datas.push({
													"name" : data[2 * i].name,
													"signtime" : data[2 * i].signtime.signtime,
													"workofftime" : "未签退",
													"worktime" : "14400000"
												});
									}

								}
							}
							$scope.oneDaysData = datas.sort(getSortFun(
									'desc', 'worktime'));
						});

	};
	$scope.onedays();


	$scope.sevendays = function() {

	var data=[{"name":"李四保","signtime":"8:45:39","workofftime":"18:45:41","worktime":"10小时"},
	          {"name":"方超","signtime":"8:45:39","workofftime":"18:45:41","worktime":"10小时"},
	          {"name":"谢忠持","signtime":"8:45:39","workofftime":"18:45:41","worktime":"10小时"},
	          {"name":"陆忠宝","signtime":"8:45:39","workofftime":"18:45:41","worktime":"10小时"},
	          {"name":"李继维","signtime":"8:45:39","workofftime":"18:45:41","worktime":"10小时"},
	          {"name":"陈勇","signtime":"8:45:39","workofftime":"18:45:41","worktime":"10小时"}
	          ];
	$scope.sevenDaysData = data;
	};
	$scope.sevendays();

	$scope.monthdays = function() {
		var data=[{"name":"李四保","signtime":"8:45:39","workofftime":"18:45:41","worktime":"300小时"},
		          {"name":"方超","signtime":"8:45:39","workofftime":"18:45:41","worktime":"300小时"},
		          {"name":"谢忠持","signtime":"8:45:39","workofftime":"18:45:41","worktime":"300小时"},
		          {"name":"陆忠宝","signtime":"8:45:39","workofftime":"18:45:41","worktime":"300小时"},
		          {"name":"李继维","signtime":"8:45:39","workofftime":"18:45:41","worktime":"300小时"},
		          {"name":"陈勇","signtime":"8:45:39","workofftime":"18:45:41","worktime":"300小时"}
		          ];
		$scope.monthDaysData = data;
	};
	$scope.monthdays ();

	function GetDateStr(AddDayCount) {
		var dd = new Date();
		dd.setDate(dd.getDate() + AddDayCount);// 获取AddDayCount天后的日期
		var y = dd.getFullYear();
		var m = dd.getMonth() + 1;// 获取当前月份的日期
		var d = dd.getDate();
		return y + "/" + m + "/" + d;
	}

	function Signfun() {
		this.id = null;
		this.name = null;
		this.signtime = null;
		this.workofftime = null;
		this.ip = null;
		this.address = null;
		this.status = null;
	}
	function stringFromTimeStamp(time) {
		var newDate = new Date();
		newDate.setTime(time * 1000);
		// return newDate.toLocaleString();
		return newDate.toLocaleTimeString();


	}
	function stringFromTimeStamp2(time) {
		var newDate = new Date();
		newDate.setTime(time * 1000);
		return newDate.toLocaleString();
		// return newDate.toLocaleTimeString();
	}
	function stringFromTimeStamp3(time) {

		return new Date(parseInt(time) * 1000).toLocaleString();

	}
	function getSortFun(order, sortBy) {
		var ordAlpah = (order == 'asc') ? '>' : '<';
        /*jshint -W054 */
		var sortFun = new Function('a', 'b', 'return a.' + sortBy + ordAlpah + 'b.' + sortBy + '?1:-1');
		return sortFun;
	}
	function getNextDay(d){
        d = new Date(d);
        d = +d + 1000*60*60*24;
        d = new Date(d);
        //return d;
        //格式化
        return d.getFullYear()+"-"+(d.getMonth()+1)+"-"+d.getDate();

    }
    $(".my-nav li").click(function(){
  	   $(this).addClass("my-active").siblings().removeClass("my-active");
  	   $(".my-info>div:eq("+$(this).index()+")").show().siblings().hide();
  	  });

}
