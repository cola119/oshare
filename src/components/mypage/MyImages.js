import React from 'react';

class MyImages extends React.Component {

    render() {
        return (
            <div>
                your images:
                {this.props.myImages.map((val, index) => (
                    <div key={index}>
                        <img src={val.downloadUrl} onClick={this.props.selectImage}
                            alt={val.fileName} width="300px" height="auto" />
                    </div>
                ))}
            </div>
        );
    }
}

export default MyImages;