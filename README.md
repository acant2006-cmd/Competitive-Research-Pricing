# Competitive Pricing Intelligence

A responsive dark dashboard for Andre Cantave's proposed AI fitness app. Mission 2 compares observed competitor pricing; it does not forecast demand, sales, revenue or profits.

## Run and build

Node.js 22 is recommended. No runtime dependencies, API keys, paid services, backend or database are required.

```sh
npm ci
npm test
npm run build
```

The static production output is `dist/`. Serve it with an HTTP static host; directly opening `index.html` as a file will not reliably permit the JSON fetch. All asset paths are relative and navigation uses hash anchors, so repository subpaths and page refreshes work without routing rewrites.

## Features

Six sections cover overview KPIs, searchable competitor profiles and selected comparisons, representative bars, normalized offer ranges and histogram, an all-offer register, a live price slider with quartile presets, research-supported opportunities, and sources. Monthly/annual billing and verification controls change representative statistics. The offer register retains unknown and partially verified observations. Keyboard focus, native form controls, dialogs, reduced-motion styles and narrow-screen layouts are included.

## Research

`data/competitor_data.json` is the unchanged Mission 1 primary dataset, dated October 27, 2026. It contains 4 competitors, 19 offers and the original source URLs, limitations and preliminary recommendation. Important prices and fields were cross-checked against the Mission 1 workbook and report. No competitor logos or product images were invented.

The default monthly comparison includes 3 verified representatives: Apple Fitness+ $9.99, Fitbod $15.99 and Centr $29.99. Mean $18.66; median $15.99. Enabling partially verified quotes adds MyFitnessPal Premium+ $24.99: mean $20.24; median $20.49. Annual counterparts are compared as annual charges, not monthly equivalents.

Range and distribution charts use effective monthly prices for paid standalone standard and alternate-SKU offers: 11 verified, or 13 including partial quotes. Free, gift, multi-user, bundle and unavailable lifetime offers remain in the register but are excluded from those charts. Annual equivalents are not installments. Quartiles use linear interpolation. Unknown prices are never zero-filled.

The research's Centr quarterly billing conflict remains disclosed. Centr's ambiguous stock widget is not confirmed out-of-stock status. Fitbod gift compare-at pricing is a reference only. MyFitnessPal Premium+ quotes remain partially verified. Prices are snapshots, not live listings.

## GitHub Pages deployment

Repository: https://github.com/acant2006-cmd/Competitive-Research-Pricing. The empty repository was inspected before this initial upload. The included workflow publishes the dashboard after GitHub Pages is enabled.

1. Put this folder's contents at the target repository root, including `.github/workflows/pages.yml` and `package-lock.json`.
2. In GitHub **Settings → Pages → Build and deployment**, select **GitHub Actions** as the source.
3. Commit and push to `main`, or change the workflow branch to the repository's actual deployment branch. The included workflow tests, builds and deploys `dist`.
4. In **Actions**, wait for **Publish pricing dashboard** to finish. If needed, select **Run workflow**.
5. Open the URL reported by the deployment. Check every section, billing switch, filter, slider and source link on desktop and mobile before considering publication verified.

Expected Pages address after successful deployment: https://acant2006-cmd.github.io/Competitive-Research-Pricing/. Publication must be verified before treating this address as live. The project was built in the available session workspace, not directly on the user's Mac.

## Tests and limitations

See `VALIDATION.md`. Node tests cover calculation logic and a lightweight simulated event/render harness. This harness is not a browser: visual layout, native focus behavior and mobile interaction still require actual browser testing. No successful browser QA or public deployment is claimed.

## Updating

Keep data in `data/competitor_data.json` separate from `src/app.js` and `src/styles.css`. Preserve schema relationships, validate representative flags and billing units, then run tests and build. Tests intentionally assert the current research snapshot; revise expected values when replacing the dataset. Snapshot date labels and explanatory text should be reviewed with every research update.
