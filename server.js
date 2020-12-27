const express = require("express");
const connectDB = require("./config/db");
var cron = require("node-cron");
const app = express();
const Account = require("./models/Account");
const Terminal = require("./models/Terminal");
const Transaction = require("./models/Transaction");
const xml2js = require("xml2js");
const soapRequest = require("easy-soap-request");
// connect Database
connectDB();

// Init Middleware
app.use(express.json({ extended: false }));

app.get("/", (req, res) => res.send("Why here?"));


// Backup a database at 11:59 PM every day.
cron.schedule('*/5 * * * *', async function() {
  console.log('---------------------');
    console.log('Running Cron Job');
    
    let jsonData = false;
    try {
        const accounts = await Account.find();
        accounts.map(async (acc) => {
            console.log(acc.username)
            console.log(acc.password)
                const url = "https://secure.myterminals.com/ConfigStatusSyncService/DataQuery.asmx";
            const sampleHeaders = {"Content-Type": "text/xml;charset=UTF-8"};
            const xml = `<?xml version='1.0' encoding='utf-8'?><soap:Envelope xmlns:xsi='http://www.w3.org/2001/XMLSchema-instance' xmlns:xsd='http://www.w3.org/2001/XMLSchema' xmlns:soap='http://schemas.xmlsoap.org/soap/envelope/'><soap:Body><HourlyTransactions xmlns='https://secure.myterminals.com/ConfigStatusSyncService'><StartTime>2020-12-17 00:00</StartTime><EndTime>2020-12-18 00:00</EndTime><Login>${acc.username}</Login><Password>${acc.password}</Password></HourlyTransactions></soap:Body></soap:Envelope>`;
            const { response } = await soapRequest({
                url: url,
                headers: sampleHeaders,
                xml: xml,
                timeout: 5000,
            });
          const { body } = response;
            await xml2js.parseString(body, (err, res) => {
              if (err) throw err;
              jsonData = JSON.stringify(res, null, 4);
            });
          const terminal = JSON.parse(jsonData);
              const transactions =
                terminal["soap:Envelope"]["soap:Body"][0][
                  "HourlyTransactionsResponse"
                ][0]["HourlyTransactionsResult"][0]["TransactionRecord"];
        
            transactions.map(async (trns) => {
              
              console.log("=========== terminal Id ==========");
              console.log(trns["TerminalID"][0]);

                var terminal = await Terminal.findOne({terminal: trns["TerminalID"][0]});
                console.log("=========== terminal model ==========");

                if (terminal === null) {
                    console.log("=========== Not Object");
                    terminal = await new Terminal({ terminal: trns["TerminalID"][0] });
                }
                if (terminal !== null) {
                  console.log("=========== Object");
                  terminal.txs += 1;
                  await terminal.save();
                }
                console.log("=========== Saved Terminal Model =========");
                console.log(terminal)

                const removeIndex = acc.terminals.map((trm) => trm).indexOf(terminal._id);
                console.log(removeIndex)
                if (removeIndex == -1) {
                  acc.terminals.unshift(terminal._id);
                  await acc.save();
                }
                console.log("=========== Account Model =========");
                console.log(acc);
              });
        });
  } catch (error) {
    console.log("===============error====================");
    console.error(error);
  }
    
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
