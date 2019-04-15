import React from 'react';

class MyImages extends React.Component {

    render() {
        return (
            <div>
                your images:
                {this.props.myImages.map((val, index) => (
                    <div key={index}>
                        {/* {val.downloadUrl}<br /> */}
                        <img src={val.downloadUrl} alt={index} width="300px" height="auto" />
                    </div>
                ))}
            </div>
        );
    }
}

export default MyImages;