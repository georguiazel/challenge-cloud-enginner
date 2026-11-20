# FAQ — Reto Cloud Engineer

## 🏦 Cuenta GCP y créditos

### ¿Qué cuenta uso?
Una **cuenta personal tuya**. No vamos a darte acceso a la cuenta de Kambista.

### ¿Me va a costar dinero?
No, siempre y cuando aproveches los **USD 300 de créditos gratis** que Google Cloud entrega a toda cuenta nueva con un correo Gmail. Esos créditos duran 90 días.

Pasos:
1. Entra a https://cloud.google.com/free con tu correo personal.
2. Activa la cuenta (pide tarjeta pero **no cobra** mientras uses el free trial).
3. Crea un **proyecto nuevo** solo para este reto.
4. Al terminar, **destruye todo con `terraform destroy`** para no gastar los créditos en nada más.

### ¿Y si ya usé mis créditos antes?
Avísanos. Podemos coordinar una alternativa (por ejemplo, entregar `terraform plan` + evidencia de `kubectl --dry-run` + `docker build` local).

---

## ⏰ Tiempo y alcance

### ¿Cuánto tiempo invierto?
Entre **10 y 15 horas** reales de trabajo. El plazo calendario es de **7 días**.

### ¿Tengo que hacer todos los bonus?
No. Los bonus son opcionales. Preferimos que entregues menos cosas bien hechas a muchas cosas a medias.

### ¿Puedo pedir extensión?
Sí, siempre que nos avises con 24h de antelación. No es penalizador si tienes una razón razonable.

### ¿Puedo entregar antes de 7 días?
Por supuesto.

---

## 🧰 Tecnologías

### ¿Puedo usar otra app en lugar de la que viene en `/app`?
Sí, mientras cumpla el contrato mínimo:
- `GET /health` → `200 OK`.
- `GET /quotes` → lista de cotizaciones.
- `POST /quotes` → crear una cotización.
- Se conecta a MongoDB vía variable de entorno `MONGO_URI`.

### ¿Puedo usar MongoDB Atlas en vez de self-hosted?
Sí, si lo justificas (costos, operabilidad). Pero te vamos a preguntar en la entrevista cómo manejarías eso en producción con compliance.

### ¿Puedo usar Helm?
Sí, es incluso bonus. Pero también está OK YAML plano si no has usado Helm antes.

### ¿Tengo que usar Workload Identity Federation en GitHub Actions?
Es **lo que esperamos**. Si usas JSON key de Service Account, no quedas descalificado pero pierdes puntos en seguridad. Si nunca lo has hecho, aquí hay una buena guía: https://cloud.google.com/blog/products/identity-security/enabling-keyless-authentication-from-github-actions.

### ¿Puedo usar GKE Autopilot?
Sí, está totalmente aceptado y de hecho es más sencillo para este reto.

### ¿Qué versión de Terraform?
La que uses cotidianamente. Recomendado `>= 1.5`. No uses OpenTofu a menos que lo documentes.

---

## 🌐 Dominio y HTTPS

### ¿Necesito un dominio propio?
No. Puedes usar un DNS tipo **wildcard** como:
- `35.1.2.3.nip.io`
- `35.1.2.3.sslip.io`

Son gratis y resuelven automáticamente a cualquier IP, lo cual sirve para pedir certificados administrados.

### ¿HTTPS es obligatorio?
Es muy deseable. Si no logras resolverlo, deja el servicio en HTTP y documenta en el runbook cómo lo pasarías a HTTPS.

---

## 📦 Entrega

### ¿Entrego un fork o un repo nuevo?
Un **fork** de este repositorio. Trabaja sobre él en una rama. Al terminar, abre PR al original.

### ¿El servicio tiene que seguir vivo cuando entregue?
Sí, al menos **48 horas** después de abrir el PR. Después de ese plazo o cuando confirmemos recepción, **destrúyelo** (`terraform destroy`) para no quemar créditos.

### ¿Qué pasa si el reviewer no alcanza a verlo vivo?
Lo coordinamos por mensaje. Déjanos tus screenshots y el PR igual.

---

## 🧩 Alcance específico

### ¿El HPA tiene que demostrar que escala?
Sí, es parte del bonus "evidencia de carga". Puedes correr k6/Locust localmente apuntando a tu URL pública y capturar `kubectl get hpa` reaccionando.

### ¿Cloud Armor es obligatorio?
No, es bonus.

### ¿Datadog es obligatorio?
No, es bonus. Cloud Monitoring es suficiente para pasar.

### ¿Tengo que implementar ArgoCD?
No. El pipeline con GitHub Actions es suficiente. ArgoCD es bonus.

### ¿Cuántos nodos GKE?
Para Standard, con 2-3 nodos `e2-small` o `e2-medium` sobra. Para Autopilot no hay que decidir esto.

### ¿Puedo usar `terraform-google-modules` (módulos públicos)?
Sí, está bien visto. Combinar módulos públicos con uno o dos propios es la señal correcta.

---

## 🧠 Sobre el estilo y nivel esperado

### ¿Nivel senior?
No. Es un reto para perfil **mid** (3-4 años). No esperamos mallas Istio ni multi-región. Esperamos trabajo sólido y decisiones informadas.

### ¿Esperan código perfecto?
No. Esperamos código **razonable, legible y defendible**. Un `TODO` honesto vale más que un hack escondido.

### ¿Van a correr mi Terraform?
Probablemente no todo, pero sí revisaremos `terraform plan` en nuestra propia cuenta sandbox en algunos casos. Por eso debe estar parametrizado (project_id, región, etc. como variables).

---

## 🗣️ Comunicación

### ¿Puedo hacer preguntas durante el reto?
Sí, por favor. Preferimos que preguntes a que asumas. Escríbenos al canal habitual.

### ¿Tipo de preguntas OK?
"¿Está bien que use Autopilot?" ✅
"¿Les importa si Mongo lo pongo fuera del cluster?" ✅
"¿Me pueden escribir el pipeline?" ❌

---

## 🧯 Cosas que nos preguntaron antes

> "¿Vale si el Load Balancer es solo HTTP?"

Preferimos HTTPS (Let's Encrypt via nip.io o similar). Si no llegas, documenta por qué.

> "¿Vale si el estado de Terraform lo dejo local?"

Para el reto sí. En el README explica cómo lo pondrías en GCS en producción.

> "¿Tengo que implementar backups reales de Mongo?"

No, solo mencionar la estrategia en el runbook. Implementarlo es bonus.

> "Mi Workload Identity Federation no termina de funcionar, ¿qué hago?"

Avísanos y te ayudamos a desbloquearte. No queremos que te trabes 2 días en eso.
