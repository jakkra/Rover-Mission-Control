import React from 'react';
import PropTypes from 'prop-types';

import { Button, ButtonGroup, Grid } from 'react-bootstrap';

const styles = {
  container: {
    textAlign: 'center',
    maxWidth: '100%',
    maxHeight: '100%'
  },
  image: {
    width: '95%',
  },
  button: {

  }
};

export default class ImageCard extends React.Component {
  static propTypes = {
    cameraUrl: PropTypes.string,
    isConnected: PropTypes.bool.isRequired,
  };

  static defaultProps = {
    streamAddress: 'http://192.168.4.10:81/stream',
    captureAddress: 'http://192.168.4.10/capture'
  };

  constructor(props) {
    super(props);
    this.startStream = this.startStream.bind(this);
    this.stopStream = this.stopStream.bind(this);
    this.captureStill = this.captureStill.bind(this);

    this.state = {
      imgSrc: ''
    }
  }

  startStream() {
    this.setState({
      imgSrc: this.props.streamAddress
    });
  }

  stopStream() {
    this.setState({
      imgSrc: ''
    });
  }

  captureStill() {
    this.setState({
      imgSrc: this.props.captureAddress + '?' + new Date().getTime(),
    });
  }

  render() {
    return (
      <Grid style={ styles.container }>
        <ButtonGroup >
          <Button style={styles.button} bsStyle="success" onClick={this.startStream}>Start stream</Button>
          <Button style={styles.button} bsStyle="danger" onClick={this.stopStream}>Stop stream</Button>
          <Button style={styles.button} bsStyle="primary" onClick={this.captureStill}>Take screenshot</Button>
        </ButtonGroup>
        <img style = {styles.image} src={this.state.imgSrc} alt="" />
      </Grid>
    );
  }
}