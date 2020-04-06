import {ServiceModel} from '../Models/ServiceModel';
import {ServiceNotFoundException} from '../Exceptions';
import {ExternalDependencyNameVO, ServiceNameDescriptionVO} from '../VOs';

export class ServicesCollection {

    private collection: Array<ServiceModel>;

    public constructor () {
        this.collection = [];
    }

    /**
     * Add a new service from a service created into the container
     * @param name
     * @param service
     */
    public add <T extends {}> (name: ServiceNameDescriptionVO, service: T): void {
        this.addNewService(name.getValue(), service);
    }

    /**
     * Add an external dependency
     * @param name
     * @param service
     */
    public addExternalDependency <T> (
        externalDependencyNameVO: ExternalDependencyNameVO,
        service: T
    ): void {
        this.addNewService(externalDependencyNameVO.getValue(), service);
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public find (name: string): ServiceModel {
        const service = this.collection.find((serviceModel: ServiceModel) => {
            return serviceModel.isThisService(name);
        });

        if (!(service instanceof ServiceModel)) {
            throw new ServiceNotFoundException(name);
        }

        return service;
    }

    public exist (name: string): boolean {
        let exist = true;
        try {
            this.find(name);
        } catch (e) {
            if (!(e instanceof ServiceNotFoundException)) {
                throw e;
            } else {
                exist = false;
            }
        }
        return exist;
    }

    public getCollection (): Array<ServiceModel> {
        return this.collection;
    }

    public combine (servicesCollection: ServicesCollection): ServicesCollection {
        const collection = servicesCollection.getCollection();
        collection.forEach((serviceModel: ServiceModel) => {
            this.addNewService(serviceModel.getName(), serviceModel.getService());
        });
        return this;
    }

    public convertToCollectionOfNames (): Array<string> {
        const collection: Array<string> = [];
        this.collection.forEach((serviceModel: ServiceModel) => {
            collection.push(serviceModel.getName());
        });
        return collection;
    }

    private addNewService <T extends {}> (name: string, service: T): void {
        if (this.exist(name)) {
            throw new Error('The service with name ' + name + ' already exist.');
        } else {
            this.collection.push(new ServiceModel(name, service));
        }
    }

}
