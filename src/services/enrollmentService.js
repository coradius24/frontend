const { default: apiService } = require("./api/apiService");

class EnrollmentService {
  async getMyEnrollments({ token }) {
    return apiService.get(`/api/enrollments/my-enrollments`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  async getEnrollmentsOfAUser(id) {
    return apiService.get(`/api/admin/enrollments/users/${id}`);
  }

  async getAllEnrollmentsByAdmin(params) {
    return apiService.get(`/api/admin/enrollments`, {
      params,
    });
  }

  async getEnrollmentSpikes(params) {
    return apiService.get(`/api/admin/enrollments/daily-spikes`, {
      params,
    });
  }
  async removeEnrollment(id) {
    return apiService.delete(`/api/admin/enrollments/${id}`);
  }

  async bulkEnroll({courseId, formData}) {
    const config = {
      headers: { "content-type": "multipart/form-data" },
    };
    return apiService.post(`/api/admin/payments/${courseId}/bulk-payment-and-enroll-from-sheet`, formData, config);
  }

  async unenrollSelected(courseId, userIds) {
    return apiService.delete(`/api/admin/enrollments/${courseId}/bulk-unenroll`, {userIds});
  }

  async removeAllDueStudentOfACourse(courseId) {
    return apiService.delete(`/api/admin/payments/${courseId}/unenroll-all-students-with-deus`);
  }

  async mySupportBoard(token) {
    try {
      const res = await apiService.get(`/api/admin/enrollments/supports`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("support res",res, token)
      return res
    } catch (error) {
      console.log("Chat board error", error)
    }
   
  }
}
export default new EnrollmentService();
