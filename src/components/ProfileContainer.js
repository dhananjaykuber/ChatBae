import React, {useRef, useState} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  TextInput,
  BackHandler,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ActionSheet from 'react-native-actionsheet';
import ImagePicker from 'react-native-image-crop-picker';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import {useSelector, useDispatch} from 'react-redux';
import {setNumber, setName, setUserProfileImage} from '../redux/actions';

export default function ProfileContainer({navigation}) {
  const {number, name, userProfileImage} = useSelector(
    state => state.useReducer,
  );
  const dispatch = useDispatch();

  const actionSheet = useRef();

  const [image, setImage] = useState(userProfileImage);
  const [uname, setUname] = useState('');

  const showActionSheet = async () => {
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

  const handleLogout = async () => {
    await AsyncStorage.clear();
    BackHandler.exitApp();
  };

  const handleUpdateProfile = async () => {
    if (image === userProfileImage) {
      if (uname === '') {
        alert(
          'Please choose new profile picture or name to update your profile.',
        );
      } else {
        await firestore().collection('Users').doc(number).update({name: uname});
        dispatch(setName(uname));
      }
    } else {
      const storageRef = storage().ref(`/profiles/${number}`);
      await storageRef.delete();
      updateProfileImage();
    }
    setUname('');
  };

  const updateProfileImage = async () => {
    let imageURL = '';
    try {
      const storageRef = storage().ref(`/profiles/${number}`);
      await storageRef.putFile(image);
      imageURL = await storageRef.getDownloadURL();
      setImage(imageURL);
      await firestore().collection('Users').doc(number).update({
        name: name,
        profileImage: imageURL,
      });
      dispatch(setUserProfileImage(imageURL));
      setUname('');
    } catch (e) {
      alert('Oops! Something went wrong.');
    }
  };

  const removeProfilePhoto = async () => {
    await firestore().collection('Users').doc(number).update({
      profileImage:
        'https://firebasestorage.googleapis.com/v0/b/chat-bae-bf3a3.appspot.com/o/avatar.png?alt=media&token=2798537f-8611-4a80-af77-b0c70c5db760',
    });
  };

  return (
    <ScrollView>
      <View style={styles.headerContainer}>
        <View style={styles.imageContainer}>
          <Image
            source={{uri: image}}
            style={{height: 130, width: 130, borderRadius: 100}}
          />
          <TouchableOpacity
            style={styles.cameraContainer}
            onPress={showActionSheet}>
            <Image
              source={require('../../assets/camera.png')}
              style={{height: 17.5, width: 20.5}}
            />
          </TouchableOpacity>
        </View>
        <Text style={{color: '#999999', fontSize: 10, marginTop: 5}}>
          Click on camera to select new profile image.
        </Text>
        <View>
          <Text style={styles.helloText}>Hello</Text>
          <Text style={styles.nameText}>{name}</Text>
        </View>
      </View>

      <View style={styles.activityContainer}>
        <TextInput
          placeholder={'Update your name'}
          style={styles.input}
          value={uname}
          onChangeText={uname => setUname(uname)}></TextInput>
        <TouchableOpacity
          style={styles.activityWrapper}
          onPress={handleUpdateProfile}>
          <View style={{width: 50}}>
            <Image
              source={require('../../assets/update.png')}
              style={{height: 23, width: 26}}
            />
          </View>
          <View>
            <Text style={styles.activityText}>Update Profile</Text>
            <Text style={{color: '#999999', fontSize: 10}}>
              Click here to update your profile name or image.
            </Text>
          </View>
        </TouchableOpacity>
        {/* <TouchableOpacity style={styles.activityWrapper}>
          <View style={{width: 50}}>
            <Image
              source={require('../../assets/invite.png')}
              style={{height: 20, width: 30}}
            />
          </View>
          <View>
            <Text style={styles.activityText}>Invite a Friend</Text>
            <Text style={{color: '#999999', fontSize: 10}}>
              Chatting is more fun when you connect with others.
            </Text>
          </View>
        </TouchableOpacity> */}
        <TouchableOpacity style={styles.activityWrapper} onPress={handleLogout}>
          <View style={{width: 50}}>
            <Image
              source={require('../../assets/logout.png')}
              style={{height: 23, width: 30}}
            />
          </View>
          <Text style={styles.activityText}>Logout</Text>
        </TouchableOpacity>
        {/* <TouchableOpacity style={styles.activityWrapper}>
          <View style={{width: 50}}>
            <Image
              source={require('../../assets/delete.png')}
              style={{height: 23, width: 21.5}}
            />
          </View>
          <Text style={styles.activityText}>Delete Account</Text>
        </TouchableOpacity> */}
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
  headerContainer: {
    alignItems: 'center',
    marginHorizontal: 15,
  },
  imageContainer: {
    position: 'relative',
  },
  helloText: {
    color: '#fdfdfd',
    fontSize: 20,
    fontWeight: 'bold',
    marginHorizontal: 10,
    textAlign: 'center',
    marginTop: 5,
  },
  nameText: {
    color: '#fdfdfd',
    fontSize: 17,
    fontWeight: 'bold',
    marginHorizontal: 10,
    textAlign: 'center',
  },
  cameraContainer: {
    position: 'absolute',
    bottom: 0,
    backgroundColor: '#000',
    padding: 5,
    borderRadius: 50,
    borderColor: '#fdfdfd',
    borderWidth: 1,
  },
  activityContainer: {
    backgroundColor: '#212020',
    height: '100%',
  },
  input: {
    borderColor: '#fdfdfd',
    borderWidth: 1,
    marginHorizontal: 19,
    borderRadius: 7,
    paddingHorizontal: 10,
    marginVertical: 12,
  },
  activityWrapper: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginVertical: 10,
  },
  activityText: {
    color: '#fdfdfd',
    fontSize: 17,
    fontWeight: 'bold',
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
