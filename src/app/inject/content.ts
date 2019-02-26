
// 向页面注入JS
function injectCustomJs(jsPath?)
{
    jsPath = jsPath || 'js/inject.js';
    var temp = document.createElement('script');
    temp.setAttribute('type', 'text/javascript');
    // 获得的地址类似：chrome-extension://ihcokhadfjfchaeagdoclpnjdiokfakg/js/inject.js
    temp.src = chrome.extension.getURL(jsPath);
    temp.onload = function()
    {
        // 放在页面不好看，执行完后移除掉
        // this.parentNode.removeChild(this);
    };
    document.head.appendChild(temp);
}

function sendMsgTest() {
    window.postMessage({"test": '这里是contentScript.js'}, '*');
}

// 接收向页面注入的JS
window.addEventListener("message", function(e)
{   
    //获取Dapp页面信息
    var refTitle = document.title;
    var refDomain = document.URL;
    var refInfo = {refTitle,refDomain}
    var request = e.data;

    /**
     * 返回网络信息
     */
    if(request.key === "getNetworks")
    {
        chrome.runtime.sendMessage({
            key:'getNetWorks', 
            title:refInfo,
            msg:{}
        });
    }
    /**
     * 返回账户信息
     */
    if(request.key === "getAccount")
    {
        chrome.runtime.sendMessage({
            key:'getAccount', 
            title:refInfo,
            msg:{}
        });
    }
    /**
     * 发送invoke 交易
     */
    if(request.key=="invoke")
    {
        var invokeParam = request.msg.invokeParam;
        chrome.runtime.sendMessage({
            key:'invoke', 
            title:refInfo,
            msg:{ invokeParam }
        });
    }
    /**
     * 发送转账交易
     */
    if(request.key=="send")
    {
        chrome.runtime.sendMessage({
            key:'invokeGroup', 
            title:refInfo,
            msg:{
                params : request.msg
            }
        });
    }
    /**
     * 作为初始化的接口
     */
    if(request.key=="getProvider")
    {
        chrome.runtime.sendMessage({
            key:'getProvider', 
            title:refInfo,
            msg:{}
        });
    }
    if(request.key=="getNetworks")
    {
        chrome.runtime.sendMessage({
            key:'getNetworks', 
            title:refInfo,
            msg:{}
        });
    }
    if(request.key=="getBalance")
    {
        chrome.runtime.sendMessage({
            key:'getBalance', 
            title:refInfo,
            msg:request.msg
        });
    }
    if(request.key=="getStorage")
    {

    }
}, false);

window.onload=()=>{
    injectCustomJs()
    sendMsgTest()
}

function convertFromHex(hex) {
    var hex2 = hex.toString();//force conversion
    var str = '';
    for (var i = 0; i < hex2.length; i += 2)
        str += String.fromCharCode(parseInt(hex2.substr(i, 2), 16));
    return str;
}

function convertToHex(str) {
    var hex = '';
    for (var i = 0; i < str.length; i++) {
        hex += '' + str.charCodeAt(i).toString(16);
    }
    return hex;
}

chrome.runtime.onMessage.addListener(
    (request, sender, sendResponse) => {
        console.log(request);
        
        if(request.message=="invoke_R")
        {
            window.postMessage({
                key:'invoke_R', 
                msg:request.data
            },'*');
        }
        if (request.message === "getAccount_R"){            
            window.postMessage({
                key: "getAccount_R",
                msg: request.data
            }, '*')
        }
        if (request.message === "getBalance_R"){            
            window.postMessage({
                key: "getBalance_R",
                msg: request.data
            }, '*')
        }
        if (request.message === "sendTransferTx_R") {
            window.postMessage({
                key:"sendTransferTx_R",
                msg:{
                    txid: request.data
                }
            }, '*');
        }
        if(request.message === "sendInvokeTx_R"){
            window.postMessage({
                key:"sendInvokeTx_R",
                msg:{
                    txid: request.data
                }
            }, '*');
        }            
    });  