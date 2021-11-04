import React, {useState, useRef, useEffect} from 'react';
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
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useSelector, useDispatch} from 'react-redux';
import {setNumber, setName, setUserProfileImage} from '../redux/actions';

export default function OTPScreen({navigation, route}) {
  const {number, name, userProfileImage} = useSelector(
    state => state.useReducer,
  );
  const dispatch = useDispatch();

  const [buttonLoader, setButtonLoader] = useState(false);

  const [pin1, setPin1] = useState('');
  const [pin2, setPin2] = useState('');
  const [pin3, setPin3] = useState('');
  const [pin4, setPin4] = useState('');
  const [pin5, setPin5] = useState('');
  const [pin6, setPin6] = useState('');

  const pin1ref = useRef();
  const pin2ref = useRef();
  const pin3ref = useRef();
  const pin4ref = useRef();
  const pin5ref = useRef();
  const pin6ref = useRef();

  const handleOTP = async () => {
    setButtonLoader(true);
    if (
      pin1 === '' ||
      pin2 === '' ||
      pin3 === '' ||
      pin4 === '' ||
      pin5 === '' ||
      pin6 === ''
    ) {
      alert('Verification code must be valid and contain 6 digits.');
    } else {
      try {
        const response = await route.params.confirmation.confirm(
          pin1 + pin2 + pin3 + pin4 + pin5 + pin6,
        );
        if (response) {
          firestore()
            .collection('Users')
            .doc(number)
            .onSnapshot(documentSnapshot => {
              if (documentSnapshot.exists) {
                dispatch(setName(documentSnapshot?.data()?.name));
                dispatch(
                  setUserProfileImage(documentSnapshot?.data()?.profileImage),
                );
                AsyncStorage.setItem('ChatBaeUserIdentity', number);
                navigation.navigate('Container');
              } else {
                navigation.navigate('InformationScreen');
              }
            });
        } else {
          alert('Verification code must be valid and contain 6 digits.');
        }
      } catch (e) {
        alert('Verification code must be valid and contain 6 digits.');
      }
    }
    setButtonLoader(false);
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
        <View style={styles.activeScreenBar}></View>
        <View style={styles.inactiveScreenBar}></View>
      </View>
      <View style={styles.verificationContainer}>
        <Text style={styles.verificationTitle}>Verification Code</Text>
        <Text style={styles.verificationText}>
          Please type the verification code send to +91 {number}
        </Text>
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          keyboardType="number-pad"
          maxLength={1}
          ref={pin1ref}
          value={pin1}
          onChangeText={pin1 => {
            setPin1(pin1);
            if (pin1 !== '') {
              pin2ref.current.focus();
            }
          }}></TextInput>
        <TextInput
          style={styles.input}
          keyboardType="number-pad"
          maxLength={1}
          ref={pin2ref}
          value={pin2}
          onChangeText={pin2 => {
            setPin2(pin2);
            if (pin2 !== '') {
              pin3ref.current.focus();
            }
          }}></TextInput>
        <TextInput
          style={styles.input}
          keyboardType="number-pad"
          maxLength={1}
          ref={pin3ref}
          value={pin3}
          onChangeText={pin3 => {
            setPin3(pin3);
            if (pin3 !== '') {
              pin4ref.current.focus();
            }
          }}></TextInput>
        <TextInput
          style={styles.input}
          keyboardType="number-pad"
          maxLength={1}
          ref={pin4ref}
          value={pin4}
          onChangeText={pin4 => {
            setPin4(pin4);
            if (pin4 !== '') {
              pin5ref.current.focus();
            }
          }}></TextInput>
        <TextInput
          style={styles.input}
          keyboardType="number-pad"
          maxLength={1}
          ref={pin5ref}
          value={pin5}
          onChangeText={pin5 => {
            setPin5(pin5);
            if (pin5 !== '') {
              pin6ref.current.focus();
            }
          }}></TextInput>
        <TextInput
          style={styles.input}
          keyboardType="number-pad"
          maxLength={1}
          ref={pin6ref}
          value={pin6}
          onChangeText={pin6 => {
            {
              setPin6(pin6);
              if (pin6 !== '') {
                pin6ref.current.blur();
              }
            }
          }}></TextInput>
      </View>
      <View style={styles.nextImageContainer}>
        <TouchableOpacity
          style={styles.nextImageInnerContainer}
          onPress={handleOTP}
          disabled={buttonLoader}>
          {buttonLoader ? (
            <ActivityIndicator size="small" color="#212020" />
          ) : (
            <Image
              source={require('../../assets/arrow.png')}
              style={styles.nextImage}
            />
          )}
        </TouchableOpacity>
      </View>
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
    height: 235,
    width: 235,
    marginVertical: 15,
  },
  circle: {
    height: 5,
    width: 5,
    backgroundColor: '#fdfdfd',
    borderRadius: 50,
    marginHorizontal: 10,
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
  verificationContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 30,
    marginVertical: 10,
  },
  verificationTitle: {
    color: '#fdfdfd',
    fontWeight: 'bold',
    fontSize: 20,
  },
  verificationText: {
    textAlign: 'center',
    color: '#fdfdfd',
    fontSize: 15,
  },
  inputContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
    justifyContent: 'center',
  },
  input: {
    color: '#212020',
    borderRadius: 7,
    height: 45,
    width: 40,
    textAlign: 'center',
    backgroundColor: '#eef3f3',
    marginHorizontal: 3,
  },
  nextImageContainer: {
    width: '100%',
    alignItems: 'center',
    marginVertical: 5,
  },
  nextImageInnerContainer: {
    backgroundColor: '#fdfdfd',
    padding: 10,
    borderRadius: 7,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  nextImage: {
    height: 21,
    width: 24,
  },
});
