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
export async function getOrderLensDailyApi() {
  return httpService
    .get(`/api/admin/customers/get-order-lens-daily`)
    .then(({ data }) => data);
}

export async function sendSmsPurchaseApi(data) {
  return httpService
    .post(`/api/admin/customers/send-sms-purchase`, data)
    .then(({ data }) => data);
}
