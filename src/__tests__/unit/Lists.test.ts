import chai = require('chai');

import {ServicesList, ServicesCreatingList} from "../../Lists";
import {IObserver} from "../../Events";

class FakeObserver implements IObserver {
    private eventName: string = "";

    notify(eventName: string): void {
        this.eventName = eventName;
    }

    getNotify(): string {
        return this.eventName;
    }
}


describe('Lists classes tests', function () {

    function getClassServicesList() {
        return new ServicesList();
    };


    it('Should find element in ServicesCreatingList', function () {
        const servicesCreatingList = new ServicesCreatingList(),
            serviceName = "foo";

        servicesCreatingList.add(serviceName);

        chai.assert.deepEqual(serviceName, servicesCreatingList.find(serviceName));
    });


    it('Should add two times a service name into ServicesCreatingList and still getting it.', function () {
        const servicesCreatingList = new ServicesCreatingList(),
            serviceName = "foo";

        servicesCreatingList.add(serviceName);
        servicesCreatingList.add(serviceName);

        chai.assert.deepEqual(serviceName, servicesCreatingList.find(serviceName));
    });


    it('Should attach and detach event in ServicesCreatingList', function () {
        const servicesCreatingList = new ServicesCreatingList(),
            serviceName1 = "foo",
            serviceName2 = "foo2",
            fakeObserver: FakeObserver = new FakeObserver();

        servicesCreatingList.attach(fakeObserver);
        servicesCreatingList.add(serviceName1);
        servicesCreatingList.detach(fakeObserver);
        servicesCreatingList.add(serviceName2);

        chai.assert.deepEqual('ADD:' + serviceName1, fakeObserver.getNotify());
    });


    it('Not find element in list servicesList', function () {
        const servicesList = getClassServicesList(),
            serviceName = "foo";

        chai.assert.throws(function () {
            servicesList.find(serviceName);
        }, "Service with name '" + serviceName + "' not found.");
    });


    it('Add two services with same name in list servicesList', function () {
        const servicesList = getClassServicesList(),
            serviceName = "foo";

        servicesList.add(serviceName, 'foo');

        chai.assert.throws(function () {
            servicesList.add(serviceName, 'foo');
        }, "The service with name " + serviceName + " already exist.");
    });

});
