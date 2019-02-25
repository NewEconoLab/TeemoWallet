
// 向页面注入JS
function injectCustomJs(jsPath)
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

    if(request.key === "getAccount")
    {
        chrome.runtime.sendMessage({
            key:'getAccount', 
            msg:{
                refInfo : refInfo,
            }
        });
    }
    if(request.key === "sendTransferTx")
    {
        alert('ContentScript: sendInvokeTx');

        chrome.runtime.sendMessage({
            key:'sendTransferTx', 
            msg:{
                refInfo : refInfo,
                from : request.msg.from, 
                to : request.msg.to , 
                asset : request.msg.asset ,
                value:request.msg.value
            }
        });
    }
    if(request.key === "sendInvokeTx")
    {
        alert('ContentScript: sendInvokeTx');

        var scriptHash = request.msg.scriptHash;
        var invokeParam = request.msg.invokeParam;
        // alert(scriptHash);
        // alert(invokeParam);

        chrome.runtime.sendMessage({
            key:'sendInvokeTx', 
            msg:{
                refInfo : refInfo,
                scriptHash : scriptHash, 
                invokeParam : invokeParam
            }
        });
    }
    if(request.key=="invokeGroup")
    {
        console.log(request.msg);
        
        chrome.runtime.sendMessage({
            key:'invokeGroup', 
            msg:{
                invokeParam:request.msg
            }
        });
    }
    console.log(request);
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
    function (request, sender, sendResponse) {
        alert("content_script Listener：fromBG" + request.result);

        if(request.message=="invokeGroup_R")
        {
            console.log(request.message);            
            chrome.runtime.sendMessage({
                key:'invokeGroup', 
                msg:request.data
            });
        }
        if (request.message === "getAccount_R"){
            window.postMessage({
                key: "getAccount_R",
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