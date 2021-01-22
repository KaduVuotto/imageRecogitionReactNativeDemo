import React from 'react';
import { View, Text, Dimensions, Alert, ActivityIndicator, StyleSheet, Button, TouchableHighlight } from 'react-native';
import { RNCamera } from 'react-native-camera';
import Clarifai from 'clarifai'



export default class Camera extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      identifedAs: '',
      loading: false
    }
  }

  takePicture = async function () {
    if (this.camera) {
      // Pause the camera's preview
      this.camera.pausePreview();
      // Set the activity indicator
      this.setState((previousState, props) => ({
        loading: true
      }));
      // Set options
      const options = {
        base64: true
      };
      this.camera.resumePreview();

      // Get the base64 version of the image
      const data = await this.camera.takePictureAsync(options)
      // Get the identified image
      this.identifyImage(data.base64);
      this.camera.pausePreview();
    }
  }

  identifyImage(imageData) {
    // Initialise Clarifai api
    // const Clarifai = require('clarifai');
    const app = new Clarifai.App({
      apiKey: '449f98a91bba427a909bd0d93bf2b984'
    });
    // Identify the image
    app.models.predict(Clarifai.FOOD_MODEL, { base64: imageData })
      .then((response) => this.displayAnswer(response.outputs[0].data.concepts[0].name)
        .catch((err) => alert(err))
      );
  }

  displayAnswer(identifiedImage) {
    // Dismiss the acitivty indicator
    this.setState((prevState, props) => ({
      identifedAs: identifiedImage,
      loading: false
    }));
    // Show an alert with the answer on
    alert(
      this.state.identifedAs,
      { cancelable: false }
    )
    // Resume the preview
    this.camera.resumePreview();
  }

  render() {
    return (
      <View style={{
        alignItems: "center",
        justifyContent: "center",
        flex: 1
      }}>
        <RNCamera ref={ref => { this.camera = ref; }} style={{
          flex: 1,
          justifyContent: 'flex-end',
          alignItems: 'center',
          height: Dimensions.get('window').height,
          width: Dimensions.get('window').width,
        }}>
          <ActivityIndicator size="large" style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
          }} color="#fff" animating={this.state.loading} />
          <TouchableHighlight style={{
            marginBottom: 30,
            width: 160,
            borderRadius: 10,
            backgroundColor: "white",
          }} disabled={this.state.loading}>
            <Button onPress={() => { this.takePicture() }} disabled={this.state.loading} title="Capture" accessibilityLabel="Learn more about this button" />
          </TouchableHighlight>
        </RNCamera>
      </View >
    );
  }
}