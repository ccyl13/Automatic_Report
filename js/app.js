// Versión de la aplicación. Se muestra de forma persistente en la interfaz
// (login y navbar) y debe coincidir con la del backend (FastAPI) y el badge del README.
const APP_VERSION = '2.3.2';

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
        recommendedSolutions: '',
        // Alcance y metodología (informe profesional)
        scopeIn: '',
        scopeOut: '',
        methodologyNotes: '',
        methodologyStandards: [],
        toolsUsed: '',
        engagementStart: '',
        engagementEnd: '',
        revisionHistory: [],
        scopeFieldsVisibility: {}
    },
    findings: [],
    editingFindingIndex: null,
    currentFinding: {
        templateKey: 'custom',
        title: '',
        severity: 'med',
        description: '',
        cvss: '',
        cvssVector: '',
        poc: '',
        exploit: '',
        impact: '',
        remediation: '',
        reference: '',
        references: [],
        cve: '',
        cwe: '',
        status: 'open',
        affectedAssets: '',
        likelihood: '',
        impactRating: '',
        owasp: '',
        compliance: [],
        retestNotes: '',
        images: []
    },
    // Temas personalizados y gestor de temas
    customThemes: [],
    userFindingTemplates: [],
    showThemeManager: false,
    themeEditor: null,
    isThemeStudio: false,
    themeManagerError: '',
    themeManagerSuccess: '',
    // Calculadora CVSS
    showCvssCalc: false,
    cvssMetrics: { AV: 'N', AC: 'L', PR: 'N', UI: 'N', S: 'U', C: 'N', I: 'N', A: 'N' },
    isDirty: false,
    showSettings: false,
    generatingPdf: false,
    exportingHtml: false,
    exportMenuOpen: false,
    previewSourceView: false,
    dbPasswordModal: { open: false, reportId: null, title: '', busy: false },
    showDemoModal: false,
    showPdfModal: false,
    showRevisionModal: false,
    pdfPrintTheme: 'light',
    pdfShowSeverityBars: true,
    pdfContentWidth: 820,
    // Autenticación
    authChecked: false,
    isAuthenticated: false,
    authUsername: '',
    loginUsername: '',
    loginPassword: '',
    loginError: '',
    loginLoading: false,
    // Configuración inicial (primer arranque, sin usuarios registrados)
    needsSetup: false,
    setupUsername: '',
    setupPassword: '',
    setupError: '',
    setupLoading: false,
    showProfile: false,
    profileError: '',
    profileSuccess: '',
    // Credenciales por defecto (admin/admin): pista en el login y aviso al entrar
    showDefaultCredsHint: false,   // true mientras admin conserve la contraseña 'admin'
    usingDefaultPassword: false,   // true si el usuario logueado usa la pass por defecto
    passwordWarningDismissed: false, // el usuario cerró el modal de aviso en esta sesión
    // Página de cuenta / gestión de usuarios
    isAccountView: false,
    users: [],
    userMgmtError: '',
    userMgmtSuccess: '',
    // MCP / Agentes IA
    apiKeys: [],
    mcpNewKey: null,
    mcpKeyLabel: '',
    mcpError: '',
    mcpServerPath: '',
    mcpPythonExec: 'python3',
    mcpAvailable: null
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
        findingStatuses: { open: 'Abierto', remediated: 'Remediado', accepted_risk: 'Riesgo aceptado', false_positive: 'Falso positivo' },
        riskLevels: { '': '— Sin especificar —', high: 'Alta', med: 'Media', low: 'Baja' },
        vulnTitle: 'Título de la Vulnerabilidad',
        severity: 'Nivel de Severidad',
        description: 'Descripción de la Vulnerabilidad',
        cvss: 'Puntuación CVSS (0-10)',
        poc: 'Pasos para Reproducir (PoC)',
        exploit: 'Exploit (opcional)',
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
        export: 'Exportar',
        exportHtml: 'Exportar HTML',
        exportingHtml: 'Exportando…',
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
        pdfModalTitle: 'Configurar PDF',
        pdfModalTheme: 'Tema del documento',
        pdfModalThemeLight: 'Claro',
        pdfModalThemeDark: 'Oscuro',
        pdfModalThemeHtb: 'HTB',
        pdfModalThemeRedteam: 'Red Team',
        pdfModalSeverityBars: 'Barras de color de severidad',
        pdfModalSeverityBarsDesc: 'Incluir indicadores de color de severidad en cada hallazgo y en el resumen',
        pdfModalContentWidth: 'Ancho del contenido',
        pdfModalContentWidthDesc: 'Controla qué tan ancho o estrecho aparece el contenido de los hallazgos en el PDF',
        pdfModalContentWidthNarrow: 'Estrecho',
        pdfModalContentWidthWide: 'Ancho',
        pdfModalCancel: 'Cancelar',
        pdfModalGenerate: 'Generar PDF',
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
        exploitCode: 'Exploit',
        evidence: 'Evidencias',
        businessImpact: 'Impacto en el Negocio',
        solutionRemediation: 'Solución y Remediación',
        na: 'N/A',
        auditConclusions: 'Conclusiones y Resumen de la Auditoría',
        logoClient: 'Logo Cliente',
        logoClientAlt: 'Logo Cliente',
        cvssSummaryTitle: 'Resumen de Vulnerabilidades (CVSS)',
        noFindings: 'No hay hallazgos registrados',
        loginTitle: 'Iniciar sesión',
        loginSubtitle: 'Accede a tu generador de reportes',
        loginUser: 'Usuario',
        loginPass: 'Contraseña',
        loginBtn: 'Entrar',
        loginLoading: 'Entrando...',
        setupTitle: 'Configuración inicial',
        setupSubtitle: 'Crea la primera cuenta de administrador para empezar',
        setupBtn: 'Crear cuenta',
        setupLoading: 'Creando...',
        setupError: 'No se pudo crear la cuenta',
        sharedDataNote: 'Todos los usuarios comparten los mismos reportes, hallazgos y ajustes.',
        profile: 'Perfil',
        logout: 'Cerrar sesión',
        changePassword: 'Cambiar contraseña',
        currentPassword: 'Contraseña actual',
        newPassword: 'Nueva contraseña',
        confirmPassword: 'Confirmar nueva contraseña',
        savePassword: 'Guardar contraseña',
        passwordMismatch: 'Las contraseñas no coinciden',
        passwordChanged: 'Contraseña actualizada correctamente',
        defaultCredsHint: 'Acceso por defecto:',
        defaultCredsUserLabel: 'usuario',
        defaultCredsPassLabel: 'contraseña',
        pwWarnTitle: 'Cambia tu contraseña',
        pwWarnBody: 'Estás usando las credenciales por defecto (admin / admin). Por seguridad, te recomendamos cambiar la contraseña ahora mismo.',
        pwWarnCta: 'Cambiar contraseña',
        pwWarnDismiss: 'Ahora no',
        accountTitle: 'Cuenta y usuarios',
        accountSubtitle: 'Gestiona tu cuenta y los usuarios del sistema',
        backToApp: 'Volver a la aplicación',
        signedInAs: 'Sesión iniciada como',
        manageUsers: 'Gestión de usuarios',
        existingUsers: 'Usuarios existentes',
        createUser: 'Crear nuevo usuario',
        createUserBtn: 'Crear usuario',
        userCreated: 'Usuario creado correctamente',
        userDeleted: 'Usuario eliminado correctamente',
        deleteLabel: 'Eliminar',
        youLabel: 'tú',
        noUsers: 'No hay usuarios registrados',
        confirmDeleteUser: '¿Eliminar al usuario',
        mcpTitle: 'MCP / Agentes IA',
        mcpSubtitle: 'Permite que Claude y otros agentes de IA creen reportes directamente en Pentestify',
        mcpApiKeysTitle: 'API Keys',
        mcpApiKeysDesc: 'Genera claves de larga duración para que los agentes se autentiquen en la API de Pentestify',
        mcpNoKeys: 'No hay API keys generadas',
        mcpGenerateKey: 'Generar nueva API Key',
        mcpKeyLabelField: 'Etiqueta',
        mcpKeyLabelPlaceholder: 'p.ej. "Claude Desktop"',
        mcpGenerate: 'Generar',
        mcpGenerating: 'Generando...',
        mcpRevoke: 'Revocar',
        mcpRevokeConfirm: '¿Revocar esta API key? Los agentes que la usen dejarán de funcionar.',
        mcpNewKeyWarning: 'Copia esta clave ahora. No se volverá a mostrar.',
        mcpConfigTitle: 'Configuración para Claude Desktop',
        mcpConfigDesc: 'Pega este bloque en tu archivo claude_desktop_config.json (en la sección "mcpServers"):',
        mcpCliTitle: 'Claude Code CLI (local / stdio)',
        mcpCliDesc: 'Para usar con Claude Code CLI en local, establece estas variables antes de lanzar el servidor:',
        mcpRemoteTitle: 'Conexión remota por HTTP (servidor en un VPS)',
        mcpRemoteDesc: 'Si Pentestify corre en un servidor remoto, conéctate desde Claude Code sin ejecutar nada en local (la API key viaja en la cabecera de cada petición):',
        mcpCopy: 'Copiar',
        mcpCopied: '¡Copiado!',
        mcpCreatedAt: 'Creada',
        mcpLastUsed: 'Último uso',
        mcpNeverUsed: 'Sin usar',
        mcpError: 'Error al gestionar las API keys'
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
        findingStatuses: { open: 'Open', remediated: 'Remediated', accepted_risk: 'Accepted risk', false_positive: 'False positive' },
        riskLevels: { '': '— Not specified —', high: 'High', med: 'Medium', low: 'Low' },
        vulnTitle: 'Vulnerability Title',
        severity: 'Severity Level',
        description: 'Vulnerability Description',
        cvss: 'CVSS Score (0-10)',
        poc: 'Steps to Reproduce (PoC)',
        exploit: 'Exploit (optional)',
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
        export: 'Export',
        exportHtml: 'Export HTML',
        exportingHtml: 'Exporting…',
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
        pdfModalTitle: 'PDF Settings',
        pdfModalTheme: 'Document theme',
        pdfModalThemeLight: 'Light',
        pdfModalThemeDark: 'Dark',
        pdfModalThemeHtb: 'HTB',
        pdfModalThemeRedteam: 'Red Team',
        pdfModalSeverityBars: 'Severity color bars',
        pdfModalSeverityBarsDesc: 'Include severity color indicators on each finding and in the summary',
        pdfModalContentWidth: 'Content width',
        pdfModalContentWidthDesc: 'Controls how wide or narrow the findings content appears in the PDF',
        pdfModalContentWidthNarrow: 'Narrow',
        pdfModalContentWidthWide: 'Wide',
        pdfModalCancel: 'Cancel',
        pdfModalGenerate: 'Generate PDF',
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
        exploitCode: 'Exploit',
        evidence: 'Evidence',
        businessImpact: 'Business Impact',
        solutionRemediation: 'Solution and Remediation',
        na: 'N/A',
        auditConclusions: 'Audit Conclusions and Summary',
        logoClient: 'Client Logo',
        logoClientAlt: 'Client Logo',
        cvssSummaryTitle: 'Vulnerabilities Summary (CVSS)',
        noFindings: 'No findings registered',
        loginTitle: 'Sign in',
        loginSubtitle: 'Access your report generator',
        loginUser: 'Username',
        loginPass: 'Password',
        loginBtn: 'Sign in',
        loginLoading: 'Signing in...',
        setupTitle: 'Initial setup',
        setupSubtitle: 'Create the first administrator account to get started',
        setupBtn: 'Create account',
        setupLoading: 'Creating...',
        setupError: 'Could not create the account',
        sharedDataNote: 'All users share the same reports, findings and settings.',
        profile: 'Profile',
        logout: 'Log out',
        changePassword: 'Change password',
        currentPassword: 'Current password',
        newPassword: 'New password',
        confirmPassword: 'Confirm new password',
        savePassword: 'Save password',
        passwordMismatch: 'Passwords do not match',
        passwordChanged: 'Password updated successfully',
        defaultCredsHint: 'Default access:',
        defaultCredsUserLabel: 'username',
        defaultCredsPassLabel: 'password',
        pwWarnTitle: 'Change your password',
        pwWarnBody: 'You are using the default credentials (admin / admin). For your security, we recommend changing the password right now.',
        pwWarnCta: 'Change password',
        pwWarnDismiss: 'Not now',
        accountTitle: 'Account & users',
        accountSubtitle: 'Manage your account and system users',
        backToApp: 'Back to the app',
        signedInAs: 'Signed in as',
        manageUsers: 'User management',
        existingUsers: 'Existing users',
        createUser: 'Create new user',
        createUserBtn: 'Create user',
        userCreated: 'User created successfully',
        userDeleted: 'User deleted successfully',
        deleteLabel: 'Delete',
        youLabel: 'you',
        noUsers: 'No users registered',
        confirmDeleteUser: 'Delete user',
        mcpTitle: 'MCP / AI Agent Integration',
        mcpSubtitle: 'Let Claude and other AI agents create reports directly in Pentestify',
        mcpApiKeysTitle: 'API Keys',
        mcpApiKeysDesc: 'Generate long-lived keys for agents to authenticate against the Pentestify API',
        mcpNoKeys: 'No API keys generated yet',
        mcpGenerateKey: 'Generate new API Key',
        mcpKeyLabelField: 'Label',
        mcpKeyLabelPlaceholder: 'e.g. "Claude Desktop"',
        mcpGenerate: 'Generate',
        mcpGenerating: 'Generating...',
        mcpRevoke: 'Revoke',
        mcpRevokeConfirm: 'Revoke this API key? Agents using it will stop working.',
        mcpNewKeyWarning: 'Copy this key now. It will not be shown again.',
        mcpConfigTitle: 'Claude Desktop Configuration',
        mcpConfigDesc: 'Paste this block into your claude_desktop_config.json (under "mcpServers"):',
        mcpCliTitle: 'Claude Code CLI (local / stdio)',
        mcpCliDesc: 'To use with Claude Code CLI locally, set these environment variables before launching the server:',
        mcpRemoteTitle: 'Remote HTTP connection (server on a VPS)',
        mcpRemoteDesc: 'If Pentestify runs on a remote server, connect from Claude Code without running anything locally (the API key travels in each request header):',
        mcpCopy: 'Copy',
        mcpCopied: 'Copied!',
        mcpCreatedAt: 'Created',
        mcpLastUsed: 'Last used',
        mcpNeverUsed: 'Never used',
        mcpError: 'Error managing API keys'
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

document.addEventListener('DOMContentLoaded', loadTemplates);

const $ = (selector) => document.querySelector(selector);

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

// La severidad se interpola directamente en atributos `class` y `style`
// (severity-<x>, var(--severity-<x>)), donde escapeHTML no protege (las comillas
// escapadas no impiden romper el token del atributo). Se restringe a la lista
// blanca conocida; cualquier otro valor cae a 'info'. Neutraliza el XSS aunque
// un valor malicioso llegara a almacenarse.
const SEVERITY_KEYS = ['crit', 'high', 'med', 'low', 'info'];
const safeSeverity = (s) => (SEVERITY_KEYS.includes(s) ? s : 'info');

// =========================================================================== //
// Resaltado de sintaxis autocontenido (sin dependencias externas).
//
// Genera HTML con estilos inline en tiempo de render, de modo que el resaltado
// sobrevive a la exportación como HTML autocontenido y a la impresión a PDF
// (donde los <script> se eliminan). Se usa en los campos de cada hallazgo:
// Descripción, PoC, Impacto, Remediación (bloques ``` ```) y Exploit.
//
// Detecta automáticamente el lenguaje (html, javascript, bash, python, php,
// sql, json, css) cuando no se indica explícitamente en la valla ```lang.
// =========================================================================== //

// Paleta tipo "editor oscuro" (buen contraste, legible al imprimir).
const HL_THEME = {
    bg: '#0d1117', fg: '#e6edf3', headerBg: '#161b22', border: '#30363d',
    label: '#7d8590', comment: '#8b949e', string: '#a5d6a7', number: '#79c0ff',
    keyword: '#ff7b72', func: '#d2a8ff', builtin: '#ffa657', variable: '#ffa657',
    tag: '#7ee787', attr: '#79c0ff'
};

// Nombre legible que se muestra en la esquina del bloque de código.
const HL_LABELS = {
    bash: 'Shell', shell: 'Shell', sh: 'Shell', console: 'Shell',
    javascript: 'JavaScript', js: 'JavaScript', node: 'JavaScript',
    typescript: 'TypeScript', ts: 'TypeScript',
    python: 'Python', py: 'Python',
    html: 'HTML', xml: 'XML',
    php: 'PHP', sql: 'SQL', json: 'JSON', css: 'CSS',
    c: 'C', ruby: 'Ruby', rb: 'Ruby',
    text: 'Texto', plaintext: 'Texto', '': 'Texto'
};

// Normaliza alias del lenguaje a una clave canónica.
function _hlCanon(lang) {
    const l = String(lang || '').toLowerCase().trim();
    const map = {
        sh: 'bash', shell: 'bash', console: 'bash', zsh: 'bash', bash: 'bash',
        js: 'javascript', node: 'javascript', jsx: 'javascript', javascript: 'javascript',
        ts: 'typescript', typescript: 'typescript', tsx: 'typescript',
        py: 'python', python: 'python', python3: 'python',
        html: 'html', htm: 'html', xml: 'html',
        php: 'php', sql: 'sql', mysql: 'sql', psql: 'sql',
        json: 'json', css: 'css', scss: 'css',
        c: 'c', h: 'c', ruby: 'ruby', rb: 'ruby',
        text: 'text', plaintext: 'text', txt: 'text'
    };
    return map[l] || (l || '');
}

function _hlEscape(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;')
        .replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

// Detección heurística del lenguaje cuando no se especifica en la valla.
function detectCodeLang(code) {
    const s = String(code || '');
    const head = s.slice(0, 400);

    // Shebang explícito
    const sheb = head.match(/^#!.*\b(bash|sh|zsh|python[0-9.]*|node|php|perl|ruby)\b/);
    if (sheb) {
        const b = sheb[1];
        if (/python/.test(b)) return 'python';
        if (b === 'node') return 'javascript';
        if (b === 'php') return 'php';
        return 'bash';
    }

    if (/^\s*<\?php/.test(head) || /<\?=/.test(head)) return 'php';
    if (/^\s*<!doctype html/i.test(head) || /<\/(html|body|div|span|head|p|a|script|style|table)>/i.test(s) ||
        /<(html|head|body|div|p|span|a|img|script|link|meta|table|ul|li|h[1-6])\b/i.test(head)) return 'html';

    // JSON: empieza por { o [ y tiene pares "clave":
    const trimmed = s.trim();
    if ((trimmed.startsWith('{') || trimmed.startsWith('[')) &&
        /"[^"]*"\s*:/.test(head) && !/\bfunction\b|=>/.test(head)) return 'json';

    // Ruby (antes que Python, porque ambos usan `def`). Señales exclusivas de
    // Ruby: puts, require '...', elsif, interpolación #{...}, símbolos, o `end`
    // cerrando un bloque def/class/module/do.
    if (/\bputs\b|\bprint\s+["']|\brequire(_relative)?\s+['"]|\belsif\b|#\{[^}]*\}|\b(attr_accessor|attr_reader|attr_writer)\b/.test(s) ||
        (/^\s*end\s*$/m.test(s) && /\b(def|class|module|do)\b/.test(s)) ||
        /\.\w+\s+do\s*\|/.test(s)) return 'ruby';

    if (/\b(def|elif|import\s+\w|from\s+\w+\s+import|print\()\b/.test(s) ||
        /^\s*def\s+\w+\s*\(/m.test(s)) return 'python';

    if (/\b(function|const|let|var|=>|console\.(log|error)|document\.|window\.|require\()\b/.test(s)) return 'javascript';

    // C: #include, tipos y firma main(), o printf/malloc con ;
    if (/^\s*#\s*(include|define|ifndef|ifdef|pragma)\b/m.test(s) ||
        /\b(int|void|char|float|double|struct|unsigned|const)\s+\**\w+\s*\([^;{]*\)\s*\{/.test(s) ||
        /\b(printf|scanf|malloc|free|sizeof|fprintf|memcpy|strcpy)\s*\(/.test(s)) return 'c';

    if (/\b(SELECT|INSERT\s+INTO|UPDATE|DELETE\s+FROM|CREATE\s+TABLE|DROP\s+TABLE|ALTER\s+TABLE)\b/i.test(s)) return 'sql';

    if (/[.#][\w-]+\s*\{[^}]*:[^}]*;[^}]*\}/.test(s) || /^\s*[.#]?[\w-]+\s*\{/m.test(s) && /:\s*[^;]+;/.test(s)) return 'css';

    // Shell: comandos comunes, prompts, tuberías, redirecciones.
    if (/^\s*\$\s/m.test(s) || /^\s*#\s/m.test(s) ||
        /\b(sudo|apt(-get)?|echo|cd|ls|cat|grep|awk|sed|curl|wget|chmod|chown|mkdir|rm|cp|mv|tar|ssh|nmap|export)\b/.test(s) ||
        /(\|\||&&|\s\|\s|>>|2>&1)/.test(s)) return 'bash';

    return 'text';
}

// Motor de tokenización por reglas (regex ancladas con flag sticky "y").
function _hlTokenize(code, rules) {
    let i = 0, out = '';
    const n = code.length;
    outer: while (i < n) {
        for (const rule of rules) {
            rule.re.lastIndex = i;
            const m = rule.re.exec(code);
            if (m && m.index === i && m[0].length > 0) {
                const color = HL_THEME[rule.type];
                const txt = _hlEscape(m[0]);
                out += color ? `<span style="color:${color}">${txt}</span>` : txt;
                i += m[0].length;
                continue outer;
            }
        }
        out += _hlEscape(code[i]);
        i++;
    }
    return out;
}

// Conjuntos de reglas por lenguaje. El orden importa (más específico primero).
function _hlRules(lang) {
    const kw = (words) => new RegExp('\\b(?:' + words.join('|') + ')\\b', 'y');
    const common = {
        num: { type: 'number', re: /\b0x[0-9a-fA-F]+\b|\b\d[\d_]*(?:\.\d+)?\b/y },
        func: { type: 'func', re: /[A-Za-z_]\w*(?=\s*\()/y },
        dq: { type: 'string', re: /"(?:\\.|[^"\\])*"/y },
        sq: { type: 'string', re: /'(?:\\.|[^'\\])*'/y }
    };

    switch (lang) {
        case 'bash':
            return [
                { type: 'comment', re: /#.*/y },
                common.dq, common.sq,
                { type: 'variable', re: /\$\{[^}]*\}|\$\w+|\$[!@#?*]/y },
                { type: 'keyword', re: kw(['if', 'then', 'else', 'elif', 'fi', 'for', 'while', 'do', 'done', 'in', 'case', 'esac', 'function', 'return', 'exit', 'break', 'continue', 'local', 'export', 'source', 'set', 'unset', 'read', 'echo', 'printf', 'test', 'sudo', 'cd', 'ls', 'cat', 'grep', 'awk', 'sed', 'curl', 'wget', 'chmod', 'chown', 'mkdir', 'rm', 'cp', 'mv', 'tar', 'ssh', 'nmap', 'apt', 'apt-get', 'kill', 'ps', 'find']) },
                common.num
            ];
        case 'python':
            return [
                { type: 'comment', re: /#.*/y },
                { type: 'string', re: /[rbfRBF]?"""[\s\S]*?"""|[rbfRBF]?'''[\s\S]*?'''/y },
                { type: 'string', re: /[rbfRBF]?"(?:\\.|[^"\\])*"|[rbfRBF]?'(?:\\.|[^'\\])*'/y },
                { type: 'keyword', re: kw(['def', 'class', 'import', 'from', 'as', 'return', 'if', 'elif', 'else', 'for', 'while', 'in', 'try', 'except', 'finally', 'with', 'lambda', 'pass', 'break', 'continue', 'raise', 'yield', 'global', 'nonlocal', 'and', 'or', 'not', 'is', 'assert', 'del', 'async', 'await']) },
                { type: 'builtin', re: kw(['True', 'False', 'None', 'self', 'print', 'len', 'range', 'str', 'int', 'float', 'list', 'dict', 'set', 'tuple', 'open', 'super']) },
                common.func, common.num
            ];
        case 'javascript':
        case 'typescript':
            return [
                { type: 'comment', re: /\/\/.*|\/\*[\s\S]*?\*\//y },
                { type: 'string', re: /`(?:\\.|[^`\\])*`/y },
                common.dq, common.sq,
                { type: 'keyword', re: kw(['var', 'let', 'const', 'function', 'return', 'if', 'else', 'for', 'while', 'do', 'switch', 'case', 'default', 'break', 'continue', 'new', 'class', 'extends', 'super', 'this', 'typeof', 'instanceof', 'in', 'of', 'await', 'async', 'try', 'catch', 'finally', 'throw', 'yield', 'import', 'export', 'from', 'delete', 'void', 'interface', 'type', 'enum']) },
                { type: 'builtin', re: kw(['null', 'undefined', 'true', 'false', 'NaN', 'Infinity', 'console', 'document', 'window', 'Math', 'JSON', 'Object', 'Array', 'String', 'Number', 'Boolean', 'Promise']) },
                common.func, common.num
            ];
        case 'php':
            return [
                { type: 'comment', re: /\/\/.*|#.*|\/\*[\s\S]*?\*\//y },
                common.dq, common.sq,
                { type: 'variable', re: /\$\w+/y },
                { type: 'keyword', re: kw(['function', 'return', 'if', 'else', 'elseif', 'foreach', 'for', 'while', 'do', 'switch', 'case', 'break', 'continue', 'class', 'public', 'private', 'protected', 'static', 'new', 'echo', 'print', 'require', 'require_once', 'include', 'include_once', 'namespace', 'use', 'try', 'catch', 'finally', 'throw', 'array', 'as', 'global']) },
                { type: 'builtin', re: kw(['true', 'false', 'null', 'this', 'self']) },
                common.func, common.num
            ];
        case 'sql':
            return [
                { type: 'comment', re: /--.*|\/\*[\s\S]*?\*\//y },
                common.sq, common.dq,
                { type: 'keyword', re: /\b(?:SELECT|FROM|WHERE|INSERT|INTO|VALUES|UPDATE|SET|DELETE|JOIN|LEFT|RIGHT|INNER|OUTER|FULL|ON|GROUP|BY|ORDER|HAVING|LIMIT|OFFSET|UNION|ALL|AND|OR|NOT|NULL|IS|LIKE|IN|BETWEEN|AS|DISTINCT|COUNT|SUM|AVG|MIN|MAX|CREATE|TABLE|DROP|ALTER|ADD|PRIMARY|KEY|FOREIGN|REFERENCES|INDEX|DATABASE|TRUE|FALSE)\b/iy },
                common.num
            ];
        case 'json':
            return [
                { type: 'attr', re: /"(?:\\.|[^"\\])*"(?=\s*:)/y },
                { type: 'string', re: /"(?:\\.|[^"\\])*"/y },
                { type: 'builtin', re: /\b(?:true|false|null)\b/y },
                common.num
            ];
        case 'css':
            return [
                { type: 'comment', re: /\/\*[\s\S]*?\*\//y },
                common.dq, common.sq,
                { type: 'keyword', re: /[.#]?-?[A-Za-z_][\w-]*(?=\s*\{)/y },
                { type: 'attr', re: /[-A-Za-z]+(?=\s*:)/y },
                common.num
            ];
        case 'c':
            return [
                { type: 'comment', re: /\/\/.*|\/\*[\s\S]*?\*\//y },
                { type: 'builtin', re: /^\s*#\s*\w+.*/my },   // directivas del preprocesador (#include, #define…)
                { type: 'string', re: /"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'/y },
                { type: 'keyword', re: kw(['int', 'char', 'short', 'long', 'float', 'double', 'void', 'unsigned', 'signed', 'const', 'static', 'extern', 'struct', 'union', 'enum', 'typedef', 'sizeof', 'return', 'if', 'else', 'for', 'while', 'do', 'switch', 'case', 'default', 'break', 'continue', 'goto', 'volatile', 'register', 'inline']) },
                { type: 'builtin', re: kw(['printf', 'scanf', 'fprintf', 'sprintf', 'malloc', 'calloc', 'realloc', 'free', 'memcpy', 'memset', 'strcpy', 'strncpy', 'strlen', 'strcmp', 'fopen', 'fclose', 'fread', 'fwrite', 'NULL', 'stdin', 'stdout', 'stderr']) },
                common.func, common.num
            ];
        case 'ruby':
            return [
                { type: 'comment', re: /#.*/y },
                { type: 'string', re: /"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'/y },
                { type: 'variable', re: /@@?\w+|\$\w+/y },       // @ivar, @@cvar, $global
                { type: 'attr', re: /:[A-Za-z_]\w*[?!]?/y },      // símbolos :foo
                { type: 'keyword', re: kw(['def', 'end', 'class', 'module', 'if', 'elsif', 'else', 'unless', 'case', 'when', 'then', 'while', 'until', 'for', 'in', 'do', 'begin', 'rescue', 'ensure', 'raise', 'return', 'yield', 'break', 'next', 'redo', 'retry', 'require', 'require_relative', 'include', 'extend', 'attr_accessor', 'attr_reader', 'attr_writer', 'and', 'or', 'not', 'super']) },
                { type: 'builtin', re: kw(['nil', 'true', 'false', 'self', 'puts', 'print', 'p', 'gets', 'lambda', 'proc', 'new']) },
                common.func, common.num
            ];
        default:
            return null; // texto plano
    }
}

// Resalta HTML mediante regex sobre el texto ya escapado (los tags quedan como
// &lt;tag&gt;, sin colisión con entidades de identificadores).
function _hlHtml(code) {
    let s = _hlEscape(code);
    s = s.replace(/&lt;!--[\s\S]*?--&gt;/g, m => `<span style="color:${HL_THEME.comment}">${m}</span>`);
    s = s.replace(/(&lt;\/?)([A-Za-z][\w-]*)/g,
        (_, br, name) => `${br}<span style="color:${HL_THEME.keyword}">${name}</span>`);
    s = s.replace(/([\w-]+)(=)(&quot;[^&]*&quot;|&#39;[^&]*&#39;)/g,
        (_, a, eq, v) => `<span style="color:${HL_THEME.attr}">${a}</span>${eq}<span style="color:${HL_THEME.string}">${v}</span>`);
    return s;
}

// Devuelve solo el HTML resaltado del código (sin contenedor).
function highlightCode(code, lang) {
    const canon = _hlCanon(lang) || detectCodeLang(code);
    if (canon === 'html') return { lang: canon, html: _hlHtml(code) };
    const rules = _hlRules(canon);
    if (!rules) return { lang: canon || 'text', html: _hlEscape(code) };
    return { lang: canon, html: _hlTokenize(code, rules) };
}

// Bloque de código completo con cabecera (etiqueta de lenguaje) tipo editor.
// opts.terminal = true muestra los 3 puntos de terminal (usado en Exploit).
function renderCodeBlock(rawCode, langHint, opts) {
    opts = opts || {};
    const code = String(rawCode || '').replace(/\r\n?/g, '\n').replace(/\n$/, '');
    const { lang, html } = highlightCode(code, langHint);
    const label = HL_LABELS[lang] || (lang ? lang.toUpperCase() : 'Texto');
    const T = HL_THEME;
    const leftLabel = opts.title
        ? `<span style="font-size:0.75rem;font-weight:700;color:${T.label};">${_hlEscape(opts.title)}</span>`
        : '';
    return `<div style="background:${T.bg};border:1px solid ${T.border};border-radius:8px;overflow:hidden;max-width:100%;break-inside:avoid;margin:0.6em 0;">
        <div style="display:flex;align-items:center;justify-content:space-between;padding:0.45rem 0.9rem;background:${T.headerBg};border-bottom:1px solid ${T.border};">
            <span style="display:inline-flex;align-items:center;">${leftLabel}</span>
            <span style="font-size:0.72rem;font-weight:700;letter-spacing:0.02em;color:${T.label};text-transform:none;">${_hlEscape(label)}</span>
        </div>
        <pre style="margin:0;padding:0.85rem 1.1rem;background:${T.bg};color:${T.fg};font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,monospace;font-size:0.82rem;line-height:1.6;tab-size:4;-moz-tab-size:4;text-align:left;white-space:pre-wrap;overflow-wrap:anywhere;word-break:break-word;max-width:100%;"><code>${html}</code></pre>
    </div>`;
}

function markdownToHtml(str) {
    if (!str) return '';
    let s = String(str);

    // 1. Proteger bloques de código (``` ... ```) antes de cualquier escape.
    //    Se conserva el lenguaje de la valla (```lang, opcional) y el código SIN
    //    escapar: renderCodeBlock interpreta el lenguaje (o lo autodetecta) y
    //    escapa token a token al aplicar el resaltado.
    const codeBlocks = [];
    s = s.replace(/```(\w*)\r?\n?([\s\S]*?)```/g, (_, lang, code) => {
        codeBlocks.push({ lang: lang || '', code: code.replace(/\r?\n$/, '') });
        return `\x01CB${codeBlocks.length - 1}\x01`;
    });

    // 2. Proteger código inline (`...`)
    const inlineCodes = [];
    s = s.replace(/`([^`\n]+)`/g, (_, code) => {
        const safe = code.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
        inlineCodes.push(safe);
        return `\x01IC${inlineCodes.length - 1}\x01`;
    });

    // 3. Escapar HTML en el texto restante. Se escapan también las comillas
    // (dobles y simples): la URL de los links [texto](url) del paso 5 se
    // interpola dentro de un atributo href="…", así que un `"` sin escapar
    // permitiría cerrar el atributo e inyectar event handlers (XSS almacenado).
    s = s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
         .replace(/"/g,'&quot;').replace(/'/g,'&#39;');

    // 4. Negrita+cursiva, negrita, cursiva
    s = s.replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>');
    s = s.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    s = s.replace(/\*([^\s*][^*\n]*?[^\s*])\*/g, '<em>$1</em>');
    s = s.replace(/\*([^\s*\n])\*/g, '<em>$1</em>');

    // 5. Links [texto](url)
    s = s.replace(/\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g,
        '<a href="$2" target="_blank" style="color:inherit;text-decoration:underline;opacity:0.85;">$1</a>');

    // 6. Restaurar código inline
    s = s.replace(/\x01IC(\d+)\x01/g, (_, i) =>
        `<code style="font-family:ui-monospace,SFMono-Regular,monospace;background:rgba(128,128,128,0.15);padding:0.1em 0.4em;border-radius:3px;font-size:0.875em;word-break:break-word;">${inlineCodes[+i]}</code>`);

    // 7. Procesar línea a línea para estructura de bloque
    const lines = s.split('\n');
    const out = [];
    let inUl = false, inOl = false;
    let tableBuf = [];

    // Conserva la sangría inicial (espacios/tabs) convirtiéndola en espacios
    // duros, para que el código pegado en el PoC no se descuadre en el informe.
    const preserveIndent = (ln) => ln.replace(/^[ \t]+/, m =>
        m.replace(/\t/g, '\u00a0\u00a0\u00a0\u00a0').replace(/ /g, '\u00a0'));

    const closeUl = () => { if (inUl) { out.push('</ul>'); inUl = false; } };
    const closeOl = () => { if (inOl) { out.push('</ol>'); inOl = false; } };
    const closeAll = () => { closeUl(); closeOl(); };

    const flushTable = () => {
        if (!tableBuf.length) return;
        const rows = tableBuf;
        tableBuf = [];
        // Necesita al menos cabecera + separador + 1 fila de datos, y separador válido
        if (rows.length >= 2 && /^\|[\s|:=-]+\|$/.test(rows[1].trim())) {
            const parseRow = r => r.trim().replace(/^\||\|$/g, '').split('|').map(c => c.trim());
            const tdS = 'border:1px solid rgba(128,128,128,0.3);padding:0.38em 0.7em;text-align:left;vertical-align:top;line-height:1.5;';
            const thS = tdS + 'font-weight:700;background:rgba(128,128,128,0.1);';
            const head = `<thead><tr>${parseRow(rows[0]).map(c => `<th style="${thS}">${c}</th>`).join('')}</tr></thead>`;
            const body = rows.slice(2).map(r => `<tr>${parseRow(r).map(c => `<td style="${tdS}">${c}</td>`).join('')}</tr>`).join('');
            out.push(`<table style="border-collapse:collapse;width:100%;margin:0.5em 0;font-size:0.88em;">${head}${body ? `<tbody>${body}</tbody>` : ''}</table>`);
        } else {
            rows.forEach(r => { closeAll(); out.push(r + '<br>'); });
        }
    };

    for (const line of lines) {
        // Acumular líneas de tabla (empiezan con |)
        if (/^\s*\|/.test(line)) {
            tableBuf.push(line);
            continue;
        }
        flushTable();

        // Bloque de código
        const cbm = line.match(/^\x01CB(\d+)\x01$/);
        if (cbm) {
            closeAll();
            const _cb = codeBlocks[+cbm[1]];
            out.push(renderCodeBlock(_cb.code, _cb.lang));
            continue;
        }
        // Encabezados # ## ### ####
        const hm = line.match(/^(#{1,4}) (.+)$/);
        if (hm) {
            closeAll();
            const sizes = ['1.1em','1.0em','0.93em','0.88em'];
            out.push(`<div style="font-size:${sizes[hm[1].length-1]||'0.88em'};font-weight:${hm[1].length<=2?'800':'700'};margin:0.55em 0 0.15em;line-height:1.3;">${hm[2]}</div>`);
            continue;
        }
        // Lista no ordenada  -  *  +
        const ulm = line.match(/^[ \t]*[-*+] (.+)$/);
        if (ulm) {
            if (inOl) closeOl();
            if (!inUl) { out.push('<ul style="margin:0.15em 0;padding-left:1.4em;list-style:disc;">'); inUl = true; }
            out.push(`<li style="margin:0.1em 0;">${ulm[1]}</li>`);
            continue;
        }
        // Lista ordenada  1.  2)
        const olm = line.match(/^[ \t]*\d+[.)]\s+(.+)$/);
        if (olm) {
            if (inUl) closeUl();
            if (!inOl) { out.push('<ol style="margin:0.15em 0;padding-left:1.4em;">'); inOl = true; }
            out.push(`<li style="margin:0.1em 0;">${olm[1]}</li>`);
            continue;
        }
        // Línea vacía → separador
        if (line.trim() === '') {
            closeAll();
            out.push('<br>');
            continue;
        }
        // Texto normal
        closeAll();
        out.push(preserveIndent(line) + '<br>');
    }
    flushTable();
    closeAll();

    return out.join('').replace(/(<br>\s*)+$/, '');
}

const severityWeights = { crit: 5, high: 4, med: 3, low: 2, info: 1 };

// TLP eliminado por completo del informe: el badge de nivel TLP ya no se
// renderiza en ninguna cabecera de sección ni en la portada. Se conserva la
// función (devolviendo cadena vacía) para no tener que tocar cada llamador.
function renderTlpPageBadge() {
    return '';
}

// Normaliza un hallazgo recibido de la API (snake_case) a las claves camelCase
// que usa el estado local y el render. Conserva las claves originales.
function normalizeFinding(f) {
    if (!f) return f;
    const map = {
        cvss_vector: 'cvssVector',
        affected_assets: 'affectedAssets',
        impact_rating: 'impactRating',
        retest_notes: 'retestNotes',
        template_key: 'templateKey',
        fields_visibility: 'fieldsVisibility'
    };
    Object.entries(map).forEach(([snake, camel]) => {
        if (f[camel] === undefined && f[snake] !== undefined) f[camel] = f[snake];
    });
    if (!Array.isArray(f.references)) f.references = f.references ? [].concat(f.references) : [];
    if (!Array.isArray(f.compliance)) f.compliance = f.compliance ? [].concat(f.compliance) : [];
    if (typeof f.fieldsVisibility !== 'object' || !f.fieldsVisibility) f.fieldsVisibility = {};
    if (!f.status) f.status = 'open';
    return f;
}

function normalizeFindings(list) {
    return (list || []).map(normalizeFinding);
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

const readFileAsDataURL = (file) => new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target.result);
    reader.readAsDataURL(file);
});

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
            headers: { 'Content-Type': 'application/json' },
            credentials: 'same-origin'  // envía la cookie de sesión (mismo origen)
        };
        if (data) options.body = JSON.stringify(data);

        const response = await fetch(url, options);
        if (response.status === 401) {
            handleUnauthorized();
            throw new Error('HTTP 401');
        }
        if (!response.ok) {
            // Intentamos extraer el mensaje de error del backend (FastAPI: { detail }).
            let detail = `HTTP ${response.status}`;
            try {
                const body = await response.json();
                if (body && typeof body.detail === 'string') detail = body.detail;
            } catch (e) { /* respuesta sin cuerpo JSON */ }
            const error = new Error(detail);
            error.status = response.status;
            throw error;
        }
        return response.json();
    },

    auth: {
        login: (data) => API.request('POST', '/api/auth/login', data),
        logout: () => API.request('POST', '/api/auth/logout'),
        me: () => API.request('GET', '/api/auth/me'),
        changePassword: (data) => API.request('POST', '/api/auth/change-password', data),
        needsSetup: () => API.request('GET', '/api/auth/needs-setup'),
        setup: (data) => API.request('POST', '/api/auth/setup', data),
        defaultCredentials: () => API.request('GET', '/api/auth/default-credentials')
    },

    users: {
        list: () => API.request('GET', '/api/users'),
        create: (data) => API.request('POST', '/api/users', data),
        delete: (id) => API.request('DELETE', `/api/users/${id}`)
    },

    apiKeys: {
        list: () => API.request('GET', '/api/api-keys'),
        create: (data) => API.request('POST', '/api/api-keys', data),
        delete: (id) => API.request('DELETE', `/api/api-keys/${id}`)
    },

    mcpConfig: {
        get: () => API.request('GET', '/api/mcp-config')
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
    },

    themes: {
        list: () => API.request('GET', '/api/themes'),
        create: (data) => API.request('POST', '/api/themes', data),
        delete: (id) => API.request('DELETE', `/api/themes/${id}`)
    },

    findingTemplates: {
        list: () => API.request('GET', '/api/finding-templates'),
        create: (data) => API.request('POST', '/api/finding-templates', data),
        delete: (id) => API.request('DELETE', `/api/finding-templates/${id}`)
    },

    settings: {
        get: () => API.request('GET', '/api/settings'),
        update: (data) => API.request('PUT', '/api/settings', data)
    }
};

// Preferencias globales (idioma, tema activo, opciones de PDF) persistidas en la
// BD para que la exportación capture el 100% del estado. El guardado va con
// debounce para no machacar la API en cada pulsación de un control.
let _settingsSaveTimer = null;
function persistSettings() {
    clearTimeout(_settingsSaveTimer);
    _settingsSaveTimer = setTimeout(() => {
        API.settings.update({
            lang: state.lang,
            report_theme: state.reportTheme,
            pdf_print_theme: state.pdfPrintTheme,
            pdf_show_severity_bars: !!state.pdfShowSeverityBars,
            pdf_content_width: state.pdfContentWidth
        }).catch(() => { /* sin sesión / offline: se reintentará al próximo cambio */ });
    }, 400);
}

async function loadSettings() {
    try {
        const s = await API.settings.get();
        if (!s) return;
        if (s.lang) { state.lang = s.lang; state.auditData.lang = s.lang; }
        if (s.pdf_print_theme) state.pdfPrintTheme = s.pdf_print_theme;
        if (typeof s.pdf_show_severity_bars !== 'undefined') state.pdfShowSeverityBars = !!s.pdf_show_severity_bars;
        if (s.pdf_content_width) state.pdfContentWidth = s.pdf_content_width;
        if (s.report_theme && listAllThemes().some(t => t.slug === s.report_theme)) {
            state.reportTheme = s.report_theme;
        }
    } catch (e) { /* fallback: se mantienen los valores por defecto / localStorage */ }
}

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
                <span onclick="showReports()" title="${t.myReports}" style="display:inline-flex;align-items:center;gap:0.65rem;cursor:pointer;">
                    <img src="/assets/logo-transparent.png" alt="Pentestify" style="height: 38px; width: 38px; object-fit: contain; flex-shrink: 0;">
                    <span class="app-name">Pentestify</span>
                </span>
                <span class="app-version-badge">v${APP_VERSION}</span>
                ${state.isDirty ? '<span class="dirty-indicator">•</span>' : ''}
            </div>
            
            <div class="navbar-actions">
                <button class="${state.showReportSelector ? 'active' : ''}" onclick="showReports()">${t.myReports}</button>
                <button class="${state.activeTab === 'editor' && !state.showReportSelector ? 'active' : ''}" onclick="hideReports(); setTab('editor')">${t.editor}</button>
                <button class="${state.activeTab === 'preview' && !state.showReportSelector ? 'active' : ''}" onclick="hideReports(); setTab('preview')">${t.preview}</button>
                <div class="export-dropdown" style="position:relative;display:inline-block;">
                    <button class="btn-primary pdf-btn${(state.generatingPdf || state.exportingHtml) ? ' pdf-btn--loading' : ''}" onclick="toggleExportMenu(event)" ${(state.generatingPdf || state.exportingHtml) ? 'disabled' : ''}>
                        ${(state.generatingPdf || state.exportingHtml)
                            ? `<svg class="spin" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg> ${state.generatingPdf ? t.generatingPdf : t.exportingHtml}`
                            : `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg> ${t.export}
                               <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" style="margin-left:1px;"><polyline points="6 9 12 15 18 9"/></svg>`
                        }
                    </button>
                    ${state.exportMenuOpen ? `
                        <div class="export-menu">
                            <button onclick="chooseExport('pdf')">
                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
                                <span>${t.generatePdf}</span>
                            </button>
                            <button onclick="chooseExport('html')">
                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
                                <span>${t.exportHtml}</span>
                            </button>
                        </div>
                    ` : ''}
                </div>
                <button class="settings-btn" onclick="openSettings()" title="${state.lang === 'es' ? 'Ajustes' : 'Settings'}">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
                </button>
                <button class="settings-btn" onclick="openProfile()" title="${UI[state.lang].profile}">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
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
        <div class="editor-page">
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
                            <div style="display:flex;gap:0.5rem;align-items:center;">
                                <input type="text" id="findingCvss" style="flex:1;" value="${escapeHTML(state.currentFinding.cvss)}" oninput="updateCurrentFinding('cvss', this.value)">
                                <button type="button" class="btn-secondary btn-sm" onclick="openCvssCalc()" title="${state.lang === 'es' ? 'Calculadora CVSS 3.1' : 'CVSS 3.1 calculator'}" style="white-space:nowrap;">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:-2px;"><rect x="4" y="2" width="16" height="20" rx="2"/><line x1="8" y1="6" x2="16" y2="6"/><line x1="8" y1="10" x2="8" y2="10"/><line x1="12" y1="10" x2="12" y2="10"/><line x1="16" y1="10" x2="16" y2="10"/><line x1="8" y1="14" x2="8" y2="14"/><line x1="12" y1="14" x2="12" y2="14"/><line x1="8" y1="18" x2="16" y2="18"/></svg>
                                    ${state.lang === 'es' ? 'Calcular' : 'Calculate'}
                                </button>
                            </div>
                            ${state.currentFinding.cvssVector ? `<small class="text-muted" style="font-family:ui-monospace,monospace;display:block;margin-top:0.35rem;word-break:break-all;">${escapeHTML(state.currentFinding.cvssVector)}</small>` : ''}
                        </div>

                        <div class="form-group">
                            <label>${t.poc}</label>
                            <textarea id="findingPoc" rows="4" oninput="updateCurrentFinding('poc', this.value)">${escapeHTML(state.currentFinding.poc)}</textarea>
                        </div>

                        <div class="form-group">
                            <label>${t.exploit}</label>
                            <textarea id="findingExploit" class="code-input" rows="6" spellcheck="false" placeholder="${state.lang === 'es' ? 'Pega aquí el código del exploit (se imprimirá como bloque de código en el informe)' : 'Paste the exploit code here (it will be printed as a code block in the report)'}" oninput="updateCurrentFinding('exploit', this.value)">${escapeHTML(state.currentFinding.exploit || '')}</textarea>
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
                        ${state.currentFinding.images.length > 1 ? `<small class="text-muted image-reorder-hint">${state.lang === 'es' ? 'Arrastra las imágenes para cambiar su orden en el informe' : 'Drag the images to change their order in the report'}</small>` : ''}
                        <div class="image-preview-container">
                            ${state.currentFinding.images.map((img, idx) => `
                                <div class="image-preview-item" draggable="true" data-img-idx="${idx}"
                                    ondragstart="imageDragStart(event, ${idx})"
                                    ondragover="imageDragOver(event, ${idx})"
                                    ondragleave="imageDragLeave(event)"
                                    ondrop="imageDrop(event, ${idx})"
                                    ondragend="imageDragEnd(event)"
                                    title="${state.lang === 'es' ? 'Arrastra para reordenar' : 'Drag to reorder'}">
                                    <span class="image-order-badge">${idx + 1}</span>
                                    <img src="${escapeHTML(img)}" alt="Evidencia ${idx + 1}" draggable="false">
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
                            <label>${t.reference} ${state.lang === 'es' ? '(principal)' : '(primary)'}</label>
                            <input type="text" id="findingReference" value="${escapeHTML(state.currentFinding.reference)}" oninput="updateCurrentFinding('reference', this.value)">
                        </div>

                        <div class="form-group">
                            <label>${state.lang === 'es' ? 'Referencias adicionales (una por línea)' : 'Additional references (one per line)'}</label>
                            <textarea id="findingReferences" rows="2" placeholder="https://owasp.org/...\nhttps://cwe.mitre.org/..." oninput="updateCurrentFindingList('references', this.value)">${escapeHTML((state.currentFinding.references || []).join('\n'))}</textarea>
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
            </div>
        </div>
        <div class="findings-section">
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
                            <img src="${escapeHTML(d.clientLogo[0])}" alt="Logo 1" style="height: 40px; border-radius: 4px; border: 1px solid #e5e7eb;">
                            <button type="button" class="btn-sm btn-secondary" onclick="removeClientLogo(0)">×</button>
                        </div>
                    ` : ''}
                </div>
                <div class="form-group" style="flex: 1;">
                    <label>${t.clientLogo2 || 'Logotipo 2'}</label>
                    <input type="file" accept="image/*" onchange="handleClientLogoUpload(event, 1)">
                    ${d.clientLogo[1] ? `
                        <div style="margin-top: 0.5rem; display: flex; align-items: center; gap: 0.5rem;">
                            <img src="${escapeHTML(d.clientLogo[1])}" alt="Logo 2" style="height: 40px; border-radius: 4px; border: 1px solid #e5e7eb;">
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

            ${renderScopeMethodologySection()}
            ${renderRevisionHistorySection()}
        </div>
    `;
}

const METHODOLOGY_STANDARDS = [
    { key: 'owasp_wstg', label: 'OWASP WSTG' },
    { key: 'owasp_top10', label: 'OWASP Top 10' },
    { key: 'ptes', label: 'PTES' },
    { key: 'nist_800_115', label: 'NIST SP 800-115' },
    { key: 'osstmm', label: 'OSSTMM' },
    { key: 'mitre_attack', label: 'MITRE ATT&CK' },
    { key: 'owasp_masvs', label: 'OWASP MASVS' },
    { key: 'iso_27001', label: 'ISO 27001' }
];

function toggleMethodologyStandard(key) {
    const arr = state.auditData.methodologyStandards || [];
    const i = arr.indexOf(key);
    if (i >= 0) arr.splice(i, 1); else arr.push(key);
    state.auditData.methodologyStandards = arr;
    state.isDirty = true;
    renderApp();
}

function getScopeFieldVis(key) {
    const vis = state.auditData.scopeFieldsVisibility || {};
    return !!vis[key];
}

function _scopeFieldToggle(key, isEs) {
    const on = getScopeFieldVis(key);
    return `<span onclick="toggleScopeField('${key}')" title="${isEs ? 'Incluir en informe' : 'Include in report'}"
        style="display:inline-flex;align-items:center;gap:0.3rem;cursor:pointer;font-size:0.75rem;font-weight:500;color:${on ? '#2563eb' : '#9ca3af'};user-select:none;flex-shrink:0;">
        <span style="position:relative;display:inline-block;width:28px;height:16px;">
            <span style="display:block;width:28px;height:16px;border-radius:999px;background:${on ? '#2563eb' : '#d1d5db'};transition:background 0.15s;"></span>
            <span style="position:absolute;top:2px;left:${on ? '14px' : '2px'};width:12px;height:12px;border-radius:50%;background:#fff;box-shadow:0 1px 2px rgba(0,0,0,0.2);transition:left 0.15s;"></span>
        </span>
        ${isEs ? 'en informe' : 'in report'}
    </span>`;
}

function toggleScopeField(key) {
    const vis = Object.assign({}, state.auditData.scopeFieldsVisibility || {});
    vis[key] = !getScopeFieldVis(key);
    state.auditData.scopeFieldsVisibility = vis;
    state.isDirty = true;
    renderApp();
}

// --- Visibilidad opt-in de campos OPCIONALES del hallazgo (por defecto ocultos) ---
// A diferencia del alcance (que por defecto se muestra), estos metadatos accesorios
// SOLO aparecen en el informe si su toggle está activado explícitamente.
function getFindingFieldVis(f, key) {
    return !!(f && f.fieldsVisibility && f.fieldsVisibility[key]);
}

function toggleCurrentFindingField(key) {
    const f = state.currentFinding;
    const vis = Object.assign({}, f.fieldsVisibility || {});
    vis[key] = !vis[key];
    f.fieldsVisibility = vis;
    state.isDirty = true;
    renderApp();
}

function _findingFieldToggle(key, isEs) {
    const on = getFindingFieldVis(state.currentFinding, key);
    return `<span onclick="toggleCurrentFindingField('${key}')" title="${isEs ? 'Incluir este campo en el informe' : 'Include this field in the report'}"
        style="display:inline-flex;align-items:center;gap:0.3rem;cursor:pointer;font-size:0.72rem;font-weight:500;color:${on ? '#2563eb' : '#9ca3af'};user-select:none;flex-shrink:0;">
        <span style="position:relative;display:inline-block;width:28px;height:16px;">
            <span style="display:block;width:28px;height:16px;border-radius:999px;background:${on ? '#2563eb' : '#d1d5db'};transition:background 0.15s;"></span>
            <span style="position:absolute;top:2px;left:${on ? '14px' : '2px'};width:12px;height:12px;border-radius:50%;background:#fff;box-shadow:0 1px 2px rgba(0,0,0,0.2);transition:left 0.15s;"></span>
        </span>
        ${isEs ? 'en informe' : 'in report'}
    </span>`;
}

function renderScopeMethodologySection() {
    const isEs = state.lang === 'es';
    const d = state.auditData;
    const selected = d.methodologyStandards || [];
    return `
        <hr style="margin: 1.5rem 0; border: none; border-top: 1px solid #e5e7eb;">
        <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:1rem;">
            <h3 style="margin:0;">${isEs ? 'Alcance y Metodología' : 'Scope & Methodology'}</h3>
        </div>

        <div class="form-row">
            <div class="form-group">
                <label>${isEs ? 'Inicio del engagement' : 'Engagement start'}</label>
                <input type="date" value="${escapeHTML(d.engagementStart || '')}" onchange="updateAuditData('engagementStart', this.value)">
            </div>
            <div class="form-group">
                <label>${isEs ? 'Fin del engagement' : 'Engagement end'}</label>
                <input type="date" value="${escapeHTML(d.engagementEnd || '')}" onchange="updateAuditData('engagementEnd', this.value)">
            </div>
        </div>

        <div class="form-group">
            <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:0.35rem;">
                <label style="margin:0;">${isEs ? 'Dentro del alcance (in-scope)' : 'In-scope assets'}</label>
                ${_scopeFieldToggle('scopeIn', isEs)}
            </div>
            <textarea rows="2" placeholder="${isEs ? 'IPs, dominios, URLs incluidos...' : 'Included IPs, domains, URLs...'}" oninput="updateAuditData('scopeIn', this.value)" style="${!getScopeFieldVis('scopeIn') ? 'opacity:0.4;' : ''}">${escapeHTML(d.scopeIn || '')}</textarea>
        </div>
        <div class="form-group">
            <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:0.35rem;">
                <label style="margin:0;">${isEs ? 'Fuera del alcance / exclusiones' : 'Out-of-scope / exclusions'}</label>
                ${_scopeFieldToggle('scopeOut', isEs)}
            </div>
            <textarea rows="2" placeholder="${isEs ? 'Sistemas excluidos, rangos no probados...' : 'Excluded systems, untested ranges...'}" oninput="updateAuditData('scopeOut', this.value)" style="${!getScopeFieldVis('scopeOut') ? 'opacity:0.4;' : ''}">${escapeHTML(d.scopeOut || '')}</textarea>
        </div>

        <div class="form-group">
            <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:0.35rem;">
                <label style="margin:0;">${isEs ? 'Metodologías / estándares aplicados' : 'Methodologies / standards applied'}</label>
                ${_scopeFieldToggle('standards', isEs)}
            </div>
            <div class="pro-tags" style="margin-top:0.25rem;${!getScopeFieldVis('standards') ? 'opacity:0.4;' : ''}">
                ${METHODOLOGY_STANDARDS.map(s => `
                    <label style="display:inline-flex;align-items:center;gap:0.35rem;font-weight:500;text-transform:none;letter-spacing:normal;cursor:pointer;padding:0.2rem 0.55rem;border:1px solid ${selected.includes(s.key) ? '#3b82f6' : '#e2e8f0'};border-radius:999px;font-size:0.78rem;${selected.includes(s.key) ? 'background:rgba(59,130,246,0.1);color:#2563eb;' : ''}">
                        <input type="checkbox" ${selected.includes(s.key) ? 'checked' : ''} onchange="toggleMethodologyStandard('${s.key}')" style="width:auto;margin:0;padding:0;">
                        ${s.label}
                    </label>
                `).join('')}
            </div>
        </div>

        <div class="form-group">
            <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:0.35rem;">
                <label style="margin:0;">${isEs ? 'Notas de metodología (opcional)' : 'Methodology notes (optional)'}</label>
                ${_scopeFieldToggle('methodologyNotes', isEs)}
            </div>
            <textarea rows="2" placeholder="${isEs ? 'Tipo de caja, reglas de enfrentamiento...' : 'Box type, rules of engagement...'}" oninput="updateAuditData('methodologyNotes', this.value)" style="${!getScopeFieldVis('methodologyNotes') ? 'opacity:0.4;' : ''}">${escapeHTML(d.methodologyNotes || '')}</textarea>
        </div>
        <div class="form-group">
            <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:0.35rem;">
                <label style="margin:0;">${isEs ? 'Herramientas utilizadas' : 'Tools used'}</label>
                ${_scopeFieldToggle('toolsUsed', isEs)}
            </div>
            <textarea rows="4" placeholder="Burp Suite, nmap, sqlmap, ffuf..." oninput="updateAuditData('toolsUsed', this.value)" style="${!getScopeFieldVis('toolsUsed') ? 'opacity:0.4;' : ''}">${escapeHTML(d.toolsUsed || '')}</textarea>
        </div>
    `;
}

function addRevisionRow() {
    if (!Array.isArray(state.auditData.revisionHistory)) state.auditData.revisionHistory = [];
    state.auditData.revisionHistory.push({
        version: state.auditData.version || '1.0',
        date: state.auditData.date || new Date().toISOString().split('T')[0],
        author: state.auditData.auditorName || '',
        changes: ''
    });
    state.isDirty = true;
    renderApp();
}

function updateRevisionRow(idx, field, value) {
    if (state.auditData.revisionHistory[idx]) {
        state.auditData.revisionHistory[idx][field] = value;
        state.isDirty = true;
    }
}

function removeRevisionRow(idx) {
    state.auditData.revisionHistory.splice(idx, 1);
    state.isDirty = true;
    renderApp();
}

function openRevisionModal() {
    state.showRevisionModal = true;
    renderApp();
}

function closeRevisionModal() {
    state.showRevisionModal = false;
    renderApp();
}

// Sección contraída: sólo un resumen y un botón que abre el modal de gestión.
function renderRevisionHistorySection() {
    const isEs = state.lang === 'es';
    const rows = state.auditData.revisionHistory || [];
    const count = rows.length;
    const summary = count
        ? rows.map(r => escapeHTML(r.version || '?')).join(' · ')
        : (isEs ? 'Sin revisiones registradas.' : 'No revisions recorded.');
    return `
        <hr style="margin: 1.5rem 0; border: none; border-top: 1px solid #e5e7eb;">
        <div style="display:flex;justify-content:space-between;align-items:center;gap:0.75rem;">
            <div style="display:flex;align-items:center;gap:0.5rem;">
                <h3 style="margin:0;">${isEs ? 'Historial de revisiones' : 'Revision history'}</h3>
                ${count ? `<span class="findings-count">${count}</span>` : ''}
            </div>
            <button type="button" class="btn-sm btn-secondary" onclick="openRevisionModal()">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:-2px;margin-right:0.3rem;">
                    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                </svg>${count ? (isEs ? 'Gestionar' : 'Manage') : (isEs ? 'Añadir' : 'Add')}
            </button>
        </div>
        <p class="text-muted" style="font-size:0.82rem;margin:0.55rem 0 0;">${summary}</p>
    `;
}

function renderRevisionRowsEditor() {
    const isEs = state.lang === 'es';
    const rows = state.auditData.revisionHistory || [];
    if (rows.length === 0) {
        return `<p class="text-muted" style="font-size:0.9rem;text-align:center;padding:1.5rem 0;">${isEs ? 'Sin revisiones registradas. Añade la primera con el botón de abajo.' : 'No revisions recorded. Add the first one with the button below.'}</p>`;
    }
    return `<div class="revision-list">${rows.map((r, idx) => `
        <div class="revision-card">
            <button type="button" class="revision-remove" onclick="removeRevisionRow(${idx})" title="${isEs ? 'Eliminar' : 'Delete'}">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
            <div class="revision-grid">
                <div class="form-group">
                    <label>${isEs ? 'Versión' : 'Version'}</label>
                    <input type="text" value="${escapeHTML(r.version || '')}" oninput="updateRevisionRow(${idx},'version',this.value)">
                </div>
                <div class="form-group">
                    <label>${isEs ? 'Fecha' : 'Date'}</label>
                    <input type="date" value="${escapeHTML(r.date || '')}" oninput="updateRevisionRow(${idx},'date',this.value)">
                </div>
                <div class="form-group">
                    <label>${isEs ? 'Autor' : 'Author'}</label>
                    <input type="text" value="${escapeHTML(r.author || '')}" oninput="updateRevisionRow(${idx},'author',this.value)">
                </div>
                <div class="form-group revision-changes">
                    <label>${isEs ? 'Cambios' : 'Changes'}</label>
                    <input type="text" value="${escapeHTML(r.changes || '')}" oninput="updateRevisionRow(${idx},'changes',this.value)">
                </div>
            </div>
        </div>
    `).join('')}</div>`;
}

function renderRevisionModal() {
    if (!state.showRevisionModal) return '';
    const isEs = state.lang === 'es';
    return `
        <div class="settings-overlay" style="align-items:center;justify-content:center;padding:1rem;" onclick="closeRevisionModal()">
            <div class="settings-modal" style="width:100%;max-width:760px;display:flex;flex-direction:column;max-height:90vh;" onclick="event.stopPropagation()">
                <div class="settings-modal-header">
                    <span>${isEs ? 'Historial de revisiones' : 'Revision history'}</span>
                    <button class="settings-close-btn" onclick="closeRevisionModal()">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                    </button>
                </div>
                <div style="padding:1.25rem;overflow-y:auto;">
                    ${renderRevisionRowsEditor()}
                    <button type="button" class="btn-sm btn-secondary" onclick="addRevisionRow()" style="margin-top:0.5rem;">+ ${isEs ? 'Añadir revisión' : 'Add revision'}</button>
                </div>
                <div style="display:flex;gap:0.5rem;justify-content:flex-end;padding:1rem 1.25rem;border-top:1px solid #f1f5f9;">
                    <button class="btn-primary" onclick="closeRevisionModal()">${isEs ? 'Hecho' : 'Done'}</button>
                </div>
            </div>
        </div>`;
}

function renderFindingsList() {
    const t = UI[state.lang];
    const isEs = state.lang === 'es';
    const title = isEs ? 'Findings / Vulnerabilidades' : 'Findings / Vulnerabilities';

    const header = `
        <div class="findings-section-header">
            <h3 class="findings-section-title">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                    <path d="M9.5 12l1.8 1.8 3.5-3.6"/>
                </svg>
                ${title}
            </h3>
            <span class="findings-count">${state.findings.length}</span>
        </div>`;

    if (state.findings.length === 0) {
        return `
            <div class="card findings-card">
                ${header}
                <p class="text-muted findings-empty">${t.noFindings}</p>
            </div>`;
    }

    return `
        <div class="card findings-card">
            ${header}
            <div class="findings-grid">
                ${state.findings.map((f, idx) => `
                    <div class="finding-item severity-${safeSeverity(f.severity)}">
                        <div class="finding-header">
                            <span class="finding-number">#${idx + 1}</span>
                            <span class="finding-severity">${t.severityLevels[safeSeverity(f.severity)]}</span>
                            <div class="finding-actions">
                                <button class="btn-edit" onclick="editFinding(${idx})" title="${isEs ? 'Editar' : 'Edit'}">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                                    </svg>
                                </button>
                                <button class="btn-delete" onclick="deleteFinding(${idx})" title="${isEs ? 'Eliminar' : 'Delete'}">×</button>
                            </div>
                        </div>
                        <span class="finding-title">${escapeHTML(f.title)}</span>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

// --------------------------------------------------------------------------- //
// Sistema de temas del informe basado en variables CSS (--rt-*).
//
// Cada tema es una paleta de ~40 variables. Los 3 temas de fábrica (light, dark,
// htb) se definen aquí y se emiten como bloques CSS [data-rt-theme="x"]. Los temas
// personalizados del usuario viven en la base de datos (mismas claves) y se
// inyectan igual. El render del informe NO usa colores calculados en JS: usa
// var(--rt-*), de modo que el estilo del informe se controla 100% desde CSS.
// --------------------------------------------------------------------------- //
const THEME_KEYS = [
    'pageBg', 'cardBg', 'cardBgAlt', 'greenBg', 'orangeBg', 'purpleBg', 'metaBg',
    'textPrimary', 'textHeading', 'textBody', 'textMuted', 'textFaint', 'textSubtle',
    'textGray', 'textGrayMed', 'coverAccent', 'accentLine', 'accentBar', 'versionColor',
    'textRed', 'textOrange', 'textOrangeDark', 'textGreen', 'textGreenDark',
    'border', 'borderLight', 'borderMeta', 'borderMetaSub', 'borderGreen', 'borderOrange',
    'borderPurple', 'borderFaint', 'classifBg', 'classifBorder', 'classifText',
    'pocBg', 'pocBorder', 'pocText', 'pocHeading'
];

const BUILTIN_THEMES = {
    light: {
        pageBg: '#ffffff', cardBg: '#f9fafb', cardBgAlt: '#f8fafc', greenBg: '#f0fdf4',
        orangeBg: '#fff7ed', purpleBg: '#faf5ff', metaBg: 'linear-gradient(135deg,#f8fafc 0%,#f1f5f9 100%)',
        textPrimary: '#0f172a', textHeading: '#111827', textBody: '#1f2937', textMuted: '#374151',
        textFaint: '#4b5563', textSubtle: '#475569', textGray: '#6b7280', textGrayMed: '#64748b',
        coverAccent: '#475569', accentLine: '#2563eb', accentBar: 'linear-gradient(90deg,#2563eb,#6366f1)',
        versionColor: '#2563eb', textRed: '#dc2626', textOrange: '#c2410c', textOrangeDark: '#9a3412',
        textGreen: '#166534', textGreenDark: '#15803d', border: '#e5e7eb', borderLight: '#d1d5db',
        borderMeta: '#e2e8f0', borderMetaSub: '#cbd5e1', borderGreen: '#bbf7d0', borderOrange: '#fed7aa',
        borderPurple: '#e9d5ff', borderFaint: '#f3f4f6', classifBg: '#f1f5f9', classifBorder: '#cbd5e1',
        classifText: '#475569', pocBg: '#1e293b', pocBorder: '#334155', pocText: '#e2e8f0', pocHeading: '#93c5fd'
    },
    dark: {
        pageBg: '#0f172a', cardBg: '#1e293b', cardBgAlt: '#1e293b', greenBg: '#052e16',
        orangeBg: '#431407', purpleBg: '#2e1065', metaBg: 'linear-gradient(135deg,#1e293b 0%,#0f172a 100%)',
        textPrimary: '#f8fafc', textHeading: '#f1f5f9', textBody: '#e2e8f0', textMuted: '#cbd5e1',
        textFaint: '#94a3b8', textSubtle: '#94a3b8', textGray: '#94a3b8', textGrayMed: '#94a3b8',
        coverAccent: '#94a3b8', accentLine: '#2563eb', accentBar: 'linear-gradient(90deg,#2563eb,#6366f1)',
        versionColor: '#9fef00', textRed: '#f87171', textOrange: '#fb923c', textOrangeDark: '#fdba74',
        textGreen: '#86efac', textGreenDark: '#86efac', border: '#334155', borderLight: '#334155',
        borderMeta: '#334155', borderMetaSub: '#475569', borderGreen: '#166534', borderOrange: '#9a3412',
        borderPurple: '#6b21a8', borderFaint: '#334155', classifBg: '#1e293b', classifBorder: '#475569',
        classifText: '#94a3b8', pocBg: '#060a0f', pocBorder: '#1e293b', pocText: '#e2e8f0', pocHeading: '#93c5fd'
    },
    htb: {
        pageBg: '#1a2332', cardBg: '#0d1117', cardBgAlt: '#0d1117', greenBg: '#0a1f0d',
        orangeBg: '#1f1005', purpleBg: '#140d1f', metaBg: '#0d1117',
        textPrimary: '#ffffff', textHeading: '#9fef00', textBody: '#e2e8f0', textMuted: '#cbd5e1',
        textFaint: '#a0aec0', textSubtle: '#a0aec0', textGray: '#64748b', textGrayMed: '#9fef00',
        coverAccent: '#9fef00', accentLine: '#9fef00', accentBar: '#9fef00',
        versionColor: '#9fef00', textRed: '#ff6b6b', textOrange: '#fb923c', textOrangeDark: '#fcd34d',
        textGreen: '#9fef00', textGreenDark: '#d9f99d', border: '#2d3f55', borderLight: '#2d3f55',
        borderMeta: '#2d3f55', borderMetaSub: '#2d3f55', borderGreen: '#9fef00', borderOrange: '#c2410c',
        borderPurple: '#a78bfa', borderFaint: '#2d3f55', classifBg: '#0d1117', classifBorder: '#9fef00',
        classifText: '#9fef00', pocBg: '#060b10', pocBorder: '#1a2332', pocText: '#e2e8f0', pocHeading: '#9fef00'
    },
    redteam: {
        pageBg: '#0c0a0b', cardBg: '#141011', cardBgAlt: '#141011', greenBg: '#0a1f0d',
        orangeBg: '#231304', purpleBg: '#1a0d16', metaBg: 'linear-gradient(135deg,#15100f 0%,#0c0a0b 100%)',
        textPrimary: '#fafafa', textHeading: '#f87171', textBody: '#e6e1e1', textMuted: '#c4babb',
        textFaint: '#9e9293', textSubtle: '#9e9293', textGray: '#7d7173', textGrayMed: '#f87171',
        coverAccent: '#d4a0a3', accentLine: '#ef4444', accentBar: 'linear-gradient(90deg,#f43f5e,#b91c1c)',
        versionColor: '#fb7185', textRed: '#fca5a5', textOrange: '#fb923c', textOrangeDark: '#fdba74',
        textGreen: '#86efac', textGreenDark: '#86efac', border: '#271b1d', borderLight: '#271b1d',
        borderMeta: '#271b1d', borderMetaSub: '#3a282b', borderGreen: '#166534', borderOrange: '#9a3412',
        borderPurple: '#6b21a8', borderFaint: '#1e1517', classifBg: '#141011', classifBorder: '#7f1d1d',
        classifText: '#fca5a5', pocBg: '#080607', pocBorder: '#271b1d', pocText: '#e6e1e1', pocHeading: '#fb7185'
    }
};

const BUILTIN_THEME_META = [
    { slug: 'light',   name: 'Claro',    nameEn: 'Light' },
    { slug: 'dark',    name: 'Oscuro',   nameEn: 'Dark' },
    { slug: 'htb',     name: 'HTB',      nameEn: 'HTB' },
    { slug: 'redteam', name: 'Red Team', nameEn: 'Red Team' }
];

// Mapa estático key -> var(--rt-key). El informe sólo usa estas referencias CSS,
// así que el tema activo se decide por el atributo data-rt-theme del contenedor.
const RT_VAR_MAP = (() => {
    const m = {};
    THEME_KEYS.forEach(k => { m[k] = `var(--rt-${k})`; });
    return m;
})();

function cssVarName(key) { return '--rt-' + key; }

// Devuelve el mapa de referencias var() (idéntico para cualquier tema: lo que
// cambia son los valores resueltos por CSS según data-rt-theme).
function getThemeColors() { return RT_VAR_MAP; }
function getThemeColorsFor() { return RT_VAR_MAP; }

// Devuelve la paleta completa (valores reales) de un tema concreto, fusionando
// la base con las variables del tema personalizado si lo hubiera.
function resolveThemePalette(slug) {
    if (BUILTIN_THEMES[slug]) return { ...BUILTIN_THEMES[slug] };
    const custom = (state.customThemes || []).find(t => t.slug === slug);
    if (custom) {
        const base = BUILTIN_THEMES[custom.base] || BUILTIN_THEMES.light;
        const merged = { ...base };
        Object.entries(custom.vars || {}).forEach(([k, v]) => {
            const key = k.startsWith('--rt-') ? k.slice(5) : k;
            if (THEME_KEYS.includes(key)) merged[key] = v;
        });
        return merged;
    }
    return { ...BUILTIN_THEMES.light };
}

// Tema base (light/dark/htb) del que hereda un slug, para decidir el aspecto de
// la propia interfaz (data-theme) cuando se usa un tema personalizado.
function themeBaseOf(slug) {
    if (BUILTIN_THEMES[slug]) return slug;
    const custom = (state.customThemes || []).find(t => t.slug === slug);
    return (custom && BUILTIN_THEMES[custom.base]) ? custom.base : 'light';
}

function listAllThemes() {
    const builtins = BUILTIN_THEME_META.map(m => ({
        slug: m.slug,
        name: state.lang === 'es' ? m.name : m.nameEn,
        base: m.slug,
        builtin: true
    }));
    const customs = (state.customThemes || []).map(t => ({
        id: t.id, slug: t.slug, name: t.name, base: t.base, vars: t.vars, custom_css: t.custom_css || '', builtin: false
    }));
    return [...builtins, ...customs];
}

// Construye/actualiza el <style> con un bloque [data-rt-theme="x"] por tema.
function injectThemeStyles() {
    let css = '';
    const emit = (slug, palette) => {
        const decls = THEME_KEYS.map(k => `${cssVarName(k)}:${palette[k] || ''}`).join(';');
        css += `[data-rt-theme="${slug}"]{${decls}}\n`;
    };
    Object.keys(BUILTIN_THEMES).forEach(slug => emit(slug, BUILTIN_THEMES[slug]));
    (state.customThemes || []).forEach(t => {
        emit(t.slug, resolveThemePalette(t.slug));
        // CSS libre del usuario (control total): se acota a ESTE tema mediante
        // anidamiento CSS, de modo que sus reglas solo afectan a su informe.
        if (t.custom_css) css += `\n[data-rt-theme="${t.slug}"]{\n${t.custom_css}\n}\n`;
    });

    let styleEl = document.getElementById('rt-theme-styles');
    if (!styleEl) {
        styleEl = document.createElement('style');
        styleEl.id = 'rt-theme-styles';
        document.head.appendChild(styleEl);
    }
    styleEl.textContent = css;
}

async function loadCustomThemes() {
    try {
        const themes = await API.themes.list();
        state.customThemes = Array.isArray(themes) ? themes : [];
    } catch (e) {
        state.customThemes = [];
    }
    injectThemeStyles();
}

function slugify(str) {
    return (str || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
        .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 40);
}

function uniqueThemeSlug(name) {
    let base = 'c-' + (slugify(name) || 'tema');
    base = base.slice(0, 40);
    const taken = new Set(listAllThemes().map(t => t.slug));
    if (!taken.has(base)) return base;
    let i = 2;
    while (taken.has(`${base}-${i}`) && i < 999) i++;
    return `${base}-${i}`;
}

// Serializa las variables del tema a CSS legible (una declaración por línea).
function serializeThemeVars(vars) {
    return THEME_KEYS.map(k => `${cssVarName(k)}: ${vars[k] || ''};`).join('\n');
}

// Parsea texto CSS "--rt-key: value;" en un mapa de variables conocidas.
function parseThemeVars(text) {
    const out = {};
    (text || '').split(/[;\n]/).forEach(line => {
        const m = line.match(/^\s*(--rt-[a-zA-Z0-9-]+)\s*:\s*(.+?)\s*$/);
        if (m) {
            const key = m[1].slice(5);
            if (THEME_KEYS.includes(key)) out[key] = m[2].trim();
        }
    });
    return out;
}

// --- Gestor de temas (crear / editar / aplicar / exportar / importar) ---
function openThemeEditor(slug) {
    // slug null => crear nuevo (a partir de 'light'); slug existente => editar.
    let editing = null;
    if (slug) editing = (state.customThemes || []).find(t => t.slug === slug) || null;
    const baseSlug = editing ? editing.base : 'light';
    const palette = editing ? resolveThemePalette(editing.slug) : { ...BUILTIN_THEMES.light };
    state.themeEditor = {
        id: editing ? editing.id : null,
        slug: editing ? editing.slug : null,
        name: editing ? editing.name : '',
        base: baseSlug,
        vars: { ...palette },
        customCss: editing ? (editing.custom_css || '') : '',
        isNew: !editing
    };
    state.themeManagerError = '';
    state.showSettings = false;     // cerramos el modal de ajustes al abrir el estudio
    state.isThemeStudio = true;
    renderApp();
}

function closeThemeEditor() {
    state.themeEditor = null;
    state.isThemeStudio = false;
    const live = document.getElementById('rt-editor-live');
    if (live) live.remove();
    renderApp();
}

function themeEditorSetBase(base) {
    if (!state.themeEditor) return;
    state.themeEditor.base = base;
    // Al cambiar la base partimos de su paleta (conservando el nombre y el CSS libre).
    state.themeEditor.vars = { ...(BUILTIN_THEMES[base] || BUILTIN_THEMES.light) };
    renderApp();
}

function themeEditorSetVar(key, value) {
    if (!state.themeEditor) return;
    state.themeEditor.vars[key] = value;
    refreshThemeEditorPreview();
}

// Edición directa de las variables como código CSS.
function themeEditorSetVarsCode(text) {
    if (!state.themeEditor) return;
    const parsed = parseThemeVars(text);
    // Partimos de la base para que las claves no escritas tengan valor.
    state.themeEditor.vars = { ...(BUILTIN_THEMES[state.themeEditor.base] || BUILTIN_THEMES.light), ...parsed };
    refreshThemeEditorPreview();
}

function themeEditorSetCustomCss(text) {
    if (!state.themeEditor) return;
    state.themeEditor.customCss = text;
    refreshThemeEditorPreview();
}

// Refresca el panel de vista previa del editor sin re-render completo (fluidez).
function refreshThemeEditorPreview() {
    const prev = document.getElementById('theme-editor-preview');
    if (prev) prev.outerHTML = renderThemeEditorPreview();
    // Inyecta CSS libre del editor en vivo para que también se vea su efecto.
    let live = document.getElementById('rt-editor-live');
    if (!live) {
        live = document.createElement('style');
        live.id = 'rt-editor-live';
        document.head.appendChild(live);
    }
    const ed = state.themeEditor;
    live.textContent = (ed && ed.customCss) ? `[data-rt-theme="${ed.slug || '__rtedit'}"]{\n${ed.customCss}\n}` : '';
}

async function saveThemeFromEditor() {
    const ed = state.themeEditor;
    if (!ed) return;
    const isEs = state.lang === 'es';
    const name = (ed.name || '').trim();
    if (!name) {
        state.themeManagerError = isEs ? 'Ponle un nombre al tema' : 'Give the theme a name';
        renderApp();
        return;
    }
    const slug = ed.slug || uniqueThemeSlug(name);
    // Guardamos la paleta completa (var con prefijo --rt-) para que el export sea
    // autosuficiente y todas las variables queden definidas.
    const vars = {};
    THEME_KEYS.forEach(k => { if (ed.vars[k]) vars[cssVarName(k)] = ed.vars[k]; });

    try {
        await API.themes.create({ slug, name, base: ed.base, vars, custom_css: ed.customCss || '' });
        await loadCustomThemes();
        const live = document.getElementById('rt-editor-live');
        if (live) live.remove();
        state.themeEditor = null;
        state.isThemeStudio = false;
        state.showSettings = true;   // volvemos a Ajustes mostrando el tema nuevo
        state.themeManagerSuccess = isEs ? 'Tema guardado' : 'Theme saved';
        setReportTheme(slug);  // aplica y re-renderiza
    } catch (err) {
        state.themeManagerError = err.message || (isEs ? 'No se pudo guardar el tema' : 'Could not save theme');
        renderApp();
    }
}

async function deleteCustomTheme(id, slug) {
    const isEs = state.lang === 'es';
    if (!confirm(isEs ? '¿Eliminar este tema?' : 'Delete this theme?')) return;
    try {
        await API.themes.delete(id);
        if (state.reportTheme === slug) setReportTheme('light');
        await loadCustomThemes();
        renderApp();
    } catch (err) {
        alert((isEs ? 'Error: ' : 'Error: ') + err.message);
    }
}

function exportTheme(slug) {
    const meta = listAllThemes().find(t => t.slug === slug);
    if (!meta) return;
    const palette = resolveThemePalette(slug);
    const vars = {};
    THEME_KEYS.forEach(k => { if (palette[k]) vars[cssVarName(k)] = palette[k]; });
    const data = {
        pentestify_theme: true,
        name: meta.name,
        base: meta.base || 'light',
        vars,
        custom_css: meta.custom_css || ''
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pentestify-theme-${slug}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// Descarga una PLANTILLA HTML autocontenida para que el usuario diseñe su propio
// tema editando las variables CSS --rt-* y viéndolo en vivo en el navegador. El
// fichero resultante puede importarse después con "Importar" (acepta .html).
function downloadThemeTemplate(palOverride, nameOverride) {
    const isEs = state.lang === 'es';
    const pal = palOverride || resolveThemePalette(state.reportTheme) || BUILTIN_THEMES.light;
    const themeName = (nameOverride || 'Mi tema personalizado').toString();
    const labelOf = {};
    THEME_KEY_LABELS && Object.keys(THEME_KEY_LABELS).forEach(k => { labelOf[k] = isEs ? THEME_KEY_LABELS[k].es : THEME_KEY_LABELS[k].en; });

    const varLines = THEME_KEYS.map(k => {
        const comment = labelOf[k] ? `  /* ${labelOf[k]} */` : '';
        return `    ${cssVarName(k)}: ${pal[k] || ''};${comment}`;
    }).join('\n');

    const tpl = `<!DOCTYPE html>
<html lang="${state.lang}" data-theme-name="${escapeHTML(themeName)}" data-theme-base="${escapeHTML(palOverride && state.themeEditor ? state.themeEditor.base : 'light')}">
<head>
<meta charset="UTF-8">
<title>${escapeHTML(themeName)} — Plantilla de tema Pentestify</title>
<!--
  ${isEs ? 'PLANTILLA DE TEMA PENTESTIFY' : 'PENTESTIFY THEME TEMPLATE'}
  ${isEs
    ? '1) Edita los colores de las variables --rt-* de abajo (bloque :root).\n       2) Abre este archivo en el navegador para previsualizar el resultado en vivo.\n       3) Cambia data-theme-name (arriba) por el nombre de tu tema.\n       4) (Opcional) Escribe CSS extra en el bloque <style id="pentestify-custom-css">.\n       5) En Pentestify: Ajustes -> Tema del informe -> Importar, y selecciona este .html.'
    : '1) Edit the --rt-* color variables below (:root block).\n       2) Open this file in a browser to preview live.\n       3) Change data-theme-name (above) to your theme name.\n       4) (Optional) Add extra CSS in the <style id="pentestify-custom-css"> block.\n       5) In Pentestify: Settings -> Report theme -> Import, and choose this .html.'}
-->
<style id="pentestify-theme-vars">
:root {
${varLines}
}
</style>
<!-- ${isEs ? 'CSS adicional opcional (se aplicará al informe)' : 'Optional extra CSS (applied to the report)'} -->
<style id="pentestify-custom-css">
</style>
<style>
  body { margin:0; background:var(--rt-pageBg); color:var(--rt-textBody);
         font-family:'Inter',system-ui,sans-serif; padding:2.5rem; }
  .wrap { max-width:780px; margin:0 auto; }
  .hint { background:#fef9c3; border:1px solid #fde047; color:#713f12; border-radius:10px;
          padding:0.9rem 1.1rem; font-size:0.85rem; margin-bottom:2rem; }
  h1 { color:var(--rt-textPrimary); font-size:2.2rem; font-weight:900; margin:0 0 0.4rem; }
  .bar { width:64px; height:5px; border-radius:5px; background:var(--rt-accentBar,var(--rt-accentLine)); margin-bottom:1.6rem; }
  .card { background:var(--rt-cardBg); border:1px solid var(--rt-border); border-radius:12px; padding:1.2rem 1.4rem; margin-bottom:1.2rem; }
  .card h2 { color:var(--rt-textHeading); margin:0 0 0.5rem; font-size:1.15rem; }
  .card p { color:var(--rt-textBody); margin:0 0 0.4rem; line-height:1.6; }
  .muted { color:var(--rt-textMuted); font-size:0.82rem; }
  .poc { background:var(--rt-pocBg); border:1px solid var(--rt-pocBorder); border-radius:10px; padding:1rem 1.2rem; }
  .poc .t { color:var(--rt-pocHeading); font-weight:700; font-size:0.8rem; margin-bottom:0.4rem; }
  .poc pre { color:var(--rt-pocText); font-family:ui-monospace,monospace; font-size:0.82rem; margin:0; white-space:pre-wrap; }
  .ver { color:var(--rt-versionColor,var(--rt-accentLine)); font-weight:700; }
</style>
</head>
<body>
  <div class="wrap">
    <div class="hint">${isEs
        ? 'Plantilla de tema · edita las variables <b>--rt-*</b> del <b>&lt;style id="pentestify-theme-vars"&gt;</b> y vuelve a importar este archivo en Pentestify.'
        : 'Theme template · edit the <b>--rt-*</b> variables in <b>&lt;style id="pentestify-theme-vars"&gt;</b> and import this file back into Pentestify.'}</div>
    <h1>${isEs ? 'Informe de ejemplo' : 'Sample report'}</h1>
    <div class="bar"></div>
    <div class="card">
      <h2>${isEs ? 'Hallazgo de ejemplo' : 'Sample finding'}</h2>
      <p>${isEs ? 'Así se verá el texto del cuerpo de tu informe con este tema.' : 'This is how your report body text will look with this theme.'}</p>
      <p class="muted">${isEs ? 'Texto secundario · CVSS 7.5 · ' : 'Secondary text · CVSS 7.5 · '}<span class="ver">v1.0</span></p>
    </div>
    <div class="poc">
      <div class="t">${isEs ? 'Pasos para Reproducir (PoC)' : 'Steps to Reproduce (PoC)'}</div>
      <pre>$ id; whoami
www-data</pre>
    </div>
  </div>
</body>
</html>`;

    const blob = new Blob([tpl], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'pentestify-plantilla-tema.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// Extrae un tema (name/base/vars/custom_css) de una plantilla HTML.
function parseThemeFromHtml(text) {
    const doc = new DOMParser().parseFromString(text, 'text/html');
    const root = doc.documentElement;
    const name = (root.getAttribute('data-theme-name') || doc.title || 'Tema HTML').toString().trim().slice(0, 60) || 'Tema HTML';
    const baseAttr = root.getAttribute('data-theme-base');
    const base = ['light', 'dark', 'htb'].includes(baseAttr) ? baseAttr : 'light';

    const styleEl = doc.getElementById('pentestify-theme-vars')
        || Array.from(doc.querySelectorAll('style')).find(s => (s.textContent || '').includes('--rt-'));
    const vars = {};
    if (styleEl) {
        const m = (styleEl.textContent || '').match(/:root\s*\{([\s\S]*?)\}/);
        const body = m ? m[1] : (styleEl.textContent || '');
        body.replace(/(--rt-[a-zA-Z0-9-]+)\s*:\s*([^;]+);/g, (all, k, v) => {
            vars[k.trim()] = v.trim();
            return '';
        });
    }
    const cssEl = doc.getElementById('pentestify-custom-css');
    const custom_css = cssEl ? (cssEl.textContent || '').trim() : '';
    return { name, base, vars, custom_css };
}

async function importThemeFile(input) {
    const file = input.files && input.files[0];
    input.value = '';
    if (!file) return;
    const isEs = state.lang === 'es';
    try {
        const text = await file.text();
        const isHtml = /\.html?$/i.test(file.name) || /^\s*<!doctype html|<html[\s>]/i.test(text);
        let data;
        if (isHtml) {
            data = parseThemeFromHtml(text);
        } else {
            data = JSON.parse(text);
        }
        if (!data || typeof data !== 'object' || !data.vars || !Object.keys(data.vars).length) {
            throw new Error(isEs ? 'El archivo no contiene un tema válido (sin variables --rt-*)' : 'File has no valid theme (no --rt-* variables)');
        }
        const name = (data.name || 'Tema importado').toString().slice(0, 60);
        const base = ['light', 'dark', 'htb'].includes(data.base) ? data.base : 'light';
        const slug = uniqueThemeSlug(name);
        await API.themes.create({ slug, name, base, vars: data.vars, custom_css: data.custom_css || '' });
        await loadCustomThemes();
        state.themeManagerSuccess = isEs ? 'Tema importado' : 'Theme imported';
        setReportTheme(slug);
    } catch (err) {
        alert((isEs ? 'Error al importar el tema: ' : 'Error importing theme: ') + err.message);
    }
}

function renderThemeEditorPreview() {
    const v = state.themeEditor ? state.themeEditor.vars : BUILTIN_THEMES.light;
    const g = (k) => v[k] || '';
    return `
        <div id="theme-editor-preview" style="border-radius:10px;overflow:hidden;border:1px solid ${g('border')};background:${g('pageBg')};padding:1rem;">
            <div style="font-size:1.1rem;font-weight:800;color:${g('textPrimary')};margin-bottom:0.35rem;">Aa Título de portada</div>
            <div style="height:4px;width:48px;border-radius:4px;background:${g('accentLine')};margin-bottom:0.75rem;"></div>
            <div style="background:${g('cardBg')};border:1px solid ${g('border')};border-radius:8px;padding:0.75rem;margin-bottom:0.75rem;">
                <div style="color:${g('textHeading')};font-weight:800;margin-bottom:0.25rem;">Hallazgo de ejemplo</div>
                <div style="color:${g('textBody')};font-size:0.8rem;">Texto del cuerpo del informe.</div>
                <div style="color:${g('textMuted')};font-size:0.72rem;margin-top:0.2rem;">Texto secundario · CVSS 7.5</div>
            </div>
            <div style="background:${g('pocBg')};border:1px solid ${g('pocBorder') || g('border')};border-radius:8px;padding:0.6rem 0.75rem;">
                <div style="color:${g('pocHeading')};font-weight:700;font-size:0.75rem;margin-bottom:0.2rem;">PoC</div>
                <div style="color:${g('pocText')};font-family:monospace;font-size:0.72rem;">$ id; whoami</div>
            </div>
        </div>`;
}

// --------------------------------------------------------------------------- //
// Calculadora CVSS 3.1 (Base Score)
// --------------------------------------------------------------------------- //
const CVSS_METRIC_DEFS = [
    { id: 'AV', es: 'Vector de ataque', en: 'Attack Vector', opts: [['N', 'Red'], ['A', 'Adyacente'], ['L', 'Local'], ['P', 'Físico']], optsEn: [['N', 'Network'], ['A', 'Adjacent'], ['L', 'Local'], ['P', 'Physical']] },
    { id: 'AC', es: 'Complejidad', en: 'Attack Complexity', opts: [['L', 'Baja'], ['H', 'Alta']], optsEn: [['L', 'Low'], ['H', 'High']] },
    { id: 'PR', es: 'Privilegios req.', en: 'Privileges Required', opts: [['N', 'Ninguno'], ['L', 'Bajos'], ['H', 'Altos']], optsEn: [['N', 'None'], ['L', 'Low'], ['H', 'High']] },
    { id: 'UI', es: 'Interacción usuario', en: 'User Interaction', opts: [['N', 'Ninguna'], ['R', 'Requerida']], optsEn: [['N', 'None'], ['R', 'Required']] },
    { id: 'S', es: 'Alcance (Scope)', en: 'Scope', opts: [['U', 'Sin cambio'], ['C', 'Cambiado']], optsEn: [['U', 'Unchanged'], ['C', 'Changed']] },
    { id: 'C', es: 'Confidencialidad', en: 'Confidentiality', opts: [['N', 'Ninguno'], ['L', 'Bajo'], ['H', 'Alto']], optsEn: [['N', 'None'], ['L', 'Low'], ['H', 'High']] },
    { id: 'I', es: 'Integridad', en: 'Integrity', opts: [['N', 'Ninguno'], ['L', 'Bajo'], ['H', 'Alto']], optsEn: [['N', 'None'], ['L', 'Low'], ['H', 'High']] },
    { id: 'A', es: 'Disponibilidad', en: 'Availability', opts: [['N', 'Ninguno'], ['L', 'Bajo'], ['H', 'Alto']], optsEn: [['N', 'None'], ['L', 'Low'], ['H', 'High']] }
];

function cvssRoundUp(x) {
    // Roundup oficial CVSS 3.1: menor decimal (1 cifra) >= x, evitando errores float.
    const i = Math.round(x * 100000);
    if (i % 10000 === 0) return i / 100000;
    return (Math.floor(i / 10000) + 1) / 10;
}

function computeCvss(m) {
    const AV = { N: 0.85, A: 0.62, L: 0.55, P: 0.2 }[m.AV];
    const AC = { L: 0.77, H: 0.44 }[m.AC];
    const PR = (m.S === 'C')
        ? { N: 0.85, L: 0.68, H: 0.50 }[m.PR]
        : { N: 0.85, L: 0.62, H: 0.27 }[m.PR];
    const UI = { N: 0.85, R: 0.62 }[m.UI];
    const cia = { N: 0, L: 0.22, H: 0.56 };
    const C = cia[m.C], I = cia[m.I], A = cia[m.A];

    const iscBase = 1 - ((1 - C) * (1 - I) * (1 - A));
    let impact;
    if (m.S === 'C') {
        impact = 7.52 * (iscBase - 0.029) - 3.25 * Math.pow(iscBase - 0.02, 15);
    } else {
        impact = 6.42 * iscBase;
    }
    const exploitability = 8.22 * AV * AC * PR * UI;

    let score;
    if (impact <= 0) {
        score = 0;
    } else if (m.S === 'C') {
        score = cvssRoundUp(Math.min(1.08 * (impact + exploitability), 10));
    } else {
        score = cvssRoundUp(Math.min(impact + exploitability, 10));
    }
    const vector = `CVSS:3.1/AV:${m.AV}/AC:${m.AC}/PR:${m.PR}/UI:${m.UI}/S:${m.S}/C:${m.C}/I:${m.I}/A:${m.A}`;
    return { score: score.toFixed(1), vector };
}

function cvssSeverityKey(score) {
    const s = parseFloat(score);
    if (s >= 9.0) return 'crit';
    if (s >= 7.0) return 'high';
    if (s >= 4.0) return 'med';
    if (s > 0.0) return 'low';
    return 'info';
}

function parseCvssVector(vec) {
    const m = { AV: 'N', AC: 'L', PR: 'N', UI: 'N', S: 'U', C: 'N', I: 'N', A: 'N' };
    if (!vec) return m;
    vec.split('/').forEach(part => {
        const [k, v] = part.split(':');
        if (k in m && v) m[k] = v;
    });
    return m;
}

function openCvssCalc() {
    state.cvssMetrics = parseCvssVector(state.currentFinding.cvssVector);
    state.showCvssCalc = true;
    renderApp();
}

function closeCvssCalc() {
    state.showCvssCalc = false;
    renderApp();
}

function cvssSetMetric(id, val) {
    state.cvssMetrics[id] = val;
    const r = computeCvss(state.cvssMetrics);
    // Actualiza marca de score y botones activos sin re-render completo.
    const badge = document.getElementById('cvss-live-score');
    const vecEl = document.getElementById('cvss-live-vector');
    const sevKey = cvssSeverityKey(r.score);
    const colorMap = { crit: '#dc2626', high: '#f97316', med: '#eab308', low: '#22c55e', info: '#6b7280' };
    if (badge) {
        badge.textContent = r.score;
        const box = document.getElementById('cvss-score-box');
        if (box) box.style.background = colorMap[sevKey];
    }
    if (vecEl) vecEl.textContent = r.vector;
    // Refresca botones del grupo modificado.
    CVSS_METRIC_DEFS.forEach(def => {
        if (def.id !== id) return;
        def.opts.forEach(([code]) => {
            const b = document.getElementById(`cvss-opt-${def.id}-${code}`);
            if (b) b.classList.toggle('active', code === val);
        });
    });
    // Si cambia S, recalcular PR no es necesario en UI (PR sigue igual), pero el score sí cambia.
}

function applyCvssCalc() {
    const r = computeCvss(state.cvssMetrics);
    state.currentFinding.cvss = r.score;
    state.currentFinding.cvssVector = r.vector;
    state.currentFinding.severity = cvssSeverityKey(r.score);
    state.showCvssCalc = false;
    renderApp();
}

function renderCvssCalcModal() {
    if (!state.showCvssCalc) return '';
    const isEs = state.lang === 'es';
    const m = state.cvssMetrics;
    const r = computeCvss(m);
    const sevKey = cvssSeverityKey(r.score);
    const colorMap = { crit: '#dc2626', high: '#f97316', med: '#eab308', low: '#22c55e', info: '#6b7280' };
    const sevLabel = UI[state.lang].severityLevels[sevKey];

    const groups = CVSS_METRIC_DEFS.map(def => {
        const opts = isEs ? def.opts : def.optsEn;
        return `
            <div class="cvss-metric">
                <span>${isEs ? def.es : def.en}</span>
                <div class="cvss-metric-opts">
                    ${opts.map(([code, label]) => `
                        <button type="button" id="cvss-opt-${def.id}-${code}" class="cvss-opt ${m[def.id] === code ? 'active' : ''}" onclick="cvssSetMetric('${def.id}','${code}')">${label}</button>
                    `).join('')}
                </div>
            </div>`;
    }).join('');

    return `
        <div class="settings-overlay" style="align-items:center;justify-content:center;padding:1rem;" onclick="closeCvssCalc()">
            <div class="settings-modal" style="width:100%;max-width:640px;display:flex;flex-direction:column;max-height:92vh;" onclick="event.stopPropagation()">
                <div class="settings-modal-header">
                    <span>${isEs ? 'Calculadora CVSS 3.1' : 'CVSS 3.1 Calculator'}</span>
                    <button class="settings-close-btn" onclick="closeCvssCalc()">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                    </button>
                </div>
                <div style="padding:1.25rem;overflow-y:auto;">
                    <div class="cvss-score-badge" id="cvss-score-box" style="background:${colorMap[sevKey]};color:#fff;">
                        <span class="cvss-score-num" id="cvss-live-score">${r.score}</span>
                        <div>
                            <div style="font-weight:800;text-transform:uppercase;font-size:0.8rem;letter-spacing:0.05em;">${sevLabel}</div>
                            <div id="cvss-live-vector" style="font-family:ui-monospace,Menlo,monospace;font-size:0.72rem;opacity:0.9;word-break:break-all;">${r.vector}</div>
                        </div>
                    </div>
                    <div class="cvss-calc-grid">
                        ${groups}
                    </div>
                    <div style="display:flex;gap:0.5rem;justify-content:flex-end;margin-top:1.25rem;">
                        <button class="btn-secondary" onclick="closeCvssCalc()">${isEs ? 'Cancelar' : 'Cancel'}</button>
                        <button class="btn-primary" onclick="applyCvssCalc()">${isEs ? 'Aplicar al hallazgo' : 'Apply to finding'}</button>
                    </div>
                </div>
            </div>
        </div>`;
}

// Etiquetas y agrupación de TODAS las variables del tema para el Estudio de temas.
const THEME_KEY_LABELS = {
    pageBg:        { es: 'Fondo de página',        en: 'Page background' },
    cardBg:        { es: 'Fondo de tarjetas',      en: 'Card background' },
    cardBgAlt:     { es: 'Fondo tarjeta (alt)',    en: 'Card background (alt)' },
    greenBg:       { es: 'Fondo verde',            en: 'Green background' },
    orangeBg:      { es: 'Fondo naranja',          en: 'Orange background' },
    purpleBg:      { es: 'Fondo morado',           en: 'Purple background' },
    metaBg:        { es: 'Fondo cabecera datos',   en: 'Meta header bg' },
    textPrimary:   { es: 'Título de portada',      en: 'Cover title' },
    textHeading:   { es: 'Títulos',                en: 'Headings' },
    textBody:      { es: 'Texto del cuerpo',       en: 'Body text' },
    textMuted:     { es: 'Texto secundario',       en: 'Secondary text' },
    textFaint:     { es: 'Texto tenue',            en: 'Faint text' },
    textSubtle:    { es: 'Texto sutil',            en: 'Subtle text' },
    textGray:      { es: 'Texto gris',             en: 'Gray text' },
    textGrayMed:   { es: 'Texto gris medio',       en: 'Medium gray text' },
    coverAccent:   { es: 'Acento de portada',      en: 'Cover accent' },
    accentLine:    { es: 'Línea de acento',        en: 'Accent line' },
    accentBar:     { es: 'Barra de acento',        en: 'Accent bar' },
    versionColor:  { es: 'Color de versión',       en: 'Version color' },
    textRed:       { es: 'Texto rojo',             en: 'Red text' },
    textOrange:    { es: 'Texto naranja',          en: 'Orange text' },
    textOrangeDark:{ es: 'Texto naranja oscuro',   en: 'Dark orange text' },
    textGreen:     { es: 'Texto verde',            en: 'Green text' },
    textGreenDark: { es: 'Texto verde oscuro',     en: 'Dark green text' },
    border:        { es: 'Bordes',                 en: 'Borders' },
    borderLight:   { es: 'Borde claro',            en: 'Light border' },
    borderMeta:    { es: 'Borde cabecera datos',   en: 'Meta border' },
    borderMetaSub: { es: 'Borde cabecera (sub)',   en: 'Meta border (sub)' },
    borderGreen:   { es: 'Borde verde',            en: 'Green border' },
    borderOrange:  { es: 'Borde naranja',          en: 'Orange border' },
    borderPurple:  { es: 'Borde morado',           en: 'Purple border' },
    borderFaint:   { es: 'Borde tenue',            en: 'Faint border' },
    classifBg:     { es: 'Fondo clasificación',    en: 'Classification bg' },
    classifBorder: { es: 'Borde clasificación',    en: 'Classification border' },
    classifText:   { es: 'Texto clasificación',    en: 'Classification text' },
    pocBg:         { es: 'Fondo de código (PoC)',  en: 'Code (PoC) bg' },
    pocBorder:     { es: 'Borde de código',        en: 'Code border' },
    pocText:       { es: 'Texto de código',        en: 'Code text' },
    pocHeading:    { es: 'Título de código',       en: 'Code heading' }
};

const THEME_GROUPS = [
    { es: 'Fondos',        en: 'Backgrounds', keys: ['pageBg', 'cardBg', 'cardBgAlt', 'metaBg', 'greenBg', 'orangeBg', 'purpleBg'] },
    { es: 'Texto',         en: 'Text',        keys: ['textPrimary', 'textHeading', 'textBody', 'textMuted', 'textFaint', 'textSubtle', 'textGray', 'textGrayMed'] },
    { es: 'Acentos',       en: 'Accents',     keys: ['coverAccent', 'accentLine', 'accentBar', 'versionColor'] },
    { es: 'Estados (texto)',en: 'Status (text)', keys: ['textRed', 'textOrange', 'textOrangeDark', 'textGreen', 'textGreenDark'] },
    { es: 'Bordes',        en: 'Borders',     keys: ['border', 'borderLight', 'borderMeta', 'borderMetaSub', 'borderGreen', 'borderOrange', 'borderPurple', 'borderFaint'] },
    { es: 'Clasificación', en: 'Classification', keys: ['classifBg', 'classifBorder', 'classifText'] },
    { es: 'Código / PoC',  en: 'Code / PoC',  keys: ['pocBg', 'pocBorder', 'pocText', 'pocHeading'] }
];

// Página completa de personalización de tema (Estudio de temas). Reutiliza el
// estado y los setters de themeEditor; se abre desde "+ Nuevo" o al editar un tema.
function renderThemeStudio() {
    const ed = state.themeEditor;
    if (!ed) return '';
    const isEs = state.lang === 'es';

    const field = (key) => {
        const val = ed.vars[key] || '';
        const isHex = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(val);
        const label = (THEME_KEY_LABELS[key] ? (isEs ? THEME_KEY_LABELS[key].es : THEME_KEY_LABELS[key].en) : key);
        const colorCtl = isHex
            ? `<input type="color" value="${val}" oninput="themeEditorSetVar('${key}', this.value)" class="ts-color">`
            : `<span class="ts-swatch" style="background:${escapeHTML(val)};"></span>`;
        return `
            <div class="ts-field">
                <span class="ts-field-label" title="${escapeHTML(key)}">${label}</span>
                <div class="ts-field-ctl">
                    <input type="text" value="${escapeHTML(val)}" spellcheck="false" oninput="themeEditorSetVar('${key}', this.value)" class="ts-text">
                    ${colorCtl}
                </div>
            </div>`;
    };

    const groups = THEME_GROUPS.map(g => `
        <details class="ts-group" open>
            <summary>${isEs ? g.es : g.en}</summary>
            <div class="ts-group-body">${g.keys.map(field).join('')}</div>
        </details>`).join('');

    const codePanel = `
        <details class="ts-group">
            <summary>${isEs ? 'CSS avanzado (control total)' : 'Advanced CSS (full control)'}</summary>
            <div class="ts-group-body">
                <textarea spellcheck="false" class="ts-code" placeholder=".cover-page h1 { text-transform: uppercase; }\n.finding-preview h3 { letter-spacing:-.02em; }" oninput="themeEditorSetCustomCss(this.value)">${escapeHTML(ed.customCss || '')}</textarea>
                <p class="ts-hint">${isEs
                    ? 'Se aplica solo a este tema. Selectores: <code>.cover-page</code>, <code>.finding-preview</code>, <code>.preview-container</code>, <code>h1..h4</code>.'
                    : 'Applies only to this theme. Selectors: <code>.cover-page</code>, <code>.finding-preview</code>, <code>.preview-container</code>, <code>h1..h4</code>.'}</p>
            </div>
        </details>`;

    return `
        <div class="theme-studio">
            <header class="theme-studio-header">
                <div class="ts-head-left">
                    <button class="account-back-btn" onclick="closeThemeEditor()">
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
                        ${isEs ? 'Volver' : 'Back'}
                    </button>
                    <h1>${ed.isNew ? (isEs ? 'Estudio de temas — nuevo' : 'Theme studio — new') : (isEs ? 'Estudio de temas — editar' : 'Theme studio — edit')}</h1>
                </div>
                <div class="ts-head-actions">
                    <button class="btn-secondary" onclick="downloadThemeStudioJson()">JSON</button>
                    <button class="btn-secondary" onclick="downloadThemeStudioTemplate()">${isEs ? 'Plantilla HTML' : 'HTML template'}</button>
                    <button class="btn-primary" onclick="saveThemeFromEditor()">${isEs ? 'Guardar en la app' : 'Save to app'}</button>
                </div>
            </header>

            <div class="theme-studio-body">
                <div class="ts-controls">
                    <div class="ts-field" style="border:none;">
                        <span class="ts-field-label">${isEs ? 'Nombre' : 'Name'}</span>
                        <input type="text" class="ts-text" style="width:170px;" value="${escapeHTML(ed.name)}" oninput="state.themeEditor.name = this.value" placeholder="${isEs ? 'Mi tema corporativo' : 'My corporate theme'}">
                    </div>
                    <div class="ts-field">
                        <span class="ts-field-label">${isEs ? 'Basado en' : 'Based on'}</span>
                        <select class="ts-text" style="width:170px;" onchange="themeEditorSetBase(this.value)">
                            <option value="light" ${ed.base === 'light' ? 'selected' : ''}>${isEs ? 'Claro' : 'Light'}</option>
                            <option value="dark" ${ed.base === 'dark' ? 'selected' : ''}>${isEs ? 'Oscuro' : 'Dark'}</option>
                            <option value="htb" ${ed.base === 'htb' ? 'selected' : ''}>HTB</option>
                        </select>
                    </div>
                    ${groups}
                    ${codePanel}
                    ${state.themeManagerError ? `<div class="login-error" style="margin-top:0.6rem;">${escapeHTML(state.themeManagerError)}</div>` : ''}
                </div>
                <div class="ts-preview">
                    <p class="ts-preview-title">${isEs ? 'Vista previa en vivo' : 'Live preview'}</p>
                    ${renderThemeEditorPreview()}
                </div>
            </div>
        </div>`;
}

// Exporta el tema en edición como JSON importable.
function downloadThemeStudioJson() {
    const ed = state.themeEditor;
    if (!ed) return;
    const vars = {};
    THEME_KEYS.forEach(k => { if (ed.vars[k]) vars[cssVarName(k)] = ed.vars[k]; });
    const data = { pentestify_theme: true, name: ed.name || 'Tema', base: ed.base || 'light', vars, custom_css: ed.customCss || '' };
    _downloadBytes(new TextEncoder().encode(JSON.stringify(data, null, 2)),
        `pentestify-theme-${slugify(ed.name) || 'tema'}.json`, 'application/json');
}

// Exporta el tema en edición como plantilla HTML editable.
function downloadThemeStudioTemplate() {
    const ed = state.themeEditor;
    if (!ed) return;
    downloadThemeTemplate(ed.vars, ed.name || 'Mi tema personalizado');
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

            ${state.pdfShowSeverityBars ? `
            <div style="display: flex; height: 28px; width: 100%; border-radius: 6px; overflow: hidden; margin-bottom: 1.5rem; box-shadow: inset 0 2px 4px 0 rgba(0,0,0,0.06);">
                ${barSegments}
            </div>
            ` : ''}

            <div style="display: flex; flex-wrap: wrap; gap: 1rem; justify-content: center;">
                ${legendItems}
            </div>
        </div>
    `;
}

// Código de hallazgo legible (F-01, F-02, …).
function findingCode(idx) { return 'F-' + String(idx + 1).padStart(2, '0'); }

function findingStatusBadge(status) {
    status = status || 'open';
    const label = (UI[state.lang].findingStatuses || {})[status] || status;
    return `<span class="finding-status-badge status-${status}">${escapeHTML(label)}</span>`;
}

// Bloque de metadatos profesionales por hallazgo (estado, riesgo, OWASP, activos,
// vector CVSS, cumplimiento, referencias adicionales, re-test).
function renderFindingProMeta(f, c, t) {
    const isEs = state.lang === 'es';
    const riskLbl = (k) => (UI[state.lang].riskLevels || {})[k] || k;
    const rows = [];

    const owasp = f.owasp || '';
    const vec = f.cvssVector || f.cvss_vector || '';
    const assets = f.affectedAssets || f.affected_assets || '';
    const likelihood = f.likelihood || '';
    const impactRating = f.impactRating || f.impact_rating || '';
    const refs = Array.isArray(f.references) ? f.references : [];
    const comp = Array.isArray(f.compliance) ? f.compliance : [];
    const retest = f.retestNotes || f.retest_notes || '';

    const item = (label, value) => `
        <div style="padding:0.5rem 0;border-bottom:1px solid ${c.borderFaint};">
            <span style="font-size:0.7rem;font-weight:700;text-transform:uppercase;letter-spacing:0.04em;color:${c.textGray};">${label}</span>
            <div style="font-size:0.9rem;color:${c.textBody};margin-top:0.15rem;">${value}</div>
        </div>`;

    // Estos 4 metadatos son OPT-IN: solo se incluyen si su toggle está activado.
    const vis = (key) => getFindingFieldVis(f, key);

    if (owasp && vis('owasp')) rows.push(item(isEs ? 'OWASP Top 10' : 'OWASP Top 10', escapeHTML(owasp)));
    if ((likelihood || impactRating) && vis('risk')) {
        rows.push(item(isEs ? 'Probabilidad × Impacto' : 'Likelihood × Impact',
            `${escapeHTML(riskLbl(likelihood) || '—')} × ${escapeHTML(riskLbl(impactRating) || '—')}`));
    }
    if (vec) rows.push(item(isEs ? 'Vector CVSS' : 'CVSS Vector', `<span style="font-family:ui-monospace,monospace;font-size:0.8rem;word-break:break-all;">${escapeHTML(vec)}</span>`));
    if (assets) rows.push(item(isEs ? 'Activos afectados' : 'Affected assets', `<span style="white-space:pre-wrap;font-family:ui-monospace,monospace;font-size:0.82rem;">${formatMultiline(assets)}</span>`));
    if (comp.length && vis('compliance')) rows.push(item(isEs ? 'Cumplimiento / mapeo' : 'Compliance / mapping',
        comp.map(x => `<span class="pro-tag" style="background:rgba(99,102,241,0.12);color:${c.textHeading};">${escapeHTML(x)}</span>`).join(' ')));
    if (refs.length) rows.push(item(isEs ? 'Referencias adicionales' : 'Additional references',
        refs.map(r => `<a href="${escapeHTML(r)}" target="_blank" style="color:#3b82f6;text-decoration:none;word-break:break-all;display:block;">${escapeHTML(r)}</a>`).join('')));

    let html = '';
    if (rows.length) {
        html += `<div style="background:${c.cardBg};border:1px solid ${c.border};border-radius:8px;padding:0.5rem 1.25rem;margin-bottom:1.5rem;">${rows.join('')}</div>`;
    }
    if (retest && vis('retest')) {
        html += `
            <div style="margin-bottom:1.5rem;background:${c.cardBgAlt};border:1px dashed ${c.borderMetaSub};border-radius:8px;padding:1rem 1.25rem;">
                <h4 style="font-size:0.95rem;font-weight:700;color:${c.textMuted};margin:0 0 0.4rem;display:flex;align-items:center;gap:0.4rem;">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path><path d="M3 3v5h5"></path></svg>
                    ${isEs ? 'Notas de re-test' : 'Re-test notes'}
                </h4>
                <div style="color:${c.textFaint};line-height:1.65;margin:0;">${markdownToHtml(retest)}</div>
            </div>`;
    }
    return html;
}

// Página de Alcance y Metodología para el informe.
// Campos del alcance que se imprimen en el informe. El engagement no tiene
// interruptor (siempre se muestra si hay fechas); el resto son opt-in por campo.
// Ya no existe un interruptor de sección: la página aparece si hay algún campo
// visible con contenido. Usado tanto por el informe como por su índice (TOC).
function scopeSectionVisibleFields(d) {
    const std = d.methodologyStandards || [];
    const stdLabels = METHODOLOGY_STANDARDS.filter(s => std.includes(s.key)).map(s => s.label);
    const fv = d.scopeFieldsVisibility || {};
    const fvis = (key) => !!fv[key];
    return {
        stdLabels,
        showDates:    !!(d.engagementStart || d.engagementEnd),
        showScopeIn:  fvis('scopeIn') && !!d.scopeIn,
        showScopeOut: fvis('scopeOut') && !!d.scopeOut,
        showStd:      fvis('standards') && stdLabels.length > 0,
        showNotes:    fvis('methodologyNotes') && !!d.methodologyNotes,
        showTools:    fvis('toolsUsed') && !!d.toolsUsed,
    };
}

function scopeSectionHasContent(d) {
    const s = scopeSectionVisibleFields(d);
    return !!(s.showDates || s.showScopeIn || s.showScopeOut || s.showStd || s.showNotes || s.showTools);
}

function renderScopeMethodologyPreview(c, t) {
    const isEs = state.lang === 'es';
    const d = state.auditData;
    const { stdLabels, showDates, showScopeIn, showScopeOut, showStd, showNotes, showTools } = scopeSectionVisibleFields(d);

    if (!(showDates || showScopeIn || showScopeOut || showStd || showNotes || showTools)) return '';

    const block = (title, body, mono) => body ? `
        <div style="margin-bottom:1.5rem;">
            <h3 style="font-size:1.15rem;color:${c.textBody};margin:0 0 0.6rem;font-weight:700;">${title}</h3>
            <div style="background:${c.cardBgAlt};border:1px solid ${c.borderMeta};border-radius:10px;padding:1.1rem 1.4rem;color:${c.textMuted};line-height:1.7;${mono ? 'font-family:ui-monospace,monospace;font-size:0.85rem;' : ''}">${mono ? `<span style="white-space:pre-wrap;">${formatMultiline(body)}</span>` : markdownToHtml(body)}</div>
        </div>` : '';

    const dates = showDates
        ? `${escapeHTML(d.engagementStart || '—')} → ${escapeHTML(d.engagementEnd || '—')}`
        : '';

    return `
        <div id="scope" style="padding: 2rem 0; page-break-before: always; background: ${c.pageBg};">
            <div style="display:flex; justify-content:space-between; align-items:baseline; border-bottom: 3px solid ${c.accentLine}; padding-bottom: 0.75rem; margin-bottom: 2rem;">
                <h2 style="font-size: 2rem; color: ${c.textHeading}; margin: 0; font-weight: 800;">${isEs ? 'Alcance y Metodología' : 'Scope & Methodology'}</h2>
                ${renderTlpPageBadge(d)}
            </div>
            ${dates ? block(isEs ? 'Ventana del engagement' : 'Engagement window', dates, true) : ''}
            ${showScopeIn ? block(isEs ? 'Dentro del alcance' : 'In-scope', d.scopeIn, true) : ''}
            ${showScopeOut ? block(isEs ? 'Fuera del alcance / exclusiones' : 'Out-of-scope / exclusions', d.scopeOut, true) : ''}
            ${showStd ? `
                <div style="margin-bottom:1.5rem;">
                    <h3 style="font-size:1.15rem;color:${c.textBody};margin:0 0 0.6rem;font-weight:700;">${isEs ? 'Metodologías y estándares' : 'Methodologies & standards'}</h3>
                    <div class="pro-tags">${stdLabels.map(l => `<span class="pro-tag" style="background:rgba(37,99,235,0.12);color:${c.textHeading};font-size:0.8rem;">${escapeHTML(l)}</span>`).join('')}</div>
                </div>` : ''}
            ${showNotes ? block(isEs ? 'Notas de metodología' : 'Methodology notes', d.methodologyNotes, false) : ''}
            ${showTools ? block(isEs ? 'Herramientas utilizadas' : 'Tools used', d.toolsUsed, true) : ''}
        </div>`;
}

// Matriz de riesgo Probabilidad × Impacto en el resumen ejecutivo.
function renderRiskMatrix(c, t) {
    const isEs = state.lang === 'es';
    // Deriva probabilidad/impacto del hallazgo; si faltan, se infiere de la severidad.
    const sevToRisk = { crit: ['high', 'high'], high: ['high', 'med'], med: ['med', 'med'], low: ['low', 'med'], info: ['low', 'low'] };
    const cells = { high: { high: 0, med: 0, low: 0 }, med: { high: 0, med: 0, low: 0 }, low: { high: 0, med: 0, low: 0 } };
    let any = false;
    state.findings.forEach(f => {
        // Opt-in: solo entran en la matriz los hallazgos con el toggle "riesgo" activado.
        if (!getFindingFieldVis(f, 'risk')) return;
        let lk = f.likelihood, im = f.impactRating || f.impact_rating;
        if (!lk || !im) { const d = sevToRisk[f.severity] || ['med', 'med']; lk = lk || d[0]; im = im || d[1]; }
        if (cells[lk] && cells[lk][im] !== undefined) { cells[lk][im]++; any = true; }
    });
    // Si ningún hallazgo tiene el riesgo activado, la sección entera se omite.
    if (!any) return '';

    const order = ['high', 'med', 'low'];
    const lbl = (k) => (UI[state.lang].riskLevels || {})[k] || k;
    // Color de celda según nivel de riesgo combinado.
    const cellColor = (lk, im) => {
        const score = { high: 3, med: 2, low: 1 }[lk] * { high: 3, med: 2, low: 1 }[im];
        if (score >= 9) return '#dc2626';
        if (score >= 6) return '#f97316';
        if (score >= 3) return '#eab308';
        return '#22c55e';
    };

    const headerRow = `<tr><th style="padding:0.5rem;"></th>${order.map(im => `<th style="padding:0.5rem;font-size:0.8rem;color:${c.textMuted};">${isEs ? 'Imp.' : 'Imp.'} ${lbl(im)}</th>`).join('')}</tr>`;
    const bodyRows = order.map(lk => `
        <tr>
            <th style="padding:0.5rem;font-size:0.8rem;color:${c.textMuted};text-align:right;white-space:nowrap;">${isEs ? 'Prob.' : 'Lk.'} ${lbl(lk)}</th>
            ${order.map(im => {
                const n = cells[lk][im];
                const bg = n > 0 ? cellColor(lk, im) : 'transparent';
                return `<td style="padding:0;width:64px;height:48px;text-align:center;border:1px solid ${c.border};background:${bg};color:#fff;font-weight:800;font-size:1.1rem;">${n > 0 ? n : ''}</td>`;
            }).join('')}
        </tr>`).join('');

    return `
        <div style="margin: 2rem 0; page-break-inside: avoid;">
            <h3 style="font-size:1.15rem;color:${c.textHeading};margin:0 0 1rem;font-weight:800;">${isEs ? 'Matriz de Riesgo (Probabilidad × Impacto)' : 'Risk Matrix (Likelihood × Impact)'}</h3>
            <table style="border-collapse:collapse;margin:0 auto;">
                ${headerRow}
                ${bodyRows}
            </table>
        </div>`;
}

// Tabla de control de versiones del documento.
function renderRevisionHistoryPreview(c, t) {
    const isEs = state.lang === 'es';
    const rows = (state.auditData.revisionHistory || []).filter(r => r.version || r.date || r.author || r.changes);
    if (!rows.length) return '';
    return `
        <div id="revisions" style="padding: 2rem 0; page-break-inside: avoid; background: ${c.pageBg};">
            <div style="display:flex; justify-content:space-between; align-items:baseline; border-bottom: 2px solid ${c.border}; padding-bottom: 0.75rem; margin-bottom: 1.5rem;">
                <h2 style="font-size: 1.75rem; color: ${c.textHeading}; margin: 0; font-weight: 800;">${isEs ? 'Control de Versiones' : 'Document Control'}</h2>
                ${renderTlpPageBadge(state.auditData)}
            </div>
            <table style="width:100%;border-collapse:collapse;font-size:0.9rem;">
                <thead>
                    <tr style="text-align:left;">
                        <th style="padding:0.6rem 0.8rem;border-bottom:2px solid ${c.border};color:${c.textMuted};">${isEs ? 'Versión' : 'Version'}</th>
                        <th style="padding:0.6rem 0.8rem;border-bottom:2px solid ${c.border};color:${c.textMuted};">${isEs ? 'Fecha' : 'Date'}</th>
                        <th style="padding:0.6rem 0.8rem;border-bottom:2px solid ${c.border};color:${c.textMuted};">${isEs ? 'Autor' : 'Author'}</th>
                        <th style="padding:0.6rem 0.8rem;border-bottom:2px solid ${c.border};color:${c.textMuted};">${isEs ? 'Cambios' : 'Changes'}</th>
                    </tr>
                </thead>
                <tbody>
                    ${rows.map(r => `
                        <tr>
                            <td style="padding:0.6rem 0.8rem;border-bottom:1px solid ${c.borderFaint};color:${c.textBody};font-weight:700;">${escapeHTML(r.version || '')}</td>
                            <td style="padding:0.6rem 0.8rem;border-bottom:1px solid ${c.borderFaint};color:${c.textBody};">${escapeHTML(r.date || '')}</td>
                            <td style="padding:0.6rem 0.8rem;border-bottom:1px solid ${c.borderFaint};color:${c.textBody};">${escapeHTML(r.author || '')}</td>
                            <td style="padding:0.6rem 0.8rem;border-bottom:1px solid ${c.borderFaint};color:${c.textBody};">${escapeHTML(r.changes || '')}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>`;
}

function renderPreview() {
    if (state.activeTab !== 'preview' || state.showSplash || state.showReportSelector) return '';

    const t = UI[state.lang];
    const d = state.auditData;
    const c   = getThemeColors();
    const dk  = state.reportTheme === 'dark';
    const htb = state.reportTheme === 'htb';
    const rt  = state.reportTheme === 'redteam';

    const _cw = state.pdfContentWidth || 820;
    return `
        <div class="preview-container" data-rt-theme="${escapeHTML(state.reportTheme)}" style="max-width:${_cw}px;">
            <!-- PORTADA -->
            <div class="cover-page" style="
                display: flex;
                flex-direction: column;
                justify-content: center;
                gap: 2rem;
                min-height: 100vh;
                page-break-after: always;
                page-break-inside: avoid;
                background: ${c.pageBg};
                color: ${c.textHeading};
                padding: 0 3rem 0.25rem 3rem;
            ">

                <!-- PARTE SUPERIOR Y MEDIA CENTRALIZADA -->
                <div style="display:flex; flex-direction:column; align-items:center; justify-content:center;">

                    <div style="margin-bottom: 1rem; width: 100%; display: flex; justify-content: center; gap: 1rem; flex-wrap: wrap;">
                        ${d.clientLogo[0] || d.clientLogo[1] ? `
                            ${d.clientLogo[0] ? `
                                <img src="${escapeHTML(d.clientLogo[0])}" alt="${t.logoClient} 1" style="max-height: 200px; width: auto; max-width: 45%; object-fit: contain; display: block; filter: drop-shadow(0 10px 25px rgba(0,0,0,0.08));">
                            ` : ''}
                            ${d.clientLogo[1] ? `
                                <img src="${escapeHTML(d.clientLogo[1])}" alt="${t.logoClient} 2" style="max-height: 200px; width: auto; max-width: 45%; object-fit: contain; display: block; filter: drop-shadow(0 10px 25px rgba(0,0,0,0.08));">
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
                        ` : rt ? `
                            <div style="display:flex;flex-direction:column;align-items:center;gap:1.75rem;">
                                <div style="width:132px; height:132px; border-radius:50%; display:flex; align-items:center; justify-content:center; border:1px solid rgba(239,68,68,0.35); box-shadow:0 0 70px rgba(239,68,68,0.22), inset 0 0 36px rgba(239,68,68,0.06);">
                                    <svg width="68" height="68" viewBox="0 0 24 24" fill="none" stroke="#f87171" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="8.5"/><line x1="12" y1="1.5" x2="12" y2="5.5"/><line x1="12" y1="18.5" x2="12" y2="22.5"/><line x1="1.5" y1="12" x2="5.5" y2="12"/><line x1="18.5" y1="12" x2="22.5" y2="12"/><circle cx="12" cy="12" r="1.6" fill="#f87171" stroke="none"/></svg>
                                </div>
                                <div style="font-size:0.95rem;font-weight:600;letter-spacing:0.45em;color:#f87171;text-transform:uppercase;padding-left:0.45em;">Red Team</div>
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

                        <div style="width: 80px; height: 5px; background: ${c.accentBar}; border-radius: 6px; margin-bottom: 1.5rem; box-shadow: ${htb ? '0 4px 14px rgba(159,239,0,0.4)' : rt ? '0 4px 14px rgba(239,68,68,0.4)' : '0 4px 10px rgba(37,99,235,0.3)'};"></div>

                        <p style="font-size: 1.35rem; color: ${c.coverAccent}; font-weight: 600; margin:0; letter-spacing: -0.01em;">
                            ${escapeHTML(d.targetAsset)}
                        </p>

                        ${(() => {
                    // TLP eliminado: la portada solo muestra la etiqueta de Clasificación.
                    // Se coloca justo bajo el título/target para que no quede un gran
                    // hueco vertical entre ambos (el bloque superior lleva flex:1).
                    const classLabels = { '1': 'Público', '2': 'Interno', '3': 'Confidencial', '4': 'Restringido' };
                    const classLabel = classLabels[d.classification] || 'Interno';
                    return `
                        <div style="margin-top: 1.25rem; display: flex; justify-content: center; align-items: center; gap: 1rem; flex-wrap: wrap;">
                            <span style="display:inline-flex; align-items:center; gap:0.4rem; background:${c.classifBg}; border:1px solid ${c.classifBorder}; border-radius:6px; padding:0.4rem 1rem; font-size:0.75rem; font-weight:700; color:${c.classifText}; text-transform:uppercase; letter-spacing:0.08em;">
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                                ${escapeHTML(classLabel)}
                            </span>
                        </div>`;
                })()}
                    </div>
                </div>

                <div style="margin-top: 0; background: ${c.metaBg}; border: 1px solid ${c.borderMeta}; border-radius: 12px; padding: 1.5rem 2rem; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
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
                    ${scopeSectionHasContent(d) ? `
                    <a href="#scope" style="display: flex; justify-content: space-between; text-decoration: none; color: ${c.textMuted}; font-weight: 700; padding: 0.75rem 0; border-bottom: 1px dotted ${c.borderLight}; font-size: 1.125rem; transition: color 0.2s;">
                        <span>${state.lang === 'es' ? 'Alcance y Metodología' : 'Scope & Methodology'}</span>
                    </a>` : ''}
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
                                <span style="font-size: 0.75rem; font-weight: 700; text-transform: uppercase; padding: 0.25rem 0.5rem; border-radius: 6px; background-color: var(--severity-${safeSeverity(f.severity)}); color: white; min-width: 80px; text-align: center; display: inline-block;">
                                    ${t.severityLevels[safeSeverity(f.severity)]}
                                </span>
                                <span style="font-weight: 700; color: ${c.textGray}; font-size: 0.875rem; width: 40px; text-align: right;">${escapeHTML(f.cvss || '-')}</span>
                            </div>
                        </a>
                    `).join('')}
                </div>
            </div>
            
            <!-- ALCANCE Y METODOLOGÍA -->
            ${renderScopeMethodologyPreview(c, t)}

            <!-- RESUMEN EJECUTIVO + INCIDENCIAS -->
            <!-- Sin page-break-inside: avoid en el contenedor: es demasiado alto
                 (resumen CVSS + matriz de riesgo + incidencias) y, si no cabe en
                 el hueco restante, saltaba entero dejando media página en blanco.
                 Cada sub-bloque (resumen CVSS, matriz) ya evita partirse por su
                 cuenta, así que el conjunto puede fluir y llenar la página. -->
            <div style="padding: 2rem 0; background: ${c.pageBg};">
                <div id="summary" style="margin-bottom: 3rem;">
                    <div style="display:flex; justify-content:space-between; align-items:baseline; border-bottom: 2px solid ${c.border}; padding-bottom: 0.75rem; margin-bottom: 1.5rem;">
                        <h2 style="font-size: 1.75rem; color: ${c.textHeading}; margin: 0; font-weight: 800;">${t.executiveSummary}</h2>
                        ${renderTlpPageBadge(d)}
                    </div>
                    ${renderCvssSummary()}
                    ${renderRiskMatrix(c, t)}
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
                        <div style="color:${c.textOrangeDark}; line-height:1.7; text-align: justify;">${markdownToHtml(d.incidentsText || '')}</div>
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
                    <div id="finding-${idx}" class="finding-preview severity-${safeSeverity(f.severity)}" style="margin-bottom: 3rem; background: ${c.cardBg}; padding: 2rem; border-radius: 12px; border: 1px solid ${c.border}; ${state.pdfShowSeverityBars ? `border-left: 6px solid var(--severity-${safeSeverity(f.severity)});` : ''} box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);">
                        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1.5rem; border-bottom: 1px solid ${c.border}; padding-bottom: 1rem; page-break-after: avoid;">
                            <div style="min-width:0;">
                                <span style="display:inline-block;font-family:ui-monospace,monospace;font-size:0.7rem;font-weight:700;color:${c.textGray};border:1px solid ${c.border};border-radius:5px;padding:0.1rem 0.45rem;margin-bottom:0.4rem;">${findingCode(idx)}</span>
                                <h3 style="font-size: 1.5rem; font-weight: 800; color: ${c.textHeading}; margin: 0;">${idx + 1}. ${escapeHTML(f.title)}</h3>
                            </div>
                            <div style="display:flex;flex-direction:column;align-items:flex-end;gap:0.4rem;margin-left:1rem;">
                                <div style="background-color: var(--severity-${safeSeverity(f.severity)}); color: white; padding: 0.5rem 1rem; border-radius: 8px; font-weight: 700; font-size: 0.875rem; text-transform: uppercase; white-space: nowrap;">
                                    ${t.severityLevels[safeSeverity(f.severity)]}
                                </div>
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

                        ${renderFindingProMeta(f, c, t)}

                        ${f.description ? `
                            <div style="margin-bottom: 1.5rem;">
                                <h4 style="font-size: 1.125rem; font-weight: 700; color: ${c.textMuted}; margin-bottom: 0.75rem; display: flex; align-items: center; gap: 0.5rem;">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
                                    ${t.description}
                                </h4>
                                <div style="color: ${c.textFaint}; line-height: 1.65; word-wrap: break-word; text-align: justify;">${markdownToHtml(f.description)}</div>
                            </div>
                        ` : ''}

                        ${f.poc ? `
                            <div style="margin-bottom: 1.5rem; background: ${c.pocBg}; color: ${c.pocText}; padding: 1.5rem; border-radius: 8px; border: 1px solid ${c.pocBorder}; overflow: hidden; max-width: 100%; break-inside: avoid;">
                                <h4 style="font-size: 1.125rem; font-weight: 700; color: ${c.pocHeading}; margin-bottom: 0.75rem; display: flex; align-items: center; gap: 0.5rem;">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="${c.pocHeading}" stroke-width="2"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>
                                    ${t.pocSteps}
                                </h4>
                                <div style="font-size: 0.88rem; line-height: 1.7; color: ${c.pocText}; text-align: left; word-break: break-word; max-width: 100%;">${markdownToHtml(f.poc)}</div>
                            </div>
                        ` : ''}

                        ${f.exploit ? `
                            <div style="margin-bottom: 1.5rem;">
                                ${renderCodeBlock(f.exploit, '', { title: t.exploitCode })}
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
                                            <img src="${escapeHTML(img)}" alt="${t.evidence} ${imgIdx + 1}" style="width: 100%; height: auto; border-radius: 4px; display: block;">
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
                                <div style="color: ${c.textFaint}; line-height: 1.65; word-wrap: break-word; text-align: justify;">${markdownToHtml(f.impact)}</div>
                            </div>
                        ` : ''}

                        ${f.remediation ? `
                            <div style="margin-bottom: 0; background: ${c.greenBg}; padding: 1.5rem; border-radius: 8px; border: 1px solid ${c.borderGreen};">
                                <h4 style="font-size: 1.125rem; font-weight: 700; color: ${c.textGreen}; margin-bottom: 0.75rem; display: flex; align-items: center; gap: 0.5rem;">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                                    ${t.solutionRemediation}
                                </h4>
                                <div style="color: ${c.textGreenDark}; line-height: 1.65; word-wrap: break-word; text-align: justify;">${markdownToHtml(f.remediation)}</div>
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
                        ${markdownToHtml(d.auditSummary)}
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
                        ${markdownToHtml(d.testsPerformed)}
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
                        ${markdownToHtml(d.recommendedSolutions)}
                    </div>
                </div>
                ` : ''}
            </div>
            ` : ''}

            <!-- CONTROL DE VERSIONES -->
            ${renderRevisionHistoryPreview(c, t)}
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
                    <button class="btn-secondary" onclick="openDbPasswordModal()">
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
                    <input type="file" id="db-import-input" accept=".db,.pdb" style="display:none" onchange="importDatabase(this)">
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
                        <div class="report-card-actions" onclick="event.stopPropagation()">
                            <button class="report-card-icon-btn danger" title="${state.lang === 'es' ? 'Eliminar reporte' : 'Delete report'}" onclick="deleteReport(${r.id})">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                            </button>
                        </div>
                        <h3>${escapeHTML(r.document_title)}</h3>
                        <p>${escapeHTML(r.client_company)}</p>
                        <span>${r.findings_count || 0} ${state.lang === 'es' ? 'hallazgos' : 'findings'}</span>
                    </div>
                `).join('')}
            </div>

            <footer class="made-by-footer">
                <span>${state.lang === 'es' ? 'Un proyecto hecho con' : 'A project made with'}</span>
                <svg class="made-by-heart" width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-label="${state.lang === 'es' ? 'amor' : 'love'}">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                </svg>
                <span>${state.lang === 'es' ? 'por' : 'by'}</span>
                <a href="https://www.linkedin.com/in/maalfer1/" target="_blank" rel="noopener noreferrer">Mario Álvarez</a>
                <span>${state.lang === 'es' ? 'y' : 'and'}</span>
                <a href="https://es.linkedin.com/in/thomasoneil%C3%A1lvarez" target="_blank" rel="noopener noreferrer">Thomas O'Neil</a>
            </footer>
        </div>
    `;
}

function renderSettingsModal() {
    if (!state.showSettings) return '';
    const isEs = state.lang === 'es';

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
                    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:0.5rem;">
                        <p class="settings-section-title" style="margin:0;">${isEs ? 'Tema del informe' : 'Report theme'}</p>
                        <div style="display:flex;gap:0.4rem;flex-wrap:wrap;">
                            <button class="btn-sm btn-secondary" onclick="openThemeEditor(null)" title="${isEs ? 'Abrir el estudio para crear y personalizar un tema' : 'Open the studio to create and customize a theme'}">
                                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:-2px;margin-right:3px;"><circle cx="13.5" cy="6.5" r=".5"/><circle cx="17.5" cy="10.5" r=".5"/><circle cx="8.5" cy="7.5" r=".5"/><circle cx="6.5" cy="12.5" r=".5"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/></svg>${isEs ? 'Crear / Personalizar' : 'Create / Customize'}</button>
                            <button class="btn-sm btn-secondary" onclick="document.getElementById('theme-import-input').click()" title="${isEs ? 'Importar tema (.json o .html)' : 'Import theme (.json or .html)'}">${isEs ? 'Importar' : 'Import'}</button>
                            <input type="file" id="theme-import-input" accept=".json,application/json,.html,.htm,text/html" style="display:none" onchange="importThemeFile(this)">
                        </div>
                    </div>
                    <div class="theme-card-grid">
                        ${listAllThemes().map(th => {
                            const selected = state.reportTheme === th.slug;
                            const pal = resolveThemePalette(th.slug);
                            return `
                            <div class="theme-card ${selected ? 'selected' : ''}" onclick="setReportTheme('${th.slug}')">
                                <div class="theme-card-swatch" style="background:${pal.pageBg};">
                                    <span style="background:${pal.accentLine};"></span>
                                    <span style="background:${pal.cardBg};border:1px solid ${pal.border};"></span>
                                    <span style="background:${pal.textHeading};"></span>
                                </div>
                                <div class="theme-card-name">
                                    <span>${escapeHTML(th.name)}</span>
                                    ${selected ? `<svg class="settings-check" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><polyline points="20 6 9 17 4 12"/></svg>` : ''}
                                </div>
                                ${!th.builtin ? `
                                <div class="theme-card-actions" onclick="event.stopPropagation()">
                                    <button title="${isEs ? 'Editar' : 'Edit'}" onclick="openThemeEditor('${th.slug}')">
                                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                                    </button>
                                    <button title="${isEs ? 'Exportar' : 'Export'}" onclick="exportTheme('${th.slug}')">
                                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                                    </button>
                                    <button title="${isEs ? 'Eliminar' : 'Delete'}" onclick="deleteCustomTheme(${th.id}, '${th.slug}')">
                                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                                    </button>
                                </div>` : `<button title="${isEs ? 'Exportar' : 'Export'}" class="theme-card-export-only" onclick="event.stopPropagation(); exportTheme('${th.slug}')">
                                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                                </button>`}
                            </div>`;
                        }).join('')}
                    </div>
                    ${state.themeManagerSuccess ? `<div class="login-success" style="margin-top:0.6rem;">${escapeHTML(state.themeManagerSuccess)}</div>` : ''}
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
        <div class="settings-overlay" style="align-items:center;justify-content:center;padding:1rem;" onclick="closeDemoModal()">
            <div class="settings-modal" style="width:100%;max-width:520px;transform-origin:center center;" onclick="event.stopPropagation()">
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

function renderPdfModal() {
    if (!state.showPdfModal) return '';
    const t = UI[state.lang];
    const c = getThemeColors();

    const sunIcon  = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>`;
    const moonIcon = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`;
    const termIcon = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/></svg>`;
    const crossIcon = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><line x1="12" y1="2" x2="12" y2="6"/><line x1="12" y1="18" x2="12" y2="22"/><line x1="2" y1="12" x2="6" y2="12"/><line x1="18" y1="12" x2="22" y2="12"/></svg>`;

    function themeCard(id, label, icon) {
        const active     = state.pdfPrintTheme === id;
        const activeBg   = id === 'htb' ? '#9fef00' : id === 'redteam' ? '#ef4444' : '#3b82f6';
        const activeText = id === 'htb' ? '#1a2332' : '#ffffff';
        return `<button id="pdf-theme-btn-${id}" onclick="pdfModalSetTheme('${id}')"
            style="flex:1;display:flex;flex-direction:column;align-items:center;gap:0.5rem;padding:0.875rem 0.5rem;border-radius:10px;
                   border:2px solid ${active ? activeBg : c.border};
                   background:${active ? activeBg : c.cardBg};
                   color:${active ? activeText : c.textMuted};
                   cursor:pointer;font-weight:${active ? '700' : '500'};font-size:0.875rem;transition:all 0.15s;">
            ${icon}${label}
        </button>`;
    }

    const toggleOn  = state.pdfShowSeverityBars;
    const toggleBg  = toggleOn ? '#3b82f6' : c.border;
    const thumbLeft = toggleOn ? '22px' : '2px';
    const panelBg   = state.reportTheme === 'htb' ? '#04090e' : state.reportTheme === 'dark' ? '#070d18' : state.reportTheme === 'redteam' ? '#140809' : '#dde3ea';
    const dotMuted  = state.reportTheme !== 'light' ? '#4a5568' : '#b0bec5';

    return `
        <div class="settings-overlay" style="align-items:center;justify-content:center;padding:1rem;" onclick="closePdfModal()">
            <div class="settings-modal" style="width:100%;max-width:860px;display:flex;flex-direction:column;max-height:90vh;" onclick="event.stopPropagation()">

                <!-- Header -->
                <div class="settings-modal-header" style="flex-shrink:0;">
                    <div style="display:flex;align-items:center;gap:0.5rem;">
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                        <span>${t.pdfModalTitle}</span>
                    </div>
                    <button class="settings-close-btn" onclick="closePdfModal()">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                    </button>
                </div>

                <!-- Two-column body -->
                <div style="display:flex;min-height:0;flex:1;overflow:hidden;">

                    <!-- LEFT: Controls -->
                    <div style="width:272px;flex-shrink:0;border-right:1px solid ${c.border};padding:1.375rem;display:flex;flex-direction:column;gap:1.25rem;overflow-y:auto;">

                        <!-- Theme -->
                        <div>
                            <p style="font-size:0.72rem;font-weight:700;text-transform:uppercase;letter-spacing:0.07em;color:${c.textMuted};margin-bottom:0.625rem;">${t.pdfModalTheme}</p>
                            <div style="display:flex;gap:0.5rem;flex-wrap:wrap;">
                                ${themeCard('light',   t.pdfModalThemeLight,   sunIcon)}
                                ${themeCard('dark',    t.pdfModalThemeDark,    moonIcon)}
                                ${themeCard('htb',     t.pdfModalThemeHtb,     termIcon)}
                                ${themeCard('redteam', t.pdfModalThemeRedteam, crossIcon)}
                            </div>
                        </div>

                        <div style="border-top:1px solid ${c.border};"></div>

                        <!-- Severity bars -->
                        <div style="display:flex;justify-content:space-between;align-items:center;gap:0.75rem;">
                            <div style="min-width:0;">
                                <p style="font-weight:600;font-size:0.875rem;color:${c.textHeading};margin-bottom:0.2rem;">${t.pdfModalSeverityBars}</p>
                                <p style="font-size:0.775rem;color:${c.textFaint};margin:0;line-height:1.4;">${t.pdfModalSeverityBarsDesc}</p>
                            </div>
                            <label style="position:relative;display:inline-flex;align-items:center;cursor:pointer;flex-shrink:0;">
                                <input type="checkbox" style="opacity:0;position:absolute;width:0;height:0;" ${toggleOn ? 'checked' : ''} onchange="pdfModalSetBars(this.checked)">
                                <div id="pdf-toggle-bg" style="width:44px;height:24px;background:${toggleBg};border-radius:12px;position:relative;transition:background 0.2s;">
                                    <div id="pdf-toggle-thumb" style="position:absolute;top:2px;left:${thumbLeft};width:20px;height:20px;background:white;border-radius:50%;transition:left 0.2s;box-shadow:0 1px 3px rgba(0,0,0,0.25);"></div>
                                </div>
                            </label>
                        </div>

                        <div style="border-top:1px solid ${c.border};"></div>

                        <!-- Content width -->
                        <div>
                            <p style="font-size:0.72rem;font-weight:700;text-transform:uppercase;letter-spacing:0.07em;color:${c.textMuted};margin-bottom:0.25rem;">${t.pdfModalContentWidth}</p>
                            <p style="font-size:0.75rem;color:${c.textFaint};margin:0 0 0.875rem;line-height:1.4;">${t.pdfModalContentWidthDesc}</p>
                            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:0.375rem;">
                                <span style="font-size:0.8rem;color:${c.textFaint};">${t.pdfModalContentWidthNarrow}</span>
                                <span id="pdf-content-width-val" style="font-size:0.875rem;font-weight:700;color:#3b82f6;">${state.pdfContentWidth} px</span>
                                <span style="font-size:0.8rem;color:${c.textFaint};">${t.pdfModalContentWidthWide}</span>
                            </div>
                            <input type="range" min="580" max="1100" step="20" value="${state.pdfContentWidth}"
                                oninput="pdfModalSetContentWidth(this.value)"
                                style="width:100%;accent-color:#3b82f6;cursor:pointer;">
                        </div>

                        <!-- Spacer + Buttons -->
                        <div style="flex:1;min-height:0.5rem;"></div>
                        <div style="display:flex;flex-direction:column;gap:0.5rem;">
                            <button class="btn-primary" id="pdf-confirm-btn" onclick="executePdfGeneration()" style="width:100%;justify-content:center;gap:0.5rem;">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
                                ${t.pdfModalGenerate}
                            </button>
                            <button class="btn-secondary" onclick="closePdfModal()" style="width:100%;justify-content:center;">${t.pdfModalCancel}</button>
                        </div>
                    </div>

                    <!-- RIGHT: Live preview -->
                    <div style="flex:1;background:${panelBg};overflow:hidden;position:relative;min-height:480px;">
                        <div style="position:absolute;top:0;left:0;right:0;height:28px;display:flex;align-items:center;padding:0 0.75rem;gap:0.35rem;z-index:5;">
                            <span style="font-size:0.67rem;font-weight:600;color:${dotMuted};text-transform:uppercase;letter-spacing:0.06em;">Vista Previa</span>
                        </div>
                        <div id="pdf-preview-panel" style="position:absolute;inset:0;top:28px;overflow-y:auto;overflow-x:hidden;">
                            ${renderPdfPreviewHtml(state.pdfPrintTheme, state.pdfShowSeverityBars, state.pdfContentWidth)}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    `;
}

function openPdfModal() {
    // Usamos las preferencias persistidas en la BD (no reseteamos en cada apertura).
    state.showPdfModal = true;
    renderApp();
}

function closePdfModal() {
    state.showPdfModal = false;
    renderApp();
}

function pdfModalSetTheme(theme) {
    state.pdfPrintTheme = theme;
    const c = getThemeColors();
    ['light', 'dark', 'htb', 'redteam'].forEach(id => {
        const btn = document.getElementById('pdf-theme-btn-' + id);
        if (!btn) return;
        const isActive   = id === theme;
        const activeBg   = id === 'htb' ? '#9fef00' : id === 'redteam' ? '#ef4444' : '#3b82f6';
        const activeText = id === 'htb' ? '#1a2332' : '#ffffff';
        btn.style.background  = isActive ? activeBg   : c.cardBg;
        btn.style.borderColor = isActive ? activeBg   : c.border;
        btn.style.color       = isActive ? activeText : c.textMuted;
        btn.style.fontWeight  = isActive ? '700'      : '500';
    });
    persistSettings();
    updatePdfModalPreview();
}

function pdfModalSetBars(checked) {
    state.pdfShowSeverityBars = checked;
    const c     = getThemeColors();
    const bg    = document.getElementById('pdf-toggle-bg');
    const thumb = document.getElementById('pdf-toggle-thumb');
    if (bg)    bg.style.background = checked ? '#3b82f6' : c.border;
    if (thumb) thumb.style.left    = checked ? '22px'   : '2px';
    persistSettings();
    updatePdfModalPreview();
}

let _pdfWidthTimer = null;

function pdfModalSetContentWidth(v) {
    state.pdfContentWidth = parseInt(v);
    const el = document.getElementById('pdf-content-width-val');
    if (el) el.textContent = v + ' px';
    persistSettings();
    clearTimeout(_pdfWidthTimer);
    _pdfWidthTimer = setTimeout(updatePdfModalPreview, 200);
}

function updatePdfModalPreview() {
    const panel = document.getElementById('pdf-preview-panel');
    if (!panel) return;
    panel.innerHTML = renderPdfPreviewHtml(state.pdfPrintTheme, state.pdfShowSeverityBars, state.pdfContentWidth);
}

function renderPdfPreviewHtml(previewTheme, showBars, contentWidth) {
    const saved = {
        reportTheme:          state.reportTheme,
        pdfShowSeverityBars:  state.pdfShowSeverityBars,
        pdfContentWidth:      state.pdfContentWidth,
        activeTab:            state.activeTab,
        showSplash:           state.showSplash,
        showReportSelector:   state.showReportSelector,
    };

    state.reportTheme        = previewTheme;
    state.pdfShowSeverityBars = showBars;
    state.pdfContentWidth    = contentWidth || 820;
    state.activeTab          = 'preview';
    state.showSplash         = false;
    state.showReportSelector = false;

    const html = renderPreview();

    state.reportTheme        = saved.reportTheme;
    state.pdfShowSeverityBars = saved.pdfShowSeverityBars;
    state.pdfContentWidth    = saved.pdfContentWidth;
    state.activeTab          = saved.activeTab;
    state.showSplash         = saved.showSplash;
    state.showReportSelector = saved.showReportSelector;

    const c2   = getThemeColorsFor(previewTheme);
    const ZOOM = 0.42;

    return `
        <style>
            #_pdf_inner .preview-container {
                border-radius: 0 !important;
                box-shadow: none !important;
                margin: 0 auto !important;
                background: ${c2.pageBg} !important;
            }
        </style>
        <div data-rt-theme="${escapeHTML(previewTheme)}" style="background:${c2.pageBg};">
            <div id="_pdf_inner" data-rt-theme="${escapeHTML(previewTheme)}" style="zoom:${ZOOM};background:${c2.pageBg};">
                ${html}
            </div>
        </div>`;
}

function renderLogin() {
    const t = UI[state.lang];
    return `
        <div class="login-screen">
            <div class="login-card">
                <div class="login-brand">
                    <img src="/assets/logo-transparent.png" alt="Pentestify">
                    <div>
                        <h1>${t.appTitle}</h1>
                        <p>${t.loginSubtitle}</p>
                    </div>
                </div>

                <form onsubmit="doLogin(event)" autocomplete="on">
                    <label class="login-label">${t.loginUser}</label>
                    <input type="text" id="loginUsername" class="login-input" autocomplete="username"
                           value="${escapeHTML(state.loginUsername)}" oninput="state.loginUsername = this.value" autofocus>

                    <label class="login-label">${t.loginPass}</label>
                    <input type="password" id="loginPassword" class="login-input" autocomplete="current-password"
                           value="${escapeHTML(state.loginPassword)}" oninput="state.loginPassword = this.value">

                    ${state.loginError ? `<div class="login-error">${escapeHTML(state.loginError)}</div>` : ''}

                    <button type="submit" class="login-btn" ${state.loginLoading ? 'disabled' : ''}>
                        ${state.loginLoading ? t.loginLoading : t.loginBtn}
                    </button>
                </form>

                ${state.showDefaultCredsHint ? `
                <div class="login-default-creds">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
                    <span>${t.defaultCredsHint}
                        <code>${t.defaultCredsUserLabel}: admin</code>
                        <code>${t.defaultCredsPassLabel}: admin</code>
                    </span>
                </div>` : ''}

                <div class="login-version">v${APP_VERSION}</div>
            </div>
        </div>
    `;
}

function renderSetup() {
    const t = UI[state.lang];
    return `
        <div class="login-screen">
            <div class="login-card">
                <div class="login-brand">
                    <img src="/assets/logo-transparent.png" alt="Pentestify">
                    <div>
                        <h1>${t.setupTitle}</h1>
                        <p>${t.setupSubtitle}</p>
                    </div>
                </div>

                <form onsubmit="doSetup(event)" autocomplete="off">
                    <label class="login-label">${t.loginUser}</label>
                    <input type="text" id="setupUsername" class="login-input" autocomplete="username"
                           value="${escapeHTML(state.setupUsername)}" oninput="state.setupUsername = this.value" autofocus>

                    <label class="login-label">${t.loginPass}</label>
                    <input type="password" id="setupPassword" class="login-input" autocomplete="new-password"
                           value="${escapeHTML(state.setupPassword)}" oninput="state.setupPassword = this.value">

                    ${state.setupError ? `<div class="login-error">${escapeHTML(state.setupError)}</div>` : ''}

                    <button type="submit" class="login-btn" ${state.setupLoading ? 'disabled' : ''}>
                        ${state.setupLoading ? t.setupLoading : t.setupBtn}
                    </button>
                </form>

                <div class="login-version">v${APP_VERSION}</div>
            </div>
        </div>
    `;
}

function renderAccountPage() {
    const t = UI[state.lang];

    // Cualquier usuario —incluido el propio— se puede eliminar mientras quede al
    // menos otro registrado. Si sólo hay uno, no se muestra el botón de borrar.
    const canDelete = state.users.length > 1;
    const userRows = state.users.length
        ? state.users.map(u => {
            const isSelf = u.username === state.authUsername;
            return `
                <div class="account-user-row">
                    <div class="account-user-info">
                        <span class="account-user-avatar">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                        </span>
                        <span class="account-user-name">${escapeHTML(u.username)}</span>
                        ${isSelf ? `<span class="account-user-badge">${t.youLabel}</span>` : ''}
                    </div>
                    ${canDelete
                        ? `<button class="account-user-delete" onclick="deleteUser(${u.id})" title="${t.deleteLabel}">
                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                           </button>`
                        : ''
                    }
                </div>`;
        }).join('')
        : `<p class="account-empty">${t.noUsers}</p>`;

    return `
        <div class="account-page">
            <header class="account-header">
                <div class="account-header-brand">
                    <img src="/assets/logo-transparent.png" alt="Pentestify">
                    <div>
                        <h1>${t.accountTitle}</h1>
                        <p>${t.accountSubtitle}</p>
                    </div>
                </div>
                <div class="account-header-actions">
                    <a class="account-back-btn" href="/">
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
                        ${t.backToApp}
                    </a>
                    <button class="profile-logout-btn" onclick="doLogout()">
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                        ${t.logout}
                    </button>
                </div>
            </header>

            <div class="account-container">
                <div class="account-card">
                    <div class="account-signed-in">
                        <span class="account-user-avatar account-user-avatar--lg">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                        </span>
                        <div>
                            <span class="account-signed-in-label">${t.signedInAs}</span>
                            <strong>${escapeHTML(state.authUsername)}</strong>
                        </div>
                    </div>
                </div>

                <div class="account-grid">
                    <div class="account-card">
                        <h2 class="account-section-title">${t.changePassword}</h2>
                        <form onsubmit="doChangePassword(event)" class="profile-form">
                            <label class="login-label">${t.currentPassword}</label>
                            <input type="password" id="currentPassword" class="login-input" autocomplete="current-password">

                            <label class="login-label">${t.newPassword}</label>
                            <input type="password" id="newPassword" class="login-input" autocomplete="new-password">

                            <label class="login-label">${t.confirmPassword}</label>
                            <input type="password" id="confirmPassword" class="login-input" autocomplete="new-password">

                            ${state.profileError ? `<div class="login-error">${escapeHTML(state.profileError)}</div>` : ''}
                            ${state.profileSuccess ? `<div class="login-success">${escapeHTML(state.profileSuccess)}</div>` : ''}

                            <button type="submit" class="login-btn" style="margin-top:0.85rem;">${t.savePassword}</button>
                        </form>
                    </div>

                    <div class="account-card">
                        <h2 class="account-section-title">${t.manageUsers}</h2>

                        <p class="account-shared-note">${t.sharedDataNote}</p>

                        <p class="account-subsection-title">${t.existingUsers}${state.users.length ? `<span class="account-user-count">${state.users.length}</span>` : ''}</p>
                        <div class="account-user-list">
                            ${userRows}
                        </div>

                        <div class="account-divider"></div>

                        <p class="account-subsection-title">${t.createUser}</p>
                        <form onsubmit="createUser(event)">
                            <label class="login-label">${t.loginUser}</label>
                            <input type="text" id="newUserName" class="login-input" autocomplete="off">

                            <label class="login-label">${t.loginPass}</label>
                            <input type="password" id="newUserPassword" class="login-input" autocomplete="new-password">

                            ${state.userMgmtError ? `<div class="login-error">${escapeHTML(state.userMgmtError)}</div>` : ''}
                            ${state.userMgmtSuccess ? `<div class="login-success">${escapeHTML(state.userMgmtSuccess)}</div>` : ''}

                            <button type="submit" class="login-btn" style="margin-top:0.85rem;">${t.createUserBtn}</button>
                        </form>
                    </div>
                </div>

                ${renderMcpSection()}

            </div>
        </div>
    `;
}

// Sustituye las imágenes data URL (base64) por un marcador para que el código
// fuente sea legible (si no, cada evidencia añadiría megas de base64).
function reportSourceForView(html) {
    return html.replace(
        /(data:image\/[a-zA-Z0-9.+-]+;base64,)[A-Za-z0-9+/=\s]+/g,
        '$1…(base64 de la imagen omitido en la vista de código)…'
    );
}

function setPreviewView(mode) {
    state.previewSourceView = (mode === 'source');
    renderApp();
}

async function copyReportSource() {
    const isEs = state.lang === 'es';
    try {
        await navigator.clipboard.writeText(renderPreview());
        alert(isEs ? 'Código fuente copiado al portapapeles' : 'Source code copied to clipboard');
    } catch (e) {
        alert((isEs ? 'No se pudo copiar: ' : 'Could not copy: ') + e.message);
    }
}

// Pestaña "Vista Previa": añade un selector para alternar entre el reporte
// renderizado y su código fuente HTML. La barra es no-print y se omite en modo
// impresión (PDF / exportación HTML) para no contaminar el documento final.
function renderPreviewArea() {
    if (state.activeTab !== 'preview' || state.showSplash || state.showReportSelector) return '';

    const reportHtml = renderPreview();

    const printMode = new URLSearchParams(window.location.search).get('print_mode') === 'true';
    if (printMode) return reportHtml; // exportación/impresión: solo el reporte

    const isEs = state.lang === 'es';
    const src = !!state.previewSourceView;

    // Conmutador discreto (segmentado) alineado a la derecha sobre el informe.
    const toolbar = `
        <div class="preview-view-switch no-print">
            <div class="preview-view-seg" role="tablist">
                <button class="${!src ? 'active' : ''}" onclick="setPreviewView('rendered')" title="${isEs ? 'Vista renderizada' : 'Rendered view'}">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/></svg>
                    <span>${isEs ? 'Renderizado' : 'Rendered'}</span>
                </button>
                <button class="${src ? 'active' : ''}" onclick="setPreviewView('source')" title="${isEs ? 'Código fuente HTML' : 'HTML source'}">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
                    <span>${isEs ? 'Código' : 'Source'}</span>
                </button>
            </div>
            ${src ? `<button class="preview-view-copy" onclick="copyReportSource()" title="${isEs ? 'Copiar código' : 'Copy source'}">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
            </button>` : ''}
        </div>`;

    if (!src) return toolbar + reportHtml;

    const code = escapeHTML(reportSourceForView(reportHtml));
    const sourceView = `
        <div class="no-print" style="max-width:980px;margin:0 auto;background:#0d1117;border:1px solid #1e293b;border-radius:10px;overflow:hidden;">
            <div style="padding:0.6rem 1rem;border-bottom:1px solid #1e293b;color:#93c5fd;font-family:ui-monospace,monospace;font-size:0.75rem;">
                ${isEs ? 'Código fuente del reporte (HTML)' : 'Report source code (HTML)'}
            </div>
            <pre style="margin:0;padding:1.1rem;overflow:auto;max-height:75vh;"><code style="font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,monospace;font-size:0.78rem;line-height:1.6;color:#e2e8f0;white-space:pre;">${code}</code></pre>
        </div>`;

    return toolbar + sourceView;
}

function renderApp() {
    const app = $('#app');

    // Mientras no se haya comprobado la sesión, no pintamos nada (evita parpadeo
    // del login antes de validar la cookie existente).
    if (!state.authChecked) {
        app.innerHTML = '';
        return;
    }

    // Puerta de autenticación: sin sesión válida sólo se muestra el login,
    // salvo en el primer arranque (sin usuarios), donde se pide crear la cuenta.
    if (!state.isAuthenticated) {
        app.innerHTML = state.needsSetup ? renderSetup() : renderLogin();
        return;
    }

    // Página de cuenta / gestión de usuarios (se abre en pestaña nueva con ?account=1).
    if (state.isAccountView) {
        app.innerHTML = renderAccountPage();
        return;
    }

    // Estudio de temas a página completa.
    if (state.isThemeStudio && state.themeEditor) {
        app.innerHTML = renderThemeStudio();
        return;
    }

    app.innerHTML = `
        ${renderSplashScreen()}
        ${renderNavbar()}
        <main class="main-content">
            ${renderReportsPage()}
            ${renderEditor()}
            ${renderPreviewArea()}
        </main>
        ${renderSettingsModal()}
        ${renderCvssCalcModal()}
        ${renderDemoModal()}
        ${renderPdfModal()}
        ${renderDbPasswordModal()}
        ${renderRevisionModal()}
        ${renderPasswordWarningModal()}
    `;
}

// Aviso al entrar con las credenciales por defecto (admin/admin). El usuario
// puede ir directo a cambiar la contraseña o cerrarlo si no le interesa.
function renderPasswordWarningModal() {
    if (!state.usingDefaultPassword || state.passwordWarningDismissed) return '';
    const t = UI[state.lang];
    return `
        <div class="settings-overlay pw-warn-overlay" style="align-items:center;justify-content:center;padding:1rem;" onclick="if(event.target===this)dismissPasswordWarning()">
            <div class="settings-modal pw-warn-modal" style="width:100%;max-width:440px;" role="alertdialog" aria-modal="true" onclick="event.stopPropagation()">
                <div class="settings-modal-header">
                    <span style="display:inline-flex;align-items:center;gap:0.5rem;">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 9v4"/><path d="M12 17h.01"/><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/></svg>
                        ${t.pwWarnTitle}
                    </span>
                    <button class="settings-close-btn" onclick="dismissPasswordWarning()" aria-label="${t.pwWarnDismiss}">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                    </button>
                </div>
                <div class="settings-section">
                    <p style="font-size:0.88rem;color:var(--gray-500,#6b7280);line-height:1.6;margin:0 0 1.1rem;">
                        ${t.pwWarnBody}
                    </p>
                    <div style="display:flex;gap:0.6rem;">
                        <button type="button" class="btn-secondary" style="flex:1;" onclick="dismissPasswordWarning()">${t.pwWarnDismiss}</button>
                        <button type="button" class="login-btn" style="flex:1;margin:0;" onclick="goToChangePassword()">${t.pwWarnCta}</button>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function dismissPasswordWarning() {
    state.passwordWarningDismissed = true;
    renderApp();
}

// Lleva al usuario a la página de cuenta, donde está el formulario de cambio de
// contraseña. Cerramos antes el modal para no arrastrarlo a la nueva vista.
function goToChangePassword() {
    state.passwordWarningDismissed = true;
    window.location.href = '/?account=1';
}

// --------------------------------------------------------------------------- //
// Handlers de autenticación
// --------------------------------------------------------------------------- //
async function doLogin(event) {
    if (event) event.preventDefault();
    if (state.loginLoading) return;
    const t = UI[state.lang];

    state.loginError = '';
    state.loginLoading = true;
    renderApp();

    try {
        const result = await API.auth.login({
            username: state.loginUsername,
            password: state.loginPassword
        });
        state.isAuthenticated = true;
        state.authUsername = result.username;
        state.loginPassword = '';
        state.loginError = '';
        // Si se entra con la contraseña por defecto, mostramos el aviso al entrar.
        state.usingDefaultPassword = !!result.using_default_password;
        state.passwordWarningDismissed = false;
        // Tras iniciar sesión cargamos los temas personalizados y aplicamos el
        // tema guardado (la cookie no existía durante el arranque inicial).
        await loadCustomThemes();
        const savedTheme = localStorage.getItem('pentestify_theme');
        state.reportTheme = (savedTheme && listAllThemes().some(t => t.slug === savedTheme)) ? savedTheme : 'light';
        await loadSettings();
        applyThemeAttributes(state.reportTheme);
        // Si se inició sesión directamente en la página de cuenta, cargamos usuarios.
        if (state.isAccountView) {
            await loadUsers();
        }
    } catch (err) {
        state.loginError = (state.lang === 'es'
            ? 'Usuario o contraseña incorrectos'
            : 'Invalid username or password');
    } finally {
        state.loginLoading = false;
        renderApp();
    }
}

async function doSetup(event) {
    if (event) event.preventDefault();
    if (state.setupLoading) return;

    state.setupError = '';
    state.setupLoading = true;
    renderApp();

    try {
        const result = await API.auth.setup({
            username: (state.setupUsername || '').trim(),
            password: state.setupPassword || ''
        });
        // Cuenta creada: la respuesta deja la sesión iniciada (cookie). Entramos.
        state.needsSetup = false;
        state.isAuthenticated = true;
        state.authUsername = result.username;
        state.setupPassword = '';
        state.setupUsername = '';
        state.setupError = '';
        await loadCustomThemes();
        const savedTheme = localStorage.getItem('pentestify_theme');
        state.reportTheme = (savedTheme && listAllThemes().some(t => t.slug === savedTheme)) ? savedTheme : 'light';
        await loadSettings();
        applyThemeAttributes(state.reportTheme);
        if (state.isAccountView) {
            await loadUsers();
        }
    } catch (err) {
        state.setupError = err.message && !err.message.startsWith('HTTP ')
            ? err.message
            : UI[state.lang].setupError;
    } finally {
        state.setupLoading = false;
        renderApp();
    }
}

async function doLogout() {
    try {
        await API.auth.logout();
    } catch (e) { /* la cookie se limpia igualmente */ }
    state.isAuthenticated = false;
    state.showProfile = false;
    state.authUsername = '';
    state.loginUsername = '';
    state.loginPassword = '';
    state.usingDefaultPassword = false;
    state.passwordWarningDismissed = false;
    // Refrescamos la pista de credenciales por si cambió desde el último login.
    await refreshDefaultCredsHint();
    renderApp();
}

// Consulta al backend si el admin sigue con la contraseña por defecto para
// decidir si mostrar la pista bajo el formulario de login.
async function refreshDefaultCredsHint() {
    try {
        const res = await API.auth.defaultCredentials();
        state.showDefaultCredsHint = !!(res && res.default_admin);
    } catch (e) {
        state.showDefaultCredsHint = false;
    }
}

// El perfil ahora vive en una página propia que se abre en una pestaña nueva.
function openProfile() {
    window.open('/?account=1', '_blank');
}

// --------------------------------------------------------------------------- //
// Gestión de usuarios (página de cuenta)
// --------------------------------------------------------------------------- //
async function loadUsers() {
    try {
        state.users = await API.users.list();
    } catch (e) {
        state.users = [];
    }
}

async function createUser(event) {
    if (event) event.preventDefault();
    const username = (($('#newUserName') || {}).value || '').trim();
    const password = ($('#newUserPassword') || {}).value || '';

    state.userMgmtError = '';
    state.userMgmtSuccess = '';

    try {
        await API.users.create({ username, password });
        state.userMgmtSuccess = UI[state.lang].userCreated;
        await loadUsers();
    } catch (err) {
        state.userMgmtError = err.message && !err.message.startsWith('HTTP ')
            ? err.message
            : (state.lang === 'es' ? 'No se pudo crear el usuario' : 'Could not create user');
    }
    renderApp();
}

async function deleteUser(userId) {
    const t = UI[state.lang];
    // El nombre se resuelve desde el estado (no se interpola en el handler inline)
    // para evitar inyección de JavaScript a través del username.
    const target = state.users.find(u => u.id === userId);
    const username = target ? target.username : '';
    if (!confirm(`${t.confirmDeleteUser} "${username}"?`)) return;

    state.userMgmtError = '';
    state.userMgmtSuccess = '';

    try {
        const result = await API.users.delete(userId);
        // Si se eliminó la propia cuenta, la sesión deja de ser válida: cerramos
        // sesión en el cliente y volvemos al login.
        if (result && result.deleted_self) {
            state.isAuthenticated = false;
            state.authUsername = '';
            state.users = [];
            renderApp();
            return;
        }
        state.userMgmtSuccess = t.userDeleted;
        await loadUsers();
    } catch (err) {
        state.userMgmtError = err.message && !err.message.startsWith('HTTP ')
            ? err.message
            : (state.lang === 'es' ? 'No se pudo eliminar el usuario' : 'Could not delete user');
    }
    renderApp();
}

// --------------------------------------------------------------------------- //
// MCP / Agentes IA — gestión de API keys
// --------------------------------------------------------------------------- //
async function loadApiKeys() {
    try {
        state.apiKeys = await API.apiKeys.list();
    } catch (e) {
        state.apiKeys = [];
    }
}

async function loadMcpServerInfo() {
    try {
        const info = await API.mcpConfig.get();
        state.mcpServerPath = info.mcp_server_path || '';
        state.mcpPythonExec = info.python_executable || 'python3';
        state.mcpAvailable = info.mcp_available !== false;
        state.mcpInstallHint = info.install_hint || null;
    } catch (e) {
        state.mcpServerPath = '';
        state.mcpPythonExec = 'python3';
        state.mcpAvailable = null;
        state.mcpInstallHint = null;
    }
}

async function createApiKey(event) {
    if (event) event.preventDefault();
    const isEs = state.lang === 'es';
    const label = (state.mcpKeyLabel || '').trim() || (isEs ? 'Agent Key' : 'Agent Key');

    state.mcpError = '';
    const btn = document.getElementById('mcp-generate-btn');
    if (btn) { btn.disabled = true; btn.textContent = UI[state.lang].mcpGenerating; }

    try {
        const result = await API.apiKeys.create({ label });
        state.mcpNewKey = result;
        state.mcpKeyLabel = '';
        await loadApiKeys();
    } catch (err) {
        state.mcpError = (err.message && !err.message.startsWith('HTTP '))
            ? err.message
            : (isEs ? 'Error al generar la API key' : 'Error generating API key');
    }
    renderApp();
}

async function revokeApiKey(keyId) {
    const t = UI[state.lang];
    if (!confirm(t.mcpRevokeConfirm)) return;
    state.mcpError = '';
    try {
        await API.apiKeys.delete(keyId);
        if (state.mcpNewKey && state.mcpNewKey.id === keyId) state.mcpNewKey = null;
        await loadApiKeys();
    } catch (err) {
        state.mcpError = (err.message && !err.message.startsWith('HTTP '))
            ? err.message
            : t.mcpError;
    }
    renderApp();
}

async function copyText(elementId, btn) {
    const el = document.getElementById(elementId);
    if (!el) return;
    const text = el.tagName === 'TEXTAREA' || el.tagName === 'INPUT' ? el.value : el.textContent;
    try {
        await navigator.clipboard.writeText(text || '');
        if (btn) {
            const orig = btn.textContent;
            btn.textContent = UI[state.lang].mcpCopied || '✓';
            setTimeout(() => { if (btn) btn.textContent = orig; }, 2000);
        }
    } catch (e) {
        alert((state.lang === 'es' ? 'No se pudo copiar: ' : 'Could not copy: ') + e.message);
    }
}

function renderMcpSection() {
    const t = UI[state.lang];
    const isEs = state.lang === 'es';

    // Lista de claves existentes
    const keyRows = state.apiKeys.length
        ? state.apiKeys.map(k => {
            const created = new Date(k.created_at).toLocaleDateString();
            const lastUsed = k.last_used_at
                ? new Date(k.last_used_at).toLocaleDateString()
                : t.mcpNeverUsed;
            return `
                <div class="account-user-row">
                    <div class="account-user-info" style="flex:1;flex-direction:column;align-items:flex-start;gap:0.2rem;">
                        <div style="display:flex;align-items:center;gap:0.6rem;flex-wrap:wrap;">
                            <code style="font-size:0.78rem;background:var(--input-bg,#f8fafc);padding:0.15rem 0.45rem;border-radius:4px;border:1px solid var(--border,#e2e8f0);letter-spacing:0.02em;">${escapeHTML(k.prefix)}…</code>
                            <span style="font-weight:600;font-size:0.875rem;">${escapeHTML(k.label)}</span>
                        </div>
                        <div style="font-size:0.75rem;color:var(--text-muted,#64748b);">
                            ${t.mcpCreatedAt}: ${created} &nbsp;·&nbsp; ${t.mcpLastUsed}: ${lastUsed}
                        </div>
                    </div>
                    <button class="account-user-delete" onclick="revokeApiKey(${k.id})" title="${t.mcpRevoke}">
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                    </button>
                </div>`;
        }).join('')
        : `<p class="account-empty">${t.mcpNoKeys}</p>`;

    // Bloque con la nueva clave (solo visible justo después de generarla)
    const newKeyBlock = state.mcpNewKey ? `
        <div style="margin-top:0.75rem;background:rgba(245,158,11,0.07);border:1px solid rgba(245,158,11,0.3);border-radius:8px;padding:0.875rem 1rem;">
            <div style="display:flex;align-items:center;gap:0.5rem;margin-bottom:0.6rem;color:#f59e0b;font-size:0.8rem;font-weight:600;">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="flex-shrink:0;"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
                ${t.mcpNewKeyWarning}
            </div>
            <div style="display:flex;gap:0.5rem;align-items:center;">
                <code id="mcp-new-key-value" style="flex:1;font-size:0.75rem;word-break:break-all;background:var(--input-bg,#f8fafc);padding:0.5rem 0.75rem;border-radius:6px;border:1px solid var(--border,#e2e8f0);display:block;">${escapeHTML(state.mcpNewKey.key)}</code>
                <button class="btn-sm btn-primary" onclick="copyText('mcp-new-key-value', this)" style="flex-shrink:0;white-space:nowrap;">${t.mcpCopy}</button>
            </div>
        </div>` : '';

    // Config JSON para Claude Desktop
    let configBlock = '';
    if (state.mcpServerPath) {
        const keyForConfig = state.mcpNewKey
            ? state.mcpNewKey.key
            : (state.apiKeys.length ? state.apiKeys[0].prefix + '…REEMPLAZA_CON_TU_CLAVE' : 'ptf_TU_CLAVE_AQUI');

        const configJson = JSON.stringify({
            mcpServers: {
                pentestify: {
                    command: state.mcpPythonExec,
                    args: [state.mcpServerPath],
                    env: {
                        PENTESTIFY_API_URL: window.location.origin,
                        PENTESTIFY_API_KEY: keyForConfig
                    }
                }
            }
        }, null, 2);

        const cliBlock =
            `export PENTESTIFY_API_URL="${window.location.origin}"\n` +
            `export PENTESTIFY_API_KEY="${keyForConfig}"\n` +
            `${state.mcpPythonExec} "${state.mcpServerPath}"`;

        // Conexión remota: el servidor MCP corre en el propio Pentestify (mismo
        // host/puerto, ruta /mcp). No se ejecuta nada en local.
        const remoteCmd =
            `claude mcp add --transport http pentestify ${window.location.origin}/mcp \\\n` +
            `  --header "Authorization: Bearer ${keyForConfig}"`;

        const mcpNotInstalledBanner = state.mcpAvailable === false ? `
            <div style="background:rgba(245,158,11,0.07);border:1px solid rgba(245,158,11,0.3);border-radius:8px;padding:0.75rem 1rem;margin-bottom:1rem;display:flex;gap:0.6rem;align-items:flex-start;">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" stroke-width="2" style="flex-shrink:0;margin-top:1px;"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
                <div style="font-size:0.8rem;color:#f59e0b;line-height:1.5;">
                    <strong>${isEs ? 'Paquete MCP no instalado' : 'MCP package not installed'}</strong> —
                    ${isEs ? 'el servidor MCP requiere Python ≥ 3.10. Instálalo con:' : 'the MCP server requires Python ≥ 3.10. Install with:'}
                    <code style="display:block;margin-top:0.3rem;background:rgba(0,0,0,0.15);padding:0.25rem 0.5rem;border-radius:4px;">${state.mcpInstallHint || "pip install 'mcp>=1.0'"}</code>
                </div>
            </div>` : '';

        configBlock = `
            <div class="account-divider"></div>
            ${mcpNotInstalledBanner}
            <h3 class="account-subsection-title" style="margin-bottom:0.4rem;">${t.mcpConfigTitle}</h3>
            <p style="font-size:0.8rem;color:var(--text-muted,#64748b);margin-bottom:0.6rem;">${t.mcpConfigDesc}</p>
            <div style="position:relative;">
                <pre id="mcp-config-json" style="font-size:0.72rem;background:#0f172a;color:#e2e8f0;padding:1rem 1.1rem;border-radius:8px;overflow-x:auto;margin:0;line-height:1.6;tab-size:2;">${escapeHTML(configJson)}</pre>
                <button class="btn-sm btn-secondary" style="position:absolute;top:0.5rem;right:0.5rem;" onclick="copyText('mcp-config-json', this)">${t.mcpCopy}</button>
            </div>

            <h3 class="account-subsection-title" style="margin:1.25rem 0 0.4rem;">${t.mcpCliTitle}</h3>
            <p style="font-size:0.8rem;color:var(--text-muted,#64748b);margin-bottom:0.6rem;">${t.mcpCliDesc}</p>
            <div style="position:relative;">
                <pre id="mcp-cli-block" style="font-size:0.72rem;background:#0f172a;color:#e2e8f0;padding:1rem 1.1rem;border-radius:8px;overflow-x:auto;margin:0;line-height:1.6;">${escapeHTML(cliBlock)}</pre>
                <button class="btn-sm btn-secondary" style="position:absolute;top:0.5rem;right:0.5rem;" onclick="copyText('mcp-cli-block', this)">${t.mcpCopy}</button>
            </div>

            <h3 class="account-subsection-title" style="margin:1.25rem 0 0.4rem;">${t.mcpRemoteTitle}</h3>
            <p style="font-size:0.8rem;color:var(--text-muted,#64748b);margin-bottom:0.6rem;">${t.mcpRemoteDesc}</p>
            <div style="position:relative;">
                <pre id="mcp-remote-block" style="font-size:0.72rem;background:#0f172a;color:#e2e8f0;padding:1rem 1.1rem;border-radius:8px;overflow-x:auto;margin:0;line-height:1.6;">${escapeHTML(remoteCmd)}</pre>
                <button class="btn-sm btn-secondary" style="position:absolute;top:0.5rem;right:0.5rem;" onclick="copyText('mcp-remote-block', this)">${t.mcpCopy}</button>
            </div>`;
    }

    return `
        <div class="account-card" style="margin-top:1.5rem;">
            <div style="display:flex;align-items:center;gap:0.65rem;margin-bottom:0.3rem;">
                <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color:var(--accent,#6366f1);flex-shrink:0;"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>
                <h2 class="account-section-title" style="margin:0;">${t.mcpTitle}</h2>
            </div>
            <p style="font-size:0.875rem;color:var(--text-muted,#64748b);margin-bottom:1.25rem;">${t.mcpSubtitle}</p>

            <h3 class="account-subsection-title">${t.mcpApiKeysTitle}</h3>
            <p style="font-size:0.8rem;color:var(--text-muted,#64748b);margin-bottom:0.75rem;">${t.mcpApiKeysDesc}</p>

            <div class="account-user-list">${keyRows}</div>
            ${newKeyBlock}

            <div class="account-divider"></div>

            <h3 class="account-subsection-title">${t.mcpGenerateKey}</h3>
            <form onsubmit="createApiKey(event)" style="display:flex;gap:0.6rem;align-items:flex-end;flex-wrap:wrap;">
                <div style="flex:1;min-width:180px;">
                    <label class="login-label">${t.mcpKeyLabelField}</label>
                    <input type="text" id="mcp-key-label" class="login-input" placeholder="${t.mcpKeyLabelPlaceholder}"
                        value="${escapeHTML(state.mcpKeyLabel || '')}"
                        oninput="state.mcpKeyLabel=this.value"
                        style="margin-bottom:0;">
                </div>
                <button type="submit" class="login-btn" id="mcp-generate-btn"
                    style="flex-shrink:0;height:40px;margin-top:0;padding:0 1.25rem;">
                    ${t.mcpGenerate}
                </button>
            </form>
            ${state.mcpError ? `<div class="login-error" style="margin-top:0.5rem;">${escapeHTML(state.mcpError)}</div>` : ''}

            ${configBlock}
        </div>`;
}

async function doChangePassword(event) {
    if (event) event.preventDefault();
    const t = UI[state.lang];
    const current = ($('#currentPassword') || {}).value || '';
    const next = ($('#newPassword') || {}).value || '';
    const confirm = ($('#confirmPassword') || {}).value || '';

    state.profileError = '';
    state.profileSuccess = '';

    if (next !== confirm) {
        state.profileError = t.passwordMismatch;
        renderApp();
        return;
    }

    try {
        const result = await API.auth.changePassword({
            current_password: current,
            new_password: next
        });
        state.profileSuccess = t.passwordChanged;
        state.authUsername = result.username;
        // Ya no usa la contraseña por defecto: el aviso y la pista dejan de salir.
        state.usingDefaultPassword = !!result.using_default_password;
        state.showDefaultCredsHint = false;
        // Limpiamos los campos del formulario tras el éxito.
        ['#currentPassword', '#newPassword', '#confirmPassword'].forEach(id => {
            const el = $(id);
            if (el) el.value = '';
        });
    } catch (err) {
        // El backend devuelve mensajes específicos en err.message (detail de FastAPI).
        state.profileError = err.message && !err.message.startsWith('HTTP ')
            ? err.message
            : (state.lang === 'es' ? 'No se pudo cambiar la contraseña' : 'Could not change password');
    }
    renderApp();
}

// El backend cierra la sesión devolviendo 401: limpiamos el estado y mostramos login.
function handleUnauthorized() {
    if (state.isAuthenticated) {
        state.isAuthenticated = false;
        state.showProfile = false;
        state.authChecked = true;
        renderApp();
    }
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
    persistSettings();

    // Si se está editando un hallazgo cargado desde una plantilla de fábrica,
    // re-aplicamos su prosa en el nuevo idioma. Solo si la plantilla existe de
    // verdad; en caso contrario applyTemplate retornaría sin re-renderizar y el
    // cambio de idioma "se perdería".
    const tk = state.currentFinding.templateKey;
    if (tk && tk !== 'custom' && templates[tk]) {
        applyTemplate(tk);
        return;
    }

    renderApp();
}

function setTab(tab) {
    state.activeTab = tab;
    renderApp();
}


// Aplica el atributo del tema activo al documento. data-rt-theme controla las
// variables CSS del informe; data-theme controla el aspecto de la propia
// interfaz (claro/oscuro) según el tema base.
function applyThemeAttributes(slug) {
    const base = themeBaseOf(slug);
    document.documentElement.setAttribute('data-rt-theme', slug);
    document.documentElement.removeAttribute('data-theme');
    // Red Team es un tema oscuro: el cromado del editor reutiliza el modo "dark"
    // (neutro) y los acentos rojos se aplican vía [data-rt-theme="redteam"].
    if (base === 'dark' || base === 'redteam') document.documentElement.setAttribute('data-theme', 'dark');
    if (base === 'htb')  document.documentElement.setAttribute('data-theme', 'htb');
}

function setReportTheme(theme) {
    // Si el tema ya no existe (p.ej. tras eliminar uno personalizado), caemos a 'light'.
    const exists = listAllThemes().some(t => t.slug === theme);
    if (!exists) theme = 'light';
    state.reportTheme = theme;
    state.isDirty = true;
    applyThemeAttributes(theme);
    localStorage.setItem('pentestify_theme', theme); // cache local rápida (no afecta a la exportación)
    persistSettings();
    renderApp();
}

function generatePdf() {
    openPdfModal();
}

// Parámetros de la vista de impresión del informe (compartidos por PDF y export HTML).
function _reportPrintParams(extra) {
    return new URLSearchParams(Object.assign({
        report_id: state.currentReportId,
        print_mode: 'true',
        lang: state.lang,
        theme: state.pdfPrintTheme,
        show_severity_bars: state.pdfShowSeverityBars,
        content_width: state.pdfContentWidth
    }, extra || {}));
}

function _reportFileName() {
    return [state.auditData.documentTitle, state.auditData.clientCompany]
        .filter(Boolean).join(' - ').replace(/[^a-zA-Z0-9_\-. ]/g, '').trim() || `Report_${state.currentReportId}`;
}

// Genera el PDF mediante la impresión nativa del navegador (Guardar como PDF)
// sobre la vista de impresión del informe. Sin dependencias de servidor.
async function executePdfGeneration() {
    if (state.generatingPdf) return;
    const isEs = state.lang === 'es';

    state.showPdfModal = false;
    state.generatingPdf = true;
    renderApp();

    try {
        await saveCurrentReport(true);
        if (!state.currentReportId) {
            throw new Error(isEs ? 'No se pudo guardar el reporte' : 'Could not save the report');
        }
        const win = window.open('/?' + _reportPrintParams({ auto_print: '1' }).toString(), '_blank');
        if (!win) {
            alert(isEs
                ? 'Permite las ventanas emergentes para generar el PDF (se abrirá el diálogo de impresión → Guardar como PDF).'
                : 'Allow pop-ups to generate the PDF (the print dialog will open → Save as PDF).');
        }
    } catch (e) {
        alert((isEs ? 'Error al generar PDF: ' : 'Error generating PDF: ') + e.message);
    } finally {
        state.generatingPdf = false;
        renderApp();
    }
}

// Construye, en el cliente, un documento HTML autocontenido del informe. Reutiliza
// el render real cargando la vista de impresión en un iframe oculto, incrusta el
// CSS y aísla el informe. Las imágenes ya son data URLs => fichero portable.
function buildSelfContainedReportHtml() {
    const url = '/?' + _reportPrintParams().toString();
    return fetch('/css/styles.css').then(r => r.text()).then(cssText => new Promise((resolve, reject) => {
        const iframe = document.createElement('iframe');
        iframe.style.cssText = 'position:fixed;left:-10000px;top:0;width:1280px;height:1200px;border:0;';
        let tries = 0;
        const cleanup = () => { try { document.body.removeChild(iframe); } catch (_) {} };
        const attempt = () => {
            try {
                const doc = iframe.contentDocument;
                const report = doc && doc.querySelector('.preview-container');
                if (!report) {
                    if (++tries > 50) { cleanup(); reject(new Error('No se pudo renderizar el informe')); return; }
                    setTimeout(attempt, 150);
                    return;
                }
                doc.querySelectorAll('script').forEach(s => s.remove());
                doc.querySelectorAll('link[rel="stylesheet"]').forEach(l => {
                    if ((l.getAttribute('href') || '').indexOf('styles.css') !== -1) l.remove();
                });
                const st = doc.createElement('style');
                st.textContent = cssText;
                doc.head.appendChild(st);
                Array.from(doc.body.children).forEach(el => el.remove());
                doc.body.appendChild(report);
                doc.body.style.cssText = 'margin:0;display:flex;justify-content:center;';
                const html = '<!DOCTYPE html>\n' + doc.documentElement.outerHTML;
                cleanup();
                resolve(html);
            } catch (e) { cleanup(); reject(e); }
        };
        iframe.onload = () => setTimeout(attempt, 500);
        iframe.src = url;
        document.body.appendChild(iframe);
    }));
}

function toggleExportMenu(e) {
    if (e) e.stopPropagation();
    state.exportMenuOpen = !state.exportMenuOpen;
    renderApp();
}

function chooseExport(kind) {
    state.exportMenuOpen = false;
    if (kind === 'pdf') {
        generatePdf();
    } else {
        exportHtml();
    }
}

// Cierra el menú de exportación al hacer clic fuera de él.
document.addEventListener('click', (e) => {
    if (state.exportMenuOpen && !e.target.closest('.export-dropdown')) {
        state.exportMenuOpen = false;
        renderApp();
    }
});

async function exportHtml() {
    if (state.exportingHtml) return;
    const isEs = state.lang === 'es';

    state.exportingHtml = true;
    renderApp();

    try {
        await saveCurrentReport(true);
        if (!state.currentReportId) {
            throw new Error(isEs ? 'No se pudo guardar el reporte' : 'Could not save the report');
        }
        const html = await buildSelfContainedReportHtml();
        _downloadBytes(new TextEncoder().encode(html), `${_reportFileName()}.html`, 'text/html;charset=utf-8');
    } catch (e) {
        alert((isEs ? 'Error al exportar HTML: ' : 'Error exporting HTML: ') + e.message);
    } finally {
        state.exportingHtml = false;
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

// Campo multilínea -> array (una entrada por línea, sin vacíos).
function updateCurrentFindingList(field, value) {
    state.currentFinding[field] = value.split('\n').map(s => s.trim()).filter(Boolean);
}

// Campo separado por comas -> array.
function updateCurrentFindingCsv(field, value) {
    state.currentFinding[field] = value.split(',').map(s => s.trim()).filter(Boolean);
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
        exploit: t.exploit || state.currentFinding.exploit || '',
        impact: t.impact,
        remediation: t.remediation,
        cvss: t.cvss,
        cvssVector: t.cvss_vector || t.cvssVector || state.currentFinding.cvssVector || '',
        reference: t.reference,
        cwe: t.cwe || state.currentFinding.cwe || '',
        owasp: t.owasp || state.currentFinding.owasp || ''
    };

    renderApp();
}

function filterTemplates(query) {
    const select = document.getElementById('templateSelect');
    const filter = query.toLowerCase();

    if (!select) return;

    select.style.display = 'block';

    const options = select.querySelectorAll('option');
    const optgroups = select.querySelectorAll('optgroup');

    options.forEach(option => {
        const text = option.textContent.toLowerCase();
        const value = option.value.toLowerCase();
        if (text.includes(filter) || value.includes(filter) || filter === '') {
            option.style.display = '';
        } else {
            option.style.display = 'none';
        }
    });

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
        const options = select.querySelectorAll('option');
        const optgroups = select.querySelectorAll('optgroup');
        options.forEach(option => option.style.display = '');
        optgroups.forEach(group => group.style.display = '');
    }
    if (searchInput) searchInput.value = '';
}

function hideTemplateDropdown() {
    const select = document.getElementById('templateSelect');
    if (select) {
        select.style.display = 'none';
    }
}

document.addEventListener('click', function(e) {
    const container = document.querySelector('.template-search-container');
    const select = document.getElementById('templateSelect');
    if (container && !container.contains(e.target) && select) {
        select.style.display = 'none';
    }
});

// Aviso no bloqueante (toast). Evita usar alert() en cada auto-guardado.
function showToast(message, type = 'success') {
    let host = document.getElementById('ptf-toast-host');
    if (!host) {
        host = document.createElement('div');
        host.id = 'ptf-toast-host';
        host.style.cssText = 'position:fixed;bottom:20px;right:20px;z-index:99999;display:flex;flex-direction:column;gap:8px;align-items:flex-end;pointer-events:none;';
        document.body.appendChild(host);
    }
    const el = document.createElement('div');
    const bg = type === 'error' ? '#dc2626' : (type === 'info' ? '#2563eb' : '#16a34a');
    el.style.cssText = `background:${bg};color:#fff;font-size:0.85rem;font-weight:600;padding:0.6rem 1rem;border-radius:8px;box-shadow:0 6px 20px rgba(0,0,0,0.25);opacity:0;transform:translateY(8px);transition:opacity .2s,transform .2s;max-width:340px;`;
    el.textContent = message;
    host.appendChild(el);
    requestAnimationFrame(() => { el.style.opacity = '1'; el.style.transform = 'translateY(0)'; });
    const ttl = type === 'error' ? 5000 : 1800;
    setTimeout(() => {
        el.style.opacity = '0'; el.style.transform = 'translateY(8px)';
        setTimeout(() => el.remove(), 250);
    }, ttl);
}

// Auto-guardado serializado: encadena las llamadas para que nunca se solapen dos
// guardados (p. ej. al registrar/eliminar hallazgos en ráfaga), lo que podría
// provocar carreras en la sincronización de hallazgos. Silencioso salvo error.
let _autoSaveChain = Promise.resolve();
function autoSaveReport(successMsg) {
    _autoSaveChain = _autoSaveChain.then(async () => {
        try {
            await saveCurrentReport(true);
            if (successMsg !== null) {
                showToast(successMsg || (state.lang === 'es' ? 'Guardado automáticamente ✓' : 'Auto-saved ✓'));
            }
        } catch (err) {
            console.error(err);
            state.isDirty = true;
            showToast((state.lang === 'es'
                ? 'No se pudo guardar automáticamente: '
                : 'Auto-save failed: ') + (err && err.message ? err.message : err), 'error');
        }
    });
    return _autoSaveChain;
}

function handleFindingSubmit(e) {
    e.preventDefault();

    const cf = state.currentFinding;
    const finding = {
        id: state.editingFindingIndex !== null ? state.findings[state.editingFindingIndex].id : Date.now(),
        templateKey: cf.templateKey,
        title: $('#findingTitle').value,
        severity: $('#findingSeverity').value,
        description: $('#findingDescription').value,
        cvss: $('#findingCvss').value,
        cvssVector: cf.cvssVector || '',
        poc: $('#findingPoc').value,
        exploit: $('#findingExploit') ? $('#findingExploit').value : (cf.exploit || ''),
        impact: $('#findingImpact').value,
        remediation: $('#findingRemediation').value,
        reference: $('#findingReference').value,
        references: cf.references || [],
        cve: $('#findingCve').value,
        cwe: $('#findingCwe') ? $('#findingCwe').value : (cf.cwe || ''),
        status: cf.status || 'open',
        affectedAssets: cf.affectedAssets || '',
        likelihood: cf.likelihood || '',
        impactRating: cf.impactRating || '',
        owasp: cf.owasp || '',
        compliance: cf.compliance || [],
        retestNotes: cf.retestNotes || '',
        fieldsVisibility: Object.assign({}, cf.fieldsVisibility || {}),
        images: cf.images
    };

    const wasEditing = state.editingFindingIndex !== null;
    if (wasEditing) {
        state.findings[state.editingFindingIndex] = finding;
        state.editingFindingIndex = null;
    } else {
        state.findings.push(finding);
    }

    sortFindingsBySeverity(state.findings);

    state.isDirty = true;

    if (state.currentReportId) {
        localStorage.removeItem('report_' + state.currentReportId + '_draft');
    }

    resetFindingForm();
    renderApp();

    // Auto-guardado: al registrar/actualizar un hallazgo se persiste sin tener que
    // pulsar "Guardar", evitando perder cambios por olvido.
    autoSaveReport(wasEditing
        ? (state.lang === 'es' ? 'Hallazgo actualizado y guardado ✓' : 'Finding updated & saved ✓')
        : (state.lang === 'es' ? 'Hallazgo guardado ✓' : 'Finding saved ✓'));
}

function resetFindingForm() {
    state.editingFindingIndex = null;
    state.currentFinding = {
        templateKey: 'custom',
        title: '',
        severity: 'med',
        description: '',
        cvss: '',
        cvssVector: '',
        poc: '',
        exploit: '',
        impact: '',
        remediation: '',
        reference: '',
        references: [],
        cve: '',
        cwe: '',
        status: 'open',
        affectedAssets: '',
        likelihood: '',
        impactRating: '',
        owasp: '',
        compliance: [],
        retestNotes: '',
        fieldsVisibility: {},
        images: []
    };
}

function deleteFinding(index) {
    state.findings.splice(index, 1);
    state.isDirty = true;
    renderApp();
    // Auto-guardado: el borrado se persiste de inmediato (coherente con el alta).
    autoSaveReport(state.lang === 'es' ? 'Hallazgo eliminado y guardado ✓' : 'Finding deleted & saved ✓');
}

function editFinding(index) {
    const finding = state.findings[index];
    if (!finding) return;

    normalizeFinding(finding);
    state.currentFinding = {
        templateKey: finding.templateKey || 'custom',
        title: finding.title || '',
        severity: finding.severity || 'med',
        description: finding.description || '',
        cvss: finding.cvss || '',
        cvssVector: finding.cvssVector || '',
        poc: finding.poc || '',
        exploit: finding.exploit || '',
        impact: finding.impact || '',
        remediation: finding.remediation || '',
        reference: finding.reference || '',
        references: Array.isArray(finding.references) ? [...finding.references] : [],
        cve: finding.cve || '',
        cwe: finding.cwe || '',
        status: finding.status || 'open',
        affectedAssets: finding.affectedAssets || '',
        likelihood: finding.likelihood || '',
        impactRating: finding.impactRating || '',
        owasp: finding.owasp || '',
        compliance: Array.isArray(finding.compliance) ? [...finding.compliance] : [],
        retestNotes: finding.retestNotes || '',
        fieldsVisibility: Object.assign({}, finding.fieldsVisibility || {}),
        images: finding.images ? [...finding.images] : []
    };

    state.editingFindingIndex = index;

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

// --- Reordenar evidencias por arrastre (drag & drop) ---
// El orden del array state.currentFinding.images es el que se imprime en el
// informe, así que reordenarlo aquí basta para que el cambio se refleje.
let _draggedImageIdx = null;

function imageDragStart(event, idx) {
    _draggedImageIdx = idx;
    if (event.dataTransfer) {
        event.dataTransfer.effectAllowed = 'move';
        try { event.dataTransfer.setData('text/plain', String(idx)); } catch (_e) {}
    }
    const item = event.currentTarget;
    if (item) setTimeout(() => item.classList.add('dragging'), 0);
}

function imageDragOver(event, idx) {
    event.preventDefault();
    if (event.dataTransfer) event.dataTransfer.dropEffect = 'move';
    const item = event.currentTarget;
    if (item && _draggedImageIdx !== null && idx !== _draggedImageIdx) item.classList.add('drag-over');
}

function imageDragLeave(event) {
    const item = event.currentTarget;
    if (item) item.classList.remove('drag-over');
}

function imageDrop(event, targetIdx) {
    event.preventDefault();
    event.stopPropagation();
    const from = _draggedImageIdx;
    _draggedImageIdx = null;
    const imgs = state.currentFinding.images;
    if (from === null || from === targetIdx || from < 0 || from >= imgs.length) { renderApp(); return; }
    const [moved] = imgs.splice(from, 1);
    imgs.splice(targetIdx, 0, moved);
    state.isDirty = true;
    renderApp();
}

function imageDragEnd() {
    _draggedImageIdx = null;
    document.querySelectorAll('.image-preview-item.dragging, .image-preview-item.drag-over')
        .forEach(el => el.classList.remove('dragging', 'drag-over'));
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

        await loadReport(report.id);
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
            auditType: report.audit_type || 'pentesting_web',
            hasIncidents: report.has_incidents === true || report.has_incidents === 'true' || report.has_incidents === 1,
            incidentsText: report.incidents_text || '',
            auditSummary: report.audit_summary || '',
            testsPerformed: report.tests_performed || '',
            recommendedSolutions: report.recommended_solutions || '',
            scopeIn: report.scope_in || '',
            scopeOut: report.scope_out || '',
            methodologyNotes: report.methodology_notes || '',
            methodologyStandards: Array.isArray(report.methodology_standards) ? report.methodology_standards : [],
            toolsUsed: report.tools_used || '',
            engagementStart: report.engagement_start || '',
            engagementEnd: report.engagement_end || '',
            revisionHistory: Array.isArray(report.revision_history) ? report.revision_history : [],
            scopeFieldsVisibility: (typeof report.scope_fields_visibility === 'object' && report.scope_fields_visibility) ? report.scope_fields_visibility : {}
        };
        state.lang = report.lang;
        // No tocamos el tema al abrir un reporte: se conserva el tema global de la
        // BD (cargado en el arranque desde ajustes) para garantizar uniformidad.
        // Reafirmamos el atributo por si el DOM se hubiera reseteado.
        applyThemeAttributes(state.reportTheme);
        state.findings = sortFindingsBySeverity(normalizeFindings(report.findings || []));

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

// Magia que identifica un backup cifrado de Pentestify (8 bytes).
const DB_ENC_MAGIC = 'PENTDB01';

// Deriva una clave AES-GCM de 256 bits a partir de la contraseña (PBKDF2-SHA256).
async function deriveDbKey(password, salt) {
    const enc = new TextEncoder();
    const keyMaterial = await crypto.subtle.importKey('raw', enc.encode(password), 'PBKDF2', false, ['deriveKey']);
    return crypto.subtle.deriveKey(
        { name: 'PBKDF2', salt, iterations: 200000, hash: 'SHA-256' },
        keyMaterial,
        { name: 'AES-GCM', length: 256 },
        false,
        ['encrypt', 'decrypt']
    );
}

function _downloadBytes(bytes, filename, mime) {
    const blob = new Blob([bytes], { type: mime || 'application/octet-stream' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
}

// Exporta la base de datos. Si se pasa contraseña, la cifra (AES-256-GCM)
// produciendo un fichero .pdb protegido; si no, exporta el .db en claro.
async function exportDatabase(password) {
    const isEs = state.lang === 'es';
    const response = await fetch('/api/database/export');
    if (!response.ok) throw new Error(isEs ? 'Error al exportar' : 'Export error');
    const stamp = new Date().toISOString().slice(0, 19).replace(/[:T]/g, '').slice(0, 13);

    if (!password) {
        const blob = await response.blob();
        const name = response.headers.get('content-disposition')?.split('filename=')[1]?.replace(/"/g, '') || 'pentestify_backup.db';
        _downloadBytes(new Uint8Array(await blob.arrayBuffer()), name, 'application/x-sqlite3');
        return;
    }

    const buf = await response.arrayBuffer();
    const salt = crypto.getRandomValues(new Uint8Array(16));
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const key = await deriveDbKey(password, salt);
    const ct = new Uint8Array(await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, buf));
    const magic = new TextEncoder().encode(DB_ENC_MAGIC); // 8 bytes
    const out = new Uint8Array(magic.length + salt.length + iv.length + ct.length);
    out.set(magic, 0);
    out.set(salt, magic.length);
    out.set(iv, magic.length + salt.length);
    out.set(ct, magic.length + salt.length + iv.length);
    _downloadBytes(out, `pentestify_backup_${stamp}.pdb`, 'application/octet-stream');
}

async function importDatabase(input) {
    const file = input.files[0];
    if (!file) return;
    const isEs = state.lang === 'es';

    const tImpExp = isEs ? {
        importConfirm: '¿Estás seguro? Esto reemplazará todos los reportes actuales.',
        importSuccess: 'Base de datos importada correctamente. Recargando...',
        importError: 'Error al importar: ',
        askPw: 'Esta base de datos está protegida. Introduce la contraseña:',
        badPw: 'Contraseña incorrecta o archivo dañado.'
    } : {
        importConfirm: 'Are you sure? This will replace all current reports.',
        importSuccess: 'Database imported successfully. Reloading...',
        importError: 'Error importing: ',
        askPw: 'This database is password-protected. Enter the password:',
        badPw: 'Wrong password or corrupted file.'
    };

    try {
        let bytes = new Uint8Array(await file.arrayBuffer());
        const magic = new TextDecoder().decode(bytes.slice(0, 8));

        if (magic === DB_ENC_MAGIC) {
            const pw = prompt(tImpExp.askPw);
            if (pw === null) { input.value = ''; return; }
            try {
                const salt = bytes.slice(8, 24);
                const iv = bytes.slice(24, 36);
                const ct = bytes.slice(36);
                const key = await deriveDbKey(pw, salt);
                const dec = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, ct);
                bytes = new Uint8Array(dec);
            } catch (e) {
                alert(tImpExp.badPw);
                input.value = '';
                return;
            }
        }

        if (!confirm(tImpExp.importConfirm)) { input.value = ''; return; }

        const formData = new FormData();
        formData.append('file', new Blob([bytes], { type: 'application/x-sqlite3' }), 'imported.db');
        const response = await fetch('/api/database/import', { method: 'POST', body: formData });
        if (!response.ok) {
            const error = await response.json().catch(() => ({}));
            throw new Error(error.detail || 'Error');
        }
        alert(tImpExp.importSuccess);
        window.location.reload();
    } catch (err) {
        alert(tImpExp.importError + err.message);
    }
    input.value = '';
}

// ---- Modal: proteger la base de datos exportada con contraseña ---- //
function openDbPasswordModal() {
    state.dbPasswordModal = { open: true, busy: false };
    renderApp();
}

function closeDbPasswordModal() {
    state.dbPasswordModal = { open: false, busy: false };
    renderApp();
}

// Exporta la BD completa SIN contraseña (en claro) desde el modal.
async function exportDbPlain() {
    const isEs = state.lang === 'es';
    try {
        state.dbPasswordModal.busy = true; renderApp();
        await exportDatabase();
        closeDbPasswordModal();
    } catch (err) {
        state.dbPasswordModal.busy = false; renderApp();
        alert((isEs ? 'Error al exportar: ' : 'Error exporting: ') + err.message);
    }
}

async function submitDbPassword(event) {
    if (event) event.preventDefault();
    const isEs = state.lang === 'es';
    const pw = (document.getElementById('dbPw') || {}).value || '';
    const pw2 = (document.getElementById('dbPw2') || {}).value || '';
    const errEl = document.getElementById('dbPwError');
    const setErr = (m) => { if (errEl) { errEl.textContent = m; errEl.style.display = m ? 'block' : 'none'; } };

    if (pw.length < 4) { setErr(isEs ? 'La contraseña debe tener al menos 4 caracteres.' : 'Password must be at least 4 characters.'); return; }
    if (pw !== pw2) { setErr(isEs ? 'Las contraseñas no coinciden.' : 'Passwords do not match.'); return; }
    setErr('');

    try {
        state.dbPasswordModal.busy = true; renderApp();
        await exportDatabase(pw);
        closeDbPasswordModal();
        alert(isEs ? 'Base de datos exportada y cifrada correctamente.' : 'Database exported and encrypted successfully.');
    } catch (err) {
        state.dbPasswordModal.busy = false; renderApp();
        alert((isEs ? 'Error al exportar: ' : 'Error exporting: ') + err.message);
    }
}

function renderDbPasswordModal() {
    const m = state.dbPasswordModal;
    if (!m || !m.open) return '';
    const isEs = state.lang === 'es';
    return `
        <div class="settings-overlay" style="align-items:center;justify-content:center;padding:1rem;" onclick="closeDbPasswordModal()">
            <div class="settings-modal" style="width:100%;max-width:460px;" onclick="event.stopPropagation()">
                <div class="settings-modal-header">
                    <span style="display:inline-flex;align-items:center;gap:0.5rem;">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                        ${isEs ? 'Exportar base de datos' : 'Export database'}
                    </span>
                    <button class="settings-close-btn" onclick="closeDbPasswordModal()">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                    </button>
                </div>
                <div class="settings-section">
                    <p style="font-size:0.85rem;color:var(--gray-500,#6b7280);line-height:1.55;margin:0 0 1rem;">
                        ${isEs
                            ? 'Se exportará <b>toda</b> la base de datos: todos los reportes, ajustes, temas y usuarios. Puedes protegerla con una contraseña (cifrado AES-256) o exportarla sin cifrar.'
                            : 'The <b>whole</b> database will be exported: all reports, settings, themes and users. You can protect it with a password (AES-256) or export it unencrypted.'}
                    </p>
                    <form onsubmit="submitDbPassword(event)">
                        <label class="login-label">${isEs ? 'Contraseña (opcional)' : 'Password (optional)'}</label>
                        <input type="password" id="dbPw" class="login-input" autocomplete="new-password" placeholder="${isEs ? 'Déjala en blanco para no cifrar' : 'Leave blank to skip encryption'}" autofocus>
                        <label class="login-label" style="margin-top:0.6rem;">${isEs ? 'Confirmar contraseña' : 'Confirm password'}</label>
                        <input type="password" id="dbPw2" class="login-input" autocomplete="new-password">
                        <p style="font-size:0.78rem;color:var(--gray-500,#6b7280);line-height:1.5;margin:0.7rem 0 0;">
                            ${isEs
                                ? 'Si estableces contraseña, la necesitarás para volver a importar el fichero. <b>Si la pierdes, no podrás recuperar los datos.</b>'
                                : 'If you set a password, you will need it to import the file again. <b>If you lose it, the data cannot be recovered.</b>'}
                        </p>
                        <div id="dbPwError" class="login-error" style="display:none;margin-top:0.6rem;"></div>
                        <div style="display:flex;gap:0.6rem;margin-top:1.1rem;">
                            <button type="button" class="btn-secondary" style="flex:1;" onclick="exportDbPlain()" ${m.busy ? 'disabled' : ''}>
                                ${isEs ? 'Exportar sin cifrar' : 'Export unencrypted'}
                            </button>
                            <button type="submit" class="login-btn" style="flex:1;margin:0;" ${m.busy ? 'disabled' : ''}>
                                ${m.busy ? (isEs ? 'Exportando…' : 'Exporting…') : (isEs ? 'Exportar protegida' : 'Export protected')}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>`;
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
            recommended_solutions: state.auditData.recommendedSolutions || '',
            audit_type: state.auditData.auditType || 'pentesting_web',
            scope_in: state.auditData.scopeIn || '',
            scope_out: state.auditData.scopeOut || '',
            methodology_notes: state.auditData.methodologyNotes || '',
            methodology_standards: state.auditData.methodologyStandards || [],
            tools_used: state.auditData.toolsUsed || '',
            engagement_start: state.auditData.engagementStart || '',
            engagement_end: state.auditData.engagementEnd || '',
            revision_history: state.auditData.revisionHistory || [],
            scope_fields_visibility: state.auditData.scopeFieldsVisibility || {}
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
                cvss_vector: finding.cvssVector || finding.cvss_vector || '',
                poc: finding.poc || '',
                exploit: finding.exploit || '',
                impact: finding.impact || '',
                remediation: finding.remediation || '',
                reference: finding.reference || '',
                references: finding.references || [],
                cve: finding.cve || '',
                cwe: finding.cwe || '',
                status: finding.status || 'open',
                affected_assets: finding.affectedAssets || finding.affected_assets || '',
                likelihood: finding.likelihood || '',
                impact_rating: finding.impactRating || finding.impact_rating || '',
                owasp: finding.owasp || '',
                compliance: finding.compliance || [],
                retest_notes: finding.retestNotes || finding.retest_notes || '',
                fields_visibility: finding.fieldsVisibility || finding.fields_visibility || {},
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

        localStorage.setItem('report_' + state.currentReportId + '_draft', JSON.stringify(state.currentFinding));

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

    // Inyectamos los bloques CSS de los temas de fábrica de inmediato (los
    // personalizados se añaden cuando se cargan desde la API).
    injectThemeStyles();

    const themeParam = params.get('theme');
    if (printMode === 'true' && reportId) {
        // En modo impresión (Playwright) la autenticación viaja en la cookie de
        // sesión inyectada por el backend; saltamos la pantalla de login.
        state.authChecked = true;
        state.isAuthenticated = true;
        state.activeTab = 'preview';
        state.currentReportId = parseInt(reportId);
        // Idioma del informe exportado: viene en la URL para reflejar EXACTAMENTE
        // el idioma elegido en la app (sin depender del guardado debounced de
        // ajustes, que podría no haberse persistido aún al exportar).
        const langParam = params.get('lang');
        if (langParam === 'es' || langParam === 'en') {
            state.lang = langParam;
            state.auditData.lang = langParam;
        }
        // Cargamos los temas personalizados para que el PDF pueda usar cualquiera.
        await loadCustomThemes();
        state.reportTheme = (themeParam && listAllThemes().some(t => t.slug === themeParam)) ? themeParam : 'light';
        applyThemeAttributes(state.reportTheme);
        if (params.get('show_severity_bars') === 'false') {
            state.pdfShowSeverityBars = false;
        }
        const cwParam = params.get('content_width');
        if (cwParam) {
            state.pdfContentWidth = parseInt(cwParam);
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

            state.findings = remoteReport.findings ? sortFindingsBySeverity(normalizeFindings(remoteReport.findings)) : [];
        } catch (e) {
            console.error("Error cargando reporte para imprimir", e);
        }
        renderApp();
        // Pintamos el fondo de la página con el color del tema para que el lienzo
        // del PDF (márgenes incluidos) coincida con cualquier tema, incluso los
        // personalizados.
        applyPrintBackground();
        // Generación de PDF: impresión nativa del navegador (Guardar como PDF).
        // Damos un margen para que imágenes y estilos terminen de pintar.
        if (params.get('auto_print') === '1') {
            setTimeout(() => { try { window.print(); } catch (e) {} }, 900);
        }
    } else {
        // Modo normal: comprobamos si ya hay una sesión válida (cookie) antes de
        // decidir entre mostrar el login o la aplicación.
        const accountParam = params.get('account');
        state.isAccountView = accountParam === '1' || accountParam === 'true';

        try {
            const me = await API.auth.me();
            state.isAuthenticated = true;
            state.authUsername = me.username;
            state.usingDefaultPassword = !!me.using_default_password;
            // Cargamos los temas personalizados y las preferencias guardadas en la
            // BD (idioma, tema activo, opciones de PDF). La BD es la fuente de verdad
            // para que la exportación capture el 100% del estado.
            await loadCustomThemes();
            const savedTheme = localStorage.getItem('pentestify_theme');
            state.reportTheme = (savedTheme && listAllThemes().some(t => t.slug === savedTheme)) ? savedTheme : 'light';
            await loadSettings();
            applyThemeAttributes(state.reportTheme);
            // En la página de cuenta cargamos usuarios, API keys y la config MCP.
            if (state.isAccountView) {
                await Promise.all([loadUsers(), loadApiKeys(), loadMcpServerInfo()]);
            }
        } catch (e) {
            state.isAuthenticated = false;
            // Sin sesión válida: ¿la app está sin configurar (primer arranque,
            // ningún usuario)? Si es así mostramos la configuración inicial.
            try {
                const setup = await API.auth.needsSetup();
                state.needsSetup = !!(setup && setup.needs_setup);
            } catch (_e) {
                state.needsSetup = false;
            }
            // Pista de credenciales por defecto bajo el formulario de login: sólo
            // se muestra mientras el admin conserve la contraseña 'admin'.
            await refreshDefaultCredsHint();
        }
        state.authChecked = true;
        renderApp();
    }
});

// Aplica el fondo del tema activo a html/body (usado en modo impresión para que
// el PDF no muestre franjas blancas con temas oscuros o personalizados).
function applyPrintBackground() {
    try {
        const probe = document.querySelector('.preview-container') || document.documentElement;
        const bg = getComputedStyle(probe).getPropertyValue('--rt-pageBg').trim();
        if (bg) {
            document.documentElement.style.background = bg;
            document.body.style.background = bg;
        }
    } catch (e) { /* sin variables: dejamos el fondo por defecto */ }
}