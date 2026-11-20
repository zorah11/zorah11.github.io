"use strict";

const products = {
  classic: {
    name: "Heavens Classic",
    image: "assets/bottle-classic.webp",
    description: "Our signature sweet red wine. Bring a bottle to the table, pour a glass, and settle into good company."
  },
  chocolate: {
    name: "Heavens Chocolate",
    image: "assets/bottle-chocolate.webp",
    description: "The Chocolate expression of Heavens sweet red fortified wine. A different choice for the same warm company, memorable tables and personal celebrations."
  }
};

// Each page shares navigation; page-specific controls are optional.
const menuButton = document.querySelector(".menu-toggle");
const nav = document.querySelector("#main-nav");

function closeMenu() {
  if (!menuButton || !nav) return;
  menuButton.setAttribute("aria-expanded", "false");
  menuButton.setAttribute("aria-label", "Open navigation");
  nav.classList.remove("is-open");
  document.body.classList.remove("menu-open");
}

if (menuButton && nav) {
  menuButton.addEventListener("click", () => {
    const open = menuButton.getAttribute("aria-expanded") !== "true";
    menuButton.setAttribute("aria-expanded", String(open));
    menuButton.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
    nav.classList.toggle("is-open", open);
    document.body.classList.toggle("menu-open", open);
  });
  nav.querySelectorAll("a").forEach(link => link.addEventListener("click", closeMenu));
  document.addEventListener("keydown", event => {
    if (!nav.classList.contains("is-open")) return;
    if (event.key === "Escape") {
      closeMenu();
      menuButton.focus();
    }
    if (event.key === "Tab") {
      const lastLink = [...nav.querySelectorAll("a")].at(-1);
      if (event.shiftKey && document.activeElement === menuButton) {
        event.preventDefault();
        lastLink.focus();
      } else if (!event.shiftKey && document.activeElement === lastLink) {
        event.preventDefault();
        menuButton.focus();
      }
    }
  });
  window.matchMedia("(min-width: 768px)").addEventListener("change", event => {
    if (event.matches) closeMenu();
  });
}

const tabs = [...document.querySelectorAll("[data-product]")];
if (tabs.length) {
  let selectedProduct = "classic";
  let selectedSize = "750 ml";

  function refreshWine() {
    const product = products[selectedProduct];
    const image = document.querySelector("#product-image");
    image.src = product.image;
    image.alt = product.name + " sweet red fortified wine";
    document.querySelector("#product-name").textContent = product.name;
    document.querySelector("#product-description").textContent = product.description;
    document.querySelector("#product-panel").setAttribute("aria-labelledby", selectedProduct + "-tab");
    document.querySelector("#selected-wine").textContent = product.name + " · " + selectedSize;
    const selection = new URLSearchParams({wine: selectedProduct, size: selectedSize, occasion: "Wine order"});
    document.querySelector("#wine-enquiry").href = "booking.html?" + selection.toString();
  }

  function selectProduct(tab) {
    selectedProduct = tab.dataset.product;
    tabs.forEach(item => {
      const active = item === tab;
      item.setAttribute("aria-selected", String(active));
      item.tabIndex = active ? 0 : -1;
    });
    refreshWine();
  }

  tabs.forEach((tab, index) => {
    tab.addEventListener("click", () => selectProduct(tab));
    tab.addEventListener("keydown", event => {
      let target;
      if (event.key === "ArrowRight") target = tabs[(index + 1) % tabs.length];
      if (event.key === "ArrowLeft") target = tabs[(index - 1 + tabs.length) % tabs.length];
      if (event.key === "Home") target = tabs[0];
      if (event.key === "End") target = tabs[tabs.length - 1];
      if (target) {
        event.preventDefault();
        selectProduct(target);
        target.focus();
      }
    });
  });

  const sizes = [...document.querySelectorAll("[data-size]")];
  sizes.forEach(button => button.addEventListener("click", () => {
    selectedSize = button.dataset.size;
    sizes.forEach(item => item.setAttribute("aria-pressed", String(item === button)));
    refreshWine();
  }));
}

document.querySelectorAll(".occasion-list details").forEach(detail => {
  detail.addEventListener("toggle", () => {
    if (detail.open) {
      document.querySelectorAll(".occasion-list details").forEach(other => {
        if (other !== detail) other.open = false;
      });
    }
  });
});

function buildEnquiry(data) {
  const value = key => String(data.get(key) || "").trim();
  const lines = [
    "Hello Heavens, my name is " + value("name") + ".",
    "I'd like to enquire about a " + value("occasion").toLowerCase() + ".",
    "Wine: " + value("wine") + ".",
    "Pack size: " + value("size") + "."
  ];
  if (value("date")) lines.push("Event date: " + value("date") + ".");
  if (value("quantity")) lines.push("Number of packs: " + value("quantity") + ".");
  lines.push("Personalised branding: " + value("branding") + ".");
  if (value("location")) lines.push("Event location: " + value("location") + ".");
  if (value("notes")) lines.push("Details: " + value("notes"));
  lines.push("Please share pricing, availability and the next steps.");
  return lines.join("\n");
}

const form = document.querySelector("#booking-form");
if (form) {
  const params = new URLSearchParams(window.location.search);
  const nameInput = document.querySelector("#customer-name");
  const review = document.querySelector("#booking-review");
  const status = document.querySelector("#form-status");
  const whatsappLink = document.querySelector("#whatsapp-send");
  const initialStatus = status.textContent;

  // Accept only values offered by the form, without injecting URL text as HTML.
  function prefill(selector, value) {
    const select = document.querySelector(selector);
    if ([...select.options].some(option => option.value === value)) select.value = value;
  }
  const requestedWine = params.get("wine");
  if (Object.prototype.hasOwnProperty.call(products, requestedWine)) {
    prefill("#wine-choice", products[requestedWine].name);
  }
  prefill("#pack-size", params.get("size"));
  prefill("#occasion", params.get("occasion"));
  prefill("#branding-choice", params.get("branding"));

  function resetReview() {
    review.hidden = true;
    whatsappLink.removeAttribute("href");
    status.textContent = initialStatus;
  }
  nameInput.addEventListener("input", () => nameInput.setCustomValidity(""));
  form.addEventListener("input", resetReview);
  form.addEventListener("change", resetReview);
  form.addEventListener("submit", event => {
    event.preventDefault();
    nameInput.setCustomValidity(nameInput.value.trim() ? "" : "Please enter your name.");
    if (!form.reportValidity()) return;
    const message = buildEnquiry(new FormData(form));
    document.querySelector("#enquiry-preview").textContent = message;
    whatsappLink.href = "https://wa.me/256776998578?text=" + encodeURIComponent(message);
    review.hidden = false;
    status.textContent = "Your enquiry is ready. Check your details below, then continue in WhatsApp.";
    document.querySelector("#review-title").focus();
  });
  document.querySelector("#edit-enquiry").addEventListener("click", () => {
    resetReview();
    nameInput.focus();
  });
}

const privacyButton = document.querySelector(".privacy-toggle");
if (privacyButton) {
  privacyButton.addEventListener("click", () => {
    const open = privacyButton.getAttribute("aria-expanded") !== "true";
    privacyButton.setAttribute("aria-expanded", String(open));
    document.querySelector("#privacy-note").hidden = !open;
  });
}
const year = document.querySelector("#year");
if (year) year.textContent = String(new Date().getFullYear());
