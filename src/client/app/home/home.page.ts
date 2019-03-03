import { Component } from '@angular/core';

import * as socketCluster from 'socketcluster-client';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  constructor() {

    const socket = socketCluster.connect({ port: 8000 });

    socket.on('error', function (err) {
      console.error(err);
    });

    socket.on('connect', function () {
      console.log('Socket is connected');
    });

    socket.on('random', function (data) {
      console.log('Received "random" event with data: ' + data.number);
    });

    const sampleChannel = socket.subscribe('sample');

    sampleChannel.on('subscribeFail', function (err) {
      console.error('Failed to subscribe to the sample channel due to error: ' + err);
    });

    sampleChannel.watch(function (num) {
      console.log('Sample channel message:', num);
    });
  }
}
