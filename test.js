Java.perform(function() {
    try {
        var funcPtr = Module.findExportByName("libc.so", "ptrace");
        console.log("funcPtr: " + funcPtr);
        Interceptor.attach(funcPtr, {
            onEnter: function(args) {}
        });
        console.log("Attached!");
    } catch(e) {
        console.log("Error: " + e.stack);
    }
});
