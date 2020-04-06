import chai = require('chai');

import {ServicesCollection, ServicesCreatingCollection} from '../../Collections';
import {ServiceNameDescriptionVO} from '../../VOs';
import {ObserverInterface} from '../../Events';

class FakeObserver implements ObserverInterface {

    private eventName = '';

    notify (eventName: string): void {
        this.eventName = eventName;
    }

    getNotify (): string {
        return this.eventName;
    }

}

describe('Collections classes tests', function () {

    function getClassServicesCollection (): ServicesCollection {
        return new ServicesCollection();
    }

    it('Should find element in ServicesCreatingCollection', function () {
        const servicesCreatingCollection = new ServicesCreatingCollection();
        const serviceName = 'foo';

        servicesCreatingCollection.add(serviceName);

        chai.assert.deepEqual(serviceName, servicesCreatingCollection.find(serviceName));
    });

    it(
        'Should add two times a service name into ServicesCreatingCollection and still getting it.',
        function () {
            const servicesCreatingCollection = new ServicesCreatingCollection();
            const serviceName = 'foo';

            servicesCreatingCollection.add(serviceName);
            servicesCreatingCollection.add(serviceName);

            chai.assert.deepEqual(serviceName, servicesCreatingCollection.find(serviceName));
        }
    );

    it('Should attach and detach event in ServicesCreatingCollection', function () {
        const servicesCreatingCollection = new ServicesCreatingCollection();
        const serviceName1 = 'foo';
        const serviceName2 = 'foo2';
        const fakeObserver: FakeObserver = new FakeObserver();

        servicesCreatingCollection.attach(fakeObserver);
        servicesCreatingCollection.add(serviceName1);
        servicesCreatingCollection.detach(fakeObserver);
        servicesCreatingCollection.add(serviceName2);

        chai.assert.deepEqual('ADD:' + serviceName1, fakeObserver.getNotify());
    });

    it('Should not find element in Collection servicesCollection', function () {
        const servicesCollection = getClassServicesCollection();
        const serviceName = 'foo';

        chai.assert.throws(function () {
            servicesCollection.find(serviceName);
        }, 'Service with name \'' + serviceName + '\' not found.');
    });

    it('Should add two services with same name in Collection servicesCollection', function () {
        const servicesCollection = getClassServicesCollection();
        const serviceName = 'foo';

        servicesCollection.add(new ServiceNameDescriptionVO(serviceName), 'foo');

        chai.assert.throws(function () {
            servicesCollection.add(new ServiceNameDescriptionVO(serviceName), 'foo');
        }, 'The service with name ' + serviceName + ' already exist.');
    });

});
