const { default: apiService } = require("./api/apiService");

class GalleryService {
  async getGalleries(params) {
    return apiService.get(`/api/gallery/albums`, {
      params,
    });
  }

  async createAlbum(body) {
    return apiService.post(`/api/admin/gallery/albums`, body, {
      headers: { "content-type": "multipart/form-data" },
    });
  }


  async deleteAlbum(id) {
    return apiService.delete(`/api/admin/gallery/albums/${id}`);
  }

  async addPhoto(body) {
    return apiService.post(`/api/admin/gallery/photos`, body, {
      headers: { "content-type": "multipart/form-data" },
    });
  }

  async deletePhoto(id) {
    return apiService.delete(`/api/admin/gallery/photos/${id}`);
  }

  async deleteGallery(id) {
    return apiService.delete(`/api/admin/gallery/albums/${id}`);
  }

  async updateCaption(id, body) {
    return apiService.patch(`/api/admin/gallery/photo-caption/${id}`, body);
  }

  async getGallery(slug, params = {}) {
    return apiService.get(`/api/gallery/albums/${slug}/photos`, {
      params,
    });
  }
}
export default new GalleryService();
