const { default: apiService } = require("./api/apiService");

class AssignmentService {
  async getAssignments(courseId) {
    return apiService.get(`/api/assignments/${courseId}`);
  }
  async getAssignmentsWithStatsForAdmin(courseId) {
    return apiService.get(`/api/admin/assignments/courses/${courseId}`);
  }
  async submitAssignment() {
    return apiService.post(`/api/assignments/submissions`);
  }
  async getSubmittedAssignments(courseId, filter) {
    return apiService.get(
      `/api/admin/assignments/submissions/${courseId}?${filter || ""}`
    );
  }
  async getMySubmission(courseId) {
    return apiService.get(`/api/assignments/my-submissions/${courseId}`);
  }
  async createAssignment(body) {
    return apiService.post(`/api/admin/assignments`, body);
  }
  async updateAssignment(id, body) {
    return apiService.patch(`/api/admin/assignments/${id}`, body);
  }
  async deleteAssignment(id) {
    return apiService.delete(`/api/admin/assignments/${id}`);
  }
  async assignmentEvaluation(body) {
    return apiService.post(`/api/admin/assignments/evaluation`, body);
  }
}
export default new AssignmentService();
