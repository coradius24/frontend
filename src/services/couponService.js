const { default: apiService } = require("./api/apiService");

class CouponService {
  async applyCoupon(params) {
    return apiService.get(`/api/coupons/validity?${params || ""}`);
  }

  async getAllCoupons(params) {
    return apiService.get(`/api/admin/coupons`, { params });
  }

  async createCoupon(data) {
    return apiService.post(`/api/admin/coupons`, data);
  }
  async updateCoupon(id, data) {
    return apiService.patch(`/api/admin/coupons/${id}`, data);
  }
  async deleteCoupon(id) {
    return apiService.delete(`/api/admin/coupons/${id}`);
  }
}

export default new CouponService();
