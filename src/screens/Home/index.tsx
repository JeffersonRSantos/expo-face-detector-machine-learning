import { useState } from "react";
import styled from "styled-components/native";

import { Button, Dimensions, Platform, StyleSheet, View } from "react-native";
import { AutoFocus, Camera, CameraType, FlashMode } from "expo-camera";
import * as FaceDetector from "expo-face-detector";
import { FaceFeature } from "expo-face-detector";
import FaceBox from "../../components/FaceBox";
import { MaterialIcons, Ionicons } from "@expo/vector-icons";

type bounds = {
  origin: object;
  size: object;
};

type faces = {
  BOTTOM_MOUTH: object;
  LEFT_CHEEK: object;
  LEFT_EAR: object;
  LEFT_EYE: object;
  NOSE_BASE: object;
  LEFT_MOUTH: object;
  RIGHT_CHEEK: object;
  RIGHT_EYE: { x: 0; y: 0 };
  RIGHT_EAR: { x: 0; y: 0 };
  RIGHT_MOUTH: { x: 0; y: 0 };
  faceID: number;
  leftEyeOpenProbability: number;
  rightEyeOpenProbability: number;
  rollAngle: number;
  smilingProbability: number;
  yawAngle: number;
};

const FEATURE_SIZE = { height: 30, width: 40 };
const BUTTON_SIZE = 40;

export default function Home() {
  const [type, setType] = useState(CameraType.back);
  const [permission, requestPermission] = Camera.useCameraPermissions();
  const [bounds, setBounds] = useState<bounds>();
  const [features, setFeatures] = useState<faces>();
  const [flash, setFlash] = useState(false);
  const [camera, setCamera] = useState<Camera>();
  const [imagePadding, setImagePadding] = useState(0);
  const [ratio, setRatio] = useState("16:9");
  const { height, width } = Dimensions.get("window");
  const screenRatio = height / width;

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <Container>
        <TextDefault>We need your permission to show the camera</TextDefault>
        <Button onPress={requestPermission} title="grant permission" />
      </Container>
    );
  }

  function toggleCameraType() {
    setType((current) =>
      current === CameraType.back ? CameraType.front : CameraType.back
    );
  }

  const handleFacesDetected = ({ faces }) => {
    let item: FaceFeature = faces;
    if (item[0] != undefined) {
      console.log(item[0]);
      setBounds(item[0].bounds);
      setFeatures(item[0]);
    } else {
      setFeatures(null);
    }
  };

  const setCameraReady = async () => {
    let desiredRatio = "4:3"; //ratio default
    if (Platform.OS === "android") {
      const ratios = await camera.getSupportedRatiosAsync();
      let distances = {};
      let realRatios = {};
      let minDistance = null;
      for (const ratio of ratios) {
        const parts = ratio.split(":");
        const realRatio = parseInt(parts[0]) / parseInt(parts[1]);
        realRatios[ratio] = realRatio;
        const distance = screenRatio - realRatio;
        distances[ratio] = realRatio;
        if (minDistance == null) {
          minDistance = ratio;
        } else {
          if (distance >= 0 && distance < distances[minDistance]) {
            minDistance = ratio;
          }
        }
      }
      // set the best match
      desiredRatio = minDistance;
      //  calculate the difference between the camera width and the screen height
      const remainder = Math.floor(
        (height - realRatios[desiredRatio] * width) / 2
      );
      // set the preview padding and preview ratio
      setImagePadding(remainder);
      setRatio(desiredRatio);
    }
  };

  return (
    <Container>
      {/* Face detecture */}
      <Camera
        style={{ flex: 1, marginVertical: imagePadding }}
        type={type}
        onCameraReady={setCameraReady}
        ref={(ref) => setCamera(ref)}
        onFacesDetected={handleFacesDetected}
        ratio={ratio}
        zoom={0.07}
        autoFocus={AutoFocus.on}
        flashMode={flash && type == "back" ? FlashMode.on : FlashMode.off}
        faceDetectorSettings={{
          mode: FaceDetector.FaceDetectorMode.fast,
          detectLandmarks: FaceDetector.FaceDetectorLandmarks.all,
          runClassifications: FaceDetector.FaceDetectorClassifications.all,
          minDetectionInterval: 100,
          tracking: true,
        }}
      >
        <MaskScanner>
          {/* <ImageMaskScan
            source={require("../../assets/images/icon-face.png")}
          /> */}

          <RowButtonsRight>
            <TouchButton onPress={toggleCameraType} activeOpacity={0.4}>
              <Ionicons name="camera-reverse" color="white" size={24} />
            </TouchButton>

            {type == "back" ? (
              <TouchButton onPress={() => setFlash(!flash)} activeOpacity={0.4}>
                <Ionicons
                  name={flash ? "flash" : "flash-off"}
                  color="white"
                  size={24}
                />
              </TouchButton>
            ) : null}
          </RowButtonsRight>
        </MaskScanner>
      </Camera>

      {bounds && features ? (
        <FaceBox
          origin={bounds.origin}
          size={bounds.size}
          name={`Face ${features.faceID} Roll: ${Math.round(
            features.rollAngle
          )}° Yaw: ${Math.round(features.yawAngle)}°`}
        />
      ) : null}

      {features ? (
        <>
          {features.BOTTOM_MOUTH ? (
            <FaceBox
              origin={features.BOTTOM_MOUTH}
              size={FEATURE_SIZE}
              name={`${Math.round(features.smilingProbability * 100)}%`}
            />
          ) : null}
          {features.LEFT_CHEEK ? (
            <FaceBox
              origin={features.LEFT_CHEEK}
              size={FEATURE_SIZE}
              name="LCheek"
            />
          ) : null}
          {features.LEFT_EAR ? (
            <FaceBox
              origin={features.LEFT_EAR}
              size={FEATURE_SIZE}
              name="Left Ear"
            />
          ) : null}
          {features.LEFT_EYE ? (
            <FaceBox
              origin={features.LEFT_EYE}
              size={FEATURE_SIZE}
              name={`${Math.round(features.leftEyeOpenProbability * 100)}%`}
            />
          ) : null}
          {features.LEFT_MOUTH ? (
            <FaceBox
              origin={features.LEFT_MOUTH}
              size={FEATURE_SIZE}
              name="LMouth"
            />
          ) : null}
          {features.NOSE_BASE ? (
            <FaceBox
              origin={features.NOSE_BASE}
              size={FEATURE_SIZE}
              name="Nose"
            />
          ) : null}
          {features.RIGHT_CHEEK ? (
            <FaceBox
              origin={features.RIGHT_CHEEK}
              size={FEATURE_SIZE}
              name="RCheek"
            />
          ) : null}
          {features.RIGHT_EAR ? (
            <FaceBox
              origin={features.RIGHT_EAR}
              size={FEATURE_SIZE}
              name="REar"
            />
          ) : null}
          {features.RIGHT_EYE ? (
            <FaceBox
              origin={features.RIGHT_EYE}
              size={FEATURE_SIZE}
              name={`${Math.round(features.rightEyeOpenProbability * 100)}%`}
            />
          ) : null}
          {features.RIGHT_MOUTH ? (
            <FaceBox
              origin={features.RIGHT_MOUTH}
              size={FEATURE_SIZE}
              name="RMouth"
            />
          ) : null}
        </>
      ) : null}
    </Container>
  );
}

const Container = styled.View`
  flex: 1;
  justify-content: center;
  background-color: #000000;
`;

const TouchButton = styled.TouchableOpacity`
  margin-bottom: 15px;
  width: ${BUTTON_SIZE}px;
  height: ${BUTTON_SIZE}px;
  border-radius: ${BUTTON_SIZE / 2}px;
  background-color: rgba(140, 140, 140, 0.3);
  justify-content: center;
  align-items: center;
`;

const RowButtonsRight = styled.View`
  position: absolute;
  right: 15px;
  top: 15px;
  z-index: 10;
`;

const TextDefault = styled.Text`
  font-size: 14px;
  font-weight: bold;
  color: white;
`;

const MaskScanner = styled.View`
  background-color: transparent;
  position: relative;
  z-index: 1;
  justify-content: center;
  flex: 1;
  align-items: center;
`;

const ImageMaskScan = styled.Image`
  width: 400px;
  height: 550px;
  position: relative;
`;
