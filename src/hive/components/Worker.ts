import engine from "../../engine/engine";

export default class Worker {
  public position = { x: 0, y: 0 };
  private velocity = { x: 0, y: 0 };
  private maxVelocity = 1;

  constructor() {
    this.position.x = Math.random() * 2 - 1;
    this.position.y = Math.random() * 2 - 1;
  }

  move(others: Worker[]) {
    this.position.x += engine.deltaTime * 0.001;

    others.forEach(o => {
      if(o == this) return;
    })

    if (this.position.x > 1) this.position.x -= 2;
    if (this.position.x < -1) this.position.x += 2;
    if (this.position.y > 1) this.position.y -= 2;
    if (this.position.y < -1) this.position.y += 2;
  }
}
