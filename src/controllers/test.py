import easyocr
reader = easyocr.Reader(['es'])
result = reader.readtext('cedula1.jpg')
print(result)