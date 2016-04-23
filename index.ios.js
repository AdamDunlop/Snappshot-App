/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, {
  AppRegistry,
  Component,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  CameraRoll
} from 'react-native';

var ImagePickerManager = require('NativeModules').ImagePickerManager;

class Snappshot extends Component {

    constructor() {
        super();

        this.state = {
            imageSource: '',
            text: ''
        };
    }

    componentDidMount() {}

    _showImagePicker() {
        ImagePickerManager.showImagePicker(options, (response) => {
            console.log('Response = ', response);

            if (response.didCancel) {
                console.log('User cancelled image picker');
            }
            else if (response.error) {
                console.log('ImagePickerManager Error: ', response.error);
            }
            else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
            }
            else {
                CameraRoll.saveImageWithTag(response.uri)
                    .then(newUri => {
                        this.setState({
                            imageSource: {uri: newUri.replace('file://', '')}
                        });
                    })
                    .then(() => {
                        let request = {
                            "requests":[{
                                "image":{
                                    "content": response.data
                                },
                                "features":[{
                                    "type":"TEXT_DETECTION",
                                    "maxResults":1
                                }]
                            }]
                        };
                        return fetch('https://vision.googleapis.com/v1/images:annotate?key=AIzaSyAJ1Y0f-8pNPyM2fBth5vLLTtBJCDtNHbw', {
                            method: 'POST',
                            headers: {
                                'Accept': 'application/json',
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify(request)
                        })
                        .then(res => {
                            return res.json();
                        })
                        .then(json => {
                            console.log('RESPONSE IS: ', json);
                            this.setState({
                                text: json.responses[0].textAnnotations[0].description
                            });
                        });
                    })
                    .catch(err => console.log(err));
                // API calls
            }
        });
    }

    render() {
        return (
            <View style={styles.container}>
                {this.state.imageSource ? 
                    <Image style={styles.image} source={this.state.imageSource} /> : null}
                <TouchableOpacity onPress={this._showImagePicker.bind(this)}>
                    <Text>{'Take Picture'}</Text>
                </TouchableOpacity>
                <Text>{'Text read:'}</Text>
                <Text>{this.state.text}</Text>
            </View>
        );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  image: {
    width: 200,
    height: 200,
    resizeMode: 'cover'
  }
});

var options = {
  title: 'Select Avatar', // specify null or empty string to remove the title
  cancelButtonTitle: 'Cancel',
  takePhotoButtonTitle: 'Take Photo...', // specify null or empty string to remove this button
  chooseFromLibraryButtonTitle: 'Choose from Library...', // specify null or empty string to remove this button
  customButtons: {
    'Choose Photo from Facebook': 'fb', // [Button Text] : [String returned upon selection]
  },
  cameraType: 'back', // 'front' or 'back'
  mediaType: 'photo', // 'photo' or 'video'
  videoQuality: 'high', // 'low', 'medium', or 'high'
  durationLimit: 10, // video recording max time in seconds
  aspectX: 2, // android only - aspectX:aspectY, the cropping image's ratio of width to height
  aspectY: 1, // android only - aspectX:aspectY, the cropping image's ratio of width to height
  quality: 1, // 0 to 1, photos only
  angle: 0, // android only, photos only
  allowsEditing: false, // Built in functionality to resize/reposition the image after selection
  noData: false, // photos only - disables the base64 `data` field from being generated (greatly improves performance on large photos)
  storageOptions: { // if this key is provided, the image will get saved in the documents directory on ios, and the pictures directory on android (rather than a temporary directory)
    skipBackup: true, // ios only - image will NOT be backed up to icloud
    path: 'images' // ios only - will save image at /Documents/images rather than the root
  }
};

AppRegistry.registerComponent('Snappshot', () => Snappshot);
