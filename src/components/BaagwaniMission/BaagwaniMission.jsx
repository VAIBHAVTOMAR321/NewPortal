import React, { useEffect, useMemo, useState } from "react";
import "./BaagwaniMission.css";

const FARMERS_KEY = "baagwani_mission_farmers";
const FIRMS_KEY = "baagwani_mission_firms";

const initialForm = {
  farmerName: "",
  fatherName: "",
  villageName: "",
  postOffice: "",
  blockName: "",
  districtName: "पौड़ी गढ़वाल",
  mobileNo: "",
  gardenCardNo: "",
  farmerCategory: "सामान्य",
  farmerEducation: "Metric",
  farmerGender: "Male",
  farmerSize: "Small/Marginal",

  totalArableLand: "",
  horticultureLand: "",
  irrigationFacilities: "",

  khasraNo: "",
  areaSqm: "",
  schemeSelection: "anti-hail",
  terrainSelection: "hilly",
  netType: "Leno Knitted",
  mulchingThickness: "30",
  mulchingColor: "Black & White",

  fundType: "Self",
  fundBankName: "",
  fundExtraVal1: "",
  fundExtraVal2: "",

  cropName: "",
  cropArea: "",
  cropProd: "",
  marketingStrategy:
    "स्थानीय कोटद्वार मंडी एवं निकटवर्ती देहरादून सब्जी मंडियों में सीधे बिक्री की जाएगी।",

  firmName: "M/S AVANI ENTERPRISES",
  firmAddress:
    "LAKHERA BHAWAN VILL. SHIBOONAGAR, KOTDWAR, GARHWAL",
  firmGSTIN: "05COWPD8094K1Z6",
  firmBankAcc: "025110100000143",
  firmBankName: "ALMORA URBAN CO-OPERATIVE BANK",
  firmIFSC: "AUCB0000026",

  invoiceNo: "",
  invoiceDate: new Date().toISOString().slice(0, 10),
};

const demoData = {
  ...initialForm,
  farmerName: "दिनेश सिंह रावत",
  fatherName: "स्व० सुरेन्द्र सिंह",
  villageName: "लक्ष्मीनगर, कोटद्वार",
  postOffice: "कोटद्वार मुख्यालय",
  blockName: "दुगड्डा",
  districtName: "पौड़ी गढ़वाल",
  mobileNo: "9876543210",
  gardenCardNo: "UK-HR-2026-9043",
  farmerCategory: "सामान्य",
  farmerEducation: "Metric",
  farmerGender: "Male",
  farmerSize: "Small/Marginal",
  totalArableLand: "0.85",
  horticultureLand: "0.30",
  irrigationFacilities: "स्प्रिंकलर एवं स्प्रिंग नहर",
  khasraNo: "102 ख / 2",
  areaSqm: "800",
  schemeSelection: "anti-hail",
  terrainSelection: "hilly",
  fundType: "KCC",
  fundBankName: "उत्तराखंड ग्रामीण बैंक",
  fundExtraVal1: "CardNo-29302213",
  fundExtraVal2: "₹1,50,000/-",
  cropName: "शिमला मिर्च (Solan Hybrid)",
  cropArea: "0.08",
  cropProd: "24",
  invoiceNo: "AE/2026/024",
  invoiceDate: "2026-07-06",
};

const categoryLabel = {
  सामान्य: "सामान्य वर्ग",
  SC: "SC",
  ST: "ST",
  अन्य: "OBC",
};

const educationLabel = {
  "Non Metric": "नॉन-मैट्रिक",
  Metric: "मैट्रिक",
  Intermediate: "12वीं (Inter)",
  Graduate: "स्नातक",
};

function formatCurrency(value) {
  const number = Number(value);
  if (!Number.isFinite(number)) return "₹0.00";
  return `₹${number.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function formatDate(value) {
  if (!value) return "___/___/_____";
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("hi-IN");
}

function readStorage(key) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : [];
  } catch {
    return [];
  }
}

function saveStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function Field({ label, required, children, className = "" }) {
  return (
    <div className={className}>
      <label className="bm-field-label">
        {label} {required && <span className="bm-required">*</span>}
      </label>
      {children}
    </div>
  );
}

function TextInput({ value, onChange, type = "text", placeholder, ...props }) {
  return (
    <input
      className="bm-input"
      type={type}
      value={value ?? ""}
      onChange={onChange}
      placeholder={placeholder}
      {...props}
    />
  );
}

function SelectInput({ value, onChange, children, ...props }) {
  return (
    <select className="bm-input" value={value} onChange={onChange} {...props}>
      {children}
    </select>
  );
}

export default function BaagwaniMission() {
  const [form, setForm] = useState(initialForm);
  const [formSegment, setFormSegment] = useState("farmer-info");
  const [currentTab, setCurrentTab] = useState(1);
  const [farmers, setFarmers] = useState([]);
  const [firms, setFirms] = useState([]);
  const [selectedFirm, setSelectedFirm] = useState("");
  const [toast, setToast] = useState(null);
  const [syncStatus, setSyncStatus] = useState("Local Storage");

  useEffect(() => {
    setFarmers(readStorage(FARMERS_KEY));
    setFirms(readStorage(FIRMS_KEY));
    setSyncStatus("Local Storage");
  }, []);

  const update = (field, value) => {
    setForm((previous) => ({ ...previous, [field]: value }));
  };

  const calculations = useMemo(() => {
    const area = Number(form.areaSqm) || 0;

    let rate = 0;
    let materialDescription = "";
    let subDescription = "";
    let hsnCode = "";
    let standardCode = "";
    let warranty = "";

    if (form.schemeSelection === "anti-hail") {
      rate = 35;
      materialDescription = `Anti-Hail Net (${form.netType}, HDPE Thread, 70 GSM)`;
      subDescription = "UV Stabilized, 100% Virgin Material, Transparent Color";
      hsnCode = "5608 19 00";
      standardCode = "IS 17730:2021";
      warranty = "3 Years (नेट की वारंटी)";
    } else {
      rate = form.terrainSelection === "hilly" ? 3.68 : 3.2;
      materialDescription = `Plastic Mulching Sheet (${form.mulchingThickness} Microns)`;
      subDescription = `Color: ${form.mulchingColor}, Standard Agricultural Mulch Grade`;
      hsnCode = "3920 10 12";
      standardCode = "IS 17216:2019";
      warranty = "1 Year (मल्चिंग की वारंटी)";
    }

    const totalCost = area * rate;
    const farmerShare = totalCost * 0.5;
    const subsidyAmount = totalCost * 0.5;

    return {
      rate,
      materialDescription,
      subDescription,
      hsnCode,
      standardCode,
      warranty,
      totalCost,
      farmerShare,
      subsidyAmount,
    };
  }, [form]);

  useEffect(() => {
    if (!toast) return undefined;
    const timer = setTimeout(() => setToast(null), 3500);
    return () => clearTimeout(timer);
  }, [toast]);

  const showToast = (message, icon = "✔") => {
    setToast({ message, icon });
  };

  const loadDemoData = () => {
    setForm(demoData);
    setFormSegment("farmer-info");
    setCurrentTab(1);
    showToast(
      "डेमो डेटा प्रारूप-B5, बिल एवं शपथ-पत्रों में सफलतापूर्वक भर दिया गया है!"
    );
  };

  const resetForm = () => {
    setForm({
      ...initialForm,
      invoiceDate: new Date().toISOString().slice(0, 10),
    });
    setSelectedFirm("");
    showToast("सभी फ़ॉर्म फ़ील्ड्स को खाली कर दिया गया है।");
  };

  const saveFarmer = () => {
    const id = form.gardenCardNo.trim() || `TEMP-${Date.now()}`;
    const record = {
      ...form,
      gardenCardNo: id,
      id,
      lastUpdated: Date.now(),
    };

    const existingIndex = farmers.findIndex(
      (item) => item.id === id || item.gardenCardNo === id
    );

    const next = [...farmers];
    if (existingIndex >= 0) next[existingIndex] = record;
    else next.unshift(record);

    setFarmers(next);
    saveStorage(FARMERS_KEY, next);
    setSyncStatus("Saved Locally");
    showToast(
      existingIndex >= 0
        ? "किसान रिकॉर्ड सफलतापूर्वक अपडेट किया गया!"
        : "किसान रिकॉर्ड सफलतापूर्वक सुरक्षित किया गया!"
    );
  };

  const loadFarmer = (record) => {
    setForm({ ...initialForm, ...record });
    setFormSegment("farmer-info");
    setCurrentTab(1);
    showToast("किसान रिकॉर्ड सफलतापूर्वक लोड किया गया।");
  };

  const deleteFarmer = (id) => {
    const next = farmers.filter((item) => item.id !== id);
    setFarmers(next);
    saveStorage(FARMERS_KEY, next);
    showToast("किसान रिकॉर्ड हटा दिया गया।", "🗑");
  };

  const saveFirm = () => {
    const name = form.firmName.trim();
    if (!name) {
      showToast("कृपया फर्म का नाम दर्ज करें।", "!");
      return;
    }

    const id =
      name.toLowerCase().replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "") ||
      `firm-${Date.now()}`;

    const record = {
      id,
      name,
      firmName: form.firmName,
      firmAddress: form.firmAddress,
      firmGSTIN: form.firmGSTIN,
      firmBankAcc: form.firmBankAcc,
      firmBankName: form.firmBankName,
      firmIFSC: form.firmIFSC,
      lastUpdated: Date.now(),
    };

    const existingIndex = firms.findIndex(
      (item) => item.id === id || item.firmName === name
    );
    const next = [...firms];

    if (existingIndex >= 0) next[existingIndex] = record;
    else next.unshift(record);

    setFirms(next);
    saveStorage(FIRMS_KEY, next);
    setSelectedFirm(id);
    setSyncStatus("Saved Locally");
    showToast("सप्लायर सफलतापूर्वक सुरक्षित किया गया!");
  };

  const loadFirm = (id) => {
    setSelectedFirm(id);
    if (!id) return;

    const firm = firms.find((item) => item.id === id);
    if (!firm) return;

    setForm((previous) => ({
      ...previous,
      firmName: firm.firmName || "",
      firmAddress: firm.firmAddress || "",
      firmGSTIN: firm.firmGSTIN || "",
      firmBankAcc: firm.firmBankAcc || "",
      firmBankName: firm.firmBankName || "",
      firmIFSC: firm.firmIFSC || "",
    }));

    showToast("सप्लायर विवरण लोड किया गया।");
  };

  const switchSegment = (segment) => setFormSegment(segment);
  const switchTab = (tab) => setCurrentTab(tab);

  const printCurrentDocument = () => {
    const element = document.getElementById(`bm-document-${currentTab}`);
    if (!element) return;

    const printWindow = window.open("", "_blank", "width=1000,height=900");
    if (!printWindow) {
      showToast("ब्राउज़र ने प्रिंट विंडो ब्लॉक कर दी।", "!");
      return;
    }

    printWindow.document.write(`
      <!doctype html>
      <html lang="hi">
        <head>
          <meta charset="UTF-8" />
          <title>Baagwani Mission Document</title>
          <style>
            @page { size: A4; margin: 12mm; }
            * { box-sizing: border-box; }
            body {
              margin: 0;
              background: #fff;
              color: #111827;
              font-family: "Noto Sans Devanagari", "Nirmala UI", Arial, sans-serif;
            }
            .bm-document-page {
              width: 100%;
              background: #fff;
              color: #111827;
            }
            table { width: 100%; border-collapse: collapse; }
            td, th { border: 1px solid #111827; }
            .print-hide { display: none !important; }
          </style>
        </head>
        <body>
          <div class="bm-document-page">${element.innerHTML}</div>
          <script>window.onload = function(){ window.print(); }</script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const checkbox = (condition) => (condition ? "☑" : "☐");

  const commonAddress = `ग्राम: ${form.villageName || "___"}, डाकखाना: ${
    form.postOffice || "___"
  }, विकासखण्ड: ${form.blockName || "___"}, जनपद: ${
    form.districtName || "___"
  }`;

  return (
    <div className="baagwani-mission">
      <header className="bm-header">
        <div className="bm-header-inner">
          <div className="bm-brand">
            <div className="bm-logo">
              <span>❧</span>
            </div>
            <div>
              <h1>राज्य बागवानी मिशन, उत्तराखण्ड</h1>
              <p>Document Automation &amp; Cloud Database Portal</p>
            </div>
          </div>

          <div className="bm-header-actions">
            <button className="bm-demo-btn" onClick={loadDemoData}>
              ⚡ Demo Data
            </button>
            <span className={`bm-sync ${syncStatus.includes("Saved") ? "saved" : ""}`}>
              <span className="bm-sync-dot" />
              {syncStatus}
            </span>
          </div>
        </div>
      </header>

      <div className="bm-workflow">
        <div>
          <span className="bm-live-dot" />
          <strong>स्वीकृत अनुक्रम:</strong> 1. आवेदन प्रपत्र (B5) ➜ 2. आपूर्तिकर्ता बिल ➜
          3. शपथ पत्र ➜ 4. सत्यापन रिपोर्ट
        </div>
        <span className="bm-workflow-badge">
          सभी 4 डाक्यूमेंट्स एक साथ ऑटो-फिल होते हैं
        </span>
      </div>

      <main className="bm-main">
        <section className="bm-form-panel">
          <div className="bm-segment-tabs">
            {[
              ["farmer-info", "1. कृषक और भूमि"],
              ["scheme-funds", "2. योजना व फंड"],
              ["firm-supplier", "3. फर्म & बैंक"],
              ["cloud-records", "4. सहेजे गए रिकॉर्ड"],
            ].map(([id, label]) => (
              <button
                key={id}
                className={formSegment === id ? "active" : ""}
                onClick={() => switchSegment(id)}
              >
                {label}
              </button>
            ))}
          </div>

          {formSegment === "farmer-info" && (
            <div className="bm-form-content">
              <h3>क) कृषक प्रोफाइल (B5 के अनुसार)</h3>

              <div className="bm-grid two">
                <Field label="लाभार्थी का नाम" required>
                  <TextInput value={form.farmerName} onChange={(e) => update("farmerName", e.target.value)} placeholder="उदा. सुरेश प्रसाद" />
                </Field>
                <Field label="पिता/पति का नाम" required>
                  <TextInput value={form.fatherName} onChange={(e) => update("fatherName", e.target.value)} placeholder="उदा. राम लाल" />
                </Field>
              </div>

              <div className="bm-grid three">
                <Field label="ग्राम" required>
                  <TextInput value={form.villageName} onChange={(e) => update("villageName", e.target.value)} placeholder="शिबूनगर" />
                </Field>
                <Field label="डाकखाना" required>
                  <TextInput value={form.postOffice} onChange={(e) => update("postOffice", e.target.value)} placeholder="कोटद्वार" />
                </Field>
                <Field label="विकासखण्ड" required>
                  <TextInput value={form.blockName} onChange={(e) => update("blockName", e.target.value)} placeholder="दुगड्डा" />
                </Field>
              </div>

              <div className="bm-grid two">
                <Field label="जनपद" required>
                  <TextInput value={form.districtName} onChange={(e) => update("districtName", e.target.value)} />
                </Field>
                <Field label="मोबाइल नंबर" required>
                  <TextInput value={form.mobileNo} onChange={(e) => update("mobileNo", e.target.value.replace(/\D/g, "").slice(0, 10))} maxLength={10} placeholder="10 अंकों का" />
                </Field>
              </div>

              <div className="bm-grid three">
                <Field label="शैक्षिक योग्यता" required>
                  <SelectInput value={form.farmerEducation} onChange={(e) => update("farmerEducation", e.target.value)}>
                    <option value="Non Metric">Non-Metric</option>
                    <option value="Metric">Metric (10वीं)</option>
                    <option value="Intermediate">Intermediate (12वीं)</option>
                    <option value="Graduate">Graduate (स्नातक)</option>
                  </SelectInput>
                </Field>
                <Field label="लाभार्थी लिंग" required>
                  <SelectInput value={form.farmerGender} onChange={(e) => update("farmerGender", e.target.value)}>
                    <option value="Male">पुरुष (Male)</option>
                    <option value="Female">महिला (Female)</option>
                  </SelectInput>
                </Field>
                <Field label="कृषक प्रकार" required>
                  <SelectInput value={form.farmerSize} onChange={(e) => update("farmerSize", e.target.value)}>
                    <option value="Small/Marginal">लघु / सीमान्त</option>
                    <option value="Big farmer">बड़े किसान</option>
                  </SelectInput>
                </Field>
              </div>

              <div className="bm-grid two">
                <Field label="उद्यान कार्ड संख्या">
                  <TextInput value={form.gardenCardNo} onChange={(e) => update("gardenCardNo", e.target.value)} placeholder="उदा. UK-HR-1094" />
                </Field>
                <Field label="लाभार्थी की श्रेणी" required>
                  <SelectInput value={form.farmerCategory} onChange={(e) => update("farmerCategory", e.target.value)}>
                    <option value="सामान्य">सामान्य वर्ग (General)</option>
                    <option value="SC">अनुसूचित जाति (SC)</option>
                    <option value="ST">अनुसूचित जनजाति (ST)</option>
                    <option value="अन्य">अन्य पिछड़ा वर्ग (OBC)</option>
                  </SelectInput>
                </Field>
              </div>

              <h3>ख) कृषि योग्य भूमि का विवरण</h3>
              <div className="bm-grid three">
                <Field label="कुल भूमि (है०)" required>
                  <TextInput type="number" step="0.01" value={form.totalArableLand} onChange={(e) => update("totalArableLand", e.target.value)} placeholder="0.50" />
                </Field>
                <Field label="बागवानी भूमि" required>
                  <TextInput type="number" step="0.01" value={form.horticultureLand} onChange={(e) => update("horticultureLand", e.target.value)} placeholder="0.20" />
                </Field>
                <Field label="सिंचाई सुविधा" required>
                  <TextInput value={form.irrigationFacilities} onChange={(e) => update("irrigationFacilities", e.target.value)} placeholder="स्प्रिंकलर / नहर" />
                </Field>
              </div>
            </div>
          )}

          {formSegment === "scheme-funds" && (
            <div className="bm-form-content">
              <h3>ग) प्रस्तावित योजना व तकनीकी संरचना</h3>

              <div className="bm-grid two">
                <Field label="खसरा संख्या" required>
                  <TextInput value={form.khasraNo} onChange={(e) => update("khasraNo", e.target.value)} placeholder="उदा. 452/3" />
                </Field>
                <Field label="स्वीकृत क्षेत्रफल (Sqm)" required>
                  <TextInput type="number" min="0" value={form.areaSqm} onChange={(e) => update("areaSqm", e.target.value)} placeholder="उदा. 500" />
                </Field>
              </div>

              <div className="bm-grid two">
                <Field label="चयनित योजना" required>
                  <SelectInput value={form.schemeSelection} onChange={(e) => update("schemeSelection", e.target.value)}>
                    <option value="anti-hail">एंटी-हेलनेट (Anti-Hail Net)</option>
                    <option value="mulching">प्लास्टिक मल्चिंग (Plastic Mulching)</option>
                  </SelectInput>
                </Field>
                <Field label="भौगोलिक श्रेणी" required>
                  <SelectInput value={form.terrainSelection} onChange={(e) => update("terrainSelection", e.target.value)}>
                    <option value="hilly">पर्वतीय क्षेत्र (Hilly Area)</option>
                    <option value="plain">मैदानी क्षेत्र (Plain Area)</option>
                  </SelectInput>
                </Field>
              </div>

              {form.schemeSelection === "anti-hail" ? (
                <div className="bm-conditional-card">
                  <p>एंटी-हैलनेट विवरण:</p>
                  <div className="bm-grid two">
                    <Field label="नेट प्रकार">
                      <SelectInput value={form.netType} onChange={(e) => update("netType", e.target.value)}>
                        <option value="Woven">Woven (बुना हुआ)</option>
                        <option value="Leno Knitted">Leno Knitted</option>
                        <option value="Raschel">Raschel</option>
                      </SelectInput>
                    </Field>
                    <Field label="मानक दर">
                      <input className="bm-input bm-disabled" value="₹35.00 / Sqm" disabled readOnly />
                    </Field>
                  </div>
                </div>
              ) : (
                <div className="bm-conditional-card">
                  <p>मल्चिंग शीट विवरण:</p>
                  <div className="bm-grid two">
                    <Field label="मोटाई (Microns)">
                      <SelectInput value={form.mulchingThickness} onChange={(e) => update("mulchingThickness", e.target.value)}>
                        <option value="25">25 Micron</option>
                        <option value="30">30 Micron</option>
                        <option value="50">50 Micron</option>
                      </SelectInput>
                    </Field>
                    <Field label="रंग (Color)">
                      <SelectInput value={form.mulchingColor} onChange={(e) => update("mulchingColor", e.target.value)}>
                        <option value="Black & White">Black & White</option>
                        <option value="Black">Black Only</option>
                        <option value="Silver">Silver</option>
                      </SelectInput>
                    </Field>
                  </div>
                </div>
              )}

              <h3>घ) धनराशि व्यवस्था (प्रारूप B5 - बिंदु 11)</h3>
              <div className="bm-grid two">
                <Field label="धनराशि स्रोत" required>
                  <SelectInput value={form.fundType} onChange={(e) => update("fundType", e.target.value)}>
                    <option value="Self">निजी स्रोत (By Self)</option>
                    <option value="KCC">किसान क्रेडिट कार्ड (KCC)</option>
                    <option value="Loan">बैंक ऋण (Bank Loan)</option>
                  </SelectInput>
                </Field>
                <Field label="बैंक का नाम" required>
                  <TextInput value={form.fundBankName} onChange={(e) => update("fundBankName", e.target.value)} placeholder="उदा. भारतीय स्टेट बैंक" />
                </Field>
              </div>

              <div className="bm-fund-card">
                <div className="bm-grid two">
                  <Field label={form.fundType === "Self" ? "खाता संख्या (Acc No)" : form.fundType === "KCC" ? "कार्ड संख्या (Card No)" : "लोन खाता (Loan No)"}>
                    <TextInput value={form.fundExtraVal1} onChange={(e) => update("fundExtraVal1", e.target.value)} />
                  </Field>
                  <Field label={form.fundType === "Self" ? "खाते में राशि / टिप्पणी" : form.fundType === "KCC" ? "क्रेडिट सीमा (Credit Limit)" : "लोन राशि (Loan Amount)"}>
                    <TextInput value={form.fundExtraVal2} onChange={(e) => update("fundExtraVal2", e.target.value)} />
                  </Field>
                </div>
              </div>

              <h3>ङ) प्रस्तावित फसल उत्पादन &amp; विपणन</h3>
              <div className="bm-grid three">
                <Field label="फसल का नाम">
                  <TextInput value={form.cropName} onChange={(e) => update("cropName", e.target.value)} placeholder="शिमला मिर्च" />
                </Field>
                <Field label="क्षेत्रफल (हैक्टर)">
                  <TextInput type="number" step="0.01" value={form.cropArea} onChange={(e) => update("cropArea", e.target.value)} placeholder="0.05" />
                </Field>
                <Field label="उत्पादन (कुंतल)">
                  <TextInput type="number" value={form.cropProd} onChange={(e) => update("cropProd", e.target.value)} placeholder="15" />
                </Field>
              </div>

              <Field label="विपणन व्यवस्था / रणनीति" required>
                <TextInput value={form.marketingStrategy} onChange={(e) => update("marketingStrategy", e.target.value)} />
              </Field>
            </div>
          )}

          {formSegment === "firm-supplier" && (
            <div className="bm-form-content">
              <h3>च) आपूर्तिकर्ता (Supplier Firm) विवरण</h3>

              <div className="bm-info-card amber">
                <strong>✨ सप्लायर बदलें / नया सहेजें:</strong>
                <span>
                  नीचे दिए फर्म डिटेल्स को बदलें और "सप्लायर सेव करें" दबाकर उसे
                  सुरक्षित रखें।
                </span>
              </div>

              <Field label="फर्म/आपूर्तिकर्ता का नाम" required>
                <TextInput value={form.firmName} onChange={(e) => update("firmName", e.target.value)} />
              </Field>

              <Field label="फर्म का पता (Address)" required>
                <TextInput value={form.firmAddress} onChange={(e) => update("firmAddress", e.target.value)} />
              </Field>

              <div className="bm-grid two">
                <Field label="GSTIN" required>
                  <TextInput value={form.firmGSTIN} onChange={(e) => update("firmGSTIN", e.target.value.toUpperCase())} />
                </Field>
                <Field label="बैंक खाता संख्या" required>
                  <TextInput value={form.firmBankAcc} onChange={(e) => update("firmBankAcc", e.target.value)} />
                </Field>
              </div>

              <div className="bm-grid two">
                <Field label="बैंक का नाम" required>
                  <TextInput value={form.firmBankName} onChange={(e) => update("firmBankName", e.target.value)} />
                </Field>
                <Field label="IFSC Code" required>
                  <TextInput value={form.firmIFSC} onChange={(e) => update("firmIFSC", e.target.value.toUpperCase())} />
                </Field>
              </div>

              <div className="bm-save-row">
                <button className="bm-primary-btn indigo" onClick={saveFirm}>
                  💾 सप्लायर सेव करें
                </button>
                <select className="bm-input" value={selectedFirm} onChange={(e) => loadFirm(e.target.value)}>
                  <option value="">-- लोड सप्लायर --</option>
                  {firms.map((firm) => (
                    <option key={firm.id} value={firm.id}>
                      {firm.firmName}
                    </option>
                  ))}
                </select>
              </div>

              <h3>छ) बिल / चालान क्रमांक एवं तिथि</h3>
              <div className="bm-grid two">
                <Field label="चालान (Invoice) सं०" required>
                  <TextInput value={form.invoiceNo} onChange={(e) => update("invoiceNo", e.target.value)} placeholder="उदा. AE/2026/024" />
                </Field>
                <Field label="चालान दिनांक" required>
                  <TextInput type="date" value={form.invoiceDate} onChange={(e) => update("invoiceDate", e.target.value)} />
                </Field>
              </div>
            </div>
          )}

          {formSegment === "cloud-records" && (
            <div className="bm-form-content">
              <h3>ज) क्लाउड डेटाबेस एवं सहेजे गए रिकॉर्ड</h3>

              <div className="bm-info-card green">
                <strong>📁 डेटाबेस कार्यक्षेत्र:</strong>
                <span>
                  इस React component में रिकॉर्ड ब्राउज़र localStorage में सुरक्षित
                  रहते हैं और reload के बाद भी उपलब्ध रहते हैं।
                </span>
              </div>

              <div className="bm-save-row">
                <button className="bm-primary-btn green" onClick={saveFarmer}>
                  💾 रिकॉर्ड सुरक्षित करें
                </button>
                <button className="bm-secondary-btn" onClick={resetForm}>
                  🧹 रीसेट
                </button>
              </div>

              <div className="bm-records-header">
                <strong>सहेजे गए किसान रिकॉर्ड्स सूची</strong>
                <span>{farmers.length} रिकॉर्ड</span>
              </div>

              <div className="bm-record-list">
                {farmers.length === 0 ? (
                  <p className="bm-empty">कोई रिकॉर्ड सहेजा नहीं गया है</p>
                ) : (
                  farmers.map((record) => (
                    <div className="bm-record-card" key={record.id}>
                      <button className="bm-record-load" onClick={() => loadFarmer(record)}>
                        <strong>{record.farmerName || "अज्ञात कृषक"}</strong>
                        <span>
                          {record.gardenCardNo} |{" "}
                          {record.schemeSelection === "anti-hail" ? "एंटीहेलनेट" : "मल्चिंग"}
                        </span>
                      </button>
                      <button className="bm-delete-btn" onClick={() => deleteFarmer(record.id)} title="हटाएं">
                        🗑
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          <div className="bm-financial">
            <div className="bm-financial-title">📊 वित्तीय सारांश:</div>
            <div className="bm-financial-grid">
              <div>
                <span>Total Cost</span>
                <strong>{formatCurrency(calculations.totalCost)}</strong>
              </div>
              <div>
                <span>Self Cont. (50%)</span>
                <strong className="green-text">{formatCurrency(calculations.farmerShare)}</strong>
              </div>
              <div>
                <span>Subsidy (50%)</span>
                <strong className="indigo-text">{formatCurrency(calculations.subsidyAmount)}</strong>
              </div>
            </div>
          </div>
        </section>

        <section className="bm-preview-panel">
          <div className="bm-preview-toolbar">
            <div className="bm-document-tabs">
              {[
                ["1", "आवेदन (B5)"],
                ["2", "आपूर्तिकर्ता बिल"],
                ["3", "शपथ पत्र"],
                ["4", "सत्यापन रिपोर्ट"],
              ].map(([id, label]) => (
                <button
                  key={id}
                  className={currentTab === Number(id) ? "active" : ""}
                  onClick={() => switchTab(Number(id))}
                >
                  <span>{id}.</span> {label}
                </button>
              ))}
            </div>
            <button className="bm-print-btn" onClick={printCurrentDocument}>
              🖨 <span>प्रिंट करें (A4)</span>
            </button>
          </div>

          <div className="bm-paper">
            {currentTab === 1 && (
              <div id="bm-document-1" className="bm-document bm-devanagari">
                <div className="bm-doc-header">
                  <h2>राज्य बागवानी मिशन, उत्तराखण्ड</h2>
                  <p>
                    जनपद: <u>{form.districtName || "_________"}</u> | उद्यान कार्ड संख्या:{" "}
                    <u>{form.gardenCardNo || "---"}</u>
                  </p>
                  <h1>बागवानी मिशन के अन्तर्गत संरक्षित खेती (Protected Cultivation) के लिये आवेदन हेतु प्रारूप-B5</h1>
                </div>

                <div className="bm-doc-two-col">
                  <div>
                    <p><strong>1. लाभार्थी का नाम:</strong> <u>{form.farmerName || "________"}</u></p>
                    <p><strong>2. पिता/पति का नाम:</strong> <u>{form.fatherName || "________"}</u></p>
                    <p><strong>3. लाभार्थी का पता (Address):</strong></p>
                    <div className="bm-doc-indent">
                      <p>गाँव का नाम: <u>{form.villageName || "________"}</u>, डाकखाना: <u>{form.postOffice || "________"}</u></p>
                      <p>विकासखण्ड: <u>{form.blockName || "________"}</u>, जनपद: <u>{form.districtName || "________"}</u></p>
                      <p>मोबाईल नं०: <u>{form.mobileNo || "________"}</u></p>
                    </div>
                  </div>
                  <div className="bm-photo-box">
                    <span>आवेदक का</span>
                    <span>नवीनतम</span>
                    <strong>फोटोग्राफ</strong>
                    <small>(सत्यापित)</small>
                  </div>
                </div>

                <div className="bm-doc-four-box">
                  <div>
                    <strong>4. लाभार्थी श्रेणी:</strong>
                    <p>{checkbox(form.farmerCategory === "सामान्य")} सामान्य वर्ग</p>
                    <p>{checkbox(form.farmerCategory === "SC")} SC</p>
                    <p>{checkbox(form.farmerCategory === "ST")} ST</p>
                    <p>{checkbox(form.farmerCategory === "अन्य")} पिछड़ा वर्ग</p>
                  </div>
                  <div>
                    <strong>5. कृषक श्रेणी / लिंग:</strong>
                    <p>{checkbox(form.farmerSize === "Small/Marginal")} लघु/सीमान्त</p>
                    <p>{checkbox(form.farmerSize === "Big farmer")} बड़े किसान</p>
                    <p>{checkbox(form.farmerGender === "Male")} पुरूष</p>
                    <p>{checkbox(form.farmerGender === "Female")} महिला</p>
                  </div>
                  <div>
                    <strong>6. क्षेत्र श्रेणी:</strong>
                    <p>{checkbox(form.terrainSelection === "hilly")} पर्वतीय (Hill)</p>
                    <p>{checkbox(form.terrainSelection === "plain")} मैदानी (Plain)</p>
                  </div>
                  <div>
                    <strong>7. शैक्षिक योग्यता:</strong>
                    <p>{checkbox(form.farmerEducation === "Non Metric")} नॉन-मैट्रिक</p>
                    <p>{checkbox(form.farmerEducation === "Metric")} मैट्रिक</p>
                    <p>{checkbox(form.farmerEducation === "Intermediate")} 12वीं (Inter)</p>
                    <p>{checkbox(form.farmerEducation === "Graduate")} स्नातक</p>
                  </div>
                </div>

                <div className="bm-doc-text-block">
                  <p>
                    <strong>8. लाभार्थी के नाम कुल कृषि योग्य भूमि (राजस्व अभिलेखों के अनुसार):</strong>{" "}
                    <u>{form.totalArableLand || "________"}</u> हेक्टेयर, बागवानी फसलों के अन्तर्गत क्षेत्रफल:{" "}
                    <u>{form.horticultureLand || "________"}</u> हेक्टेयर, सिंचाई सुविधा:{" "}
                    <u>{form.irrigationFacilities || "________"}</u>
                  </p>
                  <p>
                    <strong>9. प्रस्तावित कार्य के लिये चयनित भूमि का खसरा संख्या व क्षेत्रफल:</strong>{" "}
                    खसरा नं० <u>{form.khasraNo || "________"}</u>, कुल चयनित क्षेत्रफल{" "}
                    <u>{Number(form.areaSqm || 0).toLocaleString("en-IN")}</u> वर्ग मीटर
                  </p>
                </div>

                <div className="bm-doc-table-wrap">
                  <div className="bm-doc-section-title">10. प्रस्तावित कार्यक्रम (Proposed Programme) विवरण:</div>
                  <table>
                    <thead>
                      <tr>
                        <th>योजना का नाम</th>
                        <th>लागू दर एवं शर्ते (MIDH/HMNEH)</th>
                        <th>प्रस्तावित आकार (वर्ग मीटर)</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>{checkbox(form.schemeSelection === "anti-hail")} 3) एन्टी हैलनेट (Anti-Hail Net)</td>
                        <td>Total eligible cost Rs. 35/sqm. Assistance @ 50% of cost limited to 5000 sqm.</td>
                        <td>{form.schemeSelection === "anti-hail" ? Number(form.areaSqm || 0).toLocaleString("en-IN") : 0}</td>
                      </tr>
                      <tr>
                        <td>{checkbox(form.schemeSelection === "mulching")} 5) प्लास्टिक मल्चिंग (Plastic Mulching)</td>
                        <td>Rs. 32,000/ha (Plain) &amp; Rs. 36,800/ha (Hilly). Assistance @ 50% of cost limited to 2 ha.</td>
                        <td>{form.schemeSelection === "mulching" ? Number(form.areaSqm || 0).toLocaleString("en-IN") : 0}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="bm-doc-box">
                  <strong>11. धनराशि की व्यवस्था (Fund Arrangement Details):</strong>
                  <p>हम यहाँ प्रमाणित करते हैं कि स्वयं के निजी स्रोत / बैंक ऋण / KCC विवरण निम्नानुसार है:</p>
                  <div className="bm-highlight-line">
                    {form.fundType} | Bank: {form.fundBankName || "---"} | Acc No / Card No:{" "}
                    {form.fundExtraVal1 || "---"} | Credit Limit: {form.fundExtraVal2 || "N/A"}
                  </div>
                </div>

                <div className="bm-doc-two-boxes">
                  <div>
                    <strong>14. प्रस्तावित उत्पादन कार्यक्रम:</strong>
                    <p>फसल: <strong>{form.cropName || "---"}</strong> | क्षेत्रफल (है०): <strong>{form.cropArea || "---"}</strong> | उत्पादन (कु०): <strong>{form.cropProd || "---"}</strong></p>
                  </div>
                  <div>
                    <strong>17. विपणन व्यवस्था / रणनीति:</strong>
                    <p>{form.marketingStrategy || "---"}</p>
                  </div>
                </div>

                <div className="bm-doc-footer-grid">
                  <div>
                    <strong>19. संलग्न करें (Enclosures Checklist):</strong>
                    <p>☑ उद्रण खतौनी की प्रमाणित प्रति | ☑ मदवार व्यय विवरण (Bill)</p>
                    <p>☑ उद्यान कार्ड की छायाप्रति | ☑ आधार कार्ड की छायाप्रति</p>
                    <p>☑ ₹10 के स्टाम्प पेपर पर शपथ पत्र | ☑ बैंक स्टेटमेंट प्रति</p>
                  </div>
                  <div className="bm-signature">
                    <div />
                    <strong>आवेदक के हस्ताक्षर / अंगूठे का निशान</strong>
                  </div>
                </div>
              </div>
            )}

            {currentTab === 2 && (
              <div id="bm-document-2" className="bm-document bm-devanagari">
                <div className="bm-invoice-header">
                  <div>
                    <span className="bm-tax-label">TAX INVOICE</span>
                    <h1>{form.firmName || "M/S AVANI ENTERPRISES"}</h1>
                    <p>{form.firmAddress || "---"}</p>
                  </div>
                  <div className="bm-invoice-meta">
                    <p><strong>GSTIN:</strong> {form.firmGSTIN || "---"}</p>
                    <p><strong>Invoice No:</strong> {form.invoiceNo || "---"}</p>
                    <p><strong>Date:</strong> {formatDate(form.invoiceDate)}</p>
                  </div>
                </div>

                <div className="bm-bill-to">
                  <div>
                    <h3>Bill To / Deliver To:</h3>
                    <strong>{form.farmerName || "---"}</strong>
                    <p>S/o: {form.fatherName || "---"}</p>
                    <p>Village: {form.villageName || "---"}, Development Block: {form.blockName || "---"}</p>
                    <p>{form.districtName || "Uttarakhand"} (उत्तराखण्ड)</p>
                  </div>
                  <div>
                    <h3>Technical Specs Enforced:</h3>
                    <p><strong>Material Type:</strong> {form.schemeSelection === "anti-hail" ? form.netType : `${form.mulchingThickness} Micron (${form.mulchingColor})`}</p>
                    <p><strong>Standard Code:</strong> {calculations.standardCode}</p>
                    <p><strong>Khasra Number:</strong> {form.khasraNo || "---"}</p>
                  </div>
                </div>

                <table className="bm-invoice-table">
                  <thead>
                    <tr>
                      <th>S.No.</th>
                      <th>Description of Goods</th>
                      <th>HSN Code</th>
                      <th>Qty</th>
                      <th>Rate</th>
                      <th>Unit</th>
                      <th>Amount (₹)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>1</td>
                      <td><strong>{calculations.materialDescription || "---"}</strong><small>{calculations.subDescription}</small></td>
                      <td>{calculations.hsnCode}</td>
                      <td>{Number(form.areaSqm || 0).toLocaleString("en-IN")}</td>
                      <td>{formatCurrency(calculations.rate)}</td>
                      <td>SQM</td>
                      <td><strong>{formatCurrency(calculations.totalCost)}</strong></td>
                    </tr>
                    <tr>
                      <td colSpan="6" className="text-right"><strong>Total Cost:</strong></td>
                      <td><strong>{formatCurrency(calculations.totalCost)}</strong></td>
                    </tr>
                    <tr className="bm-grand-total">
                      <td colSpan="6" className="text-right"><strong>Grand Total (Inclusive of Subsidy):</strong></td>
                      <td><strong>{formatCurrency(calculations.totalCost)}</strong></td>
                    </tr>
                  </tbody>
                </table>

                <div className="bm-invoice-footer">
                  <div>
                    <div className="bm-bank-box">
                      <h4>🏦 Supplier Bank Details (For Direct Subsidy Release):</h4>
                      <p><strong>Bank Name:</strong> {form.firmBankName || "---"}</p>
                      <p><strong>Account Number:</strong> {form.firmBankAcc || "---"}</p>
                      <p><strong>IFSC Code:</strong> {form.firmIFSC || "---"}</p>
                    </div>
                    <p className="bm-small-note">* Received/Delivered the above mentioned material in good condition.</p>
                    <p className="bm-small-note">* Interest will be charged at 18% p.a on overdue payments.</p>
                  </div>
                  <div className="bm-authorized">
                    <p>For <strong>{form.firmName || "---"}</strong></p>
                    <div>Authorised Stamp</div>
                    <strong>Authorised Signatory</strong>
                  </div>
                </div>
              </div>
            )}

            {currentTab === 3 && (
              <div id="bm-document-3" className="bm-document bm-devanagari">
                <div className="bm-affidavit-header">
                  <h1>शपथ पत्र (AFFIDAVIT)</h1>
                  <p>Non-Judicial Stamp Paper value of ₹10/-</p>
                </div>

                <div className="bm-affidavit-body">
                  <p className="bm-affidavit-opening">
                    मैं, <strong><u>{form.farmerName || "___________"}</u></strong>, पुत्र/पुत्री/पत्नी श्री{" "}
                    <strong><u>{form.fatherName || "___________"}</u></strong>, निवासी ग्राम:{" "}
                    <strong><u>{form.villageName || "___________"}</u></strong>, विकासखण्ड:{" "}
                    <strong><u>{form.blockName || "___________"}</u></strong>, जनपद:{" "}
                    <strong><u>{form.districtName || "___________"}</u></strong>, उत्तराखण्ड, आज दिनांक{" "}
                    <strong><u>{formatDate(form.invoiceDate)}</u></strong> को यह शपथ पत्र अपनी सच्चाई एवं शुद्धता के साथ प्रस्तुत करता/करती हूँ कि:
                  </p>

                  <ol>
                    <li>
                      मैंने अपनी भूमि (खसरा संख्या <strong>{form.khasraNo || "---"}</strong>) में{" "}
                      <strong>{form.schemeSelection === "anti-hail" ? "एंटीहेलनेट (Anti-Hail Net)" : "मल्चिंग शीट (Mulching Sheet)"}</strong> की स्थापना का कार्य{" "}
                      <strong>{form.firmName || "___________"}</strong> द्वारा विभागीय मानकों (MIDH) एवं BIS ग्रेड के अनुसार पूर्ण करा लिया है। कार्य की गुणवत्ता, क्षेत्रफल एवं निर्माण सामग्री (BIS मानक) से मैं पूर्णतः संतुष्ट हूँ।
                    </li>
                    <li>
                      <strong>कार्य एवं वित्तीय विश्लेषण का विवरण:</strong>
                      <ul>
                        <li>कुल स्थापित/स्वीकृत क्षेत्रफल: <strong>{Number(form.areaSqm || 0).toLocaleString("en-IN")}</strong> वर्ग मीटर</li>
                        <li>निर्माण सामग्री/शीट्स की कुल लागत: <strong>{formatCurrency(calculations.totalCost)}</strong></li>
                        <li>मेरा स्वयं का 50% अंशदान: <strong>{formatCurrency(calculations.farmerShare)}</strong></li>
                        <li>विभागीय अनुदान राशि (50%): <strong>{formatCurrency(calculations.subsidyAmount)}</strong></li>
                      </ul>
                    </li>
                    <li>मैं यह प्रमाणित करता/करती हूँ कि मुझे या मेरे परिवार के किसी भी सदस्य को विगत वर्षों में कभी भी इस मद हेतु विभागीय सहायता/अनुदान प्राप्त नहीं हुआ है।</li>
                    <li>स्थापित संरचना की सुरक्षा, आगजनी, ओलावृष्टि, फटने, जंगली जानवरों द्वारा क्षति तथा नियमित देखभाल की समस्त जिम्मेदारी मेरी स्वयं की होगी, इसके लिए विभाग जिम्मेदार नहीं होगा।</li>
                    <li>मैंने आपूर्तिकर्ता संस्था <strong>{form.firmName || "___________"}</strong> को अपना 50% अंशदान पूर्णतः अदा कर दिया है। अतः विभाग से नम्र निवेदन है कि देय 50% अनुदान राशि सीधे उक्त आपूर्तिकर्ता फर्म के बैंक खाते में अवमुक्त करने की कृपा करें।</li>
                  </ol>

                  <div className="bm-declaration">
                    <h3>अंतिम घोषणा:</h3>
                    <p>
                      मैं, उपरोक्त शपथपत्र की सभी बातों को अपने निजी ज्ञान एवं विश्वास के अनुसार सत्य एवं सही मानता/मानती हूँ। इसमें कोई भी तथ्य छिपाया नहीं गया है। यदि उपरोक्त में से कोई भी कथन असत्य पाया गया, तो मुझे प्राप्त अनुदान राशि वापस करने तथा कानूनी कार्यवाही भुगतने हेतु मैं पूर्ण रूप से सहमत हूँ।
                    </p>
                  </div>

                  <div className="bm-signatures">
                    <div>
                      <p>गवाहों के नाम व हस्ताक्षर:</p>
                      <p>1. ___________________</p>
                      <p>2. ___________________</p>
                    </div>
                    <div className="bm-signature centered">
                      <div />
                      <strong>शपथी/शपथकर्ता के हस्ताक्षर</strong>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {currentTab === 4 && (
              <div id="bm-document-4" className="bm-document bm-devanagari">
                <div className="bm-doc-header">
                  <span className="bm-office-copy">कार्यालय प्रति</span>
                  <h1>भौतिक सत्यापन रिपोर्ट (एटीहेलनेट / मल्चिंग शीट)</h1>
                  <p>राज्य बागवानी मिशन, उत्तराखण्ड</p>
                </div>

                <div className="bm-doc-two-col">
                  <div className="bm-verification-card">
                    <h3>1. कृषक एवं भूमि का विवरण:</h3>
                    <p><strong>कृषक का नाम:</strong> {form.farmerName || "---"}</p>
                    <p><strong>पिता/पति का नाम:</strong> {form.fatherName || "---"}</p>
                    <p><strong>ग्राम व विकासखंड:</strong> ग्राम: {form.villageName || "---"}, विकासखंड: {form.blockName || "---"}, {form.districtName || "---"}</p>
                    <p><strong>मोबाइल नंबर:</strong> {form.mobileNo || "---"}</p>
                    <p><strong>कृषक श्रेणी / लिंग:</strong> {categoryLabel[form.farmerCategory]} / {form.farmerGender === "Male" ? "पुरुष" : "महिला"}</p>
                  </div>
                  <div className="bm-verification-card">
                    <h3>2. आपूर्तिकर्ता फर्म का विवरण:</h3>
                    <p><strong>फर्म का नाम:</strong> {form.firmName || "---"}</p>
                    <p><strong>निःशुल्क स्थापना सुविधा:</strong> ☑ हाँ (फर्म द्वारा निशुल्क की गई)</p>
                    <p><strong>वारंटी प्रमाण-पत्र प्राप्त:</strong> ☑ हाँ</p>
                    <p><strong>वारंटी अवधि:</strong> {calculations.warranty}</p>
                    <p><strong>खसरा संख्या:</strong> {form.khasraNo || "---"}</p>
                  </div>
                </div>

                <div className="bm-doc-table-wrap">
                  <h3>3. स्थापना एवं तकनीकी सत्यापन (मौके पर जांच):</h3>
                  <table>
                    <thead>
                      <tr>
                        <th>अवयव (टिक करें)</th>
                        <th>स्वीकृत क्षेत्रफल (M²)</th>
                        <th>मौके पर मापा (M²)</th>
                        <th>लागू BIS मानक</th>
                        <th>कार्य की स्थिति</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>{form.schemeSelection === "anti-hail" ? "एंटीहेलनेट (Anti-Hail Net)" : "मल्चिंग शीट (Mulching Sheet)"}</td>
                        <td>{Number(form.areaSqm || 0).toLocaleString("en-IN")}</td>
                        <td>{Number(form.areaSqm || 0).toLocaleString("en-IN")}</td>
                        <td>{calculations.standardCode}</td>
                        <td className="status-ok">☑ सन्तोषजनक</td>
                      </tr>
                    </tbody>
                  </table>
                  <p className="bm-spec-note">Specs Check: {calculations.materialDescription} | Status: {calculations.subDescription}</p>
                </div>

                <div className="bm-doc-table-wrap">
                  <h3>4. वित्तीय विवरण (Financial Summary):</h3>
                  <table>
                    <thead>
                      <tr>
                        <th>क्र.स.</th>
                        <th>विवरण</th>
                        <th>धनराशि (रुपयों में)</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr><td>1</td><td>कुल स्वीकृत/सत्यापित लागत (Total Cost)</td><td>{formatCurrency(calculations.totalCost)}</td></tr>
                      <tr><td>2</td><td>कृषक द्वारा वहन की गई धनराशि (50% Share)</td><td>{formatCurrency(calculations.farmerShare)}</td></tr>
                      <tr className="bm-sub-total"><td>3</td><td>फर्म को अवमुक्त की जाने वाली अनुदान राशि (50% Subsidy)</td><td>{formatCurrency(calculations.subsidyAmount)}</td></tr>
                    </tbody>
                  </table>
                </div>

                <div className="bm-certification">
                  <p>
                    <strong>प्रमाण-पत्र एवं संस्तुति:</strong> प्रमाणित किया जाता है कि हमारे द्वारा कृषक के प्रक्षेत्र का भौतिक सत्यापन किया गया। कृषक द्वारा स्थापित की गई संरचना का कार्य पूर्णतया सन्तोषजनक, स्वीकृत तकनीकी मानदंडों, विभागीय दिशा-निर्देशों एवं निर्धारित BIS मानकों के सर्वथा अनुरूप पाया गया है।
                  </p>
                  <p>
                    अतः लाभार्थी को देय अनुदान राशि रुपये <strong><u>{formatCurrency(calculations.subsidyAmount)} /-</u></strong> मात्र, सीधे अनुबंधित/अधिकृत आपूर्तिदाता फर्म <strong>{form.firmName || "___________"}</strong> को भुगतान किए जाने हेतु संस्तुति सहित अग्रसारित की जाती है।
                  </p>
                </div>

                <div className="bm-verification-signatures">
                  <div>
                    <div />
                    <strong>कृषक के हस्ताक्षर</strong>
                    <small>दिनांक: {formatDate(form.invoiceDate)}</small>
                  </div>
                  <div>
                    <div />
                    <strong>सत्यापन अधिकारी के हस्ताक्षर व मोहर</strong>
                    <small>उद्यान विभाग, उत्तराखंड शासन</small>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>

      {toast && (
        <div className="bm-toast">
          <span>{toast.icon}</span>
          {toast.message}
        </div>
      )}
    </div>
  );
}
