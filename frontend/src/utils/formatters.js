export const formatSalary = (salary) => {
  if (salary === null || salary === undefined || isNaN(salary)) return '₹0.00';
  let currency = 'INR';
  let locale = 'en-IN';
  try {
    const saved = localStorage.getItem('peoplecore_settings');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.currency) currency = parsed.currency;
      if (parsed.numberFormatting) locale = parsed.numberFormatting;
    }
  } catch (e) {
    console.error(e);
  }
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number(salary));
};

export const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const d = new Date(dateString);
  if (isNaN(d.getTime())) return dateString;
  let format = 'DD/MM/YYYY';
  try {
    const saved = localStorage.getItem('peoplecore_settings');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.dateFormat) format = parsed.dateFormat;
    }
  } catch (e) {
    console.error(e);
  }
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();

  if (format === 'MM/DD/YYYY') return `${month}/${day}/${year}`;
  if (format === 'YYYY-MM-DD') return `${year}-${month}-${day}`;
  return `${day}/${month}/${year}`;
};

