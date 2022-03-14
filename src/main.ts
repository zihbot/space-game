import engine from './engine/engine';
import Hive from './hive/hive';

engine.initialize(new Hive());
engine.run();