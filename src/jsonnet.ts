var fs = require('fs');
var exec = require('child_process').exec, child;

/**
 * A wrapper around the native executable. Could not get the libjsonnet.js
 * library generated and working. So unfortunately this imposes the need for
 * users to have to install jsonnet and makes this library essentially useless
 * in web environments.
 * 
 * Would be nice to use the same wrapper with libjsonnet.js once we figure
 * out how to work with it properly,
 */
export class Jsonnet {
    private outFile: string | null = null;
    private libPaths: Array<string> = [];
    private args: Map<string,string> = new Map();
    private vars: Map<string,string> = new Map();
    private inFileChanged: number = Number.NEGATIVE_INFINITY;
    private outFileChanged: number = Number.NEGATIVE_INFINITY;

    constructor(private inFile: string) {
        // check file, record last mode timestamp
        if (!fs.existsSync(inFile)) {
            throw new Error("Input file " + inFile + " does not exist.");
        }

        var stats = fs.statSync(inFile);
        this.inFileChanged = stats.mtimeMs;
    }
    
    setOutFile(outFile: string) {
        this.outFile = outFile;
        if(fs.existsSync(outFile)) {
            var stats = fs.statSync(outFile);
            this.outFileChanged = stats.mtimeMs;
        }
        return this;
    }

    addLibPath(path: string) {
        this.libPaths.push(path);
        return this;
    }

    addArgs(key: string, value: string) {
        this.args.set(key, value);
        return this;
    }

    addVars(key: string, value: string) {
        this.vars.set(key, value);
        return this;
    }

    execute() {
        var cmd = 'jsonnet'
        this.libPaths.forEach(element => {
            cmd += ' -J ' + element;
        });

        this.args.forEach((val: string, key: string) => {
            cmd += ' -A ' + key + '="' + val + '"';
        });

        this.vars.forEach((val: string, key: string) => {
            cmd += ' -V ' + key + '="' + val + '"';
        });

        cmd += ' ' + this.inFile + ' -o ' + this.outFile

        child = exec(cmd, function (err: any, stdout: any, stderr: any) {
            if(err !== null) {
                console.log('exec error: ' + err);
            }
        });
        
        return this;
    }
}
