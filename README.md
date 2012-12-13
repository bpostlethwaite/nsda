# Node Seismic Data Aquisition

A set of node.js services which may be run on separate processes across the network. Uses [Substack's DNode](https://github.com/substack/dnode) project to pass data between services and client. A serviceStack system handles the addition of new services in an event-based [Connect](https://github.com/senchalabs/connect) like stack so long as the basic data transport API is followed.
