import request from "supertest";
import app from '../index';
import prisma from '../db/db';


let token:string;
let business:{};
let businessId :number;
let businessUuid:string;

beforeAll(async()=>{
    const user = {
        email:"user1@gmail.com",
        password:"123456",
    }
    
    await request(app)
    .post("/test/users/login")
    .send(user)
    .then((response)=>{
        token = response.body.token;
    });
    
})

afterAll(async()=>{
    await prisma.transaction.deleteMany({});
    await prisma.wallet.deleteMany({});
    await prisma.paymentPage.deleteMany({});
    await prisma.business.delete({where:{id:businessId}})
})

describe("Create Many Wallet For User", ()=>{
    const businessData = {
        businessName : "Test Business",
        businessShort: "Test",
        businessDescription: "We are into Delivery."       
    }

    it("Should create wallets", async()=>{
     const response =  await request(app)
        .post(`/test/business/create`)
        .set("authorization", token)
        .send(businessData)
        .expect('Content-Type', /json/)
        .expect(201)
        .then((response)=>{
            expect(response.body.wallets).toEqual(
                expect.objectContaining({
                    count: 3
                })
            )
            console.log(response.body.business)
            business = response.body.business;
            businessId = response.body.business.id;
            businessUuid = response.body.business.uuid;
        })
    })

    it("Should create Wallet by Currency", async()=>{
        const response = await request(app)
        .post(`/test/wallets/${businessUuid}/create`)
        .send({currency:"GHS"})
        .set("authorization", token)
        .expect('Content-Type', /json/)
        .expect(201)
        .then((response)=>{
            expect(response.body.wallet).toEqual(
                expect.objectContaining({
                    id : expect.any(Number),
                    uuid : expect.any(String),
                    currency: expect.any(String),
                    balance: expect.any(String),
                    businessId: expect.any(Number),
                    createdAt : expect.any(String),
                    updatedAt : expect.any(String),
                })
            ); 
        })
    })

    it("Should get Wallets for user", async()=>{
        const response = await request(app)
        .get(`/test/wallets/${businessUuid}`)
        .set("authorization", token)
        .expect('Content-Type', /json/)
        .expect(200)
        .then((response)=>{
            expect(response.body).toEqual(
                expect.arrayContaining([
                    expect.objectContaining({
                        id : expect.any(Number),
                        uuid : expect.any(String),
                        currency: expect.any(String),
                        balance: expect.any(String),
                        businessId: expect.any(Number),
                        createdAt : expect.any(String),
                        updatedAt : expect.any(String),
                    })
                ])

            ); 
        })
    })
    
    it("Should Get wallet by Currency", async()=>{
        const response = await request(app)
        .get(`/test/wallets/${businessUuid}/NGN`)
        .set("authorization", token)
        .expect('Content-Type', /json/)
        .expect(200)
        .then((response)=>{
            expect(response.body).toEqual(
                expect.objectContaining({
                    id : expect.any(Number),
                    uuid : expect.any(String),
                    currency: expect.any(String),
                    balance: expect.any(String),
                    businessId: expect.any(Number),
                    createdAt : expect.any(String),
                    updatedAt : expect.any(String),
                })
            ); 
        })
    })

    it("Should not Get wallet by Currency", async()=>{
        const response = await request(app)
        .get(`/test/wallets/${businessUuid}/FFF`)
        .set("authorization", token)
        .expect('Content-Type', /json/)
        .expect(404)
        .then((response)=>{
            expect(response.body).toEqual(
                expect.objectContaining({
                    errorCode: expect.any(Number),
                    errorLabel: expect.any(String),
                    errorMessage: expect.any(String),
                    errorType: expect.any(String),
                    errorAction: expect.any(String),
                })
            ); 
        })
    })
    
  
})