

require('es6-promise').polyfill();
require('isomorphic-fetch');

const url = path => `http://localhost:3001${path}`;

describe('Test backend', () => {
    it('should test and past eight required API', (done) => {
        //test for register

        fetch(url('/register'), {
            method: 'post',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                username: 'registertest',
                password: '123',
                email: '123@ee.com',
                zipcode: '44444',
                dob: '01/02/1990'
            })
        }).then(res => res.json()).then(res => {
            expect(res.result).toEqual("success");
            expect(res.user.username).toEqual("registertest");
            done();
        });
    });
});




