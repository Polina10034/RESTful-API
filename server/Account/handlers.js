const eventsConfig = require('./config');
const accounts = require('./account');
var Logger = require('../config/winston');

const badId = (res, id) =>{
    Logger.error(`id #${id} not found or invalid!`);
        res.writeHeader(404);
        res.write(`Not Found- id #${id} not found or invalid!`);
        res.end();

}

const getAllData = (req, res) => {
    const {id} = req.urlObj.query; 
    console.log(typeof id);
    if(!Number.isNaN(id)){
        Logger.info('/getAllData called!');
        const allAcounts = accounts.getAllAccounts(id);
        if (allAcounts){
        res.writeHeader(200);
        res.end(JSON.stringify(allAcounts)); 
        }
        else{
            res.writeHeader(404);
            res.write('Not found');
            res.end(' #User not authorized.');
        }
    }
    else{
        badId(res, id);
    }
}

const getSingleData = (req, res) => {
    const {id} = req.urlObj.query;

    if(!Number.isNaN(id)  ){

        var singleData = accounts.getAccount(id);
        if(singleData){
            Logger.info(`/getSingleData?${id} called!`);
            res.writeHeader(200);
            res.end(JSON.stringify(singleData)); 
        }else{
            badId(res, id);
        }
                            
    } else{
         badId(res, id);
       
    }
}

const appendJsonToFile = (req, res) => {
    let body = '';
    
    req.on('data', chunk => {
        body += chunk.toString();
    });
    console.log(body);

    req.on('end', () => {
        const newDataItem = JSON.parse(body);
        let strNewData = JSON.stringify(newDataItem);

        if(!(accounts.getAccount(newDataItem.id))){     //checking account not exist
           if(accounts.addNewAccount(newDataItem)) {
                let tiktsLeft= accounts.getTotalTikts();
                res.writeHeader(201);
                res.write('Created');        
                res.end(` # Successfully added: ${strNewData} Total tickets left ${tiktsLeft}`);
           }else{
            res.writeHeader(409);
            res.write('Conflict');
            res.end( ' # Tickets Sold Out');
           }
            
    }else if ((accounts.getAccount(newDataItem.id))){
        Logger.info(`#account all ready exists!`);
        res.writeHeader(409);
        res.write('Conflict');
        res.end();
    }else{
        Logger.error(`#Faild sending data`);
        res.writeHeader(404);
        res.write('Not Fund');
        res.end();
        
    }
 
    });
}
const deleteAccount = (req, res) => {
    const {id }= req.urlObj.query; 
    console.log(id);

    if(!Number.isNaN(id)){
        Logger.info('/deleteAccount called!');

        let accToDelete = accounts.getAccount(id);//checking account existes
        if (accToDelete){
            if(accounts.deleteAccount(id)){
            let tiktsLeft= accounts.getTotalTikts();
            res.writeHeader(200);
            res.end(`Account with id = ${id} was deleted. Total tickets left: ${tiktsLeft}`);
            Logger.info(`Account with id = ${id} deleted. `);
            }
            else{
                res.writeHeader(404);
                res.end(`Index with id = ${id} not found (deleted)`);
                Logger.info(`Index with id = ${id} not found (deleted)`);
            }
        }else{
            badId(res, id);
        }
    }
    else{
        badId(res, id);
        }
    
}

const updateData = (req ,res) => {
    const id = req.urlObj.query.id; 
    const num = req.urlObj.query.num;
    const name = req.urlObj.query.name;
    if(!Number.isNaN(id)){
        Logger.info('/updateData called!');
        if(accounts.updateAccount(id, num, name)){
            
            let tiktsLeft= accounts.getTotalTikts();
            res.writeHeader(200);
            res.end(`Successfuly update account #${id} Total left tickets ${tiktsLeft}`);
        }else if(((name == undefined) && ((num == undefined)))){
            Logger.info('Nothing to update.');
            res.writeHeader(200); 
            res.write('No Content');
            res.end('Data was not Changed.');

        }
        
    }else {
        badId(res, id);
        
    }



}


const resetSale = (req, res) => {
    const {id }= req.urlObj.query; 
    if(!Number.isNaN(id)){
        Logger.info('/resetSale called!');
        if(accounts.resetAcounts(id)){
            let tiktsLeft= accounts.getTotalTikts();
            res.writeHeader(200);
            res.end(`Successfuly Reset Sale. Total tickets for sale: ${tiktsLeft}.`);
        }else {
            res.writeHeader(405);
            res.write('Method Not Allowed');
            res.end(' Data was not Changed.');

        }

    }
    else{
        badId(res, id);

    }
}

const getAllLogs = (req, res) => {
    const {id} = req.urlObj.query; 
    if(!Number.isNaN(id)){
        Logger.info('/getAllLogs called!');
        const allLogs = accounts.getLogs(id); 
        if(allLogs){
            res.writeHeader(200);
            res.write('Successfuly GET all Logs.\n');
            res.end(allLogs); 

        }else {
            res.writeHeader(405);
            res.write('Method Not Allowed');
            res.end(' #User not authorized.');

        }

    }
    else{
        badId(res, id);

    }
}
        

module.exports = {
    appendJsonToFile,
    getAllData,
    getSingleData,
    deleteAccount,
    updateData,
    resetSale,
    getAllLogs
};