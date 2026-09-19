window.DASH_CONTENT = {
  title: 'Product review: funnel health',
  subtitle: 'How every purchase funnel has moved month by month since May 2026.',
  working: [
    'Logged-in visitors convert better than a month ago on four funnels: Group Web (6.1% to 6.9%) and iOS (6.7% to 8.8%), and 1:1 Web (5.8% to 7.5%) and iOS (5.1% to 6.9%). Each gain is statistically real.',
    'More people are clicking through: Register click on Group iOS (17.9% to 20.9%) and Group Web (13.8% to 15.3%), Confirm slot on 1:1 Web (14.4% to 17.2%).',
    '1:1 Web guests are back after a weak July: the click-through rate recovered from 2.9% to 5.4%.'
  ],
  notWorking: [
    'Group Web logged-out visitors, the biggest audience, are converting less: 0.62% down to 0.53% over the last 28 days. Fewer click Register, fewer reach the cart, and fewer who open login ask for an OTP.',
    'Cart to checkout is the weakest step on nearly every logged-in funnel (43% to 64%). More than a third of people with something in the cart never proceed.',
    'On the web login screen, many people never ask for an OTP: about 53% do on Group Web, and on 1:1 Web it has fallen every month from 53% to 30%.'
  ],
  watch: [
    'Group Android logged-in: the cart page is reached more often (84.6% to 89.5%) but fewer go on to checkout (52.7% to 46.2%), so the gain cancels out.',
    'Group Android logged-out: login success from the cart has slid from 42% in July to 23% in September. Not yet significant over 28 days, but the monthly slide is steady.',
    'May Android numbers look like a tracking issue (several steps far below every later month). Treat June onward as the baseline.',
    'App logged-out funnels have small audiences (a few hundred people in 28 days), so their month-to-month moves are noisy.'
  ],
  takeaways: {
    'group-web-guest': 'Down over the last 28 days. Fewer visitors click Register, fewer reach the cart, and fewer who open login request an OTP. July was the best month (0.75%). The largest steady leak is Cart to Login: about two in three cart visitors never start login.',
    'group-web-loggedin': 'A steady climb from 4.8% in May to 7.6% in September, driven by more visitors clicking Register. Cart to checkout (about 63%) is the biggest remaining leak.',
    'group-ios-loggedin': 'The strongest Group funnel right now. Register clicks and cart arrival both improved. July dipped to 4.9% during a traffic spike, when the click-through rate fell to 13.4%.',
    'group-android-loggedin': 'Flat since June at about 6.4%. The cart page is reached more often, but fewer people go on to checkout, which cancels the gain. The weak May checkout-to-purchase rate (63%) looks like a one-off.',
    'group-ios-guest': 'Rising every month from 1.6% to 5.9%, but the audience is small and shrinking, so single months are noisy. The May login-to-checkout figure looks like a tracking artifact.',
    'group-android-guest': 'Between 2.7% and 4.5% since June. Login success from the cart has slipped from 42% in July to 23% in September, so it is worth watching. May looks like a tracking anomaly.',
    'oneone-web-guest': 'Register clicks recovered (2.9% in July to 5.4%), but Login to OTP has fallen every month (53% to 30%) while overall conversion held. That is consistent with a change to the web login flow, though it has not been verified.',
    'oneone-web-loggedin': 'Up from 5.8% to 7.5% because more logged-in visitors confirm a slot. Cart to checkout, at about 60%, is the weakest step.',
    'oneone-ios-loggedin': 'Improving, 5.1% to 6.9%, thanks to better cart-to-checkout (43.8% to 52.3%) and checkout-to-purchase (67.6% to 79.9%).',
    'oneone-android-loggedin': 'Recovering from a weak May (2.5%). Checkout to purchase rose from 43.6% to 75.5%. Cart to checkout, at about 43%, is still the weakest step.',
    'oneone-ios-guest': 'Very small audience, so no change here is statistically meaningful. Read the direction only.',
    'oneone-android-guest': 'Very small audience, so no change here is statistically meaningful. Read the direction only.'
  },
  notes: [
    'Every number comes from Mixpanel funnel reports counted within a single session, never from raw event counts. Each day is its own group of people entering the funnel; a month adds the days together. That means repeat visitors are counted once per day they visit, so these rates run a little different from Mixpanel’s whole-period unique-user totals.',
    'On the apps, login steps are merged into one step (for example Cart to Login success) because the separate sign-in events did not fire reliably. Web keeps the separate login steps.',
    '“Last 28 days” is the 28 complete days ending the day before the latest data. “Previous 28 days” is the 28 days before that. The current day is left out because it is incomplete, and September covers 1 to 18 September only.',
    'A change is marked improved or declined only when it is statistically significant (95% confidence, comparing the two 28-day windows). It is a rough test that leans slightly optimistic, because repeat visitors are not independent. Anything else is shown as no clear change.',
    'Each small chart has its own scale that starts at zero, so compare shapes, not heights, between charts.',
    'On 1:1 funnels the first click is Confirm slot click, and Leader query is deliberately not a step. Still to add: home-screen funnels (Home to card click, Home to detail page).'
  ]
};
