function extractMonthYear() {
  // Get the value from the date input
  const dateInput = document.getElementById('date').value;

  // Ensure a date is selected
  if (dateInput) {
    // Create a Date object from the input
    const date = new Date(dateInput);

    // Get the full month name and year
    const monthName = date.toLocaleString('default', { month: 'long' });
    const year = date.getFullYear();

    // Format as "Month Year"
    const formattedMonthYear = `${monthName} ${year}`;

    // Set the value in the text input
    document.getElementById('month').value = formattedMonthYear;
  } else {
    // Clear the text input if no date is selected
    document.getElementById('month').value = '';
    alert('Please select a date.');
  }
}

// function getFormattedMonth() {
//   // Get the month input value
//   const monthInput = document.getElementById('month').value;

//   // If there's a value selected
//   if (monthInput) {
//     // Split the input value into year and month
//     const [year, month] = monthInput.split('-');

//     // Create a Date object for the selected month and year
//     const date = new Date(year, month - 1); // month is 0-indexed in JavaScript

//     // Get the full month name
//     const monthName = date.toLocaleString('default', { month: 'long' });

//     // Format the output as "Month Year" (e.g., "November 2024")
//     const formattedDate = `${monthName} ${year}`;

//     // Display the result
//     document.getElementById('month').textContent = formattedDate;
//     console.log(formattedDate)
//     console.log(document.getElementById('month').textContent)
//   }
// }

// Update total units consumed
function updateUnitsConsumed() {
  const currentReading = parseFloat(document.getElementById('current-unit').value) || 0;
  const previousReading = parseFloat(document.getElementById('previous-unit').value) || 0;

  // Calculate total units consumed
  const totalUnits = currentReading - previousReading;
  document.getElementById('total-unit').textContent = totalUnits > 0 ? totalUnits : 0;

  calculateElectricityCharges(totalUnits);
}

// console.log(document.getElementById('month').value)

// Calculate electricity charges
function calculateElectricityCharges(totalUnits) {
  const tiers = [
    { maxUnits: 25, rate: 3 },
    { maxUnits: 75, rate: 4.7 },
    { maxUnits: 100, rate: 5.7 },
    { maxUnits: Infinity, rate: 6.1 }
  ];

  let remainingUnits = totalUnits;
  let totalCost = 0;

  tiers.forEach((tier, index) => {
    const consumedUnits = Math.min(remainingUnits, tier.maxUnits);
    const tierCost = consumedUnits * tier.rate;

    totalCost += tierCost;
    remainingUnits -= consumedUnits;

    // Update the table
    document.getElementById(`tier-${index + 1}-units`).textContent = consumedUnits > 0 ? consumedUnits : 0;
    document.getElementById(`tier-${index + 1}-total`).textContent = tierCost.toFixed(2);
  });

  // Add electricity duty
  const electricityDuty = parseFloat(document.getElementById('electricity-duty').value) || 0;
  totalCost += electricityDuty;

  // Update total electricity charges
  document.getElementById('electricity-charges').textContent = totalCost.toFixed(2);

  // console.log(document.getElementById('month').value)
  updateTotalPayable();
}

// Update total payable amount
function updateTotalPayable() {
  const electricityCharges = parseFloat(document.getElementById('electricity-charges').textContent) || 0;
  const waterCharges = parseFloat(document.getElementById('water-charges').value) || 0;
  const houseRentCharges = parseFloat(document.getElementById('house-rent-charges').value) || 0;
  const otherCharges = parseFloat(document.getElementById('other-charges').value) || 0;

  // Calculate total payable amount
  const totalPayable = electricityCharges + waterCharges + houseRentCharges + otherCharges;
  document.getElementById('total-payable').textContent = totalPayable.toFixed(2);
}

// Add event listeners
document.getElementById('current-unit').addEventListener('input', updateUnitsConsumed);
document.getElementById('previous-unit').addEventListener('input', updateUnitsConsumed);
document.getElementById('electricity-duty').addEventListener('input', () => {
  const totalUnits = parseFloat(document.getElementById('total-unit').textContent) || 0;
  calculateElectricityCharges(totalUnits);
});
document.getElementById('water-charges').addEventListener('input', updateTotalPayable);
document.getElementById('house-rent-charges').addEventListener('input', updateTotalPayable);
document.getElementById('other-charges').addEventListener('input', updateTotalPayable);
// document.getElementById('month').addEventListener('input', extractMonthYear);
// document.getElementById('month').addEventListener('input', getFormattedMonth)

// Initialize
updateUnitsConsumed();
// console.log(document.getElementById('tenant-name').innerText)

//download receipt
document.getElementById('download-btn').addEventListener('click', function () {
  const receipt = document.getElementById('receipt'); // The receipt to capture
  // const month = document.getElementById('month').textContent;

  // Retrieve tenant's name and date from input fields
  const tenantName = document.getElementById('tenant-name').value.trim() || 'Tenant';
  const selectedDate = document.getElementById('date').value || new Date().toISOString().slice(0, 10); // Fallback to today's date if not entered

  // Format the file name
  const fileName = `${tenantName}-${selectedDate}.png`; // Example: JohnDoe-2024-11-26.png

  // Convert input fields to plain text for the image
  const inputs = receipt.querySelectorAll('input');
  const originalValues = [];

  // console.log(document.getElementById('month').textContent)

  inputs.forEach(input => {
    const span = document.createElement('span');
    span.textContent = input.value; // Replace input with its value
    span.style.display = 'inline'; // Keep layout intact
    // span.style.width = input.offsetWidth + 'px'; // Match width
    // span.style.height = input.offsetHeight + 'px'; // Match height
    // span.style.lineHeight = input.offsetHeight + 'px'; // Vertically center the text
    span.style.fontSize = window.getComputedStyle(input).fontSize; // Match font size
    span.style.fontFamily = window.getComputedStyle(input).fontFamily; // Match font
    span.style.color = window.getComputedStyle(input).color; // Match color
    span.style.outline = 'none';
    span.style.border = "#fff";

    originalValues.push({ input, span });
    input.replaceWith(span);
  })
    ;


  html2canvas(receipt, {
    scale: 2, // Increase the scale for higher resolution
    scrollX: 0, // Prevents including scroll offset
    scrollY: 0,
    width: receipt.offsetWidth,  // Ensure full width
    height: receipt.offsetHeight,  // Ensure full height
    useCORS: true // Avoid potential cross-origin issues
  }).then(canvas => {

    // Restore original input fields after capture
    originalValues.forEach(({ input, span }) => {
      span.replaceWith(input);
    });

    const link = document.createElement('a');
    link.download = fileName; // Dynamic file name
    link.href = canvas.toDataURL('image/png'); // Data URL of the canvas
    link.click(); // Trigger the download
  });
});

