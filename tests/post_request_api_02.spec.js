import { test, expect } from '@playwright/test';
import {faker} from '@faker-js/faker';
import { DateTime } from 'luxon';


test('Verify that user can creat a booking ticket using dynamic data', async ({ request }) => {

    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const totalPrice = faker.number.int(1000);

    const checkInDate = DateTime.now().toFormat('yyyy-MM-dd');
    const checkOutDate = DateTime.now().plus({day:5}).toFormat('yyyy-MM-dd');


    //Creating Post request by passing request body data
    const postAPIResponse = await request.post(`/booking`, {

        
        data: {
        "firstname": firstName,
        "lastname": lastName,
        "totalprice": totalPrice,
        "depositpaid": true,
        "bookingdates": {
            "checkin": checkInDate,
            "checkout": checkOutDate
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
    expect(postAPIresponsBody.booking).toHaveProperty("firstname", firstName);
    expect(postAPIresponsBody.booking).toHaveProperty("lastname", lastName);
    expect(postAPIresponsBody.booking).toHaveProperty("totalprice", totalPrice);
    expect(postAPIresponsBody.booking).toHaveProperty("depositpaid", true);


    expect(postAPIresponsBody.booking.bookingdates).toHaveProperty("checkin", checkInDate);
    expect(postAPIresponsBody.booking.bookingdates).toHaveProperty("checkout", checkOutDate);
    
})