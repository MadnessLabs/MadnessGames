import { Component, Element } from '@stencil/core';

import { Snake } from '../../games/snake';

@Component({
  tag: 'app-home',
  styleUrl: 'app-home.css'
})
export class AppHome {
  @Element() homeEl: HTMLElement;
  snake: Snake;

  componentDidLoad() {
    this.snake = new Snake(this.homeEl.querySelector('#mycanvas'), this.homeEl.querySelector('#btn'));
  }

  startGame() {
    this.snake.start();
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
          <button id='btn' onClick={() => this.startGame()}>START</button>
        </div>
      </ion-content>
    ];
  }
}
