import chai = require('chai');

import {DependencyInjection, ExternalDependencies} from '../..';
import {ServiceDescriptionItem} from '../../Lists';
import {ExternalServicesRegister} from '../../ExternalServicesRegister';

class NewService {
    public name = 'NewServiceClass';
};

class NewService2 {
    constructor(public otherService: NewService) {
    }
};

class NewToInject {
};

const dependency2 = {things: 'yes', 'isIt': true},
    dependency1 = true;

describe('DependencyInjection service', function () {

    function getClass(externalDependencies?: ExternalDependencies) {
        return new DependencyInjection(externalDependencies);
    };


    it('Should register a new class', function () {
        const dependencyInjection = getClass();

        dependencyInjection.registerService('newService', [], NewService);
        const newService = new NewService();
        chai.assert.deepEqual(newService, dependencyInjection.get('newService'));
    });


    it('Should register external dependencies', function () {
        const externalDependencies = new ExternalDependencies();
        externalDependencies.add('dependency1', dependency1);
        externalDependencies.add('dependency2', dependency2);
        const dependencyInjection = getClass(externalDependencies);

        chai.assert.deepEqual(dependency1, dependencyInjection.get('@dependency1'));
        chai.assert.deepEqual(dependency2, dependencyInjection.get('@dependency2'));
    });


    it('Should check register external dependencies in execution time', function () {
        const dependencyInjection = getClass();

        dependencyInjection.registerServiceBuilded('dependency1', dependency1);
        dependencyInjection.registerServiceBuilded('dependency2', dependency2);

        chai.assert.deepEqual(dependency1, dependencyInjection.get('@dependency1'));
        chai.assert.deepEqual(dependency2, dependencyInjection.get('@dependency2'));
    });


    it('Should check external dependencies error when try to find a service we didn\'t register', function () {
        const dependencyInjection = getClass();

        chai.assert.throws(function () {
            dependencyInjection.get('dependency1')
        }, 'Service descriptions with name \'dependency1\' not found.');
    });


    it('Should check removing Registered Service Descriptions', function () {
        const dependencyInjection = getClass(),
            serviceName: string = 'newService';

        dependencyInjection.registerService(serviceName, [], NewService);
        dependencyInjection.removeRegisteredServiceDescriptions(serviceName);

        chai.assert.throws(function () {
            dependencyInjection.get(serviceName);
        }, 'Service descriptions with name \'' + serviceName + '\' not found.');
    });


    it('Should create two services with same name', function () {
        const dependencyInjection = getClass(),
            serviceName: string = 'newService';

        dependencyInjection.registerService(serviceName, [], NewService);

        chai.assert.throws(function () {
            dependencyInjection.registerService(serviceName, [], NewService2);
        }, 'The service with name ' + serviceName + ' already registered.');
    });


    it('Should check editing the Registered Service Descriptions', function () {
        const dependencyInjection = getClass(),
            serviceName: string = 'newService',
            serviceName2: string = 'newService2';

        dependencyInjection.registerService(serviceName2, [], NewService2);
        dependencyInjection.registerService(serviceName, [], NewService);

        dependencyInjection.editRegisteredServiceDescriptions(serviceName2, (serviceDescription: ServiceDescriptionItem) => {
            serviceDescription.setDependencies([serviceName]);
        });

        chai.assert.deepEqual(dependencyInjection.get(serviceName).name, dependencyInjection.get(serviceName2).otherService.name);
    });


    it('Should create two instances of dependency injection with external dependencies and registering same objects different names', function () {
        const externalDependencies = new ExternalDependencies();

        externalDependencies.add('dependency1', dependency1);
        externalDependencies.add('dependency2', dependency2);

        const dependencyInjection1 = getClass(externalDependencies);
        const dependencyInjection2 = getClass(externalDependencies);

        chai.assert.deepEqual(dependency1, dependencyInjection1.get('@dependency1'));
        chai.assert.deepEqual(dependency2, dependencyInjection1.get('@dependency2'));

        chai.assert.deepEqual(dependency2, dependencyInjection2.get('@dependency2'));
        chai.assert.deepEqual(dependency1, dependencyInjection2.get('@dependency1'));
    });

    it('Should do a bulk of external dependencies and get it', function () {
        const externalDependencies = new ExternalDependencies();

        externalDependencies.bulk({
            'dependency1': dependency1,
            'dependency2': dependency2,
            'dependency3': true,
            'dependency4': 'dependency4'
        });

        const dependencyInjection1 = getClass(externalDependencies);

        chai.assert.deepEqual(dependency1, dependencyInjection1.get('@dependency1'));
        chai.assert.deepEqual(dependency2, dependencyInjection1.get('@dependency2'));
        chai.assert.deepEqual(true, dependencyInjection1.get('@dependency3'));
        chai.assert.deepEqual('dependency4', dependencyInjection1.get('@dependency4'));
    });


    it('Should throw errors when we register a service with wrong constructor', function () {
        const dependencyInjection = getClass();

        chai.assert.throws(function () {
            dependencyInjection.registerService('newService', ['newToInject'], function () {
            });
        }, 'This is not a constructor function');

        chai.assert.throws(function () {
            dependencyInjection.registerService('newService', ['newToInject'], {});
        }, 'This is not a constructor function');
    });

    it('Should throw errors when we try to register a service with @ as first character', function () {
        const dependencyInjection = getClass();

        chai.assert.throws(function () {
            dependencyInjection.registerService('@newService', [], NewService2);
        }, 'This service name (@newService) is not a valid name');
    });

    it('Should throw errors when we try to register a service with an empty name', function () {
        const dependencyInjection = getClass();

        chai.assert.throws(function () {
            dependencyInjection.registerService('', [], NewService2);
        }, 'Empty service name value.');
    });


    it('Should register dependencies injection into service', function () {
        const dependencyInjection = getClass();

        class NewService {
            public constructor(newToInject: any) {
                chai.assert.deepEqual(newToInject, dependencyInjection.get('newToInject'));
            }
        };

        dependencyInjection.registerService('newService', ['newToInject'], NewService);
        dependencyInjection.registerService('newToInject', [], NewToInject);

        chai.expect(dependencyInjection.get('newService')).to.be.an.instanceof(NewService);
    });


    it('Should do auto init in services', function () {
        const dependencyInjection = getClass();

        function NewService(newToInject: any) {
            chai.assert.deepEqual(newToInject, dependencyInjection.get('newToInject'));
        };

        dependencyInjection.registerService('newService', ['newToInject'], NewService, true);
        dependencyInjection.registerService('newToInject', [], NewToInject);

        dependencyInjection.callAllServicesWithAutoInit();
    });


    it('Should do recursion of dependencies', function () {
        const dependencyInjection = getClass();

        class NewToInject {
            public newService: any;

            public injectDependence(newService: any) {
                chai.assert.deepEqual(newService, dependencyInjection.get('newService'));
                this.newService = newService;
            };
        };

        class NewServiceRD {
            public constructor(public newToInject: any) {
                chai.assert.deepEqual(newToInject, dependencyInjection.get('newToInject'));
            }
        };

        dependencyInjection.registerService('newService', ['newToInject'], NewServiceRD, true);
        dependencyInjection.registerService('newToInject', ['newService'], NewToInject, true, NewToInject.prototype.injectDependence);

        dependencyInjection.callAllServicesWithAutoInit();

        chai.assert.deepEqual(dependencyInjection.get('newService'), dependencyInjection.get('newToInject').newService);
        chai.assert.deepEqual(dependencyInjection.get('newToInject'), dependencyInjection.get('newService').newToInject);
    });


    it('Should return a list of names of services already called', function () {
        const dependencyInjection = getClass();

        dependencyInjection.registerService('newService', [], NewService);
        dependencyInjection.registerService('newToInject', [], NewToInject);

        dependencyInjection.get('newService');

        const list1 = ['container', 'newService'],
            list2 = dependencyInjection.getServicesList();

        chai.assert.deepEqual(list1, list2);
    });

    it('Should register classes using external register', function () {
        const dependencyInjection = getClass(),
            externalServicesRegister = new ExternalServicesRegister();

        externalServicesRegister.registerService('newService', [], NewService);
        externalServicesRegister.registerService('newToInject', [], NewToInject);

        dependencyInjection.registerExternalServicesRegister(externalServicesRegister);

        dependencyInjection.get('newService');

        const list1 = ['container', 'newService'],
            list2 = dependencyInjection.getServicesList();

        chai.assert.deepEqual(list1, list2);
    });

    it('Should register classes using two external registers', function () {
        const dependencyInjection = getClass(),
            externalServiceRegister1 = new ExternalServicesRegister(),
            externalServiceRegister2 = new ExternalServicesRegister();

        externalServiceRegister1.registerService('newService', [], NewService);
        externalServiceRegister2.registerService('newToInject', [], NewToInject);

        dependencyInjection.registerExternalServicesRegister(externalServiceRegister1);
        dependencyInjection.registerExternalServicesRegister(externalServiceRegister2);

        dependencyInjection.get('newService');
        dependencyInjection.get('newToInject');

        const list1 = ['container', 'newService', 'newToInject'],
            list2 = dependencyInjection.getServicesList();

        chai.assert.deepEqual(list1, list2);
    });


    it('Should create two services with same name in different registers and throw error', function () {
        const dependencyInjection = getClass(),
            externalServiceRegister1 = new ExternalServicesRegister(),
            externalServiceRegister2 = new ExternalServicesRegister(),
            serviceName: string = 'newToInject';

        externalServiceRegister1.registerService(serviceName, [], NewService);
        externalServiceRegister2.registerService(serviceName, [], NewToInject);

        dependencyInjection.registerExternalServicesRegister(externalServiceRegister1);

        chai.assert.throws(function () {
            dependencyInjection.registerExternalServicesRegister(externalServiceRegister2);
        }, 'The service with name ' + serviceName + ' already registered.');
    });
});
