import React, {Component} from 'react';
import { Col, Row } from 'react-bootstrap';
import RGL, { WidthProvider } from "react-grid-layout";
import {
  LineChart, Line, Label, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';

import config from './config';
import Toolbar from './Toolbar';
import ImageCard from './ImageCard';
import StatusCard from './StatusCard';

const lineColors = ['#8884d8', '#82ca9d', '#CCCC00'];

const ReactGridLayout = WidthProvider(RGL);

const styles = {
  gridCard: {
    backgroundColor: '#292929',
    borderRadius: 10
  }
}

export default class CoreView extends Component {
  constructor() {
    super();

    this.state = {
      wsOpen: false,
      wsClosing: false,
      wsConnecting: false,
      data: []
    };

    this.ip = config.defaultRoverIp;
    this.connect = this.connect.bind(this);
    this.connectDisconnectClicked = this.connectDisconnectClicked.bind(this);
    this.renderGraph = this.renderGraph.bind(this);
  }

  connect(wsUrl) {
    this.ws = new WebSocket(wsUrl);
    this.ws.binaryType = 'arraybuffer';

    if (this.state.wsClosing || this.state.wsOpen) {
      console.error('ws is in closing or closed state');
      return;
    }

    this.setState({
      wsConnecting: true,
      wsClosing: false,
    });

    this.ws.onopen = () => {
      console.log('WebSocket open');
      this.setState({
        wsOpen: true,
        wsConnecting: false,
        wsClosing: false,
      });
      this.ws.send("CONNECT");
    };

    this.ws.onclose = () => {
      console.log('WebSocket close');
      this.setState({
        wsOpen: false,
        wsConnecting: false,
        wsClosing: false,
      });    
    };

    this.ws.onerror = (evt) => {
      console.log(evt);
      this.setState({
        wsOpen: false,
        wsConnecting: false,
        wsClosing: false
      });
    };

    this.ws.onmessage = (evt) => {
      // We expect 13 float values.
      if (evt.data.byteLength !== (13 * 4)) {
        console.log(evt);
        //console.log('Unexpected WS Bin length', evt.data.byteLength);
        return;
      };
      
      const values = new Float32Array(evt.data);
      const data = {
        temp: values[0],
        accX: values[1],
        accY: values[2],
        accZ: values[3],
        gyroX: values[4],
        gyroY: values[5],
        gyroZ: values[6],
        gyroAngleX: values[7],
        gyroAngleY: values[8],
        gyroAngleZ: values[9],
        angleX: values[10],
        angleY: values[11],
        angleZ: values[12],
        dateTime: new Date(),
        size: evt.data.byteLength
      };

      console.log(data);
      this.setState({
        data: [...this.state.data, data].filter(this.removeOldData)
      });
    };
  }

  removeOldData(data) {
    const now = new Date();
    return data.dateTime > new Date(now.getTime() - 10 * 1000);
  }

  connectDisconnectClicked(ipAddress) {
    if (this.state.wsOpen) {
      this.setState({
        wsClosing: true,
      });
      this.ws.close();
    } else {
      this.connect(ipAddress);
    }
  }

  renderGraph(gridKey, title, dataKeys) {
    return (
      <div key={gridKey} style={ styles.gridCard }>
        <ResponsiveContainer>
          <LineChart 
            data={this.state.data}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis tick={false} >
              <Label value={title} offset={0} style={{fill: 'green', fontSize: '1.4em'}} position="insideLeft" />
            </XAxis>
            <YAxis axisLine={false} tickLine={false} />
            <Tooltip />
            {dataKeys.map((dataKey, i) => {
              return <Line key={dataKey} type="monotone" dataKey={dataKey} stroke={lineColors[i % lineColors.length]} fill={lineColors[i % lineColors.length]} />
            })}
          </LineChart >
        </ResponsiveContainer>

      </div>
    );
  }

  generateLayout() {
    return  [
      {i: 'status', x: 0, y: 0, w: 4, h: 1},
      {i: 'g0', x: 4, y: 0, w: 4, h: 1},
      {i: 'g1', x: 8, y: 0, w: 4, h: 1},
      {i: 'g2', x: 0, y: 4, w: 4, h: 1},
      {i: 'g3', x: 4, y: 8, w: 4, h: 1},
      {i: 'g4', x: 8, y: 8, w: 2, h: 1},
      {i: 'g5', x: 10, y: 8, w: 2, h: 1},
    ];
  }

  render() {
    return (
      <div className="drawArea" ref="drawArea" >
        <Col className="Container">
        <ReactGridLayout
          layout={this.generateLayout()}
          onLayoutChange={this.onLayoutChange}
          {...this.props}
        >
          <div key={'status'} style={ styles.gridCard }>
            <StatusCard latestData={this.state.data} />
          </div>

          {this.renderGraph('g0', 'Gyro', ['gyroX', 'gyroY', 'gyroZ'])}
          <div key={'g1'} style={ styles.gridCard }>
            <ImageCard isConnected={this.state.wsOpen} />
          </div>
          {this.renderGraph('g2', 'Acc', ['accX', 'accY', 'accZ'])}
          {this.renderGraph('g3', 'Angle', ['angleX', 'angleY', 'angleZ'])}
          {this.renderGraph('g4', 'GyroAngle', ['gyroAngleX', 'gyroAngleY', 'gyroAngleZ'])}
          {this.renderGraph('g5', 'Temperature', ['temp'])}
        </ReactGridLayout>
          <Row xs={2}>
            <Toolbar
              defaultIpAddress={this.ip}
              isConnected={this.state.wsOpen}
              isConnecting={this.state.wsConnecting}
              onConnectDisconnect={this.connectDisconnectClicked}
              />
          </Row>
        </Col>
      </div>
    );
  }
}


