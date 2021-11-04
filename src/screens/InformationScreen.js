import React, {useState, useRef} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ActionSheet from 'react-native-actionsheet';
import ImagePicker from 'react-native-image-crop-picker';
import {useSelector, useDispatch} from 'react-redux';
import {setNumber, setName, setUserProfileImage} from '../redux/actions';

export default function InformationScreen({navigation}) {
  const {number, name, userProfileImage} = useSelector(
    state => state.useReducer,
  );
  const dispatch = useDispatch();

  const [buttonLoader, setButtonLoader] = useState(false);

  const actionSheet = useRef();

  const [uname, setUname] = useState('');
  const [image, setImage] = useState(
    'https://firebasestorage.googleapis.com/v0/b/chat-bae-bf3a3.appspot.com/o/avatar.png?alt=media&token=2798537f-8611-4a80-af77-b0c70c5db760',
  );

  const handleCreateAccount = async () => {
    setButtonLoader(true);
    if (uname == '') {
      alert('Name cannot be empty.');
    } else if (uname.length <= 3) {
      alert('Name must be at least four character long.');
    } else {
      if (
        image !==
        'https://firebasestorage.googleapis.com/v0/b/chat-bae-bf3a3.appspot.com/o/avatar.png?alt=media&token=2798537f-8611-4a80-af77-b0c70c5db760'
      ) {
        let imageURL = '';
        try {
          const storageRef = storage().ref(`/profiles/${number}`);
          await storageRef.putFile(image);
          imageURL = await storageRef.getDownloadURL();
          setImage(imageURL);
          await firestore().collection('Users').doc(number).set({
            name: uname,
            number: number,
            online: true,
            profileImage: imageURL,
          });
          dispatch(setUserProfileImage(imageURL));
        } catch (e) {
          alert('Oops! Something went wrong.');
        }
      } else {
        await firestore().collection('Users').doc(number).set({
          name: uname,
          number: number,
          online: true,
          profileImage: image,
        });
        dispatch(setUserProfileImage(image));
      }

      await AsyncStorage.setItem('ChatBaeUserIdentity', number);

      dispatch(setName(uname));

      navigation.navigate('Container');
    }
    setButtonLoader(false);
  };

  const showActionSheet = () => {
    actionSheet.current.show();
  };
  const optionArray = [
    <View style={styles.actionContainer}>
      <Text style={styles.actionText}>Take Photo</Text>
    </View>,
    <View style={styles.actionContainer}>
      <Text style={styles.actionText}>Choose From Gallery</Text>
    </View>,
    <View style={styles.actionContainer}>
      <Text style={styles.actionText}>Remove Profile Photo</Text>
    </View>,
    <View style={styles.cancelAction}>
      <Text style={styles.actionText}>Cancel</Text>
    </View>,
  ];

  const takePhotoFromCamera = () => {
    ImagePicker.openCamera({
      width: 300,
      height: 400,
      cropping: true,
    }).then(image => {
      setImage(image.path);
    });
  };
  const chooseFromGallery = () => {
    ImagePicker.openPicker({
      width: 300,
      height: 400,
      cropping: true,
    }).then(image => {
      setImage(image.path);
    });
  };
  const removeProfilePhoto = async () => {
    await firestore().collection('Users').doc(number).update({
      profileImage:
        'https://firebasestorage.googleapis.com/v0/b/chat-bae-bf3a3.appspot.com/o/avatar.png?alt=media&token=2798537f-8611-4a80-af77-b0c70c5db760',
    });
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.logoContainer}>
        <Text style={styles.logo}>ChatBae.</Text>
        <Image
          source={require('../../assets/logo.png')}
          style={{height: 20, width: 15}}
        />
      </View>
      <View style={styles.moto}>
        <Text style={styles.motoText}>
          A new way to connect with your favourite people.
        </Text>
      </View>
      <View style={styles.imageContainer}>
        <Image
          source={require('../../assets/image.png')}
          style={styles.image}
        />
      </View>
      <View style={styles.screenBarContainer}>
        <View style={styles.inactiveScreenBar}></View>
        <View style={styles.inactiveScreenBar}></View>
        <View style={styles.activeScreenBar}></View>
      </View>
      <TouchableOpacity
        style={styles.profileContents}
        onPress={showActionSheet}>
        <Image
          source={{
            uri: image,
          }}
          style={styles.profileImage}
        />
        <TouchableOpacity
          style={styles.cameraContainer}
          onPress={showActionSheet}>
          <Image
            source={require('../../assets/camera.png')}
            style={styles.cameraImage}
          />
        </TouchableOpacity>
      </TouchableOpacity>
      <Text style={styles.profileText}>Upload your profile picture</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter your name"
          value={uname}
          onChangeText={uname => setUname(uname)}></TextInput>
        <TouchableOpacity
          style={styles.button}
          onPress={handleCreateAccount}
          disabled={buttonLoader}>
          {buttonLoader ? (
            <ActivityIndicator size="small" color="#212020" />
          ) : (
            <Text style={styles.buttonText}>Go</Text>
          )}
        </TouchableOpacity>
      </View>

      <ActionSheet
        ref={actionSheet}
        title={
          <>
            <View
              style={{
                backgroundColor: '#212020',
                height: 4,
                width: '20%',
                borderRadius: 50,
                marginVertical: 5,
              }}></View>
            <Text
              style={{
                color: '#000000',
                fontSize: 15,
              }}>
              Choose Your Profile Photo
            </Text>
          </>
        }
        options={optionArray}
        cancelButtonIndex={3}
        useNativeDriver={true}
        onPress={index => {
          if (index === 0) {
            takePhotoFromCamera();
          }
          if (index === 1) {
            chooseFromGallery();
          }
          if (index === 2) {
            removeProfilePhoto();
          }
        }}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#212020',
    flex: 1,
  },
  logoContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 15,
  },
  logo: {
    color: '#fdfdfd',
    fontSize: 30,
    fontWeight: 'bold',
    marginTop: 10,
  },
  moto: {
    marginLeft: 15,
  },
  motoText: {
    color: '#fdfdfd',
    fontWeight: 'bold',
    fontSize: 23,
  },
  imageContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    height: 300,
    width: 300,
    marginVertical: 10,
  },
  inputContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#fdfdfd',
    borderWidth: 1.5,
    borderRadius: 7,
    marginHorizontal: 20,
    marginVertical: 10,
    justifyContent: 'space-between',
  },
  input: {
    width: '70%',
    marginLeft: 10,
  },
  button: {
    backgroundColor: '#fdfdfd',
    height: 38,
    width: 50,
    borderRadius: 7,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  buttonText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  screenBarContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 10,
  },
  activeScreenBar: {
    height: 5,
    width: 15,
    backgroundColor: '#fdfdfd',
    borderRadius: 2,
    marginHorizontal: 2,
  },
  inactiveScreenBar: {
    height: 5,
    width: 15,
    backgroundColor: '#454343',
    borderRadius: 2,
    marginHorizontal: 2,
  },
  profileContents: {
    position: 'relative',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 5,
  },
  profileImage: {
    height: 55,
    width: 55,
    borderRadius: 100,
  },
  cameraContainer: {
    position: 'absolute',
    left: '54%',
    bottom: 1,
  },
  cameraImage: {
    height: 14,
    width: 18,
  },
  profileText: {
    color: '#fdfdfd',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 5,
  },
  actionContainer: {
    backgroundColor: '#212020',
    width: '70%',
    paddingVertical: 8,
    borderRadius: 7,
  },
  actionText: {
    color: '#fdfdfd',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  cancelAction: {
    backgroundColor: '#d11319',
    width: '70%',
    paddingVertical: 8,
    borderRadius: 7,
  },
});
