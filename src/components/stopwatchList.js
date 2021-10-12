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
    this.deleteAllBtn;
    this.stopwatchList;
    this.titleForm;
  }

  async getStopwatchData() {
    const stopwatchData = await axios.get("http://localhost:3000/stopwatch");
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

    const resData = await axios.post(`http://localhost:3000/stopwatch`, data);

    newStopwatch.clockId = resData.data.response.id;
    newStopwatch.setAttribute("id", `stopwatch-${resData.data.response.id}`);
    this.stopwatchList.insertBefore(newStopwatch, this.titleForm);
    this.titleForm.value = "";
    this.stopwatchCount++;
  }

  deleteStopwatch(stopwatch) {
    var data_del = new StopwatchDataList();
    var tmp = data_del.getData();
    var idx;
    // console.log("lama");
    // console.log(data_del);
    var r = confirm("Anda yakin menghapus stopwatch : " + stopwatch._title);
    if (r == true) {
      for (var i = 0; i < tmp.length; i++) {
        if (stopwatch._clockId == tmp[i].id) {
          tmp.splice(i, 1);
          idx = i;
          break;
        }
      }
      for (idx; idx < tmp.length; idx++) {
        tmp[idx].id = tmp[idx].id - 1;
      }
      // console.log("baru");
      // console.log(tmp);
      stopwatch.handlePause();
      stopwatch.remove();
      data_del.saveData(tmp);

      axios.delete(
        `http://localhost:3000/stopwatch/delete/${stopwatch._clockId}`
      );
    } else {
      // Does Nothing
    }
  }

  deleteAllStopwatch() {
    axios.delete("http://localhost:3000/stopwatch/delete");
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
