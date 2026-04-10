// Constantes globales de la aplicación

const { useState, useEffect, useMemo } = React;

const severities = {
    crit: { es: 'Crítica', en: 'Critical' },
    high: { es: 'Alta', en: 'High' },
    med:  { es: 'Media', en: 'Medium' },
    low:  { es: 'Baja', en: 'Low' },
    info: { es: 'Informativa', en: 'Informational' }
};

const initialFindingState = {
    id: '',
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

const getSeverityStyles = (sevKey) => {
    switch(sevKey) {
        case 'crit': return { bg: 'bg-severity-crit', text: 'text-white', lightBg: 'bg-red-50', border: 'border-severity-crit', textDark: 'text-severity-crit' };
        case 'high': return { bg: 'bg-severity-high', text: 'text-white', lightBg: 'bg-orange-50', border: 'border-severity-high', textDark: 'text-severity-high' };
        case 'med': return { bg: 'bg-severity-med', text: 'text-black', lightBg: 'bg-yellow-50', border: 'border-severity-med', textDark: 'text-yellow-600' };
        case 'low': return { bg: 'bg-severity-low', text: 'text-white', lightBg: 'bg-blue-50', border: 'border-severity-low', textDark: 'text-severity-low' };
        case 'info': return { bg: 'bg-severity-info', text: 'text-white', lightBg: 'bg-gray-50', border: 'border-severity-info', textDark: 'text-severity-info' };
        default: return { bg: 'bg-gray-200', text: 'text-gray-800', lightBg: 'bg-gray-50', border: 'border-gray-200', textDark: 'text-gray-800' };
    }
};
