# 🩸 blood.csv

Static, no-dependency viewer for normalized blood lab exports.

Personal data is intentionally not tracked. The public page reads local files in your browser only: no upload, no backend, no localStorage/IndexedDB persistence.

## Use it

1. Open `index.html` or the hosted static page.
2. Click **Import CSV** and choose your private CSV, or **Load demo data**.
3. Use **Results** to scan latest values. Markers appear under lab category headings in a fixed review order. Search by marker, unit, or group name. All groups start visible; there are no selection controls.
4. Click a marker's **View N results** action for its complete dated table, followed by a small chart when at least two numeric results are available. The marker name and action share one large tap area. Each history row shows the date, value, and lab, newest first, with no further disclosure level. Tap the chart, or focus it and use Left / Right arrow keys. **Close details** returns to that marker.
5. Use **CSV table** for every source record, with search across visible columns and independent row order. Source filenames and original marker names are omitted from this view. Scroll sideways on a phone; marker names stay visible.

Close or refresh the tab to clear the loaded data. The viewer does not save data between sessions.

Recognised markers have a short **About this marker** explanation below the trend, or below the history table when no chart is available. Descriptions explain the measurement without interpreting the imported result. They are bundled with the viewer and link to MedlinePlus or NHS information in a new tab. Unrecognised names keep their full history without a guessed explanation.

The application uses index.html, viewer.js, viewer.css, and tokens.css. There is no build step or external runtime dependency. Keep these files together when copying the viewer.

Use `examples/blood.csv` as both a starter template and synthetic sample. Keep the header, replace/delete sample rows, then import your private copy.

Groups are navigation categories, not diagnoses or a claim that a complete panel was measured. Common categories include [blood count](https://medlineplus.gov/lab-tests/complete-blood-count-cbc/), [lipids](https://medlineplus.gov/lab-tests/cholesterol-levels/), and components of [metabolic panels](https://medlineplus.gov/lab-tests/comprehensive-metabolic-panel-cmp/). Known names match without case sensitivity; unrecognised names remain visible under **Other markers**. Grouping never merges marker names, converts units, or changes source records.

The review order is Lipids → Liver-associated enzymes → Other enzymes → Kidney function → Glucose → Blood count → Electrolytes → Iron stores → Thyroid → Uric acid. Only groups present in the file appear. Body measurements and unrecognised markers follow these groups when present.

Within the first three groups, the order is LDL → Non-HDL → Triglycerides → HDL → Total cholesterol; ALT → AST → Gamma-GT; and CK → LDH. Other markers use alphabetical order within their group. These are fixed display priorities, not calculated clinical rankings.

## CSV schema

The demo and example CSV use these eight columns, in this order:

```csv
date,source_date,source_file,lab,analyte,original_name,value,unit
```

- `date`: measurement date in YYYY-MM-DD format; used for history and chart positions.
- `source_date`: date recorded for the source report; retained separately from the measurement date.
- `source_file`: source report filename; not displayed in the viewer.
- `lab`: laboratory name.
- `analyte`: marker name used to organise its history.
- `original_name`: marker name as written in the source report; not displayed in the viewer.
- `value`: original measurement text, including precision or inequalities.
- `unit`: measurement unit; different units stay in separate histories.

Synthetic example row:

```csv
2025-01-15,2025-01-15,example-report-2025-01-15.pdf,Example Clinic,LDL,LDL,120,mg/dl
```

Results requires `date`, `analyte`, `value`, and `unit` columns. The other four fields provide report context and can be blank. Both demo sources contain the same synthetic records and schema.

CSV table omits `source_file` and `original_name`. All other columns retain their cell text, blanks, duplicate records, and file row order. Common columns have readable headings and appear first; unfamiliar columns are also included. Quoted commas, escaped quotes, and multiline cells are supported. Invalid CSV structure reports its line number and leaves the previous file open.

Files without the Results columns can still be opened in CSV table. Rows with an invalid date or missing marker remain in CSV table and are counted in a visible notice. Header-only files are supported.

Results keeps each marker and unit separate. Text, empty, and qualified values such as “<5” remain in the history table; only exact finite numbers are plotted. Same-date results are retained without an arbitrary latest-value choice or ambiguous change calculation. Missing units suppress charts and changes. The viewer displays measurements and numerical changes without reference ranges, status flags, or clinical interpretation.

## Add data manually

Keep your private file outside git or under ignored `data/`:

```sh
mkdir -p data
cp examples/blood.csv data/blood.csv
$EDITOR data/blood.csv
```

Then import `data/blood.csv` in the web page.

## Add data from reports / OCR

Text PDFs:

```sh
mkdir -p extracted
pdftotext -layout /path/to/report.pdf extracted/report.txt
```

Scanned PDFs/images:

1. Render/export each page to an image into ignored `ocr_pages/`.

   ```sh
   mkdir -p ocr_pages
   pdftoppm -png -r 200 /path/to/scanned-report.pdf ocr_pages/report
   ```

2. Run Apple Vision OCR:

   ```sh
   mkdir -p ocr
   swift tools/apple_vision_ocr.swift ocr_pages/page-1.png > ocr/report.vision.txt
   ```

3. Manually review OCR output against the original report.
4. Normalize measurements into your private CSV using the schema above.
5. Import the CSV in the web page.

The `extracted/`, `ocr/`, and `ocr_pages/` folders are temporary audit/work folders. Keep them only while checking the CSV; once rows are verified, the private CSV is enough to use the viewer.
