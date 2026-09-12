import re

with open("script.js", "r") as file:
    content = file.read()

# Make sure we don't duplicate
if "intlTelInput" in content:
    print("Already added to script.js")
    exit(0)

init_code = """
// --- intl-tel-input integration ---
window.initPhoneInputs = function() {
    if (typeof window.intlTelInput !== 'function') return;
    const phoneInputs = document.querySelectorAll('input[type="tel"]');
    phoneInputs.forEach(input => {
        if (!input.iti) {
            input.iti = window.intlTelInput(input, {
                initialCountry: "ae",
                preferredCountries: ["ae", "in", "sa", "gb", "us", "pk", "kw", "qa"],
                utilsScript: "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.8/js/utils.js",
                separateDialCode: true,
                autoPlaceholder: "polite",
            });
        }
    });
};

document.addEventListener("DOMContentLoaded", function() {
    window.initPhoneInputs();
    
    // Monkey-patch submitViaIframe globally to inject full phone number before submitting
    if (typeof window.submitViaIframe === 'function' && !window._submitViaIframePatched) {
        const originalSubmit = window.submitViaIframe;
        window.submitViaIframe = function(formElement, successMsg) {
            const phoneInputs = formElement.querySelectorAll('input[type="tel"]');
            phoneInputs.forEach(input => {
                if (input.iti && typeof input.iti.getNumber === 'function') {
                    // Always try to use the full E164 number if possible
                    try {
                        const num = input.iti.getNumber();
                        if (num) {
                            input.value = num;
                        }
                    } catch(e) {}
                }
            });
            return originalSubmit.call(window, formElement, successMsg);
        };
        window._submitViaIframePatched = true;
    }
});
"""

# Append the init code to the end of the file
with open("script.js", "a") as file:
    file.write("\n" + init_code)

# We also need to call initPhoneInputs() after the ROI modal is injected dynamically
# Let's find: modalBody.innerHTML = newHtml;
content_mod = content.replace("modalBody.innerHTML = newHtml;", "modalBody.innerHTML = newHtml;\n    if (window.initPhoneInputs) window.initPhoneInputs();")

with open("script.js", "w") as file:
    file.write(content_mod)

print("Updated script.js")
