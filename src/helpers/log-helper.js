    import 'dotenv/config'
    import fs from 'fs';

    class LogHelper {
      constructor() {
    this.filePath = process.env.LOG_FILE_PATH;
    this.fileName = process.env.LOG_FILE_NAME;
    this.logToFileEnabled = process.env.LOG_TO_FILE_ENABLED.toLowerCase() === 'true';
    this.logToConsoleEnabled = process.env.LOG_TO_CONSOLE_ENABLED.toLowerCase() === 'true';

    if (!fs.existsSync(this.filePath)) {
        fs.mkdirSync(this.filePath, { recursive: true });
    }

}

        /**
         * Este método almacena en un archivo de texto y/o por muestra consola información del Error.
         * @param {*} errorObject
         */
logError = (errorObject) => {
    // arma el texto del log con fecha y mensaje del error
    const logText = `[${new Date().toISOString()}] ${errorObject.message}\n`;

    if (this.logToConsoleEnabled) {
        console.error(logText);
    }

    if (this.logToFileEnabled) {
        fs.appendFileSync(this.filePath + this.fileName, logText);      // appendFileSync = agrega al final del archivo sin borrar lo anterior
    }
}

        
    }

    export default new LogHelper();