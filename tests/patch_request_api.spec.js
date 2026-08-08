import { test, expect } from '@playwright/test';
import requestBody from '../test-data/post_request_body.json' with { type: 'json' };
import tokenResponseBody from '../test-data/token_request_body.json' with { type: 'json' };
import { stringFormat } from '../utils/common';
import putRequestBody from '../test-data/put_request_body.json' with { type: 'json' };
import patchRequestBody from '../test-data/patch_request_body.json' with { type: 'json' };

test('Verify user can use Patch api to update details with valid token', async ({ request }) => {

     const dynamicRequestJasonBody = stringFormat(JSON.stringify(requestBody),"Festus","Mbah","banana")


    //Creating Post request by passing JSON request data
    const postAPIResponse = await request.post(`/booking`, {

        data: JSON.parse(dynamicRequestJasonBody)
    })
    
    //This is to validate response status --- ok & 200 value
    expect (postAPIResponse.ok()).toBeTruthy();
    expect (postAPIResponse.status()).toBe(200);

    //Printing the api response details of the api
    const postAPIresponsBody = await postAPIResponse.json();
    console.log(postAPIresponsBody);

    //Storing the booking ID
    const bId = postAPIresponsBody.bookingid;

    //This is to validate response body
    expect(postAPIresponsBody.booking).toHaveProperty("firstname", "Paul Kelvin");
    expect(postAPIresponsBody.booking).toHaveProperty("lastname", "Denis Poll");
    


    expect(postAPIresponsBody.booking.bookingdates).toHaveProperty("checkin", "2018-01-01");
    expect(postAPIresponsBody.booking.bookingdates).toHaveProperty("checkout", "2019-01-01");
    
    console.log("=========================================================");
    
    //Get API call
    const getAPIResponse = await request.get(`/booking/${bId}`)
    const getAPIResponseBody = await getAPIResponse.json();
    console.log(getAPIResponseBody);

    //Validate status code
    expect(getAPIResponse.ok()).toBeTruthy();
    expect(getAPIResponse.status()).toBe(200);

    //Generate token

    const tokenResponse = await request.post(`/auth`,{
        data: tokenResponseBody
    })
    
    const tokenNum = await tokenResponse.json();
    const tokenValue = await tokenNum.token;
    console.log("This is the token: "+tokenValue);
    
    //PATCH api call
    console.log("==PATCH API CALL==");
    
    const patchResponse = await request.patch(`/booking/${bId}`,{

        headers: {
            "Content-Type":"application/json",
            "Cookie":`token=${tokenValue}`
        },

        data: patchRequestBody
    })

    const patchAPIResponseBody = await patchResponse.json();

    console.log(patchAPIResponseBody);

    expect(patchResponse.status()).toBe(200);
    
})