import {
  BalanceTooLowError,
  BuyOwnItemError,
  CancelFinishedListingError,
  CancelOtherListingError,
  InvalidDepositAmountError,
  InvalidPriceError,
  InvalidTitleError,
  ListingNotExistsError,
  NotInteractWithListingError,
  UserNotExistsError,
} from './errors';
import { MarketPlace } from './marketplace';

let marketPlace: MarketPlace;
const seller = 'Seller';
const buyer = 'Buyer';
const amount = 5;
const title = 'Title';

beforeEach(() => {
  marketPlace = new MarketPlace();
});

describe('MarketPlace tests', () => {
  describe('Deposit money & balance tests', () => {
    it('should successfully deposit money to nonexisting user', () => {
      marketPlace.deposit(buyer, amount);

      expect(marketPlace.getUserBalance(buyer)).toEqual(amount);
    });

    it('should successfully deposit money to existing user', () => {
      marketPlace.deposit(buyer, amount);
      marketPlace.deposit(buyer, amount);

      expect(marketPlace.getUserBalance(buyer)).toEqual(2 * amount);
    });

    it('should throw an error when depositing invalid amount', () => {
      expect(() => marketPlace.deposit(buyer, 0)).toThrowError(InvalidDepositAmountError);
      expect(() => marketPlace.deposit(buyer, -5)).toThrowError(InvalidDepositAmountError);
      expect(() => marketPlace.deposit(buyer, undefined)).toThrowError(InvalidDepositAmountError);
    });

    it('should throw an error when fetching nonexisting user balance', () => {
      expect(() => marketPlace.getUserBalance('nonexisting')).toThrowError(UserNotExistsError);
    });
  });

  describe('List item for sale tests', () => {
    it('should list item for sale', () => {
      const listing = { title, seller, price: amount };
      marketPlace.listItemForSale(seller, title, amount);

      expect(marketPlace.getListing(title)).toEqual(listing);
      expect(marketPlace.getListings().length).toBe(1);
    });

    it('should throw an error when listing item with invalid title', () => {
      expect(() => marketPlace.listItemForSale(seller, '', amount)).toThrowError(InvalidTitleError);
      expect(() => marketPlace.listItemForSale(seller, undefined, amount)).toThrowError(InvalidTitleError);
    });

    it('should throw an error when listing item with invalid price', () => {
      expect(() => marketPlace.listItemForSale(seller, title, 0)).toThrowError(InvalidPriceError);
      expect(() => marketPlace.listItemForSale(seller, title, -1)).toThrowError(InvalidPriceError);
      expect(() => marketPlace.listItemForSale(seller, title, undefined)).toThrowError(InvalidPriceError);
    });
  });

  describe('Get listings tests', () => {
    it('should get listings', () => {
      expect(marketPlace.getListings().length).toBe(0);
      marketPlace.listItemForSale(seller, title, amount);
      expect(marketPlace.getListings().length).toBe(1);
      marketPlace.listItemForSale(seller, title + '1', amount);
      expect(marketPlace.getListings().length).toBe(2);
    });

    it('should throw an error when fetching nonexisting listing', () => {
      expect(() => marketPlace.getListing('')).toThrowError(ListingNotExistsError);
      expect(() => marketPlace.getListing(undefined)).toThrowError(ListingNotExistsError);
      expect(() => marketPlace.getListing('nonexisting')).toThrowError(ListingNotExistsError);
    });
  });

  describe('Buy item tests', () => {
    it('should buy an item', () => {
      const randomReminder = Math.random();
      marketPlace.listItemForSale(seller, title, amount);
      marketPlace.deposit(buyer, amount + randomReminder);
      marketPlace.buyItem(buyer, title);

      expect(marketPlace.getListing(title).buyer).toEqual(buyer);
      expect(marketPlace.getUserBalance(buyer)).toBeCloseTo(randomReminder, 8);
      expect(marketPlace.getEscrowBalance()).toEqual(amount);
    });

    it('should throw an error when trying to buy nonexisting listing', () => {
      expect(() => marketPlace.buyItem(buyer, title)).toThrowError(ListingNotExistsError);
    });

    it('should throw an error when buyer balance is too low', () => {
      marketPlace.listItemForSale(seller, title, amount + 1);
      marketPlace.deposit(buyer, amount);

      expect(() => marketPlace.buyItem(buyer, title)).toThrowError(BalanceTooLowError);
    });

    it('should throw an error when trying to buy own item', () => {
      marketPlace.listItemForSale(seller, title, amount);
      marketPlace.deposit(seller, amount);

      expect(() => marketPlace.buyItem(seller, title)).toThrowError(BuyOwnItemError);
    });
  });

  describe('Complete listing tests', () => {
    it('should complete listing', () => {
      marketPlace.listItemForSale(seller, title, amount);
      marketPlace.deposit(buyer, amount);
      marketPlace.buyItem(buyer, title);
      marketPlace.completeListing(buyer, title);

      expect(() => marketPlace.getListing(title)).toThrowError(ListingNotExistsError);
      expect(marketPlace.getUserBalance(seller)).toEqual(amount);
      expect(marketPlace.getUserBalance(buyer)).toEqual(0);
      expect(marketPlace.getEscrowBalance()).toEqual(0);
    });

    it('should throw an error when trying to complete nonexisting listing', () => {
      expect(() => marketPlace.completeListing(buyer, title)).toThrowError(ListingNotExistsError);
    });

    it('should throw an error when trying to complete other people listing', () => {
      marketPlace.listItemForSale(seller, title, amount);
      marketPlace.deposit(buyer, amount);
      marketPlace.buyItem(buyer, title);

      expect(() => marketPlace.completeListing(seller, title)).toThrowError(NotInteractWithListingError);
    });
  });

  describe('Complain listing tests', () => {
    it('should complain listing', () => {
      marketPlace.listItemForSale(seller, title, amount);
      marketPlace.deposit(buyer, amount);
      marketPlace.buyItem(buyer, title);
      marketPlace.complainListing(buyer, title);

      expect(() => marketPlace.getListing(title)).toThrowError(ListingNotExistsError);
      expect(marketPlace.getUserBalance(buyer)).toEqual(amount);
      expect(marketPlace.getEscrowBalance()).toEqual(0);
    });

    it('should throw an error when trying to complain on nonexisting listing', () => {
      expect(() => marketPlace.complainListing(buyer, title)).toThrowError(ListingNotExistsError);
    });

    it('should throw an error when trying to complaing on other people listing', () => {
      marketPlace.listItemForSale(seller, title, amount);
      marketPlace.deposit(buyer, amount);
      marketPlace.buyItem(buyer, title);

      expect(() => marketPlace.complainListing(seller, title)).toThrowError(NotInteractWithListingError);
    });
  });

  describe('Cancel listing tests', () => {
    it('should cancel listing', () => {
      marketPlace.listItemForSale(seller, title, amount);
      marketPlace.cancelListing(seller, title);

      expect(() => marketPlace.getListing(title)).toThrowError(ListingNotExistsError);
    });

    it('should throw an error when trying to cancel nonexisting listing', () => {
      expect(() => marketPlace.cancelListing(buyer, title)).toThrowError(ListingNotExistsError);
    });

    it('should throw an error when trying to cancel other people listing', () => {
      marketPlace.listItemForSale(seller, title, amount);

      expect(() => marketPlace.cancelListing(buyer, title)).toThrowError(CancelOtherListingError);
    });

    it('should throw an error when trying to cancel finished listing', () => {
      marketPlace.listItemForSale(seller, title, amount);
      marketPlace.deposit(buyer, amount);
      marketPlace.buyItem(buyer, title);

      expect(() => marketPlace.cancelListing(seller, title)).toThrowError(CancelFinishedListingError);
    });
  });

  describe('Get Escrow Balance tests', () => {
    it('should get escrow balance', () => {
      const title2 = 'Title 2';
      marketPlace.deposit(buyer, amount);
      marketPlace.deposit(seller, 2 * amount);
      marketPlace.listItemForSale(seller, title, amount);
      marketPlace.listItemForSale(buyer, title2, 2 * amount);
      marketPlace.buyItem(buyer, title);
      marketPlace.buyItem(seller, title2);

      expect(marketPlace.getEscrowBalance()).toEqual(3 * amount);
    });
  });
});
