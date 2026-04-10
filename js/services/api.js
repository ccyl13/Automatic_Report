// Servicio de API para comunicación con backend FastAPI

const API_BASE_URL = 'http://localhost:8000/api';

// Helper para hacer requests
async function apiRequest(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
        headers: {
            'Content-Type': 'application/json',
            ...options.headers
        },
        ...options
    };
    
    if (config.body && typeof config.body === 'object') {
        config.body = JSON.stringify(config.body);
    }
    
    const response = await fetch(url, config);
    
    if (!response.ok) {
        const error = await response.json().catch(() => ({ detail: 'Error desconocido' }));
        throw new Error(error.detail || `Error ${response.status}`);
    }
    
    return response.json();
}

// ==================== REPORTS API ====================

const ReportsAPI = {
    // Obtener todos los reportes
    getAll: () => apiRequest('/reports'),
    
    // Obtener un reporte específico
    getById: (id) => apiRequest(`/reports/${id}`),
    
    // Crear nuevo reporte
    create: (data) => apiRequest('/reports', {
        method: 'POST',
        body: data
    }),
    
    // Actualizar reporte
    update: (id, data) => apiRequest(`/reports/${id}`, {
        method: 'PUT',
        body: data
    }),
    
    // Eliminar reporte
    delete: (id) => apiRequest(`/reports/${id}`, {
        method: 'DELETE'
    })
};

// ==================== FINDINGS API ====================

const FindingsAPI = {
    // Obtener hallazgos de un reporte
    getByReport: (reportId) => apiRequest(`/reports/${reportId}/findings`),
    
    // Crear hallazgo
    create: (reportId, data) => apiRequest(`/reports/${reportId}/findings`, {
        method: 'POST',
        body: data
    }),
    
    // Actualizar hallazgo
    update: (findingId, data) => apiRequest(`/findings/${findingId}`, {
        method: 'PUT',
        body: data
    }),
    
    // Eliminar hallazgo
    delete: (findingId) => apiRequest(`/findings/${findingId}`, {
        method: 'DELETE'
    }),
    
    // Reordenar hallazgos
    reorder: (reportId, findingIds) => apiRequest(`/reports/${reportId}/findings/reorder`, {
        method: 'POST',
        body: findingIds
    })
};

// Exportar APIs
const API = {
    reports: ReportsAPI,
    findings: FindingsAPI
};
