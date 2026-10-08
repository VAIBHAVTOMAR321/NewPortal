import React, { useEffect, useMemo, useState } from "react";
import "./MushroomDocumentTemplates.css";

const MUSHROOM_DOCUMENT_TEMPLATE_TYPES = [
  { value: "demand_patra", label: "मांग-पत्र" },
  { value: "combined_receipt", label: "समेकित पावती-पत्र" },
  { value: "verification_report", label: "सत्यापन आख्या" },
  { value: "supplier_certificate", label: "विक्रेता प्रमाण-पत्र" },
];

const getMushroomApiBase = () => {
  if (typeof window === "undefined") return "/api";
  const hostname = window.location.hostname;
  const isLocalhost = hostname === "localhost" || hostname === "127.0.0.1";
  return isLocalhost
    ? "/api"
    : "https://mahadevaaya.com/dhokotdwarproject2/dhokotdwarproject2_backend/api";
};

const MUSHROOM_DOCUMENT_TEMPLATE_API_URL =
  getMushroomApiBase() + "/mushroom-document-template/";
const MUSHROOM_COMPANY_DETAILS_API_URL =
  getMushroomApiBase() + "/company-details/";

function getCsrfTokenFromCookie() {
  if (typeof document === "undefined") return "";
  const match = document.cookie.match(/(?:^|;\s*)csrftoken=([^;]+)/);
  return match ? decodeURIComponent(match[1]) : "";
}

async function ensureMushroomCsrfToken() {
  let csrf = getCsrfTokenFromCookie();
  if (csrf) return csrf;

  try {
    const response = await fetch(getMushroomApiBase(), {
      method: "GET",
      credentials: "include",
      headers: { Accept: "application/json" },
    });
    if (!response.ok) {
      console.warn("Mushroom template CSRF bootstrap request failed:", response.status);
    }
    csrf = getCsrfTokenFromCookie();
    return csrf;
  } catch (error) {
    console.error("Mushroom template CSRF bootstrap error:", error);
    return "";
  }
}

async function mushroomTemplateFetch(url, options = {}, allowRefresh = true) {
  const method = String(options.method || "GET").toUpperCase();
  const headers = new Headers(options.headers || {});
  headers.set("Accept", "application/json");
  if (["POST", "PUT", "PATCH", "DELETE"].includes(method)) {
    const csrf = await ensureMushroomCsrfToken();
    if (csrf) headers.set("X-CSRFToken", csrf);
  }

  const response = await fetch(url, {
    ...options,
    method,
    headers,
    credentials: "include",
  });

  if (response.status === 401 && allowRefresh && !url.endsWith("/refresh-token/")) {
    try {
      const refreshResponse = await fetch(getMushroomApiBase() + "/refresh-token/", {
        method: "POST",
        credentials: "include",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "X-CSRFToken": getCsrfTokenFromCookie(),
        },
        body: JSON.stringify({}),
      });
      if (refreshResponse.ok) {
        return mushroomTemplateFetch(url, options, false);
      }
    } catch (error) {
      console.error("Mushroom template auth refresh failed:", error);
    }
  }

  return response;
}

function extractMushroomApiError(text, fallback) {
  const rawText = (text || "").trim();
  if (!rawText) return fallback;

  try {
    const parsed = JSON.parse(rawText);
    const message =
      parsed?.detail || parsed?.message || parsed?.error || parsed?.non_field_errors;
    if (typeof message === "string") return message;
    if (Array.isArray(message) && message.length > 0) {
      return message
        .map((item) => (typeof item === "string" ? item : JSON.stringify(item)))
        .join(" ");
    }
    const fieldErrors = Object.entries(parsed || {})
      .filter(([, value]) => typeof value === "string" || Array.isArray(value))
      .map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(" ") : value}`);
    if (fieldErrors.length > 0) return fieldErrors.join(" | ");
  } catch {
    return rawText;
  }

  return rawText;
}

export function replaceTemplatePlaceholders(value, context = {}) {
  if (value === null || value === undefined) return "";
  if (typeof value !== "string") return value;

  return value.replace(/\{\{\s*([\w.\-]+)\s*\}\}/g, (match, key) => {
    const path = key.split(".");
    let current = context;

    for (const segment of path) {
      if (current === null || current === undefined) return "";
      current = current[segment];
    }

    if (current === null || current === undefined) return "";
    return String(current);
  });
}

// Ensure default keys exist and provide the exact default text for 'मांग-पत्र'
function normalizeTemplateContent(content, docType = "") {
  let parsedContent = content;

  if (typeof parsedContent === "string") {
    try {
      parsedContent = JSON.parse(parsedContent);
    } catch {
      throw new Error("Template content must be a valid JSON object.");
    }
  }

  if (
    parsedContent === null ||
    typeof parsedContent !== "object" ||
    Array.isArray(parsedContent)
  ) {
    throw new Error("Template content must be a JSON object.");
  }

  // Provide default keys to avoid structure breakage on update
  return {
    title: "",
    to: "",
    through: "",
    subject: "",
    salutation: "महोदय,",
    body: "",
    paragraphs: [],
    attachments_heading: "",
    attachments: [],
    payment_request: "",
    recommendation_heading: "प्रभारी की संस्तुति एवं अग्रसारण",
    recommendation_body: "",
    payment_mode: "",
    signature_label: "हस्ताक्षर प्रभारी: _____________________",
    ...parsedContent,
  };
}

function getMushroomTemplateKey(templateRecord) {
  return templateRecord.id != null
    ? String(templateRecord.id)
    : `${templateRecord.document_type}:${templateRecord.doc_name}`;
}

function formatTemplateDate(value) {
  if (!value) return "";
  return String(value)
    .split(",")
    .map((date) => {
      const [year, month, day] = date.trim().split("-");
      return year && month && day ? `${day}/${month}/${year}` : date.trim();
    })
    .join(", ");
}

function formatTemplateCurrency(value) {
  return (Number(value) || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function buildMushroomTemplateContext(formSnapshot = {}, companyDetails = {}) {
  const fields = formSnapshot.fields || {};
  const farmers = Array.isArray(formSnapshot.farmers) ? formSnapshot.farmers : [];
  const ratePerBag = Number.parseFloat(fields.i_rate) || 0;
  const subsidyPercentage = Number.parseFloat(fields.i_sub) || 0;
  const farmerSharePercentage = Math.max(0, 100 - subsidyPercentage);
  const farmerSharePerBag = ratePerBag * (farmerSharePercentage / 100);
  const subsidyPerBag = ratePerBag * (subsidyPercentage / 100);
  
  const templateFarmers = farmers
    .filter(
      (farmer) =>
        farmer?.name ||
        farmer?.vill ||
        farmer?.village ||
        (Number.parseInt(farmer?.bags, 10) || 0) > 0,
    )
    .map((farmer) => ({
      ...farmer,
      village: farmer?.village || farmer?.vill || "",
      mobile: farmer?.mobile || farmer?.mob || "",
      aadhaar: farmer?.aadhaar || farmer?.adh || "",
      bags: Number.parseInt(farmer?.bags, 10) || 0,
      weight_kg:
        (Number.parseInt(farmer?.bags, 10) || 0) *
        (Number.parseFloat(fields.i_kg) || 0),
      farmer_share: (Number.parseInt(farmer?.bags, 10) || 0) * farmerSharePerBag,
      subsidy_amount: (Number.parseInt(farmer?.bags, 10) || 0) * subsidyPerBag,
    }));
    
  const totalBags = templateFarmers.reduce((sum, farmer) => sum + farmer.bags, 0);
  const totalAmount = totalBags * ratePerBag;
  const subsidyTotal = totalAmount * (subsidyPercentage / 100);
  const farmerShareTotal = totalAmount * (farmerSharePercentage / 100);
  const gstPercentage = Number.parseFloat(fields.i_gst) || 0;
  const cgstTotal = (totalAmount * gstPercentage) / 200;
  const sgstTotal = cgstTotal;
  const grandTotal = totalAmount + cgstTotal + sgstTotal;
  const totalWeightKg = totalBags * (Number.parseFloat(fields.i_kg) || 0);
  
  const mushroomType =
    formSnapshot.mtype === "button"
      ? "Button Mushroom"
      : formSnapshot.mtype === "oyster"
        ? "Oyster Mushroom"
        : fields.i_mtype || "";
        
  const mushroomTypeHindi =
    formSnapshot.mtype === "button" ? "बटन" : formSnapshot.mtype === "oyster" ? "ऑयस्टर" : "";

  const context = {
    ...fields,
    fields,
    form_fields: fields,
    farmers: templateFarmers,
    vehicles: Array.isArray(formSnapshot.vehicles) ? formSnapshot.vehicles : [],
    rate_per_bag: ratePerBag,
    kg_per_bag: Number.parseFloat(fields.i_kg) || 0,
    gst_percentage: gstPercentage,
    farmer_share_per_bag: farmerSharePerBag,
    subsidy_per_bag: subsidyPerBag,
    total_weight_kg: totalWeightKg,
    farmer_count: templateFarmers.filter((farmer) => farmer.bags > 0).length,
    taxable_amount: totalAmount,
    cgst_percentage: gstPercentage / 2,
    sgst_percentage: gstPercentage / 2,
    cgst_total: cgstTotal,
    sgst_total: sgstTotal,
    grand_total: grandTotal,
    total_amount_formatted: formatTemplateCurrency(totalAmount),
    farmer_share_total_formatted: formatTemplateCurrency(farmerShareTotal),
    subsidy_total_formatted: formatTemplateCurrency(subsidyTotal),
    grand_total_formatted: formatTemplateCurrency(grandTotal),
    bill_date_display: formatTemplateDate(fields.i_date),
    date_of_supply_display: formatTemplateDate(fields.i_supply),
    receipt_number: fields.i_rcptno || "",
    bill_to: fields.i_billto || "",
    bill_address: fields.i_billaddr || "",
    bill_number: fields.i_invoice || "",
    bill_date: fields.i_date || "",
    mushroom_type: mushroomType,
    mushroom_type_hindi: mushroomTypeHindi,
    total_bags: totalBags,
    date_of_supply: fields.i_supply || "",
    farmer_share_percentage: farmerSharePercentage,
    farmer_share_total: farmerShareTotal,
    total_amount: totalAmount,
    subsidy_total: subsidyTotal,
    subsidy_amount_in_words: numberToWords(subsidyTotal),
    subsidy_percentage: subsidyPercentage,
    kendra_name: fields.i_kendra || "",
    office_name: fields.i_office || "",
    financial_year: fields.i_year || "",
    ...companyDetails,
  };

  context.company_name = companyDetails.company_name || companyDetails.name || "BADOLA MUSHROOMS FARM";
  context.company_address =
    companyDetails.company_address ||
    companyDetails.address ||
    "H.O.-Dhanori Patti, D.P.S. Road, Kashipur (U.S. Nagar) U.K.";
  context.payment_mode = companyDetails.payment_mode || "";

  return context;
}

function toWords(value) {
  const safeValue = Number(value) || 0;
  if (safeValue === 0) return "शून्य";

  const ones = ["", "एक", "दो", "तीन", "चार", "पाँच", "छः", "सात", "आठ", "नौ"];
  const teens = ["दस", "ग्यारह", "बारह", "तेरह", "चौदह", "पन्द्रह", "सोलह", "सत्रह", "अट्ठारह", "उन्नीस"];
  const tens = ["", "", "बीस", "तीस", "चालीस", "पचास", "साठ", "सत्तर", "अस्सी", "नब्बे"];

  const convertUnderHundred = (num) => {
    if (num < 10) return ones[num];
    if (num < 20) return teens[num - 10];
    const ten = Math.floor(num / 10);
    const rem = num % 10;
    if (rem === 0) return tens[ten];
    return `${tens[ten]} ${ones[rem]}`;
  };

  const convertUnderThousand = (num) => {
    if (num < 100) return convertUnderHundred(num);
    const hundred = Math.floor(num / 100);
    const rem = num % 100;
    if (rem === 0) return `${ones[hundred]} सौ`;
    return `${ones[hundred]} सौ ${convertUnderHundred(rem)}`;
  };

  const lakhs = Math.floor(safeValue / 100000);
  const remainder = safeValue % 100000;
  if (lakhs > 0) {
    return `${convertUnderThousand(lakhs)} लाख ${convertUnderThousand(remainder)}`.trim();
  }
  return convertUnderThousand(safeValue);
}

function numberToWords(value) {
  const numericValue = Number(value) || 0;
  return `${toWords(Math.round(numericValue))} रुपये`;
}

function renderDynamicText(text, context) {
  if (typeof text !== "string") return "";

  return text.replace(/\{\{\s*([\w.\-:]+)\s*\}\}/g, (match, key) => {
    const fwMatch = key.match(/^(fw-(light|normal|medium|semibold|bold|extrabold|black)):(.+)$/);
    if (fwMatch) {
      const fwClass = fwMatch[1];
      const actualKey = fwMatch[3];
      const path = actualKey.split(".");
      let current = context;

      for (const segment of path) {
        if (current === null || current === undefined) return "";
        current = current[segment];
      }

      if (current === null || current === undefined) return "";
      return `<span class="template-dynamic ${fwClass}">${String(current)}</span>`;
    }

    const path = key.split(".");
    let current = context;

    for (const segment of path) {
      if (current === null || current === undefined) return "";
      current = current[segment];
    }

    if (current === null || current === undefined) return "";
    return String(current);
  });
}

// Updated to handle line breaks properly
function SafeDynamicText({ text, context }) {
  let rendered = renderDynamicText(text, context);
  rendered = rendered.replace(/\n/g, "<br />");
  return <span dangerouslySetInnerHTML={{ __html: rendered }} />;
}

function renderTemplateValue(value, context, keyPrefix = "value") {
  if (value === null || value === undefined) return null;

  if (typeof value === "string") {
    return <p key={keyPrefix}><SafeDynamicText text={value} context={context} /></p>;
  }

  if (Array.isArray(value)) {
    return value.map((item, index) => (
      <p key={`${keyPrefix}-${index}`}>
        {typeof item === "string"
          ? <SafeDynamicText text={item} context={context} />
          : renderTemplateValue(item, context, `${keyPrefix}-${index}`)}
      </p>
    ));
  }

  if (typeof value === "object") {
    return Object.entries(value).map(([nestedKey, nestedValue]) => (
      <div key={`${keyPrefix}-${nestedKey}`} className="template-block">
        {nestedKey === "title" || nestedKey === "heading" ? (
          <h4><SafeDynamicText text={String(nestedValue)} context={context} /></h4>
        ) : (
          <>
            <strong>{nestedKey}</strong>
            {renderTemplateValue(nestedValue, context, `${keyPrefix}-${nestedKey}`)}
          </>
        )}
      </div>
    ));
  }

  return <span key={keyPrefix}>{String(value)}</span>;
}

function renderTemplateContent(content, context, docType = "") {
  if (!content || typeof content !== "object") return null;

  const renderSection = (label, value) => {
    if (value === undefined || value === null || value === "") return null;
    return (
      <div className="template-section" key={label}>
        {typeof value === "string" ? (
          <p><SafeDynamicText text={value} context={context} /></p>
        ) : Array.isArray(value) ? (
          value.map((item, index) => (
            <p key={`${label}-${index}`}>
              {typeof item === "string"
                ? <SafeDynamicText text={item} context={context} />
                : renderTemplateValue(item, context, `${label}-${index}`)}
            </p>
          ))
        ) : (
          renderTemplateValue(value, context, label)
        )}
      </div>
    );
  };

  const orderedKeys = [
    "title",
    "to",
    "through",
    "subject",
    "salutation",
    "body",
    "paragraphs",
    "payment_request",
    "recommendation_heading",
    "recommendation_body",
    "attachments_heading",
    "attachments",
    "payment_mode",
    "signature_label",
  ];

  const displayedContent = [];

  for (const key of orderedKeys) {
    if (Object.prototype.hasOwnProperty.call(content, key)) {
      const value = content[key];
      if (value === null || value === undefined || (typeof value === "string" && value.trim() === "")) continue;

      if (key === "title") {
        displayedContent.push(
          <h3 key={key} className="template-title">
            <SafeDynamicText text={String(value)} context={context} />
          </h3>
        );
        continue;
      }

      if (key === "to") {
        displayedContent.push(
          <p key={key} className="template-to">
            सेवा में,<br /><SafeDynamicText text={String(value)} context={context} />
          </p>
        );
        continue;
      }

      if (key === "through") {
        displayedContent.push(
          <p key={key} className="template-through">
            द्वारा: <SafeDynamicText text={String(value)} context={context} />
          </p>
        );
        continue;
      }

      if (key === "subject") {
        displayedContent.push(
          <p key={key} className="template-subject">
            <b>विषय: <SafeDynamicText text={String(value)} context={context} /></b>
          </p>
        );
        continue;
      }

      if (key === "salutation") {
        displayedContent.push(
          <p key={key} className="template-salutation">
            <SafeDynamicText text={String(value)} context={context} />
          </p>
        );
        continue;
      }

      if (key === "body") {
        displayedContent.push(
          <p key={key} className="template-body">
            <SafeDynamicText text={String(value)} context={context} />
          </p>
        );
        continue;
      }

      if (key === "paragraphs" && Array.isArray(value)) {
        displayedContent.push(
          <div key={key} className="template-paragraphs">
            {value.map((item, index) => (
              <p key={`${key}-${index}`}>
                <SafeDynamicText text={String(item)} context={context} />
              </p>
            ))}
          </div>
        );
        continue;
      }

      if (key === "attachments" && Array.isArray(value)) {
        const hasItems = value.length > 0;
        const hasHeading = content.attachments_heading && String(content.attachments_heading).trim() !== "";
        if (!hasItems && !hasHeading) continue;
        
        displayedContent.push(
          <div key={key} className="template-attachments">
            {hasHeading && (
              <p className="template-attachments-heading">
                <SafeDynamicText text={String(content.attachments_heading)} context={context} />
              </p>
            )}
            <ul>
              {value.map((item, index) => (
                <li key={`${key}-${index}`}><SafeDynamicText text={String(item)} context={context} /></li>
              ))}
            </ul>
          </div>
        );
        continue;
      }

      if (typeof value === "string" || Array.isArray(value) || (typeof value === "object" && value !== null)) {
        displayedContent.push(renderSection(key, value));
      }
    }
  }

  Object.entries(content).forEach(([key, value]) => {
    if (
      !orderedKeys.includes(key) &&
      (typeof value === "string" || Array.isArray(value) || (typeof value === "object" && value !== null))
    ) {
      displayedContent.push(renderSection(key, value));
    }
  });

  return displayedContent;
}

// Default content specifically for 'मांग-पत्र' to match your requested template
const getDefaultDemandPatraContent = () => ({
  to: "उद्यान विशेषज्ञ कोटद्वार गढ़वाल (पौड़ी गढ़वाल)",
  through: "प्रभारी, उद्यान सचल दल केन्द्र, {{kendra_name}}",
  subject: "कृषकों द्वारा {{subsidy_percentage}}% अनुदान पर बिजाई युक्त कम्पोस्ट बैग उपलब्ध कराए जाने के सम्बन्ध में।",
  salutation: "महोदय,",
  paragraphs: [
    "सविनय निवेदन है कि हम क्षेत्र के इच्छुक कृषक स्वरोजगार एवं आजीविका संवर्धन के उद्देश्य से {{mushroom_type_hindi}} मशरूम ({{mushroom_type}}) की खेती करना चाहते हैं। इस हेतु हमें जिला योजना वर्ष {{financial_year}} के अन्तर्गत {{subsidy_percentage}}% अनुदान पर बिजाई युक्त कम्पोस्ट बैग की आवश्यकता है।",
    "हम सभी कृषक आर्थिक रूप से कमजोर एवं सीमित साधनों वाले हैं तथा कम्पोस्ट बैग की कुल देय राशि का भुगतान एक साथ करने में सक्षम नहीं हैं। अतः उक्त योजना के अन्तर्गत {{subsidy_percentage}}% अनुदान पर बिजाई युक्त कम्पोस्ट बैग उपलब्ध कराए जाने हेतु यह अनुरोध प्रस्तुत किया जा रहा है।",
    "कम्पोस्ट बैग की निर्धारित दर ₹{{rate_per_bag}}.00 प्रति बैग के अनुसार कृषकों द्वारा {{farmer_share_percentage}}% अंशदान ₹{{farmer_share_per_bag}} प्रति बैग स्वयं वहन किया जाएगा। शेष {{subsidy_percentage}}% राजसहायता ₹{{subsidy_per_bag}} प्रति बैग का लाभ कृषकों को \"इन-काइंड सब्सिडी (In-kind Subsidy)\" के रूप में कम्पोस्ट बैग की आपूर्ति के माध्यम से प्रदान किए जाने तथा अनुदान की समतुल्य राशि संबंधित आपूर्तिकर्ता को सीधे e-Payment के माध्यम से भुगतान किए जाने का अनुरोध है।",
    "इस सम्बन्ध में हमारे द्वारा मैसर्स बडोला मशरूम फार्म, काशीपुर, ऊधम सिंह नगर से संपर्क किया गया। साथ ही अन्य फर्मों से भी जानकारी प्राप्त की गई। अन्य फर्मों द्वारा ग्राम स्तर तक कम्पोस्ट बैग पहुँचाने हेतु परिवहन/डिलीवरी शुल्क अलग से लिये जाने की जानकारी दी गई, जबकि मैसर्स बडोला मशरूम फार्म द्वारा विभागीय निर्धारित दर ₹{{rate_per_bag}}.00 प्रति बैग पर बिना किसी अतिरिक्त परिवहन/डिलीवरी शुल्क के ग्राम स्तर तक बिजाई युक्त कम्पोस्ट बैग उपलब्ध कराने की सहमति दी गई है। अतः कृषकों की सहमति से उक्त फर्म से कम्पोस्ट बैग क्रय किए जाने का अनुरोध किया जा रहा है।",
    "उक्त आपूर्तिकर्ता फर्म शेष देय धनराशि का भुगतान विभाग में बजट उपलब्ध होने पर प्राप्त करने हेतु सहमत है।",
    "अतः महोदय से निवेदन है कि हमारे अनुरोध पत्र के आधार पर मैसर्स बडोला मशरूम फार्म, काशीपुर, ऊधम सिंह नगर से विभागीय निर्धारित दर ₹{{rate_per_bag}}.00 प्रति बैग पर बिजाई युक्त कम्पोस्ट बैग क्रय किए जाने की स्वीकृति प्रदान करने की कृपा कीजिएगा तथा विभागीय स्वीकृति के उपरान्त संबंधित आपूर्तिकर्ता द्वारा प्रस्तुत देयक के आधार पर विभागीय स्वीकृत दर के अनुसार देय {{subsidy_percentage}}% राजसहायता की धनराशि संबंधित आपूर्तिकर्ता फर्म को भुगतान हेतु अवमुक्त किए जाने की कृपा कीजिएगा।"
  ],
  attachments_heading: "",
  attachments: [],
  recommendation_heading: "प्रभारी की संस्तुति एवं अग्रसारण",
  recommendation_body: "सम्बन्धित कृषकों के अनुरोध के क्रम में, उक्त {{mushroom_type_hindi}} मशरूम की खेती हेतु बिजाई युक्त कम्पोस्ट बैग की मांग संस्तुति सहित सादर अग्रसारित है। कृपया कृषकों को उक्त बैग क्रय किए जाने की स्वीकृति प्रदान करने की कृपा कीजियेगा।",
  signature_label: "हस्ताक्षर प्रभारी: _____________________"
});

export default function MushroomDocumentTemplateManager({
  documentType = "verification_report",
  docName = "",
  formSnapshot,
  companyDetails = {},
  previewOnly = false,
}) {
  const [templates, setTemplates] = useState([]);
  const [selectedDocumentTypes, setSelectedDocumentTypes] = useState([documentType]);
  const [selectedTemplateId, setSelectedTemplateId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [companyDetailsState, setCompanyDetailsState] = useState(companyDetails);
  
  const [editorForm, setEditorForm] = useState({
    id: null,
    document_type: documentType,
    doc_name: "",
    content: normalizeTemplateContent(getDefaultDemandPatraContent()),
    is_active: true,
  });
  
  const [saveState, setSaveState] = useState({ message: "", isError: false, isSaving: false });

  const defaultSnapshot = useMemo(() => {
    if (typeof window === "undefined") return {};
    const currentSnapshot = window.getSnapshot ? window.getSnapshot() : null;
    return currentSnapshot || {};
  }, []);

  const [liveSnapshot, setLiveSnapshot] = useState(defaultSnapshot);

  useEffect(() => {
    if (formSnapshot) return undefined;
    if (typeof window === "undefined") return undefined;

    let lastSerializedSnapshot = JSON.stringify(defaultSnapshot);

    const syncSnapshot = () => {
      if (typeof window.getSnapshot !== "function") return;
      const nextSnapshot = window.getSnapshot() || {};
      const serializedSnapshot = JSON.stringify(nextSnapshot);
      if (serializedSnapshot === lastSerializedSnapshot) return;
      lastSerializedSnapshot = serializedSnapshot;
      setLiveSnapshot(nextSnapshot);
    };

    const intervalId = window.setInterval(syncSnapshot, 1000);
    window.addEventListener("focus", syncSnapshot);

    return () => {
      window.clearInterval(intervalId);
      window.removeEventListener("focus", syncSnapshot);
    };
  }, [previewOnly, formSnapshot]);

  const resetEditorForm = (nextDocumentType = selectedDocumentTypes[0]) => {
    const isDemandPatra = nextDocumentType === "demand_patra";
    const freshForm = {
      id: null,
      document_type: nextDocumentType,
      doc_name: "",
      content: normalizeTemplateContent(isDemandPatra ? getDefaultDemandPatraContent() : {}),
      is_active: true,
    };
    setEditorForm(freshForm);
  };

  const hydrateEditorForm = (template) => {
    if (!template) {
      resetEditorForm(selectedDocumentTypes[0]);
      return;
    }

    let content;
    try {
      content = normalizeTemplateContent(template.content || {});
    } catch (contentError) {
      console.error("Invalid mushroom template content:", contentError);
      setError(contentError.message);
      return;
    }
    
    if (template.document_type === "demand_patra") {
      const defaults = getDefaultDemandPatraContent();
      content = {
        ...defaults,
        ...content,
        attachments_heading: "",
        attachments: [],
        paragraphs: content.paragraphs?.length ? content.paragraphs : defaults.paragraphs
      };
    }

    const nextForm = {
      id: template.id || null,
      document_type: template.document_type || selectedDocumentTypes[0],
      doc_name: template.doc_name || "",
      content,
      is_active: template.is_active !== false,
    };

    setEditorForm(nextForm);
  };

  useEffect(() => {
    setSelectedDocumentTypes((prev) => {
      if (!templates.length) return prev;
      const availableTypes = resolveAvailableDocumentTypes(templates);
      const validTypes = prev.filter((t) => availableTypes.includes(t));
      if (validTypes.length > 0) return validTypes;
      return availableTypes.length > 0 ? [availableTypes[0]] : prev;
    });
  }, [documentType, templates]);

  const resolveAvailableDocumentTypes = (list) =>
    Array.from(
      new Set(
        list
          .map((item) => item.document_type)
          .filter((type) => typeof type === "string" && type.trim()),
      ),
    );

  const loadTemplates = async ({ silent = false } = {}) => {
    if (!silent) setLoading(true);
    setError("");

    try {
      const response = await mushroomTemplateFetch(MUSHROOM_DOCUMENT_TEMPLATE_API_URL, {
        method: "GET",
      });

      const text = await response.text();
      if (!response.ok) {
        throw new Error(extractMushroomApiError(text, "Unable to load mushroom document templates."));
      }

      const payload = JSON.parse(text);
      const data = Array.isArray(payload?.data) ? payload.data : [];
      setTemplates(data);

      setSelectedDocumentTypes((previousTypes) => {
        if (!data.length) return previousTypes;

        const savedTypes = resolveAvailableDocumentTypes(data);
        const validTypes = previousTypes.filter((t) => savedTypes.includes(t));
        if (validTypes.length > 0) return validTypes;

        return [
          (docName && data.find((item) => item.doc_name === docName)?.document_type) ||
          savedTypes[0] ||
          data[0]?.document_type ||
          previousTypes[0],
        ];
      });
    } catch (loadError) {
      console.error("Mushroom document template fetch error:", loadError);
      setError(loadError.message || "Failed to load templates.");
    } finally {
      if (!silent) setLoading(false);
    }
  };

  useEffect(() => {
    loadTemplates();
  }, [docName]);

  useEffect(() => {
    if (!previewOnly) return undefined;

    const refreshTemplates = () => {
      loadTemplates({ silent: true });
    };

    const intervalId = window.setInterval(refreshTemplates, 30000);
    window.addEventListener("focus", refreshTemplates);

    return () => {
      window.clearInterval(intervalId);
      window.removeEventListener("focus", refreshTemplates);
    };
  }, [previewOnly]);

  useEffect(() => {
    const loadCompanyDetails = async () => {
      try {
        const response = await mushroomTemplateFetch(MUSHROOM_COMPANY_DETAILS_API_URL, {
          method: "GET",
        });
        const payload = response.ok ? await response.json() : null;
        if (payload?.data) {
          setCompanyDetailsState(payload.data);
        }
      } catch (error) {
        console.error("Company details fetch error:", error);
      }
    };

    loadCompanyDetails();
  }, []);

  useEffect(() => {
    if (templates.length > 0) {
      const currentTemplate =
        templates.find((item) => item.document_type === selectedDocumentTypes[0]) ||
        templates.find((item) => item.doc_name === docName) ||
        templates.find((item) => item.is_active !== false) ||
        templates[0];

      if (currentTemplate) {
        hydrateEditorForm(currentTemplate);
        setSelectedTemplateId(currentTemplate.id ?? null);
      }
    } else {
      resetEditorForm(selectedDocumentTypes[0]);
      setSelectedTemplateId(null);
    }
  }, [selectedDocumentTypes, templates]);

  const currentSnapshot = formSnapshot || liveSnapshot;
  const templateContext = useMemo(
    () => buildMushroomTemplateContext(currentSnapshot, companyDetailsState),
    [currentSnapshot, companyDetailsState],
  );

  const template = useMemo(() => {
    if (!templates.length) return null;

    if (selectedTemplateId) {
      const byId = templates.find((item) => String(item.id) === String(selectedTemplateId));
      if (byId) return byId;
    }

    return (
      templates.find((item) => item.document_type === selectedDocumentTypes[0]) ||
      templates.find((item) => item.doc_name === docName) ||
      null
    );
  }, [templates, selectedDocumentTypes, docName, selectedTemplateId]);

  const displayDocumentTypes = useMemo(() => {
    const options = [...MUSHROOM_DOCUMENT_TEMPLATE_TYPES];
    const knownValues = new Set(options.map((option) => option.value));

    templates.forEach((item) => {
      const value = item.document_type;
      if (!value || knownValues.has(value)) return;
      knownValues.add(value);
      options.push({ value, label: item.doc_name || value });
    });

    return options;
  }, [templates]);

  const selectedTypeOption = displayDocumentTypes.find(
    (option) => option.value === selectedDocumentTypes[0],
  );

  const renderSingleTemplate = (templateRecord, { omitTitle = false } = {}) => {
    try {
      const content = normalizeTemplateContent(templateRecord.content);
      if (omitTitle) content.title = "";
      return renderTemplateContent(content, templateContext, templateRecord.document_type);
    } catch (contentError) {
      console.error("Invalid mushroom template content:", contentError);
      return <div className="template-panel-error">{contentError.message}</div>;
    }
  };

  const renderDemandFarmerTable = () => {
    const farmers = Array.isArray(currentSnapshot?.farmers)
      ? currentSnapshot.farmers.filter(
          (farmer) => (Number.parseInt(farmer?.bags, 10) || 0) > 0,
        )
      : [];
    const displayedFarmers = farmers.length ? farmers : [{}];
    const totalBags = farmers.reduce(
      (sum, farmer) => sum + (Number.parseInt(farmer?.bags, 10) || 0),
      0,
    );
    const mushroomType =
      currentSnapshot?.mtype === "oyster"
        ? "ऑयस्टर"
        : currentSnapshot?.mtype === "button"
          ? "बटन"
          : "";

    return (
      <>
        <div className="template-demand-table-heading">
          <p className="doc-subject">
            <b style={{ fontWeight: 600 }}>इच्छुक कृषकों की मांग का विवरण निम्नलिखित है:</b>
          </p>
          <div className="template-demand-type-box">
            <b style={{ fontWeight: 600 }}>मशरूम का प्रकार:</b>
            <span>{currentSnapshot?.mtype === "oyster" ? "☑" : "☐"} ऑयस्टर</span>
            <span>{currentSnapshot?.mtype === "button" ? "☑" : "☐"} बटन</span>
          </div>
        </div>
        <table className="template-demand-farmer-table">
          <thead>
            <tr>
              <th>क्र.सं.</th>
              <th>कृषक का नाम</th>
              <th>ग्राम</th>
              <th>मोबाइल नंबर</th>
              <th>आधार सं.</th>
              <th>मांग (बैग)</th>
              <th>हस्ताक्षर</th>
            </tr>
          </thead>
          <tbody>
            {displayedFarmers.map((farmer, index) => (
              <tr key={`${farmer?.name || "farmer"}-${index}`}>
                <td>{index + 1}</td>
                <td>{farmer?.name || ""}</td>
                <td>{farmer?.village || farmer?.vill || ""}</td>
                <td>{farmer?.mobile || farmer?.mob || ""}</td>
                <td>{farmer?.aadhaar || farmer?.adh || ""}</td>
                <td>{Number.parseInt(farmer?.bags, 10) || 0}</td>
                <td />
              </tr>
            ))}
            <tr className="template-demand-total-row">
              <td colSpan={5} />
              <th>कुल योग</th>
              <th>{totalBags}</th>
            </tr>
          </tbody>
        </table>
        <p className="template-demand-farmer-count">
          <b style={{ fontWeight: 600 }}>समस्त कृषक गण</b>
        </p>
        <div className="template-demand-recommendation">
          <p className="template-demand-recommendation-heading">
            <b style={{ fontWeight: 600 }}>प्रभारी की संस्तुति एवं अग्रसारण</b>
          </p>
          <p>
            सम्बन्धित कृषकों के अनुरोध के क्रम में, उक्त {mushroomType} मशरूम की
            खेती हेतु बिजाई युक्त कम्पोस्ट बैग की मांग संस्तुति सहित सादर
            अग्रसारित है। कृपया कृषकों को उक्त बैग क्रय किए जाने की स्वीकृति
            प्रदान करने की कृपा कीजियेगा।
          </p>
          <p className="template-demand-signature">
            <b style={{ fontWeight: 600 }}>हस्ताक्षर प्रभारी: _____________________</b>
          </p>
        </div>
      </>
    );
  };

  const renderTemplateFarmerTable = (variant) => {
    const farmers = (templateContext.farmers || []).filter(
      (farmer) => farmer.bags > 0,
    );
    const hasSubsidyColumns = variant === "combined_receipt";
    const farmerShareTotal = Number(templateContext.farmer_share_total) || 0;
    const subsidyTotal = Number(templateContext.subsidy_total) || 0;

    return (
      <table className="template-demand-farmer-table template-data-table">
        <thead>
          <tr>
            <th>क्र.सं.</th>
            <th>किसान का पूरा नाम</th>
            <th>ग्राम / पंचायत</th>
            <th>बैग</th>
            {hasSubsidyColumns && (
              <>
                <th>{templateContext.farmer_share_percentage}% किसान अंश</th>
                <th>{templateContext.subsidy_percentage}% राजसहायता</th>
              </>
            )}
          </tr>
        </thead>
        <tbody>
          {farmers.map((farmer, index) => (
            <tr key={`${farmer.name || "farmer"}-${index}`}>
              <td>{index + 1}</td>
              <td>{farmer.name || ""}</td>
              <td>{farmer.village}</td>
              <td>{farmer.bags}</td>
              {hasSubsidyColumns && (
                <>
                  <td>₹ {formatTemplateCurrency(farmer.farmer_share)}</td>
                  <td>₹ {formatTemplateCurrency(farmer.subsidy_amount)}</td>
                </>
              )}
            </tr>
          ))}
          <tr className="template-demand-total-row">
            <th colSpan={3}>कुल योग</th>
            <th>{templateContext.total_bags}</th>
            {hasSubsidyColumns && (
              <>
                <th>₹ {formatTemplateCurrency(farmerShareTotal)}</th>
                <th>₹ {formatTemplateCurrency(subsidyTotal)}</th>
              </>
            )}
          </tr>
        </tbody>
      </table>
    );
  };

  const renderDocumentDetails = (templateRecord) => {
    const fields = currentSnapshot?.fields || {};
    const farmerShareTotal = Number(templateContext.farmer_share_total) || 0;
    const subsidyTotal = Number(templateContext.subsidy_total) || 0;
    const totalAmount = Number(templateContext.total_amount) || 0;
    
    switch (templateRecord.document_type) {
      case "combined_receipt":
        return (
          <section className="template-document-details">
            <p className="doc-subject">
              <b>लाभार्थी कृषकों का विवरण एवं हस्ताक्षर निम्नानुसार हैं —</b>
            </p>
            {renderTemplateFarmerTable("combined_receipt")}
            <p className="template-document-signature">
              <b>समस्त कृषक गण / हस्ताक्षर: ___________________________</b>
            </p>
          </section>
        );
      case "verification_report":
        return (
          <section className="template-document-details template-verification-report">
            <p className="doc-paragraph template-verification-paragraph">
              प्रमाणित किया जाता है कि उपरोक्त देयक (बिल) संख्या{" "}
              <b>{templateContext.bill_number || "—"}</b> दिनांक{" "}
              <b>{templateContext.bill_date_display || "—"}</b>, मैसर्स{" "}
              {templateContext.company_name || "बडोला मशरूम फार्म"} (कम्पोस्ट
              यूनिट), काशीपुर, ऊधम सिंह नगर से सम्बन्धित कृषकों द्वारा क्रय किए
              गए बिजाई युक्त {templateContext.mushroom_type_hindi || "—"} मशरूम
              कम्पोस्ट बैग का मेरे द्वारा सत्यापन कर लिया गया है। वितरित बैगों
              की गुणवत्ता, मात्रा एवं विशिष्टताओं का भौतिक सत्यापन कर लिया
              गया है तथा बैग रोगमुक्त एवं बिजाई युक्त पाए गए हैं। उक्त बिल के अनुसार{" "}
              <b>{templateContext.total_bags}</b> बिजाई युक्त{" "}
              {templateContext.mushroom_type_hindi || "—"} मशरूम कम्पोस्ट बैग
              संबंधित कृषकों को दिनांक{" "}
              <b>{templateContext.date_of_supply_display || "—"}</b> (Date of
              Supply) को प्राप्त हो चुके हैं तथा कृषक अंश (
              {templateContext.farmer_share_percentage}%) की धनराशि रुपये{" "}
              <b>₹ {formatTemplateCurrency(farmerShareTotal)}</b> आपूर्तिकर्ता
              फर्म द्वारा कृषकों से प्राप्त कर ली गई है।
            </p>
            <p className="doc-paragraph template-verification-paragraph">
              अतः बिल की कुल धनराशि रुपये{" "}
              <b>₹ {formatTemplateCurrency(totalAmount)}</b> में से राजसहायता
              (अनुदान) की धनराशि रुपये{" "}
              <b>₹ {formatTemplateCurrency(subsidyTotal)}</b> (
              {subsidyTotal > 0
                ? templateContext.subsidy_amount_in_words
                : "—"}
              ) जो कि बिल के कुल योग का{" "}
              {templateContext.subsidy_percentage}% है,{" "}
              <b>उक्त आपूर्तिकर्ता फर्म को भुगतान करने की कृपा कीजियेगा।</b>
            </p>
            <ul className="template-attachments-list">
              <li>समेकित पावती-पत्र, {templateContext.company_name || "BADOLA MUSHROOMS FARM"} (COMPOST UNIT)</li>
              <li>इनवॉइस की प्रति</li>
            </ul>
            <div className="template-verification-signature">
              <span>प्रभारी,</span>
              <span>उद्यान सचल दल केन्द्र,</span>
              <span>
                {templateContext.kendra_name || "—"} _____________________
              </span>
            </div>
          </section>
        );
      case "supplier_certificate":
        return null;
      case "tax_invoice": {
        const gstPercentage = Number(templateContext.gst_percentage) || 0;
        const cgst = Number(templateContext.cgst_total) || 0;
        const sgst = Number(templateContext.sgst_total) || 0;
        const grandTotal = Number(templateContext.grand_total) || 0;
        const vehicles = Array.isArray(currentSnapshot?.vehicles)
          ? currentSnapshot.vehicles.filter(Boolean)
          : [];

        return (
          <section className="template-document-details template-invoice">
            <header className="template-invoice-header">
              <strong>{templateContext.company_name || "BADOLA MUSHROOMS FARM"}</strong>
              <span>{templateContext.company_address}</span>
              <h3>TAX INVOICE / टैक्स इनवॉइस</h3>
            </header>
            <div className="template-invoice-billing">
              <span>बिल प्राप्तकर्ता: {fields.i_billto || "—"}</span>
              <span>पता: {fields.i_billaddr || "—"}</span>
              <span>बिल संख्या: {templateContext.bill_number || "—"}</span>
              <span>बिल दिनांक: {templateContext.bill_date_display || "—"}</span>
              <span>आपूर्ति दिनांक: {templateContext.date_of_supply_display || "—"}</span>
              <span>वाहन संख्या: {vehicles.length ? vehicles.join(", ") : "—"}</span>
            </div>
            <table className="template-demand-farmer-table template-invoice-table">
              <thead>
                <tr>
                  <th>क्र.सं.</th>
                  <th>विवरण</th>
                  <th>मात्रा</th>
                  <th>दर</th>
                  <th>कर योग्य मूल्य</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>1</td>
                  <td>
                    बिजाई युक्त {templateContext.mushroom_type} मशरूम कम्पोस्ट बैग
                    ({templateContext.kg_per_bag} किग्रा / बैग)
                  </td>
                  <td>{templateContext.total_bags}</td>
                  <td>₹ {formatTemplateCurrency(templateContext.rate_per_bag)}</td>
                  <td>₹ {formatTemplateCurrency(totalAmount)}</td>
                </tr>
                <tr>
                  <th colSpan={4}>कुल</th>
                  <th>₹ {formatTemplateCurrency(totalAmount)}</th>
                </tr>
                <tr>
                  <td colSpan={3} />
                  <td>CGST @ {gstPercentage / 2}%</td>
                  <td>₹ {formatTemplateCurrency(cgst)}</td>
                </tr>
                <tr>
                  <td colSpan={3} />
                  <td>SGST @ {gstPercentage / 2}%</td>
                  <td>₹ {formatTemplateCurrency(sgst)}</td>
                </tr>
                <tr className="template-demand-total-row">
                  <th colSpan={4}>कुल देय राशि</th>
                  <th>₹ {formatTemplateCurrency(grandTotal)}</th>
                </tr>
              </tbody>
            </table>
            <p className="template-document-signature">
              {templateContext.total_weight_kg} किग्रा कुल वजन
              <br />
              अधिकृत हस्ताक्षरकर्ता: _____________________
            </p>
          </section>
        );
      }
      case "cash_receipt": {
        const farmers = (templateContext.farmers || []).filter(
          (farmer) => farmer.bags > 0,
        );
        const mode = fields.i_rmode || "one";
        const receipts = [];
        if (
          (mode === "one" || mode === "both") &&
          Number(templateContext.total_bags) > 0
        ) {
          receipts.push({
            name: farmers.map((farmer) => farmer.name).filter(Boolean).join(", "),
            village: farmers.map((farmer) => farmer.village).filter(Boolean).join(", "),
            bags: Number(templateContext.total_bags) || 0,
            amount: farmerShareTotal,
            note: `कुल ${farmers.length} कृषक · बिल सं० ${templateContext.bill_number || "—"} · कृषक अंश ${templateContext.farmer_share_percentage}%`,
          });
        }
        if (mode === "each" || mode === "both") {
          farmers.forEach((farmer) => {
            receipts.push({
              name: farmer.name,
              village: farmer.village,
              bags: farmer.bags,
              amount: farmer.farmer_share,
              note: `कृषक अंश ${templateContext.farmer_share_percentage}% · दर ₹${formatTemplateCurrency(templateContext.farmer_share_per_bag)} प्रति बैग`,
            });
          });
        }

        return (
          <section className="template-cash-receipts">
            {receipts.length ? (
              receipts.map((receipt, index) => (
                <article className="template-cash-receipt" key={`${receipt.name}-${index}`}>
                  <div className="template-cash-receipt-header">
                    <strong>नकद प्राप्ति रसीद</strong>
                    <span>रसीद नं० {Number(fields.i_rcptno) ? Number(fields.i_rcptno) + index : "________"}</span>
                    <span>दिनांक {templateContext.bill_date_display || "____________"}</span>
                  </div>
                  <p>
                    नाम <b>{receipt.name || "____________________"}</b> · ग्राम{" "}
                    <b>{receipt.village || templateContext.kendra_name || "________________"}</b>
                  </p>
                  <p>
                    <b>{receipt.bags} बैग ({receipt.bags * (Number(templateContext.kg_per_bag) || 0)} किग्रा)</b>{" "}
                    {templateContext.mushroom_type} मशरूम कम्पोस्ट
                  </p>
                  <p>
                    प्राप्त राशि: <b>₹ {formatTemplateCurrency(receipt.amount)}</b>
                  </p>
                  <small>{receipt.note}</small>
                  <p className="template-document-signature">
                    हस्ताक्षर: _____________________
                  </p>
                </article>
              ))
            ) : (
              <div className="template-panel-empty">
                रसीद बनाने के लिए फ़ॉर्म में कृषक एवं बैग विवरण भरें।
              </div>
            )}
          </section>
        );
      }
      default:
        return null;
    }
  };

  const renderSelectedDocument = (templateRecord, option) => {
    const isVerificationReport =
      templateRecord.document_type === "verification_report";
    const isSupplierCertificate =
      templateRecord.document_type === "supplier_certificate";
    let hasCustomTitle = false;
    let hasCustomSignature = false;
    try {
      const content = normalizeTemplateContent(templateRecord.content);
      hasCustomTitle = Boolean(content.title);
      hasCustomSignature = Boolean(content.signature_label);
    } catch {
      hasCustomTitle = false;
      hasCustomSignature = false;
    }

    return (
      <div
        className={`template-document-sheet${isSupplierCertificate ? " template-supplier-document" : ""}`}
      >
        {isSupplierCertificate && (
          <header className="template-supplier-header">
            <div className="template-supplier-company">
              <strong>
                {templateContext.company_name || "BADOLA MUSHROOMS FARM"}
              </strong>
              <b>(COMPOST UNIT)</b>
              <span>
                {templateContext.company_address ||
                  "H.O.-Dhanori Patti, D.P.S. Road, Kashipur (U.S. Nagar) U.K."}
              </span>
              <span>
                Compost Unit-Vill. Pratappur, Near Pickle Factory, Kashipur
                (U.S. Nagar)
              </span>
              <span>GSTIN No.: 05CHXPS3134D1Z5 | Mob.: 9899935600, 6398264916</span>
            </div>
            <div className="template-supplier-reference">
              <strong>CERTIFICATE</strong>
              <span>Ref. Bill No. : {templateContext.bill_number || "—"}</span>
              <span>Date : {templateContext.bill_date_display || "—"}</span>
            </div>
          </header>
        )}
        {isVerificationReport ? (
          <header className="template-verification-header">
            <strong>
              कार्यालय प्रभारी, उद्यान सचल दल केन्द्र,{" "}
              {templateContext.kendra_name || "—"}
            </strong>
            <span>
              जनपद {templateContext.office_name || "पौड़ी गढ़वाल"}, उद्यान विभाग,
              उत्तराखण्ड
            </span>
            <h2>सत्यापन आख्या</h2>
          </header>
        ) : (
          !hasCustomTitle && !isSupplierCertificate && (
            <h2 className="template-document-title">
              {option?.label || templateRecord.doc_name || templateRecord.document_type}
            </h2>
          )
        )}
        {isVerificationReport && (
          <p className="doc-reference template-verification-reference">
            सन्दर्भ : बिल संख्या{" "}
            <b>{templateContext.bill_number || "—"}</b> · दिनांक{" "}
            <b>{templateContext.bill_date_display || "—"}</b>
          </p>
        )}
        {renderSingleTemplate(templateRecord, {
          omitTitle: isVerificationReport,
        })}
        {isSupplierCertificate && !hasCustomSignature && (
          <div className="template-supplier-signature">
            <span>For {templateContext.company_name || "BADOLA MUSHROOMS FARM"}</span>
            <span>Authorised Signatory / विक्रेता के हस्ताक्षर व मुहर</span>
          </div>
        )}
        {templateRecord.document_type === "demand_patra" ? (
          renderDemandFarmerTable()
        ) : isVerificationReport || isSupplierCertificate ? null : (
          renderDocumentDetails(templateRecord)
        )}
      </div>
    );
  };

  const handleEditorChange = (event) => {
    const { name, value, type, checked } = event.target;
    const nextValue = type === "checkbox" ? checked : value;

    setEditorForm((previous) => ({
      ...previous,
      [name]: nextValue,
    }));

    if (name === "document_type") {
      handleTypeSelect(value);
    }
  };

  const handleTypeSelect = (value) => {
    setSelectedDocumentTypes((prev) => {
      if (prev.includes(value)) return prev;
      return [...prev, value];
    });

    const templateRecord = templates.find(
      (item) => item.document_type === value,
    );
    if (templateRecord) {
      hydrateEditorForm(templateRecord);
      setSelectedTemplateId(templateRecord.id ?? null);
    } else {
      resetEditorForm(value);
      setSelectedTemplateId(null);
    }
  };

  const updateContentField = (key, value) => {
    setEditorForm((previous) => ({
      ...previous,
      content: {
        ...previous.content,
        [key]: value,
      },
    }));
  };

  const updateContentListField = (key, value) => {
    const list = value
      .split("\n")
      .map((item) => item.trim())
      .filter(Boolean);
    updateContentField(key, list);
  };

  const handleSaveTemplate = async () => {
    try {
      const parsedContent = normalizeTemplateContent(editorForm.content);

      if (!editorForm.document_type) {
        throw new Error("Please choose a template type.");
      }

      if (!editorForm.doc_name.trim()) {
        throw new Error("Document name is required.");
      }

      const payload = {
        ...(editorForm.id ? { id: editorForm.id } : {}),
        document_type: editorForm.document_type,
        doc_name: editorForm.doc_name.trim(),
        content: parsedContent,
        is_active: !!editorForm.is_active,
      };

      setSaveState({ message: "", isError: false, isSaving: true });

      const requestOptions = {
        method: editorForm.id ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      };

      let response = await mushroomTemplateFetch(
        editorForm.id
          ? `${MUSHROOM_DOCUMENT_TEMPLATE_API_URL}${editorForm.id}/`
          : MUSHROOM_DOCUMENT_TEMPLATE_API_URL,
        requestOptions,
      );

      if (response.status === 404 && editorForm.id) {
        response = await mushroomTemplateFetch(
          MUSHROOM_DOCUMENT_TEMPLATE_API_URL,
          requestOptions,
        );
      }

      const text = await response.text();
      if (!response.ok) {
        throw new Error(extractMushroomApiError(text, "Template save failed."));
      }

      const result = text ? JSON.parse(text) : {};
      const savedTemplate = result?.data || result;
      const savedRecord =
        savedTemplate && Object.keys(savedTemplate).length > 0
          ? savedTemplate
          : { id: editorForm.id, ...payload };

      let savedContent = parsedContent;
      try {
        savedContent = normalizeTemplateContent(savedRecord.content || parsedContent);
      } catch (contentError) {
        console.error("Invalid saved mushroom template content:", contentError);
      }

      setTemplates((previous) => {
        const next = editorForm.id
          ? previous.map((item) => (item.id === editorForm.id ? { ...item, ...savedRecord } : item))
          : [...previous, savedRecord];
        return next;
      });

      const nextSelectedType = savedRecord.document_type || editorForm.document_type;
      setSelectedDocumentTypes((prev) => {
        if (prev.includes(nextSelectedType)) return prev;
        return [...prev, nextSelectedType];
      });
      setEditorForm({
        id: savedRecord.id || editorForm.id,
        document_type: nextSelectedType,
        doc_name: savedRecord.doc_name || payload.doc_name,
        content: savedContent,
        is_active: savedRecord.is_active !== false,
      });
      setSelectedTemplateId(savedRecord.id || editorForm.id);
      setSaveState({
        message: editorForm.id ? "टेम्पलेट सफलतापूर्वक अपडेट हुआ।" : "टेम्पलेट सफलतापूर्वक बना।",
        isError: false,
        isSaving: false,
      });
    } catch (saveError) {
      console.error("Template save error:", saveError);
      setSaveState({
        message: saveError.message || "Failed to save template.",
        isError: true,
        isSaving: false,
      });
    }
  };

  const handleDeleteTemplate = async () => {
    if (!editorForm.id) return;

    try {
      const response = await mushroomTemplateFetch(`${MUSHROOM_DOCUMENT_TEMPLATE_API_URL}${editorForm.id}/`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(text || "Delete failed.");
      }

      setTemplates((previous) => previous.filter((item) => item.id !== editorForm.id));
      resetEditorForm(selectedDocumentTypes[0]);
      setSaveState({
        message: "टेम्पलेट सफलतापूर्वक हटाया गया।",
        isError: false,
        isSaving: false,
      });
    } catch (deleteError) {
      console.error("Template delete error:", deleteError);
      setSaveState({
        message: deleteError.message || "Failed to delete template.",
        isError: true,
        isSaving: false,
      });
    }
  };

  if (loading && !templates.length) {
    return <div className="template-panel-loading">लोड हो रहा है...</div>;
  }

  if (error && !templates.length) {
    return <div className="template-panel-error">{error}</div>;
  }

  return (
    <div className="mushroom-template-panel">
      <div className="mushroom-template-toolbar">
        <div className="mushroom-template-title-wrap">
          <span className="mushroom-template-kicker">Document Templates</span>
          <h3>मशरूम दस्तावेज़ टेम्पलेट</h3>
        </div>
        {previewOnly ? (
          <div className="mushroom-template-type-picker">
            {displayDocumentTypes.map((option) => {
              const templateRecord = templates.find(
                (item) => item.document_type === option.value,
              );
              const isSelected = selectedDocumentTypes.includes(option.value);
              const hasTemplate = !!templateRecord;
              return (
                <label
                  key={option.value}
                  className={`mushroom-template-chip ${isSelected ? "active" : ""} ${!hasTemplate ? "missing" : ""}`}
                  style={{ opacity: hasTemplate ? 1 : 0.55 }}
                >
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={(e) => {
                      setSelectedDocumentTypes((prev) =>
                        e.target.checked
                          ? [...prev, option.value]
                          : prev.filter((t) => t !== option.value),
                      );
                    }}
                    disabled={!hasTemplate}
                  />
                  {option.label}
                </label>
              );
            })}
            {!templates.length && (
              <span className="template-panel-empty">
                कोई टेम्पलेट उपलब्ध नहीं है।
              </span>
            )}
          </div>
        ) : (
          <select
            className="mushroom-template-type-select"
            value={editorForm.document_type}
            onChange={(event) => handleTypeSelect(event.target.value)}
          >
            {displayDocumentTypes.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        )}
      </div>

      {error && <div className="template-panel-error">{error}</div>}

      {!previewOnly && (
        <div className="template-editor-panel">
          <div className="template-editor-header">
            <div className="template-editor-actions">
              <button type="button" className="template-btn secondary" onClick={() => resetEditorForm(selectedDocumentTypes[0])}>
                New
              </button>
              {editorForm.id && (
                <button type="button" className="template-btn danger" onClick={handleDeleteTemplate}>
                  Delete
                </button>
              )}
            </div>
          </div>

          <div className="template-form-grid">
            <label className="template-field">
              <span>Title (शीर्षक)</span>
              <input
                type="text"
                value={editorForm.content.title || ""}
                onChange={(event) => updateContentField("title", event.target.value)}
                placeholder="दस्तावेज़ का शीर्षक"
              />
            </label>

            <label className="template-field">
              <span>To (सेवा में)</span>
              <input
                type="text"
                value={editorForm.content.to || ""}
                onChange={(event) => updateContentField("to", event.target.value)}
                placeholder="जैसे: उद्यान विशेषज्ञ कोटद्वार गढ़वाल"
              />
            </label>

            <label className="template-field">
              <span>Through (द्वारा)</span>
              <input
                type="text"
                value={editorForm.content.through || ""}
                onChange={(event) => updateContentField("through", event.target.value)}
                placeholder="जैसे: प्रभारी, उद्यान सचल दल केन्द्र"
              />
            </label>

            <label className="template-field">
              <span>Subject (विषय)</span>
              <input
                type="text"
                value={editorForm.content.subject || ""}
                onChange={(event) => updateContentField("subject", event.target.value)}
                placeholder="विषय: ..."
              />
            </label>

            <label className="template-field">
              <span>Salutation (महोदय)</span>
              <input
                type="text"
                value={editorForm.content.salutation || ""}
                onChange={(event) => updateContentField("salutation", event.target.value)}
                placeholder="महोदय,"
              />
            </label>

            {editorForm.document_type !== "demand_patra" && (
              <label className="template-field">
                <span>Body (मुख्य पाठ)</span>
                <textarea
                  rows={4}
                  value={editorForm.content.body || ""}
                  onChange={(event) => updateContentField("body", event.target.value)}
                  placeholder="प्रमुख पाठ"
                />
              </label>
            )}

            <label className="template-field">
              <span>Paragraphs (एक प्रति पंक्ति)</span>
              <textarea
                rows={6}
                value={(editorForm.content.paragraphs || []).join("\n")}
                onChange={(event) => updateContentListField("paragraphs", event.target.value)}
                placeholder="पहला पैराग्राफ़&#10;दूसरा पैराग्राफ़"
              />
            </label>

            {editorForm.document_type !== "demand_patra" && (
              <label className="template-field">
                <span>Attachments (एक प्रति पंक्ति)</span>
                <textarea
                  rows={3}
                  value={(editorForm.content.attachments || []).join("\n")}
                  onChange={(event) => updateContentListField("attachments", event.target.value)}
                  placeholder="संलग्नक 1&#10;संलग्नक 2"
                />
              </label>
            )}
          </div>

          <div className="template-form-grid">
            <label className="template-field">
              <span>Document Type</span>
              <select
                name="document_type"
                value={editorForm.document_type}
                onChange={(event) => handleTypeSelect(event.target.value)}
              >
                {displayDocumentTypes.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="template-field">
              <span>Document Name</span>
              <input
                type="text"
                name="doc_name"
                value={editorForm.doc_name}
                onChange={handleEditorChange}
                placeholder="जैसे सत्यापन आख्या"
              />
            </label>

            <label className="template-field template-toggle-field">
              <span>Status</span>
              <div className="template-toggle-wrap">
                <input
                  type="checkbox"
                  name="is_active"
                  checked={editorForm.is_active}
                  onChange={handleEditorChange}
                />
                <span>{editorForm.is_active ? "Active" : "Inactive"}</span>
              </div>
            </label>
          </div>

          <div className="template-save-bar">
            <button type="button" className="template-btn primary" onClick={handleSaveTemplate} disabled={saveState.isSaving}>
              {saveState.isSaving ? "Saving..." : editorForm.id ? "Update Template" : "Create Template"}
            </button>
          </div>

          {saveState.message && (
            <div className={`template-save-message ${saveState.isError ? "error" : "success"}`}>
              {saveState.message}
            </div>
          )}
        </div>
      )}

      {previewOnly ? (
        selectedDocumentTypes.length > 0 ? (
          <div className="template-preview">
            {selectedDocumentTypes.map((docType, index) => {
              const templateRecord = templates.find(
                (item) => item.document_type === docType,
              );
              const option = displayDocumentTypes.find(
                (item) => item.value === docType,
              );
              if (!templateRecord) return null;
              return (
                <div key={`${docType}-${index}`} style={{ marginBottom: "30px" }}>
                  <div className="template-preview-meta">
                    {option?.label || templateRecord.doc_name || docType}
                  </div>
                  {renderSelectedDocument(templateRecord, option)}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="template-panel-empty">
            {templates.length
              ? "कोई टेम्पलेट चुना नहीं गया है। ऊपर से टेम्पलेट चुनें।"
              : "कोई टेम्पलेट उपलब्ध नहीं है।"}
          </div>
        )
      ) : template ? (
        <div className="template-preview">
          <div className="template-preview-meta">
            {selectedTypeOption?.label || selectedDocumentTypes[0]} — {template.doc_name}
          </div>
          {renderSelectedDocument(template, selectedTypeOption)}
        </div>
      ) : (
        <div className="template-panel-empty">
          {templates.length
            ? `“${selectedTypeOption?.label || selectedDocumentTypes[0]}” के लिए कोई टेम्पलेट सेव नहीं है।`
            : "कोई टेम्पलेट उपलब्ध नहीं है।"}
        </div>
      )}
    </div>
  );
}