import React, { useState } from 'react';
import './PMKSY.css';

const PMKSY = () => {
  const [activeStep, setActiveStep] = useState(1);
  const [showFirmPanel, setShowFirmPanel] = useState(false);
  const [showOfficePanel, setShowOfficePanel] = useState(false);
  const [showAllRecPanel, setShowAllRecPanel] = useState(false);

  const steps = [
    { id: 1, no: 'चरण 01', nm: 'आवेदन प्रपत्र' },
    { id: 2, no: 'चरण 02', nm: 'शपथ पत्र' },
    { id: 3, no: 'चरण 03', nm: 'फर्म चयन' },
    { id: 4, no: 'चरण 04', nm: 'भौतिक सत्यापन' },
    { id: 5, no: 'चरण 05', nm: 'कंपनी बिल / BoQ' },
    { id: 6, no: 'चरण 06', nm: 'नकद रसीद' },
    { id: 7, no: 'रजिस्टर', nm: 'सभी किसान' },
    { id: 8, no: 'प्रबंधन', nm: 'दर तालिका' },
  ];

  // Mock data for Dropdowns
  const firms = ["गंगा एंटरप्राइजेज", "बडोला मशरूम फार्म", "जय जवाहर ड्रिप"];
  const farmers = ["रामेश्वर प्रसाद", "सुरेश कुमार", "मोहन सिंह"];
  const kendras = ["कोटद्वार", "लैंसडाउन", "पौड़ी", "श्रीनगर"];
  const blocks = ["दुगड्डा", "यमकेश्वर", "कोटद्वार", "पौड़ी"];
  const vidhans = ["कोटद्वार", "थालीसैन", "पौड़ी"];
  const socialOpts = ["सामान्य", "अनुसूचित जाति", "अनुसूचित जनजाति", "ओबीसी"];
  const fclassOpts = ["सामान्य", "सीमांत", "लघु", "बड़ा"];
  const subOverrideOpts = ["स्वतः (किसान वर्ग से)", "35%", "45%", "55%", "70%"];
  const btypeOpts = ["स्वतंत्र", "सहकारी", "समूह", "स्वसहायता समूह"];
  const sourceOpts = ["नहर", "नलकूप", "ट्यूबवेल", "नदी/नाला", "तालाब", "अन्य"];
  const terrainOpts = ["समतल", "ढालू", "अत्यधिक ढालू"];
  const wqualOpts = ["अच्छी", "मध्यम", "खराब"];
  const pumpOpts = ["सबमर्सिबल", "मोनोब्लॉक", "सौर", "अन्य"];
  const verdictOpts = ["अनुमोदित", "अस्वीकृत", "लंबित"];
  const stampOpts = ["10", "20", "50", "100"];
  const warrantyOpts = ["1 वर्ष", "3 वर्ष", "5 वर्ष", "7 वर्ष"];
  const filterOpts = ["स्क्रीन फिल्टर", "डिस्क फिल्टर", "हाइड्रोसाइक्लोन"];
  const fertOpts = ["वेंचुरी", "फर्टिगेशन टैंक", "इंजेक्टर पंप"];
  const trialOpts = ["सफल", "असफल", "लंबित"];
  const resultOpts = ["पास", "फेल", "लंबित"];
  const rowOpts = ["पंक्ति 1", "पंक्ति 2"];
  const gstOpts = ["0%", "5%", "12%", "18%"];

  return (
    <div className="noprint">
      <header className="mast">
        <div className="crest">उ</div>
        <div>
          <h1>PMKSY–PDMC · सम्पूर्ण प्रपत्र प्रणाली</h1>
          <div className="sub">
            उद्यान एवं खाद्य प्रसंस्करण विभाग, उत्तराखण्ड ·{' '}
            <span id="officeNameTop">कार्यालय उद्यान विशेषज्ञ, कोटद्वार, पौड़ी गढ़वाल, उत्तराखण्ड</span>{' '}
            <span style={{ background: '#0d7680', color: '#fff', padding: '1px 7px', borderRadius: '9px', fontSize: '10.5px', fontWeight: 700, marginLeft: '6px' }}>
              संस्करण 8 · 23-08-2026
            </span>
          </div>
        </div>
        <div className="sp"></div>
        <div className="firmswitch">
          <label htmlFor="activeFirmSel">सक्रिय फर्म</label>
          <select id="activeFirmSel">
            {firms.map((f, i) => <option key={i} value={f}>{f}</option>)}
          </select>
          <button className="btn ghost sm" type="button" onClick={() => setShowFirmPanel(true)}>फर्म जोड़ें/हटाएँ</button>
          <button className="btn ghost sm" type="button" onClick={() => setShowAllRecPanel(true)}>सभी फर्मों का रिकॉर्ड</button>
          <button className="btn ghost sm" type="button" onClick={() => setShowOfficePanel(true)}>कार्यालय सेटिंग</button>
        </div>
        <div className="btnrow">
          <select id="quickFarmer" style={{ minWidth: '190px', fontSize: '13px' }}>
            <option value="">— सहेजा किसान खोलें —</option>
            {farmers.map((f, i) => <option key={i} value={f}>{f}</option>)}
          </select>
          <button className="btn ghost sm" type="button">नया आवेदन</button>
          <button className="btn water sm" type="button">वर्तमान प्रपत्र प्रिंट</button>
        </div>
      </header>

      {/* Firm Panel Modal */}
      <div className="firmpanel-backdrop" hidden={!showFirmPanel}>
        <div className="firmpanel" role="dialog" aria-label="फर्म प्रबंधन">
          <div className="firmpanel-head">
            <h2>फर्म प्रबंधन — जोड़ें, हटाएँ, सक्रिय फर्म चुनें</h2>
            <button className="btn ghost sm" type="button" onClick={() => setShowFirmPanel(false)}>बंद करें ✕</button>
          </div>
          <div className="firmpanel-body">
            <div className="flag info">हर फर्म का किसान-रजिस्टर अलग-अलग सहेजा जाता है। ऊपर "सक्रिय फर्म" बदलते ही सिर्फ़ उसी फर्म के सहेजे किसान दिखेंगे, नए आवेदन भी उसी फर्म के नाम से बनेंगे। "हटाएँ" करने से फर्म सूची से छिप जाती है — उसका पुराना डेटा सुरक्षित रहता है, मिटता नहीं।</div>
            <h4 className="subh" style={{ marginTop: '4px' }}>नई फर्म जोड़ें</h4>
            <div className="grid">
              <div className="f"><label>फर्म का नाम *</label><input placeholder="जैसे: Ganga Enterprises" /></div>
              <div className="f"><label>निर्माता / मैन्युफैक्चरर</label><input placeholder="जैसे: भारत ड्रिप इरिगेशन एंड एग्रो" /></div>
              <div className="f wide"><label>पता</label><input placeholder="पूरा पता" /></div>
              <div className="f"><label>मोबाइल</label><input inputMode="numeric" /></div>
              <div className="f"><label>GSTIN</label><input className="mono" /></div>
              <div className="f"><label>बैंक का नाम</label><input /></div>
              <div className="f"><label>खाता संख्या</label><input className="mono" /></div>
              <div className="f"><label>IFSC</label><input className="mono" /></div>
            </div>
            <div className="btnrow" style={{ marginTop: '10px' }}>
              <button className="btn water sm" type="button">फर्म जोड़ें</button>
              <span className="hint"></span>
            </div>
            <h4 className="subh">सभी फर्में <span className="tag"></span></h4>
            <input placeholder="फर्म खोजें…" style={{ marginBottom: '9px' }} />
            <div style={{ maxHeight: '280px', overflowY: 'auto', border: '1px solid var(--line)', borderRadius: 'var(--r-sm)' }}></div>
          </div>
        </div>
      </div>

      {/* Office Panel Modal */}
      <div className="firmpanel-backdrop" hidden={!showOfficePanel}>
        <div className="firmpanel" role="dialog" aria-label="कार्यालय सेटिंग">
          <div className="firmpanel-head">
            <h2>कार्यालय नाम प्रबंधन — जोड़ें, चुनें, हटाएँ</h2>
            <button className="btn ghost sm" type="button" onClick={() => setShowOfficePanel(false)}>बंद करें ✕</button>
          </div>
          <div className="firmpanel-body">
            <div className="flag info">यहाँ चुना गया कार्यालय नाम सिस्टम के मुख्य शीर्षक और प्रिंट होने वाले आवेदन/प्रपत्रों के कार्यालय शीर्षक में स्वतः दिखाई देगा। अलग-अलग कार्यालयों के नाम सुरक्षित करके जरूरत के अनुसार बदले जा सकते हैं।</div>
            <div className="f" style={{ marginTop: '10px' }}><label>सक्रिय कार्यालय</label><select></select></div>
            <h4 className="subh" style={{ marginTop: '12px' }}>नया कार्यालय जोड़ें</h4>
            <div className="grid">
              <div className="f wide"><label>कार्यालय का पूरा नाम *</label><input placeholder="जैसे: कार्यालय उद्यान विशेषज्ञ, कोटद्वार, पौड़ी गढ़वाल, उत्तराखण्ड" /></div>
            </div>
            <div className="btnrow" style={{ marginTop: '10px' }}>
              <button className="btn water sm" type="button">कार्यालय जोड़ें</button>
              <span className="hint"></span>
            </div>
            <h4 className="subh">सभी कार्यालय <span className="tag"></span></h4>
            <div style={{ maxHeight: '280px', overflowY: 'auto', border: '1px solid var(--line)', borderRadius: 'var(--r-sm)' }}></div>
          </div>
        </div>
      </div>

      {/* All Records Modal */}
      <div className="firmpanel-backdrop" hidden={!showAllRecPanel}>
        <div className="firmpanel" role="dialog" aria-label="सभी फर्मों का रिकॉर्ड" style={{ maxWidth: '1080px' }}>
          <div className="firmpanel-head">
            <h2>सभी फर्मों के दस्तावेज़ — एक साथ देखें</h2>
            <button className="btn ghost sm" type="button" onClick={() => setShowAllRecPanel(false)}>बंद करें ✕</button>
          </div>
          <div className="firmpanel-body">
            <div className="flag info">हर किसान के सभी 6 प्रपत्र (आवेदन, शपथ पत्र, फर्म सहमति, बिल, रसीद, भौतिक सत्यापन) यहीं से "प्रिंट सभी" दबाकर खोले जा सकते हैं — भले वह किसी भी फर्म के अंतर्गत सहेजा गया हो।</div>
            <div className="grid" style={{ gridTemplateColumns: '1fr 2fr', marginBottom: '10px' }}>
              <div className="f"><label>फर्म अनुसार फ़िल्टर</label><select></select></div>
              <div className="f"><label>किसान/ग्राम/केंद्र खोजें</label><input placeholder="नाम, ग्राम, केंद्र टाइप करें…" /></div>
            </div>
            <div className="hint" style={{ marginBottom: '8px' }}></div>
            <div></div>
          </div>
        </div>
      </div>

      <div className="wrap">
        <div className="steps" role="tablist" id="stepbar">
          {steps.map((step) => (
            <button
              key={step.id}
              className={`step ${activeStep === step.id ? 'active' : ''}`}
              role="tab"
              data-s={step.id}
              aria-selected={activeStep === step.id}
              onClick={() => setActiveStep(step.id)}
            >
              <span className="no">{step.no}</span>
              <span className="nm">{step.nm} {step.id === 7 && <span className="mono" id="cnt"></span>}</span>
            </button>
          ))}
        </div>

        {/* STEP 1 */}
        {activeStep === 1 && (
          <section id="S1">
            <div className="card">
              <h2><span className="kh">क</span> क्षेत्र विवरण <span className="en">Location</span></h2>
              <div className="body"><div className="grid">
                <div className="f"><label><span className="n">1</span>जनपद</label><input className="auto" value="पौड़ी गढ़वाल" readOnly /></div>
                <div className="f"><label><span className="n">2</span>उद्यान सचल दल केंद्र</label>
                  <select id="kendra">
                    <option value="">चुनें</option>
                    {kendras.map(k => <option key={k} value={k}>{k}</option>)}
                  </select>
                  <div className="hint">केंद्र चुनते ही विकासखंड एवं विधान सभा स्वतः भर जाएँगे</div>
                </div>
                <div className="f"><label><span className="n">3</span>विकासखंड</label>
                  <select id="block" className="auto">
                    <option value="">चुनें</option>
                    {blocks.map(b => <option key={b} value={b}>{b}</option>)}
                  </select>
                </div>
                <div className="f"><label><span className="n">4</span>विधान सभा</label>
                  <select id="vidhan" className="auto">
                    <option value="">चुनें</option>
                    {vidhans.map(v => <option key={v} value={v}>{v}</option>)}
                  </select>
                </div>
                <div className="f"><label><span className="n">5</span>ग्राम पंचायत</label><input list="dlPan" /><datalist id="dlPan"></datalist></div>
                <div className="f"><label><span className="n">6</span>ग्राम</label><input list="dlVil" /><datalist id="dlVil"></datalist></div>
              </div></div>
            </div>

            <div className="card">
              <h2><span className="kh">ख</span> किसान एवं बैंक विवरण <span className="en">Farmer &amp; Bank — DBT</span></h2>
              <div className="body">
                <div className="flag ok" id="recall" style={{ display: 'none' }}></div>
                <div className="btnrow sample-toolbar" style={{ marginBottom: '12px' }}>
                  <button className="btn water sm" type="button">🧪 पूरा भरा हुआ किसान Sample देखें</button>
                  <button className="btn ghost sm" type="button">🖨️ Sample के सभी 6 प्रपत्र प्रिंट</button>
                  <span className="hint">Apple · Drip · 2×2 m · 0.20 हे० — सभी 6 प्रपत्रों की testing के लिए demo data भरेगा; रजिस्टर में save नहीं होगा।</span>
                </div>
                <div className="grid">
                  <div className="f"><label><span className="n">1</span>किसान का नाम</label><input list="dlF" autoComplete="off" placeholder="नाम लिखें" /><datalist id="dlF"></datalist><div className="hint">पुराना किसान हो तो पूरा रिकॉर्ड अपने आप भर जाएगा</div></div>
                  <div className="f"><label><span className="n">2</span>पिता / पति का नाम</label><input id="rel" /></div>
                  <div className="f"><label><span className="n">3</span>लिंग</label><div className="chips" id="gender"></div></div>
                  <div className="f"><label><span className="n">4</span>सामाजिक श्रेणी</label>
                    <select id="social">
                      <option value="">चुनें</option>
                      {socialOpts.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div className="f"><label><span className="n">5</span>किसान वर्ग <span className="tag">कुल भूमि से स्वतः</span></label>
                    <select id="fclass">
                      <option value="">चुनें</option>
                      {fclassOpts.map(f => <option key={f} value={f}>{f}</option>)}
                    </select>
                    <div className="hint" id="fcHint"></div>
                  </div>
                  <div className="f"><label>अनुदान दर <span className="tag">बदलना हो तो चुनें</span></label>
                    <select id="subOverride">
                      <option value="">स्वतः (किसान वर्ग से)</option>
                      {subOverrideOpts.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                    <div className="hint">डिफ़ॉल्ट किसान वर्ग से स्वतः तय होती है — किसी विशेष प्रकरण में दर स्वयं तय करनी हो तो यहाँ चुन लें</div>
                  </div>
                  <div className="f"><label><span className="n">6</span>लाभार्थी प्रकार</label>
                    <select id="btype">
                      <option value="">चुनें</option>
                      {btypeOpts.map(b => <option key={b} value={b}>{b}</option>)}
                    </select>
                  </div>
                  <div className="f"><label><span className="n">7</span>आधार संख्या</label><input className="mono" inputMode="numeric" maxLength="14" placeholder="XXXX XXXX XXXX" /><div className="errtxt" id="e_aadhaar"></div></div>
                  <div className="f"><label><span className="n">8</span>मोबाइल नंबर</label><input className="mono" inputMode="numeric" maxLength="10" /><div className="errtxt" id="e_mobile"></div></div>
                  <div className="f"><label><span className="n">9</span>बैंक खाता सं० (आधार लिंक)</label><input className="mono" /></div>
                  <div className="f"><label><span className="n">11</span>IFSC कोड</label><input className="mono" maxLength="11" style={{ textTransform: 'uppercase' }} placeholder="ABCD0123456" /><div className="errtxt" id="e_ifsc"></div></div>
                  <div className="f wide"><label><span className="n">10</span>बैंक का नाम एवं शाखा</label><input list="dlBank" /><datalist id="dlBank"></datalist></div>
                  <div className="f"><label><span className="n">12</span>उद्यान कार्ड / पंजीकरण सं०</label><input className="mono" /></div>
                  <div className="f wide"><label><span className="n">13</span>पूरा पता <span className="tag">स्वतः</span></label><input className="auto" /></div>
                </div>
              </div>
            </div>

            <div className="card">
              <h2><span className="kh">ग</span> भूमि, जल स्रोत एवं प्रस्तावित प्रणाली <span className="en">Land &amp; System</span></h2>
              <div className="body">
                <div id="landFlags"></div>
                <h4 className="subh" style={{ borderTop: 'none', paddingTop: '0', marginTop: '2px' }}>प्रस्तावित प्रणाली — अधिकतम 2 पंक्तियाँ (प्रपत्र का भाग «छ»)</h4>
                <div id="sysRows"></div>
                <div className="btnrow" style={{ marginTop: '9px' }}>
                  <button className="btn ghost sm">+ प्रणाली पंक्ति जोड़ें</button>
                  <span className="hint">प्रणाली → फसल → स्पेसिंग → क्षेत्र चुनते ही लागत एवं अनुदान PDMC Table 3/4/5/6 से स्वतः</span>
                </div>

                <h4 className="subh">भूमि विवरण — उपरोक्त क्षेत्रफल किस-किस की भूमि से पूरा हो रहा है</h4>
                <div className="hint" style={{ marginBottom: '8px' }}>पहली पंक्ति कृषक की स्वयं की भूमि है (विवरण ऊपर से स्वतः)। अपनी भूमि कम पड़े तो नीचे रक्त-संबंधी सह-खाताधारक जोड़ें — यही तालिका शपथ पत्र में छपेगी।</div>
                <div style={{ overflowX: 'auto' }}><table className="dt landtbl" id="landTable"></table></div>
                <div className="btnrow" style={{ marginTop: '8px' }}>
                  <button className="btn ghost sm">+ सह-खाताधारक जोड़ें</button>
                  <span className="hint">रक्त-संबंध (पिता, भाई, पुत्र आदि) होना आवश्यक है</span>
                </div>
                <div id="landSrcFlag" style={{ marginTop: '12px' }}></div>

                <h4 className="subh">भूमि स्वामित्व, जल स्रोत एवं फर्म</h4>
                <div className="grid">
                  <div className="f"><label><span className="n">4</span>भूमि स्वामित्व</label><select id="tenure"><option value="">चुनें</option><option>स्वयं की</option><option>पट्टे की</option></select></div>
                  <div className="f"><label><span className="n">5</span>पट्टा अवधि (वर्ष)</label><input type="number" min="0" className="mono" placeholder="न्यूनतम 07" /><div className="errtxt" id="e_lease"></div></div>
                  <div className="f"><label><span className="n">8</span>गत 07 वर्षों में पूर्व अनुदान?</label><div className="chips" id="prevsub"></div></div>
                  <div className="f"><label><span className="n">9</span>जल स्रोत</label>
                    <select id="source">
                      <option value="">चुनें</option>
                      {sourceOpts.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div className="f" id="srcOtherWrap" style={{ display: 'none' }}><label>अन्य जल स्रोत का विवरण</label><input placeholder="जल स्रोत का नाम / प्रकार लिखें" /></div>
                  <div className="f wide"><label><span className="n">11</span>चयनित / अधिकृत डीलर</label><input list="dlDealer" placeholder="डीलर का नाम टाइप करें — 177 अधिकृत डीलरों में से खोजें" /><datalist id="dlDealer"></datalist><div className="hint">चुनते ही फर्म का पता, मोबाइल एवं GSTIN चरण 03 में स्वतः भर जाएँगे</div></div>
                </div>
              </div>
            </div>

            <div className="card">
              <h2><span className="kh">च</span> स्थलीय सत्यापन एवं प्रक्षेत्र विवरण <span className="en">Joint Survey</span></h2>
              <div className="body"><div className="grid">
                <div className="f"><label><span className="n">1</span>अक्षांश</label><input className="mono" placeholder="29.7xxxxx" /></div>
                <div className="f"><label><span className="n">2</span>देशांतर</label><input className="mono" placeholder="78.5xxxxx" /></div>
                <div className="f wide"><div className="btnrow"><button className="btn ghost sm">मौजूदा लोकेशन भरें</button><span className="hint" id="geoMsg"></span></div></div>
                <div className="f"><label><span className="n">3</span>कृषि मैपर एप ID</label><input className="mono" /></div>
                <div className="f"><label><span className="n">4</span>भूमि की प्रकृति</label>
                  <select id="terrain">
                    <option value="">चुनें</option>
                    {terrainOpts.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div className="f"><label><span className="n">5</span>जल स्रोत की दूरी (मी०)</label><input type="number" min="0" className="mono" /></div>
                <div className="f"><label><span className="n">6</span>ऊर्ध्वाधर ऊँचाई अंतर (मी०)</label><input type="number" min="0" className="mono" /><div className="hint" id="valveHint"></div></div>
                <div className="f"><label><span className="n">7</span>जल उपलब्धता (ली०/घंटा)</label><input type="number" min="0" className="mono" /><div className="errtxt" id="e_water"></div></div>
                <div className="f"><label><span className="n">8</span>जल की गुणवत्ता</label>
                  <select id="wqual">
                    <option value="">चुनें</option>
                    {wqualOpts.map(w => <option key={w} value={w}>{w}</option>)}
                  </select>
                </div>
                <div className="f"><label><span className="n">9</span>पंप</label>
                  <select id="pump">
                    <option value="">चुनें</option>
                    {pumpOpts.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
                <div className="f"><label><span className="n">10</span>पंप क्षमता (HP)</label><input type="number" step="0.5" min="0" className="mono" /></div>
              </div></div>
            </div>

            <div className="card"><h2><span className="kh">घ</span> संलग्न दस्तावेज़ <span className="en">Enclosures</span></h2><div className="body" id="encList"></div></div>
            <div className="card"><h2><span className="kh">ज</span> पात्रता एवं स्थल परीक्षण जाँच सूची <span className="en">Eligibility Checklist</span></h2><div className="body"><div className="hint" style={{ marginBottom: '8px' }}>भरी हुई सूचना से जो बिंदु तय हो सकते हैं वे <span className="tag">स्वतः</span> चिह्नित हैं — बदल सकते हैं।</div><div id="chkList"></div></div></div>
            <div className="card"><h2><span className="kh">झ</span> प्रमाणीकरण एवं संस्तुति</h2><div className="body"><div className="grid">
              <div className="f"><label>प्रकरण</label>
                <select id="verdict">
                  <option value="">चुनें</option>
                  {verdictOpts.map(v => <option key={v} value={v}>{v}</option>)}
                </select>
              </div>
              <div className="f"><label>आवेदन दिनांक</label><input id="appdate" type="date" /></div>
              <div className="f wide"><label>संस्तुति / टिप्पणी <span className="tag">खाली छोड़ें तो स्वतः</span></label><textarea id="remark" rows="2"></textarea></div>
            </div></div></div>
          </section>
        )}

        {/* STEP 2 */}
        {activeStep === 2 && (
          <section id="S2">
            <div className="card"><h2><span className="kh">२</span> लाभार्थी स्व-घोषणा एवं शपथ पत्र <span className="en">Affidavit / Self-Declaration</span></h2>
              <div className="body">
                <div className="flag info">कृषक, भूमि, फर्म एवं वित्तीय विवरण चरण 01 से स्वतः आते हैं। इस प्रपत्र में <b>शीर्षक, स्थान एवं दिनांक जानबूझकर रिक्त</b> छोड़े जाते हैं — विभागीय लेटरहेड/स्टाम्प पर हाथ से भरे जाएँ।</div>
                <div className="grid">
                  <div className="f"><label>स्टाम्प पत्र मूल्य (₹)</label>
                    <select id="af_stamp">
                      <option value="">चुनें</option>
                      {stampOpts.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div className="f"><label>नोटरी / शपथ आयुक्त</label><input placeholder="नाम एवं पंजीकरण सं०" /></div>
                </div>
                <div className="grid" style={{ marginTop: '12px' }}>
                  <div className="f wide"><div className="flag info" style={{ margin: '0' }}>सह-खाताधारकों की भूमि का विवरण अब <b>चरण 01 → भूमि स्रोत</b> में भरा जाता है; शपथ पत्र में वही अपने आप छपेगा।</div></div>
                </div>
                <div className="flag warn" style={{ marginTop: '14px' }}>शपथ पत्र में «कार्य पूर्ण करा लिया है» लिखा है — इसे स्थापना पूर्ण होने के बाद ही निष्पादित कराएँ।</div>
              </div>
            </div>
            <div className="card"><h2><span className="kh">₹</span> शपथ पत्र का वित्तीय विवरण <span className="en">auto</span></h2><div className="body"><div style={{ overflowX: 'auto' }}><table className="dt" id="afMoney"></table></div></div></div>
          </section>
        )}

        {/* STEP 3 */}
        {activeStep === 3 && (
          <section id="S3">
            <div className="card"><h2><span className="kh">३</span> फर्म चयन एवं स्वैच्छिक सहमति <span className="en">Firm Selection</span></h2>
              <div className="body">
                <div className="grid">
                  <div className="f wide"><label>चयनित पंजीकृत / अधिकृत डीलर <span className="tag">चरण 01 से</span></label><input list="dlDealer" placeholder="डीलर का नाम" /></div>
                  <div className="f"><label>फर्म पंजीकरण / empanelment सं०</label><input className="mono" /></div>
                  <div className="f"><label>GSTIN</label><input className="mono" maxLength="15" style={{ textTransform: 'uppercase' }} /><div className="errtxt" id="e_fm_gst"></div></div>
                  <div className="f"><label>अधिकृत डीलर / प्रतिनिधि</label><input /></div>
                  <div className="f"><label>प्रतिनिधि मोबाइल</label><input className="mono" maxLength="10" /></div>
                  <div className="f wide"><label>फर्म का पता</label><input /></div>
                  <div className="f"><label>चयन दिनांक</label><input type="date" /></div>
                  <div className="f"><label>प्रस्तावित स्थापना अवधि (दिन)</label><input type="number" min="1" defaultValue="30" className="mono" /></div>
                  <div className="f"><label>वारंटी अवधि (वर्ष)</label>
                    <select id="fm_warr">
                      <option value="">चुनें</option>
                      {warrantyOpts.map(w => <option key={w} value={w}>{w}</option>)}
                    </select>
                  </div>
                  <div className="f"><label>निःशुल्क सेवा भ्रमण (प्रति वर्ष)</label><input type="number" min="0" defaultValue="3" className="mono" /></div>
                </div>
                <h4 style={{ fontSize: '11.5px', color: 'var(--ink2)', margin: '16px 0 6px', borderTop: '1px solid var(--line)', paddingTop: '13px' }}>कृषक की स्वैच्छिक घोषणा</h4>
                <div id="fmChk"></div>
              </div>
            </div>
          </section>
        )}

        {/* STEP 4 */}
        {activeStep === 4 && (
          <section id="S4">
            <div className="card"><h2><span className="kh">४</span> भौतिक सत्यापन रिपोर्ट <span className="en">Physical Verification Report</span></h2>
              <div className="body">
                <div className="flag info">कृषक, फर्म, प्रणाली एवं वित्तीय विवरण चरण 01/03 से स्वतः। यहाँ केवल मौके पर पाई गई स्थिति भरें।</div>
                <div className="grid">
                  <div className="f"><label>सत्यापन दिनांक</label><input type="date" /></div>
                  <div className="f"><label>QR Code / Unique ID</label><input className="mono" /></div>
                  <div className="f"><label>मौके पर मापा गया क्षेत्रफल (हे०)</label><input type="number" step="0.01" className="mono" /><div className="errtxt" id="e_pv_area"></div></div>
                  <div className="f"><label>फिल्टर प्रकार</label>
                    <select id="pv_filter">
                      <option value="">चुनें</option>
                      {filterOpts.map(f => <option key={f} value={f}>{f}</option>)}
                    </select>
                  </div>
                  <div className="f"><label>फर्टिगेशन उपकरण</label>
                    <select id="pv_fert">
                      <option value="">चुनें</option>
                      {fertOpts.map(f => <option key={f} value={f}>{f}</option>)}
                    </select>
                  </div>
                  <div className="f"><label>Trial Run</label>
                    <select id="pv_trial">
                      <option value="">चुनें</option>
                      {trialOpts.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                  <div className="f"><label>सत्यापन परिणाम</label>
                    <select id="pv_result">
                      <option value="">चुनें</option>
                      {resultOpts.map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                  </div>
                  <div className="f"><label>सत्यापन अधिकारी</label><input placeholder="नाम एवं पदनाम" /></div>
                  <div className="f wide"><label>सत्यापित कुल लागत (₹) <span className="tag">बिल से स्वतः</span></label><input className="auto mono" readOnly /></div>
                </div>
                <h4 style={{ fontSize: '11.5px', color: 'var(--ink2)', margin: '16px 0 6px', borderTop: '1px solid var(--line)', paddingTop: '13px' }}>BIS मानक अनुपालन (मौके पर जाँचा)</h4>
                <div id="pvChk"></div>
                <div className="grid" style={{ marginTop: '12px' }}><div className="f wide"><label>सत्यापन टिप्पणी <span className="tag">खाली छोड़ें तो स्वतः</span></label><textarea rows="2"></textarea></div></div>
              </div>
            </div>
          </section>
        )}

        {/* STEP 5 */}
        {activeStep === 5 && (
          <section id="S5">
            <div className="card"><h2><span className="kh">५</span> कंपनी बिल — सामग्री-वार BoQ <span className="en">Item-wise Bill</span></h2>
              <div className="body">
                <div className="grid" style={{ marginBottom: '12px' }}>
                  <div className="f"><label>बिल किस प्रणाली पंक्ति का?</label>
                    <select id="bl_row">
                      <option value="">चुनें</option>
                      {rowOpts.map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                  </div>
                  <div className="f"><label>बिल संख्या</label><div className="btnrow"><input className="mono" style={{ flex: '1' }} /><button className="btn ghost sm" type="button" title="अगला बिल नंबर अपने आप ले लें">नया नंबर</button></div></div>
                  <div className="f"><label>बिल दिनांक</label><input type="date" /></div>
                  <div className="f"><label>स्थापना दिनांक</label><input type="date" /><div className="hint">यह बिल दिनांक से स्वतंत्र है और इसे अलग से बदला जा सकता है।</div></div>
                  <div className="f"><label>GST दर (कुल बिल में शामिल)</label>
                    <select id="bl_gst">
                      <option value="">चुनें</option>
                      {gstOpts.map(g => <option key={g} value={g}>{g}</option>)}
                    </select>
                  </div>
                </div>
                <div className="btnrow" style={{ marginBottom: '10px' }}>
                  <button className="btn water sm" type="button">🧪 Apple 0.20 हे० / 2×2 m पूरा Sample देखें</button>
                  <span className="hint">यह Demo केवल देखने/Testing के लिए है; इसे रजिस्टर में स्वतः Save नहीं किया जाएगा।</span>
                </div>
                <div className="stamp-options">
                  <div className="stamp-options-title">केवल कंपनी Tax Invoice पर नीली मुहर — प्रिंट विकल्प</div>
                  <label><input type="checkbox" defaultChecked /> कृषक हस्ताक्षर वाली मुहर</label>
                  <label><input type="checkbox" defaultChecked /> प्रभारी की संस्तुति वाली मुहर</label>
                  <span className="hint">ये दोनों मुहरें केवल प्रिंट किए जाने वाले कंपनी बिल में दिखाई देंगी। दोनों या किसी एक मुहर को रखना/हटाना चुन सकते हैं।</span>
                </div>
                <div id="blFlags"></div>
                <div style={{ overflowX: 'auto' }}><table className="dt" id="blTable"></table></div>
                <div className="btnrow" style={{ marginTop: '10px' }}>
                  <button className="btn ghost sm">मानक दरें पुनः लगाएँ</button>
                  <span className="hint">मात्राएँ PDMC Annexure की spacing/area-wise BoQ से स्वतः आती हैं। प्रारंभिक कंपनी दरें guideline × निर्धारित वृद्धि से automatic हैं; manual बदलाव करने पर total लक्ष्य से अलग हो सकता है।</span>
                </div>
              </div>
            </div>
            <div className="card"><h2><span className="kh">₹</span> कंपनी बिल — गाइडलाइन दर + स्वीकृत वृद्धि <span className="en">Guideline-linked Dealer Bill</span></h2>
              <div className="body">
                <div className="flag info"><b>महत्वपूर्ण:</b> सामग्री-वार BoQ की मात्राएँ चयनित <b>प्रणाली + फसल/स्पेसिंग + क्षेत्रफल</b> से स्वतः आती हैं। कंपनी बिल का मूल लक्ष्य अब उसी चयन की <b>PDMC इकाई लागत × निर्धारित वृद्धि</b> होगा — ड्रिप +8%, स्प्रिंकलर-परिवार +6.4%। इसलिए उदाहरणतः 0.20 हे०, 2×2 मी० ड्रिप में ₹29,915 × 1.08 = <b>₹32,308</b> (राउंडेड) बेस कंपनी बिल बनेगा; GST यदि अलग से चुना गया है तो वह इसके ऊपर दिखेगा।</div>
                <div style={{ overflowX: 'auto' }}><table className="dt" id="pkgTable"></table></div>
              </div>
            </div>
          </section>
        )}

        {/* STEP 6 */}
        {activeStep === 6 && (
          <section id="S6">
            <div className="card"><h2><span className="kh">६</span> नकद प्राप्ति रसीद <span className="en">Cash Receipt</span></h2>
              <div className="body">
                <div className="flag info">कृषक द्वारा कंपनी को पूर्ण वास्तविक बिल राशि का भुगतान होने पर यह रसीद बनाइए। DBT राजसहायता की राशि विभाग द्वारा कृषक के बैंक खाते में अलग से भुगतान की जाएगी।</div>
                <div className="grid">
                  <div className="f"><label>रसीद संख्या</label><div className="btnrow"><input className="mono" style={{ flex: '1' }} /><button className="btn ghost sm" type="button" title="अगला रसीद नंबर अपने आप ले लें">नया नंबर</button></div></div>
                  <div className="f"><label>रसीद दिनांक</label><input type="date" /></div>
                  <div className="f"><label>कंपनी को प्राप्त पूर्ण बिल राशि (₹) <span className="tag">डिफ़ॉल्ट वास्तविक बिल</span></label><input type="number" min="0" className="mono" /></div>
                </div>
                <div id="rcPreview" style={{ marginTop: '10px' }}></div>
              </div>
            </div>
          </section>
        )}

        {/* STEP 7 */}
        {activeStep === 7 && (
          <section id="S7">
            <div className="card"><h2>किसान रजिस्टर</h2><div className="body">
              <div className="btnrow" style={{ marginBottom: '12px' }}>
                <input placeholder="नाम / ग्राम / केंद्र / आधार से खोजें" style={{ maxWidth: '280px' }} />
                <button className="btn ghost sm">CSV निर्यात</button>
                <button className="btn ghost sm">बैकअप (JSON)</button>
                <label className="btn ghost sm" style={{ cursor: 'pointer', margin: '0' }}>बैकअप आयात<input type="file" accept=".json" hidden /></label>
                <label className="btn water sm" style={{ cursor: 'pointer', margin: '0' }}>Excel से बल्क आयात<input type="file" accept=".xlsx" hidden /></label>
                <a className="btn ghost sm" href="#" style={{ textDecoration: 'none' }}>बल्क टेम्पलेट (.xlsx)</a>
              </div>
              <div id="recTable"></div>
            </div></div>
          </section>
        )}

        {/* STEP 8 */}
        {activeStep === 8 && (
          <section id="S8">
            <div className="card">
              <h2><span className="kh">₹</span> दर तालिका — प्रबंधन <span className="en">Rate Management</span></h2>
              <div className="body">
                <div className="flag info">यहाँ दी गई दरें ही «प्रस्तावित प्रणाली» की सारी गणना (इकाई लागत, अनुदान, कृषक अंश) में उपयोग होती हैं। दिशा-निर्देश भविष्य में बदलें तो असली फ़ाइल छेड़े बिना यहीं से नई दर लागू कर दीजिए — तुरंत हर नए एवं खुले हुए आवेदन में वही नई दर से गणना होगी। मूल गाइडलाइन दर हमेशा साथ में दिखती रहेगी, तुलना के लिए।</div>
                <div className="btnrow" style={{ marginBottom: '12px' }}>
                  <button className="btn water sm">दर तालिका डाउनलोड (.xlsx)</button>
                  <label className="btn water sm" style={{ cursor: 'pointer', margin: '0' }}>Excel से दरें अपडेट करें<input type="file" accept=".xlsx" hidden /></label>
                  <button className="btn ghost sm">तालिका में किए बदलाव सहेजें</button>
                  <button className="btn danger sm">सभी को मूल दर पर लौटाएँ</button>
                  <span className="hint" id="rateMsg" style={{ marginLeft: 'auto' }}></span>
                </div>
                <div id="rateOverrideCount" className="hint" style={{ marginBottom: '8px' }}></div>
                <div style={{ overflowX: 'auto' }}><table className="dt" id="rateTable"></table></div>

                <h3 className="subh">कंपनी दर मार्कअप — गाइडलाइन दर से कितना % ऊपर <span className="en">Company Rate Markup</span></h3>
                <div className="flag info">यह वही प्रतिशत है जिससे गाइडलाइन दर पर <b>कंपनी की वास्तविक बिल राशि</b> बनती है (कंपनी बिल, नीली मुहर, नकद रसीद — सभी जगह)। गाइडलाइन दर ऊपर बदलें या यहाँ का % — दोनों स्वतंत्र हैं; % बदलने पर गाइडलाइन दर पर कोई असर नहीं पड़ेगा, केवल कंपनी की दर ऊपर/नीचे होगी।</div>
                <div className="btnrow" style={{ marginBottom: '10px' }}>
                  <button className="btn water sm">मार्कअप % सहेजें</button>
                  <button className="btn danger sm">सभी को मूल % पर लौटाएँ</button>
                  <span className="hint" id="markupMsg" style={{ marginLeft: 'auto' }}></span>
                </div>
                <div style={{ overflowX: 'auto' }}><table className="dt" id="markupTable"></table></div>
              </div>
            </div>
          </section>
        )}

        <div className="ledger">
          <div className="row">
            <div className="amt"><span className="k">कुल परियोजना लागत</span><span className="v mono" id="L_cost">₹0</span></div>
            <div className="amt big"><span className="k">देय अनुदान</span><span className="v mono" id="L_sub">₹0</span></div>
            <div className="amt far"><span className="k">कृषक अंश</span><span className="v mono" id="L_far">₹0</span></div>
            <div className="amt"><span className="k">दर</span><span className="v mono" id="L_pct">—</span></div>
            <div className="amt"><span className="k">कुल क्षेत्र</span><span className="v mono" id="L_area">0 हे०</span></div>
            <div style={{ flex: '1' }}></div>
            <div className="btnrow">
              <button className="btn ghost sm" id="btnSave">अभी सहेजें</button><span className="savemsg" id="saveMsg"></span>
              <button className="btn water sm" id="btnPrint2">वर्तमान प्रपत्र प्रिंट</button>
              <button className="btn water sm" id="btnPrintAll">सभी 6 प्रपत्र प्रिंट</button>
            </div>
          </div>
          <div className="bar"><span id="B_goi" style={{ background: '#2f9aa3' }}></span><span id="B_st" style={{ background: '#5cc4cb' }}></span><span id="B_tp" style={{ background: '#a9e4e8' }}></span><span id="B_fr" style={{ background: '#f0c46a' }}></span></div>
          <div className="legend">
            <span><i style={{ background: '#2f9aa3' }}></i>भा०स० अंश <b className="mono" id="L_goi">₹0</b></span>
            <span><i style={{ background: '#5cc4cb' }}></i>राज्यांश <b className="mono" id="L_st">₹0</b></span>
            <span><i style={{ background: '#a9e4e8' }}></i>राज्य टॉप-अप 25% <b className="mono" id="L_tp">₹0</b></span>
            <span><i style={{ background: '#f0c46a' }}></i>कृषक अंश</span>
          </div>
        </div>
      </div>

      <datalist id="dlRel">
        <option value="पिता" />
        <option value="माता" />
        <option value="भाई" />
        <option value="बहन" />
        <option value="पुत्र" />
        <option value="पुत्री" />
        <option value="पति" />
        <option value="पत्नी" />
        <option value="चाचा" />
        <option value="ताऊ" />
      </datalist>
      <datalist id="dlCrop"></datalist>
      <div id="printArea" aria-label="प्रिंट पूर्वावलोकन"></div>
    </div>
  );
};

export default PMKSY;