$(window).on('load', function() {
    // Preloader Logic
    setTimeout(function() {
        $('#aks-preloader').css({
            'opacity': '0',
            'visibility': 'hidden'
        });
    }, 2000); // 2 seconds delay to show the animation
});

$(document).ready(function() {
    // Initialize AOS (Animate On Scroll)
    AOS.init({
        once: true, // whether animation should happen only once - while scrolling down
        offset: 50, // offset (in px) from the original trigger point
        duration: 800, // values from 0 to 3000, with step 50ms
        easing: 'ease-out-cubic', // default easing for AOS animations
    });

    // Custom Cursor Logic
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-outline');

    window.addEventListener('mousemove', function(e) {
        const posX = e.clientX;
        const posY = e.clientY;

        cursorDot.style.left = `${posX}px`;
        cursorDot.style.top = `${posY}px`;

        // Slight delay for the outline for a smooth trailing effect
        cursorOutline.animate({
            left: `${posX}px`,
            top: `${posY}px`
        }, { duration: 500, fill: "forwards" });
    });

    // Add hover effect to links and buttons
    const hoverElements = document.querySelectorAll('a, button, input, textarea, .skill-item');
    hoverElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursorOutline.classList.add('cursor-hover');
            cursorDot.style.transform = 'translate(-50%, -50%) scale(1.5)';
        });
        el.addEventListener('mouseleave', () => {
            cursorOutline.classList.remove('cursor-hover');
            cursorDot.style.transform = 'translate(-50%, -50%) scale(1)';
        });
    });

    // Navbar Scroll Logic
    $(window).scroll(function() {
        if ($(window).scrollTop() > 50) {
            $('.navbar').addClass('scrolled');
        } else {
            $('.navbar').removeClass('scrolled');
        }
    });

    // ── Validation helpers ──────────────────────────────────────────────────
    function isValidEmail(val) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(val.trim());
    }
    function isValidPhone(val) {
        // Allow optional leading +, then 7–15 digits (spaces/dashes ignored)
        return /^\+?[\d\s\-]{7,15}$/.test(val.trim()) && /\d{7,}/.test(val.replace(/[\s\-]/g, ''));
    }

    function setFieldError($input, $errorSpan, show) {
        if (show) {
            $input.css({ 'border-bottom-color': '#e74c3c !important', 'border-bottom-width': '2px', 'border-bottom-style': 'solid' });
            $input.addClass('is-invalid-custom');
            $errorSpan.removeClass('d-none');
        } else {
            $input.css({ 'border-bottom-color': '', 'border-bottom-width': '', 'border-bottom-style': '' });
            $input.removeClass('is-invalid-custom');
            $errorSpan.addClass('d-none');
        }
    }

    // Real-time blur validation
    $('#email').on('blur', function() {
        setFieldError($(this), $('#emailError'), !isValidEmail($(this).val()));
    }).on('input', function() {
        if (!$(this).hasClass('is-invalid-custom')) return;
        if (isValidEmail($(this).val())) setFieldError($(this), $('#emailError'), false);
    });

    $('#phone').on('blur', function() {
        setFieldError($(this), $('#phoneError'), !isValidPhone($(this).val()));
    }).on('input', function() {
        if (!$(this).hasClass('is-invalid-custom')) return;
        if (isValidPhone($(this).val())) setFieldError($(this), $('#phoneError'), false);
    });

    // ── Contact Form Submission ─────────────────────────────────────────────
    $('#contactForm').on('submit', function(e) {
        e.preventDefault();

        // Validate before sending
        const emailVal = $('#email').val();
        const phoneVal = $('#phone').val();
        let hasError = false;

        if (!isValidEmail(emailVal)) {
            setFieldError($('#email'), $('#emailError'), true);
            hasError = true;
        } else {
            setFieldError($('#email'), $('#emailError'), false);
        }

        if (!isValidPhone(phoneVal)) {
            setFieldError($('#phone'), $('#phoneError'), true);
            hasError = true;
        } else {
            setFieldError($('#phone'), $('#phoneError'), false);
        }

        if (hasError) return;
        
        const submitBtn = $('#submitBtn');
        const formMessage = $('#formMessage');
        const originalBtnText = submitBtn.text();
        
        // Show loading state
        submitBtn.html('<i class="fa-solid fa-spinner fa-spin"></i> Sending...');
        submitBtn.prop('disabled', true);
        
        const formData = {
            name: $('#name').val(),
            email: emailVal,
            phone: phoneVal,
            message: $('#message').val()
        };

        $.ajax({
            type: 'POST',
            url: '/api/contact', // Node.js backend endpoint
            data: JSON.stringify(formData),
            contentType: 'application/json',
            success: function(response) {
                if(response.success) {
                    formMessage.removeClass('d-none bg-danger').addClass('bg-success').text(response.message).show();
                    $('#contactForm')[0].reset();
                    // Clear any lingering error states after reset
                    setFieldError($('#email'), $('#emailError'), false);
                    setFieldError($('#phone'), $('#phoneError'), false);
                } else {
                    formMessage.removeClass('d-none bg-success').addClass('bg-danger').text(response.message || 'Error sending message.').show();
                }
            },
            error: function(xhr, status, error) {
                formMessage.removeClass('d-none bg-success').addClass('bg-danger').text('Server error. Please try again later.').show();
            },
            complete: function() {
                // Restore button state
                submitBtn.html(originalBtnText);
                submitBtn.prop('disabled', false);
                
                // Hide message after 5 seconds
                setTimeout(function() {
                    formMessage.fadeOut(function() {
                        $(this).addClass('d-none').css('display', '');
                    });
                }, 5000);
            }
        });
    });
});


// typing text js start here 
// typing-text




  var typed = new Typed("#typing-text", {
    strings: [
      "FULL STACK DEVELOPER",
      "FRONTEND DEVELOPER",
      "BACKEND DEVELOPER",
      "SEO DEVELOPER"
    ],
    typeSpeed: 60,     // typing speed
    backSpeed: 40,     // deleting speed
    backDelay: 1500,   // rukne ka time
    loop: true         // repeat hota rahega
  });




















// typing text js end here
