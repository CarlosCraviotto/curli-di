import {IObserver} from "./IObserver";

export abstract class EventEmitter {
    protected observersList: Array<IObserver>;

    protected constructor(){
        this.observersList = [];
    }

    public attach(observer: IObserver) {
        this.observersList.push(observer);
    }

    public detach(observer: IObserver) {
        this.observersList.splice(this.observersList.indexOf(observer), 1);
    }

    // Notify all observers about an event.
    protected notify(eventName: string) {
        this.observersList.forEach((observer: IObserver) => {
            observer.notify(eventName);
        });
    }
}