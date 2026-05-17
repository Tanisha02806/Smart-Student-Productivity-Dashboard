// src/api/api.js

const baseURL = "http://localhost:5000/api";

// ============================================
// MAIN REQUEST FUNCTION
// ============================================

/**
 * @param {'GET'|'POST'|'PUT'|'DELETE'} method
 * @param {string} url
 * @param {Object|null} [data]
 * @returns {Promise<any>}
 */
const request = async (method, url, data = null) => {
  const token = localStorage.getItem("token");

  /** @type {RequestInit} */
  const config = {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    credentials: "include",
  };

  // Add body for POST/PUT
  if (data) {
    config.body = JSON.stringify(data);
  }

  try {
    const response = await fetch(`${baseURL}${url}`, config);

    // Convert response
    const result = await response.json();

    // Handle unauthorized
    if (response.status === 401) {
      localStorage.removeItem("token");
    }

    // Handle errors
    if (!response.ok) {
      throw new Error(result.message || "Something went wrong");
    }

    return result;
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("API ERROR:", message);
    throw err;
  }
};

// ============================================
// API METHODS
// ============================================

const api = {
  /** @param {string} url */
  get: (url) => request("GET", url),

  /** @param {string} url @param {Object|null} [data] */
  post: (url, data) => request("POST", url, data),

  /** @param {string} url @param {Object|null} [data] */
  put: (url, data) => request("PUT", url, data),

  /** @param {string} url */
  delete: (url) => request("DELETE", url),
};

// ============================================
// AUTH API
// ============================================

export const authAPI = {
  /**
   * @param {Record<string, any>} userData
   */
  register: async (userData) => {
    return await api.post("/auth/register", userData);
  },

  /**
   * @param {Record<string, any>} userData
   */
  login: async (userData) => {
    const data = await api.post("/auth/login", userData);

    if (data.token) {
      localStorage.setItem("token", data.token);
    }

    return data;
  },

  logout: () => {
    localStorage.removeItem("token");
  },

  getProfile: async () => {
    return await api.get("/auth/profile");
  },
};

// ============================================
// PROJECT API
// ============================================

export const projectAPI = {
  getAllProjects: async () => {
    return await api.get("/projects");
  },

  /** @param {string} id */
  getProjectById: async (id) => {
    return await api.get(`/projects/${id}`);
  },

  /** @param {Record<string, any>} projectData */
  createProject: async (projectData) => {
    return await api.post("/projects", projectData);
  },

  /** @param {string} id @param {Record<string, any>} projectData */
  updateProject: async (id, projectData) => {
    return await api.put(`/projects/${id}`, projectData);
  },

  /** @param {string} id */
  deleteProject: async (id) => {
    return await api.delete(`/projects/${id}`);
  },
};

// ============================================
// USER API
// ============================================

export const userAPI = {
  getAllUsers: async () => {
    return await api.get("/users");
  },

  /** @param {string} id */
  getUserById: async (id) => {
    return await api.get(`/users/${id}`);
  },

  /** @param {string} id @param {Record<string, any>} userData */
  updateUser: async (id, userData) => {
    return await api.put(`/users/${id}`, userData);
  },
};

// ============================================
// MESSAGE API
// ============================================

export const messageAPI = {
  /** @param {string} chatId */
  getMessages: async (chatId) => {
    return await api.get(`/messages/${chatId}`);
  },

  /**
   * @param {{ chatId?: string, senderId?: string, text?: string, [key: string]: any }} messageData
   */
  sendMessage: async (messageData) => {
    return await api.post("/messages", messageData);
  },
};

export default api;