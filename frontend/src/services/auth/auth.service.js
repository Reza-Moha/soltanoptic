import httpService from "@/services/http.service";

export async function getOtpApi(data) {
  return httpService.post(`/api/auth/get-otp`, data).then(({ data }) => data);
}
export async function checkOtpApi(data) {
  return httpService.post(`/api/auth/check-otp`, data).then(({ data }) => data);
}
export async function logOutApi() {
  return httpService.get(`/api/auth/log-out`).then(({ data }) => data);
}
