class StopwatchDataList {
  constructor() {
    this.data = localStorage.getItem('stopwatchData');
    this.activeId = localStorage.getItem('activeId');
    this.data = JSON.parse(this.data);
    if (!this.data) {
      this.data = [];
    }
  }

  addData(value) {
    this.data.push(value);
    localStorage.setItem('stopwatchData', JSON.stringify(this.data));
  }

  setData(id, value) {
    this.data[id] = value;
    localStorage.setItem('stopwatchData', JSON.stringify(this.data));
  }

  getData() {
    return this.data;
  }
}

export default StopwatchDataList;