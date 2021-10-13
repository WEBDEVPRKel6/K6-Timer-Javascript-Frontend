import http from "../../http";

class StopwatchDataList {
  constructor() {
    if (!this.data) {
      this.data = [];
    }
  }

  getData() {
    return this.data;
  }
}

export default StopwatchDataList;
