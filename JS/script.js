"use strict";

/* =========================================================
   ELEVATEHER COACHING CO.
   Main JavaScript
   Save as: script.js
========================================================= */

document.addEventListener("DOMContentLoaded", () => {
    const body = document.body;
    const siteHeader = document.getElementById("siteHeader");
    const mobileMenuButton = document.getElementById("mobileMenuButton");
    const mobileNavigation = document.getElementById("mobileNavigation");
    const mobileNavLinks = document.querySelectorAll(".mobile-nav-link");
    const navigationLinks = document.querySelectorAll(
        '.desktop-nav a[href^="#"], .mobile-nav a[href^="#"]'
    );
    const revealElements = document.querySelectorAll(".reveal");
    const counterElements = document.querySelectorAll("[data-count]");
    const faqItems = document.querySelectorAll(".faq-item");
    const applicationForm = document.getElementById("applicationForm");
    const formStatus = document.getElementById("formStatus");
    const backToTopButton = document.getElementById("backToTop");
    const currentYear = document.getElementById("currentYear");

    const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    let countersStarted = false;


    /* =====================================================
       CURRENT YEAR
    ===================================================== */

    if (currentYear) {
        currentYear.textContent = new Date().getFullYear();
    }


    /* =====================================================
       STICKY HEADER AND BACK TO TOP
    ===================================================== */

    function handlePageScroll() {
        const scrollPosition = window.scrollY;

        if (siteHeader) {
            siteHeader.classList.toggle("scrolled", scrollPosition > 30);
        }

        if (backToTopButton) {
            backToTopButton.classList.toggle(
                "visible",
                scrollPosition > 600
            );
        }

        updateActiveNavigation();
    }

    window.addEventListener("scroll", handlePageScroll, {
        passive: true
    });

    handlePageScroll();


    /* =====================================================
       MOBILE NAVIGATION
    ===================================================== */

    function openMobileMenu() {
        if (!mobileMenuButton || !mobileNavigation) {
            return;
        }

        mobileMenuButton.classList.add("active");
        mobileNavigation.classList.add("open");
        mobileMenuButton.setAttribute("aria-expanded", "true");
        mobileMenuButton.setAttribute(
            "aria-label",
            "Close navigation menu"
        );

        body.classList.add("menu-open");
    }

    function closeMobileMenu() {
        if (!mobileMenuButton || !mobileNavigation) {
            return;
        }

        mobileMenuButton.classList.remove("active");
        mobileNavigation.classList.remove("open");
        mobileMenuButton.setAttribute("aria-expanded", "false");
        mobileMenuButton.setAttribute(
            "aria-label",
            "Open navigation menu"
        );

        body.classList.remove("menu-open");
    }

    function toggleMobileMenu() {
        if (!mobileNavigation) {
            return;
        }

        const menuIsOpen = mobileNavigation.classList.contains("open");

        if (menuIsOpen) {
            closeMobileMenu();
        } else {
            openMobileMenu();
        }
    }

    if (mobileMenuButton) {
        mobileMenuButton.addEventListener("click", toggleMobileMenu);
    }

    mobileNavLinks.forEach((link) => {
        link.addEventListener("click", closeMobileMenu);
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            closeMobileMenu();
        }
    });

    document.addEventListener("click", (event) => {
        if (
            mobileNavigation &&
            mobileMenuButton &&
            mobileNavigation.classList.contains("open") &&
            !mobileNavigation.contains(event.target) &&
            !mobileMenuButton.contains(event.target)
        ) {
            closeMobileMenu();
        }
    });

    window.addEventListener("resize", () => {
        if (window.innerWidth > 992) {
            closeMobileMenu();
        }
    });


    /* =====================================================
       SMOOTH ANCHOR SCROLLING
    ===================================================== */

    const internalLinks = document.querySelectorAll('a[href^="#"]');

    internalLinks.forEach((link) => {
        link.addEventListener("click", (event) => {
            const targetId = link.getAttribute("href");

            if (!targetId || targetId === "#") {
                event.preventDefault();
                return;
            }

            const targetSection = document.querySelector(targetId);

            if (!targetSection) {
                return;
            }

            event.preventDefault();

            const headerHeight = siteHeader
                ? siteHeader.offsetHeight
                : 0;

            const targetPosition =
                targetSection.getBoundingClientRect().top +
                window.scrollY -
                headerHeight -
                18;

            window.scrollTo({
                top: targetPosition,
                behavior: prefersReducedMotion ? "auto" : "smooth"
            });

            closeMobileMenu();
        });
    });


    /* =====================================================
       ACTIVE NAVIGATION LINKS
    ===================================================== */

    function updateActiveNavigation() {
        const sections = document.querySelectorAll(
            "main section[id]"
        );

        const scrollPosition =
            window.scrollY +
            (siteHeader ? siteHeader.offsetHeight : 0) +
            120;

        let activeSectionId = "";

        sections.forEach((section) => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;

            if (
                scrollPosition >= sectionTop &&
                scrollPosition < sectionTop + sectionHeight
            ) {
                activeSectionId = section.id;
            }
        });

        navigationLinks.forEach((link) => {
            const linkTarget = link.getAttribute("href");

            link.classList.toggle(
                "active",
                linkTarget === `#${activeSectionId}`
            );
        });
    }


    /* =====================================================
       SCROLL REVEAL ANIMATIONS
    ===================================================== */

    if (prefersReducedMotion || !("IntersectionObserver" in window)) {
        revealElements.forEach((element) => {
            element.classList.add("revealed");
        });
    } else {
        const revealObserver = new IntersectionObserver(
            (entries, observer) => {
                entries.forEach((entry) => {
                    if (!entry.isIntersecting) {
                        return;
                    }

                    entry.target.classList.add("revealed");
                    observer.unobserve(entry.target);
                });
            },
            {
                threshold: 0.12,
                rootMargin: "0px 0px -45px 0px"
            }
        );

        revealElements.forEach((element) => {
            revealObserver.observe(element);
        });
    }


    /* =====================================================
       ANIMATED RESULT COUNTERS
    ===================================================== */

    function animateCounter(element) {
        const targetValue = Number(element.dataset.count);
        const prefix = element.dataset.prefix || "";
        const suffix = element.dataset.suffix || "";
        const duration = 1400;
        const startTime = performance.now();

        if (!Number.isFinite(targetValue)) {
            return;
        }

        function updateCounter(currentTime) {
            const elapsedTime = currentTime - startTime;
            const progress = Math.min(elapsedTime / duration, 1);

            const easedProgress = 1 - Math.pow(1 - progress, 3);
            const currentValue = Math.floor(
                easedProgress * targetValue
            );

            element.textContent =
                `${prefix}${currentValue}${suffix}`;

            if (progress < 1) {
                window.requestAnimationFrame(updateCounter);
            } else {
                element.textContent =
                    `${prefix}${targetValue}${suffix}`;
            }
        }

        window.requestAnimationFrame(updateCounter);
    }

    function startCounters() {
        if (countersStarted) {
            return;
        }

        countersStarted = true;

        counterElements.forEach((counter) => {
            animateCounter(counter);
        });
    }

    const resultsSection = document.getElementById("results");

    if (resultsSection && counterElements.length > 0) {
        if (
            prefersReducedMotion ||
            !("IntersectionObserver" in window)
        ) {
            counterElements.forEach((counter) => {
                const prefix = counter.dataset.prefix || "";
                const suffix = counter.dataset.suffix || "";

                counter.textContent =
                    `${prefix}${counter.dataset.count}${suffix}`;
            });
        } else {
            const counterObserver = new IntersectionObserver(
                (entries, observer) => {
                    entries.forEach((entry) => {
                        if (!entry.isIntersecting) {
                            return;
                        }

                        startCounters();
                        observer.unobserve(entry.target);
                    });
                },
                {
                    threshold: 0.25
                }
            );

            counterObserver.observe(resultsSection);
        }
    }


    /* =====================================================
       FAQ ACCORDION
    ===================================================== */

    faqItems.forEach((faqItem) => {
        const questionButton =
            faqItem.querySelector(".faq-question");

        if (!questionButton) {
            return;
        }

        questionButton.addEventListener("click", () => {
            const itemIsOpen =
                faqItem.classList.contains("active");

            faqItems.forEach((item) => {
                const itemButton =
                    item.querySelector(".faq-question");

                item.classList.remove("active");

                if (itemButton) {
                    itemButton.setAttribute(
                        "aria-expanded",
                        "false"
                    );
                }
            });

            if (!itemIsOpen) {
                faqItem.classList.add("active");
                questionButton.setAttribute(
                    "aria-expanded",
                    "true"
                );
            }
        });
    });


    /* =====================================================
       FORM VALIDATION
    ===================================================== */

    function getFieldGroup(field) {
        return field.closest(".form-group");
    }

    function showFieldError(field, message) {
        const fieldGroup = getFieldGroup(field);

        if (!fieldGroup) {
            return;
        }

        const errorMessage =
            fieldGroup.querySelector(".field-error");

        fieldGroup.classList.add("has-error");
        field.setAttribute("aria-invalid", "true");

        if (errorMessage) {
            errorMessage.textContent = message;
        }
    }

    function clearFieldError(field) {
        const fieldGroup = getFieldGroup(field);

        if (!fieldGroup) {
            return;
        }

        const errorMessage =
            fieldGroup.querySelector(".field-error");

        fieldGroup.classList.remove("has-error");
        field.removeAttribute("aria-invalid");

        if (errorMessage) {
            errorMessage.textContent = "";
        }
    }

    function isValidEmail(emailAddress) {
        const emailPattern =
            /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

        return emailPattern.test(emailAddress);
    }

    function validateField(field) {
        const fieldValue =
            field.type === "checkbox"
                ? field.checked
                : field.value.trim();

        clearFieldError(field);

        if (field.required) {
            if (field.type === "checkbox" && !field.checked) {
                showFieldError(
                    field,
                    "Please confirm your commitment before submitting."
                );

                return false;
            }

            if (
                field.type !== "checkbox" &&
                fieldValue === ""
            ) {
                showFieldError(
                    field,
                    "Please complete this field."
                );

                return false;
            }
        }

        if (
            field.type === "email" &&
            fieldValue !== "" &&
            !isValidEmail(fieldValue)
        ) {
            showFieldError(
                field,
                "Please enter a valid email address."
            );

            return false;
        }

        if (
            field.tagName === "TEXTAREA" &&
            field.required &&
            fieldValue.length < 15
        ) {
            showFieldError(
                field,
                "Please provide at least 15 characters."
            );

            return false;
        }

        return true;
    }

    function validateForm(form) {
        const requiredFields = form.querySelectorAll(
            "input[required], select[required], textarea[required]"
        );

        let formIsValid = true;
        let firstInvalidField = null;

        requiredFields.forEach((field) => {
            const fieldIsValid = validateField(field);

            if (!fieldIsValid) {
                formIsValid = false;

                if (!firstInvalidField) {
                    firstInvalidField = field;
                }
            }
        });

        if (firstInvalidField) {
            firstInvalidField.focus();
        }

        return formIsValid;
    }

    function resetFormStatus() {
        if (!formStatus) {
            return;
        }

        formStatus.textContent = "";
        formStatus.className = "form-status";
    }

    if (applicationForm) {
        const formFields = applicationForm.querySelectorAll(
            "input, select, textarea"
        );

        formFields.forEach((field) => {
            const validationEvent =
                field.type === "checkbox" ||
                field.tagName === "SELECT"
                    ? "change"
                    : "input";

            field.addEventListener(validationEvent, () => {
                if (
                    getFieldGroup(field)?.classList.contains(
                        "has-error"
                    )
                ) {
                    validateField(field);
                }

                resetFormStatus();
            });

            field.addEventListener("blur", () => {
                if (field.required && field.value.trim() !== "") {
                    validateField(field);
                }
            });
        });


        /* =================================================
           STATIC FORM SUBMISSION

           GitHub Pages does not process form submissions.
           This prevents the browser from sending a POST
           request and causing an HTTP 405 error.

           Later, this can be connected to Formspree,
           Web3Forms, EmailJS, Netlify Forms, or a backend.
        ================================================= */

        applicationForm.addEventListener("submit", (event) => {
            event.preventDefault();

            resetFormStatus();

            const formIsValid =
                validateForm(applicationForm);

            if (!formIsValid) {
                if (formStatus) {
                    formStatus.textContent =
                        "Please review the highlighted fields and try again.";

                    formStatus.classList.add("error");
                }

                return;
            }

            const submitButton =
                applicationForm.querySelector(
                    ".form-submit-button"
                );

            if (submitButton) {
                submitButton.disabled = true;
                submitButton.classList.add("loading");
            }

            /*
             * This timeout imitates a short submission delay.
             * Replace this section when connecting a real
             * form service.
             */
            window.setTimeout(() => {
                if (submitButton) {
                    submitButton.disabled = false;
                    submitButton.classList.remove("loading");
                }

                if (formStatus) {
                    formStatus.textContent =
                        "Thank you! Your coaching application has been received. This demo form is not currently connected to an email service.";

                    formStatus.classList.add("success");
                }

                applicationForm.reset();

                const formGroups =
                    applicationForm.querySelectorAll(
                        ".form-group"
                    );

                formGroups.forEach((group) => {
                    group.classList.remove("has-error");
                });

                formStatus?.scrollIntoView({
                    behavior: prefersReducedMotion
                        ? "auto"
                        : "smooth",
                    block: "center"
                });
            }, 900);
        });
    }


    /* =====================================================
       BACK TO TOP
    ===================================================== */

    if (backToTopButton) {
        backToTopButton.addEventListener("click", () => {
            window.scrollTo({
                top: 0,
                behavior: prefersReducedMotion
                    ? "auto"
                    : "smooth"
            });
        });
    }
});