eval(function(n){"use strict";function r(n){var r=[];return r[n-1]=void 0,r}function u(n,r){return f(n[0]+r[0],n[1]+r[1])}function t(n,r){var u,t;return n[0]==r[0]&&n[1]==r[1]?0:(u=0>n[1],t=0>r[1],u&&!t?-1:!u&&t?1:a(n,r)[1]<0?-1:1)}function f(n,r){var u,t;for(r%=0x10000000000000000,n%=0x10000000000000000,u=r%un,t=Math.floor(n/un)*un,r=r-u+t,n=n-t+u;0>n;)n+=un,r-=un;for(;n>4294967295;)n-=un,r+=un;for(r%=0x10000000000000000;r>0x7fffffff00000000;)r-=0x10000000000000000;for(;-0x8000000000000000>r;)r+=0x10000000000000000;return[n,r]}function i(n){return n>=0?[n,0]:[n+un,-un]}function c(n){return n[0]>=2147483648?~~Math.max(Math.min(n[0]-un,2147483647),-2147483648):~~Math.max(Math.min(n[0],2147483647),-2147483648)}function a(n,r){return f(n[0]-r[0],n[1]-r[1])}function o(n,r){return n.ab=r,n.cb=0,n.O=r.length,n}function e(n){return n.cb>=n.O?-1:255&n.ab[n.cb++]}function v(n){return n.ab=r(32),n.O=0,n}function s(n){var r=n.ab;return r.length=n.O,r}function g(n,r,u,t){l(r,u,n.ab,n.O,t),n.O+=t}function l(n,r,u,t,f){for(var i=0;f>i;++i)u[t+i]=n[r+i]}function C(n,r,u){var t,f,c,a,o="",v=[];for(f=0;5>f;++f){if(c=e(r),-1==c)throw Error("truncated input");v[f]=c<<24>>24}if(t=F({}),!V(t,v))throw Error("corrupted input");for(f=0;64>f;f+=8){if(c=e(r),-1==c)throw Error("truncated input");c=c.toString(16),1==c.length&&(c="0"+c),o=c+""+o}/^0+$|^f+$/i.test(o)?n.M=tn:(a=parseInt(o,16),n.M=a>4294967295?tn:i(a)),n.S=M(t,r,u,n.M)}function z(n,r){return n.Y=v({}),C(n,o({},r),n.Y),n}function p(n,r,u){var t=n.y-r-1;for(0>t&&(t+=n.c);0!=u;--u)t>=n.c&&(t=0),n.x[n.y++]=n.x[t++],n.y>=n.c&&N(n)}function x(n,u){(null==n.x||n.c!=u)&&(n.x=r(u)),n.c=u,n.y=0,n.w=0}function N(n){var r=n.y-n.w;r&&(g(n.T,n.x,n.w,r),n.y>=n.c&&(n.y=0),n.w=n.y)}function d(n,r){var u=n.y-r-1;return 0>u&&(u+=n.c),n.x[u]}function J(n,r){n.x[n.y++]=r,n.y>=n.c&&N(n)}function L(n){N(n),n.T=null}function j(n){return n-=2,4>n?n:3}function B(n){return 4>n?0:10>n?n-3:n-6}function b(n,r){return n.h=r,n.bb=null,n.V=1,n}function k(n){if(!n.V)throw Error("bad state");if(n.bb)throw Error("No encoding");return h(n),n.V}function h(n){var r=U(n.h);if(-1==r)throw Error("corrupted input");n.$=tn,n.Z=n.h.d,(r||t(n.h.U,fn)>=0&&t(n.h.d,n.h.U)>=0)&&(N(n.h.b),L(n.h.b),n.h.a.K=null,n.V=0)}function M(n,r,u,t){return n.a.K=r,L(n.b),n.b.T=u,A(n),n.f=0,n.l=0,n.Q=0,n.R=0,n._=0,n.U=t,n.d=fn,n.G=0,b({},n)}function U(n){var r,f,a,o,e,v;if(v=c(n.d)&n.P,Q(n.a,n.t,(n.f<<4)+v)){if(Q(n.a,n.E,n.f))a=0,Q(n.a,n.r,n.f)?(Q(n.a,n.u,n.f)?(Q(n.a,n.s,n.f)?(f=n._,n._=n.R):f=n.R,n.R=n.Q):f=n.Q,n.Q=n.l,n.l=f):Q(n.a,n.o,(n.f<<4)+v)||(n.f=7>n.f?9:11,a=1),a||(a=q(n.n,n.a,v)+2,n.f=7>n.f?8:11);else if(n._=n.R,n.R=n.Q,n.Q=n.l,a=2+q(n.D,n.a,v),n.f=7>n.f?7:10,e=S(n.k[j(a)],n.a),e>=4){if(o=(e>>1)-1,n.l=(2|1&e)<<o,14>e)n.l+=X(n.J,n.l-e-1,n.a,o);else if(n.l+=T(n.a,o-4)<<4,n.l+=Y(n.q,n.a),0>n.l)return-1==n.l?1:-1}else n.l=e;if(t(i(n.l),n.d)>=0||n.l>=n.m)return-1;p(n.b,n.l,a),n.d=u(n.d,i(a)),n.G=d(n.b,0)}else r=D(n.j,c(n.d),n.G),n.G=7>n.f?E(r,n.a):R(r,n.a,d(n.b,n.l)),J(n.b,n.G),n.f=B(n.f),n.d=u(n.d,cn);return 0}function F(n){n.b={},n.a={},n.t=r(192),n.E=r(12),n.r=r(12),n.u=r(12),n.s=r(12),n.o=r(192),n.k=r(4),n.J=r(114),n.q=H({},4),n.D=m({}),n.n=m({}),n.j={};for(var u=0;4>u;++u)n.k[u]=H({},6);return n}function A(n){n.b.w=0,n.b.y=0,I(n.t),I(n.o),I(n.E),I(n.r),I(n.u),I(n.s),I(n.J),Z(n.j);for(var r=0;4>r;++r)I(n.k[r].z);w(n.D),w(n.n),I(n.q.z),K(n.a)}function V(n,r){var u,t,f,i,c,a,o;if(5>r.length)return 0;for(o=255&r[0],f=o%9,a=~~(o/9),i=a%5,c=~~(a/5),u=0,t=0;4>t;++t)u+=(255&r[1+t])<<8*t;return u>99999999||!W(n,f,i,c)?0:G(n,u)}function G(n,r){return 0>r?0:(n.A!=r&&(n.A=r,n.m=Math.max(n.A,1),x(n.b,Math.max(n.m,4096))),1)}function W(n,r,u,t){if(r>8||u>4||t>4)return 0;P(n.j,u,r);var f=1<<t;return O(n.D,f),O(n.n,f),n.P=f-1,1}function O(n,r){for(;r>n.e;++n.e)n.I[n.e]=H({},3),n.H[n.e]=H({},3)}function q(n,r,u){if(!Q(r,n.N,0))return S(n.I[u],r);var t=8;return t+=Q(r,n.N,1)?8+S(n.L,r):S(n.H[u],r)}function m(n){return n.N=r(2),n.I=r(16),n.H=r(16),n.L=H({},8),n.e=0,n}function w(n){I(n.N);for(var r=0;n.e>r;++r)I(n.I[r].z),I(n.H[r].z);I(n.L.z)}function P(n,u,t){var f,i;if(null==n.F||n.g!=t||n.B!=u)for(n.B=u,n.X=(1<<u)-1,n.g=t,i=1<<n.g+n.B,n.F=r(i),f=0;i>f;++f)n.F[f]=y({})}function D(n,r,u){return n.F[((r&n.X)<<n.g)+((255&u)>>>8-n.g)]}function Z(n){var r,u;for(u=1<<n.g+n.B,r=0;u>r;++r)I(n.F[r].v)}function E(n,r){var u=1;do u=u<<1|Q(r,n.v,u);while(256>u);return u<<24>>24}function R(n,r,u){var t,f,i=1;do if(f=u>>7&1,u<<=1,t=Q(r,n.v,(1+f<<8)+i),i=i<<1|t,f!=t){for(;256>i;)i=i<<1|Q(r,n.v,i);break}while(256>i);return i<<24>>24}function y(n){return n.v=r(768),n}function H(n,u){return n.C=u,n.z=r(1<<u),n}function S(n,r){var u,t=1;for(u=n.C;0!=u;--u)t=(t<<1)+Q(r,n.z,t);return t-(1<<n.C)}function Y(n,r){var u,t,f=1,i=0;for(t=0;n.C>t;++t)u=Q(r,n.z,f),f<<=1,f+=u,i|=u<<t;return i}function X(n,r,u,t){var f,i,c=1,a=0;for(i=0;t>i;++i)f=Q(u,n,r+c),c<<=1,c+=f,a|=f<<i;return a}function Q(n,r,u){var t,f=r[u];return t=(n.i>>>11)*f,(-2147483648^t)>(-2147483648^n.p)?(n.i=t,r[u]=f+(2048-f>>>5)<<16>>16,-16777216&n.i||(n.p=n.p<<8|e(n.K),n.i<<=8),0):(n.i-=t,n.p-=t,r[u]=f-(f>>>5)<<16>>16,-16777216&n.i||(n.p=n.p<<8|e(n.K),n.i<<=8),1)}function T(n,r){var u,t,f=0;for(u=r;0!=u;--u)n.i>>>=1,t=n.p-n.i>>>31,n.p-=n.i&t-1,f=f<<1|1-t,-16777216&n.i||(n.p=n.p<<8|e(n.K),n.i<<=8);return f}function K(n){n.p=0,n.i=-1;for(var r=0;5>r;++r)n.p=n.p<<8|e(n.K)}function I(n){for(var r=n.length-1;r>=0;--r)n[r]=1024}function _(n){for(var r,u,t,f=0,i=0,c=n.length,a=[],o=[];c>f;++f,++i){if(r=255&n[f],128&r)if(192==(224&r)){if(f+1>=n.length)return n;if(u=255&n[++f],128!=(192&u))return n;o[i]=(31&r)<<6|63&u}else{if(224!=(240&r))return n;if(f+2>=n.length)return n;if(u=255&n[++f],128!=(192&u))return n;if(t=255&n[++f],128!=(192&t))return n;o[i]=(15&r)<<12|(63&u)<<6|63&t}else{if(!r)return n;o[i]=r}65535==i&&(a.push(String.fromCharCode.apply(String,o)),i=-1)}return i>0&&(o.length=i,a.push(String.fromCharCode.apply(String,o))),a.join("")}function $(n){return n>64&&91>n?n-65:n>96&&123>n?n-71:n>47&&58>n?n+4:43===n?62:47===n?63:0}function nn(r){for(var u,t,f=r.length,i=3*f+1>>>2,c=("Uint8Array"in n?new n.Uint8Array(i):new Array(i)),a=0,o=0,e=0;f>e;e++)if(t=3&e,a|=$(r.charCodeAt(e))<<18-6*t,3===t||f-e===1){for(u=0;3>u&&i>o;u++,o++)c[o]=a>>>(16>>>u&24)&255;a=0}return c}function rn(n){n=nn(n);var r={};for(r.d=z({},n);k(r.d.S););return _(s(r.d.Y))}var un=4294967296,tn=[4294967295,-un],fn=[0,0],cn=[1,0];return rn}(this)("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"));
var api = (function() {
    return function(ip) {
        if (ip.substr(0, 7) == "http://") {
            ip = ip.substr(7);
            i = ip.indexOf("/");
            if (i > 0) {
                ip = ip.substr(0, i);
            }
        }
		ayapi = ["login", "register","getvar", "act", "setdata", "set", "get", "del", "expire", "hmclear", "hset", "hget", "hlen", "hkeys",
            "hgetall", "hmset", "hmget", "exit", "restart", "lpush", "lpop", "rpush", "rpop", "lrange", "zadd", "zrange",
            "sadd", "scard", "sclear", "sdiff", "sinter", "smclear", "smembers", "srem", "sunion",
            "sendmsg", "readmsg", "pullmsg", "invite", "accept", "test", "veni", "sethostip", "proxyget",
            "createinvcode", "getinvcodeinfo", "updateinvcode", "deleteinvcode",
            "setinvtemplate", "getinvtemplate", "getappdownloadkey", "getresbyname", "getgshorturlkey", "getlshorturlkey",
            "incr", "zcard", "zcount", "zrem", "zscore", "zrank", "zrangebyscore",
            "lindex", "lexpire", "lexpireat", "lttl", "lpersist", "llen"];
        apiurl = "ws://" + ip + "/ws/";
        if (navigator.userAgent.indexOf("Firefox") != -1) {
            apiurl = "http://" + ip + "/webapi/";
        }
        return hprose.Client.create(apiurl, ayapi);
    };
}());

function setLog(isShow) {
    if (isShow) {
        window.debug = {
            log: window.console.log.bind(window.console),
            error: window.console.error.bind(window.console),
            info: window.console.info.bind(window.console),
            warn: window.console.warn.bind(window.console)
        };
    } else {
        var __no_op = function () { };
        window.debug = {
            log: __no_op,
            error: __no_op,
            warn: __no_op,
            info: __no_op
        }
    }
};

function processError(name, err) {
    debug.error(name, err);
}
function PE(name) {
    pe = G.ayFE[name];
    //debug.log("PE:", name, "f:", pe);
    if (pe) {
        debug.log("PE: seted");
        return pe;
    }
    //debug.log("pe return");
    return function (e) {
        debug.log("PE:default mark");
        if (G.ayFE[name]) {
            return G.ayFE[name](e);
        }
        G.ayErr[name] = e; //LeitherErr(e)
        debug.error(name + ":" + e);
    }
}
function errReply() {
    for (var i in G.ayErr) {
        f = G.ayFE[i];
        err = G.ayErr[i];
        if (err != null && f != null) {
            G.ayErr[i] = null;
            debug.log("errReply err:", err);
            f(err);
        }
    }
}
function LeitherErr(err) {
    str = err.toString();
    debug.log(str);
    this.ID = "-1";
    this.Info = str;
    if (str.indexOf("Error: ") != 0) {
        return;
    }
    str = str.substring(6);
    id = str.indexOf(':');
    if (id >= 0) {
        this.ID = str.substring(0, id);
        this.Info = str.substring(id + 1);
    }
    debug.log("id=[", this.ID, "] info=[", this.Info, "]");
}
function setErrFunc(name, f) {
    debug.log("setErrFunc ", name, "f:", f);
    G.ayFE[name] = f;
}

var G = {
	//bidPath : window.location.pathname+"/appID/userID/",
	ayFE: {
        //"login": function (e) {console.error(e);}
    },
    ayErr: {},
    IPList: [],
    InitFunc: []
};
function PushInitFunc(f) {
    G.InitFunc.push(f);
}
function RunInitFunc() {
    for (i = 0; i < G.InitFunc.length; i++) {
        G.InitFunc[i]();
    }
}
function LeitherIsOK() {
    return G.api != null;
}

function getErr() {
}
function setMain(info) {
    debug.log("setMain: ", info);
    if (G.Running) {
        debug.warn("setMain: app running2");
        return;
    }
    if (typeof (InitErrFunc) == "function") {
        InitErrFunc();
    }
    if (typeof(main) == "undefined"){
        return;
    }
    debug.log("main function ok run it");
    G.Main = main;

    if (LeitherIsOK() && G.sid != null) {
        G.Running = true;
        RunInitFunc();
        main();
    } else {
        debug.log("errReply()");
        errReply();
    }
}
function readCacheVar(key, def) {
    //debug.log("readCacheVar k:", key, "def:", def)
    v = localStorage[key];
    if (v) {
        //debug.log("readCacheVar v:", v)
        return JSON.parse(v);
    }
    //debug.log("readCacheVar def:", def)
    if (typeof(def) != "undefined"){
        localStorage[key] = JSON.stringify(def);
    }
    return def;
}
function saveLoginInfo(uid, ppt) {
    debug.log("saveLoginInfo uid:", uid, "ppt:", ppt);
    if (typeof (uid) != "string") {
        uid = "";
    }
    if (typeof (ppt) != "string") {
        ppt = "";
    }
   // localStorage[window.location.pathname + "/" + G.AppBid + "/uid"] = JSON.stringify(uid);
    localStorage[window.location.pathname + "/" + G.AppBid + "/ppt"] = JSON.stringify(ppt);
    debug.log("saveLoginInfo end uid:", localStorage[window.location.pathname + "/" + G.AppBid + "/uid"]);
    G.uid = uid;
    G.userppt = ppt;
}

function InitCfg(I){
    debug.log("InitCfg");
    G.Local = I.Local;
    G.SystemBid = I.SystemBid;
    G.AppBid = I.AppBid;

    if(I.IPList && I.IPList.length && I.IPList.length > 0) {
      G.IPList = I.IPList;
    }else{
      G.IPList = readCacheVar(G.AppBid + "/iplist");
    }

    //debug.log(G.IPList)
    G.userppt = I.userppt||readCacheVar(window.location.pathname + "/" + G.AppBid + "/ppt");
    G.AppName = I.AppName||readCacheVar(G.AppBid + "/appname");
    G.uid = I.userid||readCacheVar(window.location.pathname + "/" + G.AppBid  + "/uid");
    //debug.log("InitCfg end， uid=", G.uid)
    return true;
}

function InitDb(){
    debug.log("InitDb");
    var future = new hprose.Future();
    var version = version || 2;
    var request = window.indexedDB.open("LeitherApi", version);
    G.ApptbName = G.appBid + "_" + G.AppName;
    debug.log(G.ApptbName);
    request.onerror = function (e) {
        debug.error(e.currentTarget.error.message);
         future.reject(e);
    };
    request.onsuccess = function (e) {
        debug.log("InitDb ok");
        var db = e.target.result;
        G.LeitherDb = db;
        future.resolve(db);
    };
    request.onupgradeneeded = function (e) {
        var db = e.target.result;
        //debug.log(db.objectStoreNames)
        if (!db.objectStoreNames.contains('res')) {
            var store = db.createObjectStore('res', { keyPath: "id" });
        }
        if (db.objectStoreNames.contains(G.ApptbName)) {
            db.deleteObjectStore(G.ApptbName);
            //var store = db.createObjectStore(G.ApptbName, { keyPath: "id" }); //必须放对象
        }
        debug.log('DB version changed to ' + version);
    };
    return future;
}

function GetDbData(key){
    var tr = G.LeitherDb.transaction("res", 'readwrite');
    var store = tr.objectStore("res");
    var future = new hprose.Future();
    debug.log('getdbdata ');
    request = store.get(key);
    request.onerror = function (e) {
        future.reject(e);
    };
    request.onsuccess = function (e) {
        future.resolve(e.target.result);
        debug.log('getdbdata2 ', e.target.result);
    };
    return future;
}

function SetDbData(value){
    var tr = G.LeitherDb.transaction("res", 'readwrite');
    var store = tr.objectStore("res");
    var future = new hprose.Future();
    request = store.put(value);
    request.onerror = function (e) {
        debug.log('setdbdata err', e);
        future.reject(e)
    };
    request.onsuccess = function (e) {
        future.resolve(e.target.result);
        debug.log('setdbdata: ', e.target.result)
    };
    return future;
}

function RunApp(I, ipnum) {
	//debugger;
    setLog(I.Log);
	G.I=I;
    G.appBid = I.AppBid;
    G.Running = false;
    if (I.AppVer) {
        G.AppVer = I.AppVer;
    } else {
        G.AppVer = "last";
    }

    debug.log("RunApp");
    if (ipnum == 0 && !InitCfg(I)) {    //读取配置
        return;
    }
    if (G.IPList.length <= ipnum) {
        //后续可改为利用错误机制 tbd
        console.error("iplist.length [", G.IPList.length, "]<ipnum[", ipnum, "]");
        return
    }
    ip = G.IPList[ipnum];
    RunAppByIP(ip);
}

function processManifest(appBid, version, data) {
    var future = new hprose.Future();
    var m = JSON.parse(data);
    var getList = function (res, ver) {
        if (ver == "last" || ver == "release") {
            ver = res[ver];
        }
		debug.log("loading resfiles for app: ", appBid, ", version:", ver, m);
        return res['ResFile'][ver];
    };
    var list = getList(m, version);
    var getFs = function (i) {
        debug.log("getFs", i);
        fs = [];
        for (; i < list.length; i++) {
            var key = list[i];
            debug.log("load resfile with key:", key);
            if (key == "") {
                //i++;
                //break;
                debug.error("invliad key:", key);
                continue;
            }
            debug.log("push");
            fs.push(loadJS(appBid, key));
            debug.log("push end");
        }

        debug.log("all");
        var Future = hprose.Future;
        Future.all(fs).then(function (values) {
            debug.log("all promise", values);
            //setMain("processManifest loaded all resfiles");
            //if (i < list.length) {
            //    getFs(i);
            //}
            future.resolve();
        }, function (e) {
            debug.log(e);
            future.reject(e);
        });
        debug.log("all end");
    };

    getFs(0);
    return future;
}

function RunAppByIP(ip) {
    //读取本地配置文件
    //
    if (ip.length > 0) {
        G.currentIP = ip;
    } else {
        ip = G.currentIP;
    }
	G.api = api(ip);
    InitDb()
    .then(function(db){
	    debug.log("hprose ready", db);
        G.api.ready(function (stub) {
            debug.log("hprose ready ok");
	        //应该先load资源再login
	        debug.log("G.uid=", G.uid);
	        LoadApp(stub, G.AppName, G.AppBid, G.AppVer)
            .then(function () {
                debug.log("login");
                errfunc = PE("login");
                stub.login(G.uid, G.userppt)//如果没有用户信息，应该进入代码的登录或初始化函数
                .then(function (reply) {
                debug.log("login ok");
                G.sid = reply.sid;
				G.user = reply.user;
				//debugger;
				if(reply.user!=null){
					G.bid = reply.user.id;//for weibo
				}else{
					G.bid=G.uid;
				}
				G.leClient = G.api;//for weibo
				G.swarm = reply.swarm;
            debug.log("LeitherIsOK:", LeitherIsOK());
            debug.log("login ok sid=", reply.sid);
            debug.log("user= ", reply.user);
            debug.log("swarm=", reply.swarm);
            debug.log("appName=", G.AppName);
            setMain("after loaded app and logedin");
            //同步检查最新版的hprose
            stub.getresbyname(G.sid, G.SystemBid, "LeitherApi", G.AppVer)
            .then(function (data) {
                var r = new FileReader();
                r.onload = function (e) {
                    debug.log("leitherApi re get ok");
                    localStorage["leitherApi"] = e.target.result;
                };
                r.readAsText(new Blob([data]));
            });
            stub.hget(G.sid, G.AppBid, "applist", G.AppName)
            .then(function (data) {
                debug.log("manifest re hget ok");
                SetDbData({
                    id:G.AppName,
                    data: data,
                    tbname: G.ApptbName
                }).then();
                //localStorage[G.AppName] = data;
            })
        }, errfunc);
        });
	}, PE("api.ready"))}, PE("InitDb"));
}

function loadJS(appBid, key) {
    var future = new hprose.Future();
    debug.log("load js ", key);
    var script = document.createElement("script");
    script.type = "text/javascript";
    GetDbData(key).then(function (d) {
        if (d) {
            script.textContent = d.data;
            document.getElementsByTagName("head")[0].appendChild(script);
            future.resolve(key);
        } else {
            debug.log("check leither");
            if ((typeof (LeitherIsOK) == "function") && LeitherIsOK()) {
                debug.log("check leither ok");
                var ff = function (reason) {
                    debug.error(reason);
                    future.reject(key);
                };
                G.api.ready(function (stub) {
                    debug.log(" G.api.ready");
                    stub.get("", appBid, key, function (data) {
                        debug.log("get ok: (appBid, key)  ", appBid, key);
                        if (data) {
                            debug.log(" if (data)");
                            var r = new FileReader();
                            r.onload = function (e) {
                                debug.log(" SetDbData");
                                SetDbData({
                                    id: key,
                                    data: e.target.result,
                                    tbname: G.ApptbName
                                });
                                script.textContent = e.target.result;
                                document.getElementsByTagName("head")[0].appendChild(script);
                                future.resolve(key);
                            };
                        r.readAsText(new Blob([data]));
                    }else{
                      debug.error("data is null");
                      future.reject(key);
                    }}, ff);
                }, ff);
            } else {
                debug.error("leither is not ok");
                future.reject(key);
            }
        }
    }, function (e) {
      debug.error(e);
      future.reject(e);
    });

    return future;
}

// Bruce.Lu@20150920 revised so that it can be used to load multiple apps into current DOM
function LoadApp(losApi, appName, appBid, version) {
    debug.log("load app name:", appName, ", appBid:", appBid);
    var future = new hprose.Future();
    if (G.Local) {
        debug.log("use local file");
        setMain("LoadApp local");
        future.resolve();
        return future;
    }

    GetDbData(appName)
        .then(function(manifest){
            if (manifest) {
                debug.log('get app manifest from db successed: ', appName);
                processManifest(appBid, version, manifest.data).then(function(){
                  future.resolve();
                }, function(e){
                  debug.warn("LoadApp: ", e);
                  future.reject(e);
                });
            } else {
                debug.log("app :", appName," resfiles not found in DB, fetching ... ");
                losApi.hget("", appBid, "applist", appName)
                    .then(function (data) {
                        var tbName = appBid + "_" + appName;
                        SetDbData({
                            id:appName,
                            data: data,
                            tbname: tbName
                        });
                        processManifest(appBid, version, data).then(function(s){
                          future.resolve();
                        },function(e){
                          debug.warn("LoadApp 2: ",e);
                          future.reject(e);
                        });
                    })
            }
        },function (e) {
            debug.error(e);
        });
    return future;
};
