document.addEventListener('DOMContentLoaded', () => {

    // ✅ Voice Initialization – load voices as soon as available
window.speechSynthesis.onvoiceschanged = () => {
    console.log("✅ Voices initialized:", speechSynthesis.getVoices().length);
    speechSynthesis.getVoices(); // triggers loading
};

// ✅ Customize Voice Style by Reward Type
function getVoiceProfile(type) {
    if (type === "star") return { rate: 1.2, pitch: 1.4 };
    if (type === "badge") return { rate: 0.9, pitch: 1.0 };
    return { rate: 1, pitch: 1 };
}

// ✅ Speak Text with Dynamic Voice and Retry
function speakText(message, type = "default") {
    const utterance = new SpeechSynthesisUtterance(message);

    const trySpeak = () => {
        const voices = speechSynthesis.getVoices();
        const voice = voices.find(v => v.lang === 'en-AU') || voices[0];

        if (!voice) {
            console.warn("🗣️ No voice available — retrying...");
            setTimeout(trySpeak, 100);
            return;
        }

        const profile = getVoiceProfile(type);
        utterance.voice = voice;
        utterance.lang = voice.lang;
        utterance.rate = profile.rate;
        utterance.pitch = profile.pitch;

        console.log(`📢 Speaking: "${message}" with voice ${voice.name}`);
        speechSynthesis.speak(utterance);
    };

    trySpeak();
}
    // === 🎴 Gold Star Snap Game ===
    const board = document.getElementById('game-board');
    const unlockedCard = document.getElementById('unlocked-card');
    const spinResult = document.getElementById('spin-result');
    const canvas = document.getElementById('wheel-canvas');
    const spinButton = document.getElementById('spin-button');
    document.addEventListener('DOMContentLoaded', () => {
        const bgMusic = document.getElementById('bg-music');
        const toggleBtn = document.getElementById('toggle-music');

        let musicPlaying = true;

        toggleBtn.addEventListener('click', () => {
            if (musicPlaying) {
                bgMusic.pause();
                toggleBtn.textContent = '🔇 Music On';
            } else {
                bgMusic.play().catch(err => console.warn("🎵 Music play failed:", err));
                toggleBtn.textContent = '🔊 Music Off';
            }
            musicPlaying = !musicPlaying;
        });
    });

    const characterImages = [
        'Gold_Star_Cards/grumpy.png', 'Gold_Star_Cards/bon_bon.png', 'Gold_Star_Cards/craig_gold_star.png',
        'Gold_Star_Cards/dad_gill.png', 'Gold_Star_Cards/destiny.png', 'Gold_Star_Cards/happy_grumpy.png',
        'Gold_Star_Cards/irene_lightfish.png', 'Gold_Star_Cards/jack_gill.png', 'Gold_Star_Cards/jada.png',
        'Gold_Star_Cards/jasmine.png', 'Gold_Star_Cards/jessica_gill.png', 'Gold_Star_Cards/kristine.png',
        'Gold_Star_Cards/lacy.png', 'Gold_Star_Cards/lisa.png', 'Gold_Star_Cards/matilda.png',
        'Gold_Star_Cards/maz.png', 'Gold_Star_Cards/maz_hiding.png', 'Gold_Star_Cards/mckenna.png',
        'Gold_Star_Cards/mum_gill.png', 'Gold_Star_Cards/ollie.png', 'Gold_Star_Cards/orion.png',
        'Gold_Star_Cards/pauline.png', 'Gold_Star_Cards/polly.png', 'Gold_Star_Cards/puffy.png',
        'Gold_Star_Cards/ronnie.png', 'Gold_Star_Cards/rylee.png'
    ];

    const badgePool = [
        'BADGES/bon_bon_award.png', 'BADGES/craig_award.png', 'BADGES/dad_gill_award.png',
        'BADGES/destiny_award.png', 'BADGES/grumpy_shark_award.png', 'BADGES/happy_grumpy_shark_award.png',
        'BADGES/maz_hiding_award.png', 'BADGES/irene_lightfish_award.png', 'BADGES/jack_gill_award.png',
        'BADGES/jada_award.png', 'BADGES/jasmine_award.png', 'BADGES/jessica_gill_award.png',
        'BADGES/kristine_award.png', 'BADGES/lacy_award.png', 'BADGES/legendary_gold_grumpy_award.png',
        'BADGES/rare_silver_grumpy_award.png',  // This is the new rare badge
        'BADGES/lisa_award.png', 'BADGES/matilda_award.png', 'BADGES/maz_award.png',
        'BADGES/mckenna_award.png', 'BADGES/mum_gill_award.png', 'BADGES/ollie_award.png',
        'BADGES/orion_award.png', 'BADGES/pauline_award.png', 'BADGES/polly_award.png',
        'BADGES/puffy_award.png', 'BADGES/ronnie_award.png', 'BADGES/rylee_award.png'
    ];

    let matchCount = 0;
    const matchCountDisplay = document.getElementById("match-count");
    const statusText = document.getElementById("status-text");
    const flippedCards = [];
    const cards = [...characterImages, ...characterImages].sort(() => 0.5 - Math.random());

    function getCardName(imagePath) {
        return imagePath
            .split('/').pop().replace('.png', '')
            .replace(/[_-]/g, ' ')
            .replace(/\b\w/g, c => c.toUpperCase());
    }

    function unlockBadgeReward() {
        const allCardsCollected = (JSON.parse(localStorage.getItem('earnedStarCards')) || []).length === 26;
        const allBadgesCollected = (JSON.parse(localStorage.getItem('earnedBadges')) || []).length === 26;

        const legendaryPath = 'BADGES/legendary_gold_grumpy_award.png';
        let earnedBadges = JSON.parse(localStorage.getItem('earnedBadges')) || [];

        if (allCardsCollected && allBadgesCollected && !earnedBadges.includes(legendaryPath)) {
            earnedBadges.push(legendaryPath);
            localStorage.setItem('earnedBadges', JSON.stringify(earnedBadges));
            unlockedCard.innerHTML = `
            <h3>🎉 You did it!</h3>
            <p>You've collected every badge and every card!</p>
            <img src="${legendaryPath}" alt="Legendary Gold Grumpy Shark"
              style="width: 180px; border-radius: 12px; box-shadow: 0 0 20px gold;" />
          `;
            launchConfetti(); // optional: burst celebration
        } else {
            // Fallback: reward a random badge if legendary isn't ready

            let available = badgePool.filter(path => !earnedBadges.includes(path));
            const randomBadge = available[Math.floor(Math.random() * available.length)];
            earnedBadges.push(randomBadge);
            localStorage.setItem('earnedBadges', JSON.stringify(earnedBadges));
            unlockedCard.innerHTML = `
            <h3>🏅 You've earned a new badge!</h3>
            <img src="${randomBadge}" alt="New Badge"
              style="width: 150px; border-radius: 10px; box-shadow: 0 0 12px gold;" />
          `;
        }
    }

    cards.forEach((imagePath) => {
        const card = document.createElement('div');
        card.className = 'card';
        card.setAttribute('aria-label', getCardName(imagePath));

        card.innerHTML = `
            <div class="card-inner">
              <div class="card-front" style="background: url('Gold_Star_Cards/card-back.png') center/cover no-repeat;"></div>
              <div class="card-back" style="background: url('${imagePath}') center/cover no-repeat;"></div>
            </div>
        `;

        card.addEventListener('click', () => {
            if (card.classList.contains('flipped') || flippedCards.length === 2) return;

            card.classList.add('flipped');
            flippedCards.push({ element: card, image: imagePath });

            if (flippedCards.length === 2) {
                const [first, second] = flippedCards;

                if (first.image === second.image) {
                    setTimeout(() => {
                        matchCount++;
                        matchCountDisplay.textContent = matchCount;
                        statusText.textContent = `✅ Matched: ${getCardName(first.image)}!`;
                        flippedCards.splice(0, flippedCards.length);

                        if (matchCount === characterImages.length) {
                            statusText.textContent = `🎉 You've matched all Gold-Star cards!`;
                            unlockBadgeReward();
                        }
                    }, 300);
                } else {
                    statusText.textContent = `❌ Not a match. Try again!`;
                    setTimeout(() => {
                        first.element.classList.remove('flipped');
                        second.element.classList.remove('flipped');
                        flippedCards.splice(0, flippedCards.length);
                        statusText.textContent = 'Flip two cards to find a match.';
                    }, 1000);
                }
            }
        });

        board.appendChild(card);
    });

    // === 🎡 Spin the Reef Wheel ===
    if (canvas && spinButton) {
        const ctx = canvas.getContext('2d');
        const radius = canvas.width / 2;
        const starPrizes = characterImages.map(path => path.split('/').pop());

        function drawWheel() {
            const segmentAngle = (2 * Math.PI) / starPrizes.length;
            for (let i = 0; i < starPrizes.length; i++) {
                const angle = i * segmentAngle;
                ctx.fillStyle = i % 2 === 0 ? '#FDD835' : '#FFF176';
                ctx.beginPath();
                ctx.moveTo(radius, radius);
                ctx.arc(radius, radius, radius, angle, angle + segmentAngle);
                ctx.lineTo(radius, radius);
                ctx.fill();

                ctx.save();
                ctx.translate(radius, radius);
                ctx.rotate(angle + segmentAngle / 2);
                ctx.fillStyle = "#333";
                ctx.font = "12px Arial";
                ctx.textAlign = "right";
                ctx.fillText(starPrizes[i].replace(".png", "").replace(/_/g, " "), radius - 10, 5);
                ctx.restore();
            }
        }

        drawWheel();

        function canSpinToday() {
            const lastSpin = parseInt(localStorage.getItem("lastSpinTimestamp") || "0", 10);
            const now = Date.now();
            const nextSpin = lastSpin + 24 * 60 * 60 * 1000;

            if (now < nextSpin) {
                alert("🎡 You've already spun the Reef Wheel today! Come back tomorrow.");
                return false;
            }

            localStorage.setItem("lastSpinTimestamp", now.toString());
            return true;
        }

        function updateSpinTimer() {
            const timerEl = document.getElementById("spin-timer");
            const lastSpin = parseInt(localStorage.getItem("lastSpinTimestamp") || "0", 10);
            const now = Date.now();
            const nextSpin = lastSpin + 24 * 60 * 60 * 1000;
            const diff = nextSpin - now;

            if (diff <= 0) {
                timerEl.textContent = "";
                return;
            }

            const hours = Math.floor(diff / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            timerEl.textContent = `🕒 Next spin in: ${hours}h ${minutes}m`;
        }

        updateSpinTimer();
setInterval(updateSpinTimer, 60000);

// 🌀 Spin logic
spinButton.addEventListener("click", () => {
    if (!canSpinToday()) return;

    const spinRounds = 5 + Math.floor(Math.random() * 5);
    const prizeIndex = Math.floor(Math.random() * starPrizes.length);
    const degreesPerPrize = 360 / starPrizes.length;
    const finalRotation = 360 * spinRounds - (prizeIndex * degreesPerPrize) - degreesPerPrize / 2;

    canvas.style.transition = "transform 4s ease-out";
    canvas.style.transform = `rotate(${finalRotation}deg)`;

    setTimeout(() => {
        const prize = starPrizes[prizeIndex];
        const path = `Gold_Star_Cards/${prize}`;
        const cleanPrize = prize.replace(".png", "").replace(/_/g, " ");

        const earned = JSON.parse(localStorage.getItem("earnedStarCards")) || [];
        const earnedBadges = JSON.parse(localStorage.getItem("earnedBadges")) || [];

        if (!earned.includes(prize)) {
            // ✅ Trigger Gold Star reward
            awardStarCard(cleanPrize);

            spinResult.textContent = `🎉 You won: ${cleanPrize}!`;
            unlockedCard.innerHTML = `
                <img src="${path}" alt="You won ${prize}. Check your profile page" class="card-preview glow">
            `;

            // Optional custom handler
            if (typeof awards === "function") awards(cleanPrize);
        } else {
            // ✅ Fallback badge logic
            const available = badgePool.filter(path => !earnedBadges.includes(path));
            const randomBadge = available[Math.floor(Math.random() * available.length)];
            earnedBadges.push(randomBadge);
            localStorage.setItem("earnedBadges", JSON.stringify(earnedBadges));

            const badgeName = randomBadge.split('/').pop().replace(".png", "").replace(/_/g, " ");

            unlockedCard.innerHTML = `
                <h3>🎉 A badge won! Check your profile page!</h3>
                <img src="${randomBadge}" alt="New Badge"
                    style="width: 150px; border-radius: 10px; box-shadow: 0 0 12px gold;" />
            `;

            narrateReward("badge", badgeName);
        }

        launchConfetti();
        updateSpinTimer();

        setTimeout(() => {
            const img = document.querySelector('.card-preview');
            if (img) img.classList.remove('glow');
        }, 1600);
    }, 4100);
});

// ✅ Narration Helpers
function narrateReward(type, name) {
    let message = "";

    if (type === "star") {
        message = `You've earned a Gold Star card for ${name}!`;
    } else if (type === "badge") {
        message = `You've unlocked a new badge: ${name}.`;
    } else {
        message = `You've earned a new reward: ${name}.`;
    }

    speakText(message, type);
}

function awardStarCard(cardName) {
    const earnedStarCards = JSON.parse(localStorage.getItem('earnedStarCards')) || [];

    if (!cardName || typeof cardName !== "string") return;

    if (!earnedStarCards.includes(cardName)) {
        earnedStarCards.push(cardName);
        localStorage.setItem('earnedStarCards', JSON.stringify(earnedStarCards));

        narrateReward("star", cardName);

        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
        });
    }
}

// ✅ Award Badge
function awardBadge(cardName) {
    const earnedBadges = JSON.parse(localStorage.getItem('earnedBadges')) || [];
    const cleanName = cardName.split('/').pop();

    if (!earnedBadges.includes(cleanName)) {
        earnedBadges.push(cleanName);
        localStorage.setItem('earnedBadges', JSON.stringify(earnedBadges));

        narrateReward("badge", cleanName);

        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
        });
    }
}
    }

    // 🎊 Confetti Effect
    function launchConfetti() {
        const container = document.createElement("div");
        container.style.position = "absolute";
        container.style.top = "0";
        container.style.left = "0";
        container.style.width = "100%";
        container.style.height = "100%";
        container.style.pointerEvents = "none";
        container.style.zIndex = "9999";

        for (let i = 0; i < 30; i++) {
            const piece = document.createElement("div");
            piece.className = "confetti-piece";
            piece.style.position = "absolute";
            piece.style.width = "10px";
            piece.style.height = "10px";
            piece.style.background = `hsl(${Math.random() * 360}, 100%, 60%)`;
            piece.style.left = `${Math.random() * 100}%`;
            piece.style.top = `${Math.random() * -20}px`;
            piece.style.opacity = "1";
            piece.style.borderRadius = "50%";
            piece.style.animation = "confetti-fall 2s ease-out forwards";
            piece.style.transform = `rotate(${Math.random() * 360}deg)`;

            container.appendChild(piece);
        }

        document.body.appendChild(container);
        setTimeout(() => container.remove(), 2500);
    }

    function awardBadge(characterName) {
        const audio = document.getElementById('badgeAudio');
        const announcement = document.getElementById('announcementText');

        // Set text
        announcement.textContent = `Wow AMAZING! You won ${characterName}'s Gold Star Award Badge!`;

        // Ensure audio plays from the start
        audio.currentTime = 0;
        audio.play().catch(err => {
            console.warn("🔇 Audio blocked:", err);

        });
    }


    function stopMusicOnly() {
        const bgMusic = document.getElementById('bg-music');
        const toggleBtn = document.getElementById('toggle-music');

        if (bgMusic && !bgMusic.paused) {
            bgMusic.pause();
            if (toggleBtn) toggleBtn.textContent = '🔇 Music On';
            console.log("🎵 Background music stopped");
        } else {
            console.log("🎵 Music already paused");
        }
    }
    window.stopMusicOnly = stopMusicOnly;

    function startMusic() {
        const bgMusic = document.getElementById('bg-music');
        const toggleBtn = document.getElementById('toggle-music');

        if (bgMusic && bgMusic.paused) {
            bgMusic.play().catch(err => console.warn("🎵 Music play failed:", err));
            if (toggleBtn) toggleBtn.textContent = '🔊 Music Off';
            console.log("🎵 Background music started");
        } else {
            console.log("🎵 Music already playing");
        }
    }
    window.startMusic = startMusic;

})