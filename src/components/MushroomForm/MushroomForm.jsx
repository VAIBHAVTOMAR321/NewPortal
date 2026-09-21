import React, { useEffect, useRef, useState } from "react";
import * as XLSX from "xlsx";
import "./MushroomForm.css";

const ORIGINAL_FORM_LOGIC =
  "/* ---------------- Excel-sourced data ---------------- */\nconst TYPE_META = { button:{hi:'बटन', en:'Button'}, oyster:{hi:'ऑयस्टर', en:'Oyster'} };\nlet mtype = '';\nlet seq = 0;\nlet autoFilled = false;   /* तालिका सहेजी सूची से भरी गई है या हाथ से */\n\n/* ---------------- number to words ---------------- */\nconst HI=['','एक','दो','तीन','चार','पाँच','छह','सात','आठ','नौ','दस','ग्यारह','बारह','तेरह','चौदह','पंद्रह','सोलह','सत्रह','अठारह','उन्नीस','बीस','इक्कीस','बाईस','तेईस','चौबीस','पच्चीस','छब्बीस','सत्ताईस','अट्ठाईस','उनतीस','तीस','इकतीस','बत्तीस','तैंतीस','चौंतीस','पैंतीस','छत्तीस','सैंतीस','अड़तीस','उनतालीस','चालीस','इकतालीस','बयालीस','तैंतालीस','चौवालीस','पैंतालीस','छियालीस','सैंतालीस','अड़तालीस','उनचास','पचास','इक्यावन','बावन','तिरेपन','चौवन','पचपन','छप्पन','सत्तावन','अट्ठावन','उनसठ','साठ','इकसठ','बासठ','तिरेसठ','चौंसठ','पैंसठ','छियासठ','सड़सठ','अड़सठ','उनहत्तर','सत्तर','इकहत्तर','बहत्तर','तिहत्तर','चौहत्तर','पचहत्तर','छिहत्तर','सतहत्तर','अठहत्तर','उन्यासी','अस्सी','इक्यासी','बयासी','तिरासी','चौरासी','पचासी','छियासी','सतासी','अट्ठासी','नवासी','नब्बे','इक्यानवे','बानवे','तिरानवे','चौरानवे','पंचानवे','छियानवे','सत्तानवे','अट्ठानवे','निन्यानवे'];\nfunction hi3(n){let s='';if(n>99){s+=HI[Math.floor(n/100)]+' सौ ';n%=100;}if(n)s+=HI[n]+' ';return s;}\nfunction hiWords(num){\n  num=Math.round(num*100)/100;\n  let r=Math.floor(num), p=Math.round((num-r)*100), out='';\n  if(r===0)out='शून्य ';\n  const cr=Math.floor(r/10000000); r%=10000000;\n  const la=Math.floor(r/100000);  r%=100000;\n  const th=Math.floor(r/1000);    r%=1000;\n  if(cr)out+=hi3(cr)+'करोड़ ';\n  if(la)out+=hi3(la)+'लाख ';\n  if(th)out+=hi3(th)+'हज़ार ';\n  if(r)out+=hi3(r);\n  out=out.trim()+' रुपये';\n  if(p)out+=' '+hi3(p).trim()+' पैसे';\n  return out+' मात्र';\n}\nconst E1=['','One','Two','Three','Four','Five','Six','Seven','Eight','Nine','Ten','Eleven','Twelve','Thirteen','Fourteen','Fifteen','Sixteen','Seventeen','Eighteen','Nineteen'];\nconst E10=['','','Twenty','Thirty','Forty','Fifty','Sixty','Seventy','Eighty','Ninety'];\nfunction en2(n){return n<20?E1[n]:E10[Math.floor(n/10)]+(n%10?' '+E1[n%10]:'');}\nfunction en3(n){let s='';if(n>99){s+=E1[Math.floor(n/100)]+' Hundred ';n%=100;}if(n)s+=en2(n);return s.trim();}\nfunction enWords(num){\n  num=Math.round(num*100)/100;\n  let r=Math.floor(num), p=Math.round((num-r)*100), out=[];\n  if(r===0)out.push('Zero');\n  const cr=Math.floor(r/10000000); r%=10000000;\n  const la=Math.floor(r/100000);  r%=100000;\n  const th=Math.floor(r/1000);    r%=1000;\n  if(cr)out.push(en3(cr)+' Crore');\n  if(la)out.push(en3(la)+' Lakh');\n  if(th)out.push(en3(th)+' Thousand');\n  if(r)out.push(en3(r));\n  let s='Rupees '+out.join(' ');\n  if(p)s+=' and '+en2(p)+' Paise';\n  return s+' Only';\n}\nconst money = n => (n||0).toLocaleString('en-IN',{minimumFractionDigits:2,maximumFractionDigits:2});\nconst val = id => document.getElementById(id).value.trim();\nfunction fmtDate(v){ if(!v) return ''; const d=v.split('-'); return d[2]+'/'+d[1]+'/'+d[0]; }\n\n/* ---------------- entry table ---------------- */\n/* ---------------- वाहन संख्या (टैक्स इनवॉइस) ---------------- */\nlet vehSeq=0;\nfunction addVehicleRow(value){\n  vehSeq++;\n  const div=document.createElement('div');\n  div.id='veh'+vehSeq;\n  div.style.cssText='display:flex;align-items:center;gap:8px;margin-bottom:6px';\n  div.innerHTML=`<label style=\"min-width:130px;font-size:12.5px;color:var(--ink-soft)\">वाहन संख्या ${vehSeq} :</label>\n    <input type=\"text\" class=\"v-num\" placeholder=\"जैसे UP07 AB1234\" style=\"text-transform:uppercase;flex:1;max-width:220px\" oninput=\"this.value=this.value.toUpperCase();render()\">\n    <button class=\"btn d\" type=\"button\" title=\"हटाएं\" onclick=\"delVehicleRow('veh${vehSeq}')\">✕</button>`;\n  document.getElementById('vehicle_list').appendChild(div);\n  if(value) div.querySelector('.v-num').value=value;\n  render();\n}\nfunction delVehicleRow(id){\n  const el=document.getElementById(id); if(el) el.remove();\n  render();\n}\nfunction collectVehicles(){\n  return Array.from(document.querySelectorAll('#vehicle_list .v-num'))\n    .map(el=>el.value.trim()).filter(v=>v);\n}\n\nfunction addRow(data){\n  seq++;\n  const tr=document.createElement('tr');\n  tr.id='r'+seq;\n  tr.innerHTML=`\n    <td class=\"rowno\"></td>\n    <td><input type=\"text\" class=\"c-name\" placeholder=\"कृषक का नाम\" oninput=\"render()\"></td>\n    <td><input type=\"text\" class=\"c-vill\" placeholder=\"ग्राम\" oninput=\"render()\"></td>\n    <td><input type=\"text\" class=\"c-mob\" inputmode=\"numeric\" maxlength=\"10\" placeholder=\"10 अंक\" oninput=\"render()\"></td>\n    <td><input type=\"text\" class=\"c-adh\" inputmode=\"numeric\" maxlength=\"14\" placeholder=\"12 अंक\" oninput=\"render()\"></td>\n    <td><input type=\"number\" class=\"c-bags\" min=\"0\" value=\"0\" style=\"text-align:center;font-weight:700\" oninput=\"render()\"></td>\n    <td class=\"rowno\"><button class=\"btn d\" title=\"हटाएं\" onclick=\"delRow('r${seq}')\">✕</button></td>`;\n  document.getElementById('entry_body').appendChild(tr);\n  if(data){\n    tr.querySelector('.c-name').value=data.name||'';\n    tr.querySelector('.c-vill').value=data.vill||'';\n    tr.querySelector('.c-mob').value=data.mob||'';\n    tr.querySelector('.c-adh').value=data.adh||'';\n    tr.querySelector('.c-bags').value=data.bags||0;\n  }\n  render();\n}\nfunction delRow(id){ const el=document.getElementById(id); if(el)el.remove(); render(); }\nfunction collect(){\n  const out=[];\n  document.querySelectorAll('#entry_body tr').forEach((tr,i)=>{\n    tr.cells[0].innerText=i+1;\n    out.push({\n      name:tr.querySelector('.c-name').value.trim(),\n      vill:tr.querySelector('.c-vill').value.trim(),\n      mob:tr.querySelector('.c-mob').value.trim(),\n      adh:tr.querySelector('.c-adh').value.trim(),\n      bags:parseInt(tr.querySelector('.c-bags').value)||0\n    });\n  });\n  return out;\n}\n/* एक ही कृषक (नाम + ग्राम) की दोहरी पंक्तियों को जोड़कर बैग योग कर देना —\n   मांग-पत्र, पावती-पत्र, इनवॉइस, रसीदें — सभी दस्तावेज़ों में एक ही संयुक्त पंक्ति दिखे */\nfunction mergeDuplicateFarmers(list){\n  const map=new Map(), order=[];\n  list.forEach(f=>{\n    const key=(f.name||'').trim().toLowerCase()+'|'+(f.vill||'').trim().toLowerCase();\n    if(!key.trim()){ order.push(f); return; }\n    if(map.has(key)){\n      const ex=map.get(key);\n      ex.bags += f.bags;\n      if(!ex.mob && f.mob) ex.mob=f.mob;\n      if(!ex.adh && f.adh) ex.adh=f.adh;\n    } else {\n      const copy=Object.assign({},f);\n      map.set(key, copy);\n      order.push(copy);\n    }\n  });\n  return order;\n}\n\n\n/* ---------------- Excel is the only source of form data ---------------- */\nlet EXCEL_DB = {};\nlet EXCEL_META = {};\nlet EXCEL_IMPORTED = false;\n\nfunction excelText(v){\n  if(v===null || v===undefined) return '';\n  return String(v).trim();\n}\nfunction excelNumber(v){\n  if(v===null || v===undefined || v==='') return 0;\n  const n=parseFloat(String(v).replace(/,/g,'').replace(/[₹%]/g,'').trim());\n  return Number.isFinite(n) ? n : 0;\n}\nfunction excelDateISO(v){\n  if(v instanceof Date && !isNaN(v.getTime())){\n    const y=v.getFullYear(), m=String(v.getMonth()+1).padStart(2,'0'), d=String(v.getDate()).padStart(2,'0');\n    return `${y}-${m}-${d}`;\n  }\n  const s=excelText(v);\n  if(!s) return '';\n  if(/^\\d{4}-\\d{1,2}-\\d{1,2}$/.test(s)){\n    const [y,m,d]=s.split('-');\n    return `${y}-${String(m).padStart(2,'0')}-${String(d).padStart(2,'0')}`;\n  }\n  const p=s.split(/[\\/.-]/);\n  if(p.length===3){\n    if(p[0].length===4) return `${p[0]}-${String(p[1]).padStart(2,'0')}-${String(p[2]).padStart(2,'0')}`;\n    return `${p[2].length===2?'20'+p[2]:p[2]}-${String(p[1]).padStart(2,'0')}-${String(p[0]).padStart(2,'0')}`;\n  }\n  return '';\n}\nfunction excelDateDisplay(v){\n  const iso=excelDateISO(v);\n  if(!iso) return excelText(v);\n  const [y,m,d]=iso.split('-');\n  return `${d}/${m}/${y}`;\n}\nfunction normalizeKendra(v){\n  return excelText(v).normalize('NFC').replace(/\\s+/g,'');\n}\nfunction findColumn(row, names){\n  const keys=Object.keys(row||{});\n  for(const name of names){\n    const exact=keys.find(k=>excelText(k).normalize('NFC')===name.normalize('NFC'));\n    if(exact) return row[exact];\n  }\n  return '';\n}\nfunction setStatus(msg, ok){\n  const el=document.getElementById('xlsxStatus');\n  if(el){ el.innerText=msg; el.dataset.ok=ok?'1':'0'; }\n}\nfunction populateKendraSelect(){\n  const sel=document.getElementById('i_kendra');\n  if(!sel) return;\n  const current=sel.value;\n  sel.innerHTML='<option value=\"\">— Excel से केन्द्र चुनें —</option>';\n  Object.keys(EXCEL_META).forEach(k=>{\n    const op=document.createElement('option');\n    op.value=k; op.textContent=(EXCEL_META[k].fields.i_kendra||k);\n    sel.appendChild(op);\n  });\n  if(current && EXCEL_META[normalizeKendra(current)]) sel.value=normalizeKendra(current);\n}\nfunction buildExcelRecord(k, centreRow, farmers){\n  const typeRaw=excelText(findColumn(centreRow,[\n    'मशरूम प्रकार (Oyster/Button)','मशरूम प्रकार','मशरूम का प्रकार','Mushroom Type','Type'\n  ])).toLowerCase();\n  const mtype=typeRaw.includes('oyster') || typeRaw.includes('ऑयस्टर') ? 'oyster' :\n              typeRaw.includes('button') || typeRaw.includes('बटन') ? 'button' : '';\n  const supplyRaw=findColumn(centreRow,['आपूर्ति दिनांक (एक से ज़्यादा हों तो कॉमा से)','आपूर्ति दिनांक','Supply Date','Supply Dates']);\n  const supply=excelText(supplyRaw).split(',').map(x=>excelDateDisplay(x)).filter(Boolean).join(', ');\n  const vehicleRaw=findColumn(centreRow,['गाड़ी नंबर (एक से ज़्यादा हों तो कॉमा से)','गाड़ी नंबर','वाहन नंबर','Vehicle Number','Vehicle']);\n  const vehicles=excelText(vehicleRaw).split(',').map(x=>x.trim()).filter(Boolean);\n  const billDate=findColumn(centreRow,['बिल दिनांक','Bill Date']);\n  const rate=findColumn(centreRow,['दर (₹/बैग)','दर (रु./बैग)','दर','Rate','Rate (₹/Bag)']);\n  const kg=findColumn(centreRow,['बैग वजन (किग्रा)','बैग वजन','Bag Weight (Kg)','Kg per Bag']);\n  const sub=findColumn(centreRow,['अनुदान प्रतिशत (%)','अनुदान प्रतिशत','Subsidy %','Subsidy']);\n  const gst=findColumn(centreRow,['जी०एस०टी० दर (%)','जीएसटी दर (%)','GST %','GST']);\n  const year=findColumn(centreRow,['जिला योजना वर्ष','योजना वर्ष','Financial Year','Year']);\n  const office=findColumn(centreRow,['कार्यालय / जनपद','कार्यालय','Office','District Office']);\n  const invoice=findColumn(centreRow,['बिल संख्या','बिल सं०','Bill No','Invoice No','Invoice Number']);\n  const receipt=findColumn(centreRow,['रसीद संख्या','रसीद सं०','Receipt No','Receipt Number']);\n  const billTo=findColumn(centreRow,['बिल प्राप्तकर्ता','Bill To']);\n  const billAddr=findColumn(centreRow,['बिल पता','Bill Address']);\n\n  const data={\n    mtype,\n    fields:{\n      i_kendra:k,\n      i_invoice:excelText(invoice),\n      i_rcptno:excelText(receipt),\n      i_date:excelDateISO(billDate),\n      i_supply:supply,\n      i_rate:rate!=='' ? String(excelNumber(rate)) : '',\n      i_kg:kg!=='' ? String(excelNumber(kg)) : '',\n      i_sub:sub!=='' ? String(excelNumber(sub)) : '',\n      i_gst:gst!=='' ? String(excelNumber(gst)) : '',\n      i_office:excelText(office),\n      i_year:excelText(year),\n      i_billto:excelText(billTo),\n      i_billaddr:excelText(billAddr),\n      i_rmode:'one'\n    },\n    farmers:mergeDuplicateFarmers(farmers),\n    vehicles,\n    letter:''\n  };\n  return data;\n}\nconst EXCEL_BACKEND_BASE=(window.MUSHROOM_EXCEL_API||'https://mahadevaaya.com/dhokotdwarproject2/dhokotdwarproject2_backend/').replace(/\\/+$/,'')+'/';\nconst EXCEL_API=EXCEL_BACKEND_BASE+'mushroom-excel/';\nlet EXCEL_FILE_ID=null,EXCEL_FILE_URL='',EXCEL_FILE_NAME='';\nfunction csrfToken(){const m=document.cookie.match(/(?:^|; )csrftoken=([^;]+)/);return m?decodeURIComponent(m[1]):'';}\nfunction apiUrl(path){if(!path)return '';try{const s=String(path);if(s.indexOf('http://')===0 || s.indexOf('https://')===0)return s;return new URL(s.replace(/^\\/+/,''),EXCEL_BACKEND_BASE).href;}catch(e){return path;}}\nfunction extractExcelRecord(payload){if(!payload)return null;if(Array.isArray(payload))return payload[0]||null;if(Array.isArray(payload.results))return payload.results[0]||null;if(payload.data&&Array.isArray(payload.data))return payload.data[0]||null;if(payload.data&&typeof payload.data==='object')return payload.data;return payload;}\nfunction extractFileUrl(record){if(!record)return '';const value=record.file_url||record.excel_file||record.file||record.url||record.path||'';if(typeof value==='object')return value.url||value.file||'';return value;}\nfunction updateExcelUI(record){EXCEL_FILE_ID=record?.id??record?.pk??null;EXCEL_FILE_URL=apiUrl(extractFileUrl(record));EXCEL_FILE_NAME=record?.file_name||record?.filename||record?.name||(EXCEL_FILE_URL?EXCEL_FILE_URL.split('/').pop():'mushroom.xlsx');const info=document.getElementById('xlsxCurrentFile');if(info)info.innerText=EXCEL_FILE_NAME?'सर्वर पर: '+EXCEL_FILE_NAME:'Excel फ़ाइल उपलब्ध है';const del=document.getElementById('xlsxDeleteBtn');if(del)del.style.display=EXCEL_FILE_ID?'inline-block':'none';const up=document.getElementById('xlsxUploadBtn');if(up)up.innerText=EXCEL_FILE_ID?'🔄 Excel बदलें':'📤 Excel अपलोड करें';}\nfunction clearExcelState(resetForm=false){\n  EXCEL_META={};EXCEL_DB={};EXCEL_IMPORTED=false;\n  EXCEL_FILE_ID=null;EXCEL_FILE_URL='';EXCEL_FILE_NAME='';\n  const sel=document.getElementById('i_kendra');\n  if(sel)sel.innerHTML='<option value=\"\">— Excel से केन्द्र चुनें —</option>';\n  const info=document.getElementById('xlsxCurrentFile');\n  if(info)info.innerText='कोई Excel फ़ाइल नहीं';\n  const del=document.getElementById('xlsxDeleteBtn');\n  if(del)del.style.display='none';\n  const up=document.getElementById('xlsxUploadBtn');\n  if(up)up.innerText='📤 Excel अपलोड करें';\n  if(resetForm && typeof newEntryWithoutConfirmation==='function') newEntryWithoutConfirmation();\n}\nfunction newEntryWithoutConfirmation(){curRec=null;letterEdited=false;mtype='';const letter=document.getElementById('d_letter');if(letter)letter.innerHTML=LETTER_HTML;const body=document.getElementById('entry_body');if(body)body.innerHTML='';['i_rate','i_kg','i_sub','i_gst','i_kendra','i_office','i_year','i_date','i_supply','i_invoice','i_rcptno','i_billto','i_billaddr','i_rmode'].forEach(id=>{const e=document.getElementById(id);if(e)e.value='';});const vl=document.getElementById('vehicle_list');if(vl)vl.innerHTML='';document.querySelectorAll('.type').forEach(el=>el.dataset.on='0');document.querySelectorAll('input[name=\"mtype\"]').forEach(el=>el.checked=false);render();}\nasync function parseExcelBuffer(buffer){if(typeof XLSX==='undefined')throw new Error('Excel library उपलब्ध नहीं है। npm install xlsx चलाएँ।');const wb=XLSX.read(buffer,{type:'array',cellDates:true});const centreSheet=wb.Sheets['केन्द्र विवरण'],farmerSheet=wb.Sheets['कृषक सूची'];if(!centreSheet||!farmerSheet)throw new Error('Excel में \"केन्द्र विवरण\" और \"कृषक सूची\" दोनों शीट आवश्यक हैं।');const centreRows=XLSX.utils.sheet_to_json(centreSheet,{defval:''}),farmerRows=XLSX.utils.sheet_to_json(farmerSheet,{defval:''});if(!centreRows.length)throw new Error('\"केन्द्र विवरण\" शीट में कोई डेटा नहीं है।');const farmerMap={};farmerRows.forEach(r=>{const key=normalizeKendra(excelText(findColumn(r,['केन्द्र का नाम','Kendra','Kendra Name','Centre Name'])));if(!key)return;(farmerMap[key] ||= []).push({name:excelText(findColumn(r,['कृषक का नाम','किसान का नाम','Farmer Name'])),vill:excelText(findColumn(r,['ग्राम','गाँव','Village'])),mob:excelText(findColumn(r,['मोबाइल नंबर','मोबाइल','Mobile Number','Mobile'])),adh:excelText(findColumn(r,['आधार संख्या','आधार नंबर','Aadhaar Number','Aadhaar'])),bags:Math.max(0,Math.round(excelNumber(findColumn(r,['बैग','बैग संख्या','Bag','Bags','No. of Bags']))))});});const meta={},db={};centreRows.forEach(row=>{const rawK=excelText(findColumn(row,['केन्द्र का नाम','Kendra','Kendra Name','Centre Name'])),key=normalizeKendra(rawK);if(!key)return;const data=buildExcelRecord(rawK,row,farmerMap[key]||[]);meta[key]=data;db[key]=farmerMap[key]||[];});if(!Object.keys(meta).length)throw new Error('\"केन्द्र विवरण\" में केन्द्र का नाम नहीं मिला।');EXCEL_META=meta;EXCEL_DB=db;EXCEL_IMPORTED=true;populateKendraSelect();}\nfunction apiHeaders(extra={}){\n  const h=Object.assign({Accept:'application/json'},extra||{});\n  const method=String(h.__method||'GET').toUpperCase();\n  delete h.__method;\n  if(!['GET','HEAD','OPTIONS'].includes(method)){\n    const csrf=csrfToken();\n    if(csrf) h['X-CSRFToken']=csrf;\n  }\n  return h;\n}\n\nlet refreshInProgress=null;\n\nasync function refreshAuthentication(){\n  if(refreshInProgress) return refreshInProgress;\n  refreshInProgress=(async()=>{\n    try{\n      const response=await fetch(EXCEL_BACKEND_BASE+'api/refresh-token/',{\n        method:'POST',\n        credentials:'include',\n        headers:apiHeaders({'Content-Type':'application/json',__method:'POST'})\n      });\n      return response.ok;\n    }catch(err){\n      console.warn('Authentication refresh failed:',err);\n      return false;\n    }finally{\n      refreshInProgress=null;\n    }\n  })();\n  return refreshInProgress;\n}\n\nasync function authorizedFetch(url,options={}){\n  const opts=Object.assign({},options);\n  opts.credentials='include';\n  const method=String(opts.method||'GET').toUpperCase();\n  opts.method=method;\n  opts.headers=apiHeaders(Object.assign({},opts.headers||{},{__method:method}));\n\n  let response=await fetch(url,opts);\n  if(response.status===401 && !opts.__authRetry){\n    const refreshed=await refreshAuthentication();\n    if(refreshed){\n      const retryOpts=Object.assign({},opts,{__authRetry:true});\n      retryOpts.headers=apiHeaders(Object.assign({},opts.headers||{},{__method:method}));\n      response=await fetch(url,retryOpts);\n    }\n  }\n  return response;\n}\nasync function fetchExcelFromUrl(url){\n  const response=await authorizedFetch(url,{method:'GET',headers:{\n    Accept:'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel, application/octet-stream'\n  }});\n  if(!response.ok){\n    if(response.status===401) throw new Error('Excel access token expired or invalid. Please login again.');\n    throw new Error(`Excel डाउनलोड नहीं हो सका (${response.status} ${response.statusText})`);\n  }\n  return response.arrayBuffer();\n}\nasync function loadCurrentExcel(){\n  try{\n    setStatus('Excel सर्वर से उपलब्ध होने पर अपने-आप लोड होगी…',false);\n    const response=await authorizedFetch(EXCEL_API,{method:'GET',headers:{Accept:'application/json'}});\n    if(!response.ok){\n      if(response.status===401) setStatus('Access token expired/invalid — कृपया फिर से login करें',false);\n      else if(response.status===404) setStatus('कोई सर्वर Excel उपलब्ध नहीं है — Excel अपलोड करें',false);\n      else setStatus(`Excel उपलब्ध नहीं (${response.status}) — Excel अपलोड करें`,false);\n      return;\n    }\n    const payload=await response.json();\n    const record=extractExcelRecord(payload);\n    if(!record||!extractFileUrl(record)){\n      setStatus('कोई Excel फ़ाइल उपलब्ध नहीं है — Excel अपलोड करें',false);\n      return;\n    }\n    updateExcelUI(record);\n    const buffer=await fetchExcelFromUrl(EXCEL_FILE_URL);\n    await parseExcelBuffer(buffer);\n    setStatus(Object.keys(EXCEL_META).length+' केन्द्र Excel से लोड हुए',true);\n  }catch(err){\n    console.warn('Mushroom Excel background load skipped:',err);\n    setStatus(err?.message||'Excel लोड नहीं हुई — आप नई Excel अपलोड कर सकते हैं',false);\n  }\n}\nasync function uploadExcel(){\n  const input=document.getElementById('xlsxFile'),file=input?.files?.[0];\n  if(!file){alert('पहले Excel फ़ाइल चुनें।');return;}\n  if(!/\\.(xlsx|xls)$/i.test(file.name)){\n    alert('केवल .xlsx या .xls Excel फ़ाइल स्वीकार की जाएगी।');\n    input.value='';\n    return;\n  }\n  const form=new FormData();\n  form.append('excel_file',file,file.name);\n  try{\n    setStatus(EXCEL_FILE_ID?'पुरानी Excel को नई फ़ाइल से बदला जा रहा है…':'Excel backend पर अपलोड की जा रही है…',false);\n    const method=EXCEL_FILE_ID?'PUT':'POST';\n    const url=EXCEL_FILE_ID?`${EXCEL_API}${EXCEL_FILE_ID}/`:EXCEL_API;\n    const response=await authorizedFetch(url,{method,body:form});\n    if(!response.ok){\n      const txt=await response.text();\n      if(response.status===401) throw new Error('Access token expired or invalid. Please login again.');\n      throw new Error(`Upload failed (${response.status} ${response.statusText}) ${txt.slice(0,300)}`);\n    }\n    const payload=await response.json();\n    let record=extractExcelRecord(payload);\n    if(!record||!extractFileUrl(record)){\n      const r=await authorizedFetch(EXCEL_API,{method:'GET',headers:{Accept:'application/json'}});\n      if(!r.ok) throw new Error('Upload सफल हुआ लेकिन updated Excel record प्राप्त नहीं हुआ।');\n      record=extractExcelRecord(await r.json());\n    }\n    updateExcelUI(record);\n    if(!EXCEL_FILE_URL) throw new Error('API response में Excel file URL नहीं मिला।');\n    const buffer=await fetchExcelFromUrl(EXCEL_FILE_URL);\n    await parseExcelBuffer(buffer);\n    MEM_REC=Object.keys(EXCEL_META).map((key,idx)=>({id:'excel_'+key+'_'+idx,savedAt:new Date().toISOString(),data:EXCEL_META[key]}));\n    const first=Object.keys(EXCEL_META)[0];\n    if(first){\n      const sel=document.getElementById('i_kendra');\n      if(sel)sel.value=first;\n      applyData(EXCEL_META[first]);\n      curRec=null;\n    }\n    renderRecords();\n    render();\n    setStatus(Object.keys(EXCEL_META).length+' केन्द्र नई Excel से लोड हुए',true);\n    input.value='';\n  }catch(err){\n    console.error('Mushroom Excel upload error:',err);\n    setStatus('Excel अपलोड नहीं हुई',false);\n    alert(err.message||'Excel अपलोड नहीं हो सकी।');\n  }\n}\nasync function deleteExcel(){\n  if(!EXCEL_FILE_ID){alert('हटाने के लिए कोई Excel फ़ाइल उपलब्ध नहीं है।');return;}\n  if(!confirm(`क्या सर्वर से \"${EXCEL_FILE_NAME}\" Excel फ़ाइल स्थायी रूप से हटानी है?`))return;\n  try{\n    setStatus('Excel हटाई जा रही है…',false);\n    const response=await authorizedFetch(`${EXCEL_API}${EXCEL_FILE_ID}/`,{method:'DELETE'});\n    if(!response.ok){\n      const txt=await response.text();\n      if(response.status===401) throw new Error('Access token expired or invalid. Please login again.');\n      throw new Error(`Delete failed (${response.status} ${response.statusText}) ${txt.slice(0,300)}`);\n    }\n    clearExcelState(true);\n    setStatus('Excel फ़ाइल हटा दी गई',true);\n  }catch(err){\n    console.error('Mushroom Excel delete error:',err);\n    setStatus('Excel हटाई नहीं जा सकी',false);\n    alert(err.message||'Excel हटाई नहीं जा सकी।');\n  }\n}\nasync function importExcel(){return uploadExcel();}\nwindow.importExcel=importExcel;window.uploadExcel=uploadExcel;window.deleteExcel=deleteExcel;window.loadCurrentExcel=loadCurrentExcel;\n\nfunction onKendra(){\n  const raw=val('i_kendra');\n  const key=normalizeKendra(raw);\n  const data=EXCEL_META[key];\n  const btn=document.getElementById('loadKendra');\n  if(!data){\n    if(btn) btn.style.display='none';\n    if(!EXCEL_IMPORTED){ render(); return; }\n    blankRows();\n    return;\n  }\n  if(btn){\n    btn.style.display='inline-block';\n    btn.innerText='इस Excel केन्द्र का '+(data.farmers||[]).length+' कृषक भरें';\n  }\n  const filled=collect().filter(f=>f.name!=='' || f.bags>0).length;\n  if(filled===0 || autoFilled){\n    applyData(data);\n  }else{\n    if(confirm('वर्तमान सूची हटाकर Excel से '+raw+' का डेटा भरा जाए?')) applyData(data);\n    else render();\n  }\n}\nfunction blankRows(){\n  document.getElementById('entry_body').innerHTML='';\n  for(let i=0;i<5;i++) addRow();\n  autoFilled=false;\n  render();\n}\nfunction loadKendra(ask){\n  const key=normalizeKendra(val('i_kendra'));\n  const data=EXCEL_META[key];\n  if(!data){ alert('इस केन्द्र का डेटा अभी Excel से आयात नहीं हुआ है।'); return; }\n  const filled=collect().filter(f=>f.name!=='' || f.bags>0).length;\n  if(ask && filled>0 && !confirm('वर्तमान सूची हटाकर Excel से '+val('i_kendra')+' के '+(data.farmers||[]).length+' कृषक भरे जाएँ?')) return;\n  applyData(data);\n}\nfunction clearRows(){\n  if(!confirm('पूरी सूची खाली कर दी जाए?')) return;\n  blankRows();\n}\n\nfunction pickType(t){\n  mtype=t;\n  document.querySelectorAll('.type').forEach(el=>el.dataset.on = el.dataset.type===t?'1':'0');\n  const radio=document.getElementById('t_'+t);\n  if(radio) radio.checked=true;\n  /* Rate and bag weight are Excel-sourced. Selecting a type must not\n     overwrite values with hardcoded defaults. */\n  render();\n}\n\n/* ---------------- render all documents ---------------- */\nlet letterEdited=false, LETTER_HTML='';\nfunction setTxt(id,txt){ const el=document.getElementById(id); if(el) el.innerText=txt; }\nfunction setHtm(id,htm){ const el=document.getElementById(id); if(el) el.innerHTML=htm; }\nfunction resetLetter(){\n  if(!confirm('मांग-पत्र का पाठ मूल रूप में वापस लाया जाए? आपके किए गए बदलाव हट जाएँगे।')) return;\n  document.getElementById('d_letter').innerHTML=LETTER_HTML;\n  letterEdited=false; render();\n}\n\nfunction render(){\n  const rows   = mergeDuplicateFarmers(collect().filter(f=>f.name!=='' || f.bags>0));\n  const rate   = parseFloat(val('i_rate'))||0;\n  const kg     = parseFloat(val('i_kg'))||0;\n  const subPct = parseFloat(val('i_sub'))||0;\n  const farmPct= 100-subPct;\n  const gst    = parseFloat(val('i_gst'))||0;\n  const T      = TYPE_META[mtype] || {hi:'', en:''};\n\n  const perSub = rate*subPct/100, perFarm = rate*farmPct/100;\n  const totBags = rows.reduce((s,f)=>s+f.bags,0);\n  const totVal = totBags*rate, totFarm = totBags*perFarm, totSub = totBags*perSub;\n\n  document.getElementById('t_bags').innerText=totBags;\n  document.getElementById('t_val').innerText=money(totVal);\n  document.getElementById('t_share').innerText=money(totFarm);\n  document.getElementById('t_sub').innerText=money(totSub);\n  document.getElementById('warn').style.display = totBags>0 ? 'none':'block';\n\n  const dateTxt = fmtDate(val('i_date'));\n  const supplyTxt = val('i_supply');\n  const kendra  = val('i_kendra');\n  const inv     = val('i_invoice');\n\n  /* ---- 1. मांग-पत्र ---- */\n  if(!letterEdited){\n    setTxt('d_office', val('i_office'));\n    setHtm('d_kendra', kendra||'&nbsp;');\n    setTxt('d_year', val('i_year'));\n    ['d_sub1','d_sub2','d_sub2b','d_sub3','d_sub4'].forEach(id=>setTxt(id, subPct));\n    setTxt('d_farmpct', 100-subPct);\n    const rateTxt = rate?money(rate).replace(/\\.00$/,''):'';\n    ['d_rate','d_rate2','d_rate3'].forEach(id=>setTxt(id, rateTxt));\n    const farmShare = rate*(100-subPct)/100;\n    setTxt('d_fs', farmShare?(Number.isInteger(farmShare)?farmShare:farmShare.toFixed(2)):'');\n    const subAmt = rate*subPct/100;\n    setTxt('d_subamt', subAmt?(Number.isInteger(subAmt)?subAmt:subAmt.toFixed(2)):'');\n    setHtm('d_date2', dateTxt||'&nbsp;');\n    setTxt('d_typeline', T.hi+' मशरूम ('+T.en+' Mushroom)');\n    setTxt('d_type2', T.hi);\n  }\n  document.getElementById('d_type3').innerText = T.hi;\n  document.getElementById('d_tick_o').innerHTML = mtype==='oyster'?'✓':'&nbsp;';\n  document.getElementById('d_tick_b').innerHTML = mtype==='button'?'✓':'&nbsp;';\n\n  const dBody=document.getElementById('d_rows'); dBody.innerHTML='';\n  const lines=rows.length;\n  for(let i=0;i<lines;i++){\n    const f=rows[i];\n    dBody.insertAdjacentHTML('beforeend',\n      `<tr style=\"height:22px\">\n        <td class=\"c\">${i+1}</td>\n        <td>${f?f.name:''}</td><td>${f?f.vill:''}</td>\n        <td class=\"c\">${f?f.mob:''}</td><td class=\"c\">${f?f.adh:''}</td>\n        <td class=\"c\"><b>${f&&f.bags?f.bags:''}</b></td><td></td>\n      </tr>`);\n  }\n  document.getElementById('d_total').innerText=totBags;\n\n  /* ग्राम-वार समूहन को प्राथमिकता देते हुए ₹50,000 सीमा में बिल-समूह बाँटना */\n  function computeBillGroups(farmers, unitRate, cap){\n    cap = cap||50000;\n    const villageOrder=[], villageMap={};\n    farmers.forEach(f=>{\n      const v=f.vill||'';\n      if(!villageMap[v]){ villageMap[v]=[]; villageOrder.push(v); }\n      villageMap[v].push(f);\n    });\n    const bins=[]; let cur=null;\n    function newBin(){ cur={farmers:[],bags:0,value:0}; bins.push(cur); }\n    newBin();\n    villageOrder.forEach(v=>{\n      const group=villageMap[v];\n      const groupBags=group.reduce((s,f)=>s+f.bags,0);\n      const groupVal=groupBags*unitRate;\n      if(groupVal<=cap){\n        if(cur.farmers.length>0 && cur.value+groupVal>cap) newBin();\n        group.forEach(f=>{ cur.farmers.push(f); cur.bags+=f.bags; cur.value+=f.bags*unitRate; });\n      } else {\n        group.forEach(f=>{\n          const fVal=f.bags*unitRate;\n          if(cur.farmers.length>0 && cur.value+fVal>cap) newBin();\n          cur.farmers.push(f); cur.bags+=f.bags; cur.value+=fVal;\n        });\n      }\n    });\n    if(cur.farmers.length===0) bins.pop();\n    return bins;\n  }\n\n  /* केन्द्र के सभी कृषक हमेशा एक ही संयुक्त बिल में — कोई राशि-सीमा में विभाजन नहीं */\n  const farmersForBill = rows.filter(f=>f.bags>0);\n  const bins = [{farmers:farmersForBill, bags:totBags, value:totVal}];\n  function billNoFor(idx){ return inv; }\n\n\n  /* ---- 2. समेकित पावती-पत्र (पत्र-शैली, बिल-वार) ---- */\n  function buildVoucherHTML(bin, billNo){\n    const bags=bin.bags, val_=bin.value;\n    const farmShare=bags*perFarm, subAmt=bags*perSub;\n    const rowsHTML = bin.farmers.map((f,i)=>`<tr style=\"height:21px\">\n        <td class=\"c\">${i+1}</td><td>${f.name}</td><td>${f.vill}</td>\n        <td class=\"c\"><b>${f.bags}</b></td>\n        <td class=\"r\">₹ ${money(f.bags*perFarm)}</td>\n        <td class=\"r\">₹ ${money(f.bags*perSub)}</td><td></td>\n      </tr>`).join('');\n    return `<div class=\"sheet vch-sheet\">\n  <h2 class=\"doc\" style=\"margin:0 0 14px\">समेकित पावती-पत्र (वितरण-सह-प्राप्ति)</h2>\n  <p style=\"margin:0\">सेवा में,<br>\n  &nbsp;&nbsp;&nbsp;उद्यान विशेषज्ञ कोटद्वार गढ़वाल (पौड़ी गढ़वाल),<br>\n  &nbsp;&nbsp;द्वारा: प्रभारी, उद्यान सचल दल केन्द्र, <span class=\"dline dl-long\">${kendra||'&nbsp;'}</span></p>\n  <p style=\"margin:10px 0 6px\"><b>विषय: मैसर्स बडोला मशरूम फार्म, काशीपुर के बिल संख्या ${billNo||'—'} दिनांक ${dateTxt||'—'} पर देय राजसहायता के भुगतान हेतु प्रस्तुतीकरण।</b></p>\n  <p style=\"margin:0;text-align:justify\">महोदय,<br>\n  &nbsp;&nbsp;&nbsp;&nbsp;निवेदन है कि उद्यान सचल दल केन्द्र, ${kendra||'—'} के अन्तर्गत निम्नानुसार कृषकों द्वारा मैसर्स बडोला मशरूम फार्म, काशीपुर, ऊधम सिंह नगर से जिला योजना वर्ष ${val('i_year')} के अन्तर्गत ${subPct}% अनुदान पर विभागीय स्वीकृत दर ₹${money(rate)} प्रति बैग के अनुसार कुल <b>${bags}</b> बैग ${T.hi} मशरूम बिजाई युक्त कम्पोस्ट क्रय किए गए हैं। उक्त कम्पोस्ट बैग संबंधित कृषकों को सही एवं पूर्ण एवं उच्च गुणवत्ता अवस्था में प्राप्त हो चुके हैं। कृषकों द्वारा निर्धारित ${farmPct}% कृषक अंश ₹${money(perFarm)} प्रति बैग के अनुसार कुल ₹${money(farmShare)} की धनराशि उक्त फर्म को अदा कर दी गई है।</p>\n  <p style=\"margin:8px 0 0;text-align:justify\">फर्म द्वारा प्रस्तुत बिल संख्या ${billNo||'—'}, जिसकी कुल देयक राशि ₹${money(val_)} है, भुगतान हेतु प्रस्तुत किया जा रहा है। उक्त बिल के सापेक्ष कृषकों द्वारा ₹${money(farmShare)} का कृषक अंश फर्म को जमा किए जाने के उपरान्त शेष ${subPct}% राजसहायता (अनुदान) की धनराशि ₹${money(subAmt)} (${subAmt>0?hiWords(subAmt):'—'}) देय है।</p>\n  <p style=\"margin:8px 0 0;text-align:justify\">अतः अनुरोध है कि हमारे आवेदन एवं प्राप्त स्वीकृति के क्रम में उक्त देयक संख्या ${billNo||'—'} दिनांक ${dateTxt||'—'} की देय राजसहायता की धनराशि ₹${money(subAmt)} सीधे आपूर्तिकर्ता फर्म मैसर्स बडोला मशरूम फार्म, काशीपुर, ऊधम सिंह नगर को e-Payment के माध्यम से भुगतान करने की कृपा करें।</p>\n  <p style=\"margin:8px 0 0;text-align:justify\">उक्त आपूर्तिकर्ता फर्म शेष देय धनराशि का भुगतान विभाग में बजट उपलब्ध होने पर किए जाने हेतु सहमत है।</p>\n  <p style=\"margin:12px 0 6px\"><b>लाभार्थी कृषकों का विवरण एवं हस्ताक्षर निम्नानुसार हैं —</b></p>\n  <table class=\"doc roster\">\n    <thead><tr>\n      <th style=\"width:30px\">क्र०सं०</th><th style=\"width:190px\">किसान का पूरा नाम</th><th style=\"width:95px\">ग्राम / पंचायत</th>\n      <th style=\"width:44px\">बैग</th>\n      <th style=\"width:88px\">${farmPct}% किसान अंश</th>\n      <th style=\"width:92px\">${subPct}% राजसहायता</th>\n      <th style=\"width:130px\">हस्ताक्षर</th>\n    </tr></thead>\n    <tbody>${rowsHTML}</tbody>\n    <tfoot><tr>\n      <td colspan=\"3\" class=\"r\"><b>कुल</b></td>\n      <td class=\"c\"><b>${bags}</b></td>\n      <td class=\"r\"><b>₹ ${money(farmShare)}</b></td>\n      <td class=\"r\"><b>₹ ${money(subAmt)}</b></td><td></td>\n    </tr></tfoot>\n  </table>\n</div>`;\n  }\n\n  /* ---- 2ख. विक्रेता का प्रमाण-पत्र (बिल-वार) ---- */\n  function buildVendorHTML(bin, billNo){\n    const bags=bin.bags, val_=bin.value, farmShare=bags*perFarm, subAmt=bags*perSub;\n    return `<div class=\"sheet vendor-sheet\" style=\"font-family:'Courier Prime','Martel',monospace\">\n  <div style=\"display:flex;justify-content:space-between;align-items:flex-start;border-bottom:2px solid #000;padding-bottom:10px;margin-bottom:16px\">\n    <div>\n      <div style=\"font-weight:800;font-size:21px;letter-spacing:.3px\">BADOLA MUSHROOMS FARM</div>\n      <div style=\"font-weight:700;font-size:12.5px\">(COMPOST UNIT)</div>\n      <div style=\"font-size:11px;margin-top:3px\">H.O.-Dhanori Patti, D.P.S. Road, Kashipur (U.S. Nagar) U.K.</div>\n      <div style=\"font-size:11px\">Compost Unit-Vill. Pratappur, Near Pickle Factory, Kashipur (U.S. Nagar)</div>\n      <div style=\"font-size:11px;margin-top:3px\">GSTIN No.: 05CHXPS3134D1Z5 &nbsp;|&nbsp; Mob.: 9899935600, 6398264916</div>\n    </div>\n    <div style=\"text-align:right;font-size:11px;white-space:nowrap;padding-top:2px\">\n      <div style=\"text-decoration:underline;font-weight:700;margin-bottom:4px\">CERTIFICATE</div>\n      Ref. Bill No. : ${billNo||'—'}<br>\n      Date : ${dateTxt||'—'}\n    </div>\n  </div>\n  <div style=\"text-align:center;font-weight:700;font-size:14px;text-decoration:underline;margin-bottom:14px\">विक्रेता का प्रमाण-पत्र (Supplier's Certificate)</div>\n  <p style=\"margin:0;text-align:justify;font-size:12.5px;line-height:1.7\">मैं, मैसर्स बडोला मशरूम फार्म, काशीपुर, ऊधम सिंह नगर, प्रमाणित करता हूँ कि उद्यान सचल दल केन्द्र, <b>${kendra||'—'}</b> के अंतर्गत बिल संख्या <b>${billNo||'—'}</b> दिनांक <b>${dateTxt||'—'}</b> के अनुसार उपरोक्त कृषकों को कुल <b>${bags}</b> बैग ${T.hi} मशरूम बिजाई युक्त कम्पोस्ट सही एवं पूर्ण अवस्था में वितरित कर दिए हैं, जो कृषकों को दिनांक <b>${supplyTxt||'—'}</b> (Date of Supply) को प्राप्त हो चुके हैं, जिनका कुल मूल्य रुपये <b>${money(val_)}</b> है, तथा कृषकों से निर्धारित कृषक अंश (${farmPct}%) की धनराशि रुपये <b>${money(farmShare)}</b> प्राप्त कर ली गई है।</p>\n  <p style=\"margin:12px 0 0;text-align:justify;font-size:12.5px;line-height:1.7\"><b>अतः शेष ${subPct}% राजसहायता (अनुदान) की धनराशि रुपये ${money(subAmt)} (${subAmt>0?hiWords(subAmt):'—'}) का भुगतान मुझे करने की कृपा कीजिएगा।</b></p>\n  <div style=\"margin-top:60px;text-align:right;font-size:12px\">\n    <div>For BADOLA MUSHROOMS FARM</div>\n    <div style=\"margin-top:34px;border-top:1px solid #000;padding-top:3px;display:inline-block;min-width:220px\">Authorised Signatory / विक्रेता के हस्ताक्षर व मुहर</div>\n  </div>\n</div>`;\n  }\n\n  /* ---- 2क. सत्यापन आख्या (बिल-वार) ---- */\n  function buildSatyapanHTML(bin, billNo){\n    const bags=bin.bags, val_=bin.value, farmShare=bags*perFarm, subAmt=bags*perSub;\n    return `<div class=\"sheet saty-sheet\" style=\"font-family:'Tiro Devanagari Hindi','Martel',serif\">\n  <div style=\"text-align:center;border-bottom:1.6px solid #000;padding-bottom:8px;margin-bottom:16px\">\n    <div style=\"font-weight:700;font-size:14px\">कार्यालय प्रभारी, उद्यान सचल दल केन्द्र, ${kendra||'—'}</div>\n    <div style=\"font-size:11.5px\">जनपद पौड़ी गढ़वाल, उद्यान विभाग, उत्तराखण्ड</div>\n    <h2 class=\"doc\" style=\"margin:10px 0 0;font-size:17px;text-decoration:underline\">सत्यापन आख्या</h2>\n  </div>\n  <p style=\"margin:0;text-align:right;font-size:12px\">सन्दर्भ : बिल संख्या <b>${billNo||'—'}</b> · दिनांक <b>${dateTxt||'—'}</b></p>\n  <p style=\"margin:10px 0 0;text-align:justify\">प्रमाणित किया जाता है कि उपरोक्त देयक (बिल) संख्या <b>${billNo||'—'}</b> दिनांक <b>${dateTxt||'—'}</b>, मैसर्स बडोला मशरूम फार्म (कम्पोस्ट यूनिट), काशीपुर, ऊधम सिंह नगर से सम्बन्धित कृषकों द्वारा क्रय किए गए बिजाई युक्त ${T.hi} मशरूम कम्पोस्ट बैग का मेरे द्वारा सत्यापन कर लिया गया है। वितरित बैगों की गुणवत्ता, मात्रा एवं विशिष्टताओं का भौतिक सत्यापन कर लिया गया है तथा बैग रोगमुक्त एवं बिजाई युक्त पाए गए हैं। उक्त बिल के अनुसार <b>${bags}</b> बिजाई युक्त ${T.hi} मशरूम कम्पोस्ट बैग सम्बन्धित कृषकों को दिनांक <b>${supplyTxt||'—'}</b> (Date of Supply) को प्राप्त हो चुके हैं तथा कृषक अंश (${farmPct}%) की धनराशि रुपये <b>${money(farmShare)}</b> आपूर्तिकर्ता फर्म द्वारा कृषकों से प्राप्त कर ली गई है।</p>\n  <p style=\"margin:10px 0 0;text-align:justify\">अतः बिल की कुल धनराशि रुपये <b>${money(val_)}</b> में से राजसहायता (अनुदान) की धनराशि रुपये <b>${money(subAmt)}</b> (${subAmt>0?hiWords(subAmt):'—'}) जो कि बिल के कुल योग का ${subPct} प्रतिशत है, <b>उक्त आपूर्तिकर्ता फर्म को भुगतान करने की कृपा कीजियेगा।</b></p>\n  <p style=\"margin:16px 0 0;text-align:justify\"><b>संलग्न है:</b> समेकित पावती-पत्र, BADOLA MUSHROOMS FARM (COMPOST UNIT) का इनवॉइस।</p>\n  <div style=\"display:flex;justify-content:flex-end;margin-top:60px\">\n    <div class=\"center\">\n      प्रभारी,<br>\n      उद्यान सचल दल केन्द्र, <span class=\"dline\">${kendra||'&nbsp;'}</span>\n    </div>\n  </div>\n</div>`;\n  }\n\n  /* ---- 3. टैक्स इनवॉइस (बिल-वार) ---- */\n  function invRowHTML(bags, rate, val_){\n    return `<tr style=\"height:34px\">\n      <td class=\"c\">1</td>\n      <td>Spawned Compost Bag — ${T.en} Mushroom (${kg} kg / bag)<br>\n          <span style=\"font-size:11px\">बिजाई युक्त ${T.hi} मशरूम कम्पोस्ट बैग</span><br>\n          <span style=\"font-size:11px\">Date of Supply : ${supplyTxt||'—'}</span></td>\n      <td class=\"c\">${bags||''}</td>\n      <td class=\"r\">${bags?money(rate):''}</td>\n      <td class=\"r\">${bags?money(val_):''}</td>\n    </tr>`;\n  }\n  function officerStampHTML(subAmt){\n    const BLUE = '#12279e';\n    return `<div style=\"padding:8px 12px;width:100%;max-width:230px;text-align:center;page-break-inside:avoid;break-inside:avoid;color:${BLUE};transform:rotate(1.2deg);opacity:0.92\">\n      <div style=\"font-weight:700;line-height:1.35;font-size:8.5px\">\n        कृषकों के अनुरोध पर देयक की राजसहायता की धनराशि रुपये ${money(subAmt)} फर्म को भुगतान हेतु संस्तुति सहित अग्रसारित है।\n      </div>\n      <div style=\"margin-top:16px;border-top:1px solid ${BLUE};padding-top:4px;font-size:9px;font-weight:700;line-height:1.4\">\n        प्रभारी,<br>उद्यान सचल दल केन्द्र, ${kendra||'&nbsp;'}\n      </div>\n    </div>`;\n  }\n  function certBoxHTML(subAmt, farmersList){\n    const n = farmersList.length;\n    const BLUE = '#12279e';\n    const signItems = farmersList.map((f,i)=>`<div style=\"display:flex;align-items:center;gap:5px\">\n        <span style=\"border:1.3px solid ${BLUE};border-radius:50%;width:16px;height:16px;min-width:16px;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:9px;color:${BLUE}\">${i+1}</span>\n        <span style=\"flex:1;border-bottom:1px solid ${BLUE};font-size:8.5px;padding-bottom:1px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;color:${BLUE}\">${f.name||'&nbsp;'}</span>\n      </div>`).join('');\n    return `<div style=\"padding:8px 12px;width:100%;max-width:340px;text-align:center;page-break-inside:avoid;break-inside:avoid;color:${BLUE};transform:rotate(-1.5deg);opacity:0.92\">\n      <div style=\"font-weight:700;line-height:1.35;font-size:9px\">\n        प्रमाणित किया जाता है कि उक्त क्रय हमारे द्वारा किया गया है। अतः उक्त बिल पर देय राजसहायता की धनराशि ₹${money(subAmt)} फर्म को हमारे अनुरोध पर प्रदान/जारी करने की कृपा करें।\n      </div>\n      <div style=\"display:flex;align-items:center;margin:7px 0 6px\">\n        <div style=\"flex:1;border-bottom:1px solid ${BLUE}\"></div>\n        <div style=\"border:1.2px solid ${BLUE};border-radius:10px;padding:1px 10px;font-weight:700;white-space:nowrap;margin:0 5px;font-size:9px\">कृषक हस्ताक्षर</div>\n        <div style=\"flex:1;border-bottom:1px solid ${BLUE}\"></div>\n      </div>\n      <div style=\"display:grid;grid-template-columns:1fr 1fr;gap:5px 12px;text-align:left\">\n        ${signItems || '<div></div>'}\n      </div>\n    </div>`;\n  }\n  function buildInvoiceHTML(billNo, buyerName, buyerAddr, bags, val_, subAmt, farmersList, vehicles){\n    vehicles = vehicles||[];\n    const half=gst/2, cg=val_*half/100, sg=val_*half/100, gt_=val_+cg+sg;\n    const shortForm = farmersList.length<=12;\n    return `<div class=\"sheet inv-sheet${shortForm?' short-inv':''}\">\n  <div class=\"inv-head\">\n    <div class=\"inv-top\">\n      <span>GSTIN No.: 05CHXPS3134D1Z5</span>\n      <span style=\"text-decoration:underline\">TAX INVOICE</span>\n      <span>Mob.: 9899935600, 6398264916</span>\n    </div>\n    <div class=\"inv-name\">\n      <h1>BADOLA MUSHROOMS FARM</h1>\n      <div class=\"u\">(COMPOST UNIT)</div>\n      <div class=\"a\">H.O.-Dhanori Patti, D.P.S. Road, Kashipur (U.S. Nagar) U.K.</div>\n      <div class=\"a\">Compost Unit-Vill. Pratappur, Near Pickle Factory, Kashipur (U.S. Nagar)</div>\n    </div>\n    <div class=\"inv-bill\">\n      <div>\n        <div style=\"font-weight:700;text-decoration:underline;margin-bottom:3px\">Billing Details</div>\n        <div>M/s : <span class=\"dline dl-long\">${buyerName||'&nbsp;'}</span></div>\n        <div>Address : <span class=\"dline dl-long\">${buyerAddr||'&nbsp;'}</span></div>\n        <div>Way No. : <span class=\"dline dl-long\">&nbsp;</span></div>\n      </div>\n      <div>\n        <div>Bill Date (बिल दिनांक) : <span class=\"dline\">${dateTxt||'&nbsp;'}</span></div>\n        <div style=\"margin-top:6px\">Invoice No. : <span class=\"dline\">${billNo||'&nbsp;'}</span></div>\n        ${vehicles.length?`<div style=\"margin-top:6px;font-weight:700;text-decoration:underline;font-size:11.5px\">वाहन संख्या (Vehicle No.)</div>`+vehicles.map((v,i)=>`<div style=\"margin-top:2px;font-size:12px\">वाहन संख्या ${i+1} : <span class=\"dline\" style=\"font-weight:700\">${v}</span></div>`).join(''):''}\n      </div>\n    </div>\n    <div class=\"inv-items\">\n      <table class=\"doc inv-tbl\">\n        <colgroup><col style=\"width:38px\"><col><col style=\"width:78px\"><col style=\"width:95px\"><col style=\"width:115px\"></colgroup>\n        <thead><tr>\n          <th style=\"border-left:0\">Sr.<br>No.</th><th>Description of Goods</th>\n          <th>Qty / Unit</th><th>Rate / Unit</th><th style=\"border-right:0\">Taxable Value</th>\n        </tr></thead>\n        <tbody>${invRowHTML(bags, rate, val_)}</tbody>\n      </table>\n    </div>\n    <div class=\"inv-spacer\" style=\"gap:14px\">${document.getElementById('i_showstamp').checked ? certBoxHTML(subAmt, farmersList)+officerStampHTML(subAmt) : ''}</div>\n    <div class=\"inv-foot\">\n      <table class=\"doc inv-tbl\">\n        <colgroup><col style=\"width:38px\"><col><col style=\"width:78px\"><col style=\"width:95px\"><col style=\"width:115px\"></colgroup>\n        <tbody>\n          <tr>\n            <td colspan=\"2\" rowspan=\"6\" class=\"bank\" style=\"border-left:0\">\n              <div style=\"font-weight:700;text-decoration:underline\">Bank Detail :</div>\n              <div>Bank Name : The Nainital Bank Ltd.</div>\n              <div>Bank A/c No. : 1586000000000002</div>\n              <div>Branch : Pratappur (Kashipur)</div>\n              <div>Bank IFSC : NTBL0KAS158</div>\n              <div style=\"margin-top:8px\">Total Amount Value (in figures) : <b>₹ ${money(gt_)}</b></div>\n              <div>Total Amount Value (in words) : <b>${gt_>0?enWords(gt_):'—'}</b></div>\n              <div class=\"terms\">\n                <b>Terms and Conditions :</b><br>\n                1. All disputes are subject to Kashipur Jurisdiction.<br>\n                2. Interest @24% will be charged if the payment is not made on realisation.<br>\n                3. Goods once sold are neither refundable nor exchangeable.\n              </div>\n            </td>\n            <td colspan=\"2\">Total</td><td class=\"r\" style=\"border-right:0\">${money(val_)}</td>\n          </tr>\n          <tr><td colspan=\"2\">C.G.S.T. @ ${half}%</td><td class=\"r\" style=\"border-right:0\">${money(cg)}</td></tr>\n          <tr><td colspan=\"2\">S.G.S.T. @ ${half}%</td><td class=\"r\" style=\"border-right:0\">${money(sg)}</td></tr>\n          <tr><td colspan=\"2\">I.G.S.T. @ —</td><td class=\"r\" style=\"border-right:0\">0.00</td></tr>\n          <tr class=\"gt\"><td colspan=\"2\"><b>G. Total</b></td><td class=\"r\" style=\"border-right:0\"><b>${money(gt_)}</b></td></tr>\n          <tr><td colspan=\"3\" class=\"sign\" style=\"border-right:0\">\n            <b>For BADOLA MUSHROOMS FARM</b>\n            <div style=\"margin-top:44px\">Authorised Signatory</div>\n          </td></tr>\n        </tbody>\n      </table>\n    </div>\n  </div>\n</div>`;\n  }\n\n  /* ---- 4. नकद रसीदें (बिल-वार, क्रमांक पूरे केन्द्र में लगातार) ---- */\n  const startNo=parseInt(val('i_rcptno'))||0;\n  const mode=val('i_rmode')||'one';\n  let n=0;\n  function slip(name,place,bags,amt,foot){\n    const no = startNo ? (startNo+n) : '';\n    n++;\n    return `<div class=\"sheet rcpt\">\n      <div class=\"rcpt-card\">\n        <div style=\"display:flex;justify-content:space-between;font-size:11px;font-weight:700\">\n          <span>GSTIN : 05CHXPS3134D1Z5</span>\n          <span class=\"ttl\">नकद प्राप्ति रसीद</span>\n          <span style=\"text-align:right\">M. : 9899935600<br>6398264916</span>\n        </div>\n        <h1>बडोला मशरूम फार्म (कम्पोस्ट यूनिट)</h1>\n        <div class=\"center\" style=\"font-weight:700;font-size:13px\">ग्राम प्रतापपुर – काशीपुर (उत्तराखण्ड)</div>\n        <div style=\"display:flex;justify-content:space-between;margin-top:10px;font-size:14px\">\n          <div>नं० <b>${no||'________'}</b></div>\n          <div>दिनांक <b>${dateTxt||'____________'}</b></div>\n        </div>\n        <div style=\"margin-top:10px;font-size:${(name||'').length>90?12.5:14}px;line-height:${(name||'').length>60?1.65:2.1};text-align:justify\">\n          नाम <b>${name||'____________________'}</b><br>\n          ग्राम <b>${place||'________________'}</b> से <b>${bags} बैग (${bags*kg} किग्रा)</b> ${T.hi} मशरूम<br>\n          कम्पोस्ट का भुगतान रुपया <b>${money(amt)}</b> (${hiWords(amt)})<br>\n          प्राप्त किया ।\n        </div>\n        <div style=\"margin-top:8px;font-size:11.5px\">${foot}</div>\n        <div style=\"display:flex;justify-content:flex-end;align-items:flex-end;margin-top:26px;font-size:12px\">\n          <div class=\"center\">\n            <b>For BADOLA MUSHROOMS FARM</b>\n            <div style=\"margin-top:22px\">हस्ताक्षर (Authorised Signatory)</div>\n          </div>\n        </div>\n      </div>\n    </div>`;\n  }\n\n  /* ---- सभी 5 दस्तावेज़ हर बिल-समूह के लिए बनाना ---- */\n  const voucherZone=document.getElementById('voucher_zone'); voucherZone.innerHTML='';\n  const vendorZone=document.getElementById('vendor_zone'); vendorZone.innerHTML='';\n  const satyapanZone=document.getElementById('satyapan_zone'); satyapanZone.innerHTML='';\n  const invZone=document.getElementById('invoice_zone'); invZone.innerHTML='';\n  const rcptZone=document.getElementById('receipt_zone'); rcptZone.innerHTML='';\n\n  bins.forEach((bin,idx)=>{\n    const billNo = billNoFor(idx);\n    const buyerName = [...new Set(bin.farmers.map(f=>f.name))].join(', ');\n    const buyerAddr = [...new Set(bin.farmers.map(f=>f.vill).filter(Boolean))].join(', ');\n\n    voucherZone.insertAdjacentHTML('beforeend', buildVoucherHTML(bin, billNo));\n    vendorZone.insertAdjacentHTML('beforeend', buildVendorHTML(bin, billNo));\n    satyapanZone.insertAdjacentHTML('beforeend', buildSatyapanHTML(bin, billNo));\n    invZone.insertAdjacentHTML('beforeend', buildInvoiceHTML(billNo, buyerName, buyerAddr, bin.bags, bin.value, bin.bags*perSub, bin.farmers, collectVehicles()));\n\n    if(mode==='one'||mode==='both'){\n      if(bin.bags>0){\n        rcptZone.insertAdjacentHTML('beforeend',\n          slip(buyerName, buyerAddr||kendra||'सचल दल केन्द्र', bin.bags, bin.bags*perFarm,\n               'कुल '+bin.farmers.length+' कृषक · बिल सं० '+(billNo||'—')+' · कुल बिल ₹'+money(bin.value)+' का कृषक अंश '+farmPct+'%'));\n      }\n    }\n    if(mode==='each'||mode==='both'){\n      bin.farmers.forEach(f=>rcptZone.insertAdjacentHTML('beforeend',\n        slip(f.name, f.vill, f.bags, f.bags*perFarm,\n             'कृषक अंश '+farmPct+'% · दर ₹'+money(perFarm)+' प्रति बैग')));\n    }\n  });\n\n  scheduleDraft();\n}\n\n/* ---------------- print ---------------- */\nfunction printDoc(which){\n  document.body.setAttribute('data-print', which);\n  const selMap = {demand:'#doc-demand', voucher:'.vch-sheet', satyapan:'.saty-sheet',\n                   vendor:'.vendor-sheet', invoice:'.inv-sheet', receipts:'.rcpt'};\n  const sel = selMap[which] || '.sheet';\n  const visible = Array.from(document.querySelectorAll(sel));\n  document.querySelectorAll('.sheet').forEach(el=>{ el.style.pageBreakAfter=''; });\n  if(visible.length) visible[visible.length-1].style.pageBreakAfter='auto';\n  window.print();\n}\nwindow.onafterprint = () => {\n  document.body.removeAttribute('data-print');\n  document.querySelectorAll('.sheet').forEach(el=>{ el.style.pageBreakAfter=''; });\n};\n\n/* ---------------- snapshot / apply ---------------- */\nconst FIELDS=['i_rate','i_kg','i_sub','i_gst','i_kendra','i_office','i_year','i_date','i_supply',\n              'i_invoice','i_rcptno','i_billto','i_billaddr','i_rmode'];\nfunction snapshot(){\n  const d={mtype, fields:{}, farmers:collect(), vehicles:collectVehicles(),\n           letter: letterEdited ? document.getElementById('d_letter').innerHTML : ''};\n  FIELDS.forEach(id=>d.fields[id]=document.getElementById(id).value);\n  return d;\n}\n/* ---------------- स्वतः क्रमांकन (बिल संख्या / रसीद संख्या) ---------------- */\n// Auto-number settings are session-only. Nothing is written to localStorage.\nlet MEM_AUTO={};\nfunction getAuto(){ return MEM_AUTO; }\nfunction putAuto(a){ MEM_AUTO=a||{}; }\nfunction toggleAuto(kind){\n  const fieldId=kind==='inv'?'i_invoice':'i_rcptno';\n  const chk=document.getElementById('auto_'+kind+'_chk');\n  const field=document.getElementById(fieldId);\n  if(!chk||!field)return;\n  const a=getAuto();\n  if(chk.checked){\n    const startVal=parseInt(field.value);\n    if(!startVal){alert('पहले शुरुआती नंबर Excel/फॉर्म से भरें, फिर \"स्वतः क्रमांक\" चालू करें।');chk.checked=false;return;}\n    a[kind]={on:true,next:startVal};\n  }else{a[kind]={on:false,next:(a[kind]?a[kind].next:null)};}\n  putAuto(a);applyAutoStyling();\n}\nfunction applyAutoStyling(){\n  const a=getAuto();\n  ['inv','rcpt'].forEach(k=>{\n    const fieldId=k==='inv'?'i_invoice':'i_rcptno';\n    const chk=document.getElementById('auto_'+k+'_chk'),field=document.getElementById(fieldId);\n    if(!chk||!field)return;\n    const on=!!(a[k]&&a[k].on);chk.checked=on;field.readOnly=on;field.style.background=on?'#F4F2EA':'';\n  });\n}\nfunction applyAutoValues(){\n  const a=getAuto();\n  if(a.inv&&a.inv.on&&a.inv.next!=null){const e=document.getElementById('i_invoice');if(e&&!e.value)e.value=a.inv.next;}\n  if(a.rcpt&&a.rcpt.on&&a.rcpt.next!=null){const e=document.getElementById('i_rcptno');if(e&&!e.value)e.value=a.rcpt.next;}\n}\nfunction receiptsUsed(d){\n  const rowsF=(d.farmers||[]).filter(f=>parseInt(f.bags)>0),mode=(d.fields&&d.fields.i_rmode)||'one';\n  let n=0;if(mode==='one'||mode==='both')n+=1;if(mode==='each'||mode==='both')n+=rowsF.length;return n||1;\n}\nfunction bumpAutoCounters(d){\n  const a=getAuto();let changed=false;\n  if(a.inv&&a.inv.on){a.inv.next=(parseInt(d.fields.i_invoice)||a.inv.next||0)+1;changed=true;}\n  if(a.rcpt&&a.rcpt.on){const base=parseInt(d.fields.i_rcptno)||a.rcpt.next||0;a.rcpt.next=base+receiptsUsed(d);changed=true;}\n  if(changed)putAuto(a);\n}\n\nfunction applyData(d){\n  Object.keys(d.fields||{}).forEach(id=>{const el=document.getElementById(id); if(el)el.value=d.fields[id];});\n  if(d.letter){ document.getElementById('d_letter').innerHTML=d.letter; letterEdited=true; }\n  else { document.getElementById('d_letter').innerHTML=LETTER_HTML; letterEdited=false; }\n  document.getElementById('entry_body').innerHTML='';\n  (d.farmers||[]).forEach(f=>addRow(f));\n  document.getElementById('vehicle_list').innerHTML='';\n  const vList=d.vehicles||[];\n  if(vList.length) vList.forEach(v=>addVehicleRow(v));\n  if(d.mtype) pickTypeQuiet(d.mtype);\n  applyAutoStyling();\n  render();\n}\nfunction pickTypeQuiet(t){\n  mtype=t;\n  document.querySelectorAll('.type').forEach(el=>el.dataset.on = el.dataset.type===t?'1':'0');\n  document.getElementById('t_'+t).checked=true;\n}\n\n/* ---------------- file save / load ---------------- */\nfunction saveJSON(){\n  const blob=new Blob([JSON.stringify(snapshot(),null,2)],{type:'application/json'});\n  const a=document.createElement('a');\n  a.href=URL.createObjectURL(blob);\n  a.download='mushroom-'+(val('i_kendra')||'data')+'-'+(val('i_date')||'')+'.json';\n  a.click(); URL.revokeObjectURL(a.href);\n}\nfunction loadJSON(input){\n  const file=input.files[0]; if(!file) return;\n  const fr=new FileReader();\n  fr.onload=e=>{\n    try{\n      const d=JSON.parse(e.target.result);\n      if(Array.isArray(d)){ restoreBackup(d); return; }\n      curRec=null; applyData(d); renderRecords();\n    }catch(err){ alert('फ़ाइल पढ़ी नहीं जा सकी — कृपया इसी प्रणाली से सहेजी गई .json फ़ाइल चुनें।'); }\n  };\n  fr.readAsText(file); input.value='';\n}\n\n/* ---------------- temporary form records ---------------- */\n// Excel itself is the persistent source of truth. Form records are memory-only.\nlet MEM_REC=[];let curRec=null;let backupDirty=false;let booted=true;\nfunction getRecs(){return MEM_REC;}\nfunction putRecs(a){MEM_REC=Array.isArray(a)?a:[];return true;}\nfunction scheduleDraft(){}\nfunction saveDraft(){}\nfunction summary(d){const rate=parseFloat(d.fields?.i_rate)||0,sub=parseFloat(d.fields?.i_sub)||0,bags=(d.farmers||[]).reduce((s,f)=>s+(parseInt(f.bags)||0),0);return{bags,kisan:(d.farmers||[]).filter(f=>f.name||f.bags).length,value:bags*rate,subsidy:bags*rate*sub/100};}\nfunction saveRecord(asNew){\n  const d=snapshot(),s=summary(d);if(!d.fields.i_kendra){alert('पहले Excel से केन्द्र चुनें।');return;}\n  if(s.bags<=0&&!confirm('इस प्रविष्टि में कोई बैग दर्ज नहीं है। फिर भी सहेजें?'))return;\n  const now=new Date().toISOString();\n  if(!asNew&&curRec){const i=MEM_REC.findIndex(r=>r.id===curRec);if(i>-1){MEM_REC[i]={...MEM_REC[i],data:d,savedAt:now};backupDirty=true;renderRecords();flash('प्रविष्टि अद्यतन कर दी गई।');return;}}\n  const id='rec_'+Date.now();MEM_REC.unshift({id,savedAt:now,data:d});curRec=id;backupDirty=true;bumpAutoCounters(d);renderRecords();flash('प्रविष्टि वर्तमान session में सहेजी गई।');\n}\nfunction openRecord(id){const r=MEM_REC.find(x=>x.id===id);if(!r)return;const cur=collect().filter(f=>f.name||f.bags).length;if(cur>0&&!confirm('वर्तमान प्रपत्र हटाकर सहेजी गई प्रविष्टि खोली जाए?'))return;curRec=id;applyData(r.data);renderRecords();flash('प्रविष्टि खोली गई।');window.scrollTo({top:0,behavior:'smooth'});}\nfunction deleteRecord(id){if(!confirm('यह वर्तमान session की प्रविष्टि हटाई जाए?'))return;MEM_REC=MEM_REC.filter(x=>x.id!==id);if(curRec===id)curRec=null;backupDirty=true;renderRecords();}\nfunction newEntry(){\n  if(!confirm('नया खाली प्रपत्र शुरू किया जाए? वर्तमान अनसहेजा कार्य हट जाएगा।'))return;\n  curRec=null;letterEdited=false;mtype='';\n  const letter=document.getElementById('d_letter');if(letter)letter.innerHTML=LETTER_HTML;\n  const body=document.getElementById('entry_body');if(body)body.innerHTML='';\n  ['i_rate','i_kg','i_sub','i_gst','i_kendra','i_office','i_year','i_date','i_supply','i_invoice','i_rcptno','i_billto','i_billaddr','i_rmode'].forEach(id=>{const e=document.getElementById(id);if(e)e.value='';});\n  const vl=document.getElementById('vehicle_list');if(vl)vl.innerHTML='';document.querySelectorAll('.type').forEach(el=>el.dataset.on='0');document.querySelectorAll('input[name=\"mtype\"]').forEach(el=>el.checked=false);applyAutoStyling();renderRecords();render();\n}\nfunction backupAll(){const recs=getRecs();if(!recs.length){alert('अभी कोई अस्थायी प्रविष्टि नहीं है।');return;}const blob=new Blob([JSON.stringify(recs,null,1)],{type:'application/json'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='mushroom-backup-'+new Date().toISOString().slice(0,10)+'.json';a.click();URL.revokeObjectURL(a.href);backupDirty=false;renderRecords();}\nfunction restoreBackup(arr){if(!Array.isArray(arr)||!arr.length||!arr[0].data){alert('यह बैकअप फ़ाइल नहीं है।');return;}const ids=new Set(MEM_REC.map(r=>r.id));let added=0;arr.forEach(r=>{if(r.id&&!ids.has(r.id)){MEM_REC.push(r);added++;}});MEM_REC.sort((a,b)=>(b.savedAt||'').localeCompare(a.savedAt||''));renderRecords();flash(added+' अस्थायी प्रविष्टियाँ बैकअप से जोड़ी गईं।');}\n\nfunction flash(msg){\n  const el=document.getElementById('rec_msg');\n  el.innerText=msg; el.style.display='block';\n  clearTimeout(el._t); el._t=setTimeout(()=>el.style.display='none', 4000);\n}\nfunction storeNote(){const el=document.getElementById('rec_store');if(el)el.innerHTML='Excel फ़ाइल backend पर सुरक्षित है। फ़ॉर्म रिकॉर्ड केवल वर्तमान browser session में अस्थायी हैं।';}\n\nfunction renderRecords(){\n  storeNote();\n  const recs=getRecs(), tb=document.getElementById('rec_body');\n  document.getElementById('rec_count').innerText=recs.length;\n  document.getElementById('btnUpdate').style.display = curRec?'inline-block':'none';\n  tb.innerHTML='';\n  if(!recs.length){\n    tb.innerHTML='<tr><td colspan=\"8\" style=\"text-align:center;color:#55524A;padding:14px\">अभी कोई प्रविष्टि सहेजी नहीं गई है।</td></tr>';\n    return;\n  }\n  recs.forEach(r=>{\n    const d=r.data, s=summary(d), f=d.fields||{};\n    const t=(d.mtype==='oyster')?'ऑयस्टर':'बटन';\n    const dt=(f.i_date||'').split('-').reverse().join('/');\n    tb.insertAdjacentHTML('beforeend',\n      `<tr${r.id===curRec?' style=\"background:#F4F9F5\"':''}>\n        <td><b>${f.i_kendra||'—'}</b>${r.id===curRec?' <span style=\"color:#14553A;font-size:11px\">(खुली हुई)</span>':''}</td>\n        <td>${dt||'—'}</td><td>${f.i_invoice||'—'}</td><td>${t}</td>\n        <td style=\"text-align:center\">${s.kisan}</td>\n        <td style=\"text-align:center\">${s.bags}</td>\n        <td style=\"text-align:right\">₹ ${money(s.value)}</td>\n        <td style=\"white-space:nowrap;text-align:center\">\n          <button class=\"btn s\" style=\"padding:4px 9px;font-size:12px\" onclick=\"openRecord('${r.id}')\">खोलें</button>\n          <button class=\"btn d\" onclick=\"deleteRecord('${r.id}')\">✕</button>\n        </td>\n      </tr>`);\n  });\n}\n\n/* ---------------- init ---------------- */\ndocument.getElementById('entry_body').addEventListener('input', ()=>{ autoFilled=false; });\nLETTER_HTML = document.getElementById('d_letter').innerHTML;\ndocument.getElementById('d_letter').addEventListener('input', ()=>{ letterEdited=true; });\n// Completely empty on startup. Backend Excel is loaded separately by React after the DOM is mounted.\napplyAutoStyling();\nrender();\nrenderRecords();";

/*
|--------------------------------------------------------------------------
| Mushroom Excel API
|--------------------------------------------------------------------------
| Development:
|   React: http://localhost:5173
|   /api/* is handled by the Vite proxy to backend.
|
| Production:
|   Use the deployed Django backend path directly.
|
| IMPORTANT:
|   JWT access/refresh tokens are NOT stored in localStorage.
|   Django stores them in encrypted HttpOnly cookies.
|--------------------------------------------------------------------------
*/
const isLocalhost =
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1";

const MUSHROOM_EXCEL_API_BASE = isLocalhost
  ? "/api"
  : "https://mahadevaaya.com/dhokotdwarproject2/dhokotdwarproject2_backend/api";

const MUSHROOM_EXCEL_API_URL = MUSHROOM_EXCEL_API_BASE + "/mushroom-excel/";

const MUSHROOM_REFRESH_API_URL = MUSHROOM_EXCEL_API_BASE + "/refresh-token/";

function getCsrfTokenFromCookie() {
  const match = document.cookie.match(/(?:^|;\s*)csrftoken=([^;]+)/);

  return match ? decodeURIComponent(match[1]) : "";
}

/*
 * Get a CSRF cookie before any request that requires CSRF.
 * JWT access/refresh tokens are never read by JavaScript.
 */
async function ensureMushroomCsrfToken() {
  let csrf = getCsrfTokenFromCookie();

  if (csrf) {
    return csrf;
  }

  // Try to get CSRF cookie by making a simple GET request to the API base
  // Django sets CSRF cookie on first request to same-origin endpoints
  try {
    const response = await fetch(MUSHROOM_EXCEL_API_BASE, {
      method: "GET",
      credentials: "include",
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      console.warn("CSRF bootstrap request failed:", response.status);
    }

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

    if (!csrf) {
      console.error("Mushroom refresh stopped: CSRF token is unavailable.");

      return false;
    }

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

    if (!response.ok) {
      const text = await response.text();

      console.error(
        "Mushroom authentication refresh failed:",
        response.status,
        text,
      );

      return false;
    }

    return true;
  } catch (error) {
    console.error("Mushroom authentication refresh failed:", error);

    return false;
  }
}

async function mushroomExcelFetch(url, options = {}, allowRefresh = true) {
  const method = String(options.method || "GET").toUpperCase();

  const headers = new Headers(options.headers || {});

  headers.set("Accept", "application/json");

  /*
   * Never send a Bearer token.
   * Django reads the encrypted HttpOnly JWT cookie.
   */
  headers.delete("Authorization");

  /*
   * FormData must NOT receive a manually-set Content-Type.
   * The browser creates the multipart boundary automatically.
   */
  if (["POST", "PUT", "PATCH", "DELETE"].includes(method)) {
    const csrf = await ensureMushroomCsrfToken();

    if (csrf) {
      headers.set("X-CSRFToken", csrf);
    }
  }

  const response = await fetch(url, {
    ...options,
    method,
    headers,
    credentials: "include",
  });

  /*
   * Only 401 triggers a refresh.
   * 403 is returned to the caller because it normally means
   * CSRF or permission failure.
   */
  if (
    response.status === 401 &&
    allowRefresh &&
    !url.endsWith("/refresh-token/")
  ) {
    const refreshed = await refreshMushroomAuthentication();

    if (refreshed) {
      return mushroomExcelFetch(url, options, false);
    }
  }

  return response;
}

async function directMushroomExcelUpload(file) {
  if (!file) {
    throw new Error("पहले Excel फ़ाइल चुनें।");
  }

  if (!/\.(xlsx|xls)$/i.test(file.name)) {
    throw new Error("केवल .xlsx या .xls Excel फ़ाइल स्वीकार की जाएगी।");
  }

  const formData = new FormData();
  formData.append("excel_file", file, file.name);

  // Ask the backend for the existing record first. This prevents creating
  // multiple Excel records and lets POST/PUT behave predictably.
  let existingId = null;

  const currentResponse = await mushroomExcelFetch(MUSHROOM_EXCEL_API_URL, {
    method: "GET",
  });

  if (currentResponse.ok) {
    const payload = await currentResponse.json();

    const record = Array.isArray(payload)
      ? payload[0]
      : payload?.results?.[0] || payload?.data || payload?.record || payload;

    if (record && record.id) {
      existingId = record.id;
    }
  } else if (currentResponse.status === 401) {
    throw new Error(
      "Authentication expired. Please log in again and then upload the Excel file.",
    );
  } else {
    const text = await currentResponse.text();

    throw new Error(
      `Existing Excel check failed (${currentResponse.status}). ${text || currentResponse.statusText}`,
    );
  }

  const method = existingId ? "PUT" : "POST";
  const url = existingId
    ? `${MUSHROOM_EXCEL_API_URL}${existingId}/`
    : MUSHROOM_EXCEL_API_URL;

  const response = await mushroomExcelFetch(url, {
    method,
    body: formData,
  });

  const text = await response.text();

  if (!response.ok) {
    let detail = text;
    try {
      const parsed = JSON.parse(text);
      detail = parsed.detail || parsed.message || text;
    } catch (_) {}

    if (response.status === 401 || response.status === 403) {
      throw new Error(
        `Backend authentication failed (${response.status}). ${detail}`,
      );
    }

    throw new Error(
      `Excel upload failed (${response.status} ${response.statusText}). ${detail}`,
    );
  }

  try {
    return JSON.parse(text);
  } catch (_) {
    return { success: true };
  }
}

async function directMushroomExcelLoad() {
  const response = await mushroomExcelFetch(MUSHROOM_EXCEL_API_URL, {
    method: "GET",
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(
      `Failed to load Excel data (${response.status}). ${text || response.statusText}`,
    );
  }

  return response.json();
}

async function directMushroomExcelDelete(recordId) {
  const response = await mushroomExcelFetch(
    `${MUSHROOM_EXCEL_API_URL}${recordId}/`,
    {
      method: "DELETE",
    }
  );

  if (!response.ok) {
    const text = await response.text();
    throw new Error(
      `Failed to delete Excel (${response.status}). ${text || response.statusText}`,
    );
  }

  return response.json();
}

let mushroomFormLogicInitialized = false;

export default function MushroomForm() {
  const [excelFile, setExcelFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [uploadSuccess, setUploadSuccess] = useState("");

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setExcelFile(file);
      setUploadError("");
      setUploadSuccess("");
    }
  };

  const handleExcelUpload = async () => {
    if (!excelFile) {
      setUploadError("Please select an Excel file first.");
      return;
    }

    setIsUploading(true);
    setUploadError("");
    setUploadSuccess("");

    try {
      // Use the React-side API directly. This avoids the legacy
      // ORIGINAL_FORM_LOGIC script initialization race.
      await directMushroomExcelUpload(excelFile);

      setUploadSuccess("Excel uploaded successfully!");
      setExcelFile(null);

      // Refresh the file input so the same file can be selected again.
      const input = document.getElementById("xlsxFile");
      if (input) {
        input.value = "";
      }

      // Load/parse the newly uploaded Excel into the existing form logic.
      if (typeof window.loadCurrentExcel === "function") {
        await window.loadCurrentExcel();
      }
    } catch (err) {
      console.error("Mushroom Excel upload error:", err);
      setUploadError(err?.message || "Failed to upload Excel file.");
    } finally {
      setIsUploading(false);
    }
  };

  useEffect(() => {
    // Load current Excel data from our new API
    const loadCurrentExcelFromAPI = async () => {
      try {
        // First, fetch the Excel record from the API
        const data = await directMushroomExcelLoad();
        
        // Then, if the legacy function exists, call it to parse the Excel data into the form
        // The legacy loadCurrentExcel will use the global MUSHROOM_EXCEL_API to fetch and parse
        if (typeof window.loadCurrentExcel === "function") {
          await window.loadCurrentExcel();
        }
      } catch (err) {
        console.log("No existing Excel data or failed to load:", err.message);
      }
    };

    if (mushroomFormLogicInitialized) {
      const timer = window.setTimeout(() => {
        loadCurrentExcelFromAPI();
      }, 0);
      return () => window.clearTimeout(timer);
    }

    mushroomFormLogicInitialized = true;
    window.XLSX = XLSX;
    /*
     * The legacy form logic uses this value only for compatibility.
     * The actual Excel requests above use MUSHROOM_EXCEL_API_URL and
     * cookie authentication.
     */
    window.MUSHROOM_EXCEL_API = isLocalhost
      ? "/api/"
      : "https://mahadevaaya.com/dhokotdwarproject2/dhokotdwarproject2_backend/api/";

    // The original form logic expects these functions to be available
    // globally because the source form used inline event handlers.
    // Execute the legacy form logic inside its own scope.
    // React StrictMode may run effects twice in development; a function scope
    // prevents top-level const declarations such as TYPE_META from colliding.
    const script = document.createElement("script");
    script.type = "text/javascript";
    // Use a function wrapper to avoid template literal issues with backticks in ORIGINAL_FORM_LOGIC
    const scriptContent = "(function () {\n" + ORIGINAL_FORM_LOGIC + "\n})();";
    script.textContent = scriptContent;
    document.body.appendChild(script);
    window.__MUSHROOM_FORM_LOGIC_READY__ = true;

    // Render the complete UI first. Excel GET is only a background data operation
    // and must never determine whether the form UI is displayed.
    const excelLoadTimer = window.setTimeout(() => {
      loadCurrentExcelFromAPI();
    }, 0);

    return () => {
      window.clearTimeout(excelLoadTimer);
      document.body.removeAttribute("data-print");

      // Keep the injected classic script alive. React StrictMode runs effects
      // twice in development. Removing and reinjecting this script can create
      // duplicate global declarations and break the Excel functions.
    };
  }, []);

  return (
    <div className="mushroom-form mushroom-form-fullscreen">
      <div className="wrap no-print">
        <div className="panel">
          <h1>मशरूम कम्पोस्ट बैग — प्रपत्र प्रणाली</h1>
          <p className="sub">
            एक बार विवरण भरें — मांग-पत्र, समेकित पावती-पत्र, टैक्स इनवॉइस और
            नकद रसीद अपने आप तैयार हो जाएँगे।
          </p>
          <div className="legend">0 · Excel से डेटा आयात करें</div>
          <div className="excel-import-box">
            <p className="excel-import-help">
              निर्धारित Excel फ़ाइल चुनें। <b>केन्द्र विवरण</b> और{" "}
              <b>कृषक सूची</b> शीट से केन्द्र, बिल, रसीद, दिनांक, वाहन, कृषक और
              बैग की जानकारी अपने-आप भरेगी। Excel में जिस केन्द्र का नाम होगा,
              वही केन्द्र चयन सूची से मैच होगा।
            </p>
            <div className="excel-import-row">
              <input
                type="file"
                id="xlsxFile"
                accept=".xlsx,.xls"
                onChange={handleFileChange}
                disabled={isUploading}
              />
              <button
                className="btn p"
                id="xlsxUploadBtn"
                type="button"
                onClick={handleExcelUpload}
                disabled={isUploading || !excelFile}
              >
                {isUploading ? "⏳ अपलोड हो रहा है..." : "📤 Excel अपलोड करें"}
              </button>
              <button
                className="btn d"
                id="xlsxDeleteBtn"
                type="button"
                style={{ display: "none" }}
                onClick={async () => {
                  try {
                    // First, get the current record to find its ID
                    const loadResponse = await directMushroomExcelLoad();
                    const records = Array.isArray(loadResponse) ? loadResponse : loadResponse?.results || [];
                    const record = records[0];
                    
                    if (!record || !record.id) {
                      throw new Error("No Excel file found to delete.");
                    }

                    await directMushroomExcelDelete(record.id);
                    setUploadSuccess("Excel deleted successfully!");
                    setUploadError("");

                    // Reload the form data
                    if (typeof window.loadCurrentExcel === "function") {
                      await window.loadCurrentExcel();
                    }
                  } catch (err) {
                    setUploadError(err.message);
                    alert(err.message);
                  }
                }}
              >
                🗑 Excel हटाएँ
              </button>
            </div>
            <div className="excel-file-status">
              {uploadError && (
                <span
                  id="xlsxStatus"
                  className="excel-status"
                  style={{ color: "red" }}
                >
                  {uploadError}
                </span>
              )}
              {uploadSuccess && (
                <span
                  id="xlsxStatus"
                  className="excel-status"
                  style={{ color: "green" }}
                >
                  {uploadSuccess}
                </span>
              )}
              {!uploadError && !uploadSuccess && (
                <span id="xlsxStatus" className="excel-status">
                  Excel backend से उपलब्ध होने पर यहाँ दिखाई जाएगी
                </span>
              )}
              <span id="xlsxCurrentFile" className="excel-current-file">
                {excelFile
                  ? `चुनी गई फ़ाइल: ${excelFile.name}`
                  : "कोई Excel फ़ाइल नहीं"}
              </span>
            </div>
          </div>
          <div className="legend">1 · मशरूम का प्रकार चुनें</div>
          <div className="types">
            <div
              className="type"
              data-type="button"
              data-on="0"
              onClick={(e) => {
                window.pickType("button");
              }}
            >
              <input type="radio" name="mtype" id="t_button" />
              <div>
                <b>बटन मशरूम (Button)</b>
                <span>दर और बैग वजन Excel से आएगा</span>
              </div>
            </div>
            <div
              className="type"
              data-type="oyster"
              data-on="0"
              onClick={(e) => {
                window.pickType("oyster");
              }}
            >
              <input type="radio" name="mtype" id="t_oyster" />
              <div>
                <b>ऑयस्टर मशरूम (Oyster)</b>
                <span>दर और बैग वजन Excel से आएगा</span>
              </div>
            </div>
          </div>
          <div className="grid" style={{ marginTop: "12px" }}>
            <div>
              <label className="f">पूर्ण दर (₹ प्रति बैग)</label>
              <input
                type="number"
                id="i_rate"
                min="0"
                step="0.01"
                onInput={(e) => {
                  window.render();
                }}
              />
            </div>
            <div>
              <label className="f">बैग वजन (किग्रा)</label>
              <input
                type="number"
                id="i_kg"
                min="0"
                step="0.5"
                onInput={(e) => {
                  window.render();
                }}
              />
            </div>
            <div>
              <label className="f">अनुदान प्रतिशत (%)</label>
              <input
                type="number"
                id="i_sub"
                min="0"
                max="100"
                onInput={(e) => {
                  window.render();
                }}
              />
            </div>
            <div>
              <label className="f">जी०एस०टी० दर (%)</label>
              <select
                id="i_gst"
                onChange={(e) => {
                  window.render();
                }}
              >
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
              <label className="f">उद्यान सचल दल केन्द्र (Excel से)</label>
              <select
                id="i_kendra"
                onChange={(e) => {
                  window.onKendra();
                }}
              >
                <option value="">— केन्द्र चुनें —</option>
              </select>
            </div>
            <div>
              <label className="f">कार्यालय / जनपद</label>
              <input
                type="text"
                id="i_office"
                onInput={(e) => {
                  window.render();
                }}
              />
            </div>
            <div>
              <label className="f">जिला योजना वर्ष</label>
              <input
                type="text"
                id="i_year"
                onInput={(e) => {
                  window.render();
                }}
              />
            </div>
            <div>
              <label className="f">बिल दिनांक (Bill Date)</label>
              <input
                type="date"
                id="i_date"
                onInput={(e) => {
                  window.render();
                }}
              />
            </div>
            <div>
              <label className="f">
                आपूर्ति दिनांक (Date of Supply / वितरण की तिथि)
              </label>
              <input
                type="text"
                id="i_supply"
                placeholder="जैसे 23/08/2026 या 23/08/2026, 26/08/2026"
                onInput={(e) => {
                  window.render();
                }}
              />
            </div>
            <div>
              <label className="f">
                बिल / इनवॉइस संख्या
                <label
                  style={{
                    fontWeight: "400",
                    fontSize: "11px",
                    marginLeft: "8px",
                    cursor: "pointer",
                  }}
                >
                  <input
                    type="checkbox"
                    id="auto_inv_chk"
                    onChange={(e) => {
                      window.toggleAuto("inv");
                    }}
                    style={{ verticalAlign: "middle" }}
                  />{" "}
                  स्वतः क्रमांक
                </label>
              </label>
              <input
                type="text"
                id="i_invoice"
                placeholder="1272"
                onInput={(e) => {
                  window.render();
                }}
              />
            </div>
            <div>
              <label className="f">
                रसीद प्रारम्भिक संख्या
                <label
                  style={{
                    fontWeight: "400",
                    fontSize: "11px",
                    marginLeft: "8px",
                    cursor: "pointer",
                  }}
                >
                  <input
                    type="checkbox"
                    id="auto_rcpt_chk"
                    onChange={(e) => {
                      window.toggleAuto("rcpt");
                    }}
                    style={{ verticalAlign: "middle" }}
                  />{" "}
                  स्वतः क्रमांक
                </label>
              </label>
              <input
                type="number"
                id="i_rcptno"
                placeholder="751"
                onInput={(e) => {
                  window.render();
                }}
              />
            </div>
            <div>
              <label className="f">बिल किसके नाम (M/s)</label>
              <input
                type="text"
                id="i_billto"
                onInput={(e) => {
                  window.render();
                }}
              />
            </div>
            <div>
              <label className="f">बिल पता</label>
              <input
                type="text"
                id="i_billaddr"
                onInput={(e) => {
                  window.render();
                }}
              />
            </div>
            <div>
              <label className="f">नकद रसीद किस प्रकार बनें</label>
              <select
                id="i_rmode"
                onChange={(e) => {
                  window.render();
                }}
              >
                <option value="each">प्रति कृषक अलग रसीद</option>
                <option value="one">एक संयुक्त रसीद (कुल बिल का 20%)</option>
                <option value="both">दोनों — संयुक्त + प्रति कृषक</option>
              </select>
            </div>
            <div style={{ gridColumn: "1/-1" }}>
              <p className="hint" style={{ margin: "4px 0 0" }}>
                टैक्स इनवॉइस में क्रेता (M/s) सदैव उस केन्द्र के सभी कृषकों के
                नाम से एक साथ बनता है (विभाग की जगह), चाहे कृषक कितने भी क्यों न
                हों — पता (Address) में उनके सभी ग्राम। समेकित पावती-पत्र,
                विक्रेता का प्रमाण-पत्र, सत्यापन आख्या एवं नकद रसीदें भी उसी एक
                बिल के अनुसार सभी कृषकों को साथ लेकर बनती हैं।
              </p>
            </div>
            <div style={{ gridColumn: "1/-1" }}>
              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  cursor: "pointer",
                  fontWeight: "600",
                }}
              >
                <input
                  type="checkbox"
                  id="i_showstamp"
                  defaultChecked
                  onChange={(e) => {
                    window.render();
                  }}
                />
                टैक्स इनवॉइस में कृषक-हस्ताक्षर वाली नीली मुहर (स्टाम्प) दिखाएँ
              </label>
            </div>
          </div>
          <div className="legend">
            2क · वाहन संख्या (टैक्स इनवॉइस हेतु, वैकल्पिक)
          </div>
          <div id="vehicle_list"></div>
          <button
            className="btn s"
            type="button"
            onClick={(e) => {
              window.addVehicleRow();
            }}
            style={{ margin: "6px 0 4px" }}
          >
            + वाहन जोड़ें (Add Vehicle)
          </button>
          <p className="hint" style={{ margin: "2px 0 10px" }}>
            जितने वाहन नंबर भरे जाएँगे, टैक्स इनवॉइस में "Invoice No." के ठीक
            नीचे उतने ही दिखेंगे — ख़ाली बॉक्स इनवॉइस में नहीं छपेंगे। एक वाहन
            होने पर सिर्फ़ वही दिखेगा।
          </p>
          <div className="legend">3 · कृषकों की सूची</div>
          <div style={{ overflowX: "auto" }}>
            <table className="entry">
              <thead>
                <tr>
                  <th>क्र०</th>
                  <th>कृषक का नाम</th>
                  <th>ग्राम</th>
                  <th>मोबाइल नंबर</th>
                  <th>आधार सं०</th>
                  <th style={{ width: "100px" }}>बैग</th>
                  <th style={{ width: "44px" }}>हटाएं</th>
                </tr>
              </thead>
              <tbody id="entry_body"></tbody>
            </table>
          </div>
          <div className="bar">
            <button
              className="btn p"
              onClick={(e) => {
                window.addRow();
              }}
            >
              + कृषक जोड़ें
            </button>
            <button
              className="btn s"
              id="loadK"
              style={{ display: "none" }}
              onClick={(e) => {
                window.loadKendra(true);
              }}
            ></button>
            <button
              className="btn s"
              onClick={(e) => {
                window.clearRows();
              }}
            >
              सूची खाली करें
            </button>
            <div className="tot">
              कुल बैग <b id="t_bags">0</b> · कुल मूल्य ₹ <b id="t_val">0.00</b>{" "}
              · किसान अंश ₹ <b id="t_share">0.00</b> · अनुदान ₹{" "}
              <b id="t_sub">0.00</b>
            </div>
          </div>
          <div className="warn" id="warn">
            कृपया कम से कम एक कृषक का नाम एवं बैग संख्या भरें।
          </div>
          <div className="legend">4 · प्रपत्र प्रिंट करें</div>
          <div className="printrow">
            <button
              className="btn p"
              onClick={(e) => {
                window.printDoc("demand");
              }}
            >
              मांग-पत्र
            </button>
            <button
              className="btn p"
              onClick={(e) => {
                window.printDoc("voucher");
              }}
            >
              समेकित पावती-पत्र (वितरण-सह-प्राप्ति)
            </button>
            <button
              className="btn p"
              onClick={(e) => {
                window.printDoc("satyapan");
              }}
            >
              सत्यापन आख्या (प्रभारी)
            </button>
            <button
              className="btn p"
              onClick={(e) => {
                window.printDoc("vendor");
              }}
            >
              विक्रेता का प्रमाण-पत्र
            </button>
            <button
              className="btn p"
              onClick={(e) => {
                window.printDoc("invoice");
              }}
            >
              टैक्स इनवॉइस
            </button>
            <button
              className="btn p"
              onClick={(e) => {
                window.printDoc("receipts");
              }}
            >
              नकद रसीदें (प्रति कृषक)
            </button>
            <button
              className="btn s"
              onClick={(e) => {
                window.printDoc("all");
              }}
            >
              सभी प्रपत्र
            </button>
            <button
              className="btn s"
              onClick={(e) => {
                window.resetLetter();
              }}
            >
              मांग-पत्र का पाठ रीसेट करें
            </button>
          </div>
          <p className="hint">
            प्रिंट विंडो में पेपर A4 और मार्जिन "Default" रखें। PDF बनाने हेतु
            Destination में "Save as PDF" चुनें।
          </p>
          <div className="legend">
            5 · सहेजी गई प्रविष्टियाँ (<span id="rec_count">0</span>)
          </div>
          <div className="bar">
            <button
              className="btn p"
              onClick={(e) => {
                window.saveRecord(true);
              }}
            >
              इस केन्द्र की प्रविष्टि सहेजें
            </button>
            <button
              className="btn p"
              id="btnUpdate"
              style={{ display: "none" }}
              onClick={(e) => {
                window.saveRecord(false);
              }}
            >
              खुली प्रविष्टि अद्यतन करें
            </button>
            <button
              className="btn s"
              onClick={(e) => {
                window.newEntry();
              }}
            >
              नया प्रपत्र
            </button>
            <button
              className="btn s"
              onClick={(e) => {
                window.backupAll();
              }}
            >
              सभी का बैकअप फ़ाइल में
            </button>
            <button
              className="btn s"
              onClick={(e) => {
                document.getElementById("loadfile").click();
              }}
            >
              बैकअप फ़ाइल से वापस लाएँ
            </button>
            <span className="tot" id="rec_store"></span>
          </div>
          <div
            className="warn"
            id="rec_msg"
            style={{
              display: "none",
              background: "#F1F8F3",
              borderColor: "#BBD9C6",
              color: "#14553A",
            }}
          ></div>
          <div style={{ overflowX: "auto", marginTop: "8px" }}>
            <table className="entry">
              <thead>
                <tr>
                  <th>केन्द्र</th>
                  <th style={{ width: "86px" }}>दिनांक</th>
                  <th style={{ width: "80px" }}>बिल सं०</th>
                  <th style={{ width: "70px" }}>प्रकार</th>
                  <th style={{ width: "54px" }}>कृषक</th>
                  <th style={{ width: "54px" }}>बैग</th>
                  <th style={{ width: "100px" }}>कुल मूल्य</th>
                  <th style={{ width: "110px" }}>क्रिया</th>
                </tr>
              </thead>
              <tbody id="rec_body"></tbody>
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
      <div className="sheet" id="doc-demand">
        <h2 className="doc">मांग-पत्र</h2>
        <div
          id="d_letter"
          className="editable"
          contentEditable="true"
          suppressContentEditableWarning
          spellCheck="false"
        >
          <p style={{ margin: "0" }}>
            सेवा में,
            <br />
               
            <span id="d_office">
              उद्यान विशेषज्ञ कोटद्वार गढ़वाल (पौड़ी गढ़वाल)
            </span>
            ,<br />
              द्वारा: प्रभारी, उद्यान सचल दल केन्द्र,{" "}
            <span className="dline dl-long" id="d_kendra">
               
            </span>
          </p>
          <p style={{ margin: "10px 0 6px" }}>
            <b>
              विषय: कृषकों द्वारा <span id="d_sub1">80</span>% अनुदान पर बिजाई
              युक्त कम्पोस्ट बैग उपलब्ध कराए जाने के सम्बन्ध में।
            </b>
          </p>
          <p style={{ margin: "0", textAlign: "justify" }}>
            महोदय,
            <br />
                सविनय निवेदन है कि हम क्षेत्र के इच्छुक कृषक स्वरोजगार एवं
            आजीविका संवर्धन के उद्देश्य से{" "}
            <span id="d_typeline">बटन मशरूम (Button Mushroom)</span> की खेती
            करना चाहते हैं। इस हेतु हमें जिला योजना वर्ष{" "}
            <span id="d_year">2026-27</span> के अन्तर्गत{" "}
            <span id="d_sub2">80</span>% अनुदान पर बिजाई युक्त कम्पोस्ट बैग की
            आवश्यकता है।
          </p>
          <p style={{ margin: "8px 0 0", textAlign: "justify" }}>
            हम सभी कृषक आर्थिक रूप से कमजोर एवं सीमित साधनों वाले हैं तथा
            कम्पोस्ट बैग की कुल देय राशि का भुगतान एक साथ करने में सक्षम नहीं
            हैं। अतः उक्त योजना के अन्तर्गत <span id="d_sub2b">80</span>% अनुदान
            पर बिजाई युक्त कम्पोस्ट बैग उपलब्ध कराए जाने हेतु यह अनुरोध प्रस्तुत
            किया जा रहा है।
          </p>
          <p style={{ margin: "8px 0 0", textAlign: "justify" }}>
            कम्पोस्ट बैग की निर्धारित दर ₹<span id="d_rate2">90</span>.00 प्रति
            बैग के अनुसार कृषकों द्वारा <span id="d_farmpct">20</span>% अंशदान ₹
            <span id="d_fs">18</span> प्रति बैग स्वयं वहन किया जाएगा। शेष{" "}
            <span id="d_sub3">80</span>% राजसहायता ₹
            <span id="d_subamt">72</span> प्रति बैग का लाभ कृषकों को "इन-काइंड
            सब्सिडी (In-kind Subsidy)" के रूप में कम्पोस्ट बैग की आपूर्ति के
            माध्यम से प्रदान किए जाने तथा अनुदान की समतुल्य राशि संबंधित
            आपूर्तिकर्ता को सीधे e-Payment के माध्यम से भुगतान किए जाने का
            अनुरोध है।
          </p>
          <p style={{ margin: "8px 0 0", textAlign: "justify" }}>
            इस सम्बन्ध में हमारे द्वारा मैसर्स बडोला मशरूम फार्म, काशीपुर, ऊधम
            सिंह नगर से संपर्क किया गया। साथ ही अन्य फर्मों से भी जानकारी
            प्राप्त की गई। अन्य फर्मों द्वारा ग्राम स्तर तक कम्पोस्ट बैग
            पहुँचाने हेतु परिवहन/डिलीवरी शुल्क अलग से लिये जाने की जानकारी दी
            गई, जबकि मैसर्स बडोला मशरूम फार्म द्वारा विभागीय निर्धारित दर ₹
            <span id="d_rate">90</span>.00 प्रति बैग पर बिना किसी अतिरिक्त
            परिवहन/डिलीवरी शुल्क के ग्राम स्तर तक बिजाई युक्त कम्पोस्ट बैग
            उपलब्ध कराने की सहमति दी गई है। अतः कृषकों की सहमति से उक्त फर्म से
            कम्पोस्ट बैग क्रय किए जाने का अनुरोध किया जा रहा है।
          </p>
          <p style={{ margin: "8px 0 0", textAlign: "justify" }}>
            उक्त आपूर्तिकर्ता फर्म शेष देय धनराशि का भुगतान विभाग में बजट उपलब्ध
            होने पर प्राप्त करने हेतु सहमत है।
          </p>
          <p style={{ margin: "8px 0 0", textAlign: "justify" }}>
            अतः महोदय से निवेदन है कि हमारे अनुरोध पत्र के आधार पर मैसर्स बडोला
            मशरूम फार्म, काशीपुर, ऊधम सिंह नगर से विभागीय निर्धारित दर ₹
            <span id="d_rate3">90</span>.00 प्रति बैग पर बिजाई युक्त कम्पोस्ट
            बैग क्रय किए जाने की स्वीकृति प्रदान करने की कृपा कीजिएगा तथा
            विभागीय स्वीकृति के उपरांत संबंधित आपूर्तिकर्ता द्वारा प्रस्तुत देयक
            के आधार पर विभागीय स्वीकृत दर के अनुसार देय{" "}
            <span id="d_sub4">80</span>% राजसहायता की धनराशि संबंधित
            आपूर्तिकर्ता फर्म को भुगतान हेतु अवमुक्त किए जाने की कृपा कीजिएगा।
          </p>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            margin: "10px 0 6px",
            gap: "16px",
          }}
        >
          <p style={{ margin: "0" }}>
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
            <span className="tick" id="d_tick_o">
               
            </span>
            ऑयस्टर (Oyster)
            <br />
            <span className="tick" id="d_tick_b">
               
            </span>
            बटन (Button)
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
              <th style={{ width: "55px" }}>मांग (बैग की सं०)</th>
              <th style={{ width: "115px" }}>हस्ताक्षर</th>
            </tr>
          </thead>
          <tbody id="d_rows"></tbody>
          <tfoot>
            <tr>
              <td colSpan="5" className="r">
                <b>कुल योग</b>
              </td>
              <td className="c">
                <b id="d_total">0</b>
              </td>
              <td></td>
            </tr>
          </tfoot>
        </table>
        <p className="center" style={{ margin: "26px 0 0" }}>
          <b>समस्त कृषक गण</b>
        </p>
        <div style={{ marginTop: "16px" }}>
          <p className="center" style={{ margin: "0 0 6px" }}>
            <b style={{ textDecoration: "underline" }}>
              प्रभारी की संस्तुति एवं अग्रसारण
            </b>
          </p>
          <p style={{ margin: "0", textAlign: "justify" }}>
            सम्बन्धित कृषकों के अनुरोध के क्रम में, उक्त{" "}
            <span id="d_type3">बटन</span> मशरूम की खेती हेतु बिजाई युक्त
            कम्पोस्ट बैग की मांग संस्तुति सहित सादर अग्रसारित है। कृपया कृषकों
            को उक्त बैग क्रय किए जाने की स्वीकृति प्रदान करने की कृपा कीजियेगा।
          </p>
          <p style={{ textAlign: "right", margin: "32px 0 0" }}>
            <b>हस्ताक्षर प्रभारी: _____________________</b>
          </p>
        </div>
      </div>
      <div id="voucher_zone"></div>
      <div id="vendor_zone"></div>
      <div id="satyapan_zone"></div>
      <div id="invoice_zone"></div>
      <div id="receipt_zone"></div>
    </div>
  );
}
