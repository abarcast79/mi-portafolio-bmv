📊 Track: Aprender Claude → Finanzas Personales
Progreso General & Próximos Pasos

INFORMACIÓN DEL ESTUDIANTE
Nombre: Abraham Araujo
Email: abraham.araujo@gmail.com
Ubicación: Toluca, Estado de México
Experiencia: Senior PM (20+ años en HSBC México)
Objetivo: Aprender Claude, construir herramientas útiles, monetizar después
Formato: Sesiones de 20-30 min por las tardes (sin presión)


SESIÓN 1: Fundamentos + Dashboard HTML/React ✅
Fecha: 20 junio 2026 | Duración: ~45 min
Aprendiste:
localStorage (guardado automático en navegador)
Reactividad en tiempo real (cambios instantáneos)
Diferencia Precio Costo vs Actual
HTML vanilla vs React vs Vite
Hot reload (cambios sin recargar)
Construiste:
Dashboard HTML standalone (descargable, offline)
Dashboard React + Vite (profesional, con hot reload)
Tabla editable con 5 posiciones (TSLA.MX, NVDA.MX, INTC.MX, AMZN.MX, SPCX)
Gráfico pie chart automático
P&L calculations en vivo
Usarás:
Laptop: http://localhost:5174 (servidor local Vite)
O archivo HTML descargado
Entregables:
✅ mi_portafolio_bmv.html (versión standalone)
✅ Proyecto Vite en tu laptop
✅ PDF: Sesion_1_Aprender_Claude_Dashboard_BMV.pdf


SESIÓN 2: Integración Notion + Vercel ✅
Fecha: 20 junio 2026 | Duración: ~120 min (incluye debugging)
Aprendiste:
APIs REST (cómo hablan las aplicaciones)
Backend vs Frontend (Vercel = servidor, React = navegador)
Environment Variables (guardar secrets seguramente)
Integración de plataformas (Notion + GitHub + Vercel + React)
Debugging sistemático (logs, permisos, IDs)
Construiste:
Notion Database "Posiciones" (5 tickers)
Personal Access Token (Notion)
GitHub repo: abarcast79/mi-portafolio-bmv
Vercel deployment: https://mi-portafolio-bmv.vercel.app/
Endpoint /api/notion.js (backend que lee de Notion)
Botón "🔄 Sincronizar desde Notion" (en React)
Flujo:
Editas en Notion → Presionas botón → fetch a Vercel → 

Vercel llama Notion API → React recibe datos → 

Dashboard se actualiza → localStorage guarda
Usarás:
Mañana 6am: edita Notion → presiona botón → dashboard actualizado
Entregables:
✅ Notion Database conectada
✅ GitHub repo pusheado
✅ Vercel deploado y funcional
✅ Endpoint /api/notion testado ✅
✅ PDF: Sesion_2_Notion_Vercel_Sincronizacion.pdf


SESIÓN 3: Automatización + Alertas ⏳ PRÓXIMA
Objetivo: Notificaciones automáticas + inteligencia
Planeado:
Auto-sync cada 30 seg (sin presionar botón)
WhatsApp alerts: TSLA sube/baja >3% → notificación WhatsApp
Email semanal: Resumen de portafolio
Web search: Noticias de BMV automáticas
Integración Twilio (WhatsApp messaging)
Requisitos:
Twilio account (gratis, 5 min)
Número de teléfono para WhatsApp
45-60 minutos
Entregable:
PDF: Sesion_3_Alertas_WhatsApp_Automatizacion.pdf


SESIÓN 4: Skills Personalizados ⏳ DESPUÉS
Objetivo: Crear herramientas reutilizables
Planeado:
Skill para analizar CVs como PM
Skill para evaluar ofertas de trabajo
Skill para análisis de mercado BMV
Documentación para vender después
Entregable:
PDF: Sesion_4_Skills_Personalizados.pdf


SESIÓN 5: Monetización ⏳ FINAL
Objetivo: Convertir todo en producto vendible
Planeado:
Bundle de 5 PDFs
Documentación completa
Código GitHub público
Portafolio profesional
Estrategia de venta (Gumroad, Udemy, LinkedIn)
Entregable:
PDF: Sesion_5_Monetizacion_Estrategia.pdf


ARCHIVOS CLAVE
Código
mi-portafolio-bmv/

├── src/

│   ├── App.jsx (React component principal)

│   ├── App.css (estilos)

│   └── main.jsx

├── api/

│   └── notion.js (endpoint Vercel)

├── package.json

└── vite.config.js
GitHub
Repo: https://github.com/abarcast79/mi-portafolio-bmv
Todos los cambios versionados
Vercel
URL: https://mi-portafolio-bmv.vercel.app/
Endpoint: /api/notion (funcional ✅)
Env variables: NOTION_TOKEN configurado ✅
Notion
Database: https://app.notion.com/p/385b5a3691c781a9a859e83f52739346
Database ID: 82d7318bf1c146cc9129961b7bb36dc7
5 Posiciones: TSLA.MX, NVDA.MX, INTC.MX, AMZN.MX, SPCX
Integración conectada: mi-portafolio-bmv ✅
PDFs Descargables
Sesion_1_Aprender_Claude_Dashboard_BMV.pdf ✅
Sesion_2_Notion_Vercel_Sincronizacion.pdf ✅
(Próximas 3 en construcción)


COMANDOS ÚTILES
Local (Laptop)
# Arrancar servidor Vite

cd mi-portafolio-bmv

npm run dev

# Ver en navegador

http://localhost:5174

# Push a GitHub

git add .

git commit -m "Mensaje"

git push
Vercel
Automático: cada push a GitHub → redeploy automático
Notion
Database: https://app.notion.com/p/385b5a3691c781a9a859e83f52739346


PLAN PRÓXIMA SESIÓN (3)
Duración: 45-60 min
Tareas previas:
Crea cuenta Twilio (gratis): https://www.twilio.com/
Verifica tu número de teléfono para WhatsApp
Nota: Notion + GitHub + Vercel deberían estar activos
En Sesión 3:
Integración Twilio en endpoint
Crear lógica de alertas (>3% cambio)
Prueba de WhatsApp en vivo
Email automático opcional
PDF de Sesión 3
Resultado esperado:
6am: Recibes alerta en WhatsApp si TSLA sube/baja
Dashboard auto-sincronizado (sin botón)
Listo para Sesión 4 (Skills)


MONETIZACIÓN FINAL
Asset después de Sesión 5:
5 PDFs profesionales

  + Proyecto funcional en GitHub

  + URL Vercel público

  + Documentación completa

  = Mini-curso vendible ($29-49)
Opciones de venta:
Gumroad (simple, toma comisión pequeña)
Podia (cursos + comunidad)
Udemy (alcance masivo, comisión grande)
Tu sitio (máximo control)
LinkedIn (servicios de asesoría)


NOTAS IMPORTANTES
Tokens & Secrets
Notion Token: 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 (en Vercel ✅)
NUNCA compartir públicamente
NUNCA commitear en GitHub
URLs Clave
GitHub: https://github.com/abarcast79/mi-portafolio-bmv
Vercel: https://mi-portafolio-bmv.vercel.app/
Notion DB: https://app.notion.com/p/385b5a3691c781a9a859e83f52739346
Localización
Horarios: Tardes (20-30 min, sin presión)
Zona: Toluca, MX
Plataforma: Claude.ai + Projects
Ritmo: A tu velocidad (no hay racha)


PRÓXIMA SESIÓN: Sesión 3 - Automatización + Alertas WhatsApp
Cuándo: Cuando tengas energía Duración: 45-60 min Dificultad: Media (APIs, webhooks) Diversión: 🔥 (notificaciones en tiempo real)



Last updated: 20 junio 2026 Status: ✅ Sesiones 1-2 completadas. Sesión 3 ready cuando digas.

