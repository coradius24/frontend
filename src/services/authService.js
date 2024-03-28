const { default: apiService } = require("./api/apiService");

class AuthService {
  async login(email, password, isAdministrativeRole=false) {
    return apiService.post("/api/auth/login", {
      email,
      password,
      isAdministrativeRole
    });
  }

  async getCurrentUser(cookie) {
    
    return apiService.get("/api/users/profile", {
      headers: {
        Authorization: `Bearer ${cookie}`,
      },
    });
  }

  async signup({ email, fullName, mobileNumber, password }) {
    return apiService.post("/api/auth/signup", {
      email,
      fullName,
      mobileNumber,
      password,
    });
  }

  async updateProfile(data) {
    return apiService.patch("/api/users/profile", {
      ...data,
    });
  }

  async changePassword(data) {
    return apiService.post("/api/users/change-password", {
      ...data,
    });
  }

  async oAuthLogin({ provider, token }) {
    return apiService.post("/api/auth/oauth", {
      provider,
      token,
    });
  }
}

export default new AuthService();
