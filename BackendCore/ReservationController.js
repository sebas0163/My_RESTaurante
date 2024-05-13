const {PubSubIface} = require('../common/PubSub');


class ReservationIface extends PubSubIface{
  constructor(topic_name='reservation', projectId='silken-tenure-419721'){
    super(topic_name, projectId);
  }

  async setupTopics(topics) {
    await super.setupTopics(topics);
    await this.create_upstream_sub();
  }

  async create_upstream_sub() {
    this.upstream_sub = await this.getSubscriptionByName(this.upstream_topic, this.upstream_sub_name);
    this.subs.push(this.upstream_sub);
    console.log("Created the upstream sub");
  }

  waitForResponseOnUpstream() {
    return new Promise(async (resolve, reject) => {
      const responseListener = async (response) => {
        response.ack();
        resolve(response);
      }

      const errorListener = async (response) => {
        response.ack();
        reject(response);
      }

      this.upstream_sub.on('message', responseListener);
      this.upstream_sub.on('error', errorListener);
    })
  }


  async getReservationResponse(message) {
      
    this.downstream_topic.publishMessage({data:Buffer.from(JSON.stringify(message))});
    const upstream_res = await this.waitForResponseOnUpstream();
    console.log("Got upstream res");
    return JSON.parse(upstream_res.data.toString());
  }


}

class ReservationController{
  constructor() {
      this.reservation_interface = new ReservationIface();
      this.createReservation = this.createReservation.bind(this);
      this.deleteReservation = this.deleteReservation.bind(this);
      this.getAllReservations = this.getAllReservations.bind(this);
      this.getReservationById = this.getReservationById.bind(this);
    }
  createReservation(req, res){
    const people = req.body.people;
    const time = req.body.timeid;
    const user = req.body.userid;
    const reserv_obj = {'message_code':2,
      'people' : people,
      'timeid' : time,
      'userid': user
    }
    this.reservation_interface.getReservationResponse(reserv_obj).then((reserv_res) => {
      res.status(reserv_res.status).json(reserv_res.data);
    });
  }
  getAllReservations(req, res){
    const reserv_obj = {"message_code": 0}
    this.reservation_interface.getReservationResponse(reserv_obj).then((reserv_res) => {
      res.status(reserv_res.status).json(reserv_res.data);
    });
  }
  deleteReservation(req, res){
    const res_id = req.body.id
    console.log(req.body.id);
    const reserv_obj = {"message_code": 1,
      "id": res_id
    }
    this.reservation_interface.getReservationResponse(reserv_obj).then((reserv_res) => {
        res.status(reserv_res.status).json(reserv_res.data);
    });
  }
  getReservationById(req, res){
      const res_id = req.body.id
      const reserv_obj = {"message_code": 3,
        "id": res_id
      }
      this.reservation_interface.getReservationResponse(reserv_obj).then((reserv_res) => {
        res.status(reserv_res.status).json(reserv_res.data);
      });
  }

}

module.exports = { ReservationController };