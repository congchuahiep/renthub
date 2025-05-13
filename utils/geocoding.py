import requests
from django.conf import settings

def get_coordinates(address) -> tuple:
    """
    Sử dụng Google Geocoding API để lấy tọa độ từ địa chỉ.
    
    Returns
    -------
        - Một tuple chứa vĩ độ và kinh độ (latitude, longitude)
    """
    url = "https://maps.googleapis.com/maps/api/geocode/json"
    params = {
        "address": address,
        "key": settings.GOOGLE_MAPS_API_KEY
    }
    response = requests.get(url, params=params)
    if response.status_code == 200:
        data = response.json()
        if data['results']:
            location = data['results'][0]['geometry']['location']
            return location['lat'], location['lng']
    return None, None


# React Native => Trình duyệt (dev) => Ứng dụng (development build) => Tải về chạy

# Map (thành phần Native), firebase => (build) tạo lại ứng dụng mới (10-50p)



# Expo Go => Vẫn là trình duyệt => Ứng dụng đã build
# Google Map => 


# Expo Go (trinhf duyeejt) 

# LAN 