// Showroom Owners & Contact Information
export const SHOWROOM_OWNERS = [
  {
    name: 'Rohit Patil',
    phone: '9130959393',
    formattedPhone: '+91 91309 59393',
    role: 'Partner & Showroom Lead',
  },
  {
    name: 'Amit Pawar',
    phone: '9096545144',
    formattedPhone: '+91 90965 45144',
    role: 'Partner & Sales Head',
  },
  {
    name: 'Yuvaraj Chavan',
    phone: '9689653300',
    formattedPhone: '+91 96896 53300',
    role: 'Partner & Vehicle Evaluation',
  },
];

export const SHOWROOM_INFO = {
  nameMarathi: 'साईबाबा मोटर्स',
  nameEnglish: 'Sai Baba Motors',
  subtitle: 'Used Cars & Bikes',
  tagline: 'Find quality pre-owned cars and bikes at the right price.',
  location: 'Kasba Walve, Taluka Radhanagari, Dist. Kolhapur, Maharashtra',
  mapsUrl: 'https://maps.app.goo.gl/WQ68i3YbbE5u36jY8',
  workingHours: 'All 7 Days: 9:00 AM – 8:30 PM',
};

// Format currency into Indian Rupee format (e.g. ₹5,25,000 or ₹9.25 Lakh)
export const formatPrice = (price, useLakhFormat = false) => {
  if (price === undefined || price === null || isNaN(price)) return '₹0';
  const num = Number(price);

  if (useLakhFormat) {
    if (num >= 10000000) {
      return `₹${(num / 10000000).toFixed(2)} Cr`;
    }
    if (num >= 100000) {
      return `₹${(num / 100000).toFixed(2)} Lakh`;
    }
  }

  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(num);
};

// Format running distance (e.g. 45000 -> 45,000 km)
export const formatKm = (km) => {
  if (km === undefined || km === null || isNaN(km)) return '0 km';
  return `${new Intl.NumberFormat('en-IN').format(km)} km`;
};

// Format Date string
export const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date);
};

// Generate Direct WhatsApp enquiry link with pre-filled message
export const getWhatsAppLink = (phone = '9130959393', vehicle = null) => {
  let message = 'Hello Sai Baba Motors, I would like more information about your used cars and bikes in Kasba Walve.';

  if (vehicle) {
    const title = `${vehicle.year || ''} ${vehicle.brand || ''} ${vehicle.model || ''} ${vehicle.variant || ''}`.trim();
    const priceStr = formatPrice(vehicle.price);
    message = `Hello Sai Baba Motors, I am interested in this vehicle: ${title} (Price: ${priceStr}). Passing: ${vehicle.passing || 'N/A'}. Please provide more details and test drive availability.`;
  }

  return `https://wa.me/91${phone}?text=${encodeURIComponent(message)}`;
};

// Generate Call link
export const getCallLink = (phone) => {
  return `tel:+91${phone}`;
};
