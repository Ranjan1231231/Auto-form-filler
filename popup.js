document.addEventListener('DOMContentLoaded', () => {
  const autoSubmitTimeInput = document.getElementById('autoSubmitTime');
  const autoSubmitCheckbox = document.getElementById('autoSubmit');
  const customFieldsContainer = document.getElementById('customFields');
  const addFieldButton = document.getElementById('addField');
  const darkModeToggle = document.getElementById('darkModeToggle');

  // Load saved values and populate the fields
  chrome.storage.local.get(['customFields', 'autoSubmitEnabled', 'autoSubmitTime', 'darkModeEnabled'], function(data) {
    if (data.autoSubmitTime) autoSubmitTimeInput.value = data.autoSubmitTime;
    if (data.autoSubmitEnabled) autoSubmitCheckbox.checked = data.autoSubmitEnabled;

    if (data.customFields && data.customFields.length > 0) {
      data.customFields.forEach(field => {
        addCustomField(field.field, field.value);
      });
    }

    // Dark mode toggle
    if (data.darkModeEnabled) {
      darkModeToggle.checked = true;
      document.body.classList.add('dark-mode');
    }
  });

  // Save the values when the "Save" button is clicked
  document.getElementById('save').addEventListener('click', () => {
    const autoSubmitTime = autoSubmitTimeInput.value;
    const autoSubmitEnabled = autoSubmitCheckbox.checked;
    const darkModeEnabled = darkModeToggle.checked;

    const customFields = [];
    document.querySelectorAll('.custom-field').forEach(field => {
      const fieldInput = field.querySelector('input.field');
      const valueInput = field.querySelector('input.value');
      if (fieldInput.value && valueInput.value) {
        customFields.push({ field: fieldInput.value, value: valueInput.value });
      }
    });

    chrome.storage.local.set({ customFields, autoSubmitEnabled, autoSubmitTime, darkModeEnabled }, () => {
      alert('Settings saved!');
    });
  });

  // Trigger autofill when "Autofill" button is clicked
  document.getElementById('autofill').addEventListener('click', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, { action: 'autofill' });
    });
  });

  // Add custom field functionality
  addFieldButton.addEventListener('click', () => {
    addCustomField('', '');
  });

  function addCustomField(fieldValue, valueValue) {
    const customFieldDiv = document.createElement('div');
    customFieldDiv.classList.add('custom-field');

    const fieldInput = document.createElement('input');
    fieldInput.classList.add('field');
    fieldInput.type = 'text';
    fieldInput.placeholder = 'Field';
    fieldInput.value = fieldValue;

    const valueInput = document.createElement('input');
    valueInput.classList.add('value');
    valueInput.type = 'text';
    valueInput.placeholder = 'Value';
    valueInput.value = valueValue;

    const removeButton = document.createElement('button');
    removeButton.textContent = 'Remove';
    removeButton.addEventListener('click', () => {
      customFieldDiv.remove();
    });

    customFieldDiv.appendChild(fieldInput);
    customFieldDiv.appendChild(valueInput);
    customFieldDiv.appendChild(removeButton);
    customFieldsContainer.appendChild(customFieldDiv);
  }

  // Dark mode toggle functionality
  darkModeToggle.addEventListener('change', () => {
    if (darkModeToggle.checked) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  });
});
