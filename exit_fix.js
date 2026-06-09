<<<<<<< SEARCH
    // Runtime.exec bypass
    try {
        var Runtime = Java.use("java.lang.Runtime");
=======
    // Prevent app from closing itself
    try {
        var system = Java.use("java.lang.System");
        system.exit.overload("int").implementation = function(var0) {
            logWarn("System.exit(" + var0 + ") Called and Bypassed");
        };

        var Proc = Java.use("android.os.Process");
        Proc.killProcess.overload('int').implementation = function(arg) {
            logWarn("Process.killProcess(" + arg + ") Called and Bypassed");
        };

        var act = Java.use("android.app.Activity");
        act.finish.overload().implementation = function() {
            logWarn("Activity.finish() Called and Bypassed");
        };
        act.finishActivity.overload('int').implementation = function(arg) {
            logWarn("Activity.finishActivity(" + arg + ") Called and Bypassed");
        };
        act.finishAffinity.overload().implementation = function() {
            logWarn("Activity.finishAffinity() Called and Bypassed");
        };
        act.finishAndRemoveTask.overload().implementation = function() {
            logWarn("Activity.finishAndRemoveTask() Called and Bypassed");
        };

        logSuccess("Anti-Exit mechanisms hooked");
    } catch (e) {
        logDebug("Anti-Exit mechanisms failed: " + e.message);
    }

    // Runtime.exec bypass
    try {
        var Runtime = Java.use("java.lang.Runtime");
>>>>>>> REPLACE
