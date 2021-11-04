import React, {useEffect, useState} from 'react';
import {StyleSheet, ScrollView} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import User from './User';
import {useSelector, useDispatch} from 'react-redux';
import {setNumber, setName, setUserProfileImage} from '../redux/actions';

export default function ChatsContainer({navigation}) {
  const {number, name, userProfileImage} = useSelector(
    state => state.useReducer,
  );
  const dispatch = useDispatch();

  const [users, setUsers] = useState([]);
  useEffect(async () => {
    firestore()
      .collection('Chats')
      .onSnapshot(documentSnapshot =>
        setUsers(
          documentSnapshot.docs.map(doc => ({
            id: doc.id,
          })),
        ),
      );
  });
  return (
    <ScrollView style={{marginTop: 10}}>
      {users
        .filter(user => user.id.includes(number))
        .map(user => (
          <User key={user.id} id={user.id} navigation={navigation} />
        ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({});
