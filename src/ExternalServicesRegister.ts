import {ServiceDescriptionsHandler} from './ServiceDescriptionsHandler';
import {ServiceDescriptionItem} from './Lists';

export class ExternalServicesRegister extends ServiceDescriptionsHandler {

    constructor () {
        super();
    }

    public addOwnServicesDescriptionToOtherServiceRegister (
        container: ServiceDescriptionsHandler
    ): void {
        this.serviceDescriptions.getList().forEach(
            (serviceDescription: ServiceDescriptionItem) => {
                const sd: ServiceDescriptionItem = serviceDescription;
                const serviceName: string = sd.getServiceName();
                const autoInit: boolean = this.servicesToCall.exist(serviceName);
                const serviceFunc: object = sd.getServiceFunc();
                const dependencies: Array<string> = sd.getDependencies();
                const injectDependencies: object | undefined = sd.getInjectDependencies();

                container.registerService(
                    serviceName,
                    dependencies,
                    serviceFunc,
                    autoInit,
                    injectDependencies
                );
            }
        );

        // empty lists
        this.serviceDescriptions.restartList();
        this.servicesToCall.restartList();
    }

}
