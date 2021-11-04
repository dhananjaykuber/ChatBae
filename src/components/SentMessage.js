import React from 'react';
import {View, StyleSheet, Text} from 'react-native';

export default function SentMessage(props) {
  return (
    <View style={styles.messageWrapper}>
      <Text style={styles.messageText}>{props.message}</Text>
      <Text style={styles.messageTime}>{props.time}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  messageWrapper: {
    backgroundColor: '#171717',
    alignSelf: 'flex-end',
    marginTop: 20,
    paddingVertical: 2,
    marginRight: 10,
    borderBottomLeftRadius: 10,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    marginLeft: '20%',
  },
  messageText: {
    color: '#fdfdfd',
    paddingHorizontal: 8,
  },
  messageTime: {
    color: '#999999',
    fontSize: 10,
    alignSelf: 'flex-end',
    paddingHorizontal: 8,
  },
});
