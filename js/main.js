/* Rolland Ashiteye — portfolio interactions (no dependencies) */
(function () {
    "use strict";

    var doc = document.documentElement;
    var prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    /* ---------- Theme toggle ---------- */
    var themeToggle = document.querySelector(".theme-toggle");

    function applyTheme(theme) {
        doc.setAttribute("data-theme", theme);
        if (themeToggle) {
            themeToggle.setAttribute(
                "aria-label",
                theme === "dark" ? "Switch to light theme" : "Switch to dark theme"
            );
        }
    }

    if (themeToggle) {
        themeToggle.addEventListener("click", function () {
            var next = doc.getAttribute("data-theme") === "dark" ? "light" : "dark";
            applyTheme(next);
            try { localStorage.setItem("theme", next); } catch (e) { /* private mode */ }
        });
        applyTheme(doc.getAttribute("data-theme") || "dark");
    }

    /* ---------- Mobile navigation ---------- */
    var navToggle = document.querySelector(".nav-toggle");
    var navMenu = document.getElementById("nav-menu");

    if (navToggle && navMenu) {
        navToggle.addEventListener("click", function () {
            var open = navMenu.classList.toggle("open");
            navToggle.setAttribute("aria-expanded", String(open));
        });

        // Close the menu after a link is chosen
        navMenu.addEventListener("click", function (e) {
            if (e.target.closest("a")) {
                navMenu.classList.remove("open");
                navToggle.setAttribute("aria-expanded", "false");
            }
        });
    }

    /* ---------- Scroll reveal ---------- */
    var revealEls = document.querySelectorAll(".reveal");

    if (prefersReducedMotion || !("IntersectionObserver" in window)) {
        revealEls.forEach(function (el) { el.classList.add("visible"); });
    } else {
        var revealObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add("visible");
                    revealObserver.unobserve(entry.target);
                }
            });
        }, { rootMargin: "0px 0px -8% 0px", threshold: 0.1 });

        revealEls.forEach(function (el) { revealObserver.observe(el); });
    }

    /* ---------- Stat counters ---------- */
    var statEls = document.querySelectorAll(".stat-value[data-count]");

    function animateCount(el) {
        var target = parseInt(el.getAttribute("data-count"), 10);
        var suffix = el.getAttribute("data-suffix") || "";
        var duration = 1200;
        var start = null;

        function step(ts) {
            if (!start) start = ts;
            var progress = Math.min((ts - start) / duration, 1);
            // ease-out cubic
            var eased = 1 - Math.pow(1 - progress, 3);
            el.textContent = Math.round(eased * target) + suffix;
            if (progress < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
    }

    if (!prefersReducedMotion && "IntersectionObserver" in window && statEls.length) {
        var statObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    animateCount(entry.target);
                    statObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.6 });

        statEls.forEach(function (el) { statObserver.observe(el); });
    }

    /* ---------- Scrollspy: highlight the section in view ---------- */
    var sections = document.querySelectorAll("main section[id]");
    var navLinks = document.querySelectorAll(".nav-links a[href^='#']");

    if ("IntersectionObserver" in window && sections.length && navLinks.length) {
        var spyObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (!entry.isIntersecting) return;
                navLinks.forEach(function (link) {
                    link.classList.toggle(
                        "active",
                        link.getAttribute("href") === "#" + entry.target.id
                    );
                });
            });
        }, { rootMargin: "-35% 0px -55% 0px" });

        sections.forEach(function (s) { spyObserver.observe(s); });
    }

    /* ---------- Footer year ---------- */
    var yearEl = document.getElementById("year");
    if (yearEl) yearEl.textContent = String(new Date().getFullYear());
})();
