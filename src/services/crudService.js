const { default: apiService } = require("./api/apiService");

class CrudService {
  async getSmartLinks(token) {
    return apiService.get(`/api/earning-reports/my-shortlink`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  async getPayoutsOfStudents(params) {
    return apiService.get(`/api/admin/earning-reports/payouts`, {
      params,
    });
  }

  async updatePayoutStatusByAdmin(payoutId, body) {
    return apiService.patch(
      `/api/admin/earning-reports/payouts/${payoutId}`,
      body
    );
  }

  async paymentRequest(data) {
    return apiService.post(`/api/earning-reports/payout-request`, {
      ...data,
    });
  }
}
export default new CrudService();
