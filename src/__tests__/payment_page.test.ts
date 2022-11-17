import request from "supertest";
import app from '../index';
import prisma from '../db/db';


let token:string;
let business:{};
let businessId :number;
let businessUuid:string;
let paymentId: String;

const user = {
    email:"user1@gmail.com",
    password:"123456",
}

const businessData = {
    businessName : "Test Business",
    businessShort: "Test",
    businessDescription: "We are into Delivery."       
}

beforeAll(async() => {
         await request(app)
        .post("/test/users/login")
        .send(user)
        .then((response)=>{
            token = response.body.token;
        });
        console.log(token)
        await request(app)
        .post(`/test/business/create`)
        .set("authorization", token)
        .send(businessData)
        .then((response)=>{
            business = response.body.business;
            businessId = response.body.business.id;
            businessUuid = response.body.business.uuid;
        })
})

afterAll(async()=>{
    await prisma.transaction.deleteMany({});
    await prisma.wallet.deleteMany({});
    await prisma.paymentPage.deleteMany({});
    await prisma.business.delete({where:{id:businessId}})
})


const payment_page = {
    paymentType : "PRODUCT",
    paymentLabel : "Laptop Mac Book Pro 2022",
    paymentDescription : "This Mac book has M1 chip and is durable",
    amount : 350000.09,
    currency : "NGN",
    paymentLinkTag : "mac-book-pro",
}
const updatePayment = {
    paymentType : "PRODUCT",
    paymentLabel : "Channel Bag",
    paymentDescription : "This Channel Bag is dope ass",
    amount : 60_000_00,
    currency : "NGN",
    paymentLinkTag : "channel",
}
describe("Should Create Payment Successfully", ()=>{

    it("Should Create a Payment Page", async()=>{
        await request(app)
        .post(`/test/payments/${businessUuid}/create`)
        .set("authorization", token)
        .send(payment_page)
        .expect('Content-Type', /json/)
        .expect(201)
        .then((response)=>{
            expect(response.body).toEqual(
                expect.objectContaining({
                    id : expect.any(Number),
                    uuid : expect.any(String),
                    paymentType : "PRODUCT",
                    paymentLabel : "Laptop Mac Book Pro 2022",
                    paymentDescription : "This Mac book has M1 chip and is durable",
                    amount : "350000.09",
                    currency : "NGN",
                    paymentLinkTag : `${businessData.businessShort}-mac-book-pro`,
                    published: false,
                    businessId: businessId,
                    createdAt : expect.any(String),
                    updatedAt : expect.any(String),
                })
            ); 
        })

    })

    
    it("Should Not Create a Payment Page", async()=>{
        await request(app)
        .post(`/test/payments/${businessUuid}/create`)
        .set("authorization", token)
        .send({})
        .expect('Content-Type', /json/)
        .expect(400)
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

       
    it("Should Search for a paymentLink tag and Return duplicate Error", async()=>{
        await request(app)
        .get(`/test/payments/${businessUuid}/tag/mac-book-pro`)
        .set("authorization", token)
        .expect('Content-Type', /json/)
        .expect(409)
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

           
    it("Should Search for a paymentLink tag Successful", async()=>{
        await request(app)
        .get(`/test/payments/${businessUuid}/tag/channel-bag`)
        .set("authorization", token)
        .expect('Content-Type', /json/)
        .expect(200)
        .then((response)=>{
            expect(response.body).toEqual(
                expect.objectContaining({
                  tagStatus:"Not Found"
                })
            ); 
        })

    })
})

describe("Should Get Payment pages", ()=>{
    it("Should get all payment page for a perticular business", async()=>{
        await request(app)
        .get(`/test/payments/${businessUuid}/`)
        .set("authorization", token)
        .expect('Content-Type', /json/)
        .expect(200)
        .then((response)=>{
            expect(response.body).toEqual(
                expect.arrayContaining([
                    expect.objectContaining({
                        id : expect.any(Number),
                        uuid : expect.any(String),
                        paymentType : expect.any(String),
                        paymentLabel : expect.any(String),
                        paymentDescription :expect.any(String),
                        amount : expect.any(String),
                        currency : expect.any(String),
                        paymentLinkTag : expect.any(String),
                        published: expect.any(Boolean),
                        businessId: expect.any(Number),
                        createdAt : expect.any(String),
                        updatedAt : expect.any(String),
                    })
                ])
            ); 
            paymentId = response.body[0].uuid;
        })
    })

    it("Should get one payment page for a perticular business", async()=>{
        await request(app)
        .get(`/test/payments/${businessUuid}/${paymentId}`)
        .set("authorization", token)
        .expect('Content-Type', /json/)
        .expect(200)
        .then((response)=>{
            expect(response.body).toEqual(
                expect.objectContaining({
                    id : expect.any(Number),
                    uuid : expect.any(String),
                    paymentType : expect.any(String),
                    paymentLabel : expect.any(String),
                    paymentDescription :expect.any(String),
                    amount : expect.any(String),
                    currency : expect.any(String),
                    paymentLinkTag : expect.any(String),
                    published: expect.any(Boolean),
                    businessId: expect.any(Number),
                    createdAt : expect.any(String),
                    updatedAt : expect.any(String),
                })
            ); 
        })
    })

    it("Should Not get one payment page for a perticular business", async()=>{
        await request(app)
        .get(`/test/payments/${businessUuid}/2af58461-d028-4934-97eb-21f43a134b5c`)
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

describe("Should Update User Payment page", ()=>{
    it("Should update a payment page", async()=>{
        const response = await request(app)
        .put(`/test/payments/${businessUuid}/update/${paymentId}`)
        .set("authorization", token)
        .send(updatePayment)
        .expect('Content-Type', /json/)
        .expect(201)
        .then((response)=>{
            expect(response.body).toEqual(
                expect.objectContaining({
                    id : expect.any(Number),
                    uuid : expect.any(String),
                    paymentType : "PRODUCT",
                    paymentLabel : "Channel Bag",
                    paymentDescription : "This Channel Bag is dope ass",
                    amount : "6000000",
                    currency : "NGN",
                    paymentLinkTag : `${businessData.businessShort}-channel`,
                    businessId: expect.any(Number),
                    createdAt : expect.any(String),
                    updatedAt : expect.any(String),
                })
            ); 
        })
    })

    it("Should  Not update a payment page", async()=>{
        const response = await request(app)
        .put(`/test/payments/${businessUuid}/update/${paymentId}`)
        .set("authorization", token)
        .send({})
        .expect('Content-Type', /json/)
        .expect(400)
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