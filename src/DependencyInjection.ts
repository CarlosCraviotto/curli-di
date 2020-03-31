"use strict";

import  {
    ServicesList,
    ServiceDescriptionItem,
    ServicesDescriptionList,
    ServicesCreatingList,
    ServicesToCallList
}  from "./Lists";

import {ServiceNotFoundException} from "./Exceptions";

import  {ExternalDependencies}  from "./ExternalDependencies";
import {LazyDependencies} from "./Dependencies/LazyDependencies";



export class  DependencyInjection{

    private readonly serviceDescriptions: ServicesDescriptionList;
    private servicesList: ServicesList;
    private servicesCreatingList: ServicesCreatingList;
    private servicesToCall: ServicesToCallList;
    private lazyDependencies: LazyDependencies;

    public constructor (private externalDependencies: ExternalDependencies = new ExternalDependencies()) {
        this.servicesList = new ServicesList();
        this.serviceDescriptions = new ServicesDescriptionList();
        this.servicesCreatingList = new ServicesCreatingList();
        this.servicesToCall = new ServicesToCallList();

        this.lazyDependencies = new LazyDependencies(this.servicesCreatingList);

        this.servicesList = this.externalDependencies.transferToList(this.servicesList);
        this.servicesList.add('container', this);
    }

    /**
     * Get the service
     * @param {string} name of the service
     * @returns {object} service
     */
    public get (name: string): any {
        return this.getService(name);
    };

    /**
     * Register Service in the dependence injection
     * @param {string} service The name of the service
     * @param {array} dependencies The array with the dependencies as string
     * @param {function} serviceFunc The function to create the service
     * @param {boolean} autoInit If it's auto initialize once it's register
     * @param {method} injectDependencies Function to inject all the dependencies
     * @returns {void}
     */
    public registerService (serviceName: string, dependencies: Array<string>, serviceFunc: object, autoInit?: boolean, injectDependencies?: object): void {
        this.serviceDescriptions.add(serviceName, dependencies, serviceFunc, injectDependencies);

        if (autoInit) {
            this.servicesToCall.add(serviceName);
        }
    };

    public removeRegisteredServiceDescriptions (serviceName: string): void {
        this.serviceDescriptions.remove(serviceName);
    };

    public editRegisteredServiceDescriptions (serviceName: string, callback: any): void {
        this.serviceDescriptions.edit(serviceName, callback);
    };

    /**
     * Register dependencies in the service dependence injection
     * @param {string} name The name of the service
     * @param {any} service The object|string|array|any thing we want register as a service.
     * @returns {void}
     */
    public registerServiceBuilded (name: string, service: any): void {
        this.servicesList.add(name, service);
    };

    /**
     * this method initialize all the services to call without instantiate.
     * @returns {void}
     */
    public callAllServicesToCall (): void {
        this.servicesToCall.callAllServicesToCall(this);
    };

    /**
     * Return the list of services in that moment
     * @returns {array} The list of services.
     */
    public getServicesList (): Array<string> {
        return this.servicesList.convertToListOfNames();
    };

    private getServiceBuilded (serviceName: string): any {
        return this.servicesList.find(serviceName).getService();
    };

    private getServiceDescription (serviceName: string): ServiceDescriptionItem {
        return this.serviceDescriptions.find(serviceName);
    };

    private requireService (args: any, serviceCode: any) {
        const serviceInstance = new serviceCode(...args);
        return serviceInstance;
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private buildService (serviceName: string): any {
        this.servicesCreatingList.add(serviceName);
        const serviceDescription: ServiceDescriptionItem = this.getServiceDescription(serviceName);

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let args: Array<any> = this.decideWhenCreateDependencies(serviceDescription);
        let service = this.requireService(args, serviceDescription.getServiceFunc());

        // Add to the list services builder (cache)
        this.servicesList.add(serviceName, service);

        this.servicesCreatingList.remove(serviceName);

        return service;
    };

    private createDependencies(serviceDescription: ServiceDescriptionItem, args: Array<any>) {
        const dependencies: Array<string> = serviceDescription.getDependencies();

        if (dependencies.length) {
            for (const i in dependencies) {
                args.push(this.getService(dependencies[i]));
            }
        }
        return args;
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private getService (serviceName: string): any {
        let service: any;
        try {
            service = this.getServiceBuilded(serviceName);
        } catch (e) {
            if (e instanceof ServiceNotFoundException) {
                service = this.buildService(serviceName);
            } else {
                throw e;
            }
        }
        return service;
    };

    private decideWhenCreateDependencies(serviceDescription: ServiceDescriptionItem): Array<any> {
        const injectDependencies: any = serviceDescription.getInjectDependencies();
        let args: Array<any> = [];

        //if we have a injectDependencies function in the service description.
        if (typeof injectDependencies === "function") {
            const dependenciesToCheck: Array<string> = serviceDescription.getDependencies(),
            serviceName = serviceDescription.getServiceName();
            dependenciesToCheck.push(serviceName);

            this.lazyDependencies.addDependencies(dependenciesToCheck, ()=> {
                const dependencies = this.createDependencies(serviceDescription, args);
                injectDependencies.apply(this.get(serviceName), dependencies);
            });

        } else {
            args = this.createDependencies(serviceDescription, args);
        }

        return args;
    }
};


