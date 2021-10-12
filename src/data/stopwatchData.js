import axios from "axios";

class StopwatchDataList {
  constructor() {
    axios
      .get("http://localhost:3000/stopwatch")
      .then((res) => {
        this.data = res.data;
        console.log(this.data);
      })
      .catch((e) => console.log(e.message));
    // this.data = localStorage.getItem("stopwatchData");
    // this.data = JSON.parse(this.data);
    if (!this.data) {
      this.data = [];
    }
  }

  addData(value) {
    this.data.push(value);
    localStorage.setItem("stopwatchData", JSON.stringify(this.data));
  }

  setData(id, value) {
    this.data[id] = value;
    localStorage.setItem("stopwatchData", JSON.stringify(this.data));
    // axios.put(`http://localhost:3000/stopwatch/update/${id}`)
  }

  getData() {
    return this.data;
  }
}

export default StopwatchDataList;
