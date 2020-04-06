import chai = require('chai');

import {ServicesList, ServicesCreatingList} from '../../Lists';
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

describe('Lists classes tests', function () {

    function getClassServicesList (): ServicesList {
        return new ServicesList();
    }

    it('Should find element in ServicesCreatingList', function () {
        const servicesCreatingList = new ServicesCreatingList();
        const serviceName = 'foo';

        servicesCreatingList.add(serviceName);

        chai.assert.deepEqual(serviceName, servicesCreatingList.find(serviceName));
    });

    it(
        'Should add two times a service name into ServicesCreatingList and still getting it.',
        function () {
            const servicesCreatingList = new ServicesCreatingList();
            const serviceName = 'foo';

            servicesCreatingList.add(serviceName);
            servicesCreatingList.add(serviceName);

            chai.assert.deepEqual(serviceName, servicesCreatingList.find(serviceName));
        }
    );

    it('Should attach and detach event in ServicesCreatingList', function () {
        const servicesCreatingList = new ServicesCreatingList();
        const serviceName1 = 'foo';
        const serviceName2 = 'foo2';
        const fakeObserver: FakeObserver = new FakeObserver();

        servicesCreatingList.attach(fakeObserver);
        servicesCreatingList.add(serviceName1);
        servicesCreatingList.detach(fakeObserver);
        servicesCreatingList.add(serviceName2);

        chai.assert.deepEqual('ADD:' + serviceName1, fakeObserver.getNotify());
    });

    it('Should not find element in list servicesList', function () {
        const servicesList = getClassServicesList();
        const serviceName = 'foo';

        chai.assert.throws(function () {
            servicesList.find(serviceName);
        }, 'Service with name \'' + serviceName + '\' not found.');
    });

    it('Should add two services with same name in list servicesList', function () {
        const servicesList = getClassServicesList();
        const serviceName = 'foo';

        servicesList.add(new ServiceNameDescriptionVO(serviceName), 'foo');

        chai.assert.throws(function () {
            servicesList.add(new ServiceNameDescriptionVO(serviceName), 'foo');
        }, 'The service with name ' + serviceName + ' already exist.');
    });

});
