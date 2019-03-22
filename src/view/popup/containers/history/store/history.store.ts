import { IHistoryList, IHistory, Task, ConfirmType, InvokeHistory, ISendHistory } from "./interface/history.interface";
import { Storage_local } from "../../../../../common/util";
import { action, observable } from "mobx";
import { SendArgs } from "../../../../../lib/background";
import { ICON } from "../../../../image";

class HistoryList implements IHistoryList
{
    @observable public taskList: IHistory[]=[];    

    @action public initHistoryList=async()=>{
        
        const shed = await Storage_local.get<{ [txid: string]: Task }>("Task-Manager-shed");
        if (shed)
        {
            let list: Task[] = [];
            for (const txid in shed)
            {
                if (shed.hasOwnProperty(txid))
                {
                    const task = shed[txid];
                    list.push(task);
                }
            }
            // list = list.sort((a, b) => b.startTime - a.startTime);
            const sendData = await Storage_local.get<{[txid:string]:SendArgs}>('send-data');
            const invokeData = await Storage_local.get<{[txid:string]:InvokeHistory}>('invoke-data');
            const dappData = await Storage_local.get<{[domain:string]:{icon:string,title:string}}>('white_list');
            const tasklist =[];
            for (const task of list) {
                const history:IHistory = {
                    "txid":task.txid,
                    "type":task.type,
                    "state":task.state,
                    "startTime":task.startTime,
                };
                if(task.type == ConfirmType.tranfer)
                {
                    const sendHistory:ISendHistory=sendData[task.txid];                    
                    // const assetState = await bg.queryAssetSymbol(sendHistory.asset,sendHistory.network)
                    // sendHistory.symbol=assetState.symbol;
                    history['sendHistory']=sendHistory;
                    tasklist.push(history)
                }
                else
                {
                    const invokeHistory= invokeData[task.txid];                    
                    if(invokeHistory)
                    {
                        let dappMessage: {
                            icon: string;
                            title: string;
                        }={icon:'',title:''}
                        if(invokeHistory.domain=="TeemoWallet.exchangeCgas")
                        {                            
                            dappMessage.icon=ICON.exchange
                            dappMessage.title="CGAS兑换";
                        }
                        else
                        {
                            dappMessage.icon=dappData[invokeHistory.domain].icon;
                            dappMessage.title=dappData[invokeHistory.domain].title;
                        }
                        history['invokeHistory']=invokeHistory;
                        history['dappMessage']=dappMessage;
                        
                        tasklist.push(history);
                    }
                }
            }
            this.taskList = tasklist;
        }
    }    
}
export default new HistoryList();