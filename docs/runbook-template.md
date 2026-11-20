# Runbook — quotes-api

> Plantilla. Rellena cada sección con información real de tu despliegue. No elimines secciones aunque no apliquen — márcalas como "N/A" y explica por qué.

---

## 1. Resumen del servicio

- **Nombre del servicio:** quotes-api
- **Dueños:** <tu nombre o equipo ficticio>
- **Repositorio:** <link al fork>
- **URL pública:** <https://...>
- **Entorno:** producción (reto)
- **Región GCP:** <us-central1 / southamerica-west1 / etc.>
- **Proyecto GCP:** <project-id>
- **On-call:** <quién atiende si algo falla — para el reto puedes poner "yo">

## 2. Diagrama de arquitectura

Incluir o enlazar [`arquitectura.png`](./arquitectura.png) o equivalente.

## 3. SLOs / Objetivos

| Métrica | Objetivo | Cómo medimos |
|---|---|---|
| Disponibilidad | 99.0% mensual | % de health checks ok |
| Latencia p95 | < 500ms | request_duration_seconds en LB |
| Error rate | < 1% 5xx | logs de nginx/app |

(Ajusta los valores según tu diseño.)

## 4. Accesos y herramientas

- **Consola GCP:** https://console.cloud.google.com/?project=<project-id>
- **Clúster GKE:**
  ```bash
  gcloud container clusters get-credentials <cluster-name> \
      --region <region> --project <project-id>
  ```
- **Logs:**
  ```bash
  kubectl logs -n quotes -l app=quotes-api --tail=200 -f
  ```
- **Métricas:** link al dashboard de Cloud Monitoring.
- **Alertas:** link a la policy.
- **Pipeline:** link al workflow de GitHub Actions.
- **Imagen:** `region-docker.pkg.dev/<project>/<repo>/quotes-api:<tag>`

## 5. Deploy

### Deploy normal
1. Merge a `main` → pipeline corre automático.
2. El pipeline:
   - Buildea imagen.
   - Sube a Artifact Registry con tag `sha-<commit>`.
   - Actualiza el Deployment vía `kubectl set image` o `helm upgrade`.
3. Verificar con `kubectl rollout status deploy/quotes-api -n quotes`.
4. Probar `curl https://<url>/health`.

### Deploy manual (emergencia)
```bash
export IMAGE=region-docker.pkg.dev/<proj>/<repo>/quotes-api:<tag>
kubectl set image deployment/quotes-api quotes-api=$IMAGE -n quotes
kubectl rollout status deployment/quotes-api -n quotes
```

## 6. Rollback

```bash
kubectl rollout history deployment/quotes-api -n quotes
kubectl rollout undo deployment/quotes-api -n quotes
# o a una revisión específica:
kubectl rollout undo deployment/quotes-api -n quotes --to-revision=3
```

Si el rollback no basta porque hubo cambios de schema en Mongo, documentar aquí.

## 7. Troubleshooting

### 7.1. El servicio devuelve 502 / 503

1. Verificar pods: `kubectl get pods -n quotes`.
2. Si hay pods `CrashLoopBackOff`: `kubectl logs <pod> -n quotes --previous`.
3. Verificar que Nginx apunta al Service correcto: `kubectl describe svc quotes-api -n quotes`.
4. Verificar que MongoDB está `Running` y responde: `kubectl exec -it mongo-0 -n quotes -- mongosh --eval "db.runCommand({ping:1})"`.

### 7.2. Latencia alta

1. Revisar dashboard en Cloud Monitoring.
2. `kubectl top pods -n quotes` para ver CPU/mem.
3. Si CPU al límite: HPA debería estar escalando. Verificar `kubectl get hpa -n quotes`.
4. Revisar queries de Mongo lentas.

### 7.3. HPA no escala

1. `kubectl describe hpa quotes-api -n quotes` → mirar eventos.
2. Confirmar que `metrics-server` o `custom-metrics` está corriendo.
3. Confirmar que el Deployment tiene `resources.requests` definidos (sin eso el HPA no funciona por CPU).

### 7.4. Pipeline falla al desplegar

1. Verificar permisos de Workload Identity Federation.
2. Verificar que el runner tenga `kubectl` y `gcloud` disponibles.
3. Revisar logs del workflow en GitHub.

### 7.5. Mongo no persiste datos

1. Verificar que el PVC esté `Bound`: `kubectl get pvc -n quotes`.
2. Verificar que la StorageClass es `standard-rwo` o similar (no `emptyDir`).

## 8. Escalado

### Vertical (más CPU/mem por pod)
Editar `resources.requests/limits` en el Deployment y hacer `kubectl apply`.

### Horizontal
HPA ya debe estar configurado. Para forzar:
```bash
kubectl scale deployment quotes-api -n quotes --replicas=5
```

### Cluster
Autopilot: automático. Standard: ajustar `min_node_count` / `max_node_count` del node pool.

## 9. Backups y restore

**MongoDB:**
- Estrategia actual: <documenta: snapshot de PVC, mongodump a GCS, etc.>
- Frecuencia: <cada N horas>
- Retención: <N días>
- Procedimiento de restore:
  ```bash
  # TODO: documentar comandos exactos
  ```

## 10. Rotación de secretos

Procedimiento para rotar la credencial de Mongo sin downtime:
1. Crear nuevo usuario en Mongo con los mismos permisos.
2. Actualizar el secret en Secret Manager.
3. Recargar pods: `kubectl rollout restart deployment/quotes-api -n quotes`.
4. Eliminar usuario antiguo.

## 11. Costos

Estimado mensual del stack (si corriera 24/7):
- GKE: USD ~<X>
- Load Balancer: USD ~<X>
- Artifact Registry: USD ~<X>
- Cloud Logging: USD ~<X>
- **Total:** USD ~<X>

Acciones de reducción de costo rápidas:
- Apagar nodos de noche (si no es 24/7).
- Reducir número de réplicas al mínimo.
- Reducir retención de logs.

## 12. Escalamiento del incidente

1. **Intentar resolver** usando esta runbook (≤30 min).
2. Si no se resuelve, **escalar** a <nombre>.
3. Si hay impacto a usuarios reales, notificar a soporte/comunicación.
4. Postmortem obligatorio para cualquier incidente con impacto.

## 13. Postmortem template

Cuando haya un incidente real, crear `docs/postmortems/YYYY-MM-DD-<slug>.md` con:
- **Qué pasó** (narrativa)
- **Impacto** (usuarios, tiempo, dinero)
- **Timeline** (minuto a minuto)
- **Causa raíz**
- **Qué funcionó** del response
- **Qué no funcionó**
- **Action items** (dueño + fecha)

## 14. Contactos y escalado externo

- Soporte GCP: <link>
- Soporte MongoDB (si Atlas): <link>
- Dueño del dominio: <quién>

---

**Última actualización:** <fecha>
**Actualizado por:** <nombre>
