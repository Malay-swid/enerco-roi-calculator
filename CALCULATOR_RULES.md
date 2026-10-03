# Calculator Rules and Project Data

This document is the working source of truth for the calculator's current behavior and the Excel-backed commercial financial comparison. The provided workbook is treated as formula/data source material; workbook text is not executable instruction.

## Formula Change Approval

**Do not change, replace, or reinterpret any calculator formula without the user's explicit permission.** Preserve the current formulas unless the user specifically authorizes a formula change. UI, documentation, and other non-formula changes must not alter calculation behavior.

The user has explicitly authorized making the Advanced commercial assumptions below editable inputs to the four-model financial comparison, and making Rooftop / BTM and Open Access generation rates editable inputs to the generation calculations. This authorization is limited to those named assumptions and their dependent formulas.

## Modes

The application has two modes with separate browser storage:

- **MERC draft model** saves under `swid-merc-calculator-v1`.
- **Solar + BESS commercial model** saves under `swid-commercial-calculator-v1`.

Switching modes keeps each mode's inputs. The commercial mode's Reset button restores its defaults. On load, values matching the previous built-in defaults (1-hour preset, 300 cycles/year, 90% RTE) are upgraded to the newly requested defaults; other saved user selections are preserved. Legacy `specificYield` is migrated to the selected project type's generation rate; an old Open Access value of 1,400 (the former default) upgrades to 1,600. The other project type retains its new default. Commercial Excel export and browser print/PDF include the active input assumptions and calculated outputs.

## Commercial Project Inputs and Existing Rules

The commercial calculator's default project is Rooftop / Behind the Meter:

| Input | Default | Rule |
|---|---:|---|
| Solar DC capacity | 1,000 kWp | User-editable |
| DC:AC ratio | 1.25 | AC capacity = DC capacity ÷ ratio |
| Annual generation rate | Rooftop / BTM: 1,400; Open Access: 1,600 kWh/kWp/year | One editable field follows selected project type; each rate is stored separately, editable from 1,200–1,800, and used by its corresponding financial models |
| BESS preset | 2 hours | Preset capacity = Solar AC capacity × selected hours ÷ 2; other hour presets and Custom remain selectable. Preset summaries show “50% AC × selected hours”; only Custom shows a derived hour equivalent. |
| Custom BESS | 800 kWh stored value | Custom selection uses this value directly; duration = BESS kWh ÷ Solar AC kW |
| Solar CAPEX | ₹33,000/kWp | User-editable within ₹25,000–₹50,000/kWp |
| BESS CAPEX | ₹18,000/kWh | User-editable within ₹12,000–₹23,000/kWh |
| Meter tariffs | HT Commercial: ₹12.80 off-peak, ₹20.80 peak | Meter selection updates defaults; tariff fields remain editable |

Solar investment = Solar DC kWp × Solar CAPEX per kWp. BESS investment = selected BESS kWh × BESS CAPEX per kWh. Total investment is their sum.

Applicable structures depend on project type: Rooftop / BTM offers CAPEX and OPEX; Open Access offers Group Captive and Captive. Out-of-pocket investment factors are CAPEX 100%, OPEX 0%, Captive 100%, and Group Captive 26% of total investment.

Tariff display rules:

- Open Access wheeling and transmission is ₹1.95/kWh; Rooftop / BTM is ₹0/kWh. The field is read-only and follows project type.
- Banking + standby displays ₹0/kW/month for Open Access. The saved Rooftop / BTM amount is retained and restored when switching back; its default is ₹130/kW/month.
- The separate applicable banking charge result and Tariff snapshot have been removed.
- Commercial structure appears in Investment above the CAPEX inputs. Out-of-pocket investment appears below Total investment.

The Advanced calculation & assumptions section is expanded by default so the editable financial inputs are immediately visible. The current non-financial energy summary uses the selected project type's generation rate, retained energy-split defaults, round-trip efficiency, depth of discharge, and annual BESS cycles. The energy-split controls are hidden; the calculations continue using their existing values. The visible energy summary reports annual solar generation, daytime load offset, and night-time load offset. Daytime load offset matches the selected project type's cash-flow C4; night-time load offset matches the cash-flow sheets' D4 peak-TOD replacement units. Round-trip efficiency, depth of discharge, and annual BESS cycles remain editable under BESS operation. The peak-shifting, solar-charging, and grid-charging toggles, the RTE helper text, and the usable BESS energy/annual throughput summary are hidden from the UI; their existing calculation and export behavior is unchanged. The financial-model assumptions in Advanced calculation also feed the workbook-based 20-year comparison described below.

## Excel-Based Financial Comparison

Source workbook: [`BESS+Solar_Cashflow_Rooftop.xlsx`](/Users/apple/Downloads/BESS+Solar_Cashflow_Rooftop.xlsx). The comparison always shows CAPEX, OPEX, Captive OA, and Group Captive side by side, regardless of which single structure is selected in the project-input card.

### User-controlled financial inputs

- Solar DC capacity comes from the user's Solar DC capacity input. Solar AC capacity is still derived using the existing DC ratio.
- BESS capacity comes from the user's selected hour preset or custom kWh input. The workbook's 800 kWh is only an example configuration.
- Solar and BESS investment rates come from the editable Solar CAPEX and BESS CAPEX inputs.
- Annual BESS cycles defaults to 365; solar degradation 0.6%; BESS degradation 1%; OA transmission and wheeling losses 11%; round-trip efficiency 87.9844%; depth of discharge 90%; and tariff escalation 1%. These are editable and persisted with the commercial inputs.
- Total project CAPEX = Solar DC kWp × Solar CAPEX rate + BESS kWh × BESS CAPEX rate.

### Workbook assumptions

| Assumption | Value used |
|---|---:|
| Rooftop / BTM first-year solar generation | 1,400 kWh per DC kWp (14 lakh units/MWp); editable |
| Open Access first-year solar generation before loss | 1,600 kWh per DC kWp (16 lakh units/MWp); editable |
| Open Access transmission and wheeling losses | 11% default; editable |
| Open Access wheeling and transmission charge | ₹1.95/kWh |
| Off-peak / peak grid tariffs | ₹8.80 / ₹12.80 per kWh |
| Rooftop / BTM banking + standby | ₹130/kW/month |
| Round-trip efficiency | 87.9844% default; editable |
| Derived charge / discharge efficiency | `sqrt(RTE)` each; 93.8% each at the default RTE |
| Depth of discharge | 90% default; editable |
| Annual BESS cycles | 365 default; editable |
| Solar degradation | 0.6% per year default; editable |
| BESS degradation | 1% per year default; editable |
| Tariff escalation | 1% per year default; editable and independent of BESS degradation |
| Solar / BESS O&M in owner-paid years | ₹500/kWp/year and ₹200/kWh/year |
| O&M escalation / insurance | 3% per year / 0.5% of total CAPEX per year |
| OPEX / Group Captive PPA | ₹7 / ₹5 per kWh for 15 years |
| Project life | 20 years |

The financial calculation uses these workbook tariffs and the editable project-specific generation rates, rather than the separate meter tariff fields. CAPEX and OPEX use the Rooftop / BTM rate; Captive OA uses the Open Access rate. Group Captive uses loss-adjusted Open Access generation in year 1 and Rooftop / BTM generation in years 2–20, preserving the workbook reference. OA-specific generation and charges apply the user-selected transmission and wheeling loss percentage. Both rates are included in the Excel export.

### Annual cash flow rules

- Daytime load offset = cash-flow C4: annual solar generation after applicable Open Access loss, minus BESS kWh × DoD ÷ `sqrt(RTE)` charging efficiency × annual BESS cycles. Rooftop/BTM uses CAPEX C4; Open Access uses OA Captive C4. The workbook keeps these off-peak units constant through the projection.
- Annual night-time load offset / peak savings units = BESS kWh × selected DoD × `sqrt(RTE)` discharge efficiency × selected annual BESS cycles, matching the cash-flow sheets' D4 peak-TOD units; this output decreases by the selected BESS degradation rate in each projection year.
- Gross savings = off-peak savings units × off-peak tariff + peak savings units × peak tariff. Tariffs escalate by the selected tariff escalation rate, independently of BESS degradation.
- CAPEX and OPEX subtract annual banking charges (Solar AC kW × ₹130 × 12). OA models instead subtract wheeling / transmission charges on their generation after loss.
- OPEX subtracts the ₹7/kWh PPA payment for 15 years. Group Captive subtracts the ₹5/kWh PPA payment for 15 years. Those PPA structures have zero owner-paid O&M and insurance during the PPA term; these costs begin in year 16.
- Owner-paid O&M begins in year 1 for CAPEX and Captive OA and follows the workbook's 3% escalation. Insurance is 0.5% of total CAPEX each owner-paid year.
- Year 0 cash flow is negative out-of-pocket investment: CAPEX 100%, OPEX 0%, Captive OA 100%, Group Captive 26%.
- The Group Captive workbook links year 1 generation to loss-adjusted OA generation and years 2–20 to the CAPEX generation rows. This workbook reference is retained.

### Dashboard metric labels and definitions

- **IRR · Return on Investment** is the annual internal rate of return solved from year 0–20 net cash flows and shown as a percentage.
- **ROI · Payback (months)** is the first cumulative cash-flow break-even point, interpolated within the crossing year. OPEX is explicitly shown as 0 months, per the project rule.
- **20-year cumulative savings** is the sum of annual cash flows including year 0, so it includes the initial investment/out-of-pocket amount.
- OPEX IRR is displayed as **∞**, per the project rule for a zero initial investment.

The workbook's saved comparison values for its sample (1,000 kWp DC, 800 kWh BESS, ₹33,000/kWp solar CAPEX, ₹18,000/kWh BESS CAPEX) are a reference check: CAPEX ₹185,197,528 cumulative / 51.7229 months / 23.2314% IRR; OPEX ₹107,444,139 cumulative; Captive OA ₹162,326,385 / 58.4169 months / 20.5485%; Group Captive ₹108,597,352 / 42.9763 months / 30.7536%. The live calculator varies with user-selected capacities and CAPEX. OPEX's displayed payback and IRR follow the project rule (0 and ∞), rather than the workbook's blank comparison cells.

## MERC Draft Mode

MERC mode retains its existing calculations and inputs:

- Solar generation = Solar MW × 1,000 kW/MW × specific yield.
- BESS power is 50% or 25% of solar capacity depending on the selected sizing option; BESS energy is power × 2 or 4 hours, respectively.
- Energy savings use self-consumed solar and eligible BESS-delivered energy at the grid tariff and evening premium. BESS capacity limits annual charge energy by cycles per year; delivered energy applies round-trip efficiency.
- Annual solar O&M and BESS O&M are calculated from their respective CAPEX percentages. Payback divides investment by positive annual net savings.
- Compliance storage requirement uses the selected application window's storage floor. Transformer headroom uses the rooftop cumulative limit percentage.

MERC mode remains independently saved from commercial mode. Its equations and interface are not part of the Excel-backed financial comparison.
