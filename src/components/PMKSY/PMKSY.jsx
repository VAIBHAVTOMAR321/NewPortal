import React, { useEffect, useState } from "react";
import "./PMKSY.css";

const PMKSY = () => {
  const [activeStep, setActiveStep] = useState(1);
  const [showFirmPanel, setShowFirmPanel] = useState(false);
  const [showOfficePanel, setShowOfficePanel] = useState(false);
  const [showAllRecPanel, setShowAllRecPanel] = useState(false);
  const [samplePrintReady, setSamplePrintReady] = useState(false);

  // ── Form State ──
  const [farmer, setFarmer] = useState({
    fname: "",
    rel: "",
    gender: "पुरुष",
    social: "सामान्य",
    fclass: "सीमांत",
    btype: "व्यक्तिगत",
    aadhaar: "",
    mobile: "",
    acct: "",
    ifsc: "",
    bank: "",
    hortcard: "",
    addr: "",
    district: "पौड़ी गढ़वाल",
    kendra: "",
    block: "",
    vidhan: "",
    panchayat: "",
    village: "",
    tenure: "स्वयं",
    lease: "",
    ownKhata: "",
    ownKhasra: "",
    ownArea: "",
    prevsub: "नहीं",
    source: "कुआँ",
    sourceOther: "",
    company: "",
    lat: "",
    lon: "",
    mapperid: "",
    terrain: "समतल",
    wdist: "",
    vdrop: "",
    wavail: "",
    wqual: "स्वच्छ",
    pump: "विद्युत",
    hp: "",
  });

  const [systemRows, setSystemRows] = useState([
    {
      sys: "ड्रिप",
      crop: "सेब",
      spacing: "2x2",
      area: 0.2,
      cost: 29915,
      subsidy: 23932,
      farmer: 5983,
    },
  ]);
  const [coOwners, setCoOwners] = useState([]);
  const [checklistValues, setChecklistValues] = useState([
    true,
    true,
    true,
    true,
    true,
    false,
    true,
    true,
    false,
    true,
  ]);
  const [recommendation, setRecommendation] = useState({
    verdict: "संस्तुत",
    applicationDate: "",
    remark: "",
  });

  const [bill, setBill] = useState({
    bl_no: "",
    bl_date: "",
    bl_install_date: "",
    bl_gst: "0%",
    bl_stamp_farmer: true,
    bl_stamp_officer: true,
    items: [],
    total: 32308,
  });

  const [receipt, setReceipt] = useState({
    rc_no: "",
    rc_date: "",
    rc_amt: 32308,
  });

  const steps = [
    { id: 1, no: "चरण 01", nm: "आवेदन प्रपत्र" },
    { id: 2, no: "चरण 02", nm: "शपथ पत्र" },
    { id: 3, no: "चरण 03", nm: "फर्म चयन" },
    { id: 4, no: "चरण 04", nm: "भौतिक सत्यापन" },
    { id: 5, no: "चरण 05", nm: "कंपनी बिल / BoQ" },
    { id: 6, no: "चरण 06", nm: "नकद रसीद" },
    { id: 7, no: "रजिस्टर", nm: "सभी किसान" },
    { id: 8, no: "प्रबंधन", nm: "दर तालिका" },
  ];

  useEffect(() => {
    if (!samplePrintReady) return undefined;
    const printTimer = window.setTimeout(() => window.print(), 350);
    const handleAfterPrint = () => setSamplePrintReady(false);
    window.addEventListener("afterprint", handleAfterPrint);
    return () => {
      window.clearTimeout(printTimer);
      window.removeEventListener("afterprint", handleAfterPrint);
    };
  }, [samplePrintReady]);

  const handleFarmerChange = (field, value) => {
    setFarmer((prev) => ({ ...prev, [field]: value }));
  };

  const fillSampleData = () => {
    setFarmer({
      fname: "श्री सुरेश सिंह",
      rel: "पुत्र श्री मोहन सिंह",
      gender: "पुरुष",
      social: "सामान्य",
      fclass: "सीमांत",
      btype: "व्यक्तिगत",
      aadhaar: "XXXX-XXXX-1234",
      mobile: "9876543210",
      acct: "123456789012",
      ifsc: "SBIN0001234",
      bank: "भारतीय स्टेट बैंक — कोटद्वार शाखा",
      hortcard: "HK-2026-00125",
      addr: "शिबूनगर, ग्रा०पं० कोटद्वार, वि०ख० नगर निगम कोटद्वार, जनपद पौड़ी गढ़वाल, उत्तराखण्ड",
      district: "पौड़ी गढ़वाल",
      kendra: "कोटद्वार",
      block: "नगर निगम कोटद्वार",
      vidhan: "कोटद्वार",
      panchayat: "कोटद्वार",
      village: "शिबूनगर",
      tenure: "स्वयं",
      lease: "",
      ownKhata: "00056",
      ownKhasra: "125/2",
      ownArea: "0.20",
      prevsub: "नहीं",
      source: "कुआँ",
      sourceOther: "",
      company: "Avani Enterprises",
      lat: "29.7560",
      lon: "78.5320",
      mapperid: "UK-PMS-2026-00125",
      terrain: "समतल",
      wdist: "80",
      vdrop: "12",
      wavail: "2000",
      wqual: "स्वच्छ",
      pump: "विद्युत",
      hp: "2",
    });
  };

  const boqItems = [
    {
      sn: 1,
      desc: "Screen Filter 10 m³/hr / Disc Filter",
      bis: "IS 12785:1994",
      qty: 1,
      unit: "Nos",
      rate: 3615,
      val: 3615,
    },
    {
      sn: 2,
      desc: "Venturi & Manifold (1.5 in)",
      bis: "IS 14483 (Part 1):1997",
      qty: 1,
      unit: "Nos",
      rate: 1735,
      val: 1735,
    },
    {
      sn: 3,
      desc: "Air Release Valve 1 in",
      bis: "Mfr. Assured (Para 15.7)",
      qty: 1,
      unit: "Nos",
      rate: 434,
      val: 434,
    },
    {
      sn: 4,
      desc: "Non Return Valve 1.5 in",
      bis: "Mfr. Assured (Para 15.7)",
      qty: 1,
      unit: "Nos",
      rate: 579,
      val: 579,
    },
    {
      sn: 5,
      desc: 'By-Pass Assembly 1.5"x1.5"',
      bis: "Mfr. Assured (Para 15.7)",
      qty: 1,
      unit: "Nos",
      rate: 723,
      val: 723,
    },
    {
      sn: 6,
      desc: "HDPE Pipe 50 mm; 4 kg/cm²",
      bis: "IS 4984:2016",
      qty: 54,
      unit: "Meter",
      rate: 116,
      val: 6270,
    },
    {
      sn: 7,
      desc: "Lateral 12 mm, Class II; 2.5 kg/cm²",
      bis: "IS 12786:1989",
      qty: 1010,
      unit: "Meter",
      rate: 11,
      val: 11221,
    },
    {
      sn: 8,
      desc: "Pressure Regulating Emitter/Dripper 2/4/8 lph",
      bis: "IS 13487:1992",
      qty: 1020,
      unit: "Nos",
      rate: 3,
      val: 3091,
    },
    {
      sn: 9,
      desc: "Control Valve 50 mm",
      bis: "IS 18286:2023",
      qty: 1,
      unit: "Nos",
      rate: 579,
      val: 579,
    },
    {
      sn: 10,
      desc: "Control Valve 63 mm",
      bis: "IS 18286:2023",
      qty: 1,
      unit: "Nos",
      rate: 867,
      val: 867,
    },
    {
      sn: 11,
      desc: "Flush Valve 50 mm",
      bis: "IS 18286:2023",
      qty: 2,
      unit: "Nos",
      rate: 506,
      val: 1012,
    },
    {
      sn: 12,
      desc: "Throttle Valve 1.5 in",
      bis: "IS 18286:2023",
      qty: 1,
      unit: "Nos",
      rate: 650,
      val: 650,
    },
  ];

  const subtotal = boqItems.reduce((s, i) => s + i.val, 0);
  const installChg = Math.round(subtotal * 0.05);
  const grandTotal = subtotal + installChg;
  const ownArea = Number.parseFloat(farmer.ownArea) || 0;
  const coOwnerArea = coOwners.reduce(
    (total, owner) => total + (Number.parseFloat(owner.area) || 0),
    0,
  );
  const landAreaTotal = ownArea + coOwnerArea;
  const proposedArea = systemRows.reduce((total, row) => total + row.area, 0);

  const enclosures = [
    "आधार कार्ड की प्रति (eKYC सत्यापित)",
    "भूमि अभिलेख — नवीनतम खसरा / खतौनी",
    "बैंक पासबुक / रद्द चेक की प्रति (आधार सीडेड, DBT सक्षम)",
    "सिंचाई जल स्रोत उपलब्धता संबंधी प्रमाण",
    "पट्टा / अनुबंध पत्र — न्यूनतम 07 वर्ष (यदि भूमि पट्टे पर हो)",
    "पूर्व में अनुदान न लेने संबंधी स्व-घोषणा पत्र",
    "पासपोर्ट साइज़ फोटोग्राफ",
    "उद्यान कार्ड / कृषि मैपर एप डेटा",
  ];

  const checklist = [
    "लाभार्थी ने विगत 07 वर्षों में उसी भूमि पर सूक्ष्म सिंचाई का अनुदान प्राप्त नहीं किया है।",
    "लाभार्थी का कुल आयुक्त क्षेत्रफल 05 हेक्टेयर की अधिकतम सीमा से अधिक नहीं है।",
    "एक ही स्थान की भूमि को एक ही फसल हेतु छोटे-छोटे भागों में विभाजित नहीं किया गया है।",
    "बैंक खाता आधार सीडेड, DBT सक्षम एवं सक्रिय है।",
    "पट्टे/अनुबंध कृषक की दशा में न्यूनतम 07 वर्ष का पट्टा अनुबंध संलग्न है।",
    "प्रक्षेत्र की जियो-टैगिंग कृषि मैपर एप से पूर्ण तथा फोटो/वीडियो प्राप्त कर लए गए हैं।",
    "प्रस्तावित प्रणाली में फर्टिगेशन उपकरण (वेंचुरी/उर्वरक टैंक) समाविष्ट है।",
    "लाभार्थी द्वारा पंजीकृत फर्म का चयन स्वेच्छा से किया गया है, किसी प्रकार का दबाव नहीं है।",
    "प्रक्षेत्र पर जल स्रोत उपलब्ध तथा प्रस्तावित क्षेत्रफल हेतु जल की मात्रा पर्याप्त है।",
    "पर्वतीय ढाल की दशा में प्रत्येक 04 मी० ऊर्ध्वाधर गरावट पर कंट्रोल वाल्व का प्रावधान किया गया है।",
  ];

  const bisChecklist = [
    "IS 12786 — लेटरल",
    "IS 13488 — एमिटिंग पाइप",
    "IS 12785 — फिल्टर",
    "IS 17425 — क्विक कप्ल्ड HDPE पाइप (स्प्रिंकलर)",
    "IS 14483 — वेंचुरी / फर्टिगेशन",
    "IS 18286 — कंट्रोल / फ्लश वाल्व",
    "QR कोड / यूनिक ID अंकित एवं सत्यापित",
    "वारंटी कार्ड एवं संचालन पुस्तिका उपलब्ध कराइ गई है",
    "जियो-टैगिंग (कृषि मैपर) पूर्ण",
  ];

  return (
    <>
      <div className="noprint">
        <header className="mast">
          <div className="crest">उ</div>
          <div>
            <h1>PMKSY–PDMC · सम्पूर्ण प्रपत्र प्रणाली</h1>
            <div className="sub">
              उद्यान एवं खाद्य प्रसंस्करण विभाग, उत्तराखण्ड ·{" "}
              <span>
                कार्यालय उद्यान विशेषज्ञ, कोटद्वार, पौड़ी गढ़वाल, उत्तराखण्ड
              </span>{" "}
              <span
                style={{
                  background: "#0d7680",
                  color: "#fff",
                  padding: "1px 7px",
                  borderRadius: "9px",
                  fontSize: "10.5px",
                  fontWeight: 700,
                  marginLeft: "6px",
                }}
              >
                संस्करण 8 · 23-08-2026
              </span>
            </div>
          </div>
          <div className="sp"></div>
          <div className="firmswitch">
            <label htmlFor="activeFirmSel">सक्रिय फर्म</label>
            <select id="activeFirmSel">
              <option>गंगा एंटरप्राइजेज</option>
            </select>
            <div className="btnrow">
              <button
                className="btn ghost sm"
                type="button"
                onClick={() => setShowFirmPanel(true)}
              >
                फर्म जोड़ें/हटाएँ
              </button>
              <button
                className="btn ghost sm"
                type="button"
                onClick={() => setShowAllRecPanel(true)}
              >
                सभी फर्मों का रिकॉर्ड
              </button>
              <button
                className="btn ghost sm"
                type="button"
                onClick={() => setShowOfficePanel(true)}
              >
                कार्यालय सेटिंग
              </button>
            </div>
          </div>
          <div className="btnrow">
            <select
              id="quickFarmer"
              style={{ minWidth: "190px", fontSize: "13px" }}
            >
              <option value="">— सहेजा किसान खोलें —</option>
            </select>
            <button
              className="btn ghost sm"
              type="button"
              onClick={() => {
                setFarmer({});
                setCoOwners([]);
                setChecklistValues([
                  true,
                  true,
                  true,
                  true,
                  true,
                  false,
                  true,
                  true,
                  false,
                  true,
                ]);
                setRecommendation({
                  verdict: "संस्तुत",
                  applicationDate: "",
                  remark: "",
                });
                setSystemRows([
                  {
                    sys: "ड्रिप",
                    crop: "",
                    spacing: "",
                    area: 0,
                    cost: 0,
                    subsidy: 0,
                    farmer: 0,
                  },
                ]);
              }}
            >
              नया आवेदन
            </button>
            <button
              className="btn water sm"
              type="button"
              onClick={() => setSamplePrintReady(true)}
            >
              वर्तमान प्रपत्र प्रिंट
            </button>
          </div>
        </header>

        <div className="firmpanel-backdrop" hidden={!showFirmPanel}>
          <div className="firmpanel" role="dialog" aria-label="फर्म प्रबंधन">
            <div className="firmpanel-head">
              <h2>फर्म प्रबंधन — जोड़ें, हटाएँ, सक्रिय फर्म चुनें</h2>
              <button
                className="btn ghost sm"
                type="button"
                onClick={() => setShowFirmPanel(false)}
              >
                बंद करें ✕
              </button>
            </div>
            <div className="firmpanel-body">
              <div className="flag info">
                हर फर्म का किसान-रजिस्टर अलग-अलग सहेजा जाता है। ऊपर "सक्रिय
                फर्म" बदलते ही सिर्फ़ उसी फर्म के सहेजे किसान दिखेंगे।
              </div>
              <h4 className="subh" style={{ marginTop: "4px" }}>
                नई फर्म जोड़ें
              </h4>
              <div className="grid">
                <div className="f">
                  <label>फर्म का नाम *</label>
                  <input placeholder="जैसे: Ganga Enterprises" />
                </div>
                <div className="f">
                  <label>निर्माता / मैन्युफैक्चरर</label>
                  <input placeholder="जैसे: भारत ड्रिप इरिगेशन" />
                </div>
                <div className="f wide">
                  <label>पता</label>
                  <input placeholder="पूरा पता" />
                </div>
                <div className="f">
                  <label>मोबाइल</label>
                  <input inputMode="numeric" />
                </div>
                <div className="f">
                  <label>GSTIN</label>
                  <input className="mono" />
                </div>
                <div className="f">
                  <label>बैंक का नाम</label>
                  <input />
                </div>
                <div className="f">
                  <label>खाता संख्या</label>
                  <input className="mono" />
                </div>
                <div className="f">
                  <label>IFSC</label>
                  <input className="mono" />
                </div>
              </div>
              <div className="btnrow" style={{ marginTop: "10px" }}>
                <button className="btn water sm" type="button">
                  फर्म जोड़ें
                </button>
                <span className="hint">
                  फर्म जोड़ने के बाद स्वतः सक्रिय हो जाएगी
                </span>
              </div>
              <h4 className="subh">
                सभी फर्में <span className="tag">1</span>
              </h4>
              <div
                style={{
                  maxHeight: "280px",
                  overflowY: "auto",
                  border: "1px solid var(--line)",
                  borderRadius: "var(--r-sm)",
                }}
              >
                <div className="firmrow active">
                  <span className="fr-name">गंगा एंटरप्राइजेज</span>
                  <span className="fr-sub">
                    भारत ड्रिप इरिगेशन · 98765XXXXX
                  </span>
                  <span className="fr-badge">सक्रिय</span>
                  <button className="btn danger sm">हटाएँ</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="firmpanel-backdrop" hidden={!showOfficePanel}>
          <div className="firmpanel" role="dialog" aria-label="कार्यालय सेटिंग">
            <div className="firmpanel-head">
              <h2>कार्यालय नाम प्रबंधन</h2>
              <button
                className="btn ghost sm"
                type="button"
                onClick={() => setShowOfficePanel(false)}
              >
                बंद करें ✕
              </button>
            </div>
            <div className="firmpanel-body">
              <div className="flag info">
                यहाँ चुना गया कार्यालय नाम सिस्टम के मुख्य शीर्षक और प्रिंट होने
                वाले प्रपत्रों के कार्यालय शीर्षक में स्वतः दिखाई देगा।
              </div>
              <div className="f" style={{ marginTop: "10px" }}>
                <label>सक्रिय कार्यालय</label>
                <select>
                  <option>
                    कार्यालय उद्यान विशेषज्ञ, कोटद्वार, पौड़ी गढ़वाल, उत्तराखण्ड
                  </option>
                </select>
              </div>
              <h4 className="subh" style={{ marginTop: "12px" }}>
                नया कार्यालय जोड़ें
              </h4>
              <div className="grid">
                <div className="f wide">
                  <label>कार्यालय का पूरा नाम *</label>
                  <input placeholder="जैसे: कार्यालय उद्यान विशेषज्ञ, कोटद्वार" />
                </div>
              </div>
              <div className="btnrow" style={{ marginTop: "10px" }}>
                <button className="btn water sm" type="button">
                  कार्यालय जोड़ें
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="firmpanel-backdrop" hidden={!showAllRecPanel}>
          <div
            className="firmpanel"
            role="dialog"
            aria-label="सभी फर्मों का रिकॉर्ड"
            style={{ maxWidth: "1080px" }}
          >
            <div className="firmpanel-head">
              <h2>सभी फर्मों के दस्तावेज़ — एक साथ देखें</h2>
              <button
                className="btn ghost sm"
                type="button"
                onClick={() => setShowAllRecPanel(false)}
              >
                बंद करें ✕
              </button>
            </div>
            <div className="firmpanel-body">
              <div className="flag info">
                हर किसान के सभी 6 प्रपत्र यहीं से "प्रिंट सभी" दबाकर खोले जा
                सकते हैं।
              </div>
              <div
                className="grid"
                style={{ gridTemplateColumns: "1fr 2fr", marginBottom: "10px" }}
              >
                <div className="f">
                  <label>फर्म अनुसार फ़िल्टर</label>
                  <select>
                    <option>सभी फर्में</option>
                  </select>
                </div>
                <div className="f">
                  <label>किसान/ग्राम/केंद्र खोजें</label>
                  <input placeholder="नाम, ग्राम, केंद्र टाइप करें…" />
                </div>
              </div>
              <div style={{ overflowX: "auto" }}>
                <table className="dt">
                  <thead>
                    <tr>
                      <th>क्र.</th>
                      <th>किसान नाम</th>
                      <th>पिता</th>
                      <th>ग्राम</th>
                      <th>फर्म</th>
                      <th>प्रणाली</th>
                      <th>क्षेत्र</th>
                      <th>अनुदान</th>
                      <th>कृषक अंश</th>
                      <th>प्रिंट</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>1</td>
                      <td>श्री सुरेश सिंह</td>
                      <td>मोहन सिंह</td>
                      <td>शिबूनगर</td>
                      <td>Avani Ent.</td>
                      <td>ड्रिप</td>
                      <td>0.20</td>
                      <td>₹23,932</td>
                      <td>₹8,376</td>
                      <td>
                        <button
                          className="btn water sm"
                          onClick={() => setSamplePrintReady(true)}
                        >
                          प्रिंट
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        <div className="wrap">
          <div className="steps" role="tablist">
            {steps.map((step) => (
              <button
                key={step.id}
                className={`step ${activeStep === step.id ? "active" : ""}`}
                role="tab"
                aria-selected={activeStep === step.id}
                onClick={() => setActiveStep(step.id)}
              >
                <span className="no">{step.no}</span>
                <span className="nm">{step.nm}</span>
              </button>
            ))}
          </div>

          {activeStep === 1 && (
            <section id="S1">
              <div className="card">
                <h2>
                  <span className="kh">क</span> क्षेत्र विवरण{" "}
                  <span className="en">Location</span>
                </h2>
                <div className="body">
                  <div className="grid">
                    <div className="f">
                      <label>
                        <span className="n">1</span>जनपद
                      </label>
                      <input
                        className="auto"
                        value={farmer.district}
                        readOnly
                      />
                    </div>
                    <div className="f">
                      <label>
                        <span className="n">2</span>उद्यान सचल दल केंद्र
                      </label>
                      <select
                        value={farmer.kendra}
                        onChange={(e) =>
                          handleFarmerChange("kendra", e.target.value)
                        }
                      >
                        <option value="">— चुनें —</option>
                        <option>कोटद्वार</option>
                        <option>पौड़ी</option>
                        <option>श्रीनगर</option>
                      </select>
                      <div className="hint">
                        केंद्र चुनते ही विकासखंड एवं विधान सभा स्वतः भर जाएँगे
                      </div>
                    </div>
                    <div className="f">
                      <label>
                        <span className="n">3</span>विकासखंड
                      </label>
                      <select
                        className="auto"
                        value={farmer.block}
                        onChange={(e) =>
                          handleFarmerChange("block", e.target.value)
                        }
                      >
                        <option>नगर निगम कोटद्वार</option>
                        <option>कोटद्वार</option>
                      </select>
                    </div>
                    <div className="f">
                      <label>
                        <span className="n">4</span>विधान सभा
                      </label>
                      <select
                        className="auto"
                        value={farmer.vidhan}
                        onChange={(e) =>
                          handleFarmerChange("vidhan", e.target.value)
                        }
                      >
                        <option>कोटद्वार</option>
                        <option>पौड़ी</option>
                      </select>
                    </div>
                    <div className="f">
                      <label>
                        <span className="n">5</span>ग्राम पंचायत
                      </label>
                      <input
                        value={farmer.panchayat}
                        onChange={(e) =>
                          handleFarmerChange("panchayat", e.target.value)
                        }
                      />
                    </div>
                    <div className="f">
                      <label>
                        <span className="n">6</span>ग्राम
                      </label>
                      <input
                        value={farmer.village}
                        onChange={(e) =>
                          handleFarmerChange("village", e.target.value)
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="card">
                <h2>
                  <span className="kh">ख</span> किसान एवं बैंक विवरण{" "}
                  <span className="en">Farmer &amp; Bank — DBT</span>
                </h2>
                <div className="body">
                  <div className="btnrow" style={{ marginBottom: "12px" }}>
                    <button
                      className="btn water sm"
                      type="button"
                      onClick={fillSampleData}
                    >
                      🧪 पूरा भरा हुआ किसान Sample देखें
                    </button>
                    <button
                      className="btn ghost sm"
                      type="button"
                      onClick={() => setSamplePrintReady(true)}
                    >
                      🖨️ Sample के सभी 6 प्रपत्र प्रिंट
                    </button>
                    <span className="hint">
                      Apple · Drip · 2×2 m · 0.20 हे० — सभी 6 प्रपत्रों की
                      testing के लिए demo data भरेगा
                    </span>
                  </div>
                  <div className="grid">
                    <div className="f">
                      <label>
                        <span className="n">1</span>किसान का नाम
                      </label>
                      <input
                        value={farmer.fname}
                        onChange={(e) =>
                          handleFarmerChange("fname", e.target.value)
                        }
                        placeholder="नाम लिखें"
                      />
                      <div className="hint">
                        पुराना किसान हो तो पूरा रिकॉर्ड अपने आप भर जाएगा
                      </div>
                    </div>
                    <div className="f">
                      <label>
                        <span className="n">2</span>पिता / पति का नाम
                      </label>
                      <input
                        value={farmer.rel}
                        onChange={(e) =>
                          handleFarmerChange("rel", e.target.value)
                        }
                      />
                    </div>
                    <div className="f">
                      <label>
                        <span className="n">3</span>लिंग
                      </label>
                      <div className="chips">
                        <input
                          type="radio"
                          name="gender"
                          id="g1"
                          checked={farmer.gender === "पुरुष"}
                          onChange={() => handleFarmerChange("gender", "पुरुष")}
                        />
                        <label htmlFor="g1">पुरुष</label>
                        <input
                          type="radio"
                          name="gender"
                          id="g2"
                          checked={farmer.gender === "महिला"}
                          onChange={() => handleFarmerChange("gender", "महिला")}
                        />
                        <label htmlFor="g2">महिला</label>
                        <input
                          type="radio"
                          name="gender"
                          id="g3"
                          checked={farmer.gender === "अन्य"}
                          onChange={() => handleFarmerChange("gender", "अन्य")}
                        />
                        <label htmlFor="g3">अन्य</label>
                      </div>
                    </div>
                    <div className="f">
                      <label>
                        <span className="n">4</span>सामाजिक श्रेणी
                      </label>
                      <select
                        value={farmer.social}
                        onChange={(e) =>
                          handleFarmerChange("social", e.target.value)
                        }
                      >
                        <option>सामान्य</option>
                        <option>अ.जा. (SC)</option>
                        <option>अ.ज.जा. (ST)</option>
                        <option>अ.प.व. (OBC)</option>
                      </select>
                    </div>
                    <div className="f">
                      <label>
                        <span className="n">5</span>किसान वर्ग
                      </label>
                      <select
                        value={farmer.fclass}
                        onChange={(e) =>
                          handleFarmerChange("fclass", e.target.value)
                        }
                      >
                        <option>सीमांत (&lt;1 हे०)</option>
                        <option>लघु (1-2 हे०)</option>
                        <option>अन्य (&gt;2 हे०)</option>
                      </select>
                    </div>
                    <div className="f">
                      <label>
                        <span className="n">6</span>लाभार्थी प्रकार
                      </label>
                      <select
                        value={farmer.btype}
                        onChange={(e) =>
                          handleFarmerChange("btype", e.target.value)
                        }
                      >
                        <option>व्यक्तिगत</option>
                        <option>समूह / SHG</option>
                        <option>FPO</option>
                      </select>
                    </div>
                    <div className="f">
                      <label>
                        <span className="n">7</span>आधार संख्या
                      </label>
                      <input
                        className="mono"
                        inputMode="numeric"
                        maxLength={14}
                        value={farmer.aadhaar}
                        onChange={(e) =>
                          handleFarmerChange("aadhaar", e.target.value)
                        }
                        placeholder="XXXX XXXX XXXX"
                      />
                    </div>
                    <div className="f">
                      <label>
                        <span className="n">8</span>मोबाइल नंबर
                      </label>
                      <input
                        className="mono"
                        inputMode="numeric"
                        maxLength={10}
                        value={farmer.mobile}
                        onChange={(e) =>
                          handleFarmerChange("mobile", e.target.value)
                        }
                      />
                    </div>
                    <div className="f">
                      <label>
                        <span className="n">9</span>बैंक खाता सं० (आधार लिंक)
                      </label>
                      <input
                        className="mono"
                        value={farmer.acct}
                        onChange={(e) =>
                          handleFarmerChange("acct", e.target.value)
                        }
                      />
                    </div>
                    <div className="f">
                      <label>
                        <span className="n">11</span>IFSC कोड
                      </label>
                      <input
                        className="mono"
                        maxLength={11}
                        style={{ textTransform: "uppercase" }}
                        value={farmer.ifsc}
                        onChange={(e) =>
                          handleFarmerChange("ifsc", e.target.value)
                        }
                        placeholder="ABCD0123456"
                      />
                    </div>
                    <div className="f wide">
                      <label>
                        <span className="n">10</span>बैंक का नाम एवं शाखा
                      </label>
                      <input
                        value={farmer.bank}
                        onChange={(e) =>
                          handleFarmerChange("bank", e.target.value)
                        }
                      />
                    </div>
                    <div className="f">
                      <label>
                        <span className="n">12</span>उद्यान कार्ड / पंजीकरण सं०
                      </label>
                      <input
                        className="mono"
                        value={farmer.hortcard}
                        onChange={(e) =>
                          handleFarmerChange("hortcard", e.target.value)
                        }
                      />
                    </div>
                    <div className="f wide">
                      <label>
                        <span className="n">13</span>पूरा पता
                      </label>
                      <input
                        value={farmer.addr}
                        onChange={(e) =>
                          handleFarmerChange("addr", e.target.value)
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="card">
                <h2>
                  <span className="kh">ग</span> भूमि, जल स्रोत एवं प्रस्तावित
                  प्रणाली <span className="en">Land &amp; System</span>
                </h2>
                <div className="body">
                  <h4
                    className="subh"
                    style={{
                      borderTop: "none",
                      paddingTop: 0,
                      marginTop: "2px",
                    }}
                  >
                    प्रस्तावित प्रणाली
                  </h4>
                  <div style={{ overflowX: "auto" }}>
                    <table className="dt">
                      <thead>
                        <tr>
                          <th>क्र.</th>
                          <th>प्रणाली</th>
                          <th>फसल</th>
                          <th>स्पेसिंग</th>
                          <th>क्षेत्र (हे०)</th>
                          <th>इकाई लागत (₹)</th>
                          <th>देय अनुदान (₹)</th>
                          <th>कृषक अंश (₹)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {systemRows.map((row, i) => (
                          <tr key={i}>
                            <td>{i + 1}</td>
                            <td>
                              <select
                                value={row.sys}
                                onChange={(e) => {
                                  const r = [...systemRows];
                                  r[i].sys = e.target.value;
                                  setSystemRows(r);
                                }}
                              >
                                <option>ड्रिप</option>
                                <option>माइक्रो स्प्रिंकलर</option>
                                <option>मिनी स्प्रिंकलर</option>
                                <option>पोर्टेबल स्प्रिंकलर</option>
                              </select>
                            </td>
                            <td>
                              <input
                                value={row.crop}
                                onChange={(e) => {
                                  const r = [...systemRows];
                                  r[i].crop = e.target.value;
                                  setSystemRows(r);
                                }}
                              />
                            </td>
                            <td>
                              <input
                                value={row.spacing}
                                onChange={(e) => {
                                  const r = [...systemRows];
                                  r[i].spacing = e.target.value;
                                  setSystemRows(r);
                                }}
                              />
                            </td>
                            <td>
                              <input
                                type="number"
                                step="0.01"
                                className="mono"
                                value={row.area}
                                onChange={(e) => {
                                  const r = [...systemRows];
                                  r[i].area = parseFloat(e.target.value) || 0;
                                  setSystemRows(r);
                                }}
                              />
                            </td>
                            <td className="num">
                              {row.cost.toLocaleString("en-IN")}
                            </td>
                            <td className="num">
                              {row.subsidy.toLocaleString("en-IN")}
                            </td>
                            <td className="num">
                              {row.farmer.toLocaleString("en-IN")}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot>
                        <tr>
                          <td colSpan={4}>योग</td>
                          <td className="num">
                            {systemRows
                              .reduce((s, r) => s + r.area, 0)
                              .toFixed(2)}
                          </td>
                          <td className="num">
                            {systemRows
                              .reduce((s, r) => s + r.cost, 0)
                              .toLocaleString("en-IN")}
                          </td>
                          <td className="num">
                            {systemRows
                              .reduce((s, r) => s + r.subsidy, 0)
                              .toLocaleString("en-IN")}
                          </td>
                          <td className="num">
                            {systemRows
                              .reduce((s, r) => s + r.farmer, 0)
                              .toLocaleString("en-IN")}
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                  <div className="btnrow" style={{ marginTop: "9px" }}>
                    <button
                      className="btn ghost sm"
                      onClick={() =>
                        setSystemRows([
                          ...systemRows,
                          {
                            sys: "ड्रिप",
                            crop: "",
                            spacing: "",
                            area: 0,
                            cost: 0,
                            subsidy: 0,
                            farmer: 0,
                          },
                        ])
                      }
                    >
                      + प्रणाली पंक्ति जोड़ें
                    </button>
                  </div>

                  <h4 className="subh">भूमि अभिलेख एवं क्षेत्रफल विवरण</h4>
                  <div className="grid">
                    <div className="f">
                      <label>स्वयं की खाता संख्या</label>
                      <input
                        value={farmer.ownKhata || ""}
                        onChange={(e) =>
                          handleFarmerChange("ownKhata", e.target.value)
                        }
                      />
                    </div>
                    <div className="f">
                      <label>स्वयं की खसरा संख्या</label>
                      <input
                        value={farmer.ownKhasra || ""}
                        onChange={(e) =>
                          handleFarmerChange("ownKhasra", e.target.value)
                        }
                      />
                    </div>
                    <div className="f">
                      <label>स्वयं की भूमि (हे०)</label>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={farmer.ownArea || ""}
                        onChange={(e) =>
                          handleFarmerChange("ownArea", e.target.value)
                        }
                      />
                    </div>
                  </div>
                  <h4 className="subh">सह-खाताधारक की भूमि (यदि लागू हो)</h4>
                  <div style={{ overflowX: "auto" }}>
                    <table className="dt">
                      <thead>
                        <tr>
                          <th>नाम</th>
                          <th>पिता / पति</th>
                          <th>संबंध</th>
                          <th>खाता सं०</th>
                          <th>खसरा सं०</th>
                          <th>क्षेत्रफल (हे०)</th>
                          <th>ग्राम</th>
                          <th></th>
                        </tr>
                      </thead>
                      <tbody>
                        {coOwners.map((owner, index) => (
                          <tr key={index}>
                            {[
                              ["name", "नाम"],
                              ["relative", "पिता / पति"],
                              ["relation", "संबंध"],
                              ["khata", "खाता सं०"],
                              ["khasra", "खसरा सं०"],
                              ["area", "क्षेत्रफल"],
                              ["village", "ग्राम"],
                            ].map(([field, label]) => (
                              <td key={field}>
                                <input
                                  aria-label={label}
                                  type={field === "area" ? "number" : "text"}
                                  min={field === "area" ? "0" : undefined}
                                  step={field === "area" ? "0.01" : undefined}
                                  value={owner[field] || ""}
                                  onChange={(e) =>
                                    setCoOwners((current) =>
                                      current.map((item, itemIndex) =>
                                        itemIndex === index
                                          ? {
                                              ...item,
                                              [field]: e.target.value,
                                            }
                                          : item,
                                      ),
                                    )
                                  }
                                />
                              </td>
                            ))}
                            <td>
                              <button
                                className="btn danger sm"
                                type="button"
                                aria-label={`सह-खाताधारक ${index + 1} हटाएँ`}
                                onClick={() =>
                                  setCoOwners((current) =>
                                    current.filter(
                                      (_, itemIndex) => itemIndex !== index,
                                    ),
                                  )
                                }
                              >
                                हटाएँ
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="btnrow" style={{ margin: "8px 0 14px" }}>
                    <button
                      className="btn ghost sm"
                      type="button"
                      onClick={() =>
                        setCoOwners((current) => [
                          ...current,
                          {
                            name: "",
                            relative: "",
                            relation: "",
                            khata: "",
                            khasra: "",
                            area: "",
                            village: "",
                          },
                        ])
                      }
                    >
                      + सह-खाताधारक जोड़ें
                    </button>
                  </div>
                  <h4 className="subh">भूमि स्वामित्व, जल स्रोत एवं फर्म</h4>
                  <div className="grid">
                    <div className="f">
                      <label>
                        <span className="n">4</span>भूमि स्वामित्व
                      </label>
                      <select
                        value={farmer.tenure}
                        onChange={(e) =>
                          handleFarmerChange("tenure", e.target.value)
                        }
                      >
                        <option>स्वयं</option>
                        <option>पट्टा / अनुबंध</option>
                      </select>
                    </div>
                    <div className="f">
                      <label>
                        <span className="n">5</span>पट्टा अवधि (वर्ष)
                      </label>
                      <input
                        type="number"
                        min="0"
                        className="mono"
                        value={farmer.lease}
                        onChange={(e) =>
                          handleFarmerChange("lease", e.target.value)
                        }
                        placeholder="न्यूनतम 07"
                      />
                    </div>
                    <div className="f">
                      <label>
                        <span className="n">8</span>गत 07 वर्षों में पूर्व
                        अनुदान?
                      </label>
                      <div className="chips">
                        <input
                          type="radio"
                          name="prevsub"
                          id="ps1"
                          checked={farmer.prevsub === "हाँ"}
                          onChange={() => handleFarmerChange("prevsub", "हाँ")}
                        />
                        <label htmlFor="ps1">हाँ</label>
                        <input
                          type="radio"
                          name="prevsub"
                          id="ps2"
                          checked={farmer.prevsub === "नहीं"}
                          onChange={() => handleFarmerChange("prevsub", "नहीं")}
                        />
                        <label htmlFor="ps2">नहीं</label>
                      </div>
                    </div>
                    <div className="f">
                      <label>
                        <span className="n">9</span>जल स्रोत
                      </label>
                      <select
                        value={farmer.source}
                        onChange={(e) =>
                          handleFarmerChange("source", e.target.value)
                        }
                      >
                        <option>कुआँ</option>
                        <option>नलकूप / बोरवेल</option>
                        <option>नहर</option>
                        <option>तालाब / हौज</option>
                        <option>नदी / खोला / गदेरा</option>
                        <option>वर्षा जल संचयन टैंक</option>
                        <option>स्प्रिंग / प्राकृतिक स्रोत (धारा/नौला)</option>
                        <option>लिफ्ट इरिगेशन</option>
                        <option>अन्य</option>
                      </select>
                    </div>
                    {farmer.source === "अन्य" && (
                      <div className="f">
                        <label>अन्य जल स्रोत का विवरण</label>
                        <input
                          value={farmer.sourceOther || ""}
                          onChange={(e) =>
                            handleFarmerChange("sourceOther", e.target.value)
                          }
                        />
                      </div>
                    )}
                    <div className="f wide">
                      <label>
                        <span className="n">11</span>चयनित / अधिकृत डीलर
                      </label>
                      <input
                        value={farmer.company}
                        onChange={(e) =>
                          handleFarmerChange("company", e.target.value)
                        }
                        placeholder="डीलर का नाम टाइप करें"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="card">
                <h2>
                  <span className="kh">च</span> स्थलीय सत्यापन एवं प्रक्षेत्र
                  विवरण <span className="en">Joint Survey</span>
                </h2>
                <div className="body">
                  <div className="grid">
                    <div className="f">
                      <label>
                        <span className="n">1</span>अक्षांश
                      </label>
                      <input
                        className="mono"
                        value={farmer.lat}
                        onChange={(e) =>
                          handleFarmerChange("lat", e.target.value)
                        }
                        placeholder="29.7xxxxx"
                      />
                    </div>
                    <div className="f">
                      <label>
                        <span className="n">2</span>देशांतर
                      </label>
                      <input
                        className="mono"
                        value={farmer.lon}
                        onChange={(e) =>
                          handleFarmerChange("lon", e.target.value)
                        }
                        placeholder="78.5xxxxx"
                      />
                    </div>
                    <div className="f wide">
                      <div className="btnrow">
                        <button
                          className="btn ghost sm"
                          onClick={() => {
                            navigator.geolocation?.getCurrentPosition((p) => {
                              handleFarmerChange(
                                "lat",
                                p.coords.latitude.toFixed(6),
                              );
                              handleFarmerChange(
                                "lon",
                                p.coords.longitude.toFixed(6),
                              );
                            });
                          }}
                        >
                          मौजूदा लोकेशन भरें
                        </button>
                        <span className="hint">GPS से स्वतः भरें</span>
                      </div>
                    </div>
                    <div className="f">
                      <label>
                        <span className="n">3</span>कृषि मैपर एप ID
                      </label>
                      <input
                        className="mono"
                        value={farmer.mapperid}
                        onChange={(e) =>
                          handleFarmerChange("mapperid", e.target.value)
                        }
                      />
                    </div>
                    <div className="f">
                      <label>
                        <span className="n">4</span>भूमि की प्रकृति
                      </label>
                      <select
                        value={farmer.terrain}
                        onChange={(e) =>
                          handleFarmerChange("terrain", e.target.value)
                        }
                      >
                        <option>समतल</option>
                        <option>सीढ़ीदार</option>
                        <option>ढालदार</option>
                      </select>
                    </div>
                    <div className="f">
                      <label>
                        <span className="n">5</span>जल स्रोत की दूरी (मी०)
                      </label>
                      <input
                        type="number"
                        min="0"
                        className="mono"
                        value={farmer.wdist}
                        onChange={(e) =>
                          handleFarmerChange("wdist", e.target.value)
                        }
                      />
                    </div>
                    <div className="f">
                      <label>
                        <span className="n">6</span>ऊर्ध्वाधर ऊँचाई अंतर (मी०)
                      </label>
                      <input
                        type="number"
                        min="0"
                        className="mono"
                        value={farmer.vdrop}
                        onChange={(e) =>
                          handleFarmerChange("vdrop", e.target.value)
                        }
                      />
                    </div>
                    <div className="f">
                      <label>
                        <span className="n">7</span>जल उपलब्धता (ली०/घंटा)
                      </label>
                      <input
                        type="number"
                        min="0"
                        className="mono"
                        value={farmer.wavail}
                        onChange={(e) =>
                          handleFarmerChange("wavail", e.target.value)
                        }
                      />
                    </div>
                    <div className="f">
                      <label>
                        <span className="n">8</span>जल की गुणवत्ता
                      </label>
                      <select
                        value={farmer.wqual}
                        onChange={(e) =>
                          handleFarmerChange("wqual", e.target.value)
                        }
                      >
                        <option>स्वच्छ</option>
                        <option>गादयुक्त</option>
                        <option>लौहयुक्त</option>
                      </select>
                    </div>
                    <div className="f">
                      <label>
                        <span className="n">9</span>पंप
                      </label>
                      <select
                        value={farmer.pump}
                        onChange={(e) =>
                          handleFarmerChange("pump", e.target.value)
                        }
                      >
                        <option>विद्युत</option>
                        <option>डीजल</option>
                        <option>सौर</option>
                        <option>उपलब्ध नहीं</option>
                      </select>
                    </div>
                    <div className="f">
                      <label>
                        <span className="n">10</span>पंप क्षमता (HP)
                      </label>
                      <input
                        type="number"
                        step="0.5"
                        min="0"
                        className="mono"
                        value={farmer.hp}
                        onChange={(e) =>
                          handleFarmerChange("hp", e.target.value)
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="card">
                <h2>
                  <span className="kh">घ</span> संलग्न दस्तावेज़{" "}
                  <span className="en">Enclosures</span>
                </h2>
                <div className="body">
                  {enclosures.map((enc, i) => (
                    <div className="chk" key={i}>
                      <input
                        type="checkbox"
                        id={`enc${i}`}
                        defaultChecked={i < 4 || i === 5 || i === 6 || i === 7}
                      />
                      <label
                        htmlFor={`enc${i}`}
                        style={{
                          cursor: "pointer",
                          fontSize: "13px",
                          fontWeight: 400,
                        }}
                      >
                        {i + 1}. {enc}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="card">
                <h2>
                  <span className="kh">ज</span> पात्रता एवं स्थल परीक्षण जाँच
                  सूची <span className="en">Eligibility Checklist</span>
                </h2>
                <div className="body">
                  <div className="hint" style={{ marginBottom: "8px" }}>
                    भरी हुई सूचना से जो बिंदु तय हो सकते हैं वे{" "}
                    <span className="tag">स्वतः</span> चिह्नित हैं
                  </div>
                  {checklist.map((item, i) => (
                    <div className="chk" key={i}>
                      <input
                        type="checkbox"
                        id={`chk${i}`}
                        checked={checklistValues[i]}
                        onChange={(e) =>
                          setChecklistValues((current) =>
                            current.map((checked, index) =>
                              index === i ? e.target.checked : checked,
                            ),
                          )
                        }
                      />
                      <label
                        htmlFor={`chk${i}`}
                        style={{
                          cursor: "pointer",
                          fontSize: "13px",
                          fontWeight: 400,
                        }}
                      >
                        {i + 1}. {item}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="card">
                <h2>
                  <span className="kh">झ</span> प्रमाणीकरण एवं संस्तुति
                </h2>
                <div className="body">
                  <div className="grid">
                    <div className="f">
                      <label>प्रकरण</label>
                      <select
                        value={recommendation.verdict}
                        onChange={(e) =>
                          setRecommendation((current) => ({
                            ...current,
                            verdict: e.target.value,
                          }))
                        }
                      >
                        <option>संस्तुत</option>
                        <option>असंस्तुत</option>
                      </select>
                    </div>
                    <div className="f">
                      <label>आवेदन दिनांक</label>
                      <input
                        type="date"
                        value={recommendation.applicationDate}
                        onChange={(e) =>
                          setRecommendation((current) => ({
                            ...current,
                            applicationDate: e.target.value,
                          }))
                        }
                      />
                    </div>
                    <div className="f wide">
                      <label>संस्तुति / टिप्पणी</label>
                      <textarea
                        rows={2}
                        value={recommendation.remark}
                        onChange={(e) =>
                          setRecommendation((current) => ({
                            ...current,
                            remark: e.target.value,
                          }))
                        }
                        placeholder="स्थल निरीक्षण एवं अभिलेखों के आधार पर प्रकरण संस्तुत योग्य है।"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )}

          {activeStep === 2 && (
            <section id="S2">
              <div className="card">
                <h2>
                  <span className="kh">२</span> लाभार्थी स्व-घोषणा एवं शपथ पत्र{" "}
                  <span className="en">Affidavit</span>
                </h2>
                <div className="body">
                  <div className="flag info">
                    कृषक, भूमि, फर्म एवं वित्तीय विवरण चरण 01 से स्वतः आते हैं।
                    इस प्रपत्र में{" "}
                    <b>शीर्षक, स्थान एवं दिनांक जानबूझकर रिक्त</b> छोड़े जाते
                    हैं।
                  </div>
                  <div className="grid">
                    <div className="f">
                      <label>स्टाम्प पत्र मूल्य (₹)</label>
                      <select>
                        <option>₹10/-</option>
                        <option>₹20/-</option>
                        <option>₹50/-</option>
                      </select>
                    </div>
                    <div className="f">
                      <label>नोटरी / शपथ आयुक्त</label>
                      <input placeholder="नाम एवं पंजीकरण सं०" />
                    </div>
                  </div>
                  <div className="flag warn" style={{ marginTop: "14px" }}>
                    शपथ पत्र में «कार्य पूर्ण करा लिया है» लिखा है — इसे स्थापना
                    पूर्ण होने के बाद ही निष्पादित कराएँ।
                  </div>
                </div>
              </div>
              <div className="card">
                <h2>
                  <span className="kh">₹</span> शपथ पत्र का वित्तीय विवरण{" "}
                  <span className="en">auto</span>
                </h2>
                <div className="body">
                  <div style={{ overflowX: "auto" }}>
                    <table className="dt">
                      <thead>
                        <tr>
                          <th>क्र.</th>
                          <th>विवरण</th>
                          <th>धनराशि (₹)</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>1</td>
                          <td>स्वयं के स्वामित्व की कुल भूमि</td>
                          <td className="num">0.20 हे०</td>
                        </tr>
                        <tr>
                          <td>2</td>
                          <td>आपूर्तिकर्ता फर्म का अंतिम वास्तविक बिल</td>
                          <td className="num">₹32,308</td>
                        </tr>
                        <tr>
                          <td>3</td>
                          <td>अनुदान हेतु मान्य लागत</td>
                          <td className="num">₹29,915</td>
                        </tr>
                        <tr>
                          <td>4</td>
                          <td>देय राजसहायता (80%)</td>
                          <td className="num">₹23,932</td>
                        </tr>
                        <tr>
                          <td>5</td>
                          <td>फर्म को कृषक द्वारा किया गया/देय भुगतान</td>
                          <td className="num">₹32,308</td>
                        </tr>
                        <tr>
                          <td>6</td>
                          <td>DBT के पश्चात कृषक की प्रभावी स्वयं वहन लागत</td>
                          <td className="num">₹8,376</td>
                        </tr>
                        <tr>
                          <td>7</td>
                          <td>मान्य लागत से अधिक राशि, कृषक द्वारा वहन</td>
                          <td className="num">₹2,393</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </section>
          )}

          {activeStep === 3 && (
            <section id="S3">
              <div className="card">
                <h2>
                  <span className="kh">३</span> फर्म चयन एवं स्वैच्छिक सहमति{" "}
                  <span className="en">Firm Selection</span>
                </h2>
                <div className="body">
                  <div className="grid">
                    <div className="f wide">
                      <label>
                        चयनित पंजीकृत / अधिकृत डीलर{" "}
                        <span className="tag">चरण 01 से</span>
                      </label>
                      <input value={farmer.company} readOnly className="auto" />
                    </div>
                    <div className="f">
                      <label>फर्म पंजीकरण / empanelment सं०</label>
                      <input
                        className="mono"
                        defaultValue="UK-PDMC-AVANI-2026"
                      />
                    </div>
                    <div className="f">
                      <label>GSTIN</label>
                      <input
                        className="mono"
                        maxLength={15}
                        style={{ textTransform: "uppercase" }}
                        defaultValue="05COWPD8094K1Z6"
                      />
                    </div>
                    <div className="f">
                      <label>अधिकृत डीलर / प्रतिनिधि</label>
                      <input defaultValue="Avani Enterprises" />
                    </div>
                    <div className="f">
                      <label>प्रतिनिधि मोबाइल</label>
                      <input
                        className="mono"
                        maxLength={10}
                        defaultValue="9536462212"
                      />
                    </div>
                    <div className="f wide">
                      <label>फर्म का पता</label>
                      <input defaultValue="Lakhera Bhawan, Vill. Shibonagar, near Nayan Gaon, Kotdwar, Garhwal (Uttarakhand) - 246155" />
                    </div>
                    <div className="f">
                      <label>चयन दिनांक</label>
                      <input type="date" defaultValue="2026-09-12" />
                    </div>
                    <div className="f">
                      <label>प्रस्तावित स्थापना अवधि (दिन)</label>
                      <input
                        type="number"
                        min="1"
                        defaultValue="30"
                        className="mono"
                      />
                    </div>
                    <div className="f">
                      <label>वारंटी अवधि (वर्ष)</label>
                      <select>
                        <option>3 वर्ष</option>
                        <option>5 वर्ष</option>
                        <option>7 वर्ष</option>
                      </select>
                    </div>
                    <div className="f">
                      <label>निःशुल्क सेवा भ्रमण (प्रति वर्ष)</label>
                      <input
                        type="number"
                        min="0"
                        defaultValue="3"
                        className="mono"
                      />
                    </div>
                  </div>
                  <h4 className="subh">कृषक की स्वैच्छिक घोषणा</h4>
                  {[
                    "मैंने उपरोक्त पंजीकृत फर्म का चयन पूर्णतः स्वेच्छा से किया है; विभाग अथवा किसी अन्य का कोई दबाव नहीं है।",
                    "फर्म ने मुझे प्रणाली की तकनीकी विशेषताएँ, BIS मानक एवं इकाई लागत का विवरण स्पष्ट रूप से बता दिया है।",
                    "मैं आपूर्तिकर्ता फर्म को उसके वास्तविक/कोटेशन बिल की पूर्ण राशि अपने स्तर से भुगतान करने हेतु सहमत हूँ।",
                    "फर्म द्वारा वारंटी कार्ड, संचालन पुस्तिका एवं निःशुल्क सेवा भ्रमण की शर्तें मुझे बता दी गई हैं।",
                    "स्थापना के उपरांत ट्रायल रन मेरी उपस्थिति में निःशुल्क कराया जाएगा।",
                  ].map((decl, i) => (
                    <div className="chk" key={i}>
                      <input type="checkbox" id={`fmc${i}`} defaultChecked />
                      <label
                        htmlFor={`fmc${i}`}
                        style={{
                          cursor: "pointer",
                          fontSize: "13px",
                          fontWeight: 400,
                        }}
                      >
                        {i + 1}. {decl}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {activeStep === 4 && (
            <section id="S4">
              <div className="card">
                <h2>
                  <span className="kh">४</span> भौतिक सत्यापन रिपोर्ट{" "}
                  <span className="en">Physical Verification</span>
                </h2>
                <div className="body">
                  <div className="flag info">
                    कृषक, फर्म, प्रणाली एवं वित्तीय विवरण चरण 01/03 से स्वतः।
                    यहाँ केवल मौके पर पाई गई स्थिति भरें।
                  </div>
                  <div className="grid">
                    <div className="f">
                      <label>सत्यापन दिनांक</label>
                      <input type="date" />
                    </div>
                    <div className="f">
                      <label>QR Code / Unique ID</label>
                      <input
                        className="mono"
                        defaultValue="PMKSY-DEMO-APPLE-0001"
                      />
                    </div>
                    <div className="f">
                      <label>मौके पर मापा गया क्षेत्रफल (हे०)</label>
                      <input
                        type="number"
                        step="0.01"
                        className="mono"
                        defaultValue="0.20"
                      />
                    </div>
                    <div className="f">
                      <label>फिल्टर प्रकार</label>
                      <select>
                        <option>स्क्रीन फिल्टर</option>
                        <option>डिस्क फिल्टर</option>
                        <option>सैंड फिल्टर</option>
                      </select>
                    </div>
                    <div className="f">
                      <label>फर्टिगेशन उपकरण</label>
                      <select>
                        <option>वेंचुरी</option>
                        <option>उर्वरक टैंक</option>
                      </select>
                    </div>
                    <div className="f">
                      <label>Trial Run</label>
                      <select>
                        <option>संतोषजनक</option>
                        <option>असंतोषजनक</option>
                      </select>
                    </div>
                    <div className="f">
                      <label>सत्यापन परिणाम</label>
                      <select>
                        <option>स्वीकृत</option>
                        <option>अस्वीकृत</option>
                      </select>
                    </div>
                    <div className="f">
                      <label>सत्यापन अधिकारी</label>
                      <input
                        placeholder="नाम एवं पदनाम"
                        defaultValue="श्री अनिल कुमार, प्रभारी"
                      />
                    </div>
                    <div className="f wide">
                      <label>
                        सत्यापित कुल लागत (₹){" "}
                        <span className="tag">बिल से स्वतः</span>
                      </label>
                      <input className="auto mono" readOnly value="32,308" />
                    </div>
                  </div>
                  <h4 className="subh">BIS मानक अनुपालन (मौके पर जाँचा)</h4>
                  {bisChecklist.map((item, i) => (
                    <div className="chk" key={i}>
                      <input type="checkbox" id={`bis${i}`} defaultChecked />
                      <label
                        htmlFor={`bis${i}`}
                        style={{
                          cursor: "pointer",
                          fontSize: "13px",
                          fontWeight: 400,
                        }}
                      >
                        {i + 1}. {item}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {activeStep === 5 && (
            <section id="S5">
              <div className="card">
                <h2>
                  <span className="kh">५</span> कंपनी बिल — सामग्री-वार BoQ{" "}
                  <span className="en">Item-wise Bill</span>
                </h2>
                <div className="body">
                  <div className="grid" style={{ marginBottom: "12px" }}>
                    <div className="f">
                      <label>बिल संख्या</label>
                      <input className="mono" defaultValue="DEMO-APPLE-0001" />
                    </div>
                    <div className="f">
                      <label>बिल दिनांक</label>
                      <input type="date" defaultValue="2026-09-20" />
                    </div>
                    <div className="f">
                      <label>स्थापना दिनांक</label>
                      <input type="date" defaultValue="2026-09-18" />
                    </div>
                    <div className="f">
                      <label>GST दर (कुल बिल में शामिल)</label>
                      <select>
                        <option>0% (बिना GST)</option>
                        <option>5%</option>
                        <option>12%</option>
                        <option>18%</option>
                      </select>
                    </div>
                  </div>
                  <div className="btnrow" style={{ marginBottom: "10px" }}>
                    <button
                      className="btn water sm"
                      type="button"
                      onClick={fillSampleData}
                    >
                      🧪 Apple 0.20 हे० / 2×2 m पूरा Sample देखें
                    </button>
                  </div>
                  <div className="stamp-options">
                    <div className="stamp-options-title">
                      केवल कंपनी Tax Invoice पर नीली मुहर — प्रिंट विकल्प
                    </div>
                    <label>
                      <input
                        type="checkbox"
                        checked={bill.bl_stamp_farmer}
                        onChange={(e) =>
                          setBill({
                            ...bill,
                            bl_stamp_farmer: e.target.checked,
                          })
                        }
                      />{" "}
                      कृषक हस्ताक्षर वाली मुहर
                    </label>
                    <label>
                      <input
                        type="checkbox"
                        checked={bill.bl_stamp_officer}
                        onChange={(e) =>
                          setBill({
                            ...bill,
                            bl_stamp_officer: e.target.checked,
                          })
                        }
                      />{" "}
                      प्रभारी की संस्तुति वाली मुहर
                    </label>
                  </div>
                  <div style={{ overflowX: "auto" }}>
                    <table className="dt">
                      <thead>
                        <tr>
                          <th>S.No</th>
                          <th>Description of Goods</th>
                          <th>BIS / Standard</th>
                          <th>Qty</th>
                          <th>Unit</th>
                          <th className="num">Rate/Unit (₹)</th>
                          <th className="num">Taxable Value (₹)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {boqItems.map((item) => (
                          <tr key={item.sn}>
                            <td>{item.sn}</td>
                            <td>{item.desc}</td>
                            <td style={{ fontSize: "11px" }}>{item.bis}</td>
                            <td>{item.qty}</td>
                            <td>{item.unit}</td>
                            <td className="num">
                              {item.rate.toLocaleString("en-IN")}
                            </td>
                            <td className="num">
                              {item.val.toLocaleString("en-IN")}
                            </td>
                          </tr>
                        ))}
                        <tr>
                          <td colSpan={6} className="num">
                            <b>Sub Total</b>
                          </td>
                          <td className="num">
                            <b>{subtotal.toLocaleString("en-IN")}</b>
                          </td>
                        </tr>
                        <tr>
                          <td colSpan={6} className="num">
                            Installation / Labour Charges @ <b>5%</b>
                          </td>
                          <td className="num">
                            {installChg.toLocaleString("en-IN")}
                          </td>
                        </tr>
                        <tr>
                          <td colSpan={6} className="num">
                            <b>GRAND TOTAL (₹)</b>
                          </td>
                          <td className="num">
                            <b>{grandTotal.toLocaleString("en-IN")}</b>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </section>
          )}

          {activeStep === 6 && (
            <section id="S6">
              <div className="card">
                <h2>
                  <span className="kh">६</span> नकद प्राप्ति रसीद{" "}
                  <span className="en">Cash Receipt</span>
                </h2>
                <div className="body">
                  <div className="flag info">
                    कृषक द्वारा कंपनी को पूर्ण वास्तविक बिल राशि का भुगतान होने
                    पर यह रसीद बनाइए।
                  </div>
                  <div className="grid">
                    <div className="f">
                      <label>रसीद संख्या</label>
                      <input
                        className="mono"
                        value={receipt.rc_no}
                        onChange={(e) =>
                          setReceipt({ ...receipt, rc_no: e.target.value })
                        }
                        placeholder="001"
                      />
                    </div>
                    <div className="f">
                      <label>रसीद दिनांक</label>
                      <input
                        type="date"
                        value={receipt.rc_date}
                        onChange={(e) =>
                          setReceipt({ ...receipt, rc_date: e.target.value })
                        }
                      />
                    </div>
                    <div className="f">
                      <label>कंपनी को प्राप्त पूर्ण बिल राशि (₹)</label>
                      <input
                        type="number"
                        min="0"
                        className="mono"
                        value={receipt.rc_amt}
                        onChange={(e) =>
                          setReceipt({
                            ...receipt,
                            rc_amt: parseInt(e.target.value) || 0,
                          })
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )}

          {activeStep === 7 && (
            <section id="S7">
              <div className="card">
                <h2>किसान रजिस्टर</h2>
                <div className="body">
                  <div className="btnrow" style={{ marginBottom: "12px" }}>
                    <input
                      placeholder="नाम / ग्राम / केंद्र / आधार से खोजें"
                      style={{ maxWidth: "280px" }}
                    />
                    <button className="btn ghost sm">CSV निर्यात</button>
                    <button className="btn ghost sm">बैकअप (JSON)</button>
                    <button
                      className="btn water sm"
                      onClick={() => setSamplePrintReady(true)}
                    >
                      प्रिंट सभी
                    </button>
                  </div>
                  <div style={{ overflowX: "auto" }}>
                    <table className="dt">
                      <thead>
                        <tr>
                          <th>क्र.</th>
                          <th>किसान नाम</th>
                          <th>पिता</th>
                          <th>ग्राम</th>
                          <th>केंद्र</th>
                          <th>प्रणाली</th>
                          <th>क्षेत्र</th>
                          <th>अनुदान</th>
                          <th>कृषक अंश</th>
                          <th>दिनांक</th>
                          <th>प्रिंट</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>1</td>
                          <td>श्री सुरेश सिंह</td>
                          <td>मोहन सिंह</td>
                          <td>शिबूनगर</td>
                          <td>कोटद्वार</td>
                          <td>ड्रिप</td>
                          <td className="num">0.20</td>
                          <td className="num">₹23,932</td>
                          <td className="num">₹8,376</td>
                          <td>10/9/2026</td>
                          <td>
                            <button
                              className="btn water sm"
                              onClick={() => setSamplePrintReady(true)}
                            >
                              प्रिंट
                            </button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </section>
          )}

          {activeStep === 8 && (
            <section id="S8">
              <div className="card">
                <h2>
                  <span className="kh">₹</span> दर तालिका — प्रबंधन{" "}
                  <span className="en">Rate Management</span>
                </h2>
                <div className="body">
                  <div className="flag info">
                    यहाँ दी गई दरें ही «प्रस्तावित प्रणाली» की सारी गणना में
                    उपयोग होती हैं।
                  </div>
                  <div style={{ overflowX: "auto" }}>
                    <table className="dt">
                      <thead>
                        <tr>
                          <th>क्र.</th>
                          <th>प्रणाली</th>
                          <th>क्षेत्रफल</th>
                          <th>स्पेसिंग</th>
                          <th>इकाई लागत (₹)</th>
                          <th>अनुदान दर</th>
                          <th>देय अनुदान (₹)</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>1</td>
                          <td>ड्रिप</td>
                          <td>0.2 हे०</td>
                          <td>2x2</td>
                          <td className="num">29,915</td>
                          <td>80%</td>
                          <td className="num">23,932</td>
                        </tr>
                        <tr>
                          <td>2</td>
                          <td>ड्रिप</td>
                          <td>0.4 हे०</td>
                          <td>3x3</td>
                          <td className="num">55,830</td>
                          <td>80%</td>
                          <td className="num">44,664</td>
                        </tr>
                        <tr>
                          <td>3</td>
                          <td>ड्रिप</td>
                          <td>1.0 हे०</td>
                          <td>4x4</td>
                          <td className="num">1,39,575</td>
                          <td>80%</td>
                          <td className="num">1,11,660</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </section>
          )}

          <div className="ledger">
            <div className="row">
              <div className="btnrow">
                <button className="btn ghost sm">अभी सहेजें</button>
                <button
                  className="btn water sm"
                  onClick={() => setSamplePrintReady(true)}
                >
                  सभी 6 प्रपत्र प्रिंट
                </button>
                <div className="amt-group">
                  <div className="amt big">
                    <span className="k">देय अनुदान</span>
                    <span className="v mono">
                      ₹
                      {systemRows
                        .reduce((s, r) => s + r.subsidy, 0)
                        .toLocaleString("en-IN")}
                    </span>
                  </div>
                  <div className="amt far">
                    <span className="k">कृषक अंश</span>
                    <span className="v mono">
                      ₹
                      {systemRows
                        .reduce((s, r) => s + r.farmer, 0)
                        .toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ════════════════════════════════════════════ */}
      {/* PRINT AREA - ALL 6+ PAGES                    */}
      {/* ════════════════════════════════════════════ */}
      <div
        id="printArea"
        className={samplePrintReady ? "show" : ""}
        aria-label="प्रिंट पूर्वावलोकन"
      >
        {samplePrintReady && (
          <>
            {/* PAGE 1: APPLICATION PART 1 */}
            <article className="sheet">
              <header className="hdr">
                <div className="t1">
                  प्रधानमंत्री कृषि सिंचाई योजना (PMKSY) — प्रति बूँद अधिक फसल
                  (PDMC)
                </div>
                <div className="t2">
                  उद्यान एवं खाद्य प्रसंस्करण विभाग, उत्तराखण्ड
                </div>
                <div className="t2">
                  कार्यालय उद्यान विशेषज्ञ, कोटद्वार, पौड़ी गढ़वाल, उत्तराखण्ड
                </div>
              </header>
              <div className="application-title">
                सूक्ष्म सिंचाई — आवेदन-सह-संयुक्त सर्वेक्षण प्रपत्र
              </div>
              <div className="photobox">
                पासपोर्ट साइज़
                <br />
                फोटो चिपकाएँ
              </div>
              <h3 className="part">
                भाग – 1 : लाभार्थी द्वारा भरा जाने वाला विवरण
              </h3>
              <h4 className="sec">क — क्षेत्र विवरण</h4>
              <div className="fl">
                <div className="fi">
                  1. जनपद :{" "}
                  <span className="val">{farmer.district || "—"}</span>
                </div>
                <div className="fi">
                  2. उद्यान सचल दल केंद्र :{" "}
                  <span className="val">{farmer.kendra || "—"}</span>
                </div>
                <div className="fi">
                  3. विकासखंड :{" "}
                  <span className="val">{farmer.block || "—"}</span>
                </div>
                <div className="fi">
                  4. विधान सभा :{" "}
                  <span className="val">{farmer.vidhan || "—"}</span>
                </div>
                <div className="fi">
                  5. ग्राम पंचायत :{" "}
                  <span className="val">{farmer.panchayat || "—"}</span>
                </div>
                <div className="fi">
                  6. ग्राम :{" "}
                  <span className="val">{farmer.village || "—"}</span>
                </div>
              </div>
              <h4 className="sec">ख — किसान एवं बैंक विवरण (DBT हेतु)</h4>
              <div className="fl">
                <div className="fi">
                  1. किसान का नाम :{" "}
                  <span className="val">{farmer.fname || "—"}</span>
                </div>
                <div className="fi">
                  2. पिता/पति का नाम :{" "}
                  <span className="val">{farmer.rel || "—"}</span>
                </div>
                <div className="fi">
                  3. लिंग :{" "}
                  <span className="val">
                    {farmer.gender === "पुरुष" ? "पुरुष ☑" : "पुरुष ☐"}{" "}
                    {farmer.gender === "महिला" ? "महिला ☑" : "महिला ☐"} अन्य ☐
                  </span>
                </div>
                <div className="fi">
                  4. सामाजिक श्रेणी :{" "}
                  <span className="val">
                    {farmer.social === "सामान्य" ? "सामान्य ☑" : "सामान्य ☐"}{" "}
                    {farmer.social === "अ.जा. (SC)" ? "अ.जा. ☑" : "अ.जा. ☐"}{" "}
                    अ.ज.जा. ☐ अ.प.व. ☐
                  </span>
                </div>
                <div className="fi">
                  5. किसान वर्ग :{" "}
                  <span className="val">
                    {farmer.fclass === "सीमांत (&lt;1 हे०)"
                      ? "सीमांत ☑"
                      : "सीमांत ☐"}{" "}
                    लघु ☐ अन्य ☐
                  </span>
                </div>
                <div className="fi">
                  6. लाभार्थी प्रकार :{" "}
                  <span className="val">
                    {farmer.btype === "व्यक्तिगत"
                      ? "व्यक्तिगत ☑"
                      : "व्यक्तिगत ☐"}{" "}
                    समूह / SHG ☐ FPO ☐
                  </span>
                </div>
                <div className="fi">
                  7. आधार संख्या :{" "}
                  <span className="val">{farmer.aadhaar || "—"}</span>
                </div>
                <div className="fi">
                  8. मोबाइल :{" "}
                  <span className="val">{farmer.mobile || "—"}</span>
                </div>
                <div className="fi">
                  9. बैंक खाता सं० :{" "}
                  <span className="val">{farmer.acct || "—"}</span>
                </div>
                <div className="fi">
                  10. बैंक एवं शाखा :{" "}
                  <span className="val">{farmer.bank || "—"}</span>
                </div>
                <div className="fi">
                  11. IFSC : <span className="val">{farmer.ifsc || "—"}</span>
                </div>
                <div className="fi">
                  12. उद्यान कार्ड सं० :{" "}
                  <span className="val">{farmer.hortcard || "—"}</span>
                </div>
                <div className="fi full">
                  13. पूरा पता :{" "}
                  <span className="val lg">{farmer.addr || "—"}</span>
                </div>
              </div>
              <h4 className="sec">ग — भूमि, जल स्रोत एवं प्रस्तावित प्रणाली</h4>
              <div className="fl">
                <div className="fi">
                  1. खाता सं० :{" "}
                  <span className="val sm">{farmer.ownKhata || "—"}</span>
                </div>
                <div className="fi">
                  खसरा सं० :{" "}
                  <span className="val sm">{farmer.ownKhasra || "—"}</span>
                </div>
                <div className="fi">
                  2. स्वयं की भूमि (हे०) :{" "}
                  <span className="val sm">{ownArea.toFixed(2)}</span>
                </div>
                <div className="fi">
                  3. प्रस्तावित क्षेत्र (हे०) :{" "}
                  <span className="val sm">{proposedArea.toFixed(2)}</span>
                </div>
                <div className="fi">
                  4. भूमि स्वामित्व :{" "}
                  <span className="val">
                    {farmer.tenure === "स्वयं" ? "स्वयं ☑" : "स्वयं ☐"}{" "}
                    {farmer.tenure === "पट्टा / अनुबंध"
                      ? "पट्टा / अनुबंध ☑"
                      : "पट्टा / अनुबंध ☐"}
                  </span>
                </div>
                <div className="fi">
                  5. पट्टा अवधि (न्यूनतम 07 वर्ष) :{" "}
                  <span className="val sm">{farmer.lease || "—"}</span>
                </div>
                <div className="fi">
                  6. मुख्य फसल :{" "}
                  <span className="val">
                    {systemRows.map((row) => row.crop).filter(Boolean).join(", ") ||
                      "—"}
                  </span>
                </div>
                <div className="fi">
                  7. रोपण दूरी / स्पेसिंग :{" "}
                  <span className="val">
                    {systemRows
                      .map((row) => row.spacing)
                      .filter(Boolean)
                      .join(", ") || "—"}
                  </span>
                </div>
                <div className="fi">
                  8. गत 07 वर्षों में पूर्व अनुदान ?{" "}
                  <span className="val">
                    {farmer.prevsub === "नहीं"
                      ? "हाँ ☐ ☑ नहीं"
                      : "☑ हाँ ☐ नहीं"}
                  </span>
                </div>
                <div className="fi">
                  9. जल स्रोत :{" "}
                  <span className="val">
                    {farmer.source === "अन्य"
                      ? `अन्य — ${farmer.sourceOther || "—"}`
                      : farmer.source || "—"}
                  </span>
                </div>
                <div className="fi full">
                  10. प्रणाली का प्रकार :{" "}
                  <span className="val lg">
                    {systemRows[0]?.sys === "ड्रिप" ? "ड्रिप ☑" : "ड्रिप ☐"}{" "}
                    माइक्रो स्प्रिंकलर ☐ मिनी स्प्रिंकलर ☐ पोर्टेबल स्प्रिंकलर ☐
                  </span>
                </div>
                <div className="fi full">
                  11. चयनित/अधिकृत फर्म :{" "}
                  <span className="val lg">{farmer.company || "—"}</span>
                </div>
              </div>
              {coOwners.length > 0 && (
                <table className="pf">
                  <thead>
                    <tr>
                      <th colSpan={7}>प्रस्तावित भूमि का स्रोत विवरण</th>
                    </tr>
                    <tr>
                      <th>क्र.</th>
                      <th>भू-स्वामी</th>
                      <th>संबंध</th>
                      <th>खाता सं०</th>
                      <th>खसरा सं०</th>
                      <th>क्षेत्रफल (हे०)</th>
                      <th>ग्राम</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>1</td>
                      <td>{farmer.fname || "—"} (स्वयं)</td>
                      <td>—</td>
                      <td>{farmer.ownKhata || "—"}</td>
                      <td>{farmer.ownKhasra || "—"}</td>
                      <td>{ownArea.toFixed(2)}</td>
                      <td>{farmer.village || "—"}</td>
                    </tr>
                    {coOwners.map((owner, index) => (
                      <tr key={index}>
                        <td>{index + 2}</td>
                        <td>
                          {owner.name || "—"}
                          {owner.relative ? `, पिता/पति ${owner.relative}` : ""}
                        </td>
                        <td>{owner.relation || "—"}</td>
                        <td>{owner.khata || "—"}</td>
                        <td>{owner.khasra || "—"}</td>
                        <td>
                          {(Number.parseFloat(owner.area) || 0).toFixed(2)}
                        </td>
                        <td>{owner.village || "—"}</td>
                      </tr>
                    ))}
                    <tr className="tot">
                      <td colSpan={6}>प्रस्तावित भूमि का क्षेत्रफल (कुल योग)</td>
                      <td>{landAreaTotal.toFixed(2)}</td>
                    </tr>
                  </tbody>
                </table>
              )}
              <h4 className="sec">घ — संलग्न दस्तावेज़ की सूची</h4>
              <table className="pf">
                <thead>
                  <tr>
                    <th>क्र.</th>
                    <th>दस्तावेज़ संलग्न</th>
                    <th>हाँ / नहीं</th>
                  </tr>
                </thead>
                <tbody>
                  {enclosures.map((enc, i) => (
                    <tr key={i}>
                      <td>{i + 1}</td>
                      <td>{enc}</td>
                      <td>
                        {i < 4 || i === 5 || i === 6 || i === 7
                          ? "☑ हाँ"
                          : "☐ हाँ"}{" "}
                        ☐ नहीं
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="pgno">आवेदन · पृष्ठ 1 / 2</div>
            </article>

            {/* PAGE 2: APPLICATION PART 2 */}
            <article className="sheet application-page">
              <h4 className="sec">ङ — लाभार्थी की घोषणा</h4>
              <div className="box">
                मैं, {farmer.fname || "—"}, सत्यनिष्ठा से घोषित करता हूँ कि —
                (1) इस प्रपत्र में दी गई समस्त सूचनाएँ पूर्णतः सत्य एवं सही हैं;
                असत्य पाए जाने पर मेरा आवेदन निरस्त किया जा सकेगा। (2) मैं योजना
                के दिशा-निर्देशों के अनुसार अपने प्रक्षेत्र में सूक्ष्म सिंचाई
                प्रणाली स्थापित कराने हेतु सहमत हूँ। (3) मैं स्वीकृत अनुदान DBT
                के माध्यम से सीधे अपने आधार-लिंक बैंक खाते में प्राप्त करने हेतु
                सहमत हूँ। (4) मैंने विगत 07 वर्षों में इस भूमि खंड पर सूक्ष्म
                सिंचाई हेतु किसी भी सरकारी योजना से अनुदान प्राप्त नहीं किया है।
                (5) मैंने पंजीकृत फर्म का चयन स्वेच्छा से किया है तथा नियमानुसार
                देय कृषक अंश जमा करने हेतु सहमत हूँ। (6) मैं विभाग द्वारा
                निर्धारित निरीक्षण एवं भौतिक सत्यापन हेतु सदैव सहयोग करूँगा।
              </div>
              <div className="fl">
                <div className="fi">
                  नाम : <span className="val">{farmer.fname || "—"}</span>
                </div>
                <div className="fi">
                  दिनांक :{" "}
                  <span className="val">
                    {recommendation.applicationDate
                      ? recommendation.applicationDate
                          .split("-")
                          .reverse()
                          .join("/")
                      : "—"}
                  </span>
                </div>
              </div>
              <div className="sigrow">
                <div>लाभार्थी के हस्ताक्षर</div>
              </div>

              <h3 className="part">
                भाग – 2 : संयुक्त सर्वेक्षण के समय भरा जाने वाला विवरण
              </h3>
              <h4 className="sec">च — स्थलीय सत्यापन एवं प्रक्षेत्र विवरण</h4>
              <div className="fl">
                <div className="fi">
                  1. अक्षांश : <span className="val">{farmer.lat || "—"}</span>
                </div>
                <div className="fi">
                  2. देशांतर : <span className="val">{farmer.lon || "—"}</span>
                </div>
                <div className="fi">
                  3. कृषि मैपर एप ID :{" "}
                  <span className="val">{farmer.mapperid || "—"}</span>
                </div>
                <div className="fi">
                  4. भूमि की प्रकृति :{" "}
                  <span className="val">
                    {farmer.terrain === "समतल" ? "समतल ☑" : "समतल ☐"} सीढ़ीदार ☐
                    ढालदार ☐
                  </span>
                </div>
                <div className="fi">
                  5. जल स्रोत की दूरी (मी०) :{" "}
                  <span className="val">{farmer.wdist || "—"}</span>
                </div>
                <div className="fi">
                  6. ऊर्ध्वाधर ऊँचाई अंतर (मी०) :{" "}
                  <span className="val">{farmer.vdrop || "—"}</span>
                </div>
                <div className="fi">
                  7. जल उपलब्धता (ली०/घंटा) :{" "}
                  <span className="val">{farmer.wavail || "—"}</span>
                </div>
                <div className="fi">
                  8. जल की गुणवत्ता :{" "}
                  <span className="val">
                    {farmer.wqual === "स्वच्छ" ? "स्वच्छ ☑" : "स्वच्छ ☐"}{" "}
                    गादयुक्त ☐ लौहयुक्त ☐
                  </span>
                </div>
                <div className="fi">
                  9. पंप :{" "}
                  <span className="val">
                    {farmer.pump === "विद्युत" ? "विद्युत ☑" : "विद्युत ☐"} डीजल
                    ☐ सौर ☐ उपलब्ध नहीं ☐
                  </span>
                </div>
                <div className="fi">
                  10. पंप क्षमता (HP) :{" "}
                  <span className="val">{farmer.hp || "—"}</span>
                </div>
              </div>

              <h4 className="sec">छ — प्रस्तावित प्रणाली एवं अनुदान की गणना</h4>
              <table className="pf">
                <thead>
                  <tr>
                    <th>क्र.</th>
                    <th>प्रणाली</th>
                    <th>फसल</th>
                    <th>स्पेसिंग</th>
                    <th>क्षेत्र (हे०)</th>
                    <th>इकाई लागत (₹)</th>
                    <th>दर</th>
                    <th>देय अनुदान (₹)</th>
                    <th>कृषक अंश (₹)</th>
                  </tr>
                </thead>
                <tbody>
                  {systemRows.map((row, i) => (
                    <tr key={i}>
                      <td>{i + 1}</td>
                      <td>{row.sys}</td>
                      <td>{row.crop}</td>
                      <td>{row.spacing}</td>
                      <td>{row.area}</td>
                      <td>{row.cost.toLocaleString("en-IN")}</td>
                      <td>80%</td>
                      <td>{row.subsidy.toLocaleString("en-IN")}</td>
                      <td>{row.farmer.toLocaleString("en-IN")}</td>
                    </tr>
                  ))}
                  <tr className="tot">
                    <td colSpan={4}>योग</td>
                    <td>
                      {systemRows.reduce((s, r) => s + r.area, 0).toFixed(2)}
                    </td>
                    <td>
                      {systemRows
                        .reduce((s, r) => s + r.cost, 0)
                        .toLocaleString("en-IN")}
                    </td>
                    <td>80%</td>
                    <td>
                      {systemRows
                        .reduce((s, r) => s + r.subsidy, 0)
                        .toLocaleString("en-IN")}
                    </td>
                    <td>
                      {systemRows
                        .reduce((s, r) => s + r.farmer, 0)
                        .toLocaleString("en-IN")}
                    </td>
                  </tr>
                </tbody>
              </table>

              <h4 className="sec">ज — पात्रता एवं स्थल परीक्षण जाँच सूची</h4>
              <table className="pf">
                <thead>
                  <tr>
                    <th>क्र.</th>
                    <th>परीक्षण बिंदु</th>
                    <th>हाँ / नहीं</th>
                  </tr>
                </thead>
                <tbody>
                  {checklist.map((item, index) => (
                    <tr key={item}>
                      <td>{index + 1}</td>
                      <td>{item}</td>
                      <td>{checklistValues[index] ? "☑ हाँ  ☐ नहीं" : "☐ हाँ  ☑ नहीं"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <h4 className="sec">झ — प्रमाणीकरण एवं संस्तुति</h4>
              <div className="box">
                प्रमाणित किया जाता है कि उपरोक्त प्रक्षेत्र का संयुक्त रूप से
                स्थलीय निरीक्षण किया गया, अभिलेखों का परीक्षण किया गया तथा
                लाभार्थी दिशा-निर्देशों के अनुसार पात्र पाया गया। प्रकरण{" "}
                {recommendation.verdict} किया जाता है।
              </div>
              <div className="fi full">
                <b>संस्तुति / टिप्पणी :</b>{" "}
                {recommendation.remark || "—"}
              </div>
              <div className="sigrow">
                <div>फर्म / अधिकृत डीलर प्रतिनिधि</div>
                <div>प्रभारी, उद्यान सचल दल केंद्र कोटद्वार</div>
              </div>
              <h3 className="part">भाग – 3 : कार्यालय प्रयोगार्थ</h3>
              <div className="fi full">
                परीक्षणोपरांत — स्वीकृत ☐ / अस्वीकृत ☐
              </div>
              <div className="sigrow">
                <div>उद्यान विशेषज्ञ, कोटद्वार गढ़वाल</div>
              </div>
              <div className="pgno">आवेदन · पृष्ठ 2 / 2</div>
            </article>

            {/* PAGE 3: AFFIDAVIT */}
            <article className="sheet">
              <div className="application-title">
                लाभार्थी स्व-घोषणा एवं शपथ पत्र
              </div>
              <div className="fl">
                <div className="fi full">
                  (स्थापना कार्य पूर्ण होने के पश्चात — स्वयं की पूर्ण भूमि की
                  स्थिति में) · स्टाम्प : ₹10/-
                </div>
              </div>
              <div className="box">
                मैं {farmer.fname || "—"}, पुत्र {farmer.rel || "—"}, निवासी{" "}
                {farmer.village || "—"}, ग्राम पंचायत {farmer.panchayat || "—"},
                विकासखंड {farmer.block || "—"}, जिला {farmer.district || "—"},
                उत्तराखण्ड, सत्यनिष्ठा से शपथपूर्वक निम्नलिखित घोषणा करता/करती
                हूँ कि —
              </div>
              <ul className="decl">
                <li>
                  1. यह कि मेरी स्वयं के स्वामित्व एवं कब्जे की भूमि का विवरण —
                  खाता संख्या {farmer.ownKhata || "—"}, खसरा संख्या{" "}
                  {farmer.ownKhasra || "—"}, कुल क्षेत्रफल {ownArea.toFixed(2)}{" "}
                  हे०, फसल{" "}
                  {systemRows.map((row) => row.crop).filter(Boolean).join(", ") ||
                    "—"}, सूक्ष्म सिंचाई प्रणाली{" "}
                  {systemRows[0]?.sys || "—"}, स्पेसिंग{" "}
                  {systemRows
                    .map((row) => row.spacing)
                    .filter(Boolean)
                    .join(", ") || "—"}।
                </li>
                <li>
                  2. यह कि उक्त भूमि पर PMKSY-PDMC के अंतर्गत ड्रिप सूक्ष्म
                  सिंचाई प्रणाली की स्थापना का कार्य मेसर्स{" "}
                  {farmer.company || "—"} द्वारा विभागीय निर्धारित मानकों के
                  अनुसार पूर्ण किया गया है।
                </li>
                <li>
                  3. यह कि स्थापना कार्य पूर्ण होने के पश्चात आपूर्तिकर्ता फर्म
                  द्वारा प्रस्तुत अंतिम वास्तविक बिल राशि ₹
                  {grandTotal.toLocaleString("en-IN")}/- है।
                </li>
                <li>
                  4. मान्य लागत पर योजना में निर्धारित दर (80%) के अनुसार ₹
                  {systemRows
                    .reduce((s, r) => s + r.subsidy, 0)
                    .toLocaleString("en-IN")}
                  /- राजसहायता देय है, जिसका भुगतान DBT के माध्यम से मेरे बैंक
                  खाते ({farmer.acct || "—"}, {farmer.ifsc || "—"}) में किया
                  जाना है।
                </li>
                <li>
                  5. मैं स्वीकार करता हूँ कि आपूर्तिकर्ता फर्म को स्थापना कार्य
                  के संबंध में देय राशि का भुगतान मेरी जिम्मेदारी है।
                </li>
                <li>
                  6. मैं घोषित करता हूँ कि उपरोक्त भूमि पर सूक्ष्म सिंचाई
                  स्थापना हेतु विगत 07 वर्षों में किसी अन्य सरकारी योजना/विभाग
                  से ऐसा अनुदान प्राप्त नहीं किया गया है।
                </li>
              </ul>
              <h4 className="sec">अंतिम वित्तीय विवरण</h4>
              <table className="pf">
                <thead>
                  <tr>
                    <th>क्र.</th>
                    <th>विवरण</th>
                    <th>धनराशि (₹)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>1</td>
                    <td>स्वयं के स्वामित्व की कुल भूमि</td>
                    <td className="n">{landAreaTotal.toFixed(2)} हे०</td>
                  </tr>
                  <tr>
                    <td>2</td>
                    <td>आपूर्तिकर्ता फर्म का अंतिम वास्तविक बिल</td>
                    <td className="n">₹{grandTotal.toLocaleString("en-IN")}</td>
                  </tr>
                  <tr>
                    <td>3</td>
                    <td>अनुदान हेतु मान्य लागत</td>
                    <td className="n">
                      ₹
                      {systemRows
                        .reduce((s, r) => s + r.cost, 0)
                        .toLocaleString("en-IN")}
                    </td>
                  </tr>
                  <tr>
                    <td>4</td>
                    <td>देय राजसहायता</td>
                    <td className="n">
                      ₹
                      {systemRows
                        .reduce((s, r) => s + r.subsidy, 0)
                        .toLocaleString("en-IN")}
                    </td>
                  </tr>
                  <tr>
                    <td>5</td>
                    <td>फर्म को कृषक द्वारा किया गया/देय भुगतान</td>
                    <td className="n">₹{grandTotal.toLocaleString("en-IN")}</td>
                  </tr>
                </tbody>
              </table>
              {coOwners.length > 0 && (
                <>
                  <h4 className="sec">सह-खाताधारकों का भूमि विवरण</h4>
                  <table className="pf">
                    <thead>
                      <tr>
                        <th>क्र.</th>
                        <th>सह-खाताधारक का नाम</th>
                        <th>पिता / पति</th>
                        <th>खाता सं०</th>
                        <th>संबंध</th>
                        <th>खसरा सं०</th>
                        <th>क्षेत्रफल (हे०)</th>
                        <th>ग्राम</th>
                        <th>हस्ताक्षर</th>
                      </tr>
                    </thead>
                    <tbody>
                      {coOwners.map((owner, index) => (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td>{owner.name || "—"}</td>
                          <td>{owner.relative || "—"}</td>
                          <td>{owner.khata || "—"}</td>
                          <td>{owner.relation || "—"}</td>
                          <td>{owner.khasra || "—"}</td>
                          <td>
                            {(Number.parseFloat(owner.area) || 0).toFixed(2)}
                          </td>
                          <td>{owner.village || "—"}</td>
                          <td>________________</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </>
              )}
              <div className="sigrow">
                <div>
                  शपथकता / कृषक
                  <br />
                  नाम : {farmer.fname || "—"}
                  <br />
                  मो० : {farmer.mobile || "—"}
                </div>
                <div>
                  स्थान : __________________
                  <br />
                  दिनांक : __________________
                </div>
              </div>
              <div className="pgno">शपथ पत्र · TEMPLATE-A</div>
            </article>

            {/* PAGE 4: FIRM SELECTION */}
            <article className="sheet">
              <div className="application-title">
                आपूर्तिकर्ता फर्म चयन एवं स्वैकल्पिक सहमति पत्र
              </div>
              <h4 className="sec">1 — कृषक विवरण</h4>
              <div className="fl">
                <div className="fi">
                  कृषक का नाम :{" "}
                  <span className="val">{farmer.fname || "—"}</span>
                </div>
                <div className="fi">
                  पिता/पति : <span className="val">{farmer.rel || "—"}</span>
                </div>
                <div className="fi">
                  ग्राम / पंचायत :{" "}
                  <span className="val">
                    {farmer.village || "—"} / {farmer.panchayat || "—"}
                  </span>
                </div>
                <div className="fi">
                  विकासखंड / केंद्र :{" "}
                  <span className="val">
                    {farmer.block || "—"} / {farmer.kendra || "—"}
                  </span>
                </div>
                <div className="fi">
                  मोबाइल : <span className="val">{farmer.mobile || "—"}</span>
                </div>
              </div>
              <h4 className="sec">2 — चयनित फर्म का विवरण</h4>
              <div className="fl">
                <div className="fi full">
                  फर्म का नाम :{" "}
                  <span className="val lg">
                    {farmer.company || "—"} — भारत ड्रिप इरिगेशन एंड एग्रो
                  </span>
                </div>
                <div className="fi">
                  GSTIN : <span className="val">05COWPD8094K1Z6</span>
                </div>
                <div className="fi">
                  अधिकृत डीलर / प्रतिनिधि :{" "}
                  <span className="val">{farmer.company || "—"}</span>
                </div>
                <div className="fi">
                  प्रतिनिधि मोबाइल : <span className="val">9536462212</span>
                </div>
                <div className="fi full">
                  फर्म का पता :{" "}
                  <span className="val lg">
                    Lakhera Bhawan, Vill. Shibonagar, near Nayan Gaon, Kotdwar,
                    Garhwal (Uttarakhand) - 246155
                  </span>
                </div>
                <div className="fi">
                  चयन दिनांक : <span className="val">12/9/2026</span>
                </div>
                <div className="fi">
                  प्रस्तावित स्थापना अवधि : <span className="val">30 दिन</span>
                </div>
                <div className="fi">
                  वारंटी अवधि : <span className="val">3 वर्ष</span>
                </div>
                <div className="fi">
                  निःशुल्क सेवा भ्रमण :{" "}
                  <span className="val">3 प्रति वर्ष</span>
                </div>
              </div>
              <h4 className="sec">3 — वित्तीय सारांश</h4>
              <table className="pf">
                <thead>
                  <tr>
                    <th>क्र.</th>
                    <th>प्रणाली / फसल / स्पेसिंग</th>
                    <th>क्षेत्र (हे०)</th>
                    <th>विभागीय मानक लागत (₹)</th>
                    <th>फर्म कोटेशन (₹)</th>
                    <th>देय DBT अनुदान (₹)</th>
                    <th>फर्म को कृषक भुगतान (₹)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>1</td>
                    <td>
                      {systemRows[0]?.sys || "—"} / {systemRows[0]?.crop || "—"}{" "}
                      / {systemRows[0]?.spacing || "—"}
                    </td>
                    <td>{systemRows[0]?.area || 0}</td>
                    <td className="n">
                      {systemRows[0]?.cost.toLocaleString("en-IN") || 0}
                    </td>
                    <td className="n">{grandTotal.toLocaleString("en-IN")}</td>
                    <td className="n">
                      {systemRows[0]?.subsidy.toLocaleString("en-IN") || 0}
                    </td>
                    <td className="n">{grandTotal.toLocaleString("en-IN")}</td>
                  </tr>
                  <tr className="tot">
                    <td colSpan={2}>योग</td>
                    <td>{systemRows[0]?.area || 0}</td>
                    <td className="n">
                      {systemRows[0]?.cost.toLocaleString("en-IN") || 0}
                    </td>
                    <td className="n">{grandTotal.toLocaleString("en-IN")}</td>
                    <td className="n">
                      {systemRows[0]?.subsidy.toLocaleString("en-IN") || 0}
                    </td>
                    <td className="n">{grandTotal.toLocaleString("en-IN")}</td>
                  </tr>
                </tbody>
              </table>
              <h4 className="sec">4 — कृषक की स्वैकल्पिक घोषणा</h4>
              <table className="pf">
                <thead>
                  <tr>
                    <th>क्र.</th>
                    <th>घोषणा</th>
                    <th>सहमत</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    "मैंने उपरोक्त पंजीकृत फर्म का चयन पूर्णतः स्वेच्छा से किया है।",
                    "फर्म ने मुझे प्रणाली की तकनीकी विशेषताएँ, BIS मानक एवं इकाई लागत का विवरण बता दिया है।",
                    "मैं आपूर्तिकर्ता फर्म को उसके वास्तविक बिल की पूर्ण राशि भुगतान करने हेतु सहमत हूँ।",
                    "फर्म द्वारा वारंटी कार्ड, संचालन पुस्तिका एवं निःशुल्क सेवा भ्रमण की शर्तें बता दी गई हैं।",
                    "स्थापना के उपरांत ट्रायल रन मेरी उपस्थिति में निःशुल्क कराया जाएगा।",
                  ].map((d, i) => (
                    <tr key={i}>
                      <td>{i + 1}</td>
                      <td>{d}</td>
                      <td>☑ हाँ ☐ नहीं</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="sigrow">
                <div>
                  कृषक के हस्ताक्षर
                  <br />
                  {farmer.fname || "—"}
                </div>
                <div>फर्म / अधिकृत डीलर प्रतिनिधि</div>
                <div>प्रभारी, उद्यान सचल दल केंद्र कोटद्वार</div>
              </div>
              <div className="pgno">फर्म चयन</div>
            </article>

            {/* PAGE 5: COMPANY BILL / INVOICE */}
            <article className="sheet pmksy-company-bill avani-pdf-invoice">
              <table className="avani-head">
                <tbody>
                  <tr className="head-row">
                    <td>GSTIN No.: 05COWPD8094K1Z6</td>
                    <td className="invoice-title">TAX INVOICE / BILL</td>
                    <td className="right">Mob.: 9536462212</td>
                  </tr>
                  <tr>
                    <td className="company-name" colSpan={3}>
                      AVANI ENTERPRISES
                    </td>
                  </tr>
                  <tr>
                    <td className="dealer-name" colSpan={3}>
                      Authorised Dealer — भारत ड्रिप इरिगेशन एंड एग्रो
                    </td>
                  </tr>
                  <tr>
                    <td className="company-address" colSpan={3}>
                      Lakhera Bhawan, Vill. Shibonagar, Near Nayan Gaon,
                      Kotdwar, Garhwal (Uttarakhand) - 246155
                    </td>
                  </tr>
                </tbody>
              </table>
              <table className="avani-billing">
                <tbody>
                  <tr className="section-blue">
                    <td colSpan={3}>BILL TO / FARMER DETAILS</td>
                    <td colSpan={3}>INVOICE DETAILS</td>
                  </tr>
                  <tr>
                    <td className="lbl">Farmer Name:</td>
                    <td colSpan={2}>{farmer.fname || "—"}</td>
                    <td className="lbl">Invoice No.:</td>
                    <td colSpan={2}>
                      <b>DEMO-APPLE-0001</b>
                    </td>
                  </tr>
                  <tr>
                    <td className="lbl">Village / Centre:</td>
                    <td colSpan={2}>
                      {farmer.village || "—"} / {farmer.kendra || "—"}
                    </td>
                    <td className="lbl">Date:</td>
                    <td colSpan={2}>
                      <b>20/9/2026</b>
                    </td>
                  </tr>
                  <tr>
                    <td className="lbl">Spacing:</td>
                    <td colSpan={2}>
                      <b>{systemRows[0]?.spacing || "2x2"}</b>
                    </td>
                    <td className="lbl">Area (Hectare):</td>
                    <td colSpan={2}>
                      <b>{systemRows[0]?.area || 0.2} हे०</b>
                    </td>
                  </tr>
                  <tr>
                    <td className="lbl">Crop:</td>
                    <td colSpan={2}>{systemRows[0]?.crop || "—"}</td>
                    <td className="lbl">Date of Installation:</td>
                    <td colSpan={2}>
                      <b>18/9/2026</b>
                    </td>
                  </tr>
                  <tr>
                    <td className="lbl">System:</td>
                    <td colSpan={5}>{systemRows[0]?.sys || "ड्रिप"}</td>
                  </tr>
                </tbody>
              </table>
              <table className="avani-items">
                <thead>
                  <tr className="item-head">
                    <th>S.No</th>
                    <th>Description of Goods</th>
                    <th>BIS / Standard</th>
                    <th>Qty</th>
                    <th>Unit</th>
                    <th>Rate/Unit (₹)</th>
                    <th>Taxable Value (₹)</th>
                  </tr>
                </thead>
                <tbody>
                  {boqItems.map((item) => (
                    <tr key={item.sn}>
                      <td>{item.sn}</td>
                      <td>{item.desc}</td>
                      <td>{item.bis}</td>
                      <td>{item.qty}</td>
                      <td>{item.unit}</td>
                      <td className="num">
                        {item.rate.toLocaleString("en-IN")}
                      </td>
                      <td className="num">
                        {item.val.toLocaleString("en-IN")}
                      </td>
                    </tr>
                  ))}
                  <tr>
                    <td className="num" colSpan={6}>
                      <b>Sub Total</b>
                    </td>
                    <td className="num">
                      <b>{subtotal.toLocaleString("en-IN")}</b>
                    </td>
                  </tr>
                  <tr>
                    <td className="num" colSpan={6}>
                      Installation / Labour Charges @ <b>5%</b>
                    </td>
                    <td className="num">
                      {installChg.toLocaleString("en-IN")}
                    </td>
                  </tr>
                  <tr className="grand">
                    <td className="num" colSpan={6}>
                      <b>GRAND TOTAL (₹)</b>
                    </td>
                    <td className="num">
                      <b>{grandTotal.toLocaleString("en-IN")}</b>
                    </td>
                  </tr>
                  <tr>
                    <td colSpan={2}>
                      <b>Amount in Words:</b>
                    </td>
                    <td colSpan={5}>
                      Thirty Two Thousand Three Hundred Eight Only
                    </td>
                  </tr>
                </tbody>
              </table>
              <table className="avani-bottom">
                <tbody>
                  <tr className="section-blue">
                    <td colSpan={3}>BANK DETAILS FOR PAYMENT</td>
                  </tr>
                  <tr>
                    <td>
                      <b>Bank Name:</b> Almora Urban Co-operative Bank
                    </td>
                    <td>
                      <b>Account Number:</b> 025110100000143
                    </td>
                    <td>
                      <b>IFSC Code:</b> AUCB0000026
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <b>Account Holder:</b> Avani Enterprises
                    </td>
                    <td>
                      <b>Branch:</b> Kotdwar
                    </td>
                    <td>
                      <b>GSTIN:</b> 05COWPD8094K1Z6
                    </td>
                  </tr>
                  <tr>
                    <td className="terms" colSpan={3}>
                      <b>Terms &amp; Conditions</b>
                      <br />
                      1. All disputes shall be subject to Kotdwar jurisdiction.
                      <br />
                      2. Goods supplied as per approved BOQ / work requirement.
                      <br />
                      3. Interest will be charged at 18% p.a. on overdue
                      payments.
                    </td>
                  </tr>
                  <tr>
                    <td className="customer-sign">Customer's Signature</td>
                    <td className="auth-sign" colSpan={2}>
                      For Avani Enterprises
                      <br />
                      <br />
                      (Authorised Signatory)
                    </td>
                  </tr>
                </tbody>
              </table>
              <div className="pgno">कंपनी बिल</div>
            </article>

            {/* PAGE 6: CASH RECEIPT */}
            <article className="sheet">
              <div className="document-spacer"></div>
              <div className="sample-receipt">
                <div className="receipt-top">
                  <span>GSTIN : 05COWPD8094K1Z6</span>
                  <span>मो० : 9536462212</span>
                </div>
                <h1>नकद प्राप्ति रसीद</h1>
                <h2>Avani Enterprises</h2>
                <div className="receipt-center">
                  Lakhera Bhawan, Vill. Shibonagar, near Nayan Gaon, Kotdwar,
                  Garhwal (Uttarakhand) - 246155
                </div>
                <div className="receipt-top receipt-date">
                  <span>नं० {receipt.rc_no || "001"}</span>
                  <span>दिनांक {receipt.rc_date || "20/9/2026"}</span>
                </div>
                <p>
                  नाम श्री/श्रीमती <b>{farmer.fname || "—"}</b> पुत्र/पति श्री{" "}
                  <b>{farmer.rel || "—"}</b>, ग्राम{" "}
                  <b>{farmer.village || "—"}</b>, विकासखंड{" "}
                  <b>{farmer.block || "—"}</b> से{" "}
                  <b>
                    {systemRows[0]?.sys || "ड्रिप"} (
                    {systemRows[0]?.spacing || "2x2"},{" "}
                    {systemRows[0]?.area || 0.2} हे०)
                  </b>{" "}
                  की स्थापना हेतु आपूर्तिकर्ता फर्म को देय{" "}
                  <b>पूर्ण वास्तविक बिल राशि</b> के रूप में{" "}
                  <b>
                    {(receipt.rc_amt || grandTotal).toLocaleString("en-IN")}.00
                  </b>{" "}
                  (बत्तीस हज़ार तीन सौ आठ रुपये मात्र) नकद प्राप्त किया।
                </p>
                <div className="receipt-sign">
                  <span>
                    कुल बिल सं० DEMO-APPLE-0001 · कुल बिल राशि ₹
                    {grandTotal.toLocaleString("en-IN")}
                  </span>
                  <span>
                    For Avani Enterprises
                    <br />
                    हस्ताक्षर (Authorised Signatory)
                  </span>
                </div>
              </div>
              <div className="pgno">नकद रसीद</div>
            </article>

            {/* PAGE 7: PHYSICAL VERIFICATION */}
            <article className="sheet">
              <header className="hdr">
                <div className="t1">
                  प्रधानमंत्री कृषि सिंचाई योजना (PMKSY) — प्रति बूँद अधिक फसल
                  (PDMC)
                </div>
                <div className="t2">
                  उद्यान एवं खाद्य प्रसंस्करण विभाग, उत्तराखण्ड
                </div>
                <div className="t2">प्रभारी उद्यान सचल दल केंद्र कोटद्वार</div>
              </header>
              <div className="application-title">
                भौतिक सत्यापन रिपोर्ट (Physical Verification Report)
              </div>
              <h4 className="sec">1 — कृषक एवं भू-अभिलेख विवरण</h4>
              <div className="fl">
                <div className="fi">
                  कृषक का नाम :{" "}
                  <span className="val">{farmer.fname || "—"}</span>
                </div>
                <div className="fi">
                  पिता/पति : <span className="val">{farmer.rel || "—"}</span>
                </div>
                <div className="fi">
                  ग्राम व पंचायत :{" "}
                  <span className="val">
                    {farmer.village || "—"} / {farmer.panchayat || "—"}
                  </span>
                </div>
                <div className="fi">
                  विकासखंड / जिला :{" "}
                  <span className="val">
                    {farmer.block || "—"} / {farmer.district || "—"}
                  </span>
                </div>
                <div className="fi">
                  मोबाइल : <span className="val">{farmer.mobile || "—"}</span>
                </div>
                <div className="fi">
                  आधार सं० :{" "}
                  <span className="val">{farmer.aadhaar || "—"}</span>
                </div>
              </div>
              <h4 className="sec">2 — आपूर्तिकर्ता फर्म व प्रणाली विशेषताएँ</h4>
              <div className="fl">
                <div className="fi full">
                  अधिकृत फर्म :{" "}
                  <span className="val lg">
                    {farmer.company || "—"} — भारत ड्रिप इरिगेशन एंड एग्रो
                  </span>
                </div>
                <div className="fi">
                  GSTIN : <span className="val">05COWPD8094K1Z6</span>
                </div>
                <div className="fi">
                  QR Code / Unique ID :{" "}
                  <span className="val">PMKSY-DEMO-APPLE-0001</span>
                </div>
                <div className="fi">
                  फिल्टर प्रकार : <span className="val">स्क्रीन फिल्टर</span>
                </div>
                <div className="fi">
                  फर्टिगेशन उपकरण : <span className="val">वेंचुरी</span>
                </div>
                <div className="fi full">
                  स्थापित प्रणाली :{" "}
                  <span className="val lg">
                    {systemRows[0]?.sys === "ड्रिप" ? "ड्रिप ☑" : "ड्रिप ☐"}{" "}
                    माइक्रो स्प्रिंकलर ☐ मिनी स्प्रिंकलर ☐ पोर्टेबल स्प्रिंकलर ☐
                  </span>
                </div>
                <div className="fi full">
                  वारंटी कार्ड / संचालन पुस्तिका :{" "}
                  <span className="val lg">उपलब्ध कराया गया (3 वर्ष) ☑</span>
                </div>
              </div>
              <h4 className="sec">3 — मौके पर तकनीकी एवं भौतिक माप सत्यापन</h4>
              <table className="pf">
                <thead>
                  <tr>
                    <th>घटक / विवरण</th>
                    <th>स्वीकृत मापदंड</th>
                    <th>मौके पर मापा गया</th>
                    <th>सत्यापन परिणाम</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>प्रणाली (Laterals / Pipes / Nozzles / Emitters)</td>
                    <td>
                      {systemRows[0]?.spacing || "2x2"} ·{" "}
                      {systemRows[0]?.area || 0.2} हे०
                    </td>
                    <td>{systemRows[0]?.area || 0.2} हे०</td>
                    <td>सन्तोषजनक ☑</td>
                  </tr>
                  <tr>
                    <td>जल स्रोत एवं पम्प / फिल्टर · HP</td>
                    <td>स्क्रीन फिल्टर</td>
                    <td>कार्यरत स्थिति में</td>
                    <td>☑</td>
                  </tr>
                </tbody>
              </table>
              <table className="pf">
                <thead>
                  <tr>
                    <th>क्र.</th>
                    <th>BIS मानक / जाँच बिंदु</th>
                    <th>अनुपालन</th>
                  </tr>
                </thead>
                <tbody>
                  {bisChecklist.map((item, i) => (
                    <tr key={i}>
                      <td>{i + 1}</td>
                      <td>{item}</td>
                      <td>☑ हाँ ☐ नहीं</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <h4 className="sec">4 — वित्तीय सत्यापन एवं अनुदान गणना</h4>
              <table className="pf">
                <thead>
                  <tr>
                    <th>विवरण</th>
                    <th>धनराशि (₹)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>मानक इकाई लागत (PDMC — NEH, 25% वृद्धि सहित)</td>
                    <td className="n">
                      {systemRows[0]?.cost.toLocaleString("en-IN") || 0}
                    </td>
                  </tr>
                  <tr>
                    <td>वास्तविक बिल राशि</td>
                    <td className="n">{grandTotal.toLocaleString("en-IN")}</td>
                  </tr>
                  <tr>
                    <td>अनुदान गणना का आधार (जो कम हो)</td>
                    <td className="n">
                      {systemRows[0]?.cost.toLocaleString("en-IN") || 0}
                    </td>
                  </tr>
                  <tr>
                    <td>भारत सरकार अंश (कुल अंश का 90%)</td>
                    <td className="n">14,808</td>
                  </tr>
                  <tr>
                    <td>राज्यांश (कुल अंश का 10%)</td>
                    <td className="n">1,645</td>
                  </tr>
                  <tr>
                    <td>राज्य टॉप-अप 25%</td>
                    <td className="n">7,479</td>
                  </tr>
                  <tr className="tot">
                    <td>कुल देय अनुदान (80%)</td>
                    <td className="n">
                      {systemRows[0]?.subsidy.toLocaleString("en-IN") || 0}
                    </td>
                  </tr>
                  <tr>
                    <td>कृषक द्वारा फर्म को किया गया पूर्ण वास्तविक भुगतान</td>
                    <td className="n">{grandTotal.toLocaleString("en-IN")}</td>
                  </tr>
                  <tr>
                    <td>DBT के बाद कृषक की प्रभावी स्वयं वहन लागत</td>
                    <td className="n">8,376</td>
                  </tr>
                </tbody>
              </table>
              <h4 className="sec">5 — सत्यापन प्रमाण-पत्र एवं संस्तुति</h4>
              <div className="box">
                मैंने दिनांक ………………… को उक्त कृषक {farmer.fname || "—"} के
                प्रक्षेत्र पर स्वयं उपस्थित होकर {systemRows[0]?.sys || "ड्रिप"}{" "}
                प्रणाली, क्षेत्रफल {systemRows[0]?.area || 0} हे०, का भौतिक
                स्थलीय निरीक्षण एवं सत्यापन किया। स्थापना कार्य को मैंने स्वीकृत
                तकनीकी मानदंडों, जियो-टैगिंग एवं निर्धारित BIS मानकों के अनुरूप
                सन्तोषजनक पाया।
                <br />
                <br />
                <b>संस्तुति :</b> अतः मैं, श्री अनिल कुमार, प्रभारी, उद्यान सचल
                दल केंद्र कोटद्वार, लाभार्थी को देय सब्सडी धनराशि ₹
                {systemRows[0]?.subsidy.toLocaleString("en-IN") || 0} DBT के
                माध्यम से कृषक के बैंक खाते ({farmer.acct || "—"},{" "}
                {farmer.ifsc || "—"}) में भुगतान किए जाने हेतु संस्तुत करता/करती
                हूँ।
              </div>
              <div className="sigrow">
                <div>
                  लाभार्थी कृषक के हस्ताक्षर
                  <br />
                  दिनांक : …………………
                </div>
                <div>श्री अनिल कुमार, प्रभारी</div>
                <div>प्रभारी (हस्ताक्षर एवं विभागीय मोहर)</div>
              </div>
              <div className="pgno">भौतिक सत्यापन</div>
            </article>
          </>
        )}
      </div>
    </>
  );
};

export default PMKSY;
