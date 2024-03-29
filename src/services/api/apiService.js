export const baseURL = "http://165.232.184.71/";
// export const baseURL = "https://api.upspotacademy.com";

const commonConfig = {
  credentials: "include",
  headers: {
    "Content-Type": "application/json",
  },
};

class ApiService {
  async get(apiUrl, config) {
    try {
      let url = `${baseURL}${apiUrl}`;
      if (config?.params) {
        url += "?" + new URLSearchParams(config.params);
        delete config.params;
      }

      const res = await fetch(url, {
        ...commonConfig,
        ...config,
        cache: "no-cache",
        // next: { revalidate: 600 },
      });
      if (!res.ok) {
        throw new Error("Network response was not ok");
      }
      if (res.status === 200) {
        if (config?.headers?.["content-type"] === "text/csv;charset=UTF-8") {
          return res.text();
        }
        return res.json();
      }

      const data = await res.json();
      return Promise.reject(data);
    } catch (error) {
      return error;
    }
  }

  async post(apiUrl, body, config) {
    let doSerialize =
      config?.headers?.["content-type"] !== "multipart/form-data";
    if (!doSerialize) {
      delete config?.headers["content-type"];
    }
    try {
      const res = await fetch(`${baseURL}${apiUrl}`, {
        ...commonConfig,
        method: "POST",
        body: doSerialize ? JSON.stringify(body) : body,
        ...config,
      });
      if (res.status === 200 || res.status === 201) {
        return res.json();
      }
      const data = await res.json();
      return Promise.resolve(data);
    } catch (error) {
      return error;
    }
  }

  async patch(apiUrl, body, config) {
    try {
      let doSerialize =
        config?.headers?.["content-type"] !== "multipart/form-data";
      if (!doSerialize) {
        delete config?.headers["content-type"];
      }
      const res = await fetch(`${baseURL}${apiUrl}`, {
        ...commonConfig,
        method: "PATCH",
        body: doSerialize ? JSON.stringify(body) : body,
        ...config,
      });
      if (res.status === 200 || res.status === 201) {
        return res.json();
      }
      const data = await res.json();
      return Promise.reject(data);
    } catch (error) {
      return error;
    }
  }

  async put(apiUrl, body, config) {
    try {
      let doSerialize =
        config?.headers?.["content-type"] !== "multipart/form-data";
      if (!doSerialize) {
        delete config?.headers["content-type"];
      }
      const res = await fetch(`${baseURL}${apiUrl}`, {
        credentials: "include",
        method: "PUT",
        body: doSerialize ? JSON.stringify(body) : body,
        ...config,
      });
      return res;
    } catch (error) {
      return error;
    }
  }

  async delete(apiUrl, body, config) {
    const res = await fetch(`${baseURL}${apiUrl}`, {
      ...commonConfig,
      method: "DELETE",
      body: JSON.stringify(body),
      ...config,
    });
    return res.json();
  }
}
const apiService = new ApiService();
export default apiService;
