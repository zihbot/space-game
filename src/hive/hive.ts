import App from "../engine/app";
import HiveRenderer from "./renderer";

export default class Hive extends App {
  initialize(): void {
    this.renderer = new HiveRenderer();
    this.renderer.activate();
  }

}