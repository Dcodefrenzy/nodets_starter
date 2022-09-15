import { send } from "process";
import request from "supertest";
import app from '../index';
import prisma from '../db/db';
import { userInfo } from "os";



beforeAll(async() => (await prisma.user.deleteMany({})))

//afterAll(async() => ( await prisma.user.deleteMany({})))

describe("Register User", ()=>{
    let user_id:number;
    
    const user = {
            email:"user1@gmail.com",
            password:"123456",
            lastname: "Doe",
            firstname:"John",
            role:"USER",
    }
    const badUser = {
        email: 'user',
        password: 1234,
        firstname: 'John Doe',
        lastname: 'I am a software Developer',
        role: 12334
    } 
    it('POST/ Validate and Create a User', async ()=>{
        const response = await request(app)
            .post("/test/users/create")
            .send(user)
            .expect(201)
            .expect('Content-Type', /json/);
        expect(response.body).toEqual(
            expect.objectContaining({
                email:"user1@gmail.com",
                lastname: "Doe",
                firstname:"John",
                role:"USER"
            })
        );
    });
    it('POST/ Should not Add Duplicate User', async ()=>{
        const response = await request(app)
            .post("/test/users/create")
            .send(user)
            .expect(500);
        expect(response.body).toEqual('Duplicate/ User already Exist.');
    });

    it('POST/ Should not Validate or Create a User Input', async ()=>{
        const response = await request(app)
            .post("/test/users/create")
            .send(badUser)
            .expect(400);
        expect(response.body).toEqual(
            expect.objectContaining({
                errorCode: expect.any(Number),
                errorLabel: expect.any(String),
                errorMessage: expect.any(String),
                errorType: expect.any(String),
                errorAction: expect.any(String),
            })
        );
    });

    it('GET USERS', async ()=>{
        const response = await request(app)
            .get('/test/users/')
            .expect('Content-Type', /json/)
            .expect(200)
            .then((response)=>{
                expect(response.body).toEqual(
                    expect.arrayContaining([
                        expect.objectContaining({
                            email: expect.any(String),
                            id: expect.any(Number),
                            password: expect.any(String),
                            lastname: expect.any(String),
                            firstname:expect.any(String),
                            role:expect.any(String),
                            creationDate:expect.any(String),
                            lastUpdated :expect.any(String)
                        })
                    ])
                )
                user_id = response.body[0].id;
            })

        
    });
    it("GET/ Should return a user", async ()=>{
        const response = await request(app)
            .get(`/test/users/${user_id}`)
            .expect('Content-Type', /json/)
            .expect(200);
        expect(response.body).toEqual(
            expect.objectContaining({
                email: expect.any(String),
                id: expect.any(Number),
                lastname: expect.any(String),
                firstname:expect.any(String),
                role:expect.any(String),
                creationDate:expect.any(String),
                lastUpdated :expect.any(String)
            })
        );
    });

    it("GET/ Should return  not Return a user", async ()=>{
        const response = await request(app)
            .get(`/test/users/${user_id + 1}`)
            .expect('Content-Type', /json/)
            .expect(404);
        expect(response.body).toEqual(
            expect.objectContaining({
                errorCode: expect.any(Number),
                errorLabel: expect.any(String),
                errorMessage: expect.any(String),
                errorType: expect.any(String),
                errorAction: expect.any(String),
            })
        );
    });

    it("GET/ Should Log a User in", async ()=>{
        const response = await request(app)
            .post(`/test/users/login`)
            .send({email:user.email, password:user.password})
            .expect('Content-Type', /json/)
            .expect(200);
        expect(response.body).toEqual(
            expect.objectContaining({
                id: expect.any(Number),
                token: expect.any(String),
            })
        );
    });
})




