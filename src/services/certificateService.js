const { default: apiService } = require("./api/apiService");

class CertificateService {
  async validateCertificate(credentialId) {
    return apiService.get(`/api/course-certificates/validate/${credentialId}`);
  }

  async getCertificate(courseId) {
    return apiService.get(`/api/course-certificates/courses/${courseId}/my-certificate`);
  }
}
export default new CertificateService();
