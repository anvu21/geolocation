import { useNavigation } from '@react-navigation/core';
import React, { useEffect, useState } from 'react';
import {
  Platform,
  TextInput,
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
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
  };

  useEffect(() => {
     setEmail(route.params.email)
      fetchData();
    //const value =  AsyncStorage.getItem(STORAGE_KEY);
    //let result =  AsyncStorage.getItem('key');
    //setEmail(result);
    const updatelocation = async () => {
      //https://maps.googleapis.com/maps/api/geocode/json?latlng=40.610704443741746, -75.37844160940242&key=AIzaSyDktwaKPfmjDE2AuNcVdKvuPzRzvUDl7_s
      //console.log("Update test")
      //console.log(latitude)
      //console.log(longitude)
      
      if (lat !== null) {
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
        //console.log(datafind)

      }
    };
    //fetchData();
    const interval = setInterval(async () => {
      //console.log(route.params)
      //await fetchData();
      
      await updatelocation();
      
      setCounter((prevCounter) => prevCounter + 1);
    }, time);

    return () => clearInterval(interval);
  }, [time]);

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
  

  return (
    <View style={styles.container}>
      <DropDownPicker
        items={[
          { label: '3 sec', value: 3000 },
          { label: '10 sec', value: 10000 },
          { label: '20 sec', value: 20000 },
        ]}
        defaultIndex={0}
        containerStyle={{ height: 30 }}
        onChangeItem={(item) => setime(item.value)}
      />
    <Text style={styles.paragraph}>Email: {email}</Text>

      <Text style={styles.paragraph}>Timee: {time}</Text>
      <Text style={styles.paragraph}>Address: {address}</Text>
      <Text style={styles.paragraph}>
        Lat/Long: {latitude} {longitude}
      </Text>
      <TouchableOpacity onPress={handleSignOut} style={styles.button}>
        <Text style={styles.buttonText}>Sign out</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={nearme} style={styles.button}>
        <Text style={styles.buttonText}>Near Me</Text>
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
    margin: 24,
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
