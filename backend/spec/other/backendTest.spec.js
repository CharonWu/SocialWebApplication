
require('es6-promise').polyfill();
require('isomorphic-fetch');

const url = path => `http://localhost:3001${path}`;
let cookie;

let postId;

describe('Test backend', () => {

    it('should test and past headline API', (done) => {

        //test for login
        fetch(url('/login'), {
            method: 'post',
            headers: { 'Content-Type': 'application/json' },
            body:JSON.stringify({username:'jasmineTester',
                password:'123',
            })
        }).then(res =>{cookie = res.headers.get('set-cookie').replace("HttpOnly,", "HttpOnly;");return res.json()} ).then(res => {
            expect(res.result).toEqual("success");
            expect(res.username).toEqual("jasmineTester");
        }).then(()=>{
            //test for headline get and put
            fetch(url('/headline'), {
                method: 'get',
                headers: { 'Content-Type': 'application/json', 'cookie': cookie }
            }).then(res => res.json()).then(res => {
                expect(res.headline).toEqual("Hello, world!");
            }).then(()=>{
                fetch(url('/headline'), {
                    method: 'put',
                    headers: { 'Content-Type': 'application/json', 'cookie': cookie  },
                    body:JSON.stringify({
                        headline:'Happy'
                    })
                }).then(res => res.json()).then(res => {
                    expect(res.headline).toEqual("Happy");
                });
            });
            //test for article API
            fetch(url('/article'), {
                method: 'post',
                headers: { 'Content-Type': 'application/json', 'cookie': cookie  },
                body:JSON.stringify({
                    text:'article content'
                })
            }).then(res => res.json()).then(res => {
                expect(res.result).toEqual("success");
                expect(res.articles.length).toEqual(1);
                postId=res.articles[0].pid;

            }).then(()=>{
                fetch(url('/articles'), {
                    method: 'get',
                    headers: { 'Content-Type': 'application/json', 'cookie': cookie  }
                }).then(res => res.json()).then(res => {
                    expect(res.result).toEqual("success");
                    expect(res.articles.length).toEqual(1);

                });
                fetch(url('/articles/'+postId), {
                    method: 'get',
                    headers: { 'Content-Type': 'application/json', 'cookie': cookie  }
                }).then(res => res.json()).then(res => {
                    expect(res.result).toEqual("success");
                    expect(res.articles[0].text).toEqual("article content");
                    done();
                });
            });
        });

    });

});