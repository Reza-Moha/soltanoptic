import httpService from "@/services/http.service";

export async function updateAdminProfileApi(data) {
  return httpService
    .patch(`/api/admin/admin-profile-update`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    .then(({ data }) => data);
}
