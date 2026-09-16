import React, { useEffect, useMemo, useRef, useState } from "react";

import "./MushroomForm.css";

const DB = {
  कोटद्वार: [
    {
      name: "श्री मोहन सिंह",
      vill: "रामपुर",
      mob: "7248718304",
      adh: "425772516668",
      bags: 0,
    },
    {
      name: "श्री सतीश चन्द्र",
      vill: "रामपुर",
      mob: "7983540316",
      adh: "745920167364",
      bags: 0,
    },
    {
      name: "श्री तीरथ सिंह नेगी",
      vill: "रामणी",
      mob: "8006040074",
      adh: "",
      bags: 0,
    },
    {
      name: "श्री जय सिंह",
      vill: "गोपाल सिंह",
      mob: "9719478757",
      adh: "713587557459",
      bags: 0,
    },
    {
      name: "श्री विजय पाल सिंह",
      vill: "शंकर सिंह",
      mob: "7248184990",
      adh: "740876861050",
      bags: 0,
    },
    {
      name: "श्री अभिषेक भट्ट",
      vill: "सिताबपुर",
      mob: "8800386696",
      adh: "877582562689",
      bags: 0,
    },
    {
      name: "श्री भारत सिंह",
      vill: "शिवराजपुर",
      mob: "8057831536",
      adh: "387317227430",
      bags: 0,
    },
    {
      name: "श्री हरपाल सिंह",
      vill: "शिवराजपुर",
      mob: "9927736154",
      adh: "300618746261",
      bags: 0,
    },
    {
      name: "श्री राहुल सिंह रावत",
      vill: "सिताबपुर",
      mob: "7409888690",
      adh: "221357224911",
      bags: 2000,
    },
    {
      name: "श्रीमती दीपती शर्मा",
      vill: "पदमपुर",
      mob: "7558391185",
      adh: "816613443669",
      bags: 0,
    },
  ],
  सतपुली: [
    {
      name: "श्रीमती आशा देवी",
      vill: "भल्ली",
      mob: "8433117069",
      adh: "658694592023",
      bags: 150,
    },
    {
      name: "श्री विक्रम सिंह",
      vill: "कैण्डुल",
      mob: "8091456193",
      adh: "9724962487",
      bags: 100,
    },
    {
      name: "श्री विकास चन्द्र",
      vill: "बरगड्डी",
      mob: "9368893506",
      adh: "892365819014",
      bags: 150,
    },
    {
      name: "श्री सुद्ववीर सिंह",
      vill: "बन्दूण",
      mob: "989710644",
      adh: "686760033596",
      bags: 100,
    },
    {
      name: "श्री आर०पी० भट्ट",
      vill: "सतपुली",
      mob: "9548991677",
      adh: "203745162823",
      bags: 50,
    },
    {
      name: "श्री केदार सिंह",
      vill: "बन्दूण",
      mob: "8447213731",
      adh: "906877661354",
      bags: 100,
    },
    {
      name: "श्री कुलदीप सिंह",
      vill: "खैरासैण",
      mob: "8650531126",
      adh: "626556678689",
      bags: 100,
    },
    {
      name: "श्री कन्हैया लाल",
      vill: "पटखोली",
      mob: "8958358824",
      adh: "250309042333",
      bags: 50,
    },
  ],
  किनगोड़िखाल: [
    {
      name: "श्री सुरज सिंह",
      vill: "बिरखेत",
      mob: "8193853946",
      adh: "556509285603",
      bags: 100,
    },
    {
      name: "श्री दीपक कुमार",
      vill: "कांलक्यूं",
      mob: "8445662139",
      adh: "434752450645",
      bags: 150,
    },
    {
      name: "श्रीमती सुमन देवी",
      vill: "रूडाली",
      mob: "7500196261",
      adh: "572964854368",
      bags: 100,
    },
    {
      name: "श्री दीपक कुमार",
      vill: "कांलक्यूं",
      mob: "8445662139",
      adh: "556509285008",
      bags: 100,
    },
    {
      name: "श्रीमती सुमन देवी",
      vill: "रूडाली",
      mob: "7500196261",
      adh: "572964854368",
      bags: 100,
    },
    {
      name: "श्री विजय पाल सिंह",
      vill: "बराथ मल्ला",
      mob: "9756533894",
      adh: "471582371204",
      bags: 50,
    },
    {
      name: "श्री धर्मपाल सिंह",
      vill: "दिगोली",
      mob: "8476827385",
      adh: "334414172057",
      bags: 50,
    },
  ],
  सेंधीखाल: [
    {
      name: "श्री मनोरमा रावत",
      vill: "सेन्धी",
      mob: "7505017963",
      adh: "698422105298",
      bags: 120,
    },
    {
      name: "श्री मुकेश कुमार",
      vill: "सेन्धी",
      mob: "9027009778",
      adh: "700131085486",
      bags: 120,
    },
    {
      name: "श्री कान्ता प्रसाद",
      vill: "सेन्धी",
      mob: "7579233173",
      adh: "821055364799",
      bags: 120,
    },
    {
      name: "श्री महेन्द्र सिंह",
      vill: "जडियाना",
      mob: "9458100473",
      adh: "439292950101",
      bags: 120,
    },
  ],
  सिसल्ड़ी: [
    {
      name: "श्री सोहन सिंह रावत",
      vill: "बाडियो",
      mob: "9639554404",
      adh: "667333101703",
      bags: 150,
    },
    {
      name: "श्री अमन बूडाकोटी",
      vill: "मंझकोट",
      mob: "8979457072",
      adh: "599438852978",
      bags: 150,
    },
    {
      name: "श्री हरीश खंतवाल",
      vill: "सिसल्डी",
      mob: "9410581592",
      adh: "926972452243",
      bags: 50,
    },
    {
      name: "श्री हिमांशु खंतवाल",
      vill: "सिसल्डी",
      mob: "7454021772",
      adh: "981832743519",
      bags: 120,
    },
  ],
  चेलूसैंण: [
    {
      name: "श्री सुभाष सिंह",
      vill: "कलोडी",
      mob: "8395082501",
      adh: "74250506496",
      bags: 300,
    },
    {
      name: "श्री माहवीर सिंह",
      vill: "च्वरा",
      mob: "7500479744",
      adh: "563556710575",
      bags: 335,
    },
  ],
  दिउली: [
    {
      name: "श्री जुबेर हुसैन",
      vill: "कुनाऊ",
      mob: "9719909356",
      adh: "716845498724",
      bags: 1000,
    },
    {
      name: "श्री प्रदीप रावत",
      vill: "कुनाऊ",
      mob: "8126526930",
      adh: "410216715831",
      bags: 200,
    },
    {
      name: "श्री सुरेश पयाल",
      vill: "कुनाऊ",
      mob: "9468822998",
      adh: "872861073573",
      bags: 800,
    },
    {
      name: "श्री सुभाष सिंह",
      vill: "कुनाऊ",
      mob: "9927847834",
      adh: "732680083632",
      bags: 200,
    },
    {
      name: "श्रीमती कमला देवी",
      vill: "कुनाऊ",
      mob: "9411529839",
      adh: "933314397018",
      bags: 200,
    },
    {
      name: "श्री सौरभ पयाल",
      vill: "कुनाऊ",
      mob: "8279679204",
      adh: "637853794303",
      bags: 200,
    },
    {
      name: "श्री आयुष पयाल",
      vill: "कुनाऊ",
      mob: "9368830104",
      adh: "476829389438",
      bags: 200,
    },
    {
      name: "श्री चनमोहन नेगी",
      vill: "कुनाऊ",
      mob: "8057046365",
      adh: "307244709895",
      bags: 400,
    },
    {
      name: "श्रीमती दर्शनी देवी",
      vill: "कुनाऊ",
      mob: "9548789262",
      adh: "648721407193",
      bags: 200,
    },
    {
      name: "श्री आदित्य नेगी",
      vill: "कुनाऊ",
      mob: "8650766707",
      adh: "860034501598",
      bags: 200,
    },
    {
      name: "श्री आशा नेगी",
      vill: "कुनाऊ",
      mob: "6395801175",
      adh: "913084121128",
      bags: 200,
    },
    {
      name: "श्री विजेन्द्र सिंह",
      vill: "कुनाऊ",
      mob: "6395801175",
      adh: "396785845527",
      bags: 200,
    },
  ],
  पौखाल: [
    {
      name: "श्री राजकुमार चुना",
      vill: "महेडा",
      mob: "7500336198",
      adh: "664818455579",
      bags: 200,
    },
    {
      name: "श्री अमीत कुमार",
      vill: "केष्टा",
      mob: "8868011411",
      adh: "307173916414",
      bags: 240,
    },
    {
      name: "श्रीमती कुसुमलता देवी",
      vill: "गूम",
      mob: "8449982738",
      adh: "877684734177",
      bags: 100,
    },
  ],
  गंगाभोगपुर: [
    {
      name: "श्री तपेश्वर गिरी",
      vill: "गंगाभोगपुर",
      mob: "7906359657",
      adh: "634899480683",
      bags: 500,
    },
    {
      name: "श्री दिनेश चन्द्र",
      vill: "धारकोट",
      mob: "8193941142",
      adh: "632360267199",
      bags: 500,
    },
  ],
  सिलोगी: [
    {
      name: "श्री गुणपाल सिंह",
      vill: "सौड",
      mob: "8006669221",
      adh: "254398838578",
      bags: 20,
    },
    {
      name: "श्री गिरीश सिंह",
      vill: "टाटरी",
      mob: "9927562465",
      adh: "512800401909",
      bags: 200,
    },
    {
      name: "श्री सूर्याकांत",
      vill: "सीला",
      mob: "9675849009",
      adh: "487939357754",
      bags: 20,
    },
    {
      name: "श्री गिरीश सिंह बिष्ट",
      vill: "चाँदपुर",
      mob: "9759264326",
      adh: "931389438979",
      bags: 20,
    },
    {
      name: "श्रीमती रूचि नेगी",
      vill: "सौड",
      mob: "7983104947",
      adh: "299530529734",
      bags: 100,
    },
    {
      name: "श्री मनोज सिंह",
      vill: "खरीक",
      mob: "7830212181",
      adh: "710852422109",
      bags: 30,
    },
    {
      name: "श्री जयपाल सिंह",
      vill: "खैण्डूरी",
      mob: "8859692815",
      adh: "751156202871",
      bags: 10,
    },
    {
      name: "श्री पुष्पा कुकरेती",
      vill: "ग्वील",
      mob: "9720709931",
      adh: "563884579942",
      bags: 45,
    },
    {
      name: "श्री डब्बल सिंह",
      vill: "दावड",
      mob: "8979617751",
      adh: "468474888863",
      bags: 20,
    },
    {
      name: "श्री देवेन्द्र देव",
      vill: "सौड",
      mob: "8859581157",
      adh: "704192142479",
      bags: 30,
    },
    {
      name: "श्री चन्द्र मोहन",
      vill: "खरीक",
      mob: "9759639128",
      adh: "639974681605",
      bags: 50,
    },
    {
      name: "श्रीमती विनीता भण्डारी",
      vill: "सुराडी",
      mob: "9675888617",
      adh: "488884173739",
      bags: 50,
    },
    {
      name: "श्री शशीकांत",
      vill: "कडथी",
      mob: "9548563893",
      adh: "780385706047",
      bags: 50,
    },
    {
      name: "श्री सुभाष चौहान",
      vill: "कठूडवडा",
      mob: "7838648206",
      adh: "575857730411",
      bags: 100,
    },
    {
      name: "श्री मोहन लाल",
      vill: "उतिण्डा",
      mob: "7579113224",
      adh: "829738153461",
      bags: 50,
    },
    {
      name: "श्री कुलवीर सिंह",
      vill: "अमोला",
      mob: "7535049445",
      adh: "419016943089",
      bags: 30,
    },
    {
      name: "श्रीमती अंजू देवी",
      vill: "बिरमोली",
      mob: "8218130532",
      adh: "499092661887",
      bags: 100,
    },
    {
      name: "श्रीमती लता देवी",
      vill: "सुराडी",
      mob: "7870701621",
      adh: "648536616912",
      bags: 300,
    },
    {
      name: "श्री हरीश सिंह",
      vill: "दावड",
      mob: "8006857086",
      adh: "260551816003",
      bags: 20,
    },
    {
      name: "श्री रविन्द्र सिंह",
      vill: "गढकोट",
      mob: "9990803691",
      adh: "842508558457",
      bags: 20,
    },
    {
      name: "श्री सुमन बर्तवाल",
      vill: "बडेथ",
      mob: "7617453038",
      adh: "684395567303",
      bags: 50,
    },
    {
      name: "श्री जितेन्द्र कुमार",
      vill: "जल्ली",
      mob: "9528189662",
      adh: "888531504892",
      bags: 150,
    },
    {
      name: "श्रीमती रूकमा देवी",
      vill: "खैण्डूरी",
      mob: "9548239457",
      adh: "790553395088",
      bags: 50,
    },
    {
      name: "श्रीमती रेखा देवी",
      vill: "विरमोली",
      mob: "9758416349",
      adh: "382072955265",
      bags: 200,
    },
    {
      name: "श्री विजय भट्ट",
      vill: "कडथी",
      mob: "8006966655",
      adh: "690233534409",
      bags: 20,
    },
    {
      name: "श्री देव चन्द्र",
      vill: "कडथी",
      mob: "8006830348",
      adh: "354047456772",
      bags: 10,
    },
    {
      name: "श्री सुनील",
      vill: "खजरी",
      mob: "963910387",
      adh: "323779934870",
      bags: 55,
    },
  ],
  देवियोंखाल: [
    {
      name: "श्री सतेन्द्र सिंह",
      vill: "बम्सू",
      mob: "",
      adh: "599034074709",
      bags: 200,
    },
    {
      name: "श्री सतीश सिंह",
      vill: "मैदनी डाबरी",
      mob: "",
      adh: "598235886377",
      bags: 400,
    },
    {
      name: "श्री मातबर सिंह",
      vill: "सिनाला",
      mob: "",
      adh: "436003779095",
      bags: 350,
    },
    {
      name: "श्री सोहन सिंह",
      vill: "मंजुली",
      mob: "8126951768",
      adh: "249819069882",
      bags: 100,
    },
    {
      name: "श्री रणवीर सिंह",
      vill: "मंजुली",
      mob: "",
      adh: "536864824353",
      bags: 150,
    },
  ],
  दुगड्डा: [
    {
      name: "श्रीमती मीनाक्षी देवी",
      vill: "कोटा मौरान्यूं",
      mob: "",
      adh: "418332510608",
      bags: 600,
    },
  ],
};
const PRESET = {
  button: { rate: 126, kg: 10, hi: "बटन", en: "Button" },
  oyster: { rate: 90, kg: 5, hi: "ऑयस्टर", en: "Oyster" },
};
const KENDRAS = [
  "कोटद्वार",
  "किनगोड़िखाल",
  "चौखाल",
  "धुमाकोट",
  "बीरोंखाल",
  "हल्दूखाल",
  "किल्वोंखाल",
  "चेलूसैंण",
  "जयहरीखाल",
  "जेठागांव",
  "देवियोंखाल",
  "सिलोगी",
  "सिसल्ड़ी",
  "पौखाल",
  "सतपुली",
  "संगलाकोटी",
  "देवराजखाल",
  "पोखड़ा",
  "वेदीखाल",
  "विथ्याणी",
  "गंगाभोगपुर",
  "दिउली",
  "दुगड्डा",
  "सेंधीखाल",
];
const LS_RECORDS = "mushroom-form-records-v2";
const LS_DRAFT = "mushroom-form-draft-v2";

const money = (n) =>
  (Number(n) || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
const fmtDate = (v) => (v ? v.split("-").reverse().join("/") : "");

const HI = [
  "",
  "एक",
  "दो",
  "तीन",
  "चार",
  "पाँच",
  "छह",
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
  "बीस",
  "इक्कीस",
  "बाईस",
  "तेईस",
  "चौबीस",
  "पच्चीस",
  "छब्बीस",
  "सत्ताईस",
  "अट्ठाईस",
  "उनतीस",
  "तीस",
  "इकतीस",
  "बत्तीस",
  "तैंतीस",
  "चौंतीस",
  "पैंतीस",
  "छत्तीस",
  "सैंतीस",
  "अड़तीस",
  "उनतालीस",
  "चालीस",
  "इकतालीस",
  "बयालीस",
  "तैंतालीस",
  "चौवालीस",
  "पैंतालीस",
  "छियासठ",
  "सैंतालीस",
  "अड़तालीस",
  "उनचास",
  "पचास",
  "इक्यावन",
  "बावन",
  "तिरेपन",
  "चौवन",
  "पचपन",
  "छप्पन",
  "सत्तावन",
  "अट्ठावन",
  "उनसठ",
  "साठ",
  "इकसठ",
  "बासठ",
  "तिरेसठ",
  "चौंसठ",
  "पैंसठ",
  "सड़सठ",
  "अड़सठ",
  "उनहत्तर",
  "सत्तर",
  "इकहत्तर",
  "बहत्तर",
  "तिहत्तर",
  "चौहत्तर",
  "पचहत्तर",
  "छिहत्तर",
  "सतहत्तर",
  "अठहत्तर",
  "उन्यासी",
  "अस्सी",
  "इक्यासी",
  "बयासी",
  "तिरासी",
  "चौरासी",
  "पचासी",
  "छियासी",
  "सतासी",
  "अट्ठासी",
  "नवासी",
  "नब्बे",
  "इक्यानवे",
  "बानवे",
  "तिरानवे",
  "चौरानवे",
  "पंचानवे",
  "छियानवे",
  "सत्तानवे",
  "अट्ठानवे",
  "निन्यानवे",
];
const E1 = [
  "",
  "One",
  "Two",
  "Three",
  "Four",
  "Five",
  "Six",
  "Seven",
  "Eight",
  "Nine",
  "Ten",
  "Eleven",
  "Twelve",
  "Thirteen",
  "Fourteen",
  "Fifteen",
  "Sixteen",
  "Seventeen",
  "Eighteen",
  "Nineteen",
];
const E10 = [
  "",
  "",
  "Twenty",
  "Thirty",
  "Forty",
  "Fifty",
  "Sixty",
  "Seventy",
  "Eighty",
  "Ninety",
];
const hi3 = (n) => {
  let s = "";
  if (n > 99) {
    s += HI[Math.floor(n / 100)] + " सौ ";
    n %= 100;
  }
  if (n) s += HI[n] + " ";
  return s;
};
const hiWords = (num) => {
  num = Math.round((Number(num) || 0) * 100) / 100;
  let r = Math.floor(num),
    p = Math.round((num - r) * 100),
    out = r === 0 ? "शून्य " : "";
  const cr = Math.floor(r / 10000000);
  r %= 10000000;
  const la = Math.floor(r / 100000);
  r %= 100000;
  const th = Math.floor(r / 1000);
  r %= 1000;
  if (cr) out += hi3(cr) + "करोड़ ";
  if (la) out += hi3(la) + "लाख ";
  if (th) out += hi3(th) + "हज़ार ";
  if (r) out += hi3(r);
  out = out.trim() + " रुपये";
  if (p) out += " " + hi3(p).trim() + " पैसे";
  return out + " मात्र";
};
const en2 = (n) =>
  n < 20 ? E1[n] : E10[Math.floor(n / 10)] + (n % 10 ? " " + E1[n % 10] : "");
const en3 = (n) => {
  let s = "";
  if (n > 99) {
    s += E1[Math.floor(n / 100)] + " Hundred ";
    n %= 100;
  }
  if (n) s += en2(n);
  return s.trim();
};
const enWords = (num) => {
  num = Math.round((Number(num) || 0) * 100) / 100;
  let r = Math.floor(num),
    p = Math.round((num - r) * 100),
    out = [];
  if (r === 0) out.push("Zero");
  const cr = Math.floor(r / 10000000);
  r %= 10000000;
  const la = Math.floor(r / 100000);
  r %= 100000;
  const th = Math.floor(r / 1000);
  r %= 1000;
  if (cr) out.push(en3(cr) + " Crore");
  if (la) out.push(en3(la) + " Lakh");
  if (th) out.push(en3(th) + " Thousand");
  if (r) out.push(en3(r));
  let s = "Rupees " + out.join(" ");
  if (p) s += " and " + en2(p) + " Paise";
  return s + " Only";
};

function mergeDuplicateFarmers(list) {
  const map = new Map(),
    order = [];
  list.forEach((f) => {
    const key =
      (f.name || "").trim().toLowerCase() +
      "|" +
      (f.vill || "").trim().toLowerCase();
    if (!key.trim()) {
      order.push(f);
      return;
    }
    if (map.has(key)) {
      const ex = map.get(key);
      ex.bags += Number(f.bags) || 0;
      if (!ex.mob && f.mob) ex.mob = f.mob;
      if (!ex.adh && f.adh) ex.adh = f.adh;
    } else {
      const copy = { ...f, bags: Number(f.bags) || 0 };
      map.set(key, copy);
      order.push(copy);
    }
  });
  return order;
}

function Field({ label, children, full = false }) {
  return (
    <div className={full ? "m-field-full" : ""}>
      <label className="f">{label}</label>
      {children}
    </div>
  );
}
function Legend({ children }) {
  return <div className="legend">{children}</div>;
}

function DemandSheet({ data, letterVersion }) {
  const { mtype, fields, farmers } = data,
    T = PRESET[mtype],
    rows = mergeDuplicateFarmers(farmers.filter((f) => f.name || f.bags)),
    rate = Number(fields.i_rate) || 0,
    sub = Number(fields.i_sub) || 0,
    farm = 100 - sub,
    perFarm = (rate * farm) / 100,
    perSub = (rate * sub) / 100,
    total = rows.reduce((s, f) => s + (Number(f.bags) || 0), 0);
  return (
    <div className="sheet" id="doc-demand">
      <h2 className="doc">मांग-पत्र</h2>
      <div
        className="editable"
        key={letterVersion}
        contentEditable
        suppressContentEditableWarning
        onInput={() => setLetterEdited(true)}
      >
        <p style={{ margin: 0 }}>
          सेवा में,
          <br />
          &nbsp;&nbsp;&nbsp;
          <span>
            {fields.i_office ||
              "उद्यान विशेषज्ञ कोटद्वार गढ़वाल (पौड़ी गढ़वाल)"}
          </span>
          ,<br />
          &nbsp;&nbsp;द्वारा: प्रभारी, उद्यान सचल दल केन्द्र,{" "}
          <span className="dline dl-long">{fields.i_kendra || " "}</span>
        </p>
        <p style={{ margin: "10px 0 6px" }}>
          <b>
            विषय: कृषकों द्वारा {sub}% अनुदान पर बिजाई युक्त कम्पोस्ट बैग उपलब्ध
            कराए जाने के सम्बन्ध में।
          </b>
        </p>
        <p style={{ margin: 0, textAlign: "justify" }}>
          महोदय,
          <br />
          &nbsp;&nbsp;&nbsp;&nbsp;सविनय निवेदन है कि हम क्षेत्र के इच्छुक कृषक
          स्वरोजगार एवं आजीविका संवर्धन के उद्देश्य से{" "}
          <b>
            {T.hi} मशरूम ({T.en} Mushroom)
          </b>{" "}
          की खेती करना चाहते हैं। इस हेतु हमें जिला योजना वर्ष{" "}
          {fields.i_year || "2026-27"} के अन्तर्गत {sub}% अनुदान पर बिजाई युक्त
          कम्पोस्ट बैग की आवश्यकता है।
        </p>
        <p style={{ margin: "8px 0 0", textAlign: "justify" }}>
          हम सभी कृषक आर्थिक रूप से कमजोर एवं सीमित साधनों वाले हैं तथा कम्पोस्ट
          बैग की कुल देय राशि का भुगतान एक साथ करने में सक्षम नहीं हैं। अतः उक्त
          योजना के अन्तर्गत {sub}% अनुदान पर बिजाई युक्त कम्पोस्ट बैग उपलब्ध
          कराए जाने हेतु यह अनुरोध प्रस्तुत किया जा रहा है।
        </p>
        <p style={{ margin: "8px 0 0", textAlign: "justify" }}>
          कम्पोस्ट बैग की निर्धारित दर ₹{money(rate)} प्रति बैग के अनुसार कृषकों
          द्वारा {farm}% अंशदान ₹{money(perFarm)} प्रति बैग स्वयं वहन किया
          जाएगा। शेष {sub}% राजसहायता ₹{money(perSub)} प्रति बैग का लाभ कृषकों
          को "इन-काइंड सब्सिडी (In-kind Subsidy)" के रूप में कम्पोस्ट बैग की
          आपूर्ति के माध्यम से प्रदान किए जाने तथा अनुदान की समतुल्य राशि
          संबंधित आपूर्तिकर्ता को सीधे e-Payment के माध्यम से भुगतान किए जाने का
          अनुरोध है।
        </p>
        <p style={{ margin: "8px 0 0", textAlign: "justify" }}>
          इस सम्बन्ध में हमारे द्वारा मैसर्स बडोला मशरूम फार्म, काशीपुर, ऊधम
          सिंह नगर से संपर्क किया गया। साथ ही अन्य फर्मों से भी जानकारी प्राप्त
          की गई। अन्य फर्मों द्वारा ग्राम स्तर तक कम्पोस्ट बैग पहुँचाने हेतु
          परिवहन/डिलीवरी शुल्क अलग से लिये जाने की जानकारी दी गई, जबकि मैसर्स
          बडोला मशरूम फार्म द्वारा विभागीय निर्धारित दर ₹{money(rate)} प्रति बैग
          पर बिना किसी अतिरिक्त परिवहन/डिलीवरी शुल्क के ग्राम स्तर तक बिजाई
          युक्त कम्पोस्ट बैग उपलब्ध कराने की सहमति दी गई है। अतः कृषकों की सहमति
          से उक्त फर्म से कम्पोस्ट बैग क्रय किए जाने का अनुरोध किया जा रहा है।
        </p>
        <p style={{ margin: "8px 0 0", textAlign: "justify" }}>
          उक्त आपूर्तिकर्ता फर्म शेष देय धनराशि का भुगतान विभाग में बजट उपलब्ध
          होने पर प्राप्त करने हेतु सहमत है।
        </p>
        <p style={{ margin: "8px 0 0", textAlign: "justify" }}>
          अतः महोदय से निवेदन है कि हमारे अनुरोध पत्र के आधार पर मैसर्स बडोला
          मशरूम फार्म, काशीपुर, ऊधम सिंह नगर से विभागीय निर्धारित दर ₹
          {money(rate)} प्रति बैग पर बिजाई युक्त कम्पोस्ट बैग क्रय किए जाने की
          स्वीकृति प्रदान करने की कृपा कीजिएगा तथा विभागीय स्वीकृति के उपरांत
          संबंधित आपूर्तिकर्ता द्वारा प्रस्तुत देयक के आधार पर विभागीय स्वीकृत
          दर के अनुसार देय {sub}% राजसहायता की धनराशि संबंधित आपूर्तिकर्ता फर्म
          को भुगतान हेतु अवमुक्त किए जाने की कृपा कीजिएगा।
        </p>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          margin: "10px 0 6px",
          gap: 16,
        }}
      >
        <p style={{ margin: 0 }}>
          <b>इच्छुक कृषकों की मांग का विवरण निम्नलिखित है:</b>
        </p>
        <div
          style={{
            border: "1px solid #000",
            padding: "5px 9px",
            whiteSpace: "nowrap",
          }}
        >
          <b>मशरूम का प्रकार:</b>
          <br />
          <span className="tick">{mtype === "oyster" ? "✓" : ""}</span>ऑयस्टर
          (Oyster)
          <br />
          <span className="tick">{mtype === "button" ? "✓" : ""}</span>बटन
          (Button)
        </div>
      </div>
      <table className="doc roster">
        <thead>
          <tr>
            <th style={{ width: 32 }}>क्र.सं.</th>
            <th style={{ width: 150 }}>कृषक का नाम</th>
            <th style={{ width: 95 }}>ग्राम</th>
            <th style={{ width: 85 }}>मोबाइल नंबर</th>
            <th style={{ width: 100 }}>आधार सं०</th>
            <th style={{ width: 55 }}>मांग (बैग की सं०)</th>
            <th style={{ width: 115 }}>हस्ताक्षर</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((f, i) => (
            <tr key={i} style={{ height: 22 }}>
              <td className="c">{i + 1}</td>
              <td>{f.name}</td>
              <td>{f.vill}</td>
              <td className="c">{f.mob}</td>
              <td className="c">{f.adh}</td>
              <td className="c">
                <b>{f.bags || ""}</b>
              </td>
              <td></td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan={5} className="r">
              <b>कुल योग</b>
            </td>
            <td className="c">
              <b>{total}</b>
            </td>
            <td></td>
          </tr>
        </tfoot>
      </table>
      <p className="center" style={{ margin: "26px 0 0" }}>
        <b>समस्त कृषक गण</b>
      </p>
      <div style={{ marginTop: 16 }}>
        <p className="center" style={{ margin: "0 0 6px" }}>
          <b style={{ textDecoration: "underline" }}>
            प्रभारी की संस्तुति एवं अग्रसारण
          </b>
        </p>
        <p style={{ margin: 0, textAlign: "justify" }}>
          सम्बन्धित कृषकों के अनुरोध के क्रम में, उक्त {T.hi} मशरूम की खेती हेतु
          बिजाई युक्त कम्पोस्ट बैग की मांग संस्तुति सहित सादर अग्रसारित है।
          कृपया कृषकों को उक्त बैग क्रय किए जाने की स्वीकृति प्रदान करने की कृपा
          कीजियेगा।
        </p>
        <p style={{ textAlign: "right", margin: "32px 0 0" }}>
          <b>हस्ताक्षर प्रभारी: _____________________</b>
        </p>
      </div>
    </div>
  );
}

function VoucherSheet({ data }) {
  const { mtype, fields, farmers } = data,
    T = PRESET[mtype],
    rate = Number(fields.i_rate) || 0,
    sub = Number(fields.i_sub) || 0,
    farm = 100 - sub,
    perFarm = (rate * farm) / 100,
    perSub = (rate * sub) / 100,
    rows = mergeDuplicateFarmers(farmers.filter((f) => Number(f.bags) > 0)),
    bags = rows.reduce((s, f) => s + Number(f.bags), 0),
    value = bags * rate,
    farmerValue = bags * perFarm,
    subValue = bags * perSub;
  return (
    <div className="sheet vch-sheet">
      <h2 className="doc" style={{ margin: "0 0 14px" }}>
        समेकित पावती-पत्र (वितरण-सह-प्राप्ति)
      </h2>
      <p style={{ margin: 0 }}>
        सेवा में,
        <br />
        &nbsp;&nbsp;&nbsp;उद्यान विशेषज्ञ कोटद्वार गढ़वाल (पौड़ी गढ़वाल),
        <br />
        &nbsp;&nbsp;द्वारा: प्रभारी, उद्यान सचल दल केन्द्र,{" "}
        <span className="dline dl-long">{fields.i_kendra || " "}</span>
      </p>
      <p style={{ margin: "10px 0 6px" }}>
        <b>
          विषय: मैसर्स बडोला मशरूम फार्म, काशीपुर के बिल संख्या{" "}
          {fields.i_invoice || "—"} दिनांक {fmtDate(fields.i_date) || "—"} पर
          देय राजसहायता के भुगतान हेतु प्रस्तुतीकरण।
        </b>
      </p>
      <p style={{ margin: 0, textAlign: "justify" }}>
        महोदय,
        <br />
        &nbsp;&nbsp;&nbsp;&nbsp;निवेदन है कि उद्यान सचल दल केन्द्र,{" "}
        {fields.i_kendra || "—"} के अन्तर्गत निम्नानुसार कृषकों द्वारा मैसर्स
        बडोला मशरूम फार्म, काशीपुर, ऊधम सिंह नगर से जिला योजना वर्ष{" "}
        {fields.i_year || "2026-27"} के अन्तर्गत {sub}% अनुदान पर विभागीय
        स्वीकृत दर ₹{money(rate)} प्रति बैग के अनुसार कुल <b>{bags}</b> बैग{" "}
        {T.hi} मशरूम बिजाई युक्त कम्पोस्ट क्रय किए गए हैं। उक्त कम्पोस्ट बैग
        संबंधित कृषकों को सही एवं पूर्ण एवं उच्च गुणवत्ता अवस्था में प्राप्त हो
        चुके हैं। कृषकों द्वारा निर्धारित {farm}% कृषक अंश ₹{money(perFarm)}{" "}
        प्रति बैग के अनुसार कुल ₹{money(farmerValue)} की धनराशि उक्त फर्म को अदा
        कर दी गई है।
      </p>
      <p style={{ margin: "8px 0 0", textAlign: "justify" }}>
        फर्म द्वारा प्रस्तुत बिल संख्या {fields.i_invoice || "—"}, जिसकी कुल
        देयक राशि ₹{money(value)} है, भुगतान हेतु प्रस्तुत किया जा रहा है। उक्त
        बिल के सापेक्ष कृषकों द्वारा ₹{money(farmerValue)} का कृषक अंश फर्म को
        जमा किए जाने के उपरान्त शेष {sub}% राजसहायता (अनुदान) की धनराशि ₹
        {money(subValue)} ({subValue ? hiWords(subValue) : "—"}) देय है।
      </p>
      <p style={{ margin: "8px 0 0", textAlign: "justify" }}>
        अतः अनुरोध है कि हमारे आवेदन एवं प्राप्त स्वीकृति के क्रम में उक्त देयक
        संख्या {fields.i_invoice || "—"} दिनांक {fmtDate(fields.i_date) || "—"}{" "}
        की देय राजसहायता की धनराशि ₹{money(subValue)} सीधे आपूर्तिकर्ता फर्म
        मैसर्स बडोला मशरूम फार्म, काशीपुर, ऊधम सिंह नगर को e-Payment के माध्यम
        से भुगतान करने की कृपा करें।
      </p>
      <p style={{ margin: "8px 0 0", textAlign: "justify" }}>
        उक्त आपूर्तिकर्ता फर्म शेष देय धनराशि का भुगतान विभाग में बजट उपलब्ध
        होने पर किए जाने हेतु सहमत है।
      </p>
      <p style={{ margin: "12px 0 6px" }}>
        <b>लाभार्थी कृषकों का विवरण एवं हस्ताक्षर निम्नानुसार हैं —</b>
      </p>
      <table className="doc roster">
        <thead>
          <tr>
            <th>क्र०सं०</th>
            <th>किसान का पूरा नाम</th>
            <th>ग्राम / पंचायत</th>
            <th>बैग</th>
            <th>{farm}% किसान अंश</th>
            <th>{sub}% राजसहायता</th>
            <th>हस्ताक्षर</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((f, i) => (
            <tr key={i}>
              <td className="c">{i + 1}</td>
              <td>{f.name}</td>
              <td>{f.vill}</td>
              <td className="c">
                <b>{f.bags}</b>
              </td>
              <td className="r">₹ {money(f.bags * perFarm)}</td>
              <td className="r">₹ {money(f.bags * perSub)}</td>
              <td></td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan={3} className="r">
              <b>कुल</b>
            </td>
            <td className="c">
              <b>{bags}</b>
            </td>
            <td className="r">
              <b>₹ {money(farmerValue)}</b>
            </td>
            <td className="r">
              <b>₹ {money(subValue)}</b>
            </td>
            <td></td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}

function VendorSheet({ data }) {
  const { mtype, fields, farmers } = data,
    T = PRESET[mtype],
    rate = Number(fields.i_rate) || 0,
    sub = Number(fields.i_sub) || 0,
    farm = 100 - sub,
    rows = mergeDuplicateFarmers(farmers.filter((f) => Number(f.bags) > 0)),
    bags = rows.reduce((s, f) => s + Number(f.bags), 0),
    value = bags * rate,
    farmerValue = (bags * rate * farm) / 100,
    subValue = (bags * rate * sub) / 100;
  return (
    <div className="sheet vendor-sheet">
      <div className="vendor-head">
        <div>
          <div className="vendor-title">BADOLA MUSHROOMS FARM</div>
          <div className="vendor-sub">(COMPOST UNIT)</div>
          <div>H.O.-Dhanori Patti, D.P.S. Road, Kashipur (U.S. Nagar) U.K.</div>
          <div>
            Compost Unit-Vill. Pratappur, Near Pickle Factory, Kashipur (U.S.
            Nagar)
          </div>
          <div>
            GSTIN No.: 05CHXPS3134D1Z5 &nbsp;|&nbsp; Mob.: 9899935600,
            6398264916
          </div>
        </div>
        <div className="vendor-ref">
          <b>CERTIFICATE</b>
          <br />
          Ref. Bill No. : {fields.i_invoice || "—"}
          <br />
          Date : {fmtDate(fields.i_date) || "—"}
        </div>
      </div>
      <div className="center under">
        <b>विक्रेता का प्रमाण-पत्र (Supplier's Certificate)</b>
      </div>
      <p className="justify">
        मैं, मैसर्स बडोला मशरूम फार्म, काशीपुर, ऊधम सिंह नगर, प्रमाणित करता हूँ
        कि उद्यान सचल दल केन्द्र, <b>{fields.i_kendra || "—"}</b> के अंतर्गत बिल
        संख्या <b>{fields.i_invoice || "—"}</b> दिनांक{" "}
        <b>{fmtDate(fields.i_date) || "—"}</b> के अनुसार उपरोक्त कृषकों को कुल{" "}
        <b>{bags}</b> बैग {T.hi} मशरूम बिजाई युक्त कम्पोस्ट सही एवं पूर्ण अवस्था
        में वितरित कर दिए हैं, जो कृषकों को दिनांक{" "}
        <b>{fields.i_supply || "—"}</b> को प्राप्त हो चुके हैं, जिनका कुल मूल्य
        रुपये <b>{money(value)}</b> है, तथा कृषकों से निर्धारित कृषक अंश ({farm}
        %) की धनराशि रुपये <b>{money(farmerValue)}</b> प्राप्त कर ली गई है।
      </p>
      <p className="justify">
        <b>
          अतः शेष {sub}% राजसहायता (अनुदान) की धनराशि रुपये {money(subValue)} (
          {subValue ? hiWords(subValue) : "—"}) का भुगतान मुझे करने की कृपा
          कीजिएगा।
        </b>
      </p>
      <div className="vendor-sign">
        For BADOLA MUSHROOMS FARM
        <div>Authorised Signatory / विक्रेता के हस्ताक्षर व मुहर</div>
      </div>
    </div>
  );
}

function SatyapanSheet({ data }) {
  const { mtype, fields, farmers } = data,
    T = PRESET[mtype],
    rate = Number(fields.i_rate) || 0,
    sub = Number(fields.i_sub) || 0,
    farm = 100 - sub,
    rows = mergeDuplicateFarmers(farmers.filter((f) => Number(f.bags) > 0)),
    bags = rows.reduce((s, f) => s + Number(f.bags), 0),
    value = bags * rate,
    subValue = (bags * rate * sub) / 100,
    farmerValue = (bags * rate * farm) / 100;
  return (
    <div className="sheet saty-sheet">
      <div className="saty-head">
        <b>कार्यालय प्रभारी, उद्यान सचल दल केन्द्र, {fields.i_kendra || "—"}</b>
        <span>जनपद पौड़ी गढ़वाल, उद्यान विभाग, उत्तराखण्ड</span>
        <h2 className="doc">सत्यापन आख्या</h2>
      </div>
      <p className="right">
        सन्दर्भ : बिल संख्या <b>{fields.i_invoice || "—"}</b> · दिनांक{" "}
        <b>{fmtDate(fields.i_date) || "—"}</b>
      </p>
      <p className="justify">
        प्रमाणित किया जाता है कि उपरोक्त देयक (बिल) संख्या{" "}
        <b>{fields.i_invoice || "—"}</b> दिनांक{" "}
        <b>{fmtDate(fields.i_date) || "—"}</b>, मैसर्स बडोला मशरूम फार्म
        (कम्पोस्ट यूनिट), काशीपुर, ऊधम सिंह नगर से सम्बन्धित कृषकों द्वारा क्रय
        किए गए बिजाई युक्त {T.hi} मशरूम कम्पोस्ट बैग का मेरे द्वारा सत्यापन कर
        लिया गया है। वितरित बैगों की गुणवत्ता, मात्रा एवं विशिष्टताओं का भौतिक
        सत्यापन कर लिया गया है तथा बैग रोगमुक्त एवं बिजाई युक्त पाए गए हैं। उक्त
        बिल के अनुसार <b>{bags}</b> बिजाई युक्त {T.hi} मशरूम कम्पोस्ट बैग
        सम्बन्धित कृषकों को दिनांक <b>{fields.i_supply || "—"}</b> को प्राप्त हो
        चुके हैं तथा कृषक अंश ({farm}%) की धनराशि रुपये{" "}
        <b>{money(farmerValue)}</b> आपूर्तिकर्ता फर्म द्वारा कृषकों से प्राप्त
        कर ली गई है।
      </p>
      <p className="justify">
        अतः बिल की कुल धनराशि रुपये <b>{money(value)}</b> में से राजसहायता
        (अनुदान) की धनराशि रुपये <b>{money(subValue)}</b> (
        {subValue ? hiWords(subValue) : "—"}) जो कि बिल के कुल योग का {sub}{" "}
        प्रतिशत है,{" "}
        <b>उक्त आपूर्तिकर्ता फर्म को भुगतान करने की कृपा कीजियेगा।</b>
      </p>
      <p className="justify">
        <b>संलग्न है:</b> समेकित पावती-पत्र, BADOLA MUSHROOMS FARM (COMPOST
        UNIT) का इनवॉइस।
      </p>
      <div className="saty-sign">
        प्रभारी,
        <br />
        उद्यान सचल दल केन्द्र,{" "}
        <span className="dline">{fields.i_kendra || " "}</span>
      </div>
    </div>
  );
}

function InvoiceSheet({ data }) {
  const { mtype, fields, farmers, vehicles } = data,
    T = PRESET[mtype],
    rate = Number(fields.i_rate) || 0,
    gst = Number(fields.i_gst) || 0,
    sub = Number(fields.i_sub) || 0,
    rows = mergeDuplicateFarmers(farmers.filter((f) => Number(f.bags) > 0)),
    bags = rows.reduce((s, f) => s + Number(f.bags), 0),
    value = bags * rate,
    half = gst / 2,
    cg = (value * half) / 100,
    sg = (value * half) / 100,
    total = value + cg + sg,
    buyerName = [...new Set(rows.map((f) => f.name).filter(Boolean))].join(
      ", ",
    ),
    buyerAddr = [...new Set(rows.map((f) => f.vill).filter(Boolean))].join(
      ", ",
    ),
    subValue = (bags * rate * sub) / 100;
  return (
    <div className={`sheet inv-sheet${rows.length <= 12 ? " short-inv" : ""}`}>
      <div className="inv-head">
        <div className="inv-top">
          <span>GSTIN No.: 05CHXPS3134D1Z5</span>
          <span className="under">TAX INVOICE</span>
          <span>Mob.: 9899935600, 6398264916</span>
        </div>
        <div className="inv-name">
          <h1>BADOLA MUSHROOMS FARM</h1>
          <div className="u">(COMPOST UNIT)</div>
          <div className="a">
            H.O.-Dhanori Patti, D.P.S. Road, Kashipur (U.S. Nagar) U.K.
          </div>
          <div className="a">
            Compost Unit-Vill. Pratappur, Near Pickle Factory, Kashipur (U.S.
            Nagar)
          </div>
        </div>
        <div className="inv-bill">
          <div>
            <b className="under">Billing Details</b>
            <div>
              M/s : <span className="dline dl-long">{buyerName || " "}</span>
            </div>
            <div>
              Address :{" "}
              <span className="dline dl-long">{buyerAddr || " "}</span>
            </div>
            <div>
              Way No. : <span className="dline dl-long"> </span>
            </div>
          </div>
          <div>
            <div>
              Bill Date (बिल दिनांक) :{" "}
              <span className="dline">{fmtDate(fields.i_date) || " "}</span>
            </div>
            <div className="mt6">
              Invoice No. :{" "}
              <span className="dline">{fields.i_invoice || " "}</span>
            </div>
            {vehicles?.length > 0 && (
              <>
                <div className="vehicle-head">वाहन संख्या (Vehicle No.)</div>
                {vehicles.map((v, i) => (
                  <div key={i}>
                    वाहन संख्या {i + 1} :{" "}
                    <span className="dline bold">{v}</span>
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
        <div className="inv-items">
          <table className="doc inv-tbl">
            <colgroup>
              <col style={{ width: 38 }} />
              <col />
              <col style={{ width: 78 }} />
              <col style={{ width: 95 }} />
              <col style={{ width: 115 }} />
            </colgroup>
            <thead>
              <tr>
                <th>
                  Sr.
                  <br />
                  No.
                </th>
                <th>Description of Goods</th>
                <th>Qty / Unit</th>
                <th>Rate / Unit</th>
                <th>Taxable Value</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ height: 34 }}>
                <td className="c">1</td>
                <td>
                  Spawned Compost Bag — {T.en} Mushroom ({fields.i_kg || T.kg}{" "}
                  kg / bag)
                  <br />
                  <span className="small">
                    बिजाई युक्त {T.hi} मशरूम कम्पोस्ट बैग
                  </span>
                  <br />
                  <span className="small">
                    Date of Supply : {fields.i_supply || "—"}
                  </span>
                </td>
                <td className="c">{bags || ""}</td>
                <td className="r">{bags ? money(rate) : ""}</td>
                <td className="r">{bags ? money(value) : ""}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="inv-spacer">
          {fields.i_showstamp !== false && (
            <div className="stamp-grid">
              <div className="stamp-box">
                <b>कृषक हस्ताक्षर</b>
                {rows.map((f, i) => (
                  <div className="stamp-line" key={i}>
                    <span>{i + 1}</span>
                    <span>{f.name}</span>
                  </div>
                ))}
              </div>
              <div className="stamp-box officer">
                <b>प्रभारी</b>
                <p>
                  कृषकों के अनुरोध पर देयक की राजसहायता की धनराशि रुपये{" "}
                  {money(subValue)} फर्म को भुगतान हेतु संस्तुति सहित अग्रसारित
                  है।
                </p>
                <div>
                  प्रभारी,
                  <br />
                  उद्यान सचल दल केन्द्र, {fields.i_kendra || "—"}
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="inv-foot">
          <table className="doc inv-tbl">
            <colgroup>
              <col style={{ width: 38 }} />
              <col />
              <col style={{ width: 78 }} />
              <col style={{ width: 95 }} />
              <col style={{ width: 115 }} />
            </colgroup>
            <tbody>
              <tr>
                <td colSpan={2} rowSpan={6} className="bank">
                  <b className="under">Bank Detail :</b>
                  <div>Bank Name : The Nainital Bank Ltd.</div>
                  <div>Bank A/c No. : 1586000000000002</div>
                  <div>Branch : Pratappur (Kashipur)</div>
                  <div>Bank IFSC : NTBL0KAS158</div>
                  <div className="mt8">
                    Total Amount Value (in figures) : <b>₹ {money(total)}</b>
                  </div>
                  <div>
                    Total Amount Value (in words) :{" "}
                    <b>{total ? enWords(total) : "—"}</b>
                  </div>
                  <div className="terms">
                    <b>Terms and Conditions :</b>
                    <br />
                    1. All disputes are subject to Kashipur Jurisdiction.
                    <br />
                    2. Interest @24% will be charged if the payment is not made
                    on realisation.
                    <br />
                    3. Goods once sold are neither refundable nor exchangeable.
                  </div>
                </td>
                <td colSpan={2}>Total</td>
                <td className="r">{money(value)}</td>
              </tr>
              <tr>
                <td colSpan={2}>C.G.S.T. @ {half}%</td>
                <td className="r">{money(cg)}</td>
              </tr>
              <tr>
                <td colSpan={2}>S.G.S.T. @ {half}%</td>
                <td className="r">{money(sg)}</td>
              </tr>
              <tr>
                <td colSpan={2}>I.G.S.T. @ —</td>
                <td className="r">0.00</td>
              </tr>
              <tr className="gt">
                <td colSpan={2}>
                  <b>G. Total</b>
                </td>
                <td className="r">
                  <b>{money(total)}</b>
                </td>
              </tr>
              <tr>
                <td colSpan={3} className="sign">
                  <b>For BADOLA MUSHROOMS FARM</b>
                  <div className="mt44">Authorised Signatory</div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function ReceiptSheet({
  data,
  mode,
  combined = false,
  farmer = null,
  receiptNo = 0,
}) {
  const { mtype, fields } = data,
    T = PRESET[mtype],
    rate = Number(fields.i_rate) || 0,
    sub = Number(fields.i_sub) || 0,
    farm = 100 - sub,
    rows = mergeDuplicateFarmers(
      data.farmers.filter((f) => Number(f.bags) > 0),
    ),
    bags = farmer
      ? Number(farmer.bags) || 0
      : rows.reduce((s, f) => s + Number(f.bags), 0),
    amt = (bags * rate * farm) / 100,
    name =
      farmer?.name ||
      rows
        .map((f) => f.name)
        .filter(Boolean)
        .join(", "),
    place =
      farmer?.vill ||
      [...new Set(rows.map((f) => f.vill).filter(Boolean))].join(", ") ||
      fields.i_kendra;
  return (
    <div className="sheet rcpt">
      <div className="rcpt-card">
        <div className="receipt-top">
          <span>GSTIN : 05CHXPS3134D1Z5</span>
          <span className="ttl">नकद प्राप्ति रसीद</span>
          <span>
            M. : 9899935600
            <br />
            6398264916
          </span>
        </div>
        <h1>बडोला मशरूम फार्म (कम्पोस्ट यूनिट)</h1>
        <div className="center bold">
          ग्राम प्रतापपुर – काशीपुर (उत्तराखण्ड)
        </div>
        <div className="receipt-date">
          <span>
            नं० <b>{receiptNo || "________"}</b>
          </span>
          <span>
            दिनांक <b>{fmtDate(fields.i_date) || "____________"}</b>
          </span>
        </div>
        <div className="receipt-body">
          नाम <b>{name || "____________________"}</b>
          <br />
          ग्राम <b>{place || "________________"}</b> से{" "}
          <b>
            {bags} बैग ({bags * (Number(fields.i_kg) || T.kg)} किग्रा)
          </b>{" "}
          {T.hi} मशरूम
          <br />
          कम्पोस्ट का भुगतान रुपया <b>{money(amt)}</b> ({hiWords(amt)})<br />
          प्राप्त किया ।
        </div>
        <div className="receipt-foot">
          {combined
            ? `कुल ${rows.length} कृषक · बिल सं० ${fields.i_invoice || "—"} · कुल बिल ₹${money(bags * rate)} का कृषक अंश ${farm}%`
            : `कृषक अंश ${farm}% · दर ₹${money((rate * farm) / 100)} प्रति बैग`}
        </div>
        <div className="receipt-sign">
          <b>For BADOLA MUSHROOMS FARM</b>
          <div>हस्ताक्षर (Authorised Signatory)</div>
        </div>
      </div>
    </div>
  );
}

export default function Mushroom() {
  const today = new Date().toISOString().slice(0, 10);
  const [mtype, setMtype] = useState("button");
  const [fields, setFields] = useState({
    i_rate: 126,
    i_kg: 10,
    i_sub: 80,
    i_gst: "0",
    i_kendra: "",
    i_office: "",
    i_year: "2026-27",
    i_date: today,
    i_supply: "",
    i_invoice: "",
    i_rcptno: "",
    i_billto: "",
    i_billaddr: "",
    i_rmode: "one",
    i_showstamp: true,
  });
  const [farmers, setFarmers] = useState(
    Array.from({ length: 5 }, () => ({
      name: "",
      vill: "",
      mob: "",
      adh: "",
      bags: 0,
    })),
  );
  const [vehicles, setVehicles] = useState([""]);
  const [letterVersion, setLetterVersion] = useState(0);
  const [records, setRecords] = useState([]);
  const [curRec, setCurRec] = useState(null);
  const [message, setMessage] = useState("");
  const [autoInv, setAutoInv] = useState(false);
  const [autoRcpt, setAutoRcpt] = useState(false);
  const [letterEdited, setLetterEdited] = useState(false);
  const fileRef = useRef(null);
  const backupRef = useRef(null);
  const updateField = (key, value) =>
    setFields((p) => ({ ...p, [key]: value }));
  const rows = useMemo(
    () =>
      mergeDuplicateFarmers(
        farmers.filter((f) => f.name || Number(f.bags) > 0),
      ),
    [farmers],
  );
  const rate = Number(fields.i_rate) || 0,
    subPct = Number(fields.i_sub) || 0,
    farmPct = 100 - subPct,
    perFarm = (rate * farmPct) / 100,
    perSub = (rate * subPct) / 100;
  const totals = useMemo(() => {
    const bags = rows.reduce((s, f) => s + (Number(f.bags) || 0), 0);
    return {
      bags,
      value: bags * rate,
      share: bags * perFarm,
      subsidy: bags * perSub,
    };
  }, [rows, rate, perFarm, perSub]);
  const snapshot = () => ({
    mtype,
    fields: { ...fields },
    farmers: farmers.map((f) => ({ ...f })),
    vehicles: vehicles.filter(Boolean),
    letter: "",
  });
  const flash = (msg) => {
    setMessage(msg);
    window.clearTimeout(flash.t);
    flash.t = window.setTimeout(() => setMessage(""), 4000);
  };
  useEffect(() => {
    try {
      const r = JSON.parse(localStorage.getItem(LS_RECORDS) || "[]");
      setRecords(Array.isArray(r) ? r : []);
      const d = JSON.parse(localStorage.getItem(LS_DRAFT) || "null");
      if (d?.farmers?.some((f) => f.name || f.bags)) {
        applyData(d, false);
        flash("पिछला अधूरा कार्य वापस लाया गया है।");
      }
    } catch (e) {
      console.error(e);
    }
  }, []);
  useEffect(() => {
    try {
      localStorage.setItem(LS_DRAFT, JSON.stringify(snapshot()));
    } catch (e) {}
  }, [mtype, fields, farmers, vehicles]);
  const applyData = (d, notify = true) => {
    if (!d) return;
    setMtype(d.mtype || "button");
    setFields((p) => ({ ...p, ...(d.fields || {}) }));
    setFarmers((d.farmers || []).length ? d.farmers : []);
    setVehicles(d.vehicles?.length ? d.vehicles : [""]);
    if (notify) flash("प्रविष्टि खोल दी गई।");
  };
  const pickType = (t) => {
    setMtype(t);
    setFields((p) => ({ ...p, i_rate: PRESET[t].rate, i_kg: PRESET[t].kg }));
  };
  const onKendra = (k) => {
    updateField("i_kendra", k);
    const list = DB[k];
    if (list && (!farmers.some((f) => f.name || f.bags) || farmers._auto)) {
      setFarmers(list.map((f) => ({ ...f })));
    }
  };
  const addFarmer = () =>
    setFarmers((p) => [
      ...p,
      { name: "", vill: "", mob: "", adh: "", bags: 0 },
    ]);
  const removeFarmer = (i) =>
    setFarmers((p) => p.filter((_, idx) => idx !== i));
  const addVehicle = () => setVehicles((p) => [...p, ""]);
  const removeVehicle = (i) =>
    setVehicles((p) => p.filter((_, idx) => idx !== i));
  const clearRows = () => {
    if (window.confirm("पूरी सूची खाली कर दी जाए?"))
      setFarmers(
        Array.from({ length: 3 }, () => ({
          name: "",
          vill: "",
          mob: "",
          adh: "",
          bags: 0,
        })),
      );
  };
  const loadKendra = () => {
    const list = DB[fields.i_kendra];
    if (!list)
      return window.alert("इस केन्द्र की सहेजी हुई सूची उपलब्ध नहीं है।");
    if (
      farmers.some((f) => f.name || f.bags) &&
      !window.confirm(
        `वर्तमान सूची हटाकर ${fields.i_kendra} के ${list.length} कृषक भरे जाएँ?`,
      )
    )
      return;
    setFarmers(list.map((f) => ({ ...f })));
  };
  const downloadJSON = (name, data) => {
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = name;
    a.click();
    URL.revokeObjectURL(url);
  };
  const saveJSON = () => downloadJSON("mushroom-form.json", snapshot());
  const loadJSON = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const r = new FileReader();
    r.onload = () => {
      try {
        applyData(JSON.parse(r.result));
      } catch {
        window.alert("सही JSON फ़ाइल चुनें।");
      }
    };
    r.readAsText(f);
    e.target.value = "";
  };
  const restoreBackup = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const r = new FileReader();
    r.onload = () => {
      try {
        const arr = JSON.parse(r.result);
        if (!Array.isArray(arr) || !arr.every((x) => x && x.id && x.data))
          throw Error();
        const ids = new Set(records.map((x) => x.id));
        const added = arr.filter((x) => !ids.has(x.id));
        const next = [...records, ...added].sort((a, b) =>
          (b.savedAt || "").localeCompare(a.savedAt || ""),
        );
        setRecords(next);
        localStorage.setItem(LS_RECORDS, JSON.stringify(next));
        flash(`${added.length} प्रविष्टियाँ बैकअप से जोड़ी गईं।`);
      } catch {
        window.alert("यह बैकअप फ़ाइल नहीं है।");
      }
    };
    r.readAsText(f);
    e.target.value = "";
  };
  const saveRecord = (asNew) => {
    if (!fields.i_kendra)
      return window.alert("पहले उद्यान सचल दल केन्द्र चुनें।");
    if (
      totals.bags <= 0 &&
      !window.confirm("इस प्रविष्टि में कोई बैग दर्ज नहीं है। फिर भी सहेजें?")
    )
      return;
    let workingFields = { ...fields };
    if (autoInv && fields.i_invoice) {
      workingFields.i_invoice = String(
        Number(fields.i_invoice) || fields.i_invoice,
      );
    }
    if (autoRcpt && fields.i_rcptno) {
      workingFields.i_rcptno = String(
        Number(fields.i_rcptno) || fields.i_rcptno,
      );
    }
    const d = { ...snapshot(), fields: workingFields },
      now = new Date().toISOString();
    let next = [...records];
    if (!asNew && curRec) {
      next = next.map((r) =>
        r.id === curRec ? { ...r, data: d, savedAt: now } : r,
      );
      flash("प्रविष्टि अद्यतन कर दी गई।");
    } else {
      const id = "rec_" + Date.now();
      next = [{ id, savedAt: now, data: d }, ...next];
      setCurRec(id);
      if (autoInv && Number(fields.i_invoice)) {
        const n = Number(fields.i_invoice) + 1;
        updateField("i_invoice", String(n));
      }
      if (autoRcpt && Number(fields.i_rcptno)) {
        const n = Number(fields.i_rcptno) + 1;
        updateField("i_rcptno", String(n));
      }
      flash("नई प्रविष्टि सहेज दी गई।");
    }
    setRecords(next);
    localStorage.setItem(LS_RECORDS, JSON.stringify(next));
  };
  const openRecord = (id) => {
    const r = records.find((x) => x.id === id);
    if (!r) return;
    if (
      farmers.some((f) => f.name || f.bags) &&
      !window.confirm("वर्तमान प्रपत्र हटाकर सहेजी गई प्रविष्टि खोली जाए?")
    )
      return;
    setCurRec(id);
    applyData(r.data);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const deleteRecord = (id) => {
    if (!window.confirm("यह प्रविष्टि स्थायी रूप से हटा दी जाए?")) return;
    const next = records.filter((r) => r.id !== id);
    setRecords(next);
    localStorage.setItem(LS_RECORDS, JSON.stringify(next));
    if (curRec === id) setCurRec(null);
  };
  const newEntry = () => {
    if (
      !window.confirm(
        "नया प्रपत्र शुरू किया जाए? वर्तमान अनसहेजा कार्य हट जाएगा।",
      )
    )
      return;
    setCurRec(null);
    localStorage.removeItem(LS_DRAFT);
    setMtype("button");
    setFields({
      i_rate: 126,
      i_kg: 10,
      i_sub: 80,
      i_gst: "0",
      i_kendra: "",
      i_office: "",
      i_year: "2026-27",
      i_date: new Date().toISOString().slice(0, 10),
      i_supply: "",
      i_invoice: "",
      i_rcptno: "",
      i_billto: "",
      i_billaddr: "",
      i_rmode: "one",
      i_showstamp: true,
    });
    setFarmers(
      Array.from({ length: 3 }, () => ({
        name: "",
        vill: "",
        mob: "",
        adh: "",
        bags: 0,
      })),
    );
    setVehicles([""]);
    setLetterEdited(false);
    setLetterVersion((v) => v + 1);
  };
  const backupAll = () => {
    if (!records.length)
      return window.alert("अभी कोई सहेजी गई प्रविष्टि नहीं है।");
    downloadJSON(
      `mushroom-backup-${new Date().toISOString().slice(0, 10)}.json`,
      records,
    );
    flash("बैकअप फ़ाइल बन गई।");
  };

  const printDoc = (which) => {
    if (
      totals.bags <= 0 &&
      ["voucher", "satyapan", "vendor", "invoice", "receipts"].includes(which)
    ) {
      if (!window.confirm("किसी बैग की प्रविष्टि नहीं है। फिर भी प्रिंट करें?"))
        return;
    }
    document.body.dataset.print = which;
    setTimeout(() => window.print(), 50);
  };
  useEffect(() => {
    const after = () => {
      delete document.body.dataset.print;
    };
    window.addEventListener("afterprint", after);
    return () => window.removeEventListener("afterprint", after);
  }, []);
  const data = { mtype, fields, farmers, vehicles: vehicles.filter(Boolean) };
  const receiptRows = rows.filter((f) => Number(f.bags) > 0);
  let receiptCounter = Number(fields.i_rcptno) || 0;
  const recSummary = records.map((r) => {
    const d = r.data,
      s = d.fields || {},
      fr = d.farmers || [],
      bags = fr.reduce((x, f) => x + (Number(f.bags) || 0), 0);
    return {
      ...r,
      bags,
      value: bags * (Number(s.i_rate) || 0),
      farmers: fr.filter((f) => f.name || f.bags).length,
      type: d.mtype === "oyster" ? "ऑयस्टर" : "बटन",
    };
  });
  return (
    <div className="mushroom-react-root">
      <div className="wrap no-print">
        <div className="panel">
          <h1>मशरूम कम्पोस्ट बैग — प्रपत्र प्रणाली</h1>
          <p className="sub">
            एक बार विवरण भरें — मांग-पत्र, समेकित पावती-पत्र, टैक्स इनवॉइस और
            नकद रसीद अपने आप तैयार हो जाएँगे।
          </p>
          <Legend>1 · मशरूम का प्रकार चुनें</Legend>
          <div className="types">
            {Object.entries(PRESET).map(([key, T]) => (
              <button
                type="button"
                key={key}
                className="type"
                data-on={mtype === key ? "1" : "0"}
                onClick={() => pickType(key)}
              >
                <input
                  type="radio"
                  name="mtype"
                  checked={mtype === key}
                  readOnly
                />
                <div>
                  <b>
                    {T.hi} मशरूम ({T.en})
                  </b>
                  <span>
                    बैग वजन {T.kg} किग्रा · पूर्ण दर ₹{T.rate} प्रति बैग
                  </span>
                </div>
              </button>
            ))}
          </div>
          <div className="grid" style={{ marginTop: 12 }}>
            <Field label="पूर्ण दर (₹ प्रति बैग)">
              <input
                type="number"
                value={fields.i_rate}
                min="0"
                step="0.01"
                onChange={(e) => updateField("i_rate", e.target.value)}
              />
            </Field>
            <Field label="बैग वजन (किग्रा)">
              <input
                type="number"
                value={fields.i_kg}
                min="0"
                step="0.5"
                onChange={(e) => updateField("i_kg", e.target.value)}
              />
            </Field>
            <Field label="अनुदान प्रतिशत (%)">
              <input
                type="number"
                value={fields.i_sub}
                min="0"
                max="100"
                onChange={(e) => updateField("i_sub", e.target.value)}
              />
            </Field>
            <Field label="जी०एस०टी० दर (%)">
              <select
                value={fields.i_gst}
                onChange={(e) => updateField("i_gst", e.target.value)}
              >
                <option value="0">0% (छूट प्राप्त)</option>
                <option value="5">5%</option>
                <option value="12">12%</option>
                <option value="18">18%</option>
              </select>
            </Field>
          </div>
          <Legend>2 · कार्यालय एवं आवेदन विवरण</Legend>
          <div className="grid">
            <Field label="उद्यान सचल दल केन्द्र (कुल 24)">
              <select
                value={fields.i_kendra}
                onChange={(e) => {
                  const k = e.target.value;
                  updateField("i_kendra", k);
                  if (DB[k] && !farmers.some((f) => f.name || f.bags))
                    setFarmers(DB[k].map((f) => ({ ...f })));
                }}
              >
                <option value="">— केन्द्र चुनें —</option>
                {KENDRAS.map((k) => (
                  <option key={k}>{k}</option>
                ))}
              </select>
            </Field>
            <Field label="कार्यालय / जनपद">
              <input
                type="text"
                value={fields.i_office}
                placeholder="उद्यान विशेषज्ञ कोटद्वार गढ़वाल (पौड़ी गढ़वाल)"
                onChange={(e) => updateField("i_office", e.target.value)}
              />
            </Field>
            <Field label="जिला योजना वर्ष">
              <input
                type="text"
                value={fields.i_year}
                onChange={(e) => updateField("i_year", e.target.value)}
              />
            </Field>
            <Field label="बिल दिनांक (Bill Date)">
              <input
                type="date"
                value={fields.i_date}
                onChange={(e) => updateField("i_date", e.target.value)}
              />
            </Field>
            <Field label="आपूर्ति दिनांक (Date of Supply / वितरण की तिथि)">
              <input
                type="text"
                value={fields.i_supply}
                placeholder="जैसे 23/08/2026 या 23/08/2026, 26/08/2026"
                onChange={(e) => updateField("i_supply", e.target.value)}
              />
            </Field>
            <Field label="बिल / इनवॉइस संख्या">
              <div className="inline-check">
                <input
                  type="checkbox"
                  checked={autoInv}
                  onChange={(e) => setAutoInv(e.target.checked)}
                />
                <span>स्वतः क्रमांक</span>
              </div>
              <input
                type="text"
                value={fields.i_invoice}
                placeholder="1272"
                onChange={(e) => updateField("i_invoice", e.target.value)}
              />
            </Field>
            <Field label="रसीद प्रारम्भिक संख्या">
              <div className="inline-check">
                <input
                  type="checkbox"
                  checked={autoRcpt}
                  onChange={(e) => setAutoRcpt(e.target.checked)}
                />
                <span>स्वतः क्रमांक</span>
              </div>
              <input
                type="number"
                value={fields.i_rcptno}
                placeholder="751"
                onChange={(e) => updateField("i_rcptno", e.target.value)}
              />
            </Field>
            <Field label="बिल किसके नाम (M/s)">
              <input
                type="text"
                value={fields.i_billto}
                placeholder="उद्यान विशेषज्ञ कोटद्वार गढ़वाल (पौड़ी गढ़वाल)"
                onChange={(e) => updateField("i_billto", e.target.value)}
              />
            </Field>
            <Field label="बिल पता">
              <input
                type="text"
                value={fields.i_billaddr}
                placeholder="उद्यान विशेषज्ञ कोटद्वार गढ़वाल (पौड़ी गढ़वाल)"
                onChange={(e) => updateField("i_billaddr", e.target.value)}
              />
            </Field>
            <Field label="नकद रसीद किस प्रकार बनें">
              <select
                value={fields.i_rmode}
                onChange={(e) => updateField("i_rmode", e.target.value)}
              >
                <option value="each">प्रति कृषक अलग रसीद</option>
                <option value="one">एक संयुक्त रसीद (कुल बिल का 20%)</option>
                <option value="both">दोनों — संयुक्त + प्रति कृषक</option>
              </select>
            </Field>
            <div className="full-note">
              <p className="hint">
                टैक्स इनवॉइस में क्रेता (M/s) सदैव उस केन्द्र के सभी कृषकों के
                नाम से एक साथ बनता है (विभाग की जगह), चाहे कृषक कितने भी क्यों न
                हों — पता (Address) में उनके सभी ग्राम। समेकित पावती-पत्र,
                विक्रेता का प्रमाण-पत्र, सत्यापन आख्या एवं नकद रसीदें भी उसी एक
                बिल के अनुसार सभी कृषकों को साथ लेकर बनती हैं।
              </p>
            </div>
            <div className="full-note">
              <label className="stamp-toggle">
                <input
                  type="checkbox"
                  checked={fields.i_showstamp !== false}
                  onChange={(e) => updateField("i_showstamp", e.target.checked)}
                />{" "}
                टैक्स इनवॉइस में कृषक-हस्ताक्षर वाली नीली मुहर (स्टाम्प) दिखाएँ
              </label>
            </div>
          </div>
          <Legend>2क · वाहन संख्या (टैक्स इनवॉइस हेतु, वैकल्पिक)</Legend>
          <div className="vehicle-list">
            {vehicles.map((v, i) => (
              <div className="vehicle-row" key={i}>
                <label>वाहन संख्या {i + 1} :</label>
                <input
                  type="text"
                  value={v}
                  placeholder="जैसे UP07 AB1234"
                  onChange={(e) =>
                    setVehicles((p) =>
                      p.map((x, j) =>
                        j === i ? e.target.value.toUpperCase() : x,
                      ),
                    )
                  }
                />
                <button
                  className="btn d"
                  type="button"
                  onClick={() => removeVehicle(i)}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
          <button className="btn s" type="button" onClick={addVehicle}>
            + वाहन जोड़ें (Add Vehicle)
          </button>
          <p className="hint">
            जितने वाहन नंबर भरे जाएँगे, टैक्स इनवॉइस में "Invoice No." के ठीक
            नीचे उतने ही दिखेंगे — ख़ाली बॉक्स इनवॉइस में नहीं छपेंगे।
          </p>
          <Legend>3 · कृषकों की सूची</Legend>
          <div className="table-scroll">
            <table className="entry">
              <thead>
                <tr>
                  <th>क्र०</th>
                  <th>कृषक का नाम</th>
                  <th>ग्राम</th>
                  <th>मोबाइल नंबर</th>
                  <th>आधार सं०</th>
                  <th style={{ width: 100 }}>बैग</th>
                  <th style={{ width: 44 }}>हटाएं</th>
                </tr>
              </thead>
              <tbody>
                {farmers.map((f, i) => (
                  <tr key={i}>
                    <td className="rowno">{i + 1}</td>
                    <td>
                      <input
                        type="text"
                        value={f.name}
                        placeholder="कृषक का नाम"
                        onChange={(e) =>
                          setFarmers((p) =>
                            p.map((x, j) =>
                              j === i ? { ...x, name: e.target.value } : x,
                            ),
                          )
                        }
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        value={f.vill}
                        placeholder="ग्राम"
                        onChange={(e) =>
                          setFarmers((p) =>
                            p.map((x, j) =>
                              j === i ? { ...x, vill: e.target.value } : x,
                            ),
                          )
                        }
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        value={f.mob}
                        inputMode="numeric"
                        maxLength={10}
                        placeholder="10 अंक"
                        onChange={(e) =>
                          setFarmers((p) =>
                            p.map((x, j) =>
                              j === i
                                ? {
                                    ...x,
                                    mob: e.target.value.replace(/\D/g, ""),
                                  }
                                : x,
                            ),
                          )
                        }
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        value={f.adh}
                        inputMode="numeric"
                        maxLength={14}
                        placeholder="12 अंक"
                        onChange={(e) =>
                          setFarmers((p) =>
                            p.map((x, j) =>
                              j === i
                                ? {
                                    ...x,
                                    adh: e.target.value.replace(/\D/g, ""),
                                  }
                                : x,
                            ),
                          )
                        }
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        value={f.bags}
                        min="0"
                        onChange={(e) =>
                          setFarmers((p) =>
                            p.map((x, j) =>
                              j === i ? { ...x, bags: e.target.value } : x,
                            ),
                          )
                        }
                      />
                    </td>
                    <td className="rowno">
                      <button
                        className="btn d"
                        type="button"
                        onClick={() => removeFarmer(i)}
                      >
                        ✕
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="bar">
            <button className="btn p" onClick={addFarmer}>
              + कृषक जोड़ें
            </button>
            {fields.i_kendra && DB[fields.i_kendra] && (
              <button className="btn s" onClick={loadKendra}>
                इस केन्द्र के {DB[fields.i_kendra].length} कृषक भरें
              </button>
            )}
            <button className="btn s" onClick={clearRows}>
              सूची खाली करें
            </button>
            <button className="btn s" onClick={saveJSON}>
              विवरण सहेजें (फ़ाइल)
            </button>
            <button className="btn s" onClick={() => fileRef.current?.click()}>
              सहेजी फ़ाइल खोलें
            </button>
            <input
              ref={fileRef}
              type="file"
              accept=".json"
              hidden
              onChange={loadJSON}
            />
            <input
              ref={backupRef}
              type="file"
              accept=".json"
              hidden
              onChange={restoreBackup}
            />
            <div className="tot">
              कुल बैग <b>{totals.bags}</b> · कुल मूल्य ₹{" "}
              <b>{money(totals.value)}</b> · किसान अंश ₹{" "}
              <b>{money(totals.share)}</b> · अनुदान ₹{" "}
              <b>{money(totals.subsidy)}</b>
            </div>
          </div>
          {totals.bags === 0 && (
            <div className="warn">
              कृपया कम से कम एक कृषक का नाम एवं बैग संख्या भरें।
            </div>
          )}
          <Legend>4 · प्रपत्र प्रिंट करें</Legend>
          <div className="printrow">
            <button className="btn p" onClick={() => printDoc("demand")}>
              मांग-पत्र
            </button>
            <button className="btn p" onClick={() => printDoc("voucher")}>
              समेकित पावती-पत्र (वितरण-सह-प्राप्ति)
            </button>
            <button className="btn p" onClick={() => printDoc("satyapan")}>
              सत्यापन आख्या (प्रभारी)
            </button>
            <button className="btn p" onClick={() => printDoc("vendor")}>
              विक्रेता का प्रमाण-पत्र
            </button>
            <button className="btn p" onClick={() => printDoc("invoice")}>
              टैक्स इनवॉइस
            </button>
            <button className="btn p" onClick={() => printDoc("receipts")}>
              नकद रसीदें (प्रति कृषक)
            </button>
            <button className="btn s" onClick={() => printDoc("all")}>
              सभी प्रपत्र
            </button>
            <button
              className="btn s"
              onClick={() => {
                setLetterEdited(false);
                setLetterVersion((v) => v + 1);
              }}
            >
              मांग-पत्र का पाठ रीसेट करें
            </button>
          </div>
          <p className="hint">
            प्रिंट विंडो में पेपर A4 और मार्जिन "Default" रखें। PDF बनाने हेतु
            Destination में "Save as PDF" चुनें।
          </p>
          <Legend>5 · सहेजी गई प्रविष्टियाँ ({records.length})</Legend>
          <div className="bar">
            <button className="btn p" onClick={() => saveRecord(true)}>
              इस केन्द्र की प्रविष्टि सहेजें
            </button>
            {curRec && (
              <button className="btn p" onClick={() => saveRecord(false)}>
                खुली प्रविष्टि अद्यतन करें
              </button>
            )}
            <button className="btn s" onClick={newEntry}>
              नया प्रपत्र
            </button>
            <button className="btn s" onClick={backupAll}>
              सभी का बैकअप फ़ाइल में
            </button>
            <button
              className="btn s"
              onClick={() => backupRef.current?.click()}
            >
              बैकअप फ़ाइल से वापस लाएँ
            </button>
            <span className="tot">डेटा इसी कंप्यूटर में सुरक्षित</span>
          </div>
          {message && <div className="rec-msg">{message}</div>}
          <div className="table-scroll">
            <table className="entry">
              <thead>
                <tr>
                  <th>केन्द्र</th>
                  <th>दिनांक</th>
                  <th>बिल सं०</th>
                  <th>प्रकार</th>
                  <th>कृषक</th>
                  <th>बैग</th>
                  <th>कुल मूल्य</th>
                  <th>क्रिया</th>
                </tr>
              </thead>
              <tbody>
                {recSummary.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="empty-record">
                      अभी कोई प्रविष्टि सहेजी नहीं गई है।
                    </td>
                  </tr>
                ) : (
                  recSummary.map((r) => (
                    <tr
                      key={r.id}
                      className={r.id === curRec ? "current-record" : ""}
                    >
                      <td>
                        <b>{r.data.fields.i_kendra || "—"}</b>
                        {r.id === curRec && (
                          <span className="open-label"> (खुली हुई)</span>
                        )}
                      </td>
                      <td>{fmtDate(r.data.fields.i_date) || "—"}</td>
                      <td>{r.data.fields.i_invoice || "—"}</td>
                      <td>{r.type}</td>
                      <td className="c">{r.farmers}</td>
                      <td className="c">{r.bags}</td>
                      <td className="r">₹ {money(r.value)}</td>
                      <td>
                        <button
                          className="btn s mini"
                          onClick={() => openRecord(r.id)}
                        >
                          खोलें
                        </button>
                        <button
                          className="btn d"
                          onClick={() => deleteRecord(r.id)}
                        >
                          ✕
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <p className="hint">
            हर केन्द्र का काम पूरा कर के "प्रविष्टि सहेजें" दबाएँ, फिर "नया
            प्रपत्र" से अगला केन्द्र शुरू करें। सहेजी गई प्रविष्टि कभी भी
            "खोलें" दबाकर वापस लाई और दोबारा प्रिंट की जा सकती है।
          </p>
          <p className="hint">
            बिल/रसीद संख्या के सामने "स्वतः क्रमांक" चुनने से पहले शुरुआती नंबर
            भर दें — फिर हर नई सहेजी गई प्रविष्टि पर संख्या अपने-आप अगली बढ़
            जाएगी।
          </p>
        </div>
      </div>
      <div className="print-area">
        <DemandSheet data={data} letterVersion={letterVersion} />
        <VoucherSheet data={data} />
        <VendorSheet data={data} />
        <SatyapanSheet data={data} />
        <InvoiceSheet data={data} />
        {(fields.i_rmode === "one" || fields.i_rmode === "both") &&
          totals.bags > 0 && (
            <ReceiptSheet data={data} combined receiptNo={receiptCounter++} />
          )}
        {(fields.i_rmode === "each" || fields.i_rmode === "both") &&
          receiptRows.map((f, i) => (
            <ReceiptSheet
              key={`r-${i}`}
              data={data}
              farmer={f}
              receiptNo={receiptCounter + i}
            />
          ))}
      </div>
    </div>
  );
}
