export default class Worker {
  public pos = { x: 0, y: 0 };

  constructor() {
    this.pos.x = Math.random() * 2 - 1;
    this.pos.y = Math.random() * 2 - 1;
  }
}
