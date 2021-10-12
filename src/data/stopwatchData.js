import http from '../../http'

class StopwatchDataList{

  constructor() {
    http
      .get("/stopwatch")
      .then((response) => {
        console.log(JSON.stringify(response.data));
        this.data = response.data;
      })
      .catch(function (error) {
        console.log(error);
      });

      if(!this.data) {
        this.data = [];
      }
                    
      
  }

  addData(value) {
    // this.data.push(value);
    // localStorage.setItem('stopwatchData', JSON.stringify(this.data));

    const newStopwatch = {
      title: value.title,
      time: value.time,
      date: new Date(),
      running : value.running
    };

    http
      .post("/stopwatch", newStopwatch)
      .then((res) => console.log(res.data));

  }

  setData(id, value) {
    // this.data[id] = value;
    // localStorage.setItem('stopwatchData', JSON.stringify(this.data));

    const newData = {
      title: value.title,
      time: value.time,
      date: new Date(),
      running : value.running
    };

    http
      .put("/stopwatch/" + id, newData)
      .then((res) => console.log(res.data));

  }

  getData() {
    return this.data;
     
  }

  deleteData(id){
    http
      .delete("/stopwatch/" + id)
      .then((res) => console.log(res.data));
  }

  // initiateData(){
  //   http
  //     .get("/stopwatch")
  //     .then((response) => {
  //       this.data = response.data;
  //       // console.log(this.getData());
  //     })
  //     .catch(function (error) {
  //       console.log(error);
  //     });
    
  //     return true;
  // }
}

export default StopwatchDataList;