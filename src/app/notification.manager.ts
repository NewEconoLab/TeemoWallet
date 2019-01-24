export class Notifiy {
    static openNotify(data)
    {
        chrome.storage.local.set({notify:data},()=>
        {   
            const notify = window.open ('notify.html', 'notify', 'height=600, width=350, top=150, left=100, toolbar=no, menubar=no, scrollbars=no,resizable=no,location=no, status=no')
            notify.onload =()=>
            {
                notify.document.getElementById("testttt").textContent = JSON.stringify(data);
            }
        })     
    }
}