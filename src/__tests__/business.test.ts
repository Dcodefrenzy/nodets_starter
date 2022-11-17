import request from "supertest";
import app from '../index';
import prisma from '../db/db';

afterAll(async()=>{
    await prisma.wallet.deleteMany({});
    await prisma.transaction.deleteMany({});
    await prisma.paymentPage.deleteMany({});
    await prisma.business.delete({where:{id:businessId}})
})
    let token : string;
    let businessId: number;
    let businessId2: number;

    const user = {
        email:"user1@gmail.com",
        password:"123456",
    }

    const business = {
        businessName : "First Business",
        businessShort: "First",
        businessDescription: "We are into fashion design and selling of cloths."       
    }

    const business2 = {
        businessName : "Second Business",
        businessShort: "Second",
        businessDescription: "We are into Delivery."       
    }

    const updateBusiness = {
        businessName : "Second Business",
        businessShort : "Second",
        businessDescription: "We are into Delivery.", 
        businessEmail: "second.business@gmail.com",
        businessNumber: "9012347890",
        businessCountry : "Nigeria",
        businessAdress : "No 8 Human Plaza"      
    }


describe("User Business Testing",()=>{
    it("GET/ Should Log a User in and get a token", async ()=>{
        const response = await request(app)
            .post(`/test/users/login`)
            .send(user)
            .expect('Content-Type', /json/)
            .expect(200)
            .then((response)=>{
                expect(response.body).toEqual(
                    expect.objectContaining({
                        id: expect.any(Number),
                        token: expect.any(String),
                    })
                ); 
            token = response.body.token;
            })
    });
        
    it("Should fail at Authentication", async()=>{
        const response = await request(app)
        .post(`/test/business/create`)
        .set("authorization", "wmwo20299292")
        .send(business)
        .expect('Content-Type', /json/)
        .expect(401)

    })

    it("Should Create a user business", async()=>{
        const response = await request(app)
        .post(`/test/business/create`)
        .set("authorization", token)
        .send(business)
        .expect('Content-Type', /json/)
        .expect(201)
        .then((response)=>{
            expect(response.body.business).toEqual(
                expect.objectContaining({
                    id : expect.any(Number),
                    uuid : expect.any(String),
                    businessName :expect.any(String),
                    businessShort: expect.any(String),
                    businessDescription :expect.any(String),
                    businessEmail : null,
                    businessNumber : null,
                    businessCountry : null,
                    businessAdress : null,
                    ownerId : expect.any(Number),
                    createdAt : expect.any(String),
                    updatedAt : expect.any(String),
                })
            ); 
        })
    })

    it("Should Create another user business for same user", async()=>{
        const response = await request(app)
        .post(`/test/business/create`)
        .set("authorization", token)
        .send(business2)
        .expect('Content-Type', /json/)
        .expect(201)
        .then((response)=>{
            expect(response.body.business).toEqual(
                expect.objectContaining({
                    id : expect.any(Number),
                    uuid : expect.any(String),
                    businessName : business2.businessName,
                    businessShort: business2.businessShort,
                    businessDescription :business2.businessDescription,
                    businessEmail : null,
                    businessNumber : null,
                    businessCountry : null,
                    businessAdress : null,
                    ownerId : expect.any(Number),
                    createdAt : expect.any(String),
                    updatedAt : expect.any(String),
                })
            ); 
        })
    })
    it("Should fail to create business", async()=>{
        const response = await request(app)
        .post(`/test/business/create`)
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

} )


describe("Shound Get All Business For User", ()=>{
   
    it("SHould get an array of businesses", async()=>{
        const response = await request(app)
        .get(`/test/business/`)
        .set("authorization", token)
        .expect('Content-Type', /json/)
        .expect(200)
        .then((response)=>{
            expect(response.body).toEqual(
                expect.arrayContaining([
                    expect.objectContaining({
                        id : expect.any(Number),
                        uuid : expect.any(String),
                        businessName : expect.any(String),
                        businessShort: expect.any(String),
                        businessDescription :expect.any(String),
                        businessEmail : null,
                        businessNumber : null,
                        businessCountry : null,
                        businessAdress : null,
                        ownerId : expect.any(Number),
                        createdAt : expect.any(String),
                        updatedAt : expect.any(String),
                    })
                ])
            ); 
            
            businessId = parseInt(response.body[0].id);
            businessId2 = parseInt(response.body[1].id)
        })
    })

    it("Should Get One User business", async()=>{
        const response = await request(app)
        .get(`/test/business/${businessId}`)
        .set("authorization", token)
        .expect('Content-Type', /json/)
        .expect(200)
        .then((response)=>{
            expect(response.body).toEqual(
                expect.objectContaining({
                    id : expect.any(Number),
                    uuid : expect.any(String),
                    businessName : expect.any(String),
                    businessShort: expect.any(String),
                    businessDescription :expect.any(String),
                    businessEmail : null,
                    businessNumber : null,
                    businessCountry : null,
                    businessAdress : null,
                    ownerId : expect.any(Number),
                    createdAt : expect.any(String),
                    updatedAt : expect.any(String),
                })
            ); 
        })
    })

    
    it("Should Not Get One User business Successfully", async()=>{
        const response = await request(app)
        .get(`/test/business/${businessId + 6}`)
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


describe("Should Update User Business", ()=>{
    it("Should update a business", async()=>{
        const response = await request(app)
        .put(`/test/business/update/${businessId}`)
        .set("authorization", token)
        .send(updateBusiness)
        .expect('Content-Type', /json/)
        .expect(201)
        .then((response)=>{
            expect(response.body).toEqual(
                expect.objectContaining({
                    id : expect.any(Number),
                    uuid : expect.any(String),
                    businessName : updateBusiness.businessName,
                    businessShort: updateBusiness.businessShort,
                    businessDescription :updateBusiness.businessDescription,
                    businessEmail : updateBusiness.businessEmail,
                    businessNumber : updateBusiness.businessNumber,
                    businessCountry : updateBusiness.businessCountry,
                    businessAdress : updateBusiness.businessAdress,
                    ownerId : expect.any(Number),
                    createdAt : expect.any(String),
                    updatedAt : expect.any(String),
                })
            ); 
        })
    })


    it("Should give duplicate error", async()=>{
        const response = await request(app)
        .put(`/test/business/update/${businessId2}`)
        .set("authorization", token)
        .send(updateBusiness)
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

        it("Should not Update Business", async()=>{
        const response = await request(app)
        .put(`/test/business/update/${businessId}`)
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

