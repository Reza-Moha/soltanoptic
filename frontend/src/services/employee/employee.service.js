import httpService from "@/services/http.service";

export async function team_getAllInsuranceApi() {
  return httpService
    .get(`/api/team/get-all-insurance`)
    .then(({ data }) => data);
}
