here// القاموس المعتمد للغة زيلوس
const zilusAlphabet = {
    'a': { symbol: '⏃', sound: 'سا' }, 'b': { symbol: '⏚', sound: 'بارو' },
    'c': { symbol: '☊', sound: 'سن' }, 'd': { symbol: '⎅', sound: 'دا' },
    'e': { symbol: '⟒', sound: 'سي' }, 'f': { symbol: '⎎', sound: 'يون' },
    'g': { symbol: '☌', sound: 'سين' }, 'h': { symbol: '⊑', sound: 'هام' },
    'i': { symbol: '⟟', sound: 'از' }, 'j': { symbol: '⟊', sound: 'ام' },
    'k': { symbol: '☍', sound: 'نان' }, 'l': { symbol: '⌰', sound: 'سير' },
    'm': { symbol: '⋔', sound: 'مايري' }, 'n': { symbol: '⋏', sound: 'ني' },
    'o': { symbol: '⍜', sound: 'سو' }, 'p': { symbol: '⌿', sound: 'ان' },
    'q': { symbol: '⍾', sound: 'قو' }, 'r': { symbol: '⍀', sound: 'نا' },
    's': { symbol: '⌇', sound: 'كي' }, 't': { symbol: '⏁', sound: 'هي' },
    'u': { symbol: '⎍', sound: 'ماي' }, 'v': { symbol: '⎐', sound: 'فاين' },
    'w': { symbol: '⍙', sound: 'يو' }, 'x': { symbol: '⌖', sound: 'اش' },
    'y': { symbol: '⊬', sound: 'جو' }, 'z': { symbol: '⋉', sound: 'زاد' }
};

// إنشاء قاموس عكسي للترجمة من الرموز إلى الإنجليزية
const reverseSymbols = {};
Object.keys(zilusAlphabet).forEach(key => {
    reverseSymbols[zilusAlphabet[key].symbol] = key;
});

// دالة الترجمة الرئيسية
function handleTranslation() {
    const direction = document.getElementById("translationDirection").value;
    const input = document.getElementById("inputText").value.trim();
    const symbolsOutput = document.getElementById("symbolsOutput");
    const soundsOutput = document.getElementById("soundsOutput");

    if (!input) return;

    if (direction === "en-to-zilus") {
        // الترجمة من الإنجليزية إلى زيلوس
        let lowerText = input.toLowerCase();
        let currentWords = lowerText.split(" ");
        
        let finalSymbols = "";
        let finalSoundsHTML = "";
        let fullSentenceSounds = [];

        currentWords.forEach(word => {
            let wordSymbols = "";
            let wordSounds = [];

            for (let i = 0; i < word.length; i++) {
                let char = word[i];
                let nextChar = word[i + 1];

                if (zilusAlphabet[char]) {
                    wordSymbols += zilusAlphabet[char].symbol;

                    // تطبيق قاعدتك الذكية للحروف المتكررة الملتصقة (مثل LL -> سس)
                    if (char === nextChar) {
                        wordSounds.push("سس");
                        wordSymbols += zilusAlphabet[char].symbol; // أضف الرمز الثاني بصرياً
                        i++; // تخطي الحرف المتكرر الثاني
                    } else {
                        wordSounds.push(zilusAlphabet[char].sound);
                    }
                } else {
                    wordSymbols += char; // للحروف أو الأرقام الأخرى
                }
            }

            let wordSoundText = wordSounds.join("");
            finalSymbols += wordSymbols + " ";
            fullSentenceSounds.push(wordSoundText);

            // إنشاء كلمة قابلة للضغط والنطق وحدها
            finalSoundsHTML += `<span class="word-span" onclick="speakText('${wordSoundText}')" oncontextmenu="event.preventDefault(); speakText('${wordSoundText}')">${wordSoundText}</span> `;
        });

        symbolsOutput.innerHTML = finalSymbols;
        
        // إضافة زر لنطق الجملة كاملة بجانب الكلمات المنفردة
        let fullSentenceString = fullSentenceSounds.join(" ");
        soundsOutput.innerHTML = `<div>${finalSoundsHTML}</div><button style="margin-top:10px; padding:6px; background:#7ee787; color:#0d1117; width:auto; font-size:13px;" onclick="speakText('${fullSentenceString}')">🗣️ نطق الجملة كاملة</button>`;

    } else {
        // الترجمة العكسية: من رموز زيلوس إلى الإنجليزية
        let englishResult = "";
        for (let i = 0; i < input.length; i++) {
            let char = input[i];
            if (char === " ") {
                englishResult += " ";
            } else if (reverseSymbols[char]) {
                englishResult += reverseSymbols[char];
            } else {
                englishResult += char;
            }
        }
        symbolsOutput.innerHTML = input; // إبقاء الرموز بالأعلى
        soundsOutput.innerHTML = `<span style="color:#fff; font-size:18px;">النص المترجم: <b>${englishResult.toUpperCase()}</b></span>`;
    }
}

// دالة تشغيل نظام الصوت للنطق (Web Speech API)
function speakText(text) {
    if ('speechSynthesis' in window) {
        // إلغاء أي نطق مستمر لمنع التداخل
        window.speechSynthesis.cancel();

        let utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'ar-SA'; // نطقها باللهجة العربية لتخرج النغمة صحيحة تماماً
        utterance.rate = 0.85;    // جعل النطق أبطأ قليلاً ليعطي الفخامة والوضوح للغتك الصعبة
        utterance.pitch = 1.0;

        window.speechSynthesis.speak(utterance);
    } else {
        alert("متصفحك لا يدعم نظام النطق الصوتي للأسف.");
    }
}
