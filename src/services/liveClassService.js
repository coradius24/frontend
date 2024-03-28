const { default: apiService } = require("./api/apiService");

class LiveClassService {
  async getLiveClassAdmin(courseId) {
    return apiService.get(`/api/admin/live-classes/${courseId}`);
  }
  async createLiveClass(body) {
    return apiService.post(`/api/admin/live-classes`, body);
  }
  async updateLiveClass(body) {
    return apiService.patch(`/api/admin/live-classes`, body);
  }

  async deleteLiveClass(courseId) {
    return apiService.delete(`/api/admin/live-classes/${courseId}`);
  }
  async updateOngoingLiveClass(liveClassId, body) {
    return apiService.patch(
      `/api/admin/live-classes/ongoing-status/${liveClassId}`,
      body
    );
  }
}
export default new LiveClassService();
