import chai = require('chai');

import {DependencyInjection, ExternalDependencies} from "../..";
import {ServiceDescriptionItem} from "../../Lists";

class NewService {
    public name = "NewServiceClass";
};

class NewService2 {
    constructor(public otherService: NewService) {
    }
};

class NewToInject {
};

const dependency2 = {things: "yes", "isIt": true},
    dependency1 = true;

describe('DependencyInjection service', function () {

    function getClass(externalDependencies?: ExternalDependencies) {
        return new DependencyInjection(externalDependencies);
    };


    it('Should register a new class', function () {
        const dependencyInjection = getClass();


        dependencyInjection.registerService("newService", [], NewService);
        const newService = new NewService();
        chai.assert.deepEqual(newService, dependencyInjection.get("newService"));
    });


    it('External dependencies', function () {
        const externalDependencies = new ExternalDependencies();
        externalDependencies.add("dependency1", dependency1);
        externalDependencies.add("dependency2", dependency2);
        const dependencyInjection = getClass(externalDependencies);

        chai.assert.deepEqual(dependency1, dependencyInjection.get("dependency1"));
        chai.assert.deepEqual(dependency2, dependencyInjection.get("dependency2"));
    });


    it('Register external dependencies in execution time', function () {
        const dependencyInjection = getClass();

        dependencyInjection.registerServiceBuilded("dependency1", dependency1);
        dependencyInjection.registerServiceBuilded("dependency2", dependency2);

        chai.assert.deepEqual(dependency1, dependencyInjection.get("dependency1"));
        chai.assert.deepEqual(dependency2, dependencyInjection.get("dependency2"));
    });


    it('External dependencies error', function () {
        const dependencyInjection = getClass();

        chai.assert.throws(function () {
            dependencyInjection.get("dependency1")
        }, "Service descriptions with name 'dependency1' not found.");
    });


    it('Checking remove Registered Service Descriptions', function () {
        const dependencyInjection = getClass(),
            serviceName: string = "newService";

        dependencyInjection.registerService(serviceName, [], NewService);
        dependencyInjection.removeRegisteredServiceDescriptions(serviceName);

        chai.assert.throws(function () {
            dependencyInjection.get(serviceName);
        }, "Service descriptions with name '" + serviceName + "' not found.");
    });


    it('Create two services with same name', function () {
        const dependencyInjection = getClass(),
            serviceName: string = "newService";

        dependencyInjection.registerService(serviceName, [], NewService);

        chai.assert.throws(function () {
            dependencyInjection.registerService(serviceName, [], NewService2);
        }, "The service with name " + serviceName + " already registered.");
    });


    it('Checking edit Registered Service Descriptions', function () {
        const dependencyInjection = getClass(),
            serviceName: string = "newService",
            serviceName2: string = "newService2";

        dependencyInjection.registerService(serviceName2, [], NewService2);
        dependencyInjection.registerService(serviceName, [], NewService);

        dependencyInjection.editRegisteredServiceDescriptions(serviceName2, (serviceDescription: ServiceDescriptionItem) => {
            serviceDescription.setDependencies([serviceName]);
        });

        chai.assert.deepEqual(dependencyInjection.get(serviceName).name, dependencyInjection.get(serviceName2).otherService.name);
    });


    it('Creating two instances of dependency injection with external dependencies and registering same objects different names', function () {
        const externalDependencies = new ExternalDependencies();

        externalDependencies.add("dependency1", dependency1);
        externalDependencies.add("dependency2", dependency2);

        const dependencyInjection1 = getClass(externalDependencies);
        const dependencyInjection2 = getClass(externalDependencies);

        chai.assert.deepEqual(dependency1, dependencyInjection1.get("dependency1"));
        chai.assert.deepEqual(dependency2, dependencyInjection1.get("dependency2"));

        chai.assert.deepEqual(dependency2, dependencyInjection2.get("dependency2"));
        chai.assert.deepEqual(dependency1, dependencyInjection2.get("dependency1"));
    });


    it('Testing dependencies injection class function errors', function () {
        const dependencyInjection = getClass();

        chai.assert.throws(function () {
            dependencyInjection.registerService("newService", ["newToInject"], function () {});
        }, "This is not a constructor function");

        chai.assert.throws(function () {
            dependencyInjection.registerService("newService", ["newToInject"], {});
        }, "This is not a constructor function");
    });


    it('Testing dependencies injection into service', function () {
        const dependencyInjection = getClass();

        class NewService {
            public constructor(newToInject: any) {
                chai.assert.deepEqual(newToInject, dependencyInjection.get("newToInject"));
            }
        };

        dependencyInjection.registerService("newService", ["newToInject"], NewService);
        dependencyInjection.registerService("newToInject", [], NewToInject);

        chai.expect(dependencyInjection.get("newService")).to.be.an.instanceof(NewService);
    });


    it('Testing auto init in services', function () {
        const dependencyInjection = getClass();

        function NewService(newToInject: any) {
            chai.assert.deepEqual(newToInject, dependencyInjection.get("newToInject"));
        };

        dependencyInjection.registerService("newService", ["newToInject"], NewService, true);
        dependencyInjection.registerService("newToInject", [], NewToInject);

        dependencyInjection.callAllServicesWithAutoInit();
    });


    it('Injection of recursion dependencies', function () {
        const dependencyInjection = getClass();

        class NewToInject {
            public newService: any;
            public injectDependence (newService: any) {
                chai.assert.deepEqual(newService, dependencyInjection.get("newService"));
                this.newService = newService;
            };
        };

        class NewServiceRD {
            public constructor(public newToInject: any) {
                chai.assert.deepEqual(newToInject, dependencyInjection.get("newToInject"));
            }
        };

        dependencyInjection.registerService("newService", ["newToInject"], NewServiceRD, true);
        dependencyInjection.registerService("newToInject", ["newService"], NewToInject, true, NewToInject.prototype.injectDependence);

        dependencyInjection.callAllServicesWithAutoInit();

        chai.assert.deepEqual(dependencyInjection.get("newService"), dependencyInjection.get("newToInject").newService);
        chai.assert.deepEqual(dependencyInjection.get("newToInject"), dependencyInjection.get("newService").newToInject);
    });


    it('Get list of names of services already called', function () {
        const dependencyInjection = getClass();

        dependencyInjection.registerService("newService", [], NewService);
        dependencyInjection.registerService("newToInject", [], NewToInject);

        dependencyInjection.get("newService");

        const list1 = ["container", "newService"],
            list2 = dependencyInjection.getServicesList();

        chai.assert.deepEqual(list1, list2);
    });
});