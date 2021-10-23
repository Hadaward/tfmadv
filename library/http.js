const http = require('http');
const path = require('path');

module.exports = class {
	constructor(address, events) {
		this.address = address;
		this.server = null;
		
		module.exports.check_port(
			this.address.port,
			(_, status) => {
				if (status === 'closed') {
					this.init(events);
				} else {
					events.failure(`Port ${this.address.port} is busy`);
				}
			}
		);
	}
	
	init(events) {
		this.server = http.createServer(
			(request, response) => {
				const filename = (request.url === '/' && '/index.html' || request.url).split('?')[0];
				request.baseurl = path.basename(filename);
				events.request(filename, request, response);
			}
		);
		
		this.server.listen(
			this.address.port,
			this.address.host || null,
			events.ready
		);
	}
	
	stop() {
		if (this.server != null) {
			this.server.close();
			this.server = null;
		}
	}
}

module.exports.check_port = require('portscanner').checkPortStatus;

module.exports.mimeTypes = {
	'.html': 'text/html',
	'.js': 'text/javascript',
	'.swf': 'application/x-shockwave-flash',
	'.css': 'text/css',
	'.json': 'application/json',
	'.png': 'image/png',
	'.jpg': 'image/jpg',
	'.gif': 'image/gif',
	'.svg': 'image/svg+xml',
	'.wav': 'audio/wav',
	'.mp4': 'video/mp4',
	'.woff': 'application/font-woff',
	'.ttf': 'application/font-ttf',
	'.eot': 'application/vnd.ms-fontobject',
	'.otf': 'application/font-otf',
	'.wasm': 'application/wasm',
	'.xml': 'application/xml',
	'.mp3': 'audio/mpeg3'
};