import React, {Component} from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import {history} from '../history';

class HomeUploadSent extends Component{
    // constructor(props){
    //     super(props);

    // }

    render(){

        const {data} = this.props;
        const to = _.get(data, 'to');
        const postId = _.get(data, '_id');

        return(
            <div className={'app-card app-card-upload-sent'}>
                <div className={'app-card-content'}>
                    <div className={'app-card-content-inner'}>
                        <div className={'app-home-uploading'}>
                            <div className={'app-home-upload-sent-icon'}>
                                <i className={'icon-paperplane'} />
                            </div>

                            <div className={'app-upload-sent-message app-text-center'}>
                                <h2> Files Sent! </h2>
                                <p> We have sent an email to <strong> {to} </strong> with a download link. The link will expire in 30 days. </p>
                            </div>

                            <div className={'app-upload-sent-action app-form-actions'}>
                                <button className={'app-button primary'} type={'button'} onClick={() => {
                                    history.push(`/share/${postId}`);
                                }}> View File </button>
                                <button className={'app-button'} type={'button'} onClick={(event) => {
                                    if(this.props.onSendAnotherFile){
                                        this.props.onSendAnotherFile(true);
                                    }
                                }}> Send other file </button>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        )
    }

}

HomeUploadSent.PropTypes = {
    data : PropTypes.object,
    onSendAnotherFile: PropTypes.func
}
export default HomeUploadSent;