import React from 'react';
import PropTypes from 'prop-types';

import { Col, Row, Button, FormControl, Panel} from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlay, faStop, faSpinner, faGamepad } from '@fortawesome/free-solid-svg-icons'

const styles = {
  container: {
    position: 'fixed',
    bottom: 0,
    left: 0,
    width: '100%',
    padding: '5px 0',
    borderTop: '1px solid #777E87',
    background: '#424242',
    color: '#777E87',
    boxShadow: '0px 0px 5px 0px rgba(25, 25, 25, 0.75)',
    textAlign: 'left',
    margin: 0
  },
  toolbarColumn: {
    borderColor: 'yellow',
    borderWidth: 5,
    borderRadius: 2,
  },
  toolbarRow: {
    paddingTop: 3,
  },
  toolbarIcon: {
    color: 'white',
    fontSize: '1em',
  },
  colorPickerButton: {
    boxShadow: '0 0 0 1px rgba(0,0,0,.1)',
    borderRadius: '5px',
  },
  popover: {
    position: 'absolute',
    bottom: 50,
    right: 0,
    zIndex: '9999',
  },
  cover: {
    position: 'fixed',
    top: '0px',
    right: '0px',
    bottom: '0px',
    left: '0px',
  },
};

export default class Toolbar extends React.Component {
  static propTypes = {
    defaultIpAddress: PropTypes.string,
    isConnected: PropTypes.bool.isRequired,
    isConnecting: PropTypes.bool.isRequired,
    onConnectDisconnect: PropTypes.func,
  };

  static defaultProps = {
    defaultIpAddress: '192.168.4.1:81'
  };

  constructor(props) {
    super(props);

    this.state = {
      ipAddress: this.props.defaultIpAddress,
    }

    this.handleChange = this.handleChange.bind(this);
    this.handleUrlChange = this.handleUrlChange.bind(this);
  }

  componentDidMount() {
  }

  handleChange(e) {
    this.setState({ ipAddress: e.target.value });
  }

  handleUrlChange(e) {
    this.setState({ imageUrl: e.target.value });
  }

  renderConnectButton() {
    let icon = null;
    const buttonStyle = this.props.isConnected ? "danger" : "success";

    if (this.props.isConnecting) {
      icon = (<FontAwesomeIcon icon={faSpinner} spin style={styles.toolbarIcon} />);
    } else if (this.props.isConnected) {
      icon = (<FontAwesomeIcon icon={faStop} style={styles.toolbarIcon} />);
    } else {
      icon = (<FontAwesomeIcon icon={faPlay} style={styles.toolbarIcon} />);
    }

    return (
      <Button
        bsStyle={ buttonStyle }
        onClick={() => this.props.onConnectDisconnect(this.state.ipAddress)}
        >
        {icon}
      </Button>
    );
  }
  render() {

    return (
      <Panel style={{...styles.container}}>
        <Col mdHidden styles={styles.toolbarColumn} md={12} >
          <Row xs={12}>
            <Col xs={2}>
              {this.renderConnectButton()}
            </Col>
            <Col xs={3}>
              <FormControl
                type="text"
                value={this.state.ipAddress}
                placeholder="Enter IP Address"
                onChange={this.handleChange}
                disabled={this.props.isConnected}
              />
            </Col>
            <Col xs={3}>
              <Button
                bsStyle='primary'
                onClick={this.props.onModeSwitch}
                >
                <FontAwesomeIcon icon={faGamepad} style={styles.toolbarIcon} />
              </Button>
            </Col>
          </Row>
        </Col>
      </Panel>
    );
  }
}
