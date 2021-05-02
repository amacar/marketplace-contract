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

interface Listing {
  title: string;
  price: number;
  seller: string;
  buyer?: string;
}

export class MarketPlace {
  private readonly balances: Record<string, number>;
  private readonly listings: Record<string, Listing>;
  private escrowBalance: number;

  constructor() {
    this.balances = {};
    this.listings = {};
    this.escrowBalance = 0;
  }

  public deposit(id: string, amount: number | undefined): void {
    if (!this.userExists(id)) {
      this.balances[id] = 0;
    }

    if (!amount || amount < 0) {
      throw new InvalidDepositAmountError();
    }

    this.balances[id] += amount;
  }

  public getUserBalance(id: string): number {
    if (!this.userExists(id)) {
      throw new UserNotExistsError();
    }

    return this.balances[id]!;
  }

  public listItemForSale(seller: string, title: string | undefined, price: number | undefined): void {
    if (!title?.length) {
      throw new InvalidTitleError();
    }

    if (!price || price < 0) {
      throw new InvalidPriceError();
    }

    this.listings[title] = { title, price, seller };
  }

  public getListings(): Listing[] {
    return Object.values(this.listings);
  }

  public getListing(title: string | undefined): Listing {
    const listing = title?.length && this.listings[title];
    if (!listing) {
      throw new ListingNotExistsError();
    }

    return listing;
  }

  public buyItem(buyer: string, title: string | undefined): void {
    const { seller, price } = this.getListing(title);
    const buyerBalance = this.getUserBalance(buyer);
    if (buyerBalance < price) {
      throw new BalanceTooLowError(buyer);
    }

    if (seller === buyer) {
      throw new BuyOwnItemError();
    }

    this.balances[buyer] -= price;
    this.escrowBalance += price;
    this.listings[title!]!.buyer = buyer;
  }

  public completeListing(buyer: string, title: string | undefined): void {
    const { buyer: listingBuyer, seller, price } = this.getListing(title);
    if (listingBuyer !== buyer) {
      throw new NotInteractWithListingError();
    }

    this.deposit(seller, price);
    this.escrowBalance -= price;
    this.removeListing(title!);
  }

  public complainListing(buyer: string, title: string | undefined): void {
    const { buyer: listingBuyer, price } = this.getListing(title);
    if (listingBuyer !== buyer) {
      throw new NotInteractWithListingError();
    }

    this.deposit(buyer, price);
    this.escrowBalance -= price;
    this.removeListing(title!);
  }

  public cancelListing(seller: string, title: string | undefined): void {
    const { seller: listingSeller, buyer } = this.getListing(title);
    if (listingSeller !== seller) {
      throw new CancelOtherListingError();
    }

    if (buyer) {
      throw new CancelFinishedListingError();
    }

    this.removeListing(title!);
  }

  public getEscrowBalance(): number {
    return this.escrowBalance;
  }

  private userExists(id: string): boolean {
    return this.balances[id] !== undefined;
  }

  private removeListing(title: string): void {
    delete this.listings[title];
  }
}
