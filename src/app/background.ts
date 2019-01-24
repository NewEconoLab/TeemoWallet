import { Notifiy } from "./notification.manager";

// Listen to messages sent from other parts of the extension.
chrome.runtime.onMessage.addListener
(
    (request, sender, sendResponse) => 
    {
        // onMessage must return "true" if response is async.
        let isResponseAsync = false;

        if (request.key === "open") {
            Notifiy.openNotify({msg:request.msg});
        }
        return isResponseAsync;
    }
);










//function getDomainFromUrl(url){
//	var host = "null";
//	if(typeof url === "undefined" || null === url)
//		url = window.location.href;
//	var regex = /.*\:\/\/([^\/]*).*/;
//	var match = url.match(regex);
//	if(typeof match != "undefined" && null != match)
//		host = match[1];
//	return host;
//}

//function checkForValidUrl(tabId, changeInfo, tab) {
//    var a = getDomainFromUrl(tab.url).toLowerCase();
//	if(getDomainFromUrl(tab.url).toLowerCase()==="localhost"){
//		chrome.pageAction.show(tabId);
//	}
//};

//chrome.tabs.onUpdated.addListener(checkForValidUrl);

//var articleData = {};
//articleData.error = "加载中...";
//chrome.runtime.onMessage.addListener(function(request, sender, sendRequest){
//	if(request.type!==="cnblog-article-information")
//		return;
//	articleData = request;
//	articleData.firstAccess = "获取中...";
//	if(!articleData.error){
//		$.ajax({
//			url: "http://localhost/first_access.php",
//			cache: false,
//			type: "POST",
//			data: JSON.stringify({url:articleData.url}),
//			dataType: "json"
//		}).done(function(msg) {
//			if(msg.error){
//				articleData.firstAccess = msg.error;
//			} else {
//				articleData.firstAccess = msg.firstAccess;
//			}
//		}).fail(function(jqXHR, textStatus) {
//			articleData.firstAccess = textStatus;
//		});
//	}
//});

// const local =  chrome.storage.local
// local.set({"value" : "test"})
// local.get("value",function(data){
//     alert(data);
// })

const nelApiUrl = 'https://api.nel.group/api/testnet';

var setBadgeText = (text) =>{
    chrome.browserAction.setBadgeText({text: text});
    chrome.browserAction.setBadgeBackgroundColor({color: [255, 0, 0, 255]});
}
setBadgeText('1');

// var showNotify = (title,msg) =>{
//     chrome.notifications.create(null, {
//         type: 'basic',
//         iconUrl: 'NEL_38.png',
//         title: title,
//         message: msg
//     });
// }
// showNotify('后台提示','已经加载了后台js！')

var getBalanceByAddr = (addr,callback) => {
}

var gettransfertxhex = (from,to,asset,value,callback) => {
}

var callcontractfortest = (scriptHash, invokeParam,callback) => {
    //alert(scriptHash);
    //alert(invokeParam);
    invokeParam = JSON.parse(invokeParam)
    //alert(invokeParam);
    var data = {
        "jsonrpc": "2.0",
        "method": "callcontractfortest",
        "params": [scriptHash,invokeParam],
        "id": 1
    }
    
    fetch(nelApiUrl, {
        method: 'post',
        headers: {
            'Content-Type': 'application/json'
          },
        body: JSON.stringify(data)
      }).then(function(response) {
        return response.json();
      }).then(function(data) {
        console.log('callcontractfortest response:',JSON.stringify(data));
        callback(JSON.stringify(data));
      });
}

var getinvoketxhex = (addr_pay, invoke_script, gas_consumed,callback) => {
    var data = {
        "jsonrpc": "2.0",
        "method": "getinvoketxhex",
        "params": [addr_pay,invoke_script,gas_consumed],
        "id": 1
    }
    
    fetch(nelApiUrl, {
        method: 'post',
        headers: {
            'Content-Type': 'application/json'
          },
        body: JSON.stringify(data)
      }).then(function(response) {
        return response.json();
      }).then(function(data) {
        console.log('callcontractfortest response:',JSON.stringify(data));
        callback(JSON.stringify(data));
      });
}

var sendtxplussign = (transfertxhex,transfertxhexSign,pubkeyHex,callback) => {
    callback(JSON.stringify({test:"test"}));           
}

Uint8Array.prototype.toHexString = function () {
    var s = "";
    for (var i = 0; i < this.length; i++) {
        s += (this[i] >>> 4).toString(16);
        s += (this[i] & 0xf).toString(16);
    }
    return s;
};
console.info(ThinNeo.Helper.GetAddressFromScriptHash("0x0b193415c6f098b02e81a3b14d0e3b08e9c3f79a".hexToBytes()));

chrome.runtime.onMessage.addListener(
     (request, sender, sendResponse)=>{
        // if (request.key === "nns") {
        //     //chrome.tabs.create({ url: "main.html" });
        //     var nns = request.value;
        //     namehash(nns);
        //     sendResponse({ result: "received:" + nns });
        // };
        // if (request.key === "getWallet") {
        //     openWallet(localStorage.wallet);
        //     sendResponse({ result: "received:" + localStorage.wallet });
        // }
        // if (request.key === "getWallets") {
        //     sendResponse({ result: localStorage.wallets });
        // }
        // if (request.key === "getbalances") {
        //     sendResponse({ result: localStorage.balances });
        // }
        // if (request.key === "doTansfar") {
        //     doTansfar(request.value);
        // }
        // if (request.key === "getAccount") {
        //     chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        //         chrome.tabs.sendMessage(tabs[0].id, {
        //             message: "getAccount_R",
        //             data:{
        //                 addr : localStorage.wallets,
        //                 balance: localStorage.balances
        //             }
        //         })
        //     })
        // }
        if (request.key)
        {
            //alert(scriptHash);
            //alert(invokeParam);

            chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
                console.log(request.msg);
                chrome.storage.local.set({notify:request.msg},()=>{})
                Notifiy.openNotify(request.msg);
            })
        }
    });

// $.base64.utf8encode = true;
// $.base64.utf8decode = true;

//var port = null;
//var hostName = "nel.qingmingzi.pluginwallet";
//port = chrome.runtime.connectNative(hostName);
//port.onMessage.addListener(onNativeMessage);

//function onNativeMessage(message) {
//    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
//        switch (message.data.key) {
//            case "namehash":
//                chrome.tabs.sendMessage(tabs[0].id, { message: "setNNShash", data: message.data.data }, function (response) {
//                    //var result = document.createElement("div")
//                    //result.textContent = response.result       
//                    //document.body.appendChild(result)
//                    //alert(response.result);
//                });
//                break;
//            case "openWallet":
//                chrome.tabs.sendMessage(tabs[0].id, { message: "setAddrOut", data: message.data.data }, function (response) {
//                    //var result = document.createElement("div")
//                    //result.textContent = response.result       
//                    //document.body.appendChild(result)
//                    //alert(response.result);
//                });
//                break;
//            case "doTansfar":
//                chrome.tabs.sendMessage(tabs[0].id, { message: "doTansfar", data: message.data.data }, function (response) {
//                    //var result = document.createElement("div")
//                    //result.textContent = response.result       
//                    //document.body.appendChild(result)
//                    //alert(response.result);
//                });
//                break;
//        }
//    });
//}

// function namehash(nns) {
//     message = { "text": "namehash","data": nns };
//     port.postMessage(message);
// }

// function openWallet(wallet) {
//     message = { "text": "openWallet", "wallet": wallet };
//     var a = JSON.stringify(message);
//     port.postMessage(message);
// }

// function doTansfar(tansfarInfo) {
//     //tansfarInfo["wallet"] = localStorage.wallet;
//     var wallet = JSON.parse($.base64.decode(localStorage.wallet.replace("data:;base64,", "")));
//     $.each(wallet.accounts, function (index, value) {
//         if (value.address === tansfarInfo.addrOut) {
//             tansfarInfo["key"] = value.key;
//             return false;
//         }
//     });
//     message = { "text": "doTansfar", "tansfarInfo": tansfarInfo };
//     var a = JSON.stringify(message);
//     port.postMessage(message);
// }
