import {ServiceDescriptionsHandler} from './ServiceDescriptionsHandler';
import {ServiceDescriptionModel} from './Models';

export class ExternalServicesRegister extends ServiceDescriptionsHandler {

    constructor () {
        super();
    }

    public addOwnServicesDescriptionToOtherServiceRegister (
        container: ServiceDescriptionsHandler
    ): void {
        this.serviceDescriptions.getCollection().forEach(
            (serviceDescription: ServiceDescriptionModel) => {
                const sd: ServiceDescriptionModel = serviceDescription;
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

        // empty Collections
        this.serviceDescriptions.restartCollection();
        this.servicesToCall.restartCollection();
    }

}
