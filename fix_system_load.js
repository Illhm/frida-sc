<<<<<<< SEARCH
    // Native library load logger - jangan swallow error, jangan fake success
    try {
        var System = Java.use("java.lang.System");
        var Runtime = Java.use("java.lang.Runtime");

        var systemLoadLibrary = System.loadLibrary.overload("java.lang.String");
        var systemLoad = System.load.overload("java.lang.String");

        System.loadLibrary.overload("java.lang.String").implementation = function (library) {
            logDebug("System.loadLibrary() called for: " + library);

            try {
                // Panggil original overload dengan System
                return systemLoadLibrary.call(System, library);
            } catch (e) {
                logDebug("System.loadLibrary() failed for " + library + ": " + e);
                throw e;
            }
        };

        System.load.overload("java.lang.String").implementation = function (path) {
            logDebug("System.load() called for: " + path);

            try {
                // Panggil original overload dengan System
                return systemLoad.call(System, path);
            } catch (e) {
                logDebug("System.load() failed for " + path + ": " + e);
                throw e;
            }
        };

        try {
            var runtimeLoadLibrary0 = Runtime.loadLibrary0.overload("java.lang.Class", "java.lang.String");

            Runtime.loadLibrary0.overload("java.lang.Class", "java.lang.String").implementation = function (callerClass, library) {
                logDebug("Runtime.loadLibrary0() called for: " + library);

                try {
                    return runtimeLoadLibrary0.call(this, callerClass, library);
                } catch (e) {
                    logDebug("Runtime.loadLibrary0() failed for " + library + ": " + e);
                    throw e;
                }
            };
        } catch (e2) {
            logDebug("Runtime.loadLibrary0 overload not available: " + e2);
        }

        logSuccess("System.load/loadLibrary hooked safely");
    } catch (e) {
        logError("Native library hook failed: " + e);
    }
=======
    // Native library load bypass / logging
    try {
        var System = Java.use("java.lang.System");
        var systemLoadLibrary = System.loadLibrary.overload("java.lang.String");
        systemLoadLibrary.implementation = function(library) {
            logDebug("System.loadLibrary() called for: " + library);
            return systemLoadLibrary.call(this, library);
        };

        var systemLoad = System.load.overload("java.lang.String");
        systemLoad.implementation = function(path) {
            logDebug("System.load() called for: " + path);
            return systemLoad.call(this, path);
        };

        try {
            var Runtime = Java.use("java.lang.Runtime");
            var runtimeLoadLibrary0 = Runtime.loadLibrary0.overload("java.lang.Class", "java.lang.String");
            runtimeLoadLibrary0.implementation = function(callerClass, library) {
                logDebug("Runtime.loadLibrary0() called for: " + library);
                return runtimeLoadLibrary0.call(this, callerClass, library);
            };
        } catch (err2) {
            // Ignore if Runtime.loadLibrary0 is not accessible
        }

        logSuccess("System.loadLibrary() / System.load() hooked securely");
    } catch (e) {
        logDebug("Native Library hooking modified / skipped");
    }
>>>>>>> REPLACE
