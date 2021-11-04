import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  TextInput,
  AppState,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import ChatsContainer from '../components/ChatsContainer';
import ProfileContainer from '../components/ProfileContainer';
import UsersContainer from '../components/UsersContainer';

import {useSelector, useDispatch} from 'react-redux';
import {setNumber, setName, setUserProfileImage} from '../redux/actions';

export default function Container({navigation}) {
  const {number, name, userProfileImage} = useSelector(
    state => state.useReducer,
  );
  const dispatch = useDispatch();

  const [tab, setTab] = useState('Chats');
  const [showSerach, setShowSearch] = useState(false);

  useEffect(() => {
    AppState.addEventListener('change', state => {
      if (state === 'active') {
        updateLastSeen(true);
      }
      if (state === 'background' || state === 'inactive') {
        updateLastSeen(false);
      }
    });
  });

  const updateLastSeen = value => {
    firestore().collection('Users').doc(number).update({online: value});
  };

  return (
    <View style={styles.container}>
      <View style={{height: '90%'}}>
        {showSerach ? (
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              marginHorizontal: 20,
              marginVertical: 1,
              justifyContent: 'space-between',
            }}>
            <TouchableOpacity onPress={() => setShowSearch(!showSerach)}>
              <Image
                source={require('../../assets/back.png')}
                style={{height: 24, width: 15}}
              />
            </TouchableOpacity>
            <TextInput
              placeholder={'Search...'}
              style={{
                marginHorizontal: 20,
                fontSize: 16,
              }}></TextInput>
            <TouchableOpacity>
              <Text
                style={{fontSize: 20, fontWeight: 'bold', color: '#fdfdfd'}}>
                X
              </Text>
            </TouchableOpacity>
          </View>
        ) : tab === 'Profile' ? (
          <View style={styles.logoContainer}>
            <Text style={styles.logo}>ChatBae.</Text>
            <Image
              source={{uri: userProfileImage}}
              style={{height: 45, width: 45, marginLeft: 10, borderRadius: 50}}
            />
          </View>
        ) : (
          <View style={styles.logoContainer}>
            <Text style={styles.logo}>ChatBae.</Text>

            <View
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'row',
              }}>
              <TouchableOpacity onPress={() => setShowSearch(!showSerach)}>
                <Image
                  source={require('../../assets/search.png')}
                  style={{height: 23, width: 25}}
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setTab('Profile')}>
                <Image
                  source={{uri: userProfileImage}}
                  style={{
                    height: 45,
                    width: 45,
                    marginLeft: 10,
                    borderRadius: 50,
                  }}
                />
              </TouchableOpacity>
            </View>
          </View>
        )}

        <View style={styles.actionContainer}>
          <TouchableOpacity onPress={() => setTab('Chats')}>
            <Text
              style={
                tab === 'Chats' ? styles.activeActionText : styles.actionText
              }>
              CHATS
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setTab('Users')}>
            <Text
              style={
                tab === 'Users' ? styles.activeActionText : styles.actionText
              }>
              USERS
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setTab('Profile')}>
            <Text
              style={
                tab === 'Profile' ? styles.activeActionText : styles.actionText
              }>
              PROFILE
            </Text>
          </TouchableOpacity>
        </View>

        {tab === 'Chats' ? (
          <ChatsContainer navigation={navigation} />
        ) : tab === 'Users' ? (
          <UsersContainer navigation={navigation} />
        ) : tab === 'Profile' ? (
          <ProfileContainer navigation={navigation} />
        ) : (
          <ChatsContainer navigation={navigation} />
        )}
      </View>
      <View style={styles.bottomNavigator}>
        <TouchableOpacity
          style={styles.tabContainer}
          onPress={() => setTab('Chats')}>
          <Image
            source={require('../../assets/chat.png')}
            style={{height: 20.5, width: 25}}
          />
          <Text style={styles.tabText}>Chats</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.tabContainer}
          onPress={() => setTab('Users')}>
          <Image
            source={require('../../assets/users.png')}
            style={{height: 20.5, width: 27}}
          />
          <Text style={styles.tabText}>Users</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.tabContainer}
          onPress={() => setTab('Profile')}>
          <Image
            source={require('../../assets/heart.png')}
            style={{height: 20.5, width: 24}}
          />
          <Text style={styles.tabText}>Profile</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    height: '100%',
    backgroundColor: '#212020',
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
    marginTop: 2,
  },
  actionContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 30,
    marginTop: 8,
  },
  actionText: {
    color: '#fdfdfd',
    fontSize: 15,
    width: 70,
    textAlign: 'center',
  },
  activeActionText: {
    color: '#fdfdfd',
    fontSize: 15,
    borderBottomColor: '#f21646',
    borderBottomWidth: 2.5,
    width: 70,
    textAlign: 'center',
  },
  bottomNavigator: {
    backgroundColor: '#212020',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    height: '10%',
    paddingTop: 5,
    borderTopColor: '#fdfdfd',

    shadowColor: '#fdfdfd',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,

    elevation: 8,
  },
  tabContainer: {
    alignItems: 'center',
  },
  tabText: {
    color: '#fdfdfd',
    fontSize: 14,
  },
});
