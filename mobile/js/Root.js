  import React, {
  AppRegistry,
  Component,
  StyleSheet,
  Text,
  View,
  ScrollView,
  StatusBar,
  TextInput,
  MapView,
  Image,
  TouchableOpacity,
  CameraRoll
} from 'react-native';


import Icon from 'react-native-vector-icons/FontAwesome';

import * as Progress from 'react-native-progress';

var Button = require('react-native-button');

var ProgressBar = require('react-native-progress-bar');

let ImagePickerManager = require('NativeModules').ImagePickerManager;

class Root extends Component {

  constructor() {
      super();
      this.state = {
          imageSource: '',
          text: '',
          progress: 0,
          sendRequest: false
      };
  }

  componentDidMount() {}

  clearText() {
    this.setState({
        imageSource: '',
        text: '',
        progress: 0,
      });
  }

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

                       this.setState({
                          sendRequest: true
                       })

                        return fetch('https://vision.googleapis.com/v1/images:annotate?key=AIzaSyBNTi3d3CX9Roz2XrKg6J2CPQqb-POUhCs', {
                            method: 'POST',
                            headers: {
                                'Accept': 'application/json',
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify(request)
                        })
                          .then(res => {
                              this.setState({
                                sendRequest: false
                              });
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

               // code to display image 


    render() {
      var _scrollView: ScrollView;
      
      setTimeout((function() {
        this.setState({ progress: this.state.progress + (0.4 * Math.random())});
      }).bind(this), 1000);

        return (
          <ScrollView
            ref={(scrollView) => { _scrollView = scrollView; }}
            automaticallyAdjustContentInsets={false}
            scrollEventThrottle={200}
            style={styles.scrollView}>

            <View style={styles.container}>
                <Button
                  style={{borderRadius: 6, backgroundColor: 'skyblue', padding: 5, margin: 10 }}
                  onPress={this._showImagePicker.bind(this)}>
                  Take a Snapp
                </Button>
              
                {this.state.sendRequest ? <Progress.Circle size={30} indeterminate={true} /> : null }
                {this.state.imageSource ? <Image style={styles.image} source={this.state.imageSource} /> : null}
                <TextInput  
                  style={styles.inputBox}
                  multiline={true}
                  onChangeText={(text) => this.setState({text})}
                  controlled={true}
                  value={this.state.text}
                />  
                <Button
                  style={{borderRadius: 6, backgroundColor: 'skyblue', padding: 5, margin: 10 }}
                  onPress={this.clearText.bind(this)} >
                  Refresh
                </Button>
            </View>
             <View>
              <MapView
                style={styles.map}
                showsUserLocation={true}
                followUserLocation={true}
                pitchEnabled={true}
              />
            </View>

          </ScrollView>

        );      
  }

}

export default Root;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',

  },
  image: {
    width: 100,
    height: 100,
    resizeMode: 'cover',
    borderRadius: 10,
  },
  text:{
    padding: 10,
    backgroundColor: 'skyblue'

  },
  scrollView: {
    backgroundColor: '#6A85B1',
    height: 300,
  },
  progressView:{
    marginTop: 20,
  },
  inputBox:{
    height: 120,
    fontWeight: 'bold',
    borderColor: 'black',
    borderWidth: 2,
    margin: 16,
    borderColor: '#aaaaaa',
    padding: 4,
    borderRadius: 10,
  },
  map: {
    height: 150,
    margin: 10,
    borderWidth: 1,
    borderColor: '#000000',
  },
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