/* ===========================================================
   World Mobile Accessories — shared site behaviour
   This file is loaded on every page. Sections are labelled so
   you can find and edit the part you need.
=========================================================== */

document.addEventListener("DOMContentLoaded", function () {

  /* ---------- 1. Mobile menu toggle ---------- */
  var navToggle = document.querySelector(".nav-toggle");
  var mainNav = document.querySelector(".main-nav");
  if (navToggle && mainNav) {
    navToggle.addEventListener("click", function () {
      mainNav.classList.toggle("open");
    });
    // Tap a "has-sub" link on mobile to open its submenu instead of navigating
    document.querySelectorAll(".main-nav .has-sub > a").forEach(function (link) {
      link.addEventListener("click", function (e) {
        if (window.innerWidth <= 640) {
          e.preventDefault();
          link.parentElement.classList.toggle("open");
        }
      });
    });
  }

  /* ---------- 2. Wishlist (heart) buttons ---------- */
  var WISHLIST_KEY = "wma_wishlist";
  var wishlist = JSON.parse(localStorage.getItem(WISHLIST_KEY) || "[]");

  function updateWishlistBadge() {
    var badge = document.querySelector("#wishlist-count");
    if (badge) badge.textContent = wishlist.length;
  }

  document.querySelectorAll(".wishlist-btn").forEach(function (btn) {
    var id = btn.getAttribute("data-id");
    if (wishlist.indexOf(id) > -1) btn.classList.add("active");
    btn.addEventListener("click", function () {
      var idx = wishlist.indexOf(id);
      if (idx > -1) {
        wishlist.splice(idx, 1);
        btn.classList.remove("active");
      } else {
        wishlist.push(id);
        btn.classList.add("active");
      }
      localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlist));
      updateWishlistBadge();
    });
  });
  updateWishlistBadge();

  /* ---------- 3. Cart badge (placeholder count) ---------- */
  var CART_KEY = "wma_cart";
  var cart = JSON.parse(localStorage.getItem(CART_KEY) || "[]");
  var cartBadge = document.querySelector("#cart-count");
  if (cartBadge) cartBadge.textContent = cart.length;

  /* ---------- 4. Simple filtering on listing pages ---------- */
  // Product cards carry data-brand and data-price (in rupees) attributes.
  // Checking a brand box or price radio re-runs this filter.
  var filterPanel = document.querySelector(".filters");
  var grid = document.querySelector(".product-grid");
  if (filterPanel && grid) {
    var cards = Array.prototype.slice.call(grid.querySelectorAll(".product-card"));

    function applyFilters() {
      var checkedBrands = Array.prototype.slice
        .call(filterPanel.querySelectorAll('input[name="brand"]:checked'))
        .map(function (i) { return i.value; });
      var priceRange = filterPanel.querySelector('input[name="price"]:checked');

      cards.forEach(function (card) {
        var brand = card.getAttribute("data-brand");
        var price = parseInt(card.getAttribute("data-price"), 10);
        var brandOk = checkedBrands.length === 0 || checkedBrands.indexOf(brand) > -1;
        var priceOk = true;
        if (priceRange) {
          var range = priceRange.value; // e.g. "0-10000" or "30000-999999"
          var parts = range.split("-").map(Number);
          priceOk = price >= parts[0] && price <= parts[1];
        }
        card.style.display = brandOk && priceOk ? "" : "none";
      });
    }

    filterPanel.querySelectorAll('input[type="checkbox"], input[type="radio"]').forEach(function (input) {
      input.addEventListener("change", applyFilters);
    });
  }

  /* ---------- 5. Cursor-follow "boom" tilt + spotlight ---------- */
  // Wherever the cursor moves over a card, it tilts toward the cursor and a
  // gold spotlight glows under the pointer. Change the numbers below (6, 1.03)
  // to make the tilt/zoom stronger or gentler.
  var tiltEls = document.querySelectorAll(".product-card, .cat-card, .qa-card");
  tiltEls.forEach(function (el) {
    el.addEventListener("mousemove", function (e) {
      var rect = el.getBoundingClientRect();
      var x = e.clientX - rect.left;
      var y = e.clientY - rect.top;
      el.style.setProperty("--mx", x + "px");
      el.style.setProperty("--my", y + "px");
      var rotateY = ((x - rect.width / 2) / (rect.width / 2)) * 6;
      var rotateX = -((y - rect.height / 2) / (rect.height / 2)) * 6;
      el.style.transform =
        "perspective(700px) rotateX(" + rotateX + "deg) rotateY(" + rotateY + "deg) scale(1.03) translateY(-2px)";
    });
    el.addEventListener("mouseleave", function () {
      el.style.transform = "";
    });
  });

});
