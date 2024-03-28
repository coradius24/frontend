const { default: apiService } = require("./api/apiService");

class PreRegistrationService {
  async checkEligibility(params) {
    return apiService.get(`/api/pre-registrations/status`, {
      params
    });
  }

  async submit(body) {
    return apiService.post(`/api/pre-registrations`, body);
  }
  async archiveAll() {
    return apiService.patch(`/api/admin/pre-registrations/archive-all`);
  }
  async update(body) {
    return apiService.patch(`/api/admin/pre-registrations`, body);
  }
  async getAll(params) {
    return apiService.get(`/api/admin/pre-registrations`, {params});
  }

  // async downloadCsv({params}) {
  //   return apiService.get(`/api/admin/pre-registrations/download`, {params, headers: {
  //     'content-type': 'text/csv;charset=UTF-8',
  //   }});
  // }

}
export default new PreRegistrationService();
