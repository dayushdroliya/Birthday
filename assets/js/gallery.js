"use strict";

(() => {
const grid = document.getElementById("galleryGrid");
const dialog = document.getElementById("mediaDialog");
const content = document.getElementById("dialogMediaContent");
const closeButton = document.getElementById("closeMedia");
const previousButton = document.getElementById("previousMedia");
const nextButton = document.getElementById("nextMedia");
const counter = document.getElementById("mediaCounter");

if (!grid) return;

const photos = Array.from({ length: 35 }, (_, index) => {
const number = String(index + 1).padStart(2, "0");


return {
  type: "image",
  src: `assets/images/gallery/photo-${number}.jpeg`,
  alt: `Photo ${index + 1}`
};


});

const mediaItems = [
...photos,
{
type: "video",
src: "assets/videos/her-video.mp4",
title: "A little video memory"
}
];

let currentIndex = 0;

function openMedia(index) {
if (!dialog || !content) return;


currentIndex = (index + mediaItems.length) % mediaItems.length;
renderMedia();

if (!dialog.open) {
  dialog.showModal();
}


}

function renderMedia() {
const item = mediaItems[currentIndex];


content.replaceChildren();

if (item.type === "image") {
  const image = document.createElement("img");
  image.src = item.src;
  image.alt = item.alt;
  image.className = "lightbox-image";
  content.appendChild(image);
} else {
  const video = document.createElement("video");
  video.src = item.src;
  video.controls = true;
  video.autoplay = true;
  video.muted = false;
  video.playsInline = true;
  video.preload = "auto";
  video.className = "lightbox-video";
  content.appendChild(video);

  // Try playback after the user opens the video card.
  video.play().catch(() => {
    // Native video controls remain available if autoplay is blocked.
  });
}

if (counter) {
  counter.textContent =
    `${currentIndex + 1} / ${mediaItems.length}` +
    (item.type === "video" ? " · Video" : "");
}

if (previousButton) {
  previousButton.disabled = false;
}

if (nextButton) {
  nextButton.disabled = false;
}


}

function closeMedia() {
if (dialog && dialog.open) {
dialog.close();
}
}

mediaItems.forEach((item, index) => {
const card = document.createElement("button");
card.type = "button";
card.className = "gallery-item";
card.setAttribute(
"aria-label",
item.type === "video" ? "Open video" : `Open photo ${index + 1}`
);


if (item.type === "image") {
  const image = document.createElement("img");
  image.src = item.src;
  image.alt = item.alt;
  image.loading = "lazy";
  image.decoding = "async";

  image.addEventListener("error", () => {
    card.classList.add("gallery-item-error");
    card.setAttribute("aria-label", `Photo ${index + 1} could not load`);
    console.error("Image not found:", item.src);
  });

  card.appendChild(image);
} else {
  // Dedicated video card, visually different from photos.
  const videoCard = document.createElement("div");
  videoCard.className = "gallery-video-card";

  const preview = document.createElement("video");
  preview.src = item.src;
  preview.muted = true;
  preview.loop = true;
  preview.autoplay = true;
  preview.playsInline = true;
  preview.preload = "metadata";
  preview.setAttribute("aria-hidden", "true");

  preview.addEventListener("loadeddata", () => {
    preview.play().catch(() => {});
  });

  const badge = document.createElement("span");
  badge.className = "gallery-video-play";
  badge.textContent = "▶";

  const label = document.createElement("span");
  label.className = "gallery-video-label";

  const kicker = document.createElement("span");
  kicker.textContent = "A LITTLE VIDEO MEMORY";

  const title = document.createElement("strong");
  title.textContent = "A moment to replay ♡";

  label.append(kicker, title);
  videoCard.append(preview, badge, label);
  card.appendChild(videoCard);

  preview.addEventListener("error", () => {
    console.error("Video preview could not load:", item.src);
    title.textContent = "Tap to watch your video";
  });
}

card.addEventListener("click", () => openMedia(index));
grid.appendChild(card);


});

if (previousButton) {
previousButton.addEventListener("click", () => {
openMedia(currentIndex - 1);
});
}

if (nextButton) {
nextButton.addEventListener("click", () => {
openMedia(currentIndex + 1);
});
}

if (closeButton) {
closeButton.addEventListener("click", closeMedia);
}

if (dialog) {
dialog.addEventListener("click", (event) => {
if (event.target === dialog) {
closeMedia();
}
});


dialog.addEventListener("close", () => {
  const video = content?.querySelector("video");

  if (video) {
    video.pause();
    video.removeAttribute("src");
    video.load();
  }

  content?.replaceChildren();
});


}

// Arrow-key navigation while the gallery viewer is open.
document.addEventListener("keydown", (event) => {
if (!dialog?.open) return;


if (event.key === "ArrowLeft") {
  event.preventDefault();
  openMedia(currentIndex - 1);
} else if (event.key === "ArrowRight") {
  event.preventDefault();
  openMedia(currentIndex + 1);
}

});
})();
