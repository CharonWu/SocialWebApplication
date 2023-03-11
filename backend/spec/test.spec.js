

require('es6-promise').polyfill();
require('isomorphic-fetch');

const url = path => `https://comp531-hw6.herokuapp.com${path}`;

describe('Test backend', () => {
    it('should test and past eight required API', (done) => {
        //test for register
        fetch(url('/register'), {
            method: 'post',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                username: 'testUser',
                password: '123',
                email: '123@ee.com',
                zipcode: '44444',
                dob: '01/02/1990'
            })
        }).then(res => res.json()).then(res => {
            expect(res.result).toEqual("success");
            expect(res.user.username).toEqual("testUser");
        }).then(()=>{
            //test for login
            fetch(url('/login'), {
                method: 'post',
                headers: { 'Content-Type': 'application/json' },
                body:JSON.stringify({username:'testUser',
                    password:'123',
                })
            }).then(res =>{cookie = res.headers.get('set-cookie').replace("HttpOnly,", "HttpOnly;");return res.json()} ).then(res => {
                expect(res.result).toEqual("success");
                expect(res.username).toEqual("testUser");
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
                }).then(()=>{
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
                        });
                    }).then(()=>{
                        //test for logout
                        fetch(url('/logout'), {
                            method: 'put',
                            headers: { 'Content-Type': 'application/json', 'cookie':cookie }
                        }).then(res =>{
                            expect(res.status).toEqual(200);
                            done();
                        });
                    });
                });
            });

        });
    });
});




