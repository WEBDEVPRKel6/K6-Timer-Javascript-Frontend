import "./stopwatch.js";
import StopwatchDataList from "../data/stopwatchData.js";
import http from "../../http";

class StopwatchList extends HTMLElement {
  constructor() {
    super();
    this.data = new StopwatchDataList();
    this.stopwatchCount = this.data.getData().length;
    StopwatchList.stopwatchIds = this.data
      .getData()
      .map((stopwatch) => stopwatch.id);
    this.addBtn;
    this.deleteAllBtn;
    this.stopwatchList;
    this.titleForm;
  }

  async getStopwatchData() {
    const stopwatchData = await http.get("/stopwatch");
    this.data = stopwatchData.data;
    this.render();
  }

  async connectedCallback() {
    await this.getStopwatchData();
  }

  async addStopwatch() {
    const newStopwatch = document.createElement("stop-watch");
    newStopwatch.title = this.titleForm.value || "Untitled";
    newStopwatch.handleDelete = this.deleteStopwatch;
    newStopwatch.handleNonParallel = this.handleNonParallel;
    StopwatchList.stopwatchIds.push(this.stopwatchCount);
    // newStopwatch.stopwatchData = this.data;

    let data = {
      title: this.titleForm.value || "Untitled",
      time: 0,
      running: false,
      date: new Date(),
    };

    const resData = await http.post(`/stopwatch`, data);

    newStopwatch.clockId = resData.data.response.id;
    newStopwatch.setAttribute("id", `stopwatch-${resData.data.response.id}`);
    this.stopwatchList.insertBefore(newStopwatch, this.titleForm);
    this.titleForm.value = "";
    this.stopwatchCount++;
  }

  deleteStopwatch(stopwatch) {
    var r = confirm("Anda yakin menghapus stopwatch : " + stopwatch._title);
    if (r == true) {
      stopwatch.handlePause();
      stopwatch.remove();

      http.delete(`/stopwatch/delete/${stopwatch._clockId}`);
    } else {
      // Does Nothing
    }
  }

  deleteAllStopwatch() {
    for (let i = 0; i < this.data.length; i++) {
      let stopwatch = document.getElementById(`stopwatch-${this.data[i].id}`);
      stopwatch.remove();
    }

    http.delete("stopwatch/delete");
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
    <div class="align-center">
      <button id="deleteall-btn" class="button deleteall-btn">
        Delete All
      </button>
    </div>
    <div class='stopwatch-list-container'>
      <input type="text" name="title" id="stopwatch-title-form" class="align-center" placeholder='Nama Tugas e.g. WebDev Praktek'/>
      <button id='addStopwatch-btn' class='bg-green'>Add new</button>
    </div>
    `;

    this.titleForm = this.querySelector("#stopwatch-title-form");
    this.stopwatchList = this.querySelector(".stopwatch-list-container");
    this.addBtn = this.querySelector("#addStopwatch-btn");
    this.addBtn.addEventListener("click", () => this.addStopwatch());
    this.deleteAllBtn = this.querySelector("#deleteall-btn");
    this.deleteAllBtn.addEventListener("click", () =>
      this.deleteAllStopwatch()
    );

    if (this.data.length > 0) {
      for (let i = 0; i < this.data.length; i++) {
        const newStopwatch = document.createElement("stop-watch");
        newStopwatch.setAttribute("id", `stopwatch-${this.data[i].id}`);
        newStopwatch.title = this.data[i].title;
        newStopwatch.clockId = this.data[i].id;
        newStopwatch.time = this.data[i].time;
        newStopwatch.date = this.data[i].date;
        newStopwatch.running = this.data[i].running;
        newStopwatch.handleDelete = this.deleteStopwatch;
        newStopwatch.handleNonParallel = this.handleNonParallel;
        // newStopwatch.stopwatchData = this.data[i];
        this.stopwatchList.insertBefore(newStopwatch, this.titleForm);
      }
    }
  }
}

customElements.define("stopwatch-list", StopwatchList);
