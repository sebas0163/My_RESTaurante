const { DatabaseController } = require("./DatabaseController");

class TimeCore {
  constructor() {
    this.databaseController = new DatabaseController();
    
  }

  async process_message  (json_reserv) {
    try{
      const message_code = json_reserv.message_code;
      var jsonString = JSON.stringify({'status': 202,
        'data': ":o"});
      if (message_code == 0) {
        const all_times = await this.getSchedule();
        jsonString = JSON.stringify(all_times);
      }
      if (message_code == 1) {
        const occupy = await this.getScheduleByLocal(json_reserv.local);
        jsonString = JSON.stringify(occupy);
      }
      console.log(" - sending: ",jsonString);
      return jsonString}
      catch(error){
        return {'status': 500,
          'data': error}
      }
  }
  async getSchedule(){
    const resp = await this.databaseController.get_available_schedule();
    return {
      status: 202,
      data: resp,
    };
  }
  async getScheduleByLocal(local){
    const resp = await this.databaseController.getScheduleByLocal(local);
    if (resp == 1) {
      return {
        status: 404,
        data: "No hay tiempos con ese local ",
      };
    }else {
      return {
        status: 202,
        data: resp,
      };
    }
  }

}

module.exports = { TimeCore };
