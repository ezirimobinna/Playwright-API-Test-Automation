Playwright API Test Automation

A Playwright-based API test automation framework for validating RESTAPIs using JavaScript.

The project focuses on API testing with Playwright's APIRequestContextand includes dynamic test data, JSON request bodies, query-parametertesting, CRUD-style API scenarios, and Allure reporting.

Tech Stack

Playwright Test -- API test execution and assertions

JavaScript / Node.js -- Programming language and runtime

Faker.js -- Dynamic test data generation

Luxon -- Date generation and date formatting

Allure Report -- Test execution reporting

JSON -- External test data and request bodies

Project Structure

Playwright-API-Test-Automation/
│
├── My-Report/                 # Generated/custom test reports
├── allure-results/            # Allure test result files
├── test-data/                 # JSON test data and request bodies
├── tests/                     # API test specifications
├── utils/                     # Reusable utility/helper functions
│
├── .gitignore
├── package.json
├── package-lock.json
├── playwright.config.js
├── my-report.json
└── my-result.xml

Key API Testing Areas

The test suite covers common API testing scenarios, including:

POST request validation

GET request validation

PUT request validation

Query parameter validation

Dynamic test data

Static JSON request bodies

Authentication/token generation

Booking ID extraction and reuse

Request and response validation

HTTP status code validation

Response body/property validation

Negative scenarios, such as validating an empty response when nomatching record exists

Installation

Clone the repository:

git clone <your-repository-url>

Navigate into the project:

cd Playwright-API-Test-Automation

Install dependencies:

npm install

Install Playwright browsers if required:

npx playwright install

Running the Tests

Run the complete test suite:

npx playwright test

Run a specific test file:

npx playwright test tests/query_parameters.spec.js

Run a specific test by title:

npx playwright test -g "Verify that user can get query parameters"

Run tests in headed mode:

npx playwright test --headed

Run a test with a single worker:

npx playwright test --workers=1

Test Data

Reusable request payloads are stored in the test-data directory.

Example:

test-data/
├── post_request_body.json
├── post_dynamic_request_body.json
├── token_request_body.json
└── put_request_body.json

JSON files can be imported directly into Playwright tests:

import requestBody from '../test-data/post_request_body.json' with { type: 'json' };

This keeps test data separate from the test implementation and makes thetests easier to maintain.

Dynamic Test Data

Faker.js is used to generate dynamic values:

import { faker } from '@faker-js/faker';

const firstName = faker.person.firstName();
const lastName = faker.person.lastName();
const totalPrice = faker.number.int({ min: 1, max: 1000 });

Luxon is used for dynamic dates:

import { DateTime } from 'luxon';

const checkInDate = DateTime.now().toFormat('yyyy-MM-dd');
const checkOutDate = DateTime.now()
    .plus({ days: 5 })
    .toFormat('yyyy-MM-dd');

Example API Test

import { test, expect } from '@playwright/test';

test('Verify that user can create a booking', async ({ request }) => {

    const response = await request.post('/booking', {
        data: {
            firstname: 'Paul',
            lastname: 'Kelvin',
            totalprice: 1000,
            depositpaid: true,
            bookingdates: {
                checkin: '2018-01-01',
                checkout: '2019-01-01'
            },
            additionalneeds: 'super bowls'
        }
    });

    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200);

    const responseBody = await response.json();

    expect(responseBody.booking).toHaveProperty('firstname', 'Paul');
    expect(responseBody.booking).toHaveProperty('lastname', 'Kelvin');
    expect(responseBody.booking).toHaveProperty('totalprice', 1000);
});

Query Parameter Validation

The framework also validates API responses when query parameters aresupplied.

For example:

const response = await request.get('/booking', {
    params: {
        firstname: 'Festus',
        lastname: 'Mbah'
    }
});

expect(response.status()).toBe(200);

const responseBody = await response.json();

expect(responseBody.length).toBeGreaterThan(0);

For a negative scenario where no matching booking should exist:

expect(responseBody).toEqual([]);

This prevents a test from passing simply because the API returned HTTP200 when the actual response contained no matching records.

Authentication

Authentication tokens can be generated through the /auth endpoint andreused for protected requests.

Example:

const tokenResponse = await request.post('/auth', {
    data: {
        username: 'admin',
        password: 'password123'
    }
});

expect(tokenResponse.ok()).toBeTruthy();

const tokenResponseBody = await tokenResponse.json();
const token = tokenResponseBody.token;

The token can then be used for an authenticated PUT request:

const response = await request.put(`/booking/${bookingId}`, {
    headers: {
        'Content-Type': 'application/json',
        'Cookie': `token=${token}`
    },
    data: requestBody
});

Allure Reporting

The project is configured to generate Allure test results.

After running the tests, generate the Allure report:

allure generate allure-results --clean

Open the report:

allure open allure-report

If your project contains the npm scripts for Allure, you can also use:

npm run test:clean

to clean previous Allure results and run the tests, followed by:

npm run allure

to serve the Allure results.

Make sure the Allure command-line tool is installed and available onyour PATH.

Useful npm Scripts

The project can be run using scripts defined in package.json.

Typical scripts include:

{
    "scripts": {
        "test": "playwright test",
        "test:clean": "npm run clean:allure && playwright test",
        "clean:allure": "powershell -Command \"Remove-Item -Recurse -Force allure-results\\*\"",
        "allure": "allure serve allure-results"
    }
}

If the project is being run on a different operating system, the cleanupcommand may need to be adjusted.

Best Practices Used

Keep test data outside the test files.

Use dynamic data where appropriate to reduce dependency on hardcodedvalues.

Validate both HTTP status codes and response bodies.

Extract generated IDs and tokens for reuse in subsequent requests.

Validate negative scenarios, not just successful responses.

Keep reusable functions in the utils directory.

Keep test specifications organized under tests.

Generate test reports after execution.

Avoid committing sensitive credentials, tokens, orenvironment-specific secrets.

Configuration

The main Playwright configuration is stored in:

playwright.config.js

This file controls settings such as:

Base URL

Test directory

Reporters

Timeout

Workers

Trace settings

API testing configuration

API Under Test

This project is currently designed around API testing workflows such asthe Restful Booker API.

Typical endpoints used by the tests include:

POST  /booking
GET   /booking
GET   /booking/{id}
PUT   /booking/{id}
POST  /auth

Author

Obinna Ezirim

Software Tester / QA Engineer

Specializing in:

API Testing

Playwright

Test Automation

Functional Testing

Regression Testing

Quality Assurance

Future Improvements

Potential improvements for the framework include:

CI/CD integration using GitHub Actions

Environment-specific configuration

API request abstraction/service classes

Improved test data factories

Schema/contract validation

More negative test scenarios

Authentication fixture/setup

Parallel execution where appropriate

Enhanced Allure reporting

API performance testing integration