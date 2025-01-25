import httpService from "@/services/http.service";

export async function getUserProfileApi() {
  return httpService.get(`/api/user/user-profile`).then(({ data }) => data);
}
