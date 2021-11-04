import React, {useRef, useEffect, useState} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import ReceivedMessage from '../components/ReceivedMessage';
import SentMessage from '../components/SentMessage';
import firestore from '@react-native-firebase/firestore';
import {useSelector, useDispatch} from 'react-redux';
import {setNumber, setName, setUserProfileImage} from '../redux/actions';
import {call} from 'react-native-reanimated';

export default function DiscussionScreen({route, navigation}) {
  const {number, name, userProfileImage} = useSelector(
    state => state.useReducer,
  );
  const dispatch = useDispatch();

  const scrollRef = useRef();

  const [sentMessage, setSentMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [messagedBefore, setMessagedBefore] = useState(false);
  const [allChatsNumber, setAllChatsNumber] = useState([]);
  const [chatDocID, setChatDocId] = useState('');

  useEffect(() => {
    scrollToBotton();

    firestore()
      .collection('Chats')
      .doc(route.params.fullId)
      .collection('Messages')
      .orderBy('time', 'asc')
      .onSnapshot(documentSnapshot =>
        setMessages(
          documentSnapshot.docs.map(doc => ({
            id: doc.id,
            message: doc.data()?.message,
            number: doc.data()?.number,
            time: doc.data()?.time?.toDate().toLocaleString(),
          })),
        ),
      );
  }, []);

  const scrollToBotton = () => {
    scrollRef.current.scrollToEnd();
  };

  const handleSendMessage = async () => {
    await firestore()
      .collection('Chats')
      .doc(route.params.fullId)
      .collection('Messages')
      .doc()
      .set({
        message: sentMessage,
        number: number,
        time: firestore.FieldValue.serverTimestamp(),
      });
    setMessagedBefore(true);
    setSentMessage('');
    scrollToBotton();
  };

  return (
    <View style={styles.container}>
      <View style={styles.chatHeader}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image
            source={require('../../assets/back.png')}
            style={{height: 21, width: 14}}
          />
        </TouchableOpacity>
        <Image
          source={{uri: route.params.profileImage}}
          style={{height: 45, width: 45, borderRadius: 50, marginLeft: 15}}
        />
        <View
          style={{display: 'flex', flexDirection: 'column', marginLeft: 10}}>
          <Text style={styles.name}>{route.params.receiverName}</Text>
          <View>
            {route.params.online ? (
              <Text style={{color: '#09bd36', fontWeight: 'bold'}}>Online</Text>
            ) : (
              <Text style={{color: '#e61037', fontWeight: 'bold'}}>
                Offline
              </Text>
            )}
          </View>
        </View>
      </View>

      <ScrollView style={{marginBottom: 50}} ref={scrollRef}>
        {messages.map(message =>
          message.number === number ? (
            <SentMessage
              message={message.message}
              key={message.id}
              time={message.time}
            />
          ) : (
            <ReceivedMessage
              message={message.message}
              key={message.id}
              time={message.time}
              profileImage={route.params.profileImage}
            />
          ),
        )}
      </ScrollView>

      <View style={styles.inputWrapper}>
        <View style={styles.inputContainer}>
          <TextInput
            placeholder={'Type a message'}
            onFocus={scrollToBotton}
            value={sentMessage}
            onChangeText={sentMessage =>
              setSentMessage(sentMessage)
            }></TextInput>
          <TouchableOpacity
            style={styles.sendImage}
            onPress={handleSendMessage}>
            <Image
              source={require('../../assets/send.png')}
              style={{height: 25, width: 25, marginRight: 2}}
            />
          </TouchableOpacity>
        </View>
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
  chatHeader: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 5,
    backgroundColor: '#212020',
    shadowColor: '#737272',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 3,
  },
  name: {
    color: '#fdfdfd',
    fontWeight: 'bold',
    fontSize: 18,
  },
  inputWrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 50,
    paddingTop: 5,
    backgroundColor: '#212020',
    shadowColor: '#fdfdfd',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 8,
  },
  inputContainer: {
    borderColor: '#fdfdfd',
    borderWidth: 1,
    marginHorizontal: 20,
    borderRadius: 50,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
  },
  sendImage: {
    backgroundColor: '#fdfdfd',
    padding: 6,
    borderRadius: 50,
  },
});
