
import {ServiceDescriptionsHandler} from './ServiceDescriptionsHandler';
import {ServiceDescriptionItem} from './Lists';

export class ExternalServicesRegister extends ServiceDescriptionsHandler{

    constructor() {
        super();
    }

    public addOwnServicesDescriptionToOtherServiceRegister(container: ServiceDescriptionsHandler): void {
        this.serviceDescriptions.getList().forEach((serviceDescription: ServiceDescriptionItem) => {
            const serviceName: string = serviceDescription.getServiceName(),
                autoInit: boolean = this.servicesToCall.exist(serviceName),
                serviceFunc: object = serviceDescription.getServiceFunc(),
                dependencies: Array<string> = serviceDescription.getDependencies(),
                injectDependencies: object | undefined = serviceDescription.getInjectDependencies();

            container.registerService(serviceName, dependencies, serviceFunc, autoInit, injectDependencies);
        });

        //empty lists
        this.serviceDescriptions.restartList();
        this.servicesToCall.restartList();
    }
}
