export default class Vec2 {
  public x = 0;
  public y = 0;
  public z = 0;

  constructor(x?: number, y?: number, z?: number) {
    this.x = x ?? 0;
    this.y = y ?? x;
    this.z = z ?? y;
  }

  magnitude(): number {
    return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
  }

  normalized(): Vec2 {
    return this.divide(this.magnitude());
  }

  distance(v: Vec2): number {
    return this.sub(v).magnitude();
  }

  inverse(): Vec2 {
    return this.multiply(-1);
  }

  add(v: Vec2): Vec2 {
    return new Vec2(this.x + v.x, this.y + v.y, this.z + v.z);
  }

  sub(v: Vec2): Vec2 {
    return new Vec2(this.x - v.x, this.y - v.y, this.z - v.z);
  }

  divide(div: number): Vec2 {
    return new Vec2(this.x / div, this.y / div, this.z / div);
  }

  multiply(mult: number): Vec2 {
    return new Vec2(this.x * mult, this.y * mult, this.z * mult);
  }
}
