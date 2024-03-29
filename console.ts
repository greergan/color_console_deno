import { blue as b, brightGreen as brg, green as g, magenta as m, red as r, yellow as y, bold, brightWhite as bw} from "./deps.ts"
class LogMessage extends Error {
	call:string = "";
	calling_class:string = "";
	calling_file:string = "";
	line_number:string = "";
	object_string:string = "";
	value:string = "";
	configuration:any = {
		delimiter: " ",
		print_with_file_name: true
	}
	constructor(...args:any) {
		super();
 		if(this.stack != undefined && this.stack.length > 0) {
			const location_regex = /(?:\s+at)(?:\snew)?\s([a-z0-9_]+)?\s?(?:\s)?\(?(?:file:\/{3}.+)\/([.a-z0-9_-]+):(\d+)/im;
			const location_array = this.stack.match(location_regex) || [];
			if(location_array.length == 4) {
				this.calling_class = location_array[1] || "";
				this.calling_file = location_array[2] || "";
				this.line_number = location_array[3] || "";
			}
		}
		let message_found:boolean = false;
		for(let arg of args[0]) {
			if(!message_found && typeof arg == 'object') {
				if(arg["message"] != undefined) {
					this.message = arg["message"];
					message_found = true;
					if(arg["value"] != undefined) {
						this.value = JSON.stringify(arg["value"]) + ",";
					}
					if(arg["with_file"] != undefined) {
						this.configuration.print_with_file_name = (String(arg["value"]).toLowerCase() == 'false' || arg["value"] == false) ? false : true;
					}
					this.configuration.delimiter = (arg["delimiter"] != undefined) ? arg["delimiter"] : this.configuration.delimiter;
				}
				else {
					this.object_string += JSON.stringify(arg) + ",";
				}
			}
			else if(typeof arg == 'object') {
				this.object_string += JSON.stringify(arg) + ",";
			}
			else {
				this.object_string += arg + ",";
			}		
		}
		this.object_string = this.object_string.replace(/,$/, '');
		this.call = (this.configuration.print_with_file_name) ?
			`${this.calling_file}${this.configuration.delimiter}${this.calling_class}${this.configuration.delimiter}${this.line_number}` :
				`${this.calling_class}${this.configuration.delimiter}${this.line_number}`;
	}
}
export class abort extends LogMessage {
	constructor(...args:any) {
		super(args);
		this.name = "ABORT";
		Deno.stderr.write(new TextEncoder().encode(`${bw(this.name)} ${bw(this.call)} ${bw(this.message)} ${bw(this.value)} ${bw(this.object_string)}\n`));
		Deno.exit(1);
	}
}
export class debug extends LogMessage {
	constructor(...args:any) {
		super(args);
		this.name = "DEBUG";
		Deno.stderr.write(new TextEncoder().encode(`${y(this.name)} ${g(this.call)} ${this.message} ${bold(this.value)} ${brg(this.object_string)}\n`));
	}
}
export class error extends LogMessage {
	constructor(...args:any) {
		super(args);
		this.name = "ERROR";
		Deno.stderr.write(new TextEncoder().encode(`${r(this.name)} ${g(this.call)} ${this.message} ${bold(this.value)} ${brg(this.object_string)}\n`));
	}
}
export class todo extends LogMessage {
	constructor(...args:any) {
		super(args);
		this.name = "TODO";
		Deno.stderr.write(new TextEncoder().encode(`${b(this.name)} ${g(this.call)} ${this.message} ${bold(this.value)} ${brg(this.object_string)}\n`));
	}
}
export class trace extends LogMessage {
	constructor(...args:any) {
		super(args);
		this.name = "TRACE";
		Deno.stderr.write(new TextEncoder().encode(`${m(this.name)} ${g(this.call)} ${this.message} ${bold(this.value)} ${brg(this.object_string)}\n`));
	}
}
