import {ServiceNameDescriptionVO} from './VOs';
import {ServicesDescriptionCollection, ServicesToCallCollection} from './Collections';
import {ExternalServicesRegister} from './ExternalServicesRegister';

export class ServiceDescriptionsHandler {

    protected readonly serviceDescriptions: ServicesDescriptionCollection;
    protected readonly servicesToCall: ServicesToCallCollection;

    constructor () {
        this.serviceDescriptions = new ServicesDescriptionCollection();
        this.servicesToCall = new ServicesToCallCollection();
    }

    /**
     * Register Service in the dependence injection
     * @param {string} serviceName The name of the service
     * @param {array} dependencies The array with the dependencies as string
     * @param {function} serviceFunc The function to create the service
     * @param {boolean} autoInit If it's auto initialize once it's register
     * @param {method} injectDependencies Function to inject all the dependencies
     * @returns {void}
     */
    public registerService<T extends {}> (
        serviceName: string,
        dependencies: Array<string>,
        serviceFunc: T,
        autoInit?: boolean,
        injectDependencies?: object
    ): void {
        this.serviceDescriptions.add(
            new ServiceNameDescriptionVO(serviceName),
            dependencies,
            serviceFunc,
            injectDependencies
        );

        if (autoInit) {
            this.servicesToCall.add(serviceName);
        }
    }

    public removeRegisteredServiceDescriptions (serviceName: string): void {
        this.serviceDescriptions.remove(new ServiceNameDescriptionVO(serviceName));
    }

    public editRegisteredServiceDescriptions <T> (serviceName: string, callback: T): void {
        this.serviceDescriptions.edit(new ServiceNameDescriptionVO(serviceName), callback);
    }

    public registerExternalServicesRegister (
        externalServicesRegister: ExternalServicesRegister
    ): void {
        externalServicesRegister.addOwnServicesDescriptionToOtherServiceRegister(this);
    }

}
