const { default: apiService } = require("./api/apiService");

class ToolsService {
  async getMyTools() {
    return apiService.get(`/api/tools/my-tools`);
  }
  async getMyToolsByCourseId(id, token) {
    return apiService.get(`/api/tools/my-tools/courses/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  async getAllToolsByAdmin(params) {
    return apiService.get(`/api/admin/tools`, {
      params,
    });
  }
  async addNewTool(body) {
    return apiService.post(`/api/admin/tools`, body);
  }
  async updateTool(id, body) {
    return apiService.patch(`/api/admin/tools/${id}`, body);
  }
  async giveAccess(body) {
    return apiService.post(`/api/admin/tools/access`, body);
  }
  async deleteTool(id) {
    return apiService.delete(`/api/admin/tools/${id}`);
  }

  async removeToolAccess(toolId, userId) {
    return apiService.delete(`/api/admin/tools/access/${toolId}/${userId}`);
  }

  async getToolsOfAUser(userId) {
    return apiService.get(`/api/admin/tools/access/users/${userId}`);
    
  }

  async giveBulkAccess(courseId, toolId) {
    return apiService.post(`/api/admin/tools/bulk-access-to-all-paid-students/${courseId}/${toolId}`);
  }
}
export default new ToolsService();
