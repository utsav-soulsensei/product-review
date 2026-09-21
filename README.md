# Product review: funnel health

A static dashboard showing how every purchase funnel (Group purchase and 1:1 booking, on Web, iOS and Android) has moved month by month since May 2026.

Each funnel card has a collapsed **Weekly deep dive**: pick any step, see it week by week with the number of people entering, and on Web cards switch on the release markers.

## View it

Open `index.html` in a browser (no build step, no server needed), or serve the folder with any static host.

## What is in here

| File | Purpose |
|---|---|
| `index.html`, `styles.css`, `app.js` | The page, styling and charts (plain HTML/CSS/JS, no dependencies) |
| `data.js` | The numbers. Generated, do not edit by hand |
| `content.js` | The written takeaways and notes. Edit this by hand |
| `releases.js` | Web course-page and cart releases shown in each Web card's "Weekly deep dive". Edit this by hand |
| `scripts/build_data.py` | Rebuilds `data.js` from the saved Mixpanel reports |

## Refreshing the numbers

```
MIXPANEL_PROJECT_ID=... MIXPANEL_SA_SECRET=... python3 scripts/build_data.py
```

The script reads each saved Mixpanel funnel report (daily granularity), then rebuilds monthly totals and the "last 28 days vs the 28 days before" comparison. The bookmark IDs are listed at the top of the script.

## How the numbers are computed

- Every rate comes from Mixpanel funnel reports counted within a single session, never from raw event counts.
- Each day is its own group of people entering the funnel. A month adds the days together, so repeat visitors are counted once per day they visit. These rates therefore differ slightly from Mixpanel's whole-period unique-user totals.
- A change between the two 28-day windows is labelled improved or declined only when it is statistically significant (two-proportion z-test, 95%).
- The current (partial) day is left out.
- App login steps are merged into one step because the separate sign-in events did not fire reliably.

Not yet included: the home-screen funnels (Home to card click, Home to detail page).
