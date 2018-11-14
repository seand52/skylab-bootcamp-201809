import React, { Component } from "react";
import logic from '../logic'

export class FileSelector extends Component {
    state = {
        file: null
    }

    handleUpload = event => {
        event.preventDefault()

        // this.props.onSubmitChange(this.state.file)
        debugger
        // this.props.onClosePopupUpload()
        logic.uploadPhoto(this.state.file)

        this.setState({ file: null })
    }

    handleselectedFile = event => {
        console.log(event.target.files)
        this.setState({ file: event.target.files[0] })
    }

    getPicture = () => {
        const id = sessionStorage.getItem('userId')

        return logic.getImage(id)

            .then(res => this.setState({ file: res }))
    }


    render() {
        return <div>
            <form encType="multipart/form-data" onSubmit={this.handleUpload}>
                <input type="file" name="profile-image" onChange={this.handleselectedFile} />
                <button type="submit">Upload</button>
            </form>
            <button onClick={this.getPicture}>test</button>
            <img src={this.state.file}></img>
        </div>;
    }
}

export default FileSelector