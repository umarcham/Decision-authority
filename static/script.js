const app = document.getElementById('app');
let questionData = [];
let questions = [];
let currentQuestionIndex = 0;
let userValues = {};
let currentCategory = "";
let currentLanguage = "English";

// --- Translations ---
const translations = {
    "English": {
        direction: "ltr",
        title: "What do you desire?",
        subtitle: "Tell us what you are looking for. Be specific.",
        placeholder: "e.g. Gaming Laptop, Coffee Maker, Running Shoes",
        beginBtn: "Begin Decision",
        realityTitle: "Define Reality",
        realityDesc: "A decision without a budget is a fantasy. What is the maximum you are willing to sacrifice?",
        maxSacrifice: "Max Sacrifice",
        stretchable: "Stretchable? (Is this a soft limit?)",
        constraintsDesc: "Is there anything you absolutely refuse to compromise on?<br><span style='font-size: 1rem; color: #666;'>(Optional. Max 2-3 hard constraints.)</span>",
        constraintsPlaceholder: "ex. Must be lightweight, Must support MacOS",
        acceptBtn: "Accept Reality",
        loading: {
            consulting: "CONSULTING THE ORACLE...",
            analyzing: "ANALYZING YOUR SOUL...",
            weighing: "WEIGHING THE TRADEOFFS...",
            judging: "JUDGING YOUR CHOICES...",
            calculating: "CALCULATING SACRIFICE...",
            defining: "DEFINING REALITY...",
            error_connection: "CONNECTION SEVERED",
            error_desc: "The system could not analyze",
            retry: "Retry",
            error_calc: "CALCULATION ERROR",
            error_void: "The verdict is lost in the void.",
            disclaimer: "Availability and pricing may vary by region."
        }
    },
    "Arabic": {
        direction: "rtl",
        title: "ماذا ترغب؟",
        subtitle: "أخبرنا عما تبحث عنه. كن محدداً.",
        placeholder: "مثال: لابتوب للألعاب، صانعة قهوة، حذاء جري",
        beginBtn: "ابدأ القرار",
        realityTitle: "حدد الواقع",
        realityDesc: "قرار بدون ميزانية هو مجرد خيال. ما هو أقصى ما ترغب في التضحية به؟",
        maxSacrifice: "أقصى تضحية (السعر)",
        stretchable: "قابل للزيادة؟ (هل هذا حد مرن؟)",
        constraintsDesc: "هل هناك أي شيء ترفض التنازل عنه تماماً؟<br><span style='font-size: 1rem; color: #666;'>(اختياري. بحد أقصى 2-3 قيود صارمة.)</span>",
        constraintsPlaceholder: "مثال: يجب أن يكون خفيف الوزن، يدعم MacOS",
        acceptBtn: "اقبل الواقع",
        loading: {
            consulting: "...استشارة العراف",
            analyzing: "...تحليل روحك",
            weighing: "...وزن المقايضات",
            judging: "...الحكم على خياراتك",
            calculating: "...حساب التضحية",
            defining: "...تحديد الواقع",
            error_connection: "انقطع الاتصال",
            error_desc: "لم يتمكن النظام من تحليل",
            retry: "أعد المحاولة",
            error_calc: "خطأ في الحساب",
            error_void: "ضاع الحكم في الفراغ.",
            disclaimer: "قد يختلف التوفر والأسعار حسب المنطقة."
        }
    },
    "Urdu": {
        direction: "rtl",
        title: "آپ کی کیا خواہش ہے؟",
        subtitle: "ہمیں بتائیں کہ آپ کیا تلاش کر رہے ہیں۔",
        placeholder: "مثال: گیمنگ لیپ ٹاپ، کافی میکر، جوتے",
        beginBtn: "فیصلہ شروع کریں",
        realityTitle: "حقیقت کا تعین کریں",
        realityDesc: "بجٹ کے بغیر فیصلہ صرف ایک خواب ہے۔ آپ زیادہ سے زیادہ کتنی قربانی (قیمت) دے سکتے ہیں؟",
        maxSacrifice: "زیادہ سے زیادہ قربانی",
        stretchable: "کیا گنجائش ہے؟ (کیا یہ حد نرم ہے؟)",
        constraintsDesc: "کیا کوئی ایسی چیز ہے جس پر آپ بالکل سمجھوتہ نہیں کریں گے؟<br><span style='font-size: 1rem; color: #666;'>(اختیاری)</span>",
        constraintsPlaceholder: "مثال: ہلکا ہونا چاہیے، میک کو سپورٹ کرنا چاہیے",
        acceptBtn: "حقیقت قبول کریں",
        loading: {
            consulting: "...اوریکل سے مشورہ ہو رہا ہے",
            analyzing: "...آپ کی روح کا تجزیہ",
            weighing: "...توازن کا اندازہ",
            judging: "...آپ کے انتخاب کا فیصلہ",
            calculating: "...قربانی کا حساب",
            defining: "...حقیقت کا تعین",
            error_connection: "رابطہ منقطع ہو گیا",
            error_desc: "نظام تجزیہ نہیں کر سکا",
            retry: "دوبارہ کوشش کریں",
            error_calc: "حساب کی غلطی",
            error_void: "فیصلہ خلا میں کھو گیا ہے۔",
            disclaimer: "دستیابی اور قیمتیں علاقے کے لحاظ سے مختلف ہو سکتی ہیں۔"
        }
    },
    "Hindi": {
        direction: "ltr",
        title: "आप क्या चाहते हैं?",
        subtitle: "हमें बताएं कि आप क्या ढूंढ रहे हैं। स्पष्ट रहें।",
        placeholder: "जैसे: गेमिंग लैपटॉप, कॉफी मेकर, रनिंग शूज",
        beginBtn: "निर्णय शुरू करें",
        realityTitle: "वास्तविकता को परिभाषित करें",
        realityDesc: "बजट के बिना निर्णय एक कल्पना है। आप अधिकतम कितना त्याग (मूल्य) करने को तैयार हैं?",
        maxSacrifice: "अधिकतम त्याग",
        stretchable: "क्या गुंजाइश है? (क्या यह सीमा लचीली है?)",
        constraintsDesc: "क्या कुछ ऐसा है जिस पर आप बिल्कुल समझौता नहीं करेंगे?<br><span style='font-size: 1rem; color: #666;'>(वैकल्पिक)</span>",
        constraintsPlaceholder: "उदाहरण: हल्का होना चाहिए, MacOS का समर्थन करना चाहिए",
        acceptBtn: "वास्तविकता स्वीकार करें",
        loading: {
            consulting: "महर्षि से परामर्श चल रहा है...",
            analyzing: "आपकी आत्मा का विश्लेषण...",
            weighing: "समझौतों को तौला जा रहा है...",
            judging: "आपके विकल्पों का निर्णय...",
            calculating: "त्याग की गणना...",
            defining: "वास्तविकता को परिभाषित किया जा रहा है...",
            error_connection: "संपर्क टूट गया",
            error_desc: "सिस्टम विश्लेषण नहीं कर सका",
            retry: "पुनः प्रयास करें",
            error_calc: "गणना त्रुटि",
            error_void: "निर्णय शून्य में खो गया है।",
            disclaimer: "उपलब्धता और कीमतें क्षेत्र के अनुसार भिन्न हो सकती हैं।"
        }
    }
};

// --- API Calls ---

async function initializeInterrogation(category) {
    currentCategory = category;
    const t = translations[currentLanguage].loading;
    renderLoading(t.consulting);
    try {
        const res = await fetch('/api/initialize_interrogation', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ category, language: currentLanguage })
        });
        questionData = await res.json();
        console.log("DEBUG: Received Question Data:", questionData);
        stopLoading();

        if (!questionData || questionData.length === 0) {
            throw new Error("No questions generated");
        }

        startQuiz();
    } catch (e) {
        stopLoading();
        console.error(e);
        const t = translations[currentLanguage].loading;
        app.innerHTML = `
            <div dir="${translations[currentLanguage].direction}">
                <h1 style="color:red">${t.error_connection}</h1>
                <p>${t.error_desc} "${category}".</p>
                <button class="btn" onclick="renderSearch()">${t.retry}</button>
            </div>`;
    }
}

async function getVerdict() {
    const t = translations[currentLanguage].loading;
    renderLoading(t.judging);
    try {
        const res = await fetch('/api/decide', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                category: currentCategory,
                answers: userValues,
                language: currentLanguage
            })
        });
        const result = await res.json();
        stopLoading();
        renderVerdict(result);
    } catch (e) {
        stopLoading();
        console.error(e);
        const t = translations[currentLanguage].loading;
        app.innerHTML = `<h1 style="color:red">${t.error_calc}</h1><p>${t.error_void}</p>`;
    }
}

// --- Loading Animation ---

let loadingInterval;

function renderLoading(initialMessage) {
    const t = translations[currentLanguage].loading;
    const messages = [
        t.consulting,
        t.analyzing,
        t.weighing,
        t.judging,
        t.calculating,
        t.defining
    ];
    let i = 0;

    app.innerHTML = `
        <div class="fade-in" style="text-align: center; margin-top: 20vh;" dir="${translations[currentLanguage].direction}">
            <div class="spinner"></div>
            <h2 id="loadingText" style="margin-top: 2rem; letter-spacing: 2px;">${initialMessage}</h2>
        </div>
    `;

    // Clear any existing interval just in case
    if (loadingInterval) clearInterval(loadingInterval);

    loadingInterval = setInterval(() => {
        i = (i + 1) % messages.length;
        const el = document.getElementById('loadingText');
        if (el) el.innerText = messages[i];
    }, 2000);
}

function stopLoading() {
    if (loadingInterval) {
        clearInterval(loadingInterval);
        loadingInterval = null;
    }
}

// --- Utils ---

function renderSearch() {
    const t = translations[currentLanguage];
    app.innerHTML = `
        <div class="fade-in" dir="${t.direction}">
            <h1>${t.title}</h1>
            
            <div style="margin-bottom: 2rem;">
                <select id="languageSelect" onchange="changeLanguage(this.value)" style="background: transparent; color: #fff; border: 1px solid #fff; padding: 0.5rem; font-size: 1rem; border-radius: 4px;">
                    <option value="English" ${currentLanguage === 'English' ? 'selected' : ''} style="color: black;">English</option>
                    <option value="Arabic" ${currentLanguage === 'Arabic' ? 'selected' : ''} style="color: black;">Arabic (العربية)</option>
                    <option value="Urdu" ${currentLanguage === 'Urdu' ? 'selected' : ''} style="color: black;">Urdu (اردو)</option>
                    <option value="Hindi" ${currentLanguage === 'Hindi' ? 'selected' : ''} style="color: black;">Hindi (हिंदी)</option>
                </select>
            </div>

            <p>${t.subtitle}</p>
            <input type="text" id="categoryInput" placeholder="${t.placeholder}" 
                style="width: 100%; padding: 1.5rem; font-size: 1.5rem; background: transparent; border: 2px solid #fff; color: #fff; margin-bottom: 2rem; outline: none; direction: ${t.direction};">
            <button class="btn btn-primary" onclick="handleSearchSubmit()">${t.beginBtn}</button>
        </div>
    `;

    // Focus and Enter key support
    setTimeout(() => document.getElementById('categoryInput').focus(), 100);
    document.getElementById('categoryInput').addEventListener('keypress', function (e) {
        if (e.key === 'Enter') handleSearchSubmit();
    });
}

function changeLanguage(lang) {
    currentLanguage = lang;
    if (document.getElementById('priceInput')) {
        renderCommitment();
    } else if (document.getElementById('categoryInput')) {
        const existingVal = document.getElementById('categoryInput').value;
        renderSearch();
        document.getElementById('categoryInput').value = existingVal;
    } else {
        // Fallback for quiz/verdict if needed, usually we don't switch language mid-quiz but this is robust enough
        // Ideally we would re-render current question, but that's complex. Let's stick to start/commitment screens.
    }
}

function handleSearchSubmit() {
    const input = document.getElementById('categoryInput').value.trim();
    if (input) {
        currentCategory = input;
        renderCommitment();
    }
}

function renderCommitment() {
    const t = translations[currentLanguage];
    app.innerHTML = `
        <div class="fade-in" dir="${t.direction}">
            <h1>${t.realityTitle}</h1>
            <p>${t.realityDesc}</p>
            
             <div style="margin-bottom: 2rem;">
                <select id="languageSelect" onchange="changeLanguage(this.value)" style="background: transparent; color: #fff; border: 1px solid #fff; padding: 0.5rem; font-size: 1rem; border-radius: 4px;">
                     <option value="English" ${currentLanguage === 'English' ? 'selected' : ''} style="color: black;">English</option>
                    <option value="Arabic" ${currentLanguage === 'Arabic' ? 'selected' : ''} style="color: black;">Arabic (العربية)</option>
                    <option value="Urdu" ${currentLanguage === 'Urdu' ? 'selected' : ''} style="color: black;">Urdu (اردو)</option>
                    <option value="Hindi" ${currentLanguage === 'Hindi' ? 'selected' : ''} style="color: black;">Hindi (हिंदी)</option>
                </select>
            </div>

            <div style="margin-bottom: 2rem;">
                <label style="display:block; font-size: 0.8rem; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 0.5rem; color: #ff3333;">${t.maxSacrifice}</label>
                
                <div style="display: flex; gap: 10px;">
                    <select id="currencySelect" style="padding: 1rem; font-size: 1.5rem; background: transparent; border: 2px solid #fff; color: #fff; border-radius: 0; outline: none; flex: 0 0 80px;">
                        <option value="USD" style="color: black;">$</option>
                        <option value="INR" style="color: black;">₹</option>
                        <option value="PKR" style="color: black;">₨</option>
                        <option value="EUR" style="color: black;">€</option>
                        <option value="GBP" style="color: black;">£</option>
                        <option value="AED" style="color: black;">د.إ</option>
                        <option value="SAR" style="color: black;">﷼</option>
                    </select>
                    <input type="number" id="priceInput" placeholder="ex. 1200" 
                        style="width: 100%; padding: 1rem; font-size: 1.5rem; background: transparent; border: 2px solid #fff; color: #fff; outline: none; direction: ltr; flex: 1;">
                </div>
                
                <label style="display:flex; align-items:center; cursor:pointer; margin-top: 1rem;">
                    <input type="checkbox" id="stretchInput" style="transform: scale(1.5); margin-right: 10px; margin-left: 10px;">
                    <span style="font-size: 1.2rem; color: #ccc;">${t.stretchable}</span>
                </label>
            </div>

            <div style="margin-bottom: 3rem;">
                <p style="margin-bottom: 1rem;">${t.constraintsDesc}</p>
                <input type="text" id="constraintInput" placeholder="${t.constraintsPlaceholder}" 
                    style="width: 100%; padding: 1rem; font-size: 1.2rem; background: transparent; border: 1px solid #666; color: #fff; outline: none; direction: ${t.direction};">
            </div>

            <button class="btn btn-primary" onclick="handleCommitmentSubmit()">${t.acceptBtn}</button>
        </div>
    `;
    setTimeout(() => document.getElementById('priceInput').focus(), 100);
}

function handleCommitmentSubmit() {
    const price = document.getElementById('priceInput').value.trim();
    const currency = document.getElementById('currencySelect').value;
    const stretch = document.getElementById('stretchInput').checked;
    const constraints = document.getElementById('constraintInput').value.trim();

    if (!price) {
        alert("You must define a sacrifice/budget.");
        return;
    }

    userValues["max_price"] = price;
    userValues["currency"] = currency;
    userValues["price_stretchable"] = stretch ? "Yes" : "No";
    userValues["hard_constraints"] = constraints || "None";

    initializeInterrogation(currentCategory);
}

function startQuiz() {
    currentQuestionIndex = 0;
    renderQuestion();
}

function renderQuestion() {
    if (!questions || questions.length === 0) {
        // Fallback or try to use questionData if questions is empty
        if (questionData && questionData.length > 0) {
            questions = questionData;
        } else {
            console.error("No questions to render");
            return;
        }
    }

    // Safety check for index
    if (currentQuestionIndex >= questions.length) {
        getVerdict();
        return;
    }

    const q = questions[currentQuestionIndex];

    // Normalize keys (Backend returns 'question', legacy might check 'text')
    const qText = q.question || q.text || "Question";
    const qOpts = q.options || q.choices || [];

    const t = translations[currentLanguage];

    // Progress Bar (if using a progress bar element)
    // document.getElementById('progress-bar').style.width = ...

    app.innerHTML = `
        <div class="fade-in" dir="${t.direction}">
            <h2 style="font-family: inherit;">${qText}</h2>
            
            <div class="options-grid">
                ${qOpts.map((opt, i) => `
                    <button class="option-card" onclick="handleAnswer('${opt ? opt.replace(/'/g, "\\'") : ""}')">
                        ${opt}
                    </button>
                `).join('')}
            </div>

            <div style="margin-top: 2rem; color: #666; font-size: 0.9rem;">
                ${currentQuestionIndex + 1} / ${questions.length}
            </div>
        </div>
    `;
}

function handleAnswer(selectedOption) {
    // Save answer
    const q = questions[currentQuestionIndex];

    // CRITICAL FIX: Use the actual Question Text as the key, 
    // because the backend is stateless and doesn't know what "Question_1" asked.
    const qText = q.question || q.text || `Question ${currentQuestionIndex + 1}`;
    userValues[qText] = selectedOption;

    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
        renderQuestion();
    } else {
        getVerdict();
    }
}

function renderVerdict(data) {
    const { verdict, why_this, rejected, closure_statement } = data;
    const t = translations[currentLanguage];

    const reasonsHtml = why_this.map(r => `<li>${r}</li>`).join('');

    const rejectedHtml = rejected.map(r => `
        <div class="rejected-item">
            <div class="rejected-name">${r.name}</div>
            <div class="rejected-reason">${r.reason}</div>
        </div>
    `).join('');

    app.innerHTML = `
        <div class="fade-in" dir="${t.direction}">
            <div class="verdict-title">FINAL VERDICT for ${currentCategory.toUpperCase()}</div>
            <div class="verdict-box">
                <div class="product-name">${verdict.name}</div>
                <div style="font-size: 1.2rem; margin-bottom: 1rem; color: #ff3333;">${verdict.philosophical_tag}</div>
                 <div style="font-size: 1rem; margin-bottom: 2rem; color: #888;">Est. Price (~): ${verdict.price}</div>
                 
                 <a href="https://www.google.com/search?q=${encodeURIComponent(verdict.name + ' price')}" target="_blank" 
                    class="btn btn-primary" style="display:inline-block; width:auto; padding: 0.8rem 2rem; font-size: 1rem; margin-bottom: 2rem; text-decoration: none; animation: pulse 2s infinite;">
                    Check Exact Live Price ↗
                 </a>

                <ul class="reason-list" style="text-align: ${t.direction === 'rtl' ? 'right' : 'left'};">
                    ${reasonsHtml}
                </ul>
            </div>
            
            <p style="margin-top: 2rem; color: #fff; font-weight: bold; font-size: 1.5rem;">${closure_statement}</p>
            
            <div class="rejection-section">
                <div class="rejection-title">WHY WE REJECTED THE OTHERS</div>
                ${rejectedHtml}
            </div>
            
            <button class="btn" style="margin-top:3rem; border-color: #333; color: #666;" onclick="location.reload()">Decide Another</button>
            
            <div style="margin-top: 4rem; opacity: 0.5; font-size: 0.8rem; color: #888;">
                * ${t.loading.disclaimer}
            </div>
        </div>
    `;
}

// Start with Search Input
renderSearch();
