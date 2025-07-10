document.addEventListener('DOMContentLoaded', () => {
    const badgeContainer = document.getElementById('award-container');
    const badgeCountText = document.getElementById('collected-badge-count');
    const badgeRank = document.getElementById('badge-rank');
    const collectedStarContainer = document.getElementById('collected-star-cards');
    const collectedCardCount = document.getElementById('collected-card-count');
    const totalCardCount = document.getElementById('total-card-count');

    const earnedBadges = JSON.parse(localStorage.getItem('earnedBadges')) || [];
    const earnedStarCards = JSON.parse(localStorage.getItem('earnedStarCards')) || [];
    const totalCards = 26;

    // 🏅 Update badge count
    badgeCountText.textContent = `Collected Badges: ${earnedBadges.length}`;

    function getRank(count) {
        if (count === 0) return 'Bubble Beginner';
        if (count < 5) return 'Friendly Fin';
        if (count < 10) return 'Reef Rookie';
        if (count < 20) return 'Tide Tamer';
        return 'Gold-Star Master';
    }

    // 🧜‍♂️ Show badge rank
    badgeRank.textContent = `Badge Rank: ${getRank(earnedBadges.length)}`;

    // 🥇 Render earned badges
    badgeContainer.innerHTML = "";
    if (earnedBadges.length === 0) {
        badgeContainer.innerHTML = "<p>No badges earned yet. Play the Snap game to unlock some!</p>";
    } else {
        earnedBadges.forEach(badgePath => {
            const badge = document.createElement('div');
            badge.classList.add('badge');
            const name = badgePath.split('/').pop().replace('.png', '').replace(/[_-]/g, ' ');
            badge.innerHTML = `
              <img src="${badgePath}" alt="${name}">
              <div class="badge-label">${name}</div>
            `;

            // ✅ Add popup logic to each badge
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

    // 🎯 Unlock card + confetti
    function unlockStarCard(cardName) {
        const earnedStarCards = JSON.parse(localStorage.getItem('earnedStarCards')) || [];
        const alreadyEarned = earnedStarCards.includes(cardName);

        if (!alreadyEarned) {
            earnedStarCards.push(cardName);
            localStorage.setItem('earnedStarCards', JSON.stringify(earnedStarCards));

            // 🎉 Confetti burst
            confetti({
                particleCount: 120,
                spread: 90,
                origin: { y: 0.6 },
                scalar: 1.2
            });

            // Optional popup or sound here
        }
    }

    // ✨ Badge popup close
    function closeBadgePopup() {
        document.getElementById("badge-popup").classList.add("hidden");
    }
    window.closeBadgePopup = closeBadgePopup;
});