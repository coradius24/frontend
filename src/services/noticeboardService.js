const { default: apiService } = require("./api/apiService");

class NoticeboardService {
  async getNotices(filter, token) {
    return apiService.get(`/api/notices?${filter || ""}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  async getAdminNotices(params) {
    return apiService.get(`/api/admin/notices`, { params });
  }

  async createNotice(body) {
    return apiService.post(`/api/admin/notices`, body);
  }

  async updateNotice(id, body) {
    return apiService.post(`/api/admin/notices/${id}`, { body });
  }

  async deleteNotice(id) {
    return apiService.delete(`/api/admin/notices/${id}`);
  }

  async addNoticeDepartment(body) {
    return apiService.post(`/api/admin/notices/departments`, body);
  }
}

export default new NoticeboardService();
