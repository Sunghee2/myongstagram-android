import axios from 'axios';
import qs from 'qs';
import { AsyncStorage } from 'react-native';
import { Config } from '../config';
import NavigationService from '../navigation_service';

export function checkEmail(email) {
  return async dispatch => {
    try {
      const response = await axios.post(`${Config.server}/api/users`,
        qs.stringify({
          email: email
        }));
      if (response.status == 200) {
        NavigationService.navigate('CheckPw', { email : email });
      } 
    } catch (err) {
      if (err.response.status == 422) {
        alert(err.response.data.message);
      }
    }
  }
}

export function signup(email, username, password) {
  return async dispatch => {
    try {
      const response = await axios.post(`${Config.server}/api/users/new`,
      qs.stringify({
        email: email,
        username: username,
        password: password
      }));
      if (response.status == 200) {
        alert(response.data.message);
        NavigationService.navigate('Login');
      }
    } catch (err) {
      if (err.response.status == 422) {
        alert(err.response.data.message);
      }      
    }
  }
}

export function signin(email, password) {
  return async dispatch => {
    try {
      const response = await axios.post(`${Config.server}/api/oauth/token`,
        qs.stringify({
          username: email,
          password: password,
          client_secret: Config.clientSecret,
          client_id: Config.clientId,
          grant_type: 'password'
        }), {
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        });

      axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.access_token}`;
      await AsyncStorage.setItem('accessToken', response.data.access_token);
      NavigationService.navigate('Home');
    } catch (err) {
      alert('Invalid ID or Password');
    }
  };
}

export function postNew(image, content) {
  return async dispatch => {
    try {
      const response = await axios.post(`${Config.server}/posts/new`,
        qs.stringify({
          image: image,
          content: content
        }));   
      console.log(response);   
    } catch (err) {
      console.log(err);
    }
  }
}