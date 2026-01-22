import sys
import json
import logging
from paddleocr import PaddleOCR

# Desactivar los logs de PaddleOCR
logging.disable(logging.CRITICAL)

def process_image(image_path):
    # Usar el modelo más liviano con control sobre los modelos de detección y reconocimiento
    ocr = PaddleOCR(
        use_angle_cls=False,         # Desactiva clasificación de ángulos
        lang='es',                   # Idioma español
        det_model_dir='./light_model/det',   # Ruta del modelo de detección
        rec_model_dir='./light_model/rec',   # Ruta del modelo de reconocimiento
        show_log=False               # Desactiva logs internos
    )

    # Realiza el OCR
    result = ocr.ocr(image_path, cls=False)

    # Extrae el texto de las respuestas
    extracted_text = " ".join([line[1][0] for line in result[0]])

    # Prepara la respuesta en formato JSON
    response = {
        "status": "OK",
        "text": extracted_text.strip()
    }

    return response

if __name__ == "__main__":
    # Verificar el argumento de la imagen
    if len(sys.argv) != 2:
        print("Usage: python ocr.py <image_path>")
        sys.exit(1)
    
    image_path = sys.argv[1]

    try:
        # Procesar la imagen y obtener el resultado
        response = process_image(image_path)
        print(json.dumps(response))  # Imprime la respuesta en formato JSON
    except Exception as e:
        print(json.dumps({"status": "ERROR", "message": str(e)}))  # Error en caso de fallo
