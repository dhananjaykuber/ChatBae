import React, {useEffect, useState} from 'react';
import {ScrollView} from 'react-native';
import AllUsersUser from './AllUsersUser';
import firestore from '@react-native-firebase/firestore';
import {useSelector, useDispatch} from 'react-redux';
import {setNumber, setName, setUserProfileImage} from '../redux/actions';

export default function UsersContainer({navigation}) {
  const {number, name, userProfileImage} = useSelector(
    state => state.useReducer,
  );
  const dispatch = useDispatch();

  const [users, setUsers] = useState([]);

  useEffect(() => {
    firestore()
      .collection('Users')
      .onSnapshot(documentSnapshot =>
        setUsers(
          documentSnapshot.docs.map(doc => ({
            id: doc.id,
            name: doc.data()?.name,
            number: doc.data()?.number,
            profileImage: doc.data()?.profileImage,
            online: doc.data()?.online,
          })),
        ),
      );
  }, []);

  return (
    <ScrollView style={{marginTop: 10}}>
      {users
        .filter(user => user.number !== number)
        .map(user => (
          <AllUsersUser
            key={user.id}
            receiverName={user.name}
            receiverNumber={user.number}
            profileImage={user.profileImage}
            online={user.online}
            navigation={navigation}
          />
        ))}
    </ScrollView>
  );
}
