import React, { useEffect, useMemo, useState } from "react";
import "./PMKSY.css";

/*
  PMKSY.jsx
  React conversion of the Uttarakhand Horticulture Mission document portal.

  Included functionality:
  - Farmer / land / scheme / fund / supplier segmented form
  - Dynamic Anti-Hail Net / Plastic Mulching inputs
  - Dynamic rate, total cost, 50% farmer share and 50% subsidy
  - Four live documents: B5 Application, Supplier Invoice, Affidavit, Verification
  - Demo data
  - Local saved farmer records and supplier profiles
  - Load / delete / reset
  - A4 printing of the currently selected document
  - No HTML document or CDN script is required
*/

const INITIAL = {
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
  firmAddress: "LAKHERA BHAWAN VILL. SHIBOONAGAR, KOTDWAR, GARHWAL",
  firmGSTIN: "05COWPD8094K1Z6",
  firmBankAcc: "025110100000143",
  firmBankName: "ALMORA URBAN CO-OPERATIVE BANK",
  firmIFSC: "AUCB0000026",
  invoiceNo: "",
  invoiceDate: new Date().toISOString().slice(0, 10),
};

const STORAGE_FARMERS = "pmksy_horticulture_farmers";
const STORAGE_FIRMS = "pmksy_horticulture_firms";

const money = (value) =>
  `₹${Number(value || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const num = (value) => Number.parseFloat(value) || 0;

const dateIN = (value) =>
  value
    ? new Date(`${value}T00:00:00`).toLocaleDateString("hi-IN")
    : "___/___/_____";

const safe = (value, fallback = "___________") =>
  value === undefined || value === null || value === "" ? fallback : value;

function amountInWords(n) {
  const value = Math.round(Number(n) || 0);
  if (value === 0) return "शून्य";
  const ones = [
    "",
    "एक",
    "दो",
    "तीन",
    "चार",
    "पाँच",
    "छः",
    "सात",
    "आठ",
    "नौ",
    "दस",
    "ग्यारह",
    "बारह",
    "तेरह",
    "चौदह",
    "पंद्रह",
    "सोलह",
    "सत्रह",
    "अठारह",
    "उन्नीस",
  ];
  const tens = [
    "",
    "",
    "बीस",
    "तीस",
    "चालीस",
    "पचास",
    "साठ",
    "सत्तर",
    "अस्सी",
    "नब्बे",
  ];
  const under100 = (x) =>
    x < 20
      ? ones[x]
      : `${tens[Math.floor(x / 10)]}${x % 10 ? ` ${ones[x % 10]}` : ""}`;
  const under1000 = (x) =>
    x < 100
      ? under100(x)
      : `${ones[Math.floor(x / 100)]} सौ${x % 100 ? ` ${under100(x % 100)}` : ""}`;

  let result = [];
  if (Math.floor(value / 10000000)) {
    result.push(`${under100(Math.floor(value / 10000000))} करोड़`);
  }
  const lakh = Math.floor((value % 10000000) / 100000);
  if (lakh) result.push(`${under100(lakh)} लाख`);
  const thousand = Math.floor((value % 100000) / 1000);
  if (thousand) result.push(`${under100(thousand)} हजार`);
  const rem = value % 1000;
  if (rem) result.push(under1000(rem));
  return result.join(" ");
}

function Check({ active }) {
  return (
    <span className={`pm-check ${active ? "active" : ""}`}>
      {active ? "✓" : ""}
    </span>
  );
}

export default function PMKSY() {
  const [form, setForm] = useState(INITIAL);
  const [formSegment, setFormSegment] = useState("farmer");
  const [documentTab, setDocumentTab] = useState(1);
  const [toast, setToast] = useState(null);
  const [farmers, setFarmers] = useState([]);
  const [firms, setFirms] = useState([]);

  const showToast = (message, icon = "✓") => {
    setToast({ message, icon });
    window.clearTimeout(window.__pmksyToast);
    window.__pmksyToast = window.setTimeout(() => setToast(null), 3200);
  };

  useEffect(() => {
    try {
      setFarmers(JSON.parse(localStorage.getItem(STORAGE_FARMERS) || "[]"));
      setFirms(JSON.parse(localStorage.getItem(STORAGE_FIRMS) || "[]"));
    } catch {
      setFarmers([]);
      setFirms([]);
    }
  }, []);

  const update = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const calculated = useMemo(() => {
    const antiHail = form.schemeSelection === "anti-hail";
    let rate = 0;
    let materialDescription = "";
    let subDescription = "";
    let hsnCode = "";
    let standardCode = "";
    let warranty = "";

    if (antiHail) {
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

    const totalCost = num(form.areaSqm) * rate;
    return {
      rate,
      totalCost,
      farmerShare: totalCost * 0.5,
      subsidy: totalCost * 0.5,
      materialDescription,
      subDescription,
      hsnCode,
      standardCode,
      warranty,
      antiHail,
    };
  }, [form]);

  const saveFarmers = (items) => {
    setFarmers(items);
    localStorage.setItem(STORAGE_FARMERS, JSON.stringify(items));
  };

  const saveFirms = (items) => {
    setFirms(items);
    localStorage.setItem(STORAGE_FIRMS, JSON.stringify(items));
  };

  const saveFarmer = () => {
    const id = form.gardenCardNo.trim() || `TEMP-${Date.now()}`;
    const record = { ...form, gardenCardNo: id, lastUpdated: Date.now() };
    const next = farmers.filter((x) => x.gardenCardNo !== id);
    saveFarmers([record, ...next]);
    update("gardenCardNo", id);
    showToast(`कृषक रिकॉर्ड "${safe(form.farmerName, id)}" सुरक्षित किया गया।`);
  };

  const loadFarmer = (id) => {
    const record = farmers.find((x) => x.gardenCardNo === id);
    if (!record) return;
    setForm({ ...INITIAL, ...record });
    setFormSegment("farmer");
    showToast(`कृषक रिकॉर्ड "${safe(record.farmerName)}" लोड किया गया।`);
  };

  const deleteFarmer = (id) => {
    if (!window.confirm("क्या आप इस कृषक रिकॉर्ड को हटाना चाहते हैं?")) return;
    saveFarmers(farmers.filter((x) => x.gardenCardNo !== id));
    showToast("कृषक रिकॉर्ड सूची से हटा दिया गया।", "🗑");
  };

  const saveFirm = () => {
    const name = form.firmName.trim();
    if (!name) {
      showToast("कृपया वैध फर्म का नाम दर्ज करें।", "!");
      return;
    }
    const record = {
      firmName: name,
      firmAddress: form.firmAddress,
      firmGSTIN: form.firmGSTIN,
      firmBankAcc: form.firmBankAcc,
      firmBankName: form.firmBankName,
      firmIFSC: form.firmIFSC,
      lastUpdated: Date.now(),
    };
    const next = firms.filter((x) => x.firmName !== name);
    saveFirms([record, ...next]);
    showToast(`सप्लायर "${name}" सुरक्षित किया गया।`);
  };

  const loadFirm = (name) => {
    const record = firms.find((x) => x.firmName === name);
    if (!record) return;
    setForm((prev) => ({ ...prev, ...record }));
    showToast(`सप्लायर "${name}" लोड किया गया।`);
  };

  const resetForm = () => {
    setForm({ ...INITIAL, invoiceDate: new Date().toISOString().slice(0, 10) });
    showToast("सभी फ़ॉर्म फ़ील्ड्स रीसेट कर दिए गए हैं।");
  };

  const loadDemo = () => {
    setForm({
      ...INITIAL,
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
      netType: "Leno Knitted",
      fundType: "KCC",
      fundBankName: "उत्तराखंड ग्रामीण बैंक",
      fundExtraVal1: "CardNo-29302213",
      fundExtraVal2: "₹1,50,000/-",
      cropName: "शिमला मिर्च (Solan Hybrid)",
      cropArea: "0.08",
      cropProd: "24",
      marketingStrategy:
        "स्थानीय कोटद्वार मंडी एवं निकटवर्ती देहरादून सब्जी मंडियों में सीधे बिक्री की जाएगी।",
      invoiceNo: "AE/2026/024",
      invoiceDate: "2026-07-06",
    });
    showToast("डेमो डेटा चारों दस्तावेजों में सफलतापूर्वक भर दिया गया।", "⚡");
  };

  const printCurrent = () => {
    window.print();
  };

  const setScheme = (value) => update("schemeSelection", value);
  const setFund = (value) => update("fundType", value);

  return (
    <div className="pmksy-app">
      <header className="pmksy-header no-print">
        <div className="pmksy-header-inner">
          <div className="brand-wrap">
            <div className="brand-mark">🌿</div>
            <div>
              <h1 className="pmksy-brand-title">
                राज्य बागवानी मिशन, उत्तराखण्ड
              </h1>
              <p className="pmksy-brand-subtitle">
                Document Automation &amp; Cloud Database Portal
              </p>
            </div>
          </div>
          <div className="header-actions">
            <button className="btn btn-header" onClick={loadDemo}>
              ⚡ Demo Data
            </button>
            <span className="sync-pill">
              <i /> Local Sync Active
            </span>
          </div>
        </div>
      </header>

      <div className="instruction-bar no-print">
        <div className="instruction-inner">
          <span>
            <b>स्वीकृत अनुक्रम:</b> 1. आवेदन प्रपत्र (B5) ➜ 2. आपूर्तिकर्ता बिल
            ➜ 3. शपथ पत्र ➜ 4. सत्यापन रिपोर्ट
          </span>
          <span className="instruction-badge">
            सभी 4 डाक्यूमेंट्स एक साथ ऑटो-फिल होते हैं
          </span>
        </div>
      </div>

      <main className="pmksy-workspace">
        <section className="form-panel no-print">
          <div className="segment-tabs">
            {[
              ["farmer", "1. कृषक और भूमि"],
              ["scheme", "2. योजना व फंड"],
              ["firm", "3. फर्म & बैंक"],
              ["records", "4. सहेजे गए रिकॉर्ड"],
            ].map(([key, label]) => (
              <button
                key={key}
                className={formSegment === key ? "segment active" : "segment"}
                onClick={() => setFormSegment(key)}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="form-scroll">
            {formSegment === "farmer" && (
              <FarmerForm form={form} update={update} />
            )}

            {formSegment === "scheme" && (
              <SchemeForm
                form={form}
                update={update}
                calculated={calculated}
                setScheme={setScheme}
                setFund={setFund}
              />
            )}

            {formSegment === "firm" && (
              <FirmForm
                form={form}
                update={update}
                firms={firms}
                saveFirm={saveFirm}
                loadFirm={loadFirm}
              />
            )}

            {formSegment === "records" && (
              <RecordsForm
                farmers={farmers}
                saveFarmer={saveFarmer}
                resetForm={resetForm}
                loadFarmer={loadFarmer}
                deleteFarmer={deleteFarmer}
              />
            )}

            <div className="financial-card">
              <div className="financial-title">📊 वित्तीय सारांश</div>
              <div className="financial-grid">
                <div>
                  Total Cost<strong>{money(calculated.totalCost)}</strong>
                </div>
                <div>
                  Self Cont. (50%)
                  <strong className="green">
                    {money(calculated.farmerShare)}
                  </strong>
                </div>
                <div>
                  Subsidy (50%)
                  <strong className="indigo">
                    {money(calculated.subsidy)}
                  </strong>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="preview-panel">
          <div className="document-toolbar no-print">
            <div className="document-tabs">
              {[
                ["1", "आवेदन (B5)"],
                ["2", "आपूर्तिकर्ता बिल"],
                ["3", "शपथ पत्र"],
                ["4", "सत्यापन रिपोर्ट"],
              ].map(([key, label]) => (
                <button
                  key={key}
                  className={
                    documentTab === Number(key) ? "doc-tab active" : "doc-tab"
                  }
                  onClick={() => setDocumentTab(Number(key))}
                >
                  <span>{key}.</span> {label}
                </button>
              ))}
            </div>
            <button className="btn btn-print" onClick={printCurrent}>
              🖨 प्रिंट करें (A4)
            </button>
          </div>

          <div className="paper-shell" id="pmksy-print-area">
            {documentTab === 1 && (
              <ApplicationDocument form={form} calculated={calculated} />
            )}
            {documentTab === 2 && (
              <InvoiceDocument form={form} calculated={calculated} />
            )}
            {documentTab === 3 && (
              <AffidavitDocument form={form} calculated={calculated} />
            )}
            {documentTab === 4 && (
              <VerificationDocument form={form} calculated={calculated} />
            )}
          </div>
        </section>
      </main>

      {toast && (
        <div className="pmksy-toast">
          <span>{toast.icon}</span>
          <strong>{toast.message}</strong>
        </div>
      )}
    </div>
  );
}

function SectionTitle({ children }) {
  return <h3 className="form-section-title">{children}</h3>;
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  placeholder = "",
  disabled = false,
}) {
  return (
    <label className="pmksy-field">
      <span>{label}</span>
      <input
        type={type}
        value={value ?? ""}
        placeholder={placeholder}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  );
}

function SelectField({ label, value, onChange, options }) {
  return (
    <label className="pmksy-field">
      <span>{label}</span>
      <select value={value} onChange={(e) => onChange(e.target.value)}>
        {options.map(([v, text]) => (
          <option key={v} value={v}>
            {text}
          </option>
        ))}
      </select>
    </label>
  );
}

function FarmerForm({ form, update }) {
  return (
    <div className="form-content devanagari">
      <SectionTitle>क) कृषक प्रोफाइल (B5 के अनुसार)</SectionTitle>
      <div className="grid-2">
        <Field
          label="लाभार्थी का नाम *"
          value={form.farmerName}
          onChange={(v) => update("farmerName", v)}
          placeholder="उदा. सुरेश प्रसाद"
        />
        <Field
          label="पिता/पति का नाम *"
          value={form.fatherName}
          onChange={(v) => update("fatherName", v)}
          placeholder="उदा. राम लाल"
        />
      </div>
      <div className="grid-3">
        <Field
          label="ग्राम *"
          value={form.villageName}
          onChange={(v) => update("villageName", v)}
          placeholder="शिबूनगर"
        />
        <Field
          label="डाकखाना *"
          value={form.postOffice}
          onChange={(v) => update("postOffice", v)}
          placeholder="कोटद्वार"
        />
        <Field
          label="विकासखण्ड *"
          value={form.blockName}
          onChange={(v) => update("blockName", v)}
          placeholder="दुगड्डा"
        />
      </div>
      <div className="grid-2">
        <Field
          label="जनपद *"
          value={form.districtName}
          onChange={(v) => update("districtName", v)}
        />
        <Field
          label="मोबाइल नंबर *"
          value={form.mobileNo}
          onChange={(v) =>
            update("mobileNo", v.replace(/\D/g, "").slice(0, 10))
          }
          placeholder="10 अंकों का"
        />
      </div>
      <div className="grid-3">
        <SelectField
          label="शैक्षिक योग्यता *"
          value={form.farmerEducation}
          onChange={(v) => update("farmerEducation", v)}
          options={[
            ["Non Metric", "Non-Metric"],
            ["Metric", "Metric (10वीं)"],
            ["Intermediate", "Intermediate (12वीं)"],
            ["Graduate", "Graduate (स्नातक)"],
          ]}
        />
        <SelectField
          label="लाभार्थी लिंग *"
          value={form.farmerGender}
          onChange={(v) => update("farmerGender", v)}
          options={[
            ["Male", "पुरुष (Male)"],
            ["Female", "महिला (Female)"],
          ]}
        />
        <SelectField
          label="कृषक प्रकार *"
          value={form.farmerSize}
          onChange={(v) => update("farmerSize", v)}
          options={[
            ["Small/Marginal", "लघु / सीमान्त"],
            ["Big farmer", "बड़े किसान"],
          ]}
        />
      </div>
      <div className="grid-2">
        <Field
          label="उद्यान कार्ड संख्या"
          value={form.gardenCardNo}
          onChange={(v) => update("gardenCardNo", v)}
          placeholder="उदा. UK-HR-1094"
        />
        <SelectField
          label="लाभार्थी की श्रेणी *"
          value={form.farmerCategory}
          onChange={(v) => update("farmerCategory", v)}
          options={[
            ["सामान्य", "सामान्य वर्ग (General)"],
            ["SC", "अनुसूचित जाति (SC)"],
            ["ST", "अनुसूचित जनजाति (ST)"],
            ["अन्य", "अन्य पिछड़ा वर्ग (OBC)"],
          ]}
        />
      </div>

      <SectionTitle>ख) कृषि योग्य भूमि का विवरण</SectionTitle>
      <div className="grid-3">
        <Field
          label="कुल भूमि (है०) *"
          type="number"
          value={form.totalArableLand}
          onChange={(v) => update("totalArableLand", v)}
          placeholder="0.50"
        />
        <Field
          label="बागवानी भूमि *"
          type="number"
          value={form.horticultureLand}
          onChange={(v) => update("horticultureLand", v)}
          placeholder="0.20"
        />
        <Field
          label="सिंचाई सुविधा *"
          value={form.irrigationFacilities}
          onChange={(v) => update("irrigationFacilities", v)}
          placeholder="स्प्रिंकलर / नहर"
        />
      </div>
    </div>
  );
}

function SchemeForm({ form, update, calculated, setScheme, setFund }) {
  return (
    <div className="form-content devanagari">
      <SectionTitle>ग) प्रस्तावित योजना व तकनीकी संरचना</SectionTitle>
      <div className="grid-2">
        <Field
          label="खसरा संख्या *"
          value={form.khasraNo}
          onChange={(v) => update("khasraNo", v)}
          placeholder="उदा. 452/3"
        />
        <Field
          label="स्वीकृत क्षेत्रफल (Sqm) *"
          type="number"
          value={form.areaSqm}
          onChange={(v) => update("areaSqm", v)}
          placeholder="उदा. 500"
        />
      </div>
      <div className="grid-2">
        <SelectField
          label="चयनित योजना *"
          value={form.schemeSelection}
          onChange={setScheme}
          options={[
            ["anti-hail", "एंटी-हेलनेट (Anti-Hail Net)"],
            ["mulching", "प्लास्टिक मल्चिंग (Plastic Mulching)"],
          ]}
        />
        <SelectField
          label="भौगोलिक श्रेणी *"
          value={form.terrainSelection}
          onChange={(v) => update("terrainSelection", v)}
          options={[
            ["hilly", "पर्वतीय क्षेत्र (Hilly Area)"],
            ["plain", "मैदानी क्षेत्र (Plain Area)"],
          ]}
        />
      </div>

      {calculated.antiHail ? (
        <div className="conditional-card">
          <b>एंटी-हैलनेट विवरण:</b>
          <div className="grid-2">
            <SelectField
              label="नेट प्रकार"
              value={form.netType}
              onChange={(v) => update("netType", v)}
              options={[
                ["Woven", "Woven (बुना हुआ)"],
                ["Leno Knitted", "Leno Knitted"],
                ["Raschel", "Raschel"],
              ]}
            />
            <Field
              label="मानक दर"
              value="₹35.00 / Sqm"
              onChange={() => {}}
              disabled
            />
          </div>
        </div>
      ) : (
        <div className="conditional-card">
          <b>मल्चिंग शीट विवरण:</b>
          <div className="grid-2">
            <SelectField
              label="मोटाई (Microns)"
              value={form.mulchingThickness}
              onChange={(v) => update("mulchingThickness", v)}
              options={[
                ["25", "25 Micron"],
                ["30", "30 Micron"],
                ["50", "50 Micron"],
              ]}
            />
            <SelectField
              label="रंग (Color)"
              value={form.mulchingColor}
              onChange={(v) => update("mulchingColor", v)}
              options={[
                ["Black & White", "Black & White"],
                ["Black", "Black Only"],
                ["Silver", "Silver"],
              ]}
            />
          </div>
        </div>
      )}

      <SectionTitle>घ) धनराशि व्यवस्था (प्रारूप B5 - बिंदु 11)</SectionTitle>
      <div className="grid-2">
        <SelectField
          label="धनराशि स्रोत *"
          value={form.fundType}
          onChange={setFund}
          options={[
            ["Self", "निजी स्रोत (By Self)"],
            ["KCC", "किसान क्रेडिट कार्ड (KCC)"],
            ["Loan", "बैंक ऋण (Bank Loan)"],
          ]}
        />
        <Field
          label="बैंक का नाम *"
          value={form.fundBankName}
          onChange={(v) => update("fundBankName", v)}
          placeholder="उदा. भारतीय स्टेट बैंक"
        />
      </div>
      <div className="conditional-card indigo-card">
        <div className="grid-2">
          <Field
            label={
              form.fundType === "KCC" ? "खाता / कार्ड संख्या" : "खाता संख्या"
            }
            value={form.fundExtraVal1}
            onChange={(v) => update("fundExtraVal1", v)}
            placeholder="3940201021"
          />
          <Field
            label={form.fundType === "KCC" ? "क्रेडिट लिमिट" : "अतिरिक्त विवरण"}
            value={form.fundExtraVal2}
            onChange={(v) => update("fundExtraVal2", v)}
            placeholder="N/A"
          />
        </div>
      </div>

      <SectionTitle>ङ) प्रस्तावित फसल उत्पादन & विपणन</SectionTitle>
      <div className="grid-3">
        <Field
          label="फसल का नाम"
          value={form.cropName}
          onChange={(v) => update("cropName", v)}
          placeholder="शिमला मिर्च"
        />
        <Field
          label="क्षेत्रफल (हैक्टर)"
          type="number"
          value={form.cropArea}
          onChange={(v) => update("cropArea", v)}
          placeholder="0.05"
        />
        <Field
          label="उत्पादन (कुंतल)"
          type="number"
          value={form.cropProd}
          onChange={(v) => update("cropProd", v)}
          placeholder="15"
        />
      </div>
      <Field
        label="विपणन व्यवस्था / रणनीति *"
        value={form.marketingStrategy}
        onChange={(v) => update("marketingStrategy", v)}
      />
    </div>
  );
}

function FirmForm({ form, update, firms, saveFirm, loadFirm }) {
  return (
    <div className="form-content devanagari">
      <SectionTitle>च) आपूर्तिकर्ता (Supplier Firm) विवरण</SectionTitle>
      <div className="notice-card">
        <b>✨ सप्लायर बदलें / नया सहेजें</b>
        <p>
          नीचे दिए फर्म डिटेल्स को बदलें और सप्लायर सेव करें। सेव किए गए सप्लायर
          अगली बार सीधे लोड किए जा सकते हैं।
        </p>
      </div>
      <Field
        label="फर्म/आपूर्तिकर्ता का नाम *"
        value={form.firmName}
        onChange={(v) => update("firmName", v)}
      />
      <Field
        label="फर्म का पता (Address) *"
        value={form.firmAddress}
        onChange={(v) => update("firmAddress", v)}
      />
      <div className="grid-2">
        <Field
          label="GSTIN *"
          value={form.firmGSTIN}
          onChange={(v) => update("firmGSTIN", v.toUpperCase())}
        />
        <Field
          label="बैंक खाता संख्या *"
          value={form.firmBankAcc}
          onChange={(v) => update("firmBankAcc", v)}
        />
      </div>
      <div className="grid-2">
        <Field
          label="बैंक का नाम *"
          value={form.firmBankName}
          onChange={(v) => update("firmBankName", v)}
        />
        <Field
          label="IFSC Code *"
          value={form.firmIFSC}
          onChange={(v) => update("firmIFSC", v.toUpperCase())}
        />
      </div>
      <div className="button-row">
        <button className="btn btn-indigo" onClick={saveFirm}>
          💾 सप्लायर सेव करें
        </button>
        <select
          className="load-select"
          value=""
          onChange={(e) => loadFirm(e.target.value)}
        >
          <option value="">-- लोड सप्लायर --</option>
          {firms.map((firm) => (
            <option key={firm.firmName} value={firm.firmName}>
              {firm.firmName}
            </option>
          ))}
        </select>
      </div>

      <SectionTitle>छ) बिल / चालान क्रमांक एवं तिथि</SectionTitle>
      <div className="grid-2">
        <Field
          label="चालान (Invoice) सं० *"
          value={form.invoiceNo}
          onChange={(v) => update("invoiceNo", v)}
          placeholder="उदा. AE/2026/024"
        />
        <Field
          label="चालान दिनांक *"
          type="date"
          value={form.invoiceDate}
          onChange={(v) => update("invoiceDate", v)}
        />
      </div>
    </div>
  );
}

function RecordsForm({
  farmers,
  saveFarmer,
  resetForm,
  loadFarmer,
  deleteFarmer,
}) {
  return (
    <div className="form-content devanagari">
      <SectionTitle>ज) क्लाउड डेटाबेस एवं सहेजे गए रिकॉर्ड</SectionTitle>
      <div className="notice-card green-notice">
        <b>📁 डेटाबेस कार्यक्षेत्र</b>
        <p>
          नए किसानों के आवेदन सहेजें, पुराने रिकॉर्ड को एडिट के लिए लोड करें या
          उन्हें डिलीट करें। यह standalone React version browser local storage
          का उपयोग करता है।
        </p>
      </div>
      <div className="button-row">
        <button className="btn btn-green" onClick={saveFarmer}>
          💾 रिकॉर्ड सुरक्षित करें
        </button>
        <button className="btn btn-light" onClick={resetForm}>
          🧹 रीसेट
        </button>
      </div>
      <div className="saved-heading">सहेजे गए किसान रिकॉर्ड्स सूची</div>
      <div className="record-list">
        {!farmers.length && (
          <p className="empty-records">कोई रिकॉर्ड सहेजा नहीं गया है</p>
        )}
        {farmers.map((record) => (
          <div className="record-card" key={record.gardenCardNo}>
            <button
              className="record-main"
              onClick={() => loadFarmer(record.gardenCardNo)}
            >
              <b>{safe(record.farmerName, "अज्ञात कृषक")}</b>
              <small>
                {record.gardenCardNo} |{" "}
                {record.schemeSelection === "anti-hail"
                  ? "एंटीहेलनेट"
                  : "मल्चिंग"}
              </small>
            </button>
            <button
              className="delete-record"
              onClick={() => deleteFarmer(record.gardenCardNo)}
              title="हटाएं"
            >
              🗑
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function DocumentHeader({ title, subtitle }) {
  return (
    <div className="doc-header">
      <div className="doc-kicker">राज्य बागवानी मिशन, उत्तराखण्ड</div>
      <h1>{title}</h1>
      {subtitle && <p>{subtitle}</p>}
    </div>
  );
}

function ApplicationDocument({ form, calculated }) {
  return (
    <article className="print-document devanagari">
      <DocumentHeader
        title="बागवानी मिशन के अन्तर्गत संरक्षित खेती (Protected Cultivation) के लिये आवेदन हेतु प्रारूप-B5"
        subtitle={`जनपद: ${safe(form.districtName)}  |  उद्यान कार्ड संख्या: ${safe(form.gardenCardNo, "---")}`}
      />

      <div className="doc-two-column">
        <div className="doc-info-list">
          <p>
            <b>1. लाभार्थी का नाम:</b> {safe(form.farmerName)}
          </p>
          <p>
            <b>2. पिता/पति का नाम:</b> {safe(form.fatherName)}
          </p>
          <p>
            <b>3. पता:</b> ग्राम {safe(form.villageName)}, डाकखाना{" "}
            {safe(form.postOffice)}, विकासखण्ड {safe(form.blockName)}, जनपद{" "}
            {safe(form.districtName)}
          </p>
          <p>
            <b>4. मोबाइल नंबर:</b> {safe(form.mobileNo)}
          </p>
          <p>
            <b>5. भूमि विवरण:</b> कुल भूमि {safe(form.totalArableLand, "0")}{" "}
            है०, बागवानी भूमि {safe(form.horticultureLand, "0")} है०
          </p>
          <p>
            <b>6. सिंचाई सुविधा:</b> {safe(form.irrigationFacilities)}
          </p>
          <p>
            <b>7. खसरा संख्या:</b>{" "}
            <span className="mono">{safe(form.khasraNo)}</span>
          </p>
        </div>
        <div className="photo-box">
          <span>
            लाभार्थी का
            <br />
            फोटो
          </span>
        </div>
      </div>

      <div className="doc-box">
        <div className="doc-box-title">लाभार्थी की व्यक्तिगत जानकारी</div>
        <div className="checkbox-row">
          <span>श्रेणी:</span>
          <Check active={form.farmerCategory === "सामान्य"} /> सामान्य
          <Check active={form.farmerCategory === "SC"} /> SC
          <Check active={form.farmerCategory === "ST"} /> ST
          <Check active={form.farmerCategory === "अन्य"} /> OBC
        </div>
        <div className="checkbox-row">
          <span>लिंग:</span>
          <Check active={form.farmerGender === "Male"} /> पुरुष
          <Check active={form.farmerGender === "Female"} /> महिला
          <span className="ml-gap">कृषक:</span>
          <Check active={form.farmerSize === "Small/Marginal"} /> लघु / सीमान्त
          <Check active={form.farmerSize === "Big farmer"} /> बड़ा
        </div>
        <div className="checkbox-row">
          <span>शैक्षिक योग्यता:</span>
          <Check active={form.farmerEducation === "Non Metric"} /> Non-Metric
          <Check active={form.farmerEducation === "Metric"} /> Metric
          <Check active={form.farmerEducation === "Intermediate"} />{" "}
          Intermediate
          <Check active={form.farmerEducation === "Graduate"} /> Graduate
        </div>
      </div>

      <div className="doc-section-heading">
        प्रस्तावित योजना एवं तकनीकी विवरण
      </div>
      <table className="doc-table">
        <thead>
          <tr>
            <th>योजना</th>
            <th>क्षेत्रफल (Sqm)</th>
            <th>तकनीकी विवरण</th>
            <th>मानक</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              {calculated.antiHail ? "✓ एंटीहेलनेट" : "✓ प्लास्टिक मल्चिंग"}
            </td>
            <td>{num(form.areaSqm).toLocaleString("en-IN")}</td>
            <td>{calculated.subDescription}</td>
            <td>{calculated.standardCode}</td>
          </tr>
        </tbody>
      </table>

      <div className="doc-section-heading">धनराशि व्यवस्था एवं फसल उत्पादन</div>
      <table className="doc-table">
        <tbody>
          <tr>
            <th>धनराशि स्रोत</th>
            <td>{form.fundType}</td>
            <th>बैंक</th>
            <td>{safe(form.fundBankName)}</td>
          </tr>
          <tr>
            <th>खाता/कार्ड</th>
            <td>{safe(form.fundExtraVal1)}</td>
            <th>लिमिट/विवरण</th>
            <td>{safe(form.fundExtraVal2)}</td>
          </tr>
          <tr>
            <th>फसल</th>
            <td>{safe(form.cropName)}</td>
            <th>क्षेत्रफल</th>
            <td>{safe(form.cropArea, "0")} है०</td>
          </tr>
          <tr>
            <th>उत्पादन</th>
            <td>{safe(form.cropProd, "0")} कुंतल</td>
            <th>विपणन</th>
            <td>{safe(form.marketingStrategy)}</td>
          </tr>
        </tbody>
      </table>

      <div className="financial-doc">
        <div>
          <span>कुल लागत</span>
          <b>{money(calculated.totalCost)}</b>
        </div>
        <div>
          <span>कृषक अंशदान (50%)</span>
          <b>{money(calculated.farmerShare)}</b>
        </div>
        <div>
          <span>विभागीय अनुदान (50%)</span>
          <b>{money(calculated.subsidy)}</b>
        </div>
      </div>

      <div className="signature-grid">
        <div>
          <span className="signature-line" />
          <b>लाभार्थी के हस्ताक्षर</b>
        </div>
        <div>
          <span className="signature-line" />
          <b>संबंधित अधिकारी के हस्ताक्षर व मोहर</b>
        </div>
      </div>
    </article>
  );
}

function InvoiceDocument({ form, calculated }) {
  return (
    <article className="print-document invoice-doc devanagari">
      <div className="invoice-top">
        <div>
          <span className="invoice-label">TAX INVOICE</span>
          <h1>{safe(form.firmName, "M/S AVANI ENTERPRISES")}</h1>
          <p>{safe(form.firmAddress)}</p>
        </div>
        <div className="invoice-meta">
          <p>
            <b>GSTIN:</b>{" "}
            <span className="mono">{safe(form.firmGSTIN, "---")}</span>
          </p>
          <p>
            <b>Invoice No:</b>{" "}
            <span className="mono red">{safe(form.invoiceNo, "---")}</span>
          </p>
          <p>
            <b>Date:</b>{" "}
            <span className="mono">{dateIN(form.invoiceDate)}</span>
          </p>
        </div>
      </div>

      <div className="bill-to-grid">
        <div>
          <h3>Bill To / Deliver To</h3>
          <b>{safe(form.farmerName)}</b>
          <p>S/o: {safe(form.fatherName)}</p>
          <p>
            ग्राम: {safe(form.villageName)}, विकासखंड: {safe(form.blockName)}
          </p>
          <p>{safe(form.districtName)} (उत्तराखण्ड)</p>
        </div>
        <div className="text-right">
          <h3>Technical Specs Enforced</h3>
          <p>
            <b>Material Type:</b>{" "}
            {calculated.antiHail
              ? form.netType
              : `${form.mulchingThickness} Micron (${form.mulchingColor})`}
          </p>
          <p>
            <b>Standard Code:</b>{" "}
            <span className="mono">{calculated.standardCode}</span>
          </p>
          <p>
            <b>Khasra Number:</b>{" "}
            <span className="mono">{safe(form.khasraNo, "---")}</span>
          </p>
        </div>
      </div>

      <table className="doc-table invoice-table">
        <thead>
          <tr>
            <th>S.No.</th>
            <th>विवरण</th>
            <th>HSN</th>
            <th>Qty</th>
            <th>Rate</th>
            <th>Unit</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>1</td>
            <td>
              <b>{calculated.materialDescription}</b>
              <small>{calculated.subDescription}</small>
            </td>
            <td className="mono">{calculated.hsnCode}</td>
            <td>{num(form.areaSqm).toLocaleString("en-IN")}</td>
            <td>{money(calculated.rate)}</td>
            <td>SQM</td>
            <td>
              <b>{money(calculated.totalCost)}</b>
            </td>
          </tr>
          <tr className="total-row">
            <td colSpan="6">Total Cost:</td>
            <td>{money(calculated.totalCost)}</td>
          </tr>
          <tr className="grand-row">
            <td colSpan="6">Grand Total (Inclusive of Subsidy):</td>
            <td>{money(calculated.totalCost)}</td>
          </tr>
        </tbody>
      </table>

      <div className="invoice-footer-grid">
        <div>
          <div className="bank-box">
            <h4>🏦 Supplier Bank Details (For Direct Subsidy Release)</h4>
            <p>
              <b>Bank Name:</b> {safe(form.firmBankName)}
            </p>
            <p>
              <b>Account Number:</b>{" "}
              <span className="mono">{safe(form.firmBankAcc)}</span>
            </p>
            <p>
              <b>IFSC Code:</b>{" "}
              <span className="mono">{safe(form.firmIFSC)}</span>
            </p>
          </div>
          <p className="terms">
            * Received/Delivered the above mentioned material in good condition.
          </p>
          <p className="terms">
            * Interest will be charged at 18% p.a on overdue payments.
          </p>
        </div>
        <div className="supplier-sign">
          <b>For {safe(form.firmName)}</b>
          <span className="stamp-box">Authorised Stamp</span>
          <b>Authorised Signatory</b>
        </div>
      </div>
    </article>
  );
}

function AffidavitDocument({ form, calculated }) {
  return (
    <article className="print-document affidavit-doc devanagari">
      <div className="affidavit-title">
        <h1>शपथ पत्र (AFFIDAVIT)</h1>
        <p>Non-Judicial Stamp Paper value of ₹10/-</p>
      </div>

      <p className="aff-lead">
        मैं, <b>{safe(form.farmerName)}</b>, पुत्र/पुत्री/पत्नी श्री{" "}
        <b>{safe(form.fatherName)}</b>, निवासी ग्राम:{" "}
        <b>{safe(form.villageName)}</b>, विकासखण्ड:{" "}
        <b>{safe(form.blockName)}</b>, जनपद: <b>{safe(form.districtName)}</b>,
        उत्तराखण्ड, आज दिनांक <b>{dateIN(form.invoiceDate)}</b> को यह शपथ पत्र
        अपनी सच्चाई एवं शुद्धता के साथ प्रस्तुत करता/करती हूँ कि:
      </p>

      <ol className="aff-list">
        <li>
          मैंने अपनी भूमि (खसरा संख्या <b>{safe(form.khasraNo, "---")}</b>) में
          <b>
            {calculated.antiHail
              ? " एंटीहेलनेट (Anti-Hail Net)"
              : " मल्चिंग शीट (Mulching Sheet)"}
          </b>
          की स्थापना का कार्य <b>{safe(form.firmName)}</b> द्वारा विभागीय मानकों
          (MIDH) एवं BIS ग्रेड के अनुसार पूर्ण करा लिया है।
        </li>
        <li>
          <b>कार्य एवं वित्तीय विश्लेषण का विवरण:</b>
          <ul>
            <li>
              कुल स्थापित/स्वीकृत क्षेत्रफल:{" "}
              <b>{num(form.areaSqm).toLocaleString("en-IN")}</b> वर्ग मीटर
            </li>
            <li>
              निर्माण सामग्री/शीट्स की कुल लागत:{" "}
              <b>{money(calculated.totalCost)}</b>
            </li>
            <li>
              मेरा स्वयं का 50% अंशदान: <b>{money(calculated.farmerShare)}</b>
            </li>
            <li>
              विभागीय अनुदान राशि (50%): <b>{money(calculated.subsidy)}</b>
            </li>
          </ul>
        </li>
        <li>
          मैं प्रमाणित करता/करती हूँ कि मुझे या मेरे परिवार के किसी भी सदस्य को
          विगत वर्षों में कभी भी इस मद हेतु विभागीय सहायता/अनुदान प्राप्त नहीं
          हुआ है।
        </li>
        <li>
          स्थापित संरचना की सुरक्षा, आगजनी, ओलावृष्टि, फटने, जंगली जानवरों
          द्वारा क्षति तथा नियमित देखभाल की समस्त जिम्मेदारी मेरी स्वयं की होगी।
        </li>
        <li>
          मैंने आपूर्तिकर्ता संस्था <b>{safe(form.firmName)}</b> को अपना 50%
          अंशदान पूर्णतः अदा कर दिया है। विभाग से देय 50% अनुदान राशि सीधे उक्त
          आपूर्तिकर्ता फर्म के बैंक खाते में अवमुक्त करने का अनुरोध है।
        </li>
      </ol>

      <div className="declaration">
        <b>अंतिम घोषणा:</b>
        <p>
          मैं उपरोक्त शपथपत्र की सभी बातों को अपने निजी ज्ञान एवं विश्वास के
          अनुसार सत्य एवं सही मानता/मानती हूँ। इसमें कोई भी तथ्य छिपाया नहीं गया
          है। यदि कोई कथन असत्य पाया गया, तो प्राप्त अनुदान राशि वापस करने तथा
          कानूनी कार्यवाही भुगतने हेतु मैं पूर्ण रूप से सहमत हूँ।
        </p>
      </div>

      <div className="signature-grid affidavit-signatures">
        <div>
          <p>गवाहों के नाम व हस्ताक्षर:</p>
          <p>1. ___________________</p>
          <p>2. ___________________</p>
        </div>
        <div className="signature-center">
          <span className="signature-line" />
          <b>शपथी/शपथकर्ता के हस्ताक्षर</b>
        </div>
      </div>
    </article>
  );
}

function VerificationDocument({ form, calculated }) {
  return (
    <article className="print-document verification-doc devanagari">
      <div className="office-copy">कार्यालय प्रति</div>
      <DocumentHeader
        title="भौतिक सत्यापन रिपोर्ट (एंटीहेलनेट / मल्चिंग शीट)"
        subtitle="राज्य बागवानी मिशन, उत्तराखण्ड"
      />

      <div className="verify-grid">
        <div className="verify-box">
          <h3>1. कृषक एवं भूमि का विवरण</h3>
          <p>
            <b>कृषक का नाम:</b> {safe(form.farmerName)}
          </p>
          <p>
            <b>पिता/पति का नाम:</b> {safe(form.fatherName)}
          </p>
          <p>
            <b>ग्राम व विकासखंड:</b> {safe(form.villageName)},{" "}
            {safe(form.blockName)}
          </p>
          <p>
            <b>मोबाइल नंबर:</b> {safe(form.mobileNo)}
          </p>
          <p>
            <b>कृषक श्रेणी / लिंग:</b> {safe(form.farmerCategory)} /{" "}
            {form.farmerGender === "Male" ? "पुरुष" : "महिला"}
          </p>
        </div>
        <div className="verify-box">
          <h3>2. आपूर्तिकर्ता फर्म का विवरण</h3>
          <p>
            <b>फर्म का नाम:</b> {safe(form.firmName)}
          </p>
          <p>
            <b>निःशुल्क स्थापना सुविधा:</b> ☑ हाँ
          </p>
          <p>
            <b>वारंटी प्रमाण-पत्र प्राप्त:</b> ☑ हाँ
          </p>
          <p>
            <b>वारंटी अवधि:</b>{" "}
            <span className="indigo-text">{calculated.warranty}</span>
          </p>
          <p>
            <b>खसरा संख्या:</b>{" "}
            <span className="mono">{safe(form.khasraNo)}</span>
          </p>
        </div>
      </div>

      <h3 className="verify-heading">
        3. स्थापना एवं तकनीकी सत्यापन (मौके पर जांच)
      </h3>
      <table className="doc-table">
        <thead>
          <tr>
            <th>अवयव</th>
            <th>स्वीकृत क्षेत्रफल (M²)</th>
            <th>मौके पर मापा (M²)</th>
            <th>लागू BIS मानक</th>
            <th>कार्य की स्थिति</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <b>{calculated.antiHail ? "एंटीहेलनेट" : "मल्चिंग शीट"}</b>
            </td>
            <td>{num(form.areaSqm).toLocaleString("en-IN")}</td>
            <td>
              <b>{num(form.areaSqm).toLocaleString("en-IN")}</b>
            </td>
            <td className="mono">{calculated.standardCode}</td>
            <td className="green-text">☑ सन्तोषजनक</td>
          </tr>
        </tbody>
      </table>
      <p className="technical-note">
        Specs Check: {calculated.materialDescription} |{" "}
        {calculated.subDescription}
      </p>

      <h3 className="verify-heading">4. वित्तीय विवरण (Financial Summary)</h3>
      <table className="doc-table financial-table">
        <tbody>
          <tr>
            <th>1</th>
            <td>कुल स्वीकृत/सत्यापित लागत (Total Cost)</td>
            <td>{money(calculated.totalCost)}</td>
          </tr>
          <tr>
            <th>2</th>
            <td>कृषक द्वारा वहन की गई धनराशि (50% Share)</td>
            <td className="green-text">{money(calculated.farmerShare)}</td>
          </tr>
          <tr className="subsidy-row">
            <th>3</th>
            <td>फर्म को अवमुक्त की जाने वाली अनुदान राशि (50% Subsidy)</td>
            <td>{money(calculated.subsidy)}</td>
          </tr>
        </tbody>
      </table>

      <div className="certification">
        <p>
          <b>प्रमाण-पत्र एवं संस्तुति:</b> प्रमाणित किया जाता है कि हमारे द्वारा
          कृषक के प्रक्षेत्र का भौतिक सत्यापन किया गया। स्थापित संरचना का कार्य
          सन्तोषजनक, स्वीकृत तकनीकी मानदंडों, विभागीय दिशा-निर्देशों एवं
          निर्धारित BIS मानकों के अनुरूप पाया गया है।
        </p>
        <p>
          अतः लाभार्थी को देय अनुदान राशि{" "}
          <b className="indigo-text">{money(calculated.subsidy)}</b> मात्र, सीधे
          अधिकृत आपूर्तिदाता फर्म <b>{safe(form.firmName)}</b> को भुगतान किए
          जाने हेतु संस्तुति सहित अग्रसारित की जाती है।
        </p>
      </div>

      <div className="signature-grid verify-signatures">
        <div>
          <span className="signature-line" />
          <b>कृषक के हस्ताक्षर</b>
          <small>दिनांक: ___/___/2026</small>
        </div>
        <div>
          <span className="signature-line wide" />
          <b>सत्यापन अधिकारी के हस्ताक्षर व मोहर</b>
          <small>उद्यान विभाग, उत्तराखंड शासन</small>
        </div>
      </div>
    </article>
  );
}
