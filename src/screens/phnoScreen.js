import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  ScrollView,
  TextInput,
  TouchableOpacity,
  LogBox,
  ActivityIndicator,
} from 'react-native';
import Loader from './Loader';
import AsyncStorage from '@react-native-async-storage/async-storage';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {useSelector, useDispatch} from 'react-redux';
import {setNumber, setName, setUserProfileImage} from '../redux/actions';

LogBox.ignoreLogs([
  'Non-serializable values were found in the navigation state',
]);

export default function phnoScreen({navigation}) {
  const [loader, setLoader] = useState(true);
  const [buttonLoader, setButtonLoader] = useState(false);

  const {number, name, userProfileImage} = useSelector(
    state => state.useReducer,
  );
  const dispatch = useDispatch();

  const [phno, setPhno] = useState('');

  useEffect(async () => {
    try {
      const userIdentity = await AsyncStorage.getItem('ChatBaeUserIdentity');
      if (userIdentity === null) {
        setLoader(false);
      } else {
        firestore()
          .collection('Users')
          .doc(userIdentity)
          .onSnapshot(documentSnapshot => {
            if (documentSnapshot.exists) {
              dispatch(setNumber(userIdentity));
              dispatch(setName(documentSnapshot?.data()?.name));
              dispatch(
                setUserProfileImage(documentSnapshot?.data()?.profileImage),
              );
              navigation.navigate('Container');
            } else {
              setLoader(false);
            }
          });
      }
    } catch (e) {
      console.log(e);
    }
  }, []);

  const handlePhoneNumber = async () => {
    setButtonLoader(true);
    if (phno === '' || phno.length < 10 || phno.length > 10) {
      alert('Phone number must be valid and contain 10 digits.');
    } else {
      try {
        const confirmation = await auth().signInWithPhoneNumber(`+91 ${phno}`);
        dispatch(setNumber(phno));
        navigation.navigate('OTPScreen', {confirmation: confirmation});
      } catch (e) {
        alert('Phone number must be valid');
      }
    }
    setButtonLoader(false);
  };

  return loader ? (
    <Loader />
  ) : (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.logoContainer}>
        <Text style={styles.logo}>ChatBae.</Text>
        <Image
          source={require('../../assets/logo.png')}
          style={{height: 20, width: 15}}
        />
      </View>
      <View style={styles.moto}>
        <Text style={styles.motoText}>A new way to connect</Text>
        <Text style={styles.motoText}>with your favourite</Text>
        <Text style={styles.motoText}>people.</Text>
      </View>
      <View style={styles.imageContainer}>
        <Image
          source={require('../../assets/image.png')}
          style={styles.image}
        />
      </View>
      <View style={styles.screenBarContainer}>
        <View style={styles.activeScreenBar}></View>
        <View style={styles.inactiveScreenBar}></View>
        <View style={styles.inactiveScreenBar}></View>
      </View>
      <View style={styles.tasks}>
        <Text style={styles.taskText}>connect</Text>
        <View style={styles.circle}></View>
        <Text style={styles.taskText}>chat</Text>
        <View style={styles.circle}></View>
        <Text style={styles.taskText}>enjoy</Text>
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter your phone number"
          keyboardType="number-pad"
          value={phno}
          onChangeText={phno => setPhno(phno)}></TextInput>
        <TouchableOpacity
          style={styles.button}
          onPress={handlePhoneNumber}
          disabled={buttonLoader}>
          {buttonLoader ? (
            <ActivityIndicator size="small" color="#212020" />
          ) : (
            <Image
              source={require('../../assets/arrow.png')}
              style={{height: 20, width: 23}}
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
    height: 300,
    width: 300,
    marginVertical: 10,
  },
  tasks: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2,
  },
  taskText: {
    color: '#fdfdfd',
    fontSize: 15,
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
    padding: 9,
    borderRadius: 7,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
});
