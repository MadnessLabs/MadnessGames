import { Component } from '@stencil/core';

@Component({
  tag: 'app-home',
  styleUrl: 'app-home.css'
})
export class AppHome {


  componentDidLoad() {
    
  }

  render() {
    return [
      <ion-header>
        <ion-toolbar color="primary">
          <ion-title>Home</ion-title>
        </ion-toolbar>
      </ion-header>,

      <ion-content>
        <div class='game'>
          <div id='home'>
            <canvas id='mycanvas' width='350' height='350'>
            </canvas>
          </div>
          <p>Press start and eat the pizza!</p>
          <button id='btn'>START</button>
        </div>
      </ion-content>
    ];
  }
}
