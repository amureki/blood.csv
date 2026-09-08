'use strict';

(() => {
  const ui = Object.fromEntries([...document.querySelectorAll('[id]')].map(element => [element.id, element]));
  const groups = {
    Lipids: ['LDL', 'LDL cholesterol', 'Non-HDL', 'Non-HDL cholesterol', 'Triglycerides', 'HDL', 'HDL cholesterol', 'Total cholesterol', 'Cholesterol'],
    'Liver-associated enzymes': ['ALT', 'AST', 'Gamma-GT', 'GGT', 'ALP', 'Alkaline phosphatase'],
    'Other enzymes': ['Creatine kinase (CK)', 'Creatine kinase', 'CK', 'LDH', 'Lactate dehydrogenase'],
    'Kidney function': ['Creatinine', 'eGFR', 'Urea', 'Blood urea nitrogen', 'BUN'],
    Glucose: ['Glucose', 'Fasting glucose', 'HbA1c', 'Hemoglobin A1c', 'Haemoglobin A1c'],
    'Blood count': ['White blood cells (WBC)', 'WBC', 'Red blood cells (RBC)', 'RBC', 'Hemoglobin', 'Haemoglobin', 'Hematocrit', 'Haematocrit', 'MCV', 'MCH', 'MCHC', 'RDW', 'RDW-CV', 'RDW-SD', 'Platelets', 'MPV', 'Neutrophils', 'Lymphocytes', 'Monocytes', 'Eosinophils', 'Basophils'],
    Electrolytes: ['Sodium', 'Potassium', 'Chloride', 'Bicarbonate', 'Calcium', 'Magnesium', 'Phosphate'],
    'Iron stores': ['Ferritin', 'Iron', 'Serum iron', 'Transferrin', 'Transferrin saturation', 'TIBC'],
    Thyroid: ['TSH', 'Free T4', 'FT4', 'Free T3', 'FT3', 'T4', 'T3'],
    'Uric acid': ['Uric acid', 'Urate'],
    'Body measurements': ['Weight', 'Height', 'BMI'],
    'Other markers': []
  };
  const groupFor = new Map(Object.entries(groups).flatMap(([group, names]) => names.map(name => [name.toLowerCase(), group])));
  const groupOrder = new Map(Object.keys(groups).map((group, index) => [group, index]));
  const markerOrder = new Map(['Lipids', 'Liver-associated enzymes', 'Other enzymes'].flatMap(group => groups[group].map((name, index) => [name.toLowerCase(), index])));
  const markerExplanations = new Map([
    [['LDL', 'LDL cholesterol'], 'Cholesterol carried by LDL particles, which deliver cholesterol to body tissues.', 'https://medlineplus.gov/medlineplus-videos/cholesterol-good-and-bad/'],
    [['Non-HDL', 'Non-HDL cholesterol'], 'All cholesterol outside HDL particles. It includes LDL and other cholesterol-carrying particles, such as VLDL.', 'https://medlineplus.gov/cholesterollevelswhatyouneedtoknow.html'],
    [['Triglycerides'], 'Fats that your body uses to store energy. This test measures the amount circulating in your blood.', 'https://medlineplus.gov/triglycerides.html'],
    [['HDL', 'HDL cholesterol'], 'Cholesterol carried by HDL particles, which help return cholesterol from body tissues to the liver.', 'https://medlineplus.gov/cholesterol.html'],
    [['Total cholesterol', 'Cholesterol'], 'The combined cholesterol in your blood: HDL plus non-HDL. Non-HDL includes LDL and other cholesterol-carrying particles.', 'https://medlineplus.gov/cholesterollevelswhatyouneedtoknow.html'],
    [['ALT'], 'Alanine aminotransferase: an enzyme found mainly in liver cells. The blood test helps assess liver health.', 'https://medlineplus.gov/lab-tests/alt-blood-test/'],
    [['AST'], 'Aspartate aminotransferase: an enzyme found in the liver, muscles, and other tissues. It is often measured alongside ALT.', 'https://medlineplus.gov/lab-tests/ast-test/'],
    [['Gamma-GT', 'GGT'], 'Gamma-glutamyl transferase: an enzyme found mainly in the liver. The test helps assess the liver and bile ducts.', 'https://medlineplus.gov/lab-tests/gamma-glutamyl-transferase-ggt-test/'],
    [['ALP', 'Alkaline phosphatase'], 'An enzyme found especially in the liver, bile ducts, and bones. It is used when assessing liver or bone health.', 'https://medlineplus.gov/lab-tests/alkaline-phosphatase/'],
    [['Creatine kinase (CK)', 'Creatine kinase', 'CK'], 'An enzyme that helps muscles make energy. The blood test is mainly used to assess muscle injury or disease.', 'https://medlineplus.gov/lab-tests/creatine-kinase/'],
    [['LDH', 'Lactate dehydrogenase'], 'An enzyme involved in energy production in many tissues. It can help assess tissue damage, but does not identify its location.', 'https://medlineplus.gov/lab-tests/lactate-dehydrogenase-ldh-test/'],
    [['Creatinine'], 'A waste product from normal muscle activity that the kidneys remove from blood. It is used to assess kidney filtration.', 'https://medlineplus.gov/lab-tests/glomerular-filtration-rate-gfr-test/'],
    [['eGFR'], 'Estimated glomerular filtration rate: an estimate of how much blood your kidneys filter each minute, usually calculated using creatinine.', 'https://medlineplus.gov/lab-tests/glomerular-filtration-rate-gfr-test/'],
    [['Urea'], 'A waste product made when your body breaks down protein. The kidneys remove it from your blood through urine.', 'https://medlineplus.gov/lab-tests/bun-blood-urea-nitrogen/'],
    [['Blood urea nitrogen', 'BUN'], 'Measures the nitrogen in urea, a waste product from protein breakdown. It helps assess how the kidneys remove waste.', 'https://medlineplus.gov/lab-tests/bun-blood-urea-nitrogen/'],
    [['Glucose', 'Fasting glucose'], 'Blood sugar: a main source of energy for your cells. This measures the level at the time of the blood draw.', 'https://medlineplus.gov/lab-tests/comprehensive-metabolic-panel-cmp/'],
    [['HbA1c', 'Hemoglobin A1c', 'Haemoglobin A1c'], 'Measures the share of hemoglobin with glucose attached. It reflects average blood sugar over roughly two to three months.', 'https://medlineplus.gov/lab-tests/hemoglobin-a1c-hba1c-test/'],
    [['White blood cells (WBC)', 'WBC'], 'The number of white blood cells, which help your immune system fight infections and other diseases.', 'https://medlineplus.gov/lab-tests/complete-blood-count-cbc/'],
    [['Red blood cells (RBC)', 'RBC'], 'The number of red blood cells, which carry oxygen from your lungs to the rest of your body.', 'https://medlineplus.gov/lab-tests/complete-blood-count-cbc/'],
    [['Hemoglobin', 'Haemoglobin'], 'The concentration of hemoglobin, the protein in red blood cells that carries oxygen.', 'https://medlineplus.gov/lab-tests/complete-blood-count-cbc/'],
    [['Hematocrit', 'Haematocrit'], 'The proportion of your blood volume occupied by red blood cells.', 'https://medlineplus.gov/lab-tests/complete-blood-count-cbc/'],
    [['MCV'], 'Mean corpuscular volume: the average size of your red blood cells.', 'https://medlineplus.gov/lab-tests/red-blood-cell-rbc-indices/'],
    [['MCH'], 'Mean corpuscular hemoglobin: the average amount of oxygen-carrying hemoglobin in one red blood cell.', 'https://medlineplus.gov/lab-tests/red-blood-cell-rbc-indices/'],
    [['MCHC'], 'Mean corpuscular hemoglobin concentration: how concentrated hemoglobin is within your red blood cells.', 'https://medlineplus.gov/lab-tests/red-blood-cell-rbc-indices/'],
    [['RDW', 'RDW-CV', 'RDW-SD'], 'Red cell distribution width: how much your red blood cells vary in size.', 'https://medlineplus.gov/lab-tests/red-blood-cell-rbc-indices/'],
    [['Platelets'], 'The number of platelets, the small blood components that help form clots and stop bleeding.', 'https://medlineplus.gov/lab-tests/complete-blood-count-cbc/'],
    [['MPV'], 'Mean platelet volume: the average size of your platelets, which help your blood clot.', 'https://medlineplus.gov/lab-tests/mpv-blood-test/'],
    [['Neutrophils'], 'White blood cells that act as an early defence against invading germs.', 'https://medlineplus.gov/lab-tests/blood-differential/'],
    [['Lymphocytes'], 'White blood cells involved in immune defence, including cells that make antibodies and cells that target infected cells.', 'https://medlineplus.gov/lab-tests/blood-differential/'],
    [['Monocytes'], 'White blood cells that help fight germs and clear away dead cells.', 'https://medlineplus.gov/lab-tests/blood-differential/'],
    [['Eosinophils'], 'White blood cells involved in defence against parasites, allergic responses, and inflammation.', 'https://medlineplus.gov/lab-tests/blood-differential/'],
    [['Basophils'], 'White blood cells involved in allergic reactions and inflammation.', 'https://medlineplus.gov/lab-tests/blood-differential/'],
    [['Sodium'], 'An electrolyte that helps regulate body fluid levels and supports nerve and muscle function.', 'https://medlineplus.gov/lab-tests/electrolyte-panel/'],
    [['Potassium'], 'An electrolyte needed for muscles and cells to work, including the cells that control your heartbeat.', 'https://medlineplus.gov/lab-tests/electrolyte-panel/'],
    [['Chloride'], 'An electrolyte that helps maintain fluid balance and blood volume.', 'https://medlineplus.gov/lab-tests/electrolyte-panel/'],
    [['Bicarbonate'], 'Helps maintain the balance of acids and bases in your blood and transport carbon dioxide.', 'https://medlineplus.gov/lab-tests/electrolyte-panel/'],
    [['Calcium'], 'A mineral needed for bones and teeth, as well as nerve, muscle, and heart function. This test measures calcium in blood.', 'https://medlineplus.gov/lab-tests/comprehensive-metabolic-panel-cmp/'],
    [['Magnesium'], 'A mineral that supports muscles, nerves, and the heart. This test measures the small amount present in blood.', 'https://medlineplus.gov/lab-tests/magnesium-blood-test/'],
    [['Phosphate'], 'A substance containing phosphorus that helps build bones and teeth and supports energy production in cells.', 'https://medlineplus.gov/lab-tests/phosphate-in-blood/'],
    [['Ferritin'], 'A protein that stores iron. Its level in blood helps estimate the amount of iron stored in your body.', 'https://medlineplus.gov/lab-tests/ferritin-blood-test/'],
    [['Iron', 'Serum iron'], 'The amount of iron circulating in your blood. Your body uses iron to make the oxygen-carrying protein hemoglobin.', 'https://medlineplus.gov/lab-tests/iron-tests/'],
    [['Transferrin'], 'A protein that carries iron through your blood to where it is needed.', 'https://medlineplus.gov/lab-tests/iron-tests/'],
    [['Transferrin saturation'], 'The percentage of available iron-binding sites on transferrin that are occupied by iron.', 'https://laboratories.newcastle-hospitals.nhs.uk/test-directory/transferrin-serum/'],
    [['TIBC'], 'Total iron-binding capacity: how much iron the proteins in your blood can carry, mainly through transferrin.', 'https://medlineplus.gov/lab-tests/iron-tests/'],
    [['TSH'], 'Thyroid-stimulating hormone: a signal from the pituitary gland that tells the thyroid how much thyroid hormone to make.', 'https://medlineplus.gov/lab-tests/tsh-thyroid-stimulating-hormone-test/'],
    [['Free T4', 'FT4'], 'Thyroxine that is not attached to blood proteins. This thyroid hormone helps regulate how your body uses energy.', 'https://medlineplus.gov/lab-tests/thyroxine-t4-test/'],
    [['T4'], 'Thyroxine, the main hormone made by the thyroid. It helps regulate how your body uses energy.', 'https://medlineplus.gov/lab-tests/thyroxine-t4-test/'],
    [['Free T3', 'FT3'], 'Triiodothyronine that is not attached to blood proteins. This thyroid hormone helps regulate how your body uses energy.', 'https://medlineplus.gov/lab-tests/triiodothyronine-t3-tests/'],
    [['T3'], 'Triiodothyronine, a thyroid hormone involved in energy use, body temperature, and heart function.', 'https://medlineplus.gov/lab-tests/triiodothyronine-t3-tests/'],
    [['Uric acid', 'Urate'], 'A waste product from breaking down purines, substances found in body cells and some foods. The kidneys remove it through urine.', 'https://medlineplus.gov/lab-tests/uric-acid-test/'],
    [['Weight'], 'Your body weight at the time of measurement. It is one of the measurements used to calculate body mass index (BMI).', 'https://medlineplus.gov/ency/article/007196.htm'],
    [['Height'], 'Your measured height. Together with weight, it is used to calculate body mass index (BMI).', 'https://medlineplus.gov/ency/article/007196.htm'],
    [['BMI'], 'Body mass index: weight in kilograms divided by height in metres squared. It does not distinguish muscle from body fat.', 'https://medlineplus.gov/ency/article/007196.htm']
  ].flatMap(([names, text, url]) => names.map(name => [name.toLowerCase(), { aliases: names, text, url }])));
  const labReference = { label: 'Reference', profile: 'Male, 30–40', sourceName: 'Frankfurt lab ranges', note: 'Your lab’s limits may differ.' };
  const referenceSources = {
    chemistry: { ...labReference, url: 'https://www.unimedizin-ffm.de/fileadmin/redakteure/Fachkliniken/Innere-Medizin/Zentrallabor/Referenzbereiche_NEU/IB-AL2-003_V3_Referenzbereiche_Klinische_Chemie.pdf' },
    blood: { ...labReference, url: 'https://www.unimedizin-ffm.de/fileadmin/redakteure/Fachkliniken/Innere-Medizin/Zentrallabor/Referenzbereiche_NEU/IB-AL-002_V3_Referenzbereiche_H%C3%A4matologie.pdf' },
    hormones: { ...labReference, url: 'https://www.unimedizin-ffm.de/fileadmin/redakteure/Fachkliniken/Innere-Medizin/Zentrallabor/Referenzbereiche_NEU/IB-AL2-004_V3_Referenzbereiche_Hormone.pdf' },
    cholesterol: { label: 'Desirable', profile: 'Adults', sourceName: 'MedlinePlus', url: 'https://medlineplus.gov/cholesterollevelswhatyouneedtoknow.html' },
    ldl: { label: 'Low-risk target', sourceName: 'Lipid-Liga', url: 'https://www.lipid-liga.de/wenig-cholesterin-im-blut-weniger-herzinfarkte-schlaganfaelle-und-durchblutungsstoerungen/' },
    hdl: { label: 'Reference', profile: 'Men', sourceName: 'MedlinePlus', url: 'https://medlineplus.gov/cholesterollevelswhatyouneedtoknow.html' },
    triglycerides: { ranges: [{ label: 'Fasting', lower: null, upper: 150 }, { label: 'Non-fasting', lower: null, upper: 175 }], sourceName: 'EAS / EFLM', url: 'https://esc365.escardio.org/journal/26789' }
  };
  // Lab intervals apply to a male aged 30–40; cholesterol uses an adult decision threshold.
  // Null means no stated bound.
  // Count-density aliases are equivalent units. Only /µl needs a scaled reference interval.
  const markerReferences = new Map([
    [['Total cholesterol', 'Cholesterol'], ['mg/dl'], null, 200, 'cholesterol'],
    [['LDL', 'LDL cholesterol'], ['mg/dl'], null, 116, 'ldl'],
    [['HDL', 'HDL cholesterol'], ['mg/dl'], 40, null, 'hdl'],
    [['Triglycerides'], ['mg/dl'], null, null, 'triglycerides'],
    [['ALT'], ['u/l'], null, 50, 'chemistry', 5],
    [['AST'], ['u/l'], null, 40, 'chemistry', 5],
    [['Gamma-GT', 'GGT'], ['u/l'], null, 60, 'chemistry', 5],
    [['ALP', 'Alkaline phosphatase'], ['u/l'], 40, 130, 'chemistry', 1],
    [['Creatine kinase (CK)', 'Creatine kinase', 'CK'], ['u/l'], null, 190, 'chemistry', 3],
    [['LDH', 'Lactate dehydrogenase'], ['u/l'], null, 248, 'chemistry', 9],
    [['Creatinine'], ['mg/dl'], .70, 1.20, 'chemistry', 8],
    [['Urea'], ['mg/dl'], 19, 44, 'chemistry', 6],
    [['White blood cells (WBC)', 'WBC'], ['gpt/l', '/nl', '10^9/l'], 3.92, 9.81, 'blood', 1],
    [['White blood cells (WBC)', 'WBC'], ['/µl'], 3920, 9810, 'blood', 1],
    [['Red blood cells (RBC)', 'RBC'], ['tpt/l', '/pl', '10^12/l'], 4.54, 5.77, 'blood', 1],
    [['Hemoglobin', 'Haemoglobin'], ['g/dl'], 13.5, 17.5, 'blood', 1],
    [['Hematocrit', 'Haematocrit'], ['%'], 39.6, 50.6, 'blood', 2],
    [['MCV'], ['fl'], 80, 95.5, 'blood', 2],
    [['MCH'], ['pg'], 27.6, 32.8, 'blood', 2],
    [['MCHC'], ['g/dl'], 32.8, 36.6, 'blood', 2],
    [['RDW', 'RDW-CV'], ['%'], 12.1, 14.8, 'blood', 2],
    [['Platelets'], ['gpt/l', '/nl', '10^9/l'], 146, 328, 'blood', 3],
    [['Platelets'], ['/µl'], 146000, 328000, 'blood', 3],
    [['MPV'], ['fl'], 9.2, 12.5, 'blood', 3],
    [['Sodium'], ['mmol/l'], 135, 145, 'chemistry', 10],
    [['Potassium'], ['mmol/l'], 3.6, 4.8, 'chemistry', 8],
    [['Chloride'], ['mmol/l'], 98, 107, 'chemistry', 3],
    [['Bicarbonate'], ['mmol/l'], 22, 29, 'chemistry', 1],
    [['Calcium'], ['mmol/l'], 2.09, 2.54, 'chemistry', 2],
    [['Magnesium'], ['mmol/l'], .66, 1.07, 'chemistry', 10],
    [['Ferritin'], ['ng/ml', 'µg/l'], 18, 360, 'chemistry', 4],
    [['Iron', 'Serum iron'], ['µg/dl'], 59, 158, 'chemistry', 4],
    [['TSH'], ['miu/l', 'µiu/ml', 'µu/ml'], .27, 4.2, 'hormones', 8],
    [['Uric acid', 'Urate'], ['mg/dl'], 3.4, 7, 'chemistry', 6]
  ].flatMap(([names, units, lower, upper, source, page]) => names.flatMap(name => units.map(unit => [JSON.stringify([name.toLowerCase(), unit]), { ...referenceSources[source], ranges: referenceSources[source].ranges ?? [{ lower, upper }], url: referenceSources[source].url + (page ? '#page=' + page : '') }]))));
  const decimalPattern = /^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?$/i;
  const dateFormat = new Intl.DateTimeFormat(navigator.languages, { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' });
  const numberFormat = new Intl.NumberFormat(navigator.languages, { maximumSignificantDigits: 6 });
  const mobile = matchMedia('(max-width:560px)');
  const state = { view: 'results', query: '', csvQuery: '', csvOrder: 'source', expanded: null };
  let source = { header: [], names: [], records: [] }, series = [], dates = [], importVersion = 0;
  const selectedPoints = new Map();
  const chartObserver = new ResizeObserver(entries => entries.forEach(entry => drawChart(entry.target)));

  function esc(value) {
    return String(value ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  }
  function sourceHTML(value) {
    return '<span translate="no">' + esc(value) + '</span>';
  }
  function displayDate(value) {
    return dateFormat.format(new Date(value + 'T00:00:00Z'));
  }
  function numeric(value) {
    const text = (value || '').trim();
    return decimalPattern.test(text) && Number.isFinite(Number(text)) ? Number(text) : null;
  }
  function resultCount(count) {
    return count + (count === 1 ? ' result' : ' results');
  }
  function validDate(value) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
    const time = Date.parse(value + 'T00:00:00Z');
    return Number.isFinite(time) && new Date(time).toISOString().slice(0, 10) === value;
  }
  function parseCSV(text) {
    const records = [];
    let cells = [], cell = '', quoted = false, closed = false, line = 1, startLine = 1, started = false;
    text = text.replace(/^\uFEFF/, '');
    for (let i = 0; i < text.length; i++) {
      const c = text[i];
      if (quoted) {
        if (c === '"' && text[i + 1] === '"') { cell += '"'; i++; }
        else if (c === '"') { quoted = false; closed = true; }
        else { cell += c; if (c === '\n') line++; }
      } else if (c === ',' || c === '\n' || c === '\r') {
        if (c === ',') {
          cells.push(cell); cell = ''; closed = false; started = true;
        } else {
          if (started || cell || cells.length) records.push({ cells: [...cells, cell], line: startLine });
          cells = []; cell = ''; closed = false; started = false;
          if (c === '\r' && text[i + 1] === '\n') i++;
          line++; startLine = line;
        }
      } else if (c === '"' && !cell && !closed) {
        quoted = true; started = true;
      } else if (closed) {
        throw new Error('Line ' + line + ': unexpected text after a quoted cell.');
      } else if (c === '"') {
        throw new Error('Line ' + line + ': unexpected quote in an unquoted cell.');
      } else { cell += c; started = true; }
    }
    if (quoted) throw new Error('Line ' + startLine + ': unclosed quoted cell.');
    if (started || cell || cells.length) records.push({ cells: [...cells, cell], line: startLine });
    const header = records.shift()?.cells;
    if (!header) throw new Error('This file is empty.');
    for (const record of records) {
      if (record.cells.length !== header.length) {
        throw new Error('Line ' + record.line + ': expected ' + header.length + ' columns, found ' + record.cells.length + '.');
      }
    }
    return { header, names: header.map(name => name.trim().toLowerCase()), records };
  }
  function loadCSV(text, label, demo = false) {
    const parsed = parseCSV(text), nextSeries = new Map(), units = new Map();
    const required = ['date', 'analyte', 'value', 'unit'];
    const unavailable = required.filter(name => parsed.names.filter(column => column === name).length !== 1);
    let excluded = 0;
    const availableFields = ['date', 'lab', 'analyte', 'value', 'unit'];
    if (!unavailable.length) {
      parsed.records.forEach((record, index) => {
        const fields = Object.fromEntries(availableFields.map(name => [name, record.cells[parsed.names.indexOf(name)] || '']));
        const date = fields.date.trim(), name = fields.analyte.trim(), unit = fields.unit.trim();
        if (!validDate(date) || !name) { excluded++; return; }
        const row = { ...fields, date, analyte: name, unit, valueNum: numeric(fields.value), time: Date.parse(date + 'T00:00:00Z'), index };
        const key = JSON.stringify([name, unit]);
        if (!nextSeries.has(key)) nextSeries.set(key, { id: nextSeries.size, name, unit, group: groupFor.get(name.toLowerCase()) || 'Other markers', rows: [] });
        nextSeries.get(key).rows.push(row);
        if (!units.has(name)) units.set(name, new Set());
        units.get(name).add(unit);
      });
    }
    const prepared = [...nextSeries.values()].map(item => {
      item.rows.sort((a, b) => a.time - b.time || a.index - b.index);
      item.reference = markerReferences.get(JSON.stringify([item.name.toLowerCase(), item.unit.toLowerCase().replaceAll('μ', 'µ')]));
      item.searchText = [item.name, item.unit, item.group, ...(markerExplanations.get(item.name.toLowerCase())?.aliases ?? [])].join(' ').toLowerCase();
      const counts = new Map();
      for (const row of item.rows) counts.set(row.date, (counts.get(row.date) || 0) + 1);
      return { ...item, mixedUnits: units.get(item.name).size > 1, duplicateDates: [...counts.values()].some(count => count > 1) };
    });
    source = parsed; series = prepared;
    dates = [...new Set(series.flatMap(item => item.rows.map(row => row.date)))].sort();
    selectedPoints.clear();
    Object.assign(state, { view: series.length ? 'results' : 'csv', query: '', csvQuery: '', csvOrder: 'source', expanded: null });
    ui.search.value = ''; ui.csvSearch.value = ''; ui.csvOrder.value = 'source';
    ui.welcome.hidden = true; ui.loaded.hidden = false;
    ui.importStatus.className = 'fileStatus';
    ui.importStatus.textContent = label + ' · ' + source.records.length + ' rows' + (demo ? ' · Synthetic sample data' : '');
    ui.coverage.textContent = dates.length ? displayDate(dates[0]) + ' – ' + displayDate(dates.at(-1)) + ' · ' + series.reduce((count, item) => count + item.rows.length, 0) + ' results · ' + dates.length + ' dates' : source.records.length + ' source rows · ' + source.header.length + ' columns';
    const notices = [];
    if (unavailable.length) notices.push('Results needs one column each named date, analyte, value and unit. Open CSV table to review the available fields.');
    if (excluded) notices.push(excluded + (excluded === 1 ? ' row has' : ' rows have') + ' a missing marker or invalid date. All source rows remain in CSV table.');
    if (series.some(item => item.mixedUnits)) notices.push('Different units are listed separately; no conversion is assumed.');
    ui.dataNotice.textContent = notices.join(' '); ui.dataNotice.hidden = !notices.length;
    ui.csvOrder.querySelectorAll('option').forEach(option => {
      option.disabled = (['newest', 'oldest'].includes(option.value) && !source.names.includes('date')) || (option.value === 'marker' && !source.names.includes('analyte'));
    });
    ui.csvOrder.closest('label').hidden = !source.names.includes('date') && !source.names.includes('analyte');
    ui.csvScroll.scrollLeft = 0;
    render();
    ui.viewTabs.querySelector('[aria-selected="true"]').focus();
  }
  function changeHTML(item, compact = false) {
    const last = item.rows.at(-1);
    const previous = item.rows.findLast(row => row.date < last.date);
    let reason = '';
    if (!previous) reason = 'No earlier date';
    else if (item.rows.filter(row => row.date === previous.date).length > 1 || item.rows.filter(row => row.date === last.date).length > 1) reason = 'Multiple results on date';
    else if (!item.unit) reason = 'Unit not supplied';
    else if (previous.valueNum === null || last.valueNum === null) reason = 'No exact numeric comparison';
    const delta = reason ? null : last.valueNum - previous.valueNum;
    if (reason || !Number.isFinite(delta)) return '<small>' + esc(reason || 'Change cannot be calculated') + '</small>';
    const change = delta === 0 ? 'No change' : '<span class="visuallyHidden">' + (delta > 0 ? 'Increase of ' : 'Decrease of ') + '</span><span aria-hidden="true">' + (delta > 0 ? '↑' : '↓') + '</span> ' + numberFormat.format(Math.abs(delta));
    const baseline = 'from ' + sourceHTML(previous.value), date = '<time datetime="' + previous.date + '">' + displayDate(previous.date) + '</time>';
    return '<span class="changeValue">' + change + '</span> ' + (compact ? '<small>since ' + date + '</small><span class="visuallyHidden"> · ' + baseline + '</span>' : '<small>' + baseline + ' · ' + date + '</small>');
  }
  function historyTable(item) {
    const rows = item.rows.slice().reverse();
    return '<h3 class="historyHeading">' + sourceHTML(item.name) + ' · ' + resultCount(rows.length) + '</h3><table class="historyTable" aria-label="Complete ' + esc(item.name + ' (' + (item.unit || 'no unit') + ')') + ' history"><colgroup><col class="dateColumn"><col class="valueColumn"></colgroup><thead><tr><th scope="col">Date</th><th scope="col" class="numeric">' + (item.unit ? sourceHTML(item.unit) : 'Value') + '</th></tr></thead><tbody>' + rows.map(row =>
      '<tr><td>' + displayDate(row.date) + '<small class="sourceText">' + (row.lab ? sourceHTML(row.lab) : 'Lab not supplied') + '</small></td><td class="numeric"><strong class="sourceText">' + (row.value === '' ? '<span aria-label="Empty value">—</span>' : sourceHTML(row.value)) + '</strong></td></tr>'
    ).join('') + '</tbody></table>';
  }
  function historyPanel(item) {
    const numericRows = item.rows.filter(row => row.valueNum !== null);
    const canPlot = item.unit && numericRows.length > 1;
    const explanation = markerExplanations.get(item.name.toLowerCase());
    const reference = item.reference;
    const rangeLabel = reference ? reference.ranges.map(range => {
      const value = range.lower === null ? '< ' + numberFormat.format(range.upper) : range.upper === null ? '≥ ' + numberFormat.format(range.lower) : numberFormat.format(range.lower) + '–' + numberFormat.format(range.upper);
      return esc(range.label || reference.label) + ': ' + sourceHTML(value + ' ' + item.unit);
    }).join(' · ') + (reference.profile ? ' · ' + esc(reference.profile) : '') : '';
    const notes = [];
    if (item.rows.length > 1) {
      if (!item.unit) notes.push('Unit not supplied; no chart or change is calculated.');
      else if (numericRows.length < 2) notes.push('At least two exact numeric values are needed for a chart.');
      else if (numericRows.length !== item.rows.length) notes.push((item.rows.length - numericRows.length) + ' text or qualified values are listed in the table; they are not plotted as exact numbers.');
      if (item.duplicateDates) notes.push('Multiple results on a date are retained. Points are not connected.');
    }
    return (canPlot ? '<div class="historyChart"><h3>Trend · ' + sourceHTML(item.unit) + '</h3>' + (reference ? '<p class="referenceLegend" id="reference-' + item.id + '">' + rangeLabel + '</p>' : '') + '<svg class="chart" data-chart="' + item.id + '" role="img" tabindex="0"' + (reference ? ' aria-describedby="reference-' + item.id + '"' : '') + ' aria-label="' + esc(item.name) + ' history. Tap a point or use Left and Right arrow keys for exact values. Every result is in the table below."></svg><p class="pointReadout" aria-live="polite">Tap a point for its date and value.</p>' + (reference ? '<p class="referenceSource"><a href="' + esc(reference.url) + '" target="_blank" rel="noopener noreferrer">' + esc(reference.sourceName) + '<span class="visuallyHidden"> (opens in a new tab)</span></a>' + (reference.note ? ' · ' + esc(reference.note) : '') + '</p>' : '') + '</div>' : '') +
      historyTable(item) +
      (notes.length ? '<p class="quiet historyNote">' + esc(notes.join(' ')) + '</p>' : '') +
      (explanation ? '<section class="markerExplanation" aria-labelledby="about-' + item.id + '"><h3 id="about-' + item.id + '">About this marker</h3><p>' + esc(explanation.text) + '</p><a href="' + esc(explanation.url) + '" target="_blank" rel="noopener noreferrer">' + (explanation.url.startsWith('https://medlineplus.gov/') ? 'MedlinePlus' : 'NHS') + ' · Learn more<span class="visuallyHidden"> about ' + sourceHTML(item.name) + ' (opens in a new tab)</span></a></section>' : '') +
      '<button type="button" class="closeHistory" data-close="' + item.id + '">Close details<span class="visuallyHidden"> for ' + sourceHTML(item.name) + '</span></button>';
  }
  function renderResults() {
    const query = state.query.trim().toLowerCase(), columns = mobile.matches ? 2 : 3;
    const visible = series.filter(item => item.searchText.includes(query)).sort((a, b) => groupOrder.get(a.group) - groupOrder.get(b.group) || (markerOrder.get(a.name.toLowerCase()) ?? 0) - (markerOrder.get(b.name.toLowerCase()) ?? 0) || a.name.localeCompare(b.name) || a.unit.localeCompare(b.unit));
    const counts = new Map();
    for (const item of visible) counts.set(item.group, (counts.get(item.group) || 0) + 1);
    ui.resultCount.textContent = visible.length + ' of ' + series.length + ' markers · ' + counts.size + (counts.size === 1 ? ' group' : ' groups');
    let previousGroup = '';
    ui.resultsBody.innerHTML = visible.map(item => {
      const last = item.rows.at(-1), latest = item.rows.filter(row => row.date === last.date);
      const opened = state.expanded === item.id;
      const action = opened ? 'Hide details' : 'View ' + resultCount(item.rows.length);
      const preview = !opened && item.unit && item.rows.filter(row => row.valueNum !== null).length > 1 ? '<svg class="trendPreview" data-chart="' + item.id + '" aria-hidden="true" focusable="false"></svg>' : '';
      const change = changeHTML(item);
      const composition = ['total cholesterol', 'cholesterol'].includes(item.name.toLowerCase()) ? ' (HDL + non-HDL)' : '';
      const heading = previousGroup !== item.group ? '<tr class="groupRow"><td colspan="' + columns + '"><h3>' + esc(item.group) + '<span class="quiet">' + counts.get(item.group) + (counts.get(item.group) === 1 ? ' marker' : ' markers') + '</span></h3></td></tr>' : '';
      previousGroup = item.group;
      return heading + '<tr class="markerRow"><td><button type="button" class="historyButton" data-expand="' + item.id + '" aria-label="' + action + ' for ' + esc(item.name + composition + ' (' + (item.unit || 'no unit') + ')') + '" aria-expanded="' + opened + '" aria-controls="history-' + item.id + '"><span class="markerText"><span class="markerName" translate="no">' + esc(item.name) + '</span>' + (composition ? '<span class="markerNote" translate="no">' + composition + '</span>' : '') + (item.mixedUnits ? '<span class="markerNote">Separate unit</span>' : '') + '</span>' + preview + '<span class="historyAction">' + action + '</span></button></td>' +
        '<td class="numeric"><span class="latestValue"><strong class="sourceText">' + latest.map(row => row.value === '' ? '<span aria-label="Empty value">—</span>' : sourceHTML(row.value)).join('<br>') + '</strong><span class="unit">' + (item.unit ? sourceHTML(item.unit) : 'Unit not supplied') + '</span></span><small>' + displayDate(last.date) + '</small>' + (latest.length > 1 ? '<small>' + latest.length + ' results on this date</small>' : '') + '<div class="mobileChange">' + changeHTML(item, true) + '</div></td>' +
        '<td class="numeric changeColumn">' + change + '</td></tr>' +
        '<tr id="history-' + item.id + '"' + (opened ? '' : ' hidden') + '><td class="expandedCell" colspan="' + columns + '">' + (opened ? historyPanel(item) : '') + '</td></tr>';
    }).join('') || '<tr><td colspan="' + columns + '">' + (!series.length ? 'No usable marker histories. Open CSV table to see the source records.' : 'No matching markers. Change or clear the search.') + '</td></tr>';
  }
  function renderCSV() {
    ui.csvScroll.classList.toggle('withoutMarker', !source.names.includes('analyte'));
    const priority = ['date', 'analyte', 'value', 'unit', 'lab'];
    const fields = source.header.map((name, index) => ({ name, key: source.names[index], index })).filter(field => !['source_file', 'original_name'].includes(field.key)).sort((a, b) => (priority.includes(a.key) ? priority.indexOf(a.key) : priority.length) - (priority.includes(b.key) ? priority.indexOf(b.key) : priority.length) || a.index - b.index);
    const labels = { date: 'Date', analyte: 'Marker', value: 'Value', unit: 'Unit', lab: 'Lab', source_date: 'Source date' };
    const classes = { date: 'sourceDate', analyte: 'sourceMarker', value: 'sourceValue', unit: 'sourceUnit' };
    fields.forEach(field => { field.className = (Object.hasOwn(classes, field.key) ? classes[field.key] : '') + (field.key === 'analyte' && field.index === source.names.indexOf('analyte') ? ' frozenMarker' : ''); });
    const query = state.csvQuery.trim().toLowerCase();
    const rows = source.records.map((record, index) => ({ ...record, index })).filter(record => !query || fields.some(field => record.cells[field.index].toLowerCase().includes(query)));
    const dateIndex = source.names.indexOf('date'), markerIndex = source.names.indexOf('analyte');
    rows.sort((a, b) => {
      if (state.csvOrder === 'marker') return (a.cells[markerIndex] || '').localeCompare(b.cells[markerIndex] || '') || a.index - b.index;
      if (state.csvOrder === 'newest' || state.csvOrder === 'oldest') {
        const first = (a.cells[dateIndex] || '').trim(), second = (b.cells[dateIndex] || '').trim();
        const validFirst = validDate(first), validSecond = validDate(second);
        if (!validFirst || !validSecond) return Number(validSecond) - Number(validFirst) || a.index - b.index;
        return (state.csvOrder === 'newest' ? second.localeCompare(first) : first.localeCompare(second)) || a.index - b.index;
      }
      return a.index - b.index;
    });
    ui.csvCount.textContent = rows.length + ' of ' + source.records.length + ' rows · ' + fields.length + ' columns';
    ui.csvHead.innerHTML = '<tr>' + fields.map(field => '<th scope="col" class="' + field.className + '">' + (Object.hasOwn(labels, field.key) ? esc(labels[field.key]) : field.name ? sourceHTML(field.name) : 'Column ' + (field.index + 1)) + '</th>').join('') + '</tr>';
    ui.csvBody.innerHTML = !fields.length ? '<tr><td>No table columns to display.</td></tr>' : rows.map(record => '<tr>' + fields.map(field => '<td class="' + field.className + '" translate="no">' + esc(record.cells[field.index]) + '</td>').join('') + '</tr>').join('') || '<tr><td colspan="' + fields.length + '">' + (source.records.length ? 'No matching rows. Change or clear the search.' : 'This CSV contains column headings but no records.') + '</td></tr>';
    requestAnimationFrame(updateScrollControls);
  }
  function updateScrollControls() {
    const maximum = ui.csvScroll.scrollWidth - ui.csvScroll.clientWidth;
    ui.scrollTools.hidden = maximum <= 1;
    ui.scrollLeft.disabled = ui.csvScroll.scrollLeft <= 1;
    ui.scrollRight.disabled = ui.csvScroll.scrollLeft >= maximum - 1;
  }
  function render() {
    ui.resultsView.hidden = state.view !== 'results';
    ui.csvView.hidden = state.view !== 'csv';
    document.querySelectorAll('[data-view]').forEach(button => {
      const selected = button.dataset.view === state.view;
      button.setAttribute('aria-selected', String(selected));
      button.tabIndex = selected ? 0 : -1;
    });
    if (state.view === 'results') renderResults(); else renderCSV();
    refreshCharts();
  }
  function refreshCharts() {
    chartObserver.disconnect();
    if (state.view !== 'results') return;
    ui.resultsBody.querySelectorAll('[data-chart]').forEach(svg => { drawChart(svg); chartObserver.observe(svg); });
  }
  function drawChart(svg) {
    const item = series[Number(svg.dataset.chart)], width = svg.getBoundingClientRect().width;
    if (!width || !item) return;
    const rows = item.rows.filter(row => row.valueNum !== null);
    if (!rows.length) return;
    const preview = svg.classList.contains('trendPreview');
    const height = preview ? 48 : 180, right = preview ? 4 : 24, top = preview ? 4 : 26, bottom = preview ? 44 : 140;
    let minimum = Infinity, maximum = -Infinity;
    for (const row of rows) { minimum = Math.min(minimum, row.valueNum); maximum = Math.max(maximum, row.valueNum); }
    const bounds = item.reference ? item.reference.ranges.flatMap(range => [range.lower, range.upper]).filter(value => value !== null) : [];
    const domainMin = Math.min(minimum, ...bounds), domainMax = Math.max(maximum, ...bounds);
    const magnitude = Math.max(Math.abs(domainMin), Math.abs(domainMax)) || 1;
    // A minimum scale margin prevents tiny changes from filling the chart height.
    const lo = domainMin / magnitude, hi = domainMax / magnitude, pad = Math.max((hi - lo) * .16, .05);
    const axisValue = value => Math.abs(value) >= 1e7 || (value !== 0 && Math.abs(value) < .001) ? value.toExponential(2) : numberFormat.format(value);
    svg.setAttribute('viewBox', '0 0 ' + width + ' ' + height);
    svg.innerHTML = preview ? '' : '<title>' + esc(item.name + ' in ' + item.unit) + '</title><desc>All numeric results, spaced by calendar date. Use the table below for exact source values.</desc>' + [...new Set([domainMin, domainMax])].map(value => '<text translate="no" class="yLabel" x="0" y="0">' + esc(axisValue(value)) + '</text>').join('');
    const left = preview ? 4 : Math.min(width / 2, Math.max(64, ...[...svg.querySelectorAll('.yLabel')].map(label => label.getBBox().width + 12)));
    const start = Date.parse(dates[0] + 'T00:00:00Z'), end = Date.parse(dates.at(-1) + 'T00:00:00Z');
    const x = time => start === end ? left + (width - left - right) / 2 : left + (time - start) / (end - start) * (width - left - right);
    const y = value => bottom - (value / magnitude - (lo - pad)) / (hi - lo + 2 * pad) * (bottom - top);
    let html = preview ? '' : '<title>' + esc(item.name + ' in ' + item.unit) + '</title><desc>All numeric results. Use Left and Right arrow keys or tap a point. Exact results are in the table below.</desc>';
    if (!preview) [...new Set([domainMin, domainMax])].forEach(value => {
      html += '<line class="chartGrid" x1="' + left + '" x2="' + (width - right) + '" y1="' + y(value) + '" y2="' + y(value) + '"/><text translate="no" x="' + (left - 6) + '" y="' + (y(value) + 4) + '" text-anchor="end">' + esc(axisValue(value)) + '</text>';
    });
    if (!preview) bounds.forEach(value => {
      html += '<line class="chartReference" x1="' + left + '" x2="' + (width - right) + '" y1="' + y(value) + '" y2="' + y(value) + '"><title>Reference limit: ' + esc(numberFormat.format(value) + ' ' + item.unit) + '</title></line>';
    });
    if (!item.duplicateDates) {
      let previous = null, path = '';
      for (const row of item.rows) {
        if (row.valueNum === null) { previous = null; continue; }
        path += (previous ? 'L' : 'M') + x(row.time) + ',' + y(row.valueNum) + ' ';
        previous = row;
      }
      html += '<path class="chartLine" d="' + path + '"/>';
    }
    rows.forEach(row => {
      html += '<circle class="chartPoint" cx="' + x(row.time) + '" cy="' + y(row.valueNum) + '" r="' + (preview ? 2 : 3) + '"/>';
    });
    if (preview) { svg.innerHTML = html; return; }
    html += '<text x="' + left + '" y="174" text-anchor="start">' + displayDate(dates[0]) + '</text>';
    if (start !== end) html += '<text x="' + (width - right) + '" y="174" text-anchor="end">' + displayDate(dates.at(-1)) + '</text>';
    html += '<g class="valueLabels"></g><line class="chartGuide" y1="' + top + '" y2="' + bottom + '" visibility="hidden"/><circle class="chartSelected" r="5" visibility="hidden"/>';
    svg.innerHTML = html;
    const occupied = [...svg.querySelectorAll('text')].map(label => label.getBBox());
    const priority = new Set([rows.length - 1, 0, rows.findIndex(row => row.valueNum === minimum), rows.findIndex(row => row.valueNum === maximum), ...rows.map((row, index) => index)]);
    let labelsPlaced = 0, labelsAttempted = 0;
    for (const index of priority) {
      if (labelsPlaced >= Math.floor(width / 28) || labelsAttempted++ >= Math.ceil(width / 7)) break;
      const row = rows[index], label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      label.setAttribute('class', 'valueLabel');
      label.setAttribute('translate', 'no');
      label.setAttribute('x', x(row.time));
      label.setAttribute('text-anchor', index === 0 ? 'start' : index === rows.length - 1 ? 'end' : 'middle');
      label.textContent = row.value;
      svg.querySelector('.valueLabels').appendChild(label);
      let placed = false;
      for (const offset of [-12, 22]) {
        label.setAttribute('y', y(row.valueNum) + offset);
        const box = label.getBBox();
        const overlaps = occupied.some(other => box.x < other.x + other.width + 5 && box.x + box.width + 5 > other.x && box.y < other.y + other.height + 5 && box.y + box.height + 5 > other.y);
        const coversPoint = rows.some(point => x(point.time) > box.x - 5 && x(point.time) < box.x + box.width + 5 && y(point.valueNum) > box.y - 5 && y(point.valueNum) < box.y + box.height + 5);
        if (box.x >= 0 && box.x + box.width <= width && box.y >= 0 && box.y + box.height < 151 && !overlaps && !coversPoint) {
          occupied.push(box); placed = true; labelsPlaced++; break;
        }
      }
      if (!placed) label.remove();
    }
    const show = row => {
      selectedPoints.set(item.id, row.index);
      const guide = svg.querySelector('.chartGuide'), selected = svg.querySelector('.chartSelected');
      guide.setAttribute('x1', x(row.time)); guide.setAttribute('x2', x(row.time)); guide.setAttribute('visibility', 'visible');
      selected.setAttribute('cx', x(row.time)); selected.setAttribute('cy', y(row.valueNum)); selected.setAttribute('visibility', 'visible');
      svg.parentElement.querySelector('.pointReadout').innerHTML = esc(displayDate(row.date)) + ' · ' + sourceHTML(row.value + ' ' + row.unit) + ' · ' + (row.lab ? sourceHTML(row.lab) : 'Lab not supplied');
    };
    svg.onclick = event => {
      const rect = svg.getBoundingClientRect(), px = event.clientX - rect.left, py = event.clientY - rect.top;
      show(rows.reduce((best, row) => Math.hypot(x(row.time) - px, y(row.valueNum) - py) < Math.hypot(x(best.time) - px, y(best.valueNum) - py) ? row : best, rows[0]));
    };
    svg.onkeydown = event => {
      if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
      event.preventDefault();
      const current = rows.findIndex(row => row.index === selectedPoints.get(item.id));
      const index = event.key === 'Home' ? 0 : event.key === 'End' ? rows.length - 1 : current === -1 ? (event.key === 'ArrowLeft' ? rows.length - 1 : 0) : Math.max(0, Math.min(rows.length - 1, current + (event.key === 'ArrowRight' ? 1 : -1)));
      show(rows[index]);
    };
    const selected = rows.find(row => row.index === selectedPoints.get(item.id));
    if (selected) show(selected);
  }

  ui.importButton.onclick = ui.startButton.onclick = () => ui.csvFile.click();
  ui.csvFile.onchange = async () => {
    const file = ui.csvFile.files?.[0];
    if (!file) return;
    const version = ++importVersion;
    try {
      const text = await file.text();
      if (version !== importVersion) return;
      loadCSV(text, file.name);
    } catch (error) {
      if (version !== importVersion) return;
      ui.importStatus.className = 'fileStatus error';
      ui.importStatus.textContent = 'Could not open ' + file.name + ': ' + error.message + (ui.loaded.hidden ? '' : '\nThe previous data is still open.');
    } finally { if (version === importVersion) ui.csvFile.value = ''; }
  };
  ui.demoButton.onclick = () => { importVersion++; loadCSV(ui['demo-csv'].textContent.trim(), 'Demo data', true); };
  ui.viewTabs.onkeydown = event => {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
    const tabs = [...ui.viewTabs.querySelectorAll('[role="tab"]')];
    const current = tabs.indexOf(event.target);
    if (current === -1) return;
    event.preventDefault();
    const index = event.key === 'Home' ? 0 : event.key === 'End' ? tabs.length - 1 : (current + (event.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length;
    tabs.forEach((tab, position) => { tab.tabIndex = position === index ? 0 : -1; });
    tabs[index].focus();
  };
  ui.loaded.addEventListener('click', event => {
    const button = event.target.closest('button');
    if (!button) return;
    if (button.dataset.view) { state.view = button.dataset.view; render(); }
    if (button.dataset.expand !== undefined || button.dataset.close !== undefined) {
      const id = Number(button.dataset.expand ?? button.dataset.close);
      state.expanded = state.expanded === id ? null : id;
      renderResults(); refreshCharts();
      const opener = ui.resultsBody.querySelector('[data-expand="' + id + '"]');
      opener.focus({ preventScroll: true });
      opener.closest('.markerRow').scrollIntoView({ block: state.expanded === id ? 'start' : 'nearest' });
    }
  });
  ui.search.oninput = event => { state.query = event.target.value; renderResults(); refreshCharts(); };
  ui.csvSearch.oninput = event => { state.csvQuery = event.target.value; renderCSV(); };
  ui.csvOrder.onchange = event => { state.csvOrder = event.target.value; renderCSV(); };
  for (const [button, direction] of [[ui.scrollLeft, -1], [ui.scrollRight, 1]]) {
    button.onclick = () => {
      const frozenWidth = ui.csvHead.querySelector('.sourceMarker')?.getBoundingClientRect().width || 0;
      const current = ui.csvScroll.scrollLeft, maximum = ui.csvScroll.scrollWidth - ui.csvScroll.clientWidth;
      const left = ui.csvScroll.getBoundingClientRect().left;
      const stops = [...new Set([0, maximum, ...[...ui.csvHead.querySelectorAll('th:not(.frozenMarker)')].map(cell => Math.max(0, Math.min(maximum, cell.getBoundingClientRect().left - left + current - frozenWidth)))])].sort((a, b) => a - b);
      const target = direction > 0 ? stops.find(position => position > current + 1) ?? maximum : stops.findLast(position => position < current - 1) ?? 0;
      ui.csvScroll.scrollTo({ left: target, behavior: 'auto' });
    };
  }
  ui.csvScroll.addEventListener('scroll', updateScrollControls, { passive: true });
  new ResizeObserver(updateScrollControls).observe(ui.csvScroll);
  mobile.addEventListener('change', () => {
    ui.resultsBody.querySelectorAll(':scope > tr > td[colspan]').forEach(cell => { cell.colSpan = mobile.matches ? 2 : 3; });
  });
})();
