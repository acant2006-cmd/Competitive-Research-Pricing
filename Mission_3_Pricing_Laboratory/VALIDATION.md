# Mission 3 validation

Checked October 27, 2026. Public release of the labeled example financial assumptions was explicitly approved by the student after the automatic review rejection. Deployment verification is recorded separately.

## Research and source checks

- Inspected the original Mission 1 workbook, report and JSON, plus the Mission 2 source.
- The bundled competitor JSON remains unchanged: 4 competitors and 19 offer records.
- Read the original venture website source through GitHub. It names the concept Threshold Fit and describes the busy-adult fitness and meal-planning concept. No writes were made to that repository.
- Checked official Apple Developer membership and commission pages, Google Play registration, Supabase pricing, Cloudflare Workers pricing, and Stripe pricing. Seven cost-reference records are included. The Apple Small Business rate is documented but not assumed to apply.
- Twenty-four expense suggestions distinguish supplier references, workload estimates and illustrative allowances. Customer volume is a labeled assumption. No paid APIs are called.

## Automated tests actually performed

25 Node tests passed. Seventeen independently check mathematical and export behavior, including:

- Single-product result: $20 price, $5 variable cost, 100 customers and $600 fixed cost gives $2,000 revenue, $500 variable cost, $900 profit, 40 break-even customers and 60% margin of safety.
- Annual $120 plans with a $0.30 transaction fee and 3% revenue fee give $10 monthly recognized price and $0.325 variable fee per active customer-month.
- Annual and quarterly fixed-cost normalization.
- One-time startup cash and explicit straight-line depreciation; no automatic recurring startup expense.
- Disabled expenses, zero quantity, nonpositive contribution and rounded-up break-even.
- Two-plan allocation: $11,000 revenue, $3,900 variable cost, $1,100 fixed and $6,000 profit, with overhead counted once.
- Independent volume and cost stress behavior.
- Monthly versus annual competitor selection, partial-price exclusion, validation of IDs and finite values.
- Risk classification, short-statement and warning checks, stale-evaluation rejection, snapshot immutability and separation of customer-facing fields.

Eight simulated DOM/event tests exercise all seven views, slider/numeric edits, custom expense management, disabling/restoring, plan creation/editing/removal, scenario save/load, review and warning acknowledgment, confirmation, both download serializers, stale export blocking, working backups/imports and persistence across simulated reload. Tests use a separate test storage namespace and explicitly labeled QA decisions. They do not confirm a decision for Andre Cantave.

## Word and JSON checks

- Both final export functions use the same deep-copied snapshot and identifier.
- DOCX begins with a ZIP header, has valid CRCs and parsable XML parts, and includes all ten numbered report sections.
- JSON round-trip parsing and exact snapshot consistency passed.
- The test document was opened by the packaged office renderer and rendered into page PNGs/PDF for layout inspection. All ten pages were inspected. Source links were made clickable and given wrapping opportunities. It is a QA fixture, excluded from the source archive and deployment.
- No final student pricing decision or student report is generated on the user's behalf.

## Build and remaining limitations

- Production static build succeeded. No CDN, external runtime dependency, secret key, backend or account login is required.
- Relative assets and hash navigation support deployment below `/Competitive-Research-Pricing/laboratory/`.
- Automatic approval review rejected the proposed public GitHub source upload because it includes unconfirmed financial assumptions. The student then explicitly approved publication. No private student financial inputs or confirmed decision are included in source.
- Actual browser interaction, native downloads, narrow-screen rendering and published-site checks remain pending. Simulated tests do not establish browser or mobile behavior.
- Models use constant costs and steady monthly quantities. Real taxes, financing, free users, churn, customer acquisition, capacity limits and invoice timing require additional modeling and evidence.
