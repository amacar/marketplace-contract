export class InvalidDepositAmountError extends Error {
  constructor() {
    super('Cannot deposit invalid amount');
  }
}

export class UserNotExistsError extends Error {
  constructor() {
    super('User does not exist');
  }
}

export class InvalidTitleError extends Error {
  constructor() {
    super('Title is a required information');
  }
}

export class InvalidPriceError extends Error {
  constructor() {
    super('Cannot list item with invalid price');
  }
}

export class ListingNotExistsError extends Error {
  constructor() {
    super('Listing does not exist');
  }
}

export class BalanceTooLowError extends Error {
  constructor(buyer: string) {
    super(`${buyer}'s balance is too low`);
  }
}

export class BuyOwnItemError extends Error {
  constructor() {
    super('You cannot buy your own item');
  }
}

export class NotInteractWithListingError extends Error {
  constructor() {
    super('You did not interact with this listing');
  }
}

export class CancelOtherListingError extends Error {
  constructor() {
    super('You cannot cancel other people listing');
  }
}

export class CancelFinishedListingError extends Error {
  constructor() {
    super('You cannot cancel finished listing');
  }
}
