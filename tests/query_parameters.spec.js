import { test, expect } from '@playwright/test';
import requestBody from '../test-data/post_dynamic_request_body.json' with { type: 'json' };
import { stringFormat } from '../utils/common';


test('Verify that user can get query parameters', async ({ request }) => {

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

    const bId = postAPIresponsBody.bookingid;

    //This is to validate response body
    expect(postAPIresponsBody.booking).toHaveProperty("firstname", "Festus");
    expect(postAPIresponsBody.booking).toHaveProperty("lastname", "Mbah");
    expect(postAPIresponsBody.booking).toHaveProperty("totalprice", 1000);
    expect(postAPIresponsBody.booking).toHaveProperty("depositpaid", true);


    expect(postAPIresponsBody.booking.bookingdates).toHaveProperty("checkin", "2018-01-01");
    expect(postAPIresponsBody.booking.bookingdates).toHaveProperty("checkout", "2019-01-01");

     console.log("=========================================================");
    
    const getAPIResponse = await request.get(`/booking`, {
        params: {
            "firstname": "ewtyrueio",
            "lastname": "gdfrtye"
        }
            });

    expect(getAPIResponse.ok()).toBeTruthy();
    expect(getAPIResponse.status()).toBe(200);

    const getAPIResponseBody = await getAPIResponse.json();

    console.log(getAPIResponseBody);

    // Validate that at least one booking was found
   // expect(getAPIResponseBody.length).toBeGreaterThan(0);

   // Validate that when on booking was found when random value is used
   expect(getAPIResponseBody).toEqual([]);
    
})