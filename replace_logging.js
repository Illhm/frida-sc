<<<<<<< SEARCH
/* ========== LOGGING FUNCTIONS ========== */

function logInfo(msg) {
    console.log("\x1b[36m[INFO]\x1b[0m " + msg);
}

function logSuccess(msg) {
    console.log("\x1b[32m[✓]\x1b[0m " + msg);
}

function logWarn(msg) {
    console.warn("\x1b[33m[⚠]\x1b[0m " + msg);
}

function logError(msg) {
    console.error("\x1b[31m[✗]\x1b[0m " + msg);
}
=======
/* ========== LOGGING FUNCTIONS ========== */

var ERROR_LOG_FILE = "/sdcard/Download/fail.txt"; // Target path in Android external storage
var ERROR_LOG_INITIALIZED = false;

function _writeErrorToFile(msg) {
    try {
        var File = Java.use("java.io.File");
        var FileWriter = Java.use("java.io.FileWriter");
        var BufferedWriter = Java.use("java.io.BufferedWriter");
        var PrintWriter = Java.use("java.io.PrintWriter");

        var file = File.$new(ERROR_LOG_FILE);

        // Delete the file on first write
        if (!ERROR_LOG_INITIALIZED) {
            if (file.exists()) {
                file.delete();
            }
            ERROR_LOG_INITIALIZED = true;
        }

        var fw = FileWriter.$new(file, true);
        var bw = BufferedWriter.$new(fw);
        var pw = PrintWriter.$new(bw);

        pw.println("[" + getTimestamp() + "] " + msg);

        pw.close();
        bw.close();
        fw.close();
    } catch (e) {
        // Fallback or ignore if write permissions are not available
    }
}

function logInfo(msg) {
    console.log("\x1b[36m[INFO]\x1b[0m " + msg);
}

function logSuccess(msg) {
    console.log("\x1b[32m[✓]\x1b[0m " + msg);
}

function logWarn(msg) {
    console.warn("\x1b[33m[⚠]\x1b[0m " + msg);
}

function logError(msg) {
    console.error("\x1b[31m[✗]\x1b[0m " + msg);
    _writeErrorToFile(msg);
}
>>>>>>> REPLACE
