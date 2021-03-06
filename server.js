'use strict';
const config = require('./config');
// create an API server
const Restify = require('restify');
const server = Restify.createServer({
	name: 'remindMe'
});
const PORT = process.env.PORT || 8080;

// FBeamer
const FBeamer = require('./fbeamer');
const f = new FBeamer(config.FB);

server.use(Restify.jsonp());
server.use(Restify.bodyParser());
server.use((req, res, next) => f.verifySignature(req, res, next));

//Agenda
const agenda = require('./agenda')(f);
//Session
const session = require('./session');

//WIT actions
const actions = require('./actions')(session,f,agenda);

// WIT.AI
const Wit = require('node-wit').Wit;
const wit = new Wit({
	accessToken: config.WIT_ACCESS_TOKEN,
	actions
});

// Register the webhooks
server.get('/', (req, res, next) => {
	f.registerHook(req, res);
	return next();
});

agenda.on('ready',()=>{
	// Handle incoming
	server.post('/', (req, res, next) => {
		f.incoming(req, res, msg => {
			const {
				sender,
				postback,
				message
			} = msg;

			if(message.text) {
				// Process the message here

				let sessionId = session.init(sender);
				let {context} = session.get(sessionId);
				//run wit actions (converse API)
				wit.runActions(sessionId,message.text,context)
				.then(ctx=>{
					ctx.jobDone?session.delete(sessionId):session.update(sessionId,ctx);
				})
				.catch(error=>console.log(`Error: ${error}`));
			}

		});

		return next();
	});
	agenda.start();
})

// Subscribe
f.subscribe();

server.listen(PORT, () => console.log(`RemindMe running on port ${PORT}`));
