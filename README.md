# Taller de Versionamiento y Estándares de Codificación con Git & GitHub

Este repositorio contiene la solución práctica y los proyectos desarrollados dentro del marco de formación del SENA para el programa **Análisis y Desarrollo de Software (ADSO)**.

---

## 📋 Información del Programa

- **Programa de Formación:** Tecnólogo en Análisis y Desarrollo de Software (ADSO)
- **Competencia:** Desarrollar la solución de software de acuerdo con el diseño y metodologías de desarrollo.
- **Actividad:** Seleccionar, configurar herramientas de versionamiento para control de código y aplicar estándares de codificación.

---

## 🚀 Objetivos del Taller

1. **Configuración y gestión de Git/GitHub:**
   - Inicializar repositorios locales (`git init`) y remotos.
   - Trabajar con el flujo de trabajo de Git (`add`, `commit`, `push`, `pull`, `stash`).
   - Gestión de ramas (`branch`, `checkout`, `merge`) y resolución de conflictos.
   - Colaboración técnica mediante *Forks* y *Pull Requests*.

2. **Estándares de Codificación & Clean Code:**
   - Aplicar estándares de código limpio en JavaScript (convenciones de nombres, principio de responsabilidad única, uso de `const`/`let`).
   - Implementación adecuada del archivo `.gitignore` para evitar subir archivos temporales o sensibles.

---

## 💻 Prerequisitos e Instalación

Para trabajar con este proyecto, asegúrate de tener instalado:

- [Git](https://git-scm.com/) (versión 2.x o superior)
- [Node.js](https://nodejs.org/) / Editor de código como [Visual Studio Code](https://code.visualstudio.com/)
- Cuenta activa en [GitHub](https://github.com)

### Configuración inicial del entorno local

```bash
# Configuración global del usuario en Git
git config --global user.name "Tu Nombre"
git config --global user.email "tucorreo@example.com"

# Clonar el repositorio
git clone https://github.com/tu-usuario/nombre-repositorio.git

# Acceder al directorio
cd nombre-repositorio
```

---

## 📂 Estructura del Repositorio

```plaintext
├── src/                # Código fuente del proyecto (siguiendo Clean Code)
├── docs/               # Evidencias y documentación del taller
├── .gitignore          # Archivos e historial excluidos del rastreo
└── README.md           # Descripción general del repositorio
```

---

## 🛠️ Comandos de Git Utilizados

| Comando | Descripción |
| :--- | :--- |
| `git status` | Muestra el estado del directorio de trabajo y del staging area. |
| `git add .` | Agrega los archivos modificados al área de preparación. |
| `git commit -m "mensaje"` | Registra los cambios preparados en el historial. |
| `git stash` / `git stash pop` | Guarda o recupera cambios temporales sin hacer commit. |
| `git checkout -b <rama>` | Crea y cambia a una nueva rama de trabajo. |
| `git merge <rama>` | Fusiona la rama indicada con la rama activa actual. |

---

## ✒️ Buenas Prácticas Aplicadas (Clean Code)

- **Nombres significativos:** Variables y funciones descriptivas (ej. `userList` en lugar de `ul`).
- **Declaración segura:** Uso estricto de `const` por defecto y `let` únicamente cuando el valor sea reasignado.
- **Funciones pequeñas:** Funciones enfocadas en cumplir una sola tarea (Single Responsibility Principle).
- **Separación de responsabilidades:** Uso del archivo `.gitignore` para omitir módulos pesados o variables de entorno (`node_modules/`, `.env`).

---

## 🤝 Colaboración

1. Haz un *Fork* del repositorio.
2. Crea una rama para tu función (`git checkout -b feature/nueva-funcionalidad`).
3. Realiza tus cambios y confirma (`git commit -m 'Añade nueva funcionalidad'`).
4. Sube la rama (`git push origin feature/nueva-funcionalidad`).
5. Abre un **Pull Request** para revisión.

---

## 📝 Licencia y Entregables

Este trabajo ha sido desarrollado como evidencia de aprendizaje según los lineamientos del taller impartido en la formación ADSO.
