import httpService from "@/services/http.service";
// doctor api
export async function createNewDoctorApi(data) {
  return httpService
    .post(`/api/admin/doctors/create-new`, data)
    .then(({ data }) => data);
}
export async function getAllDoctorsApi() {
  return httpService
    .get(`/api/admin/doctors/get-all-doctors`)
    .then(({ data }) => data);
}
export async function getDoctorById(id) {
  return httpService
    .get(`/api/admin/doctors/get-byId/${id}`)
    .then(({ data }) => data);
}
export async function deleteDoctorById(id) {
  return httpService
    .delete(`/api/admin/doctors/delete/${id}`)
    .then(({ data }) => data);
}
export async function updateDoctorsApi(id, data) {
  return httpService
    .patch(`/api/admin/doctor/update/${id}`, data)
    .then(({ data }) => data);
}
