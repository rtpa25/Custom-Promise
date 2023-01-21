export type PromiseCallBack = (resolve: any, reject: any) => void;

type GeneralCallBack = (res: any) => any;

type ThenCallBack = GeneralCallBack;
type CatchCallBack = GeneralCallBack;

class MyPromise {
    private _resolvedVal: string;
    private _rejectedVal: string;
    private successCallBacks: GeneralCallBack[];
    private errorCallBacks: GeneralCallBack[];
    private _isLoading: boolean;
    private _data: any;

    constructor(cb: PromiseCallBack) {
        this._resolvedVal = '';
        this._rejectedVal = '';
        this._isLoading = true;
        this.successCallBacks = [];
        this.errorCallBacks = [];
        this._data = null;
        cb(this.resolve.bind(this), this.reject.bind(this));
    }

    private helper(arr: GeneralCallBack[], isResolve: boolean) {
        if (arr.length === 0) return;
        try {
            this._data = arr[0](this._data);
        } catch (error: any) {
            this._data = error.message;
            isResolve && this.reject(this._data);
        }
        arr.shift();
        this.helper(arr, isResolve);
    }

    resolve(resolvedVal: string) {
        this._resolvedVal = resolvedVal;
        this._isLoading = false;
        this._data = this._resolvedVal;
        const callBackArrayClone = [...this.successCallBacks];
        this.helper(callBackArrayClone, true);
    }

    reject(rejectedVal: string) {
        this._rejectedVal = rejectedVal;
        this._isLoading = false;
        this._data = this._rejectedVal;
        const callBackArrayClone = [...this.errorCallBacks];
        this.helper(callBackArrayClone, false);
    }

    then(cb: ThenCallBack) {
        this.successCallBacks.push(cb);
        return this;
    }

    catch(cb: CatchCallBack) {
        this.errorCallBacks.push(cb);
        return this;
    }
}

const promise = new MyPromise((resolve: any, reject: any) => {
    setTimeout(() => {
        resolve('i am resolved');
    }, 50);
});

promise
    .then((res) => {
        console.log('first then', res);
        return 'I am first';
    })
    .then((res) => {
        console.log('second then', res);
        throw new Error('asd');
    })
    .catch((err) => {
        console.log(err);
    })
    .then((res) => {
        console.log('third then', res);
    });
