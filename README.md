## Wamp socket connection

Socket-connection-wamp provides class to create connection by wamp protocol. It implements Proxy interface from https://github.com/sschegolev/socket-connection.

### Installing
    yarn add socket-connection-wamp
    npm -i socket-connection-wamp

### Usage

    import {WampConnection} from 'socket-connection-wamp';
    import {IConnectionOptions} from 'autobahn';

    const options: IConnectionOptions = {};
    const wampProxy = new WampConnection(options);

### Methods

#### connect
Create wamp connection using options passed to constructor

#### close
Close wamp connection

#### isConnected
Return boolean whether connection is opened or closed

#### send
Calls private methods depends on passed type.