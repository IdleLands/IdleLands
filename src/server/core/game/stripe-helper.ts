import { Singleton, AutoWired } from 'typescript-ioc';

import * as stripe from 'stripe';
import { Player } from '../../../shared/models';
import { IRLPurchaseData } from '../../../shared/interfaces';

const Stripe = stripe(process.env.STRIPE_KEY);

@Singleton
@AutoWired
export class StripeHelper {

  public async buyWithStripe(player: Player, purchaseInfo) {
    if(!process.env.STRIPE_KEY) throw new Error('Stripe is not configured');
    if(!purchaseInfo) return;

    const { token, item } = purchaseInfo;
    if(!item || !token) throw new Error('PurchaseItem: No item or no valid token');

    const validItem = IRLPurchaseData[item];
    if(!validItem) throw new Error('Trying to purchase invalid item.');

    try {
      const customerOpts: any = {};
      if(player.authSyncedTo) customerOpts.name = player.authSyncedTo;

      const customer = await Stripe.customers.create(customerOpts);

      const source = await Stripe.customers.createSource(customer.id, {
        source: token.id
      });

      await Stripe.charges.create({
        amount: validItem.cost,
        currency: 'usd',
        customer: source.customer
      });

      player.gainILP(validItem.ilp);
    } catch(e) {
      throw e;
    }
  }

}
