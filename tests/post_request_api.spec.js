import { test, expect } from '@playwright/test';


test('Verify that user can creat a booking ticket', async ({ request }) => {

    //Creating Post request by passing request body data
    const postAPIResponse = await request.post(`/booking`, {

        data: {
        "firstname": "Paul Kelvin",
        "lastname": "Denis Poll",
        "totalprice": 1000,
        "depositpaid": true,
        "bookingdates": {
            "checkin": "2018-01-01",
            "checkout": "2019-01-01"
        },
        "additionalneeds": "super bowls"
    }
    })
    
    //This is to validate response status --- ok & 200 value
    expect (postAPIResponse.ok()).toBeTruthy();
    expect (postAPIResponse.status()).toBe(200);


    const postAPIresponsBody = await postAPIResponse.json();
    console.log(postAPIresponsBody);

    //This is to validate response body
    expect(postAPIresponsBody.booking).toHaveProperty("firstname", "Paul Kelvin");
    expect(postAPIresponsBody.booking).toHaveProperty("lastname", "Denis Poll");
    expect(postAPIresponsBody.booking).toHaveProperty("totalprice", 1000);
    expect(postAPIresponsBody.booking).toHaveProperty("depositpaid", true);


    expect(postAPIresponsBody.booking.bookingdates).toHaveProperty("checkin", "2018-01-01");
    expect(postAPIresponsBody.booking.bookingdates).toHaveProperty("checkout", "2019-01-01");
    
})