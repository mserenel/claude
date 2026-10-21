# Fotos de producto sobre fondo blanco

2000×2000, blanco puro, cada mate centrado y al mismo alto (70% del cuadro),
con una sombra suave que sale de su propia base o patas. Los mates no se
retocaron: forma y color son los de la foto (`originales/`).

Para hacer una nueva:

```
# recorte (un proceso por foto: el modelo es pesado)
python -c "from rembg import remove, new_session; from PIL import Image; \
  s=new_session('birefnet-general'); \
  remove(Image.open('FOTO.jpg').convert('RGB'), session=s, only_mask=True).save('mascara.png')"
python tools/fondo_blanco.py FOTO.jpg mascara.png SALIDA.jpg
```

Consejos para las fotos: el mate solo sobre la mesa, sin plástico, la cámara a
la altura del mate y lo más cerca posible (que ocupe la mitad del cuadro):
cuanto más grande sale en la foto, más nítido queda en la tienda.
