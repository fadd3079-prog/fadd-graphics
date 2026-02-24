const preloader = document.getElementById("preloader");
if (preloader) {
  window.addEventListener("load", () => {
    setTimeout(() => {
      preloader.classList.add("loaded");
      setTimeout(() => {
        preloader.style.display = "none";
      }, 500);
    }, 500);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const header = document.querySelector("header");
  let isScrolling = false;

  if (header) {
    window.addEventListener(
      "scroll",
      () => {
        if (!isScrolling) {
          window.requestAnimationFrame(() => {
            if (window.scrollY > 50) {
              header.classList.add("scrolled");
            } else {
              header.classList.remove("scrolled");
            }
            isScrolling = false;
          });
          isScrolling = true;
        }
      },
      { passive: true }
    );
  }

  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const href = this.getAttribute("href");

      if (href === "#") return;

      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        window.scrollTo({
          top: target.offsetTop - 80,
          behavior: "smooth",
        });
      }
    });
  });

  const contactForm = document.getElementById("contact-form");
  const formStatus = document.getElementById("form-status");

  if (contactForm) {
    contactForm.addEventListener("submit", async function (event) {
      event.preventDefault();

      const data = new FormData(event.target);
      const submitBtn = contactForm.querySelector("button");
      const originalBtnText = submitBtn.innerHTML;

      submitBtn.innerHTML =
        'MENGIRIM... <i class="fa-solid fa-spinner fa-spin"></i>';
      submitBtn.disabled = true;

      try {
        const response = await fetch(event.target.action, {
          method: contactForm.method,
          body: data,
          headers: {
            Accept: "application/json",
          },
        });

        if (response.ok) {
          formStatus.innerHTML =
            "Terimakasih, pesan berhasil terkirim! Kami akan segera membalas.";
          formStatus.className = "success-msg";
          contactForm.reset();
        } else {
          const result = await response.json();
          if (Object.hasOwn(result, "errors")) {
            formStatus.innerHTML = result.errors
              .map((error) => error.message)
              .join(", ");
          } else {
            formStatus.innerHTML = "Maaf, ada masalah saat mengirim pesan.";
          }
          formStatus.className = "error-msg";
        }
      } catch (error) {
        formStatus.innerHTML = "Terjadi kesalahan jaringan. Silakan coba lagi.";
        formStatus.className = "error-msg";
      } finally {
        submitBtn.innerHTML = originalBtnText;
        submitBtn.disabled = false;
      }
    });
  }
});
