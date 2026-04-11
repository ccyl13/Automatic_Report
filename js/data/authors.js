// Datos de los autores/creadores del proyecto

const authorsData = [
    { 
        name: "El Pingüino de Mario", 
        roles: {
            es: ["Creador de contenido", "Web Pentester", "Web Developer", "Linux Sysadmin & Hardening", "Docente"],
            en: ["Content Creator", "Web Pentester", "Web Developer", "Linux Sysadmin & Hardening", "Instructor"]
        },
        link: "https://www.youtube.com/@ElPinguinoDeMario", 
        icon: <Icons.YouTube className="w-4 h-4 mr-1.5"/>, 
        img: "assets/images/el-pinguino-de-mario.webp",
        btnColor: "text-red-400 group-hover:text-red-300 hover:border-red-400/50 hover:shadow-[0_0_15px_rgba(248,113,113,0.4)]"
    },
    { 
        name: "Manuel Martínez", 
        roles: {
            es: ["Security Researcher", "Hacker & Cybersecurity Consultant", "DFIR", "CSIRT"],
            en: ["Security Researcher", "Hacker & Cybersecurity Consultant", "DFIR", "CSIRT"]
        },
        link: "https://curiosidadesdehackers.com/about", 
        icon: <Icons.Web className="w-4 h-4 mr-1.5"/>, 
        img: "assets/images/manuel-martinez.webp",
        btnColor: "text-green-400 group-hover:text-green-300 hover:border-green-400/50 hover:shadow-[0_0_15px_rgba(74,222,128,0.4)]"
    },
    { 
        name: "Thomas O'neil Álvarez", 
        roles: {
            es: ["Hacker Ético", "Divulgador", "Docente", "#1 LinkedIn España & LATAM"],
            en: ["Ethical Hacker", "Tech Communicator", "Instructor", "#1 LinkedIn Spain & LATAM"]
        },
        link: "https://www.linkedin.com/in/thomasoneil%C3%A1lvarez", 
        icon: <Icons.LinkedIn className="w-4 h-4 mr-1.5"/>, 
        img: "assets/images/thomas-oneil.webp",
        btnColor: "text-blue-400 group-hover:text-blue-300 hover:border-blue-400/50 hover:shadow-[0_0_15px_rgba(96,165,250,0.4)]"
    }
];
