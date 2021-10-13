import http from '../../http'

class StopwatchDataList {
  constructor() {
    if (!this.data) {
      this.data = [];
    }
  }

  addData(value) {
    // this.data.push(value);
    // localStorage.setItem("stopwatchData", JSON.stringify(this.data));
    console.log(`ADD VALUE ${value}`);
    http.post(`/stopwatch`, value);
  }

  getData() {
    return this.data;
  }
}

export default StopwatchDataList;
