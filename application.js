!(function() {
	// external library
	const {app, BrowserWindow, session} = require('electron');
	
	const fs = require('fs');
	
	const path = require('path');
	
	const requestlib = require('request');
	
	// internal library
	const http = require('./library/http');
	
	// parse settings
	this.settings = JSON.parse(
		fs.readFileSync(path.join(__dirname, 'ressources\\settings.json'), 'utf-8')
	);
	
	// ...
	this.create_window = () => {
		session.defaultSession.webRequest.onBeforeSendHeaders((details, callback) => {
			details.requestHeaders["User-Agent"]="Chrome";
			callback({cancel:false,requestHeaders:details.requestHeaders});
		});
		
		this.window = new BrowserWindow({
			title: "Transformice Adventures",
			width: 1240,
			height: 660,
			webPreferences: {
				contextIsolation: true
			},
			icon: path.join(__dirname, "ressources/souris."+(process.platform==='win32'&&'ico'||'png'))
		});
		
		this.window.removeMenu();
		
		this.init_host();
	}
	
	this.init_host = () => {
		this.http = new http(
			this.settings.host,
			{
				ready: ()=> {
					window.loadURL(
						`http://${this.settings.host.address}:${this.settings.host.port}/`,
						{userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.104 Safari/537.36"}
					);
				},
				
				request: (filename, request, response) => 
				{
					if (filename.startsWith('/ressources')) {
						const mimetype = http.mimeTypes[path.extname(filename).toLowerCase()] || "application/octet-stream";
						let is_localfile = false;
						
						fs.readFile(
							path.normalize(path.join(__dirname, filename)),
							(error, body) => {
								if (!error) {
									is_localfile = true;
									
									response.writeHead(200, {'Content-Type': mimetype});
									response.end(body, 'utf-8');
								}
							}
						);
						
						if (is_localfile) return;
					}
					
					requestlib(
						{
							url: `http://transformice-adventures.com${filename}`,
							headers: {
								'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.104 Safari/537.36'
							}
						},
						(error, res, body) => {
							if (error) throw error;
							
							const fixed = this.check_fix(filename, body);
							
							if (fixed) {
								body = fixed.body;
								res.headers['content-length'] = fixed.length;
							}
							
							response.writeHead(res.statusCode, res.headers);
							response.end(body, 'utf-8');
						}
					);
				},
				
				failure: (message) => {
					console.error(message);
					app.exit();
				}
			}
		);
	}
	
	this.check_fix = (filename, body, response) => {
		let new_body;
		let length;
		
		// fix chat
		if (filename.endsWith('ProtoM801.js')) {
			new_body = body.replace('            this.ajouterPaquet(this.fusionCode(6, 6), function (MSG) {\n                var codeJoueur = MSG.l32s();\n                var auteur = MSG.lChaine();\n                var codeCommunaute = MSG.l8();\n                var message = MSG.lChaine();\n                message = message.replace(/&lt;/g, "<");\n                Module801_1.default.instance.messageChat(message, auteur, Communaute_1.default.recupParCode(codeCommunaute, Communaute_1.default.ANGLAIS_INT), 0);\n            });', '            this.ajouterPaquet(this.fusionCode(6, 6), function (MSG) {				\n				var auteur = MSG.lChaine();\n				var message = MSG.lChaine();\n                message = message.replace(/&lt;/g, "<");\n                Module801_1.default.instance.messageChat(message, auteur);\n            });');
		// fix scrollbar for talents interface
		} else if (filename.endsWith('InterfaceTalents.js')) {
			new_body = body.replace('this.conteneurListeArbres.defilementHaut();', 'this.conteneurListeArbres.defHauteur(320);');
		// fix all checkboxes
		} else if (filename.endsWith('I_BoutonEtat.js')) {
			new_body = body.replace('if (OUI) {\n                this.fondCroix.appendChild(this.croix);\n            }\n            else {\n                this.croix.remove();\n            }', 'this.fondCroix.appendChild(this.croix);\n			if(OUI){\n				this.croix.classList.add("croix-active");\n			} else {\n				this.croix.classList.remove("croix-active");\n			}');
		} else if (filename.endsWith('I_Style.css')) {
			new_body = body + "\n.I_BoutonEtat .croix-active {position: relative;width:1em;height:1em;min-width:1em;min-height:1em;background-color: #281b12;border-radius: 0.2em;box-shadow: inset 1px 1px 1px #000000CC, inset -1px -1px 1px #927A5A;align-self: center;}.I_BoutonEtat .croix-active::after{position:absolute;content:'\\274c';font-size: 0.7em;margin-left:0.10em;color:#7BBD40;font-weight: bold;}";
			length = String(new_body.length + 15);
		}
		
		if (new_body) {
			return {
				body: new_body,
				length: length || String(new_body.length)
			}
		}
	}
	
	app.whenReady().then(this.create_window);
})();