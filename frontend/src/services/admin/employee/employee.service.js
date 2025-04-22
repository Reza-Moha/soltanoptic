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
export async function getEmployeePerformanceApi(id) {
  return httpService
    .get(`/api/employee/receivePerformance/${id}`)
    .then(({ data }) => data);
}
export async function getAccountingReportApi(query = "") {
  try {
    const queryString =
      typeof query === "string" && query.trim().startsWith("?") ? query : "";

    const response = await httpService.get(
      `/api/employee/accountingReport${queryString}`,
    );
    return response.data;
  } catch (error) {
    console.error("API Error:", error);
    throw error.response?.data || error.message || "Unexpected error";
  }
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
