require('es6-promise').polyfill();
require('isomorphic-fetch');

const url = path => `http://localhost:3001${path}`;
let cookie;

describe('Test backend', () => {
    it('should test and past login and logout API', (done) => {
        fetch(url('/login'), {
            method: 'post',
            headers: { 'Content-Type': 'application/json' },
            body:JSON.stringify({username:'bbb',
                password:'123',
            })
        }).then(res =>{cookie = res.headers.get('set-cookie').replace("HttpOnly,", "HttpOnly;");return res.json()} ).then(res => {
            expect(res.result).toEqual("success");
            expect(res.username).toEqual("bbb");
        }).then(()=>{
            fetch(url('/logout'), {
                method: 'put',
                headers: { 'Content-Type': 'application/json', 'cookie':cookie }
            }).then(res =>{
                expect(res.status).toEqual(200);
                done();
            })
        })
    });
});