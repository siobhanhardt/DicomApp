from flask import Flask, request, jsonify
import os
from readDicom import convert_dicom  

UPLOADS_DIR = "/app/uploads"

app = Flask(__name__)

@app.route('/process-dicom', methods=['POST'])
def process_dicom():  
    data = request.json
    file_path = data.get('filePath')

    if not file_path:
        return jsonify({"error": "No file path provided"}), 400
    
    if not os.path.exists(file_path):
        return jsonify({"error": "File does not exist"}), 400

    dicom_metadata = convert_dicom(file_path)
    return jsonify(dicom_metadata)

if __name__ == '__main__':
    app.run(host='0.0.0.0')
