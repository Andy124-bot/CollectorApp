// ✅ Global Voice Flag
let isSpeaking = false;

// ✅ Page Narration
function speakPageText() {
    stopSpeaking();

    const main = document.querySelector('main');
    if (!main) return;

    const visibleText = main.innerText || main.textContent || '';
    if (!visibleText.trim()) return;

    const utterance = new SpeechSynthesisUtterance(visibleText.trim());

    const tryToSpeak = () => {
        const voices = speechSynthesis.getVoices();
        const chosen = voices.find(v => v.lang === 'en-AU') || voices[0];

        if (!chosen) {
            setTimeout(tryToSpeak, 100);
            return;
        }

        utterance.voice = chosen;
        if (chosen.lang) utterance.lang = chosen.lang;
        utterance.rate = 1;
        utterance.pitch = 1;
        isSpeaking = true;
        utterance.onend = () => isSpeaking = false;
        speechSynthesis.speak(utterance);
    };

    tryToSpeak();
}
window.speakPageText = speakPageText;

// ✅ Stop Speech
function stopSpeaking() {
    console.log("🛑 Stop button clicked");
    speechSynthesis.cancel();
    isSpeaking = false;
}
window.stopSpeaking = stopSpeaking;

// ✅ Speak Selected Card
function startNarration() {
    console.log("📢 Narration button clicked");
    const selected = document.querySelector('.card.selected');
    if (selected) {
        speakCardContents(selected);
    } else {
        console.log("⚠️ No card selected");
    }
}
window.startNarration = startNarration;

// ✅ Card Narration
function speakCardContents(cardElement) {
    if (!cardElement) return;

    const visibleText = cardElement.innerText || cardElement.textContent || '';
    if (!visibleText.trim()) return;

    const utterance = new SpeechSynthesisUtterance(visibleText.trim());

    const tryToSpeak = () => {
        const voices = speechSynthesis.getVoices();
        const selected = voices.find(v => v.lang === 'en-AU') || voices[0];

        if (selected) {
            utterance.voice = selected;
            utterance.lang = selected.lang;
            utterance.rate = 1;
            utterance.pitch = 1;
            isSpeaking = true;
            utterance.onend = () => (isSpeaking = false);
            speechSynthesis.speak(utterance);
        } else {
            setTimeout(tryToSpeak, 100);
        }
    };

    tryToSpeak();
}

// ✅ Preload Voices
window.speechSynthesis.onvoiceschanged = () => {
    speechSynthesis.getVoices();
};

// ✅ Page Setup
document.addEventListener("DOMContentLoaded", () => {
    const characterCards = [
        "bon_bon.png", "craig_gold_star.png", "dad_gill.png", "destiny.png",
        "grumpy.png", "happy_grumpy.png", "irene_lightfish.png", "jack_gill.png", "jada.png",
        "jasmine.png", "jessica_gill.png", "kristine.png", "lacy.png", "lisa.png", "matilda.png",
        "maz.png", "maz_hiding.png", "mckenna.png", "mum_gill.png", "ollie.png", "orion.png",
        "pauline.png", "polly.png", "puffy.png", "ronnie.png", "rylee.png"
    ];

    const awardCards = [
        "bon_bon_award.png", "craig_award.png", "dad_gill_award.png", "destiny_award.png",
        "grumpy_shark_award.png", "happy_grumpy_shark_award.png", "irene_lightfish_award.png",
        "jack_gill_award.png", "jada_award.png", "jasmine_award.png", "jessica_gill_award.png",
        "kristine_award.png", "lacy_award.png", "legendary_gold_grumpy_award.png", "rare_silver_grumpy_award.png",
        "lisa_award.png", "matilda_award.png", "maz_award.png", "maz_hiding_award.png", "mckenna_award.png",
        "mum_gill_award.png", "ollie_award.png", "orion_award.png", "pauline_award.png", "polly_award.png",
        "puffy_award.png", "ronnie_award.png", "rylee_award.png"
    ];

    const characters = [...characterCards, ...awardCards];
    const getImagePath = (filename) =>
        filename.includes("_award") ? `BADGES/${filename}` : `Gold_Star_Cards/${filename}`;

    const mainContainer = document.getElementById("star-card-collection");
    const awardContainer = document.getElementById("award-collection");
    const collected = JSON.parse(localStorage.getItem("collectedCards")) || [];
    const collectedUnique = [...new Set(collected)];
    const showOnlyCollected = false;

    // Clear containers before rebuilding
    if (mainContainer) mainContainer.innerHTML = "";
    if (awardContainer) awardContainer.innerHTML = "";

    characters.forEach(name => {
        const isAward = name.includes("_award");
        const isCollected = collectedUnique.includes(name);
        if (!isCollected && showOnlyCollected) return;

        const container = isAward ? awardContainer : mainContainer;
        if (!container) return;

        const displayName = name.replace(".png", "").replace(/_/g, " ");
        const card = document.createElement("div");
        card.className = `card ${isAward ? "award-card" : ""} ${isCollected ? "collected" : "locked"}`;
        card.dataset.name = displayName;

        card.innerHTML = `
        <div class="card-inner" title="${isCollected ? 'Unlocked!' : 'Locked. Match to earn.'}">
          <div class="card-front">
            <img src="${getImagePath(name)}" alt="${displayName}">
            <div class="card-name">${displayName}</div>
          </div>
          <div class="card-back">
            <img src="Gold_Star_Cards/card-back.png" alt="Card back">
          </div>
        </div>
      `;

        card.addEventListener("click", () => {
            card.classList.toggle("flipped");
            document.querySelectorAll('.card').forEach(c => c.classList.remove('selected'));
            card.classList.add('selected');
            if (isCollected) {
                speakCardContents(card);
            }
        });

        container.appendChild(card);
    });

    const countEl = document.getElementById("collected-count");
    const totalEl = document.getElementById("total-count");
    const rankEl = document.getElementById("badge-rank");

    if (countEl && totalEl && rankEl) {
        countEl.textContent = `Collected Cards: ${collectedUnique.length}`;
        totalEl.textContent = `Total Available: ${characters.length}`;
        const rank = collectedUnique.length < 5
            ? "Bubble Beginner"
            : collectedUnique.length < 15
                ? "Reef Explorer"
                : "Tidal Titan";
        rankEl.textContent = `Rank: ${rank}`;
    }

    const favoritesContainer = document.getElementById("favorites-container");
    if (favoritesContainer) {
        favoritesContainer.innerHTML = "";
        collectedUnique.slice(0, 3).forEach(name => {
            const card = document.createElement("img");
            card.src = getImagePath(name);
            card.alt = name;
            card.className = "fav-card";
            favoritesContainer.appendChild(card);
        });
    }

    const badgeContainer = document.getElementById("badge-container");
    if (badgeContainer) {
        badgeContainer.innerHTML = "";

        const badges = [
            { threshold: 5, label: "Mini Snapper", icon: "badge_5.png" },
            { threshold: 10, label: "Bubble Collector", icon: "badge_10.png" },
            { threshold: 20, label: "Reef Master", icon: "badge_20.png" },
            { threshold: 26, label: "Grumpy Legend", icon: "badge_all.png" }
        ];

        badges.forEach(badge => {
            const unlocked = collectedUnique.length >= badge.threshold;
            if (unlocked && !document.getElementById(`badge-${badge.label}`)) {
                // 🎉 Confetti celebration for new badge
                confetti({
                    particleCount: 100,
                    spread: 70,
                    origin: { y: 0.6 }
                });
            }

            const badgeEl = document.createElement("div");
            badgeEl.className = "badge";
            badgeEl.innerHTML = `
          <img src="BADGES/${unlocked ? badge.icon : 'locked_badge.png'}" alt="${badge.label}">
          <div class="badge-label">${unlocked ? badge.label : "Locked"}</div>
        `;
            badgeContainer.appendChild(badgeEl);
        });
    }

    function checkCompletionAndShowPopup() {
        const totalStarCards = characterCards.length;
        const matchedStarCards = collectedUnique.filter(name => characterCards.includes(name));
        if (matchedStarCards.length === totalStarCards) {
            document.getElementById("completion-popup").classList.remove("hidden");
        }
    }

    function closePopup() {
        document.getElementById("completion-popup").classList.add("hidden");
    }

    // Run the check once cards are loaded
    checkCompletionAndShowPopup();

    function awardStarCard(cardName) {
        const earnedStarCards = JSON.parse(localStorage.getItem('earnedStarCards')) || [];
        if (!earnedStarCards.includes(cardName)) {
            earnedStarCards.push(cardName);
            localStorage.setItem('earnedStarCards', JSON.stringify(earnedStarCards));

            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 }
            });
        }
    }

});