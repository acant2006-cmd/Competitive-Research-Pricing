# Validation record

Research snapshot: October 27, 2026.

- Imported 4 unique competitors and 19 unique offers. Offer foreign keys and HTTPS source formatting validated.
- Cross-checked every offer against 14 workbook fields, including all three price fields, currency, verification, billing period and representative flags. No mismatches found.
- Checked the report's preliminary monthly $12.99–$16.99 and annual $89.99–$119.99 recommendations and key monthly benchmarks.
- Dashboard JSON is byte-for-byte identical to Mission 1 JSON.
- Verified monthly representatives: n=3, minimum $9.99, maximum $29.99, mean $18.66, median $15.99.
- Verified annual representatives: n=3, minimum $79.99, maximum $159.99, mean $111.99, median $95.99.
- Partial-inclusive monthly representatives: n=4, mean $20.24, median $20.49.
- Normalized standalone offer population: 11 verified, 13 with partial quotes. Unavailable, free, gifts, bundles and multi-user offers excluded from these statistics.
- Node tests cover statistics, quantile classification, cents comparisons, normalization, histogram conservation, search/filter/selection logic and sorting unknown prices last.
- Simulated event/render tests exercise all six sections, slider updates, scenario presets, annual reset, partial inclusion, search empty states, selected comparison, register filters, clicked histogram bins and offer dialogs.
- The first test run exposed a floating-point assertion (111.99000000000001 versus 111.99); the test now compares currency rounded to cents. Display formatting already rounded correctly.
- Static review corrected malformed dropdown option tags and removed an empty CSS import.
- Production build produces relative assets and JSON under `dist/` with no external runtime dependencies.

## Not verified

Connected browser access was unavailable. No actual browser, mobile visual, keyboard-focus or screenshot review was performed. The simulated harness does not substitute for those checks. Source URLs were checked for formatting, not newly re-researched or tested for current availability.

The repository acant2006-cmd/Competitive-Research-Pricing is accessible and was empty before initial upload. GitHub Pages configuration, deployment and published-site verification are pending. Mission 2 remains incomplete until those steps and browser review are completed.
