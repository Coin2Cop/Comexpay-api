# 🚀 COMEXPAY API Backend - Sistema de Gestión de Comercio Exterior y KYC

API Backend robusta desarrollada para la plataforma **COMEXPAY**, diseñada para gestionar procesos de comercio exterior, verificación de identidad (KYC) mediante OCR, gestión de documentos y administración de importaciones.

Este proyecto está orientado a un entorno empresarial, con una arquitectura modular y escalable, preparada para despliegue en servidores de producción.

---

## 📌 Características Principales

- **Gestión de Identidad (KYC)**: Verificación automatizada de documentos (Cédulas, Pasaportes) utilizando OCR con **PaddleOCR**.
- **Seguridad y Autenticación**: Sistema basado en **JWT (JSON Web Tokens)** con soporte para Cookies y encabezados de autorización.
- **Control de Acceso (RBAC)**: Middleware para restricción de rutas basado en roles de usuario.
- **Gestión Documental**: Carga, validación y almacenamiento de documentos técnicos y legales.
- **Módulo de Importaciones**: Seguimiento detallado de procesos de importación y contratos.
- **Administración de Empresas**: Registro y validación de datos empresariales.
- **Documentación Integrada**: Documentación interactiva de la API con **Swagger**.
- **Notificaciones**: Integración con servicios de correo electrónico (Nodemailer).
- **Almacenamiento en la Nube**: Preparado para integración con AWS S3.

---

## 🛠️ Stack Tecnológico

### Backend (Node.js)
- **Runtime**: Node.js (LTS recomendado)
- **Framework**: Express.js
- **Base de Datos**: MongoDB con Mongoose (ODM)
- **Procesamiento de Imágenes**: Sharp, Canvas
- **Validación**: Validator, Joi
- **Documentación**: Swagger UI Express

### OCR & Inteligencia Artificial (Python)
- **Motor OCR**: [PaddleOCR](https://github.com/PaddlePaddle/PaddleOCR)
- **Lenguaje**: Python 3.x
- **Dependencias**: PaddlePaddle, OpenCV

---

## 📂 Estructura del Proyecto

```text
📁 comexpay-api
│
├── 📁 src/
│   ├── 📁 config/          # Configuración de servicios (DB, Mail, AWS)
│   ├── 📁 controllers/     # Lógica de negocio por módulo
│   ├── 📁 database/        # Conexión y esquemas de base de datos
│   ├── 📁 files/           # Almacenamiento local de archivos temporales
│   ├── 📁 middleware/      # Verificación de tokens y permisos
│   ├── 📁 services/        # Servicios externos y utilidades complejas
│   ├── 📁 v1/              # Versionamiento de la API
│   │   ├── 📁 routes/      # Definición de rutas (Comexpay, Auth)
│   │   └── swagger.js      # Configuración de Swagger
│   └── index.js            # Punto de entrada de la aplicación
│
├── 📁 light_model/         # Modelos livianos para PaddleOCR
├── paddle_ocr_service.py   # Servicio puente para procesamiento OCR
├── eng.traineddata         # Datos de entrenamiento Tesseract (Inglés)
├── spa.traineddata         # Datos de entrenamiento Tesseract (Español)
├── Dockerfile              # Configuración para contenedorización
└── package.json            # Dependencias de Node.js
```

---

## ⚙️ Configuración del Entorno

El proyecto requiere un archivo `.env` en la raíz. Puedes basarte en `example.env`:

```env
PORT=3002
MONGODB_URI=mongodb://...
JWT_SECRET=tu_secreto_aqui
MAIL_HOST=smtp.example.com
MAIL_PORT=587
MAIL_USERNAME=usuario@ejemplo.com
MAIL_PASSWORD=password
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...
AWS_REGION=...
```

---

## ▶️ Instalación y Configuración

### 1. Requisitos Previos
- Node.js v16+
- MongoDB
- Python 3.8+ (para el servicio OCR)

### 2. Instalación de Dependencias Node.js
```bash
npm install
```

### 3. Configuración del Entorno Python (OCR)
Para que el módulo KYC funcione, es necesario configurar un entorno virtual de Python:

```bash
# Crear entorno virtual
python3 -m venv venv

# Activar entorno virtual
source venv/bin/activate  # En Linux/macOS
# venv\Scripts\activate  # En Windows

# Instalar dependencias necesarias
pip install paddleocr paddlepaddle opencv-python
```

---

## 🚀 Ejecución

### Desarrollo
```bash
npm run dev
```

### Producción
```bash
npm start
```
*Se recomienda el uso de **PM2** para mantener el proceso activo:*
```bash
pm2 start src/index.js --name comexpay-api
```

---

## 📖 Documentación de la API

Una vez iniciada la aplicación, puedes acceder a la documentación interactiva en:
`http://localhost:3002/api/v1/docs` (o el puerto configurado).

---

## 🧠 Detalles Técnicos del OCR

El sistema utiliza un script de Python (`paddle_ocr_service.py`) que es invocado desde Node.js mediante `execFile`.

- **Modelos**: Utiliza modelos livianos ubicados en `./light_model` para mejorar la velocidad de respuesta.
- **Idiomas**: Configurado principalmente para español (`lang='es'`).
- **Integración**: Los controladores de KYC envían la ruta de la imagen al script y reciben un JSON con el texto extraído.

---

## 🔒 Seguridad y Despliegue

- **CORS**: Configurado en `src/index.js` para permitir solo dominios específicos (`comexpay.co`). Asegúrate de actualizar la lista si cambias el dominio del frontend.
- **Proxy Inverso**: Se recomienda usar **Nginx** como proxy inverso frente a la aplicación Node.js.
- **SSL**: Imprescindible el uso de HTTPS en producción (Certbot/Let's Encrypt).
- **Docker**: Se incluye un `Dockerfile` básico. Nota: Para producción con OCR, el contenedor debe incluir las dependencias de Python y PaddlePaddle.

---

## 🤝 Contribución

1. Crea una rama para tu funcionalidad (`git checkout -b feature/nueva-mejora`).
2. Realiza tus cambios y haz commit (`git commit -am 'Añade nueva mejora'`).
3. Sube la rama (`git push origin feature/nueva-mejora`).
4. Abre un Pull Request.

---
Desarrollado para **COMEXPAY**. 🚀
