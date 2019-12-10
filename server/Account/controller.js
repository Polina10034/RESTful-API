const url = require('url');
var Logger = require('../config/winston');



const { appendJsonToFile, resetSale, getAllData, getSingleData, getAllLogs, deleteAccount, updateData } = require('./handlers');

const badReqErr = (res, path) =>{
    Logger.error(`url ${path} not exists!`);
    res.writeHeader(404);
    res.write(`Bad request - url ${path} not exists!`);
    res.end();
}

module.exports = (req, res) => {
    Logger.info(`Request ${req.method} came from ${req.url}`);
    const urlObj = url.parse(req.url, true, false);
    req.urlObj = urlObj;

    switch (req.method){
       
            case 'GET':
                if(urlObj.pathname === '/getAllData' && urlObj.query){
                    getAllData(req, res);
                    
                } else if (urlObj.pathname=== '/getSingleData' && urlObj.query){
                    getSingleData(req, res);
                   
                } 
                else if(urlObj.pathname === '/getAllLogs' && urlObj.query){
                    getAllLogs(req, res);

                }else {
                    badReqErr(res, urlObj.path);
                   
                }
    
                break;
    
            case 'POST':
                if (urlObj.pathname === '/insertNewData') {
                    appendJsonToFile(req, res);
                
                } else {
                    badReqErr(res, urlObj.path);
                   
                }
                break;

                    
            case 'PUT':
                if (urlObj.pathname === '/updateData' && urlObj.query) {
                    updateData(req, res);                                  
                    
                }
                else if (urlObj.pathname === '/ResetSale' && urlObj.query){
                        resetSale(req, res);
                }
                else {
                    badReqErr(res, urlObj.path);
                }
                 break;

             case 'DELETE':

                if (urlObj.pathname === '/deleteAccount' && urlObj.query){
                    deleteAccount(req, res);

                }else {
                    badReqErr(res, urlObj.path);
                }
                break;

            

};
}

