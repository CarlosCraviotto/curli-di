import chai = require('chai');

import {StringVO} from '../../VOs/StringVO';


describe('String VO class tests', function () {


    it('Should set and get the value', function () {
        const stringToUse = 'foo',
            stringVO = new StringVO(stringToUse);

        chai.assert.deepEqual(stringToUse, stringVO.getValue());
    });


    it('Should set and get a value with trim', function () {
        const stringToUse = ' foo  ',
            stringVO = new StringVO(stringToUse);

        chai.assert.deepEqual('foo', stringVO.getValue());
    });


    it('Should throw an error if the string is empty', function () {
        const stringToUse = '';

        chai.assert.throws(function () {
            new StringVO(stringToUse);
        }, 'Empty value');
    });


});
