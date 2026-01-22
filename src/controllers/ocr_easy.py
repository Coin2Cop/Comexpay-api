import sys
import easyocr
import json

# Cargar el lector de EasyOCR solo una vez
reader = easyocr.Reader(['es'], gpu=False, workers=4)  # Usar 4 hilos

def process_image(image_path):
    # Ejecutar EasyOCR
    results = reader.readtext(image_path, text_threshold=0.3)  # Ajuste para mayor rapidez
    recognized_text = " ".join([result[1] for result in results])  # Extraer solo el texto
    return recognized_text

if __name__ == "__main__":
    image_path = sys.argv[1]
    try:
        # Procesar la imagen
        text = process_image(image_path)
        print(json.dumps({"status": "SUCCESS", "text": text}))
    except Exception as e:
        print(json.dumps({"status": "ERROR", "message": str(e)}))
