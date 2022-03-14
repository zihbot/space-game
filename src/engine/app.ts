import Renderer, { RendererImpl } from "./renderer";

export default abstract class App {
  protected renderer: Renderer = new RendererImpl();

  abstract initialize(): void;

  animate(): void {
  }
}