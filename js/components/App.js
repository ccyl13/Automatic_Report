// Componente principal de la aplicación con persistencia API

const App = () => {
    const [showSplash, setShowSplash] = useState(true);
    const [lang, setLang] = useState('es');
    const [activeTab, setActiveTab] = useState('editor');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    
    // Lista de reportes guardados
    const [savedReports, setSavedReports] = useState([]);
    const [showReportSelector, setShowReportSelector] = useState(false);
    
    // Reporte actual
    const [currentReportId, setCurrentReportId] = useState(null);
    const [auditData, setAuditData] = useState({
        documentTitle: lang === 'es' ? 'Reporte Técnico de Vulnerabilidades' : 'Technical Vulnerability Report',
        clientCompany: 'Empresa Cliente S.A.',
        targetAsset: 'Aplicación Principal',
        auditorCompany: 'Empresa Auditora LLC',
        auditorName: 'Juan Pérez',
        classification: '2',
        version: '1.0',
        date: new Date().toISOString().split('T')[0],
        lang: 'es'
    });

    const [findings, setFindings] = useState([]);
    const [currentFinding, setCurrentFinding] = useState(initialFindingState);
    const [isDirty, setIsDirty] = useState(false);
    
    const t = UI[lang];

    // Cargar lista de reportes guardados
    const loadSavedReports = async () => {
        try {
            const reports = await API.reports.getAll();
            setSavedReports(reports);
        } catch (err) {
            console.error('Error cargando reportes:', err);
        }
    };

    // Cargar reporte específico
    const loadReport = async (reportId) => {
        setIsLoading(true);
        setError(null);
        try {
            const report = await API.reports.getById(reportId);
            setCurrentReportId(report.id);
            setAuditData({
                documentTitle: report.document_title,
                clientCompany: report.client_company,
                targetAsset: report.target_asset,
                auditorCompany: report.auditor_company,
                auditorName: report.auditor_name,
                classification: report.classification.toString(),
                version: report.version,
                date: report.date,
                lang: report.lang
            });
            setLang(report.lang);
            
            // Mapear hallazgos del backend al formato del frontend
            const mappedFindings = report.findings.map(f => ({
                id: f.id.toString(),
                templateKey: f.template_key,
                title: f.title,
                severity: f.severity,
                description: f.description,
                cvss: f.cvss,
                poc: f.poc,
                impact: f.impact,
                remediation: f.remediation,
                reference: f.reference,
                cve: f.cve,
                images: f.images || []
            }));
            setFindings(mappedFindings);
            setIsDirty(false);
            setShowReportSelector(false);
        } catch (err) {
            setError(err.message || 'Error cargando reporte');
            alert('Error cargando reporte: ' + err.message);
        } finally {
            setIsLoading(false);
        }
    };

    // Crear nuevo reporte
    const createNewReport = async () => {
        setIsLoading(true);
        try {
            const newReport = await API.reports.create({
                document_title: auditData.documentTitle,
                client_company: auditData.clientCompany,
                target_asset: auditData.targetAsset,
                auditor_company: auditData.auditorCompany,
                auditor_name: auditData.auditorName,
                classification: parseInt(auditData.classification),
                version: auditData.version,
                date: auditData.date,
                lang: lang
            });
            
            setCurrentReportId(newReport.id);
            setFindings([]);
            setIsDirty(false);
            setShowReportSelector(false);
            await loadSavedReports(); // Recargar lista
        } catch (err) {
            setError(err.message || 'Error creando reporte');
            alert('Error creando reporte: ' + err.message);
        } finally {
            setIsLoading(false);
        }
    };

    // Guardar reporte (datos generales)
    const saveReport = async () => {
        if (!currentReportId) {
            // Si no hay reporte actual, crear uno nuevo
            await createNewReport();
            return;
        }
        
        try {
            await API.reports.update(currentReportId, {
                document_title: auditData.documentTitle,
                client_company: auditData.clientCompany,
                target_asset: auditData.targetAsset,
                auditor_company: auditData.auditorCompany,
                auditor_name: auditData.auditorName,
                classification: parseInt(auditData.classification),
                version: auditData.version,
                date: auditData.date,
                lang: lang
            });
            setIsDirty(false);
        } catch (err) {
            console.error('Error guardando reporte:', err);
        }
    };

    // Agregar hallazgo a la API
    const addFindingToAPI = async (findingData) => {
        if (!currentReportId) {
            // Crear reporte primero si no existe
            await createNewReport();
            return;
        }
        
        try {
            const saved = await API.findings.create(currentReportId, {
                template_key: findingData.templateKey,
                title: findingData.title,
                severity: findingData.severity,
                description: findingData.description,
                cvss: findingData.cvss,
                poc: findingData.poc,
                impact: findingData.impact,
                remediation: findingData.remediation,
                reference: findingData.reference,
                cve: findingData.cve,
                images: findingData.images
            });
            return saved;
        } catch (err) {
            alert('Error guardando hallazgo: ' + err.message);
            return null;
        }
    };

    // Eliminar hallazgo de la API
    const removeFindingFromAPI = async (findingId) => {
        try {
            await API.findings.delete(parseInt(findingId));
        } catch (err) {
            console.error('Error eliminando hallazgo:', err);
        }
    };

    // Eliminar reporte
    const deleteReport = async (reportId) => {
        if (!confirm(t.deleteConfirm || '¿Eliminar este reporte permanentemente?')) return;
        
        try {
            await API.reports.delete(reportId);
            if (currentReportId === reportId) {
                setCurrentReportId(null);
                setFindings([]);
                setAuditData({
                    documentTitle: lang === 'es' ? 'Reporte Técnico de Vulnerabilidades' : 'Technical Vulnerability Report',
                    clientCompany: 'Empresa Cliente S.A.',
                    targetAsset: 'Aplicación Principal',
                    auditorCompany: 'Empresa Auditora LLC',
                    auditorName: 'Juan Pérez',
                    classification: '2',
                    version: '1.0',
                    date: new Date().toISOString().split('T')[0],
                    lang: lang
                });
            }
            await loadSavedReports();
        } catch (err) {
            alert('Error eliminando reporte: ' + err.message);
        }
    };

    // Autosave cuando hay cambios
    useEffect(() => {
        if (isDirty && currentReportId) {
            const timeout = setTimeout(() => {
                saveReport();
            }, 2000); // Guardar 2 segundos después del último cambio
            return () => clearTimeout(timeout);
        }
    }, [auditData, isDirty, currentReportId]);

    // Cargar reportes al iniciar
    useEffect(() => {
        loadSavedReports();
    }, []);

    const toggleLanguage = () => {
        const newLang = lang === 'es' ? 'en' : 'es';
        setLang(newLang);
        setAuditData(prev => ({ ...prev, lang: newLang }));
        setIsDirty(true);
    };

    useEffect(() => {
        if (auditData.documentTitle === UI[lang === 'es' ? 'en' : 'es'].docTitle || 
            auditData.documentTitle === 'Reporte Técnico de Vulnerabilidades' || 
            auditData.documentTitle === 'Technical Vulnerability Report') {
            setAuditData(prev => ({...prev, documentTitle: UI[lang].docTitle}));
        }

        if (currentFinding.templateKey !== 'custom' && templates[currentFinding.templateKey]) {
            const tpl = templates[currentFinding.templateKey];
            setCurrentFinding(prev => ({
                ...prev,
                title: tpl[lang].title,
                description: tpl[lang].description,
                poc: tpl[lang].poc,
                impact: tpl[lang].impact,
                remediation: tpl[lang].remediation
            }));
        }

        setFindings(prevFindings => prevFindings.map(f => {
            if (f.templateKey !== 'custom' && templates[f.templateKey]) {
                const tpl = templates[f.templateKey];
                return {
                    ...f,
                    title: tpl[lang].title,
                    description: tpl[lang].description,
                    poc: tpl[lang].poc,
                    impact: tpl[lang].impact,
                    remediation: tpl[lang].remediation
                };
            }
            return f; 
        }));
    }, [lang]);

    const handleAuditChange = (e) => {
        const { name, value } = e.target;
        setAuditData(prev => ({ ...prev, [name]: value }));
        setIsDirty(true);
    };

    const handleFindingChange = (e) => {
        const { name, value } = e.target;
        setCurrentFinding(prev => ({ ...prev, [name]: value }));
    };

    const handleTemplateChange = (e) => {
        const key = e.target.value;
        if (templates[key]) {
            const tpl = templates[key];
            setCurrentFinding(prev => ({ 
                ...prev, 
                templateKey: key,
                severity: tpl.severity,
                cvss: tpl.cvss,
                reference: tpl.reference,
                title: tpl[lang].title,
                description: tpl[lang].description,
                poc: tpl[lang].poc,
                impact: tpl[lang].impact,
                remediation: tpl[lang].remediation
            }));
        } else {
            setCurrentFinding(prev => ({ ...initialFindingState, templateKey: 'custom', images: prev.images }));
        }
    };

    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files);
        
        const validFiles = files.filter(file => {
            const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
            if (!validTypes.includes(file.type)) {
                alert(lang === 'es' ? `Por seguridad, el formato de ${file.name} no está permitido. Usa JPG, PNG o WEBP.` : `For security reasons, ${file.name} format is not allowed. Use JPG, PNG or WEBP.`);
                return false;
            }
            if (file.size > 5 * 1024 * 1024) {
                alert(lang === 'es' ? `El archivo ${file.name} excede el límite de 5MB.` : `File ${file.name} exceeds the 5MB limit.`);
                return false;
            }
            return true;
        });

        // Convertir imágenes a base64 para persistencia
        validFiles.forEach(file => {
            const reader = new FileReader();
            reader.onloadend = () => {
                setCurrentFinding(prev => ({ 
                    ...prev, 
                    images: [...prev.images, reader.result] 
                }));
            };
            reader.readAsDataURL(file);
        });
        
        e.target.value = '';
    };

    const removeImage = (indexToRemove) => {
        setCurrentFinding(prev => ({ 
            ...prev, 
            images: prev.images.filter((_, index) => index !== indexToRemove) 
        }));
    };

    const addFinding = async (e) => {
        e.preventDefault();
        if (!currentFinding.title || !currentFinding.description) {
            alert('Please fill out Title and Description.');
            return;
        }
        
        // Si no hay reporte, crear uno primero
        if (!currentReportId) {
            await createNewReport();
            return;
        }
        
        const saved = await addFindingToAPI(currentFinding);
        if (saved) {
            const newFinding = { 
                ...currentFinding, 
                id: saved.id.toString() 
            };
            setFindings([...findings, newFinding]);
            setCurrentFinding(initialFindingState);
            setIsDirty(true);
        }
    };

    const removeFinding = async (idToRemove) => {
        await removeFindingFromAPI(idToRemove);
        setFindings(findings.filter(f => f.id !== idToRemove));
        setIsDirty(true);
    };

    const triggerPrint = () => {
        setActiveTab('preview');
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                setTimeout(() => window.print(), 800);
            });
        });
    };

    const stats = useMemo(() => {
        const counts = { crit: 0, high: 0, med: 0, low: 0, info: 0 };
        findings.forEach(f => { if(counts[f.severity] !== undefined) counts[f.severity]++; });
        
        let globalRiskKey = "info";
        if (counts.crit > 0) globalRiskKey = "crit";
        else if (counts.high > 0) globalRiskKey = "high";
        else if (counts.med > 0) globalRiskKey = "med";
        else if (counts.low > 0) globalRiskKey = "low";

        return { counts, total: findings.length, globalRiskKey };
    }, [findings]);

    // Página de reportes guardados
    const renderReportsPage = () => {
        if (!showReportSelector) return null;
        
        return (
            <div className="min-h-screen bg-gray-100">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
                    <div className="flex justify-between items-center mb-8">
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                            {lang === 'es' ? 'Mis Reportes' : 'My Reports'}
                        </h1>
                        <button 
                            onClick={() => setShowReportSelector(false)}
                            className="px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded-lg transition-colors flex items-center gap-2"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                            {lang === 'es' ? 'Volver al Editor' : 'Back to Editor'}
                        </button>
                    </div>
                    
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="p-6 border-b border-gray-200">
                            <button
                                onClick={createNewReport}
                                className="w-full sm:w-auto bg-brand-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-brand-700 transition-colors flex items-center justify-center gap-2"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                                </svg>
                                {lang === 'es' ? 'Crear Nuevo Reporte' : 'Create New Report'}
                            </button>
                        </div>
                        
                        <div className="p-6">
                            {savedReports.length === 0 ? (
                                <div className="text-center py-12">
                                    <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                    <p className="text-gray-500 text-lg">
                                        {lang === 'es' ? 'No hay reportes guardados' : 'No saved reports'}
                                    </p>
                                    <p className="text-gray-400 text-sm mt-2">
                                        {lang === 'es' ? 'Crea tu primer reporte usando el botón de arriba' : 'Create your first report using the button above'}
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {savedReports.map(report => (
                                        <div key={report.id} className="border border-gray-200 rounded-lg p-5 hover:border-brand-500 hover:shadow-md transition-all bg-white">
                                            <div className="flex justify-between items-start gap-4">
                                                <div 
                                                    className="flex-grow cursor-pointer"
                                                    onClick={() => loadReport(report.id)}
                                                >
                                                    <h3 className="font-semibold text-gray-900 text-lg">{report.document_title}</h3>
                                                    <p className="text-gray-600 mt-1">{report.client_company}</p>
                                                    <div className="flex flex-wrap gap-3 mt-3 text-sm text-gray-500">
                                                        <span className="flex items-center gap-1">
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                                                            </svg>
                                                            {report.target_asset}
                                                        </span>
                                                        <span>•</span>
                                                        <span className="flex items-center gap-1">
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                            </svg>
                                                            {report.date}
                                                        </span>
                                                        <span>•</span>
                                                        <span className="flex items-center gap-1">
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                                            </svg>
                                                            {report.findings_count} {lang === 'es' ? 'hallazgos' : 'findings'}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => loadReport(report.id)}
                                                        className="p-2 text-brand-600 hover:bg-brand-50 rounded-lg transition-colors"
                                                        title={lang === 'es' ? 'Abrir' : 'Open'}
                                                    >
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                        </svg>
                                                    </button>
                                                    <button
                                                        onClick={() => deleteReport(report.id)}
                                                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                                        title={lang === 'es' ? 'Eliminar' : 'Delete'}
                                                    >
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const renderEditor = () => (
        <div className="flex flex-col lg:flex-row gap-5 lg:gap-8 max-w-7xl mx-auto w-full">
            <div className="w-full lg:w-1/2">
                <div className="bg-white p-4 sm:p-6 lg:p-8 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center mb-2">
                        <Icons.Target className="w-5 h-5 text-brand-900" />
                        <h2 className="text-lg sm:text-xl font-bold ml-2 text-gray-900">{t.newFinding}</h2>
                    </div>
                    <p className="text-gray-500 mb-6 sm:mb-8 text-xs sm:text-sm">{t.newFindingDesc}</p>

                    <form onSubmit={addFinding} className="space-y-5 sm:space-y-6">
                        <div className="bg-indigo-50/50 p-4 sm:p-5 rounded-lg border border-indigo-100/50">
                            <label className="block text-[10px] sm:text-xs font-bold text-brand-900 uppercase tracking-wider mb-2">{t.quickTemplate}</label>
                            <select 
                                name="templateKey" 
                                value={currentFinding.templateKey} 
                                onChange={handleTemplateChange}
                                className="w-full p-2.5 bg-white border border-gray-200 rounded-md shadow-sm focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all text-xs sm:text-sm font-medium text-gray-700 cursor-pointer"
                            >
                                <option value="custom">{t.customOther}</option>
                                {Object.values(templates).sort((a,b) => a[lang].title.localeCompare(b[lang].title)).map(tpl => (
                                    <option key={tpl.key} value={tpl.key}>{tpl[lang].title}</option>
                                ))}
                            </select>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
                            <div className="md:col-span-2">
                                <label className="block text-xs font-bold text-gray-700 mb-1">{t.specTitle}</label>
                                <input required type="text" name="title" value={currentFinding.title} onChange={handleFindingChange} className="w-full p-2.5 border border-gray-200 rounded-md shadow-sm focus:ring-2 focus:ring-brand-500 outline-none text-xs sm:text-sm" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-700 mb-1">{t.severity}</label>
                                <select name="severity" value={currentFinding.severity} onChange={handleFindingChange} className={`w-full p-2.5 border border-gray-200 rounded-md shadow-sm focus:ring-2 focus:ring-brand-500 outline-none font-semibold text-xs sm:text-sm ${getSeverityStyles(currentFinding.severity).textDark} ${getSeverityStyles(currentFinding.severity).lightBg}`}>
                                    {Object.keys(severities).map(k => (
                                        <option key={k} value={k}>{severities[k][lang]}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 sm:gap-5">
                            <div className="md:col-span-3">
                                <label className="block text-xs font-bold text-gray-700 mb-1">{t.techDesc}</label>
                                <textarea required name="description" value={currentFinding.description} onChange={handleFindingChange} rows="3" className="w-full p-2.5 border border-gray-200 rounded-md shadow-sm focus:ring-2 focus:ring-brand-500 outline-none text-xs sm:text-sm resize-y"></textarea>
                            </div>
                            <div className="md:col-span-1">
                                <label className="block text-xs font-bold text-gray-700 mb-1">{t.cvss}</label>
                                <input type="text" name="cvss" value={currentFinding.cvss} onChange={handleFindingChange} className="w-full p-2.5 border border-gray-200 rounded-md shadow-sm focus:ring-2 focus:ring-brand-500 outline-none text-center font-mono text-xs sm:text-sm bg-gray-50" placeholder="9.8" />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1 flex items-center">
                                <Icons.Code className="w-4 h-4 mr-2" /> {t.poc}
                            </label>
                            <textarea name="poc" value={currentFinding.poc} onChange={handleFindingChange} rows="4" className="w-full p-3 bg-gray-900 text-green-400 border border-gray-800 rounded-md shadow-inner font-mono text-[10px] sm:text-xs focus:ring-2 focus:ring-brand-500 outline-none resize-y leading-relaxed"></textarea>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
                            <div>
                                <label className="block text-xs font-bold text-gray-700 mb-1">{t.impact}</label>
                                <textarea name="impact" value={currentFinding.impact} onChange={handleFindingChange} rows="3" className="w-full p-2.5 border border-gray-200 rounded-md shadow-sm focus:ring-2 focus:ring-brand-500 outline-none text-xs sm:text-sm resize-y"></textarea>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-700 mb-1">{t.remediation}</label>
                                <textarea name="remediation" value={currentFinding.remediation} onChange={handleFindingChange} rows="3" className="w-full p-2.5 border border-gray-200 rounded-md shadow-sm focus:ring-2 focus:ring-brand-500 outline-none text-xs sm:text-sm resize-y"></textarea>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
                            <div>
                                <label className="block text-xs font-bold text-gray-700 mb-1">{t.reference}</label>
                                <input type="text" name="reference" value={currentFinding.reference} onChange={handleFindingChange} className="w-full p-2.5 border border-gray-200 rounded-md shadow-sm focus:ring-2 focus:ring-brand-500 outline-none text-xs sm:text-sm" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-700 mb-1">{t.cve}</label>
                                <input type="text" name="cve" value={currentFinding.cve} onChange={handleFindingChange} className="w-full p-2.5 border border-gray-200 rounded-md shadow-sm focus:ring-2 focus:ring-brand-500 outline-none text-xs sm:text-sm" placeholder="CVE-XXXX-XXXX" />
                            </div>
                        </div>

                        <div className="border border-dashed border-gray-300 p-4 sm:p-5 rounded-lg bg-gray-50/50 hover:bg-gray-50 transition-colors">
                            <div className="flex justify-between items-center mb-3">
                                <label className="text-[10px] sm:text-xs font-bold text-gray-700 flex items-center">
                                    <svg className="w-4 h-4 mr-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                                    {t.images}
                                </label>
                                <label className="cursor-pointer bg-white border border-gray-300 text-gray-700 px-2 sm:px-3 py-1.5 rounded text-[10px] sm:text-xs font-medium hover:bg-gray-50 transition-colors shadow-sm">
                                    <input type="file" multiple accept="image/png, image/jpeg, image/jpg, image/webp" onChange={handleImageUpload} className="hidden" />
                                    {t.uploadImage}
                                </label>
                            </div>
                            
                            {currentFinding.images.length > 0 ? (
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3 mt-3">
                                    {currentFinding.images.map((imgSrc, index) => (
                                        <div key={index} className="relative group rounded-md overflow-hidden border border-gray-200 shadow-sm">
                                            <img src={imgSrc} alt="Evidencia" className="h-16 sm:h-20 w-full object-cover" />
                                            <button type="button" onClick={() => removeImage(index)} className="absolute top-1 right-1 bg-red-600/90 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-4 border-2 border-dashed border-gray-200 rounded-md">
                                    <p className="text-[10px] sm:text-xs text-gray-400">{t.noImages}</p>
                                </div>
                            )}
                        </div>

                        <button type="submit" className="w-full bg-brand-950 hover:bg-black text-white font-semibold py-3 sm:py-3.5 px-4 rounded-lg shadow-md transition-colors flex justify-center items-center text-sm sm:text-base">
                            <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
                            {t.registerBtn}
                        </button>
                    </form>
                </div>
            </div>

            <div className="w-full lg:w-1/2 space-y-5 lg:space-y-8">
                <div className="bg-white p-4 sm:p-6 lg:p-8 rounded-xl shadow-sm border border-gray-100">
                    <h2 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6 flex items-center text-brand-900">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                        {t.auditData}
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 text-xs sm:text-sm">
                        <div className="md:col-span-2">
                            <label className="block text-[10px] sm:text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">{t.docTitle}</label>
                            <input type="text" name="documentTitle" value={auditData.documentTitle} onChange={handleAuditChange} className="w-full p-2.5 border border-gray-200 rounded-md focus:ring-2 focus:ring-brand-500 outline-none bg-gray-50/50" />
                        </div>
                        <div>
                            <label className="block text-[10px] sm:text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">{t.clientComp}</label>
                            <input type="text" name="clientCompany" value={auditData.clientCompany} onChange={handleAuditChange} className="w-full p-2.5 border border-gray-200 rounded-md focus:ring-2 focus:ring-brand-500 outline-none bg-gray-50/50" />
                        </div>
                        <div>
                            <label className="block text-[10px] sm:text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">{t.targetAsset}</label>
                            <input type="text" name="targetAsset" value={auditData.targetAsset} onChange={handleAuditChange} className="w-full p-2.5 border border-gray-200 rounded-md focus:ring-2 focus:ring-brand-500 outline-none bg-gray-50/50" />
                        </div>
                        <div>
                            <label className="block text-[10px] sm:text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">{t.auditComp}</label>
                            <input type="text" name="auditorCompany" value={auditData.auditorCompany} onChange={handleAuditChange} className="w-full p-2.5 border border-gray-200 rounded-md focus:ring-2 focus:ring-brand-500 outline-none bg-gray-50/50" />
                        </div>
                        <div>
                            <label className="block text-[10px] sm:text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">{t.auditorName}</label>
                            <input type="text" name="auditorName" value={auditData.auditorName} onChange={handleAuditChange} className="w-full p-2.5 border border-gray-200 rounded-md focus:ring-2 focus:ring-brand-500 outline-none bg-gray-50/50" />
                        </div>
                        <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5 border-t border-gray-100 pt-4 sm:pt-5 mt-2">
                            <div>
                                <label className="block text-[10px] sm:text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">{t.classification}</label>
                                <select name="classification" value={auditData.classification} onChange={handleAuditChange} className="w-full p-2.5 border border-gray-200 rounded-md focus:ring-2 focus:ring-brand-500 outline-none bg-white">
                                    {t.classifications.map((c, idx) => (
                                        <option key={idx} value={idx}>{c}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-[10px] sm:text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">{t.version}</label>
                                <input type="text" name="version" value={auditData.version} onChange={handleAuditChange} className="w-full p-2.5 border border-gray-200 rounded-md focus:ring-2 focus:ring-brand-500 outline-none text-center bg-white" />
                            </div>
                            <div>
                                <label className="block text-[10px] sm:text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">{t.date}</label>
                                <input type="date" name="date" value={auditData.date} onChange={handleAuditChange} className="w-full p-2.5 border border-gray-200 rounded-md focus:ring-2 focus:ring-brand-500 outline-none bg-white" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-4 sm:p-6 lg:p-8 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-4 sm:mb-6 pb-3 sm:pb-4 border-b border-gray-100">
                        <h2 className="text-base sm:text-lg font-bold text-gray-900">{t.addedFindings}</h2>
                        <span className="bg-brand-100 text-brand-900 text-[10px] sm:text-xs font-bold px-2 sm:px-3 py-1 rounded-full">{stats.total} {t.findingsCount}</span>
                    </div>
                    
                    <div className="space-y-3 sm:space-y-4 max-h-[400px] sm:max-h-[600px] overflow-y-auto pr-1 sm:pr-2">
                        {findings.length === 0 ? (
                            <div className="text-center py-8 sm:py-10 bg-gray-50 rounded-lg border border-dashed border-gray-200">
                                <p className="text-xs sm:text-sm text-gray-500">{t.noFindings}</p>
                            </div>
                        ) : (
                            findings.map((f, index) => {
                                const styles = getSeverityStyles(f.severity);
                                return (
                                    <div key={f.id} className="bg-white border border-gray-200 rounded-lg p-3 sm:p-4 relative group hover:border-brand-300 hover:shadow-md transition-all">
                                        <button onClick={() => removeFinding(f.id)} className="absolute top-2 sm:top-4 right-2 sm:right-4 text-gray-400 hover:text-red-500 sm:opacity-0 group-hover:opacity-100 transition-opacity bg-white" title="Remove">
                                            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                        </button>
                                        
                                        <div className="flex items-start gap-2 sm:gap-3 mb-2 pr-6 sm:pr-8">
                                            <span className={`mt-0.5 text-[10px] sm:text-xs font-bold px-2 sm:px-2.5 py-0.5 rounded uppercase tracking-wider ${styles.bg} ${styles.text}`}>
                                                {severities[f.severity][lang]}
                                            </span>
                                            <h3 className="font-bold text-sm sm:text-base text-gray-900 leading-tight">{f.title}</h3>
                                        </div>
                                        <p className="text-xs sm:text-sm text-gray-500 line-clamp-2 leading-relaxed">{f.description}</p>
                                    </div>
                                )
                            })
                        )}
                    </div>
                </div>
            </div>
        </div>
    );

    const renderPreview = () => (
        <div className="preview-container bg-white mx-auto paper-shadow text-gray-800 w-full max-w-[210mm] print-a4-height">
            <div className="flex flex-col relative page-break p-6 sm:p-10 md:p-16 lg:p-[20mm] min-h-auto print-a4-height">
                <div className="mt-4 sm:mt-6 md:mt-10 mb-4 sm:mb-6 text-brand-900">
                    <Icons.Shield className="w-24 h-24 sm:w-32 sm:h-32" />
                </div>

                <div className="flex-grow">
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-black mb-3 sm:mb-4 text-brand-950 leading-tight tracking-tight">
                        {auditData.documentTitle}
                    </h1>
                    <div className="w-16 sm:w-24 h-1 sm:h-1.5 bg-brand-600 mb-6 sm:mb-8 print-bg-dark"></div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 sm:gap-x-10 gap-y-5 sm:gap-y-6">
                        <div>
                            <p className="text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">{t.prepFor}</p>
                            <p className="text-lg sm:text-xl font-bold text-gray-900">{auditData.clientCompany}</p>
                            <p className="text-xs sm:text-sm text-gray-600 mt-1">{auditData.targetAsset}</p>
                        </div>
                        <div>
                            <p className="text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">{t.prepBy}</p>
                            <p className="text-lg sm:text-xl font-bold text-gray-900">{auditData.auditorCompany}</p>
                            <p className="text-xs sm:text-sm text-gray-600 mt-1">{auditData.auditorName}</p>
                        </div>
                        <div>
                            <p className="text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">{t.date}</p>
                            <p className="text-base sm:text-lg font-semibold text-gray-800">{auditData.date}</p>
                        </div>
                        <div>
                            <p className="text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">{t.version}</p>
                            <p className="text-base sm:text-lg font-semibold text-gray-800">v{auditData.version}</p>
                        </div>
                        <div className="col-span-1 sm:col-span-2 pt-3 border-t border-gray-200">
                            <p className="text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">{t.globalRisk}</p>
                            <p className={`text-xl sm:text-2xl font-black uppercase ${getSeverityStyles(stats.globalRiskKey).textDark}`}>{severities[stats.globalRiskKey][lang]}</p>
                        </div>
                    </div>
                </div>

                <div className="mt-8 border-t-2 border-brand-900 pt-4 pb-2 print-border">
                    <p className="text-[10px] sm:text-xs text-gray-400 text-center uppercase tracking-widest">{t.genBy}</p>
                </div>
            </div>

            <div className="flex flex-col relative page-break p-6 sm:p-10 md:p-16 lg:p-[20mm] print-a4-height">
                <h2 className="text-2xl sm:text-3xl font-black text-brand-950 mb-4 tracking-tight">{t.execSummary}</h2>
                <div className="w-full h-px bg-gray-200 mb-6 sm:mb-8 print-bg-gray"></div>

                <p className="text-gray-700 text-sm sm:text-base leading-relaxed mb-6 sm:mb-8 text-justify">
                    {t.summaryText1} <strong className="text-gray-900">{auditData.clientCompany}</strong>{t.summaryText2} <strong className="text-gray-900">{stats.total}</strong> {t.summaryText3} <strong className="text-gray-900">{auditData.targetAsset}</strong>{t.summaryText4} <strong className={`uppercase ${getSeverityStyles(stats.globalRiskKey).textDark}`}>{severities[stats.globalRiskKey][lang]}</strong>{t.summaryText5}
                </p>

                <div className="grid grid-cols-2 sm:flex sm:flex-row gap-3 sm:gap-4 mb-8 sm:mb-10">
                    {['crit', 'high', 'med', 'low', 'info'].map(sev => {
                        const styles = getSeverityStyles(sev);
                        return (
                            <div key={sev} className={`flex-1 border rounded-xl p-3 sm:p-4 text-center bg-white shadow-sm flex flex-col items-center justify-center ${styles.border} print-border`}>
                                <span className={`text-2xl sm:text-4xl font-black mb-1 ${styles.textDark}`}>{stats.counts[sev]}</span>
                                <span className="text-[8px] sm:text-[10px] font-bold text-gray-500 uppercase tracking-wider">{severities[sev][lang]}</span>
                            </div>
                        );
                    })}
                </div>

                <div className="bg-gray-50 rounded-xl p-5 sm:p-8 border border-gray-100 print-bg-gray print-border">
                    <h3 className="text-[10px] sm:text-xs font-bold text-brand-900 uppercase tracking-widest mb-4 sm:mb-6">{t.distTitle}</h3>
                    <div className="space-y-3 sm:space-y-4">
                        {['crit', 'high', 'med', 'low', 'info'].map(sev => {
                            const count = stats.counts[sev];
                            const percentage = stats.total > 0 ? (count / stats.total) * 100 : 0;
                            const styles = getSeverityStyles(sev);
                            return (
                                <div key={sev} className="flex items-center text-xs sm:text-sm">
                                    <span className="w-20 sm:w-24 font-semibold text-gray-700">{severities[sev][lang]}</span>
                                    <div className="flex-grow h-2 sm:h-2.5 bg-gray-200 rounded-full overflow-hidden mx-2 sm:mr-4 print-bg-gray">
                                        <div className={`h-full rounded-full ${styles.bg}`} style={{ width: `${percentage}%` }}></div>
                                    </div>
                                    <span className="w-6 sm:w-8 text-right font-bold text-gray-900">{count}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            <div className="p-6 sm:p-10 md:p-16 lg:p-[20mm] pt-10 page-break">
                <h2 className="text-2xl sm:text-3xl font-black text-brand-950 mb-4 tracking-tight">{t.techDetails}</h2>
                <div className="w-full h-px bg-gray-200 mb-8 sm:mb-12 print-bg-gray"></div>

                {findings.length === 0 ? (
                    <p className="italic text-gray-500 text-sm sm:text-base">{t.noFindingsPrint}</p>
                ) : (
                    findings.map((f, i) => {
                        const styles = getSeverityStyles(f.severity);
                        return (
                            <div key={f.id} className="mb-8 sm:mb-12 border border-gray-200 rounded-xl bg-white shadow-sm overflow-hidden avoid-break print-border">
                                <div className="p-4 sm:p-6 border-b border-gray-100 relative">
                                    <div className="flex justify-between items-start mb-3 sm:mb-4">
                                        <div className="flex items-center gap-2 sm:gap-3 pr-20 sm:pr-24">
                                            <span className="text-xl sm:text-2xl font-black text-brand-600">#{i+1}</span>
                                            <h3 className="text-lg sm:text-xl font-bold text-gray-900 leading-tight">{f.title}</h3>
                                        </div>
                                        <div className={`absolute top-4 sm:top-6 right-4 sm:right-6 px-3 sm:px-4 py-1 sm:py-1.5 rounded-md font-bold text-[10px] sm:text-xs uppercase tracking-wider ${styles.bg} ${styles.text} print-bg-dark`}>
                                            {severities[f.severity][lang]}
                                        </div>
                                    </div>
                                    
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        {f.cvss && (
                                            <span className="inline-flex items-center px-2 sm:px-2.5 py-1 rounded border border-gray-200 text-[10px] sm:text-xs font-medium text-gray-600 bg-gray-50 print-border">
                                                <Icons.Activity className="w-3 h-3 sm:w-4 sm:h-4 inline mr-1 text-gray-500" /> CVSS: {f.cvss}
                                            </span>
                                        )}
                                        {(f.reference || f.cve) && (
                                            <span className="inline-flex items-center px-2 sm:px-2.5 py-1 rounded border border-gray-200 text-[10px] sm:text-xs font-medium text-gray-600 bg-gray-50 print-border break-all">
                                                <Icons.Book className="w-3 h-3 sm:w-4 sm:h-4 inline mr-1 text-gray-500" /> {f.reference} {f.cve ? `/ ${f.cve}` : ''}
                                            </span>
                                        )}
                                    </div>
                                </div>
                                
                                <div className="p-4 sm:p-6 space-y-6 sm:space-y-8">
                                    <div>
                                        <h4 className="flex items-center text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 sm:mb-3">
                                            <Icons.Alert className="w-3 h-3 sm:w-4 sm:h-4 mr-2 text-severity-crit" /> {t.techDesc}
                                        </h4>
                                        <p className="text-gray-700 text-xs sm:text-sm leading-relaxed text-justify whitespace-pre-wrap">{f.description}</p>
                                    </div>

                                    {f.poc && (
                                        <div>
                                            <h4 className="flex items-center text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 sm:mb-3">
                                                <Icons.Code className="w-3 h-3 sm:w-4 sm:h-4 mr-2 text-gray-400" /> {t.poc}
                                            </h4>
                                            <div className="bg-brand-950 rounded-lg p-4 sm:p-5 print-bg-dark overflow-x-auto">
                                                <pre className="font-mono text-[10px] sm:text-sm text-green-400 whitespace-pre-wrap leading-relaxed">{f.poc}</pre>
                                            </div>
                                        </div>
                                    )}

                                    {f.images && f.images.length > 0 && (
                                        <div>
                                            <h4 className="flex items-center text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 sm:mb-3">
                                                <Icons.Target className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-gray-400" /> {t.images}
                                            </h4>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                                {f.images.map((img, idx) => (
                                                    <div key={idx} className="border border-gray-200 p-2 rounded-lg print-border flex justify-center">
                                                        <img src={img} className="max-w-full h-auto object-contain rounded" alt={`Evidencia ${idx+1}`} />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {f.impact && (
                                        <div>
                                            <h4 className="flex items-center text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 sm:mb-3">
                                                <Icons.Alert className="w-3 h-3 sm:w-4 sm:h-4 mr-2 text-severity-crit" /> {t.impact}
                                            </h4>
                                            <div className="border-l-4 border-severity-crit bg-red-50/50 p-3 sm:p-4 rounded-r-lg text-xs sm:text-sm text-gray-800 leading-relaxed print-bg-gray print-border">
                                                <p className="whitespace-pre-wrap">{f.impact}</p>
                                            </div>
                                        </div>
                                    )}

                                    {f.remediation && (
                                        <div>
                                            <h4 className="flex items-center text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 sm:mb-3">
                                                <Icons.Check className="w-3 h-3 sm:w-4 sm:h-4 mr-2 text-green-600" /> {t.remediation}
                                            </h4>
                                            <div className="border-l-4 border-green-500 bg-green-50/50 p-3 sm:p-4 rounded-r-lg text-xs sm:text-sm text-gray-800 leading-relaxed print-bg-gray print-border">
                                                <p className="whitespace-pre-wrap">{f.remediation}</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )
                    })
                )}
                
                <div className="mt-12 sm:mt-20 pt-4 border-t border-gray-200 flex flex-col sm:flex-row justify-between text-[8px] sm:text-[10px] text-gray-400 uppercase tracking-widest print-border gap-2 sm:gap-0">
                    <div className="text-center sm:text-left">{t.classifications[auditData.classification]} • {t.prepFor} {auditData.clientCompany}<br/>{t.genBy}</div>
                    <div className="text-center sm:text-right">{t.reportVer} {auditData.version}<br/>{auditData.date}</div>
                </div>
            </div>

        </div>
    );

    return (
        <div className="min-h-screen flex flex-col font-sans relative overflow-x-hidden">
            {showSplash && <SplashScreen onEnter={() => setShowSplash(false)} lang={lang} t={t} toggleLanguage={toggleLanguage} />}
            
            {/* Página de reportes - pantalla completa */}
            {showReportSelector && renderReportsPage()}
            
            {/* TOP NAVBAR - oculto cuando se muestra página de reportes */}
            {!showReportSelector && (
            <header className="bg-brand-950 text-white shadow-md no-print sticky top-0 z-40">
                <div className="max-w-screen-2xl mx-auto px-3 sm:px-6 lg:px-8 h-14 sm:h-16 flex justify-between items-center">
                    <div className="flex items-center space-x-2 sm:space-x-3 w-1/3">
                        <div className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-brand-600/30 border border-brand-500/40">
                            <Icons.Shield className="w-5 h-5 sm:w-6 sm:h-6 text-brand-400" />
                        </div>
                        <h1 className="hidden sm:block text-base md:text-xl font-bold tracking-tight truncate">{t.appTitle}</h1>
                        {isDirty && <span className="text-xs text-yellow-400 ml-2">•</span>}
                    </div>
                    
                    <div className="flex items-center justify-end space-x-1 sm:space-x-4 w-2/3">
                        {/* Botón Mis Reportes */}
                        <button 
                            onClick={() => {
                                loadSavedReports();
                                setShowReportSelector(true);
                            }}
                            className="px-2 sm:px-3 py-1.5 rounded-full border border-brand-500 bg-brand-900/50 hover:bg-brand-800 font-bold text-[10px] sm:text-xs flex items-center transition-colors"
                        >
                            <svg className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <span className="hidden sm:inline">{lang === 'es' ? 'Mis Reportes' : 'My Reports'}</span>
                        </button>

                        <div className="w-px h-4 sm:h-6 bg-gray-700 mx-1 sm:mx-2"></div>

                        <button 
                            onClick={toggleLanguage}
                            className="px-2 sm:px-3 py-1.5 rounded-full border border-gray-700 bg-gray-800 hover:bg-gray-700 font-bold text-[10px] sm:text-xs flex items-center transition-colors"
                        >
                            <Icons.Globe className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-2" />
                            <span className="hidden sm:inline">{lang === 'es' ? '🇪🇸 ES' : '🇬🇧 EN'}</span>
                        </button>

                        <div className="w-px h-4 sm:h-6 bg-gray-700 mx-1 sm:mx-2"></div>

                        <button 
                            onClick={() => setActiveTab('editor')}
                            className={`px-2 sm:px-4 py-1.5 sm:py-2 rounded-md font-semibold text-[10px] sm:text-sm transition-all flex items-center ${activeTab === 'editor' ? 'bg-brand-600 text-white shadow' : 'text-gray-300 hover:text-white hover:bg-white/10'}`}
                        >
                            <Icons.Edit className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-2" />
                            <span className="hidden sm:inline">{t.editPanel}</span>
                        </button>
                        <button 
                            onClick={() => setActiveTab('preview')}
                            className={`px-2 sm:px-4 py-1.5 sm:py-2 rounded-md font-semibold text-[10px] sm:text-sm transition-all flex items-center ${activeTab === 'preview' ? 'bg-brand-600 text-white shadow' : 'text-gray-300 hover:text-white hover:bg-white/10'}`}
                        >
                            <Icons.Eye className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-2" />
                            <span className="hidden sm:inline">{t.preview}</span>
                        </button>
                        
                        <div className="w-px h-4 sm:h-6 bg-gray-700 mx-1 sm:mx-2"></div>

                        <button 
                            onClick={triggerPrint}
                            className="px-2 sm:px-5 py-1.5 sm:py-2 bg-emerald-500 hover:bg-emerald-400 text-white rounded-md font-bold text-[10px] sm:text-sm flex items-center shadow-md transition-colors"
                        >
                            <Icons.Download className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-2" />
                            <span className="hidden sm:inline">{t.generatePdf}</span>
                            <span className="sm:hidden ml-1">PDF</span>
                        </button>
                    </div>
                </div>
            </header>
            )}

            {/* Indicador de guardando - solo en editor */}
            {isLoading && !showReportSelector && (
                <div className="fixed top-16 right-4 z-50 bg-brand-600 text-white px-4 py-2 rounded-md text-sm shadow-lg flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {lang === 'es' ? 'Guardando...' : 'Saving...'}
                </div>
            )}

            {/* MAIN CONTENT - oculto cuando se muestra página de reportes */}
            {!showReportSelector && (
            <main className="flex-grow p-3 sm:p-4 md:p-8 w-full bg-gray-100 flex flex-col items-center">
                <div className={`w-full max-w-7xl ${activeTab === 'editor' ? 'block no-print' : 'hidden'}`}>
                    {renderEditor()}
                </div>
                <div className={`w-full ${activeTab === 'preview' ? 'block' : 'hidden print-only'}`}>
                    {renderPreview()}
                </div>
            </main>
            )}
        </div>
    );
};
