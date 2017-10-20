'use babel';

import { Range, File } from 'atom';
import Path from 'path';

export default {
	activate() {
		require('atom-package-deps').install('pawn-hyperclick')
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
			grammarScopes: ['source.pwn'],
			wordRegExp: /(#include|#tryinclude)\s*[<"](.*)[>"]/g,
			getSuggestionForWord (editor, text, range): ?HyperclickSuggestion {
				if (atom.config.get('pawn-hyperclick.includePaths') === "C:\\Example\\ChangeMe;C:\\Example\\ChangeMeToo")
					return false;

				let incType;

				if (text.indexOf("<") > -1) {
					incType = "<";
				} else {
					incType = "\"";
				}

				range = new Range([range.start.row, text.indexOf(incType)], [range.start.row, text.length]);
				let fileName = text.slice(text.indexOf(incType)+1, text.length-1);
				let path;

				if (incType === "<") {
					let paths = atom.config.get('pawn-hyperclick.includePaths').split(";");

					for (var i = 0; i < paths.length; i++) {
						path = Path.join(paths[i], fileName) + ".inc";
						let file = new File(path);

						if (file.existsSync())
							break;
					}
				} else {
					let ext = Path.extname(fileName);

					if (ext === "")
						ext = ".inc";

					path = Path.join(Path.dirname(editor.getPath()), fileName) + ext;

				}

				return {
					range,
					callback: () => {
						let file = new File(path);

						if (file.existsSync()) {
							atom.workspace.open(path);
						}
					}
				};
			}
		};
	}
};
