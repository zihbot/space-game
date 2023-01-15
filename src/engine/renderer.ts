import engine from './engine';

export default abstract class Renderer {
  constructor() {}

  activate() {}
  animate() {}
  preAnimate() {}
}

export class RendererImpl extends Renderer {}
