import {ServiceItem} from './ServiceItem';
import {ServiceNotFoundException} from '../Exceptions';
import {ExternalDependencyNameVO, ServiceNameDescriptionVO} from '../VOs';

export class ServicesList {
    private list: Array<ServiceItem>;

    public constructor() {
        this.list = [];
    }

    /**
     * Add a new service from a service created into the container
     * @param name
     * @param service
     */
    public add <T extends {}>(name: ServiceNameDescriptionVO, service: T): void {
        this.addNewService(name.getValue(), service);
    }


    /**
     * Add an external dependency
     * @param name
     * @param service
     */
    public addExternalDependency <T>(externalDependencyNameVO: ExternalDependencyNameVO, service: T) {
        this.addNewService(externalDependencyNameVO.getValue(), service);
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public find (name: string): ServiceItem {
         const service = this.list.find((serviceItem: ServiceItem) => {
            return serviceItem.isThisService(name);
        });

        if (!(service instanceof ServiceItem)){
            throw new ServiceNotFoundException(name);
        }

        return service;
    }

    public exist (name: string): boolean {
        let exist: boolean = true;
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

    public getList (): Array<ServiceItem> {
        return this.list;
    }

    public combine (servicesList: ServicesList): ServicesList {
        const list = servicesList.getList();
        list.forEach((serviceItem: ServiceItem) => {
            this.addNewService(serviceItem.getName(), serviceItem.getService());
        });
        return this;
    }

    public convertToListOfNames (): Array<string> {
        const list: Array<string> = [];
        this.list.forEach((serviceItem: ServiceItem) => {
            list.push(serviceItem.getName());
        });
        return list;
    }

    private addNewService <T extends {}>(name: string, service: T) {
        if (this.exist(name)) {
            throw new Error('The service with name ' + name + ' already exist.');
        } else {
            this.list.push(new ServiceItem(name, service));
        }
    }
}
