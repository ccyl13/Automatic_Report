// Componente Splash Screen (Pantalla de bienvenida)

const SplashScreen = ({ onEnter, lang, t, toggleLanguage }) => {
    const [isFadingOut, setIsFadingOut] = useState(false);

    const handleEnterClick = () => {
        setIsFadingOut(true);
        setTimeout(() => {
            onEnter();
        }, 500);
    };

    return (
        <div className={`fixed inset-0 z-[100] overflow-y-auto bg-gray-900 flex flex-col justify-between p-4 sm:p-8 text-white ${isFadingOut ? 'splash-exit' : 'splash-enter'}`}>
            
            {/* Fondo animado */}
            <div className="absolute inset-0 bg-grid-pattern opacity-20 pointer-events-none animate-grid"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-transparent to-brand-950 pointer-events-none"></div>

            {/* Top Bar: Lang Toggle */}
            <div className="relative z-10 flex justify-end pt-2">
                <button 
                    onClick={toggleLanguage}
                    className="metal-btn px-4 py-2 rounded-full font-bold text-xs sm:text-sm flex items-center"
                >
                    <Icons.Globe className="w-4 h-4 sm:mr-2" />
                    <span className="hidden sm:inline">{lang === 'es' ? '🇪🇸 Español' : '🇬🇧 English'}</span>
                    <span className="sm:hidden">{lang === 'es' ? '🇪🇸 ES' : '🇬🇧 EN'}</span>
                </button>
            </div>

            {/* Main Content */}
            <div className="relative z-10 flex-grow flex flex-col items-center justify-center mt-6 sm:-mt-10 pb-12">
                
                <div className="flex flex-col items-center mb-10 sm:mb-16 text-center animate-float">
                    <h2 className="text-sm sm:text-xl font-medium text-brand-300 tracking-[0.3em] uppercase mb-2 drop-shadow-md">{t.splashWelcome}</h2>
                    <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tighter text-white drop-shadow-[0_0_20px_rgba(59,130,246,0.5)] px-2">
                        Pentestify
                    </h1>
                </div>

                <div className="w-full max-w-5xl">
                    <p className="text-center text-gray-400 font-bold mb-6 sm:mb-10 text-xs sm:text-sm tracking-widest uppercase">
                        {t.splashDevBy}
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-8 mb-10 sm:mb-16 px-2 sm:px-4">
                        {authorsData.map((author, index) => (
                            <div key={index} className="glass-card rounded-2xl p-5 sm:p-6 flex flex-col items-center hover:-translate-y-2 transition-all duration-300 group">
                                <div className="w-20 h-20 sm:w-28 sm:h-28 rounded-full overflow-hidden mb-4 sm:mb-5 border-2 border-white/20 group-hover:border-white/50 transition-colors shadow-[0_0_25px_rgba(0,0,0,0.5)] bg-white/5 flex items-center justify-center">
                                    <img src={author.img} alt={author.name} className="w-full h-full object-cover" />
                                </div>
                                <h3 className="text-base sm:text-lg font-bold text-center mb-2 text-white">{author.name}</h3>
                                
                                <div className="flex flex-wrap justify-center items-center gap-x-2 gap-y-1.5 mb-5 sm:mb-8 text-center">
                                    {author.roles[lang].map((r, i) => (
                                        <React.Fragment key={i}>
                                            <span className="text-[10px] sm:text-[11px] text-gray-300 font-medium uppercase tracking-wider">{r}</span>
                                            {i < author.roles[lang].length - 1 && <span className="text-[10px] text-brand-500/80 hidden sm:inline">•</span>}
                                        </React.Fragment>
                                    ))}
                                </div>
                                
                                <a 
                                    href={author.link} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className={`mt-auto metal-btn px-4 sm:px-6 py-2.5 rounded-full font-bold text-xs sm:text-sm flex items-center w-full justify-center ${author.btnColor}`}
                                >
                                    {author.icon} Visitar Perfil
                                </a>
                            </div>
                        ))}
                    </div>
                </div>

                <button 
                    onClick={handleEnterClick}
                    className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white text-base sm:text-lg font-bold py-3 sm:py-4 px-8 sm:px-12 rounded-full shadow-[0_0_20px_rgba(16,185,129,0.5)] hover:shadow-[0_0_35px_rgba(16,185,129,0.8)] hover:scale-105 transition-all duration-300 border border-emerald-400/50"
                >
                    {t.splashEnterBtn} &rarr;
                </button>

            </div>
        </div>
    );
};
