const { default: apiService } = require("./api/apiService");

class CmsService {
  async getFeaturedInstructors() {
    return apiService.get(`/api/cms/featured-instructors`);
  }

  async addFeaturedInstructor() {
    return apiService.post(`/api/cms/featured-instructors`);
  }

  async removeFeaturedInstructors(id) {
    return apiService.post(`/api/cms/featured-instructors/${id}`);
  }

  async reorderInstructors(array) {
    return apiService.patch(`/api/admin/cms/featured-instructors/order`, array);
  }

  async getTeamMembers(params) {
    return apiService.get(`/api/cms/team-members`, { params });
  }

  async getTeamMembersByAdmin(params) {
    return apiService.get(`/api/admin/cms/team-members`, { params });
  }

  async addTeamMember(payload) {
    const config = {
      headers: { "content-type": "multipart/form-data" },
    };
    return apiService.post(`/api/admin/cms/team-members`, payload, config);
  }

  async updateTemMember(id, payload) {
    const config = {
      headers: { "content-type": "multipart/form-data" },
    };
    return apiService.patch(
      `/api/admin/cms/team-members/${id}`,
      payload,
      config
    );
  }

  async removeTeamMember(id) {
    return apiService.delete(`/api/admin/cms/team-members/${id}`);
  }

  async reorderTeamMembers(array) {
    return apiService.patch(
      `/api/admin/cms/team-members/re-order/members`,
      array
    );
  }

  async getPageContent(pageId) {
    return apiService.get(`/api/cms/pages/${pageId}`);
  }

  async updatePageContent(body) {
    return apiService.patch(`/api/admin/cms/page`, body);
  }
}
export default new CmsService();
