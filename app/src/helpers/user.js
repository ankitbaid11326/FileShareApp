import axios from 'axios';
import {apiURL} from '../config';

export const createUser = (user) => {

    const url = `${apiURL}/users/`;
    return axios.post(url, user);
}