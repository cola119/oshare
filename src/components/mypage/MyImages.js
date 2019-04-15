import React from 'react';

class MyImages extends React.Component {

    render() {
        return (
            <div>
                <div>your images:</div>
                <div style={{ display: "inline" }}>
                    {this.props.myImages.map((val, index) => (
                        (this.props.selectedImageName === val.fileName) ?
                            <img key={index} src={val.downloadUrl} onClick={this.props.selectImage} alt={val.fileName} width="150px" height="auto" /> :
                            <img key={index} src={val.downloadUrl} onClick={this.props.selectImage} alt={val.fileName} width="100px" height="auto" />
                    ))}
                </div>
            </div >
        );
    }
}

export default MyImages;