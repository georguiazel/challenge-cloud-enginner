# Reto Técnico — Cloud Engineer en Kambista

¡Hola! 👋 Somos [Kambista](https://kambista.com), la fintech peruana que ayuda a miles de personas a cambiar sus dólares de forma rápida, segura y a buen tipo de cambio.

Estamos buscando un **Cloud Engineer** que se sume a nuestro equipo de plataforma para operar, escalar y endurecer la infraestructura que soporta nuestras cargas transaccionales en GCP. Este reto está diseñado para que nos muestres cómo piensas y trabajas resolviendo un problema real que vivimos todos los días.

---

## 🎯 En una línea

Diseña, provisiona y despliega en **GCP real** una API en **GKE**, respaldada por **MongoDB**, expuesta detrás de un **Load Balancer** con **Nginx como reverse proxy**, todo gestionado con **Terraform** y desplegado por **GitHub Actions**. Documenta la arquitectura y entrega un runbook operativo.

> Puedes aprovechar los **USD 300 de créditos gratis** que Google Cloud ofrece a cuentas nuevas con un correo Gmail. Más detalles en el [FAQ](./docs/FAQ.md).

El detalle completo del reto está en [**CHALLENGE.md**](./CHALLENGE.md). Léelo antes de empezar.

---

## 📦 Contenido de este repositorio

| Archivo / Carpeta | Para qué sirve |
|---|---|
| [`CHALLENGE.md`](./CHALLENGE.md) | Enunciado completo del reto, requisitos y criterios de evaluación. |
| [`ENTREGABLES.md`](./ENTREGABLES.md) | Checklist de lo que debes entregar y cómo. |
| [`docs/arquitectura-esperada.md`](./docs/arquitectura-esperada.md) | Diagrama de referencia y componentes esperados. |
| [`docs/runbook-template.md`](./docs/runbook-template.md) | Plantilla para el runbook que debes entregar. |
| [`docs/FAQ.md`](./docs/FAQ.md) | Preguntas frecuentes (costos, cuenta GCP, bonus, etc.). |
| [`app/`](./app/) | API de referencia en Node.js que puedes usar. **No necesitas programar la app.** |

---

## ⏱️ Tiempo y plazo

- **Esfuerzo estimado:** 10 a 15 horas (no es necesario perfeccionar cada detalle).
- **Plazo de entrega:** **7 días calendario** desde que recibes el reto.
- Si necesitas más tiempo por alguna razón, avísanos con antelación.

---

## 🚀 Cómo entregar

1. Haz un **fork** de este repositorio en tu cuenta de GitHub.
2. Trabaja sobre tu fork en una rama (`feature/<tu-nombre>` o similar).
3. Cuando termines, abre un **Pull Request** a este repositorio original.
4. En el PR incluye:
   - URL pública temporal del servicio desplegado (si sigue viva).
   - Capturas del clúster GKE funcionando (`kubectl get pods`, `kubectl get svc`, etc.).
   - Capturas del pipeline de GitHub Actions ejecutado con éxito.
   - Link al diagrama de arquitectura.
   - Link al runbook.
5. Notifica por el canal habitual (correo o Slack con quien te contactó).

Después de la entrega habrá una **entrevista técnica** donde conversaremos sobre tus decisiones, trade-offs y una pregunta en vivo tipo "qué pasaría si...".

---

## 🙋 ¿Dudas?

Primero revisa el [FAQ](./docs/FAQ.md). Si tu duda no está ahí, escríbenos. Preferimos que preguntes a que asumas.

¡Mucho éxito! 🚀
