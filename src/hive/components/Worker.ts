import engine from '../../engine/engine';
import Vec2 from '../../engine/vectors/Vec2';

const CENTER_FORCE = 0.01;
const SEPARATOR_FORCE = 0.5;
const ALIGN_FORCE = 0.005;
const TOWARDS_DISTANCE = 1;
const SEAPARETE_DISTANCE = 0.1;

export default class Worker {
  public position = new Vec2(0, 0);
  private velocity = new Vec2(0, 0);
  private maxVelocity = 0.5;

  constructor() {
    this.position.x = Math.random() * 2 - 1;
    this.position.y = Math.random() * 2 - 1;
  }

  move(others: Worker[]) {
    this.position = this.position.add(
      this.velocity.multiply(engine.deltaTime * 0.001)
    );
    if (this.position.x > 1) this.position.x -= 2;
    if (this.position.x < -1) this.position.x += 2;
    if (this.position.y > 1) this.position.y -= 2;
    if (this.position.y < -1) this.position.y += 2;

    let deltaV = new Vec2(0, 0);
    others.forEach((o) => {
      if (o == this) return;

      const rel = o.position.sub(this.position);
      const distance = rel.magnitude();
      if (distance < TOWARDS_DISTANCE) {
        deltaV = deltaV.add(rel.multiply(CENTER_FORCE));
        deltaV = deltaV.add(
          o.velocity.multiply((TOWARDS_DISTANCE - distance) * ALIGN_FORCE)
        );
      }
      if (distance < SEAPARETE_DISTANCE) {
        deltaV = deltaV.sub(
          rel.multiply((SEAPARETE_DISTANCE - distance) * SEPARATOR_FORCE)
        );
      }
    });

    this.velocity = this.velocity.add(deltaV);
    if (this.velocity.magnitude() > this.maxVelocity)
      this.velocity = this.velocity.normalized().multiply(this.maxVelocity);
  }
}
