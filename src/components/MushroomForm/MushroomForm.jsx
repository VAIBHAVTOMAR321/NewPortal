
import React, { useEffect, useRef, useState } from "react";
import * as XLSX from "xlsx";
import "./MushroomForm.css";

let mushroomFormLogicInitialized = false;

const isLocalhost =
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1";

const MUSHROOM_EXCEL_API_BASE = isLocalhost
  ? "/api"
  : "https://mahadevaaya.com/dhokotdwarproject2/dhokotdwarproject2_backend/api";

const MUSHROOM_COMPOST_API_URL = MUSHROOM_EXCEL_API_BASE + "/mushroom-compost-bag/";
const MUSHROOM_KENDRA_API_URL = MUSHROOM_EXCEL_API_BASE + "/mushroom-billing-details/";
const MUSHROOM_FARMER_API_URL = MUSHROOM_EXCEL_API_BASE + "/mushroom-farmer-details/";
const MUSHROOM_REFRESH_API_URL = MUSHROOM_EXCEL_API_BASE + "/refresh-token/";

function getCsrfTokenFromCookie() {
  const match = document.cookie.match(/(?:^|;\s*)csrftoken=([^;]+)/);
  return match ? decodeURIComponent(match[1]) : "";
}

async function ensureMushroomCsrfToken() {
  let csrf = getCsrfTokenFromCookie();
  if (csrf) return csrf;
  try {
    const response = await fetch(MUSHROOM_EXCEL_API_BASE, {
      method: "GET",
      credentials: "include",
      headers: { Accept: "application/json" },
    });
    if (!response.ok) console.warn("CSRF bootstrap request failed:", response.status);
    csrf = getCsrfTokenFromCookie();
    return csrf;
  } catch (error) {
    console.error("Mushroom CSRF bootstrap error:", error);
    return "";
  }
}

async function refreshMushroomAuthentication() {
  try {
    const csrf = await ensureMushroomCsrfToken();
    if (!csrf) return false;
    const response = await fetch(MUSHROOM_REFRESH_API_URL, {
      method: "POST",
      credentials: "include",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "X-CSRFToken": csrf,
      },
      body: JSON.stringify({}),
    });
    return response.ok;
  } catch (error) {
    console.error("Mushroom authentication refresh failed:", error);
    return false;
  }
}

async function mushroomExcelFetch(url, options = {}, allowRefresh = true) {
  const method = String(options.method || "GET").toUpperCase();
  const headers = new Headers(options.headers || {});
  headers.set("Accept", "application/json");
  headers.delete("Authorization");
  if (["POST", "PUT", "PATCH", "DELETE"].includes(method)) {
    const csrf = await ensureMushroomCsrfToken();
    if (csrf) headers.set("X-CSRFToken", csrf);
  }
  const response = await fetch(url, { ...options, method, headers, credentials: "include" });
  if (response.status === 401 && allowRefresh && !url.endsWith("/refresh-token/")) {
    const refreshed = await refreshMushroomAuthentication();
    if (refreshed) return mushroomExcelFetch(url, options, false);
  }
  return response;
}

async function parseExcelToArray(file) {
  const buffer = await file.arrayBuffer();
  const wb = XLSX.read(buffer, { type: "array", cellDates: true });
  const firstSheetName = wb.SheetNames[0];
  const worksheet = wb.Sheets[firstSheetName];
  return XLSX.utils.sheet_to_json(worksheet, { defval: "" });
}

export function downloadKendraTemplate() {
  const headers = ["क्र०सं०", "केन्द्र का नाम", "मशरूम प्रकार (Oyster/Button)", "दर (₹/बैग)", "बिल संख्या", "रसीद संख्या", "बिल दिनांक", "आपूर्ति दिनांक (एक से ज़्यादा हों तो कॉमा से)", "गाड़ी नंबर (एक से ज़्यादा हों तो कॉमा से)"];
  const ws = XLSX.utils.aoa_to_sheet([headers]);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "केन्द्र विवरण");
  XLSX.writeFile(wb, "Kendra_Vishran_Template.xlsx");
}

export function downloadFarmerTemplate() {
  const headers = ["केन्द्र का नाम", "क्र०सं०", "कृषक का नाम", "ग्राम", "मोबाइल नंबर", "आधार संख्या", "बैग", "बैंक का नाम", "खाता संख्या", "आईएफएससी कोड", "शाखा का नाम"];
  const ws = XLSX.utils.aoa_to_sheet([headers]);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "कृषक सूची");
  XLSX.writeFile(wb, "Krishak_Suchi_Template.xlsx");
}

const HIDDEN_COLUMNS = ["id", "created", "created_at", "updated", "updated_at", "createdAt", "updatedAt"];

export default function MushroomForm() {
  const [activeTab, setActiveTab] = useState("form");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentFormId, setCurrentFormId] = useState(null);
  const [formRecords, setFormRecords] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState({ text: "", type: "" });
  const [currentKendra, setCurrentKendra] = useState(""); // Added state for Kendra dropdown

  // Excel Upload States
  const [kendraFile, setKendraFile] = useState(null);
  const [farmerFile, setFarmerFile] = useState(null);
  const [kendraData, setKendraData] = useState([]);
  const [farmerData, setFarmerData] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadMsg, setUploadMsg] = useState({ text: "", type: "" });
  const [modalData, setModalData] = useState({ open: false, type: "", data: [] });
  const [uploadProgress, setUploadProgress] = useState({ current: 0, total: 0, type: "" });
  const [fetchedKendraData, setFetchedKendraData] = useState([]);
  const [fetchedFarmerData, setFetchedFarmerData] = useState([]);
  const [fetchedRecords, setFetchedRecords] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  const [editedRows, setEditedRows] = useState({});
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  // Fetch all records for the table view
  const fetchRecords = async () => {
    setIsLoading(true);
    try {
      const response = await mushroomExcelFetch(MUSHROOM_COMPOST_API_URL, { method: "GET" });
      const text = await response.text();
      if (!response.ok) throw new Error(text);
      const result = JSON.parse(text);
      setFormRecords(result.data || []);
    } catch (err) {
      console.error("Fetch records error:", err);
      setFeedbackMsg({ text: "रिकॉर्ड लाने में विफल।", type: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Form Submit (POST) and Update (PUT)
  const handleSubmit = async () => {
    if (!window.getSnapshot) return alert("फ़ॉर्म प्रणाली लोड नहीं हुई है।");
    const snap = window.getSnapshot();
    
    if (!snap.fields.i_kendra) {
      alert("कृपया उद्यान सचल दल केन्द्र चुनें।");
      return;
    }

    const parseFirstDate = (dateStr) => {
      if (!dateStr) return "";
      const firstDate = String(dateStr).split(",")[0].trim();
      return parseDateToISO(firstDate);
    };

    const gstVal = snap.fields.i_gst;
    let gstRateNum = 0;
    if (gstVal !== null && gstVal !== undefined && gstVal !== "") {
      gstRateNum = parseFloat(gstVal);
    }

    const payload = {
      mushroom_type: snap.mtype === "button" ? "Button Mushroom Compost" : "Oyster Mushroom Compost",
      bag_weight: parseFloat(snap.fields.i_kg) || 0,
      full_rate_per_bag: parseFloat(snap.fields.i_rate) || 0,
      subsidy_percentage: parseFloat(snap.fields.i_sub) || 0,
      gst_rate: gstRateNum,
      center_name: snap.fields.i_kendra,
      office_district: snap.fields.i_office || "उद्यान विशेषज्ञ कोटद्वार गढ़वाल (पौड़ी गढ़वाल)",
      financial_year: snap.fields.i_year,
      bill_date: parseDateToISO(snap.fields.i_date),
      supply_date: parseFirstDate(snap.fields.i_supply),
      bill_invoice_number: snap.fields.i_invoice,
      receipt_start_number: snap.fields.i_rcptno,
      bill_in_name_of: snap.fields.i_billto,
      bill_address: snap.fields.i_billaddr,
      cash_receipt_type: snap.fields.i_rmode === "one" ? "एक संयुक्त रसीद (कुल बिल का 20%)" : snap.fields.i_rmode === "each" ? "प्रति कृषक अलग रसीद" : "दोनों — संयुक्त + प्रति कृषक",
      show_farmer_signature_stamp: !!document.getElementById("i_showstamp")?.checked,
      vehicle_numbers: snap.vehicles,
      farmer_details: snap.farmers.map(f => [f.name, f.vill, f.mob, f.adh, parseInt(f.bags) || 0])
    };

    setIsSubmitting(true);
    try {
      let response;
      if (currentFormId) {
        // UPDATE (PUT) - form_id goes inside the body as per API spec
        payload.form_id = currentFormId;
        response = await mushroomExcelFetch(MUSHROOM_COMPOST_API_URL, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        // CREATE (POST)
        response = await mushroomExcelFetch(MUSHROOM_COMPOST_API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      const text = await response.text();
      if (!response.ok) throw new Error(text || "सर्वर त्रुटि");
      
      setFeedbackMsg({ text: currentFormId ? "रिकॉर्ड सफलतापूर्वक अपडेट हो गया!" : "रिकॉर्ड सफलतापूर्वक सहेजा गया!", type: "success" });
      
      // Reset form and switch to list view
      setCurrentFormId(null);
      setCurrentKendra(""); // Reset Kendra state
      if (window.newEntry) window.newEntry();
      fetchRecords();
      setActiveTab("list");
      
    } catch (err) {
      console.error("Submit error:", err);
      setFeedbackMsg({ text: "डेटा सहेजने में त्रुटि: " + err.message, type: "error" });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Edit (Fetch single record from state and fill form)
  const handleEdit = async (formId) => {
    const apiData = formRecords.find(r => r.form_id === formId);
    if (!apiData) {
      setFeedbackMsg({ text: "रिकॉर्ड नहीं मिला।", type: "error" });
      return;
    }

    // 1. Tab Switch pehle karo, kyunki form tab mount hone mein time lagta hai
    setCurrentFormId(formId);
    const kendraName = apiData.center_name || "";
    setCurrentKendra(kendraName); // Set Kendra state so dropdown populates correctly
    setActiveTab("form");
    setFeedbackMsg({ text: "रिकॉर्ड एडिट मोड में खुल रहा है...", type: "info" });

    // 2. Thoda wait karo taaki React pura Form ka DOM render kar sake
    setTimeout(() => {
      // Mapping gst_rate properly (backend sends 5.00, select expects "5")
      const gstRaw = apiData.gst_rate;
      let gstMapped = "";
      if (gstRaw !== null && gstRaw !== undefined && gstRaw !== "") {
        gstMapped = String(parseFloat(gstRaw));
      }

      const internalFormat = {
        mtype: apiData.mushroom_type?.includes("Oyster") ? "oyster" : "button",
        fields: {
          i_rate: apiData.full_rate_per_bag || "",
          i_kg: apiData.bag_weight || "",
          i_sub: apiData.subsidy_percentage || "",
          i_gst: gstMapped,
          i_kendra: kendraName,
          i_office: apiData.office_district || "",
          i_year: apiData.financial_year || "",
          i_date: parseDateToISO(apiData.bill_date),
          i_supply: apiData.supply_date || "",
          i_invoice: apiData.bill_invoice_number || "",
          i_rcptno: apiData.receipt_start_number || "",
          i_billto: apiData.bill_in_name_of || "",
          i_billaddr: apiData.bill_address || "",
          // FIX: Default to "one" (एक संयुक्त रसीद) on edit to prevent multiple receipts from generating
          i_rmode: apiData.cash_receipt_type?.includes("दोनों") ? "both" : "one",
        },
        farmers: (apiData.farmer_details || []).map(arr => ({
          name: arr[0] || "",
          vill: arr[1] || "",
          mob: arr[2] || "",
          adh: arr[3] || "",
          bags: arr[4] || 0
        })),
        vehicles: apiData.vehicle_numbers || [],
        letter: ""
      };

      if (window.applyData) window.applyData(internalFormat);
      
      const chk = document.getElementById("i_showstamp");
      if (chk) chk.checked = !!apiData.show_farmer_signature_stamp;
      if (window.render) window.render();

      setFeedbackMsg({ text: "रिकॉर्ड एडिट मोड में खुला। बदलाव करके Update Form दबाएँ।", type: "info" });
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 100); // 100ms ka delay DOM ke mount hone ke liye
  };

  // Handle Delete (DELETE)
  const handleDelete = async (formId) => {
    if (!window.confirm("क्या आप वाकई इस रिकॉर्ड को डिलीट करना चाहते हैं?")) return;
    
    try {
      const response = await mushroomExcelFetch(MUSHROOM_COMPOST_API_URL, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ form_ids: [formId] })
      });
      
      if (!response.ok) {
        const text = await response.text();
        throw new Error(text || "डिलीट विफल");
      }
      
      setFeedbackMsg({ text: "रिकॉर्ड सफलतापूर्वक डिलीट हो गया।", type: "success" });
      fetchRecords(); // Refresh table
      
    } catch (err) {
      console.error("Delete error:", err);
      setFeedbackMsg({ text: "डिलीट करने में त्रुटि: " + err.message, type: "error" });
    }
  };

  // Cancel Edit and reset form
  const handleCancelEdit = () => {
    if (window.newEntry) window.newEntry();
    setCurrentFormId(null);
    setCurrentKendra("");
    setFeedbackMsg({ text: "", type: "" });
  };

  const handleKendraFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setKendraFile(file);
      setUploadMsg({ text: "", type: "" });
      try {
        const rows = await parseExcelToArray(file);
        setKendraData(rows);
        setEditedRows({});
        setHasUnsavedChanges(false);
        setModalData({ open: true, type: "kendra", data: rows });
      } catch (err) {
        setUploadMsg({ text: "एक्सेल पढ़ने में त्रुटि: " + err.message, type: "error" });
      }
    }
  };

  const handleFarmerFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setFarmerFile(file);
      setUploadMsg({ text: "", type: "" });
      try {
        const rows = await parseExcelToArray(file);
        setFarmerData(rows);
        setEditedRows({});
        setHasUnsavedChanges(false);
        setModalData({ open: true, type: "farmer", data: rows });
      } catch (err) {
        setUploadMsg({ text: "एक्सेल पढ़ने में त्रुटि: " + err.message, type: "error" });
      }
    }
  };

  const parseDateToISO = (dateStr) => {
    if (!dateStr) return "";
    const str = String(dateStr).trim();
    const parts = str.split(/[\/\-\.]/);
    if (parts.length === 3) {
      const [d, m, y] = parts;
      if (y.length === 4) return `${y}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`;
      else if (d.length === 4) return str;
    }
    const date = new Date(str);
    if (!isNaN(date.getTime())) {
      const yyyy = date.getFullYear();
      const mm = String(date.getMonth() + 1).padStart(2, "0");
      const dd = String(date.getDate()).padStart(2, "0");
      return `${yyyy}-${mm}-${dd}`;
    }
    return str;
  };

  const getCellValue = (row, possibleKeys) => {
    for (const key of possibleKeys) {
      if (row[key] !== undefined && row[key] !== null && String(row[key]).trim() !== "") {
        return String(row[key]).trim();
      }
    }
    if (possibleKeys.some(k => k.includes("आधार") || k.includes("Aadhaar") || k.includes("Aadhar") || k.includes("UID"))) {
      for (const [rKey, rVal] of Object.entries(row)) {
        const lowerKey = rKey.toLowerCase();
        if ((lowerKey.includes("aadhaar") || lowerKey.includes("aadhar") || lowerKey.includes("uid") || lowerKey.includes("आधार")) &&
            rVal !== undefined && rVal !== null && String(rVal).trim() !== "") {
          return String(rVal).trim();
        }
      }
    }
    return "";
  };

  const transformKendraRow = (row) => {
    const supplyDates = getCellValue(row, ["आपूर्ति दिनांक (एक से ज़्यादा हों तो कॉमा से)", "आपूर्ति दिनांक", "Supply Dates", "Supply Date"])
      ? getCellValue(row, ["आपूर्ति दिनांक (एक से ज़्यादा हों तो कॉमा से)", "आपूर्ति दिनांक", "Supply Dates", "Supply Date"]).split(",").map(d => parseDateToISO(d.trim())).filter(Boolean)
      : [];
    const vehicleNumbers = getCellValue(row, ["गाड़ी नंबर (एक से ज़्यादा हों तो कॉमा से)", "गाड़ी नंबर", "Vehicle Numbers", "Vehicle Number"])
      ? getCellValue(row, ["गाड़ी नंबर (एक से ज़्यादा हों तो कॉमा से)", "गाड़ी नंबर", "Vehicle Numbers", "Vehicle Number"]).split(",").map(v => v.trim()).filter(Boolean)
      : [];
    return {
      serial_no: parseInt(getCellValue(row, ["क्र०सं०", "क्र.सं.", "Serial No", "Sr No", "S.No."])) || 0,
      center_name: getCellValue(row, ["केन्द्र का नाम", "केंद्र का नाम", "Centre Name", "Center Name"]),
      mushroom_type: getCellValue(row, ["मशरूम प्रकार (Oyster/Button)", "मशरूम प्रकार", "Mushroom Type"]),
      rate_per_bag: getCellValue(row, ["दर (₹/बैग)", "दर", "Rate Per Bag", "Rate"]),
      bill_number: getCellValue(row, ["बिल संख्या", "बिल नंबर", "Bill Number", "Bill No"]),
      receipt_number: getCellValue(row, ["रसीद संख्या", "रसीद नंबर", "Receipt Number", "Receipt No"]),
      bill_date: parseDateToISO(getCellValue(row, ["बिल दिनांक", "बिल तिथि", "Bill Date"])),
      supply_dates: supplyDates,
      vehicle_numbers: vehicleNumbers,
    };
  };

  const handleKendraUpload = async () => {
    if (kendraData.length === 0) {
      setUploadMsg({ text: "कृपया पहले केन्द्र विवरण एक्सेल फ़ाइल चुनें।", type: "error" });
      return;
    }
    setIsUploading(true);
    setUploadProgress({ current: 0, total: kendraData.length, type: "kendra" });
    let successCount = 0;
    try {
      for (let i = 0; i < kendraData.length; i++) {
        const row = kendraData[i];
        const payload = transformKendraRow(row);
        setUploadProgress({ current: i + 1, total: kendraData.length, type: "kendra" });
        setUploadMsg({ text: `केन्द्र विवरण अपलोड हो रहा है... (${i + 1}/${kendraData.length})`, type: "info" });
        const response = await mushroomExcelFetch(MUSHROOM_KENDRA_API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const text = await response.text();
        if (!response.ok) {
          const detail = text ? JSON.parse(text).detail || text : response.statusText;
          throw new Error(`पंक्ति ${i + 1} अपलोड विफल: ${detail}`);
        }
        successCount++;
      }
      setUploadMsg({ text: `केन्द्र विवरण सफलतापूर्वक अपलोड हो गया! (${successCount} प्रविष्टियाँ)`, type: "success" });
      setKendraFile(null);
      setKendraData([]);
      document.getElementById("kendraFileInput").value = "";
    } catch (err) {
      console.error("Kendra upload error:", err);
      setUploadMsg({ text: err.message || "एक्सेल अपलोड नहीं हो सका।", type: "error" });
    } finally {
      setIsUploading(false);
      setUploadProgress({ current: 0, total: 0, type: "" });
    }
  };

  const transformFarmerRow = (row) => {
    const aadhaar = getCellValue(row, ["आधार संख्या", "आधार नंबर", "Aadhaar Number", "Aadhar Number", "Aadhaar No"]);
    return {
      serial_no: parseInt(getCellValue(row, ["क्र०सं०", "क्र.सं.", "Serial No", "Sr No", "S.No."])) || 0,
      center_name: getCellValue(row, ["केन्द्र का नाम", "केंद्र का नाम", "Centre Name", "Center Name"]),
      farmer_name: getCellValue(row, ["कृषक का नाम", "किसान का नाम", "Farmer Name", "Name"]),
      village: getCellValue(row, ["ग्राम", "गांव", "Village"]),
      mobile_number: getCellValue(row, ["मोबाइल नंबर", "मोबाइल नम्बर", "Mobile Number", "Mobile No", "Phone"]),
      aadhaar_number: aadhaar || "000000000000",
      bags: parseInt(getCellValue(row, ["बैग", "बैग्स", "Bags", "Bag Count"])) || 0,
      bank_name: getCellValue(row, ["बैंक का नाम", "बैंक नाम", "Bank Name", "Bank"]),
      account_number: getCellValue(row, ["खाता संख्या", "खाता नंबर", "Account Number", "Account No", "A/C No"]),
      ifsc_code: getCellValue(row, ["आईएफएससी कोड", "IFSC Code", "IFSC"]),
      branch_name: getCellValue(row, ["शाखा का नाम", "शाखा नाम", "Branch Name", "Branch"]),
    };
  };

  const handleFarmerUpload = async () => {
    if (farmerData.length === 0) {
      setUploadMsg({ text: "कृपया पहले कृषक सूची एक्सेल फ़ाइल चुनें।", type: "error" });
      return;
    }
    setIsUploading(true);
    setUploadProgress({ current: 0, total: farmerData.length, type: "farmer" });
    let successCount = 0;
    try {
      for (let i = 0; i < farmerData.length; i++) {
        const row = farmerData[i];
        const payload = transformFarmerRow(row);
        setUploadProgress({ current: i + 1, total: farmerData.length, type: "farmer" });
        setUploadMsg({ text: `कृषक सूची अपलोड हो रही है... (${i + 1}/${farmerData.length})`, type: "info" });
        const response = await mushroomExcelFetch(MUSHROOM_FARMER_API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const text = await response.text();
        if (!response.ok) {
          const detail = text ? JSON.parse(text).detail || text : response.statusText;
          throw new Error(`पंक्ति ${i + 1} अपलोड विफल: ${detail}`);
        }
        successCount++;
      }
      setUploadMsg({ text: `कृषक सूची सफलतापूर्वक अपलोड हो गई! (${successCount} प्रविष्टियाँ)`, type: "success" });
      setFarmerFile(null);
      setFarmerData([]);
      document.getElementById("farmerFileInput").value = "";
    } catch (err) {
      console.error("Farmer upload error:", err);
      setUploadMsg({ text: err.message || "एक्सेल अपलोड नहीं हो सका।", type: "error" });
    } finally {
      setIsUploading(false);
      setUploadProgress({ current: 0, total: 0, type: "" });
    }
  };

  const fetchAndAutoFillForm = async () => {
    setIsFetching(true);
    setUploadMsg({ text: "बैकएंड से डेटा प्राप्त किया जा रहा है...", type: "info" });
    try {
      const [kendraResponse, farmerResponse] = await Promise.all([
        mushroomExcelFetch(MUSHROOM_KENDRA_API_URL, { method: "GET" }),
        mushroomExcelFetch(MUSHROOM_FARMER_API_URL, { method: "GET" })
      ]);

      const kendraText = await kendraResponse.text();
      if (!kendraResponse.ok) throw new Error(`Fetch kendra failed: ${kendraText}`);
      const kendraResult = JSON.parse(kendraText);
      const kendraData = Array.isArray(kendraResult) ? kendraResult : (kendraResult.data || []);
      setFetchedKendraData(kendraData);

      const farmerText = await farmerResponse.text();
      if (!farmerResponse.ok) throw new Error(`Fetch farmer failed: ${farmerText}`);
      const farmerResult = JSON.parse(farmerText);
      const farmerData = Array.isArray(farmerResult) ? farmerResult : (farmerResult.data || []);
      setFetchedFarmerData(farmerData);

      const farmersByKendra = {};
      farmerData.forEach((r) => {
        const kn = r.center_name;
        if (!farmersByKendra[kn]) farmersByKendra[kn] = [];
        farmersByKendra[kn].push({
          name: r.farmer_name || "",
          vill: r.village || "",
          mob: r.mobile_number || "",
          adh: r.aadhaar_number || "",
          bags: parseInt(r.bags) || 0,
        });
      });

      const commonFields = {
        i_rate: "", i_kg: "5", i_sub: "80", i_gst: "0",
        i_office: "उद्यान विशेषज्ञ कोटद्वार गढ़वाल (पौड़ी गढ़वाल)", i_year: "2026-27",
        i_billto: "उद्यान विशेषज्ञ कोटद्वार गढ़वाल (पौड़ी गढ़वाल)",
        i_billaddr: "उद्यान विशेषज्ञ कोटद्वार गढ़वाल (पौड़ी गढ़वाल)", i_rmode: "one",
      };

      const newRecs = [];
      const skipped = [];

      kendraData.forEach((r) => {
        const kn = r.center_name;
        if (!kn) return;
        const farmers = farmersByKendra[kn] || [];
        if (!farmers.length) { skipped.push(kn); return; }

        const mtypeRaw = String(r.mushroom_type || "").trim().toLowerCase();
        const mtype = mtypeRaw.indexOf("oy") === 0 ? "oyster" : "button";
        const rate = r.rate_per_bag ? String(r.rate_per_bag) : (mtype === "oyster" ? "90" : "126");
        const vehicles = Array.isArray(r.vehicle_numbers) ? r.vehicle_numbers : [];

        const officeDistrict = r.office_district || r.office || r.district || commonFields.i_office;

        let supplyDisplay = "";
        if (Array.isArray(r.supply_dates)) {
          supplyDisplay = r.supply_dates.join(", ");
        } else if (typeof r.supply_dates === "string" && r.supply_dates) {
          try {
            const parsed = JSON.parse(r.supply_dates);
            if (Array.isArray(parsed)) supplyDisplay = parsed.join(", ");
            else supplyDisplay = r.supply_dates;
          } catch {
            supplyDisplay = r.supply_dates;
          }
        }

        let billDateIso = "";
        if (r.bill_date) {
          const dateObj = new Date(r.bill_date);
          if (!isNaN(dateObj.getTime())) {
            billDateIso = dateObj.toISOString().slice(0, 10);
          } else {
            billDateIso = r.bill_date;
          }
        }

        newRecs.push({
          id: "backend_" + r.id,
          savedAt: new Date().toISOString(),
          data: {
            mtype: mtype,
            fields: Object.assign({}, commonFields, {
              i_kendra: kn,
              i_office: officeDistrict,
              i_invoice: r.bill_number || "",
              i_rcptno: r.receipt_number || "",
              i_date: billDateIso,
              i_supply: supplyDisplay,
              i_rate: rate,
            }),
            farmers: farmers,
            vehicles: vehicles,
            letter: "",
          },
        });
      });

      if (newRecs.length === 0) {
        setUploadMsg({ text: "बैकएंड पर कोई संबंधित डेटा नहीं मिला। कृपया पहले अपलोड करें।", type: "error" });
        return;
      }

      setFetchedRecords(newRecs);

      const checkInterval = setInterval(() => {
        if (window.applyData) {
          clearInterval(checkInterval);
          window.applyData(newRecs[0].data);
          setCurrentKendra(newRecs[0].data.fields.i_kendra); // Update state
          if (window.putRecs && window.renderRecords) {
            window.putRecs(newRecs);
            window.renderRecords();
          }
          let msg = `✔ ${newRecs.length} केन्द्र सफलतापूर्वक लाए गए। पहला केन्द्र (${newRecs[0].data.fields.i_kendra}) लोड हो गया है।`;
          if (skipped.length) msg += ` (छोड़े गए: ${skipped.join(", ")})`;
          setUploadMsg({ text: msg, type: "success" });
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
      }, 100);

    } catch (err) {
      console.error("Fetch and auto-fill error:", err);
      setUploadMsg({ text: err.message || "डेटा प्राप्त नहीं हो सका।", type: "error" });
    } finally {
      setIsFetching(false);
    }
  };

  const handleCellEdit = (rowId, columnKey, newValue) => {
    setEditedRows((prev) => {
      const existing = prev[rowId] || {};
      const updated = { ...existing, [columnKey]: newValue };
      return { ...prev, [rowId]: updated };
    });
    setHasUnsavedChanges(true);
  };

  const handleUpdateChanges = async () => {
    const editedIds = Object.keys(editedRows);
    if (editedIds.length === 0) {
      setUploadMsg({ text: "कोई बदलाव नहीं किया गया है।", type: "error" });
      return;
    }
    setIsUpdating(true);
    setUploadMsg({ text: `अद्यतन किया जा रहा है... (0/${editedIds.length})`, type: "info" });
    const baseApiUrl = modalData.type === "kendra" ? MUSHROOM_KENDRA_API_URL : MUSHROOM_FARMER_API_URL;
    const currentData = modalData.data;
    let successCount = 0;
    let failedRows = [];
    try {
      for (let i = 0; i < editedIds.length; i++) {
        const rowId = editedIds[i].replace("backend_", "");
        const originalRow = currentData.find((r) => String(r.id) === String(rowId));
        if (!originalRow) { failedRows.push(rowId); continue; }
        const editedFields = editedRows[editedIds[i]];
        const payload = { ...originalRow };
        Object.keys(editedFields).forEach((k) => { payload[k] = editedFields[k]; });
        HIDDEN_COLUMNS.forEach((col) => delete payload[col]);
        setUploadMsg({ text: `अद्यतन किया जा रहा है... (${i + 1}/${editedIds.length}) — ID: ${rowId}`, type: "info" });
        const updateUrl = baseApiUrl + rowId + "/";
        const response = await mushroomExcelFetch(updateUrl, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!response.ok) {
          const text = await response.text();
          console.error(`Update failed for id ${rowId}:`, text);
          failedRows.push(rowId);
        } else {
          successCount++;
        }
      }
      if (failedRows.length === 0) {
        setUploadMsg({ text: `सभी ${successCount} प्रविष्टियाँ सफलतापूर्वक अद्यतन कर दी गई हैं!`, type: "success" });
        setEditedRows({});
        setHasUnsavedChanges(false);
      } else {
        setUploadMsg({ text: `${successCount} सफल, ${failedRows.length} विफल (IDs: ${failedRows.join(", ")}).`, type: "error" });
      }
    } catch (err) {
      console.error("Update error:", err);
      setUploadMsg({ text: err.message || "अद्यतन में त्रुटि।", type: "error" });
    } finally {
      setIsUpdating(false);
    }
  };

  const closeModal = () => {
    if (hasUnsavedChanges) {
      const confirmClose = window.confirm("आपने कुछ बदलाव किए हैं जो अभी सेव नहीं हुए हैं। क्या वाकई बंद करना है?");
      if (!confirmClose) return;
    }
    setEditedRows({});
    setHasUnsavedChanges(false);
    setModalData({ ...modalData, open: false });
  };

  useEffect(() => {
    if (mushroomFormLogicInitialized) return;
    mushroomFormLogicInitialized = true;
    window.XLSX = XLSX;
    window.MUSHROOM_EXCEL_API = isLocalhost
      ? "/api/"
      : "https://mahadevaaya.com/dhokotdwarproject2/dhokotdwarproject2_backend/api/";

    const PRESET = {
      button: { rate: 126, kg: 10, hi: 'बटन', en: 'Button' },
      oyster: { rate: 90, kg: 5, hi: 'ऑयस्टर', en: 'Oyster' }
    };
    let mtype = '';
    let seq = 0;
    let autoFilled = false;
    let letterEdited = false;
    let LETTER_HTML = '';
    let vehSeq = 0;
    let MEM_AUTO = {};
    let MEM_REC = [];
    let curRec = null;

    const HI = ['', 'एक', 'दो', 'तीन', 'चार', 'पाँच', 'छह', 'सात', 'आठ', 'नौ', 'दस', 'ग्यारह', 'बारह', 'तेरह', 'चौदह', 'पंद्रह', 'सोलह', 'सत्रह', 'अठारह', 'उन्नीस', 'बीस', 'इक्कीस', 'बाईस', 'तेईस', 'चौबीस', 'पच्चीस', 'छब्बीस', 'सत्ताईस', 'अट्ठाईस', 'उनतीस', 'तीस', 'इकतीस', 'बत्तीस', 'तैंतीस', 'चौंतीस', 'पैंतीस', 'छत्तीस', 'सैंतीस', 'अड़तीस', 'उनतालीस', 'चालीस', 'इकतालीस', 'बयालीस', 'तैंतालीस', 'चौवालीस', 'पैंतालीस', 'छियालीस', 'सैंतीस', 'अड़तीलीस', 'उनचास', 'पचास', 'इक्यावन', 'बावन', 'तिरेपन', 'चौवन', 'पचपन', 'छप्पन', 'सत्तावन', 'अट्ठावन', 'उनसठ', 'साठ', 'इकसठ', 'बासठ', 'तिरेसठ', 'चौंसठ', 'पैंसठ', 'छियासठ', 'सड़सठ', 'अड़सठ', 'उनहत्तर', 'सत्तर', 'इकहत्तर', 'बहत्तर', 'तिहत्तर', 'चौहत्तर', 'पचहत्तर', 'छिहत्तर', 'सतहत्तर', 'अठहत्तर', 'उन्यासी', 'अस्सी', 'इक्यासी', 'बयासी', 'तिरासी', 'चौरासी', 'पचासी', 'छियासी', 'सतासी', 'अट्ठासी', 'नवासी', 'नब्बे', 'इक्यानवे', 'बानवे', 'तिरानवे', 'चौरानवे', 'पंचानवे', 'छियानवे', 'सत्तानवे', 'अट्ठानवे', 'निन्यानवे'];

    function hi3(n) { let s = ''; if (n > 99) { s += HI[Math.floor(n / 100)] + ' सौ '; n %= 100; } if (n) s += HI[n] + ' '; return s; }
    function hiWords(num) {
      num = Math.round(num * 100) / 100;
      let r = Math.floor(num), p = Math.round((num - r) * 100), out = '';
      if (r === 0) out = 'शून्य ';
      const cr = Math.floor(r / 10000000); r %= 10000000;
      const la = Math.floor(r / 100000); r %= 100000;
      const th = Math.floor(r / 1000); r %= 1000;
      if (cr) out += hi3(cr) + 'करोड़ ';
      if (la) out += hi3(la) + 'लाख ';
      if (th) out += hi3(th) + 'हज़ार ';
      if (r) out += hi3(r);
      out = out.trim() + ' रुपये';
      if (p) out += ' ' + hi3(p).trim() + ' पैसे';
      return out + ' मात्र';
    }

    const E1 = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
    const E10 = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
    function en2(n) { return n < 20 ? E1[n] : E10[Math.floor(n / 10)] + (n % 10 ? ' ' + E1[n % 10] : ''); }
    function en3(n) { let s = ''; if (n > 99) { s += E1[Math.floor(n / 100)] + ' Hundred '; n %= 100; } if (n) s += en2(n); return s.trim(); }
    function enWords(num) {
      num = Math.round(num * 100) / 100;
      let r = Math.floor(num), p = Math.round((num - r) * 100), out = [];
      if (r === 0) out.push('Zero');
      const cr = Math.floor(r / 10000000); r %= 10000000;
      const la = Math.floor(r / 100000); r %= 100000;
      const th = Math.floor(r / 1000); r %= 1000;
      if (cr) out.push(en3(cr) + ' Crore');
      if (la) out.push(en3(la) + ' Lakh');
      if (th) out.push(en3(th) + ' Thousand');
      if (r) out.push(en3(r));
      let s = 'Rupees ' + out.join(' ');
      if (p) s += ' and ' + en2(p) + ' Paise';
      return s + ' Only';
    }

    const money = n => (n || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    function rowSize(n) { if (n <= 6) return { h: 22, fs: 11.5 }; if (n <= 10) return { h: 17, fs: 10 }; if (n <= 15) return { h: 14, fs: 9 }; if (n <= 22) return { h: 12, fs: 8 }; if (n <= 25) return { h: 10, fs: 7 }; return { h: 8, fs: 6.2 }; }
    const val = id => { const el = document.getElementById(id); return el ? el.value.trim() : ''; };
    function fmtDate(v) { if (!v) return ''; const d = v.split('-'); return d[2] + '/' + d[1] + '/' + d[0]; }

    function addVehicleRow(value) {
      vehSeq++;
      const div = document.createElement('div');
      div.id = 'veh' + vehSeq;
      div.style.cssText = 'display:flex;align-items:center;gap:8px;margin-bottom:6px';
      div.innerHTML = '<label style="min-width:130px;font-size:12.5px;color:var(--ink-soft)">वाहन संख्या ' + vehSeq + ' :</label>' +
        '<input type="text" class="v-num" placeholder="जैसे UP07 AB1234" style="text-transform:uppercase;flex:1;max-width:220px" oninput="this.value=this.value.toUpperCase();window.render()">' +
        '<button class="btn d" type="button" title="हटाएं" onclick="window.delVehicleRow(\'veh' + vehSeq + '\')">✕</button>';
      document.getElementById('vehicle_list').appendChild(div);
      if (value) div.querySelector('.v-num').value = value;
      render();
    }
    function delVehicleRow(id) { const el = document.getElementById(id); if (el) el.remove(); render(); }
    function collectVehicles() { return Array.from(document.querySelectorAll('#vehicle_list .v-num')).map(el => el.value.trim()).filter(v => v); }

    function addRow(data) {
      seq++;
      const tr = document.createElement('tr');
      tr.id = 'r' + seq;
      tr.innerHTML = '<td class="rowno"></td>' +
        '<td><input type="text" class="c-name" placeholder="कृषक का नाम" oninput="window.render()"></td>' +
        '<td><input type="text" class="c-vill" placeholder="ग्राम" oninput="window.render()"></td>' +
        '<td><input type="text" class="c-mob" inputmode="numeric" maxlength="10" placeholder="10 अंक" oninput="window.render()"></td>' +
        '<td><input type="text" class="c-adh" inputmode="numeric" maxlength="14" placeholder="12 अंक" oninput="window.render()"></td>' +
        '<td><input type="number" class="c-bags" min="0" value="0" style="text-align:center;font-weight:700" oninput="window.render()"></td>' +
        '<td class="rowno"><button class="btn d" title="हटाएं" onclick="window.delRow(\'r' + seq + '\')">✕</button></td>';
      document.getElementById('entry_body').appendChild(tr);
      if (data) {
        tr.querySelector('.c-name').value = data.name || '';
        tr.querySelector('.c-vill').value = data.vill || '';
        tr.querySelector('.c-mob').value = data.mob || '';
        tr.querySelector('.c-adh').value = data.adh || '';
        tr.querySelector('.c-bags').value = data.bags || 0;
      }
      render();
    }
    function delRow(id) { const el = document.getElementById(id); if (el) el.remove(); render(); }
    function collect() {
      const out = [];
      document.querySelectorAll('#entry_body tr').forEach((tr, i) => {
        tr.cells[0].innerText = i + 1;
        out.push({
          name: tr.querySelector('.c-name').value.trim(),
          vill: tr.querySelector('.c-vill').value.trim(),
          mob: tr.querySelector('.c-mob').value.trim(),
          adh: tr.querySelector('.c-adh').value.trim(),
          bags: parseInt(tr.querySelector('.c-bags').value) || 0
        });
      });
      return out;
    }
    function mergeDuplicateFarmers(list) {
      const map = new Map(), order = [];
      list.forEach(f => {
        const key = (f.name || '').trim().toLowerCase() + '|' + (f.vill || '').trim().toLowerCase();
        if (!key.trim()) { order.push(f); return; }
        if (map.has(key)) {
          const ex = map.get(key); ex.bags += f.bags;
          if (!ex.mob && f.mob) ex.mob = f.mob;
          if (!ex.adh && f.adh) ex.adh = f.adh;
        } else { const copy = Object.assign({}, f); map.set(key, copy); order.push(copy); }
      });
      return order;
    }

    function pickType(t) {
      mtype = t;
      document.querySelectorAll('.type').forEach(el => el.dataset.on = el.dataset.type === t ? '1' : '0');
      const radio = document.getElementById('t_' + t); if (radio) radio.checked = true;
      const rateEl = document.getElementById('i_rate');
      const kgEl = document.getElementById('i_kg');
      if (rateEl && !rateEl.value) rateEl.value = PRESET[t].rate;
      if (kgEl && !kgEl.value) kgEl.value = PRESET[t].kg;
      render();
    }
    function pickTypeQuiet(t) {
      mtype = t;
      document.querySelectorAll('.type').forEach(el => el.dataset.on = el.dataset.type === t ? '1' : '0');
      const r = document.getElementById('t_' + t); if (r) r.checked = true;
    }

    function setTxt(id, txt) { const el = document.getElementById(id); if (el) el.innerText = txt; }
    function setHtm(id, htm) { const el = document.getElementById(id); if (el) el.innerHTML = htm; }
    function resetLetter() {
      if (!confirm('मांग-पत्र का पाठ मूल रूप में वापस लाया जाए? आपके किए गए बदलाव हट जाएँगे।')) return;
      document.getElementById('d_letter').innerHTML = LETTER_HTML;
      letterEdited = false; render();
    }

    function render() {
      const rows = mergeDuplicateFarmers(collect().filter(f => f.bags > 0));
      const rate = parseFloat(val('i_rate')) || 0;
      const kg = parseFloat(val('i_kg')) || 0;
      const subPct = parseFloat(val('i_sub')) || 0;
      const farmPct = 100 - subPct;
      const gst = parseFloat(val('i_gst')) || 0;
      const T = PRESET[mtype] || { hi: '', en: '', rate: 0, kg: 0 };
      const perSub = rate * subPct / 100, perFarm = rate * farmPct / 100;
      const totBags = rows.reduce((s, f) => s + f.bags, 0);
      const totVal = totBags * rate, totFarm = totBags * perFarm, totSub = totBags * perSub;

      const elBags = document.getElementById('t_bags'); if (elBags) elBags.innerText = totBags;
      const elVal = document.getElementById('t_val'); if (elVal) elVal.innerText = money(totVal);
      const elShare = document.getElementById('t_share'); if (elShare) elShare.innerText = money(totFarm);
      const elSub = document.getElementById('t_sub'); if (elSub) elSub.innerText = money(totSub);
      const elWarn = document.getElementById('warn'); if (elWarn) elWarn.style.display = totBags > 0 ? 'none' : 'block';

      const dateTxt = fmtDate(val('i_date'));
      const supplyTxt = val('i_supply');
      const kendra = val('i_kendra');
      const inv = val('i_invoice');

      if (!letterEdited) {
        setTxt('d_office', val('i_office') || 'उद्यान विशेषज्ञ कोटद्वार गढ़वाल (पौड़ी गढ़वाल)');
        setHtm('d_kendra', kendra || '&nbsp;');
        setTxt('d_year', val('i_year'));
        ['d_sub1', 'd_sub2', 'd_sub2b', 'd_sub3', 'd_sub4'].forEach(id => setTxt(id, subPct));
        setTxt('d_farmpct', 100 - subPct);
        const rateTxt = rate ? money(rate).replace(/\.00$/, '') : '';
        ['d_rate', 'd_rate2', 'd_rate3'].forEach(id => setTxt(id, rateTxt));
        const farmShare = rate * (100 - subPct) / 100;
        setTxt('d_fs', farmShare ? (Number.isInteger(farmShare) ? farmShare : farmShare.toFixed(2)) : '');
        const subAmt = rate * subPct / 100;
        setTxt('d_subamt', subAmt ? (Number.isInteger(subAmt) ? subAmt : subAmt.toFixed(2)) : '');
        setTxt('d_typeline', T.hi + ' मशरूम (' + T.en + ' Mushroom)');
        setTxt('d_type2', T.hi);
      }
      setTxt('d_type3', T.hi);
      setHtm('d_tick_o', mtype === 'oyster' ? '✓' : '&nbsp;');
      setHtm('d_tick_b', mtype === 'button' ? '✓' : '&nbsp;');

      const dBody = document.getElementById('d_rows');
      if (dBody) {
        dBody.innerHTML = '';
        const dSz = rowSize(rows.length);
        rows.forEach((f, i) => {
          dBody.insertAdjacentHTML('beforeend', '<tr style="height:' + dSz.h + 'px">' +
            '<td class="c" style="font-size:' + dSz.fs + 'px;padding:0px 3px">' + (i + 1) + '</td>' +
            '<td style="font-size:' + dSz.fs + 'px;padding:0px 3px">' + (f ? f.name : '') + '</td>' +
            '<td style="font-size:' + dSz.fs + 'px;padding:0px 3px">' + (f ? f.vill : '') + '</td>' +
            '<td class="c" style="font-size:' + dSz.fs + 'px;padding:0px 3px">' + (f ? f.mob : '') + '</td>' +
            '<td class="c" style="font-size:' + dSz.fs + 'px;padding:0px 3px">' + (f ? f.adh : '') + '</td>' +
            '<td class="c" style="font-size:' + dSz.fs + 'px;padding:0px 3px"><b>' + (f && f.bags ? f.bags : '') + '</b></td>' +
            '<td style="padding:0px 3px"></td></tr>');
        });
      }
      const elTotal = document.getElementById('d_total'); if (elTotal) elTotal.innerText = totBags;

      const farmersForBill = rows.filter(f => f.bags > 0);
      const bins = [{ farmers: farmersForBill, bags: totBags, value: totVal }];
      function billNoFor(idx) { return inv; }

      function buildVoucherHTML(bin, billNo) {
        const bags = bin.bags, val_ = bin.value, farmShare = bags * perFarm, subAmt = bags * perSub;
        const vSz = rowSize(bin.farmers.length);
        const rowsHTML = bin.farmers.map((f, i) => '<tr style="height:' + vSz.h + 'px">' +
          '<td class="c" style="font-size:' + vSz.fs + 'px;padding:1px 4px">' + (i + 1) + '</td>' +
          '<td style="font-size:' + vSz.fs + 'px;padding:1px 4px">' + f.name + '</td>' +
          '<td style="font-size:' + vSz.fs + 'px;padding:1px 4px">' + f.vill + '</td>' +
          '<td class="c" style="font-size:' + vSz.fs + 'px;padding:1px 4px"><b>' + f.bags + '</b></td>' +
          '<td class="r" style="font-size:' + vSz.fs + 'px;padding:1px 4px">₹ ' + money(f.bags * perFarm) + '</td>' +
          '<td class="r" style="font-size:' + vSz.fs + 'px;padding:1px 4px">₹ ' + money(f.bags * perSub) + '</td>' +
          '<td style="padding:1px 4px"></td></tr>').join('');
        const office = val('i_office') || 'उद्यान विशेषज्ञ कोटद्वार गढ़वाल (पौड़ी गढ़वाल)';
        return '<div class="sheet vch-sheet"><h2 class="doc" style="margin:0 0 14px">समेकित पावती-पत्र (वितरण-सह-प्राप्ति)</h2>' +
          '<p style="margin:0">सेवा में,<br>&nbsp;&nbsp;&nbsp;' + office + ',<br>&nbsp;&nbsp;द्वारा: प्रभारी, उद्यान सचल दल केन्द्र, <span class="dline dl-long">' + (kendra || '&nbsp;') + '</span></p>' +
          '<p style="margin:10px 0 6px"><b>विषय: मैसर्स बडोला मशरूम फार्म, काशीपुर के बिल संख्या ' + (billNo || '—') + ' दिनांक ' + (dateTxt || '—') + ' पर देय राजसहायता के भुगतान हेतु प्रस्तुतीकरण।</b></p>' +
          '<p style="margin:0;text-align:justify">महोदय,<br>&nbsp;&nbsp;&nbsp;&nbsp;निवेदन है कि उद्यान सचल दल केन्द्र, ' + (kendra || '—') + ' के अन्तर्गत निम्नानुसार कृषकों द्वारा मैसर्स बडोला मशरूम फार्म, काशीपुर, ऊधम सिंह नगर से जिला योजना वर्ष ' + (val('i_year') || '2026-27') + ' के अन्तर्गत ' + subPct + '% अनुदान पर विभागीय स्वीकृत दर ₹' + money(rate) + ' प्रति बैग के अनुसार कुल <b>' + bags + '</b> बैग ' + T.hi + ' मशरूम बिजाई युक्त कम्पोस्ट क्रय किए गए हैं। उक्त कम्पोस्ट बैग संबंधित कृषकों को सही एवं पूर्ण एवं उच्च गुणवत्ता अवस्था में प्राप्त हो चुके हैं। कृषकों द्वारा निर्धारित ' + farmPct + '% कृषक अंश ₹' + money(perFarm) + ' प्रति बैग के अनुसार कुल ₹' + money(farmShare) + ' की धनराशि उक्त फर्म को अदा कर दी गई है।</p>' +
          '<p style="margin:8px 0 0;text-align:justify">फर्म द्वारा प्रस्तुत बिल संख्या ' + (billNo || '—') + ', जिसकी कुल देयक राशि ₹' + money(val_) + ' है, भुगतान हेतु प्रस्तुत किया जा रहा है। उक्त बिल के सापेक्ष कृषकों द्वारा ₹' + money(farmShare) + ' का कृषक अंश फर्म को जमा किए जाने के उपरान्त शेष ' + subPct + '% राजसहायता (अनुदान) की धनराशि ₹' + money(subAmt) + ' (' + (subAmt > 0 ? hiWords(subAmt) : '—') + ') देय है।</p>' +
          '<p style="margin:8px 0 0;text-align:justify">अतः अनुरोध है कि हमारे आवेदन एवं प्राप्त स्वीकृति के क्रम में उक्त देयक संख्या ' + (billNo || '—') + ' दिनांक ' + (dateTxt || '—') + ' की देय राजसहायता की धनराशि ₹' + money(subAmt) + ' सीधे आपूर्तिकर्ता फर्म मैसर्स बडोला मशरूम फार्म, काशीपुर, ऊधम सिंह नगर को e-Payment के माध्यम से भुगतान करने की कृपा करें।</p>' +
          '<p style="margin:8px 0 0;text-align:justify">उक्त आपूर्तिकर्ता फर्म शेष देय धनराशि का भुगतान विभाग में बजट उपलब्ध होने पर किए जाने हेतु सहमत है।</p>' +
          '<p style="margin:12px 0 6px"><b>लाभार्थी कृषकों का विवरण एवं हस्ताक्षर निम्नानुसार हैं —</b></p>' +
          '<table class="doc roster"><thead><tr><th style="width:30px">क्र०सं०</th><th style="width:190px">किसान का पूरा नाम</th><th style="width:95px">ग्राम / पंचायत</th><th style="width:44px">बैग</th><th style="width:88px">' + farmPct + '% किसान अंश</th><th style="width:92px">' + subPct + '% राजसहायता</th><th style="width:130px">हस्ताक्षर</th></tr></thead><tbody>' + rowsHTML + '</tbody><tfoot><tr><td colspan="3" class="r"><b>कुल</b></td><td class="c"><b>' + bags + '</b></td><td class="r"><b>₹ ' + money(farmShare) + '</b></td><td class="r"><b>₹ ' + money(subAmt) + '</b></td><td></td></tr></tfoot></table></div>';
      }

      function buildVendorHTML(bin, billNo) {
        const bags = bin.bags, val_ = bin.value, farmShare = bags * perFarm, subAmt = bags * perSub;
        return '<div class="sheet vendor-sheet" style="font-family:\'Courier Prime\',\'Martel\',monospace"><div style="display:flex;justify-content:space-between;align-items:flex-start;border-bottom:2px solid #000;padding-bottom:10px;margin-bottom:16px"><div><div style="font-weight:800;font-size:21px;letter-spacing:.3px">BADOLA MUSHROOMS FARM</div><div style="font-weight:700;font-size:12.5px">(COMPOST UNIT)</div><div style="font-size:11px;margin-top:3px">H.O.-Dhanori Patti, D.P.S. Road, Kashipur (U.S. Nagar) U.K.</div><div style="font-size:11px">Compost Unit-Vill. Pratappur, Near Pickle Factory, Kashipur (U.S. Nagar)</div><div style="font-size:11px;margin-top:3px">GSTIN No.: 05CHXPS3134D1Z5 &nbsp;|&nbsp; Mob.: 9899935600, 6398264916</div></div><div style="text-align:right;font-size:11px;white-space:nowrap;padding-top:2px"><div style="text-decoration:underline;font-weight:700;margin-bottom:4px">CERTIFICATE</div>Ref. Bill No. : ' + (billNo || '—') + '<br>Date : ' + (dateTxt || '—') + '</div></div><div style="text-align:center;font-weight:700;font-size:14px;text-decoration:underline;margin-bottom:14px">विक्रेता का प्रमाण-पत्र (Supplier\'s Certificate)</div><p style="margin:0;text-align:justify;font-size:12.5px;line-height:1.7">मैं, मैसर्स बडोला मशरूम फार्म, काशीपुर, ऊधम सिंह नगर, प्रमाणित करता हूँ कि उद्यान सचल दल केन्द्र, <b>' + (kendra || '—') + '</b> के अंतर्गत बिल संख्या <b>' + (billNo || '—') + '</b> दिनांक <b>' + (dateTxt || '—') + '</b> के अनुसार उपरोक्त कृषकों को कुल <b>' + bags + '</b> बैग ' + T.hi + ' मशरूम बिजाई युक्त कम्पोस्ट सही एवं पूर्ण अवस्था में वितरित कर दिए हैं, जो कृषकों को दिनांक <b>' + (supplyTxt || '—') + '</b> (Date of Supply) को प्राप्त हो चुके हैं, जिनका कुल मूल्य रुपये <b>' + money(val_) + '</b> है, तथा कृषकों से निर्धारित कृषक अंश (' + farmPct + '%) की धनराशि रुपये <b>' + money(farmShare) + '</b> प्राप्त कर ली गई है।</p><p style="margin:12px 0 0;text-align:justify;font-size:12.5px;line-height:1.7"><b>अतः शेष ' + subPct + '% राजसहायता (अनुदान) की धनराशि रुपये ' + money(subAmt) + ' (' + (subAmt > 0 ? hiWords(subAmt) : '—') + ') का भुगतान मुझे करने की कृपा कीजिएगा।</b></p><div style="margin-top:60px;text-align:right;font-size:12px"><div>For BADOLA MUSHROOMS FARM</div><div style="margin-top:34px;border-top:1px solid #000;padding-top:3px;display:inline-block;min-width:220px">Authorised Signatory / विक्रेता के हस्ताक्षर व मुहर</div></div></div>';
      }

      function buildSatyapanHTML(bin, billNo) {
        const bags = bin.bags, val_ = bin.value, farmShare = bags * perFarm, subAmt = bags * perSub;
        const officeDistrict = val('i_office') || 'पौड़ी गढ़वाल';
        return '<div class="sheet saty-sheet" style="font-family:\'Tiro Devanagari Hindi\',\'Martel\',serif"><div style="text-align:center;border-bottom:1.6px solid #000;padding-bottom:8px;margin-bottom:16px"><div style="font-weight:700;font-size:14px">कार्यालय प्रभारी, उद्यान सचल दल केन्द्र, ' + (kendra || '—') + '</div><div style="font-size:11.5px">जनपद ' + officeDistrict + ', उद्यान विभाग, उत्तराखण्ड</div><h2 class="doc" style="margin:10px 0 0;font-size:17px;text-decoration:underline">सत्यापन आख्या</h2></div><p style="margin:0;text-align:right;font-size:12px">सन्दर्भ : बिल संख्या <b>' + (billNo || '—') + '</b> · दिनांक <b>' + (dateTxt || '—') + '</b></p><p style="margin:10px 0 0;text-align:justify">प्रमाणित किया जाता है कि उपरोक्त देयक (बिल) संख्या <b>' + (billNo || '—') + '</b> दिनांक <b>' + (dateTxt || '—') + '</b>, मैसर्स बडोला मशरूम फार्म (कम्पोस्ट यूनिट), काशीपुर, ऊधम सिंह नगर से सम्बन्धित कृषकों द्वारा क्रय किए गए बिजाई युक्त ' + T.hi + ' मशरूम कम्पोस्ट बैग का मेरे द्वारा सत्यापन कर लिया गया है। वितरित बैगों की गुणवत्ता, मात्रा एवं विशिष्टताओं का भौतिक सत्यापन कर लिया गया है तथा बैग रोगमुक्त एवं बिजाई युक्त पाए गए हैं। उक्त बिल के अनुसार <b>' + bags + '</b> बिजाई युक्त ' + T.hi + ' मशरूम कम्पोस्ट बैग सम्बंधित कृषकों को दिनांक <b>' + (supplyTxt || '—') + '</b> (Date of Supply) को प्राप्त हो चुके हैं तथा कृषक अंश (' + farmPct + '%) की धनराशि रुपये <b>' + money(farmShare) + '</b> आपूर्तिकर्ता फर्म द्वारा कृषकों से प्राप्त कर ली गई है।</p><p style="margin:10px 0 0;text-align:justify">अतः बिल की कुल धनराशि रुपये <b>' + money(val_) + '</b> में से राजसहायता (अनुदान) की धनराशि रुपये <b>' + money(subAmt) + '</b> (' + (subAmt > 0 ? hiWords(subAmt) : '—') + ') जो कि बिल के कुल योग का ' + subPct + ' प्रतिशत है, <b>उक्त आपूर्तिकर्ता फर्म को भुगतान करने की कृपा कीजियेगा।</b></p><p style="margin:16px 0 0;text-align:justify"><b>संलग्न है:</b> समेकित पावती-पत्र, BADOLA MUSHROOMS FARM (COMPOST UNIT) का इनवॉइस।</p><div style="display:flex;justify-content:flex-end;margin-top:60px"><div class="center">प्रभारी,<br>उद्यान सचल दल केन्द्र, <span class="dline">' + (kendra || '&nbsp;') + '</span></div></div></div>';
      }

      function invRowHTML(bags, rate, val_) {
        return '<tr style="height:34px"><td class="c">1</td><td>Spawned Compost Bag — ' + T.en + ' Mushroom (' + kg + ' kg / bag)<br><span style="font-size:11px">बिजाई युक्त ' + T.hi + ' मशरूम कम्पोस्ट बैग</span><br><span style="font-size:11px">Date of Supply : ' + (supplyTxt || '—') + '</span></td><td class="c">' + (bags || '') + '</td><td class="r">' + (bags ? money(rate) : '') + '</td><td class="r">' + (bags ? money(val_) : '') + '</td></tr>';
      }
      function officerStampHTML(subAmt) {
        const BLUE = '#12279e';
        return '<div style="padding:8px 12px;width:100%;max-width:230px;text-align:center;page-break-inside:avoid;break-inside:avoid;color:' + BLUE + ';transform:rotate(1.2deg);opacity:0.92"><div style="font-weight:700;line-height:1.35;font-size:8.5px">कृषकों के अनुरोध पर देयक की राजसहायता की धनराशि रुपये ' + money(subAmt) + ' फर्म को भुगतान हेतु संस्तुति सहित अग्रसारित है।</div><div style="margin-top:16px;border-top:1px solid ' + BLUE + ';padding-top:4px;font-size:9px;font-weight:700;line-height:1.4">प्रभारी,<br>उद्यान सचल दल केन्द्र, ' + (kendra || '&nbsp;') + '</div></div>';
      }
      function certBoxHTML(subAmt, farmersList) {
        const n = farmersList.length;
        const BLUE = '#12279e';
        const sSz = n <= 8 ? { circ: 16, fs: 8.5, gap: 5, rowgap: 5 } : n <= 14 ? { circ: 14, fs: 7.5, gap: 4, rowgap: 3 } : { circ: 12, fs: 6.5, gap: 3, rowgap: 2 };
        const signItems = farmersList.map((f, i) => '<div style="display:flex;align-items:center;gap:' + sSz.gap + 'px"><span style="border:1.1px solid ' + BLUE + ';border-radius:50%;width:' + sSz.circ + 'px;height:' + sSz.circ + 'px;min-width:' + sSz.circ + 'px;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:' + (sSz.fs - 1) + 'px;color:' + BLUE + '">' + (i + 1) + '</span><span style="flex:1;border-bottom:1px solid ' + BLUE + ';font-size:' + sSz.fs + 'px;padding-bottom:1px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;color:' + BLUE + '">' + (f.name || '&nbsp;') + '</span></div>').join('');
        return '<div style="padding:6px 12px;width:100%;max-width:340px;text-align:center;page-break-inside:avoid;break-inside:avoid;color:' + BLUE + ';transform:rotate(-1.5deg);opacity:0.92"><div style="font-weight:700;line-height:1.3;font-size:9px">प्रमाणित किया जाता है कि उक्त क्रय हमारे द्वारा किया गया है। अतः उक्त बिल पर देय राजसहायता की धनराशि ₹' + money(subAmt) + ' फर्म को हमारे अनुरोध पर प्रदान/जारी करने की कृपा करें।</div><div style="display:flex;align-items:center;margin:6px 0 5px"><div style="flex:1;border-bottom:1px solid ' + BLUE + '"></div><div style="border:1.2px solid ' + BLUE + ';border-radius:10px;padding:1px 10px;font-weight:700;white-space:nowrap;margin:0 5px;font-size:9px">कृषक हस्ताक्षर</div><div style="flex:1;border-bottom:1px solid ' + BLUE + '"></div></div><div style="display:grid;grid-template-columns:1fr 1fr;gap:' + sSz.rowgap + 'px 12px;text-align:left">' + (signItems || '<div></div>') + '</div></div>';
      }
      function buildInvoiceHTML(billNo, buyerName, buyerAddr, bags, val_, subAmt, farmersList, vehicles) {
        vehicles = vehicles || [];
        const half = gst / 2, cg = val_ * half / 100, sg = val_ * half / 100, gt_ = val_ + cg + sg;
        const shortForm = farmersList.length <= 12;
        const billFs = buyerName.length > 250 ? 9.5 : buyerName.length > 150 ? 10.5 : 12.5;
        const vehFs = vehicles.length > 4 ? 10 : 12.5;
        const vehGap = vehicles.length > 4 ? 3 : 6;
        let stampHTML = '';
        const showStampChk = document.getElementById('i_showstamp');
        if (showStampChk && showStampChk.checked) stampHTML = certBoxHTML(subAmt, farmersList) + officerStampHTML(subAmt);
        return '<div class="sheet inv-sheet' + (shortForm ? ' short-inv' : '') + '"><div class="inv-head"><div class="inv-top"><span>GSTIN No.: 05CHXPS3134D1Z5</span><span style="text-decoration:underline">TAX INVOICE</span><span>Mob.: 9899935600, 6398264916</span></div><div class="inv-name"><h1>BADOLA MUSHROOMS FARM</h1><div class="u">(COMPOST UNIT)</div><div class="a">H.O.-Dhanori Patti, D.P.S. Road, Kashipur (U.S. Nagar) U.K.</div><div class="a">Compost Unit-Vill. Pratappur, Near Pickle Factory, Kashipur (U.S. Nagar)</div></div><div class="inv-bill" style="font-size:' + billFs + 'px"><div><div style="font-weight:700;text-decoration:underline;margin-bottom:3px;font-size:12.5px">Billing Details</div><div>M/s : <span class="dline dl-long">' + (buyerName || '&nbsp;') + '</span></div><div>Address : <span class="dline dl-long">' + (buyerAddr || '&nbsp;') + '</span></div><div>Way No. : <span class="dline dl-long">&nbsp;</span></div></div><div style="font-size:12.5px"><div>Bill Date (बिल दिनांक) : <span class="dline">' + (dateTxt || '&nbsp;') + '</span></div><div style="margin-top:6px">Invoice No. : <span class="dline">' + (billNo || '&nbsp;') + '</span></div>' + (vehicles.length ? '<div style="margin-top:' + vehGap + 'px;font-weight:700;text-decoration:underline;font-size:' + vehFs + 'px">वाहन संख्या</div>' + vehicles.map((v, i) => '<div style="margin-top:' + (vehGap - 1) + 'px;font-size:' + vehFs + 'px">वाहन संख्या ' + (i + 1) + ' : <span class="dline" style="font-weight:700">' + v + '</span></div>').join('') : '') + '</div></div><div class="inv-items"><table class="doc inv-tbl"><colgroup><col style="width:38px"><col><col style="width:78px"><col style="width:95px"><col style="width:115px"></colgroup><thead><tr><th style="border-left:0">Sr.<br>No.</th><th>Description of Goods</th><th>Qty / Unit</th><th>Rate / Unit</th><th style="border-right:0">Taxable Value</th></tr></thead><tbody>' + invRowHTML(bags, rate, val_) + '</tbody></table></div><div class="inv-spacer" style="gap:14px">' + stampHTML + '</div><div class="inv-foot"><table class="doc inv-tbl"><colgroup><col style="width:38px"><col><col style="width:78px"><col style="width:95px"><col style="width:115px"></colgroup><tbody><tr><td colspan="2" rowspan="6" class="bank" style="border-left:0"><div style="font-weight:700;text-decoration:underline">Bank Detail :</div><div>Bank Name : The Nainital Bank Ltd.</div><div>Bank A/c No. : 1586000000000002</div><div>Branch : Pratappur (Kashipur)</div><div>Bank IFSC : NTBL0KAS158</div><div style="margin-top:8px">Total Amount Value (in figures) : <b>₹ ' + money(gt_) + '</b></div><div>Total Amount Value (in words) : <b>' + (gt_ > 0 ? enWords(gt_) : '—') + '</b></div><div class="terms"><b>Terms and Conditions :</b><br>1. All disputes are subject to Kashipur Jurisdiction.<br>2. Interest @24% will be charged if the payment is not made on realisation.<br>3. Goods once sold are neither refundable nor exchangeable.</div></td><td colspan="2">Total</td><td class="r" style="border-right:0">' + money(val_) + '</td></tr><tr><td colspan="2">C.G.S.T. @ ' + half + '%</td><td class="r" style="border-right:0">' + money(cg) + '</td></tr><tr><td colspan="2">S.G.S.T. @ ' + half + '%</td><td class="r" style="border-right:0">' + money(sg) + '</td></tr><tr><td colspan="2">I.G.S.T. @ —</td><td class="r" style="border-right:0">0.00</td></tr><tr class="gt"><td colspan="2"><b>G. Total</b></td><td class="r" style="border-right:0"><b>' + money(gt_) + '</b></td></tr><tr><td colspan="3" class="sign" style="border-right:0"><b>For BADOLA MUSHROOMS FARM</b><div style="margin-top:44px">Authorised Signatory</div></td></tr></tbody></table></div></div></div>';
      }

      const startNo = parseInt(val('i_rcptno')) || 0;
      const mode = val('i_rmode') || 'one';
      let slipNo = 0;
      function slip(name, place, bags, amt, foot) {
        const no = startNo ? (startNo + slipNo) : '';
        slipNo++;
        return '<div class="sheet rcpt"><div class="rcpt-card"><div style="display:flex;justify-content:space-between;font-size:11px;font-weight:700"><span>GSTIN : 05CHXPS3134D1Z5</span><span class="ttl">नकद प्राप्ति रसीद</span><span style="text-align:right">M. : 9899935600<br>6398264916</span></div><h1>बडोला मशरूम फार्म (कम्पोस्ट यूनिट)</h1><div class="center" style="font-weight:700;font-size:13px">ग्राम प्रतापपुर – काशीपुर (उत्तराखण्ड)</div><div style="display:flex;justify-content:space-between;margin-top:10px;font-size:14px"><div>नं० <b>' + (no || '________') + '</b></div><div>दिनांक <b>' + (dateTxt || '____________') + '</b></div></div><div style="margin-top:10px;font-size:' + ((name || '').length > 90 ? 12.5 : 14) + 'px;line-height:' + ((name || '').length > 60 ? 1.65 : 2.1) + ';text-align:justify">नाम <b>' + (name || '____________________') + '</b><br>ग्राम <b>' + (place || '________________') + '</b> से <b>' + bags + ' बैग (' + (bags * kg) + ' किग्रा)</b> ' + T.hi + ' मशरूम<br>कम्पोस्ट का भुगतान रुपया <b>' + money(amt) + '</b> (' + hiWords(amt) + ')<br>प्राप्त किया ।</div><div style="margin-top:8px;font-size:11.5px">' + foot + '</div><div style="display:flex;justify-content:flex-end;align-items:flex-end;margin-top:26px;font-size:12px"><div class="center"><b>For BADOLA MUSHROOMS FARM</b><div style="margin-top:22px">हस्ताक्षर</div></div></div></div></div>';
      }

      const voucherZone = document.getElementById('voucher_zone'); if (voucherZone) voucherZone.innerHTML = '';
      const vendorZone = document.getElementById('vendor_zone'); if (vendorZone) vendorZone.innerHTML = '';
      const satyapanZone = document.getElementById('satyapan_zone'); if (satyapanZone) satyapanZone.innerHTML = '';
      const invZone = document.getElementById('invoice_zone'); if (invZone) invZone.innerHTML = '';
      const rcptZone = document.getElementById('receipt_zone'); if (rcptZone) rcptZone.innerHTML = '';

      bins.forEach((bin, idx) => {
        const billNo = billNoFor(idx);
        const buyerName = [...new Set(bin.farmers.map(f => f.name))].join(', ');
        const buyerAddr = [...new Set(bin.farmers.map(f => f.vill).filter(Boolean))].join(', ');
        if (voucherZone) voucherZone.insertAdjacentHTML('beforeend', buildVoucherHTML(bin, billNo));
        if (vendorZone) vendorZone.insertAdjacentHTML('beforeend', buildVendorHTML(bin, billNo));
        if (satyapanZone) satyapanZone.insertAdjacentHTML('beforeend', buildSatyapanHTML(bin, billNo));
        if (invZone) invZone.insertAdjacentHTML('beforeend', buildInvoiceHTML(billNo, buyerName, buyerAddr, bin.bags, bin.value, bin.bags * perSub, bin.farmers, collectVehicles()));
        if (mode === 'one' || mode === 'both') {
          if (bin.bags > 0 && rcptZone) {
            rcptZone.insertAdjacentHTML('beforeend', slip(buyerName, buyerAddr || kendra || 'सचल दल केन्द्र', bin.bags, bin.bags * perFarm, 'कुल ' + bin.farmers.length + ' कृषक · बिल सं० ' + (billNo || '—') + ' · कुल बिल ₹' + money(bin.value) + ' का कृषक अंश ' + farmPct + '%'));
          }
        }
        if (mode === 'each' || mode === 'both') {
          if (rcptZone) bin.farmers.forEach(f => rcptZone.insertAdjacentHTML('beforeend', slip(f.name, f.vill, f.bags, f.bags * perFarm, 'कृषक अंश ' + farmPct + '% · दर ₹' + money(perFarm) + ' प्रति बैग')));
        }
      });
    }

    function printDoc(which) {
      document.body.setAttribute('data-print', which);
      window.print();
    }
    window.onafterprint = () => { document.body.removeAttribute('data-print'); };

    const FIELDS = ['i_rate', 'i_kg', 'i_sub', 'i_gst', 'i_kendra', 'i_office', 'i_year', 'i_date', 'i_supply', 'i_invoice', 'i_rcptno', 'i_billto', 'i_billaddr', 'i_rmode'];
    function snapshot() {
      const d = { mtype, fields: {}, farmers: collect(), vehicles: collectVehicles(), letter: letterEdited ? document.getElementById('d_letter').innerHTML : '' };
      FIELDS.forEach(id => { d.fields[id] = val(id); });
      return d;
    }

    function getAuto() { return MEM_AUTO; }
    function putAuto(a) { MEM_AUTO = a || {}; }
    function toggleAuto(kind) {
      const fieldId = kind === 'inv' ? 'i_invoice' : 'i_rcptno';
      const chk = document.getElementById('auto_' + kind + '_chk');
      const field = document.getElementById(fieldId);
      if (!chk || !field) return;
      const a = getAuto();
      if (chk.checked) {
        const startVal = parseInt(field.value);
        if (!startVal) { alert('पहले शुरुआती नंबर भरें, फिर स्वतः क्रमांक चालू करें।'); chk.checked = false; return; }
        a[kind] = { on: true, next: startVal };
      } else {
        a[kind] = { on: false, next: (a[kind] ? a[kind].next : null) };
      }
      putAuto(a); applyAutoStyling();
    }
    function applyAutoStyling() {
      const a = getAuto();
      ['inv', 'rcpt'].forEach(k => {
        const fieldId = k === 'inv' ? 'i_invoice' : 'i_rcptno';
        const chk = document.getElementById('auto_' + k + '_chk'), field = document.getElementById(fieldId);
        if (!chk || !field) return;
        const on = !!(a[k] && a[k].on);
        chk.checked = on; field.readOnly = on; field.style.background = on ? '#F4F2EA' : '';
      });
    }

    function applyData(d) {
      Object.keys(d.fields || {}).forEach(id => {
        const el = document.getElementById(id);
        if (el) {
          const valToSet = d.fields[id] !== undefined && d.fields[id] !== null ? String(d.fields[id]) : "";
          if (el.tagName === 'SELECT' && valToSet !== "") {
            let optionExists = false;
            for (let i = 0; i < el.options.length; i++) {
              if (el.options[i].value === valToSet) {
                optionExists = true;
                break;
              }
            }
            if (!optionExists) {
              const opt = document.createElement('option');
              opt.value = valToSet;
              opt.innerText = valToSet;
              el.appendChild(opt);
            }
          }
          el.value = valToSet;
        }
      });
      if (d.letter) { document.getElementById('d_letter').innerHTML = d.letter; letterEdited = true; }
      else { document.getElementById('d_letter').innerHTML = LETTER_HTML; letterEdited = false; }
      document.getElementById('entry_body').innerHTML = '';
      if (d.farmers && d.farmers.length > 0) {
        d.farmers.forEach(f => addRow(f));
      } else {
        for (let i = 0; i < 3; i++) addRow();
      }
      document.getElementById('vehicle_list').innerHTML = '';
      const vList = d.vehicles || [];
      if (vList.length) vList.forEach(v => addVehicleRow(v)); else addVehicleRow();
      if (d.mtype) pickTypeQuiet(d.mtype);
      applyAutoStyling();
      render();
    }

    function saveJSON() {
      const blob = new Blob([JSON.stringify(snapshot(), null, 2)], { type: 'application/json' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'mushroom-' + (val('i_kendra') || 'data') + '-' + (val('i_date') || '') + '.json';
      a.click(); URL.revokeObjectURL(a.href);
    }
    function getRecs() { return MEM_REC; }
    function putRecs(a) { MEM_REC = Array.isArray(a) ? a : []; return true; }
    function summary(d) {
      const rate = parseFloat(d.fields?.i_rate) || 0, sub = parseFloat(d.fields?.i_sub) || 0;
      const bags = (d.farmers || []).reduce((s, f) => s + (parseInt(f.bags) || 0), 0);
      return { bags, kisan: (d.farmers || []).filter(f => f.name || f.bags).length, value: bags * rate, subsidy: bags * rate * sub / 100 };
    }
    function saveRecord(asNew) {
      const d = snapshot(), s = summary(d);
      if (!d.fields.i_kendra) { alert('पहले केन्द्र चुनें।'); return; }
      if (s.bags <= 0 && !confirm('इस प्रविष्टि में कोई बैग दर्ज नहीं है। फिर भी सहेजें?')) return;
      const now = new Date().toISOString();
      if (!asNew && curRec) {
        const i = MEM_REC.findIndex(r => r.id === curRec);
        if (i > -1) { MEM_REC[i] = { ...MEM_REC[i], data: d, savedAt: now }; renderRecords(); flash('प्रविष्टि अद्यतन कर दी गई।'); return; }
      }
      const id = 'rec_' + Date.now();
      MEM_REC.unshift({ id, savedAt: now, data: d }); curRec = id;
      renderRecords(); flash('प्रविष्टि सहेजी गई।');
    }
    function openRecord(id) {
      const r = MEM_REC.find(x => x.id === id); if (!r) return;
      curRec = id; applyData(r.data); renderRecords();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    function deleteRecord(id) {
      if (!confirm('यह प्रविष्टि हटाई जाए?')) return;
      MEM_REC = MEM_REC.filter(x => x.id !== id);
      if (curRec === id) curRec = null;
      renderRecords();
    }
    function newEntry() {
      curRec = null; letterEdited = false; mtype = '';
      const letter = document.getElementById('d_letter'); if (letter) letter.innerHTML = LETTER_HTML;
      const body = document.getElementById('entry_body'); if (body) body.innerHTML = '';
      ['i_rate', 'i_kg', 'i_sub', 'i_gst', 'i_kendra', 'i_office', 'i_year', 'i_date', 'i_supply', 'i_invoice', 'i_rcptno', 'i_billto', 'i_billaddr', 'i_rmode'].forEach(id => { const e = document.getElementById(id); if (e) e.value = ''; });
      const vl = document.getElementById('vehicle_list'); if (vl) vl.innerHTML = '';
      document.querySelectorAll('.type').forEach(el => el.dataset.on = '0');
      document.querySelectorAll('input[name="mtype"]').forEach(el => el.checked = false);
      applyAutoStyling(); renderRecords(); render();
    }
    function flash(msg) {
      const el = document.getElementById('rec_msg');
      if (!el) return;
      el.innerText = msg; el.style.display = 'block';
      clearTimeout(el._t); el._t = setTimeout(() => el.style.display = 'none', 4000);
    }
    function renderRecords() {
      const recs = getRecs(), tb = document.getElementById('rec_body');
      const elCount = document.getElementById('rec_count'); if (elCount) elCount.innerText = recs.length;
      const btnUpd = document.getElementById('btnUpdate'); if (btnUpd) btnUpd.style.display = curRec ? 'inline-block' : 'none';
      if (!tb) return;
      tb.innerHTML = '';
      if (!recs.length) {
        tb.innerHTML = '<tr><td colspan="8" style="text-align:center;color:#55524A;padding:14px">अभी कोई प्रविष्टि सहेजी नहीं गई है।</td></tr>';
        return;
      }
      recs.forEach(r => {
        const d = r.data, s = summary(d), f = d.fields || {};
        const t = (d.mtype === 'oyster') ? 'ऑयस्टर' : 'बटन';
        const dt = (f.i_date || '').split('-').reverse().join('/');
        tb.insertAdjacentHTML('beforeend',
          '<tr' + (r.id === curRec ? ' style="background:#F4F9F5"' : '') + '>' +
          '<td><b>' + (f.i_kendra || '—') + '</b></td>' +
          '<td>' + (dt || '—') + '</td>' +
          '<td>' + (f.i_invoice || '—') + '</td>' +
          '<td>' + t + '</td>' +
          '<td style="text-align:center">' + s.kisan + '</td>' +
          '<td style="text-align:center">' + s.bags + '</td>' +
          '<td style="text-align:right">₹ ' + money(s.value) + '</td>' +
          '<td style="white-space:nowrap;text-align:center">' +
          '<button class="btn s" style="padding:4px 9px;font-size:12px" onclick="window.openRecord(\'' + r.id + '\')">खोलें</button> ' +
          '<button class="btn d" onclick="window.deleteRecord(\'' + r.id + '\')">✕</button></td></tr>');
      });
    }

    window.render = render;
    window.addRow = addRow;
    window.delRow = delRow;
    window.pickType = pickType;
    window.addVehicleRow = addVehicleRow;
    window.delVehicleRow = delVehicleRow;
    window.printDoc = printDoc;
    window.resetLetter = resetLetter;
    window.toggleAuto = toggleAuto;
    window.saveRecord = saveRecord;
    window.openRecord = openRecord;
    window.deleteRecord = deleteRecord;
    window.newEntry = newEntry;
    window.saveJSON = saveJSON;
    window.applyData = applyData;
    window.getRecs = getRecs;
    window.putRecs = putRecs;
    window.renderRecords = renderRecords;
    window.getSnapshot = snapshot;

    const entryBody = document.getElementById('entry_body');
    if (entryBody) entryBody.addEventListener('input', () => { autoFilled = false; });
    const letterEl = document.getElementById('d_letter');
    if (letterEl) {
      LETTER_HTML = letterEl.innerHTML;
      letterEl.addEventListener('input', () => { letterEdited = true; });
    }
    applyAutoStyling();
    render();
    renderRecords();

    return () => {
      document.body.removeAttribute('data-print');
    };
  }, []);

  const renderModalTable = () => {
    if (!modalData.data || modalData.data.length === 0) {
      return (<p style={{ textAlign: "center", color: "#55524A", padding: "20px" }}>कोई डेटा उपलब्ध नहीं है।</p>);
    }
    const allKeys = Object.keys(modalData.data[0]);
    const visibleHeaders = allKeys.filter((key) => !HIDDEN_COLUMNS.includes(key));
    return (
      <div style={{ overflowX: "auto" }}>
        <table className="data-view-table">
          <thead><tr>{visibleHeaders.map((h, i) => (<th key={i}>{h}</th>))}</tr></thead>
          <tbody>
            {modalData.data.map((row, rIdx) => {
              const rowId = row.id;
              return (
                <tr key={rIdx} style={{ background: editedRows[rowId] ? "#fff8e1" : "" }}>
                  {visibleHeaders.map((h, cIdx) => {
                    const editedValue = editedRows[rowId]?.[h];
                    const currentValue = editedValue !== undefined ? editedValue : String(row[h] ?? "");
                    const isEdited = editedRows[rowId]?.[h] !== undefined;
                    return (
                      <td key={cIdx} style={{ background: isEdited ? "#fff3cd" : "" }}>
                        <input type="text" value={currentValue}
                          onChange={(e) => handleCellEdit(rowId, h, e.target.value)}
                          style={{ width: "100%", minWidth: "90px", border: "1px solid transparent", background: "transparent", padding: "4px 6px", fontSize: "12px", fontFamily: "inherit", color: "var(--ink)", borderRadius: "3px" }}
                          onFocus={(e) => { e.target.style.border = "1px solid var(--leaf)"; e.target.style.background = "#fff"; }}
                          onBlur={(e) => { e.target.style.border = "1px solid transparent"; e.target.style.background = "transparent"; }}
                        />
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="mushroom-form mushroom-form-fullscreen">
      {/* TAB HEADER */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "20px", borderBottom: "2px solid #ccc" }}>
        <button 
          onClick={() => setActiveTab("form")} 
          style={{ padding: "10px 20px", cursor: "pointer", background: activeTab === "form" ? "#14553A" : "#fff", color: activeTab === "form" ? "#fff" : "#000", border: "1px solid #ccc", borderRadius: "4px 4px 0 0", borderBottom: "none", fontWeight: "bold" }}
        >
          📝 Fill Form {currentFormId && "(Editing)"}
        </button>
        <button 
          onClick={() => { setActiveTab("list"); fetchRecords(); }} 
          style={{ padding: "10px 20px", cursor: "pointer", background: activeTab === "list" ? "#14553A" : "#fff", color: activeTab === "list" ? "#fff" : "#000", border: "1px solid #ccc", borderRadius: "4px 4px 0 0", borderBottom: "none", fontWeight: "bold" }}
        >
          📋 View Records
        </button>
      </div>

      {feedbackMsg.text && (
        <div style={{ marginBottom: "15px", padding: "10px", background: feedbackMsg.type === "error" ? "#FDF3F2" : "#F1F8F3", border: `1px solid ${feedbackMsg.type === "error" ? "#E3B7B3" : "#BBD9C6"}`, color: feedbackMsg.type === "error" ? "#8E1F16" : "#14553A", borderRadius: "4px", fontWeight: "bold" }}>
          {feedbackMsg.text}
        </div>
      )}

      {/* FORM TAB */}
      {activeTab === "form" && (
        <div className="wrap no-print">
          <div className="panel">
            <h1>मशरूम कम्पोस्ट बैग — प्रपत्र प्रणाली</h1>
            <p className="sub">एक बार विवरण भरें — मांग-पत्र, समेकित पावती-पत्र, टैक्स इनवॉइस और नकद रसीद अपने आप तैयार हो जाएँगे।</p>

            <div className="legend">0 · बैकएंड डेटा अपलोड करें और फ़ॉर्म भरें</div>
            <div className="excel-import-box bulk-upload-container">
              <div className="bulk-upload-box" style={{ background: "#F1F8F3", border: "1.6px solid #14553A", marginBottom: "15px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px" }}>
                <div>
                  <p className="bulk-upload-title" style={{ margin: "0 0 4px" }}>बैकएंड से डेटा लाएँ और फ़ॉर्म अपने-आप भरें</p>
                  <p style={{ margin: 0, fontSize: "12px", color: "var(--ink-soft)" }}>सर्वर पर अपलोड किए गए डेटा से केन्द्र, कृषक व वाहन विवरण नीचे फ़ॉर्म में अपने-आप भर जाएगा।</p>
                </div>
                <button className="btn p" type="button" onClick={fetchAndAutoFillForm} disabled={isFetching}>
                  {isFetching ? "⏳ प्राप्त कर रहे हैं..." : "🔄 सर्वर से डेटा लाएँ"}
                </button>
              </div>

              <div className="bulk-upload-box">
                <p className="bulk-upload-title">केन्द्र विवरण (Centre Details)</p>
                <div className="bulk-upload-row">
                  <input type="file" id="kendraFileInput" accept=".xlsx,.xls" onChange={handleKendraFileChange} disabled={isUploading} />
                  <button className="btn s" type="button" onClick={downloadKendraTemplate} disabled={isUploading}>📄 टेम्पलेट</button>
                  {kendraData.length > 0 && (
                    <button className="btn p" type="button" onClick={handleKendraUpload} disabled={isUploading}>
                      {isUploading ? "⏳ अपलोड..." : "📤 बैकएंड में पोस्ट करें"}
                    </button>
                  )}
                </div>
                {fetchedKendraData.length > 0 && (
                  <button className="btn s" type="button" onClick={() => { setEditedRows({}); setHasUnsavedChanges(false); setModalData({ open: true, type: "kendra", data: fetchedKendraData }); }} style={{ marginTop: "10px" }}>
                    👁 केन्द्र डेटा देखें ({fetchedKendraData.length} पंक्तियाँ)
                  </button>
                )}
              </div>

              <div className="bulk-upload-box">
                <p className="bulk-upload-title">कृषक सूची</p>
                <div className="bulk-upload-row">
                  <input type="file" id="farmerFileInput" accept=".xlsx,.xls" onChange={handleFarmerFileChange} disabled={isUploading} />
                  <button className="btn s" type="button" onClick={downloadFarmerTemplate} disabled={isUploading}>📄 टेम्पलेट</button>
                  {farmerData.length > 0 && (
                    <button className="btn p" type="button" onClick={handleFarmerUpload} disabled={isUploading}>
                      {isUploading ? "⏳ अपलोड..." : "📤 बैकएंड में पोस्ट करें"}
                    </button>
                  )}
                </div>
                {fetchedFarmerData.length > 0 && (
                  <button className="btn s" type="button" onClick={() => { setEditedRows({}); setHasUnsavedChanges(false); setModalData({ open: true, type: "farmer", data: fetchedFarmerData }); }} style={{ marginTop: "10px" }}>
                    👁 कृषक डेटा देखें ({fetchedFarmerData.length} पंक्तियाँ)
                  </button>
                )}
              </div>

              {isUploading && uploadProgress.total > 0 && (
                <div className="upload-progress-container" style={{ marginTop: "15px" }}>
                  <div className="upload-progress-label">
                    {uploadProgress.type === "kendra" ? "केन्द्र विवरण" : "कृषक सूची"} अपलोड हो रहा है...
                    <span>{uploadProgress.current} / {uploadProgress.total}</span>
                  </div>
                  <div className="upload-progress-bar">
                    <div className="upload-progress-fill" style={{ width: `${Math.round((uploadProgress.current / uploadProgress.total) * 100)}%` }}></div>
                  </div>
                </div>
              )}
              {uploadMsg.text && (
                <div className="excel-file-status" style={{ marginTop: "15px" }}>
                  <span className="excel-status" style={{ color: uploadMsg.type === "error" ? "red" : uploadMsg.type === "success" ? "green" : "#333", fontWeight: "bold" }}>
                    {uploadMsg.text}
                  </span>
                </div>
              )}
            </div>

            <div className="legend">1 · मशरूम का प्रकार चुनें</div>
            <div className="types">
              <div className="type" data-type="button" data-on="0" onClick={() => window.pickType("button")}>
                <input type="radio" name="mtype" id="t_button" />
                <div><b>बटन मशरूम (Button)</b><span>दर और बैग वजन अपलोड किए गए डेटा से आएगा</span></div>
              </div>
              <div className="type" data-type="oyster" data-on="0" onClick={() => window.pickType("oyster")}>
                <input type="radio" name="mtype" id="t_oyster" />
                <div><b>ऑयस्टर मशरूम</b><span>दर और बैग वजन अपलोड किए गए डेटा से आएगा</span></div>
              </div>
            </div>

            <div className="grid" style={{ marginTop: "12px" }}>
              <div><label className="f">पूर्ण दर (₹ प्रति बैग)</label><input type="number" id="i_rate" min="0" step="0.01" onInput={() => window.render()} /></div>
              <div><label className="f">बैग वजन (किग्रा)</label><input type="number" id="i_kg" min="0" step="0.5" onInput={() => window.render()} /></div>
              <div><label className="f">अनुदान प्रतिशत (%)</label><input type="number" id="i_sub" min="0" max="100" onInput={() => window.render()} /></div>
              <div>
                <label className="f">जी०एस०टी० दर (%)</label>
                <select id="i_gst" onChange={() => window.render()}>
                  <option value="">— GST चुनें —</option>
                  <option value="0">0% (छूट प्राप्त)</option>
                  <option value="5">5%</option>
                  <option value="12">12%</option>
                  <option value="18">18%</option>
                </select>
              </div>
            </div>

            <div className="legend">2 · कार्यालय एवं आवेदन विवरण</div>
            <div className="grid">
              <div>
                <label className="f">उद्यान सचल दल केन्द्र</label>
                <select id="i_kendra" value={currentKendra} onChange={(e) => {
                  const selectedKendra = e.target.value;
                  setCurrentKendra(selectedKendra);
                  if (selectedKendra && window.applyData) {
                    const record = fetchedRecords.find((r) => r.data.fields.i_kendra === selectedKendra);
                    if (record) { window.applyData(record.data); window.scrollTo({ top: 0, behavior: "smooth" }); }
                  } else { window.render(); }
                }}>
                  <option value="">— केन्द्र चुनें —</option>
                  {fetchedRecords.map((rec, idx) => (<option key={idx} value={rec.data.fields.i_kendra}>{rec.data.fields.i_kendra}</option>))}
                  {currentKendra && !fetchedRecords.some(r => r.data.fields.i_kendra === currentKendra) && (
                    <option value={currentKendra}>{currentKendra}</option>
                  )}
                </select>
              </div>
              <div><label className="f">कार्यालय / जनपद</label><input type="text" id="i_office" onInput={() => window.render()} /></div>
              <div><label className="f">जिला योजना वर्ष</label><input type="text" id="i_year" onInput={() => window.render()} /></div>
              <div><label className="f">बिल दिनांक (Bill Date)</label><input type="date" id="i_date" onInput={() => window.render()} /></div>
              <div><label className="f">आपूर्ति दिनांक</label><input type="text" id="i_supply" placeholder="जैसे 23/08/2026 या 23/08/2026, 26/08/2026" onInput={() => window.render()} /></div>
              <div>
                <label className="f">बिल / इनवॉइस संख्या
                  <label style={{ fontWeight: "400", fontSize: "11px", marginLeft: "8px", cursor: "pointer" }}>
                    <input type="checkbox" id="auto_inv_chk" onChange={() => window.toggleAuto("inv")} style={{ verticalAlign: "middle" }} /> स्वतः क्रमांक
                  </label>
                </label>
                <input type="text" id="i_invoice" placeholder="1272" onInput={() => window.render()} />
              </div>
              <div>
                <label className="f">रसीद प्रारम्भिक संख्या
                  <label style={{ fontWeight: "400", fontSize: "11px", marginLeft: "8px", cursor: "pointer" }}>
                    <input type="checkbox" id="auto_rcpt_chk" onChange={() => window.toggleAuto("rcpt")} style={{ verticalAlign: "middle" }} /> स्वतः क्रमांक
                  </label>
                </label>
                <input type="number" id="i_rcptno" placeholder="751" onInput={() => window.render()} />
              </div>
              <div><label className="f">बिल किसके नाम (M/s)</label><input type="text" id="i_billto" onInput={() => window.render()} /></div>
              <div><label className="f">बिल पता</label><input type="text" id="i_billaddr" onInput={() => window.render()} /></div>
              <div>
                <label className="f">नकद रसीद किस प्रकार बनें</label>
                <select id="i_rmode" onChange={() => window.render()}>
                  <option value="one">एक संयुक्त रसीद (कुल बिल का 20%)</option>
                  <option value="each">प्रति कृषक अलग रसीद</option>
                  <option value="both">दोनों — संयुक्त + प्रति कृषक</option>
                </select>
              </div>
              <div style={{ gridColumn: "1/-1" }}>
                <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", fontWeight: "600" }}>
                  <input type="checkbox" id="i_showstamp" defaultChecked onChange={() => window.render()} />
                  टैक्स इनवॉइस में कृषक-हस्ताक्षर वाली नीली मुहर (स्टाम्प) दिखाएँ
                </label>
              </div>
            </div>

            <div className="legend">2क · वाहन संख्या (टैक्स इनवॉइस हेतु, वैकल्पिक)</div>
            <div id="vehicle_list"></div>
            <button className="btn s" type="button" onClick={() => window.addVehicleRow()} style={{ margin: "6px 0 4px" }}>+ वाहन जोड़ें</button>

            <div className="legend">3 · कृषकों की सूची</div>
            <div style={{ overflowX: "auto" }}>
              <table className="entry">
                <thead><tr><th>क्र०</th><th>कृषक का नाम</th><th>ग्राम</th><th>मोबाइल नंबर</th><th>आधार सं०</th><th style={{ width: "100px" }}>बैग</th><th style={{ width: "44px" }}>हटाएं</th></tr></thead>
                <tbody id="entry_body"></tbody>
              </table>
            </div>
            <div className="bar">
              <button className="btn p" onClick={() => window.addRow()}>+ कृषक जोड़ें</button>
              <button className="btn s" onClick={() => { document.getElementById("entry_body").innerHTML = ""; window.render(); }}>सूची खाली करें</button>
              <div className="tot">कुल बैग <b id="t_bags">0</b> · कुल मूल्य ₹ <b id="t_val">0.00</b> · किसान अंश ₹ <b id="t_share">0.00</b> · अनुदान ₹ <b id="t_sub">0.00</b></div>
            </div>
            <div className="warn" id="warn">कृपया कम से कम एक कृषक का नाम एवं बैग संख्या भरें।</div>

            <div className="legend">4 · प्रपत्र प्रिंट करें</div>
            <div className="printrow">
              <button className="btn p" onClick={() => window.printDoc("demand")}>मांग-पत्र</button>
              <button className="btn p" onClick={() => window.printDoc("voucher")}>समेकित पावती-पत्र</button>
              <button className="btn p" onClick={() => window.printDoc("satyapan")}>सत्यापन आख्या</button>
              <button className="btn p" onClick={() => window.printDoc("vendor")}>विक्रेता का प्रमाण-पत्र</button>
              <button className="btn p" onClick={() => window.printDoc("invoice")}>टैक्स इनवॉइस</button>
              <button className="btn p" onClick={() => window.printDoc("receipts")}>नकद रसीदें</button>
              <button className="btn s" onClick={() => window.printDoc("all")}>सभी प्रपत्र</button>
              <button className="btn s" onClick={() => window.resetLetter()}>मांग-पत्र का पाठ रीसेट करें</button>
            </div>

            {/* SUBMIT / UPDATE BUTTONS */}
            <div style={{ marginTop: "25px", display: "flex", gap: "15px", justifyContent: "flex-end", borderTop: "2px dashed #ccc", paddingTop: "20px" }}>
              {currentFormId && (
                <button className="btn s" onClick={handleCancelEdit} style={{ padding: "10px 20px", fontSize: "15px" }}>
                  ❌ Cancel Edit
                </button>
              )}
              <button 
                className="btn p" 
                onClick={handleSubmit} 
                disabled={isSubmitting}
                style={{ padding: "10px 25px", fontSize: "15px", background: currentFormId ? "#E67E22" : "#14553A" }}
              >
                {isSubmitting ? "⏳ Please wait..." : currentFormId ? "🔄 Update Form" : "💾 Submit Form"}
              </button>
            </div>

            {/* 5th Point Restored */}
            <div className="legend">5 · सहेजी गई प्रविष्टियाँ (<span id="rec_count">0</span>)</div>
            <div className="bar">
              <button className="btn p" onClick={() => window.saveRecord(true)}>इस केन्द्र की प्रविष्टि सहेजें</button>
              <button className="btn p" id="btnUpdate" style={{ display: "none" }} onClick={() => window.saveRecord(false)}>खुली प्रविष्टि अद्यतन करें</button>
              <button className="btn s" onClick={() => window.newEntry()}>नया प्रपत्र</button>
              <span className="tot" id="rec_store"></span>
            </div>
            <div className="warn" id="rec_msg" style={{ display: "none", background: "#F1F8F3", borderColor: "#BBD9C6", color: "#14553A" }}></div>
            <div style={{ overflowX: "auto", marginTop: "8px" }}>
              <table className="entry">
                <thead><tr><th>केन्द्र</th><th style={{ width: "86px" }}>दिनांक</th><th style={{ width: "80px" }}>बिल सं०</th><th style={{ width: "70px" }}>प्रकार</th><th style={{ width: "54px" }}>कृषक</th><th style={{ width: "54px" }}>बैग</th><th style={{ width: "100px" }}>कुल मूल्य</th><th style={{ width: "110px" }}>क्रिया</th></tr></thead>
                <tbody id="rec_body"></tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* LIST TAB */}
      {activeTab === "list" && (
        <div className="wrap no-print">
          <div className="panel">
            <h1>Saved Mushroom Compost Records</h1>
            <p className="sub">यहाँ सभी सहेजे गए रिकॉर्ड्स दिखाई देंगे। Edit बटन से फ़ॉर्म खोलकर बदलाव कर सकते हैं।</p>
            
            {isLoading ? (
              <p style={{ textAlign: "center", padding: "20px", fontWeight: "bold", color: "#14553A" }}>⏳ डेटा लाया जा रहा है...</p>
            ) : (
              <div style={{ overflowX: "auto", marginTop: "15px" }}>
                <table className="entry">
                  <thead>
                    <tr>
                      <th style={{ width: "120px" }}>Form ID</th>
                      <th>केन्द्र</th>
                      <th style={{ width: "100px" }}>दिनांक</th>
                      <th style={{ width: "120px" }}>बिल सं०</th>
                      <th style={{ width: "150px" }}>मशरूम प्रकार</th>
                      <th style={{ width: "150px", textAlign: "center" }}>क्रिया (Action)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {formRecords.length === 0 ? (
                      <tr>
                        <td colSpan="6" style={{ textAlign: "center", color: "#55524A", padding: "20px" }}>
                          अभी कोई रिकॉर्ड सहेजा नहीं गया है।
                        </td>
                      </tr>
                    ) : (
                      formRecords.map((rec) => (
                        <tr key={rec.form_id}>
                          <td><b>{rec.form_id}</b></td>
                          <td>{rec.center_name || "—"}</td>
                          <td>{rec.bill_date || "—"}</td>
                          <td>{rec.bill_invoice_number || "—"}</td>
                          <td>{rec.mushroom_type || "—"}</td>
                          <td style={{ whiteSpace: "nowrap", textAlign: "center" }}>
                            <button 
                              className="btn s" 
                              onClick={() => handleEdit(rec.form_id)}
                              style={{ padding: "5px 12px", fontSize: "12px", marginRight: "5px" }}
                            >
                              ✏️ Edit
                            </button>
                            <button 
                              className="btn d" 
                              onClick={() => handleDelete(rec.form_id)}
                              style={{ padding: "5px 10px", fontSize: "14px", border: "1px solid #E3B7B3", borderRadius: "3px", background: "#FDF3F2" }}
                            >
                              🗑️ Delete
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ============ DOCUMENT ZONES (Print Area - Only visible on Form Tab) ============ */}
      {activeTab === "form" && (
        <React.Fragment>
          <div className="sheet" id="doc-demand">
            <h2 className="doc">मांग-पत्र</h2>
            <div 
              id="d_letter" 
              className="editable" 
              contentEditable="true" 
              suppressContentEditableWarning 
              spellCheck="false"
              dangerouslySetInnerHTML={{ __html: `
                <p style="margin:0">सेवा में,<br>
                &nbsp;&nbsp;&nbsp;<span id="d_office">उद्यान विशेषज्ञ कोटद्वार गढ़वाल (पौड़ी गढ़वाल)</span>,<br>
                &nbsp;&nbsp;द्वारा: प्रभारी, उद्यान सचल दल केन्द्र, <span class="dline dl-long" id="d_kendra">&nbsp;</span></p>

                <p style="margin:10px 0 6px"><b>विषय: कृषकों द्वारा <span id="d_sub1">80</span>% अनुदान पर बिजाई युक्त कम्पोस्ट बैग उपलब्ध कराए जाने के सम्बन्ध में।</b></p>

                <p style="margin:0;text-align:justify">महोदय,<br>
                &nbsp;&nbsp;&nbsp;&nbsp;सविनय निवेदन है कि हम क्षेत्र के इच्छुक कृषक स्वरोजगार एवं आजीविका संवर्धन के उद्देश्य से <span id="d_typeline">बटन मशरूम (Button Mushroom)</span> की खेती करना चाहते हैं। इस हेतु हमें जिला योजना वर्ष <span id="d_year">2026-27</span> के अन्तर्गत <span id="d_sub2">80</span>% अनुदान पर बिजाई युक्त कम्पोस्ट बैग की आवश्यकता है।</p>

                <p style="margin:8px 0 0;text-align:justify">हम सभी कृषक आर्थिक रूप से कमजोर एवं सीमित साधनों वाले हैं तथा कम्पोस्ट बैग की कुल देय राशि का भुगतान एक साथ करने में सक्षम नहीं हैं। अतः उक्त योजना के अन्तर्गत <span id="d_sub2b">80</span>% अनुदान पर बिजाई युक्त कम्पोस्ट बैग उपलब्ध कराए जाने हेतु यह अनुरोध प्रस्तुत किया जा रहा है।</p>

                <p style="margin:8px 0 0;text-align:justify">कम्पोस्ट बैग की निर्धारित दर ₹<span id="d_rate2">90</span>.00 प्रति बैग के अनुसार कृषकों द्वारा <span id="d_farmpct">20</span>% अंशदान ₹<span id="d_fs">18</span> प्रति बैग स्वयं वहन किया जाएगा। शेष <span id="d_sub3">80</span>% राजसहायता ₹<span id="d_subamt">72</span> प्रति बैग का लाभ कृषकों को "इन-काइंड सब्सिडी (In-kind Subsidy)" के रूप में कम्पोस्ट बैग की आपूर्ति के माध्यम से प्रदान किए जाने तथा अनुदान की समतुल्य राशि संबंधित आपूर्तिकर्ता को सीधे e-Payment के माध्यम से भुगतान किए जाने का अनुरोध है।</p>

                <p style="margin:8px 0 0;text-align:justify">इस सम्बन्ध में हमारे द्वारा मैसर्स बडोला मशरूम फार्म, काशीपुर, ऊधम सिंह नगर से संपर्क किया गया। साथ ही अन्य फर्मों से भी जानकारी प्राप्त की गई। अन्य फर्मों द्वारा ग्राम स्तर तक कम्पोस्ट बैग पहुँचाने हेतु परिवहन/डिलीवरी शुल्क अलग से लिये जाने की जानकारी दी गई, जबकि मैसर्स बडोला मशरूम फार्म द्वारा विभागीय निर्धारित दर ₹<span id="d_rate">90</span>.00 प्रति बैग पर बिना किसी अतिरिक्त परिवहन/डिलीवरी शुल्क के ग्राम स्तर तक बिजाई युक्त कम्पोस्ट बैग उपलब्ध कराने की सहमति दी गई है। अतः कृषकों की सहमति से उक्त फर्म से कम्पोस्ट बैग क्रय किए जाने का अनुरोध किया जा रहा है।</p>

                <p style="margin:8px 0 0;text-align:justify">उक्त आपूर्तिकर्ता फर्म शेष देय धनराशि का भुगतान विभाग में बजट उपलब्ध होने पर प्राप्त करने हेतु सहमत है।</p>

                <p style="margin:8px 0 0;text-align:justify">अतः महोदय से निवेदन है कि हमारे अनुरोध पत्र के आधार पर मैसर्स बडोला मशरूम फार्म, काशीपुर, ऊधम सिंह नगर से विभागीय निर्धारित दर ₹<span id="d_rate3">90</span>.00 प्रति बैग पर बिजाई युक्त कम्पोस्ट बैग क्रय किए जाने की स्वीकृति प्रदान करने की कृपा कीजिएगा तथा विभागीय स्वीकृति के उपरांत संबंधित आपूर्तिकर्ता द्वारा प्रस्तुत देयक के आधार पर विभागीय स्वीकृत दर के अनुसार देय <span id="d_sub4">80</span>% राजसहायता की धनराशि संबंधित आपूर्तिकर्ता फर्म को भुगतान हेतु अवमुक्त किए जाने की कृपा कीजिएगा।</p>
              `}}
            />
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", margin: "10px 0 6px", gap: "16px" }}>
              <p style={{ margin: "0" }}><b>इच्छुक कृषकों की मांग का विवरण निम्नलिखित है:</b></p>
              <div style={{ border: "1px solid #000", padding: "3px 7px", whiteSpace: "nowrap" }}>
                <b>मशरूम का प्रकार:</b><br />
                <span className="tick" id="d_tick_o">&nbsp;</span>ऑयस्टर<br />
                <span className="tick" id="d_tick_b">&nbsp;</span>बटन
              </div>
            </div>
            <table className="doc roster">
              <thead>
                <tr>
                  <th style={{ width: "32px" }}>क्र.सं.</th>
                  <th style={{ width: "150px" }}>कृषक का नाम</th>
                  <th style={{ width: "95px" }}>ग्राम</th>
                  <th style={{ width: "85px" }}>मोबाइल नंबर</th>
                  <th style={{ width: "100px" }}>आधार सं०</th>
                  <th style={{ width: "55px" }}>मांग (बैग)</th>
                  <th style={{ width: "115px" }}>हस्ताक्षर</th>
                </tr>
              </thead>
              <tbody id="d_rows"></tbody>
              <tfoot>
                <tr>
                  <td colSpan="5" className="r"><b>कुल योग</b></td>
                  <td className="c"><b id="d_total">0</b></td>
                  <td></td>
                </tr>
              </tfoot>
            </table>
            <p className="center" style={{ margin: "10px 0 0" }}><b>समस्त कृषक गण</b></p>
            <div style={{ marginTop: "8px" }}>
              <p className="center" style={{ margin: "0 0 4px" }}><b style={{ textDecoration: "underline" }}>प्रभारी की संस्तुति एवं अग्रसारण</b></p>
              <p style={{ margin: "0", textAlign: "justify" }}>सम्बन्धित कृषकों के अनुरोध के क्रम में, उक्त <span id="d_type3">बटन</span> मशरूम की खेती हेतु बिजाई युक्त कम्पोस्ट बैग की मांग संस्तुति सहित सादर अग्रसारित है। कृपया कृषकों को उक्त बैग क्रय किए जाने की स्वीकृति प्रदान करने की कृपा कीजियेगा।</p>
              <p style={{ textAlign: "right", margin: "18px 0 0" }}><b>हस्ताक्षर प्रभारी: _____________________</b></p>
            </div>
          </div>

          <div id="voucher_zone"></div>
          <div id="vendor_zone"></div>
          <div id="satyapan_zone"></div>
          <div id="invoice_zone"></div>
          <div id="receipt_zone"></div>
        </React.Fragment>
      )}

      {/* ============ MODAL ============ */}
      {modalData.open && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="modal-title">
                {modalData.type === "kendra" ? "केन्द्र विवरण डेटा (संपादन योग्य)" : "कृषक सूची डेटा (संपादन योग्य)"}
                {hasUnsavedChanges && (
                  <span style={{ marginLeft: "10px", fontSize: "12px", color: "#b8860b", fontWeight: "600" }}>
                    ● असहेजे बदलाव ({Object.keys(editedRows).length} पंक्तियाँ)
                  </span>
                )}
              </h3>
              <button className="modal-close" onClick={closeModal} title="बंद करें" style={{ fontSize: "28px", lineHeight: "1", padding: "0 8px" }}>&times;</button>
            </div>
            <div className="modal-body">
              {hasUnsavedChanges && (
                <div style={{ marginBottom: "12px", padding: "10px 14px", background: "#fff3cd", border: "1px solid #ffe082", borderRadius: "4px", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
                  <span style={{ fontSize: "13px", color: "#856404", fontWeight: "600" }}>⚠️ आपने {Object.keys(editedRows).length} पंक्ति(यों) में बदलाव किए हैं। सहेजने के लिए "अद्यतन करें" दबाएँ।</span>
                  <button className="btn p" type="button" onClick={handleUpdateChanges} disabled={isUpdating} style={{ flexShrink: "0" }}>
                    {isUpdating ? "⏳ अद्यतन हो रहा है..." : "💾 अद्यतन करें"}
                  </button>
                </div>
              )}
              {renderModalTable()}
              {hasUnsavedChanges && (
                <div style={{ marginTop: "12px", display: "flex", justifyContent: "flex-end", gap: "10px" }}>
                  <button className="btn s" type="button" onClick={() => { setEditedRows({}); setHasUnsavedChanges(false); }} disabled={isUpdating}>बदलाव रद्द करें</button>
                  <button className="btn p" type="button" onClick={handleUpdateChanges} disabled={isUpdating}>
                    {isUpdating ? "⏳ अद्यतन हो रहा है..." : "💾 अद्यतन करें"}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
