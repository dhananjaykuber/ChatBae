import React from 'react';
import {View, StyleSheet, Text, Image} from 'react-native';

export default function ReceivedMessage(props) {
  return (
    <View style={styles.messageWrapper}>
      <Image
        source={{uri: props.profileImage}}
        style={{
          height: 35,
          width: 35,
          borderRadius: 100,
          borderWidth: 0.5,
          borderColor: '#fdfdfd',
        }}
      />
      <View style={styles.messageContainer}>
        <Text style={styles.messageText}>{props.message}</Text>
        <Text style={styles.messageTime}>{props.time}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  messageWrapper: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 15,
    alignSelf: 'flex-start',
    marginHorizontal: 8,
  },
  messageContainer: {
    marginRight: '20%',
    marginLeft: 10,
    marginTop: 6,
    backgroundColor: '#d6d6d6',
    paddingHorizontal: 8,
    borderBottomRightRadius: 10,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  messageText: {
    color: '#212020',
    fontSize: 15,
  },
  messageTime: {
    color: '#999999',
    fontSize: 10,
  },
});
