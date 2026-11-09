# 🩸 blood.csv

A local CSV viewer for blood test histories. No dependencies or build step.

Open `index.html` in a browser, then choose **Import CSV** or **Load demo data**.
Review trends and past results, or use **CSV table** to browse the records.

Use [examples/blood.csv](examples/blood.csv) as a template. Results needs `date`
(`YYYY-MM-DD`), `analyte`, `value`, and `unit` columns. The example data is synthetic.

Files stay in browser memory and clear when you refresh or close the page.
Keep private reports and CSVs outside the repository or in ignored `data/`.

Open one marker to see its full trend and exact measurements. Use **CSV table**
to inspect the original CSV fields.

Markers open in a separate detail view on phones and desktop. **Back to markers**
or browser Back returns to the same list position and search.

General reference guidance is separate from the chart and uses a male 30–40
profile where stated. It is not a report-specific interval or personal target.
Chart lines break when the recorded laboratory changes.

