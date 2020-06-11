import React from 'react';
import PropTypes from 'prop-types';

import { Button, ButtonGroup, Grid } from 'react-bootstrap';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLightbulb } from '@fortawesome/free-solid-svg-icons'

const styles = {
  container: {
    textAlign: 'center',
    width: '100%',
    height: '100%',
  },
  image: {
    maxWidth: '100%',
    height: '85%',
  },
  button: {
    padding: 4,
  }
};

export default class ImageCard extends React.Component {
  static propTypes = {
    streamAddress: PropTypes.string,
    captureAddress: PropTypes.string,
    setQualityAddress: PropTypes.string,
    isConnected: PropTypes.bool.isRequired,
  };

  static defaultProps = {
    streamAddress: 'http://192.168.4.10:81/stream',
    captureAddress: 'http://192.168.4.10/capture',
    setQualityAddress: 'http://192.168.4.10/control?var=quality&val=30',
    setLedState: 'http://192.168.4.10/control?var=led&val='
  };

  constructor(props) {
    super(props);
    this.startStream = this.startStream.bind(this);
    this.stopStream = this.stopStream.bind(this);
    this.captureStill = this.captureStill.bind(this);
    this.toggleLed = this.toggleLed.bind(this);

    this.state = {
      imgSrc: '',
      flashOn: false
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.isConnected && !prevProps.isConnected) {
      if (this.props.setQualityAddress) {
        fetch(this.props.setQualityAddress)
        .catch((err) => console.log('Failed setting quality'));
      }
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

  toggleLed() {
    let url = this.props.setLedState
    this.setState({
      flashOn: !this.state.flashOn
    });
    if (this.state.flashOn === false) {
      url += '1';
    } else {
      url += '0';
    }

    fetch(url)
    .catch((err) => console.log('Failed setting LED state'));
  }

  render() {
    let icon;

    if (this.state.flashOn === true) {
      icon = (<FontAwesomeIcon icon={faLightbulb} style={{ color: 'white', fontSize: '1em'}} />);
    } else {
      icon = (<FontAwesomeIcon icon={faLightbulb} style={{ color: 'black', fontSize: '1em'}} />);
    }

    return (
      <Grid style={ styles.container }>
        <ButtonGroup >
          <Button style={styles.button} bsSize="small" bsStyle="success" onClick={this.startStream}>Start</Button>
          <Button style={styles.button} bsSize="small" bsStyle="danger" onClick={this.stopStream}>Stop</Button>
          <Button style={styles.button} bsSize="small" bsStyle="primary" onClick={this.captureStill}>Screenshot</Button>
          <Button style={{...styles.button, ...{ paddingLeft: 10, paddingRight: 10}}} bsSize="small" bsStyle="danger" onClick={this.toggleLed}>{icon}</Button>
        </ButtonGroup>
        <img style = {styles.image} src={this.state.imgSrc} alt="" />
      </Grid>
    );
  }
}
