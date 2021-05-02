import { MarketPlace } from './contracts/marketplace';
import { parseInputFile } from './utils';

try {
  const path = process.argv[2];
  if (!path) {
    throw new Error('Please provide path to the input file');
  }

  const commands = parseInputFile(path);

  const marketPlace = new MarketPlace();
  commands.forEach((command) => {
    switch (command.action) {
      case 'Credit':
        marketPlace.deposit(command.party, Number(command.params[0]));
        break;
      case 'Offer':
        marketPlace.listItemForSale(command.party, command.params[0], Number(command.params[1]));
        break;
      case 'Order':
        marketPlace.buyItem(command.party, command.params[0]);
        break;
      case 'Complete':
        marketPlace.completeListing(command.party, command.params[0]);
        break;
      case 'Complain':
        marketPlace.complainListing(command.party, command.params[0]);
        break;
      default:
        throw new Error('Unknown action');
    }
  });

  console.log(`Buyer 1's balance: ${marketPlace.getUserBalance('Buyer 1')}`);
  console.log(`Seller 2's balance: ${marketPlace.getUserBalance('Seller 2')}`);
  console.log(`Total amount held in escrow: ${marketPlace.getEscrowBalance()}`);
} catch (err) {
  console.log(err);
}
