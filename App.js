import React from 'react';
import { StyleSheet,Button, View, Text, Image, TextInput,TouchableOpacity,KeyboardAvoidingView, Alert,
  Linking,
  Dimensions,
  LayoutAnimation,
  StatusBar,
  TouchableNativeFeedback,
  ImageBackground,
  InteractionManager,
  ScrollView,
   ActivityIndicator,
  Clipboard,
  Share} from 'react-native';
import { BarCodeScanner, Permissions } from 'expo';
import firebase from 'firebase';
import { createStackNavigator } from 'react-navigation'; // Version can be specified in package.json
import Exponent, { Constants, ImagePicker, registerRootComponent } from 'expo';

  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyBTHmLkEQPe5wwE2xNK0QEndhcGQvPXRBo",
    authDomain: "inhousetrainingproject.firebaseapp.com",
    databaseURL: "https://inhousetrainingproject.firebaseio.com",
    projectId: "inhousetrainingproject",
    storageBucket: "inhousetrainingproject.appspot.com",
    messagingSenderId: "525156008529"
  };
  //firebase.initializeApp(config);
  //!firebase.apps.length ? firebase.initializeApp(config) : firebase.app();

  var mob='null',lic='null',veh='null',rcdoc='null',pol='null',userid='',imgflag;
  //imgflag tells that which image url is required(rc/pol) to imageselector

class HomeScreen extends React.Component {
  render() {
    return (
        <View style={{flex:1}}>
        <View style={{flex:1,margin:10,marginBottom:5,borderRadius:5}}>
           <TouchableNativeFeedback
            onPress={() => this.props.navigation.navigate('Userlogin')}
            background={TouchableNativeFeedback.SelectableBackground()}>
                   <Image
                    style={{
                        flex:1,
                        justifyContent:'center',
                        alignItems:'center',
                      width: '100%',
                      height: '100%',
                      borderRadius:10
                    }}
                    source={require("./user.jpg")} 
                  />
            </TouchableNativeFeedback>
        </View>
         <View style={{flex:1,margin:10,marginTop:5,borderRadius:5}}>
           <TouchableNativeFeedback
            onPress={() => this.props.navigation.navigate('Moderatorlogin')}
            background={TouchableNativeFeedback.SelectableBackground()}>
                  <Image
                    style={{
                        flex:1,
                        justifyContent:'center',
                        alignItems:'center',
                      width: '100%',
                      height: '100%',
                      borderRadius:10
                    }}
                    source={require("./moderator.jpg")}
                  />
          </TouchableNativeFeedback>
        </View>
    </View>
    );
  }
}

class ModeratorloggedinScreen extends React.Component {
    constructor(props){
    super(props)
    this.state={ usid:''}
    //this.signinPress=this.signinPress.bind(this);
    }
  render() {
    return (
        <View>
<Text style={styles.SubHeading}>
         Enter User ID:
        </Text>
        <TextInput onChangeText={(usid) => this.setState({usid})} value={this.state.usid} placeholder='Enter User ID' placeholderTextColor="#a7a9aa" style={styles.intake} />
        <Button title='Inspect' onPress={()=>{
          userid=this.state.usid;
          this.props.navigation.navigate('Usertomod')
        }}/>
</View>
    );
  }
}

class UserToModDetail extends React.Component{
  render(){
    firebase.database().ref('users/' + userid + '/mobile').on('value', function(snapshot) {
  mob=snapshot.val();
});

firebase.database().ref('users/' + userid + '/licence').on('value', function(snapshot) {
  lic=snapshot.val();
});

firebase.database().ref('users/' + userid + '/vehicle_number').on('value', function(snapshot) {
  veh=snapshot.val();
});

firebase.database().ref('users/' + userid + '/rc').on('value', function(snapshot) {
  rcdoc=snapshot.val();
});

firebase.database().ref('users/' + userid + '/pollution').on('value', function(snapshot) {
  pol=snapshot.val();
});

    return(
      <ScrollView>
        <Text style={styles.SubHeading}>
         Mobile Number:{mob}
        </Text>
        <Text style={styles.SubHeading}>
         Licence Number:{lic}
        </Text>
        <Text style={styles.SubHeading}>
         Vehicle Number:{veh}
        </Text>
        <Text style={styles.SubHeading}>
         RC:
        </Text>
        <Image 
          style={{width: '100%',height:500, resizeMode:'contain'}}
          source={{uri: rcdoc}}/>
          <Text style={styles.SubHeading}>
         Pollution:
        </Text>
        <Image 
          style={{width: '100%',height:500, resizeMode:'contain'}}
          source={{uri: pol}}/>
        
      </ScrollView>
    )
  }
}

class SigninForm extends React.Component{
  constructor(props){
    super(props)
    this.state={ email:'',password:'',error:''}
    this.signinPress=this.signinPress.bind(this);
    }
  
    signinPress(){
  const { email , password}= this.state;
  firebase.auth().signInWithEmailAndPassword(email, password)
    .catch(function(error) {
  // Handle Errors here.
    alert(error.message);
  }
);

this.props.navigation.push('Moderatorloggedin')

}

  render(){
    return(
      <KeyboardAvoidingView  style={styles.wholeStyle} behavior="padding" enabled >
      <View style={styles.logoContainer}>
        <Image  style={styles.logo} source={require('./logo.png')}/>
      </View>
      <View style={styles.formContainer}>
          <Text >
            Email:
          </Text>
          <TextInput placeholder='Enter Your Email Here' value={this.state.email} onChangeText={( email ) => this.setState({ email })} autoCapitalize="none" placeholderTextColor="#a7a9aa" style={styles.input}/>
          <Text style={styles.logoHeader}>
            Password:
          </Text>
          <TextInput placeholder='Enter Your Password Here' value={this.state.password} onChangeText={( password ) => this.setState({ password })} autoCapitalize="none" placeholderTextColor="#a7a9aa" style={styles.input}/>
          <Text>
          {this.state.error}
          </Text>
        <TouchableOpacity onPress={this.signinPress} style={styles.buttonsContainerL}>
          <Text style={styles.textContainerLogin}>
            SIGN IN
          </Text>
        </TouchableOpacity>
        </View>
    </KeyboardAvoidingView>
    )
  }
}

var usar;

class UserLoggedInScreen extends React.Component {

   constructor(props){
     super(props)

usar = firebase.auth().currentUser;
firebase.database().ref('users/' + usar.uid + '/mobile').on('value', function(snapshot) {
  mob=snapshot.val();
});

firebase.database().ref('users/' + usar.uid + '/licence').on('value', function(snapshot) {
  lic=snapshot.val();
});

firebase.database().ref('users/' + usar.uid + '/vehicle_number').on('value', function(snapshot) {
  veh=snapshot.val();
});

firebase.database().ref('users/' + usar.uid + '/rc').on('value', function(snapshot) {
  rcdoc=snapshot.val();
});

firebase.database().ref('users/' + usar.uid + '/pollution').on('value', function(snapshot) {
  pol=snapshot.val();
});
     this.state={ mobs:mob,lics:lic,vehs:veh,rcdocs:'',pols:'',error:''}
  //   //this.signinPress=this.signinPress.bind(this);

     }

  render() {

    




    return (
      <ScrollView style={styles.container} keyboardShouldPersistTaps='always'>
      <Text style={styles.Heading}>
          YOUR UPLOADS
          </Text>
          
<Text style={styles.SubHeading}>
         User ID : {usar.uid}
        </Text>
<Text style={styles.SubHeading}>
         Mobile Number:
        </Text>
        <TextInput onChangeText={(mobs) => this.setState({mobs})} value={this.state.mobs} style={styles.intake} />
        <Text style={styles.SubHeading}>
         Licence Number:
        </Text>
        <TextInput onChangeText={(lics) => this.setState({lics})} value={this.state.lics} style={styles.intake} />
         <Text style={styles.SubHeading}>
         Vehicle Number:
        </Text>
        <TextInput onChangeText={(vehs) => this.setState({vehs})} value={this.state.vehs} style={styles.intake} />
        <Text style={styles.SubHeading}>
         RC:
        </Text>
        <TouchableOpacity onPress={()=>{
          imgflag='r'
          this.props.navigation.navigate('Imageselector')
        }
        }>
        <Image 
          style={{width: '100%',height:500, resizeMode:'contain'}}
          source={{uri: this.props.navigation.getParam('rcURL',rcdoc)}}/>
          </TouchableOpacity>
          <Text style={styles.SubHeading}>
         Pollution:
        </Text>
        <TouchableOpacity onPress={()=>{
          imgflag='p'
          this.props.navigation.navigate('Imageselector')
        }
        }>
        <Image 
          style={{width: '100%',height:500, resizeMode:'contain'}}
          source={{uri: this.props.navigation.getParam('polURL',pol)}}/>
          </TouchableOpacity>
        
        <TouchableOpacity onPress={()=>{
             firebase.database().ref('users/' + usar.uid).set({
    mobile:this.state.mobs,
    licence:this.state.lics,
    vehicle_number:this.state.vehs,
    pollution:pol,
    rc:rcdoc
  });

          }} style={styles.buttonsContainerL}>
          <Text style={styles.textContainerLogin}>
            EDIT/UPDATE
          </Text>
        </TouchableOpacity>

        <View />

        </ScrollView>
    );
  }
}

class UserloginScreen extends React.Component {
  constructor(props){
  super(props)
  this.state={ email:'',password:'',error:''}
  this.loginPress=this.loginPress.bind(this);
  this.signupPress=this.signupPress.bind(this);
}

loginPress(){
  const { email , password}= this.state;
  firebase.auth().signInWithEmailAndPassword(email, password)
    .catch(function(error) {
  // Handle Errors here.
    alert(error.message);
  }
);

this.props.navigation.push('Userloggedin')
}

signupPress(){
  const { email , password}= this.state;
  //firebase.auth().createUserWithEmailAndPassword(email,password)
  

firebase.auth().createUserWithEmailAndPassword(email, password)
    .catch(function(error) {
  // Handle Errors here.

    alert(error.message);
  });

firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    firebase.database().ref('users/' + user.uid).set({
    mobile:'unavailable',
    licence:'unavailable',
    vehicle_number:'unavailable',
rc:'http://184ynl3xrypi2ruscv1a607s.wpengine.netdna-cdn.com/wp-content/uploads/2011/07/Picture-351.png',
pollution:'http://184ynl3xrypi2ruscv1a607s.wpengine.netdna-cdn.com/wp-content/uploads/2011/07/Picture-351.png'
  });
  }
});

}
  render() {
    
    return (
      <KeyboardAvoidingView style={styles.wholeStyle} behavior="padding" enabled>
        <View style={styles.logoContainer}>
        <Image  style={styles.logo} source={require('./logo.png')}/>
          <Text style={styles.logoText}>
            App made for Common people :)
            </Text>
        </View>
        <View style={styles.formContainer}>
            <View style={styles.formContainer}>
        <Text style={styles.logoHeader}>
          Email:
          </Text>
        <TextInput value={this.state.email} onChangeText={( email ) => this.setState({ email })} autoCapitalize="none" label placeholder="Enter Your Email Here" placeholderTextColor="#a7a9aa"style={styles.input}/>
        <Text style={styles.logoHeader}>
          Password:
          </Text>
        <TextInput value={this.state.password} onChangeText={( password ) => this.setState({ password })} autoCapitalize="none" secureTextEntry placeholder="Enter Your Password Here"placeholderTextColor="#a7a9aa"style={styles.input}/>
        <Text>
          {this.state.error}
          </Text>
        <TouchableOpacity onPress={this.loginPress} style={styles.buttonsContainerL}>
          <Text style={styles.textContainerLogin}>
            LOGIN
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={ this.signupPress} style={styles.buttonsContainerS}>
            <Text style={styles.textContainerSignup}>
              SIGNUP
            </Text>
        </TouchableOpacity>
      </View>
          </View>
      </KeyboardAvoidingView>
    );
  }
}

class Imageselectorscreen extends React.Component {
    state = {
    image: null,
    uploading: false,
  };

  render() {
    let { image } = this.state;

    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text
          style={{
            fontSize: 20,
            marginBottom: 20,
            textAlign: 'center',
            marginHorizontal: 15,
          }}>
          Example: Upload ImagePicker result
        </Text>

        <Button
          onPress={this._pickImage}
          title="Pick an image from camera roll"
        />

        <Button onPress={this._takePhoto} title="Take a photo" />

        {this._maybeRenderImage()}
        {this._maybeRenderUploadingOverlay()}

        <StatusBar barStyle="default" />
      </View>
    );
  }

  _maybeRenderUploadingOverlay = () => {
    if (this.state.uploading) {
      return (
        <View
          style={[
            StyleSheet.absoluteFill,
            {
              backgroundColor: 'rgba(0,0,0,0.4)',
              alignItems: 'center',
              justifyContent: 'center',
            },
          ]}>
          <ActivityIndicator color="#fff" animating size="large" />
        </View>
      );
    }
  };

  _maybeRenderImage = () => {
    let { image } = this.state;
    if (!image) {
      return;
    }

     return (
      <View
        style={{
          marginTop: 30,
          width: 250,
          borderRadius: 3,
          elevation: 2,
          shadowColor: 'rgba(0,0,0,1)',
          shadowOpacity: 0.2,
          shadowOffset: { width: 4, height: 4 },
          shadowRadius: 5,
        }}>
        <View
          style={{
            borderTopRightRadius: 3,
            borderTopLeftRadius: 3,
            overflow: 'hidden',
          }}>
          <Image source={{ uri: image }} style={{ width: 250, height: 250 }} />
        </View>
<Button title="SUBMIT" onPress={()=>{
  if(imgflag=='r')
  {
  rcdoc=image;
  this.props.navigation.navigate('Userloggedin',{'rcURL':image});
  }
    else
  {
  pol=image;
  this.props.navigation.navigate('Userloggedin',{'polURL':image});
  }
  
}}/>
      </View>
    );

  };

  _share = () => {
    Share.share({
      message: this.state.image,
      title: 'Check out this photo',
      url: this.state.image,
    });
  };

  _copyToClipboard = () => {
    Clipboard.setString(this.state.image);
    alert('Copied image URL to clipboard');
  };

  _takePhoto = async () => {
    let pickerResult = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
    });

    this._handleImagePicked(pickerResult);
  };

  _pickImage = async () => {
    let pickerResult = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 3],
    });

    this._handleImagePicked(pickerResult);
  };

  _handleImagePicked = async pickerResult => {
    let uploadResponse, uploadResult;

    try {
      this.setState({ uploading: true });

      if (!pickerResult.cancelled) {
        uploadResponse = await uploadImageAsync(pickerResult.uri);
        uploadResult = await uploadResponse.json();
        this.setState({ image: uploadResult.location });
      }
    } catch (e) {
      console.log({ uploadResponse });
      console.log({ uploadResult });
      console.log({ e });
      alert('Upload failed, sorry :(');
    } finally {
      this.setState({ uploading: false });
    }
  };
}


async function uploadImageAsync(uri) {
  let apiUrl = 'https://file-upload-example-backend-dkhqoilqqn.now.sh/upload';

  // Note:
  // Uncomment this if you want to experiment with local server
  //
  // if (Constants.isDevice) {
  //   apiUrl = `https://your-ngrok-subdomain.ngrok.io/upload`;
  // } else {
  //   apiUrl = `http://localhost:3000/upload`
  // }

  let uriParts = uri.split('.');
  let fileType = uriParts[uriParts.length - 1];

  let formData = new FormData();
  formData.append('photo', {
    uri,
    name: `photo.${fileType}`,
    type: `image/${fileType}`,
  });

  let options = {
    method: 'POST',
    body: formData,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'multipart/form-data',
    },
  };
  return fetch(apiUrl, options);
}

const RootStack = createStackNavigator(
  {
    Home: HomeScreen,
    Userlogin: UserloginScreen,
    Userloggedin:UserLoggedInScreen,
    Moderatorlogin:SigninForm,
    Usertomod:UserToModDetail,
    Imageselector:Imageselectorscreen
  },
  {
    initialRouteName: 'Home',
  }
);

export default class App extends React.Component {
  render() {
    !firebase.apps.length ? firebase.initializeApp(config) : firebase.app();
    return <RootStack />;
  }
}

const styles = StyleSheet.create({
  SubHeading:{
    color:'black',
    width:250,
    marginTop:20,
    fontSize:20
  },
  Heading:{
    color:'#26C6DA',
    width:250,
    marginTop:10,
    fontSize:30,
    fontWeight:'bold'
  },
  wholeStyle:{
    flex: 1,
    backgroundColor:'white'
  },
  logoContainer:{
    flex:1,
    alignItems:'center',
    flexGrow: 1,
    justifyContent:'center',
  },
  logo:{
    width:120,
    height: 120
  },
  logoText:{
    color:'black',
    width:150,
    textAlign:'center',
    marginTop:20,
   
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    marginTop:10,
    marginBottom:10,
    padding:10
  },
    intake:{
    height:40,
    backgroundColor:'white',
    marginBottom:20,
    color:'black',
    fontSize:18
  },
  logoHeader:{
    fontSize:17,
    fontWeight:'400'
  },
  input:{
    height:40,
    backgroundColor:'white',
    marginBottom:20,
    color:'black'
  },
  formContainer:{
    padding:30
  },
  buttonsContainerS:{
    backgroundColor:'#0299f7',
    borderRadius:6,
    height:50
  },
  buttonsContainerL:{
    backgroundColor:'#0299f7',
    marginBottom:10,
    marginTop:10,
    height:50,
    borderRadius:6,
  },
  textContainerLogin:{
    textAlign:'center',
    color:'white',
    fontSize:20,
    fontWeight:'100',
    marginTop:10
  },
  textContainerSignup:{
    textAlign:'center',
    color:'white',
    fontSize:20,
    fontWeight:'100',
    marginTop:10
  }
})
