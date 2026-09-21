window.DASH_CONTENT = {
  title: 'Product review: funnel health',
  commentaryAsOf: '21 Sep 2026',
  subtitle: 'How every purchase funnel has moved month by month since May 2026.',
  working: [
    'Logged-in visitors convert better than in August on three funnels, each a statistically real gain: Group Web (6.1% to 7.6%), 1:1 Web (5.9% to 8.3%) and 1:1 iOS (5.0% to 7.2%). Group iOS (7.6% to 9.0%) and 1:1 Android (4.5% to 5.8%) are up too, but not yet significant.',
    'More people are clicking through: Register click on Group Web logged-in (13.9% to 16.6%) and Group Web logged-out (4.2% to 5.1%, back near July’s 5.5%), Confirm slot on 1:1 Web (14.9% to 17.5%) and 1:1 iOS (15.2% to 17.8%).',
    'Cart to checkout is improving on several logged-in funnels: Group iOS (50.2% to 57.4%), 1:1 iOS (45.1% to 53.5%) and 1:1 Web (56.7% to 62.7%).'
  ],
  notWorking: [
    'Group Web logged-out visitors, the biggest audience, are still well below July: 0.75% in July, 0.53% in August, 0.58% so far in September. Register clicks have recovered, but fewer people reach the cart after clicking (94.5% to 92.5%) and fewer start login from the cart (33.7% to 31.5%).',
    'Cart to checkout is the weakest step on every logged-in funnel (45% to 66% in September). Roughly a third to a half of people with something in the cart never proceed.',
    'On the web login screen, most people never ask for an OTP: 52% do on Group Web, and only about 31% on 1:1 Web in September (down from 35% in August, a small but real drop).'
  ],
  watch: [
    'Group Android logged-in: the cart page is reached more often (86.0% to 91.2%) but fewer go on to checkout (50.8% to 48.1%, not yet significant), so overall conversion is flat (6.4% to 6.1%).',
    'Group Android logged-out: login success from the cart has slid every month, 42% in July, 30% in August, 22% in September. Not yet significant month on month, but the direction is steady.',
    'May Android numbers look like a tracking issue (several steps far below every later month). Treat June onward as the baseline.',
    'App logged-out funnels have small audiences (a few hundred to a couple of thousand people a month), so their moves are noisy.'
  ],
  takeaways: {
    'group-web-guest': '0.58% so far in September, up slightly from 0.53% in August but well below July’s 0.75%. Register clicks recovered (4.2% to 5.1%), but fewer reach the cart after clicking (94.5% to 92.5%) and fewer start login from the cart (33.7% to 31.5%). The largest steady leak is Cart to Login: about two in three cart visitors never start login.',
    'group-web-loggedin': 'Up from 6.1% in August to 7.6%, mainly because more logged-in visitors click Register (13.9% to 16.6%). Cart to checkout (about 66%) is the biggest remaining leak.',
    'group-ios-loggedin': 'The strongest Group funnel: 9.0% so far in September, up from 7.6% (borderline, not yet significant). Cart to checkout improved (50.2% to 57.4%). July dipped to 4.9% during a traffic spike, when register clicks fell to 13.4%.',
    'group-android-loggedin': 'Flat: 6.4% in August, 6.1% in September (7.0% in June). The cart page is reached more often (86.0% to 91.2%), but fewer go on to checkout (50.8% to 48.1%), which cancels the gain. The weak May checkout-to-purchase rate (63.5%) looks like a one-off.',
    'group-ios-guest': 'Rising almost every month, from 1.5% in May to 5.7% in September, but the audience is small and shrinking, so single months are noisy. The May login-to-checkout figure (46.7%) looks like a tracking artifact.',
    'group-android-guest': 'Between 2.7% and 4.5% since June. Login success from the cart has slid every month (42% in July, 30% in August, 22% in September), so it is worth watching. May looks like a tracking anomaly.',
    'oneone-web-guest': 'Confirm slot clicks recovered (2.9% in July, 5.0% in August, 5.4% in September) and overall conversion is steady at about 0.7%. On the login screen only about a third of people ask for an OTP: 31% in September, down from 35% in August (a small but real drop), and between 31% and 40% every month since May.',
    'oneone-web-loggedin': 'Up from 5.9% to 8.3% because more logged-in visitors confirm a slot (14.9% to 17.5%) and more go on to checkout (56.7% to 62.7%, not yet significant). Cart to checkout, at about 63%, is the weakest step.',
    'oneone-ios-loggedin': 'Up from 5.0% in August to 7.2%, driven by more people confirming a slot (15.2% to 17.8%) and better cart-to-checkout (45.1% to 53.5%). Checkout to purchase is 76.7%, up from 73.5%.',
    'oneone-android-loggedin': 'Recovering from a weak May (2.5%): 4.5% in August, 5.8% in September (not yet significant). Checkout to purchase rose from 43.5% in May to 77.0% in September. Cart to checkout, at about 45%, is still the weakest step.',
    'oneone-ios-guest': 'Very small audience, so no change here is statistically meaningful. Read the direction only.',
    'oneone-android-guest': 'Very small audience, so no change here is statistically meaningful. Read the direction only.'
  },
  notes: [
    'Every number comes from Mixpanel funnel reports counted within a single session, never from raw event counts. Each day is its own group of people entering the funnel; a month adds the days together. That means repeat visitors are counted once per day they visit, so these rates run a little different from Mixpanel’s whole-period unique-user totals.',
    'On the apps, login steps are merged into one step (for example Cart to Login success) because the separate sign-in events did not fire reliably. Web keeps the separate login steps.',
    'Comparisons are between two calendar months. The current month is only part-way through, so it is labelled “so far” (for example September so far against August). Rates are not affected by having fewer days, but they are noisier. In the first nine days of a month the page compares the last two complete months instead.',
    'A change is marked improved or declined only when it is statistically significant (95% confidence, comparing the two months) and at least 5% different in relative terms. It is a rough test that leans slightly optimistic, because repeat visitors are not independent. Anything else is shown as no clear change.',
    'Each small chart has its own scale that starts at zero, so compare shapes, not heights, between charts.',
    'On 1:1 funnels the first click is Confirm slot click, and Leader query is deliberately not a step. Still to add: home-screen funnels (Home to card click, Home to detail page).'
  ]
};
