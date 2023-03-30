import { useNavigation } from '@react-navigation/core';
import React, { useEffect, useState } from 'react';
import { Platform ,TextInput,KeyboardAvoidingView ,StyleSheet, Text, TouchableOpacity, View ,AsyncStorage } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import Device from 'expo-device';
import * as Location from 'expo-location';
import DropDownPicker from 'react-native-dropdown-picker'
import Constants from 'expo-constants';
const axios = require('axios');
import {Picker} from '@react-native-picker/picker';

const NearMeScreen = ({ route, navigation }) => {
  const [longtitude, setLongitude] = useState('');
  const [latitude, setLatitude] = useState('');
  const [keyword, setKeyword] = useState('chinese');
  let [nearme,setnearme] = useState(null)
  let [nearme2,setnearme2] = useState(null)
  let [nearme3,setnearme3] = useState(null)

 let [rating,setrating] = useState(null)
  let [rating2,setrating2] = useState(null)
  let [rating3,setrating3] = useState(null)
  /* 2. Get the param */
  //var { lat, long } = route.params;
const [myArray, setMyArray] = useState([]);
  useEffect(() => {
    console.log(route.params)

    //let lat = SecureStore.getItemAsync('latitude');
    //let long = SecureStore.getItemAsync('longtitude');
    //console.log(lat)
    setLatitude(route.params.latitude)
    setLongitude(route.params.longtitude)
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
        let x = data.results.length
        let a = 0
        setnearme('')
        setnearme2('')
        setnearme3('')
        if (x>2){
        setnearme(data.results[0].name)
        setnearme2(data.results[1].name)
        setnearme3(data.results[2].name)
        setrating(data.results[0].rating)
        setrating2(data.results[1].rating)
        setrating3(data.results[2].rating)

        } else{
        setnearme(data.results[0].name)
        setrating(data.results[0].rating)

        }
     /*axios.post(`https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude}%2C${longtitude}&radius=500&type=&keyword=${keyword}&key=AIzaSyDktwaKPfmjDE2AuNcVdKvuPzRzvUDl7_s`).then((response)=> {
      console.log(response);
      setnearme(response.results)
    },(error)=>{
      console.log(error)
    })
    //console.log(nearme)
   

*/
  };

  


  return (
    
    <KeyboardAvoidingView style={styles.container} behavior="padding">

    <View style={styles.container}>
    <Text style={styles.paragraph}>
        Searched place: {nearme}~{"\n"} Raiting: {rating}
      </Text>
      <Text style={styles.paragraph}>
        Searched place: {nearme2}~{"\n"} Raiting: {rating2}
      </Text>
      <Text style={styles.paragraph}>
        Searched place: {nearme3}~{"\n"} Raiting: {rating3}
      </Text>


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
        Longtitude: {longtitude}
      </Text>
      <Text style={styles.paragraph}>
        Latitude: {latitude}
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

export default NearMeScreen;

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
