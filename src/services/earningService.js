const { default: apiService } = require("./api/apiService");

class EarningService {
  async getSmartLinks(token) {
    return apiService.get(`/api/earning-reports/my-shortlink`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  async generateSortLink(payload) {
    return apiService.post(`/api/admin/earning-reports/shortlinks`, payload);
  }

  async updateShortLinkStatus(shortLinkId, status) {
    return apiService.patch(`/api/admin/earning-reports/shortlinks/${shortLinkId}/status`, {status});
  }

  // 

  async getPayoutsOfStudents(params) {
    return apiService.get(`/api/admin/earning-reports/payouts`, {
      params,
    });
  }

  async updatePayoutStatusByAdmin(payoutId, body) {
    return apiService.patch(
      `/api/admin/earning-reports/payouts/${payoutId}`,
      body
    );
  }

  async paymentRequest(data) {
    return apiService.post(`/api/earning-reports/payout-request`, {
      ...data,
    });
  }

  async reviewPaymentRequest(id, data) {
    return apiService.patch(`/api/admin/earning-reports/payouts/${id}/review`, {
      ...data,
    });
  }

  async getMyWalletReport(token) {
    return apiService.get(
      `/api/earning-reports/my-wallet`,
      token
        ? {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        : {}
    );
  }

  async getWalletByUserId(userId) {
    return apiService.get(`/api/admin/earning-reports/wallets/users/${userId}`);
  }

  async gePayoutHistoryByUserId(userId) {
    return apiService.get(`/api/admin/earning-reports/payouts/users/${userId}`);
  }

  async geSmartLinksByUserId(userId) {
    return apiService.get(
      `/api/admin/earning-reports/shortlinks/users/${userId}`
    );
  }

  async addExtraClicksToShortLink(shortLinkSlug, clickCount) {
    return apiService.post(`/api/admin/earning-reports/extra-clicks`, {
      clickCount,
      shortLinkSlug,
    });
  }

  async getEarningReportByUserId(userId) {
    return apiService.get(`/api/admin/earning-reports/users/${userId}`);
  }

  async getMyEarning(params, token) {
    return apiService.get(
      `/api/earning-reports/my-earnings?${params ? params : ""}`,
      token
        ? {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        : {}
    );
  }
  async getMyEarningHistory(params, token) {
    return apiService.get(
      `/api/earning-reports/my-payouts?${params ? params : ""}`,
      token
        ? {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        : {}
    );
  }

  async getPayoutStats(params) {
    return apiService.get(`/api/admin/earning-reports/payout-stats`, {
      params,
    });
  }

  async dailySpikes(params) {
    return apiService.get(`/api/admin/earning-reports/daily-spikes`, {
      params,
    });
  }

  async getAdminDailyEarning(filter) {
    return apiService.get(`/api/admin/earning-reports/daily?${filter || ""}`);
  }

  async getAdminEarning(filter) {
    return apiService.get(`/api/admin/earning-reports?${filter || ""}`);
  }

  async getAdminEarningReportBalance(filter) {
    return apiService.get(
      `/api/admin/earning-reports/balances?${filter || ""}`
    );
  }
  async getPayout(filter) {
    return apiService.get(`/api/admin/earning-reports/payouts?${filter || ""}`);
  }
}
export default new EarningService();
