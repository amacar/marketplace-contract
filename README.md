# MarketPlace Contract Implementation

## Design & Assumptions

A simple marketplace contract implementation in typescript that could be translated to solidity but since I did only a few tutorials in solidity I rather implemented it using typescript to not give a wrong impression that I am very familiar with solidity.
A contract has properties that hold users' balances, active listings, and escrowed balance. We can interact with the contract using the following functions:

- deposit (deposit money to account)
- getUserBalance (get user's balance by id)
- listItemForSale (list item for sale)
- getListings (get all listings)
- getListing (get a specific listing by id - title)
- buyItem (buy a specific item from existing listings)
- completeListing (complete listing if you as a buyer are happy with an order)
- complainListing (complain about listing if you as a buyer are not happy with an order)
- getEscrowBalance (get the total escrowed balance that the contract holds)

**I implemented the marketplace contract with these assumptions in mind:**

- I assume that buyer/seller is unique and can be used as an id in our case (in a real case scenario I would use an address of a user that made a transaction as an id)
- for the purpose of the assignment (input provided from your side) I used the title as an id of a listing that is why this info is duplicated in the `Listing` interface (I would take a transaction id as a listing id in a real case scenario)
- I assumed that buyer/seller or listing id are always provided as I would get this info from a transaction (txid and user's address) that is why I didn't check cases where this info is not provided
- since money is involved I would use BigDecimal or BigInt (if we have decimals provided) in a real case scenario

## Instructions

> This script requires Node.js and Yarn to run.

### Install the dependencies

```sh
yarn
```

### Build app

```sh
yarn build
```

or

```sh
yarn build:watch
```

### Run test script

Add commands to `input.txt` and run the test script

```sh
yarn start
```

## Testing

```sh
yarn test
```

or run tests with coverage

```sh
yarn test:coverage
```
