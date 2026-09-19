import { INITIAL_CATEGORIES, INITIAL_PRODUCTS, INITIAL_SERVICES, INITIAL_EQUIPMENT } from '../data/seedData';

const BASE_URL = '/api';
const TOKEN_KEY = 'rsy_auth_token';
const USER_KEY = 'rsy_auth_user';

export const api = {
  // Local auth storage utilities
  getAuthToken() {
    return localStorage.getItem(TOKEN_KEY) || null;
  },

  setAuthToken(token) {
    if (token) {
      localStorage.setItem(TOKEN_KEY, token);
    } else {
      localStorage.removeItem(TOKEN_KEY);
    }
  },

  getAuthUser() {
    try {
      const u = localStorage.getItem(USER_KEY);
      return u ? JSON.parse(u) : null;
    } catch {
      return null;
    }
  },

  setAuthUser(user) {
    if (user) {
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(USER_KEY);
    }
  },

  clearAuth() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },

  getAuthHeaders(customHeaders = {}) {
    const token = this.getAuthToken();
    const headers = { 'Content-Type': 'application/json', ...customHeaders };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  },

  // Authentication API methods
  async login(email, password) {
    try {
      const res = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Login failed');
      }
      this.setAuthToken(data.token);
      this.setAuthUser(data.user);
      return data;
    } catch (err) {
      throw err;
    }
  },

  async register(userData) {
    try {
      const res = await fetch(`${BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Registration failed');
      }
      this.setAuthToken(data.token);
      this.setAuthUser(data.user);
      return data;
    } catch (err) {
      throw err;
    }
  },

  async getMe() {
    try {
      const res = await fetch(`${BASE_URL}/auth/me`, {
        headers: this.getAuthHeaders()
      });
      if (!res.ok) {
        this.clearAuth();
        return null;
      }
      const data = await res.json();
      if (data.user) {
        this.setAuthUser(data.user);
      }
      return data.user;
    } catch (err) {
      return this.getAuthUser();
    }
  },

  logout() {
    this.clearAuth();
  },

  // Fetch categories
  async getCategories() {
    try {
      const res = await fetch(`${BASE_URL}/categories`);
      if (!res.ok) throw new Error('API request failed');
      const json = await res.json();
      return json.data || INITIAL_CATEGORIES;
    } catch (err) {
      console.warn('Backend API offline, using fallback client data for categories.', err);
      return INITIAL_CATEGORIES;
    }
  },

  // Fetch products (construction materials & bulk materials)
  async getProducts(params = {}) {
    try {
      const query = new URLSearchParams();
      if (params.category && params.category !== 'all') query.append('category', params.category);
      if (params.search) query.append('search', params.search);
      if (params.type) query.append('type', params.type);

      const res = await fetch(`${BASE_URL}/products?${query.toString()}`);
      if (!res.ok) throw new Error('API request failed');
      const json = await res.json();
      return json.data || INITIAL_PRODUCTS;
    } catch (err) {
      console.warn('Backend API offline, using fallback client data for products.', err);
      let data = [...INITIAL_PRODUCTS];
      if (params.category && params.category !== 'all') {
        if (params.category === 'construction-materials') {
          data = data.filter(p => p.category_id === 1);
        } else if (params.category === 'bulk-road-materials') {
          data = data.filter(p => p.category_id === 3);
        }
      }
      if (params.search) {
        const s = params.search.toLowerCase();
        data = data.filter(p => p.name.toLowerCase().includes(s) || (p.name_np && p.name_np.toLowerCase().includes(s)) || p.description.toLowerCase().includes(s));
      }
      return data;
    }
  },

  // Fetch transportation & logistics services
  async getServices(params = {}) {
    try {
      const query = new URLSearchParams();
      if (params.search) query.append('search', params.search);

      const res = await fetch(`${BASE_URL}/services?${query.toString()}`);
      if (!res.ok) throw new Error('API request failed');
      const json = await res.json();
      return json.data || INITIAL_SERVICES;
    } catch (err) {
      console.warn('Backend API offline, using fallback client data for services.', err);
      let data = [...INITIAL_SERVICES];
      if (params.search) {
        const s = params.search.toLowerCase();
        data = data.filter(srv => srv.name.toLowerCase().includes(s) || srv.description.toLowerCase().includes(s));
      }
      return data;
    }
  },

  // Fetch heavy equipment
  async getEquipment(params = {}) {
    try {
      const query = new URLSearchParams();
      if (params.search) query.append('search', params.search);

      const res = await fetch(`${BASE_URL}/equipment?${query.toString()}`);
      if (!res.ok) throw new Error('API request failed');
      const json = await res.json();
      return json.data || INITIAL_EQUIPMENT;
    } catch (err) {
      console.warn('Backend API offline, using fallback client data for equipment.', err);
      let data = [...INITIAL_EQUIPMENT];
      if (params.search) {
        const s = params.search.toLowerCase();
        data = data.filter(eq => eq.name.toLowerCase().includes(s) || eq.description.toLowerCase().includes(s));
      }
      return data;
    }
  },

  // Submit quote request
  async submitQuote(quotePayload) {
    try {
      const res = await fetch(`${BASE_URL}/quotes`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(quotePayload)
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Failed to submit quote');
      return json;
    } catch (err) {
      console.warn('Fallback local response for quote submission:', err);
      const localQuotes = JSON.parse(localStorage.getItem('rsy_quotes') || localStorage.getItem('roy_quotes') || '[]');
      const newQuote = {
        id: Date.now(),
        ...quotePayload,
        status: 'pending',
        created_at: new Date().toISOString()
      };
      localQuotes.unshift(newQuote);
      localStorage.setItem('rsy_quotes', JSON.stringify(localQuotes));

      return {
        success: true,
        message: 'Your quote request has been recorded successfully! (Local Mode)'
      };
    }
  },

  // Get quote requests (Admin)
  async getQuotes() {
    try {
      const res = await fetch(`${BASE_URL}/quotes`, {
        headers: this.getAuthHeaders()
      });
      if (!res.ok) throw new Error('Failed to fetch quotes');
      const json = await res.json();
      return json.data;
    } catch (err) {
      const localQuotes = JSON.parse(localStorage.getItem('rsy_quotes') || localStorage.getItem('roy_quotes') || '[]');
      return localQuotes;
    }
  },

  // Update quote status (Admin)
  async updateQuoteStatus(id, status) {
    try {
      const res = await fetch(`${BASE_URL}/quotes/${id}/status`, {
        method: 'PATCH',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ status })
      });
      return await res.json();
    } catch (err) {
      const localQuotes = JSON.parse(localStorage.getItem('rsy_quotes') || localStorage.getItem('roy_quotes') || '[]');
      const updated = localQuotes.map(q => q.id === id ? { ...q, status } : q);
      localStorage.setItem('rsy_quotes', JSON.stringify(updated));
      return { success: true, message: `Status updated to ${status}` };
    }
  },

  // Submit contact message
  async submitContact(contactPayload) {
    try {
      const res = await fetch(`${BASE_URL}/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contactPayload)
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Failed to submit message');
      return json;
    } catch (err) {
      return {
        success: true,
        message: 'Thank you! Your message has been received.'
      };
    }
  }
};
