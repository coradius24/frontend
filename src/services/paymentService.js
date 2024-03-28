const { default: apiService } = require("./api/apiService");

class PaymentService {
  async createPayment({ courseId, amount, couponApplied }) {
    // TODO: un comment this when surjo pay is ready
    // return apiService.post(`/api/payments/shurjopay-create-payment`, {
    //   courseId,
    //   amount,
    //   couponApplied,
    // });
  }
  async verifyPayment(orderId) {
    return apiService.post(`/api/payments/shurjopay-verify-payment/${orderId}`);
  }

  async paymentHistory(filter) {
    return apiService.get(`/api/payments/my-payments?${filter || ""}`);
  }

  async getDueInvoiceOfACourse(courseId, token) {
    return apiService.get(`/api/payments/my-invoice/${courseId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  async paymentHistoryByAdmin(params) {
    return apiService.get(`/api/admin/payments`, {
      params,
    });
  }

  async paymentHistoryByUserId(userId, params) {
    return apiService.get(`/api/admin/payments/users/${userId}`, {
      params,
    });
  }

  async paymentStats() {
    return apiService.get(`/api/admin/payments/stats`);
  }

  async paymentSpikes(params) {
    return apiService.get(`/api/admin/payments/daily-spikes`, { params });
  }
  async getDuePayments(params) {
    return apiService.get(`/api/admin/payments/dues`, { params });
  }
  async removePayment(id) {
    return apiService.delete(`/api/admin/payments/${id}`);
  }
}

export default new PaymentService();
