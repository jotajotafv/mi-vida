# Nuestro universo

Experiencia web 3D romántica creada para Ruth Noemi Ramirez Canaviri por Juan Jose Fernandez Villazon.

## Ejecutar en desarrollo

```bash
npm install
npm run dev
```

Vite mostrará una URL local para abrir la experiencia.

## Generar build

```bash
npm run build
```

El resultado queda en `dist/`.

## Editar contenido

- Textos principales: `src/data/config.ts`
- Recuerdos: `src/data/memories.ts`
- Retratos: `src/data/portraits.ts`
- Cualidades: `src/data/qualities.ts`

## Cambiar fotos

Reemplaza las imágenes en `public/assets/images/` conservando los mismos nombres:

- `portada.jpg`
- `recuerdo-01.jpg` a `recuerdo-10.jpg`
- `retrato-01.jpg` a `retrato-04.jpg`
- `final.jpg`

Los archivos originales siguen en `assets/` como respaldo.

## Cambiar canción

Reemplaza `public/assets/audio/chachacha.mp3` o cambia la ruta `musicPath` en `src/data/config.ts`.

## Desplegar

Ejecuta `npm run build` y sube la carpeta `dist/` completa al hosting estático.
