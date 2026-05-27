const state = {
    lang: 'es',
    showSplash: false,
    activeTab: 'editor',
    isLoading: false,
    currentReportId: null,
    reportTheme: 'light',
    savedReports: [],
    showReportSelector: false,
    auditData: {
        documentTitle: 'Reporte Técnico de Vulnerabilidades',
        clientCompany: 'Empresa Cliente S.A.',
        clientLogo: ['', ''],
        targetAsset: 'Aplicación Principal',
        auditorCompany: 'Empresa Auditora LLC',
        auditorName: 'Juan Pérez',
        classification: '2',
        tlpLevel: 'amber',
        classificationMode: 'internal',
        version: '1.0',
        date: new Date().toISOString().split('T')[0],
        lang: 'es',
        auditType: 'pentesting_web',
        hasIncidents: false,
        incidentsText: '',
        auditSummary: '',
        testsPerformed: '',
        recommendedSolutions: ''
    },
    findings: [],
    editingFindingIndex: null,
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
        cwe: '',
        images: []
    },
    isDirty: false,
    showSettings: false,
    generatingPdf: false,
    showDemoModal: false
};

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
        cwe: 'Identificador CWE (MITRE)',
        images: 'Evidencias (Imágenes)',
        addImages: 'Agregar Imágenes',
        addFinding: 'Agregar Hallazgo',
        updateFinding: 'Actualizar Hallazgo',
        cancel: 'Cancelar',
        preview: 'Vista Previa',
        generatePdf: 'Generar PDF',
        generatingPdf: 'Generando...',
        saveReport: 'Guardar Reporte',
        myReports: 'Mis Reportes',
        backToEditor: 'Volver al Editor',
        createNewReport: 'Crear Nuevo Reporte',
        generateDemoDb: 'Generar DB de prueba',
        demoModalTitle: 'Generar Base de Datos de Prueba',
        demoModalDesc: 'Esto creará un reporte de pentesting completo de demostración con hallazgos reales, imágenes de evidencias y datos de ejemplo para que puedas explorar todas las funcionalidades de Pentestify.',
        demoModalWarning: 'El reporte de demo se añadirá a tus reportes existentes. No se eliminarán datos actuales.',
        demoModalWhat: 'Qué incluye el reporte demo:',
        demoModalItems: ['Empresa objetivo: AcmeShop Platform', '6 hallazgos: 2 Críticos, 3 Altos, 1 Bajo', 'Imágenes de evidencias reales (SQLMap, GTFOBins, BurpSuite, etc.)', 'CVSS scores, CWE IDs y referencias OWASP', 'Resumen ejecutivo y conclusiones completas'],
        demoModalGenerate: 'Generar Demo',
        demoModalGenerating: 'Creando demo...',
        demoModalCancel: 'Cancelar',
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
        clientLogo1: 'Logotipo 1 (opcional)',
        clientLogo2: 'Logotipo 2 (opcional)',
        auditorCompany: 'Empresa Auditora',
        auditorName: 'Nombre del Auditor',
        documentTitle: 'Título del Documento',
        date: 'Fecha del Reporte',
        classification: 'Clasificación Interna',
        version: 'Versión',
        classifications: {
            '1': 'Público',
            '2': 'Interno',
            '3': 'Confidencial',
            '4': 'Restringido'
        },
        classificationMode: 'Modo de Clasificación',
        classificationModes: {
            'internal': 'Solo Clasificación Interna',
            'tlp': 'Solo TLP 2.0 (CISA/FIRST)',
            'both': 'Ambos (Clasificación + TLP)'
        },
        tlp: 'Nivel TLP',
        tlpLevels: {
            'clear':        'TLP:CLEAR — Sin restricción',
            'green':        'TLP:GREEN — Comunidad de seguridad',
            'amber':        'TLP:AMBER — Organización y clientes',
            'amber+strict': 'TLP:AMBER+STRICT — Solo organización',
            'red':          'TLP:RED — Solo destinatarios explícitos'
        },
        tlpSource: 'Fuente: CISA / FIRST TLP v2.0',
        auditType: 'Tipo de Auditoría',
        auditTypes: {
            'pentesting_web': 'Pentesting Web',
            'caja_negra': 'Caja Negra (Black Box)',
            'caja_gris': 'Caja Gris (Grey Box)',
            'caja_blanca': 'Caja Blanca (White Box)',
            'intrusion_interna': 'Intrusión Interna',
            'phishing': 'Campaña de Phishing',
            'analisis_automatico': 'Análisis Automático de Vulnerabilidades'
        },
        incidents: 'Incidencias durante la Auditoría',
        incidentsYes: 'Sí, hubo incidencias',
        incidentsNo: 'No hubo incidencias',
        incidentsDesc: 'Descripción de las incidencias',
        incidentsNoneText: 'No se registraron incidencias durante el proceso de auditoría.',
        incidentsSectionTitle: 'Incidencias',
        auditSummary: 'Resumen de la Auditoría',
        auditSummaryDesc: 'Resumen ejecutivo de los hallazgos, alcance y conclusiones de la auditoría.',
        testsPerformed: 'Pruebas Realizadas',
        testsPerformedDesc: 'Descripción detallada de las pruebas y técnicas utilizadas durante la auditoría.',
        recommendedSolutions: 'Soluciones Recomendadas',
        recommendedSolutionsDesc: 'Plan de remediación con prioridades y recomendaciones generales.',
        // Preview/PDF translations
        index: 'Índice',
        executiveSummary: 'Resumen Ejecutivo',
        executiveSummaryWithCVSS: 'Resumen Ejecutivo (CVSS)',
        technicalFindings: 'Hallazgos Técnicos',
        incidentsRecorded: 'Se registraron incidencias durante la auditoría',
        cvssScore: 'CVSS Score',
        cveId: 'CVE',
        cweId: 'CWE',
        referenceUrl: 'URL de Referencia',
        pocSteps: 'Pasos para Reproducir (PoC)',
        evidence: 'Evidencias',
        businessImpact: 'Impacto en el Negocio',
        solutionRemediation: 'Solución y Remediación',
        na: 'N/A',
        auditConclusions: 'Conclusiones y Resumen de la Auditoría',
        logoClient: 'Logo Cliente',
        logoClientAlt: 'Logo Cliente',
        cvssSummaryTitle: 'Resumen de Vulnerabilidades (CVSS)',
        noFindings: 'No hay hallazgos registrados'
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
        cwe: 'CWE Identifier (MITRE)',
        images: 'Evidence (Images)',
        addImages: 'Add Images',
        addFinding: 'Add Finding',
        updateFinding: 'Update Finding',
        cancel: 'Cancel',
        preview: 'Preview',
        generatePdf: 'Generate PDF',
        generatingPdf: 'Generating...',
        saveReport: 'Save Report',
        myReports: 'My Reports',
        backToEditor: 'Back to Editor',
        createNewReport: 'Create New Report',
        generateDemoDb: 'Generate Demo DB',
        demoModalTitle: 'Generate Demo Database',
        demoModalDesc: 'This will create a complete demo pentesting report with real findings, evidence images and sample data so you can explore all Pentestify features.',
        demoModalWarning: 'The demo report will be added to your existing reports. No current data will be deleted.',
        demoModalWhat: 'What the demo report includes:',
        demoModalItems: ['Target company: AcmeShop Platform', '6 findings: 2 Critical, 3 High, 1 Low', 'Real evidence images (SQLMap, GTFOBins, BurpSuite, etc.)', 'CVSS scores, CWE IDs and OWASP references', 'Executive summary and full conclusions'],
        demoModalGenerate: 'Generate Demo',
        demoModalGenerating: 'Creating demo...',
        demoModalCancel: 'Cancel',
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
        clientLogo1: 'Client Logo 1 (optional)',
        clientLogo2: 'Client Logo 2 (optional)',
        auditorCompany: 'Auditor Company',
        auditorName: 'Auditor Name',
        documentTitle: 'Document Title',
        date: 'Report Date',
        classification: 'Internal Classification',
        version: 'Version',
        classifications: {
            '1': 'Public',
            '2': 'Internal',
            '3': 'Confidential',
            '4': 'Restricted'
        },
        classificationMode: 'Classification Mode',
        classificationModes: {
            'internal': 'Internal Classification Only',
            'tlp': 'TLP 2.0 Only (CISA/FIRST)',
            'both': 'Both (Classification + TLP)'
        },
        tlp: 'TLP Level',
        tlpLevels: {
            'clear':        'TLP:CLEAR — Unrestricted',
            'green':        'TLP:GREEN — Security community',
            'amber':        'TLP:AMBER — Organization and clients',
            'amber+strict': 'TLP:AMBER+STRICT — Organization only',
            'red':          'TLP:RED — Named recipients only'
        },
        tlpSource: 'Source: CISA / FIRST TLP v2.0',
        auditType: 'Audit Type',
        auditTypes: {
            'pentesting_web': 'Web Pentesting',
            'caja_negra': 'Black Box',
            'caja_gris': 'Grey Box',
            'caja_blanca': 'White Box',
            'intrusion_interna': 'Internal Intrusion',
            'phishing': 'Phishing Campaign',
            'analisis_automatico': 'Automatic Vulnerability Analysis'
        },
        incidents: 'Incidents during the Audit',
        incidentsYes: 'Yes, there were incidents',
        incidentsNo: 'No incidents',
        incidentsDesc: 'Incident description',
        incidentsNoneText: 'No incidents were recorded during the audit process.',
        incidentsSectionTitle: 'Incidents',
        auditSummary: 'Audit Summary',
        auditSummaryDesc: 'Executive summary of findings, scope and conclusions of the audit.',
        testsPerformed: 'Tests Performed',
        testsPerformedDesc: 'Detailed description of tests and techniques used during the audit.',
        recommendedSolutions: 'Recommended Solutions',
        recommendedSolutionsDesc: 'Remediation plan with priorities and general recommendations.',
        // Preview/PDF translations
        index: 'Index',
        executiveSummary: 'Executive Summary',
        executiveSummaryWithCVSS: 'Executive Summary (CVSS)',
        technicalFindings: 'Technical Findings',
        incidentsRecorded: 'Incidents were recorded during the audit',
        cvssScore: 'CVSS Score',
        cveId: 'CVE',
        cweId: 'CWE',
        referenceUrl: 'Reference URL',
        pocSteps: 'Steps to Reproduce (PoC)',
        evidence: 'Evidence',
        businessImpact: 'Business Impact',
        solutionRemediation: 'Solution and Remediation',
        na: 'N/A',
        auditConclusions: 'Audit Conclusions and Summary',
        logoClient: 'Client Logo',
        logoClientAlt: 'Client Logo',
        cvssSummaryTitle: 'Vulnerabilities Summary (CVSS)',
        noFindings: 'No findings registered'
    }
};

let templates = {};

async function loadTemplates() {
    try {
        const response = await fetch('js/plantillas.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        templates = await response.json();
    } catch (error) {
        console.error('Error loading templates:', error);
        // Fallback: templates remain empty, app will still work but without auto-fill
    }
}

// Load templates on startup
document.addEventListener('DOMContentLoaded', loadTemplates);

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

const escapeHTML = (str) => {
    if (str === null || str === undefined) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
};

const formatMultiline = (str) => escapeHTML(str).replace(/\n/g, '<br>');

const severityWeights = { crit: 5, high: 4, med: 3, low: 2, info: 1 };

function getTlpStyle(level) {
    const map = {
        'clear':        { bg: '#e5e7eb', text: '#374151', label: 'TLP:CLEAR' },
        'green':        { bg: '#33FF00', text: '#000000', label: 'TLP:GREEN' },
        'amber':        { bg: '#FFC000', text: '#000000', label: 'TLP:AMBER' },
        'amber+strict': { bg: '#FF8C00', text: '#000000', label: 'TLP:AMBER+STRICT' },
        'red':          { bg: '#FF2B2B', text: '#ffffff', label: 'TLP:RED' },
    };
    return map[level] || map['amber'];
}

function renderTlpPageBadge(auditData) {
    const mode = auditData.classificationMode || 'internal';
    if (mode === 'internal') return '';
    const tlp = getTlpStyle(auditData.tlpLevel || 'amber');
    return `<span style="display:inline-block; background:${tlp.bg}; color:${tlp.text}; font-size:0.65rem; font-weight:900; padding:0.2rem 0.6rem; border-radius:4px; letter-spacing:0.06em; vertical-align:middle;">${escapeHTML(tlp.label)}</span>`;
}

function sortFindingsBySeverity(findings) {
    return findings.sort((a, b) => {
        const weightDiff = severityWeights[b.severity] - severityWeights[a.severity];
        if (weightDiff !== 0) return weightDiff;
        const cvssA = parseFloat(a.cvss) || 0;
        const cvssB = parseFloat(b.cvss) || 0;
        return cvssB - cvssA;
    });
}

// Helper: Leer archivo como Data URL
const readFileAsDataURL = (file) => new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target.result);
    reader.readAsDataURL(file);
});

// Helper: Calcular severidad desde CVSS
const calculateSeverityFromCvss = (cvss) => {
    const score = parseFloat(cvss);
    if (isNaN(score)) return null;
    if (score >= 9.0) return 'crit';
    if (score >= 7.0) return 'high';
    if (score >= 4.0) return 'med';
    if (score > 0.0) return 'low';
    return 'info';
};

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
    if (state.showSplash) return '';

    const t = UI[state.lang];

    return `
        <header class="navbar">
            <div class="navbar-brand">
                <img src="/assets/logo-transparent.png" alt="Pentestify" style="height: 38px; width: 38px; object-fit: contain; flex-shrink: 0;">
                ${state.isDirty ? '<span class="dirty-indicator">•</span>' : ''}
            </div>
            
            <div class="navbar-actions">
                <button class="${state.showReportSelector ? 'active' : ''}" onclick="showReports()">${t.myReports}</button>
                <button class="${state.activeTab === 'editor' && !state.showReportSelector ? 'active' : ''}" onclick="hideReports(); setTab('editor')">${t.editor}</button>
                <button class="${state.activeTab === 'preview' && !state.showReportSelector ? 'active' : ''}" onclick="hideReports(); setTab('preview')">${t.preview}</button>
                <button class="btn-primary pdf-btn${state.generatingPdf ? ' pdf-btn--loading' : ''}" onclick="generatePdf()" ${state.generatingPdf ? 'disabled' : ''}>
                    ${state.generatingPdf
                        ? `<svg class="spin" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg> ${t.generatingPdf}`
                        : `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg> ${t.generatePdf}`
                    }
                </button>
                <button class="settings-btn" onclick="openSettings()" title="${state.lang === 'es' ? 'Ajustes' : 'Settings'}">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
                </button>
            </div>
        </header>
    `;
}

function renderEditor() {
    if (state.activeTab !== 'editor' || state.showSplash || state.showReportSelector) return '';
    if (state.showReportSelector) return '';

    const t = UI[state.lang];

    return `
        <div class="editor-container">
            <div class="editor-left">
                <div class="card">
                    <h2>${t.newFinding}</h2>
                    <p class="text-muted">${t.newFindingDesc}</p>
                    
                    <form id="findingForm" onsubmit="handleFindingSubmit(event)">
                        <div class="form-group template-search-container">
                            <label>${t.quickTemplate}</label>
                            <input type="text"
                                   id="templateSearch"
                                   class="template-search-input"
                                   placeholder="${state.lang === 'es' ? 'Buscar plantilla...' : 'Search template...'}"
                                   oninput="filterTemplates(this.value)"
                                   onfocus="showTemplateDropdown()"
                                   autocomplete="off">
                            <select id="templateSelect" onchange="applyTemplate(this.value); hideTemplateDropdown();" size="8" class="template-filtered-select" style="display:none;">
                                <option value="custom" ${state.currentFinding.templateKey === 'custom' ? 'selected' : ''}>${t.customOther}</option>
                                <option value="sqli" ${state.currentFinding.templateKey === 'sqli' ? 'selected' : ''}>SQL Injection</option>
                                <option value="xss" ${state.currentFinding.templateKey === 'xss' ? 'selected' : ''}>XSS</option>
                                <option value="idor" ${state.currentFinding.templateKey === 'idor' ? 'selected' : ''}>IDOR</option>
                                <option value="ssrf" ${state.currentFinding.templateKey === 'ssrf' ? 'selected' : ''}>SSRF</option>
                                <option value="csrf" ${state.currentFinding.templateKey === 'csrf' ? 'selected' : ''}>CSRF</option>
                                <option value="xxe" ${state.currentFinding.templateKey === 'xxe' ? 'selected' : ''}>XXE</option>
                                <option value="rce" ${state.currentFinding.templateKey === 'rce' ? 'selected' : ''}>RCE</option>
                                <option value="lfi" ${state.currentFinding.templateKey === 'lfi' ? 'selected' : ''}>LFI</option>
                                <option value="cors" ${state.currentFinding.templateKey === 'cors' ? 'selected' : ''}>CORS Misconfig</option>
                                <option value="path_traversal" ${state.currentFinding.templateKey === 'path_traversal' ? 'selected' : ''}>Path Traversal</option>
                                <option value="command_injection" ${state.currentFinding.templateKey === 'command_injection' ? 'selected' : ''}>Command Injection</option>
                                <option value="insecure_deserialization" ${state.currentFinding.templateKey === 'insecure_deserialization' ? 'selected' : ''}>Insecure Deserialization</option>
                                <option value="jwt_bypass" ${state.currentFinding.templateKey === 'jwt_bypass' ? 'selected' : ''}>JWT Bypass</option>
                                <option value="file_upload" ${state.currentFinding.templateKey === 'file_upload' ? 'selected' : ''}>File Upload</option>
                                <option value="security_misconfig" ${state.currentFinding.templateKey === 'security_misconfig' ? 'selected' : ''}>Security Misconfig</option>
                                <option value="missing_csp" ${state.currentFinding.templateKey === 'missing_csp' ? 'selected' : ''}>Missing CSP Header</option>
                                <option value="missing_x_frame" ${state.currentFinding.templateKey === 'missing_x_frame' ? 'selected' : ''}>Missing X-Frame-Options</option>
                                <option value="missing_x_content_type" ${state.currentFinding.templateKey === 'missing_x_content_type' ? 'selected' : ''}>Missing X-Content-Type-Options</option>
                                <option value="missing_referrer" ${state.currentFinding.templateKey === 'missing_referrer' ? 'selected' : ''}>Missing Referrer-Policy</option>
                                <option value="missing_permissions" ${state.currentFinding.templateKey === 'missing_permissions' ? 'selected' : ''}>Missing Permissions-Policy</option>
                                <optgroup label="WordPress">
                                    <option value="wordpress_xmlrpc" ${state.currentFinding.templateKey === 'wordpress_xmlrpc' ? 'selected' : ''}>WP XML-RPC Enabled</option>
                                    <option value="wordpress_rest_enum" ${state.currentFinding.templateKey === 'wordpress_rest_enum' ? 'selected' : ''}>WP User Enum via REST API</option>
                                    <option value="wordpress_error_enum" ${state.currentFinding.templateKey === 'wordpress_error_enum' ? 'selected' : ''}>WP User Enum via Errors</option>
                                    <option value="wordpress_login_brute" ${state.currentFinding.templateKey === 'wordpress_login_brute' ? 'selected' : ''}>WP Brute Force Login</option>
                                    <option value="wordpress_plugin_enum" ${state.currentFinding.templateKey === 'wordpress_plugin_enum' ? 'selected' : ''}>WP Plugin Enumeration</option>
                                    <option value="wordpress_theme_enum" ${state.currentFinding.templateKey === 'wordpress_theme_enum' ? 'selected' : ''}>WP Theme Enumeration</option>
                                    <option value="wordpress_config_exposure" ${state.currentFinding.templateKey === 'wordpress_config_exposure' ? 'selected' : ''}>WP wp-config.php Exposed</option>
                                    <option value="wordpress_uploads_directory" ${state.currentFinding.templateKey === 'wordpress_uploads_directory' ? 'selected' : ''}>WP Uploads Dir Listing</option>
                                    <option value="wordpress_version_leak" ${state.currentFinding.templateKey === 'wordpress_version_leak' ? 'selected' : ''}>WP Version Leak</option>
                                    <option value="wordpress_db_backup" ${state.currentFinding.templateKey === 'wordpress_db_backup' ? 'selected' : ''}>WP Database Backup Exposed</option>
                                </optgroup>
                            </select>
                        </div>
                        
                        <div class="form-group">
                            <label>${t.vulnTitle}</label>
                            <input type="text" id="findingTitle" value="${escapeHTML(state.currentFinding.title)}" required oninput="updateCurrentFinding('title', this.value)">
                        </div>
                        
                        <div class="form-group">
                            <label>${t.severity}</label>
                            <select id="findingSeverity" onchange="updateCurrentFinding('severity', this.value)">
                                ${Object.entries(t.severityLevels).map(([key, label]) =>
        `<option value="${key}" ${state.currentFinding.severity === key ? 'selected' : ''}>${label}</option>`
    ).join('')}
                            </select>
                        </div>
                        
                        <div class="form-group">
                            <label>${t.description}</label>
                            <textarea id="findingDescription" rows="4" oninput="updateCurrentFinding('description', this.value)">${escapeHTML(state.currentFinding.description)}</textarea>
                        </div>
                        
                        <div class="form-group">
                            <label>${t.cvss}</label>
                            <input type="text" id="findingCvss" value="${escapeHTML(state.currentFinding.cvss)}" oninput="updateCurrentFinding('cvss', this.value)">
                        </div>
                        
                        <div class="form-group">
                            <label>${t.poc}</label>
                            <textarea id="findingPoc" rows="4" oninput="updateCurrentFinding('poc', this.value)">${escapeHTML(state.currentFinding.poc)}</textarea>
                        </div>
                        
                        <div class="form-group">
                            <label>${t.impact}</label>
                            <textarea id="findingImpact" rows="3" oninput="updateCurrentFinding('impact', this.value)">${escapeHTML(state.currentFinding.impact)}</textarea>
                        </div>

                        <div class="form-group image-upload-section" onpaste="handleImagePaste(event)">
                            <label>${t.images} <small style="font-weight:normal;color:#666;">(también puedes pegar imagen con Ctrl+V aquí)</small></label>
                            <input type="file" id="findingImages" accept="image/*" multiple onchange="handleImageUpload(event)">
                            <small class="text-muted">${state.currentFinding.images.length} imagen(es) seleccionada(s)</small>
                        </div>

                        ${state.currentFinding.images.length > 0 ? `
                        <div class="image-preview-container">
                            ${state.currentFinding.images.map((img, idx) => `
                                <div class="image-preview-item">
                                    <img src="${img}" alt="Evidencia ${idx + 1}">
                                    <button type="button" class="image-remove-btn" onclick="removeImage(${idx})">×</button>
                                </div>
                            `).join('')}
                        </div>
                        ` : ''}

                        <div class="form-group">
                            <label>${t.remediation}</label>
                            <textarea id="findingRemediation" rows="3" oninput="updateCurrentFinding('remediation', this.value)">${escapeHTML(state.currentFinding.remediation)}</textarea>
                        </div>

                        <div class="form-group">
                            <label>${t.reference}</label>
                            <input type="text" id="findingReference" value="${escapeHTML(state.currentFinding.reference)}" oninput="updateCurrentFinding('reference', this.value)">
                        </div>

                        <div class="form-row">
                            <div class="form-group">
                                <label>${t.cve}</label>
                                <input type="text" id="findingCve" placeholder="CVE-2024-XXXXX" value="${escapeHTML(state.currentFinding.cve)}" oninput="updateCurrentFinding('cve', this.value)">
                            </div>
                            <div class="form-group">
                                <label>${t.cwe}</label>
                                <input type="text" id="findingCwe" placeholder="CWE-89" value="${escapeHTML(state.currentFinding.cwe || '')}" oninput="updateCurrentFinding('cwe', this.value)">
                            </div>
                        </div>

                        <div class="form-actions">
                            <button type="submit" class="btn-primary">${state.editingFindingIndex !== null ? t.updateFinding : t.addFinding}</button>
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
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
                <h3 style="margin: 0;">Datos de la Auditoría</h3>
                <button class="btn-primary" onclick="saveCurrentReport()" style="display: flex; align-items: center; gap: 0.5rem; padding: 0.5rem 1rem;" title="${t.saveReport}">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                        <polyline points="17 21 17 13 7 13 7 21"></polyline>
                        <polyline points="7 3 7 8 15 8"></polyline>
                    </svg>
                    <span>${t.saveReport}</span>
                </button>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label>${t.documentTitle}</label>
                    <input type="text" value="${escapeHTML(d.documentTitle)}" onchange="updateAuditData('documentTitle', this.value)">
                </div>
                <div class="form-group">
                    <label>${t.clientCompany}</label>
                    <input type="text" value="${escapeHTML(d.clientCompany)}" onchange="updateAuditData('clientCompany', this.value)">
                </div>
            </div>
            
            <div class="form-row">
                <div class="form-group" style="flex: 1;">
                    <label>${t.clientLogo1 || 'Logotipo 1'}</label>
                    <input type="file" accept="image/*" onchange="handleClientLogoUpload(event, 0)">
                    ${d.clientLogo[0] ? `
                        <div style="margin-top: 0.5rem; display: flex; align-items: center; gap: 0.5rem;">
                            <img src="${d.clientLogo[0]}" alt="Logo 1" style="height: 40px; border-radius: 4px; border: 1px solid #e5e7eb;">
                            <button type="button" class="btn-sm btn-secondary" onclick="removeClientLogo(0)">×</button>
                        </div>
                    ` : ''}
                </div>
                <div class="form-group" style="flex: 1;">
                    <label>${t.clientLogo2 || 'Logotipo 2'}</label>
                    <input type="file" accept="image/*" onchange="handleClientLogoUpload(event, 1)">
                    ${d.clientLogo[1] ? `
                        <div style="margin-top: 0.5rem; display: flex; align-items: center; gap: 0.5rem;">
                            <img src="${d.clientLogo[1]}" alt="Logo 2" style="height: 40px; border-radius: 4px; border: 1px solid #e5e7eb;">
                            <button type="button" class="btn-sm btn-secondary" onclick="removeClientLogo(1)">×</button>
                        </div>
                    ` : ''}
                </div>
            </div>

            <div class="form-row">
                <div class="form-group">
                    <label>${t.targetAsset}</label>
                    <input type="text" value="${escapeHTML(d.targetAsset)}" onchange="updateAuditData('targetAsset', this.value)">
                </div>
                <div class="form-group">
                    <label>${t.auditorCompany}</label>
                    <input type="text" value="${escapeHTML(d.auditorCompany)}" onchange="updateAuditData('auditorCompany', this.value)">
                </div>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label>${t.auditorName}</label>
                    <input type="text" value="${escapeHTML(d.auditorName)}" onchange="updateAuditData('auditorName', this.value)">
                </div>
                <div class="form-group">
                    <label>${t.classificationMode}</label>
                    <select onchange="updateAuditData('classificationMode', this.value); renderApp();">
                        ${Object.entries(t.classificationModes).map(([key, label]) =>
        `<option value="${key}" ${d.classificationMode === key ? 'selected' : ''}>${label}</option>`
    ).join('')}
                    </select>
                </div>
            </div>
            <div class="form-row" style="${d.classificationMode === 'tlp' ? 'display:none;' : ''}">
                <div class="form-group">
                    <label>${t.classification}</label>
                    <select onchange="updateAuditData('classification', this.value)">
                        ${Object.entries(t.classifications).map(([key, label]) =>
        `<option value="${key}" ${d.classification === key ? 'selected' : ''}>${label}</option>`
    ).join('')}
                    </select>
                </div>
            </div>
            <div class="form-row" style="${d.classificationMode === 'internal' ? 'display:none;' : ''}">
                <div class="form-group">
                    <label>${t.tlp}</label>
                    <select onchange="updateAuditData('tlpLevel', this.value)">
                        ${Object.entries(t.tlpLevels).map(([key, label]) =>
        `<option value="${key}" ${d.tlpLevel === key ? 'selected' : ''}>${label}</option>`
    ).join('')}
                    </select>
                </div>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label>${t.version}</label>
                    <input type="text" value="${escapeHTML(d.version)}" onchange="updateAuditData('version', this.value)">
                </div>
                <div class="form-group">
                    <label>${t.date}</label>
                    <input type="date" value="${escapeHTML(d.date)}" onchange="updateAuditData('date', this.value)">
                </div>
            </div>

            <div class="form-group">
                <label>${t.auditType}</label>
                <select onchange="updateAuditData('auditType', this.value)">
                    ${Object.entries(t.auditTypes).map(([key, label]) =>
        `<option value="${key}" ${d.auditType === key ? 'selected' : ''}>${label}</option>`
    ).join('')}
                </select>
            </div>

            <div class="form-group">
                <label>${t.incidents}</label>
                <div class="incidents-toggle" style="display:flex; gap:0.75rem; margin-bottom:0.5rem;">
                    <label style="display:flex; align-items:center; gap:0.4rem; font-weight:500; text-transform:none; letter-spacing:normal; cursor:pointer;">
                        <input type="radio" name="hasIncidents" value="no" ${!d.hasIncidents ? 'checked' : ''} onchange="updateAuditData('hasIncidents', false); document.getElementById('incidentsTextContainer').style.display='none';" style="width:auto; padding:0; margin:0;">
                        ${t.incidentsNo}
                    </label>
                    <label style="display:flex; align-items:center; gap:0.4rem; font-weight:500; text-transform:none; letter-spacing:normal; cursor:pointer;">
                        <input type="radio" name="hasIncidents" value="yes" ${d.hasIncidents ? 'checked' : ''} onchange="updateAuditData('hasIncidents', true); document.getElementById('incidentsTextContainer').style.display='block';" style="width:auto; padding:0; margin:0;">
                        ${t.incidentsYes}
                    </label>
                </div>
                <div id="incidentsTextContainer" style="display: ${d.hasIncidents ? 'block' : 'none'}; margin-top: 0.5rem;">
                    <textarea rows="3" placeholder="${t.incidentsDesc}..." oninput="updateAuditData('incidentsText', this.value)">${escapeHTML(d.incidentsText)}</textarea>
                </div>
            </div>

            <hr style="margin: 1.5rem 0; border: none; border-top: 1px solid #e5e7eb;">

            <div class="form-group">
                <label>${t.auditSummary}</label>
                <small style="display:block; color:#666; margin-bottom:0.5rem; font-weight:normal;">${t.auditSummaryDesc}</small>
                <textarea rows="4" placeholder="${t.auditSummary}..." oninput="updateAuditData('auditSummary', this.value)">${escapeHTML(d.auditSummary)}</textarea>
            </div>

            <div class="form-group">
                <label>${t.testsPerformed}</label>
                <small style="display:block; color:#666; margin-bottom:0.5rem; font-weight:normal;">${t.testsPerformedDesc}</small>
                <textarea rows="4" placeholder="${t.testsPerformed}..." oninput="updateAuditData('testsPerformed', this.value)">${escapeHTML(d.testsPerformed)}</textarea>
            </div>

            <div class="form-group">
                <label>${t.recommendedSolutions}</label>
                <small style="display:block; color:#666; margin-bottom:0.5rem; font-weight:normal;">${t.recommendedSolutionsDesc}</small>
                <textarea rows="4" placeholder="${t.recommendedSolutions}..." oninput="updateAuditData('recommendedSolutions', this.value)">${escapeHTML(d.recommendedSolutions)}</textarea>
            </div>
        </div>
    `;
}

function renderFindingsList() {
    const t = UI[state.lang];

    if (state.findings.length === 0) {
        return `<div class="card"><p class="text-muted">${t.noFindings}</p></div>`;
    }

    return `
        <div class="findings-list">
            ${state.findings.map((f, idx) => `
                <div class="finding-item severity-${f.severity}">
                    <div class="finding-header">
                        <span class="finding-number">#${idx + 1}</span>
                        <span class="finding-title">${escapeHTML(f.title)}</span>
                        <span class="finding-severity">${t.severityLevels[f.severity]}</span>
                        <div class="finding-actions">
                            <button class="btn-edit" onclick="editFinding(${idx})" title="${state.lang === 'es' ? 'Editar' : 'Edit'}">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                                </svg>
                            </button>
                            <button class="btn-delete" onclick="deleteFinding(${idx})" title="${state.lang === 'es' ? 'Eliminar' : 'Delete'}">×</button>
                        </div>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

function getThemeColors() {
    const theme = state.reportTheme;
    const dk  = theme === 'dark';
    const htb = theme === 'htb';
    return {
        pageBg:         htb ? '#1a2332' : dk ? '#0f172a'  : '#ffffff',
        cardBg:         htb ? '#0d1117' : dk ? '#1e293b'  : '#f9fafb',
        cardBgAlt:      htb ? '#0d1117' : dk ? '#1e293b'  : '#f8fafc',
        greenBg:        htb ? '#0a1f0d' : dk ? '#052e16'  : '#f0fdf4',
        orangeBg:       htb ? '#1f1005' : dk ? '#431407'  : '#fff7ed',
        purpleBg:       htb ? '#140d1f' : dk ? '#2e1065'  : '#faf5ff',
        metaBg:         htb ? '#0d1117' : dk ? 'linear-gradient(135deg,#1e293b 0%,#0f172a 100%)' : 'linear-gradient(135deg,#f8fafc 0%,#f1f5f9 100%)',
        textPrimary:    htb ? '#ffffff' : dk ? '#f8fafc'  : '#0f172a',
        textHeading:    htb ? '#9fef00' : dk ? '#f1f5f9'  : '#111827',
        textBody:       htb ? '#e2e8f0' : dk ? '#e2e8f0'  : '#1f2937',
        textMuted:      htb ? '#cbd5e1' : dk ? '#cbd5e1'  : '#374151',
        textFaint:      htb ? '#a0aec0' : dk ? '#94a3b8'  : '#4b5563',
        textSubtle:     htb ? '#a0aec0' : dk ? '#94a3b8'  : '#475569',
        textGray:       htb ? '#64748b' : dk ? '#94a3b8'  : '#6b7280',
        textGrayMed:    htb ? '#9fef00' : dk ? '#94a3b8'  : '#64748b',
        coverAccent:    htb ? '#9fef00' : dk ? '#94a3b8'  : '#475569',
        accentLine:     htb ? '#9fef00' : dk ? '#2563eb'  : '#2563eb',
        accentBar:      htb ? '#9fef00' : dk ? 'linear-gradient(90deg,#2563eb,#6366f1)' : 'linear-gradient(90deg,#2563eb,#6366f1)',
        versionColor:   htb ? '#9fef00' : dk ? '#9fef00'  : '#2563eb',
        textRed:        htb ? '#ff6b6b' : dk ? '#f87171'  : '#dc2626',
        textOrange:     htb ? '#fb923c' : dk ? '#fb923c'  : '#c2410c',
        textOrangeDark: htb ? '#fcd34d' : dk ? '#fdba74'  : '#9a3412',
        textGreen:      htb ? '#9fef00' : dk ? '#86efac'  : '#166534',
        textGreenDark:  htb ? '#d9f99d' : dk ? '#86efac'  : '#15803d',
        border:         htb ? '#2d3f55' : dk ? '#334155'  : '#e5e7eb',
        borderLight:    htb ? '#2d3f55' : dk ? '#334155'  : '#d1d5db',
        borderMeta:     htb ? '#2d3f55' : dk ? '#334155'  : '#e2e8f0',
        borderMetaSub:  htb ? '#2d3f55' : dk ? '#475569'  : '#cbd5e1',
        borderGreen:    htb ? '#9fef00' : dk ? '#166534'  : '#bbf7d0',
        borderOrange:   htb ? '#c2410c' : dk ? '#9a3412'  : '#fed7aa',
        borderPurple:   htb ? '#a78bfa' : dk ? '#6b21a8'  : '#e9d5ff',
        borderFaint:    htb ? '#2d3f55' : dk ? '#334155'  : '#f3f4f6',
        classifBg:      htb ? '#0d1117' : dk ? '#1e293b'  : '#f1f5f9',
        classifBorder:  htb ? '#9fef00' : dk ? '#475569'  : '#cbd5e1',
        classifText:    htb ? '#9fef00' : dk ? '#94a3b8'  : '#475569',
    };
}

function renderCvssSummary() {
    const total = state.findings.length;
    if (total === 0) return '';

    const t = UI[state.lang];
    const c2 = getThemeColors();
    const counts = {
        crit: state.findings.filter(f => f.severity === 'crit').length,
        high: state.findings.filter(f => f.severity === 'high').length,
        med: state.findings.filter(f => f.severity === 'med').length,
        low: state.findings.filter(f => f.severity === 'low').length,
        info: state.findings.filter(f => f.severity === 'info').length
    };

    const colors = {
        crit: 'var(--severity-crit, #dc2626)',
        high: 'var(--severity-high, #f97316)',
        med: 'var(--severity-med, #eab308)',
        low: 'var(--severity-low, #22c55e)',
        info: 'var(--severity-info, #6b7280)'
    };

    const cardBg   = c2.cardBg;
    const border   = c2.border;
    const textMuted = c2.textMuted;
    const textHead  = c2.textHeading;
    const borderH3  = c2.borderFaint;

    const order = ['crit', 'high', 'med', 'low', 'info'];
    let barSegments = '';
    let legendItems = '';

    for (const sev of order) {
        if (counts[sev] > 0) {
            const pct = (counts[sev] / total) * 100;
            barSegments += `<div style="width: ${pct}%; background-color: ${colors[sev]}; height: 100%; transition: width 0.3s;" title="${t.severityLevels[sev]}: ${counts[sev]}"></div>`;
        }

        legendItems += `
            <div style="display: flex; align-items: center; gap: 0.5rem; background: ${cardBg}; padding: 0.5rem 1rem; border-radius: 0.5rem; border: 1px solid ${border};">
                <div style="width: 12px; height: 12px; border-radius: 50%; background-color: ${colors[sev]};"></div>
                <span style="font-weight: 500; color: ${textMuted};">${t.severityLevels[sev]}</span>
                <span style="font-weight: 800; color: ${textHead}; margin-left: 0.25rem;">${counts[sev]}</span>
            </div>
        `;
    }

    return `
        <div class="cvss-summary card" style="margin: 2rem 0; padding: 1.5rem; page-break-inside: avoid; background: ${cardBg}; border-color: ${border};">
            <h3 style="margin-bottom: 1.5rem; border-bottom: 1px solid ${borderH3}; padding-bottom: 0.75rem; color: ${textHead};">${t.cvssSummaryTitle}</h3>

            <div style="display: flex; height: 28px; width: 100%; border-radius: 6px; overflow: hidden; margin-bottom: 1.5rem; box-shadow: inset 0 2px 4px 0 rgba(0,0,0,0.06);">
                ${barSegments}
            </div>

            <div style="display: flex; flex-wrap: wrap; gap: 1rem; justify-content: center;">
                ${legendItems}
            </div>
        </div>
    `;
}

function renderPreview() {
    if (state.activeTab !== 'preview' || state.showSplash || state.showReportSelector) return '';

    const t = UI[state.lang];
    const d = state.auditData;
    const c   = getThemeColors();
    const dk  = state.reportTheme === 'dark';
    const htb = state.reportTheme === 'htb';

    return `
        <div class="preview-container">
            <!-- PORTADA -->
            <div class="cover-page" style="
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                min-height: 100vh;
                page-break-after: always;
                page-break-inside: avoid;
                background: ${c.pageBg};
                color: ${c.textHeading};
                padding: 0 3rem 0.25rem 3rem;
            ">

                <!-- PARTE SUPERIOR Y MEDIA CENTRALIZADA -->
                <div style="display:flex; flex-direction:column; align-items:center; justify-content:center; flex: 1;">

                    <div style="margin-bottom: 1rem; width: 100%; display: flex; justify-content: center; gap: 1rem; flex-wrap: wrap;">
                        ${d.clientLogo[0] || d.clientLogo[1] ? `
                            ${d.clientLogo[0] ? `
                                <img src="${d.clientLogo[0]}" alt="${t.logoClient} 1" style="max-height: 200px; width: auto; max-width: 45%; object-fit: contain; display: block; filter: drop-shadow(0 10px 25px rgba(0,0,0,0.08));">
                            ` : ''}
                            ${d.clientLogo[1] ? `
                                <img src="${d.clientLogo[1]}" alt="${t.logoClient} 2" style="max-height: 200px; width: auto; max-width: 45%; object-fit: contain; display: block; filter: drop-shadow(0 10px 25px rgba(0,0,0,0.08));">
                            ` : ''}
                        ` : htb ? `
                            <div style="display:flex;flex-direction:column;align-items:center;gap:1.25rem;">
                                <div style="display:flex;align-items:center;gap:1.25rem;">
                                    <svg width="72" height="82" viewBox="0 0 72 82" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <polygon points="36,3 69,21 69,57 36,75 3,57 3,21" fill="none" stroke="#9fef00" stroke-width="3.5" stroke-linejoin="round"/>
                                        <polygon points="36,3 69,21 36,39 3,21" fill="#9fef00" fill-opacity="0.18" stroke="#9fef00" stroke-width="2.5" stroke-linejoin="round"/>
                                        <polygon points="3,21 36,39 36,75 3,57" fill="#9fef00" fill-opacity="0.28" stroke="#9fef00" stroke-width="2.5" stroke-linejoin="round"/>
                                        <polygon points="69,21 36,39 36,75 69,57" fill="#9fef00" fill-opacity="0.10" stroke="#9fef00" stroke-width="2.5" stroke-linejoin="round"/>
                                        <line x1="36" y1="39" x2="36" y2="75" stroke="#9fef00" stroke-width="2.5"/>
                                    </svg>
                                    <div style="font-size:2.6rem;font-weight:900;letter-spacing:0.04em;color:#ffffff;line-height:1;">
                                        <span style="color:#9fef00;">HACK</span>THE<span style="color:#9fef00;">BOX</span>
                                    </div>
                                </div>
                            </div>
                        ` : `
                            <div style="width:160px; height:160px; background:linear-gradient(135deg,#2563eb,#1e40af); border-radius:32px; display:flex; align-items:center; justify-content:center; box-shadow:0 15px 40px rgba(37,99,235,0.3);">
                                <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M12 8v4"/><path d="M12 16h.01"/></svg>
                            </div>
                        `}
                    </div>

                    <!-- TÍTULO + RED TEAM INFO -->
                    <div style="display:flex; flex-direction:column; align-items:center; text-align:center;">
                        <h1 style="font-size: 3.5rem; font-weight: 900; letter-spacing: -0.04em; margin: 0 0 1.25rem; color: ${c.textPrimary}; line-height:1.1; max-width: 800px;">
                            ${escapeHTML(d.documentTitle)}
                        </h1>

                        <div style="width: 80px; height: 5px; background: ${c.accentBar}; border-radius: 6px; margin-bottom: 1.5rem; box-shadow: ${htb ? '0 4px 14px rgba(159,239,0,0.4)' : '0 4px 10px rgba(37,99,235,0.3)'};"></div>

                        <p style="font-size: 1.35rem; color: ${c.coverAccent}; font-weight: 600; margin:0; letter-spacing: -0.01em;">
                            ${escapeHTML(d.targetAsset)}
                        </p>
                    </div>
                </div>

                ${(() => {
                    const mode = d.classificationMode || 'internal';
                    const tlp = getTlpStyle(d.tlpLevel || 'amber');
                    const classLabels = { '1': 'Público', '2': 'Interno', '3': 'Confidencial', '4': 'Restringido' };
                    const classLabel = classLabels[d.classification] || 'Interno';
                    const showInternal = mode === 'internal' || mode === 'both';
                    const showTlp = mode === 'tlp' || mode === 'both';
                    return `
                    <div style="margin-top: 1.5rem; display: flex; justify-content: center; align-items: center; gap: 1rem; flex-wrap: wrap;">
                        ${showInternal ? `
                            <span style="display:inline-flex; align-items:center; gap:0.4rem; background:${c.classifBg}; border:1px solid ${c.classifBorder}; border-radius:6px; padding:0.4rem 1rem; font-size:0.75rem; font-weight:700; color:${c.classifText}; text-transform:uppercase; letter-spacing:0.08em;">
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                                ${escapeHTML(classLabel)}
                            </span>
                        ` : ''}
                        ${showTlp ? `
                            <div style="display:inline-flex; align-items:center; background:${tlp.bg}; border-radius:6px; padding:0.4rem 1rem;">
                                <span style="font-size:0.8rem; font-weight:900; color:${tlp.text}; letter-spacing:0.04em;">${escapeHTML(tlp.label)}</span>
                            </div>
                        ` : ''}
                    </div>`;
                })()}

                <div style="margin-top: 1.5rem; background: ${c.metaBg}; border: 1px solid ${c.borderMeta}; border-radius: 12px; padding: 1.5rem 2rem; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
                    <div style="display: flex; gap: 0;">
                        <div style="flex: 1; padding: 0 1rem; border-right: 1px solid ${c.borderMetaSub};">
                            <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem;">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="${c.textGrayMed}" stroke-width="2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/></svg>
                                <span style="font-size:0.6rem; font-weight:700; color:${c.textGrayMed}; text-transform:uppercase; letter-spacing:0.1em;">${t.clientCompany}</span>
                            </div>
                            <p style="font-size:0.95rem; font-weight:700; color:${c.textPrimary}; margin:0; line-height:1.4;">${escapeHTML(d.clientCompany)}</p>
                        </div>
                        <div style="flex: 1; padding: 0 1rem; border-right: 1px solid ${c.borderMetaSub};">
                            <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem;">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="${c.textGrayMed}" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                                <span style="font-size:0.6rem; font-weight:700; color:${c.textGrayMed}; text-transform:uppercase; letter-spacing:0.1em;">${t.auditorCompany}</span>
                            </div>
                            <p style="font-size:0.95rem; font-weight:700; color:${c.textPrimary}; margin:0; line-height:1.4;">${escapeHTML(d.auditorCompany)}</p>
                            <p style="font-size:0.8rem; font-weight:500; color:${c.textGrayMed}; margin:0.25rem 0 0 0;">${escapeHTML(d.auditorName)}</p>
                        </div>
                        <div style="flex: 1; padding: 0 1rem; border-right: 1px solid ${c.borderMetaSub};">
                            <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem;">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="${c.textGrayMed}" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                                <span style="font-size:0.6rem; font-weight:700; color:${c.textGrayMed}; text-transform:uppercase; letter-spacing:0.1em;">${t.date}</span>
                            </div>
                            <p style="font-size:0.95rem; font-weight:700; color:${c.textPrimary}; margin:0;">${escapeHTML(d.date)}</p>
                        </div>
                        <div style="flex: 0.7; padding: 0 1rem;">
                            <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem;">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="${c.textGrayMed}" stroke-width="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>
                                <span style="font-size:0.6rem; font-weight:700; color:${c.textGrayMed}; text-transform:uppercase; letter-spacing:0.1em;">${t.version}</span>
                            </div>
                            <p style="font-size:1.1rem; font-weight:800; color:${c.versionColor}; margin:0;">${escapeHTML(d.version)}</p>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- ÍNDICE -->
            <div class="index-page" style="padding: 4rem 2rem; min-height: 100vh; page-break-after: always; max-width: 900px; margin: 0 auto; background: ${c.pageBg};">
                <div style="display:flex; justify-content:space-between; align-items:baseline; border-bottom: 2px solid ${c.border}; padding-bottom: 1rem; margin-bottom: 2.5rem;">
                    <h2 style="font-size: 2.25rem; color: ${c.textHeading}; margin: 0; font-weight: 800;">${t.index}</h2>
                    ${renderTlpPageBadge(d)}
                </div>

                <div style="display: flex; flex-direction: column; gap: 0.75rem;">
                    <a href="#summary" style="display: flex; justify-content: space-between; text-decoration: none; color: ${c.textMuted}; font-weight: 700; padding: 0.75rem 0; border-bottom: 1px dotted ${c.borderLight}; font-size: 1.125rem; transition: color 0.2s;">
                        <span>${t.executiveSummaryWithCVSS}</span>
                    </a>
                    <a href="#incidents" style="display: flex; justify-content: space-between; text-decoration: none; color: ${c.textMuted}; font-weight: 700; padding: 0.75rem 0; border-bottom: 1px dotted ${c.borderLight}; font-size: 1.125rem; transition: color 0.2s;">
                        <span>${t.incidentsSectionTitle}</span>
                    </a>

                    ${state.findings.length > 0 ? `<h3 style="margin-top: 2rem; margin-bottom: 1rem; color: ${c.textFaint}; font-size: 1.5rem; font-weight: 700;">${t.technicalFindings}</h3>` : ''}

                    ${state.findings.map((f, idx) => `
                        <a href="#finding-${idx}" style="display: flex; justify-content: space-between; text-decoration: none; color: ${c.textHeading}; padding: 0.75rem 0; border-bottom: 1px dotted ${c.borderLight}; align-items: center; transition: background-color 0.2s;" onmouseover="this.style.backgroundColor=state.reportTheme==='dark'?'#1e293b':'#f9fafb'" onmouseout="this.style.backgroundColor='transparent'">
                            <div style="padding-right: 1rem;">
                                <span style="display: inline-block; width: 2rem; font-weight: 700; color: ${c.textGray};">${idx + 1}.</span>
                                <span style="font-weight: 500;">${escapeHTML(f.title)}</span>
                            </div>
                            <div style="display: flex; align-items: center; gap: 1rem;">
                                <span style="font-size: 0.75rem; font-weight: 700; text-transform: uppercase; padding: 0.25rem 0.5rem; border-radius: 6px; background-color: var(--severity-${f.severity}); color: white; min-width: 80px; text-align: center; display: inline-block;">
                                    ${t.severityLevels[f.severity]}
                                </span>
                                <span style="font-weight: 700; color: ${c.textGray}; font-size: 0.875rem; width: 40px; text-align: right;">${escapeHTML(f.cvss || '-')}</span>
                            </div>
                        </a>
                    `).join('')}
                </div>
            </div>
            
            <!-- RESUMEN EJECUTIVO + INCIDENCIAS (misma página) -->
            <div style="padding: 2rem 0; page-break-inside: avoid; background: ${c.pageBg};">
                <div id="summary" style="margin-bottom: 3rem;">
                    <div style="display:flex; justify-content:space-between; align-items:baseline; border-bottom: 2px solid ${c.border}; padding-bottom: 0.75rem; margin-bottom: 1.5rem;">
                        <h2 style="font-size: 1.75rem; color: ${c.textHeading}; margin: 0; font-weight: 800;">${t.executiveSummary}</h2>
                        ${renderTlpPageBadge(d)}
                    </div>
                    ${renderCvssSummary()}
                </div>

                <div id="incidents">
                    <div style="display:flex; justify-content:space-between; align-items:baseline; border-bottom: 2px solid ${c.border}; padding-bottom: 0.75rem; margin-bottom: 1rem;">
                        <h2 style="font-size: 1.75rem; color: ${c.textHeading}; margin: 0; font-weight: 800;">${t.incidentsSectionTitle}</h2>
                        ${renderTlpPageBadge(d)}
                    </div>
                ${d.hasIncidents ? `
                    <div style="background:${c.orangeBg}; border:1px solid ${c.borderOrange}; border-left:6px solid #f97316; border-radius:10px; padding:1.5rem 2rem;">
                        <p style="font-weight:700; color:${c.textOrange}; margin-bottom:0.75rem; font-size:1rem; display:flex; align-items:center; gap:0.5rem;">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
                            ${t.incidentsRecorded}
                        </p>
                        <p style="color:${c.textOrangeDark}; line-height:1.7; white-space:pre-wrap; text-align: justify;">${formatMultiline(d.incidentsText || '')}</p>
                    </div>
                ` : `
                    <div style="background:${c.greenBg}; border:1px solid ${c.borderGreen}; border-left:6px solid #22c55e; border-radius:10px; padding:1.5rem 2rem; display:flex; align-items:center; gap:1rem;">
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#16a34a" stroke-width="2.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                        <p style="color:${c.textGreen}; font-weight:600; font-size:1.05rem; margin:0;">${t.incidentsNoneText}</p>
                    </div>
                `}
            </div>

            <!-- HALLAZGOS TÉCNICOS -->
            <div class="findings-preview" style="background: ${c.pageBg};">
                ${state.findings.map((f, idx) => `
                    <div id="finding-${idx}" class="finding-preview severity-${f.severity}" style="margin-bottom: 3rem; background: ${c.cardBg}; padding: 2rem; border-radius: 12px; border-left: 6px solid var(--severity-${f.severity}); border: 1px solid ${c.border}; border-left: 6px solid var(--severity-${f.severity}); box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);">
                        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1.5rem; border-bottom: 1px solid ${c.border}; padding-bottom: 1rem; page-break-after: avoid;">
                            <h3 style="font-size: 1.5rem; font-weight: 800; color: ${c.textHeading}; margin: 0;">${idx + 1}. ${escapeHTML(f.title)}</h3>
                            <div style="background-color: var(--severity-${f.severity}); color: white; padding: 0.5rem 1rem; border-radius: 8px; font-weight: 700; font-size: 0.875rem; text-transform: uppercase; white-space: nowrap; margin-left: 1rem;">
                                ${t.severityLevels[f.severity]}
                            </div>
                        </div>

                        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1.5rem; margin-bottom: 2rem;">
                            <div style="background: ${c.cardBg}; padding: 1rem 1.5rem; border-radius: 8px; border: 1px solid ${c.border};">
                                <p style="font-size: 0.75rem; font-weight: 700; color: ${c.textGray}; text-transform: uppercase; margin-bottom: 0.25rem;">${t.cvssScore}</p>
                                <p style="font-size: 1.25rem; font-weight: 800; color: ${c.textHeading}; margin: 0;">${escapeHTML(f.cvss || t.na)}</p>
                            </div>
                            <div style="background: ${c.cardBg}; padding: 1rem 1.5rem; border-radius: 8px; border: 1px solid ${c.border};">
                                <p style="font-size: 0.75rem; font-weight: 700; color: ${c.textGray}; text-transform: uppercase; margin-bottom: 0.25rem;">${t.cveId}</p>
                                <p style="font-size: 1.25rem; font-weight: 800; color: ${c.textHeading}; margin: 0;">${escapeHTML(f.cve || t.na)}</p>
                            </div>
                            <div style="background: ${c.cardBg}; padding: 1rem 1.5rem; border-radius: 8px; border: 1px solid ${c.border};">
                                <p style="font-size: 0.75rem; font-weight: 700; color: ${c.textGray}; text-transform: uppercase; margin-bottom: 0.25rem;">${t.cweId}</p>
                                <p style="font-size: 1.25rem; font-weight: 800; color: ${c.textHeading}; margin: 0;">${f.cwe ? `<a href="https://cwe.mitre.org/data/definitions/${escapeHTML(String(f.cwe).replace(/[^0-9]/g,''))}.html" target="_blank" style="color:${c.textHeading}; text-decoration:none;">${escapeHTML(f.cwe)}</a>` : t.na}</p>
                            </div>
                            <div style="background: ${c.cardBg}; padding: 1rem 1.5rem; border-radius: 8px; border: 1px solid ${c.border};">
                                <p style="font-size: 0.75rem; font-weight: 700; color: ${c.textGray}; text-transform: uppercase; margin-bottom: 0.25rem;">${t.referenceUrl}</p>
                                <p style="font-size: 0.875rem; font-weight: 500; color: #3b82f6; margin: 0; word-break: break-all;">${f.reference ? `<a href="${escapeHTML(f.reference)}" target="_blank" style="color: #3b82f6; text-decoration: none;">${escapeHTML(f.reference)}</a>` : t.na}</p>
                            </div>
                        </div>

                        ${f.description ? `
                            <div style="margin-bottom: 1.5rem;">
                                <h4 style="font-size: 1.125rem; font-weight: 700; color: ${c.textMuted}; margin-bottom: 0.75rem; display: flex; align-items: center; gap: 0.5rem;">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
                                    ${t.description}
                                </h4>
                                <p style="color: ${c.textFaint}; line-height: 1.6; word-wrap: break-word; text-align: justify;"><span style="white-space: pre-wrap;">${formatMultiline(f.description)}</span></p>
                            </div>
                        ` : ''}

                        ${f.poc ? `
                            <div style="margin-bottom: 1.5rem; background: #1e293b; color: #e2e8f0; padding: 1.5rem; border-radius: 8px; border: 1px solid #0f172a;">
                                <h4 style="font-size: 1.125rem; font-weight: 700; color: #f8fafc; margin-bottom: 0.75rem; display: flex; align-items: center; gap: 0.5rem;">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#93c5fd" stroke-width="2"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>
                                    ${t.pocSteps}
                                </h4>
                                <p style="font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; line-height: 1.75; font-size: 0.875rem; color: #e2e8f0; margin: 0; text-align: justify;"><span style="white-space: pre-wrap;">${formatMultiline(f.poc)}</span></p>
                            </div>
                        ` : ''}

                        ${f.images && f.images.length > 0 ? `
                            <div style="margin-bottom: 1.5rem;">
                                <h4 style="font-size: 1.125rem; font-weight: 700; color: ${c.textMuted}; margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem;">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
                                    ${t.evidence}
                                </h4>
                                <div style="display: grid; grid-template-columns: 1fr; gap: 1.5rem;">
                                    ${f.images.map((img, imgIdx) => `
                                        <div style="border: 1px solid ${c.border}; border-radius: 8px; overflow: hidden; break-inside: avoid; background: ${c.pageBg}; padding: 0.5rem;">
                                            <img src="${img}" alt="${t.evidence} ${imgIdx + 1}" style="width: 100%; height: auto; border-radius: 4px; display: block;">
                                        </div>
                                    `).join('')}
                                </div>
                            </div>
                        ` : ''}

                        ${f.impact ? `
                            <div style="margin-bottom: 1.5rem;">
                                <h4 style="font-size: 1.125rem; font-weight: 700; color: ${c.textRed}; margin-bottom: 0.75rem; display: flex; align-items: center; gap: 0.5rem;">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
                                    ${t.businessImpact}
                                </h4>
                                <p style="color: ${c.textFaint}; line-height: 1.6; word-wrap: break-word; text-align: justify;"><span style="white-space: pre-wrap;">${formatMultiline(f.impact)}</span></p>
                            </div>
                        ` : ''}

                        ${f.remediation ? `
                            <div style="margin-bottom: 0; background: ${c.greenBg}; padding: 1.5rem; border-radius: 8px; border: 1px solid ${c.borderGreen};">
                                <h4 style="font-size: 1.125rem; font-weight: 700; color: ${c.textGreen}; margin-bottom: 0.75rem; display: flex; align-items: center; gap: 0.5rem;">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                                    ${t.solutionRemediation}
                                </h4>
                                <p style="color: ${c.textGreenDark}; line-height: 1.6; word-wrap: break-word; text-align: justify;"><span style="white-space: pre-wrap;">${formatMultiline(f.remediation)}</span></p>
                            </div>
                        ` : ''}
                    </div>
                `).join('')}
            </div>

            <!-- RESUMEN FINAL DE LA AUDITORÍA -->
            ${d.auditSummary || d.testsPerformed || d.recommendedSolutions ? `
            <div style="padding: 2rem 0; page-break-before: auto; background: ${c.pageBg};">
                <div style="display:flex; justify-content:space-between; align-items:baseline; border-bottom: 3px solid ${c.accentLine}; padding-bottom: 0.75rem; margin-bottom: 2rem;">
                    <h2 style="font-size: 2rem; color: ${c.textHeading}; margin: 0; font-weight: 800;">${t.auditConclusions}</h2>
                    ${renderTlpPageBadge(d)}
                </div>

                ${d.auditSummary ? `
                <div id="audit-summary" style="margin-bottom: 2.5rem;">
                    <h3 style="font-size: 1.5rem; color: ${c.textBody}; margin-bottom: 1rem; font-weight: 700; display: flex; align-items: center; gap: 0.5rem;">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2563eb" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                        ${t.auditSummary}
                    </h3>
                    <div style="background: ${c.cardBgAlt}; border: 1px solid ${c.borderMeta}; border-radius: 10px; padding: 1.5rem; line-height: 1.8; color: ${c.textMuted}; text-align: justify;">
                        <span style="white-space: pre-wrap;">${formatMultiline(d.auditSummary)}</span>
                    </div>
                </div>
                ` : ''}

                ${d.testsPerformed ? `
                <div id="tests-performed" style="margin-bottom: 2.5rem;">
                    <h3 style="font-size: 1.5rem; color: ${c.textBody}; margin-bottom: 1rem; font-weight: 700; display: flex; align-items: center; gap: 0.5rem;">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#059669" stroke-width="2"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path></svg>
                        ${t.testsPerformed}
                    </h3>
                    <div style="background: ${c.greenBg}; border: 1px solid ${c.borderGreen}; border-radius: 10px; padding: 1.5rem; line-height: 1.8; color: ${c.textMuted}; text-align: justify;">
                        <span style="white-space: pre-wrap;">${formatMultiline(d.testsPerformed)}</span>
                    </div>
                </div>
                ` : ''}

                ${d.recommendedSolutions ? `
                <div id="recommended-solutions">
                    <h3 style="font-size: 1.5rem; color: ${c.textBody}; margin-bottom: 1rem; font-weight: 700; display: flex; align-items: center; gap: 0.5rem;">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><path d="M12 8v4"></path><path d="M12 16h.01"></path></svg>
                        ${t.recommendedSolutions}
                    </h3>
                    <div style="background: ${c.purpleBg}; border: 1px solid ${c.borderPurple}; border-radius: 10px; padding: 1.5rem; line-height: 1.8; color: ${c.textMuted}; text-align: justify;">
                        <span style="white-space: pre-wrap;">${formatMultiline(d.recommendedSolutions)}</span>
                    </div>
                </div>
                ` : ''}
            </div>
            ` : ''}
        </div>
    `;
}


function renderReportsPage() {
    if (!state.showReportSelector || state.showSplash) return '';

    const t = UI[state.lang];
    const tImpExp = state.lang === 'es' ? {
        exportDb: 'Exportar BD',
        importDb: 'Importar BD',
        importConfirm: '¿Estás seguro? Esto reemplazará todos los reportes actuales.',
        importSuccess: 'Base de datos importada correctamente. Recargando...',
        importError: 'Error al importar: '
    } : {
        exportDb: 'Export DB',
        importDb: 'Import DB',
        importConfirm: 'Are you sure? This will replace all current reports.',
        importSuccess: 'Database imported successfully. Reloading...',
        importError: 'Error importing: '
    };

    return `
        <div class="reports-page">
            <div class="reports-header">
                <h1>${t.myReports}</h1>
                <div class="reports-actions">
                    <button class="btn-secondary" onclick="showDemoModal()">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
                            <line x1="8" y1="21" x2="16" y2="21"/>
                            <line x1="12" y1="17" x2="12" y2="21"/>
                        </svg>
                        ${t.generateDemoDb}
                    </button>
                    <button class="btn-secondary" onclick="exportDatabase()">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                            <polyline points="7 10 12 15 17 10"/>
                            <line x1="12" y1="15" x2="12" y2="3"/>
                        </svg>
                        ${tImpExp.exportDb}
                    </button>
                    <button class="btn-secondary" onclick="document.getElementById('db-import-input').click()">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                            <polyline points="17 8 12 3 7 8"/>
                            <line x1="12" y1="3" x2="12" y2="15"/>
                        </svg>
                        ${tImpExp.importDb}
                    </button>
                    <input type="file" id="db-import-input" accept=".db" style="display:none" onchange="importDatabase(this)">
                </div>
            </div>

            <div class="reports-list">
                ${state.savedReports.length === 0 ? `
                    <div class="empty-state">
                        <p>${t.noReports}</p>
                        <p class="text-muted">${t.noReportsDesc}</p>
                    </div>
                ` : state.savedReports.map(r => `
                    <div class="report-card" onclick="loadReport(${r.id})">
                        <h3>${escapeHTML(r.document_title)}</h3>
                        <p>${escapeHTML(r.client_company)}</p>
                        <span>${r.findings_count || 0} hallazgos</span>
                        <button onclick="event.stopPropagation(); deleteReport(${r.id})">Eliminar</button>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

function renderSettingsModal() {
    if (!state.showSettings) return '';
    const t = UI[state.lang];
    const isEs  = state.lang === 'es';
    const isDark = state.reportTheme === 'dark';
    const isHtb  = state.reportTheme === 'htb';
    const isLight = state.reportTheme === 'light';

    return `
        <div class="settings-overlay" onclick="closeSettings()">
            <div class="settings-modal" onclick="event.stopPropagation()">
                <div class="settings-modal-header">
                    <span>${isEs ? 'Ajustes' : 'Settings'}</span>
                    <button class="settings-close-btn" onclick="closeSettings()">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                    </button>
                </div>

                <div class="settings-section">
                    <p class="settings-section-title">${isEs ? 'Tema del informe' : 'Report theme'}</p>
                    <div class="settings-option-row">
                        <button class="settings-theme-btn ${isLight ? 'selected' : ''}" onclick="setReportTheme('light')">
                            <span class="settings-theme-icon">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
                            </span>
                            <span>${isEs ? 'Claro' : 'Light'}</span>
                            ${isLight ? `<svg class="settings-check" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="20 6 9 17 4 12"/></svg>` : ''}
                        </button>
                        <button class="settings-theme-btn ${isDark ? 'selected' : ''}" onclick="setReportTheme('dark')">
                            <span class="settings-theme-icon">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
                            </span>
                            <span>${isEs ? 'Oscuro' : 'Dark'}</span>
                            ${isDark ? `<svg class="settings-check" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="20 6 9 17 4 12"/></svg>` : ''}
                        </button>
                        <button class="settings-theme-btn htb-theme-btn ${isHtb ? 'selected' : ''}" onclick="setReportTheme('htb')">
                            <span class="settings-theme-icon">
                                <svg width="20" height="20" viewBox="0 0 72 82" fill="none">
                                    <polygon points="36,3 69,21 69,57 36,75 3,57 3,21" fill="none" stroke="currentColor" stroke-width="5" stroke-linejoin="round"/>
                                    <polygon points="36,3 69,21 36,39 3,21" fill="currentColor" fill-opacity="0.3"/>
                                    <polygon points="3,21 36,39 36,75 3,57" fill="currentColor" fill-opacity="0.5"/>
                                    <polygon points="69,21 36,39 36,75 69,57" fill="currentColor" fill-opacity="0.15"/>
                                    <line x1="36" y1="39" x2="36" y2="75" stroke="currentColor" stroke-width="4"/>
                                </svg>
                            </span>
                            <span>HTB</span>
                            ${isHtb ? `<svg class="settings-check" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="20 6 9 17 4 12"/></svg>` : ''}
                        </button>
                    </div>
                </div>

                <div class="settings-divider"></div>

                <div class="settings-section">
                    <p class="settings-section-title">${isEs ? 'Idioma de la interfaz' : 'Interface language'}</p>
                    <div class="settings-option-row">
                        <button class="settings-lang-btn ${isEs ? 'selected' : ''}" onclick="setLang('es')">
                            <span class="settings-lang-flag">🇪🇸</span>
                            <span>Español</span>
                            ${isEs ? `<svg class="settings-check" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="20 6 9 17 4 12"/></svg>` : ''}
                        </button>
                        <button class="settings-lang-btn ${!isEs ? 'selected' : ''}" onclick="setLang('en')">
                            <span class="settings-lang-flag">🇬🇧</span>
                            <span>English</span>
                            ${!isEs ? `<svg class="settings-check" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="20 6 9 17 4 12"/></svg>` : ''}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function renderDemoModal() {
    if (!state.showDemoModal) return '';
    const t = UI[state.lang];
    const isEs = state.lang === 'es';

    return `
        <div class="settings-overlay" onclick="closeDemoModal()">
            <div class="settings-modal" style="max-width:520px;" onclick="event.stopPropagation()">
                <div class="settings-modal-header">
                    <span>${t.demoModalTitle}</span>
                    <button class="settings-close-btn" onclick="closeDemoModal()">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                    </button>
                </div>
                <div class="settings-modal-body" style="padding:1.5rem;">
                    <p style="color:var(--text-muted,#64748b);line-height:1.6;margin-bottom:1.25rem;">${t.demoModalDesc}</p>

                    <div style="background:rgba(245,158,11,0.08);border:1px solid rgba(245,158,11,0.3);border-radius:8px;padding:0.875rem 1rem;margin-bottom:1.25rem;display:flex;gap:0.75rem;align-items:flex-start;">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" stroke-width="2" style="flex-shrink:0;margin-top:2px;"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
                        <p style="color:#f59e0b;font-size:0.875rem;margin:0;line-height:1.5;">${t.demoModalWarning}</p>
                    </div>

                    <p style="font-weight:700;font-size:0.875rem;margin-bottom:0.75rem;">${t.demoModalWhat}</p>
                    <ul style="list-style:none;padding:0;margin:0 0 1.75rem;display:flex;flex-direction:column;gap:0.5rem;">
                        ${t.demoModalItems.map(item => `
                            <li style="display:flex;align-items:flex-start;gap:0.6rem;font-size:0.875rem;color:var(--text-muted,#64748b);">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="2.5" style="flex-shrink:0;margin-top:1px;"><polyline points="20 6 9 17 4 12"/></svg>
                                ${escapeHTML(item)}
                            </li>
                        `).join('')}
                    </ul>

                    <div style="display:flex;gap:0.75rem;justify-content:flex-end;">
                        <button class="btn-secondary" onclick="closeDemoModal()" style="min-width:90px;">${t.demoModalCancel}</button>
                        <button class="btn-primary" id="demo-generate-btn" onclick="loadDemoReport()" style="min-width:140px;">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="flex-shrink:0;">
                                <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
                                <line x1="8" y1="21" x2="16" y2="21"/>
                                <line x1="12" y1="17" x2="12" y2="21"/>
                            </svg>
                            ${t.demoModalGenerate}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function showDemoModal() {
    state.showDemoModal = true;
    renderApp();
}

function closeDemoModal() {
    state.showDemoModal = false;
    renderApp();
}

async function loadDemoReport() {
    const btn = document.getElementById('demo-generate-btn');
    const t = UI[state.lang];
    if (btn) {
        btn.disabled = true;
        btn.innerHTML = `<svg class="spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg> ${t.demoModalGenerating}`;
    }
    try {
        const result = await fetch('/api/demo/create', { method: 'POST' });
        if (!result.ok) {
            const err = await result.json().catch(() => ({}));
            throw new Error(err.detail || result.statusText);
        }
        const data = await result.json();
        state.showDemoModal = false;
        await loadReport(data.report_id);
    } catch (e) {
        alert((state.lang === 'es' ? 'Error al crear demo: ' : 'Error creating demo: ') + e.message);
        if (btn) {
            btn.disabled = false;
            btn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg> ${t.demoModalGenerate}`;
        }
    }
}

function renderApp() {
    const app = $('#app');

    app.innerHTML = `
        ${renderSplashScreen()}
        ${renderNavbar()}
        <main class="main-content">
            ${renderReportsPage()}
            ${renderEditor()}
            ${renderPreview()}
        </main>
        ${renderSettingsModal()}
        ${renderDemoModal()}
    `;
}

function enterApp() {
    state.showSplash = false;
    renderApp();
}

function openSettings() {
    state.showSettings = true;
    renderApp();
}

function closeSettings() {
    state.showSettings = false;
    renderApp();
}

function setLang(lang) {
    state.lang = lang;
    state.auditData.lang = lang;

    if (state.currentFinding.templateKey && state.currentFinding.templateKey !== 'custom') {
        applyTemplate(state.currentFinding.templateKey);
        return;
    }

    renderApp();
}

function setTab(tab) {
    state.activeTab = tab;
    renderApp();
}

// Helpers para impresión
const preloadImages = (container) => {
    const images = container.querySelectorAll('img');
    const promises = Array.from(images).map(img => new Promise((resolve) => {
        if (img.complete && img.naturalWidth > 0) {
            resolve();
        } else {
            const tempImg = new Image();
            tempImg.onload = resolve;
            tempImg.onerror = resolve;
            tempImg.src = img.src;
            setTimeout(resolve, 2000);
        }
    }));
    return Promise.all(promises);
};

const createPrintIframe = (content) => {
    const iframe = document.createElement('iframe');
    iframe.style.cssText = 'position:fixed;right:0;bottom:0;width:0;height:0;border:0;visibility:hidden;';
    document.body.appendChild(iframe);

    const isDark = state.reportTheme === 'dark';
    const isHtb  = state.reportTheme === 'htb';
    const themeAttr = isDark ? 'data-theme="dark"' : isHtb ? 'data-theme="htb"' : '';
    const doc = iframe.contentWindow.document;
    doc.open();
    doc.write(`
        <!DOCTYPE html>
        <html ${themeAttr}>
        <head>
            <title>${state.auditData.documentTitle}</title>
            <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">
            <link rel="stylesheet" href="${window.location.origin}/css/styles.css">
            <style>
                @page { margin: 10mm 20mm 25mm 20mm; size: A4; ${isDark ? 'background: #0f172a;' : isHtb ? 'background: #1a2332;' : ''} }
                *, *::before, *::after { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; color-adjust: exact !important; }
                .navbar, .no-print { display: none !important; }
                img { max-width: 100% !important; page-break-inside: avoid !important; }
                ${isDark ? `
                html, body, div, section {
                    background-color: #0f172a;
                }
                html, body, .preview-container, .cover-page, .index-page, .findings-preview {
                    background: #0f172a !important; color: #e2e8f0 !important;
                }
                @media print {
                    html, body { background: #0f172a !important; }
                    @page { background: #0f172a; }
                }
                ` : isHtb ? `
                html, body, div, section {
                    background-color: #1a2332;
                }
                html, body, .preview-container, .cover-page, .index-page, .findings-preview {
                    background: #1a2332 !important; color: #e2e8f0 !important;
                }
                @media print {
                    html, body { background: #1a2332 !important; }
                    @page { background: #1a2332; }
                }
                ` : ''}
            </style>
        </head>
        <body style="margin:0;padding:0;background:${isDark ? '#0f172a' : isHtb ? '#1a2332' : 'white'};">${content}</body>
        </html>
    `);
    doc.close();
    return iframe;
};

const waitForImagesInIframe = (doc, timeout = 3000) => new Promise((resolve) => {
    const images = doc.querySelectorAll('img');
    if (images.length === 0) { resolve(); return; }

    let loadedCount = 0;
    const total = images.length;
    const checkComplete = () => { if (++loadedCount >= total) resolve(); };

    images.forEach(img => {
        if (img.complete && img.naturalWidth > 0) {
            checkComplete();
        } else {
            img.onload = checkComplete;
            img.onerror = checkComplete;
            const src = img.src;
            img.src = '';
            img.src = src;
        }
    });

    setTimeout(resolve, timeout);
});

function setReportTheme(theme) {
    state.reportTheme = theme;
    document.documentElement.removeAttribute('data-theme');
    if (theme === 'dark') document.documentElement.setAttribute('data-theme', 'dark');
    if (theme === 'htb')  document.documentElement.setAttribute('data-theme', 'htb');
    localStorage.setItem('pentestify_theme', theme);
    renderApp();
}

async function generatePdf() {
    if (state.generatingPdf) return;
    const isEs = state.lang === 'es';

    state.generatingPdf = true;
    renderApp();

    try {
        // Auto-save silently before generating
        await saveCurrentReport(true);

        if (!state.currentReportId) {
            throw new Error(isEs ? 'No se pudo guardar el reporte' : 'Could not save the report');
        }

        const response = await fetch(`/api/reports/${state.currentReportId}/pdf?theme=${state.reportTheme}`);

        if (!response.ok) {
            let errorData;
            try { errorData = await response.json(); } catch (e) { errorData = null; }

            if (response.status === 503 && errorData?.detail?.error === 'Playwright browsers not installed') {
                const cmd = errorData.detail.command || 'playwright install chromium';
                alert(isEs
                    ? `⚠️ Playwright no está instalado.\n\nEjecuta este comando en la terminal y vuelve a intentarlo:\n\n  ${cmd}`
                    : `⚠️ Playwright is not installed.\n\nRun this command in your terminal and try again:\n\n  ${cmd}`
                );
                return;
            }

            throw new Error(errorData?.detail?.message || errorData?.detail || `Error ${response.status}`);
        }

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        const name = [state.auditData.documentTitle, state.auditData.clientCompany]
            .filter(Boolean).join(' - ').replace(/[^a-zA-Z0-9_\-. ]/g, '').trim() || `Report_${state.currentReportId}`;
        a.download = `${name}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);

    } catch (e) {
        alert((isEs ? 'Error al generar PDF: ' : 'Error generating PDF: ') + e.message);
    } finally {
        state.generatingPdf = false;
        renderApp();
    }
}

async function showReports() {
    await loadSavedReports();
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

function updateCurrentFinding(field, value) {
    state.currentFinding[field] = value;
    if (field === 'cvss') {
        const sev = calculateSeverityFromCvss(value);
        if (sev) {
            state.currentFinding.severity = sev;
            const severitySelect = document.getElementById('findingSeverity');
            if (severitySelect) {
                severitySelect.value = sev;
            }
        }
    }
}

function applyTemplate(key) {
    if (key === 'custom') return;

    const template = templates[key];
    if (!template) return;

    const t = template[state.lang] || template.es;

    const calculatedSeverity = t.cvss ? (calculateSeverityFromCvss(t.cvss) || 'info') : (state.currentFinding.severity || 'med');

    state.currentFinding = {
        ...state.currentFinding,
        templateKey: key,
        title: t.title,
        severity: calculatedSeverity,
        description: t.description,
        poc: t.poc || '',
        impact: t.impact,
        remediation: t.remediation,
        cvss: t.cvss,
        reference: t.reference,
        cwe: t.cwe || state.currentFinding.cwe || ''
    };

    renderApp();
}

function filterTemplates(query) {
    const select = document.getElementById('templateSelect');
    const filter = query.toLowerCase();

    if (!select) return;

    // Show dropdown when filtering
    select.style.display = 'block';

    // Get all options and optgroups
    const options = select.querySelectorAll('option');
    const optgroups = select.querySelectorAll('optgroup');

    // Filter options
    options.forEach(option => {
        const text = option.textContent.toLowerCase();
        const value = option.value.toLowerCase();
        if (text.includes(filter) || value.includes(filter) || filter === '') {
            option.style.display = '';
        } else {
            option.style.display = 'none';
        }
    });

    // Show/hide optgroups based on visible children
    optgroups.forEach(group => {
        const visibleOptions = group.querySelectorAll('option:not([style*="display: none"])');
        group.style.display = visibleOptions.length > 0 ? '' : 'none';
    });
}

function showTemplateDropdown() {
    const select = document.getElementById('templateSelect');
    const searchInput = document.getElementById('templateSearch');
    if (select) {
        select.style.display = 'block';
        // Reset filter when showing
        const options = select.querySelectorAll('option');
        const optgroups = select.querySelectorAll('optgroup');
        options.forEach(option => option.style.display = '');
        optgroups.forEach(group => group.style.display = '');
    }
    // Clear search input
    if (searchInput) searchInput.value = '';
}

function hideTemplateDropdown() {
    const select = document.getElementById('templateSelect');
    if (select) {
        select.style.display = 'none';
    }
}

// Hide dropdown when clicking outside
document.addEventListener('click', function(e) {
    const container = document.querySelector('.template-search-container');
    const select = document.getElementById('templateSelect');
    if (container && !container.contains(e.target) && select) {
        select.style.display = 'none';
    }
});

function handleFindingSubmit(e) {
    e.preventDefault();

    const finding = {
        id: state.editingFindingIndex !== null ? state.findings[state.editingFindingIndex].id : Date.now(),
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
        cwe: $('#findingCwe') ? $('#findingCwe').value : (state.currentFinding.cwe || ''),
        images: state.currentFinding.images
    };

    if (state.editingFindingIndex !== null) {
        // Update existing finding
        state.findings[state.editingFindingIndex] = finding;
        state.editingFindingIndex = null;
    } else {
        // Add new finding
        state.findings.push(finding);
    }

    sortFindingsBySeverity(state.findings);

    state.isDirty = true;

    if (state.currentReportId) {
        localStorage.removeItem('report_' + state.currentReportId + '_draft');
    }

    resetFindingForm();
    renderApp();
}

function resetFindingForm() {
    state.editingFindingIndex = null;
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
        cwe: '',
        images: []
    };
}

function deleteFinding(index) {
    state.findings.splice(index, 1);
    state.isDirty = true;
    renderApp();
}

function editFinding(index) {
    const finding = state.findings[index];
    if (!finding) return;

    // Load finding data into currentFinding
    state.currentFinding = {
        templateKey: finding.templateKey || 'custom',
        title: finding.title || '',
        severity: finding.severity || 'med',
        description: finding.description || '',
        cvss: finding.cvss || '',
        poc: finding.poc || '',
        impact: finding.impact || '',
        remediation: finding.remediation || '',
        reference: finding.reference || '',
        cve: finding.cve || '',
        cwe: finding.cwe || '',
        images: finding.images ? [...finding.images] : []
    };

    // Store the index we're editing
    state.editingFindingIndex = index;

    // Scroll to the form
    const form = document.getElementById('findingForm');
    if (form) {
        form.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    renderApp();
}

async function handleImageUpload(event) {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const imageFiles = Array.from(files).filter(file => file.type.startsWith('image/'));
    const dataUrls = await Promise.all(imageFiles.map(readFileAsDataURL));

    dataUrls.forEach(url => {
        if (url) state.currentFinding.images.push(url);
    });

    if (dataUrls.length > 0) renderApp();
    event.target.value = '';
}

function removeImage(index) {
    state.currentFinding.images.splice(index, 1);
    renderApp();
}

async function handleImagePaste(event) {
    event.preventDefault();
    const items = event.clipboardData?.items;
    if (!items) return;

    const imageItems = Array.from(items).filter(item => item.type.startsWith('image/'));
    const blobs = imageItems.map(item => item.getAsFile()).filter(Boolean);
    const dataUrls = await Promise.all(blobs.map(readFileAsDataURL));

    dataUrls.forEach(url => {
        if (url) state.currentFinding.images.push(url);
    });

    if (dataUrls.length > 0) {
        renderApp();
        event.stopPropagation();
    }
}

async function handleClientLogoUpload(event, index) {
    const file = event.target.files[0];
    if (!file || !file.type.startsWith('image/')) return;

    const dataUrl = await readFileAsDataURL(file);
    if (dataUrl) {
        const newLogos = [...state.auditData.clientLogo];
        newLogos[index] = dataUrl;
        updateAuditData('clientLogo', newLogos);
        renderApp();
    }
}

function removeClientLogo(index) {
    const newLogos = [...state.auditData.clientLogo];
    newLogos[index] = '';
    updateAuditData('clientLogo', newLogos);
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
            client_logo: ['', ''],
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
            clientLogo: report.client_logo && Array.isArray(report.client_logo) ? report.client_logo : ['', ''],
            targetAsset: report.target_asset,
            auditorCompany: report.auditor_company,
            auditorName: report.auditor_name,
            classification: report.classification.toString(),
            tlpLevel: report.tlp_level || 'amber',
            classificationMode: report.classification_mode || 'internal',
            version: report.version,
            date: report.date,
            lang: report.lang,
            hasIncidents: report.has_incidents === true || report.has_incidents === 'true' || report.has_incidents === 1,
            incidentsText: report.incidents_text || '',
            auditSummary: report.audit_summary || '',
            testsPerformed: report.tests_performed || '',
            recommendedSolutions: report.recommended_solutions || ''
        };
        state.lang = report.lang;
        state.findings = sortFindingsBySeverity(report.findings || []);

        const draft = localStorage.getItem('report_' + report.id + '_draft');
        if (draft) {
            try {
                state.currentFinding = JSON.parse(draft);
            } catch(e) {
                resetFindingForm();
            }
        } else {
            resetFindingForm();
        }
        
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
        if (state.currentReportId === id) {
            state.currentReportId = null;
        }
        loadSavedReports();
        renderApp();
    } catch (err) {
        alert('Error deleting report: ' + err.message);
    }
}

async function exportDatabase() {
    try {
        const response = await fetch('/api/database/export');
        if (!response.ok) throw new Error('Error al exportar');
        
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = response.headers.get('content-disposition')?.split('filename=')[1]?.replace(/"/g, '') || 'pentestify_backup.db';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
    } catch (err) {
        alert(state.lang === 'es' ? 'Error al exportar: ' + err.message : 'Error exporting: ' + err.message);
    }
}

async function importDatabase(input) {
    const file = input.files[0];
    if (!file) return;
    
    const tImpExp = state.lang === 'es' ? {
        importConfirm: '¿Estás seguro? Esto reemplazará todos los reportes actuales.',
        importSuccess: 'Base de datos importada correctamente. Recargando...',
        importError: 'Error al importar: '
    } : {
        importConfirm: 'Are you sure? This will replace all current reports.',
        importSuccess: 'Database imported successfully. Reloading...',
        importError: 'Error importing: '
    };
    
    if (!confirm(tImpExp.importConfirm)) {
        input.value = '';
        return;
    }
    
    try {
        const formData = new FormData();
        formData.append('file', file);
        
        const response = await fetch('/api/database/import', {
            method: 'POST',
            body: formData
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.detail || 'Error desconocido');
        }
        
        alert(tImpExp.importSuccess);
        window.location.reload();
    } catch (err) {
        alert(tImpExp.importError + err.message);
    }
    
    input.value = '';
}

async function saveCurrentReport(silent = false) {
    try {
        const payload = {
            document_title: state.auditData.documentTitle,
            client_company: state.auditData.clientCompany,
            client_logo: state.auditData.clientLogo || ['', ''],
            target_asset: state.auditData.targetAsset,
            auditor_company: state.auditData.auditorCompany,
            auditor_name: state.auditData.auditorName,
            classification: parseInt(state.auditData.classification) || 2,
            tlp_level: state.auditData.tlpLevel || 'amber',
            classification_mode: state.auditData.classificationMode || 'internal',
            version: state.auditData.version,
            date: state.auditData.date,
            lang: state.auditData.lang || state.lang,
            has_incidents: state.auditData.hasIncidents || false,
            incidents_text: state.auditData.incidentsText || '',
            audit_summary: state.auditData.auditSummary || '',
            tests_performed: state.auditData.testsPerformed || '',
            recommended_solutions: state.auditData.recommendedSolutions || ''
        };

        if (!state.currentReportId) {
            const report = await API.reports.create(payload);
            state.currentReportId = report.id;
        } else {
            await API.reports.update(state.currentReportId, payload);
        }
        const remoteReport = await API.reports.getById(state.currentReportId);
        const existingFindings = remoteReport.findings || [];
        const existingIds = existingFindings.map(f => f.id);
        const currentIds = state.findings.filter(f => f.id && typeof f.id !== 'string' && f.id < 1000000000000).map(f => f.id);

        for (const id of existingIds) {
            if (!currentIds.includes(id)) {
                await API.findings.delete(id);
            }
        }

        for (let i = 0; i < state.findings.length; i++) {
            const finding = state.findings[i];
            const payload = {
                template_key: finding.templateKey || finding.template_key || 'custom',
                title: finding.title,
                severity: finding.severity,
                description: finding.description || '',
                cvss: finding.cvss || '',
                poc: finding.poc || '',
                impact: finding.impact || '',
                remediation: finding.remediation || '',
                reference: finding.reference || '',
                cve: finding.cve || '',
                cwe: finding.cwe || '',
                images: finding.images || [],
                order_index: i
            };

            if (!finding.id || finding.id > 1000000000000) {
                const created = await API.findings.create(state.currentReportId, payload);
                finding.id = created.id;
            } else {
                await API.findings.update(finding.id, payload);
            }
        }

        if (state.currentReportId) {
            localStorage.setItem('report_' + state.currentReportId + '_draft', JSON.stringify(state.currentFinding));
        }

        state.isDirty = false;
        if (!silent) renderApp();
        if (!silent) alert(state.lang === 'es' ? 'Reporte guardado correctamente' : 'Report saved successfully');
    } catch (err) {
        console.error(err);
        if (!silent) alert('Error: ' + err.message);
        else throw err;
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    const params = new URLSearchParams(window.location.search);
    const printMode = params.get('print_mode');
    const reportId = params.get('report_id');

    // Restore saved theme on normal page loads (not print_mode)
    if (!printMode) {
        const savedTheme = localStorage.getItem('pentestify_theme');
        if (savedTheme && ['light', 'dark', 'htb'].includes(savedTheme)) {
            state.reportTheme = savedTheme;
            document.documentElement.removeAttribute('data-theme');
            if (savedTheme === 'dark') document.documentElement.setAttribute('data-theme', 'dark');
            if (savedTheme === 'htb')  document.documentElement.setAttribute('data-theme', 'htb');
        }
    }

    const themeParam = params.get('theme');
    if (printMode === 'true' && reportId) {
        state.showSplash = false;
        state.activeTab = 'preview';
        state.currentReportId = parseInt(reportId);
        if (themeParam === 'dark') {
            document.documentElement.setAttribute('data-theme', 'dark');
            state.reportTheme = 'dark';
        } else if (themeParam === 'htb') {
            document.documentElement.setAttribute('data-theme', 'htb');
            state.reportTheme = 'htb';
        }
        
        try {
            const remoteReport = await API.reports.getById(state.currentReportId);
            Object.keys(remoteReport).forEach(key => {
                const camelKey = key.replace(/([-_][a-z])/ig, ($1) => $1.toUpperCase().replace('-', '').replace('_', ''));
                if (state.auditData.hasOwnProperty(camelKey)) {
                    state.auditData[camelKey] = remoteReport[key];
                }
            });

            // Ensure incidents fields are properly set (handle both snake_case and direct assignment)
            if (remoteReport.has_incidents !== undefined) {
                state.auditData.hasIncidents = remoteReport.has_incidents === true || remoteReport.has_incidents === 'true' || remoteReport.has_incidents === 1;
            }
            if (remoteReport.incidents_text !== undefined) {
                state.auditData.incidentsText = remoteReport.incidents_text;
            }
            if (remoteReport.tlp_level !== undefined) {
                state.auditData.tlpLevel = remoteReport.tlp_level;
            }
            if (remoteReport.classification_mode !== undefined) {
                state.auditData.classificationMode = remoteReport.classification_mode;
            }

            state.findings = remoteReport.findings ? sortFindingsBySeverity(remoteReport.findings) : [];
        } catch (e) {
            console.error("Error cargando reporte para imprimir", e);
        }
        renderApp();
    } else {
        renderApp();
    }
});