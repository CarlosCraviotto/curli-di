import {ObserverInterface} from './ObserverInterface';

export abstract class EventEmitter {

    protected observersList: Array<ObserverInterface>;

    protected constructor () {
        this.observersList = [];
    }

    public attach (observer: ObserverInterface): void {
        this.observersList.push(observer);
    }

    public detach (observer: ObserverInterface): void {
        this.observersList.splice(this.observersList.indexOf(observer), 1);
    }

    // Notify all observers about an event.
    protected notify (eventName: string): void {
        this.observersList.forEach((observer: ObserverInterface) => {
            observer.notify(eventName);
        });
    }

}
