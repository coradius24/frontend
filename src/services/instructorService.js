const { default: apiService } = require("./api/apiService");

class InstructorService {
  async getInstructors(params) {
    return apiService.get(`/api/admin/users/instructors`, { params });
  }
  async getInstructorCourses(id, params) {
    return apiService.get(`/api/courses/instructor/${id}`, { params });
  }
}
export default new InstructorService();
