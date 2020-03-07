import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import {Col, Row, Grid } from 'react-bootstrap';

const styles = {
  container: {
    textAlign: 'left',
    maxWidth: '100%',
    maxHeight: '100%',
  },
  header: {
    color: 'white',
    fontSize: '1.2em',
    fontWeight: 'bold',
  },
  dateTime: {
    color: 'white'
  }
};

export default class StatusCard extends React.Component {
  static propTypes = {
    latestData: PropTypes.array,
  };

  static defaultProps = {
  };

  constructor(props) {
    super(props);

    this.state = {
      startDateTime: moment(),
      currentTime: new Date()
    };

  }

  componentDidMount() {
    setInterval(() => this.setState({ currentDate: new Date() }), 1000);
  }

  renderComms(data) {
    return data.slice(Math.max(data.length - 4, 1)).map((log, i) => (
      <Row key={log.dateTime + i} style={styles.dateTime}>
        <Col md={12}>
          {`${moment(log.dateTime).format('YYYY-MM-DD HH:mm:ss.SSS')} ${log.size} bytes`}
        </Col>
      </Row>
    ));
  }

  render() {
    let now = moment();
    let currentTime = now.format('ll LTS');
    const ms = moment(now, "DD/MM/YYYY HH:mm:ss").diff(moment(this.state.startDateTime, "DD/MM/YYYY HH:mm:ss"));
    const d = moment.duration(ms);
    const timeSinceStart = Math.floor(d.asHours()) + moment.utc(ms).format(":mm:ss");
    return (
      <Grid style={ styles.container }>
        <Row style={styles.header}>
          <Col md={6}>
            Current time
          </Col>
          <Col md={6}>
            Elapsed Time
          </Col>
        </Row>
        <Row style={ styles.dateTime }>
          <Col md={6}>
            {currentTime}
          </Col>
          <Col md={6}>
            {timeSinceStart}
          </Col>
        </Row>
        <Row style={styles.header}>
          <Col md={6}>
            {this.props.latestData.length > 0 ? 'Comms' : ''}
          </Col>
          <Col md={6}>
            {"N/A"}
          </Col>
        </Row>
        <Row>
        <Col md={6}>
          {this.renderComms(this.props.latestData)}
        </Col>
        <Col md={6}>
          N/A
        </Col>
        </Row>
      </Grid>
    );
  }
}
