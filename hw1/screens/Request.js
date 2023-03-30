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
  const [visible, setVisible] = useState(false);

const [myArray, setMyArray] = useState([]);
  useEffect(() => {
    //console.log(route.params)
    getFriend()
    
   
  }, []);
  const getFriend = async () => {
       const { data } = await axios.post(
          `https://backendhw1.herokuapp.com/getrequest`, {
        email: route.params.email,
      }
        );
    
    if (data !== undefined){
          console.log(data)

        let list = []
         for (let i = 0; i < data.length; i++) { 
        //console.log(data[i])
    list.push({id: i, friend: data[i].follower}); 

        }
        setuserfriend(list)

        }
  };
  const handleReturn = async () => {
   
    navigation.replace("Friend", {
        email: route.params.email,
      })

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
console.log("getitem test")
console.log(item.friend)
 const { data } = await axios.post(
          `https://backendhw1.herokuapp.com/confirmfriend`, {
        email: item.friend,
        friend: route.params.email
      }
        );


  getFriend()

  
  


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
        Request List:
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
        <Text>Open Time!</Text>
        <Text> f</Text>
      </Overlay>
     

      <TouchableOpacity onPress={handleReturn} style={styles.button}>
        <Text style={styles.buttonText}>Return To Friend Menu</Text>
        
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
