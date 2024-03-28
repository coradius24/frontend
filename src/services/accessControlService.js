const { default: apiService } = require("./api/apiService");

class AccessControlService {
  async getMyFeatures() {
    return apiService.get(`/api/access-control/my-features`);
  }

  async getAllFeatures() {
    return apiService.get(`/api/admin/access-control/features`);

  }

  async getAllFeaturesByUserId(id) {
    return apiService.get(`/api/admin/access-control/features/users/${id}`);

  }

  async updateUserFeatures(userId, featureIds) {
    return apiService.patch(`/api/admin/access-control/feature-user-map`, {
      featureIds,
      userId
    })
  }
}
export default new AccessControlService();
