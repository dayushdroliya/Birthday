
"use strict";

(() => {
  const canvas = document.getElementById("confettiCanvas");

  if (!canvas) {
    console.warn("Confetti canvas not found.");
    return;
  }

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  let particles = [];
  let animationFrame = null;
  let running = false;

  const colors = [
    "#c9948d",
    "#e8c9bd",
    "#b69b70",
    "#f1dfda",
    "#ffffff"
  ];

  function resizeCanvas() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    canvas.width = Math.floor(window.innerWidth * dpr);
    canvas.height = Math.floor(window.innerHeight * dpr);

    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function createParticle(originX, originY) {
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 9 + 3;
    const size = Math.random() * 7 + 3;

    return {
      x: originX,
      y: originY,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 3,
      gravity: 0.16 + Math.random() * 0.1,
      size,
      rotation: Math.random() * Math.PI,
      rotationSpeed: (Math.random() - 0.5) * 0.2,
      color: colors[Math.floor(Math.random() * colors.length)],
      opacity: 1,
      shape: Math.random() > 0.5 ? "circle" : "rect"
    };
  }

  function drawParticle(p) {
    ctx.save();

    ctx.globalAlpha = Math.max(0, p.opacity);
    ctx.fillStyle = p.color;
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rotation);

    if (p.shape === "circle") {
      ctx.beginPath();
      ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.fillRect(
        -p.size / 2,
        -p.size / 2,
        p.size,
        p.size * 1.5
      );
    }

    ctx.restore();
  }

  function animate() {
    if (!running) return;

    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

    particles.forEach((p) => {
      p.x += p.vx;
      p.y += p.vy;

      p.vy += p.gravity;
      p.vx *= 0.99;
      p.rotation += p.rotationSpeed;

      if (p.y > window.innerHeight * 0.65) {
        p.opacity -= 0.012;
      }

      drawParticle(p);
    });

    particles = particles.filter(
      (p) =>
        p.opacity > 0 &&
        p.y < window.innerHeight + 50 &&
        p.x > -50 &&
        p.x < window.innerWidth + 50
    );

    if (particles.length > 0) {
      animationFrame = requestAnimationFrame(animate);
    } else {
      running = false;
      animationFrame = null;
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    }
  }

  function burst(originX, originY) {
    // Stop the previous burst before starting a new one.
    if (animationFrame !== null) {
      cancelAnimationFrame(animationFrame);
      animationFrame = null;
    }

    resizeCanvas();

    const x = originX ?? window.innerWidth / 2;
    const y = originY ?? window.innerHeight * 0.35;

    particles = Array.from(
      { length: 160 },
      () => createParticle(x, y)
    );

    running = true;
    animate();
  }

  window.addEventListener("resize", resizeCanvas);
  resizeCanvas();

  // Birthday countdown celebration.
  window.birthdayConfetti = () => burst();

  // Optional: trigger a burst at any screen position.
  window.birthdayConfettiAt = (x, y) => burst(x, y);
})();
/* ===== BIRTHDAY UNLOCK CELEBRATION ===== */
(() => {
  let celebrationStarted = false;
  let soundContext = null;

  function playPartySound() {
    try {
      const AudioContextClass =
        window.AudioContext || window.webkitAudioContext;

      if (!AudioContextClass) return;

      if (!soundContext) {
        soundContext = new AudioContextClass();
      }

      const play = () => {
        const now = soundContext.currentTime;

        [0, 0.18, 0.36].forEach((delay, index) => {
          const oscillator = soundContext.createOscillator();
          const gain = soundContext.createGain();

          oscillator.type = "sine";
          oscillator.frequency.setValueAtTime(
            680 + index * 180,
            now + delay
          );
          oscillator.frequency.exponentialRampToValueAtTime(
            180,
            now + delay + 0.12
          );

          gain.gain.setValueAtTime(0.0001, now + delay);
          gain.gain.exponentialRampToValueAtTime(
            0.18,
            now + delay + 0.01
          );
          gain.gain.exponentialRampToValueAtTime(
            0.0001,
            now + delay + 0.14
          );

          oscillator.connect(gain);
          gain.connect(soundContext.destination);

          oscillator.start(now + delay);
          oscillator.stop(now + delay + 0.15);
        });
      };

      if (soundContext.state === "suspended") {
        soundContext.resume().then(play).catch(() => {});
      } else {
        play();
      }
    } catch (error) {
      console.warn("Party sound could not play:", error);
    }
  }

  function showBirthdayGreeting() {
    let greeting = document.getElementById("birthdayGreeting");

    if (!greeting) {
      greeting = document.createElement("div");
      greeting.id = "birthdayGreeting";
      greeting.className = "birthday-greeting";
      greeting.setAttribute("role", "status");
      greeting.setAttribute("aria-live", "polite");

      greeting.innerHTML = `
        <div class="birthday-greeting-card">
          <span class="greeting-sparkle">✦ ✧ ✦</span>
          <p>THE DAY IS FINALLY HERE</p>
          <h2>HAPPY BIRTHDAY,<br><em>MAKKU!</em></h2>
          <span class="greeting-heart">♡</span>
        </div>
      `;

      document.body.appendChild(greeting);
    }

    // Restart the animation if the greeting already exists.
    greeting.classList.remove("is-celebrating");
    void greeting.offsetWidth;
    greeting.classList.add("is-celebrating");

    window.setTimeout(() => {
      greeting.classList.remove("is-celebrating");
    }, 3600);
  }

  function startCelebration() {
    if (celebrationStarted) return;
    celebrationStarted = true;

    console.log("Birthday unlock event received!");

    window.setTimeout(() => {
      if (typeof window.birthdayConfettiAt === "function") {
        // Fire one main burst. The confetti engine currently
        // supports one burst at a time.
        window.birthdayConfettiAt(
          window.innerWidth / 2,
          window.innerHeight * 0.35
        );
      } else {
        console.warn("Confetti function is unavailable.");
      }

      playPartySound();
      showBirthdayGreeting();
    }, 350);
  }

  // Register the unlock event.
  window.addEventListener("birthday:unlocked", startCelebration);

  // Also provide a manual test from the browser console.
  window.testBirthdayCelebration = () => {
    celebrationStarted = false;
    startCelebration();
  };
})();



/* ===== BIRTHDAY REVEAL ANIMATIONS ===== */

(() => {
  const birthdaySite = document.getElementById("birthdaySite");

  if (!birthdaySite) return;

  const revealElements = birthdaySite.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries, currentObserver) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            currentObserver.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -35px 0px"
      }
    );

    revealElements.forEach((element, index) => {
      element.style.setProperty(
        "--reveal-delay",
        `${Math.min(index % 4, 3) * 120}ms`
      );

      observer.observe(element);
    });
  } else {
    revealElements.forEach((element) => {
      element.classList.add("is-visible");
    });
  }

  window.addEventListener("birthday:unlocked", () => {
    birthdaySite.classList.add("birthday-open");

    const hero = birthdaySite.querySelector(".hero");

    if (hero) {
      hero.classList.add("hero-arrived");
    }
  });
})();