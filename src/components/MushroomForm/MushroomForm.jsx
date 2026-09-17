import React, { useEffect, useRef } from "react";
import "./MushroomForm.css";

/**
 * Mushroom Compost Bag — Demand & Distribution Form
 *
 * Converted from the supplied HTML into React JSX.
 * The static HTML is now real JSX; there is no HTML string/template
 * used for the page UI.
 *
 * The original document-generation/calculation JavaScript is retained
 * inside the effect because it creates the six printable documents
 * dynamically and uses the existing IDs/classes from the original form.
 */
const ORIGINAL_FORM_LOGIC =
  '/* ---------------- kendra-wise farmer database ---------------- */\nconst DB = {"कोटद्वार": [{"name": "श्री मोहन सिंह", "vill": "रामपुर", "mob": "7248718304", "adh": "425772516668", "bags": 0}, {"name": "श्री सतीश चन्द्र", "vill": "रामपुर", "mob": "7983540316", "adh": "745920167364", "bags": 0}, {"name": "श्री तीरथ सिंह नेगी", "vill": "रामणी", "mob": "8006040074", "adh": "", "bags": 0}, {"name": "श्री जय सिंह", "vill": "गोपाल सिंह", "mob": "9719478757", "adh": "713587557459", "bags": 0}, {"name": "श्री विजय पाल सिंह", "vill": "शंकर सिंह", "mob": "7248184990", "adh": "740876861050", "bags": 0}, {"name": "श्री अभिषेक भट्ट", "vill": "सिताबपुर", "mob": "8800386696", "adh": "877582562689", "bags": 0}, {"name": "श्री भारत सिंह", "vill": "शिवराजपुर", "mob": "8057831536", "adh": "387317227430", "bags": 0}, {"name": "श्री हरपाल सिंह", "vill": "शिवराजपुर", "mob": "9927736154", "adh": "300618746261", "bags": 0}, {"name": "श्री राहुल सिंह रावत", "vill": "सिताबपुर", "mob": "7409888690", "adh": "221357224911", "bags": 2000}, {"name": "श्रीमती दीपती शर्मा", "vill": "पदमपुर", "mob": "7558391185", "adh": "816613443669", "bags": 0}], "सतपुली": [{"name": "श्रीमती आशा देवी", "vill": "भल्ली", "mob": "8433117069", "adh": "658694592023", "bags": 150}, {"name": "श्री विक्रम सिंह", "vill": "कैण्डुल", "mob": "8091456193", "adh": "9724962487", "bags": 100}, {"name": "श्री विकास चन्द्र", "vill": "बरगड्डी", "mob": "9368893506", "adh": "892365819014", "bags": 150}, {"name": "श्री सुद्ववीर सिंह", "vill": "बन्दूण", "mob": "989710644", "adh": "686760033596", "bags": 100}, {"name": "श्री आर०पी० भट्ट", "vill": "सतपुली", "mob": "9548991677", "adh": "203745162823", "bags": 50}, {"name": "श्री केदार सिंह", "vill": "बन्दूण", "mob": "8447213731", "adh": "906877661354", "bags": 100}, {"name": "श्री कुलदीप सिंह", "vill": "खैरासैण", "mob": "8650531126", "adh": "626556678689", "bags": 100}, {"name": "श्री कन्हैया लाल", "vill": "पटखोली", "mob": "8958358824", "adh": "250309042333", "bags": 50}], "किनगोड़िखाल": [{"name": "श्री सुरज सिंह", "vill": "बिरखेत", "mob": "8193853946", "adh": "556509285603", "bags": 100}, {"name": "श्री दीपक कुमार", "vill": "कांलक्यूं", "mob": "8445662139", "adh": "434752450645", "bags": 150}, {"name": "श्रीमती सुमन देवी", "vill": "रूडाली", "mob": "7500196261", "adh": "572964854368", "bags": 100}, {"name": "श्री दीपक कुमार", "vill": "कांलक्यूं", "mob": "8445662139", "adh": "556509285008", "bags": 100}, {"name": "श्रीमती सुमन देवी", "vill": "रूडाली", "mob": "7500196261", "adh": "572964854368", "bags": 100}, {"name": "श्री विजय पाल सिंह", "vill": "बराथ मल्ला", "mob": "9756533894", "adh": "471582371204", "bags": 50}, {"name": "श्री धर्मपाल सिंह", "vill": "दिगोली", "mob": "8476827385", "adh": "334414172057", "bags": 50}], "सेंधीखाल": [{"name": "श्री मनोरमा रावत", "vill": "सेन्धी", "mob": "7505017963", "adh": "698422105298", "bags": 120}, {"name": "श्री मुकेश कुमार", "vill": "सेन्धी", "mob": "9027009778", "adh": "700131085486", "bags": 120}, {"name": "श्री कान्ता प्रसाद", "vill": "सेन्धी", "mob": "7579233173", "adh": "821055364799", "bags": 120}, {"name": "श्री महेन्द्र सिंह", "vill": "जडियाना", "mob": "9458100473", "adh": "439292950101", "bags": 120}], "सिसल्ड़ी": [{"name": "श्री सोहन सिंह रावत", "vill": "बाडियो", "mob": "9639554404", "adh": "667333101703", "bags": 150}, {"name": "श्री अमन बूडाकोटी", "vill": "मंझकोट", "mob": "8979457072", "adh": "599438852978", "bags": 150}, {"name": "श्री हरीश खंतवाल", "vill": "सिसल्डी", "mob": "9410581592", "adh": "926972452243", "bags": 50}, {"name": "श्री हिमांशु खंतवाल", "vill": "सिसल्डी", "mob": "7454021772", "adh": "981832743519", "bags": 120}], "चेलूसैंण": [{"name": "श्री सुभाष सिंह", "vill": "कलोडी", "mob": "8395082501", "adh": "74250506496", "bags": 300}, {"name": "श्री माहवीर सिंह", "vill": "च्वरा", "mob": "7500479744", "adh": "563556710575", "bags": 335}], "दिउली": [{"name": "श्री जुबेर हुसैन", "vill": "कुनाऊ", "mob": "9719909356", "adh": "716845498724", "bags": 1000}, {"name": "श्री प्रदीप रावत", "vill": "कुनाऊ", "mob": "8126526930", "adh": "410216715831", "bags": 200}, {"name": "श्री सुरेश पयाल", "vill": "कुनाऊ", "mob": "9468822998", "adh": "872861073573", "bags": 800}, {"name": "श्री सुभाष सिंह", "vill": "कुनाऊ", "mob": "9927847834", "adh": "732680083632", "bags": 200}, {"name": "श्रीमती कमला देवी", "vill": "कुनाऊ", "mob": "9411529839", "adh": "933314397018", "bags": 200}, {"name": "श्री सौरभ पयाल", "vill": "कुनाऊ", "mob": "8279679204", "adh": "637853794303", "bags": 200}, {"name": "श्री आयुष पयाल", "vill": "कुनाऊ", "mob": "9368830104", "adh": "476829389438", "bags": 200}, {"name": "श्री चनमोहन नेगी", "vill": "कुनाऊ", "mob": "8057046365", "adh": "307244709895", "bags": 400}, {"name": "श्रीमती दर्शनी देवी", "vill": "कुनाऊ", "mob": "9548789262", "adh": "648721407193", "bags": 200}, {"name": "श्री आदित्य नेगी", "vill": "कुनाऊ", "mob": "8650766707", "adh": "860034501598", "bags": 200}, {"name": "श्री आशा नेगी", "vill": "कुनाऊ", "mob": "6395801175", "adh": "913084121128", "bags": 200}, {"name": "श्री विजेन्द्र सिंह", "vill": "कुनाऊ", "mob": "6395801175", "adh": "396785845527", "bags": 200}], "पौखाल": [{"name": "श्री राजकुमार चुना", "vill": "महेडा", "mob": "7500336198", "adh": "664818455579", "bags": 200}, {"name": "श्री अमीत कुमार", "vill": "केष्टा", "mob": "8868011411", "adh": "307173916414", "bags": 240}, {"name": "श्रीमती कुसुमलता देवी", "vill": "गूम", "mob": "8449982738", "adh": "877684734177", "bags": 100}], "गंगाभोगपुर": [{"name": "श्री तपेश्वर गिरी", "vill": "गंगाभोगपुर", "mob": "7906359657", "adh": "634899480683", "bags": 500}, {"name": "श्री दिनेश चन्द्र", "vill": "धारकोट", "mob": "8193941142", "adh": "632360267199", "bags": 500}], "सिलोगी": [{"name": "श्री गुणपाल सिंह", "vill": "सौड", "mob": "8006669221", "adh": "254398838578", "bags": 20}, {"name": "श्री गिरीश सिंह", "vill": "टाटरी", "mob": "9927562465", "adh": "512800401909", "bags": 200}, {"name": "श्री सूर्याकांत", "vill": "सीला", "mob": "9675849009", "adh": "487939357754", "bags": 20}, {"name": "श्री गिरीश सिंह बिष्ट", "vill": "चाँदपुर", "mob": "9759264326", "adh": "931389438979", "bags": 20}, {"name": "श्रीमती रूचि नेगी", "vill": "सौड", "mob": "7983104947", "adh": "299530529734", "bags": 100}, {"name": "श्री मनोज सिंह", "vill": "खरीक", "mob": "7830212181", "adh": "710852422109", "bags": 30}, {"name": "श्री जयपाल सिंह", "vill": "खैण्डूरी", "mob": "8859692815", "adh": "751156202871", "bags": 10}, {"name": "श्री पुष्पा कुकरेती", "vill": "ग्वील", "mob": "9720709931", "adh": "563884579942", "bags": 45}, {"name": "श्री डब्बल सिंह", "vill": "दावड", "mob": "8979617751", "adh": "468474888863", "bags": 20}, {"name": "श्री देवेन्द्र देव", "vill": "सौड", "mob": "8859581157", "adh": "704192142479", "bags": 30}, {"name": "श्री चन्द्र मोहन", "vill": "खरीक", "mob": "9759639128", "adh": "639974681605", "bags": 50}, {"name": "श्रीमती विनीता भण्डारी", "vill": "सुराडी", "mob": "9675888617", "adh": "488884173739", "bags": 50}, {"name": "श्री शशीकांत", "vill": "कडथी", "mob": "9548563893", "adh": "780385706047", "bags": 50}, {"name": "श्री सुभाष चौहान", "vill": "कठूडवडा", "mob": "7838648206", "adh": "575857730411", "bags": 100}, {"name": "श्री मोहन लाल", "vill": "उतिण्डा", "mob": "7579113224", "adh": "829738153461", "bags": 50}, {"name": "श्री कुलवीर सिंह", "vill": "अमोला", "mob": "7535049445", "adh": "419016943089", "bags": 30}, {"name": "श्रीमती अंजू देवी", "vill": "बिरमोली", "mob": "8218130532", "adh": "499092661887", "bags": 100}, {"name": "श्रीमती लता देवी", "vill": "सुराडी", "mob": "7870701621", "adh": "648536616912", "bags": 300}, {"name": "श्री हरीश सिंह", "vill": "दावड", "mob": "8006857086", "adh": "260551816003", "bags": 20}, {"name": "श्री रविन्द्र सिंह", "vill": "गढकोट", "mob": "9990803691", "adh": "842508558457", "bags": 20}, {"name": "श्री सुमन बर्तवाल", "vill": "बडेथ", "mob": "7617453038", "adh": "684395567303", "bags": 50}, {"name": "श्री जितेन्द्र कुमार", "vill": "जल्ली", "mob": "9528189662", "adh": "888531504892", "bags": 150}, {"name": "श्रीमती रूकमा देवी", "vill": "खैण्डूरी", "mob": "9548239457", "adh": "790553395088", "bags": 50}, {"name": "श्रीमती रेखा देवी", "vill": "विरमोली", "mob": "9758416349", "adh": "382072955265", "bags": 200}, {"name": "श्री विजय भट्ट", "vill": "कडथी", "mob": "8006966655", "adh": "690233534409", "bags": 20}, {"name": "श्री देव चन्द्र", "vill": "कडथी", "mob": "8006830348", "adh": "354047456772", "bags": 10}, {"name": "श्री सुनील", "vill": "खजरी", "mob": "963910387", "adh": "323779934870", "bags": 55}], "देवियोंखाल": [{"name": "श्री सतेन्द्र सिंह", "vill": "बम्सू", "mob": "", "adh": "599034074709", "bags": 200}, {"name": "श्री सतीश सिंह", "vill": "मैदनी डाबरी", "mob": "", "adh": "598235886377", "bags": 400}, {"name": "श्री मातबर सिंह", "vill": "सिनाला", "mob": "", "adh": "436003779095", "bags": 350}, {"name": "श्री सोहन सिंह", "vill": "मंजुली", "mob": "8126951768", "adh": "249819069882", "bags": 100}, {"name": "श्री रणवीर सिंह", "vill": "मंजुली", "mob": "", "adh": "536864824353", "bags": 150}], "दुगड्डा": [{"name": "श्रीमती मीनाक्षी देवी", "vill": "कोटा मौरान्यूं", "mob": "", "adh": "418332510608", "bags": 600}]};\n\n/* ---------------- data ---------------- */\nconst PRESET = { button:{rate:126, kg:10, hi:\'बटन\', en:\'Button\'}, oyster:{rate:90, kg:5, hi:\'ऑयस्टर\', en:\'Oyster\'} };\nlet mtype = \'button\';\nlet seq = 0;\nlet autoFilled = false;   /* तालिका सहेजी सूची से भरी गई है या हाथ से */\n\n/* ---------------- number to words ---------------- */\nconst HI=[\'\',\'एक\',\'दो\',\'तीन\',\'चार\',\'पाँच\',\'छह\',\'सात\',\'आठ\',\'नौ\',\'दस\',\'ग्यारह\',\'बारह\',\'तेरह\',\'चौदह\',\'पंद्रह\',\'सोलह\',\'सत्रह\',\'अठारह\',\'उन्नीस\',\'बीस\',\'इक्कीस\',\'बाईस\',\'तेईस\',\'चौबीस\',\'पच्चीस\',\'छब्बीस\',\'सत्ताईस\',\'अट्ठाईस\',\'उनतीस\',\'तीस\',\'इकतीस\',\'बत्तीस\',\'तैंतीस\',\'चौंतीस\',\'पैंतीस\',\'छत्तीस\',\'सैंतीस\',\'अड़तीस\',\'उनतालीस\',\'चालीस\',\'इकतालीस\',\'बयालीस\',\'तैंतालीस\',\'चौवालीस\',\'पैंतालीस\',\'छियालीस\',\'सैंतालीस\',\'अड़तालीस\',\'उनचास\',\'पचास\',\'इक्यावन\',\'बावन\',\'तिरेपन\',\'चौवन\',\'पचपन\',\'छप्पन\',\'सत्तावन\',\'अट्ठावन\',\'उनसठ\',\'साठ\',\'इकसठ\',\'बासठ\',\'तिरेसठ\',\'चौंसठ\',\'पैंसठ\',\'छियासठ\',\'सड़सठ\',\'अड़सठ\',\'उनहत्तर\',\'सत्तर\',\'इकहत्तर\',\'बहत्तर\',\'तिहत्तर\',\'चौहत्तर\',\'पचहत्तर\',\'छिहत्तर\',\'सतहत्तर\',\'अठहत्तर\',\'उन्यासी\',\'अस्सी\',\'इक्यासी\',\'बयासी\',\'तिरासी\',\'चौरासी\',\'पचासी\',\'छियासी\',\'सतासी\',\'अट्ठासी\',\'नवासी\',\'नब्बे\',\'इक्यानवे\',\'बानवे\',\'तिरानवे\',\'चौरानवे\',\'पंचानवे\',\'छियानवे\',\'सत्तानवे\',\'अट्ठानवे\',\'निन्यानवे\'];\nfunction hi3(n){let s=\'\';if(n>99){s+=HI[Math.floor(n/100)]+\' सौ \';n%=100;}if(n)s+=HI[n]+\' \';return s;}\nfunction hiWords(num){\n  num=Math.round(num*100)/100;\n  let r=Math.floor(num), p=Math.round((num-r)*100), out=\'\';\n  if(r===0)out=\'शून्य \';\n  const cr=Math.floor(r/10000000); r%=10000000;\n  const la=Math.floor(r/100000);  r%=100000;\n  const th=Math.floor(r/1000);    r%=1000;\n  if(cr)out+=hi3(cr)+\'करोड़ \';\n  if(la)out+=hi3(la)+\'लाख \';\n  if(th)out+=hi3(th)+\'हज़ार \';\n  if(r)out+=hi3(r);\n  out=out.trim()+\' रुपये\';\n  if(p)out+=\' \'+hi3(p).trim()+\' पैसे\';\n  return out+\' मात्र\';\n}\nconst E1=[\'\',\'One\',\'Two\',\'Three\',\'Four\',\'Five\',\'Six\',\'Seven\',\'Eight\',\'Nine\',\'Ten\',\'Eleven\',\'Twelve\',\'Thirteen\',\'Fourteen\',\'Fifteen\',\'Sixteen\',\'Seventeen\',\'Eighteen\',\'Nineteen\'];\nconst E10=[\'\',\'\',\'Twenty\',\'Thirty\',\'Forty\',\'Fifty\',\'Sixty\',\'Seventy\',\'Eighty\',\'Ninety\'];\nfunction en2(n){return n<20?E1[n]:E10[Math.floor(n/10)]+(n%10?\' \'+E1[n%10]:\'\');}\nfunction en3(n){let s=\'\';if(n>99){s+=E1[Math.floor(n/100)]+\' Hundred \';n%=100;}if(n)s+=en2(n);return s.trim();}\nfunction enWords(num){\n  num=Math.round(num*100)/100;\n  let r=Math.floor(num), p=Math.round((num-r)*100), out=[];\n  if(r===0)out.push(\'Zero\');\n  const cr=Math.floor(r/10000000); r%=10000000;\n  const la=Math.floor(r/100000);  r%=100000;\n  const th=Math.floor(r/1000);    r%=1000;\n  if(cr)out.push(en3(cr)+\' Crore\');\n  if(la)out.push(en3(la)+\' Lakh\');\n  if(th)out.push(en3(th)+\' Thousand\');\n  if(r)out.push(en3(r));\n  let s=\'Rupees \'+out.join(\' \');\n  if(p)s+=\' and \'+en2(p)+\' Paise\';\n  return s+\' Only\';\n}\nconst money = n => (n||0).toLocaleString(\'en-IN\',{minimumFractionDigits:2,maximumFractionDigits:2});\nconst val = id => document.getElementById(id).value.trim();\nfunction fmtDate(v){ if(!v) return \'\'; const d=v.split(\'-\'); return d[2]+\'/\'+d[1]+\'/\'+d[0]; }\n\n/* ---------------- entry table ---------------- */\n/* ---------------- वाहन संख्या (टैक्स इनवॉइस) ---------------- */\nlet vehSeq=0;\nfunction addVehicleRow(value){\n  vehSeq++;\n  const div=document.createElement(\'div\');\n  div.id=\'veh\'+vehSeq;\n  div.style.cssText=\'display:flex;align-items:center;gap:8px;margin-bottom:6px\';\n  div.innerHTML=`<label style="min-width:130px;font-size:12.5px;color:var(--ink-soft)">वाहन संख्या ${vehSeq} :</label>\n    <input type="text" class="v-num" placeholder="जैसे UP07 AB1234" style="text-transform:uppercase;flex:1;max-width:220px" oninput="this.value=this.value.toUpperCase();render()">\n    <button class="btn d" type="button" title="हटाएं" onclick="delVehicleRow(\'veh${vehSeq}\')">✕</button>`;\n  document.getElementById(\'vehicle_list\').appendChild(div);\n  if(value) div.querySelector(\'.v-num\').value=value;\n  render();\n}\nfunction delVehicleRow(id){\n  const el=document.getElementById(id); if(el) el.remove();\n  render();\n}\nfunction collectVehicles(){\n  return Array.from(document.querySelectorAll(\'#vehicle_list .v-num\'))\n    .map(el=>el.value.trim()).filter(v=>v);\n}\n\nfunction addRow(data){\n  seq++;\n  const tr=document.createElement(\'tr\');\n  tr.id=\'r\'+seq;\n  tr.innerHTML=`\n    <td class="rowno"></td>\n    <td><input type="text" class="c-name" placeholder="कृषक का नाम" oninput="render()"></td>\n    <td><input type="text" class="c-vill" placeholder="ग्राम" oninput="render()"></td>\n    <td><input type="text" class="c-mob" inputmode="numeric" maxlength="10" placeholder="10 अंक" oninput="render()"></td>\n    <td><input type="text" class="c-adh" inputmode="numeric" maxlength="14" placeholder="12 अंक" oninput="render()"></td>\n    <td><input type="number" class="c-bags" min="0" value="0" style="text-align:center;font-weight:700" oninput="render()"></td>\n    <td class="rowno"><button class="btn d" title="हटाएं" onclick="delRow(\'r${seq}\')">✕</button></td>`;\n  document.getElementById(\'entry_body\').appendChild(tr);\n  if(data){\n    tr.querySelector(\'.c-name\').value=data.name||\'\';\n    tr.querySelector(\'.c-vill\').value=data.vill||\'\';\n    tr.querySelector(\'.c-mob\').value=data.mob||\'\';\n    tr.querySelector(\'.c-adh\').value=data.adh||\'\';\n    tr.querySelector(\'.c-bags\').value=data.bags||0;\n  }\n  render();\n}\nfunction delRow(id){ const el=document.getElementById(id); if(el)el.remove(); render(); }\nfunction collect(){\n  const out=[];\n  document.querySelectorAll(\'#entry_body tr\').forEach((tr,i)=>{\n    tr.cells[0].innerText=i+1;\n    out.push({\n      name:tr.querySelector(\'.c-name\').value.trim(),\n      vill:tr.querySelector(\'.c-vill\').value.trim(),\n      mob:tr.querySelector(\'.c-mob\').value.trim(),\n      adh:tr.querySelector(\'.c-adh\').value.trim(),\n      bags:parseInt(tr.querySelector(\'.c-bags\').value)||0\n    });\n  });\n  return out;\n}\n/* एक ही कृषक (नाम + ग्राम) की दोहरी पंक्तियों को जोड़कर बैग योग कर देना —\n   मांग-पत्र, पावती-पत्र, इनवॉइस, रसीदें — सभी दस्तावेज़ों में एक ही संयुक्त पंक्ति दिखे */\nfunction mergeDuplicateFarmers(list){\n  const map=new Map(), order=[];\n  list.forEach(f=>{\n    const key=(f.name||\'\').trim().toLowerCase()+\'|\'+(f.vill||\'\').trim().toLowerCase();\n    if(!key.trim()){ order.push(f); return; }\n    if(map.has(key)){\n      const ex=map.get(key);\n      ex.bags += f.bags;\n      if(!ex.mob && f.mob) ex.mob=f.mob;\n      if(!ex.adh && f.adh) ex.adh=f.adh;\n    } else {\n      const copy=Object.assign({},f);\n      map.set(key, copy);\n      order.push(copy);\n    }\n  });\n  return order;\n}\n\nfunction onKendra(){\n  const k=val(\'i_kendra\'), list=DB[k], btn=document.getElementById(\'loadK\');\n  if(list){ btn.style.display=\'inline-block\'; btn.innerText=\'इस केन्द्र के \'+list.length+\' कृषक भरें\'; }\n  else btn.style.display=\'none\';\n  const filled=collect().filter(f=>f.name!==\'\' || f.bags>0).length;\n  if(list){\n    /* केन्द्र बदलते ही अपने-आप भर दें — बशर्ते मौजूदा तालिका ख़ाली हो\n       या पहले किसी और केन्द्र से ऑटो-लोड हुई हो (हाथ से टाइप किया डेटा न हो) */\n    if(filled===0 || autoFilled) loadKendra(false); else render();\n    return;\n  }\n  /* इस केन्द्र की सहेजी सूची नहीं है — तालिका ख़ाली दें */\n  if(filled>0 && (autoFilled || confirm(\'इस केन्द्र की सहेजी हुई सूची उपलब्ध नहीं है। तालिका ख़ाली कर दी जाए?\'))){\n    blankRows();\n  } else render();\n}\nfunction blankRows(){\n  document.getElementById(\'entry_body\').innerHTML=\'\';\n  for(let i=0;i<5;i++) addRow();\n  autoFilled=false;\n  render();\n}\nfunction loadKendra(ask){\n  const k=val(\'i_kendra\'), list=DB[k];\n  if(!list){ alert(\'इस केन्द्र की सहेजी हुई सूची उपलब्ध नहीं है।\'); return; }\n  const filled=collect().filter(f=>f.name!==\'\' || f.bags>0).length;\n  if(ask && filled>0 && !confirm(\'वर्तमान सूची हटाकर \'+k+\' के \'+list.length+\' कृषक भरे जाएँ?\')) return;\n  document.getElementById(\'entry_body\').innerHTML=\'\';\n  list.forEach(f=>addRow(f));\n  autoFilled=true;\n  render();\n}\nfunction clearRows(){\n  if(!confirm(\'पूरी सूची खाली कर दी जाए?\')) return;\n  blankRows();\n}\n\nfunction pickType(t){\n  mtype=t;\n  document.querySelectorAll(\'.type\').forEach(el=>el.dataset.on = el.dataset.type===t?\'1\':\'0\');\n  document.getElementById(\'t_\'+t).checked=true;\n  document.getElementById(\'i_rate\').value=PRESET[t].rate;\n  document.getElementById(\'i_kg\').value=PRESET[t].kg;\n  render();\n}\n\n/* ---------------- render all documents ---------------- */\nlet letterEdited=false, LETTER_HTML=\'\';\nfunction setTxt(id,txt){ const el=document.getElementById(id); if(el) el.innerText=txt; }\nfunction setHtm(id,htm){ const el=document.getElementById(id); if(el) el.innerHTML=htm; }\nfunction resetLetter(){\n  if(!confirm(\'मांग-पत्र का पाठ मूल रूप में वापस लाया जाए? आपके किए गए बदलाव हट जाएँगे।\')) return;\n  document.getElementById(\'d_letter\').innerHTML=LETTER_HTML;\n  letterEdited=false; render();\n}\n\nfunction render(){\n  const rows   = mergeDuplicateFarmers(collect().filter(f=>f.name!==\'\' || f.bags>0));\n  const rate   = parseFloat(val(\'i_rate\'))||0;\n  const kg     = parseFloat(val(\'i_kg\'))||0;\n  const subPct = parseFloat(val(\'i_sub\'))||0;\n  const farmPct= 100-subPct;\n  const gst    = parseFloat(val(\'i_gst\'))||0;\n  const T      = PRESET[mtype];\n\n  const perSub = rate*subPct/100, perFarm = rate*farmPct/100;\n  const totBags = rows.reduce((s,f)=>s+f.bags,0);\n  const totVal = totBags*rate, totFarm = totBags*perFarm, totSub = totBags*perSub;\n\n  document.getElementById(\'t_bags\').innerText=totBags;\n  document.getElementById(\'t_val\').innerText=money(totVal);\n  document.getElementById(\'t_share\').innerText=money(totFarm);\n  document.getElementById(\'t_sub\').innerText=money(totSub);\n  document.getElementById(\'warn\').style.display = totBags>0 ? \'none\':\'block\';\n\n  const dateTxt = fmtDate(val(\'i_date\'));\n  const supplyTxt = val(\'i_supply\');\n  const kendra  = val(\'i_kendra\');\n  const inv     = val(\'i_invoice\');\n\n  /* ---- 1. मांग-पत्र ---- */\n  if(!letterEdited){\n    setTxt(\'d_office\', val(\'i_office\')||\'उद्यान विशेषज्ञ कोटद्वार गढ़वाल (पौड़ी गढ़वाल)\');\n    setHtm(\'d_kendra\', kendra||\'&nbsp;\');\n    setTxt(\'d_year\', val(\'i_year\')||\'2026-27\');\n    [\'d_sub1\',\'d_sub2\',\'d_sub2b\',\'d_sub3\',\'d_sub4\'].forEach(id=>setTxt(id, subPct));\n    setTxt(\'d_farmpct\', 100-subPct);\n    const rateTxt = rate?money(rate).replace(/\\.00$/,\'\'):\'90\';\n    [\'d_rate\',\'d_rate2\',\'d_rate3\'].forEach(id=>setTxt(id, rateTxt));\n    const farmShare = rate*(100-subPct)/100;\n    setTxt(\'d_fs\', farmShare?(Number.isInteger(farmShare)?farmShare:farmShare.toFixed(2)):\'18\');\n    const subAmt = rate*subPct/100;\n    setTxt(\'d_subamt\', subAmt?(Number.isInteger(subAmt)?subAmt:subAmt.toFixed(2)):\'72\');\n    setHtm(\'d_date2\', dateTxt||\'&nbsp;\');\n    setTxt(\'d_typeline\', T.hi+\' मशरूम (\'+T.en+\' Mushroom)\');\n    setTxt(\'d_type2\', T.hi);\n  }\n  document.getElementById(\'d_type3\').innerText = T.hi;\n  document.getElementById(\'d_tick_o\').innerHTML = mtype===\'oyster\'?\'✓\':\'&nbsp;\';\n  document.getElementById(\'d_tick_b\').innerHTML = mtype===\'button\'?\'✓\':\'&nbsp;\';\n\n  const dBody=document.getElementById(\'d_rows\'); dBody.innerHTML=\'\';\n  const lines=rows.length;\n  for(let i=0;i<lines;i++){\n    const f=rows[i];\n    dBody.insertAdjacentHTML(\'beforeend\',\n      `<tr style="height:22px">\n        <td class="c">${i+1}</td>\n        <td>${f?f.name:\'\'}</td><td>${f?f.vill:\'\'}</td>\n        <td class="c">${f?f.mob:\'\'}</td><td class="c">${f?f.adh:\'\'}</td>\n        <td class="c"><b>${f&&f.bags?f.bags:\'\'}</b></td><td></td>\n      </tr>`);\n  }\n  document.getElementById(\'d_total\').innerText=totBags;\n\n  /* ग्राम-वार समूहन को प्राथमिकता देते हुए ₹50,000 सीमा में बिल-समूह बाँटना */\n  function computeBillGroups(farmers, unitRate, cap){\n    cap = cap||50000;\n    const villageOrder=[], villageMap={};\n    farmers.forEach(f=>{\n      const v=f.vill||\'\';\n      if(!villageMap[v]){ villageMap[v]=[]; villageOrder.push(v); }\n      villageMap[v].push(f);\n    });\n    const bins=[]; let cur=null;\n    function newBin(){ cur={farmers:[],bags:0,value:0}; bins.push(cur); }\n    newBin();\n    villageOrder.forEach(v=>{\n      const group=villageMap[v];\n      const groupBags=group.reduce((s,f)=>s+f.bags,0);\n      const groupVal=groupBags*unitRate;\n      if(groupVal<=cap){\n        if(cur.farmers.length>0 && cur.value+groupVal>cap) newBin();\n        group.forEach(f=>{ cur.farmers.push(f); cur.bags+=f.bags; cur.value+=f.bags*unitRate; });\n      } else {\n        group.forEach(f=>{\n          const fVal=f.bags*unitRate;\n          if(cur.farmers.length>0 && cur.value+fVal>cap) newBin();\n          cur.farmers.push(f); cur.bags+=f.bags; cur.value+=fVal;\n        });\n      }\n    });\n    if(cur.farmers.length===0) bins.pop();\n    return bins;\n  }\n\n  /* केन्द्र के सभी कृषक हमेशा एक ही संयुक्त बिल में — कोई राशि-सीमा में विभाजन नहीं */\n  const farmersForBill = rows.filter(f=>f.bags>0);\n  const bins = [{farmers:farmersForBill, bags:totBags, value:totVal}];\n  function billNoFor(idx){ return inv; }\n\n\n  /* ---- 2. समेकित पावती-पत्र (पत्र-शैली, बिल-वार) ---- */\n  function buildVoucherHTML(bin, billNo){\n    const bags=bin.bags, val_=bin.value;\n    const farmShare=bags*perFarm, subAmt=bags*perSub;\n    const rowsHTML = bin.farmers.map((f,i)=>`<tr style="height:21px">\n        <td class="c">${i+1}</td><td>${f.name}</td><td>${f.vill}</td>\n        <td class="c"><b>${f.bags}</b></td>\n        <td class="r">₹ ${money(f.bags*perFarm)}</td>\n        <td class="r">₹ ${money(f.bags*perSub)}</td><td></td>\n      </tr>`).join(\'\');\n    return `<div class="sheet vch-sheet">\n  <h2 class="doc" style="margin:0 0 14px">समेकित पावती-पत्र (वितरण-सह-प्राप्ति)</h2>\n  <p style="margin:0">सेवा में,<br>\n  &nbsp;&nbsp;&nbsp;उद्यान विशेषज्ञ कोटद्वार गढ़वाल (पौड़ी गढ़वाल),<br>\n  &nbsp;&nbsp;द्वारा: प्रभारी, उद्यान सचल दल केन्द्र, <span class="dline dl-long">${kendra||\'&nbsp;\'}</span></p>\n  <p style="margin:10px 0 6px"><b>विषय: मैसर्स बडोला मशरूम फार्म, काशीपुर के बिल संख्या ${billNo||\'—\'} दिनांक ${dateTxt||\'—\'} पर देय राजसहायता के भुगतान हेतु प्रस्तुतीकरण।</b></p>\n  <p style="margin:0;text-align:justify">महोदय,<br>\n  &nbsp;&nbsp;&nbsp;&nbsp;निवेदन है कि उद्यान सचल दल केन्द्र, ${kendra||\'—\'} के अन्तर्गत निम्नानुसार कृषकों द्वारा मैसर्स बडोला मशरूम फार्म, काशीपुर, ऊधम सिंह नगर से जिला योजना वर्ष ${val(\'i_year\')||\'2026-27\'} के अन्तर्गत ${subPct}% अनुदान पर विभागीय स्वीकृत दर ₹${money(rate)} प्रति बैग के अनुसार कुल <b>${bags}</b> बैग ${T.hi} मशरूम बिजाई युक्त कम्पोस्ट क्रय किए गए हैं। उक्त कम्पोस्ट बैग संबंधित कृषकों को सही एवं पूर्ण एवं उच्च गुणवत्ता अवस्था में प्राप्त हो चुके हैं। कृषकों द्वारा निर्धारित ${farmPct}% कृषक अंश ₹${money(perFarm)} प्रति बैग के अनुसार कुल ₹${money(farmShare)} की धनराशि उक्त फर्म को अदा कर दी गई है।</p>\n  <p style="margin:8px 0 0;text-align:justify">फर्म द्वारा प्रस्तुत बिल संख्या ${billNo||\'—\'}, जिसकी कुल देयक राशि ₹${money(val_)} है, भुगतान हेतु प्रस्तुत किया जा रहा है। उक्त बिल के सापेक्ष कृषकों द्वारा ₹${money(farmShare)} का कृषक अंश फर्म को जमा किए जाने के उपरान्त शेष ${subPct}% राजसहायता (अनुदान) की धनराशि ₹${money(subAmt)} (${subAmt>0?hiWords(subAmt):\'—\'}) देय है।</p>\n  <p style="margin:8px 0 0;text-align:justify">अतः अनुरोध है कि हमारे आवेदन एवं प्राप्त स्वीकृति के क्रम में उक्त देयक संख्या ${billNo||\'—\'} दिनांक ${dateTxt||\'—\'} की देय राजसहायता की धनराशि ₹${money(subAmt)} सीधे आपूर्तिकर्ता फर्म मैसर्स बडोला मशरूम फार्म, काशीपुर, ऊधम सिंह नगर को e-Payment के माध्यम से भुगतान करने की कृपा करें।</p>\n  <p style="margin:8px 0 0;text-align:justify">उक्त आपूर्तिकर्ता फर्म शेष देय धनराशि का भुगतान विभाग में बजट उपलब्ध होने पर किए जाने हेतु सहमत है।</p>\n  <p style="margin:12px 0 6px"><b>लाभार्थी कृषकों का विवरण एवं हस्ताक्षर निम्नानुसार हैं —</b></p>\n  <table class="doc roster">\n    <thead><tr>\n      <th style="width:30px">क्र०सं०</th><th style="width:190px">किसान का पूरा नाम</th><th style="width:95px">ग्राम / पंचायत</th>\n      <th style="width:44px">बैग</th>\n      <th style="width:88px">${farmPct}% किसान अंश</th>\n      <th style="width:92px">${subPct}% राजसहायता</th>\n      <th style="width:130px">हस्ताक्षर</th>\n    </tr></thead>\n    <tbody>${rowsHTML}</tbody>\n    <tfoot><tr>\n      <td colspan="3" class="r"><b>कुल</b></td>\n      <td class="c"><b>${bags}</b></td>\n      <td class="r"><b>₹ ${money(farmShare)}</b></td>\n      <td class="r"><b>₹ ${money(subAmt)}</b></td><td></td>\n    </tr></tfoot>\n  </table>\n</div>`;\n  }\n\n  /* ---- 2ख. विक्रेता का प्रमाण-पत्र (बिल-वार) ---- */\n  function buildVendorHTML(bin, billNo){\n    const bags=bin.bags, val_=bin.value, farmShare=bags*perFarm, subAmt=bags*perSub;\n    return `<div class="sheet vendor-sheet" style="font-family:\'Courier Prime\',\'Martel\',monospace">\n  <div style="display:flex;justify-content:space-between;align-items:flex-start;border-bottom:2px solid #000;padding-bottom:10px;margin-bottom:16px">\n    <div>\n      <div style="font-weight:800;font-size:21px;letter-spacing:.3px">BADOLA MUSHROOMS FARM</div>\n      <div style="font-weight:700;font-size:12.5px">(COMPOST UNIT)</div>\n      <div style="font-size:11px;margin-top:3px">H.O.-Dhanori Patti, D.P.S. Road, Kashipur (U.S. Nagar) U.K.</div>\n      <div style="font-size:11px">Compost Unit-Vill. Pratappur, Near Pickle Factory, Kashipur (U.S. Nagar)</div>\n      <div style="font-size:11px;margin-top:3px">GSTIN No.: 05CHXPS3134D1Z5 &nbsp;|&nbsp; Mob.: 9899935600, 6398264916</div>\n    </div>\n    <div style="text-align:right;font-size:11px;white-space:nowrap;padding-top:2px">\n      <div style="text-decoration:underline;font-weight:700;margin-bottom:4px">CERTIFICATE</div>\n      Ref. Bill No. : ${billNo||\'—\'}<br>\n      Date : ${dateTxt||\'—\'}\n    </div>\n  </div>\n  <div style="text-align:center;font-weight:700;font-size:14px;text-decoration:underline;margin-bottom:14px">विक्रेता का प्रमाण-पत्र (Supplier\'s Certificate)</div>\n  <p style="margin:0;text-align:justify;font-size:12.5px;line-height:1.7">मैं, मैसर्स बडोला मशरूम फार्म, काशीपुर, ऊधम सिंह नगर, प्रमाणित करता हूँ कि उद्यान सचल दल केन्द्र, <b>${kendra||\'—\'}</b> के अंतर्गत बिल संख्या <b>${billNo||\'—\'}</b> दिनांक <b>${dateTxt||\'—\'}</b> के अनुसार उपरोक्त कृषकों को कुल <b>${bags}</b> बैग ${T.hi} मशरूम बिजाई युक्त कम्पोस्ट सही एवं पूर्ण अवस्था में वितरित कर दिए हैं, जो कृषकों को दिनांक <b>${supplyTxt||\'—\'}</b> (Date of Supply) को प्राप्त हो चुके हैं, जिनका कुल मूल्य रुपये <b>${money(val_)}</b> है, तथा कृषकों से निर्धारित कृषक अंश (${farmPct}%) की धनराशि रुपये <b>${money(farmShare)}</b> प्राप्त कर ली गई है।</p>\n  <p style="margin:12px 0 0;text-align:justify;font-size:12.5px;line-height:1.7"><b>अतः शेष ${subPct}% राजसहायता (अनुदान) की धनराशि रुपये ${money(subAmt)} (${subAmt>0?hiWords(subAmt):\'—\'}) का भुगतान मुझे करने की कृपा कीजिएगा।</b></p>\n  <div style="margin-top:60px;text-align:right;font-size:12px">\n    <div>For BADOLA MUSHROOMS FARM</div>\n    <div style="margin-top:34px;border-top:1px solid #000;padding-top:3px;display:inline-block;min-width:220px">Authorised Signatory / विक्रेता के हस्ताक्षर व मुहर</div>\n  </div>\n</div>`;\n  }\n\n  /* ---- 2क. सत्यापन आख्या (बिल-वार) ---- */\n  function buildSatyapanHTML(bin, billNo){\n    const bags=bin.bags, val_=bin.value, farmShare=bags*perFarm, subAmt=bags*perSub;\n    return `<div class="sheet saty-sheet" style="font-family:\'Tiro Devanagari Hindi\',\'Martel\',serif">\n  <div style="text-align:center;border-bottom:1.6px solid #000;padding-bottom:8px;margin-bottom:16px">\n    <div style="font-weight:700;font-size:14px">कार्यालय प्रभारी, उद्यान सचल दल केन्द्र, ${kendra||\'—\'}</div>\n    <div style="font-size:11.5px">जनपद पौड़ी गढ़वाल, उद्यान विभाग, उत्तराखण्ड</div>\n    <h2 class="doc" style="margin:10px 0 0;font-size:17px;text-decoration:underline">सत्यापन आख्या</h2>\n  </div>\n  <p style="margin:0;text-align:right;font-size:12px">सन्दर्भ : बिल संख्या <b>${billNo||\'—\'}</b> · दिनांक <b>${dateTxt||\'—\'}</b></p>\n  <p style="margin:10px 0 0;text-align:justify">प्रमाणित किया जाता है कि उपरोक्त देयक (बिल) संख्या <b>${billNo||\'—\'}</b> दिनांक <b>${dateTxt||\'—\'}</b>, मैसर्स बडोला मशरूम फार्म (कम्पोस्ट यूनिट), काशीपुर, ऊधम सिंह नगर से सम्बन्धित कृषकों द्वारा क्रय किए गए बिजाई युक्त ${T.hi} मशरूम कम्पोस्ट बैग का मेरे द्वारा सत्यापन कर लिया गया है। वितरित बैगों की गुणवत्ता, मात्रा एवं विशिष्टताओं का भौतिक सत्यापन कर लिया गया है तथा बैग रोगमुक्त एवं बिजाई युक्त पाए गए हैं। उक्त बिल के अनुसार <b>${bags}</b> बिजाई युक्त ${T.hi} मशरूम कम्पोस्ट बैग सम्बन्धित कृषकों को दिनांक <b>${supplyTxt||\'—\'}</b> (Date of Supply) को प्राप्त हो चुके हैं तथा कृषक अंश (${farmPct}%) की धनराशि रुपये <b>${money(farmShare)}</b> आपूर्तिकर्ता फर्म द्वारा कृषकों से प्राप्त कर ली गई है।</p>\n  <p style="margin:10px 0 0;text-align:justify">अतः बिल की कुल धनराशि रुपये <b>${money(val_)}</b> में से राजसहायता (अनुदान) की धनराशि रुपये <b>${money(subAmt)}</b> (${subAmt>0?hiWords(subAmt):\'—\'}) जो कि बिल के कुल योग का ${subPct} प्रतिशत है, <b>उक्त आपूर्तिकर्ता फर्म को भुगतान करने की कृपा कीजियेगा।</b></p>\n  <p style="margin:16px 0 0;text-align:justify"><b>संलग्न है:</b> समेकित पावती-पत्र, BADOLA MUSHROOMS FARM (COMPOST UNIT) का इनवॉइस।</p>\n  <div style="display:flex;justify-content:flex-end;margin-top:60px">\n    <div class="center">\n      प्रभारी,<br>\n      उद्यान सचल दल केन्द्र, <span class="dline">${kendra||\'&nbsp;\'}</span>\n    </div>\n  </div>\n</div>`;\n  }\n\n  /* ---- 3. टैक्स इनवॉइस (बिल-वार) ---- */\n  function invRowHTML(bags, rate, val_){\n    return `<tr style="height:34px">\n      <td class="c">1</td>\n      <td>Spawned Compost Bag — ${T.en} Mushroom (${kg} kg / bag)<br>\n          <span style="font-size:11px">बिजाई युक्त ${T.hi} मशरूम कम्पोस्ट बैग</span><br>\n          <span style="font-size:11px">Date of Supply : ${supplyTxt||\'—\'}</span></td>\n      <td class="c">${bags||\'\'}</td>\n      <td class="r">${bags?money(rate):\'\'}</td>\n      <td class="r">${bags?money(val_):\'\'}</td>\n    </tr>`;\n  }\n  function officerStampHTML(subAmt){\n    const BLUE = \'#12279e\';\n    return `<div style="padding:8px 12px;width:100%;max-width:230px;text-align:center;page-break-inside:avoid;break-inside:avoid;color:${BLUE};transform:rotate(1.2deg);opacity:0.92">\n      <div style="font-weight:700;line-height:1.35;font-size:8.5px">\n        कृषकों के अनुरोध पर देयक की राजसहायता की धनराशि रुपये ${money(subAmt)} फर्म को भुगतान हेतु संस्तुति सहित अग्रसारित है।\n      </div>\n      <div style="margin-top:16px;border-top:1px solid ${BLUE};padding-top:4px;font-size:9px;font-weight:700;line-height:1.4">\n        प्रभारी,<br>उद्यान सचल दल केन्द्र, ${kendra||\'&nbsp;\'}\n      </div>\n    </div>`;\n  }\n  function certBoxHTML(subAmt, farmersList){\n    const n = farmersList.length;\n    const BLUE = \'#12279e\';\n    const signItems = farmersList.map((f,i)=>`<div style="display:flex;align-items:center;gap:5px">\n        <span style="border:1.3px solid ${BLUE};border-radius:50%;width:16px;height:16px;min-width:16px;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:9px;color:${BLUE}">${i+1}</span>\n        <span style="flex:1;border-bottom:1px solid ${BLUE};font-size:8.5px;padding-bottom:1px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;color:${BLUE}">${f.name||\'&nbsp;\'}</span>\n      </div>`).join(\'\');\n    return `<div style="padding:8px 12px;width:100%;max-width:340px;text-align:center;page-break-inside:avoid;break-inside:avoid;color:${BLUE};transform:rotate(-1.5deg);opacity:0.92">\n      <div style="font-weight:700;line-height:1.35;font-size:9px">\n        प्रमाणित किया जाता है कि उक्त क्रय हमारे द्वारा किया गया है। अतः उक्त बिल पर देय राजसहायता की धनराशि ₹${money(subAmt)} फर्म को हमारे अनुरोध पर प्रदान/जारी करने की कृपा करें।\n      </div>\n      <div style="display:flex;align-items:center;margin:7px 0 6px">\n        <div style="flex:1;border-bottom:1px solid ${BLUE}"></div>\n        <div style="border:1.2px solid ${BLUE};border-radius:10px;padding:1px 10px;font-weight:700;white-space:nowrap;margin:0 5px;font-size:9px">कृषक हस्ताक्षर</div>\n        <div style="flex:1;border-bottom:1px solid ${BLUE}"></div>\n      </div>\n      <div style="display:grid;grid-template-columns:1fr 1fr;gap:5px 12px;text-align:left">\n        ${signItems || \'<div></div>\'}\n      </div>\n    </div>`;\n  }\n  function buildInvoiceHTML(billNo, buyerName, buyerAddr, bags, val_, subAmt, farmersList, vehicles){\n    vehicles = vehicles||[];\n    const half=gst/2, cg=val_*half/100, sg=val_*half/100, gt_=val_+cg+sg;\n    const shortForm = farmersList.length<=12;\n    return `<div class="sheet inv-sheet${shortForm?\' short-inv\':\'\'}">\n  <div class="inv-head">\n    <div class="inv-top">\n      <span>GSTIN No.: 05CHXPS3134D1Z5</span>\n      <span style="text-decoration:underline">TAX INVOICE</span>\n      <span>Mob.: 9899935600, 6398264916</span>\n    </div>\n    <div class="inv-name">\n      <h1>BADOLA MUSHROOMS FARM</h1>\n      <div class="u">(COMPOST UNIT)</div>\n      <div class="a">H.O.-Dhanori Patti, D.P.S. Road, Kashipur (U.S. Nagar) U.K.</div>\n      <div class="a">Compost Unit-Vill. Pratappur, Near Pickle Factory, Kashipur (U.S. Nagar)</div>\n    </div>\n    <div class="inv-bill">\n      <div>\n        <div style="font-weight:700;text-decoration:underline;margin-bottom:3px">Billing Details</div>\n        <div>M/s : <span class="dline dl-long">${buyerName||\'&nbsp;\'}</span></div>\n        <div>Address : <span class="dline dl-long">${buyerAddr||\'&nbsp;\'}</span></div>\n        <div>Way No. : <span class="dline dl-long">&nbsp;</span></div>\n      </div>\n      <div>\n        <div>Bill Date (बिल दिनांक) : <span class="dline">${dateTxt||\'&nbsp;\'}</span></div>\n        <div style="margin-top:6px">Invoice No. : <span class="dline">${billNo||\'&nbsp;\'}</span></div>\n        ${vehicles.length?`<div style="margin-top:6px;font-weight:700;text-decoration:underline;font-size:11.5px">वाहन संख्या (Vehicle No.)</div>`+vehicles.map((v,i)=>`<div style="margin-top:2px;font-size:12px">वाहन संख्या ${i+1} : <span class="dline" style="font-weight:700">${v}</span></div>`).join(\'\'):\'\'}\n      </div>\n    </div>\n    <div class="inv-items">\n      <table class="doc inv-tbl">\n        <colgroup><col style="width:38px"><col><col style="width:78px"><col style="width:95px"><col style="width:115px"></colgroup>\n        <thead><tr>\n          <th style="border-left:0">Sr.<br>No.</th><th>Description of Goods</th>\n          <th>Qty / Unit</th><th>Rate / Unit</th><th style="border-right:0">Taxable Value</th>\n        </tr></thead>\n        <tbody>${invRowHTML(bags, rate, val_)}</tbody>\n      </table>\n    </div>\n    <div class="inv-spacer" style="gap:14px">${document.getElementById(\'i_showstamp\').checked ? certBoxHTML(subAmt, farmersList)+officerStampHTML(subAmt) : \'\'}</div>\n    <div class="inv-foot">\n      <table class="doc inv-tbl">\n        <colgroup><col style="width:38px"><col><col style="width:78px"><col style="width:95px"><col style="width:115px"></colgroup>\n        <tbody>\n          <tr>\n            <td colspan="2" rowspan="6" class="bank" style="border-left:0">\n              <div style="font-weight:700;text-decoration:underline">Bank Detail :</div>\n              <div>Bank Name : The Nainital Bank Ltd.</div>\n              <div>Bank A/c No. : 1586000000000002</div>\n              <div>Branch : Pratappur (Kashipur)</div>\n              <div>Bank IFSC : NTBL0KAS158</div>\n              <div style="margin-top:8px">Total Amount Value (in figures) : <b>₹ ${money(gt_)}</b></div>\n              <div>Total Amount Value (in words) : <b>${gt_>0?enWords(gt_):\'—\'}</b></div>\n              <div class="terms">\n                <b>Terms and Conditions :</b><br>\n                1. All disputes are subject to Kashipur Jurisdiction.<br>\n                2. Interest @24% will be charged if the payment is not made on realisation.<br>\n                3. Goods once sold are neither refundable nor exchangeable.\n              </div>\n            </td>\n            <td colspan="2">Total</td><td class="r" style="border-right:0">${money(val_)}</td>\n          </tr>\n          <tr><td colspan="2">C.G.S.T. @ ${half}%</td><td class="r" style="border-right:0">${money(cg)}</td></tr>\n          <tr><td colspan="2">S.G.S.T. @ ${half}%</td><td class="r" style="border-right:0">${money(sg)}</td></tr>\n          <tr><td colspan="2">I.G.S.T. @ —</td><td class="r" style="border-right:0">0.00</td></tr>\n          <tr class="gt"><td colspan="2"><b>G. Total</b></td><td class="r" style="border-right:0"><b>${money(gt_)}</b></td></tr>\n          <tr><td colspan="3" class="sign" style="border-right:0">\n            <b>For BADOLA MUSHROOMS FARM</b>\n            <div style="margin-top:44px">Authorised Signatory</div>\n          </td></tr>\n        </tbody>\n      </table>\n    </div>\n  </div>\n</div>`;\n  }\n\n  /* ---- 4. नकद रसीदें (बिल-वार, क्रमांक पूरे केन्द्र में लगातार) ---- */\n  const startNo=parseInt(val(\'i_rcptno\'))||0;\n  const mode=val(\'i_rmode\')||\'one\';\n  let n=0;\n  function slip(name,place,bags,amt,foot){\n    const no = startNo ? (startNo+n) : \'\';\n    n++;\n    return `<div class="sheet rcpt">\n      <div class="rcpt-card">\n        <div style="display:flex;justify-content:space-between;font-size:11px;font-weight:700">\n          <span>GSTIN : 05CHXPS3134D1Z5</span>\n          <span class="ttl">नकद प्राप्ति रसीद</span>\n          <span style="text-align:right">M. : 9899935600<br>6398264916</span>\n        </div>\n        <h1>बडोला मशरूम फार्म (कम्पोस्ट यूनिट)</h1>\n        <div class="center" style="font-weight:700;font-size:13px">ग्राम प्रतापपुर – काशीपुर (उत्तराखण्ड)</div>\n        <div style="display:flex;justify-content:space-between;margin-top:10px;font-size:14px">\n          <div>नं० <b>${no||\'________\'}</b></div>\n          <div>दिनांक <b>${dateTxt||\'____________\'}</b></div>\n        </div>\n        <div style="margin-top:10px;font-size:${(name||\'\').length>90?12.5:14}px;line-height:${(name||\'\').length>60?1.65:2.1};text-align:justify">\n          नाम <b>${name||\'____________________\'}</b><br>\n          ग्राम <b>${place||\'________________\'}</b> से <b>${bags} बैग (${bags*kg} किग्रा)</b> ${T.hi} मशरूम<br>\n          कम्पोस्ट का भुगतान रुपया <b>${money(amt)}</b> (${hiWords(amt)})<br>\n          प्राप्त किया ।\n        </div>\n        <div style="margin-top:8px;font-size:11.5px">${foot}</div>\n        <div style="display:flex;justify-content:flex-end;align-items:flex-end;margin-top:26px;font-size:12px">\n          <div class="center">\n            <b>For BADOLA MUSHROOMS FARM</b>\n            <div style="margin-top:22px">हस्ताक्षर (Authorised Signatory)</div>\n          </div>\n        </div>\n      </div>\n    </div>`;\n  }\n\n  /* ---- सभी 5 दस्तावेज़ हर बिल-समूह के लिए बनाना ---- */\n  const voucherZone=document.getElementById(\'voucher_zone\'); voucherZone.innerHTML=\'\';\n  const vendorZone=document.getElementById(\'vendor_zone\'); vendorZone.innerHTML=\'\';\n  const satyapanZone=document.getElementById(\'satyapan_zone\'); satyapanZone.innerHTML=\'\';\n  const invZone=document.getElementById(\'invoice_zone\'); invZone.innerHTML=\'\';\n  const rcptZone=document.getElementById(\'receipt_zone\'); rcptZone.innerHTML=\'\';\n\n  bins.forEach((bin,idx)=>{\n    const billNo = billNoFor(idx);\n    const buyerName = [...new Set(bin.farmers.map(f=>f.name))].join(\', \');\n    const buyerAddr = [...new Set(bin.farmers.map(f=>f.vill).filter(Boolean))].join(\', \');\n\n    voucherZone.insertAdjacentHTML(\'beforeend\', buildVoucherHTML(bin, billNo));\n    vendorZone.insertAdjacentHTML(\'beforeend\', buildVendorHTML(bin, billNo));\n    satyapanZone.insertAdjacentHTML(\'beforeend\', buildSatyapanHTML(bin, billNo));\n    invZone.insertAdjacentHTML(\'beforeend\', buildInvoiceHTML(billNo, buyerName, buyerAddr, bin.bags, bin.value, bin.bags*perSub, bin.farmers, collectVehicles()));\n\n    if(mode===\'one\'||mode===\'both\'){\n      if(bin.bags>0){\n        rcptZone.insertAdjacentHTML(\'beforeend\',\n          slip(buyerName, buyerAddr||kendra||\'सचल दल केन्द्र\', bin.bags, bin.bags*perFarm,\n               \'कुल \'+bin.farmers.length+\' कृषक · बिल सं० \'+(billNo||\'—\')+\' · कुल बिल ₹\'+money(bin.value)+\' का कृषक अंश \'+farmPct+\'%\'));\n      }\n    }\n    if(mode===\'each\'||mode===\'both\'){\n      bin.farmers.forEach(f=>rcptZone.insertAdjacentHTML(\'beforeend\',\n        slip(f.name, f.vill, f.bags, f.bags*perFarm,\n             \'कृषक अंश \'+farmPct+\'% · दर ₹\'+money(perFarm)+\' प्रति बैग\')));\n    }\n  });\n\n  scheduleDraft();\n}\n\n/* ---------------- print ---------------- */\nfunction printDoc(which){\n  document.body.setAttribute(\'data-print\', which);\n  const selMap = {demand:\'#doc-demand\', voucher:\'.vch-sheet\', satyapan:\'.saty-sheet\',\n                   vendor:\'.vendor-sheet\', invoice:\'.inv-sheet\', receipts:\'.rcpt\'};\n  const sel = selMap[which] || \'.sheet\';\n  const visible = Array.from(document.querySelectorAll(sel));\n  document.querySelectorAll(\'.sheet\').forEach(el=>{ el.style.pageBreakAfter=\'\'; });\n  if(visible.length) visible[visible.length-1].style.pageBreakAfter=\'auto\';\n  window.print();\n}\nwindow.onafterprint = () => {\n  document.body.removeAttribute(\'data-print\');\n  document.querySelectorAll(\'.sheet\').forEach(el=>{ el.style.pageBreakAfter=\'\'; });\n};\n\n/* ---------------- snapshot / apply ---------------- */\nconst FIELDS=[\'i_rate\',\'i_kg\',\'i_sub\',\'i_gst\',\'i_kendra\',\'i_office\',\'i_year\',\'i_date\',\'i_supply\',\n              \'i_invoice\',\'i_rcptno\',\'i_billto\',\'i_billaddr\',\'i_rmode\'];\nfunction snapshot(){\n  const d={mtype, fields:{}, farmers:collect(), vehicles:collectVehicles(),\n           letter: letterEdited ? document.getElementById(\'d_letter\').innerHTML : \'\'};\n  FIELDS.forEach(id=>d.fields[id]=document.getElementById(id).value);\n  return d;\n}\n/* ---------------- स्वतः क्रमांकन (बिल संख्या / रसीद संख्या) ---------------- */\nconst LS_AUTO=\'mushroom_auto_no_v1\';\nlet MEM_AUTO=null;\nfunction getAuto(){\n  if(HAS_LS){ try{ return JSON.parse(localStorage.getItem(LS_AUTO)||\'{}\'); }catch(e){ return {}; } }\n  return MEM_AUTO||(MEM_AUTO={});\n}\nfunction putAuto(a){\n  if(HAS_LS){ try{ localStorage.setItem(LS_AUTO, JSON.stringify(a)); }catch(e){} } else MEM_AUTO=a;\n}\nfunction toggleAuto(kind){\n  const fieldId = kind===\'inv\'?\'i_invoice\':\'i_rcptno\';\n  const chk = document.getElementById(\'auto_\'+kind+\'_chk\');\n  const field = document.getElementById(fieldId);\n  const a = getAuto();\n  if(chk.checked){\n    const startVal = parseInt(field.value);\n    if(!startVal){ alert(\'पहले शुरुआती नंबर भरें, फिर "स्वतः क्रमांक" चालू करें।\'); chk.checked=false; return; }\n    a[kind]={on:true, next:startVal};\n  } else {\n    a[kind]={on:false, next:(a[kind]?a[kind].next:null)};\n  }\n  putAuto(a);\n  applyAutoStyling();\n}\nfunction applyAutoStyling(){\n  const a=getAuto();\n  [\'inv\',\'rcpt\'].forEach(k=>{\n    const fieldId=k===\'inv\'?\'i_invoice\':\'i_rcptno\';\n    const chk=document.getElementById(\'auto_\'+k+\'_chk\'), field=document.getElementById(fieldId);\n    const on=!!(a[k]&&a[k].on);\n    chk.checked=on; field.readOnly=on; field.style.background=on?\'#F4F2EA\':\'\';\n  });\n}\nfunction applyAutoValues(){\n  const a=getAuto();\n  if(a.inv&&a.inv.on&&a.inv.next!=null) document.getElementById(\'i_invoice\').value=a.inv.next;\n  if(a.rcpt&&a.rcpt.on&&a.rcpt.next!=null) document.getElementById(\'i_rcptno\').value=a.rcpt.next;\n}\nfunction receiptsUsed(d){\n  const rowsF=(d.farmers||[]).filter(f=>parseInt(f.bags)>0);\n  const mode=(d.fields&&d.fields.i_rmode)||\'one\';\n  let n=0;\n  if(mode===\'one\'||mode===\'both\') n+=1;\n  if(mode===\'each\'||mode===\'both\') n+=rowsF.length;\n  return n||1;\n}\nfunction bumpAutoCounters(d){\n  const a=getAuto();\n  let changed=false;\n  if(a.inv&&a.inv.on){\n    a.inv.next=(parseInt(d.fields.i_invoice)||a.inv.next||0)+1;\n    changed=true;\n  }\n  if(a.rcpt&&a.rcpt.on){\n    const base=parseInt(d.fields.i_rcptno)||a.rcpt.next||0;\n    a.rcpt.next=base+receiptsUsed(d);\n    changed=true;\n  }\n  if(changed) putAuto(a);\n}\n\nfunction applyData(d){\n  Object.keys(d.fields||{}).forEach(id=>{const el=document.getElementById(id); if(el)el.value=d.fields[id];});\n  if(d.letter){ document.getElementById(\'d_letter\').innerHTML=d.letter; letterEdited=true; }\n  else { document.getElementById(\'d_letter\').innerHTML=LETTER_HTML; letterEdited=false; }\n  document.getElementById(\'entry_body\').innerHTML=\'\';\n  (d.farmers||[]).forEach(f=>addRow(f));\n  if(!(d.farmers||[]).length) for(let i=0;i<3;i++) addRow();\n  document.getElementById(\'vehicle_list\').innerHTML=\'\';\n  const vList=d.vehicles||[];\n  if(vList.length) vList.forEach(v=>addVehicleRow(v)); else addVehicleRow();\n  pickTypeQuiet(d.mtype||\'button\');\n  applyAutoStyling();\n  render();\n}\nfunction pickTypeQuiet(t){\n  mtype=t;\n  document.querySelectorAll(\'.type\').forEach(el=>el.dataset.on = el.dataset.type===t?\'1\':\'0\');\n  document.getElementById(\'t_\'+t).checked=true;\n}\n\n/* ---------------- file save / load ---------------- */\nfunction saveJSON(){\n  const blob=new Blob([JSON.stringify(snapshot(),null,2)],{type:\'application/json\'});\n  const a=document.createElement(\'a\');\n  a.href=URL.createObjectURL(blob);\n  a.download=\'mushroom-\'+(val(\'i_kendra\')||\'data\')+\'-\'+(val(\'i_date\')||\'\')+\'.json\';\n  a.click(); URL.revokeObjectURL(a.href);\n}\nfunction loadJSON(input){\n  const file=input.files[0]; if(!file) return;\n  const fr=new FileReader();\n  fr.onload=e=>{\n    try{\n      const d=JSON.parse(e.target.result);\n      if(Array.isArray(d)){ restoreBackup(d); return; }\n      curRec=null; applyData(d); renderRecords();\n    }catch(err){ alert(\'फ़ाइल पढ़ी नहीं जा सकी — कृपया इसी प्रणाली से सहेजी गई .json फ़ाइल चुनें।\'); }\n  };\n  fr.readAsText(file); input.value=\'\';\n}\n\n/* ---------------- record store (केन्द्रवार प्रविष्टियाँ) ---------------- */\nconst LS_REC=\'mushroom_records_v1\', LS_DRAFT=\'mushroom_draft_v1\';\nlet MEM_REC=null, MEM_DRAFT=null, curRec=null;\nconst HAS_LS=(()=>{ try{ localStorage.setItem(\'__t\',\'1\'); localStorage.removeItem(\'__t\'); return true; }catch(e){ return false; } })();\nfunction getRecs(){\n  if(HAS_LS){ try{ return JSON.parse(localStorage.getItem(LS_REC)||\'[]\'); }catch(e){ return []; } }\n  return MEM_REC||(MEM_REC=[]);\n}\nlet backupDirty=false;\nfunction putRecs(a){\n  if(HAS_LS){ try{ localStorage.setItem(LS_REC, JSON.stringify(a)); return true; }catch(e){ alert(\'सहेजने का स्थान भर गया है। कृपया कुछ पुरानी प्रविष्टियाँ हटाएँ या बैकअप लेकर हटाएँ।\'); return false; } }\n  MEM_REC=a; return true;\n}\n\n/* ---------------- 12 केन्द्रों की तैयार प्रविष्टियाँ (एक बार भरी हुई) ----------------\n   बिल / इनवॉइस संख्या व रसीद प्रारम्भिक संख्या चेलूसैंण (1253/751) से क्रमवार आगे भरी गई हैं।\n   गाड़ी नंबर व आपूर्ति दिनांक केन्द्रवार सूची के अनुसार भरे गए हैं। */\n(function seedBillRecords(){\n  const SEED_PREFIX=\'seed_v12_\';\n  let recs=getRecs();\n  if(recs.some(r=>String(r.id).indexOf(SEED_PREFIX)===0)) return; /* पहले ही जोड़ी जा चुकी हैं */\n  recs=recs.filter(r=>[\'seed_v1_\',\'seed_v2_\',\'seed_v3_\',\'seed_v4_\',\'seed_v5_\',\'seed_v6_\',\'seed_v7_\',\'seed_v8_\',\'seed_v9_\',\'seed_v10_\',\'seed_v11_\'].every(p=>String(r.id).indexOf(p)!==0)); /* पुराना सीड डेटा हटाएँ */\n  const commonFields={\n    i_rate:\'90\', i_kg:\'5\', i_sub:\'80\', i_gst:\'0\',\n    i_office:\'उद्यान विशेषज्ञ कोटद्वार गढ़वाल (पौड़ी गढ़वाल)\',\n    i_year:\'2026-27\', i_date:\'2026-09-14\',\n    i_billto:\'उद्यान विशेषज्ञ कोटद्वार गढ़वाल (पौड़ी गढ़वाल)\',\n    i_billaddr:\'उद्यान विशेषज्ञ कोटद्वार गढ़वाल (पौड़ी गढ़वाल)\',\n    i_rmode:\'one\'\n  };\n  /* [केन्द्र, बिल सं०, रसीद सं०, आपूर्ति दिनांक (YYYY-MM-DD), [गाड़ी नंबर...]] */\n  /* [केन्द्र, बिल सं०, रसीद सं०, आपूर्ति दिनांक, [गाड़ी नंबर...], बिल दिनांक] */\n  const SEED=[\n    [\'चेलूसैंण\',\'1265\',\'751\',\'23/08/2026, 27/08/2026\',[\'UK18CA8606\',\'UK18CA9566\']],\n    [\'किनगोड़िखाल\',\'1254\',\'752\',\'08/09/2026, 12/09/2026\',[\'UK18CA8606\',\'UK18CA9566\'],\'2026-09-11\'],\n    [\'कोटद्वार\',\'1255\',\'753\',\'09/09/2026, 13/09/2026\',[\'UK18CA8606\',\'UK18CA9566\',\'UK18CA9283\',\'UK15CA0856\']],\n    [\'सतपुली\',\'1256\',\'754\',\'28/08/2026, 01/09/2026\',[\'UK18CA8606\',\'UK18CA9566\']],\n    [\'सेंधीखाल\',\'1257\',\'755\',\'31/08/2026, 04/09/2026\',[\'UK18CA8606\']],\n    [\'सिसल्ड़ी\',\'1258\',\'756\',\'01/09/2026, 05/09/2026\',[\'UK18CA9283\']],\n    [\'दिउली\',\'1259\',\'757\',\'11/09/2026, 15/09/2026\',[\'UK18CA8606\',\'UK18CA9566\',\'UK18CA9283\',\'UK15CA0856\',\'UK15CA0934\',\'UK12CA0591\',\'UK12CB0879\']],\n    [\'पौखाल\',\'1260\',\'758\',\'11/09/2026, 15/09/2026\',[\'UK15CA1027\']],\n    [\'गंगाभोगपुर\',\'1261\',\'759\',\'07/09/2026, 11/09/2026\',[\'UK04CA8065\',\'UK12TB1087\']],\n    [\'सिलोगी\',\'1262\',\'760\',\'23/08/2026, 27/08/2026\',[\'UK18CA9283\',\'UK15CA0856\',\'UK15CA0934\']],\n    [\'देवियोंखाल\',\'1263\',\'761\',\'29/08/2026, 02/09/2026\',[\'UK18CA9566\',\'UK18CA9283\']],\n    [\'दुगड्डा\',\'1264\',\'762\',\'06/09/2026, 10/09/2026\',[\'UK15CA0934\']]\n  ];\n  const base=Date.now();\n  SEED.forEach(([k,inv,rcpt,supply,vehicles,billdate],idx)=>{\n    const farmers=(DB[k]||[]).map(f=>({name:f.name,vill:f.vill,mob:f.mob,adh:f.adh,bags:f.bags}));\n    recs.push({\n      id: SEED_PREFIX+idx,\n      savedAt: new Date(base+idx*1000).toISOString(),\n      data: { mtype:\'oyster\',\n              fields: Object.assign({}, commonFields, {i_kendra:k, i_invoice:inv, i_rcptno:rcpt, i_supply:supply}, billdate?{i_date:billdate}:{}),\n              farmers: farmers, vehicles: vehicles, letter:\'\' }\n    });\n  });\n  putRecs(recs);\n})();\nlet booted=false, draftTimer=null;\nfunction scheduleDraft(){\n  if(!booted) return;\n  clearTimeout(draftTimer);\n  draftTimer=setTimeout(saveDraft, 900);\n}\nfunction saveDraft(){\n  const s=JSON.stringify(snapshot());\n  if(HAS_LS){ try{ localStorage.setItem(LS_DRAFT,s); }catch(e){} } else MEM_DRAFT=s;\n}\nfunction summary(d){\n  const rate=parseFloat(d.fields.i_rate)||0, sub=parseFloat(d.fields.i_sub)||0;\n  const bags=(d.farmers||[]).reduce((s,f)=>s+(parseInt(f.bags)||0),0);\n  return {bags, kisan:(d.farmers||[]).filter(f=>f.name||f.bags).length,\n          value:bags*rate, subsidy:bags*rate*sub/100};\n}\nfunction saveRecord(asNew){\n  const d=snapshot(), s=summary(d);\n  if(!d.fields.i_kendra){ alert(\'पहले उद्यान सचल दल केन्द्र चुनें।\'); return; }\n  if(s.bags<=0 && !confirm(\'इस प्रविष्टि में कोई बैग दर्ज नहीं है। फिर भी सहेजें?\')) return;\n  const recs=getRecs();\n  const now=new Date().toISOString();\n  if(!asNew && curRec){\n    const i=recs.findIndex(r=>r.id===curRec);\n    if(i>-1){ recs[i]={...recs[i], data:d, savedAt:now}; if(putRecs(recs)){ backupDirty=true; renderRecords(); flash(\'प्रविष्टि अद्यतन कर दी गई।\'); } return; }\n  }\n  const id=\'rec_\'+Date.now();\n  recs.unshift({id, savedAt:now, data:d});\n  if(putRecs(recs)){ curRec=id; backupDirty=true; bumpAutoCounters(d); renderRecords(); flash(\'नई प्रविष्टि सहेज दी गई।\'); }\n}\nfunction openRecord(id){\n  const r=getRecs().find(x=>x.id===id); if(!r) return;\n  const cur=collect().filter(f=>f.name||f.bags).length;\n  if(cur>0 && !confirm(\'वर्तमान प्रपत्र हटाकर सहेजी गई प्रविष्टि खोली जाए?\')) return;\n  curRec=id; applyData(r.data); renderRecords();\n  flash(\'प्रविष्टि खोल दी गई — अब बदलाव कर के "अद्यतन करें" दबाएँ।\');\n  window.scrollTo({top:0,behavior:\'smooth\'});\n}\nfunction deleteRecord(id){\n  const r=getRecs().find(x=>x.id===id); if(!r) return;\n  if(!confirm(\'यह प्रविष्टि स्थायी रूप से हटा दी जाए?\')) return;\n  const recs=getRecs().filter(x=>x.id!==id);\n  if(putRecs(recs)){ if(curRec===id) curRec=null; backupDirty=true; renderRecords(); }\n}\nfunction newEntry(){\n  if(!confirm(\'नया प्रपत्र शुरू किया जाए? वर्तमान अनसहेजा कार्य हट जाएगा।\')) return;\n  curRec=null; letterEdited=false;\n  if(HAS_LS){ try{ localStorage.removeItem(LS_DRAFT); }catch(e){} } else MEM_DRAFT=null;\n  document.getElementById(\'d_letter\').innerHTML=LETTER_HTML;\n  document.getElementById(\'entry_body\').innerHTML=\'\';\n  document.getElementById(\'i_invoice\').value=\'\';\n  applyAutoStyling();\n  applyAutoValues();\n  for(let i=0;i<3;i++) addRow();\n  renderRecords(); render();\n}\nfunction backupAll(){\n  const recs=getRecs();\n  if(!recs.length){ alert(\'अभी कोई सहेजी गई प्रविष्टि नहीं है।\'); return; }\n  const blob=new Blob([JSON.stringify(recs,null,1)],{type:\'application/json\'});\n  const a=document.createElement(\'a\');\n  a.href=URL.createObjectURL(blob);\n  a.download=\'mushroom-backup-\'+new Date().toISOString().slice(0,10)+\'.json\';\n  a.click(); URL.revokeObjectURL(a.href);\n  backupDirty=false; renderRecords();\n  flash(\'बैकअप फ़ाइल बन गई — इसे pen drive या Drive में भी रख लें।\');\n}\nfunction restoreBackup(arr){\n  if(!Array.isArray(arr)||!arr.length||!arr[0].data){ alert(\'यह बैकअप फ़ाइल नहीं है।\'); return; }\n  const recs=getRecs(), ids=new Set(recs.map(r=>r.id));\n  let added=0;\n  arr.forEach(r=>{ if(r.id && !ids.has(r.id)){ recs.push(r); added++; } });\n  recs.sort((a,b)=>(b.savedAt||\'\').localeCompare(a.savedAt||\'\'));\n  if(putRecs(recs)){ renderRecords(); flash(added+\' प्रविष्टियाँ बैकअप से जोड़ी गईं।\'); }\n}\nfunction flash(msg){\n  const el=document.getElementById(\'rec_msg\');\n  el.innerText=msg; el.style.display=\'block\';\n  clearTimeout(el._t); el._t=setTimeout(()=>el.style.display=\'none\', 4000);\n}\nfunction storeNote(){\n  const el=document.getElementById(\'rec_store\');\n  if(!HAS_LS){\n    el.innerHTML=\'<b style="color:#8E1F16">यह ब्राउज़र सहेज नहीं पा रहा — बैकअप फ़ाइल अवश्य लें</b>\';\n    return;\n  }\n  el.innerHTML = backupDirty\n    ? \'डेटा इसी कंप्यूटर में सुरक्षित · <b style="color:#8E1F16">पिछले बैकअप के बाद बदलाव हुए हैं — बैकअप फ़ाइल बना लें</b>\'\n    : \'डेटा इसी कंप्यूटर में सुरक्षित · बैकअप अद्यतन है\';\n}\nfunction renderRecords(){\n  storeNote();\n  const recs=getRecs(), tb=document.getElementById(\'rec_body\');\n  document.getElementById(\'rec_count\').innerText=recs.length;\n  document.getElementById(\'btnUpdate\').style.display = curRec?\'inline-block\':\'none\';\n  tb.innerHTML=\'\';\n  if(!recs.length){\n    tb.innerHTML=\'<tr><td colspan="8" style="text-align:center;color:#55524A;padding:14px">अभी कोई प्रविष्टि सहेजी नहीं गई है।</td></tr>\';\n    return;\n  }\n  recs.forEach(r=>{\n    const d=r.data, s=summary(d), f=d.fields||{};\n    const t=(d.mtype===\'oyster\')?\'ऑयस्टर\':\'बटन\';\n    const dt=(f.i_date||\'\').split(\'-\').reverse().join(\'/\');\n    tb.insertAdjacentHTML(\'beforeend\',\n      `<tr${r.id===curRec?\' style="background:#F4F9F5"\':\'\'}>\n        <td><b>${f.i_kendra||\'—\'}</b>${r.id===curRec?\' <span style="color:#14553A;font-size:11px">(खुली हुई)</span>\':\'\'}</td>\n        <td>${dt||\'—\'}</td><td>${f.i_invoice||\'—\'}</td><td>${t}</td>\n        <td style="text-align:center">${s.kisan}</td>\n        <td style="text-align:center">${s.bags}</td>\n        <td style="text-align:right">₹ ${money(s.value)}</td>\n        <td style="white-space:nowrap;text-align:center">\n          <button class="btn s" style="padding:4px 9px;font-size:12px" onclick="openRecord(\'${r.id}\')">खोलें</button>\n          <button class="btn d" onclick="deleteRecord(\'${r.id}\')">✕</button>\n        </td>\n      </tr>`);\n  });\n}\n\n/* ---------------- init ---------------- */\ndocument.getElementById(\'entry_body\').addEventListener(\'input\', ()=>{ autoFilled=false; });\nLETTER_HTML = document.getElementById(\'d_letter\').innerHTML;\ndocument.getElementById(\'d_letter\').addEventListener(\'input\', ()=>{ letterEdited=true; });\ndocument.getElementById(\'i_date\').value=new Date().toISOString().slice(0,10);\nfor(let i=0;i<5;i++) addRow();\naddVehicleRow();\napplyAutoStyling();\napplyAutoValues();\nrender();\nrenderRecords();\n(function(){\n  const draft = HAS_LS ? localStorage.getItem(LS_DRAFT) : MEM_DRAFT;\n  if(!draft) { booted=true; return; }\n  try{\n    const d=JSON.parse(draft);\n    if((d.farmers||[]).some(f=>f.name||f.bags)){\n      applyData(d); flash(\'पिछला अधूरा कार्य वापस लाया गया है।\');\n    }\n  }catch(e){}\n  booted=true;\n})();';

export default function MushroomForm() {
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    // The original form logic expects these functions to be available
    // globally because the source form used inline event handlers.
    const script = document.createElement("script");
    script.type = "text/javascript";
    script.textContent = ORIGINAL_FORM_LOGIC;
    document.body.appendChild(script);

    return () => {
      document.body.removeAttribute("data-print");
      script.remove();
      initialized.current = false;
    };
  }, []);

  return (
    <div className="mushroom-form">
      <div className="wrap no-print">
        <div className="panel">
          <h1>मशरूम कम्पोस्ट बैग — प्रपत्र प्रणाली</h1>
          <p className="sub">
            एक बार विवरण भरें — मांग-पत्र, समेकित पावती-पत्र, टैक्स इनवॉइस और
            नकद रसीद अपने आप तैयार हो जाएँगे।
          </p>
          <div className="legend">1 · मशरूम का प्रकार चुनें</div>
          <div className="types">
            <div
              className="type"
              data-type="button"
              data-on="1"
              onClick={(e) => {
                window.pickType("button");
              }}
            >
              <input
                type="radio"
                name="mtype"
                id="t_button"
                defaultChecked={true}
              />
              <div>
                <b>बटन मशरूम (Button)</b>
                <span>बैग वजन 10 किग्रा · पूर्ण दर ₹126 प्रति बैग</span>
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
                <span>बैग वजन 5 किग्रा · पूर्ण दर ₹90 प्रति बैग</span>
              </div>
            </div>
          </div>
          <div className="grid" style={{ marginTop: "12px" }}>
            <div>
              <label className="f">पूर्ण दर (₹ प्रति बैग)</label>
              <input
                type="number"
                id="i_rate"
                value="126"
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
                value="10"
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
                value="80"
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
                defaultValue="0"
                onChange={(e) => {
                  window.render();
                }}
              >
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
              <label className="f">उद्यान सचल दल केन्द्र (कुल 24)</label>
              <select
                id="i_kendra"
                onChange={(e) => {
                  window.onKendra();
                }}
              >
                <option value="">— केन्द्र चुनें —</option>
                <option>कोटद्वार</option>
                <option>किनगोड़िखाल</option>
                <option>चौखाल</option>
                <option>धुमाकोट</option>
                <option>बीरोंखाल</option>
                <option>हल्दूखाल</option>
                <option>किल्वोंखाल</option>
                <option>चेलूसैंण</option>
                <option>जयहरीखाल</option>
                <option>जेठागांव</option>
                <option>देवियोंखाल</option>
                <option>सिलोगी</option>
                <option>सिसल्ड़ी</option>
                <option>पौखाल</option>
                <option>सतपुली</option>
                <option>संगलाकोटी</option>
                <option>देवराजखाल</option>
                <option>पोखड़ा</option>
                <option>वेदीखाल</option>
                <option>विथ्याणी</option>
                <option>गंगाभोगपुर</option>
                <option>दिउली</option>
                <option>दुगड्डा</option>
                <option>सेंधीखाल</option>
              </select>
            </div>
            <div>
              <label className="f">कार्यालय / जनपद</label>
              <input
                type="text"
                id="i_office"
                value="उद्यान विशेषज्ञ कोटद्वार गढ़वाल (पौड़ी गढ़वाल)"
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
                value="2026-27"
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
                value="उद्यान विशेषज्ञ कोटद्वार गढ़वाल (पौड़ी गढ़वाल)"
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
                value="उद्यान विशेषज्ञ कोटद्वार गढ़वाल (पौड़ी गढ़वाल)"
                onInput={(e) => {
                  window.render();
                }}
              />
            </div>
            <div>
              <label className="f">नकद रसीद किस प्रकार बनें</label>
              <select
                id="i_rmode"
                defaultValue="one"
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
                  defaultChecked={true}
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
            <button
              className="btn s"
              onClick={(e) => {
                window.saveJSON();
              }}
            >
              विवरण सहेजें (फ़ाइल)
            </button>
            <button
              className="btn s"
              onClick={(e) => {
                document.getElementById("loadfile").click();
              }}
            >
              सहेजी फ़ाइल खोलें
            </button>
            <input
              type="file"
              id="loadfile"
              accept=".json"
              style={{ display: "none" }}
              onChange={(e) => {
                window.loadJSON(e.currentTarget);
              }}
            />
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
