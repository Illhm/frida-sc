function _writeToFile(filePath, message) {
    try {
        var File = Java.use("java.io.File");
        var FileWriter = Java.use("java.io.FileWriter");
        var BufferedWriter = Java.use("java.io.BufferedWriter");
        var PrintWriter = Java.use("java.io.PrintWriter");

        var file = File.$new(filePath);
        var fw = FileWriter.$new(file, true); // true = append mode
        var bw = BufferedWriter.$new(fw);
        var pw = PrintWriter.$new(bw);

        pw.println(message);

        pw.close();
        bw.close();
        fw.close();
    } catch (e) {
        console.error("Failed to write to file: " + e);
    }
}

function _deleteFile(filePath) {
    try {
        var File = Java.use("java.io.File");
        var file = File.$new(filePath);
        if (file.exists()) {
            file.delete();
        }
    } catch (e) {
        console.error("Failed to delete file: " + e);
    }
}
