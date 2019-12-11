import { IHistoryList, IHistory, Task, ConfirmType } from "./interface/history.interface";
import { action, observable } from "mobx";
import { ICON } from "../../../../image";
import { bg } from "../../../utils/storagetools";
import intl from "../../../store/intl";

class HistoryList implements IHistoryList {
    @observable public taskList: IHistory[] = [];

    @action public initHistoryList = () => {
        const shed: IHistory[] = bg.getHistoryList();
        const tasklist: IHistory[] = [];
        // console.log(JSON.parse(JSON.stringify(shed)));

        for (const task of shed) {
            if (task.type == ConfirmType.contract && task.invokeHistory) {
                tasklist.push(task);
            }
            else if (task.type == ConfirmType.tranfer) {
                tasklist.push(task);
            }
            else if (task.type == ConfirmType.claimgas) {
                task.sendHistory.remark = intl.message.assets.claimGas;
                tasklist.push(task);
            }
            else if (task.type == ConfirmType.deploy) {
                tasklist.push(task);
            }
        }
        this.taskList = tasklist;
    }
}
export default new HistoryList();