/**
 * Pentestify - Vanilla JavaScript Application
 * Sin React, sin dependencias externas
 */

// ==========================================
// ESTADO GLOBAL
// ==========================================
const state = {
    lang: 'es',
    showSplash: true,
    activeTab: 'editor',
    isLoading: false,
    currentReportId: null,
    savedReports: [],
    showReportSelector: false,
    auditData: {
        documentTitle: 'Reporte Técnico de Vulnerabilidades',
        clientCompany: 'Empresa Cliente S.A.',
        targetAsset: 'Aplicación Principal',
        auditorCompany: 'Empresa Auditora LLC',
        auditorName: 'Juan Pérez',
        classification: '2',
        version: '1.0',
        date: new Date().toISOString().split('T')[0],
        lang: 'es'
    },
    findings: [],
    currentFinding: {
        templateKey: 'custom',
        title: '',
        severity: 'med',
        description: '',
        cvss: '',
        poc: '',
        impact: '',
        remediation: '',
        reference: '',
        cve: '',
        images: []
    },
    isDirty: false
};

// ==========================================
// TRADUCCIONES
// ==========================================
const UI = {
    es: {
        appTitle: 'Pentestify',
        appSubtitle: 'Security Report Generator',
        welcome: 'Bienvenido a',
        tagline: 'Generador de Reportes de Pentesting',
        description: 'Crea reportes profesionales de vulnerabilidades con plantillas predefinidas y exportación PDF.',
        enterApp: 'Entrar a la Aplicación',
        newFinding: 'Registrar Nuevo Hallazgo',
        newFindingDesc: 'Completa los detalles de la vulnerabilidad descubierta.',
        quickTemplate: 'Plantilla Rápida (Auto-completar)',
        customOther: 'Personalizado / Otro',
        vulnTitle: 'Título de la Vulnerabilidad',
        severity: 'Nivel de Severidad',
        description: 'Descripción de la Vulnerabilidad',
        cvss: 'Puntuación CVSS (0-10)',
        poc: 'Pasos para Reproducir (PoC)',
        impact: 'Impacto en el Negocio',
        remediation: 'Solución y Remediación',
        reference: 'Referencias (URLs)',
        cve: 'Identificador CVE',
        images: 'Evidencias (Imágenes)',
        addImages: 'Agregar Imágenes',
        addFinding: 'Agregar Hallazgo',
        updateFinding: 'Actualizar Hallazgo',
        cancel: 'Cancelar',
        preview: 'Vista Previa',
        generatePdf: 'Generar PDF',
        myReports: 'Mis Reportes',
        backToEditor: 'Volver al Editor',
        createNewReport: 'Crear Nuevo Reporte',
        noReports: 'No hay reportes guardados',
        noReportsDesc: 'Crea tu primer reporte usando el botón de arriba',
        editor: 'Edición',
        severityLevels: {
            crit: 'Crítico',
            high: 'Alto',
            med: 'Medio',
            low: 'Bajo',
            info: 'Informativo'
        },
        targetAsset: 'Activo a Auditar',
        clientCompany: 'Empresa Cliente',
        auditorCompany: 'Empresa Auditora',
        auditorName: 'Nombre del Auditor',
        documentTitle: 'Título del Documento',
        date: 'Fecha del Reporte',
        classification: 'Clasificación',
        version: 'Versión',
        classifications: {
            '1': 'Público',
            '2': 'Interno',
            '3': 'Confidencial',
            '4': 'Restringido'
        }
    },
    en: {
        appTitle: 'Pentestify',
        appSubtitle: 'Security Report Generator',
        welcome: 'Welcome to',
        tagline: 'Pentesting Report Generator',
        description: 'Create professional vulnerability reports with predefined templates and PDF export.',
        enterApp: 'Enter Application',
        newFinding: 'Register New Finding',
        newFindingDesc: 'Complete the details of the discovered vulnerability.',
        quickTemplate: 'Quick Template (Auto-fill)',
        customOther: 'Custom / Other',
        vulnTitle: 'Vulnerability Title',
        severity: 'Severity Level',
        description: 'Vulnerability Description',
        cvss: 'CVSS Score (0-10)',
        poc: 'Steps to Reproduce (PoC)',
        impact: 'Business Impact',
        remediation: 'Solution and Remediation',
        reference: 'References (URLs)',
        cve: 'CVE Identifier',
        images: 'Evidence (Images)',
        addImages: 'Add Images',
        addFinding: 'Add Finding',
        updateFinding: 'Update Finding',
        cancel: 'Cancel',
        preview: 'Preview',
        generatePdf: 'Generate PDF',
        myReports: 'My Reports',
        backToEditor: 'Back to Editor',
        createNewReport: 'Create New Report',
        noReports: 'No saved reports',
        noReportsDesc: 'Create your first report using the button above',
        editor: 'Editor',
        severityLevels: {
            crit: 'Critical',
            high: 'High',
            med: 'Medium',
            low: 'Low',
            info: 'Informational'
        },
        targetAsset: 'Target Asset',
        clientCompany: 'Client Company',
        auditorCompany: 'Auditor Company',
        auditorName: 'Auditor Name',
        documentTitle: 'Document Title',
        date: 'Report Date',
        classification: 'Classification',
        version: 'Version',
        classifications: {
            '1': 'Public',
            '2': 'Internal',
            '3': 'Confidential',
            '4': 'Restricted'
        }
    }
};

// ==========================================
// TEMPLATES DE VULNERABILIDADES
// ==========================================
const templates = {
    sqli: {
        key: 'sqli',
        es: {
            title: 'Inyección SQL (SQL Injection)',
            description: 'Se ha detectado una vulnerabilidad de Inyección SQL que permite a un atacante manipular consultas SQL arbitrarias...',
            impact: 'Un atacante podría acceder, modificar o eliminar datos sensibles de la base de datos...',
            remediation: 'Implementar consultas preparadas (prepared statements) con parámetros parametrizados...',
            cvss: '8.1',
            reference: 'OWASP SQL Injection: https://owasp.org/www-community/attacks/SQL_Injection'
        },
        en: {
            title: 'SQL Injection',
            description: 'A SQL Injection vulnerability has been detected that allows an attacker to manipulate arbitrary SQL queries...',
            impact: 'An attacker could access, modify or delete sensitive database data...',
            remediation: 'Implement prepared statements with parameterized queries...',
            cvss: '8.1',
            reference: 'OWASP SQL Injection: https://owasp.org/www-community/attacks/SQL_Injection'
        }
    },
    xss: {
        key: 'xss',
        es: {
            title: 'Cross-Site Scripting (XSS)',
            description: 'La aplicación no sanitiza adecuadamente la entrada del usuario permitiendo la inyección de scripts maliciosos...',
            impact: 'Permite a un atacante ejecutar scripts en el navegador de la víctima...',
            remediation: 'Implementar sanitización de entrada (input validation) y escaping de output...',
            cvss: '6.1',
            reference: 'OWASP XSS: https://owasp.org/www-community/attacks/xss/'
        },
        en: {
            title: 'Cross-Site Scripting (XSS)',
            description: 'The application does not properly sanitize user input allowing injection of malicious scripts...',
            impact: 'Allows an attacker to execute scripts in the victim\'s browser...',
            remediation: 'Implement input validation and output escaping...',
            cvss: '6.1',
            reference: 'OWASP XSS: https://owasp.org/www-community/attacks/xss/'
        }
    }
};

// ==========================================
// FUNCIONES DE UTILIDAD
// ==========================================
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);
const createEl = (tag, className, html) => {
    const el = document.createElement(tag);
    if (className) el.className = className;
    if (html) el.innerHTML = html;
    return el;
};

// ==========================================
// API SERVICE
// ==========================================
const API = {
    baseUrl: '',
    
    async request(method, endpoint, data = null) {
        const url = `${this.baseUrl}${endpoint}`;
        const options = {
            method,
            headers: { 'Content-Type': 'application/json' }
        };
        if (data) options.body = JSON.stringify(data);
        
        const response = await fetch(url, options);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return response.json();
    },
    
    reports: {
        getAll: () => API.request('GET', '/api/reports'),
        getById: (id) => API.request('GET', `/api/reports/${id}`),
        create: (data) => API.request('POST', '/api/reports', data),
        update: (id, data) => API.request('PUT', `/api/reports/${id}`, data),
        delete: (id) => API.request('DELETE', `/api/reports/${id}`)
    },
    
    findings: {
        create: (reportId, data) => API.request('POST', `/api/reports/${reportId}/findings`, data),
        update: (findingId, data) => API.request('PUT', `/api/findings/${findingId}`, data),
        delete: (findingId) => API.request('DELETE', `/api/findings/${findingId}`)
    }
};

// ==========================================
// RENDERIZADO DE COMPONENTES
// ==========================================

function renderSplashScreen() {
    if (!state.showSplash) return '';
    
    const t = UI[state.lang];
    
    return `
        <div class="splash-screen">
            <div class="splash-content">
                <div class="splash-logo">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                        <path d="M12 8v4"/><path d="M12 16h.01"/>
                    </svg>
                </div>
                <h1 class="splash-title">${t.appTitle}</h1>
                <p class="splash-tagline">${t.tagline}</p>
                <p class="splash-desc">${t.description}</p>
                
                <div class="splash-actions">
                    <button class="btn-enter" onclick="enterApp()">${t.enterApp}</button>
                    <div class="lang-toggle">
                        <button class="${state.lang === 'es' ? 'active' : ''}" onclick="setLang('es')">ES</button>
                        <button class="${state.lang === 'en' ? 'active' : ''}" onclick="setLang('en')">EN</button>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function renderNavbar() {
    if (state.showSplash || state.showReportSelector) return '';
    
    const t = UI[state.lang];
    
    return `
        <header class="navbar">
            <div class="navbar-brand">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                </svg>
                <span>${t.appTitle}</span>
                ${state.isDirty ? '<span class="dirty-indicator">•</span>' : ''}
            </div>
            
            <div class="navbar-actions">
                <button onclick="showReports()">${t.myReports}</button>
                <button class="${state.activeTab === 'editor' ? 'active' : ''}" onclick="setTab('editor')">${t.editor}</button>
                <button class="${state.activeTab === 'preview' ? 'active' : ''}" onclick="setTab('preview')">${t.preview}</button>
                <button class="btn-primary" onclick="window.print()">${t.generatePdf}</button>
            </div>
        </header>
    `;
}

function renderEditor() {
    if (state.activeTab !== 'editor' || state.showSplash || state.showReportSelector) return '';
    
    const t = UI[state.lang];
    
    return `
        <div class="editor-container">
            <div class="editor-left">
                <div class="card">
                    <h2>${t.newFinding}</h2>
                    <p class="text-muted">${t.newFindingDesc}</p>
                    
                    <form id="findingForm" onsubmit="handleFindingSubmit(event)">
                        <div class="form-group">
                            <label>${t.quickTemplate}</label>
                            <select onchange="applyTemplate(this.value)">
                                <option value="custom">${t.customOther}</option>
                                <option value="sqli">SQL Injection</option>
                                <option value="xss">XSS</option>
                            </select>
                        </div>
                        
                        <div class="form-group">
                            <label>${t.vulnTitle}</label>
                            <input type="text" id="findingTitle" value="${state.currentFinding.title}" required>
                        </div>
                        
                        <div class="form-group">
                            <label>${t.severity}</label>
                            <select id="findingSeverity">
                                ${Object.entries(t.severityLevels).map(([key, label]) => 
                                    `<option value="${key}" ${state.currentFinding.severity === key ? 'selected' : ''}>${label}</option>`
                                ).join('')}
                            </select>
                        </div>
                        
                        <div class="form-group">
                            <label>${t.description}</label>
                            <textarea id="findingDescription" rows="4">${state.currentFinding.description}</textarea>
                        </div>
                        
                        <div class="form-group">
                            <label>${t.cvss}</label>
                            <input type="text" id="findingCvss" value="${state.currentFinding.cvss}">
                        </div>
                        
                        <div class="form-group">
                            <label>${t.poc}</label>
                            <textarea id="findingPoc" rows="4">${state.currentFinding.poc}</textarea>
                        </div>
                        
                        <div class="form-group">
                            <label>${t.impact}</label>
                            <textarea id="findingImpact" rows="3">${state.currentFinding.impact}</textarea>
                        </div>
                        
                        <div class="form-group">
                            <label>${t.remediation}</label>
                            <textarea id="findingRemediation" rows="3">${state.currentFinding.remediation}</textarea>
                        </div>
                        
                        <div class="form-group">
                            <label>${t.reference}</label>
                            <input type="text" id="findingReference" value="${state.currentFinding.reference}">
                        </div>
                        
                        <div class="form-group">
                            <label>${t.cve}</label>
                            <input type="text" id="findingCve" value="${state.currentFinding.cve}">
                        </div>
                        
                        <div class="form-actions">
                            <button type="submit" class="btn-primary">${t.addFinding}</button>
                            <button type="button" onclick="resetFindingForm()">${t.cancel}</button>
                        </div>
                    </form>
                </div>
            </div>
            
            <div class="editor-right">
                ${renderAuditData()}
                ${renderFindingsList()}
            </div>
        </div>
    `;
}

function renderAuditData() {
    const t = UI[state.lang];
    const d = state.auditData;
    
    return `
        <div class="card">
            <h3>Datos de la Auditoría</h3>
            <div class="form-row">
                <div class="form-group">
                    <label>${t.documentTitle}</label>
                    <input type="text" value="${d.documentTitle}" onchange="updateAuditData('documentTitle', this.value)">
                </div>
                <div class="form-group">
                    <label>${t.clientCompany}</label>
                    <input type="text" value="${d.clientCompany}" onchange="updateAuditData('clientCompany', this.value)">
                </div>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label>${t.targetAsset}</label>
                    <input type="text" value="${d.targetAsset}" onchange="updateAuditData('targetAsset', this.value)">
                </div>
                <div class="form-group">
                    <label>${t.auditorCompany}</label>
                    <input type="text" value="${d.auditorCompany}" onchange="updateAuditData('auditorCompany', this.value)">
                </div>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label>${t.auditorName}</label>
                    <input type="text" value="${d.auditorName}" onchange="updateAuditData('auditorName', this.value)">
                </div>
                <div class="form-group">
                    <label>${t.classification}</label>
                    <select onchange="updateAuditData('classification', this.value)">
                        ${Object.entries(t.classifications).map(([key, label]) => 
                            `<option value="${key}" ${d.classification === key ? 'selected' : ''}>${label}</option>`
                        ).join('')}
                    </select>
                </div>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label>${t.version}</label>
                    <input type="text" value="${d.version}" onchange="updateAuditData('version', this.value)">
                </div>
                <div class="form-group">
                    <label>${t.date}</label>
                    <input type="date" value="${d.date}" onchange="updateAuditData('date', this.value)">
                </div>
            </div>
        </div>
    `;
}

function renderFindingsList() {
    const t = UI[state.lang];
    
    if (state.findings.length === 0) {
        return `<div class="card"><p class="text-muted">No hay hallazgos registrados</p></div>`;
    }
    
    return `
        <div class="findings-list">
            ${state.findings.map((f, idx) => `
                <div class="finding-item severity-${f.severity}">
                    <div class="finding-header">
                        <span class="finding-number">#${idx + 1}</span>
                        <span class="finding-title">${f.title}</span>
                        <span class="finding-severity">${t.severityLevels[f.severity]}</span>
                        <button onclick="deleteFinding(${idx})">×</button>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

function renderPreview() {
    if (state.activeTab !== 'preview' || state.showSplash || state.showReportSelector) return '';
    
    const t = UI[state.lang];
    const d = state.auditData;
    
    return `
        <div class="preview-container">
            <div class="report-header">
                <h1>${d.documentTitle}</h1>
                <div class="report-meta">
                    <p><strong>${t.clientCompany}:</strong> ${d.clientCompany}</p>
                    <p><strong>${t.targetAsset}:</strong> ${d.targetAsset}</p>
                    <p><strong>${t.auditorCompany}:</strong> ${d.auditorCompany}</p>
                    <p><strong>${t.auditorName}:</strong> ${d.auditorName}</p>
                    <p><strong>${t.date}:</strong> ${d.date}</p>
                </div>
            </div>
            
            <div class="findings-preview">
                ${state.findings.map((f, idx) => `
                    <div class="finding-preview severity-${f.severity}">
                        <h3>#${idx + 1} - ${f.title}</h3>
                        <p><strong>Severidad:</strong> ${t.severityLevels[f.severity]}</p>
                        <p><strong>CVSS:</strong> ${f.cvss}</p>
                        ${f.description ? `<p><strong>Descripción:</strong> ${f.description}</p>` : ''}
                        ${f.poc ? `<p><strong>PoC:</strong> ${f.poc}</p>` : ''}
                        ${f.impact ? `<p><strong>Impacto:</strong> ${f.impact}</p>` : ''}
                        ${f.remediation ? `<p><strong>Remediación:</strong> ${f.remediation}</p>` : ''}
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

function renderReportsPage() {
    if (!state.showReportSelector || state.showSplash) return '';
    
    const t = UI[state.lang];
    
    return `
        <div class="reports-page">
            <div class="reports-header">
                <h1>${t.myReports}</h1>
                <button onclick="hideReports()">${t.backToEditor}</button>
            </div>
            
            <button class="btn-primary" onclick="createNewReport()">${t.createNewReport}</button>
            
            <div class="reports-list">
                ${state.savedReports.length === 0 ? `
                    <div class="empty-state">
                        <p>${t.noReports}</p>
                        <p class="text-muted">${t.noReportsDesc}</p>
                    </div>
                ` : state.savedReports.map(r => `
                    <div class="report-card" onclick="loadReport(${r.id})">
                        <h3>${r.document_title}</h3>
                        <p>${r.client_company}</p>
                        <span>${r.findings_count || 0} hallazgos</span>
                        <button onclick="event.stopPropagation(); deleteReport(${r.id})">Eliminar</button>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

function renderApp() {
    const app = $('#app');
    
    app.innerHTML = `
        ${renderSplashScreen()}
        ${renderReportsPage()}
        ${renderNavbar()}
        <main class="main-content">
            ${renderEditor()}
            ${renderPreview()}
        </main>
    `;
}

// ==========================================
// ACCIONES
// ==========================================

function enterApp() {
    state.showSplash = false;
    renderApp();
}

function setLang(lang) {
    state.lang = lang;
    state.auditData.lang = lang;
    renderApp();
}

function setTab(tab) {
    state.activeTab = tab;
    renderApp();
}

function showReports() {
    loadSavedReports();
    state.showReportSelector = true;
    renderApp();
}

function hideReports() {
    state.showReportSelector = false;
    renderApp();
}

function updateAuditData(field, value) {
    state.auditData[field] = value;
    state.isDirty = true;
}

function applyTemplate(key) {
    if (key === 'custom') return;
    
    const template = templates[key];
    if (!template) return;
    
    const t = template[state.lang] || template.es;
    state.currentFinding = {
        ...state.currentFinding,
        templateKey: key,
        title: t.title,
        description: t.description,
        impact: t.impact,
        remediation: t.remediation,
        cvss: t.cvss,
        reference: t.reference
    };
    
    renderApp();
}

function handleFindingSubmit(e) {
    e.preventDefault();
    
    const finding = {
        id: Date.now(),
        templateKey: state.currentFinding.templateKey,
        title: $('#findingTitle').value,
        severity: $('#findingSeverity').value,
        description: $('#findingDescription').value,
        cvss: $('#findingCvss').value,
        poc: $('#findingPoc').value,
        impact: $('#findingImpact').value,
        remediation: $('#findingRemediation').value,
        reference: $('#findingReference').value,
        cve: $('#findingCve').value,
        images: []
    };
    
    state.findings.push(finding);
    state.isDirty = true;
    resetFindingForm();
    renderApp();
}

function resetFindingForm() {
    state.currentFinding = {
        templateKey: 'custom',
        title: '',
        severity: 'med',
        description: '',
        cvss: '',
        poc: '',
        impact: '',
        remediation: '',
        reference: '',
        cve: '',
        images: []
    };
}

function deleteFinding(index) {
    state.findings.splice(index, 1);
    state.isDirty = true;
    renderApp();
}

async function loadSavedReports() {
    try {
        state.savedReports = await API.reports.getAll();
    } catch (err) {
        console.error('Error loading reports:', err);
    }
}

async function createNewReport() {
    try {
        const report = await API.reports.create({
            document_title: 'Nuevo Reporte',
            client_company: 'Empresa',
            target_asset: 'Sistema',
            auditor_company: 'Auditor',
            auditor_name: 'Auditor',
            classification: 2,
            version: '1.0',
            date: new Date().toISOString().split('T')[0],
            lang: state.lang
        });
        
        state.currentReportId = report.id;
        state.findings = [];
        state.isDirty = false;
        hideReports();
    } catch (err) {
        alert('Error creating report: ' + err.message);
    }
}

async function loadReport(id) {
    try {
        const report = await API.reports.getById(id);
        state.currentReportId = report.id;
        state.auditData = {
            documentTitle: report.document_title,
            clientCompany: report.client_company,
            targetAsset: report.target_asset,
            auditorCompany: report.auditor_company,
            auditorName: report.auditor_name,
            classification: report.classification.toString(),
            version: report.version,
            date: report.date,
            lang: report.lang
        };
        state.lang = report.lang;
        state.findings = report.findings || [];
        state.isDirty = false;
        hideReports();
    } catch (err) {
        alert('Error loading report: ' + err.message);
    }
}

async function deleteReport(id) {
    if (!confirm('¿Eliminar este reporte?')) return;
    
    try {
        await API.reports.delete(id);
        loadSavedReports();
        renderApp();
    } catch (err) {
        alert('Error deleting report: ' + err.message);
    }
}

// ==========================================
// INICIALIZACIÓN
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
    renderApp();
});
