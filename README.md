## Wamp socket connection

Subzero-wamp provides class to create connection by wamp protocol. It implements Proxy interface from https://github.com/sschegolev/socket-connection.

### Installing
    yarn add @lykkex/subzero-wamp
    npm -i @lykkex/subzero-wamp

### Usage

    import {WampConnection} from '@lykkex/subzero-wamp';
    import {IConnectionOptions} from 'autobahn';

    const options: IConnectionOptions = {};
    const wampProxy = new WampConnection(options);

### Methods

#### connect
Creates wamp connection using options passed to constructor

#### close
Closes wamp connection

#### isConnected
Returns boolean whether connection is opened or closed

#### send
Calls private methods depends on passed type.
