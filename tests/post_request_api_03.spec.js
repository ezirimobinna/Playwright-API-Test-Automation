import { test, expect } from '@playwright/test';
import requestBody from '../test-data/post_dynamic_request_body.json' with { type: 'json' };
import { stringFormat } from '../utils/common';


test('Verify that user can creat a booking ticket using Static JSON file', async ({ request }) => {

    const dynamicRequestJasonBody = stringFormat(JSON.stringify(requestBody),"Festus","Mbah","banana")


    //Creating Post request by passing JSON request data
    const postAPIResponse = await request.post(`/booking`, {

        data: JSON.parse(dynamicRequestJasonBody)
    })
    
    //This is to validate response status --- ok & 200 value
    expect (postAPIResponse.ok()).toBeTruthy();
    expect (postAPIResponse.status()).toBe(200);


    const postAPIresponsBody = await postAPIResponse.json();
    console.log(postAPIresponsBody);

    //This is to validate response body
    expect(postAPIresponsBody.booking).toHaveProperty("firstname", "Festus");
    expect(postAPIresponsBody.booking).toHaveProperty("lastname", "Mbah");
    expect(postAPIresponsBody.booking).toHaveProperty("totalprice", 1000);
    expect(postAPIresponsBody.booking).toHaveProperty("depositpaid", true);


    expect(postAPIresponsBody.booking.bookingdates).toHaveProperty("checkin", "2018-01-01");
    expect(postAPIresponsBody.booking.bookingdates).toHaveProperty("checkout", "2019-01-01");
    
})