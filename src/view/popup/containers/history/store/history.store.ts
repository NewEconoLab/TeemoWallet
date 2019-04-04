import { IHistoryList, IHistory, Task, ConfirmType } from "./interface/history.interface";
import { action, observable } from "mobx";
import { ICON } from "../../../../image";
import { bg } from "../../../utils/storagetools";
import intl from "../../../store/intl";

class HistoryList implements IHistoryList
{
    @observable public taskList: IHistory[]=[];    

    @action public initHistoryList=()=>{
        const shed:IHistory[] = bg.getHistoryList();
        const tasklist:IHistory[] = [];
        for (const task of shed) {
            if(task.type==ConfirmType.contract && task.invokeHistory)
            {
                if(task.invokeHistory.domain=="TeemoWallet.exchangeCgas"){
                    task.dappMessage={title:intl.message.mywallet.cgasExchange,icon:ICON.exchange};
                    task.invokeHistory.descripts[0]=task.invokeHistory.descripts[0]=='cgasToGas'?intl.message.exchange.cgasToGas:intl.message.exchange.gasToCgas;
                }
                tasklist.push(task);
            }
            else if(task.type==ConfirmType.tranfer)
            {
                tasklist.push(task);
            }
        }
        this.taskList=tasklist;
    }    
}
export default new HistoryList();