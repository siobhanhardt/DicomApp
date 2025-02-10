import numpy as np
from datetime import datetime
from PIL import Image
from numpy import maximum, ndarray
from pydicom import dcmread, FileDataset
from pydicom.multival import MultiValue
from pydicom.valuerep import PersonName
import matplotlib.pyplot as plt
import os


def format_date(dicom_date): # Formatting multiple date types
    formats = [
        "%Y%m%d",  
        "%m/%Y",    
        "%Y"        
    ]
    
    for date_format in formats:
        try:           
            parsed_date = datetime.strptime(dicom_date, date_format)           
            return parsed_date.isoformat()  
        except ValueError:           
            continue
    
    return None

def getDicomValue(ds,name):
    value = ds.get(name)
    if value is None:
        return ''
    if isinstance(value, MultiValue):
        array = np.array(value)
    # Convert NumPy array to list
        return array.tolist()
    if isinstance(value, PersonName):
        return str(value) # Adjust as needed
    if isinstance(value, np.ndarray):
        return value.tolist() # Convert NumPy arrays to lists
    if isinstance(value, (np.floating, np.integer)):
        return value.item() # Convert NumPy scalar to native Python type
    return value

def convert_dicom(filepath, output_type="json", with_metadata=True):
    ds = dcmread(filepath)

    pixel_data = ds.pixel_array
    try:
        rescale_intercept = ds.RescaleIntercept
    except:
        rescale_intercept = 0
    # Convert to float to avoid overflow or underflow losses.
    pixel_data_float = pixel_data.astype(float)
    pixel_data_float += rescale_intercept
    maximum = np.amax(pixel_data_float)
    minimum = np.amin(pixel_data_float)
    # Rescaling grey scale between 0-255
    pixel_data_float_scaled = np.maximum(pixel_data_float, 0) / pixel_data_float.max(initial=0) * 255.0
    pixel_data_uint8_scaled = np.uintc(pixel_data_float_scaled)

    image_path = os.path.join("/app/uploads", f"{ds.SOPInstanceUID}.png")  # Save as PNG with SOPInstanceUID as filename
    plt.imsave(image_path, pixel_data_uint8_scaled, cmap='gray')  # Save the image in grayscale


    if output_type == "json":
    # Convert array to list
        PixelSpacing = getDicomValue(ds,'PixelSpacing')
        Modality = getDicomValue(ds,'Modality')
        SeriesDescription = getDicomValue(ds,'SeriesDescription')
        ProtocolName = getDicomValue(ds,'ProtocolName')
        PatientName = getDicomValue(ds,'PatientName')
        StudyDate = format_date(getDicomValue(ds,'StudyDate'))
        StudyTime = getDicomValue(ds,'StudyTime')
        SliceThickness = getDicomValue(ds,'SliceThickness')
        SpacingBetweenSlices = getDicomValue(ds,'SpacingBetweenSlices')
        RepetitionTime = getDicomValue(ds,'RepetitionTime')
        EchoTime = getDicomValue(ds,'EchoTime')
        ImageType = getDicomValue(ds,'ImageType')
        MagneticFieldStrength = getDicomValue(ds,'MagneticFieldStrength')
        SeriesNumber = getDicomValue(ds,'SeriesNumber')
        NumberOfFrames = getDicomValue(ds,'NumberOfFrames')
        StudyDescription = getDicomValue(ds,'StudyDescription')
        PatientBirthDate = format_date(getDicomValue(ds, 'PatientBirthDate'))
        InstanceNumber = getDicomValue(ds, 'InstanceNumber')
        
        
        metadata = {
        "Modality":Modality,
        "SeriesDescription":SeriesDescription,
        "PatientName":PatientName,
        "PatientBirthDate": PatientBirthDate,
        "StudyDate":StudyDate,
        "StudyDescription":StudyDescription,
        "FilePath":filepath,
        "ImagePath":image_path,
        "InstanceNumber": InstanceNumber,
        }
    return metadata
