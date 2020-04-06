import {ServiceDescriptionModel} from '../Models/ServiceDescriptionModel';
import {ServiceDescriptionsNotFoundException} from '../Exceptions';
import {ServiceNameDescriptionVO} from '../VOs';

export class ServicesDescriptionCollection {

    private collection: Array<ServiceDescriptionModel>;

    public constructor () {
        this.collection = [];
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public add (
        serviceName: ServiceNameDescriptionVO,
        dependencies: Array<string>,
        serviceFunc: object,
        injectDependencies?: object
    ): void {

        if (this.exist(serviceName)) {
            const value = serviceName.getValue();
            throw new Error('The service with name ' + value + ' already registered.');
        } else {
            this.collection.push(
                new ServiceDescriptionModel(
                    serviceName,
                    dependencies,
                    serviceFunc,
                    injectDependencies
                )
            );
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public find (serviceName: ServiceNameDescriptionVO): ServiceDescriptionModel {
        const serviceDescription = this.collection.find((serviceModel: ServiceDescriptionModel) => {
            return serviceModel.isThisService(serviceName);
        });

        if (!(serviceDescription instanceof ServiceDescriptionModel)) {
            throw new ServiceDescriptionsNotFoundException(serviceName.getValue());
        }

        return serviceDescription;
    }

    public exist (name: ServiceNameDescriptionVO): boolean {
        let exist = true;
        try {
            this.find(name);
        } catch (e) {
            exist = false;
        }
        return exist;
    }

    public remove (serviceName: ServiceNameDescriptionVO): void {
        this.collection.forEach((serviceDescription: ServiceDescriptionModel, index) => {
            if (serviceDescription.isThisService(serviceName)) {
                this.collection.splice(index, 1);
            }
        });
    }

    public edit (serviceName: ServiceNameDescriptionVO, callback: any): void {
        this.collection.forEach((serviceDescription: ServiceDescriptionModel) => {
            if (serviceDescription.isThisService(serviceName)) {
                callback(serviceDescription);
            }
        });
    }

    public getCollection (): Array<ServiceDescriptionModel> {
        return this.collection;
    }

    public restartCollection (): void {
        this.collection = [];
    }

}
