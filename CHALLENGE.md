# CHALLENGE — Cloud Engineer

## 1. Contexto de negocio

Kambista está lanzando un nuevo microservicio interno llamado **`quotes-api`**: una API REST que devuelve cotizaciones de divisas (USD/PEN, EUR/PEN, etc.), consulta histórico y guarda nuevas cotizaciones generadas por los proveedores. Este servicio será consumido por el frontend web, la app móvil y procesos batch internos.

Tu misión como Cloud Engineer es **diseñar, provisionar y desplegar en GCP la infraestructura que soporta este servicio**, cumpliendo los estándares que usamos en Kambista: Infrastructure as Code, despliegues automatizados, alta disponibilidad razonable, observabilidad y documentación operativa.

Es un escenario muy parecido al trabajo real que harás en tu primera semana si te unes al equipo.

---

## 2. Objetivo

Al final del reto, debes poder entregar:

1. **Infraestructura reproducible en GCP** gestionada con **Terraform**.
2. Un **clúster GKE** con el servicio `quotes-api` desplegado, respaldado por **MongoDB**.
3. Un **Load Balancer HTTP(S)** que expone el servicio a Internet, con **Nginx como reverse proxy** delante de la API.
4. Un **pipeline en GitHub Actions** que construye la imagen, la sube a **Artifact Registry** y despliega a GKE.
5. Un **diagrama de arquitectura** claro de lo que construiste.
6. Un **runbook operativo** con los procedimientos mínimos para operar el servicio.

---

## 3. Arquitectura esperada (resumen)

```
          Internet
             │
             ▼
   ┌──────────────────────┐
   │ Google Cloud HTTP(S) │   (External Load Balancer)
   │   Load Balancer      │
   └──────────┬───────────┘
              │
              ▼
   ┌──────────────────────┐
   │     GKE Cluster      │
   │  ┌────────────────┐  │
   │  │ Nginx (reverse │  │   <-- Deployment o Ingress Controller
   │  │    proxy)      │  │
   │  └───────┬────────┘  │
   │          │           │
   │  ┌───────▼────────┐  │
   │  │  quotes-api    │  │   <-- Node.js Deployment (>= 2 réplicas)
   │  └───────┬────────┘  │
   │          │           │
   │  ┌───────▼────────┐  │
   │  │    MongoDB     │  │   <-- StatefulSet + PVC (persistente)
   │  └────────────────┘  │
   └──────────────────────┘
```

Ver el detalle en [`docs/arquitectura-esperada.md`](./docs/arquitectura-esperada.md).

> **Nota:** Si prefieres MongoDB fuera del clúster (p. ej. MongoDB Atlas o self-hosted en Compute Engine), puedes hacerlo y justificar la decisión en tu README. Lo importante es que el patrón de conexión, secretos y backups quede claro.

---

## 4. Requisitos funcionales

### 4.1. Infraestructura como código (Terraform)

Con Terraform debes provisionar, como mínimo:

- **VPC** dedicada con al menos una **subred** en la región elegida (recomendado `us-central1` o `southamerica-west1`).
- **Clúster GKE** (regional o zonal, tú decides y justificas). Puede ser **Autopilot** o **Standard**; si eliges Standard, configura un node pool razonable (2-3 nodos e2-small/medium es suficiente).
- **Artifact Registry** para alojar la imagen Docker de la app.
- **Service Accounts** y **roles IAM** mínimos necesarios para:
  - Que GitHub Actions pueda subir imágenes y desplegar (usa **Workload Identity Federation**, no JSON keys).
  - Que los pods accedan a los recursos que necesiten.
- **Cloud NAT + Cloud Router** si tus nodos son privados (recomendado).
- **Secretos** en **Secret Manager** (al menos la cadena de conexión a MongoDB o credenciales).

El código Terraform debe estar organizado (módulos, variables, outputs), ser idempotente y correr con `terraform init && terraform plan && terraform apply` sin pasos manuales ocultos. Usa remote state si puedes (GCS bucket).

### 4.2. Kubernetes

- Manifiestos YAML o un **chart de Helm** (bonus) para:
  - `Deployment` de `quotes-api` con al menos **2 réplicas**, `readinessProbe` y `livenessProbe`.
  - `Deployment` de **Nginx** como reverse proxy delante de la API (o bien Nginx Ingress Controller, tu decides).
  - `StatefulSet` para MongoDB con `PersistentVolumeClaim` (si decides hostearlo en el clúster).
  - `Service` y `Ingress` (o `Gateway`) para exponer el tráfico.
  - `Secret` (poblado desde Secret Manager, idealmente vía **External Secrets Operator** o **CSI Secrets Store driver** — bonus) para credenciales de Mongo.
  - `HorizontalPodAutoscaler` para `quotes-api`.
- La app debe estar **accesible desde Internet** vía una URL/IP pública durante la revisión.

### 4.3. Nginx

Nginx debe estar configurado como **reverse proxy** delante de `quotes-api`. Define una `nginx.conf` que haga, como mínimo:

- `proxy_pass` a la API.
- Headers `X-Forwarded-For`, `X-Forwarded-Proto`, `Host`.
- Timeouts y `client_max_body_size` razonables.
- Un endpoint `/healthz` propio de Nginx para probes.

### 4.4. CI/CD con GitHub Actions

Un workflow (`.github/workflows/deploy.yml` o similar) que:

1. En `push` a `main` (o a una rama que tú definas):
2. Haga `docker build` de la app (puedes usar la que está en `/app` o la tuya).
3. Autentíquese a GCP con **Workload Identity Federation**.
4. Suba la imagen a **Artifact Registry** con tag `sha-<commit>` y `latest`.
5. Haga `kubectl apply` o `helm upgrade` al clúster GKE.
6. (Bonus) Corra un smoke test contra la URL pública al final.

No queremos ver JSON keys de Service Accounts hardcodeadas o en GitHub Secrets.

### 4.5. Observabilidad mínima

No necesitamos un stack completo, pero sí ver que entiendes el tema:

- Logs de la app deben llegar a **Cloud Logging** (nativo en GKE).
- Al menos **3 métricas clave** monitoreadas en **Cloud Monitoring** o Datadog/Prometheus (bonus).
- **1 alerta** configurada (ejemplo: pods en CrashLoopBackOff, latencia p95 > X, 5xx > Y%).

Explica en tu README qué monitorearías en producción real y por qué.

### 4.6. Documentación

- **Diagrama de arquitectura** (imagen, draw.io, excalidraw, mermaid… lo que prefieras). Debe reflejar lo que efectivamente construiste.
- **Runbook** usando la plantilla en [`docs/runbook-template.md`](./docs/runbook-template.md).
- **README** en tu fork con: cómo desplegar desde cero, cómo destruir todo, decisiones tomadas y trade-offs.

---

## 5. Requisitos no funcionales

- **Alta disponibilidad razonable**: mínimo 2 réplicas de la app, estrategia de rolling update, probes bien definidos.
- **Seguridad básica**:
  - Nodos GKE **privados** (sin IP pública directa).
  - Secretos nunca en el repo.
  - IAM mínimo necesario.
  - HTTPS en el Load Balancer (certificado administrado por Google; dominio tuyo o `*.nip.io` / `*.sslip.io` si no tienes uno).
- **Costos bajo control**: pensado para correr con los **USD 300 de créditos gratis** de GCP. Instancia pequeña, clúster no sobredimensionado.
- **Destrucción limpia**: `terraform destroy` debe dejar la cuenta sin recursos huérfanos.

---

## 6. Bonus (opcional, suma puntos)

No necesitas hacer todo. Elige lo que te interese demostrar:

- 🔐 **Cloud Armor** con una política WAF básica (bloquear SQLi, XSS, geoblock, rate limit).
- 📊 **Datadog** o **Prometheus + Grafana** con un dashboard custom.
- ⚙️ **Helm** chart propio para la app.
- 🚀 **ArgoCD** o **FluxCD** para GitOps (reemplazando el `kubectl apply` del pipeline).
- 🧪 **k6** o **Locust** con un script de carga y evidencia de autoescalado (HPA) reaccionando.
- 🐍 Scripts en **Bash** o **Python** para tareas operativas (ej. backup de Mongo, rotación de secretos, bootstrap del proyecto).
- 🏷️ **Terragrunt** o uso de módulos públicos (p. ej. `terraform-google-modules`).
- 🧊 **Backup automatizado** de MongoDB a Cloud Storage.
- 🔁 **Canary deployment** con Argo Rollouts o similar.

---

## 7. Restricciones

- Usa **GCP** (no AWS/Azure).
- Usa **Terraform** para la infraestructura (no Deployment Manager, no gcloud scripts para recursos core).
- Usa **GitHub Actions** (no CircleCI, no GitLab CI).
- Usa **MongoDB** (no cambies a Postgres/MySQL).
- Puedes elegir cualquier **región** de GCP y cualquier **versión** de GKE y Mongo.
- Usa **la app que está en `/app`** o aporta la tuya propia respetando el contrato (expone `/health`, `/quotes` GET/POST).

---

## 8. Cómo te vamos a evaluar

Los criterios de alto nivel son:

| Dimensión | Qué miramos |
|---|---|
| **Terraform** | Organización, módulos, variables, outputs, idempotencia, state. |
| **Kubernetes** | Manifests limpios, probes, HPA, strategy, secretos, HA. |
| **CI/CD** | Pipeline funcional, Workload Identity, buenos tags, smoke test. |
| **Seguridad** | Nodos privados, IAM mínimo, secretos fuera del repo, HTTPS. |
| **Observabilidad** | Logs, métricas, al menos una alerta útil. |
| **Documentación** | README claro, diagrama fiel, runbook útil. |
| **Decisiones** | Trade-offs explicados: costos, HA, backups, elecciones. |
| **Bonus** | Puntos extra por lo que hagas de la lista anterior. |

El detalle fino (rúbrica de evaluación) lo usamos internamente, pero si hay algo que te preocupa de cómo te vamos a evaluar, pregúntanos.

---

## 9. Un último consejo

Preferimos ver una solución **más pequeña bien hecha** que una grande incompleta. Si tienes que elegir, prioriza:

1. Que **funcione de punta a punta** (poder hacer `curl` a tu URL y recibir datos de Mongo).
2. Que esté **todo versionado** en el repo (no scripts que corriste local sin commitear).
3. Que la **documentación** permita a otra persona reproducirlo.

¡A por ello! 💪
