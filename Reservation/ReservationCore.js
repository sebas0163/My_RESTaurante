const { DatabaseController } = require('../common/DatabaseController');
const {PubSubIface} = require('../common/PubSub');

class ReservationIface extends PubSubIface {
    constructor(
      downstream_callback, topic_name='reservation', projectId = 'silken-tenure-419721'
    ) {
      super(topic_name, projectId);
      this.downstream_callback = downstream_callback;
    }
  
    async setupTopics(topics) {
      await super.setupTopics(topics);
      this.downstream_sub = await this.getSubscriptionByName(this.downstream_topic, this.downstream_sub_name);
      this.subs.push(this.downstream_sub);
  
      this.subscribe_to_downstream(this.downstream_callback);
    }
  
    subscribe_to_downstream(callback) {
      this.downstream_sub.on('message', message => callback(message));
    }
  
  }
class Reservation {
    constructor() {
        this.databaseController = new DatabaseController();
        this.ReservationIface = new ReservationIface(this.askForReservationResponse);
    }
    
    askForReservationResponse = async (message) => {
        console.log("PubSub triggered - receiving: ", message.data.toString());
        message.ack();
        const json_reserv = JSON.parse(message.data.toString());
        const message_code =json_reserv.message_code;
        var jsonString = "response not found";
        if(message_code == 0){
            const all_reservations = await this.getAllRerservation();
            jsonString = JSON.stringify(all_reservations);
        }
        if(message_code == 1){
            const delete_response = await this.deleteReservation(json_reserv.id);
            jsonString = JSON.stringify(delete_response);
        }
        if(message_code == 2){
            const create_response = await this.createReservation(json_reserv.userid, json_reserv.timeid, json_reserv.people)
            jsonString = JSON.stringify(create_response);
        }
        if(message_code == 3){
            const reservation_ = await this.getReservationById(json_reserv.id);
            jsonString = JSON.stringify(reservation_);
        }
        if(message_code == 4){
            const reserv_ = await this.getReservationByEmail(json_reserv.email);
            jsonString = JSON.stringify(reserv_);
        }
        console.log("PubSub triggered - sending: ", jsonString);
        await this.ReservationIface.upstream_topic.publishMessage({data:Buffer.from(jsonString)});
    }

    async getAllRerservation(){
        const resp = await this.databaseController.getAllReservations();
        return {
            'status': 202,
            'data': resp
        }
    }

    async getReservationById(id){
        const resp =await this.databaseController.getReservationByID(id);
        if (resp ===1){
            return {
                'status': 401,
                'data': 'Reservacion no encontrada'
            }
        }else{
            return{
                'status': 202,
                'data': resp
            }
        }
    }
    async deleteReservation(id){
        const resp = await this.databaseController.deleteReservation(id);
        if (resp != 1){
            return{
                'status': 202,
                'data': resp
            }
        }else{
            return {
                'status': 401,
                'data': 'Reservacion no encontrada'
            }
        }
    }
    async createReservation(userid, timeid, people){
        const resp =await this.databaseController.createNewRervation(userid, timeid, people);
        if (!resp){
            return {
                'status': 401,
                'data': 'Error al crear la reservacion'
            }
        }else if(resp ==1){
            return {
                'status': 401,
                'data': 'La fecha seleccionada no esta disponible'
            }
        }else if(resp == 2){
            return {
                'status': 401,
                'data': 'Usuario no encontrado'
            }
        }else{
            return{
                'status': 202,
                'data': resp
            }
        }
    }
    async getReservationByEmail(email){
        const resp = await this.databaseController.getReservationByEmail(email);
        if(resp ==1){
            return{
                'status':404,
                'data': 'Email no asociado a ningun usuario'
            }
        }else{
            return {
                'status': 202,
                'data': resp
            }
        }
    }
    

}

reservationinstance= new Reservation();
module.exports = { Reservation }