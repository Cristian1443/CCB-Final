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

  // ========== MÉTODOS PARA PROGRAMACIONES ==========

  // Obtener todas las programaciones (grupales e individuales)
  async getProgramaciones(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/programaciones${queryString ? `?${queryString}` : ''}`);
  }

  // Obtener estadísticas para el dashboard
  async getDashboardStats() {
    return this.request('/programaciones/dashboard-stats');
  }

  // Obtener actividades (talleres, asesorías grupales, individuales)
  async getActividades() {
    return this.request('/programaciones/actividades');
  }

  // Obtener modalidades (virtual, presencial, híbrido)
  async getModalidades() {
    return this.request('/programaciones/modalidades');
  }

  // Obtener programas con sus rutas
  async getProgramaRutas() {
    return this.request('/programaciones/programa-rutas');
  }

  // Obtener regiones con valores de horas
  async getRegiones() {
    return this.request('/programaciones/regiones');
  }

  // Obtener municipios por región
  async getMunicipiosByRegion(regionId) {
    return this.request(`/programaciones/municipios/${regionId}`);
  }

  // Obtener contratos disponibles
  async getContratos() {
    return this.request('/programaciones/contratos');
  }

  // Debug: Obtener información específica de un consultor
  async debugConsultor(cedula) {
    return this.request(`/programaciones/debug-consultor/${cedula}`);
  }

  // Calcular valores de una ruta específica
  async calcularValoresRuta(pr_id, val_reg_id, mod_id, horas_dictar) {
    const params = new URLSearchParams({
      pr_id,
      horas_dictar
    });
    
    if (val_reg_id && val_reg_id !== 'null' && val_reg_id !== '') {
      params.append('val_reg_id', val_reg_id);
    }
    
    if (mod_id && mod_id !== 'null' && mod_id !== '') {
      params.append('mod_id', mod_id);
    }
    
    return this.request(`/programaciones/calcular-valores?${params.toString()}`);
  }

  // Crear programación grupal (talleres, asesorías grupales, cápsulas)
  async createProgramacionGrupal(programacionData) {
    return this.request('/programaciones/grupal', {
      method: 'POST',
      body: JSON.stringify(programacionData),
    });
  }

  // Crear programación individual (asesorías individuales)
  async createProgramacionIndividual(programacionData) {
    return this.request('/programaciones/individual', {
      method: 'POST',
      body: JSON.stringify(programacionData),
    });
  }

  // Obtener una programación específica para edición
  async getProgramacion(id) {
    return this.request(`/programaciones/${id}`);
  }

  // Eliminar programación
  async deleteProgramacion(id) {
    return this.request(`/programaciones/${id}`, {
      method: 'DELETE',
    });
  }

  // Actualizar programación
  async updateProgramacion(id, programacionData) {
    return this.request(`/programaciones/${id}`, {
      method: 'PUT',
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