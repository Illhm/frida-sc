<<<<<<< SEARCH
    nativeFunctions.forEach(function(funcName) {
        try {
            var funcPtr = Module.findExportByName("libc.so", funcName);
            if (funcPtr) {
                Interceptor.attach(funcPtr, {
=======
    nativeFunctions.forEach(function(funcName) {
        try {
            var funcPtr = Module.findExportByName("libc.so", funcName);
            if (funcPtr && !funcPtr.isNull()) {
                Interceptor.attach(funcPtr, {
>>>>>>> REPLACE
