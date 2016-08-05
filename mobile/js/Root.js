  import React, {
  AppRegistry,
  Component,
  StyleSheet,
  Text,
  View,
  ScrollView,
  StatusBar,  
  TextInput,
  Image,
  TouchableOpacity,
  CameraRoll
} from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome';

import { Form, InputField,
        Separator, SwitchField, LinkField,
        PickerField, DatePickerField
      } from 'react-native-form-generator';

var Button = require('react-native-button');

let ImagePickerManager = require('NativeModules').ImagePickerManager;

class Root extends Component {

    constructor() {
        super();

        this.state = {
            imageSource: '',
            text: ''
        };
    }

    componentDidMount() {}

    _refreshImage() {
      this.setState({
            imageSource: '',
            text: ''
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
                        return fetch('https://vision.googleapis.com/v1/images:annotate?key=AIzaSyBNTi3d3CX9Roz2XrKg6J2CPQqb-POUhCs', {
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
      var _scrollView: ScrollView;
        return (
          <ScrollView
            ref={(scrollView) => { _scrollView = scrollView; }}
            automaticallyAdjustContentInsets={false}
            scrollEventThrottle={200}
            style={styles.scrollView}>

            <View style={styles.container}>
                {this.state.imageSource ? <Image style={styles.image} source={this.state.imageSource} /> : null}
                  <Button
                  style={{borderRadius: 6, backgroundColor: 'skyblue', padding: 5, margin: 10 }}
                  onPress={this._showImagePicker.bind(this)}>
                  Take a Snapp
                </Button>
                <StatusBar barStyle="default" />

                <Text>{'Text read:'}</Text>
                <TextInput style={styles.inputBox}
                  onChangeText={(text) => this.setState({text})}
                  value={this.state.text}
                />  
            
                <Button
                  style={{borderRadius: 6, backgroundColor: 'skyblue', padding: 5, margin: 10 }}
                  onPress={(event) => console.log('refreshing')} >
                  <Icon name="chevron-right" style={{color: 'skyblue'}} />
                  Refresh
                </Button>

                <Form
                  ref='contactForm'
                  label="Contact Information">
                  <InputField ref='first_name' placeholder='First Name' />
                  <InputField ref='last_name' placeholder='Last Name' />
                  <InputField ref='email' placeholder='Email' />
                  <InputField ref='address' placeholder='Address' />

                  <SwitchField label='Adjust Contact information' ref="has_accepted_conditions"
                    helpText='Please adjust information where needed'/>
                </Form>

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
    width: 200,
    height: 200,
    resizeMode: 'cover'

  },
  text:{
    padding: 10,
    backgroundColor: 'skyblue'

  },
  scrollView: {
    backgroundColor: '#6A85B1',
    height: 300,
  },
  inputBox:{
    height: 120,
    fontWeight: 'bold',
    padding: 10,
    borderColor: 'black',
    borderWidth: 2,
    margin: 16,
    paddingLeft: 10 

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

