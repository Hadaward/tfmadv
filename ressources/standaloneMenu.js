!(function() {
	const { ipcRenderer } = require('electron');
	
	this.debugMode = false;
	
	ipcRenderer.on('options', (event, name, value) => {
		if (name === 'debugMode') {
			this.debugMode = value;
			this.checkbox_debugMode.set_value(this.debugMode);
		}
	});
	
	this.last_file_loaded = null;
	
	ipcRenderer.on('loading', (event, filename) => {
		this.last_file_loaded = filename;
		
		const title = document.getElementsByTagName('title')[0];
		
		if (!title) return;
		
		title.innerHTML = `${title.innerHTML.split(' -')[0]} - loading ${filename}`;
		
		setTimeout(
			() => {
				if (this.last_file_loaded == filename) {
					const title = document.getElementsByTagName('title')[0];
					title.innerHTML = title.innerHTML.split(' -')[0];
				}
			},
			2000
		);
	});
	
	this.create_checkbox = function(parentNode, checked, callback) {
		const button = document.createElement('div');
		button.setAttribute('style', "user-select: none; pointer-events: auto; display: flex; flex-shrink: 0; cursor: pointer; margin: 0.2em 0.4em;");
		button.classList.add('I_BoutonEtat');
		
		parentNode.appendChild(button);
		
		const cadre_croix = document.createElement('div');
		cadre_croix.classList.add('cadre-croix');
		
		button.appendChild(cadre_croix);
		
		const croix = document.createElement('div');
		croix.classList.add('croix');
		
		cadre_croix.appendChild(croix);

		if (checked) {
			croix.classList.add('croix-active');
		}
		
		const set_value = (value) => {
			checked = value;
			
			if (checked) {
				croix.classList.add('croix-active');
			} else {
				croix.classList.remove('croix-active');
			}
		}
		
		button.onclick = ()=> {
			const new_value = !checked;
			set_value(new_value);
			callback(new_value);
		}
		
		return {
			set_value: set_value
		}
	}
	
	this.create_button = function(parentNode, text, callback) {
		const button = document.createElement('button');
		button.setAttribute('style', "user-select: auto; pointer-events: auto; display: flex; flex-shrink: 0; cursor: pointer; margin: 0.2em;");
		button.classList.add('I_Bouton');
		
		button.onclick = callback;
		
		parentNode.appendChild(button);
		
		const texte = document.createElement('span');
		texte.setAttribute('style', "user-select: none; pointer-events: none;");
		texte.classList.add('texte');
		
		texte.innerHTML = text;
		
		button.appendChild(texte);
	}
	
	this.button = document.createElement('img');
	this.button.setAttribute('style', "user-select: none; pointer-events: auto; background-color: transparent; width: 32px; height: 32px; position: absolute; top: 0.5em; right: 0.5em; cursor: pointer; z-index: 0;");
	this.button.setAttribute('src', 'ressources/standalone_menu.png');
	this.button.classList.add('I_Image');
	
	this.ismenuopen = false;
	
	this.button.onclick = ()=> {
		if (!this.ismenuopen) {
			this.ismenuopen = true;
			this.maindiv.appendChild(this.fond);
		}
	}
	
	this.fond = document.createElement('div');
	this.fond.setAttribute('style', "user-select: auto; pointer-events: auto; display: flex; align-content: flex-start; flex-flow: column nowrap; max-width: 85vw; max-height: 65vh; min-width: 23em; position: absolute; left: 50%; top: 45%; transform: translate(-50%, -50%); min-height: 40px;");
	this.fond.classList.add('I_Conteneur');
	this.fond.classList.add('fond');
	this.fond.classList.add('I_Fenetre');
	
	this.title = document.createElement('span');
	this.title.setAttribute('style', "white-space: nowrap; user-select: none; pointer-events: none;");
	this.title.classList.add('titre');
	
	this.title.innerHTML = "Standalone options";
	
	this.fond.appendChild(title);
	
	this.cadre = document.createElement('div');
	this.cadre.setAttribute('style', "user-select: none; pointer-events: none;");
	this.cadre.classList.add('cadre');
	
	this.cadre_button_fermer = document.createElement('button');
	this.cadre_button_fermer.setAttribute('style', "user-select: none; pointer-events: auto; cursor: pointer;");
	this.cadre_button_fermer.classList.add('bouton-fermer');
	
	this.cadre_button_fermer.onclick = () => {
		this.maindiv.removeChild(this.fond);
		this.ismenuopen = false;
	}
	
	this.cadre.appendChild(this.cadre_button_fermer);
	
	this.fond.appendChild(cadre);
	
	this.container = document.createElement('div');
	this.container.setAttribute('style', "user-select: auto; pointer-events: auto; display: flex; align-content: flex-start; flex-flow: column nowrap; height: 100%; overflow: hidden auto; margin: 0.2em;");
	this.container.classList.add('I_Conteneur');
	
	this.fond.appendChild(container);
	
	this.game_container = document.createElement('div');
	this.game_container.setAttribute('style', "user-select: auto; pointer-events: auto; display: flex; align-content: flex-start; flex-flow: column nowrap; margin: 0.2em;");
	this.game_container.classList.add('I_Conteneur');
	
	this.container.appendChild(this.game_container);
	
	this.game_fieldset = document.createElement('fieldset');
	this.game_fieldset.setAttribute('style', "user-select: none; pointer-events: none; border-width: 2px; border-style: solid; border-color: rgb(127, 116, 78); border-radius: 15px; padding: 0px 0.5em;");
	
	this.game_container.appendChild(this.game_fieldset);
	
	this.game_legend = document.createElement('legend');
	this.game_legend.setAttribute('style', "user-select: none; pointer-events: none; color: rgb(255, 217, 145); padding: 0px 5px; margin-left: 15px;");
	
	this.game_legend.innerHTML = "Game";
	
	this.game_fieldset.appendChild(this.game_legend);
	
	this.game_fieldset_container = document.createElement('div');
	this.game_fieldset_container.setAttribute('style', "user-select: auto; pointer-events: auto; display: grid; align-content: flex-start; flex-flow: column nowrap; grid-template-columns: repeat(2, minmax(9em, min-content)); padding: 0px 1.5em; column-gap: 1em; align-items: center; grid-auto-rows: minmax(0.2em, max-content);");
	this.game_fieldset_container.classList.add('I_Conteneur');
	
	this.game_fieldset.appendChild(this.game_fieldset_container);
	
	this.game_fieldset_container_texte = document.createElement('span');
	this.game_fieldset_container_texte.setAttribute('style', "user-select: none; pointer-events: none; white-space: pre-line; margin: 0.2em;");
	this.game_fieldset_container_texte.classList.add('I_Texte');
	
	this.game_fieldset_container_texte.innerHTML = "Debug mode";
	
	this.game_fieldset_container.appendChild(this.game_fieldset_container_texte);
	
	this.checkbox_debugMode = this.create_checkbox(
		this.game_fieldset_container,
		this.debugMode,
		(checked) => {
			ipcRenderer.send('options', 'debugMode', checked);
		}
	);
	
	this.standalone_container = document.createElement('div');
	this.standalone_container.setAttribute('style', "user-select: auto; pointer-events: auto; display: flex; align-content: flex-start; flex-flow: column nowrap; margin: 0.2em;");
	this.standalone_container.classList.add('I_Conteneur');
	
	this.container.appendChild(this.standalone_container);
	
	this.standalone_fieldset = document.createElement('fieldset');
	this.standalone_fieldset.setAttribute('style', "user-select: none; pointer-events: none; border-width: 2px; border-style: solid; border-color: rgb(127, 116, 78); border-radius: 15px; padding: 0px 0.5em;");
	
	this.standalone_container.appendChild(this.standalone_fieldset);
	
	this.standalone_legend = document.createElement('legend');
	this.standalone_legend.setAttribute('style', "user-select: none; pointer-events: none; color: rgb(255, 217, 145); padding: 0px 5px; margin-left: 15px;");
	
	this.standalone_legend.innerHTML = "Standalone";
	
	this.standalone_fieldset.appendChild(this.standalone_legend);
	
	this.standalone_fieldset_container = document.createElement('div');
	this.standalone_fieldset_container.setAttribute('style', "user-select: auto; pointer-events: auto; display: grid; align-content: flex-start; flex-flow: column nowrap; grid-template-columns: repeat(2, minmax(9em, min-content)); padding: 0px 1.5em; column-gap: 1em; align-items: center; grid-auto-rows: minmax(0.2em, max-content);");
	this.standalone_fieldset_container.classList.add('I_Conteneur');
	
	this.standalone_fieldset.appendChild(this.standalone_fieldset_container);
	
	this.create_button(
		this.standalone_fieldset_container,
		"Reload",
		() => {
			ipcRenderer.send('options', 'reload');
		}
	)
	
	this.create_button(
		this.standalone_fieldset_container,
		"Clear cache",
		() => {
			ipcRenderer.send('options', 'clear-cache');
		}
	)
	
	this.wait_for_maindiv = setInterval(
		() => {
			const maindiv = document.body.getElementsByTagName('div')[0];
			const canvas = document.body.getElementsByTagName('canvas')[0];
			
			if (maindiv && canvas) {
				this.maindiv = maindiv;
				maindiv.appendChild(this.button);
				clearInterval(this.wait_for_maindiv);
			}
		},
		1000
	);
	
})();