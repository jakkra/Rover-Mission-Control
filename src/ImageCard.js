import React from 'react';
import PropTypes from 'prop-types';

import { Button, ButtonGroup, Col, Row, Grid } from 'react-bootstrap';

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
    ipAddress: PropTypes.string,
    isConnected: PropTypes.bool.isRequired,
  };

  static defaultProps = {
    ipAddress: 'http://192.168.4.10:81/stream'
  };

  componentDidMount() {

  }


  render() {
    let imgSrc;
    if (this.props.isConnected) {
      imgSrc = this.props.ipAddress;
      console.log('connected', this.props.ipAddress)
    } else {
      imgSrc = 'https://mars.nasa.gov/system/news_items/main_images/8442_PIA23240-16.jpg';
    }
    return (
      <Grid style={ styles.container }>
        <img resizeMode={'fill'} style = {styles.image} src={imgSrc} alt="" />


        <ButtonGroup >
          <Button style={styles.button} bsStyle="success">Start stream</Button>
          <Button style={styles.button} bsStyle="primary">Take screenshot</Button>
          <Button style={styles.button} bsStyle="danger">Something</Button>
        </ButtonGroup>
      </Grid>
    );
  }
}
