import {ServiceNotFoundException} from '../Exceptions';
import {EventEmitter} from '../Events';
import {ActionCollectionEnumType} from '../Types/ActionCollectionEnumType';

export abstract class AbstractServiceStringCollection extends EventEmitter {

    protected collection: Array<string> = [];

    protected constructor () {
        super();
        this.restartCollection();
    }

    public add (serviceName: string): void {
        if (!this.exist(serviceName)) {
            this.collection.push(serviceName);
            this.sendNotification(ActionCollectionEnumType.Add, serviceName);
        }
    }

    public find (serviceName: string): string {
        const serviceNameFound: string | undefined = this.collection.find((serviceModel: string) => {
            return serviceModel === serviceName;
        });

        if (!serviceNameFound) {
            throw new ServiceNotFoundException(serviceNameFound);
        }
        return serviceNameFound;
    }

    public exist (serviceName: string): boolean {
        let exist = true;
        try {
            this.find(serviceName);
        } catch (e) {
            exist = false;
        }
        return exist;
    }

    public getCollection (): Array<string> {
        return this.collection;
    }

    public remove (serviceName: string): void {
        this.collection.splice(this.collection.indexOf(serviceName), 1);
        this.sendNotification(ActionCollectionEnumType.Remove, serviceName);
    }

    public restartCollection (): void {
        this.collection = [];
    }

    private sendNotification (action: string, serviceName: string): void {
        this.notify(action + ':' + serviceName);
    }

}
