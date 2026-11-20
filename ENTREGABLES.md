# Entregables

Usa esta lista como checklist antes de abrir tu Pull Request.

## 📁 En tu fork del repo

- [ ] `terraform/` con todo el código de infraestructura (módulos, variables, outputs, `README.md` de cómo correrlo).
- [ ] `k8s/` (o `helm/`) con los manifiestos o chart de Kubernetes.
- [ ] `.github/workflows/` con el pipeline de CI/CD.
- [ ] `nginx/` (o dentro de `k8s/`) con la `nginx.conf` que usaste.
- [ ] `docs/` con:
  - [ ] `arquitectura.png` o `arquitectura.md` (diagrama final, el que corresponde a lo que construiste).
  - [ ] `runbook.md` (basado en [`docs/runbook-template.md`](./docs/runbook-template.md)).
  - [ ] `decisiones.md` o sección equivalente en el README: por qué elegiste GKE Autopilot vs Standard, dónde pusiste Mongo, qué dejaste pendiente, etc.
- [ ] `README.md` principal actualizado con **instrucciones paso a paso** para desplegar desde cero.
- [ ] `.gitignore` sano (sin `terraform.tfstate`, `*.tfvars` con secretos, `kubeconfig`, etc.).

## 🖼️ Evidencia (en el cuerpo del PR o en `docs/evidencia/`)

- [ ] URL pública (o IP) del servicio desplegado funcionando. Mantén el servicio **vivo durante al menos 48 horas** después de abrir el PR para que podamos probarlo.
- [ ] Captura de `kubectl get pods,svc,ingress -A` mostrando todo `Running`.
- [ ] Captura del pipeline de GitHub Actions corriendo en verde.
- [ ] Captura de **Artifact Registry** con al menos una imagen de la app.
- [ ] Captura de un dashboard de Cloud Monitoring (o Datadog/Grafana si fuiste por bonus) con alguna métrica.
- [ ] Captura o export de la **alerta** configurada.
- [ ] Salida de `curl https://tu-url/health` y `curl https://tu-url/quotes`.

## 🔐 Cosas que NO queremos ver

- [ ] Ningún JSON key de Service Account commiteado.
- [ ] Ningún `terraform.tfstate` en el repo.
- [ ] Ningún password de Mongo en claro en un YAML.
- [ ] Ningún `kubectl apply` manual que no esté replicado en el pipeline o documentado.

## ✉️ Cómo entregar

1. Abre un **Pull Request** desde tu fork hacia este repo original.
2. En la descripción del PR incluye:
   - URL pública del servicio.
   - Resumen de 3-5 líneas de tu enfoque.
   - Qué bonus hiciste.
   - Qué dejarías pendiente para "fase 2" si tuvieras más tiempo.
3. Avísanos por el canal habitual (Slack/correo con quien te contactó).

## 🧹 Después de la revisión

Una vez te confirmemos que recibimos tu entrega, **destruye los recursos** con `terraform destroy` para que no sigas consumiendo créditos. Haznos saber cuándo lo destruiste.
