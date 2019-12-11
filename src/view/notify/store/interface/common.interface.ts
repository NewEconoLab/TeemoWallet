export interface ICommonStore {
    title: string;
    domain: string;
    address: string;
    error: boolean;
    loading: boolean;
    errorChange: (state: boolean) => void;
    loadingStateChange: (state: boolean) => void;
    initNotifyHeader: (header: { title: string, domain: string, address: string }) => void;

}