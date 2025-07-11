document.addEventListener('DOMContentLoaded', () => {
    const badgeContainer = document.getElementById('award-container');
    const badgeCountText = document.getElementById('collected-badge-count');
    const badgeRank = document.getElementById('badge-rank');
    const collectedStarContainer = document.getElementById('collected-star-cards');
    const collectedCardCount = document.getElementById('collected-card-count');
    const totalCardCount = document.getElementById('total-card-count');

    const awardCards = [
        "bon_bon_award.png", "craig_award.png", "dad_gill_award.png", "destiny_award.png",
        "grumpy_shark_award.png", "happy_grumpy_shark_award.png", "irene_lightfish_award.png",
        "jack_gill_award.png", "jada_award.png", "jasmine_award.png", "jessica_gill_award.png",
        "kristine_award.png", "lacy_award.png", "legendary_gold_grumpy_award.png", "rare_silver_grumpy_award.png",
        "lisa_award.png", "matilda_award.png", "maz_award.png", "maz_hiding_award.png", "mckenna_award.png",
        "mum_gill_award.png", "ollie_award.png", "orion_award.png", "pauline_award.png", "polly_award.png",
        "puffy_award.png", "ronnie_award.png", "rylee_award.png"
    ];

    const totalCards = 26;

    // 🐚 Load and normalize earned data
    const earnedStarCards = JSON.parse(localStorage.getItem('earnedStarCards')) || [];
    const earnedBadgesRaw = JSON.parse(localStorage.getItem('earnedBadges')) || [];
    const earnedBadges = earnedBadgesRaw.map(b => b.split('/').pop()); // strip any folder prefixes

    // 🏅 Update badge count
    badgeCountText.textContent = `Collected Badges: ${earnedBadges.length}`;

    // 🧜‍♀️ Rank logic
    function getRank(count) {
        if (count === 0) return 'Bubble Beginner';
        if (count < 5) return 'Friendly Fin';
        if (count < 10) return 'Reef Rookie';
        if (count < 20) return 'Tide Tamer';
        return 'Gold-Star Master';
    }
    badgeRank.textContent = `Badge Rank: ${getRank(earnedBadges.length)}`;

    const totalBadgeCount = document.getElementById('total-badge-count');
    const remainingBadges = awardCards.length - earnedBadges.length;

    totalBadgeCount.textContent =
        remainingBadges === 0
            ? `🎉 Collection Complete! All ${awardCards.length} badges earned!`
            : `Remaining Badges: ${remainingBadges} / ${awardCards.length}`;

    // 🥇 Render earned badges
    badgeContainer.innerHTML = "";
    if (earnedBadges.length === 0) {
        badgeContainer.innerHTML = "<p>No badges earned yet. Play the Snap game to unlock some!</p>";
    } else {
        earnedBadges.forEach(badgeFile => {
            const badge = document.createElement('div');
            badge.classList.add('badge', 'earned'); // ✅ Apply earned styling class

            const name = badgeFile.replace('.png', '').replace(/[_-]/g, ' ');
            badge.innerHTML = `
        <img src="BADGES/${badgeFile}" alt="${name}">
        <div class="badge-label">${name}</div>
      `;

            // 🎉 Add popup interaction
            badge.addEventListener("click", () => {
                const popup = document.getElementById("badge-popup");
                popup.querySelector("h2").textContent = "🎉 Great Work!";
                popup.querySelector("p").textContent = `You won the "${name}" badge!`;
                popup.classList.remove("hidden");
            });

            badgeContainer.appendChild(badge);
        });
    }

    // 🎴 Render Gold Star Cards
    collectedStarContainer.innerHTML = "";
    const remaining = totalCards - earnedStarCards.length;

    if (earnedStarCards.length === 0) {
        collectedStarContainer.innerHTML = "<p>No Gold Star Cards collected yet. Spin the Reef Wheel to earn some!</p>";
    } else {
        earnedStarCards.forEach(filename => {
            const displayName = filename.replace(".png", "").replace(/_/g, " ");
            const card = document.createElement("div");
            card.className = "card collected";
            card.innerHTML = `
        <div class="card-inner">
          <div class="card-front">
            <img src="Gold_Star_Cards/${filename}" alt="${displayName}">
            <div class="card-name">${displayName}</div>
          </div>
        </div>
      `;
            collectedStarContainer.appendChild(card);
        });
    }

    // 📊 Card collection stats
    collectedCardCount.textContent = `Collected Cards: ${earnedStarCards.length}`;
    totalCardCount.textContent = remaining === 0
        ? `🎉 Collection Complete! All ${totalCards} cards collected!`
        : `Remaining Cards: ${remaining} / ${totalCards}`;

    // 🎯 Unlock card logic
    function unlockStarCard(cardName) {
        const earnedStarCards = JSON.parse(localStorage.getItem('earnedStarCards')) || [];
        if (!earnedStarCards.includes(cardName)) {
            earnedStarCards.push(cardName);
            localStorage.setItem('earnedStarCards', JSON.stringify(earnedStarCards));

            confetti({
                particleCount: 120,
                spread: 90,
                origin: { y: 0.6 },
                scalar: 1.2
            });
        }
    }

    // ✨ Badge popup close
    function closeBadgePopup() {
        document.getElementById("badge-popup").classList.add("hidden");
    }
    window.closeBadgePopup = closeBadgePopup;
});