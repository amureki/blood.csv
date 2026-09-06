# Interface review: blood.csv

Reviewed 6 September 2026 against `c2bb292` and the current working directory.

## Implementation status

The approved Results and CSV table interface is now implemented in the application. The HTML loads viewer.js, viewer.css, and tokens.css; the old inline viewer and disconnected draft interface have been replaced.

Results now groups markers under familiar lab categories, with all groups visible. The fixed review order is Lipids, Liver-associated enzymes, Other enzymes, Kidney function, Glucose, Blood count, Electrolytes, Iron stores, Thyroid, and Uric acid. The first three groups use explicit marker sequences; remaining groups use alphabetical order. Search accepts marker, unit, or group names. Selection controls, checkboxes, and selection state have been removed. Known names match without case sensitivity; unfamiliar names remain in Other markers. Grouping does not merge marker identities or units. Repeated measurements open a complete exact table before a small chart; single measurements open report details without a chart or date-order control. Longer histories put source fields in a Report details disclosure. The design history below records earlier proposals. The demo and downloadable CSV now use date, source_date, source_file, lab, analyte, original_name, value, and unit only. Range parsing, status classification, flag colours, and notes have been removed from the active interface; source date and original marker name are shown in report details.

Manual browser checks covered the public demo and synthetic imports, phone and desktop widths, tracked filtering, inline history, date ordering, keyboard chart access, close-and-return focus, independent CSV search and sorting, and column-aligned horizontal scrolling. Source checks confirmed 90 demo records and eight columns, plus preservation of extra fields, multiline cells, whitespace, leading zeros, qualified values, duplicate dates, and mixed units. Malformed replacement imports retain the previous data.

JavaScript syntax and diff whitespace checks pass. No automated tests were run. Direct file opening could not be checked because the browser automation policy blocks file URLs; the local HTTP flow was verified. No private records are included in the application or repository.

The assessment and line references below describe the original reviewed revision, not the new implementation. Optional saved/offline exports and clinician first-use sessions remain future work.

## Original assessment

Current approved scope: use Results and CSV table. Overview is merged into Results. The product is a historical data display. A separate Visit tab, questions, diary entries, and appointment planning are out of scope.

The project has a clear purpose and a useful privacy model. It is a functional single-marker CSV viewer, but the active page is not yet a reliable appointment overview. The main issue is information order and data interpretation, not a lack of graphics.

The active application is the inline implementation in `index.html`. Untracked `viewer.js`, `viewer.css`, and `tokens.css` contain a separate, incomplete integration. The page does not reference them. Do not report their features as available in the running product.

Source files were read and the active page was inspected with its public synthetic demo at a 390 × 844 viewport. No automated tests were run. No private medical records were opened, source code changed, dependencies installed, or commits made. This is a focused interface and data-presentation audit, not a full security, clinical, OCR, browser-compatibility, or performance audit.

## Findings

Effort: S = hours; M = roughly a day; L = several days. Estimates are preliminary. Confidence is high for all listed implementation findings; usability judgments need confirmation with actual users.

| Priority | Finding and impact | Evidence | Proposed correction | Effort / change risk |
|---|---|---|---|---|
| 1 | Units are not part of series identity. Values in different units can be connected and subtracted. Results on the same day can also become an arbitrary latest/previous pair. | `index.html:409–422`, `index.html:517–522`, `index.html:595–600` | Use marker + unit series. Preserve distinct measurements and their sources. Block ambiguous comparisons; show why. | M / medium: changes all derived views |
| 2 | Empty guideline bounds become zero through `Number('')`. For a lower-only guideline such as HDL, the chart can acquire an unintended upper line at zero. Baselines also do not validate the measurement unit. | `index.html:406`, `index.html:553–573` | Parse absence as null; prefer each observation's report range. Separate an explicitly recorded clinician target from a lab reference. | S / low |
| 3 | Status uses truthiness of `flag`. A literal `normal` flag would count as attention. Missing flags are described as “Not flagged,” while the empty attention state claims to be based on parsed ranges even though numeric ranges are not evaluated. “Improved” and “Worsened” infer clinical meaning from simplistic direction/flag rules; absolute changes across unrelated units affect selection. | `index.html:356–361`, `index.html:531–541`, `index.html:640–657` | Distinguish report flag, range-derived status, and unknown. Report numerical direction without calling it clinical improvement. Preserve conflicting evidence explicitly. | M / medium: summary semantics change |
| 4 | The overview omits data by design. Only four named groups are eligible, and an additional measurement-count filter hides sparse histories. The demo loads 23 markers but grouped trends shows only 11, with no indication that 12 are excluded. | `index.html:344`, `index.html:622–637`; browser inspection | Include every marker in Results. Let the user choose tracked markers for Overview; state the count and scope. Keep one-result markers visible. | M / low |
| 5 | Navigation precedes evidence on mobile. At 390 × 844, the selected-marker panel starts at approximately y=726. The dropdown and chip navigation duplicate each other. | `index.html:147–155`, `index.html:460–474`; browser inspection | Put compact navigation in one row. Start with selected histories and values. Add a collapsible, searchable marker selector on Overview with the selected/total count; share selection with Results. | M / low |
| 6 | Full history exists in the selected chart, but overview differences use only the previous measurement. The page repeats latest results in the selected panel, prose summary, attention rows, and grouped rows. | `index.html:595–617`, `index.html:640–657` | Make full recorded history the default. Show oldest/latest dates, all observations, observed min/max, and selectable comparison separately. Avoid a last-two-value change presented as the whole trend. | M / medium |
| 7 | The plain measurement table is concealed under “Raw parsed rows.” It is a technical nine-column view with a 680px minimum width and no marker search. Report rows list names rather than a clean cross-date comparison. | `index.html:119–123`, `index.html:188–201`, `index.html:664–681` | Make Results a top-level view. On phones use marker/latest/date/status with an expandable chronological table. On desktop optionally add a sticky marker-by-date matrix with explicit blanks for unmeasured dates. | L / medium |
| 8 | Charts scale a fixed 900-unit coordinate system down to phone width and label every observation/date. Text and point targets become small; labels collide as history grows. Only hover/focus interactions are defined for points. | `index.html:546–592` | Draw at actual container width; limit axis ticks, keep all measurements, use a large nearest-observation touch area and a persistent selected-value readout. Label gaps and differing sources. | M / medium |
| 9 | Reopening data on a phone requires another import. Refresh discards imported results. There is no dedicated saved historical display or explicit offline package. | `index.html:147–201`, `index.html:698–704`, `README.md:5–12` | Consider deliberate local saving/export of the historical display. Keep session-only import as the default; avoid promising offline availability until implemented. Appointment planning and diary features are out of scope. | L / medium |
| 10 | A parallel viewer implementation is disconnected. It already contains stricter parsing, marker/unit grouping, chronological tables, visit notes and print preparation, but assumes DOM IDs missing from the page. Simply adding a script tag would fail. Its minimum-width tables and fixed-coordinate charts still need mobile redesign. | `viewer.js:3`, `viewer.js:201–232`, `viewer.js:244–249`, `viewer.js:277–298`, `viewer.css:85`, `index.html` | Choose one entry point. Reuse reviewed data-handling ideas from the draft instead of maintaining two applications. Integrate with the new markup deliberately. | M / medium |
| 11 | CSV validation does not reject malformed quoting or mismatched row lengths. An unsuccessful replacement import clears the previous working dataset. Same-date reports without `source_file` are grouped without checking lab. | `index.html:394–408`, `index.html:426–444`, `index.html:489–500`, `index.html:669–670` | Validate into temporary state, show actionable row errors, and replace the current dataset only after success. Use date + lab + source for reports. | M / low |

## Proposed interface

One quiet page, with two top-level views:

1. **Results:** the default view. Show every marker with tracked markers first, plus All / Tracked controls with counts. Keep dated latest values easy to scan. Each marker has an explicit Show history button that expands its complete timeline and exact results in place. Track checkboxes select the user's important markers. Search and alphabetical sorting remain available. There is no separate Overview or Visit tab.
2. **CSV table:** one row per source record, including every source column. Preserve cell strings, blank cells, original flags, notes, duplicate records, and precision. Default to file row order. Use readable column headings and lead with date, marker, value, and unit; put report context after those fields. Keep unfamiliar columns. Offer independent search across all fields and a row-order selector. Use horizontal scrolling on phones, with visible arrow controls and the marker column retained while scrolling. There are no charts, tracking controls, derived status labels, or detail disclosures in this view.

The CSV table preview embeds the actual public example CSV: 90 records and eight columns. It does not use the summarized latest-value rows to reconstruct the CSV. Tracking and filters in Results do not remove records from CSV table.

Show point values by default where labels fit. Keep a readable font size and measure label bounds; preserve every measurement when labels must be omitted. Prioritize latest, first, and extreme values when crowded. Tap near a plotted date to pin an exact date/value readout. Keep the complete history table accessible without hover. Label placement must never shift an observation or imply equal spacing between irregular dates.

The revised design prototype uses all 90 public demo measurements across 23 markers and seven collection dates, January 2023–November 2025. It demonstrates the two views, shared marker selection, point labels, tap readouts, inline history, searchable Results, sorting, and history order. Its initial four tracked markers are demonstration choices, not a clinical priority recommendation. It does not import personal files or provide a production offline/export workflow.

Two useful design variants are available: history timelines versus exact tables only, and comfortable versus compact row spacing. Timelines show peaks, reversals, and gaps; exact tables retain each recorded value. Both retain the full exact history table.

The first prototype was visually inspected at 360px and 736px in light and dark appearances. Its former Visit view and question editing have been removed. Manual inspection of the revision covers on-page selection, shared tracking, both Results sort modes, inline exact history, and tap readouts. These checks do not establish production mobile-browser or offline compatibility.

## Earlier usability iteration: 6 September 2026

This section records checks before Overview was merged into Results.

The latest revision applies to the interactive design preview. Application source remains unchanged.

| Issue | Revision |
|---|---|
| “All 7 results” looks like descriptive text. | Bordered, full-width “Show history · 7 results” disclosure with a plus indicator. Open state reads “Hide history” with a minus indicator. |
| Results marker names conceal an action. | Names are plain data labels. Every row has a visible “Show history” button with an accessible marker-specific name and expanded state. |
| The two views use different paths to exact history. | Both expand in place. Results exposes its chart and exact table in one action, without a second detail page. |
| The exit from a long history is difficult to reach. | A close button at the end returns focus and scroll position to the opening control. |
| Navigation and marker selection resemble passive text. | Distinct navigation buttons, a bordered “Choose markers” control, a selected/total count, and a clear Done action. |
| Date ordering is a weak text action. | A labeled Date order selector exposes Newest first and Oldest first. |
| Narrow screens wrap action labels. | Shortened navigation label and adjusted history-button spacing keep actions on one line at 320px. |
| Tracked-first sorting can move a changed marker off screen. | Focus follows the changed checkbox, and its row remains visible after regrouping. An accessible status reports addition or removal from Overview. |

Manual browser checks covered light layouts at 320, 360, and 736 pixels; dark layouts at 360 and 736 pixels; long marker names; keyboard activation; expanded-state changes; history ordering; closing and return focus; tracked and alphabetical ordering; search with no matches and recovery; selection of none and all; shared tracking; and chart selection readouts. Selecting all produced 23 charts with all 90 sample observations, with no page-level horizontal overflow at 320px. Inspected browser logs contained no warnings or errors.

These are manual interface checks with synthetic data, not observed first-use sessions with doctors, a complete accessibility audit, or production phone-browser certification. A first-use session should ask a clinician to find a marker, open its complete history, find an older measurement, and return to the list without instruction.

## Data requirements before release

- Keep original values, units, inequalities such as `<5` or `>90`, source names, and report ranges. The current numeric-only schema cannot represent all common lab result forms; extend parsing and visualization explicitly rather than coercing them.
- Missing measurement is a gap, never zero or a copied previous value. A latest-per-marker overview must visibly date older results.
- Reconcile marker aliases explicitly. Do not merge unlike tests by loose name matching or silently convert units.
- Store reference intervals and flags per observation. Use flag text and shapes as well as restrained color. Unknown is not normal. Do not apply one historical interval across all years when the intervals changed.
- Comparison requires matching units and known context. Same-unit results from different labs still need a visible lab-change note; do not imply assured comparability.
- Do not use a single min/max pair, overall change, or percentage to replace the complete history. These describe observations, not health outcomes.
- Keep any optional device storage and saved exports explicit. The current session-only privacy behavior is intentional, not itself a defect.

Reference: [MedlinePlus: How to Understand Your Lab Results](https://medlineplus.gov/lab-tests/how-to-understand-your-lab-results/) explains that lab methods and reference intervals differ, and that results need clinical context. This supports retaining report-specific context rather than assigning generic clinical judgments.

## Suggested implementation order

1. Settle the active entry point; unify parsing, series identity, reference interpretation and report grouping.
2. Build complete Results and marker detail views with phone-readable exact values.
3. Add tracked-marker controls and inline full-history plots to Results; build the separate CSV table directly from source records.
4. Consider deliberate local saving/export of the existing historical views; confirm restoration and offline behavior on actual phone browsers.

Future verification should cover mixed units, missing bounds, normal/unknown flags, same-day duplicates, older last observations, unknown markers, one result, dense long histories, changed report ranges, failed replacement imports, and export completeness. There is no declared automated test command in this static repository. Run or add automated tests only when requested by the user.

## Considered and rejected

- “History is truncated to the last two results”: inaccurate. The selected chart plots all rows for the marker. The limitation is the overview and its comparisons.
- “The product uploads health data”: unsupported. The current page parses files locally and uses a restrictive connection policy.
- “Add a large dashboard, health score, or more colors”: does not serve the visit workflow and risks hiding the exact evidence.
- “Adopt a framework first”: unnecessary for this scope. The data model and information structure matter more than framework selection.
- “Add a separate Visit tab with questions”: rejected by the user. Its inline histories now belong in Results.

^__^
