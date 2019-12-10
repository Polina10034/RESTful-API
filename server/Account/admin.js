const { EventEmitter } = require('events');
const eventConfig = require('./config');

class Account 
{
   constructor(type, id, date, num_of_Tickets, name ){
    this.type = type;
       this.id = id;
       this.date = date;
       this.numTickets = num_of_Tickets;
       this.name = name;
       }

       set_type(newtype){
        this.type = newtype;
    }
       
       set_moment(newDate){
           this.date = newDate;
       }

       set_numOfTikt(newNum){
           this.numTickets = newNum;
       }

       set_name(name){
           this.name = name;
       }

       set_id(newId){
           this.id = newId;
       }

       get_moment(){
           return this.date;
       }

       get_numOfTikt(){
           return this.numOfTikt;
       }

       get_name(){
           return this.name;
       }

       get_id(){
           return this.id;
       }
   
}

class Admin extends Account {
 
   constructor(type, id, date, num_of_Tickets, name ){
       super(type, id, date, num_of_Tickets, name );
    }

   showAllInvites(){
       this.emit(eventConfig.getAll)

   }
   
   resetAllInvites(){
       this.emit(eventConfig.reset)
   }

   printLogs(){
       this.emit(eventConfig.getLogs)

   }
}
module.exports = {
    Account,
    Admin
};





