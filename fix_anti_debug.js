<<<<<<< SEARCH
    // Bypass native anti-debugging checks
    var nativeFunctions = [
        "ptrace",
        "fork",
        "strstr",
        "strcmp"
    ];

    nativeFunctions.forEach(function(funcName) {
        try {
            var funcPtr = Module.findExportByName(null, funcName) || Module.findExportByName("libc.so", funcName);
            if (funcPtr && !funcPtr.isNull()) {
                Interceptor.attach(funcPtr, {
                    onEnter: function(args) {
                        if (funcName === "ptrace") {
                            logDebug("ptrace() called - bypassing");
                            args[0] = ptr(0); // PTRACE_TRACEME = 0
                        } else if (funcName === "strstr") {
                            var haystack = Memory.readUtf8String(args[0]);
                            var needle = Memory.readUtf8String(args[1]);

                            var debugStrings = [
                                "TracerPid",
                                "gdb",
                                "frida",
                                "xposed"
                            ];

                            debugStrings.forEach(function(debugStr) {
                                if (needle && needle.includes(debugStr)) {
                                    logDebug("strstr() bypassed for: " + needle);
                                    args[1] = Memory.allocUtf8String("non_existent_string");
                                }
                            });
                        } else if (funcName === "strcmp") {
                            var str1 = Memory.readUtf8String(args[0]);
                            var str2 = Memory.readUtf8String(args[1]);

                            if ((str1 && str1.includes("TracerPid")) ||
                                (str2 && str2.includes("TracerPid"))) {
                                logDebug("strcmp() bypassed for TracerPid");
                                this.bypass = true;
                            }
                        }
                    },
                    onLeave: function(retval) {
                        if (this.bypass) {
                            retval.replace(1); // Make strings not equal
                            this.bypass = false;
                        }
                    }
                });
                logSuccess(funcName + " hooked");
            }
        } catch (e) {
            logError(funcName + " hook failed: " + e);
        }
    });
=======
    // Bypass native anti-debugging checks
    var nativeFunctions = [
        "ptrace",
        "fork",
        "strstr",
        "strcmp"
    ];

    nativeFunctions.forEach(function(funcName) {
        try {
            var funcPtr = Module.findExportByName(null, funcName) || Module.findExportByName("libc.so", funcName);
            if (funcPtr && !funcPtr.isNull()) {
                if (funcName === "ptrace") {
                    Interceptor.replace(funcPtr, new NativeCallback(function() {
                        logDebug("ptrace() bypassed via replacement");
                        return 0;
                    }, 'int', []));
                } else if (funcName === "fork") {
                    Interceptor.attach(funcPtr, {
                        onLeave: function(retval) {
                            var pid = parseInt(retval.toString(16), 16);
                            logDebug("Child Process PID (fork bypassed): " + pid);
                        }
                    });
                } else {
                    Interceptor.attach(funcPtr, {
                        onEnter: function(args) {
                            if (funcName === "strstr") {
                                var needle = Memory.readUtf8String(args[1]);
                                var debugStrings = ["TracerPid", "gdb", "frida", "xposed"];
                                debugStrings.forEach(function(debugStr) {
                                    if (needle && needle.includes(debugStr)) {
                                        logDebug("strstr() bypassed for: " + needle);
                                        args[1] = Memory.allocUtf8String("non_existent_string");
                                    }
                                });
                            } else if (funcName === "strcmp") {
                                var str1 = Memory.readUtf8String(args[0]);
                                var str2 = Memory.readUtf8String(args[1]);
                                if ((str1 && str1.includes("TracerPid")) || (str2 && str2.includes("TracerPid"))) {
                                    logDebug("strcmp() bypassed for TracerPid");
                                    this.bypass = true;
                                }
                            }
                        },
                        onLeave: function(retval) {
                            if (this.bypass) {
                                retval.replace(1);
                                this.bypass = false;
                            }
                        }
                    });
                }
                logSuccess(funcName + " hooked");
            }
        } catch (e) {
            logError(funcName + " hook failed: " + e);
        }
    });

    // Bypass fgets TracerPid Detection
    try {
        var fgetsPtr = Module.findExportByName("libc.so", "fgets");
        if (fgetsPtr) {
            var fgets = new NativeFunction(fgetsPtr, 'pointer', ['pointer', 'int', 'pointer']);
            Interceptor.replace(fgetsPtr, new NativeCallback(function(buffer, size, fp) {
                var retval = fgets(buffer, size, fp);
                if (!retval.isNull()) {
                    var bufstr = Memory.readUtf8String(buffer);
                    if (bufstr && bufstr.indexOf("TracerPid:") > -1) {
                        Memory.writeUtf8String(buffer, "TracerPid:\t0\n");
                        logDebug("fgets() TracerPID Check bypassed");
                    }
                }
                return retval;
            }, 'pointer', ['pointer', 'int', 'pointer']));
            logSuccess("fgets() hooked for TracerPid");
        }
    } catch (e) {
        logError("fgets() hook failed: " + e);
    }

    // Bypass Connect for Frida Ports
    try {
        var connectPtr = Module.findExportByName("libc.so", "connect");
        if (connectPtr) {
            Interceptor.attach(connectPtr, {
                onEnter: function(args) {
                    var family = Memory.readU16(args[1]);
                    if (family === 2) { // AF_INET
                        var port = Memory.readU16(args[1].add(2));
                        port = ((port & 0xff) << 8) | (port >> 8);
                        if (port === 27042 || port === 27043) { // Default frida ports
                            logDebug("Bypassing connect() check for Frida port: " + port);
                            Memory.writeU16(args[1].add(2), 0x0101); // Divert to dummy port
                        }
                    } else if (family === 1) { // AF_UNIX / LOCAL
                        var memory = Memory.readByteArray(args[1], 64);
                        var b = new Uint8Array(memory);
                        // Check for specific unix socket signature that might detect frida
                        if (b[2] == 0x69 && b[3] == 0xa2 && b[4] == 0x7f && b[5] == 0x00 && b[6] == 0x00 && b[7] == 0x01) {
                            this.frida_detection = true;
                        }
                    }
                },
                onLeave: function(retval) {
                    if (this.frida_detection) {
                        logDebug("connect() frida_detection signature bypassed");
                        retval.replace(-1);
                    }
                }
            });
            logSuccess("connect() hooked for Frida ports");
        }
    } catch (e) {
        logError("connect() hook failed: " + e);
    }
>>>>>>> REPLACE
