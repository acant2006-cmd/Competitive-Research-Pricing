# Threshold Fit Pricing and Cost Laboratory

Mission 3 for Andre Cantave. A static, browser-based laboratory for the proposed fitness and meal-planning subscription. Source is hosted alongside Mission 2 in the repository the student supplied. Mission 2 remains at the site root; this application is deployed at `laboratory/`. The original venture website repository is not modified.

Repository: https://github.com/acant2006-cmd/Competitive-Research-Pricing

Laboratory: https://acant2006-cmd.github.io/Competitive-Research-Pricing/laboratory/

Original venture: https://acant2006-cmd.github.io/Creative-Website-/

## Build

Node.js 22, no package dependencies, API keys, backend, database, runtime CDN or paid services required. Native browser JavaScript, SVG charts, CSS and a small OOXML/ZIP report serializer keep all calculations and exports local.

```sh
npm ci
npm test
npm run build
```

Production files are in `dist`. Serve through HTTP; JSON module fetches will not reliably work from a direct file URL. All asset paths are relative and navigation uses hashes. The repository's Pages workflow builds both projects and copies this project's `dist` into root `dist/laboratory`.

## Inputs and identity

The Mission 1 JSON is bundled unchanged. It has 4 competitors and 19 researched offers, checked October 27, 2026. Its workbook and report were inspected. The original website source identifies the venture as Threshold Fit; this resolves the previously unnamed venture without changing the original Mission 1 JSON. The setup supplied a Pages live URL in the repository URL field. The report preserves that exact supplied value and separately records the resolved GitHub repository URL.

`data/defaults.json` holds the editable cost and plan suggestions and seven source records. There are 24 expense suggestions. Published references cover Apple membership, Apple general commission, Supabase Pro, Cloudflare Workers, optional Google registration and optional Stripe fees. Apple Small Business eligibility is documented but not assumed. These are supplier references, not verified total operating costs or industry averages. Labor, content review, insurance, legal budgets, workload and customer counts are explicitly estimates or illustrations. No actual services are purchased by this app. Free users, workload peaks and usage beyond published allowances need separate investigation.

## Model conventions

- Horizon: one month of steady average activity in USD. Quantity means average active paying customers, including annual subscribers. It is not new subscriber acquisition or a forecast.
- Monthly recognized price = listed annual price / 12, or listed monthly price. Annual upfront collections and deferred revenue cash flows are outside this model.
- Fixed recurring cost = amount / billing months. Per-customer recurring cost = rate / period months. Percentage expense = recognized revenue × percentage. Per-transaction fees divide by 12 for annual subscriptions.
- Startup costs are separate cash requirements. Only explicitly chosen positive amortization months add straight-line depreciation/amortization to monthly fixed costs, once. Zero salvage value; tax/accounting treatment requires advice.
- Shared fixed overhead is counted once, then allocated by active-customer share. At zero volume it is split equally for plan display. Specific fixed expenses stay with the assigned plan. Shared unit rates apply to each customer once; percentage rates apply to eligible plan revenue.
- Contribution per customer-month = recognized price − variable cost. Profit = revenue − variable cost − fixed operating costs.
- Business break-even = fixed costs / weighted contribution at the current customer mix. It is undefined at zero total quantity and nonpositive contribution. Rounded-up customer counts are planning approximations; exact required plan quantities depend on the mix. Break-even revenue uses unrounded units.
- Margin of safety = (revenue − break-even revenue) / revenue. Taxes, financing, working capital, churn, cohorts, demand response and capacity steps are excluded. Charts deliberately use linear cost assumptions.
- Extra plan unit costs add to expense rows. Optional add-on text is disclosure, not modeled revenue; model a paid add-on as a separate scenario plan if needed.

## Workflow and persistence

Seven sections provide business context, expense management, plan management, financial charts, saved operating scenarios, competitor context, and review/confirmation. Editing an amount labels the selection Student-Entered while preserving the original reference. Suggested expenses can be disabled/restored; custom expenses deleted; all expense details and allocations are editable. Plan deletion disables costs that were assigned to it.

Local storage saves the working configuration, scenarios, review and confirmed snapshot on the current browser only. Export/import working JSON to transfer devices. Imports validate IDs, finite nonnegative amounts, billing, allocations and source formats. Imported models require fresh evaluation and confirmation. No private financial inputs are transmitted to a server by the application.

The three spending presets hold price and 500 customers constant; spending is not assumed to generate demand. Custom scenarios preserve their own models. Conservative/base/optimistic volume factors are student-editable assumptions. Independent review stresses use 20% less volume and 10% higher operating costs.

## Review rules

Unsustainable: any plan has nonpositive contribution or total modeled profit is negative. High: otherwise a stress-test loss, margin of safety below 20%, zero volume or a missing essential category. Moderate: remaining estimates or missing sources. Lower: none of these flags. These classifications describe the entered model, not business failure probability.

Any financial edit makes the review stale and removes the current confirmation. The student evaluates, supplies at least 20 characters of justification, and acknowledges major warnings if present. Risk does not prohibit confirmation. The application never automatically confirms a decision. A finalized snapshot is deep-copied and both exports use that same snapshot. Changing the statement requires confirmation again.

## Reports

`Pricing_Decision_Report.docx` is a genuine Office Open XML document in a valid ZIP package. The shared serializer works in both the browser and Node. `Pricing_Decision_Data.json` contains the identical confirmed snapshot. A separate `customer_facing` object excludes costs, quantities, profit and risk details; the `private_financial` block is internal only. Both include original website metadata for Mission 4. The app never begins Mission 4 or modifies that website.

QA test documents are clearly labeled test fixtures and are excluded from source/deployment. They do not represent the student's decision. See `VALIDATION.md` for performed tests and limitations.
