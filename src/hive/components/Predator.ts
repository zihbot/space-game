import engine from '../../engine/engine';
import Vec2 from '../../engine/vectors/Vec2';
import Worker from './Worker';

const ATTACK_FORCE = 0.03;
const ATTACK_ALIGN_FORCE = 0.05;
const EAT_DISTANCE = 0.05;
const CENTER_DISTANCE = 1;

export default class Predator {
  public position = new Vec2(0, 0);
  public velocity = new Vec2(0, 0);
  private maxVelocity = 1.2;
  private maxVelocityChange = 0.04;

  constructor() {
    this.position.x = Math.random() * 2 - 1;
    this.position.y = Math.random() * 2 - 1;
  }

  move(prey: Worker[]) {
    this.position = this.position.add(
      this.velocity.multiply(engine.deltaTime * 0.001)
    );
    if (this.position.x > 1) this.position.x -= 2;
    if (this.position.x < -1) this.position.x += 2;
    if (this.position.y > 1) this.position.y -= 2;
    if (this.position.y < -1) this.position.y += 2;

    if (prey.length == 0) return;

    let deltaV = new Vec2(0, 0);
    let relCenterPos = new Vec2(0, 0);
    let closest = null as Worker;
    let closestDistance = Number.POSITIVE_INFINITY;
    prey.forEach((p) => {
      const dist = this.position.distance(p.position);
      if (dist < closestDistance) {
        closestDistance = dist;
        closest = p;
      }
      if (dist < CENTER_DISTANCE) {
        relCenterPos = relCenterPos.add(p.position.sub(this.position));
      }
    });

    if (closest && relCenterPos.distance(closest.position.sub(this.position)) > 0.3) {
        deltaV = deltaV.add(
          closest.position.sub(this.position).normalized().multiply(ATTACK_FORCE)
        );
        deltaV = deltaV.add(closest.velocity.multiply(ATTACK_ALIGN_FORCE));
    } else {
        deltaV = deltaV.add(relCenterPos.multiply(ATTACK_ALIGN_FORCE));
    }

    if (deltaV.magnitude() > this.maxVelocityChange)
      deltaV = deltaV.normalized().multiply(this.maxVelocityChange);
    this.velocity = this.velocity.add(deltaV);
    if (this.velocity.magnitude() > this.maxVelocity)
      this.velocity = this.velocity.normalized().multiply(this.maxVelocity);
  }

  eat(prey: Worker[]): Worker[] {
    return prey.filter(
      (p) => this.position.distance(p.position) > EAT_DISTANCE
    );
  }
}
