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


const nelApiUrl = 'https://api.nel.group/api/testnet';

var setBadgeText = (text) =>{
    chrome.browserAction.setBadgeText({text: text});
    chrome.browserAction.setBadgeBackgroundColor({color: [255, 0, 0, 255]});
}
setBadgeText('1');

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
        if (request.key)
        {
            chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
                console.log(request.msg);
                chrome.storage.local.set({notify:request.msg},()=>{})
                Notifiy.openNotify(request.msg);
            })
        }
    });
