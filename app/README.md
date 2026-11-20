# quotes-api — App de referencia

API minimalista en **Node.js + Express + Mongoose** que usamos como workload para el reto. **No necesitas tocar el código** — tu foco es la infraestructura, no la app.

## Endpoints

| Método | Ruta | Descripción |
|---|---|---|
| `GET` | `/` | Mensaje de bienvenida y lista de endpoints. |
| `GET` | `/health` | Liveness. `200` si Mongo responde, `503` si no. |
| `GET` | `/ready` | Readiness. `200` solo si Mongo está conectado. |
| `GET` | `/quotes?pair=USD/PEN&limit=20` | Lista cotizaciones (más recientes primero). |
| `POST` | `/quotes` | Crea una cotización. Body: `{ "pair": "USD/PEN", "buy": 3.70, "sell": 3.75, "source": "opcional" }`. |

## Variables de entorno

| Variable | Default | Descripción |
|---|---|---|
| `PORT` | `3000` | Puerto donde escucha. |
| `MONGO_URI` | `mongodb://localhost:27017/quotes` | Cadena de conexión a MongoDB. **Debe venir de un Secret.** |
| `SERVICE_NAME` | `quotes-api` | Nombre reportado en logs y endpoints. |

## Correr local (para probar rápido)

```bash
cd app
npm install
MONGO_URI=mongodb://localhost:27017/quotes npm start
```

(Necesitas un Mongo corriendo. `docker run -d -p 27017:27017 mongo:7` sirve.)

Pruebas rápidas:

```bash
curl http://localhost:3000/health
curl -X POST http://localhost:3000/quotes \
  -H 'content-type: application/json' \
  -d '{"pair":"USD/PEN","buy":3.70,"sell":3.75}'
curl http://localhost:3000/quotes
```

## Imagen Docker

```bash
cd app
docker build -t quotes-api:local .
docker run --rm -p 3000:3000 -e MONGO_URI=mongodb://host.docker.internal:27017/quotes quotes-api:local
```

El pipeline de GitHub Actions que construyas debe reemplazar esto: tag por SHA, push a Artifact Registry, deploy a GKE.

## Notas de diseño (para tu infra)

- **Logs** van a stdout en JSON. En GKE irán a Cloud Logging automáticamente.
- **Readiness** y **liveness** están separados; aprovecha esto en tus probes de Kubernetes:
  - `livenessProbe` → `/health`
  - `readinessProbe` → `/ready`
- La app maneja **SIGTERM** y cierra el server graciosamente (hasta 10s). Configura `terminationGracePeriodSeconds` acorde en tu Deployment.
- **No tiene autenticación**. Si pones Cloud Armor con bloqueo por IP/geo delante, mejor.
- **No tiene rate limit** propio. Puedes ponerlo en Nginx o Cloud Armor.

## Si quieres cambiarla

Puedes aportar tu propia app en el lenguaje que gustes, siempre que cumpla el contrato mínimo (ver tabla de endpoints). Si lo haces, documenta el cambio en tu README raíz.
