module.exports = {
  "expo": {
    "name": "RentHub",
    "slug": "react_native",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "userInterfaceStyle": "light",
    "newArchEnabled": true,
    "splash": {
      "image": "./assets/splash-icon.png",
      "resizeMode": "contain",
      "backgroundColor": "#ffffff"
    },
    "ios": {
      "supportsTablet": true
    },
    "android": {
      "package": "com.hieptin.renthub",
      "versionCode": 1,
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#ffffff"
      },
      "edgeToEdgeEnabled": true,
      "config": {
        "googleMaps": {
          "apiKey": process.env.EXPO_PUBLIC_GOOGLE_MAP_API
        }
      }
    },
    "web": {
      "favicon": "./assets/favicon.png"
    },
    "plugins": [
      [
        "expo-maps",
        {
          "requestLocationPermission": "true",
          "locationPermission": "Allow $(PRODUCT_NAME) to use your location"
        }
      ]
    ],
    "extra": {
      "eas": {
        "projectId": "c111b331-51a4-465f-94b9-cc271924b41e"
      }
    },
    "updates": {
      "url": "https://u.expo.dev/c111b331-51a4-465f-94b9-cc271924b41e"
    },
    "runtimeVersion": {
      "policy": "appVersion"
    }
  }
};