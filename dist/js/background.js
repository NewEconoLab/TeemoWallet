var storage;
(function(storage){
var account = null
storage.account=account
})(storage || (storage = {}));


chrome.runtime.onMessage.addListener(
    (request, sender, sendResponse) => {
        if (request.key === "getAccount") {
            chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
                var notify = window.open ('notify.html', 'notify', 'height=602, width=375, top=0, left=0, toolbar=no, menubar=no, scrollbars=no,resizable=no,location=no, status=no')
                notify.onload = () => {
                    chrome.storage.local.set("message",
                        {key:"getAccount",value:storage.account}
                    );
                }

                //获得关闭事件
                var loop = setInterval(function() { 
                       if(notify.closed) {    
                           clearInterval(loop);    
                           alert('notify Closed');
                       }    
                    }, 1000
                );

                chrome.tabs.sendMessage(tabs[0].id, {
                    message: "getAccount_R",
                    data:{
                        addr : storage.account.address,
                        balance: 0
                    }
                })
            })
        }
        if (request.key === 'invokeGroup')
        {
            chrome.tabs.query({active:true,currentWindow:true},(tabs)=>{
                console.log("=====================================进入了 invokeGroup");
                
                chrome.storage.local.set("invokeParam",request.msg.invokeParam)
                var notify = window.open ('notify.html', 'notify', 'height=600, width=350, top=150, left=100, toolbar=no, menubar=no, scrollbars=no,resizable=no,location=no, status=no')
                notify.onload = () => {
                    chrome.storage.local.set("invokeMessage",request.msg);
                }

                //获得关闭事件
                var loop = setInterval(function() { 
                       if(notify.closed) {    
                           clearInterval(loop);    
                           alert('notify Closed');
                       }    
                    }, 1000
                );
            })
        }
        if (request.key === 'sendInvokeTx')
        {
            console.log(request.msg);
            
            chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
                var notify = window.open ('notify.html', 'notify', 'height=600, width=350, top=150, left=100, toolbar=no, menubar=no, scrollbars=no,resizable=no,location=no, status=no')
                notify.onload = () => {
                    chrome.storage.local.set("invokeMessage",request.msg);
                }

                //获得关闭事件
                var loop = setInterval(function() { 
                       if(notify.closed) {    
                           clearInterval(loop);    
                           alert('notify Closed');
                       }    
                    }, 1000
                );
            })
        }
        if (request.key === "sendTransferTx")
        {
            chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
                var notify = window.open ('notify.html', 'notify', 'height=600, width=350, top=150, left=100, toolbar=no, menubar=no, scrollbars=no,resizable=no,location=no, status=no')
                notify.onload = () => {}

                //获得关闭事件
                var loop = setInterval(()=> { 
                       if(notify.closed) {    
                           clearInterval(loop);    
                           alert('notify Closed');
                       }    
                    }, 1000);
            })
        }
        if (request.key === 'getBalanceByAddr')
        {
            getBalanceByAddr(request.message,function(data)
            {
                chrome.runtime.sendMessage({result: data});
            })
            sendResponse({ result : "received:" + request.message });
        }
        if (request.key === "test")
        {          
            sendResponse({ result: "background get test request" + thin.Helper.GetPublicKeyScriptHash_FromAddress(request.message)});
            console.info("background get test request")
        }
    }
);