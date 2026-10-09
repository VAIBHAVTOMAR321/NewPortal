import React, { useEffect, useRef, useState } from "react";
import "./PMKSY.css";

const PMKSY = () => {
  const [activeStep, setActiveStep] = useState(1);
  const [showFirmPanel, setShowFirmPanel] = useState(false);
  const [showOfficePanel, setShowOfficePanel] = useState(false);
  const [showAllRecPanel, setShowAllRecPanel] = useState(false);
  const [samplePrintReady, setSamplePrintReady] = useState(false);

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

  return (
    <>
      <div className="noprint">
        <header className="mast">
          <div className="crest">उ</div>
          <div>
            <h1>PMKSY–PDMC · सम्पूर्ण प्रपत्र प्रणाली</h1>
            <div className="sub">
              उद्यान एवं खाद्य प्रसंस्करण विभाग, उत्तराखण्ड ·{" "}
              <span id="officeNameTop">
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
            <button className="btn ghost sm" type="button">
              नया आवेदन
            </button>
            <button className="btn water sm" type="button">
              वर्तमान प्रपत्र प्रिंट
            </button>
          </div>
        </header>

        {/* Modals */}
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
                हर फर्म का किसान-रजिस्टर अलग-अलग सहेजा जाता है।
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
                यहाँ चुना गया कार्यालय नाम सिस्टम के मुख्य शीर्षक में स्वतः
                दिखाई देगा।
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
                हर किसान के सभी 6 प्रपत्र यहीं से खोले जा सकते हैं।
              </div>
            </div>
          </div>
        </div>

        <div className="wrap">
          <div className="steps" role="tablist" id="stepbar">
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
                  <span className="kh">क</span> किसान एवं बैंक विवरण
                </h2>
                <div className="body">
                  <div
                    className="btnrow sample-toolbar"
                    style={{ marginBottom: "12px" }}
                  >
                    <button className="btn water sm" type="button">
                      🧪 पूरा भरा हुआ किसान Sample देखें
                    </button>
                    <button
                      className="btn ghost sm"
                      type="button"
                      onClick={() => setSamplePrintReady(true)}
                    >
                      🖨️ Sample के सभी 6 प्रपत्र प्रिंट
                    </button>
                  </div>
                  <div className="grid">
                    <div className="f">
                      <label>किसान का नाम</label>
                      <input placeholder="नाम लिखें" />
                    </div>
                    <div className="f">
                      <label>पिता का नाम</label>
                      <input />
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
                  <span className="kh">२</span> शपथ पत्र
                </h2>
                <div className="body"></div>
              </div>
            </section>
          )}
          {activeStep === 3 && (
            <section id="S3">
              <div className="card">
                <h2>
                  <span className="kh">३</span> फर्म चयन
                </h2>
                <div className="body"></div>
              </div>
            </section>
          )}
          {activeStep === 4 && (
            <section id="S4">
              <div className="card">
                <h2>
                  <span className="kh">४</span> भौतिक सत्यापन
                </h2>
                <div className="body"></div>
              </div>
            </section>
          )}
          {activeStep === 5 && (
            <section id="S5">
              <div className="card">
                <h2>
                  <span className="kh">५</span> कंपनी बिल
                </h2>
                <div className="body"></div>
              </div>
            </section>
          )}
          {activeStep === 6 && (
            <section id="S6">
              <div className="card">
                <h2>
                  <span className="kh">६</span> नकद रसीद
                </h2>
                <div className="body"></div>
              </div>
            </section>
          )}
          {activeStep === 7 && (
            <section id="S7">
              <div className="card">
                <h2>किसान रजिस्टर</h2>
                <div className="body"></div>
              </div>
            </section>
          )}
          {activeStep === 8 && (
            <section id="S8">
              <div className="card">
                <h2>दर तालिका</h2>
                <div className="body"></div>
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
                    <span className="v mono">₹0</span>
                  </div>
                  <div className="amt far">
                    <span className="k">कृषक अंश</span>
                    <span className="v mono">₹0</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* ========================================== */}
      /* PRINT AREA - EXACTLY MATCHING PDF STRUCTURE */
      {/* ========================================== */}
      <div id="printArea" aria-label="प्रिंट पूर्वावलोकन">
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
                  1. जनपद : <span className="val">पौड़ी गढ़वाल</span>
                </div>
                <div className="fi">
                  2. उद्यान सचल दल केंद्र :{" "}
                  <span className="val">कोटद्वार</span>
                </div>
                <div className="fi">
                  3. विकासखंड : <span className="val">नगर निगम कोटद्वार</span>
                </div>
                <div className="fi">
                  4. विधान सभा : <span className="val">कोटद्वार</span>
                </div>
                <div className="fi">
                  5. ग्राम पंचायत : <span className="val">कोटद्वार</span>
                </div>
                <div className="fi">
                  6. ग्राम : <span className="val">शिबूनगर</span>
                </div>
              </div>

              <h4 className="sec">ख — किसान एवं बैंक विवरण (DBT हेतु)</h4>
              <div className="fl">
                <div className="fi">
                  1. किसान का नाम : <span className="val">श्री सुरेश सिंह</span>
                </div>
                <div className="fi">
                  2. पिता/पति का नाम :{" "}
                  <span className="val">पुत्र श्री मोहन सिंह</span>
                </div>
                <div className="fi">
                  3. लिंग :{" "}
                  <span className="val">
                    पुरुष ☑ &nbsp; महिला ☐ &nbsp; अन्य ☐
                  </span>
                </div>
                <div className="fi">
                  4. सामाजिक श्रेणी :{" "}
                  <span className="val">
                    सामान्य ☑ &nbsp; अ.जा. (SC) ☐ &nbsp; अ.ज.जा. (ST) ☐ &nbsp;
                    अ.प.व. (OBC) ☐
                  </span>
                </div>
                <div className="fi">
                  5. किसान वर्ग :{" "}
                  <span className="val">
                    सीमांत (&lt;1 हे०) ☑ &nbsp; लघु (1-2 हे०) ☐ &nbsp; अन्य
                    (&gt;2 हे०) ☐
                  </span>
                </div>
                <div className="fi">
                  6. लाभार्थी प्रकार :{" "}
                  <span className="val">
                    व्यक्तिगत ☑ &nbsp; समूह / SHG ☐ &nbsp; FPO ☐
                  </span>
                </div>
                <div className="fi">
                  7. आधार संख्या : <span className="val">XXXX-XXXX-1234</span>
                </div>
                <div className="fi">
                  8. मोबाइल : <span className="val">9876543210</span>
                </div>
                <div className="fi">
                  9. बैंक खाता सं० : <span className="val">123456789012</span>
                </div>
                <div className="fi">
                  10. बैंक एवं शाखा :{" "}
                  <span className="val">भारतीय स्टेट बैंक — कोटद्वार शाखा</span>
                </div>
                <div className="fi">
                  11. IFSC : <span className="val">SBIN0001234</span>
                </div>
                <div className="fi">
                  12. उद्यान कार्ड सं० :{" "}
                  <span className="val">HK-2026-00125</span>
                </div>
                <div className="fi full">
                  13. पूरा पता :{" "}
                  <span className="val lg">
                    शिबूनगर, ग्रा०पं० कोटद्वार, वि०ख० नगर निगम कोटद्वार, जनपद
                    पौड़ी गढ़वाल, उत्तराखण्ड
                  </span>
                </div>
              </div>

              <h4 className="sec">ग — भूमि, जल स्रोत एवं प्रस्तावित प्रणाली</h4>
              <div className="fl">
                <div className="fi">
                  1. खाता सं० : <span className="val">00056</span> खसरा सं० :{" "}
                  <span className="val">125/2</span>
                </div>
                <div className="fi">
                  2. प्रस्तावित भूमि (हे०) : <span className="val">0.20</span>
                </div>
                <div className="fi">
                  3. प्रस्तावित क्षेत्र (हे०) :{" "}
                  <span className="val">0.20</span>
                </div>
                <div className="fi">
                  4. भूमि स्वामित्व :{" "}
                  <span className="val">स्वयं ☑ &nbsp; पट्टा / अनुबंध ☐</span>
                </div>
                <div className="fi">
                  5. पट्टा अवधि (न्यू० 07 वर्ष) : <span className="val"></span>
                </div>
                <div className="fi">
                  6. मुख्य फसल : <span className="val">सेब</span>
                </div>
                <div className="fi">
                  7. रोपण दूरी / स्पेसिंग : <span className="val">2x2</span>
                </div>
                <div className="fi">
                  8. गत 07 वर्षों में पूर्व अनुदान ?{" "}
                  <span className="val">हाँ ☐ &nbsp; ☑ नहीं</span>
                </div>
                <div className="fi full">
                  9. जल स्रोत :{" "}
                  <span className="val lg">
                    कुआँ ☐ &nbsp; नलकूप / बोरवेल ☐ &nbsp; नहर ☐ &nbsp; तालाब /
                    हौज ☐ &nbsp; नदी / खोला / गदेरा ☐ &nbsp; वर्षा जल संचयन टैंक
                    ☐ &nbsp; स्प्रिंग / प्राकृतिक स्रोत (धारा/नौला) ☐ &nbsp;
                    लिफ्ट इरिगेशन ☐ &nbsp; अन्य ☐
                  </span>
                </div>
                <div className="fi full">
                  10. प्रणाली का प्रकार :{" "}
                  <span className="val lg">
                    ड्रिप ☑ &nbsp; माइक्रो स्प्रिंकलर ☐ &nbsp; मिनी स्प्रिंकलर ☐
                    &nbsp; पोर्टेबल स्प्रिंकलर ☐ &nbsp; सेमी-परमानेंट ☐ &nbsp;
                    रेनगन ☐
                  </span>
                </div>
                <div className="fi full">
                  11. चयनित/अधिकृत फर्म :{" "}
                  <span className="val lg">
                    Avani Enterprises — भारत ड्रिप इरिगेशन एंड एग्रो (Garhwal
                    (Uttarakhand) - 246155)
                  </span>
                </div>
              </div>

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
                  <tr>
                    <td>1</td>
                    <td>आधार कार्ड की प्रति (eKYC सत्यापित)</td>
                    <td>☑ हाँ &nbsp; ☐ नहीं</td>
                  </tr>
                  <tr>
                    <td>2</td>
                    <td>भूमि अभिलेख — नवीनतम खसरा / खतौनी</td>
                    <td>☑ हाँ &nbsp; ☐ नहीं</td>
                  </tr>
                  <tr>
                    <td>3</td>
                    <td>
                      बैंक पासबुक / रद्द चेक की प्रति (आधार सीडेड, DBT सक्षम)
                    </td>
                    <td>☑ हाँ &nbsp; ☐ नहीं</td>
                  </tr>
                  <tr>
                    <td>4</td>
                    <td>सिंचाई जल स्रोत उपलब्धता संबंधी प्रमाण</td>
                    <td>☑ हाँ &nbsp; ☐ नहीं</td>
                  </tr>
                  <tr>
                    <td>5</td>
                    <td>
                      पट्टा / अनुबंध पत्र — न्यूनतम 07 वर्ष (यदि भूमि पट्टे पर
                      हो)
                    </td>
                    <td>हाँ ☐ &nbsp; ☑ नहीं</td>
                  </tr>
                  <tr>
                    <td>6</td>
                    <td>पूर्व में अनुदान न लेने संबंधी स्व-घोषणा पत्र</td>
                    <td>☑ हाँ &nbsp; ☐ नहीं</td>
                  </tr>
                  <tr>
                    <td>7</td>
                    <td>पासपोर्ट साइज़ फोटोग्राफ</td>
                    <td>☑ हाँ &nbsp; ☐ नहीं</td>
                  </tr>
                  <tr>
                    <td>8</td>
                    <td>उद्यान कार्ड / कृषि मैपर एप डेटा</td>
                    <td>☑ हाँ &nbsp; ☐ नहीं</td>
                  </tr>
                </tbody>
              </table>
              <div className="pgno">आवेदन · पृष्ठ 1 / 2</div>
            </article>

            {/* PAGE 2: APPLICATION PART 2 */}
            <article className="sheet">
              <h4 className="sec">ङ — लाभार्थी की घोषणा</h4>
              <div className="box">
                मैं, श्री सुरेश सिंह, सत्यनिष्ठा से घोषित करता हूँ कि — (1) इस
                प्रपत्र में दी गई समस्त सूचनाएँ पूर्णतः सत्य एवं सही हैं; असत्य
                पाए जाने पर मेरा आवेदन निरस्त किया जा सकेगा तथा मैं वैधानिक
                कार्यवाही का उत्तरदायी रहूँगा। (2) मैं योजना के दिशा-निर्देशों
                के अनुसार अपने प्रक्षेत्र में सूक्ष्म सिंचाई प्रणाली स्थापित
                कराने हेतु सहमत हूँ तथा उसके रख-रखाव एवं सुचारु संचालन की पूर्ण
                जिम्मेदारी लेता हूँ। (3) मैं स्वीकृत अनुदान DBT के माध्यम से
                सीधे अपने आधार-लिंक बैंक खाते में प्राप्त करने हेतु सहमत हूँ।
                (4) मैंने विगत 07 वर्षों में इस भूमि खंड पर सूक्ष्म सिंचाई हेतु
                किसी भी सरकारी योजना से अनुदान प्राप्त नहीं किया है। (5) मैंने
                पंजीकृत फर्म का चयन स्वेच्छा से किया है तथा नियमानुसार देय कृषक
                अंश जमा करने हेतु सहमत हूँ। (6) मैं विभाग द्वारा निर्धारित
                निरीक्षण एवं भौतिक सत्यापन हेतु सदैव सहयोग करूँगा।
              </div>
              <div className="fl">
                <div className="fi">
                  नाम : <span className="val">श्री सुरेश सिंह</span>
                </div>
                <div className="fi">
                  दिनांक : <span className="val">10/9/2026</span>
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
                  1. अक्षांश : <span className="val"></span>
                </div>
                <div className="fi">
                  2. देशांतर : <span className="val"></span>
                </div>
                <div className="fi">
                  3. कृषि मैपर एप ID : <span className="val"></span>
                </div>
                <div className="fi">
                  4. भूमि की प्रकृति :{" "}
                  <span className="val">
                    समतल ☑ &nbsp; सीढ़ीदार ☐ &nbsp; ढालदार ☐
                  </span>
                </div>
                <div className="fi">
                  5. जल स्रोत की दूरी (मी०) : <span className="val">80</span>
                </div>
                <div className="fi">
                  6. ऊर्ध्वाधर ऊँचाई अंतर (मी०) :{" "}
                  <span className="val">12</span>
                </div>
                <div className="fi">
                  7. जल उपलब्धता (ली०/घंटा) : <span className="val"></span>
                </div>
                <div className="fi">
                  8. जल की गुणवत्ता :{" "}
                  <span className="val">
                    स्वच्छ ☐ &nbsp; गादयुक्त ☐ &nbsp; लौहयुक्त ☐
                  </span>
                </div>
                <div className="fi">
                  9. पंप :{" "}
                  <span className="val">
                    विद्युत ☐ &nbsp; डीजल ☐ &nbsp; सौर ☐ &nbsp; उपलब्ध नहीं ☐
                  </span>
                </div>
                <div className="fi">
                  10. पंप क्षमता (HP) : <span className="val"></span>
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
                  <tr>
                    <td>1</td>
                    <td>ड्रिप</td>
                    <td>सेब</td>
                    <td>2x2</td>
                    <td>0.2</td>
                    <td>29,915</td>
                    <td>80%</td>
                    <td>23,932</td>
                    <td>5,983</td>
                  </tr>
                  <tr>
                    <td>2</td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                  </tr>
                  <tr className="tot">
                    <td colSpan="4">योग</td>
                    <td>0.20</td>
                    <td>29,915</td>
                    <td>80%</td>
                    <td>23,932</td>
                    <td>5,983</td>
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
                  <tr>
                    <td>1</td>
                    <td>
                      लाभार्थी ने विगत 07 वर्षों में उसी भूमि पर सूक्ष्म सिंचाई
                      का अनुदान प्राप्त नहीं किया है।
                    </td>
                    <td>☑ हाँ &nbsp; ☐ नहीं</td>
                  </tr>
                  <tr>
                    <td>2</td>
                    <td>
                      लाभार्थी का कुल आयुक्त क्षेत्रफल 05 हेक्टेयर की अधिकतम
                      सीमा से अधिक नहीं है।
                    </td>
                    <td>☑ हाँ &nbsp; ☐ नहीं</td>
                  </tr>
                  <tr>
                    <td>3</td>
                    <td>
                      एक ही स्थान की भूमि को एक ही फसल हेतु छोटे-छोटे भागों में
                      विभाजित नहीं किया गया है।
                    </td>
                    <td>☑ हाँ &nbsp; ☐ नहीं</td>
                  </tr>
                  <tr>
                    <td>4</td>
                    <td>बैंक खाता आधार सीडेड, DBT सक्षम एवं सक्रिय है।</td>
                    <td>☑ हाँ &nbsp; ☐ नहीं</td>
                  </tr>
                  <tr>
                    <td>5</td>
                    <td>
                      पट्टे/अनुबंध कृषक की दशा में न्यूनतम 07 वर्ष का पट्टा
                      अनुबंध संलग्न है।
                    </td>
                    <td>☑ हाँ &nbsp; ☐ नहीं</td>
                  </tr>
                  <tr>
                    <td>6</td>
                    <td>
                      प्रक्षेत्र की जियो-टैगिंग कृषि मैपर एप से पूर्ण तथा
                      फोटो/वीडियो प्राप्त कर लए गए हैं।
                    </td>
                    <td>हाँ ☐ &nbsp; ☑ नहीं</td>
                  </tr>
                  <tr>
                    <td>7</td>
                    <td>
                      प्रस्तावित प्रणाली में फर्टिगेशन उपकरण (वेंचुरी/उर्वरक
                      टैंक) समाविष्ट है।
                    </td>
                    <td>☑ हाँ &nbsp; ☐ नहीं</td>
                  </tr>
                  <tr>
                    <td>8</td>
                    <td>
                      लाभार्थी द्वारा पंजीकृत फर्म का चयन स्वेच्छा से किया गया
                      है, किसी प्रकार का दबाव नहीं है।
                    </td>
                    <td>☑ हाँ &nbsp; ☐ नहीं</td>
                  </tr>
                  <tr>
                    <td>9</td>
                    <td>
                      प्रक्षेत्र पर जल स्रोत उपलब्ध तथा प्रस्तावित क्षेत्रफल
                      हेतु जल की मात्रा पर्याप्त है।
                    </td>
                    <td>हाँ ☐ &nbsp; ☑ नहीं</td>
                  </tr>
                  <tr>
                    <td>10</td>
                    <td>
                      पर्वतीय ढाल की दशा में प्रत्येक 04 मी० ऊर्ध्वाधर गरावट पर
                      कंट्रोल वाल्व का प्रावधान किया गया है।
                    </td>
                    <td>☑ हाँ &nbsp; ☐ नहीं</td>
                  </tr>
                </tbody>
              </table>

              <h4 className="sec">झ — प्रमाणीकरण एवं संस्तुति</h4>
              <div className="box">
                प्रमाणित किया जाता है कि उपरोक्त प्रक्षेत्र का संयुक्त रूप से
                स्थलीय निरीक्षण किया गया, अभिलेखों का परीक्षण किया गया तथा
                लाभार्थी दिशा-निर्देशों के अनुसार पात्र पाया गया। प्रकरण संस्तुत
                ☑ / असंस्तुत ☐ किया जाता है।
                <br />
                संस्तुत / टिप्पणी : स्थल निरीक्षण एवं अभिलेखों के आधार पर प्रकरण
                संस्तुत योग्य है।
              </div>
              <div className="sigrow">
                <div>फर्म / अधिकृत डीलर प्रतिनिधि</div>
                <div>प्रभारी, उद्यान सचल दल केंद्र कोटद्वार</div>
              </div>

              <h3 className="part">भाग – 3 : कार्यालय प्रयोगार्थ</h3>
              <div className="fl">
                <div className="fi">परीक्षणोपरांत — स्वीकृत ☐ / अस्वीकृत ☐</div>
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
                मैं श्री/श्रीमती श्री सुरेश सिंह, पुत्र श्री पुत्र श्री मोहन
                सिंह, निवासी ग्राम शिबूनगर, ग्राम पंचायत कोटद्वार, विकासखंड नगर
                निगम कोटद्वार, उद्यान सचल दल केंद्र कोटद्वार, जिला पौड़ी गढ़वाल,
                उत्तराखण्ड, सत्यनिष्ठा से शपथपूर्वक निम्नलिखित घोषणा करता/करती
                हूँ कि —
              </div>
              <ul className="decl">
                <li>
                  1. यह कि मेरी स्वयं के स्वामित्व एवं कब्जे की भूमि का विवरण
                  निम्नानुसार है — खाता संख्या 00056, खसरा संख्या 125/2, कुल
                  क्षेत्रफल 0.20 हे०, भूमि का स्वामित्व : स्वयं, फसल सेब,
                  सूक्ष्म सिंचाई प्रणाली ड्रिप, स्पेसिंग 2x2। उक्त संपूर्ण भूमि
                  मेरी स्वयं की है तथा PMKSY-PDMC के अंतर्गत सूक्ष्म सिंचाई
                  प्रणाली के स्थापना हेतु प्रस्तावित क्षेत्रफल इसी भूमि से
                  संबंधित है।
                </li>
                <li>
                  2. यह कि उक्त भूमि पर PMKSY-PDMC के अंतर्गत ड्रिप सूक्ष्म
                  सिंचाई प्रणाली की स्थापना का कार्य मेसर्स Avani Enterprises —
                  भारत ड्रिप इरिगेशन एंड एग्रो (Garhwal (Uttarakhand) - 246155)
                  द्वारा विभागीय निर्धारित मानकों एवं स्वीकृत तकनीकी विवरण के
                  अनुसार पूर्ण किया गया है। स्थापना के पश्चात मैंने मौके पर
                  प्रणाली एवं सामग्री का निरीक्षण कर लिया है तथा स्थापना कार्य
                  से संतुष्ट हूँ।
                </li>
                <li>
                  3. यह कि स्थापना कार्य पूर्ण होने के पश्चात आपूर्तिकर्ता फर्म
                  द्वारा प्रस्तुत अंतिम वास्तविक बिल राशि ₹32,308/- है। योजना के
                  प्रावधानों के अनुसार उक्त स्थापना हेतु अनुदान गणना के लिए
                  मान्य लागत ₹29,915/- है।
                </li>
                <li>
                  4. मान्य लागत पर योजना में निर्धारित दर (80%) के अनुसार
                  ₹23,932/- राजसहायता देय है, जिसका भुगतान नियमानुसार DBT के
                  माध्यम से मेरे बैंक खाते (123456789012, SBIN0001234) में किया
                  जाना है।
                </li>
                <li>
                  5. वास्तविक बिल राशि तथा विभाग द्वारा अनुमन्य राजसहायता के
                  पश्चात शेष राशि ₹8,376/- मेरे द्वारा स्वयं वहन की जाएगी। मान्य
                  विभागीय लागत से अधिक ₹2,393/- की राशि पर राजसहायता देय नहीं
                  होगी और उसका वहन मेरे द्वारा किया जाएगा।
                </li>
                <li>
                  6. मैं स्वीकार करता हूँ कि आपूर्तिकर्ता फर्म को स्थापना कार्य
                  के संबंध में देय राशि का भुगतान मेरी जिम्मेदारी है तथा विभागीय
                  राजसहायता नियमानुसार DBT के माध्यम से मेरे खाते में प्राप्त
                  होगी।
                </li>
                <li>
                  7. मैं घोषित करता हूँ कि उपरोक्त भूमि पर सूक्ष्म सिंचाई
                  स्थापना हेतु विगत 07 वर्षों में किसी अन्य सरकारी योजना/विभाग
                  से ऐसा अनुदान प्राप्त नहीं किया गया है, जिससे एक ही कार्य पर
                  दोहरा सरकारी लाभ प्राप्त हो।
                </li>
                <li>
                  8. मेरे द्वारा प्रस्तुत भूमि अभिलेख, खाता/खसरा विवरण,
                  क्षेत्रफल, फसल, स्थापना, बिल एवं योजना से संबंधित अन्य जानकारी
                  मेरे ज्ञान एवं विश्वास के अनुसार सही है।
                </li>
                <li>
                  9. मैं विभाग द्वारा किए जाने वाले स्थलीय निरीक्षण, भौतिक
                  सत्यापन एवं आवश्यक जाँच में सहयोग करता/करूँगी तथा स्थापित
                  सूक्ष्म सिंचाई प्रणाली के उचित उपयोग, सुरक्षा एवं निर्धारित
                  अवधि तक रख-रखाव की जिम्मेदारी स्वयं निभाऊँगा।
                </li>
                <li>
                  10. यदि मेरे द्वारा प्रस्तुत कोई विवरण भविष्य में असत्य, नामक
                  अथवा योजना के नियमों के विपरीत पाया जाता है, तो प्राप्त
                  राजसहायता की वसूली एवं नियमानुसार विभागीय/कानूनी कार्यवाही के
                  लिए मैं स्वयं उत्तरदायी रहूँगा।
                </li>
              </ul>
              <div className="box">
                मैंने यह शपथ-पत्र बिना किसी दबाव, भय अथवा प्रलोभन के अपनी
                स्वतंत्र इच्छा से दिया है तथा इसमें वर्णित सभी तथ्य मेरे ज्ञान
                एवं विश्वास के अनुसार सत्य एवं सही हैं।
              </div>

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
                    <td>0.20 हे०</td>
                  </tr>
                  <tr>
                    <td>2</td>
                    <td>आपूर्तिकर्ता फर्म का अंतिम वास्तविक बिल</td>
                    <td>₹32,308</td>
                  </tr>
                  <tr>
                    <td>3</td>
                    <td>अनुदान हेतु मान्य लागत</td>
                    <td>₹29,915</td>
                  </tr>
                  <tr>
                    <td>4</td>
                    <td>देय राजसहायता</td>
                    <td>₹23,932</td>
                  </tr>
                  <tr>
                    <td>5</td>
                    <td>फर्म को कृषक द्वारा किया गया/देय भुगतान</td>
                    <td>₹32,308</td>
                  </tr>
                  <tr>
                    <td>6</td>
                    <td>DBT के पश्चात कृषक की प्रभावी स्वयं वहन लागत</td>
                    <td>₹8,376</td>
                  </tr>
                  <tr>
                    <td>7</td>
                    <td>मान्य लागत से अधिक राशि, कृषक द्वारा वहन</td>
                    <td>₹2,393</td>
                  </tr>
                </tbody>
              </table>

              <div className="sigrow">
                <div>
                  शपथकता / कृषक
                  <br />
                  नाम : श्री सुरेश सिंह
                  <br />
                  मो० : 9876543210
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
                  कृषक का नाम : <span className="val">श्री सुरेश सिंह</span>
                </div>
                <div className="fi">
                  पिता/पति : <span className="val">पुत्र श्री मोहन सिंह</span>
                </div>
                <div className="fi">
                  ग्राम / पंचायत :{" "}
                  <span className="val">शिबूनगर / कोटद्वार</span>
                </div>
                <div className="fi">
                  विकासखंड / केंद्र :{" "}
                  <span className="val">नगर निगम कोटद्वार / कोटद्वार</span>
                </div>
                <div className="fi">
                  मोबाइल : <span className="val">9876543210</span>
                </div>
                <div className="fi">
                  खसरा सं० : <span className="val">125/2</span>
                </div>
              </div>

              <h4 className="sec">2 — चयनित फर्म का विवरण</h4>
              <div className="fl">
                <div className="fi full">
                  फर्म का नाम :{" "}
                  <span className="val lg">
                    Avani Enterprises — भारत ड्रिप इरिगेशन एंड एग्रो (Garhwal
                    (Uttarakhand) - 246155)
                  </span>
                </div>
                <div className="fi">
                  पंजीकरण / Empanelment सं० :{" "}
                  <span className="val">UK-PDMC-AVANI-2026</span>
                </div>
                <div className="fi">
                  GSTIN : <span className="val">05COWPD8094K1Z6</span>
                </div>
                <div className="fi">
                  अधिकृत डीलर / प्रतिनिधि :{" "}
                  <span className="val">Avani Enterprises</span>
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

              <h4 className="sec">
                3 — विभागीय गाइडलाइन एवं फर्म की कोटेशन के अनुसार वित्तीय सारांश
              </h4>
              <table className="pf">
                <thead>
                  <tr>
                    <th>क्र.</th>
                    <th>प्रणाली / फसल / स्पेसिंग</th>
                    <th>क्षेत्र (हे०)</th>
                    <th>विभागीय मानक लागत (₹)</th>
                    <th>फर्म कोटेशन (₹)</th>
                    <th>देय DBT अनुदान (₹)</th>
                    <th>फर्म को कृषक द्वारा भुगतान (₹)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>1</td>
                    <td>ड्रिप / सेब / 2x2</td>
                    <td>0.2</td>
                    <td>29,915</td>
                    <td>32,308</td>
                    <td>23,932</td>
                    <td>32,308</td>
                  </tr>
                  <tr className="tot">
                    <td colSpan="2">योग</td>
                    <td>0.20</td>
                    <td>29,915</td>
                    <td>32,308</td>
                    <td>23,932</td>
                    <td>32,308</td>
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
                  <tr>
                    <td>1</td>
                    <td>
                      मैंने उपरोक्त पंजीकृत फर्म का चयन पूर्णतः स्वेच्छा से किया
                      है; विभाग अथवा किसी अन्य का कोई दबाव नहीं है।
                    </td>
                    <td>☑ हाँ &nbsp; ☐ नहीं</td>
                  </tr>
                  <tr>
                    <td>2</td>
                    <td>
                      फर्म ने मुझे प्रणाली की तकनीकी विशेषताएँ, BIS मानक एवं
                      इकाई लागत का विवरण स्पष्ट रूप से बता दिया है।
                    </td>
                    <td>☑ हाँ &nbsp; ☐ नहीं</td>
                  </tr>
                  <tr>
                    <td>3</td>
                    <td>
                      मैं आपूर्तिकर्ता फर्म को उसके वास्तविक/कोटेशन बिल की पूर्ण
                      राशि अपने स्तर से भुगतान करने हेतु सहमत हूँ तथा गाइडलाइन
                      के अनुसार देय राजसहायता DBT के माध्यम से अपने बैंक खाते
                      में प्राप्त करने हेतु सहमत हूँ।
                    </td>
                    <td>☑ हाँ &nbsp; ☐ नहीं</td>
                  </tr>
                  <tr>
                    <td>4</td>
                    <td>
                      फर्म द्वारा वारंटी कार्ड, संचालन पुस्तिका एवं निःशुल्क
                      सेवा भ्रमण की शर्तें मुझे बता दी गई हैं।
                    </td>
                    <td>☑ हाँ &nbsp; ☐ नहीं</td>
                  </tr>
                  <tr>
                    <td>5</td>
                    <td>
                      स्थापना के उपरांत ट्रायल रन मेरी उपस्थिति में निःशुल्क
                      कराया जाएगा।
                    </td>
                    <td>☑ हाँ &nbsp; ☐ नहीं</td>
                  </tr>
                </tbody>
              </table>

              <div className="box">
                <b>स्वैकल्पिक सहमति :</b> मुझे विभागीय मानक लागत, चयनित फर्म की
                कोटेशन/प्रस्तावित बिल राशि, गाइडलाइन के अनुसार अपेक्षित DBT
                राजसहायता तथा यह स्पष्ट रूप से बता दिया गया है कि स्थापना पूर्ण
                होने पर मैं फर्म को पूर्ण वास्तविक बिल राशि का भुगतान
                करूँगा/करूँगी और देय राजसहायता विभाग द्वारा मेरे बैंक खाते में
                DBT के माध्यम से अलग से प्राप्त होगी। मैं इन वित्तीय शर्तों को
                समझकर चयनित फर्म से कार्य कराने हेतु स्वेच्छा से सहमत हूँ।
              </div>
              <div className="sigrow">
                <div>
                  कृषक के हस्ताक्षर
                  <br />
                  श्री सुरेश सिंह
                </div>
                <div>फर्म / अधिकृत डीलर प्रतिनिधि</div>
                <div>प्रभारी, उद्यान सचल दल केंद्र कोटद्वार</div>
              </div>
              <div className="pgno">फर्म चयन</div>
            </article>

            {/* PAGE 5: INVOICE */}
            <article className="sheet pmksy-company-bill avani-pdf-invoice">
              <table className="avani-head">
                <tbody>
                  <tr className="head-row">
                    <td>GSTIN No.: 05COWPD8094K1Z6</td>
                    <td className="invoice-title">TAX INVOICE / BILL</td>
                    <td className="right">Mob.: 9536462212</td>
                  </tr>
                  <tr>
                    <td className="company-name" colSpan="3">
                      AVANI ENTERPRISES
                    </td>
                  </tr>
                  <tr>
                    <td className="dealer-name" colSpan="3">
                      Authorised Dealer — भारत ड्रिप इरिगेशन एंड एग्रो
                    </td>
                  </tr>
                  <tr>
                    <td className="company-address" colSpan="3">
                      Lakhera Bhawan, Vill. Shibonagar, Near Nayan Gaon,
                      Kotdwar, Garhwal (Uttarakhand) - 246155
                    </td>
                  </tr>
                </tbody>
              </table>
              <table className="avani-billing">
                <tbody>
                  <tr className="section-blue">
                    <td colSpan="3">BILL TO / FARMER DETAILS</td>
                    <td colSpan="3">INVOICE DETAILS</td>
                  </tr>
                  <tr>
                    <td className="lbl">Farmer / M/s Name:</td>
                    <td colSpan="2">श्री सुरेश सिंह</td>
                    <td className="lbl">Invoice No.:</td>
                    <td colSpan="2">
                      <b>DEMO-APPLE-0001</b>
                    </td>
                  </tr>
                  <tr>
                    <td className="lbl">Village / Centre:</td>
                    <td colSpan="2">शिबूनगर / कोटद्वार</td>
                    <td className="lbl">Date:</td>
                    <td colSpan="2">
                      <b>20/9/2026</b>
                    </td>
                  </tr>
                  <tr>
                    <td className="lbl">Khasra No.:</td>
                    <td colSpan="2">—</td>
                    <td className="lbl">System Proposed:</td>
                    <td colSpan="2">ड्रिप</td>
                  </tr>
                  <tr>
                    <td className="lbl">Spacing:</td>
                    <td colSpan="2">
                      <b>2x2</b>
                    </td>
                    <td className="lbl">Area (Hectare):</td>
                    <td colSpan="2">
                      <b>0.2 हे०</b>
                    </td>
                  </tr>
                  <tr>
                    <td className="lbl">Crop:</td>
                    <td colSpan="2">सेब</td>
                    <td className="lbl">Date of Installation:</td>
                    <td colSpan="2">
                      <b>18/9/2026</b>
                    </td>
                  </tr>
                  <tr>
                    <td className="lbl">Work / Reference No.:</td>
                    <td colSpan="5">PMKSY-DEMO-APPLE-0001</td>
                  </tr>
                </tbody>
              </table>
              <table className="avani-items">
                <colgroup>
                  <col style={{ width: "6%" }} />
                  <col style={{ width: "28%" }} />
                  <col style={{ width: "25%" }} />
                  <col style={{ width: "9%" }} />
                  <col style={{ width: "8%" }} />
                  <col style={{ width: "11%" }} />
                  <col style={{ width: "13%" }} />
                </colgroup>
                <thead>
                  <tr className="item-head">
                    <th>S.No</th>
                    <th>Description of Goods</th>
                    <th>BIS / Standard</th>
                    <th>Qty</th>
                    <th>Unit</th>
                    <th>
                      Rate/Unit
                      <br />
                      (₹)
                    </th>
                    <th>
                      Taxable Value
                      <br />
                      (₹)
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="center">1</td>
                    <td className="desc">
                      Screen Filter 10 m3/hr / Disc Filter
                    </td>
                    <td className="std">IS 12785:1994</td>
                    <td className="center">1</td>
                    <td className="center">Nos</td>
                    <td className="num">3,615</td>
                    <td className="num">3,615</td>
                  </tr>
                  <tr>
                    <td className="center">2</td>
                    <td className="desc">Venturi & Manifold (1.5 in)</td>
                    <td className="std">IS 14483 (Part 1):1997</td>
                    <td className="center">1</td>
                    <td className="center">Nos</td>
                    <td className="num">1,735</td>
                    <td className="num">1,735</td>
                  </tr>
                  <tr>
                    <td className="center">3</td>
                    <td className="desc">Air Release Valve 1 in</td>
                    <td className="std">Mfr. Assured Quality (Para 15.7)</td>
                    <td className="center">1</td>
                    <td className="center">Nos</td>
                    <td className="num">434</td>
                    <td className="num">434</td>
                  </tr>
                  <tr>
                    <td className="center">4</td>
                    <td className="desc">Non Return Valve 1.5 in</td>
                    <td className="std">Mfr. Assured Quality (Para 15.7)</td>
                    <td className="center">1</td>
                    <td className="center">Nos</td>
                    <td className="num">579</td>
                    <td className="num">579</td>
                  </tr>
                  <tr>
                    <td className="center">5</td>
                    <td className="desc">By-Pass Assembly 1.5x1.5 in</td>
                    <td className="std">Mfr. Assured Quality (Para 15.7)</td>
                    <td className="center">1</td>
                    <td className="center">Nos</td>
                    <td className="num">723</td>
                    <td className="num">723</td>
                  </tr>
                  <tr>
                    <td className="center">6</td>
                    <td className="desc">HDPE Pipe 50 mm; 4 kg/cm2</td>
                    <td className="std">IS 4984:2016</td>
                    <td className="center">54</td>
                    <td className="center">Meter</td>
                    <td className="num">116</td>
                    <td className="num">6,270</td>
                  </tr>
                  <tr>
                    <td className="center">7</td>
                    <td className="desc">
                      Lateral 12 mm, Class II; 2.5 kg/cm2
                    </td>
                    <td className="std">IS 12786:1989</td>
                    <td className="center">1010</td>
                    <td className="center">Meter</td>
                    <td className="num">11</td>
                    <td className="num">11,221</td>
                  </tr>
                  <tr>
                    <td className="center">8</td>
                    <td className="desc">
                      Pressure Regulating Emitter/Dripper 2/4/8 lph
                    </td>
                    <td className="std">IS 13487:1992</td>
                    <td className="center">1020</td>
                    <td className="center">Nos</td>
                    <td className="num">3</td>
                    <td className="num">3,091</td>
                  </tr>
                  <tr>
                    <td className="center">9</td>
                    <td className="desc">Control Valve 50 mm</td>
                    <td className="std">IS 18286:2023</td>
                    <td className="center">1</td>
                    <td className="center">Nos</td>
                    <td className="num">579</td>
                    <td className="num">579</td>
                  </tr>
                  <tr>
                    <td className="center">10</td>
                    <td className="desc">Control Valve 63 mm</td>
                    <td className="std">IS 18286:2023</td>
                    <td className="center">1</td>
                    <td className="center">Nos</td>
                    <td className="num">867</td>
                    <td className="num">867</td>
                  </tr>
                  <tr>
                    <td className="center">11</td>
                    <td className="desc">Flush Valve 50 mm</td>
                    <td className="std">IS 18286:2023</td>
                    <td className="center">2</td>
                    <td className="center">Nos</td>
                    <td className="num">506</td>
                    <td className="num">1,012</td>
                  </tr>
                  <tr>
                    <td className="center">12</td>
                    <td className="desc">Throttle Valve 1.5 in</td>
                    <td className="std">IS 18286:2023</td>
                    <td className="center">1</td>
                    <td className="center">Nos</td>
                    <td className="num">650</td>
                    <td className="num">650</td>
                  </tr>
                  <tr className="subtotal">
                    <td className="num" colSpan="6">
                      <b>Sub Total</b>
                    </td>
                    <td className="num">
                      <b>30,774</b>
                    </td>
                  </tr>
                  <tr>
                    <td className="num" colSpan="6">
                      Installation / Labour Charges @ <b>5%</b>
                    </td>
                    <td className="num">1,534</td>
                  </tr>
                  <tr className="grand">
                    <td className="num" colSpan="6">
                      <b>GRAND TOTAL (₹)</b>
                    </td>
                    <td className="num">
                      <b>32,308</b>
                    </td>
                  </tr>
                  <tr>
                    <td colSpan="2">
                      <b>Amount in Words:</b>
                    </td>
                    <td colSpan="5">
                      Thirty Two Thousand Three Hundred Eight Only
                    </td>
                  </tr>
                </tbody>
              </table>
              <table className="avani-bottom">
                <tbody>
                  <tr className="section-blue">
                    <td colSpan="3">BANK DETAILS FOR PAYMENT</td>
                  </tr>
                  <tr>
                    <td className="bank-left">
                      <b>Bank Name:</b> Almora Urban Co-operative Bank
                    </td>
                    <td className="bank-mid">
                      <b>Account Number:</b> 025110100000143
                    </td>
                    <td className="bank-right">
                      <b>IFSC Code:</b> AUCB0000026
                    </td>
                  </tr>
                  <tr>
                    <td className="bank-left">
                      <b>Account Holder:</b> Avani Enterprises
                    </td>
                    <td className="bank-mid">
                      <b>Branch:</b> Kotdwar
                    </td>
                    <td className="bank-right">
                      <b>GSTIN:</b> 05COWPD8094K1Z6
                    </td>
                  </tr>
                  <tr>
                    <td className="terms" colSpan="3">
                      <b>Terms &amp; Conditions</b>
                      <br />
                      1. All disputes shall be subject to Kotdwar jurisdiction.
                      <br />
                      2. Goods supplied as per approved BOQ / work requirement.
                      <br />
                      3. Quantity and rate are subject to the approved bill and
                      applicable scheme norms.
                      <br />
                      4. Interest will be charged at 18% p.a. on overdue
                      payments.
                    </td>
                  </tr>
                  <tr>
                    <td className="customer-sign">Customer's Signature</td>
                    <td className="auth-sign" colSpan="2">
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
                  <span>नं० 001</span>
                  <span>दिनांक 20/9/2026</span>
                </div>
                <p>
                  नाम श्री/श्रीमती <b>श्री सुरेश सिंह</b> पुत्र/पति श्री{" "}
                  <b>पुत्र श्री मोहन सिंह</b>, ग्राम <b>शिबूनगर</b>, विकासखंड{" "}
                  <b>नगर निगम कोटद्वार</b> से <b>ड्रिप (2x2, 0.2 हे०)</b> की
                  स्थापना हेतु आपूर्तिकर्ता फर्म को देय{" "}
                  <b>पूर्ण वास्तविक बिल राशि</b> के रूप में <b>32,308.00</b>{" "}
                  (बत्तीस हज़ार तीन सौ आठ रुपये मात्र) नकद प्राप्त किया।
                </p>
                <div className="receipt-sign">
                  <span>
                    कुल बिल सं० DEMO-APPLE-0001 · कुल बिल राशि ₹32,308
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
                  कृषक का नाम : <span className="val">श्री सुरेश सिंह</span>
                </div>
                <div className="fi">
                  पिता/पति : <span className="val">पुत्र श्री मोहन सिंह</span>
                </div>
                <div className="fi">
                  ग्राम व पंचायत :{" "}
                  <span className="val">शिबूनगर / कोटद्वार</span>
                </div>
                <div className="fi">
                  विकासखंड / जिला :{" "}
                  <span className="val">नगर निगम कोटद्वार / पौड़ी गढ़वाल</span>
                </div>
                <div className="fi">
                  उद्यान सचल दल केंद्र : <span className="val">कोटद्वार</span>
                </div>
                <div className="fi">
                  खाता / खसरा सं० : <span className="val">00056 / 125/2</span>
                </div>
                <div className="fi">
                  मोबाइल : <span className="val">9876543210</span>
                </div>
                <div className="fi">
                  आधार सं० : <span className="val">XXXX-XXXX-1234</span>
                </div>
                <div className="fi full">
                  कृषक श्रेणी (Land) :{" "}
                  <span className="val lg">
                    सीमांत (&lt;1 हे०) ☑ &nbsp; लघु (1-2 हे०) ☐ &nbsp; अन्य
                    (&gt;2 हे०) ☐
                  </span>
                </div>
                <div className="fi full">
                  सामाजिक श्रेणी :{" "}
                  <span className="val lg">
                    सामान्य ☑ &nbsp; अ.जा. (SC) ☐ &nbsp; अ.ज.जा. (ST) ☐ &nbsp;
                    अ.प.व. (OBC) ☐ &nbsp; महिला कृषक ☐
                  </span>
                </div>
              </div>

              <h4 className="sec">2 — आपूर्तिकर्ता फर्म व प्रणाली विशेषताएँ</h4>
              <div className="fl">
                <div className="fi full">
                  अधिकृत फर्म :{" "}
                  <span className="val lg">
                    Avani Enterprises — भारत ड्रिप इरिगेशन एंड एग्रो (Garhwal
                    (Uttarakhand) - 246155)
                  </span>
                </div>
                <div className="fi">
                  GSTIN : <span className="val">05COWPD8094K1Z6</span>
                </div>
                <div className="fi full">
                  स्थापित प्रणाली :{" "}
                  <span className="val lg">
                    ड्रिप ☑ &nbsp; माइक्रो स्प्रिंकलर ☐ &nbsp; मिनी स्प्रिंकलर ☐
                    &nbsp; पोर्टेबल स्प्रिंकलर ☐ &nbsp; सेमी-परमानेंट ☐ &nbsp;
                    रेनगन ☐
                  </span>
                </div>
                <div className="fi">
                  QR Code / Unique ID :{" "}
                  <span className="val">PMKSY-DEMO-APPLE-0001</span>
                </div>
                <div className="fi">
                  स्थापना एवं Trial Run : <span className="val"></span>
                </div>
                <div className="fi">
                  फिल्टर प्रकार : <span className="val">स्क्रीन फिल्टर</span>
                </div>
                <div className="fi">
                  फर्टिगेशन उपकरण : <span className="val">वेंचुरी</span>
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
                    <td>2x2 · 0.20 हे०</td>
                    <td>0.20 हे०</td>
                    <td>सन्तोषजनक ☑ &nbsp; असन्तोषजनक ☐</td>
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
                  <tr>
                    <td>1</td>
                    <td>IS 12786 — लेटरल</td>
                    <td>☑ हाँ &nbsp; ☐ नहीं</td>
                  </tr>
                  <tr>
                    <td>2</td>
                    <td>IS 13488 — एमिटिंग पाइप</td>
                    <td>☑ हाँ &nbsp; ☐ नहीं</td>
                  </tr>
                  <tr>
                    <td>3</td>
                    <td>IS 12785 — फिल्टर</td>
                    <td>☑ हाँ &nbsp; ☐ नहीं</td>
                  </tr>
                  <tr>
                    <td>4</td>
                    <td>IS 17425 — क्विक कप्ल्ड HDPE पाइप (स्प्रिंकलर)</td>
                    <td>☑ हाँ &nbsp; ☐ नहीं</td>
                  </tr>
                  <tr>
                    <td>5</td>
                    <td>IS 14483 — वेंचुरी / फर्टिगेशन</td>
                    <td>☑ हाँ &nbsp; ☐ नहीं</td>
                  </tr>
                  <tr>
                    <td>6</td>
                    <td>IS 18286 — कंट्रोल / फ्लश वाल्व</td>
                    <td>☑ हाँ &nbsp; ☐ नहीं</td>
                  </tr>
                  <tr>
                    <td>7</td>
                    <td>QR कोड / यूनिक ID अंकित एवं सत्यापित</td>
                    <td>☑ हाँ &nbsp; ☐ नहीं</td>
                  </tr>
                  <tr>
                    <td>8</td>
                    <td>वारंटी कार्ड एवं संचालन पुस्तिका उपलब्ध कराइ गई है</td>
                    <td>☑ हाँ &nbsp; ☐ नहीं</td>
                  </tr>
                  <tr>
                    <td>9</td>
                    <td>जियो-टैगिंग (कृषि मैपर) पूर्ण</td>
                    <td>☑ हाँ &nbsp; ☐ नहीं</td>
                  </tr>
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
                    <td>29,915</td>
                  </tr>
                  <tr>
                    <td>वास्तविक बिल राशि</td>
                    <td>32,308</td>
                  </tr>
                  <tr>
                    <td>अनुदान गणना का आधार (जो कम हो)</td>
                    <td>29,915</td>
                  </tr>
                  <tr>
                    <td>भारत सरकार अंश (कुल अंश का 90%)</td>
                    <td>14,808</td>
                  </tr>
                  <tr>
                    <td>राज्यांश (कुल अंश का 10%)</td>
                    <td>1,645</td>
                  </tr>
                  <tr>
                    <td>राज्य टॉप-अप 25%</td>
                    <td>7,479</td>
                  </tr>
                  <tr className="tot">
                    <td>कुल देय अनुदान (80%)</td>
                    <td>23,932</td>
                  </tr>
                  <tr>
                    <td>कृषक द्वारा फर्म को किया गया पूर्ण वास्तविक भुगतान</td>
                    <td>32,308</td>
                  </tr>
                  <tr>
                    <td>DBT के बाद कृषक की प्रभावी स्वयं वहन लागत</td>
                    <td>8,376</td>
                  </tr>
                </tbody>
              </table>

              <h4 className="sec">5 — सत्यापन प्रमाण-पत्र एवं संस्तुति</h4>
              <div className="box">
                मैंने दिनांक ………………… को उक्त कृषक श्री सुरेश सिंह के प्रक्षेत्र
                पर स्वयं उपस्थित होकर ड्रिप प्रणाली, क्षेत्रफल 0.20 हे०, का
                भौतिक स्थलीय निरीक्षण एवं सत्यापन किया। स्थापना कार्य को मैंने
                स्वीकृत तकनीकी मानदंडों, जियो-टैगिंग एवं निर्धारित BIS मानकों के
                अनुरूप सन्तोषजनक पाया। मैं प्रमाणित करता/करती हूँ कि उपरोक्त
                समस्त विवरण मेरे द्वारा स्वयं मौके पर जाँचकर तैयार किया गया है।
                <br />
                <br />
                <b>संस्तुति :</b> अतः मैं, श्री अनिल कुमार, प्रभारी, प्रभारी,
                उद्यान सचल दल केंद्र कोटद्वार, लाभार्थी को देय सब्सडी धनराशि
                ₹23,932 डायरेक्ट बेनेफिट ट्रांसफर (DBT) के माध्यम से कृषक के
                बैंक खाते (123456789012, SBIN0001234) में भुगतान किए जाने हेतु
                संस्तुत करता/करती हूँ।
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
