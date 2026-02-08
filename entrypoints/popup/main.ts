import { App } from './App';
import './style.css';

const root = document.getElementById('app');
if (root) {
  const app = new App(root);
  app.init();
}
