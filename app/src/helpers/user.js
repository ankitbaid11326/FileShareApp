import axios from 'axios';
import {apiURL} from '../config';

export const createUser = (user) => {

    const url = `${apiURL}/users/`;
    return axios.post(url, user);
}

export const login = (email = null, password = null) => {
    const url = `${apiURL}/users/login`;
    return axios.post(url, {
        email: email,
        password: password,
    });
}