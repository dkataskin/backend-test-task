# DEEL BACKEND TASK

## Shortcuts / Things that need to be improved
* input parameters validation
* tests for admin endpoint
* more tests for other endpoints, better data sets
* pay for job and deposit money for account endpoints logic is not suitable with environment where 
  there are multiple api server instances and concurrent requests.
* better configuration management (test / development / production)

## Getting Set Up
1. Start by cloning this repository.
1. In the repo root directory, run `npm install` to gather all dependencies.
1. Next, `npm run seed` will seed the local SQLite database.
1. To run tests use `npm test`
1. Then run `npm start` which should start the server.

## APIs 

Below is a list of the APIs for the application.

1. ***GET*** `/contracts/:id` - Returns the contract only if it belongs to the profile calling

1. ***GET*** `/contracts` - Returns a list of contracts belonging to a user (client or contractor), the list should only contain non terminated contracts.

1. ***GET*** `/jobs/unpaid` -  Get all unpaid jobs for a user (***either*** a client or contractor), for ***active contracts only***.

1. ***POST*** `/jobs/:jobId/pay` - Pay for a job, a client can only pay if his balance >= the amount to pay. The amount should be moved from the client's balance to the contractor balance.

1. ***POST*** `/balances/deposit/:userId` - Deposits money into the the the balance of a client, a client can't deposit more than 25% his total of jobs to pay. (at the deposit moment)

1. ***GET*** `/admin/best-profession?start=<date>&end=<date>` - Returns the profession that earned the most money (sum of jobs paid) for any contactor that worked in the query time range.

1. ***GET*** `/admin/best-clients?start=<date>&end=<date>&limit=<integer>` - returns the clients the paid the most for jobs in the query time period. limit query parameter should be applied, default limit is 2.
```
 [
    {
        "id": 1,
        "fullName": "Reece Moyer",
        "paid" : 100.3
    },
    {
        "id": 200,
        "fullName": "Debora Martin",
        "paid" : 99
    },
    {
        "id": 22,
        "fullName": "Debora Martin",
        "paid" : 21
    }
]
```