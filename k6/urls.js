export const FRONTEND_BASE_URL = "https://localhost:8443";
export const CARSERVICE_BASE_URL = "http://localhost:18080";

export const FRONTEND_URLS = {
  home: {
    de: `${FRONTEND_BASE_URL}/de`,
    en: `${FRONTEND_BASE_URL}/en`,
  },
  cars: {
    de: {
      normal: `${FRONTEND_BASE_URL}/de/autos`,
      searchType: `${FRONTEND_BASE_URL}/de/autos?searchType=criteria&pickUpLocationId=1&returnLocationId=2&pickupAt=2027-09-10T10%3A00%3A00Z&returnAt=2027-09-11T10%3A00%3A00Z`
    },
    en: `${FRONTEND_BASE_URL}/en/cars`,
  },
  fleet: {
    de: `${FRONTEND_BASE_URL}/de/fuhrpark`,
    en: `${FRONTEND_BASE_URL}/en/fleet`,
  },
  aboutUs: {
    de: `${FRONTEND_BASE_URL}/de/ueber-uns`,
    en: `${FRONTEND_BASE_URL}/en/about-us`,
  },
  contact: {
    de: `${FRONTEND_BASE_URL}/de/kontakt`,
    en: `${FRONTEND_BASE_URL}/en/contact`,
  },
  myReservations: {
    de: `${FRONTEND_BASE_URL}/de/meine-reservierungen`,
    en: `${FRONTEND_BASE_URL}/en/my-reservations`,
  },
  profile: {
    de: `${FRONTEND_BASE_URL}/de/profil`,
    en: `${FRONTEND_BASE_URL}/en/profile`,
  },
  adminAi: {
    de: `${FRONTEND_BASE_URL}/de/admin/ai`,
    en: `${FRONTEND_BASE_URL}/en/admin/ai`,
  },
  adminRag: {
    de: `${FRONTEND_BASE_URL}/de/admin/rag/edit`,
    en: `${FRONTEND_BASE_URL}/en/admin/rag/edit`,
  },
  newReservation: (carId, locale = "de") =>
    `${FRONTEND_BASE_URL}/${locale}/reservation-car/new/${encodeURIComponent(carId)}`,
  reservation: (reservationId, locale = "de") =>
    `${FRONTEND_BASE_URL}/${locale}/reservation-car/${encodeURIComponent(reservationId)}`,
};

export const APP_API_URLS = {
  login: `${FRONTEND_BASE_URL}/api/login`,
  auth: `${FRONTEND_BASE_URL}/api/auth`,
  navigationRoles: `${FRONTEND_BASE_URL}/api/navigation/roles`,
  chat: `${FRONTEND_BASE_URL}/api/chat`,
  altchaChallenge: `${FRONTEND_BASE_URL}/api/altcha/challenge`,
};

export const CARSERVICE_URLS = {
  cars: `${CARSERVICE_BASE_URL}/cars`,
  carSearch: `${CARSERVICE_BASE_URL}/cars/search`,
  carSearchFreeText: `${CARSERVICE_BASE_URL}/cars/search/free-text`,
  locations: `${CARSERVICE_BASE_URL}/locations`,
  reservations: `${CARSERVICE_BASE_URL}/reservations`,
  reservation: `${CARSERVICE_BASE_URL}/reservation`,
  reservationOptions: `${CARSERVICE_BASE_URL}/reservation/options`,
  reservationById: (reservationId) =>
    `${CARSERVICE_BASE_URL}/reservation/${encodeURIComponent(reservationId)}`,
  reservationOptionsById: (reservationId) =>
    `${CARSERVICE_BASE_URL}/reservation/${encodeURIComponent(reservationId)}/options`,
  userMe: `${CARSERVICE_BASE_URL}/users/me`,
  paypalConfig: `${CARSERVICE_BASE_URL}/paypal/config`,
  paypalReservation: (reservationId) =>
    `${CARSERVICE_BASE_URL}/paypal/reservations/${encodeURIComponent(reservationId)}`,
  paypalOrders: `${CARSERVICE_BASE_URL}/paypal/orders`,
  paypalCapture: (orderId) =>
    `${CARSERVICE_BASE_URL}/paypal/orders/${encodeURIComponent(orderId)}/capture`,
  readiness: `${CARSERVICE_BASE_URL}/actuator/health/readiness`,
};

export const FLEET_URL = FRONTEND_URLS.fleet.en;
export const FLEET_URL_DE = FRONTEND_URLS.fleet.de;
export const CARSERVICE_URL = CARSERVICE_URLS.cars;