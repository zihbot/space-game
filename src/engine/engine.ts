import './style.css';
import App from "./app";
import Canvas from "./canvas";

class Engine {
  private app?: App;
  private context: WebGL2RenderingContext;
  private canvas: HTMLCanvasElement;
  private previousTime = 0;

  constructor() {
    const appElem = document.querySelector<HTMLDivElement>('#app')!
    this.canvas = document.createElement('canvas');
    this.canvas.height = 500;
    this.canvas.width = 500;
    appElem.appendChild(this.canvas);

    const context = this.canvas.getContext('webgl2');
    if (!context) {
      console.error('Cannot initialize context', this.canvas);
      throw new Error('Cannot initialize context');
    }
    this.context = context;
  }

  initialize(app: App) {
    this.app = app;
    if (!this.app) { throw new NoAppError(); }

    if (app.initialize) {
      app.initialize();
    }
  }

  run() {
    this.animate();
  }

  animate() {
    const width = this.canvas.width ?? 1;
    const height = this.canvas.height ?? 1;
    const aspectRatio = width / height;

    this.app?.preAnimate();

    this.context.viewport(0, 0, width, height);
    this.context.clearColor(0.8, 0.9, 1.0, 1.0);
    this.context.clear(this.context.COLOR_BUFFER_BIT);

    this.app?.animate();

    window.requestAnimationFrame((currentTime) => {
      this.previousTime = currentTime;
      this.animate();
    });
  }

  getContext(): WebGL2RenderingContext {
    return this.context;
  }
}

export default new Engine();

export class NoAppError extends Error {
  constructor() {
    super("No App initialized. Use engine.initialize()");
  }
}