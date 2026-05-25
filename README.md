# Blood test trends viewer

Static, no-dependency HTML viewer for normalized blood-test CSV exports.

Personal data is intentionally not tracked. Keep local CSV/PDF/OCR files under ignored paths such as `data/`, `extracted/`, `ocr/`, and `ocr_pages/`.

## Add data manually

1. Create local ignored data file:

   ```sh
   mkdir -p data
   $EDITOR data/blood-tests.csv
   ```

2. Use this header exactly:

   ```csv
   date,source_date,source_file,source_type,lab,analyte,original_name,value,unit,ref_low,ref_high,ref_text,flag,notes
   ```

3. Add one row per measurement, for example:

   ```csv
   2026-05-07,2026-05-07,private-report.pdf,direct,Lab name,LDL,LDL cholesterol,153,mg/dl,,,risk-adapted,high,
   ```

4. To view it, paste the private CSV rows into the `<script id="csv" type="text/plain">` block in `index.html` locally. Do not commit that local change.

## Add data from reports / OCR

Text PDFs:

```sh
mkdir -p extracted
pdftotext -layout /path/to/report.pdf extracted/report.txt
```

Scanned PDFs/images:

1. Render/export each page to an image into `ocr_pages/`.
2. Run Apple Vision OCR:

   ```sh
   mkdir -p ocr
   swift tools/apple_vision_ocr.swift ocr_pages/page-1.png > ocr/report.vision.txt
   ```

3. Manually review OCR output against the original report.
4. Normalize measurements into `data/blood-tests.csv` using the schema above.

## Safety check before committing

```sh
git status --ignored
```

Only non-private source files should be staged. `data/`, `extracted/`, `ocr/`, `ocr_pages/`, PDFs, images, and CSV/TSV files are ignored by default.
