const { default: apiService } = require("./api/apiService");

class CourseService {
  async getCourse(filter) {
    return apiService.get(`/api/courses?${filter || ""}`);
  }
  async getAdminCourse(filter) {
    return apiService.get(`/api/admin/courses?${filter || ""}`);
  }
  async getFeaturedCourse(type) {
    return apiService.get(`/api/courses/featured?contentType=${type}`);
  }
  async getCourseModule(id) {
    return apiService.get(`/api/courses/sections/${id}`);
  }

  async getCourseNames(params) {
    return apiService.get(`/api/admin/courses/names`, { params });
  }

  async createCourse(data) {
    return apiService.post("/api/admin/courses", data);
  }

  async updateCourse(id, data) {
    return apiService.patch(`/api/admin/courses/${id}`, data);
  }

  async getCourseDetails(id) {
    return apiService.get(`/api/courses/${id}`);
  }

  async createSection(data) {
    return apiService.post(`/api/admin/courses/section`, data);
  }
  async updateSection(id, data) {
    return apiService.patch(`/api/admin/courses/section/${id}`, data);
  }
  async deleteSection(id) {
    return apiService.delete(`/api/admin/courses/section/${id}`);
  }
  async createLesson(data) {
    return apiService.post("/api/admin/courses/lesson", data);
  }
  async updateLesson(id, data) {
    return apiService.patch(`/api/admin/courses/lesson/${id}`, data);
  }
  async deleteLesson(id) {
    return apiService.delete(`/api/admin/courses/lesson/${id}`);
  }
  async deleteCourse(id) {
    return apiService.delete(`/api/admin/courses/${id}`);
  }
  async watchHistory(body) {
    return apiService.post(`/api/courses/watch-histories`, body);
  }

  async getWatchHistory(courseId, token) {
    return apiService.get(`/api/courses/watch-histories/${courseId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
}
export default new CourseService();
