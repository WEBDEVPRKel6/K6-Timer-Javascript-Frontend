import Time from '../util/time.js';

class Stopwatch extends HTMLElement {
  constructor() {
    super();
    this._time = 0;
    this.interval;
    this.startBtn;
    this.stopBtn;
    this.stopwatchContainer;
    this._title = 'Untitled';
    this._running = false;
  }

  set clockId(value) {
    this._clockId = value;
  }

  set title(value) {
    this._title = value;
  }

  set handleDelete(value) {
    this._handleDelete = value;
  }

  set handleNonParallel(value) {
    this._handleNonParallel = value;
  }

  set stopwatchData(value) {
    this._stopwatchData = value;
  }

  set time(value) {
    this._time = value;
  }

  set running(value) {
    this._running = value;
  }

  set date(value) {
    this._date = value;
  }

  connectedCallback() {
    this.render();
  }

  updateData() {
    this._stopwatchData.setData(this._clockId, {
      id: this._clockId,
      title: this._title,
      time: this._time,
      date: new Date(),
      running: this._running
    });
  }

  handleStart() {
    this._handleNonParallel(this);

    this.startBtn.style.display = 'none';
    this.pauseBtn.style.display = 'block';
    this._running = true;

    if (!this.interval) {
      this.interval = setInterval(() => this.handleUpdate(), 1000);
    }
  }

  handlePause() {
    this.startBtn.style.display = 'block';
    this.startBtn.innerText = 'Continue';
    this.pauseBtn.style.display = 'none';
    this._running = false;

    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }

    this.updateData();
  }

  handleUpdate() {
    this._time += 1;

    if (this._time >= 86400) {
      alert(`Stopwatch ${this._title} sudah berjalan selama 24 jam! Stopwatch akan berhenti otomatis`);
      this.handleStop();
    }

    this.querySelector('#stopwatch-value').innerText = Time.toHHMMSS(this._time);

    this.updateData();
  }

  handleStop() {
    if (this._time === 0 && !this.interval)
      return;

    if (this.pauseBtn.style.display === 'block') {
      this.pauseBtn.style.display = 'none';
      this.startBtn.style.display = 'block';
    }

    this.startBtn.innerText = 'Start';

    if(this.querySelector('#stopwatch-result')) {
      this.querySelector('#stopwatch-result').remove();
    }

    const result = document.createElement('span');
    result.setAttribute('id', 'stopwatch-result')
    this.stopwatchContainer.appendChild(result);
    result.innerText = `Timer ${this._title} sudah berjalan selama ${Time.toHHMMSS(this._time)}`;

    this._running = false;
    clearInterval(this.interval);
    this.interval = null;
    this._time = 0;
    this.querySelector('#stopwatch-value').innerText = Time.toHHMMSS(this._time);

    this.updateData();
  }

  render() {
    this.innerHTML = `
    <div id='stopwatch-container'>
      <h3 class='mb1'>${this._title}</h3>
      <div class='mb1'>
        <p id='stopwatch-value'>${Time.toHHMMSS(this._time)}</p>
      </div>
      <div class='flex space-between'>
        <button id='start-btn' class='bg-green'>Start</button>
        <button id='pause-btn-${this._clockId}' class='bg-blue pause-btn'>Pause</button>
        <button id='stop-btn' class='bg-red'>Stop</button>
        <button id='delete-btn' class='bg-red'>Delete</button>
      </div>
      </br>
    </div>
    `;

    this.stopwatchContainer = this.querySelector('#stopwatch-container'); 
    this.pauseBtn = this.querySelector(`#pause-btn-${this._clockId}`);
    this.startBtn = this.querySelector('#start-btn');
    this.stopBtn = this.querySelector('#stop-btn');
    this.deleteBtn = this.querySelector('#delete-btn');

    this.startBtn.addEventListener('click', () => this.handleStart());
    this.pauseBtn.addEventListener('click', () => this.handlePause());
    this.stopBtn.addEventListener('click', () => this.handleStop());
    this.deleteBtn.addEventListener('click', () => this._handleDelete(this));

    if (this._running) {
      const newTime = (new Date().getTime() - new Date(this._date).getTime()) / 1000;
      console.log(newTime);
      this._time = this._time + newTime;
      console.log(this._time);
      this.handleStart();
    }
  }
}

customElements.define('stop-watch', Stopwatch);