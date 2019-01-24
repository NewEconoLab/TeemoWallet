
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
    // var refIcoUrl = refDomain + $("head link[rel*='icon']").attr("href");
    // alert(refTitle) 
    // alert(refDomain) 
    // alert(refIcoUrl)
    var refInfo = {refTitle,refDomain}

    var request = e.data;

    if(request.key === "getAccount")
    {
        chrome.runtime.sendMessage({
            key:'getAccount', 
            msg:{}
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
    console.log(request);
}, false);

window.onload=()=>{
    injectCustomJs()
    sendMsgTest()
}