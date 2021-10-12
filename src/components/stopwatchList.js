import "./stopwatch.js";
import StopwatchDataList from "../data/stopwatchData.js";
import axios from "axios";

class StopwatchList extends HTMLElement {
  constructor() {
    super();
    this.data = new StopwatchDataList();
    this.stopwatchCount = this.data.getData().length;
    StopwatchList.stopwatchIds = this.data
      .getData()
      .map((stopwatch) => stopwatch.id);
    this.addBtn;
    this.stopwatchList;
    this.titleForm;
  }

  connectedCallback() {
    this.render();
  }

  addStopwatch() {
    const newStopwatch = document.createElement("stop-watch");
    newStopwatch.title = this.titleForm.value || "Untitled";
    newStopwatch.handleDelete = this.deleteStopwatch;
    newStopwatch.handleNonParallel = this.handleNonParallel;
    newStopwatch.clockId = this.stopwatchCount;
    StopwatchList.stopwatchIds.push(this.stopwatchCount);
    newStopwatch.stopwatchData = this.data;
    this.stopwatchList.insertBefore(newStopwatch, this.titleForm);

    this.data.addData({
      id: this.stopwatchCount,
      title: this.titleForm.value || "Untitled",
      time: 0,
      running: false,
    });

    this.titleForm.value = "";
    this.stopwatchCount++;
  }

  deleteStopwatch(stopwatch) {
    // stopwatch.remove();
    axios.delete(`http://localhost:3000/delete/${stopwatch.id}`);
  }

  handleNonParallel(stopwatch) {
    console.log(StopwatchList.stopwatchIds);
    StopwatchList.stopwatchIds.forEach((id) => {
      if (stopwatch._clockId === id) return;

      document.querySelector(`#pause-btn-${id}`).click();
    });
  }

  render() {
    this.innerHTML = `
    <div class='stopwatch-list-container'>
      <input type="text" name="title" id="stopwatch-title-form" class="align-center" placeholder='Untitled'/>
      <button id='addStopwatch-btn' class='bg-green'>Add new</button>
    </div>
    `;

    this.titleForm = this.querySelector("#stopwatch-title-form");
    this.stopwatchList = this.querySelector(".stopwatch-list-container");
    this.addBtn = this.querySelector("#addStopwatch-btn");
    this.addBtn.addEventListener("click", () => this.addStopwatch());

    if (this.stopwatchCount > 0) {
      for (let i = 0; i < this.stopwatchCount; i++) {
        const newStopwatch = document.createElement("stop-watch");
        newStopwatch.title = this.data.title;
        newStopwatch.clockId = this.data.id;
        newStopwatch.time = this.data.time;
        newStopwatch.date = this.data.date;
        newStopwatch.running = this.data.running;
        newStopwatch.handleDelete = this.deleteStopwatch;
        newStopwatch.handleNonParallel = this.handleNonParallel;
        newStopwatch.stopwatchData = this.data;
        this.stopwatchList.insertBefore(newStopwatch, this.titleForm);
      }
    }
  }
}

customElements.define("stopwatch-list", StopwatchList);
