import httpService from "@/services/http.service";

export async function createFrameCategoryApi(data) {
  return httpService
    .post(`/api/admin/frame/create-category`, data)
    .then(({ data }) => data);
}
