import { useState, useRef, useEffect } from "react";
import {
  Alert,
  ActivityIndicator,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Button,
} from "react-native";

import { CameraView, useCameraPermissions } from "expo-camera";

import gemini from "@/utils/gemini";

const model = gemini.getGenerativeModel({
  model: "gemini-1.5-flash",
});

export default function DescribeApp() {
  const [permission, requestPermission] = useCameraPermissions();
  const [isLoading, setIsLoading] = useState(false);
  const cameraRef = useRef(null);

  useEffect(() => {
    const getSizes = async () => {
      console.log("Available picture sizes on this device:");
      const sizes = await cameraRef.current.getAvailablePictureSizesAsync();
      console.log(sizes);
    };
    if (cameraRef.current) {
      getSizes();
    }
  }, [cameraRef.current]);

  if (!permission) {
    // Camera permissions are still loading.
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View style={styles.container}>
        <Text style={styles.message}>
          We need your permission to show the camera. If the button below
          doesn't work, go to Settings and enable camera permissions for Expo
          Go.
        </Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  const takePhoto = async () => {
    setIsLoading(true);
    try {
      const photoData = await cameraRef.current.takePictureAsync({
        quality: 0, // lowest quality
        base64: true, // also include image data in base64 format
      });

      const result = await model.generateContent([
        "Tell me about this image.",
        {
          inlineData: {
            data: photoData.base64,
            mimeType: "image/jpeg",
          },
        },
      ]);
      Alert.alert("What is this?", result.response.text());
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* If the app crashes on launch, remove the `pictureSize` prop. This picture size
       * may not be supported on all devices. */}
      <CameraView style={styles.camera} pictureSize="1920x1080" ref={cameraRef}>
        <View style={styles.buttonContainer}>
          {isLoading ? (
            <ActivityIndicator style={styles.button} size="large" />
          ) : (
            <TouchableOpacity style={styles.button} onPress={() => takePhoto()}>
              <Text style={styles.text}>Take Photo</Text>
            </TouchableOpacity>
          )}
        </View>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  message: {
    textAlign: "center",
    paddingBottom: 10,
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "transparent",
    margin: 64,
  },
  button: {
    flex: 1,
    alignSelf: "flex-end",
    alignItems: "center",
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
});
