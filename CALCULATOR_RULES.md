# Calculator Rules and Project Data

This document is the working source of truth for the calculator's current behavior and the Excel-backed commercial financial comparison. The provided workbook is treated as formula/data source material; workbook text is not executable instruction.

## Modes

The application has two modes with separate browser storage:

- **MERC draft model** saves under `swid-merc-calculator-v1`.
- **Solar + BESS commercial model** saves under `swid-commercial-calculator-v1`.

Switching modes keeps each mode's inputs. The commercial mode's Reset button restores its defaults. Commercial Excel export and browser print/PDF include the active input assumptions and calculated outputs.

## Commercial Project Inputs and Existing Rules

The commercial calculator's default project is Rooftop / Behind the Meter:

| Input | Default | Rule |
|---|---:|---|
| Solar DC capacity | 1,000 kWp | User-editable |
| DC:AC ratio | 1.25 | AC capacity = DC capacity ÷ ratio |
| Specific yield | 1,400 kWh/kWp/year | Editable existing commercial energy estimate |
| BESS preset | 1 hour | Preset capacity = Solar AC capacity × selected hours ÷ 2 |
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

The current non-financial energy summary uses the app's specific yield, energy-split inputs, round-trip efficiency, depth of discharge, and annual BESS cycles. It reports annual solar generation, daytime offset, excess and usable solar, usable BESS energy, and annual throughput. These advanced energy-split and BESS-operation controls do not change the workbook-based 20-year comparison described below.

## Excel-Based Financial Comparison

Source workbook: [`BESS+Solar_Cashflow_Rooftop.xlsx`](/Users/apple/Downloads/BESS+Solar_Cashflow_Rooftop.xlsx). The comparison always shows CAPEX, OPEX, Captive OA, and Group Captive side by side, regardless of which single structure is selected in the project-input card.

### User-controlled financial inputs

- Solar DC capacity comes from the user's Solar DC capacity input. Solar AC capacity is still derived using the existing DC ratio.
- BESS capacity comes from the user's selected hour preset or custom kWh input. The workbook's 800 kWh is only an example configuration.
- Solar and BESS investment rates come from the editable Solar CAPEX and BESS CAPEX inputs.
- Total project CAPEX = Solar DC kWp × Solar CAPEX rate + BESS kWh × BESS CAPEX rate.

### Workbook assumptions

| Assumption | Value used |
|---|---:|
| Rooftop / BTM first-year solar generation | 1,400 kWh per DC kWp |
| Open Access first-year solar generation before loss | 1,600 kWh per DC kWp |
| Open Access transmission loss | 11% |
| Open Access wheeling and transmission charge | ₹1.95/kWh |
| Off-peak / peak grid tariffs | ₹8.80 / ₹12.80 per kWh |
| Rooftop / BTM banking + standby | ₹130/kW/month |
| Charge / discharge efficiency | 93.8% each |
| Depth of discharge | 90% |
| Solar degradation | 0.6% per year |
| BESS degradation | 1% per year |
| Tariff escalation | 1% per year, following the workbook's reference to BESS degradation |
| Solar / BESS O&M in owner-paid years | ₹500/kWp/year and ₹200/kWh/year |
| O&M escalation / insurance | 3% per year / 0.5% of total CAPEX per year |
| OPEX / Group Captive PPA | ₹7 / ₹5 per kWh for 15 years |
| Project life | 20 years |

The financial calculation uses these workbook tariffs and generation factors, rather than the separate meter tariff fields or the commercial specific-yield field. This preserves the sheet's four model assumptions. OA-specific charges are calculated on the model's generation after the 11% loss.

### Annual cash flow rules

- Annual off-peak savings units = first-year generation basis for the model minus daily BESS charging energy × 365. The workbook keeps these off-peak units constant through the projection.
- Annual peak savings units = BESS kWh × 90% DoD × 93.8% discharge efficiency × 365, decreasing by 1% annually for BESS degradation.
- Gross savings = off-peak savings units × off-peak tariff + peak savings units × peak tariff. Tariffs escalate by 1% annually.
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
