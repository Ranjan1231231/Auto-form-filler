function fillForm(data) {
  const customFields = data.customFields || [];

  console.log('Filling form with custom fields:', customFields);

  // Fill the form inputs (short answer type)
  const inputs = document.querySelectorAll('input[aria-labelledby]');
  inputs.forEach(input => {
    fillInputField(input, customFields);
  });

  // Fill the paragraph inputs (paragraph type)
  const textareas = document.querySelectorAll('textarea[aria-labelledby]');
  textareas.forEach(textarea => {
    fillInputField(textarea, customFields);
  });

  // Auto-submit if enabled
  if (data.autoSubmitEnabled) {
    const submitTime = data.autoSubmitTime * 1000; // Convert to milliseconds
    if (submitTime > 0) {
      console.log(`Waiting ${data.autoSubmitTime} seconds to submit the form...`);
      setTimeout(() => {
        submitForm();
      }, submitTime);
    }
  }
}

function fillInputField(element, customFields) {
  const labelId = element.getAttribute('aria-labelledby');
  const labelElement = document.getElementById(labelId);

  if (labelElement) {
    const labelText = labelElement.textContent.trim().toLowerCase();
    console.log('Label:', labelText);
    customFields.forEach(customField => {
      if (labelText.includes(customField.field.toLowerCase())) {
        element.value = customField.value;
        triggerInputEvent(element);
      }
    });
  }
}

function triggerInputEvent(element) {
  const inputEvent = new Event('input', { bubbles: true });
  const changeEvent = new Event('change', { bubbles: true });
  element.dispatchEvent(inputEvent);
  element.dispatchEvent(changeEvent);
}

function submitForm() {
  console.log('Attempting to find and submit the form...');

  // Try to find the submit button
  let submitButton = document.querySelector('button[type="submit"]');
  if (!submitButton) {
    submitButton = document.querySelector('input[type="submit"]');
  }
  if (!submitButton) {
    // Try to find a submit button in the form
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
      const firstButton = form.querySelector('button');
      if (firstButton) {
        submitButton = firstButton;
      }
    });
  }

  // If submitButton still not found, log additional information
  if (!submitButton) {
    console.log('Submit button not found, attempting form submit...');
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
      if (form) {
        form.submit();
        console.log('Form submitted.');
      } else {
        console.log('No forms found for submission.');
      }
    });
  } else {
    console.log('Submit button found:', submitButton);
    submitButton.click();
  }
}

// Automatically fill the form when the page loads
chrome.storage.local.get(['customFields', 'autoSubmitEnabled', 'autoSubmitTime'], fillForm);
