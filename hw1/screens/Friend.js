import { useNavigation } from '@react-navigation/core';
import React, { useEffect, useState } from 'react';
import { Platform ,TextInput,KeyboardAvoidingView ,StyleSheet, Text, TouchableOpacity, View,FlatList } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import Device from 'expo-device';
import * as Location from 'expo-location';
import DropDownPicker from 'react-native-dropdown-picker'
import Constants from 'expo-constants';
const axios = require('axios');
import {Picker} from '@react-native-picker/picker';
import { Button, Overlay } from 'react-native-elements';

const Friend = ({ route, navigation }) => {
  const [longtitude, setLongitude] = useState('');
  const [latitude, setLatitude] = useState('');
  let [friend,setfriend] = useState(null)
  const [follower, setfollower] = useState('');
  let [location,setlocation]= useState(null)
  const [userfriend, setuserfriend] = useState(null)
    const [friendschedule, setfriendschedule] = useState(null)

  const [visible, setVisible] = useState(false);

const [myArray, setMyArray] = useState([]);
  useEffect(() => {
    console.log(route.params)
    getFriend()
    
   
  }, []);
  const getFriend = async () => {
       const { data } = await axios.post(
          `https://backendhw1.herokuapp.com/getfriend`, {
        email: route.params.email,
      }
        );
    
    if (data !== undefined){
          console.log(data)

        let list = []
         for (let i = 0; i < data.length; i++) { 
        console.log(data[i].following=== route.params.email)
      if(data[i].following=== route.params.email){
      list.push({id: i, friend: data[i].follower}); 

      } else{
    list.push({id: i, friend: data[i].following}); 

      }


        }
        setuserfriend(list)

        }
  };
  const handleReturn = async () => {
   
    navigation.replace("Home", {
        email: route.params.email,
      })

  };
  const requestFriendList = async () => {
   
    navigation.replace("Request", {
        email: route.params.email,
      })

  };

  const submit = async () => {
    //console.log(latitude)
    //console.log(longtitude)
    console.log(friend)
   const { data } = await axios.post(
          `https://backendhw1.herokuapp.com/addfriend`, {
        email: route.params.email,
        friend: follower
      }
        );
  console.log(data)
         
        if (data !== null){
        setlocation(data.location)
        } else{ 
        Alert.alert('Error Wrong friend', 'Get some real friend', [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        { text: 'OK', onPress: () => console.log('OK Pressed') },
      ]);

        }

  };

  const addfriend = async ()=>{



  }  
const toggleOverlay = () => {
    setVisible(!visible);
  };

const ItemView =  ({ item }) => {
    return (
      // Flat List Item
      <Text style={styles.itemStyle} onPress={() => getItem(item)}>
        {item.id}
        {'.'}
        {item.friend.toUpperCase()}
      </Text>
    );
  };

  

 const getItem =async (item) => {
    // Function for click on an item
    console.log(item.friend)

 const { data } = await axios.post(
          `https://backendhw1.herokuapp.com/getfindperson`, {
        email: item.friend,

      }
        );
        if (data !== undefined){
          console.log(data)

        let list = []
         for (let i = 0; i < data.length; i++) { 
        //console.log(data[i])
    list.push(data[i].location); 

        }
        
        setfriendschedule(list.join('\n'))

        }
  //console.log("Data")
  //await set_open_hour(data.results.current_opening_hours.weekday_text);
    
  
  

    //alert('Id : ' + item.id + ' Title : ' + item.name);
  //}
  setVisible(!visible);

 };

const ItemSeparatorView = () => {
    return (
      // Flat List Item Separator
      <View
        style={{
          height: 0.001,
          width: '10%',
          backgroundColor: '#C8C8C8',
        }}
      />
    );
  };



  return (
    
       <KeyboardAvoidingView style={styles.container} behavior="padding">

    <Text style={styles.paragraph}>
        Friend List:
      </Text>
          <FlatList 
        data={userfriend}
        keyExtractor={(item, index) => index.toString()}
        renderItem={ItemView}
        ref={(ref) => {
          listViewRef = ref;
        }}
      />
        <Overlay isVisible={visible} onBackdropPress={toggleOverlay}>
        <Text>Friend Schedule</Text>
        <Text>{friendschedule} </Text>
      </Overlay>
     
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="add friend"
          value={follower}
          onChangeText={(text) => setfollower(text)}
          style={styles.input}
        />
        </View>

    
      
      
      
      
      <TouchableOpacity onPress={submit} style={styles.button}>
        <Text style={styles.buttonText}>Add Friend</Text>
        
      </TouchableOpacity>
      <TouchableOpacity onPress={requestFriendList} style={styles.button}>
        <Text style={styles.buttonText}>Request</Text>
        
      </TouchableOpacity>  
        
      <TouchableOpacity onPress={handleReturn} style={styles.button}>
        <Text style={styles.buttonText}>Return Main Menu</Text>
        
      </TouchableOpacity>

      


    </KeyboardAvoidingView>


  );
  
};

export default Friend;

const styles = StyleSheet.create({
  inputContainer: {
    width: '100%',
  },
  input: {
    backgroundColor: 'white',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 5,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingTop: Constants.statusBarHeight,
    backgroundColor: '#ecf0f1',
    padding: 8,
  },  paragraph: {
    margin: 24,
    fontSize: 15,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#0782F9',
    width: '100%',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 16,
  },
});
