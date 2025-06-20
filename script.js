(() => {
  const managerDistricts = {
    "Rohit Kumar": ["Nalanda", "Banka", "Bhagalpur", "Jamui", "Khagaria", "Munger"],
    "Dharmendra Kumar": ["Arwal", "Aurangabad", "Gaya", "Jehanabad", "Sitamarhi", "Sheohar", "Vaishali"],
    "Shalu Kumari": ["Begusarai", "Katihar", "Kishanganj", "Araria", "Nawada", "Purnia"],
    "Rahul Kumar": ["Bhojpur", "Buxar", "Kaimur", "Patna", "Rohtas", "Samastipur"],
    "Vishwanath Singh": ["Darbhanga", "East Champaran", "Madhubani", "West Champaran"],
    "Ritesh Kumar Rohit": ["Gopalganj", "Muzaffarpur", "Saran", "Siwan"],
    "Markandey Shahi": ["Lakhisarai", "Madhepura", "Saharsa", "Sheikhpura", "Supaul"]
  };

  // Cache DOM elements
  const managerSelect = document.getElementById('manager');
  const districtContainer = document.getElementById('districtCheckboxes');
  const phoneInput = document.getElementById('phone');
  const form = document.getElementById('dataForm');
  const msgDiv = document.getElementById('msg');
  const scheduleDateInput = document.getElementById('schedule_date');
  const nameInput = document.getElementById('name');
  const countryCodeSelect = document.getElementById('countryCode');
  const submitButton = form.querySelector('button[type="submit"]');

  // Populate district checkboxes when manager changes
  managerSelect.addEventListener('change', () => {
    const selectedManager = managerSelect.value;
    districtContainer.innerHTML = '';

    if (selectedManager && managerDistricts[selectedManager]) {
      managerDistricts[selectedManager].forEach(district => {
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.value = district;
        checkbox.id = `dist_${district.replace(/\s+/g, '_')}`;
        checkbox.name = 'districts';

        const label = document.createElement('label');
        label.htmlFor = checkbox.id;
        label.textContent = district;
        label.style.marginRight = '10px';

        const wrapper = document.createElement('div');
        wrapper.appendChild(checkbox);
        wrapper.appendChild(label);

        districtContainer.appendChild(wrapper);
      });
    }
  });

  // Get selected districts array
  const getSelectedDistricts = () => {
    const checkedBoxes = districtContainer.querySelectorAll('input[type="checkbox"]:checked');
    return Array.from(checkedBoxes).map(cb => cb.value);
  };

  // Restrict phone input to digits only, max 10 digits
  phoneInput.addEventListener('input', () => {
    phoneInput.value = phoneInput.value.replace(/\D/g, '').slice(0, 10);
  });

  // Form submission handler
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    msgDiv.textContent = '';
    
    const selectedDistricts = getSelectedDistricts();
    const phone = phoneInput.value.trim();
    const scheduleDate = scheduleDateInput.value;
    const manager = managerSelect.value;
    const name = nameInput.value.trim();
    const countryCode = countryCodeSelect.value;

    // Validation checks
    if (!manager) {
      alert("❌ Please select a manager.");
      managerSelect.focus();
      return;
    }

    if (selectedDistricts.length === 0) {
      alert("❌ Please select at least one district.");
      districtContainer.focus();
      return;
    }

    if (!/^\d{10}$/.test(phone)) {
      alert("❌ Please enter a valid 10-digit phone number.");
      phoneInput.focus();
      return;
    }

    if (!name) {
      alert("❌ Please enter your name with designation.");
      nameInput.focus();
      return;
    }

    if (!scheduleDate) {
      alert("❌ Please select a schedule date.");
      scheduleDateInput.focus();
      return;
    }

    const today = new Date().toISOString().split('T')[0];
    if (scheduleDate < today) {
      alert("❌ Schedule date cannot be in the past.");
      scheduleDateInput.focus();
      return;
    }

    // Prepare data object
    const data = {
      manager,
      district: selectedDistricts.join(", "),
      name,
      phone: countryCode + phone,
      schedule_date: scheduleDate
    };

    // Disable submit button to prevent multiple submits
    submitButton.disabled = true;

    try {
      await fetch('https://script.google.com/macros/s/AKfycbz96cEfcv6tdQ6qADQhengTAIuEtCt2gZFAWQfJkgp32HSxAvusIyQCvqKo0zDUjW3j/exec', {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      msgDiv.textContent = "✅ Data submitted successfully!";
      msgDiv.style.color = 'green';

      // Reset form and districts
      form.reset();
      districtContainer.innerHTML = '';

    } catch (error) {
      console.error('Submission error:', error);
      msgDiv.textContent = `❌ Error submitting data: ${error.message || error}`;
      msgDiv.style.color = 'red';
    } finally {
      submitButton.disabled = false;
    }
  });
})();
