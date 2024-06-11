const { TimeCore } = require('./TimeCore');
require('dotenv').config();


class TimeEndpoint {
  constructor() {
    this.time_manager = new TimeCore();
    this.getSchedule = this.getSchedule.bind(this) ;
    this.getScheduleByLocal = this.getScheduleByLocal.bind(this) ;
    this.newTime = this.newTime.bind(this);
  }
  async newTime(req,res){
    const time = req.body.time;
    const slots = req.body.slots;
    const local = req.body.local;
    const reserv_obj = {
      message_code: 2,
      time: time,
      slots: slots,
      local: local,
    };
    const reserv_string = await this.reservation_manager.process_message(reserv_obj);
    const reserv_res = JSON.parse(reserv_string);
    res.status(reserv_res.status).json(reserv_res.data);
  }
  async getSchedule(req,res){
    const time_obj = { message_code: 0 };
    const time_string = await this.time_manager.process_message(time_obj);
    const time_res = JSON.parse(time_string);
    res.status(time_res.status).json(time_res.data);
  }
  async getScheduleByLocal(req,res){
    const local = req.query.local;
    const time_obj = { message_code: 1,
        local: local
     };
    const time_string = await this.time_manager.process_message(time_obj);
    const time_res = JSON.parse(time_string);
    res.status(time_res.status).json(time_res.data);
  }
  
}

module.exports = { TimeEndpoint };