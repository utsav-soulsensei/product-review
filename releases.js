// Web PDP / cart releases, hand-maintained. page: Course = group course page, Checkout = cart/checkout, Both = both.
window.DASH_RELEASES = [
  { date: '2026-06-02', pr: 3432, page: 'Course',   what: 'New course page layout (V_FOUR_B) with sticky bottom buttons; A/B test started' },
  { date: '2026-06-03', pr: 3435, page: 'Course',   what: 'Fixed the bottom button disappearing too early on scroll' },
  { date: '2026-06-03', pr: 3446, page: 'Course',   what: 'Steadier rendering of the sticky bottom buttons' },
  { date: '2026-06-03', pr: 3451, page: 'Both',     what: 'Lowered the buttons and cart layer so they no longer cover the navigation' },
  { date: '2026-06-04', pr: 3464, page: 'Both',     what: 'Analytics refactor: unique IDs on checkout and add-to-cart events' },
  { date: '2026-06-05', pr: 3477, page: 'Checkout', what: 'Item name now read from the leader session config first' },
  { date: '2026-06-08', pr: 3485, page: 'Course',   what: 'Free-gift "seen" event no longer fires repeatedly while scrolling' },
  { date: '2026-06-15', pr: 3516, page: 'Checkout', what: 'Gift unboxing animation on cart items (500 ms delay)' },
  { date: '2026-07-02', pr: 3605, page: 'Course',   what: 'New camera assets on the course page; header spacing and fullscreen video fixes' },
  { date: '2026-07-03', pr: 3619, page: 'Checkout', what: 'International handling fee shown and added in the cart' },
  { date: '2026-07-07', pr: 3642, page: 'Course',   what: '"Recording has expired" lock after 90 days' },
  { date: '2026-07-09', pr: 3653, page: 'Checkout', what: 'New login popup (authV3, A/B tested) replaces the old checkout login' },
  { date: '2026-08-17', pr: 3901, page: 'Course',   what: 'Multi-city offline courses go through an intermediate form instead of straight to the cart' },
  { date: '2026-08-18', pr: 3966, page: 'Both',     what: 'Meta pixel A/B flag added' },
  { date: '2026-09-10', pr: 4168, page: 'Both',     what: 'Groundwork for promotional gift pills on headers' },
  { date: '2026-09-16', pr: 4196, page: 'Both',     what: 'A/B split resized for the promo sheet/strip test' },
  { date: '2026-09-17', pr: 4199, page: 'Checkout', what: 'Green "free gift" pill on checkout item cards (A/B)' },
  { date: '2026-09-17', pr: 4204, page: 'Checkout', what: 'Fixed a cash price wrongly shown on free-gift items; more bottom padding' },
  { date: '2026-09-17', pr: 4206, page: 'Both',     what: 'Promo test ranges reset to include users previously left out' },
  { date: '2026-09-21', pr: 4213, page: 'Course',   what: 'Promo sheet hiding fix; storage errors now handled' }
];
