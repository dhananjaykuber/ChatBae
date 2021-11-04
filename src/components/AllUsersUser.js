import React, {useState} from 'react';
import {View, Text, Image, StyleSheet, TouchableOpacity} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import {useSelector, useDispatch} from 'react-redux';
import {setNumber, setName, setUserProfileImage} from '../redux/actions';

export default function AllUsersUser({
  navigation,
  profileImage,
  receiverName,
  online,
  receiverNumber,
}) {
  const {number, name, userProfileImage} = useSelector(
    state => state.useReducer,
  );

  const dispatch = useDispatch();

  const handleStartChat = async () => {
    firestore()
      .collection('Chats')
      .doc(`${number}+${receiverNumber}`)
      .onSnapshot(documentSnapshot => {
        if (documentSnapshot.exists) {
          navigation.navigate('DiscussionScreen', {
            receiverName: receiverName,
            profileImage: profileImage,
            navigation: navigation,
            receiverNumber: receiverNumber,
            fullId: `${number}+${receiverNumber}`,
          });
        } else {
          firestore()
            .collection('Chats')
            .doc(`${receiverNumber}+${number}`)
            .onSnapshot(documentSnapshot => {
              if (documentSnapshot.exists) {
                navigation.navigate('DiscussionScreen', {
                  receiverName: receiverName,
                  profileImage: profileImage,
                  navigation: navigation,
                  receiverNumber: receiverNumber,
                  fullId: `${receiverNumber}+${number}`,
                  online: online,
                });
              } else {
                firestore()
                  .collection('Chats')
                  .doc(`${number}+${receiverNumber}`)
                  .set({unSeendMessage: 1});
                navigation.navigate('DiscussionScreen', {
                  receiverName: receiverName,
                  profileImage: profileImage,
                  navigation: navigation,
                  receiverNumber: receiverNumber,
                  fullId: number + receiverName,
                  online: online,
                });
              }
            });
        }
      });
  };
  return (
    <View>
      <TouchableOpacity
        style={styles.userContainer}
        onPress={() => handleStartChat()}>
        <Image
          source={{uri: profileImage}}
          style={{height: 60, width: 60, borderRadius: 50}}
        />
        <View style={styles.infoContainer}>
          <Text style={styles.nameText}>{receiverName}</Text>
          {online ? (
            <Text style={styles.online}>Online</Text>
          ) : (
            <Text style={styles.offline}>Offline</Text>
          )}
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  userContainer: {
    display: 'flex',
    flexDirection: 'row',
    marginHorizontal: 10,
    marginVertical: 10,
    alignItems: 'center',
  },
  infoContainer: {
    paddingHorizontal: 15,
  },
  nameText: {
    color: '#fdfdfd',
    fontWeight: 'bold',
    fontSize: 15,
  },
  online: {
    color: '#09bd36',
    fontWeight: 'bold',
  },
  offline: {
    color: '#e61037',
    fontWeight: 'bold',
  },
});
