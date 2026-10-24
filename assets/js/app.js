"use strict";

(() => {
const song = document.getElementById("birthdaySong");
const playButton = document.getElementById("playSong");
const pauseButton = document.getElementById("pauseSong");
const status = document.getElementById("songStatus");
const headerSongToggle = document.getElementById("headerSongToggle");
const headerSongIcon = document.getElementById("headerSongIcon");
const headerSongLabel = document.getElementById("headerSongLabel");

function updateSongControls() {
if (!song) return;

const isPlaying = !song.paused && !song.ended;

if (headerSongToggle) {
headerSongToggle.setAttribute("aria-pressed", String(isPlaying));
headerSongToggle.setAttribute(
"aria-label",
isPlaying ? "Pause birthday song" : "Play birthday song"
);
}

if (headerSongIcon) {
headerSongIcon.textContent = isPlaying ? "Ⅱ" : "▶";
}

if (headerSongLabel) {
headerSongLabel.textContent = isPlaying ? "Pause song" : "Play song";
}

if (playButton) {
playButton.textContent = isPlaying ? "♫ Song is playing" : "▶ Play your song";
}
}

if (song) {
song.addEventListener("play", updateSongControls);
song.addEventListener("pause", updateSongControls);
song.addEventListener("ended", updateSongControls);
}

if (headerSongToggle && song) {
headerSongToggle.addEventListener("click", async () => {
if (song.paused || song.ended) {
try {
if (song.ended) song.currentTime = 0;
await song.play();
if (status) status.textContent = "Your birthday melody is playing. ♡";
} catch (error) {
if (status) status.textContent = "Song play nahi hua. Neeche Play button try karo.";
console.error("Song playback failed:", error);
}
} else {
song.pause();
}

updateSongControls();

});
}

updateSongControls();

// Try starting the song when the birthday page opens.
window.addEventListener("birthday:unlocked", async () => {
if (!song) return;

try {
song.currentTime = 0;
await song.play();

if (status) {
  status.textContent = "Your birthday melody is playing. ♡";
}

if (playButton) {
  playButton.textContent = "♫ Song is playing";
}

} catch (error) {
console.info("Browser blocked autoplay. Waiting for a play-button click.");

if (status) {
  status.textContent = "Tap play to hear your birthday song. ♡";
}

}
});

if (song && playButton && pauseButton && status) {
playButton.addEventListener("click", async () => {
try {
await song.play();
status.textContent = "Playing your birthday song ♪";
playButton.textContent = "♫ Song is playing";
} catch (error) {
console.error("Audio playback error:", error);

    status.textContent =
      "Song play nahi hua. File location aur filename check karo.";

    playButton.textContent = "▶ Try playing again";
  }
});

pauseButton.addEventListener("click", () => {
  song.pause();
  playButton.textContent = "▶ Play your song";
  status.textContent = "Paused. Play again whenever you like. ♡";
});

song.addEventListener("ended", () => {
  playButton.textContent = "▶ Play your song";
  status.textContent = "Hope this little melody made you smile. ♡";
});

song.addEventListener("error", () => {
  status.textContent =
    "Audio load nahi ho raha. birthday-song.mp3 ka path check karo.";

  console.error("Audio failed to load:", song.error);
});


}

// Smooth navigation to page sections.
document.querySelectorAll('.site-header a[href^="#"]').forEach((link) => {
link.addEventListener("click", (event) => {
const target = document.querySelector(link.getAttribute("href"));

  if (target) {
    event.preventDefault();

    target.scrollIntoView({
      behavior: window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches ? "auto" : "smooth",
      block: "start"
    });
  }
});

});

// Update the footer year automatically.
const footer = document.querySelector(".site-footer");

if (footer) {
footer.textContent = "Crafted with care, just for Bakloli. 💚";
}
/* ===== MAKE A WISH INTERACTION ===== */

const cakeButton = document.getElementById("cakeButton");
const cakeCard = document.querySelector(".cake-card");
const cakeInstruction = document.getElementById("cakeInstruction");
const cakeWishMessage = document.getElementById("cakeWishMessage");

if (cakeButton && cakeCard && cakeWishMessage) {
cakeButton.addEventListener("click", () => {
if (cakeCard.classList.contains("wish-made")) return;


cakeCard.classList.add("wish-made");
cakeButton.setAttribute("aria-label", "Birthday candles blown out");

if (cakeInstruction) {
  cakeInstruction.textContent = "Wish made? Keep it a little secret. 🤍";
}

cakeWishMessage.textContent =
  "I hope life gives you a thousand reasons to smile. ✨";

if (typeof window.birthdayConfetti === "function") {
  window.birthdayConfetti();
}


});
}

/* ===== SECRET LETTER WITH HANDWRITTEN TYPING EFFECT ===== */

(() => {
  const envelopeButton = document.getElementById("openEnvelope");
  const letterElement = document.getElementById("handwrittenLetter");
  const closeEnvelopeButton = document.getElementById("closeEnvelope");
  const letterCopy = letterElement?.querySelector(".handwritten-copy");

  if (!envelopeButton || !letterElement || !letterCopy) return;

  // Save the original paragraphs without losing emojis or HTML formatting.
  const originalParagraphs = Array.from(letterCopy.querySelectorAll("p")).map(
    (paragraph) => paragraph.innerHTML
  );

  let typingTimer = null;
  let typingSession = 0;
  let hasTyped = false;

  function stopTyping() {
    typingSession++;

    if (typingTimer !== null) {
      clearTimeout(typingTimer);
      typingTimer = null;
    }

    letterCopy.classList.remove("is-typing");
  }

  function restoreLetter() {
    letterCopy.innerHTML = "";

    originalParagraphs.forEach((html) => {
      const paragraph = document.createElement("p");
      paragraph.innerHTML = html;
      letterCopy.appendChild(paragraph);
    });
  }

  function startTyping() {
    stopTyping();

    const session = typingSession;
    letterCopy.replaceChildren();

    const paragraphs = originalParagraphs.map((html) => {
      const template = document.createElement("template");
      template.innerHTML = html;

      const paragraph = document.createElement("p");
      paragraph.dataset.fullText = template.content.textContent || "";
      paragraph.textContent = "";

      letterCopy.appendChild(paragraph);
      return paragraph;
    });

    letterCopy.classList.add("is-typing");

    let paragraphIndex = 0;
    let characterIndex = 0;

    // Use Unicode code points so emojis don't break into partial characters.
    const paragraphTexts = paragraphs.map((paragraph) =>
      Array.from(paragraph.dataset.fullText)
    );

    function typeNext() {
      if (session !== typingSession) return;

      if (paragraphIndex >= paragraphs.length) {
        letterCopy.classList.remove("is-typing");
        typingTimer = null;
        hasTyped = true;
        return;
      }

      const paragraph = paragraphs[paragraphIndex];
      const characters = paragraphTexts[paragraphIndex];

      if (characterIndex < characters.length) {
        paragraph.textContent += characters[characterIndex];
        characterIndex++;

        typingTimer = window.setTimeout(typeNext, 32);
      } else {
        paragraphIndex++;
        characterIndex = 0;

        // Keep the original paragraph spacing from the existing CSS.
        typingTimer = window.setTimeout(typeNext, 260);
      }
    }

    typeNext();
  }

  // OPEN ENVELOPE
  envelopeButton.addEventListener("click", () => {
    if (envelopeButton.classList.contains("is-open")) return;

    envelopeButton.classList.add("is-open");
    envelopeButton.setAttribute("aria-expanded", "true");

    const hint = envelopeButton.querySelector(".envelope-hint");
    if (hint) hint.textContent = "A little letter, just for you ♡";

    letterElement.hidden = false;

    // Restart the typewriter effect every time the letter is opened.
    hasTyped = false;

    window.setTimeout(() => {
      if (letterElement.hidden) return;

      startTyping();

      letterElement.scrollIntoView({
        behavior: window.matchMedia(
          "(prefers-reduced-motion: reduce)"
        ).matches ? "auto" : "smooth",
        block: "center"
      });
    }, 750);
  });

  // CLOSE ENVELOPE
  if (closeEnvelopeButton) {
    closeEnvelopeButton.addEventListener("click", () => {
      stopTyping();

      letterElement.hidden = true;
      envelopeButton.classList.remove("is-open");
      envelopeButton.setAttribute("aria-expanded", "false");

      const hint = envelopeButton.querySelector(".envelope-hint");
      if (hint) hint.textContent = "Tap to open 💌";

      restoreLetter();
      hasTyped = false;

      envelopeButton.scrollIntoView({
        behavior: window.matchMedia(
          "(prefers-reduced-motion: reduce)"
        ).matches ? "auto" : "smooth",
        block: "center"
      });
    });
  }
})();

// ===== HANDWRITTEN LETTER TYPEWRITER =====
(() => {
  const envelope = document.getElementById("letterEnvelope");
  const letter = document.getElementById("secretLetter");

  if (!envelope || !letter) return;

  const originalText = letter.innerText;
  let typingTimer = null;
  let hasTyped = false;

  function typeLetter() {
    if (hasTyped) return;

    hasTyped = true;
    letter.textContent = "";

    let index = 0;

    function typeNextCharacter() {
      if (index >= originalText.length) {
        clearTimeout(typingTimer);
        typingTimer = null;
        return;
      }

      letter.textContent += originalText.charAt(index);
      index++;

      // Slightly slower for a natural handwritten feel.
      typingTimer = setTimeout(typeNextCharacter, 38);
    }

    typeNextCharacter();
  }

  envelope.addEventListener("click", () => {
    // Start only after the existing code opens the letter.
    setTimeout(typeLetter, 700);
  });
})();


})();
