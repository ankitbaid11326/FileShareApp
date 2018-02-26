import _ from 'lodash';
import {url} from './mailconfig';

class Email{

    constructor(app){        
        this.app = app;
    }

    sendDownloadLink(post, callback = () => {}){

        const app = this.app;
        const email = app.email;

        const from = _.get(post, 'from'); // post.from
        const to = _.get(post, 'to'); // post.to
        const message = _.get(post, 'message', '');
        const postId = _.get(post, '_id');
        const downloadLink = `${url}/share/${postId}`;
        
        // setup email data with unicode symbols
        let mailOptions = {
            from: from, // sender address
            to: to, // list of receivers
            subject: `[Share] Download invitation`, // Subject line
            text: message, // plain text body
            html: `<p> ${from} has sent to you files. Click <a href="${downloadLink}"> here </a> to download. </p> <p> Message: ${message}` // html body
        };
        // send mail with defined transport object
        email.sendMail(mailOptions, (error, info) => {
            return callback(error, info);
        });
    }

}
export default Email;