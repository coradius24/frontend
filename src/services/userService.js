const { default: apiService } = require("./api/apiService");

class UserService {
  async getStudents(params) {
    return apiService.get(`/api/admin/users/students`, { params });
  }

  async getAdmins(params) {
    return apiService.get(`/api/admin/users/admins`, { params });
  }

  async addUser(payload) {
    return apiService.post(`/api/admin/users`, payload);
  }

  async searchUser(searchTerm, { limit = 20, page = 1 } = {}) {
    return apiService.get(`/api/admin/users/search/${searchTerm || "@"}`, {
      params: {
        page,
        limit,
      },
    });
  }

  async getSelectedUsers(ids) {
    return apiService.get(
      `/api/admin/users/selected?ids=${ids?.join("&ids=")}`
    );
  }

  getUserById(id) {
    return apiService.get(`/api/admin/users/by-user-id/${id}`);
  }

  async getInstructors() {
    return apiService.get("/api/users/instructors");
  }

  async changePasswordOfUser(userId, password) {
    return apiService.patch(`/api/admin/users/${userId}/password`, {
      password,
    });
  }

  async updateUserAccountStatus(id, data) {
    return apiService.patch(`/api/admin/users/by-user-id/${id}`, data);
  }
  async updateUserEmail(id, email) {
    console.log("want to update email")
    return apiService.patch(`/api/admin/users/by-user-id/${id}`, {email});
  }
}
export default new UserService();
