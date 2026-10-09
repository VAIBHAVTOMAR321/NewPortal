import React, { useEffect, useRef, useState } from 'react';
import './PMKSY.css';

const FEEDBACK_KEY = 'pmksy:feedback:v1';
const FEEDBACK_WHERE = [
  'चरण 01 — आवेदन प्रपत्र',
  'चरण 01 — भूमि विवरण / मिलान',
  'चरण 01 — प्रणाली पंक्ति एवं अनुदान',
  'चरण 02 — शपथ पत्र',
  'चरण 03 — फर्म चयन',
  'चरण 04 — भौतिक सत्यापन',
  'चरण 05 — कंपनी बिल / BoQ',
  'किसान रजिस्टर / सहेजना',
  'प्रिंट एवं छपाई',
  'दरें / गणना सही नहीं',
  'केंद्र–विकासखंड सूची',
  'अन्य / पूरी प्रणाली',
];
const FEEDBACK_KINDS = ['गड़बड़ी है', 'ऐसा बदलो', 'नया चाहिए'];
const SAMPLE_INVOICE_ITEMS = [
  ['Screen Filter 10 m3/hr / Disc Filter', 'IS 12785:1994', '1', 'Nos', '3,580'],
  ['Venturi & Manifold (1.5 in)', 'IS 14483 (Part 1):1997', '1', 'Nos', '1,718'],
  ['Air Release Valve 1 in', 'Mfr. Assured Quality (Para 15.7)', '1', 'Nos', '430'],
  ['Non Return Valve 1.5 in', 'Mfr. Assured Quality (Para 15.7)', '1', 'Nos', '573'],
  ['By-Pass Assembly 1.5x1.5 in', 'Mfr. Assured Quality (Para 15.7)', '1', 'Nos', '716'],
  ['HDPE Pipe 50 mm; 4 kg/cm2', 'IS 4984:2016', '54', 'Meter', '115'],
  ['Lateral 12 mm, Class II; 2.5 kg/cm2', 'IS 12786:1989', '1010', 'Meter', '11'],
  ['Pressure Regulating Emitter/Dripper 2/4/8 lph', 'IS 13487:1992', '1020', 'Nos', '3'],
  ['Control Valve 50 mm', 'IS 18286:2023', '1', 'Nos', '573'],
  ['Control Valve 63 mm', 'IS 18286:2023', '1', 'Nos', '859'],
  ['Flush Valve 50 mm', 'IS 18286:2023', '2', 'Nos', '501'],
  ['Throttle Valve 1.5 in', 'IS 18286:2023', '1', 'Nos', '644'],
];
const SAMPLE_INVOICE_GRAND = 32308;
const sampleInvoiceRate = (rate) => (
  Number(String(rate).replace(/,/g, '')) * (SAMPLE_INVOICE_GRAND / (30475 + 1523.75))
);
const sampleInvoiceLineTotal = (item) => (
  Number(item[2]) * Number(sampleInvoiceRate(item[4]).toFixed(2))
);
const sampleInvoiceSubtotal = SAMPLE_INVOICE_ITEMS.reduce((sum, item) => sum + sampleInvoiceLineTotal(item), 0);
const sampleInvoiceCurrency = (amount) => amount.toLocaleString('en-IN', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});
const SAMPLE_PRINT_DOCUMENTS = [
  {
    title: 'सूक्ष्म सिंचाई — आवेदन-सह-संयुक्त सर्वेक्षण प्रपत्र',
    sections: [
      { title: 'क — क्षेत्र विवरण', fields: [['जनपद', 'पौड़ी गढ़वाल'], ['उद्यान सचल दल केंद्र', 'कोटद्वार'], ['विकासखंड', 'नगर निगम कोटद्वार'], ['विधान सभा', 'कोटद्वार'], ['ग्राम पंचायत', 'कोटद्वार'], ['ग्राम', 'शिबूनगर']] },
      { title: 'ख — किसान एवं बैंक विवरण (DBT हेतु)', fields: [['किसान का नाम', 'श्री सुरेश सिंह'], ['पिता का नाम', 'पुत्र श्री मोहन सिंह'], ['लिंग / सामाजिक श्रेणी', 'पुरुष / सामान्य'], ['मोबाइल', '9876543210'], ['आधार संख्या', 'XXXX-XXXX-1234'], ['बैंक खाता सं०', '123456789012'], ['बैंक एवं शाखा', 'भारतीय स्टेट बैंक — कोटद्वार शाखा'], ['IFSC', 'SBIN0001234'], ['उद्यान कार्ड सं०', 'HK-2026-00125']] },
      { title: 'ग — भूमि एवं प्रस्तावित प्रणाली', fields: [['खाता / खसरा सं०', '00056 / 125/2'], ['भूमि क्षेत्रफल', '0.20 हे०'], ['जल स्रोत / भूमि प्रकृति', 'निजी भूमि / समतल'], ['प्रस्तावित प्रणाली', 'ड्रिप — सेब — 2×2 m'], ['प्रस्तावित क्षेत्र', '0.20 हे०']] },
      { title: 'घ — फर्म एवं वित्तीय विवरण', fields: [['अधिकृत फर्म', 'Avani Enterprises'], ['पंजीकरण सं०', 'UK-PDMC-AVANI-2026'], ['अनुमानित इकाई लागत', '₹29,915'], ['आवेदन दिनांक', '10-09-2026']] },
    ],
    footer: 'लाभार्थी के हस्ताक्षर ____________________    अधिकृत अधिकारी ____________________',
  },
  {
    title: 'आवेदन · पृष्ठ 2 / 2',
    sections: [
      { title: 'ङ — लाभार्थी की घोषणा', paragraphs: ['मैं, श्री सुरेश सिंह, सत्यनिष्ठा से घोषित करता हूँ कि इस प्रपत्र में दी गई समस्त सूचनाएँ पूर्णतः सत्य एवं सही हैं। मैं योजना के दिशा-निर्देशों के अनुसार अपने प्रक्षेत्र में सूक्ष्म सिंचाई प्रणाली स्थापित कराने हेतु सहमत हूँ तथा उसके रख-रखाव एवं सुचारु संचालन की पूर्ण जिम्मेदारी लेता हूँ। मैं स्वीकृत अनुदान DBT के माध्यम से सीधे अपने आधार-लिंक बैंक खाते में प्राप्त करने हेतु सहमत हूँ। मैंने विगत 07 वर्षों में इस भूमि खंड पर सूक्ष्म सिंचाई हेतु किसी भी सरकारी योजना से अनुदान प्राप्त नहीं किया है।'], fields: [['नाम', 'श्री सुरेश सिंह'], ['दिनांक', '10-09-2026']] },
      { title: 'भाग – 2 : संयुक्त सर्वेक्षण के समय भरा जाने वाला विवरण', fields: [['अक्षांश / देशांतर', '29.750000 / 78.525000'], ['कृषि मैपर एप ID', 'PMKSY-DEMO-APPLE-0001'], ['भूमि की प्रकृति', 'समतल'], ['जल स्रोत की दूरी / ऊँचाई अंतर', '80 मी० / 12 मी०'], ['जल गुणवत्ता / पंप', 'अच्छी / सबमर्सिबल'], ['पंप क्षमता', '2 HP']] },
      { title: 'छ — प्रस्तावित प्रणाली एवं अनुदान की गणना', table: { headings: ['क्र.', 'प्रणाली', 'फसल', 'स्पेसिंग', 'क्षेत्र (हे०)', 'इकाई लागत (₹)', 'दर', 'अनुदान (₹)', 'कृषक अंश (₹)'], rows: [['1', 'ड्रिप', 'सेब', '2×2 m', '0.20', '29,915', '80%', '23,932', '5,983'], ['', '', '', 'योग', '0.20', '29,915', '80%', '23,932', '5,983']] } },
      { title: 'ज — पात्रता एवं स्थल परीक्षण जाँच सूची', fields: [['पूर्व अनुदान नहीं', '☑ हाँ'], ['निर्धारित क्षेत्र में स्थापना', '☑ हाँ'], ['सिंचाई जल स्रोत उपलब्ध', '☑ हाँ'], ['लाभार्थी दस्तावेज़ सत्यापित', '☑ हाँ']] },
      { title: 'झ — प्रमाणीकरण एवं संस्तुति', paragraphs: ['प्रमाणित किया जाता है कि उपरोक्त प्रक्षेत्र का संयुक्त रूप से स्थलीय निरीक्षण किया गया, अभिलेखों का परीक्षण किया गया तथा लाभार्थी दिशा-निर्देशों के अनुसार पात्र पाया गया। प्रकरण संस्तुत किया जाता है।'], fields: [['संस्तुति / टिप्पणी', '0.20 हे० क्षेत्र हेतु ड्रिप प्रणाली की स्थापना संस्तुत। कुल लागत ₹29,915, देय अनुदान ₹23,932, कृषक अंश ₹5,983।']] },
    ],
    footer: 'फर्म प्रतिनिधि ____________________    प्रभारी, उद्यान सचल दल केंद्र ____________________',
  },
  {
    title: 'लाभार्थी स्व-घोषणा एवं शपथ पत्र',
    sections: [
      { title: 'लाभार्थी का विवरण', fields: [['नाम', 'श्री सुरेश सिंह'], ['पिता का नाम', 'श्री मोहन सिंह'], ['ग्राम / विकासखंड', 'शिबूनगर / नगर निगम कोटद्वार'], ['भूमि खाता / खसरा', '00056 / 125/2'], ['कुल क्षेत्र', '0.20 हे०']] },
      { title: 'घोषणा', paragraphs: ['मैं सत्यनिष्ठा से घोषणा करता हूँ कि मैंने अपनी 0.20 हेक्टेयर कृषि भूमि पर PMKSY-PDMC के अंतर्गत 0.20 हेक्टेयर क्षेत्र में ड्रिप सिंचाई प्रणाली (सेब, 2×2 m) स्थापित कराई है।', 'मैंने विगत सात वर्षों में इस भू-खंड पर सूक्ष्म सिंचाई हेतु केंद्र अथवा राज्य सरकार की किसी योजना से दोहरा अनुदान प्राप्त नहीं किया है। प्रणाली के रख-रखाव एवं सुरक्षा की जिम्मेदारी मेरी होगी तथा विभागीय भौतिक सत्यापन एवं जियो-टैगिंग के लिए मेरी सहमति है।', 'मैं प्रमाणित करता हूँ कि इस शपथ पत्र में दी गई जानकारी मेरे ज्ञान एवं विश्वास के अनुसार सत्य है। गलत जानकारी पाए जाने पर नियमानुसार कार्यवाही एवं अनुदान राशि की वसूली स्वीकार होगी।'], fields: [['स्वीकृत प्रणाली', 'ड्रिप — सेब'], ['क्षेत्रफल', '0.20 हे०'], ['स्थान / दिनांक', 'कोटद्वार / 10-09-2026'], ['शपथ आयुक्त', 'शपथ आयुक्त, कोटद्वार']] },
    ],
    footer: 'लाभार्थी के हस्ताक्षर ____________________    शपथ आयुक्त की मुहर ____________________',
  },
  {
    title: 'फर्म सहमति एवं स्थापना प्रमाण-पत्र',
    sections: [
      { title: 'लाभार्थी एवं फर्म', fields: [['लाभार्थी', 'श्री सुरेश सिंह'], ['फर्म', 'Avani Enterprises'], ['फर्म पंजीकरण', 'UK-PDMC-AVANI-2026'], ['GSTIN', '05COWPD8094K1Z6'], ['मोबाइल', '9536462212'], ['स्थापना स्थल', 'ग्राम शिबूनगर, कोटद्वार, पौड़ी गढ़वाल']] },
      { title: 'स्थापित प्रणाली का विवरण', fields: [['प्रणाली / फसल', 'ड्रिप / सेब'], ['स्पेसिंग', '2×2 m'], ['स्थापित क्षेत्र', '0.20 हे०'], ['स्थापना दिनांक', '18-09-2026'], ['वारंटी अवधि', '1 वर्ष']] },
      { title: 'फर्म का प्रमाणन', paragraphs: ['प्रमाणित किया जाता है कि उपर्युक्त लाभार्थी के खेत में उल्लिखित सूक्ष्म सिंचाई प्रणाली निर्धारित तकनीकी मानकों के अनुसार स्थापित की गई है। प्रणाली की जानकारी एवं स्थापना विवरण सही हैं।'] },
    ],
    footer: 'लाभार्थी के हस्ताक्षर ____________________    फर्म प्रतिनिधि एवं मुहर ____________________',
  },
  {
    title: 'कंपनी बिल / Tax Invoice एवं BoQ',
    sections: [
      { title: 'बिल विवरण', fields: [['फर्म', 'Avani Enterprises'], ['GSTIN', '05COWPD8094K1Z6'], ['बिल संख्या', 'DEMO-APPLE-0001'], ['बिल दिनांक', '20-09-2026'], ['लाभार्थी', 'श्री सुरेश सिंह'], ['स्थापना दिनांक', '18-09-2026']] },
      { title: 'BoQ — ड्रिप प्रणाली (सेब, 2×2 m, 0.20 हे०)', table: { headings: ['क्र.', 'विवरण', 'क्षेत्र / राशि (₹)'], rows: [['1', 'कुल गाइडलाइन लागत', '0.20 हे० / 29,915'], ['2', 'कंपनी बिल राशि (मार्कअप सहित)', '32,308']] } },
      { title: 'भुगतान एवं प्रमाणन', fields: [['कुल बिल राशि', '₹32,308'], ['GST', 'कुल राशि में अलग से देय नहीं'], ['भुगतान स्थिति', 'लाभार्थी द्वारा भुगतान प्राप्त']] },
    ],
    footer: 'लाभार्थी के हस्ताक्षर ____________________    अधिकृत फर्म प्रतिनिधि ____________________',
  },
  {
    title: 'नकद प्राप्ति रसीद',
    sections: [
      { title: 'रसीद विवरण', fields: [['रसीद संख्या', '001'], ['रसीद दिनांक', '20-09-2026'], ['प्राप्तकर्ता फर्म', 'Avani Enterprises'], ['लाभार्थी का नाम', 'श्री सुरेश सिंह'], ['ग्राम', 'शिबूनगर, कोटद्वार'], ['कार्य', 'ड्रिप सिंचाई प्रणाली — सेब — 0.20 हे०']] },
      { title: 'प्राप्त धनराशि', table: { headings: ['विवरण', 'राशि (₹)'], rows: [['ड्रिप प्रणाली एवं स्थापना — बिल DEMO-APPLE-0001', '32,308'], ['कुल प्राप्त राशि', '32,308']] }, paragraphs: ['रुपये बत्तीस हजार तीन सौ आठ मात्र। उपर्युक्त राशि लाभार्थी से प्राप्त हुई।'] },
    ],
    footer: 'लाभार्थी के हस्ताक्षर ____________________    प्राप्तकर्ता के हस्ताक्षर एवं मुहर ____________________',
  },
  {
    title: 'भौतिक सत्यापन एवं स्थापना निरीक्षण रिपोर्ट',
    sections: [
      { title: 'निरीक्षण विवरण', fields: [['निरीक्षण दिनांक', '19-09-2026'], ['लाभार्थी', 'श्री सुरेश सिंह'], ['ग्राम / केंद्र', 'शिबूनगर / कोटद्वार'], ['जियो-टैग / QR', 'PMKSY-DEMO-APPLE-0001'], ['निरीक्षण अधिकारी', 'श्री अनिल कुमार, प्रभारी']] },
      { title: 'स्थापित प्रणाली का सत्यापन', fields: [['प्रणाली / फसल', 'ड्रिप / सेब'], ['स्पेसिंग / क्षेत्रफल', '2×2 m / 0.20 हे०'], ['फिल्टर / फर्टिगेशन', 'स्क्रीन फिल्टर / वेंचुरी'], ['प्रणाली परीक्षण', 'सफल'], ['स्थल परिणाम', 'सन्तोषजनक']] },
      { title: 'निरीक्षण टिप्पणी', paragraphs: ['स्थल निरीक्षण एवं अभिलेखों के आधार पर प्रणाली स्थापित पाई गई। उपलब्ध दस्तावेज़ों, क्षेत्रफल, बिल एवं स्थापना विवरण का परीक्षण किया गया। प्रकरण संस्तुति योग्य है।'] },
    ],
    footer: 'लाभार्थी के हस्ताक्षर ____________________    निरीक्षण अधिकारी के हस्ताक्षर ____________________',
  },
];

function loadFeedbackNotes() {
  if (typeof window === 'undefined') return { notes: [], error: '' };

  try {
    const stored = window.localStorage.getItem(FEEDBACK_KEY);
    if (!stored) return { notes: [], error: '' };

    const notes = JSON.parse(stored).notes;
    if (!Array.isArray(notes)) throw new Error('सहेजे गए सुझावों का प्रारूप सही नहीं है।');
    return {
      notes: notes.map((note, index) => {
        if (!note || typeof note !== 'object' || typeof note.text !== 'string') {
          throw new Error('सहेजे गए सुझावों का प्रारूप सही नहीं है।');
        }
        return {
          ...note,
          id: note.id ?? `legacy-${index}`,
          time: note.time ?? note.t ?? '',
          where: note.where ?? 'अन्य / पूरी प्रणाली',
          kind: note.kind ?? FEEDBACK_KINDS[1],
          step: note.step ?? '',
        };
      }),
      error: '',
    };
  } catch (error) {
    return {
      notes: [],
      error: `सहेजे गए सुझाव पढ़े नहीं जा सके: ${error.message}`,
    };
  }
}

const PMKSY = () => {
  const [activeStep, setActiveStep] = useState(1);
  const [showFirmPanel, setShowFirmPanel] = useState(false);
  const [showOfficePanel, setShowOfficePanel] = useState(false);
  const [showAllRecPanel, setShowAllRecPanel] = useState(false);
  const [samplePrintReady, setSamplePrintReady] = useState(false);
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [feedbackTab, setFeedbackTab] = useState('w');
  const [feedbackWhere, setFeedbackWhere] = useState(FEEDBACK_WHERE[0]);
  const [feedbackKind, setFeedbackKind] = useState(FEEDBACK_KINDS[1]);
  const [feedbackText, setFeedbackText] = useState('');
  const [feedbackLog, setFeedbackLog] = useState([]);
  const [feedbackLoaded] = useState(loadFeedbackNotes);
  const [feedbackNotes, setFeedbackNotes] = useState(feedbackLoaded.notes);
  const [feedbackMessage, setFeedbackMessage] = useState(feedbackLoaded.error);
  const feedbackTextRef = useRef(null);
  const feedbackPanelRef = useRef(null);

  useEffect(() => {
    if (!samplePrintReady) return undefined;

    const printTimer = window.setTimeout(() => window.print(), 350);
    const handleAfterPrint = () => setSamplePrintReady(false);
    window.addEventListener('afterprint', handleAfterPrint);
    return () => {
      window.clearTimeout(printTimer);
      window.removeEventListener('afterprint', handleAfterPrint);
    };
  }, [samplePrintReady]);

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
  const genderOpts = ["पुरुष", "महिला", "अन्य"];
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

  const logFeedbackEvent = (kind, message) => {
    setFeedbackLog((entries) => [
      ...entries,
      { id: `${Date.now()}-${entries.length}`, time: new Date().toLocaleString('hi-IN'), kind, message },
    ]);
  };

  const closeFeedback = () => setFeedbackOpen(false);

  useEffect(() => {
    if (!feedbackOpen) return undefined;

    if (feedbackTab === 'w') feedbackTextRef.current?.focus();
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') setFeedbackOpen(false);
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [feedbackOpen, feedbackTab]);

  const persistFeedbackNotes = (notes) => {
    try {
      window.localStorage.setItem(FEEDBACK_KEY, JSON.stringify({ notes }));
      setFeedbackNotes(notes);
      return true;
    } catch (error) {
      setFeedbackMessage(`सुझाव सहेजे नहीं जा सके: ${error.message}`);
      return false;
    }
  };

  const addFeedbackNote = () => {
    const text = feedbackText.trim();
    if (!text) {
      setFeedbackMessage('पहले कुछ लिखें।');
      feedbackTextRef.current?.focus();
      return;
    }

    const note = {
      id: `${Date.now()}-${feedbackNotes.length}`,
      time: new Date().toLocaleString('hi-IN'),
      where: feedbackWhere,
      kind: feedbackKind,
      text,
      step: steps.find((step) => step.id === activeStep)?.nm ?? '',
    };
    const notes = [...feedbackNotes, note];
    if (!persistFeedbackNotes(notes)) return;

    setFeedbackText('');
    setFeedbackMessage(`जुड़ गया (${notes.length})`);
    logFeedbackEvent('नोट', `${note.kind} — ${note.where}`);
  };

  const deleteFeedbackNote = (noteId) => {
    const notes = feedbackNotes.filter((note) => note.id !== noteId);
    if (!persistFeedbackNotes(notes)) return;
    setFeedbackMessage('सुझाव हटाया गया।');
    logFeedbackEvent('नोट', 'सहेजा गया सुझाव हटाया');
  };

  const createFeedbackReport = () => {
    const lines = [
      'PMKSY–PDMC · अनुभव रिपोर्ट',
      `तैयार किया गया: ${new Date().toLocaleString('hi-IN')}`,
      '',
      `── सुझाव (${feedbackNotes.length}) ──`,
      ...(feedbackNotes.length
        ? feedbackNotes.flatMap((note, index) => [
            `${index + 1}. [${note.kind}] ${note.where}`,
            `   ${note.text.replace(/\n/g, '\n   ')}`,
            `   (समय ${note.time}${note.step ? ` · चरण ${note.step}` : ''})`,
          ])
        : ['(कोई सुझाव नहीं लिखा गया)']),
      '',
      '── कार्य डायरी ──',
      ...(feedbackLog.length
        ? feedbackLog.map((entry) => `${entry.time}  [${entry.kind}]  ${entry.message}`)
        : ['(अभी कोई गतिविधि दर्ज नहीं है)']),
    ];
    return lines.join('\n');
  };

  const copyFeedbackReport = async () => {
    try {
      await navigator.clipboard.writeText(createFeedbackReport());
      setFeedbackMessage('कॉपी हो गया — चैट में चिपकाएँ।');
    } catch (error) {
      setFeedbackMessage(`रिपोर्ट कॉपी नहीं हो सकी: ${error.message}`);
    }
  };

  const saveFeedbackReport = () => {
    try {
      const blob = new Blob([`\ufeff${createFeedbackReport()}`], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'PMKSY_अनुभव_रिपोर्ट.txt';
      link.click();
      window.setTimeout(() => URL.revokeObjectURL(url), 1500);
      setFeedbackMessage('फाइल बन गई।');
    } catch (error) {
      setFeedbackMessage(`रिपोर्ट फाइल नहीं बन सकी: ${error.message}`);
    }
  };

  return (
    <>
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
          <div className="btnrow">
            <button className="btn ghost sm" type="button" onClick={() => setShowFirmPanel(true)}>फर्म जोड़ें/हटाएँ</button>
            <button className="btn ghost sm" type="button" onClick={() => setShowAllRecPanel(true)}>सभी फर्मों का रिकॉर्ड</button>
            <button className="btn ghost sm" type="button" onClick={() => setShowOfficePanel(true)}>कार्यालय सेटिंग</button>
          </div>
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

      <button
        className="feedback-button"
        type="button"
        title="सुझाव लिखें / रिपोर्ट बनाएँ"
        aria-expanded={feedbackOpen}
        aria-controls="feedbackPanel"
        onClick={() => {
          setFeedbackOpen((open) => !open);
          if (!feedbackOpen) {
            setFeedbackTab('w');
            logFeedbackEvent('नोट', 'सुझाव पैनल खोला');
          }
        }}
      >
        ✎ सुझाव{feedbackNotes.length > 0 && <span className="feedback-dot">{feedbackNotes.length}</span>}
      </button>
      <div
        className={`feedback-panel${feedbackOpen ? ' on' : ''}`}
        id="feedbackPanel"
        ref={feedbackPanelRef}
        role="dialog"
        aria-label="सुझाव एवं रिपोर्ट"
        aria-modal="false"
        aria-hidden={!feedbackOpen}
      >
        <h3>
          अनुभव रिपोर्ट
          <span className="feedback-subtitle">सब कुछ इसी फाइल में — कहीं नहीं भेजा जाता</span>
          <button type="button" onClick={closeFeedback} aria-label="बंद करें">×</button>
        </h3>
        <div className="feedback-tabs" role="tablist" aria-label="अनुभव रिपोर्ट">
          {[
            { id: 'w', label: 'सुझाव लिखें' },
            { id: 'l', label: 'मेरे सुझाव', count: feedbackNotes.length },
            { id: 'd', label: 'कार्य डायरी' },
          ].map((tab) => (
            <button
              className="feedback-tab"
              id={`feedback-tab-${tab.id}`}
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={feedbackTab === tab.id}
              aria-controls={`feedback-content-${tab.id}`}
              onClick={() => {
                setFeedbackTab(tab.id);
                setFeedbackMessage('');
              }}
            >
              {tab.label}{tab.count > 0 && <span className="feedback-count">{tab.count}</span>}
            </button>
          ))}
        </div>

        <div
          className="feedback-content"
          id="feedback-content-w"
          role="tabpanel"
          aria-labelledby="feedback-tab-w"
          hidden={feedbackTab !== 'w'}
        >
          <div className="f feedback-field">
            <label htmlFor="feedbackWhere">यह किस बारे में है?</label>
            <select id="feedbackWhere" value={feedbackWhere} onChange={(event) => setFeedbackWhere(event.target.value)}>
              {FEEDBACK_WHERE.map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
          </div>
          <div className="f feedback-field">
            <label>किस तरह की बात है?</label>
            <div className="chips feedback-kinds">
              {FEEDBACK_KINDS.map((kind, index) => (
                <React.Fragment key={kind}>
                  <input
                    type="radio"
                    name="feedbackKind"
                    id={`feedback-kind-${index}`}
                    value={kind}
                    checked={feedbackKind === kind}
                    onChange={() => setFeedbackKind(kind)}
                  />
                  <label htmlFor={`feedback-kind-${index}`}>{kind}</label>
                </React.Fragment>
              ))}
            </div>
          </div>
          <div className="f">
            <label htmlFor="feedbackText">क्या ठीक करना है — अपने शब्दों में लिखें</label>
            <textarea
              id="feedbackText"
              ref={feedbackTextRef}
              rows="5"
              placeholder="जैसे: भूमि तालिका में ग्राम का खाना छोटा है, या — बिल में GST अपने आप 18% रहे"
              value={feedbackText}
              onChange={(event) => setFeedbackText(event.target.value)}
            />
          </div>
          <div className="hint feedback-hint">लिखते समय आप जिस चरण पर हैं, वह अपने आप जुड़ जाएगा — दोबारा समझाना नहीं पड़ेगा।</div>
        </div>

        <div
          className="feedback-content feedback-list"
          id="feedback-content-l"
          role="tabpanel"
          aria-labelledby="feedback-tab-l"
          hidden={feedbackTab !== 'l'}
        >
          {feedbackNotes.length ? feedbackNotes.map((note) => (
            <article className={`feedback-note${note.kind === 'गड़बड़ी है' ? ' bug' : note.kind === 'नया चाहिए' ? ' idea' : ''}`} key={note.id}>
              <div>{note.text}</div>
              <div className="feedback-note-meta">
                <span>{note.kind}</span>
                <span>{note.where}</span>
                <time>{note.time}</time>
                <button type="button" aria-label="सुझाव हटाएँ" onClick={() => deleteFeedbackNote(note.id)}>×</button>
              </div>
            </article>
          )) : (
            <div className="empty">अभी कोई सुझाव नहीं लिखा। बाईं ओर "सुझाव लिखें" में लिखें।</div>
          )}
        </div>

        <div
          className="feedback-content feedback-list"
          id="feedback-content-d"
          role="tabpanel"
          aria-labelledby="feedback-tab-d"
          hidden={feedbackTab !== 'd'}
        >
          {feedbackLog.length ? feedbackLog.map((entry) => (
            <div className="feedback-logline" key={entry.id}>
              <span className={`feedback-log-kind kind-${entry.kind}`}>{entry.kind}</span>
              <time>{entry.time}</time>
              <span>{entry.message}</span>
            </div>
          )) : <div className="empty">अभी कोई गतिविधि दर्ज नहीं है।</div>}
        </div>

        <div className="feedback-footer">
          <div className="btnrow">
            <button className="btn water sm" type="button" onClick={addFeedbackNote} disabled={feedbackTab !== 'w'}>सुझाव जोड़ें</button>
            <button className="btn ghost sm" type="button" onClick={copyFeedbackReport}>पूरी रिपोर्ट कॉपी करें</button>
            <button className="btn ghost sm" type="button" onClick={saveFeedbackReport}>फाइल में सहेजें</button>
            <span className="hint feedback-message" role="status">{feedbackMessage}</span>
          </div>
        </div>
      </div>

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
              onClick={() => {
                setActiveStep(step.id);
                logFeedbackEvent('चरण', `खोला — ${step.no} ${step.nm}`);
              }}
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
                  <button className="btn ghost sm" type="button" onClick={() => setSamplePrintReady(true)}>🖨️ Sample के सभी 6 प्रपत्र प्रिंट</button>
                  <span className="hint">Apple · Drip · 2×2 m · 0.20 हे० — सभी 6 प्रपत्रों की testing के लिए demo data भरेगा; रजिस्टर में save नहीं होगा।</span>
                </div>
                <div className="grid">
                  <div className="f"><label><span className="n">1</span>किसान का नाम</label><input list="dlF" autoComplete="off" placeholder="नाम लिखें" /><datalist id="dlF"></datalist><div className="hint">पुराना किसान हो तो पूरा रिकॉर्ड अपने आप भर जाएगा</div></div>
                  <div className="f"><label><span className="n">2</span>पिता / पति का नाम</label><input id="rel" /></div>
                  <div className="f"><label><span className="n">3</span>लिंग</label>
                    <select id="gender">
                      <option value="">चुनें</option>
                      {genderOpts.map(g => <option key={g} value={g}>{g}</option>)}
                    </select>
                  </div>
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
            <div className="btnrow">
              <button className="btn ghost sm" id="btnSave">अभी सहेजें</button><span className="savemsg" id="saveMsg"></span>
              <button className="btn water sm" id="btnPrint2">वर्तमान प्रपत्र प्रिंट</button>
              <button className="btn water sm" id="btnPrintAll">सभी 6 प्रपत्र प्रिंट</button>
                <div className="amt-group">
              <div className="amt big"><span className="k">देय अनुदान</span><span className="v mono" id="L_sub">₹0</span></div>
              <div className="amt far"><span className="k">कृषक अंश</span><span className="v mono" id="L_far">₹0</span></div>
              <div className="amt"><span className="k">दर</span><span className="v mono" id="L_pct">—</span></div>
              <div className="amt"><span className="k">कुल क्षेत्र</span><span className="v mono" id="L_area">0 हे०</span></div>
            </div>
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
    </div>
      <div id="printArea" aria-label="प्रिंट पूर्वावलोकन">
        {samplePrintReady && SAMPLE_PRINT_DOCUMENTS.map((document, index) => (
          <article className={`sheet${index === 1 ? ' application-page' : ''}${index === 4 ? ' pmksy-company-bill avani-pdf-invoice' : ''}`} key={document.title}>
            {(index === 0 || index === 6) && (
              <header className="hdr">
                <div className="t1">प्रधानमंत्री कृषि सिंचाई योजना (PMKSY) — प्रति बूँद अधिक फसल (PDMC)</div>
                <div className="t2">उद्यान एवं खाद्य प्रसंस्करण विभाग, उत्तराखण्ड</div>
                <div className="t2">कार्यालय उद्यान विशेषज्ञ, कोटद्वार, पौड़ी गढ़वाल, उत्तराखण्ड</div>
              </header>
            )}
            {index === 0 && (
              <>
                <div className="application-title">सूक्ष्म सिंचाई — आवेदन-सह-संयुक्त सर्वेक्षण प्रपत्र</div>
                <div className="photobox">पासपोर्ट साइज़<br />फोटो चिपकाएँ</div>
                <h3 className="part">भाग – 1 : लाभार्थी द्वारा भरा जाने वाला विवरण</h3>
              </>
            )}
            {index === 1 && <h3 className="part">भाग – 2 : संयुक्त सर्वेक्षण के समय भरा जाने वाला विवरण</h3>}
            {(index === 2 || index === 3) && (
              <>
                <div className="document-spacer"></div>
                <div className="document-title">{document.title === 'लाभार्थी स्व-घोषणा एवं शपथ पत्र' ? 'लाभार्थी स्व-घोषणा एवं शपथ पत्र (Affidavit / Self-Declaration)' : 'आपूर्तिकर्ता फर्म चयन एवं स्वैच्छिक सहमति पत्र'}</div>
              </>
            )}
            {index === 4 && (
              <>
                <table className="avani-head">
                  <tbody>
                    <tr className="head-row"><td>GSTIN No.: 05COWPD8094K1Z6</td><td className="invoice-title">TAX INVOICE / BILL</td><td className="right">Mob.: 9536462212</td></tr>
                    <tr><td className="company-name" colSpan="3">AVANI ENTERPRISES</td></tr>
                    <tr><td className="dealer-name" colSpan="3">Authorised Dealer — भारत ड्रिप इरिगेशन एंड एग्रो</td></tr>
                    <tr><td className="company-address" colSpan="3">Lakhera Bhawan, Vill. Shibonagar, Near Nayan Gaon, Kotdwar, Garhwal (Uttarakhand) - 246155</td></tr>
                  </tbody>
                </table>
                <table className="avani-billing">
                  <tbody>
                    <tr className="section-blue"><td colSpan="3">BILL TO / FARMER DETAILS</td><td colSpan="3">INVOICE DETAILS</td></tr>
                    <tr><td className="lbl">Farmer / M/s Name:</td><td colSpan="2">श्री सुरेश सिंह</td><td className="lbl">Invoice No.:</td><td colSpan="2"><b>DEMO-APPLE-0001</b></td></tr>
                    <tr><td className="lbl">Village / Centre:</td><td colSpan="2">शिबूनगर / कोटद्वार</td><td className="lbl">Date:</td><td colSpan="2"><b>20-09-2026</b></td></tr>
                    <tr><td className="lbl">Khasra No.:</td><td colSpan="2">—</td><td className="lbl">System Proposed:</td><td colSpan="2">ड्रिप</td></tr>
                    <tr><td className="lbl">Spacing:</td><td colSpan="2"><b>2x2</b></td><td className="lbl">Area (Hectare):</td><td colSpan="2"><b>0.20 हे०</b></td></tr>
                    <tr><td className="lbl">Crop:</td><td colSpan="2">सेब</td><td className="lbl">Date of Installation:</td><td colSpan="2"><b>18-09-2026</b></td></tr>
                    <tr><td className="lbl">Work / Reference No.:</td><td colSpan="5">PMKSY-DEMO-APPLE-0001</td></tr>
                  </tbody>
                </table>
                <table className="avani-items">
                  <colgroup><col style={{ width: '6%' }} /><col style={{ width: '28%' }} /><col style={{ width: '25%' }} /><col style={{ width: '9%' }} /><col style={{ width: '8%' }} /><col style={{ width: '11%' }} /><col style={{ width: '13%' }} /></colgroup>
                  <thead><tr className="item-head"><th>S.No</th><th>Description of Goods</th><th>BIS / Standard</th><th>Qty</th><th>Unit</th><th>Rate/Unit<br />(₹)</th><th>Taxable Value<br />(₹)</th></tr></thead>
                  <tbody>
                    {SAMPLE_INVOICE_ITEMS.map((item, itemIndex) => (
                      <tr key={item[0]}>
                        <td className="center">{itemIndex + 1}</td>
                        <td className="desc">{item[0]}</td>
                        <td className="std">{item[1]}</td>
                        <td className="center">{item[2]}</td>
                        <td className="center">{item[3]}</td>
                        <td className="num">{sampleInvoiceCurrency(Number(sampleInvoiceRate(item[4].replace(/,/g, ''))))}</td>
                        <td className="num">{sampleInvoiceCurrency(sampleInvoiceLineTotal(item))}</td>
                      </tr>
                    ))}
                    <tr className="subtotal"><td className="num" colSpan="6"><b>Sub Total</b></td><td className="num"><b>{sampleInvoiceCurrency(sampleInvoiceSubtotal)}</b></td></tr>
                    <tr><td className="num" colSpan="6">Installation / Labour Charges @ <b>5%</b></td><td className="num">{sampleInvoiceCurrency(SAMPLE_INVOICE_GRAND - sampleInvoiceSubtotal)}</td></tr>
                    <tr className="grand"><td className="num" colSpan="6"><b>GRAND TOTAL (₹)</b></td><td className="num"><b>32,308.00</b></td></tr>
                    <tr><td colSpan="2"><b>Amount in Words:</b></td><td colSpan="5">Thirty Two Thousand Three Hundred Eight Only</td></tr>
                  </tbody>
                </table>
              </>
            )}
            {index === 5 && (
              <>
                <div className="document-spacer"></div>
                <div className="sample-receipt">
                  <div className="receipt-top"><span>GSTIN : 05COWPD8094K1Z6</span><span>मो० : 9536462212</span></div>
                  <h1>नकद प्राप्ति रसीद</h1>
                  <h2>Avani Enterprises</h2>
                  <div className="receipt-center">Lakhera Bhawan, Vill. Shibonagar, Kotdwar, Garhwal (Uttarakhand)</div>
                  <div className="receipt-top receipt-date"><span>नं० 001</span><span>दिनांक 20-09-2026</span></div>
                  <p>नाम श्री/श्रीमती <b>श्री सुरेश सिंह</b> पुत्र/पति श्री <b>पुत्र श्री मोहन सिंह</b>, ग्राम <b>शिबूनगर</b>, विकासखंड <b>नगर निगम कोटद्वार</b> से <b>ड्रिप (2×2 m, 0.2 हे०)</b> की स्थापना हेतु आपूर्तिकर्ता फर्म को देय <b>पूर्ण वास्तविक बिल राशि</b> के रूप में <b>₹32,308.00</b> नकद प्राप्त किया।</p>
                  <div className="receipt-sign"><span>कुल बिल सं० DEMO-APPLE-0001 · कुल बिल राशि ₹32,308</span><span>For Avani Enterprises<br />हस्ताक्षर (Authorised Signatory)</span></div>
                </div>
              </>
            )}
            {document.sections.filter(() => index !== 4).map((section) => (
              <section className="sample-print-section" key={section.title}>
                <h4 className="sec">{section.title}</h4>
                {section.fields && (
                  <div className="fl">
                    {section.fields.map(([label, value]) => (
                      <div className="fi" key={label}>
                        <b>{label} :</b> {value}
                      </div>
                    ))}
                  </div>
                )}
                {section.table && (
                  <table className="pf">
                    <thead><tr>{section.table.headings.map((heading) => <th key={heading}>{heading}</th>)}</tr></thead>
                    <tbody>
                      {section.table.rows.map((row, rowIndex) => (
                        <tr className={rowIndex === section.table.rows.length - 1 ? 'tot' : ''} key={`${section.title}-${rowIndex}`}>{row.map((cell, cellIndex) => <td key={`${cell}-${cellIndex}`}>{cell}</td>)}</tr>
                      ))}
                    </tbody>
                  </table>
                )}
                {section.paragraphs?.map((paragraph) => <div className="box" key={paragraph}>{paragraph}</div>)}
              </section>
            ))}
            {index === 4 && (
              <>
                <div className="sample-invoice-stamps">
                  <div>PMKSY-PDMC<br />किसान का अंश<br /><b>₹5,983</b><br />श्री सुरेश सिंह<br />लाभार्थी हस्ताक्षर</div>
                  <div>कार्यालय उद्यान विशेषज्ञ<br />कोटद्वार<br />₹32,308<br />अधिकृत अधिकारी<br />हस्ताक्षर एवं मुहर</div>
                </div>
                <table className="avani-bottom">
                  <tbody>
                    <tr className="section-blue"><td colSpan="3">BANK DETAILS FOR PAYMENT</td></tr>
                    <tr><td className="bank-left"><b>Bank Name:</b> Almora Urban Co-operative Bank</td><td className="bank-mid"><b>Account Number:</b> 025110100000143</td><td className="bank-right"><b>IFSC Code:</b> AUCB0000026</td></tr>
                    <tr><td className="bank-left"><b>Account Holder:</b> M/S Avani Enterprises</td><td className="bank-mid"><b>Branch:</b> Kotdwar</td><td className="bank-right"><b>GSTIN:</b> 05COWPD8094K1Z6</td></tr>
                    <tr><td className="terms" colSpan="3"><b>Terms &amp; Conditions</b><br />1. All disputes shall be subject to Kotdwar jurisdiction.<br />2. Goods supplied as per approved BOQ / work requirement.<br />3. Quantity and rate are subject to the approved bill and applicable scheme norms.<br />4. Interest will be charged at 18% p.a. on overdue payments.</td></tr>
                    <tr><td className="customer-sign">Customer's Signature</td><td className="auth-sign" colSpan="2">For AVANI ENTERPRISES<br /><br />(Authorised Signatory)</td></tr>
                  </tbody>
                </table>
              </>
            )}
            {index === 6 && (
              <div className="sigrow">
                <div>लाभार्थी कृषक के हस्ताक्षर<br />दिनांक : ……………</div>
                <div>निरीक्षण अधिकारी<br />श्री अनिल कुमार, प्रभारी</div>
                <div>प्रभारी, उद्यान सचल दल केंद्र कोटद्वार</div>
              </div>
            )}
            <div className="pgno">
              {index === 0 ? 'आवेदन · पृष्ठ 1 / 2'
                : index === 1 ? 'आवेदन · पृष्ठ 2 / 2'
                  : index === 2 ? 'शपथ पत्र'
                    : index === 3 ? 'फर्म चयन'
                      : index === 4 ? 'कंपनी बिल'
                        : index === 5 ? 'नकद रसीद' : 'भौतिक सत्यापन'}
            </div>
          </article>
        ))}
      </div>
    </>
  );
};

export default PMKSY;