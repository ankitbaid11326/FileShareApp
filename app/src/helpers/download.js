import axios from 'axios';
// import _ from 'lodash';

import {apiURL} from '../config';

const getDownloadInfo = (id) => {
    const url = `${apiURL}/posts/${id}`;
    return axios.get(url);
}

export default getDownloadInfo;