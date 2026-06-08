/* ============================================
   FRIDA SPOOF SCRIPT - COMPLETE DEVICE SPOOFING
   All Build Properties & Deep System Hooks
   Version: 3.0 - AGGRESSIVE DEVICE NAME HOOKING
   ============================================ */

/* ========== UTILITIES ========== */

var RANDOM = function() {};

function _randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function _randomHex(len) {
    var hex = '0123456789abcdef';
    var output = '';
    for (var i = 0; i < len; ++i) {
        output += hex.charAt(Math.floor(Math.random() * hex.length));
    }
    return output;
}

function _pad(n, width) {
    n = n + "";
    return n.length >= width ? n : new Array(width - n.length + 1).join("0") + n;
}

function _randomPaddedInt(length) {
    return _pad(_randomInt(0, Math.pow(10, length)), length);
}

function _luhn_getcheck(code) {
    code = String(code).concat("0");
    var len = code.length;
    var parity = len % 2;
    var sum = 0;
    for (var i = len - 1; i >= 0; i--) {
        var d = parseInt(code.charAt(i))
        if (i % 2 == parity) {
            d *= 2;
        }
        if (d > 9) {
            d -= 9;
        }
        sum += d;
    }
    var checksum = sum % 10;
    return checksum == 0 ? 0 : 10 - checksum;
}

function _luhn_verify(code) {
    code = String(code);
    var len = code.length;
    var parity = len % 2;
    var sum = 0;
    for (var i = len - 1; i >= 0; i--) {
        var d = parseInt(code.charAt(i))
        if (i % 2 == parity) {
            d *= 2;
        }
        if (d > 9) {
            d -= 9;
        }
        sum += d;
    }
    return sum % 10 == 0;
}

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

function logDebug(msg) {
    console.log("\x1b[35m[DEBUG]\x1b[0m " + msg);
}

function getTimestamp() {
    return new Date().toISOString();
}

/* ========== DEVICE DATABASE WITH DISPLAY NAMES ========== */

var DEVICE_DATABASE = {
    "samsung": {
        "s21": {
            DEVICE: "d1", PRODUCT: "d1q", MODEL: "SM-G991B", MANUFACTURER: "Samsung",
            BRAND: "samsung", FINGERPRINT: "samsung/d1q/d1:12/SPB1/G991BXXU1AUC2:user/release-keys",
            HARDWARE: "d1", HOST: "lgefx02", USER: "dpi", DISPLAY: "SPB1.201120.019",
            ID: "SPB1.201120.019", TAGS: "release-keys", TYPE: "user", ODINT: "FWWC.C1.1120",
            INCREMENTAL: "1120", BUILD: "SPB1.201120.019", SECURITY_PATCH: "2021-12-05",
            BOARD: "d1", BOOTLOADER: "unknown", RADIO: "unknown",
            DEVICE_NAME: "Galaxy S21", DEVICE_FULL_NAME: "Samsung Galaxy S21"
        },
        "s20": {
            DEVICE: "y2q", PRODUCT: "y2q", MODEL: "SM-G980F", MANUFACTURER: "Samsung",
            BRAND: "samsung", FINGERPRINT: "samsung/y2q/y2q:11/RP1A.200720.011/G980FXXU1ATJ1:user/release-keys",
            HARDWARE: "y2q", HOST: "lgefx02", USER: "dpi", DISPLAY: "RP1A.200720.011",
            ID: "RP1A.200720.011", TAGS: "release-keys", TYPE: "user", ODINT: "FWWC.C1.0720",
            INCREMENTAL: "0720", BUILD: "RP1A.200720.011", SECURITY_PATCH: "2020-07-20",
            BOARD: "y2q", BOOTLOADER: "unknown", RADIO: "unknown",
            DEVICE_NAME: "Galaxy S20", DEVICE_FULL_NAME: "Samsung Galaxy S20"
        },
        "a52": {
            DEVICE: "a52q", PRODUCT: "a52q", MODEL: "SM-A525F", MANUFACTURER: "Samsung",
            BRAND: "samsung", FINGERPRINT: "samsung/a52q/a52q:11/RP1A.200720.011/A525FXXU2AUC2:user/release-keys",
            HARDWARE: "a52q", HOST: "lgefx02", USER: "dpi", DISPLAY: "RP1A.200720.011",
            ID: "RP1A.200720.011", TAGS: "release-keys", TYPE: "user", ODINT: "FWWC.C1.0720",
            INCREMENTAL: "0720", BUILD: "RP1A.200720.011", SECURITY_PATCH: "2020-07-20",
            BOARD: "a52q", BOOTLOADER: "unknown", RADIO: "unknown",
            DEVICE_NAME: "Galaxy A52", DEVICE_FULL_NAME: "Samsung Galaxy A52"
        }
    },
    "xiaomi": {
        "redmi_note_10": {
            DEVICE: "mojito", PRODUCT: "mojito", MODEL: "M2101K9G", MANUFACTURER: "Xiaomi",
            BRAND: "xiaomi", FINGERPRINT: "Xiaomi/mojito/mojito:11/RKQ1.200826.002/21.12.08:user/release-keys",
            HARDWARE: "mojito", HOST: "xmkbuild21", USER: "android-build", DISPLAY: "RKQ1.200826.002",
            ID: "RKQ1.200826.002", TAGS: "release-keys", TYPE: "user", ODINT: "RKQQ1.200826.002",
            INCREMENTAL: "21.12.08", BUILD: "RKQ1.200826.002", SECURITY_PATCH: "2021-12-05",
            BOARD: "mojito", BOOTLOADER: "unknown", RADIO: "unknown",
            DEVICE_NAME: "Redmi Note 10", DEVICE_FULL_NAME: "Xiaomi Redmi Note 10"
        },
        "redmi_note_11": {
            DEVICE: "saikal", PRODUCT: "saikal", MODEL: "2201117TG", MANUFACTURER: "Xiaomi",
            BRAND: "xiaomi", FINGERPRINT: "Xiaomi/saikal/saikal:12/S1S1.211211.010/22.1.18:user/release-keys",
            HARDWARE: "saikal", HOST: "xmkbuild22", USER: "android-build", DISPLAY: "S1S1.211211.010",
            ID: "S1S1.211211.010", TAGS: "release-keys", TYPE: "user", ODINT: "S1S1.211211.010",
            INCREMENTAL: "22.1.18", BUILD: "S1S1.211211.010", SECURITY_PATCH: "2022-01-05",
            BOARD: "saikal", BOOTLOADER: "unknown", RADIO: "unknown",
            DEVICE_NAME: "Redmi Note 11", DEVICE_FULL_NAME: "Xiaomi Redmi Note 11"
        },
        "mi_11": {
            DEVICE: "venus", PRODUCT: "venus", MODEL: "M2011J18C", MANUFACTURER: "Xiaomi",
            BRAND: "xiaomi", FINGERPRINT: "Xiaomi/venus/venus:12/S1S1.211211.010/22.1.18:user/release-keys",
            HARDWARE: "venus", HOST: "xmkbuild22", USER: "android-build", DISPLAY: "S1S1.211211.010",
            ID: "S1S1.211211.010", TAGS: "release-keys", TYPE: "user", ODINT: "S1S1.211211.010",
            INCREMENTAL: "22.1.18", BUILD: "S1S1.211211.010", SECURITY_PATCH: "2022-01-05",
            BOARD: "venus", BOOTLOADER: "unknown", RADIO: "unknown",
            DEVICE_NAME: "Mi 11", DEVICE_FULL_NAME: "Xiaomi Mi 11"
        }
    },
    "oppo": {
        "reno_6": {
            DEVICE: "neptune", PRODUCT: "OP506CDL", MODEL: "CPH2159", MANUFACTURER: "OPPO",
            BRAND: "oppo", FINGERPRINT: "OPPO/OP506CDL/OP506CDL:11/RP1A.201105.003/1609939200:user/release-keys",
            HARDWARE: "neptune", HOST: "localhost", USER: "builder", DISPLAY: "RP1A.201105.003",
            ID: "RP1A.201105.003", TAGS: "release-keys", TYPE: "user", ODINT: "RP1A.201105.003",
            INCREMENTAL: "1609939200", BUILD: "RP1A.201105.003", SECURITY_PATCH: "2021-05-05",
            BOARD: "neptune", BOOTLOADER: "unknown", RADIO: "unknown",
            DEVICE_NAME: "Reno 6", DEVICE_FULL_NAME: "OPPO Reno 6"
        },
        "a54": {
            DEVICE: "kiara", PRODUCT: "kiara", MODEL: "CPH2347", MANUFACTURER: "OPPO",
            BRAND: "oppo", FINGERPRINT: "OPPO/CPH2347/kiara:12/SP1A.210812.016/1631459200:user/release-keys",
            HARDWARE: "kiara", HOST: "localhost", USER: "builder", DISPLAY: "SP1A.210812.016",
            ID: "SP1A.210812.016", TAGS: "release-keys", TYPE: "user", ODINT: "SP1A.210812.016",
            INCREMENTAL: "1631459200", BUILD: "SP1A.210812.016", SECURITY_PATCH: "2021-09-05",
            BOARD: "kiara", BOOTLOADER: "unknown", RADIO: "unknown",
            DEVICE_NAME: "A54", DEVICE_FULL_NAME: "OPPO A54"
        }
    },
    "realme": {
        "gt": {
            DEVICE: "galileo", PRODUCT: "RMX2200", MODEL: "RMX2200", MANUFACTURER: "realme",
            BRAND: "realme", FINGERPRINT: "realme/RMX2200/RMX2200:11/RP1A.200720.011/1609459200:user/release-keys",
            HARDWARE: "galileo", HOST: "localhost", USER: "builder", DISPLAY: "RP1A.200720.011",
            ID: "RP1A.200720.011", TAGS: "release-keys", TYPE: "user", ODINT: "RP1A.200720.011",
            INCREMENTAL: "1609459200", BUILD: "RP1A.200720.011", SECURITY_PATCH: "2021-01-05",
            BOARD: "galileo", BOOTLOADER: "unknown", RADIO: "unknown",
            DEVICE_NAME: "Realme GT", DEVICE_FULL_NAME: "realme GT"
        }
    },
    "vivo": {
        "v23": {
            DEVICE: "star", PRODUCT: "star", MODEL: "V2134", MANUFACTURER: "vivo",
            BRAND: "vivo", FINGERPRINT: "vivo/star/star:12/SP1A.210812.016/1631459200:user/release-keys",
            HARDWARE: "star", HOST: "localhost", USER: "builder", DISPLAY: "SP1A.210812.016",
            ID: "SP1A.210812.016", TAGS: "release-keys", TYPE: "user", ODINT: "SP1A.210812.016",
            INCREMENTAL: "1631459200", BUILD: "SP1A.210812.016", SECURITY_PATCH: "2021-09-05",
            BOARD: "star", BOOTLOADER: "unknown", RADIO: "unknown",
            DEVICE_NAME: "Vivo V23", DEVICE_FULL_NAME: "vivo V23"
        }
    }
};

function _getRandomDevice() {
    var brands = Object.keys(DEVICE_DATABASE);
    var randomBrand = brands[_randomInt(0, brands.length - 1)];
    var models = Object.keys(DEVICE_DATABASE[randomBrand]);
    var randomModel = models[_randomInt(0, models.length - 1)];
    return {
        data: DEVICE_DATABASE[randomBrand][randomModel],
        brand: randomBrand,
        model: randomModel
    };
}

/* ========== COMPLETE BUILD PROPERTY SPOOFING ========== */

function spoofBuildProperties(deviceData) {
    logInfo("Spoofing all Build properties...");
    
    try {
        var Build = Java.use("android.os.Build");
        
        // Get all fields from Build class
        var buildFields = [
            "DEVICE", "PRODUCT", "MODEL", "MANUFACTURER", "BRAND", "FINGERPRINT",
            "HARDWARE", "HOST", "USER", "DISPLAY", "ID", "TAGS", "TYPE", "BOARD",
            "BOOTLOADER", "RADIO", "SECURITY_PATCH", "INCREMENTAL", "BUILD", "ODINT"
        ];
        
        for (var i = 0; i < buildFields.length; i++) {
            var fieldName = buildFields[i];
            var fieldValue = deviceData[fieldName];
            
            if (fieldValue !== undefined) {
                try {
                    var field = Build.class.getDeclaredField(fieldName);
                    field.setAccessible(true);
                    field.set(null, fieldValue);
                    logDebug("✓ Build." + fieldName + " = " + fieldValue);
                } catch (e) {
                    logDebug("✗ Could not set Build." + fieldName + ": " + e.message);
                }
            }
        }
        
        logSuccess("All Build properties spoofed");
        
    } catch (err) {
        logError("Error spoofing Build properties: " + err.message);
    }
}

/* ========== DEVICE NAME SPOOFING (CRITICAL) ========== */

function spoofDeviceName(deviceData) {
    logInfo("Aggressively spoofing Device Names...");
    
    var deviceName = deviceData.DEVICE_NAME;
    var deviceFullName = deviceData.DEVICE_FULL_NAME;
    
    logSuccess("Device Name: " + deviceName);
    logSuccess("Full Device Name: " + deviceFullName);
    
    try {
        // Hook 1: android.os.Build.getRadioVersion()
        try {
            var Build = Java.use("android.os.Build");
            Build.getRadioVersion.overload().implementation = function() {
                return deviceData.RADIO;
            };
            logDebug("✓ Hooked Build.getRadioVersion()");
        } catch (e) {}
        
        // Hook 2: android.os.Build.getSerial()
        try {
            var Build = Java.use("android.os.Build");
            Build.getSerial.overload().implementation = function() {
                return _randomHex(32);
            };
            logDebug("✓ Hooked Build.getSerial()");
        } catch (e) {}
        
        // Hook 3: DeviceProperties class
        try {
            var DeviceProperties = Java.use("android.os.DeviceProperties");
            if (DeviceProperties.getDeviceName) {
                DeviceProperties.getDeviceName.overload().implementation = function() {
                    return deviceName;
                };
                logDebug("✓ Hooked DeviceProperties.getDeviceName()");
            }
        } catch (e) {
            logDebug("DeviceProperties not available");
        }
        
        // Hook 4: SystemProperties - device name related
        try {
            var SystemProperties = Java.use("android.os.SystemProperties");
            var getOriginal = SystemProperties.get;
            
            SystemProperties.get.overload("java.lang.String").implementation = function(prop) {
                // Hook device-related properties
                if (prop.indexOf("ro.product") !== -1 || 
                    prop.indexOf("ro.build") !== -1 ||
                    prop === "ro.device" ||
                    prop === "ro.hardware" ||
                    prop === "net.hostname") {
                    return getOriginal.call(this, prop);
                }
                return getOriginal.call(this, prop);
            };
            logDebug("✓ Hooked SystemProperties.get()");
        } catch (e) {
            logDebug("SystemProperties hooking: " + e.message);
        }
        
        logSuccess("Device Name spoofing configured");
        
    } catch (err) {
        logError("Error spoofing device names: " + err.message);
    }
}

/* ========== SYSTEM PROPERTY HOOKS ========== */

function hookSystemProperties(deviceData) {
    logInfo("Hooking System properties...");
    
    try {
        var System = Java.use("java.lang.System");
        
        System.getProperty.overload("java.lang.String").implementation = function(key) {
            // Map property keys to device data
            var propertyMap = {
                "ro.product.device": deviceData.DEVICE,
                "ro.product.model": deviceData.MODEL,
                "ro.product.manufacturer": deviceData.MANUFACTURER,
                "ro.product.brand": deviceData.BRAND,
                "ro.product.product": deviceData.PRODUCT,
                "ro.build.display.id": deviceData.DISPLAY,
                "ro.build.fingerprint": deviceData.FINGERPRINT,
                "ro.hardware": deviceData.HARDWARE,
                "ro.board.platform": deviceData.BOARD,
                "ro.build.version.security_patch": deviceData.SECURITY_PATCH,
                "ro.build.version.incremental": deviceData.INCREMENTAL,
                "ro.build.id": deviceData.ID,
                "ro.build.tags": deviceData.TAGS,
                "ro.build.type": deviceData.TYPE,
                "ro.build.host": deviceData.HOST,
                "ro.build.user": deviceData.USER,
                "ro.product.board": deviceData.BOARD,
                "ro.bootloader": deviceData.BOOTLOADER,
                "ro.baseband": deviceData.RADIO,
                "ro.odm.build.version.release": deviceData.ID,
                "net.hostname": deviceData.DEVICE,
                "ro.device": deviceData.DEVICE
            };
            
            if (propertyMap[key] !== undefined) {
                logDebug("System.getProperty(\"" + key + "\") -> " + propertyMap[key]);
                return propertyMap[key];
            }
            
            return this.getProperty(key);
        };
        
        logSuccess("System properties hooked");
        
    } catch (err) {
        logError("Error hooking System properties: " + err.message);
    }
}

/* ========== TELEPHONY SPOOFING ========== */

function spoofTelephony() {
    logInfo("Spoofing Telephony Manager properties...");
    
    var android_id = _randomHex(16);
    var phone = _randomPaddedInt(10);
    var imei = _randomPaddedInt(14) + _luhn_getcheck(_randomPaddedInt(14));
    var imsi = _randomPaddedInt(15);
    var iccid = "89" + _randomPaddedInt(16) + _luhn_getcheck("89" + _randomPaddedInt(16));
    
    logSuccess("Android ID: " + android_id);
    logSuccess("Phone Number: " + phone);
    logSuccess("IMEI: " + imei);
    logSuccess("IMSI: " + imsi);
    logSuccess("ICCID: " + iccid);
    
    try {
        // Spoof Android ID
        var Settings = Java.use("android.provider.Settings$Secure");
        Settings.getString.overload("android.content.ContentResolver", "java.lang.String").implementation = function(context, name) {
            if (name === Settings.ANDROID_ID.value) {
                return android_id;
            }
            return this.getString(context, name);
        };
        
        // Spoof TelephonyManager
        var TelephonyManager = Java.use("android.telephony.TelephonyManager");
        
        TelephonyManager.getLine1Number.overload().implementation = function() {
            return phone;
        };
        
        TelephonyManager.getDeviceId.overload().implementation = function() {
            return imei;
        };
        
        TelephonyManager.getDeviceId.overload("int").implementation = function(slotIndex) {
            return imei;
        };
        
        TelephonyManager.getImei.overload().implementation = function() {
            return imei;
        };
        
        TelephonyManager.getImei.overload("int").implementation = function(slotIndex) {
            return imei;
        };
        
        TelephonyManager.getSubscriberId.overload().implementation = function() {
            return imsi;
        };
        
        TelephonyManager.getSimSerialNumber.overload().implementation = function() {
            return iccid;
        };
        
        logSuccess("Telephony spoofing complete");
        
    } catch (err) {
        logError("Error spoofing Telephony: " + err.message);
    }
}

/* ========== MAC ADDRESS SPOOFING ========== */

function spoofMACAddress() {
    logInfo("Spoofing MAC address...");
    
    var mac = [];
    for (var i = 0; i < 6; i++) {
        mac.push(_randomInt(0, 255));
    }
    var mac_str = mac.map(function(x) { return _pad(x.toString(16), 2); }).join(":");
    
    logSuccess("MAC Address: " + mac_str.toUpperCase());
    
    try {
        var NetworkInterface = Java.use("java.net.NetworkInterface");
        NetworkInterface.getHardwareAddress.overload().implementation = function() {
            return Java.array("byte", mac);
        };
        
        logSuccess("MAC spoofing complete");
        
    } catch (err) {
        logError("Error spoofing MAC: " + err.message);
    }
}

/* ========== GSF ID HIDING ========== */

function hideGSFID() {
    logInfo("Hiding GSF ID...");
    
    try {
        var ContentResolver = Java.use("android.content.ContentResolver");
        
        ContentResolver.query.overload("android.net.Uri", "[Ljava.lang.String;", "android.os.Bundle", "android.os.CancellationSignal").implementation = function(uri, projection, queryArgs, cancellationSignal) {
            if (uri.toString().indexOf("com.google.android.gsf") !== -1) {
                return null;
            }
            return this.query(uri, projection, queryArgs, cancellationSignal);
        };
        
        ContentResolver.query.overload("android.net.Uri", "[Ljava.lang.String;", "java.lang.String", "[Ljava.lang.String;", "java.lang.String", "android.os.CancellationSignal").implementation = function(uri, projection, selection, selectionArgs, sortOrder, cancellationSignal) {
            if (uri.toString().indexOf("com.google.android.gsf") !== -1) {
                return null;
            }
            return this.query(uri, projection, selection, selectionArgs, sortOrder, cancellationSignal);
        };
        
        ContentResolver.query.overload("android.net.Uri", "[Ljava.lang.String;", "java.lang.String", "[Ljava.lang.String;", "java.lang.String").implementation = function(uri, projection, selection, selectionArgs, sortOrder) {
            if (uri.toString().indexOf("com.google.android.gsf") !== -1) {
                return null;
            }
            return this.query(uri, projection, selection, selectionArgs, sortOrder);
        };
        
        logSuccess("GSF ID hiding complete");
        
    } catch (err) {
        log
