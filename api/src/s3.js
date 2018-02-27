import _ from 'lodash';
import {s3Bucket} from './mailconfig';

class S3{
    
    constructor(app, response){
        this.app = app;
        this.response = response;
    }

    getObject(file){
        const s3 = this.app.s3;
        
        const options = {
            Bucket: s3Bucket,
            Key: _.get(file, 'name')
        };

        return s3.getObject(options).createReadStream();
    }

    download(file){
        const s3 = this.app.s3;
        const response = this.response; 

        // get object from Amazon S3
        const filename = _.get(file, 'originalName');
        response.attachment(filename);

        const options = {
            Bucket: s3Bucket,
            Key: _.get(file, 'name')
        };
        const fileObject = s3.getObject(options).createReadStream();

        fileObject.pipe(response);

    }

    getDownloadURL(file){
        const s3 = this.app.s3;
        const options = {
            Bucket: s3Bucket,
            Key: _.get(file, 'name'),
            Expires: 3600, // One hour to expire
        };

        const url = s3.getSignedUrl('getObject', options);

        return url;
    }

}

export default S3;