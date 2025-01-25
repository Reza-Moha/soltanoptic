import httpService from "@/services/http.service";
// employee api
export async function createNewEmployeeApi(data) {
  return httpService
    .post(`/api/admin/create-new-employee`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    .then(({ data }) => data);
}

export async function getAllEmployeeApi() {
  return httpService
    .get(`/api/admin/get-all-employee`)
    .then(({ data }) => data);
}

export async function deleteEmployeeByIdApi(id) {
  return httpService
    .delete(`/api/admin/delete-employee/${id}`)
    .then(({ data }) => data);
}

export async function updateEmployeeApi(id, data) {
  return httpService
    .patch(`/api/admin/update-employee/${id}`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    .then(({ data }) => data);
}
