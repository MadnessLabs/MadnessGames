import Phaser from 'phaser';

export default class Food extends Phaser.GameObjects.Image {
    /**
     * Total number of food eaten
     */
    total = 0;

    constructor(scene, x, y) {
      super(scene, x, y, 'food');
      Phaser.GameObjects.Image.call(this, scene);

      super.setTexture("food");
      super.setPosition(x * 16, y * 16);
      super.setOrigin(0);

      scene.children.add(this);
    }

    eat() {
      this.total++;
    }
  }