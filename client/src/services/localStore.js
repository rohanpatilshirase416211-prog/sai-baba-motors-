import { initialVehicles, initialEnquiries, initialSellRequests } from '../data/mockData';

const VEHICLES_KEY = 'saibaba_demo_vehicles';
const ENQUIRIES_KEY = 'saibaba_demo_enquiries';
const SELL_REQUESTS_KEY = 'saibaba_demo_sell_requests';
const STORE_VERSION_KEY = 'saibaba_store_version';
const DATA_VERSION = 'v3_2026_09_03_pickup_sync';

// Initialize storage if empty or version changed
export const getStoredVehicles = () => {
  try {
    const savedVersion = localStorage.getItem(STORE_VERSION_KEY);
    if (savedVersion !== DATA_VERSION) {
      localStorage.setItem(STORE_VERSION_KEY, DATA_VERSION);
      localStorage.setItem(VEHICLES_KEY, JSON.stringify(initialVehicles));
      return initialVehicles;
    }

    const raw = localStorage.getItem(VEHICLES_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn('Could not parse stored vehicles:', e);
  }
  localStorage.setItem(STORE_VERSION_KEY, DATA_VERSION);
  localStorage.setItem(VEHICLES_KEY, JSON.stringify(initialVehicles));
  return initialVehicles;
};

export const saveStoredVehicles = (list) => {
  localStorage.setItem(VEHICLES_KEY, JSON.stringify(list));
};

export const getStoredEnquiries = () => {
  try {
    const raw = localStorage.getItem(ENQUIRIES_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn('Could not parse stored enquiries:', e);
  }
  localStorage.setItem(ENQUIRIES_KEY, JSON.stringify(initialEnquiries));
  return initialEnquiries;
};

export const saveStoredEnquiries = (list) => {
  localStorage.setItem(ENQUIRIES_KEY, JSON.stringify(list));
};

export const getStoredSellRequests = () => {
  try {
    const raw = localStorage.getItem(SELL_REQUESTS_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn('Could not parse stored sell requests:', e);
  }
  localStorage.setItem(SELL_REQUESTS_KEY, JSON.stringify(initialSellRequests));
  return initialSellRequests;
};

export const saveStoredSellRequests = (list) => {
  localStorage.setItem(SELL_REQUESTS_KEY, JSON.stringify(list));
};

// Auth Mock
export const localAuthLogin = async ({ email, password }) => {
  const cleanEmail = (email || '').trim().toLowerCase();
  const cleanPassword = (password || '').trim();

  // STRICT: Only allow rohanp0568@gmail.com as username/email
  if (cleanEmail !== 'rohanp0568@gmail.com') {
    const err = new Error('Invalid credentials. User not found.');
    err.response = { data: { success: false, message: 'Invalid credentials. User not found.' } };
    throw err;
  }

  // STRICT: Only allow Rohan@0568 as password
  if (cleanPassword !== 'Rohan@0568') {
    const err = new Error('Invalid credentials. Password incorrect.');
    err.response = { data: { success: false, message: 'Invalid credentials. Password incorrect.' } };
    throw err;
  }

  const user = {
    id: 'admin_saibaba_kasba_walve',
    name: 'Rohan Patil — Admin',
    email: 'rohanp0568@gmail.com',
    role: 'admin',
  };
  const token = 'demo_jwt_saibaba_kasba_walve_2026';
  return {
    data: {
      success: true,
      token,
      user,
    },
  };
};

export const localAuthGetMe = async () => {
  const token = localStorage.getItem('saibaba_admin_token');
  if (!token) {
    const err = new Error('Not authorized');
    err.response = { status: 401, data: { success: false, message: 'Not authorized' } };
    throw err;
  }
  return {
    data: {
      success: true,
      user: {
        id: 'admin_saibaba_kasba_walve',
        name: 'Rohan Patil — Admin',
        email: 'rohanp0568@gmail.com',
        role: 'admin',
      },
    },
  };
};

// Vehicles
export const localGetVehicles = async (params = {}) => {
  let list = [...getStoredVehicles()];

  if (params.type && params.type !== 'all') {
    list = list.filter((v) => v.vehicleType === params.type);
  }

  if (params.status && params.status !== 'all') {
    list = list.filter((v) => v.status === params.status);
  } else if (!params.status) {
    // default public view shows available
    list = list.filter((v) => v.status === 'available');
  }

  if (params.brand) {
    list = list.filter((v) => v.brand.toLowerCase() === params.brand.toLowerCase());
  }

  if (params.passing) {
    list = list.filter((v) => v.passing.toLowerCase().includes(params.passing.toLowerCase()));
  }

  if (params.fuelType) {
    list = list.filter((v) => v.fuelType.toLowerCase() === params.fuelType.toLowerCase());
  }

  if (params.transmission) {
    list = list.filter((v) => v.transmission.toLowerCase() === params.transmission.toLowerCase());
  }

  if (params.ownership) {
    list = list.filter((v) => v.ownership.toLowerCase() === params.ownership.toLowerCase());
  }

  if (params.maxPrice) {
    list = list.filter((v) => Number(v.price) <= Number(params.maxPrice));
  }

  if (params.maxRunning) {
    list = list.filter((v) => Number(v.running) <= Number(params.maxRunning));
  }

  if (params.search) {
    const q = params.search.toLowerCase();
    list = list.filter(
      (v) =>
        v.brand.toLowerCase().includes(q) ||
        v.model.toLowerCase().includes(q) ||
        (v.variant && v.variant.toLowerCase().includes(q)) ||
        (v.passing && v.passing.toLowerCase().includes(q)) ||
        (v.registration && v.registration.toLowerCase().includes(q))
    );
  }

  // Sorting
  if (params.sort === 'price-low') {
    list.sort((a, b) => a.price - b.price);
  } else if (params.sort === 'price-high') {
    list.sort((a, b) => b.price - a.price);
  } else if (params.sort === 'km-low') {
    list.sort((a, b) => a.running - b.running);
  } else if (params.sort === 'year-new') {
    list.sort((a, b) => b.year - a.year);
  } else {
    // Default newest
    list.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
  }

  return {
    data: {
      success: true,
      count: list.length,
      total: list.length,
      data: list,
    },
  };
};

export const localGetFeatured = async (limit = 6) => {
  const all = getStoredVehicles();
  const featured = all.filter((v) => v.featured && v.status === 'available');
  return {
    data: {
      success: true,
      count: featured.length,
      data: featured.slice(0, limit),
    },
  };
};

export const localGetFilters = async (type = 'all') => {
  let list = getStoredVehicles();
  if (type && type !== 'all') {
    list = list.filter((v) => v.vehicleType === type);
  }
  const brands = [...new Set(list.map((v) => v.brand).filter(Boolean))].sort();
  const passingList = [...new Set(list.map((v) => v.passing).filter(Boolean))].sort();

  return {
    data: {
      success: true,
      data: {
        brands,
        passingList,
      },
    },
  };
};

export const localGetVehicleById = async (id) => {
  const all = getStoredVehicles();
  const vehicle = all.find((v) => v._id === id || String(v._id) === String(id));
  if (!vehicle) {
    const err = new Error('Vehicle not found');
    err.response = { status: 404, data: { success: false, message: 'Vehicle not found' } };
    throw err;
  }
  const relatedVehicles = all
    .filter((v) => v._id !== vehicle._id && v.vehicleType === vehicle.vehicleType && v.status === 'available')
    .slice(0, 3);

  return {
    data: {
      success: true,
      data: vehicle,
      relatedVehicles,
    },
  };
};

export const localCreateVehicle = async (vehicleData) => {
  const all = getStoredVehicles();
  const newVehicle = {
    ...vehicleData,
    _id: 'veh-' + Date.now(),
    status: vehicleData.status || 'available',
    featured: !!vehicleData.featured,
    createdAt: new Date().toISOString(),
  };
  all.unshift(newVehicle);
  saveStoredVehicles(all);
  return {
    data: {
      success: true,
      data: newVehicle,
    },
  };
};

export const localUpdateVehicle = async (id, vehicleData) => {
  const all = getStoredVehicles();
  const idx = all.findIndex((v) => v._id === id || String(v._id) === String(id));
  if (idx === -1) {
    const err = new Error('Vehicle not found');
    err.response = { status: 404, data: { success: false, message: 'Vehicle not found' } };
    throw err;
  }
  all[idx] = { ...all[idx], ...vehicleData, updatedAt: new Date().toISOString() };
  saveStoredVehicles(all);
  return {
    data: {
      success: true,
      data: all[idx],
    },
  };
};

export const localDeleteVehicle = async (id) => {
  const all = getStoredVehicles();
  const filtered = all.filter((v) => v._id !== id && String(v._id) !== String(id));
  saveStoredVehicles(filtered);
  return {
    data: {
      success: true,
      message: 'Vehicle removed successfully',
    },
  };
};

export const localUpdateStatus = async (id, status) => {
  return localUpdateVehicle(id, { status });
};

export const localToggleFeatured = async (id) => {
  const all = getStoredVehicles();
  const vehicle = all.find((v) => v._id === id || String(v._id) === String(id));
  if (!vehicle) {
    const err = new Error('Vehicle not found');
    err.response = { status: 404, data: { success: false, message: 'Vehicle not found' } };
    throw err;
  }
  return localUpdateVehicle(id, { featured: !vehicle.featured });
};

// Enquiries
export const localCreateEnquiry = async (data) => {
  const all = getStoredEnquiries();
  const newEnq = {
    ...data,
    _id: 'enq-' + Date.now(),
    status: 'New',
    createdAt: new Date().toISOString(),
  };
  all.unshift(newEnq);
  saveStoredEnquiries(all);
  return {
    data: {
      success: true,
      data: newEnq,
    },
  };
};

export const localGetEnquiries = async (params = {}) => {
  let all = getStoredEnquiries();
  if (params.status && params.status !== 'all') {
    all = all.filter((e) => e.status === params.status);
  }
  return {
    data: {
      success: true,
      count: all.length,
      data: all,
    },
  };
};

export const localUpdateEnquiryStatus = async (id, status) => {
  const all = getStoredEnquiries();
  const idx = all.findIndex((e) => e._id === id || String(e._id) === String(id));
  if (idx !== -1) {
    all[idx].status = status;
    saveStoredEnquiries(all);
    return { data: { success: true, data: all[idx] } };
  }
  const err = new Error('Enquiry not found');
  err.response = { status: 404, data: { success: false, message: 'Enquiry not found' } };
  throw err;
};

export const localDeleteEnquiry = async (id) => {
  const all = getStoredEnquiries();
  const filtered = all.filter((e) => e._id !== id && String(e._id) !== String(id));
  saveStoredEnquiries(filtered);
  return { data: { success: true, message: 'Enquiry deleted' } };
};

// Sell Requests
export const localCreateSellRequest = async (data) => {
  const all = getStoredSellRequests();
  const newReq = {
    ...data,
    _id: 'sell-' + Date.now(),
    status: 'New',
    createdAt: new Date().toISOString(),
  };
  all.unshift(newReq);
  saveStoredSellRequests(all);
  return {
    data: {
      success: true,
      data: newReq,
    },
  };
};

export const localGetSellRequests = async (params = {}) => {
  let all = getStoredSellRequests();
  if (params.status && params.status !== 'all') {
    all = all.filter((s) => s.status === params.status);
  }
  return {
    data: {
      success: true,
      count: all.length,
      data: all,
    },
  };
};

export const localUpdateSellRequestStatus = async (id, status) => {
  const all = getStoredSellRequests();
  const idx = all.findIndex((s) => s._id === id || String(s._id) === String(id));
  if (idx !== -1) {
    all[idx].status = status;
    saveStoredSellRequests(all);
    return { data: { success: true, data: all[idx] } };
  }
  const err = new Error('Sell request not found');
  err.response = { status: 404, data: { success: false, message: 'Sell request not found' } };
  throw err;
};

export const localDeleteSellRequest = async (id) => {
  const all = getStoredSellRequests();
  const filtered = all.filter((s) => s._id !== id && String(s._id) !== String(id));
  saveStoredSellRequests(filtered);
  return { data: { success: true, message: 'Sell request deleted' } };
};

// Stats
export const localGetStats = async () => {
  const vehicles = getStoredVehicles();
  const enquiries = getStoredEnquiries();
  const sellRequests = getStoredSellRequests();

  const totalVehicles = vehicles.length;
  const totalCars = vehicles.filter((v) => v.vehicleType === 'car').length;
  const totalBikes = vehicles.filter((v) => v.vehicleType === 'bike').length;
  const featuredVehicles = vehicles.filter((v) => v.featured).length;
  const soldVehicles = vehicles.filter((v) => v.status === 'sold').length;
  const availableVehicles = vehicles.filter((v) => v.status === 'available').length;

  const totalEnquiries = enquiries.length;
  const newEnquiries = enquiries.filter((e) => e.status === 'New').length;

  const totalSellRequests = sellRequests.length;
  const newSellRequests = sellRequests.filter((s) => s.status === 'New').length;

  return {
    data: {
      success: true,
      data: {
        totalVehicles,
        totalCars,
        totalBikes,
        featuredVehicles,
        soldVehicles,
        availableVehicles,
        totalEnquiries,
        newEnquiries,
        totalSellRequests,
        newSellRequests,
        recentEnquiries: enquiries.slice(0, 5),
        recentSellRequests: sellRequests.slice(0, 5),
      },
    },
  };
};
