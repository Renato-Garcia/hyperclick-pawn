'use babel';

import { Range, File } from 'atom';
import path from 'path';

export default {
	activate() {
		require('atom-package-deps').install('hyperclick-pawn')
			.then(function() {
				console.log('All dependencies installed, good to go')
			})
	},
	config: {
		"includePaths": {
			"description": "Your include paths, each one separated by ';'. (e.g.: D:\\Pawn\\Includes;D:\\Pawn\\AnotherIncs).",
			"type": "string",
			"default": "C:\\Example\\ChangeMe;C:\\Example\\ChangeMeToo"
		}
	},
	getProvider () {
		return {
			providerName: "pawn-hyperclick",
			grammarScopes: ['source.pwn', 'source.inc'],
			wordRegExp: /(#include)\s*<(\w.*)>/g,
			getSuggestionForWord (editor, text, range): ?HyperclickSuggestion {
				if (atom.config.get('hyperclick-pawn.includePaths') === "C:\\Example\\ChangeMe;C:\\Example\\ChangeMeToo")
					return false;

				let fileName = text.slice(text.indexOf("<")+1, text.length-1);
				range = new Range([range.start.row, text.indexOf("<")], [range.start.row, text.indexOf(">")]);
				let paths = atom.config.get('hyperclick-pawn.includePaths').split(";");
				let path;

				for (var i = 0; i < paths.length; i++) {
					let file = new File(paths[i] + "\\" + fileName + ".inc");

					if (file.existsSync()) {
						path = paths[i] + "\\" + fileName + ".inc";
						break;
					}
				}

				if (path == undefined)
					return false;

				return {
					range,
					callback: () => {
						atom.workspace.open(path);
					}
				};
			}
		};
	}
};
