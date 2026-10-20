# Campaña cupón de bienvenida · 20 al 25 de octubre

**Objetivo:** que quien ya conoce la marca haga su primera compra antes del 25
con el cupón `HERENCIA15` (15% OFF en la primera compra, + 20% off pagando por
transferencia).

**Idea:** cuenta regresiva. Una historia por día que dice cuántos días quedan,
siempre con el cupón a la vista, y un anuncio pago que lleva directo a la
tienda.

Todas las fotos son reales y sin retocar: cuadros de los videos de la marca
(`mate-crudo.mp4`, `camionero.mp4`, `balcon.mp4`), sólo escalados a 1080×1920.

---

## Antes de arrancar (a confirmar)

- [ ] El cupón `HERENCIA15` está activo en Tiendanube hasta el **25 de
      octubre** inclusive (en `Root.tsx` figura "a confirmar por la marca").
- [ ] Se combina con el 20% off por transferencia, como dicen las piezas.
- [ ] El píxel de Meta registra las compras: en los últimos 30 días la cuenta
      no muestra ninguna compra atribuida. Hacer una compra de prueba y ver que
      aparezca en el Administrador de eventos.

---

## Historias orgánicas (Instagram)

Publicar una por día, a la mañana (entre las 9 y las 11), con el **sticker de
enlace** a la tienda ("Usar mi 15%"). En la del 20, sumar el **sticker de
cuenta regresiva** de Instagram al 25/10 a las 23:59, para que la gente se
active el recordatorio.

| Día | Archivo | Foto (real) | Frase |
|---|---|---|---|
| Lun 20 | `historia-20.jpg` | Torpedo en la mano, bosque | quedan 5 días / para estrenar el tuyo. |
| Mar 21 | `historia-21.jpg` | Camionero, la virola de frente | quedan 4 días / para elegir el tuyo. |
| Mié 22 | `historia-22.jpg` | Camionero en la palma | quedan 3 días. / cada mate es único. |
| Jue 23 | `historia-23.jpg` | Mate rojo en el balcón, la ciudad | quedan 2 días / para regalar tradición. |
| Vie 24 | `historia-24.jpg` | Torpedo, el borde cincelado | mañana termina / tu 15% de bienvenida. |
| Sáb 25 | `historia-25.jpg` | Mate rojo de cerca, con bombilla | último día / para usar tu cupón. |

Las seis llevan el mismo cupón arriba (15% OFF · HERENCIA15 · + 20% off en
transferencia · Hasta el 25 de octubre) y el sello de la marca.

Para regenerarlas: `npx remotion still HP-Campana-20 entregas/campana-cupon-octubre/historia-20.jpg`
(y así con 21 a 25). Fotos y frases en `campanaCupon`, en `src/Root.tsx`.

---

## Anuncio pago (Meta Ads)

### Estructura propuesta

- **Campaña:** `Ventas - Cupón HERENCIA15 - Octubre 2026` · objetivo **Ventas**
  (compra en el sitio) · del **20/10 al 25/10 a las 23:59**.
- **Conjunto 1 — Público caliente** (el que más rinde con un cupón):
  - Interactuaron con el Instagram en los últimos 60 días (incluye a las 1.821
    visitas al perfil del sorteo del Día de la Madre).
  - Visitaron la tienda en los últimos 30 días (píxel).
  - Excluir: compraron en los últimos 180 días (el cupón es para la primera
    compra).
- **Ubicaciones:** Advantage+ (Feed, Historias y Reels de Instagram y
  Facebook).
- **Botón:** Comprar → la tienda (no el perfil).

### Piezas

| Ubicación | Archivo |
|---|---|
| Feed (4:5) | `anuncio-cupon-4x5.jpg` |
| Historias y Reels (9:16) | `anuncio-cupon-9x16.jpg` |
| Video (opcional, 9:16) | `../torpedo-retargeting.mp4` (ya existe: mismo cupón) |

### Textos

- **Texto principal:**

  Tu primer mate Herencia Patria, con 15% OFF 🧉
  Usá el código HERENCIA15 en tu primera compra y sumá 20% off pagando por transferencia.
  Mates hechos a mano: calabaza, cuero crudo y alpaca cincelada. Cada uno es único.

  Válido hasta el 25 de octubre.

- **Título:** 15% OFF con HERENCIA15
- **Descripción:** + 20% off en transferencia · hasta el 25/10

**Variante para el 24 y el 25** (cambiar el título, mismo anuncio):
*Último día: 15% OFF con HERENCIA15*.

### Presupuesto (a definir por la marca)

Referencia de la cuenta: el Torpedo de venta corre hoy a USD 6/día. Para seis
días, entre **USD 5 y 8 por día** al público caliente alcanza para que Meta
reparta entre Feed e Historias. La campaña "Público caliente" actual (USD 2/día)
no está entregando: conviene pausarla mientras dure esta, para que no compitan
por la misma gente.

---

## Cómo medirlo

- **Compras con el cupón:** en Tiendanube, usos de `HERENCIA15` por día. Es el
  número que manda (no depende del píxel).
- **Costo por compra** en Meta, comparado contra el margen del mate más
  vendido.
- **CTR del enlace:** si la gente ve el anuncio pero no toca "Comprar", probar
  el video `torpedo-retargeting.mp4` en lugar de la foto.
- **Historias:** toques en el sticker de enlace y respuestas. Si una foto rinde
  más, repetirla el 25.
