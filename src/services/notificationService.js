const { default: apiService } = require("./api/apiService");

class NotificationService {
  
  async getPreviousNotifications( cursor, limit = 5) {
    return apiService.get(`/api/notifications?cursor=${cursor || ''}&limit=${limit}`);
  }

  async getPreviousAdminNotifications( cursor, limit = 5) {
    return apiService.get(`/api/admin/notifications?cursor=${cursor || ''}&limit=${limit}`);
  }

  async updateNotificationSeen(seenCount) {
    return apiService.patch("/api/notifications/seen?seenCount="+seenCount);
  }

  async pushTokenSync(body) {
    return apiService.post("/api/notifications/push-token-sync", body);
  }
  
}

export default new NotificationService();
