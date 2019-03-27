import { IHistoryList, IHistory, Task, ConfirmType } from "./interface/history.interface";
import { action, observable } from "mobx";
import { ICON } from "../../../../image";
import { bg } from "../../../utils/storagetools";

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
                    task.dappMessage={title:"CGAS兑换",icon:ICON.exchange};
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