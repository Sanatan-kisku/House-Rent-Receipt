// Update total units consumed
function updateUnitsConsumed() {
  const currentReading = parseFloat(document.getElementById('current-unit').value) || 0;
  const previousReading = parseFloat(document.getElementById('previous-unit').value) || 0;

  // Calculate total units consumed
  const totalUnits = currentReading - previousReading;
  document.getElementById('total-unit').textContent = totalUnits > 0 ? totalUnits : 0;

  calculateElectricityCharges(totalUnits);
}

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

// Initialize
updateUnitsConsumed();
console.log(document.getElementById('tenant-name').innerText)

//download receipt
document.getElementById('download-btn').addEventListener('click', function () {
  const receipt = document.getElementById('receipt'); // The receipt to capture

  // Retrieve tenant's name and date from input fields
  const tenantName = document.getElementById('tenant-name').value.trim() || 'Tenant';
  const selectedDate = document.getElementById('date').value || new Date().toISOString().slice(0, 10); // Fallback to today's date if not entered

  // Format the file name
  const fileName = `${tenantName}-${selectedDate}.png`; // Example: JohnDoe-2024-11-26.png

  // Use html2canvas to capture the receipt as an image
  html2canvas(receipt, {
    scale: 2, // Increase the scale for higher resolution
    scrollX: 0, // Prevents including scroll offset
    scrollY: 0,
    useCORS: true // Avoid potential cross-origin issues
  }).then(canvas => {
    const link = document.createElement('a');
    link.download = fileName; // Dynamic file name
    link.href = canvas.toDataURL('image/png'); // Data URL of the canvas
    link.click(); // Trigger the download
  });
});

