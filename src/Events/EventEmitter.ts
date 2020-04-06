import {ObserverInterface} from './ObserverInterface';

export abstract class EventEmitter {

    protected observersCollection: Array<ObserverInterface>;

    protected constructor () {
        this.observersCollection = [];
    }

    public attach (observer: ObserverInterface): void {
        this.observersCollection.push(observer);
    }

    public detach (observer: ObserverInterface): void {
        this.observersCollection.splice(this.observersCollection.indexOf(observer), 1);
    }

    // Notify all observers about an event.
    protected notify (eventName: string): void {
        this.observersCollection.forEach((observer: ObserverInterface) => {
            observer.notify(eventName);
        });
    }

}
