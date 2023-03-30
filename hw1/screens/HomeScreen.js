import { useNavigation } from '@react-navigation/core';
import React, { useEffect, useState } from 'react';
import {
  Platform,
  TextInput,
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,FlatList,
} from 'react-native';
import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Device from 'expo-device';
import * as Location from 'expo-location';
import DropDownPicker from 'react-native-dropdown-picker';
import Constants from 'expo-constants';
const axios = require('axios');
import { Picker } from '@react-native-picker/picker';
import moment from 'moment';
import { Button, Overlay } from 'react-native-elements';


const HomeScreen = ({ route, navigation }) => {
  const [email, setEmail] = useState('');
  const [location, setLocation] = useState(null);
  const [locationlatitude, setLocationlatitude] = useState(null);
  var a = null;
  var long = null;
  var lat = null;
  const [errorMsg, setErrorMsg] = useState(null);
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [address, setaddress] = useState(null);
  const [test, settest] = useState(null);
  //var send = null;
  const [counter, setCounter] = useState(0);
  const [time, setime] = useState(3000);
  
  const [findme, setfindme] = useState(null);

  const [visible, setVisible] = useState(false);
  const [location_name, setLocation_name] = useState('');
  const [location_id, setLocation_id] = useState('');
  const [open_hour, set_open_hour] = useState('');

  useEffect(() => {
    const fetchData = async () => {
   /*
    let result = await SecureStore.getItemAsync('abc');
    setEmail(result);
    */
    if (Platform.OS === 'android' && !Device.isDevice) {
      setErrorMsg(
        'Oops, Snack does not work in an Android Emulator. Try it on your device!'
      );
      return;
    }
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      setErrorMsg('Permission to access location was denied');
      return;
    }
  
  

    let location = await Location.getCurrentPositionAsync({});
    a = location;
    lat = location.coords.latitude;
    long = location.coords.longitude;
    setLatitude(lat)
    setLongitude(long)
    
    await updatelocation();
  };


  const updatelocation = async () => {
      
      if (lat !== null) {
        //console.log("test")
        console.log(lat)
        console.log(long)

        const { data } = await axios.post(
          `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${long} &key=AIzaSyDktwaKPfmjDE2AuNcVdKvuPzRzvUDl7_s`
        );
        //console.log(data)
        var send = data.results[0].formatted_address;
        var lo = await (data.results[0].formatted_address);
        var em= route.params.email
        console.log(route.params.email)
        await setaddress(data.results[0].formatted_address);
        var date = await moment().utcOffset('').format(' hh:mm a');

        const { datafind } = await axios.post(
          `https://backendhw1.herokuapp.com/findme`, {
        email: em,
        time: date,
        location: lo
      }
        );



      }
    

    
   



    };

    //const value =  AsyncStorage.getItem(STORAGE_KEY);
    //let result =  AsyncStorage.getItem('key');
    //setEmail(result);
    
     setEmail(route.params.email)
      fetchData();
      getnearme();
      //updatelocation();
      
      
  
  },[]);
  const getnearme = async ()=> {
        let em = route.params.email
      //console.log("test")
  const { data } = await axios.post(
          `https://backendhw1.herokuapp.com/getfindperson`, {
        email: em

      }
    );
    //console.log(findme)
         
        if (data !== undefined){
          console.log(data)

        let list = []
         for (let i = 0; i < data.length; i++) { 
        //console.log(data[i])
    list.push({id: i, location: data[i].location, place_id: data[i].place_id}); 

        }
        setfindme(list)

        }

  }
  const handleSignOut = async () => {
    navigation.replace('Login');
  };
  const nearme = () => {
    
    navigation.replace('NearMe', {
      latitude: latitude,
      longtitude: longitude,
      address: address,
      email: route.params.email
    });
  };
  const planNear = () => {
    
    navigation.replace('PlanNearMe', {
      latitude: latitude,
      longtitude: longitude,
      address: address,
      email: route.params.email
    });
  };
  const friend = () => {
    
    navigation.replace('Friend', {
      email: route.params.email
    });
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
        {item.location.toUpperCase()}
      </Text>
    );
  };

  

 const getItem =async (item) => {
    // Function for click on an item
  setLocation_id(item.place_id)
  setLocation_name(item.location)

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

const deleteitem = (item) => {
    var em= route.params.email
    //var name = location_name;
    //var id= location_id;
    //console.log("test")
    console.log(location_name)
    const { datafind } =  axios.post(
          `https://backendhw1.herokuapp.com/deletefindme`, {
        email: em,
        location: location_name,
      }
        );
  setVisible(!visible);
  getnearme();


  };
  return (
    <View style={styles.container}>
    <FlatList 
        data={findme}
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
        title="Delete"
        onPress={deleteitem}
      />
      </Overlay>

  
      <Text style={styles.paragraph}>Address: {address}</Text>
      
      <TouchableOpacity onPress={handleSignOut} style={styles.button}>
        <Text style={styles.buttonText}>Sign out</Text>
      </TouchableOpacity>
      
      <TouchableOpacity onPress={friend} style={styles.button}>
        <Text style={styles.buttonText}>Friend</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={planNear} style={styles.button}>
        <Text style={styles.buttonText}>PlanNearMe</Text>
      </TouchableOpacity>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingTop: Constants.statusBarHeight,
    backgroundColor: '#ecf0f1',
    padding: 8,
  },
  paragraph: {
    margin: 10,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#0782F9',
    width: '100%',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 30,
  },
  buttonText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 16,
  },
});
