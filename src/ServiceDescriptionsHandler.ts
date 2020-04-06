import {ServiceNameDescriptionVO} from './VOs';
import {ServicesDescriptionList, ServicesToCallList} from './Lists';
import {ExternalServicesRegister} from './ExternalServicesRegister';


export class ServiceDescriptionsHandler {

    protected readonly serviceDescriptions: ServicesDescriptionList;
    protected readonly servicesToCall: ServicesToCallList;

    constructor() {
        this.serviceDescriptions = new ServicesDescriptionList();
        this.servicesToCall = new ServicesToCallList();
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
    public registerService <T extends {}>(serviceName: string, dependencies: Array<string>, serviceFunc: T, autoInit?: boolean, injectDependencies?: object): void {
        this.serviceDescriptions.add(new ServiceNameDescriptionVO(serviceName), dependencies, serviceFunc, injectDependencies);

        if (autoInit) {
            this.servicesToCall.add(serviceName);
        }
    };

    public removeRegisteredServiceDescriptions (serviceName: string): void {
        this.serviceDescriptions.remove(new ServiceNameDescriptionVO(serviceName));
    };

    public editRegisteredServiceDescriptions (serviceName: string, callback: any): void {
        this.serviceDescriptions.edit(new ServiceNameDescriptionVO(serviceName), callback);
    };

    public registerExternalServicesRegister(externalServicesRegister: ExternalServicesRegister) {
        externalServicesRegister.addOwnServicesDescriptionToOtherServiceRegister(this);
    }
}
