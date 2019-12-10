const EventEmmiter = require('events');
const accountsJson = require('../data.json');
const fs = require('fs');
const {Admin, Account} = require('./admin');
var Logger = require('../config/winston');


const total_tickets = 10;

//getting today's date to acces the correct log file of today in getAllLogs();
"use strict";
const today = new Date();
const year = today.getFullYear();
const month = `${today.getMonth() + 1}`.padStart(2, 0);
const day = `${today.getDate()}`.padStart(2, 0);
const stringDate = [year, month, day ].join("-");
var jsonLogs = fs.readFileSync(`./log/results.log.${stringDate}`);




class AccountRepository extends EventEmmiter{
    constructor(){
        super();
        this._account = accountsJson;
        this._logs = jsonLogs;
        this._AccountArr = [];
        this._leftikt = 0;
        for(let i = 0; this._account[i]; i++){
            
            if(this._account[i].type == "admin"){
                this._AccountArr[i] = new Admin(this._account[i].type, this._account[i].id , this._account[i].date, this._account[i].numTickets, this._account[i].name );
            }
            else{
                this._AccountArr[i] = new Account(this._account[i].type, this._account[i].id , this._account[i].date, this._account[i].numTickets, this._account[i].name );
            }

        }

        
    }

    set_logs(){
        var jsonLogs = fs.readFileSync(`./log/results.log.${stringDate}`);
        this._logs = jsonLogs;

    }

    getAccount(id){
        const index = this._AccountArr.findIndex(x => x.get_id() === id );//Finding the index
        if (index != -1){
            this.emit("singleAccount", JSON.stringify(this._AccountArr[index])); //Fire event
            return this._AccountArr[index];

        }else{
             this.emit("accountNotFound", id); //Fire event
            return 0;
        }
        
      
    }

    getAllAccounts(id){

        const index = this._AccountArr.findIndex(x => x.get_id() === id );//Finding the index
        var found = this._AccountArr.find((a) => a.get_id() === id);         //Finding the object
        if((index != -1) && (found instanceof  Admin)){
            
            this.emit("allAccounts", this._account); //Fire event
            return this._AccountArr;
        }  else{
            this.emit("unothorized", id); //Fire unothorized id
            return 0;
        }
        
    }

    deleteAccount(id){
        const index = this._AccountArr.findIndex(x => x.id == id); 
        if (index != -1) {
            this.emit("deleteAccount", this._AccountArr[index]);
            this._AccountArr.splice(index, 1);
            this.rewriteToJSON();
            return 1;
        }
        else{
            return 0;
        }
    }

    updateAccount(id, num, name){
        let ticktsleft = this.getTotalTikts();
        const index = this._AccountArr.findIndex(x => x.id == id);
        if (index != -1){
         
            if((!isNaN(name)) || (!isNaN(num))){
                if(num >= 0){
                     var addNum = parseInt(this._AccountArr[index].numTickets);

                    ticktsleft= ticktsleft + addNum;

                    if(num < ticktsleft){
                        this._AccountArr[index].numTickets = num;
                        ticktsleft -= num;
                        this._leftikt = ticktsleft;
                
                    }else{
                        this.emit("ticktSoldOut");
                    }
                }
                if(name){
                    this._AccountArr[index].name = name;
                }
                
                this.rewriteToJSON();
              
                return 1;
            }else  {
                return 0;
            }
        }else{
            this.emit("accountNotFound", id);
            return 0;
        }
    }

    addNewAccount(newDataItem){
    console.log(newDataItem);
    let leftikt = this.getTotalTikts();
    
    if(leftikt > 0 && newDataItem.numTickets <= leftikt ){
        this._AccountArr.push(new Account(newDataItem.type, newDataItem.id , newDataItem.date, newDataItem.numTickets, newDataItem.name ));
        leftikt  -=  newDataItem.numTickets;
        this.rewriteToJSON(newDataItem);
       
        return 1;
    }
    else{
        this.emit("ticktSoldOut");
        return 0;
    }
    
    }

    resetAcounts(id){
        const index = this._AccountArr.findIndex(x => x.get_id() === id );     //Finding the index
        var found = this._AccountArr.find((a) => a.get_id() === id);         //Finding the object
        if((index != -1) && (found instanceof  Admin)){
            for (let i=0 ; i< this._AccountArr.length ; i++){
                this._AccountArr[i].numTickets = "0"; 
                this._leftikt = total_tickets ;
            }
            this.emit("saleReset" );                                      
            this.rewriteToJSON(); 
            
            return 1;
        }  else{
            this.emit("unothorized", id); 
            return 0;
        }
    }

    rewriteToJSON(newDataItem){
        var jsonData = JSON.stringify(this._AccountArr, null, 2);
        fs.writeFile('./data.json', jsonData, 'utf-8', (err) => {
            if (err)        
                this.emit("faildWriting", isNaN(newDataItem) ? newDataItem:NaN);
                if(newDataItem) 
                   this.emit("addNewData",JSON.stringify(newDataItem)) ;
            this.emit("numOftiktLeft", this.getTotalTikts() );
            
        });
    }

    getTotalTikts(){
        this._leftikt = total_tickets;
        for (let i=0 ; i< this._AccountArr.length ; i++){
            this._leftikt -= this._AccountArr[i].numTickets; 
        }
        return this._leftikt;
    }
    getLogs(id){
        const index = this._AccountArr.findIndex(x => x.get_id() === id );//Finding the index
        var found = this._AccountArr.find((a) => a.get_id() === id);         //Finding the object
        if((index != -1) && (found instanceof  Admin)){
            this.set_logs();
            this.emit("getAllLogs", (this._logs)); 
            
            return (this._logs);
        }
        else{
                this.emit("unothorized", id); 
                return 0;
            }

    }
}
const accountRepo = new AccountRepository();
accountRepo.on('saleReset', () => Logger.info(`###Sale is Reset.###`));
accountRepo.on('singleAccount', data => Logger.info(`Get single account: ${data}`));
accountRepo.on('allAccounts', data  =>Logger.info(`Get all accounts: ${JSON.stringify(data)}`));
accountRepo.on('deleteAccount', data  => Logger.info(`Deleted account: ${JSON.stringify(data)}`));
accountRepo.on('unothorized', data  => Logger.info(`Account: id =${data} don't have permition.`));
accountRepo.on('accountNotFound', data  => Logger.info(`Account id =${data} not exists.`));
accountRepo.on('addNewData', data  => Logger.info(`New Account was created: ${data}.`));
accountRepo.on('faildWriting', data  => Logger.error(`Faild writing new data to file: ${data}.`));
accountRepo.on('ticktSoldOut', ()  => Logger.info('All Tickets are sold out!'));
accountRepo.on('numOftiktLeft', data  => Logger.info(`Total tickets left : ${data}`));
accountRepo.on('updateData', data  => Logger.info(`Account was update: ${data}`));
accountRepo.on('getAllLogs', data  => Logger.info(`Get all logs: ${data}`));


module.exports = accountRepo;


