///<reference path="../../lib/neo-thinsdk.d.ts"/>

import { neotools } from "./neotools";


chrome.runtime.onMessage.addListener(
    (request, sender, sendResponse) => {
        if (request.key === "getAccount") {
            chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
                
                chrome.storage.local.set(
                    {
                        label:"getAccount",
                        message:{
                            account:storage.account?{address:storage.account.address}:undefined,
                            title:request.msg.refInfo.refTitle,
                            domain:request.msg.refInfo.refDomain
                        },
                    },
                    ()=>{               
                        var notify = window.open ('notify.html', 'notify', 'height=602, width=377, top=0, left=0, toolbar=no, menubar=no, scrollbars=no,resizable=no,location=no, status=no')        
                        
                        notify.onload = () => {
                        }
                        //获得关闭事件
                        var loop = setInterval(function() { 
                               if(notify.closed) {    
                                    chrome.storage.local.get("confirm",res=>{
                                        if(res["confirm"]==="confirm")
                                        {
                                            chrome.tabs.sendMessage(tabs[0].id, {
                                                message: "getAccount_R",
                                                data:{
                                                    addr : storage.account.address
                                                }
                                            });  
                                        }else if(res["confirm"]==="cancel"){              
                                        }
                                    })
                                   clearInterval(loop);
                               }    
                            }, 1000
                        );
                    }
                );
            })
        }
        if (request.key === 'invokeGroup')
        {
            chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
                var notify = window.open ('notify.html', 'notify', 'height=600, width=350, top=150, left=100, toolbar=no, menubar=no, scrollbars=no,resizable=no,location=no, status=no')
                notify.onload = () => {
                    chrome.storage.local.set("invokeMessage",request.msg);
                    neotools.invokeTest();
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
            // getBalanceByAddr(request.message,function(data)
            // {
            //     chrome.runtime.sendMessage({result: data});
            // })
            // sendResponse({ result : "received:" + request.message });
        }
        if (request.key === "test")
        {          
            sendResponse({ result: "background get test request" + ThinNeo.Helper.GetPublicKeyScriptHash_FromAddress(request.message)});
            console.info("background get test request")
        }
    }
);
const storage={
    account:null
}