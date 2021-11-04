import React, {useState, useEffect} from 'react';
import {StyleSheet, View, Text, Image, TouchableOpacity} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import {setNumber, setName, setUserProfileImage} from '../redux/actions';
import firestore from '@react-native-firebase/firestore';

export default function User({navigation, id}) {
  const {number, name, userProfileImage} = useSelector(
    state => state.useReducer,
  );
  const dispatch = useDispatch();

  const [receiverName, setReceiverName] = useState('');
  const [receiverProfile, setReceiverProfile] = useState(
    'https://firebasestorage.googleapis.com/v0/b/chat-bae-bf3a3.appspot.com/o/avatar.png?alt=media&token=2798537f-8611-4a80-af77-b0c70c5db760',
  );
  const [onlineStatus, setOnlineStatus] = useState(false);

  useEffect(async () => {
    firestore()
      .collection('Users')
      .doc(id.replace('+', '').replace(number, ''))
      .onSnapshot(documentSnapshot => {
        if (documentSnapshot.exists) {
          setReceiverName(documentSnapshot?.data()?.name);
          setReceiverProfile(documentSnapshot?.data()?.profileImage);
          setOnlineStatus(documentSnapshot.data()?.online);
        }
      });
  });

  return (
    <TouchableOpacity
      style={styles.userContainer}
      onPress={() =>
        navigation.navigate('DiscussionScreen', {
          receiverNumber: id.replace('+', '').replace(number, ''),
          profileImage: receiverProfile,
          receiverName: receiverName,
          online: onlineStatus,
          fullId: id,
        })
      }>
      <Image
        source={{uri: receiverProfile}}
        style={{height: 60, width: 60, borderRadius: 100}}
      />
      <View style={styles.infoContainer}>
        <Text style={styles.nameText}>{receiverName}</Text>
        <Text style={styles.lastSeen}>
          {onlineStatus ? 'Online' : 'Offline'}
        </Text>
      </View>
    </TouchableOpacity>
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
    width: '61%',
    paddingHorizontal: 15,
  },
  nameText: {
    color: '#fdfdfd',
    fontWeight: 'bold',
    fontSize: 15,
  },
  lastSeen: {
    color: '#999999',
    fontWeight: 'bold',
    fontSize: 14,
  },
});
