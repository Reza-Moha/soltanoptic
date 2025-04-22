import httpService from "@/services/http.service";

export async function createNewInvoiceApi(data) {
  return httpService
    .post(`/api/admin/customers/create-new-invoice`, data)
    .then(({ data }) => data);
}
export async function getLastInvoiceNumberApi() {
  return httpService
    .get(`/api/admin/customers/get-last-invoice-number`)
    .then(({ data }) => data);
}
export async function getOrderLensDailyApi(date) {
  const query = date ? `?date=${encodeURIComponent(date)}` : "";
  return httpService
    .get(`/api/admin/customers/get-order-lens-daily${query}`)
    .then(({ data }) => data);
}

export async function sendSmsPurchaseApi(data) {
  return httpService
    .post(`/api/admin/customers/send-sms-purchase`, data)
    .then(({ data }) => data);
}
export async function sendLensOrderApi(data) {
  return httpService
    .post(`/api/admin/customers/sendLensOrder`, data)
    .then(({ data }) => data);
}
export async function sendToWorkshopApi(data) {
  return httpService
    .post(`/api/admin/customers/sendToWorkshop`, data)
    .then(({ data }) => data);
}
export async function sendToDeliverApi(data) {
  return httpService
    .post(`/api/admin/customers/sendToDeliver`, data)
    .then(({ data }) => data);
}
export async function sendSmsDeliveryApi(data) {
  return httpService
    .post(`/api/admin/customers/sendSmsDelivery`, data)
    .then(({ data }) => data);
}
export async function deliveryToCustomerApi(data) {
  return httpService
    .post(`/api/admin/customers/deliveryToCustomer`, data)
    .then(({ data }) => data);
}
export async function getAllInvoicesApi(page = 1, size = 30, search = "") {
  return httpService
    .get(`/api/admin/customers/getAllInvoices`, {
      params: {
        page,
        size,
        search,
      },
    })
    .then(({ data }) => data);
}
