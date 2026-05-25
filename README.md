# 🩸 blood.csv

Static, no-dependency viewer for normalized blood lab exports.

Personal data is intentionally not tracked. The public page reads local files in your browser only: no upload, no backend, no localStorage/IndexedDB persistence.

## Use it

1. Open `index.html` or the hosted static page.
2. Click **Import data** and choose your private CSV.
3. Review charts/tables. Close or refresh the tab to clear the loaded data from the page.

Use `examples/blood.csv` as both a starter template and anonymized sample. Keep the header, replace/delete sample rows, then import your private copy.

## CSV schema

Required columns:

- `date`
- `analyte`
- `value`
- `unit`

Recommended full header:

```csv
date,source_date,source_file,source_type,lab,analyte,original_name,value,unit,ref_low,ref_high,ref_text,flag,notes
```

Example row:

```csv
2025-01-15,2025-01-15,private-report.pdf,direct,Lab name,LDL,LDL cholesterol,153,mg/dl,,,risk-adapted,high,
```

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

