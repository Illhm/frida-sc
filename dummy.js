try {
    var System = Java.use("java.lang.System");
    var originalLoadLibrary = System.loadLibrary;
    System.loadLibrary.implementation = function(library) {
        logDebug("System.loadLibrary() called for: " + library);
        return originalLoadLibrary.call(System, library);
    };
} catch(e){}
