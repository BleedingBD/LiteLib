type UnsubscribeFn = () => void;
type Listener = (payload: any) => void;

interface DiscordDispatcher {
    subscribe(action: string, listener: Listener): void;
    unsubscribe(action: string, listener: Listener): void;
    dispatch(payload: any): void;
    dirtyDispatch(payload: any): void;
}

const discordDispatcher: DiscordDispatcher = BdApi.findModuleByProps("subscribe","unsubscribe");

export default class Dispatcher{
    static ActionTypes: {[action: string]: string};

    subscriptions = new Map<String,Set<Listener>>();

    subscribe(action: string, listener: Listener): UnsubscribeFn {
        if(!this.subscriptions.has(action)){
            this.subscriptions.set(action, new Set<Listener>());
        }
        const actionSubscriptions = this.subscriptions.get(action)!;

        if(actionSubscriptions.has(listener)){
            discordDispatcher.subscribe(action, listener);
            actionSubscriptions.add(listener);
        }

        return () => this.unsubscribe(action, listener);
    }

    unsubscribe(action: string, listener?: Listener): void {
        if(!this.subscriptions.has(action)){ return; }

        const actionSubscriptions = this.subscriptions.get(action)!;
        if(listener){
            if(actionSubscriptions.has(listener)){
                discordDispatcher.unsubscribe(action, listener);
                actionSubscriptions.delete(listener);
            }
        }else{
            for(const listener of actionSubscriptions){
                discordDispatcher.unsubscribe(action, listener);
            }
            actionSubscriptions.clear();
        }
    }

    unsubscribeAll(){
        for(const action of this.subscriptions.keys()){
            this.unsubscribe(action as string);
        }
        this.subscriptions.clear();
    }

    dispatch(payload: any){ return discordDispatcher.dispatch(payload); }
    dirtyDispatch(payload: any){ return discordDispatcher.dirtyDispatch(payload); }

}
