import { test, expect } from '@playwright/test';
import requestBody from '../test-data/post_request_body.json' with { type: 'json' };
import tokenResponseBody from '../test-data/token_request_body.json' with { type: 'json' };
import patchRequestBody from '../test-data/patch_request_body.json' with { type: 'json' };


test('DELETE Booking - Verify user can delete booking with valid authentication token', async ({ request }) => {

    const testInfo = test.info();

    let bId;
    let tokenValue;

    // =========================================================
    // STEP 1 - CREATE BOOKING
    // =========================================================

    await test.step('Create a new booking using POST /booking', async () => {

        // Define the test data once
        const bookingData = {
            firstname: 'Festus',
            lastname: 'Mbah',
            totalprice: 1000,
            depositpaid: true,
            bookingdates: {
                checkin: '2018-01-01',
                checkout: '2019-01-01'
            },
            additionalneeds: 'banana'
        };

        const postAPIResponse = await request.post('/booking', {
            data: bookingData
        });

        expect(postAPIResponse.ok()).toBeTruthy();
        expect(postAPIResponse.status()).toBe(200);

        const postAPIResponseBody = await postAPIResponse.json();

        console.log('POST Response:', postAPIResponseBody);

        await testInfo.attach('POST - Response Body', {
            body: JSON.stringify(postAPIResponseBody, null, 2),
            contentType: 'application/json'
        });

        // Store Booking ID
        bId = postAPIResponseBody.bookingid;

        await testInfo.attach('Created Booking ID', {
            body: String(bId),
            contentType: 'text/plain'
        });

        // Validate response against the data we actually sent
        expect(postAPIResponseBody.booking).toMatchObject(bookingData);
    });


    // =========================================================
    // STEP 2 - GET BOOKING
    // =========================================================

    await test.step(`Retrieve created booking using GET /booking/${bId}`, async () => {

        const getAPIResponse = await request.get(`/booking/${bId}`);

        expect(getAPIResponse.ok()).toBeTruthy();
        expect(getAPIResponse.status()).toBe(200);

        const getAPIResponseBody = await getAPIResponse.json();

        console.log('GET Response:', getAPIResponseBody);

        await testInfo.attach('GET - Response Body', {
            body: JSON.stringify(getAPIResponseBody, null, 2),
            contentType: 'application/json'
        });

        expect(getAPIResponseBody).toHaveProperty(
            'firstname',
            'Festus'
        );

        expect(getAPIResponseBody).toHaveProperty(
            'lastname',
            'Mbah'
        );
    });


    // =========================================================
    // STEP 3 - GENERATE AUTHENTICATION TOKEN
    // =========================================================

    await test.step('Generate authentication token using POST /auth', async () => {

        const tokenResponse = await request.post('/auth', {
            data: tokenResponseBody
        });

        expect(tokenResponse.ok()).toBeTruthy();
        expect(tokenResponse.status()).toBe(200);

        const tokenResponseBodyData = await tokenResponse.json();

        tokenValue = tokenResponseBodyData.token;

        expect(tokenValue).toBeTruthy();

        await testInfo.attach('Authentication', {
            body: 'Authentication token generated successfully',
            contentType: 'text/plain'
        });
    });


    // =========================================================
// STEP 4 - PATCH BOOKING
// =========================================================

await test.step(`Update booking using PATCH /booking/${bId}`, async () => {

    const patchResponse = await request.patch(`/booking/${bId}`, {
        headers: {
            'Content-Type': 'application/json',
            'Cookie': `token=${tokenValue}`
        },
        data: patchRequestBody
    });

    expect(patchResponse.ok()).toBeTruthy();
    expect(patchResponse.status()).toBe(200);

    const patchAPIResponseBody = await patchResponse.json();

    console.log('PATCH Response:', patchAPIResponseBody);

    await testInfo.attach('PATCH - Response Body', {
        body: JSON.stringify(patchAPIResponseBody, null, 2),
        contentType: 'application/json'
    });

    // Validate that firstname was updated
    expect(patchAPIResponseBody).toHaveProperty(
        'firstname',
        patchRequestBody.firstname
    );

    // Validate that lastname remains unchanged
    expect(patchAPIResponseBody).toHaveProperty(
        'lastname',
        'Mbah'
    );

    // Validate other booking details remain unchanged
    expect(patchAPIResponseBody).toHaveProperty(
        'totalprice',
        1000
    );

    expect(patchAPIResponseBody).toHaveProperty(
        'depositpaid',
        true
    );

    expect(patchAPIResponseBody.bookingdates).toHaveProperty(
        'checkin',
        '2018-01-01'
    );

    expect(patchAPIResponseBody.bookingdates).toHaveProperty(
        'checkout',
        '2019-01-01'
    );
});


    // =========================================================
    // STEP 5 - DELETE BOOKING
    // =========================================================

    await test.step(`Delete booking using DELETE /booking/${bId}`, async () => {

        const deleteResponse = await request.delete(`/booking/${bId}`, {

            headers: {
                'Content-Type': 'application/json',
                'Cookie': `token=${tokenValue}`
            }

        });

        console.log(
            `DELETE Response: ${deleteResponse.status()} ${deleteResponse.statusText()}`
        );

        await testInfo.attach('DELETE - Response', {
            body: JSON.stringify({
                status: deleteResponse.status(),
                statusText: deleteResponse.statusText()
            }, null, 2),
            contentType: 'application/json'
        });

        expect(deleteResponse.status()).toBe(201);
        expect(deleteResponse.statusText()).toBe('Created');
    });


    // =========================================================
    // STEP 6 - VERIFY DELETION
    // =========================================================

    await test.step(`Verify booking ${bId} has been deleted`, async () => {

        const verifyDeleteResponse =
            await request.get(`/booking/${bId}`);

        expect(verifyDeleteResponse.status()).toBe(404);

        await testInfo.attach('DELETE - Verification', {
            body: `Booking ${bId} was successfully deleted. GET request returned 404.`,
            contentType: 'text/plain'
        });
    });

});