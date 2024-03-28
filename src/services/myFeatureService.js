const { default: apiService } = require("./api/apiService");

class MyFeatureService {
  async getMyFeature(token) {
    return apiService.get(`/api/access-control/my-features`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }


}
export default new MyFeatureService();
