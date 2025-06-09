import React, { useEffect, useState } from 'react';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';
import { Avatar } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getUserChats } from '../components/GetUserChats';
import { useAuth } from '../config/auth';
import useStyle from '../styles/useStyle';

const Chats = ({ navigation }) => {
  const { user: currentUser } = useAuth();
  const [chats, setChats] = useState([]);
  const [participants, setParticipants] = useState([]);
  const styles = useStyle();
  useEffect(() => {
    if (!currentUser || !currentUser.id) {
      console.error('User ID is undefined.');
      return;
    }

    const unsubscribe = getUserChats(currentUser.id, setChats);

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [currentUser.id]);




  const renderChatItem = ({ item }) => {
    const otherParticipant = item.participants.find(p => p.id !== currentUser.id);
    const avatar = otherParticipant?.avatar;

    return (
      <SafeAreaView >
        <TouchableOpacity
          onPress={() => navigation.navigate('ChatScreen', {
            chatId: item.id,
            userId: currentUser.id
          })}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingVertical: 8,
            paddingHorizontal: 10,
            borderBottomWidth: 0.5,
            borderBottomColor: '#ddd',
          }}
        >
          {avatar ? (
            <Avatar.Image size={40} source={{ uri: avatar }} />
          ) : (
            <Avatar.Text size={40} label="" style={{ backgroundColor: '#ccc' }} />
          )}

          <View style={{ flex: 1, marginLeft: 10 }}>
            <Text style={{ fontWeight: '500', fontSize: 15 }}>
              {otherParticipant?.first_name} {otherParticipant?.last_name}
            </Text>
            <Text style={{ color: '#666', fontSize: 13 }} numberOfLines={1}>
              {item.last_message || 'Chưa có tin nhắn'}
            </Text>
          </View>

          <Text style={{ fontSize: 11, color: '#999' }}>
            {new Date(item.last_update).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </Text>
        </TouchableOpacity>


      </SafeAreaView>
    );
  };


  return (
    <FlatList
      data={chats}
      keyExtractor={(item) => item.id}
      renderItem={renderChatItem}
    />
  );
};

export default Chats;