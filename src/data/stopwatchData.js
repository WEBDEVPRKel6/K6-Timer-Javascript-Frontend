import axios from "axios";

class StopwatchDataList {
  constructor() {
    if (!this.data) {
      this.data = [];
    }
  }

  async loadData(){
    const stopwatchData = await axios.get("http://localhost:3000/stopwatch");
    this.data = stopwatchData.data;
  }

  addData(value) {
    // this.data.push(value);
    // localStorage.setItem("stopwatchData", JSON.stringify(this.data));
    console.log(`ADD VALUE ${value}`);
    axios.post(`http://localhost:3000/stopwatch`, value);
  }

  getData() {
    return this.data;
  }
}

export default StopwatchDataList;
