const { DatabaseController } = require("./DatabaseController");

class ReservationCore {
  constructor() {
    this.databaseController = new DatabaseController();
    
  }

  async process_message  (json_reserv) {
    const message_code = json_reserv.message_code;
    var jsonString = JSON.stringify({'status': 202,
      'data': ":o"});
    if (message_code == 0) {
      const all_reservations = await this.getAllRerservation();
      jsonString = JSON.stringify(all_reservations);
    }
    if (message_code == 1) {
      const delete_response = await this.deleteReservation(json_reserv.id);
      jsonString = JSON.stringify(delete_response);
    }
    if (message_code == 2) {
      const create_response = await this.createReservation(
        json_reserv.userid,
        json_reserv.timeid,
        json_reserv.people,
      );
      jsonString = JSON.stringify(create_response);
    }
    if (message_code == 3) {
      const reservation_ = await this.getReservationById(json_reserv.id);
      jsonString = JSON.stringify(reservation_);
    }
    if (message_code == 4) {
      const reserv_ = await this.getReservationByEmail(json_reserv.email);
      jsonString = JSON.stringify(reserv_);
    }

    console.log(" - sending: ",jsonString);
		return jsonString
  }

  async getAllRerservation() {
    const resp = await this.databaseController.getAllReservations();
    return {
      status: 202,
      data: resp,
    };
  }

  async getReservationById(id) {
    const resp = await this.databaseController.getReservationByID(id);
    if (resp === 1) {
      return {
        status: 401,
        data: "Reservacion no encontrada",
      };
    } else {
      return {
        status: 202,
        data: resp,
      };
    }
  }
  async deleteReservation(id) {
    const resp = await this.databaseController.deleteReservation(id);
    if (resp != 1) {
      return {
        status: 202,
        data: resp,
      };
    } else {
      return {
        status: 401,
        data: "Reservacion no encontrada",
      };
    }
  }
  async createReservation(userid, timeid, people) {
    try {
      await this.databaseController.occupy_slot(timeid);
    } catch (error) {
      console.log(error);
      let error_result;
      switch(error.name) {
        case 'ReferenceError':
          error_result = {
            status: 404,
            data: "No se encontró el timeId especificado",
          };
          break;
        case 'RangeError':
          error_result = {
            status: 416,
            data: "No hay campo en el horario especificado",
          };
          break;
        default:
          console.log("Got an undefined error!");
          error_result = {
            status: 500,
            data: "Error al actualizar los campos de un ",
          };
          break;
      }
      return error_result;
    }

    const resp = await this.databaseController.createNewRervation(
      userid,
      timeid,
      people,
    );
    if (!resp) {
      return {
        status: 401,
        data: "Error al crear la reservacion",
      };
    } else if (resp == 1) {
      return {
        status: 401,
        data: "La fecha seleccionada no esta disponible",
      };
    } else if (resp == 2) {
      return {
        status: 401,
        data: "Usuario no encontrado",
      };
    } else {
      return {
        status: 202,
        data: resp,
      };
    }
  }
  async getReservationByEmail(email) {
    const resp = await this.databaseController.getReservationByEmail(email);
    if (resp == 1) {
      return {
        status: 404,
        data: "Email no asociado a ningun usuario",
      };
    } else {
      return {
        status: 202,
        data: resp,
      };
    }
  }
}



module.exports = { ReservationCore };
