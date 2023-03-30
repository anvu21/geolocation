import { useNavigation } from '@react-navigation/core';
import React, { useEffect, useState } from 'react';

import { Button, Overlay } from 'react-native-elements';
import { Platform ,TextInput,KeyboardAvoidingView ,StyleSheet, Text, TouchableOpacity,Image, View,SafeAreaView,FlatList ,AsyncStorage } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import Device from 'expo-device';
import * as Location from 'expo-location';
import DropDownPicker from 'react-native-dropdown-picker'
import Constants from 'expo-constants';
const axios = require('axios');
import {Picker} from '@react-native-picker/picker';

const PlanNearMe = ({ route, navigation }) => {
  
  const [longtitude, setLongitude] = useState('');
  const [latitude, setLatitude] = useState('');
  const [address, setaddress] = useState('');
  const [open_hour, set_open_hour] = useState('');

  const [keyword, setKeyword] = useState('chinese');
  let [nearme,setnearme] = useState(null);
  const [visible, setVisible] = useState(false);
  const [location_name, setLocation_name] = useState('');
  const [location_id, setLocation_id] = useState('');


  /* 2. Get the param */
  //var { lat, long } = route.params;
const [myArray, setMyArray] = useState([]);
  useEffect( () => {
    console.log(route.params)

    //let lat = SecureStore.getItemAsync('latitude');
    //let long = SecureStore.getItemAsync('longtitude');
    //console.log(lat)
    setLatitude(route.params.latitude)
    setLongitude(route.params.longtitude)
    setaddress(route.params.address)
  }, []);

  const handleReturn = async () => {
   console.log(route.params.email)
    navigation.replace("Home", {
        email: route.params.email,
      })

  };
  const submit = async () => {
    //console.log(latitude)
    //console.log(longtitude)
    console.log(keyword)
   const { data } = await axios.post(
         `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude}%2C${longtitude}&radius=500&type=&keyword=${keyword}&key=AIzaSyDktwaKPfmjDE2AuNcVdKvuPzRzvUDl7_s`);

        console.log("Data")
        console.log(data)
        //let x = data.results.length
        let list = []
         for (let i = 0; i < data.results.length; i++) { 
    console.log(data.results[i].name)
    if(i>5){
            break;    }
    list.push({id: i, name: data.results[i].name, place_id: data.results[i].place_id}); 

        }
        setnearme(list)
        //setnearme(data.results[0].name)

  };


const toggleOverlay = () => {
    setVisible(!visible);
  };

const ItemView =  ({ item }) => {
    return (
      // Flat List Item
      <Text style={styles.itemStyle} onPress={() => getItem(item)}>
        {item.id}
        {'.'}
        {item.name.toUpperCase()}
      </Text>
    );
  };

  

 const getItem =async (item) => {
    // Function for click on an item
  setLocation_id(item.place_id)
  setLocation_name(item.name)

  const { data } = await axios.post(
         `https://maps.googleapis.com/maps/api/place/details/json?place_id=${item.place_id}&key=AIzaSyDktwaKPfmjDE2AuNcVdKvuPzRzvUDl7_s`);

  //console.log("Data")
  //console.log(data)
  //await set_open_hour(data.results.current_opening_hours.weekday_text);
    
  
  
  set_open_hour(data.result.current_opening_hours.weekday_text.join('\n'));

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

const sendtobase = () => {
    var em= route.params.email
    //var name = location_name;
    //var id= location_id;
    //console.log("test")
    //console.log(location_name)
    const { datafind } =  axios.post(
          `https://backendhw1.herokuapp.com/savefindme`, {
        email: em,
        location: location_name,
        place_id: location_id
      }
        );
  setVisible(!visible);


  };


  return (
    
      

    <KeyboardAvoidingView style={styles.container} behavior="padding">

        
    <View style={styles.paragraph}>
    <FlatList
        data={nearme}
        keyExtractor={(item, index) => index.toString()}
        renderItem={ItemView}
        ref={(ref) => {
          listViewRef = ref;
        }}
      />
            <Overlay isVisible={visible} onBackdropPress={toggleOverlay}>
        <Text>Open Time!</Text>
        <Text>{open_hour}</Text>

        <Button
        title="Press me to add"
        onPress={sendtobase}
      />
      </Overlay>

       <View style={styles.inputContainer}>
        <TextInput
          placeholder="Keyword"
          value={keyword}
          onChangeText={(text) => setKeyword(text)}
          style={styles.input}
        />
        </View>
     <Text style={styles.paragraph}>
        Keyword: {keyword}
      </Text>
     

    
      <Text style={styles.paragraph}>
        Current address: {address}
      </Text>
      
      
      
      
      <TouchableOpacity onPress={submit} style={styles.button}>
        <Text style={styles.buttonText}>Search</Text>
        
      </TouchableOpacity>
        
        
      <TouchableOpacity onPress={handleReturn} style={styles.button}>
        <Text style={styles.buttonText}>Return Main Menu</Text>
        
      </TouchableOpacity>


      
    </View>


      </KeyboardAvoidingView>


  );
  
  
};


export default PlanNearMe;

const styles = StyleSheet.create({
  inputContainer: {
    width: '100%',
  },  
  itemStyle: {
    padding: 5,
    fontSize: 20,
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
    padding: 5,
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
