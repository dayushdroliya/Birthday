
"use strict";


(() => {
    // ===== CONFIGURATION =====

    const PASSWORD = "09092025";

    // 25 October 2026, 12:00 AM India Standard Time
    const REVEAL_AT = new Date(
        "2026-10-24T11:29:00+05:30"
    ).getTime();
    //const REVEAL_AT = 0; // TEMPORARY: testing mode

    const STORAGE_KEY = "bakloliBirthdayUnlocked";

    // ===== ELEMENTS =====

    const passwordScreen = document.getElementById("passwordScreen");
    const countdownScreen = document.getElementById("countdownScreen");
    const birthdaySite = document.getElementById("birthdaySite");

    const passwordForm = document.getElementById("passwordForm");
    const passwordInput = document.getElementById("passwordInput");
    const passwordError = document.getElementById("passwordError");

    const togglePassword = document.getElementById("togglePassword");

    const dayEl = document.getElementById("days");
    const hourEl = document.getElementById("hours");
    const minuteEl = document.getElementById("minutes");
    const secondEl = document.getElementById("seconds");

    let countdownInterval = null;
    let unlocked = false;

    // ===== PASSWORD VISIBILITY =====

    togglePassword.addEventListener("click", () => {
        const showing = passwordInput.type === "text";

        passwordInput.type = showing ? "password" : "text";

        togglePassword.setAttribute(
            "aria-label",
            showing ? "Show password" : "Hide password"
        );

        togglePassword.setAttribute("aria-pressed", String(!showing));

        // Toggle icon without inserting SVG through a template string.
        togglePassword.textContent = showing ? "👁" : "🙈";
    });

    // ===== HELPERS =====

    function showScreen(screen) {
        passwordScreen.classList.add("hidden");
        countdownScreen.classList.add("hidden");
        birthdaySite.classList.add("hidden");

        screen.classList.remove("hidden");
    }

    function pad(value) {
        return String(value).padStart(2, "0");
    }

    // ===== COUNTDOWN =====

    function updateCountdown() {
        const remaining = REVEAL_AT - Date.now();

        if (remaining <= 0) {
            revealBirthday();
            return;
        }

        const totalSeconds = Math.floor(remaining / 1000);

        const days = Math.floor(totalSeconds / 86400);
        const hours = Math.floor((totalSeconds % 86400) / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        dayEl.textContent = pad(days);
        hourEl.textContent = pad(hours);
        minuteEl.textContent = pad(minutes);
        secondEl.textContent = pad(seconds);
    }

    // ===== BIRTHDAY REVEAL =====


    function revealBirthday() {
        if (unlocked) return;

        unlocked = true;

        if (countdownInterval !== null) {
            clearInterval(countdownInterval);
            countdownInterval = null;
        }

        showScreen(birthdaySite);

        // Wait until the birthday page becomes visible
        requestAnimationFrame(() => {
            window.dispatchEvent(new Event("birthday:unlocked"));
        });
    }





    // ===== SUCCESSFUL PASSWORD =====

    function acceptPassword() {
        sessionStorage.setItem(STORAGE_KEY, "true");

        passwordError.textContent = "";

        if (Date.now() >= REVEAL_AT) {
            revealBirthday();
            return;
        }

        showScreen(countdownScreen);

        updateCountdown();

        if (!unlocked) {
            countdownInterval = setInterval(updateCountdown, 1000);
        }
    }

    // ===== FORM SUBMISSION =====

    passwordForm.addEventListener("submit", (event) => {
        event.preventDefault();

        if (passwordInput.value === PASSWORD) {
            acceptPassword();
        } else {
            passwordError.textContent =
                "Not quite right. Try again, you got this. ✦";

            passwordInput.value = "";
            passwordInput.focus();
        }
    });

    // ===== INITIAL STATE =====

    const alreadyUnlocked = false;

    if (alreadyUnlocked) {
        if (Date.now() >= REVEAL_AT) {
            revealBirthday();
        } else {
            showScreen(countdownScreen);
            updateCountdown();
            countdownInterval = setInterval(updateCountdown, 1000);
        }
    } else {
        showScreen(passwordScreen);
    }
})();
