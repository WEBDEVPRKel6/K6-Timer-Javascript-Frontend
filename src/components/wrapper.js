import './stopwatchList.js';

class Wrapper extends HTMLElement {
  connectedCallback () {
    this.render()
  }

  render() {
    this.innerHTML =`
    <stopwatch-list></stopwatch-list>
    `
  }
}

customElements.define('content-wrapper', Wrapper);