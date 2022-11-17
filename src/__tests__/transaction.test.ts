import request from "supertest";
import app from '../index';
import prisma from '../db/db';


let token:string;
let paymentPage:any;
let business:{};
let businessId :number;
let businessUuid:string;
let transactionId:string;
const businessData = {
    businessName : "Test Business",
    businessShort: "Test",
    businessDescription: "We are into Delivery."       
}
const payment_page = {
    paymentType : "PRODUCT",
    paymentLabel : "Laptop Mac Book Pro 2022",
    paymentDescription : "This Mac book has M1 chip and is durable",
    amount : 350_000_00,
    currency : "NGN",
    paymentLinkTag : "mac-book-pro",
}


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

      await request(app)
    .post(`/test/business/create`)
    .set("authorization", token)
    .send(businessData)
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
    

    //create a payment page
    await request(app)
    .post(`/test/payments/${businessUuid}/create`)
    .set("authorization", token)
    .send(payment_page)
    .then((response)=>{
        console.log("lllllllllllllllllllllllllllllllllllllllll")
        console.log(response.body)
        paymentPage = response.body;
    })
    console.log("--------------------------")

})

afterAll(async()=>{
    await prisma.transaction.deleteMany({});
    await prisma.wallet.deleteMany({});
    await prisma.paymentPage.deleteMany({});
    await prisma.business.delete({where:{id:businessId}})
})

describe("Create a Transaction", ()=>{
 
   it("Should create a transaction and Update wallet", async()=>{
    const payment = 0.0023 * payment_page.amount;
    const charge = payment * 1 / 100;
    let transaction = {
        paymentType: paymentPage.paymentType,
        paymentLabel:paymentPage.paymentLabel,
        paymentDescription:paymentPage.paymentDescription,
        amount:paymentPage.amount,
        currency:paymentPage.currency,
        customer:{customerName:"John Doe", email:"doe@gmail.com", address:"No 8 boja street,ABJ"},
        rate: "0.0023",
        payment: payment,
        paymentCurrency: "USDT",
        charge: charge,
        balance: (payment - charge) / 0.0023,
        paymentMethod: "crypto",
        status: "PAID",
        paymentLinkTag :paymentPage.paymentLinkTag,
    }
    console.log(transaction)

       await request(app)
       .post(`/test/transactions/${paymentPage.uuid}/create`)
       .set("authorization", token)
       .send(transaction)
       .expect('Content-Type', /json/)
       .expect(201)
       .then((response)=>{
           expect(response.body.transaction).toEqual(
               expect.objectContaining({
                   id : expect.any(Number),
                   uuid : expect.any(String),
                   paymentType: paymentPage.paymentType,
                   paymentLabel:paymentPage.paymentLabel,
                   paymentDescription:paymentPage.paymentDescription,
                   amount:paymentPage.amount.toString(),
                   currency:paymentPage.currency,
                   customer: transaction.customer,
                   payment : transaction.payment.toString(),
                   paymentCurrency: transaction.paymentCurrency,
                   rate : transaction.rate,
                   charge : transaction.charge.toString(),
                   balance : transaction.balance.toString(),
                   paymentMethod : transaction.paymentMethod,
                   status: transaction.status,
                   paymentLinkTag :paymentPage.paymentLinkTag,
                   paymentPageId : paymentPage.id,
                   businessId:expect.any(Number),
                   createdAt : expect.any(String),
                   updatedAt : expect.any(String),
               })
           )
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
           )
           transactionId = response.body.transaction.uuid;
       })
   })

   it("Should Get Transactions by PaymentId", async()=>{
        const response = await request(app)
        .get(`/test/transactions/payment/${paymentPage.uuid}`)
        .set("authorization", token)
        .expect('Content-Type', /json/)
        .expect(200)
        .then((response)=>{
            expect(response.body).toEqual(
                expect.arrayContaining([
                    expect.objectContaining({
                        id : expect.any(Number),
                        uuid : expect.any(String),
                        paymentType: expect.any(String),
                        paymentLabel:expect.any(String),
                        paymentDescription:expect.any(String),
                        amount:expect.any(String),
                        currency:expect.any(String),
                        customer: expect.objectContaining({address: expect.any(String), customerName: expect.any(String), email: expect.any(String)}),
                        payment : expect.any(String),
                        paymentCurrency: expect.any(String),
                        rate : expect.any(String),
                        charge : expect.any(String),
                        balance : expect.any(String),
                        paymentMethod : expect.any(String),
                        status: expect.any(String),
                        paymentLinkTag : expect.any(String),
                        paymentPageId : expect.any(Number),
                        businessId: expect.any(Number),
                        createdAt : expect.any(String),
                        updatedAt : expect.any(String),
                    })
                ])

            ); 
        })
   })

   it("Should Get Transactions by BusinessId", async()=>{
        const response = await request(app)
        .get(`/test/transactions/business/${businessUuid}`)
        .set("authorization", token)
        .expect('Content-Type', /json/)
        .expect(200)
        .then((response)=>{
            expect(response.body).toEqual(
                expect.arrayContaining([
                    expect.objectContaining({
                        id : expect.any(Number),
                        uuid : expect.any(String),
                        paymentType: expect.any(String),
                        paymentLabel:expect.any(String),
                        paymentDescription:expect.any(String),
                        amount:expect.any(String),
                        currency:expect.any(String),
                        customer: expect.objectContaining({address: expect.any(String), customerName: expect.any(String), email: expect.any(String)}),
                        payment : expect.any(String),
                        paymentCurrency: expect.any(String),
                        rate : expect.any(String),
                        charge : expect.any(String),
                        balance : expect.any(String),
                        paymentMethod : expect.any(String),
                        status: expect.any(String),
                        paymentLinkTag : expect.any(String),
                        paymentPageId : expect.any(Number),
                        businessId: expect.any(Number),
                        createdAt : expect.any(String),
                        updatedAt : expect.any(String),
                    })
                ])

            ); 
        })
    })

    it("Should Get a Transaction by ID", async()=>{
        const response = await request(app)
        .get(`/test/transactions/${transactionId}`)
        .set("authorization", token)
        .expect('Content-Type', /json/)
        .expect(200)
        .then((response)=>{
            expect(response.body).toEqual(
                expect.objectContaining({
                    id : expect.any(Number),
                    uuid : expect.any(String),
                    paymentType: expect.any(String),
                    paymentLabel:expect.any(String),
                    paymentDescription:expect.any(String),
                    amount:expect.any(String),
                    currency:expect.any(String),
                    customer: expect.objectContaining({address: expect.any(String), customerName: expect.any(String), email: expect.any(String)}),
                    payment : expect.any(String),
                    paymentCurrency: expect.any(String),
                    rate : expect.any(String),
                    charge : expect.any(String),
                    balance : expect.any(String),
                    paymentMethod : expect.any(String),
                    status: expect.any(String),
                    paymentLinkTag : expect.any(String),
                    paymentPageId : expect.any(Number),
                    businessId: expect.any(Number),
                    createdAt : expect.any(String),
                    updatedAt : expect.any(String),
                })

            ); 
        })
    })

    
    it("Should Not Get a Transaction by ID", async()=>{
        const response = await request(app)
        .get(`/test/transactions/426c4a62-1142-441d-9950-f3d5c9c0f4b7`)
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