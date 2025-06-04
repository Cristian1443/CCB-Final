// Servicio de API para conectar con el backend MySQL
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  // Obtener token del localStorage
  getToken() {
    return localStorage.getItem('authToken');
  }

  // Headers por defecto
  getHeaders() {
    const headers = {
      'Content-Type': 'application/json',
    };

    const token = this.getToken();
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    return headers;
  }

  // Método base para peticiones
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: this.getHeaders(),
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error en la petición');
      }

      return data;
    } catch (error) {
      console.error('Error en API:', error);
      throw error;
    }
  }

  // Métodos de autenticación
  async login(username, password, selectedRole) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password, selectedRole }),
    });
  }

  async verifyToken() {
    return this.request('/auth/verify', {
      method: 'POST',
    });
  }

  async logout() {
    return this.request('/auth/logout', {
      method: 'POST',
    });
  }

  async getCurrentUser() {
    return this.request('/auth/me');
  }

  // Métodos para consultores
  async getConsultores(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/consultores${queryString ? `?${queryString}` : ''}`);
  }

  async getConsultor(id) {
    return this.request(`/consultores/${id}`);
  }

  async createConsultor(consultorData) {
    return this.request('/consultores', {
      method: 'POST',
      body: JSON.stringify(consultorData),
    });
  }

  async updateConsultor(id, consultorData) {
    return this.request(`/consultores/${id}`, {
      method: 'PUT',
      body: JSON.stringify(consultorData),
    });
  }

  async deleteConsultor(id) {
    return this.request(`/consultores/${id}`, {
      method: 'DELETE',
    });
  }

  // Métodos para eventos
  async getEventos(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/eventos${queryString ? `?${queryString}` : ''}`);
  }

  async createEvento(eventoData) {
    return this.request('/eventos', {
      method: 'POST',
      body: JSON.stringify(eventoData),
    });
  }

  // Métodos para pagos
  async getPagos(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/pagos${queryString ? `?${queryString}` : ''}`);
  }

  // Métodos para evidencias
  async getEvidencias(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/evidencias${queryString ? `?${queryString}` : ''}`);
  }

  // Métodos para vacantes
  async getVacantes(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/vacantes${queryString ? `?${queryString}` : ''}`);
  }

  // Métodos para actividades
  async getActividades() {
    return this.request('/actividades');
  }

  async createActividad(actividadData) {
    return this.request('/actividades', {
      method: 'POST',
      body: JSON.stringify(actividadData),
    });
  }

  // Métodos para programaciones
  async getProgramaciones(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/programaciones${queryString ? `?${queryString}` : ''}`);
  }

  async createProgramacion(programacionData) {
    return this.request('/programaciones', {
      method: 'POST',
      body: JSON.stringify(programacionData),
    });
  }

  // Método para probar conexión
  async testConnection() {
    return this.request('/health');
  }

  async testDatabase() {
    return this.request('/test-db');
  }
}

// Exportar instancia singleton
const apiService = new ApiService();
export default apiService;
