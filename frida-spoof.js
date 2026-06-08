/* ============================================
   FRIDA SPOOF SCRIPT - ULTIMATE DEVICE SPOOFING
   All Build Properties & Deep System Hooks
   Version: 4.0 - FINAL AGGRESSIVE HOOKING
   Target: POCO F3 Complete Spoof
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

/* ========== DEVICE DATABASE WITH ALL VARIANTS ========== */

var DEVICE_DATABASE = {
    "samsung": {
        "s21": {
            DEVICE: "d1", PRODUCT: "d1q", MODEL: "SM-G991B", MANUFACTURER: "Samsung",
            BRAND: "samsung", FINGERPRINT: "samsung/d1q/d1:12/SPB1/G991BXXU1AUC2:user/release-keys",
            HARDWARE: "d1", HOST: "lgefx02", USER: "dpi", DISPLAY: "SPB1.201120.019",
            ID: "SPB1.201120.019", TAGS: "release-keys", TYPE: "user", BOARD: "d1",
            BOOTLOADER: "unknown", RADIO: "unknown",
            DEVICE_NAME: "Galaxy S21", DEVICE_FULL_NAME: "Samsung Galaxy S21",
            PRODUCT_NAME: "d1q"
        },
        "s20": {
            DEVICE: "y2q", PRODUCT: "y2q", MODEL: "SM-G980F", MANUFACTURER: "Samsung",
            BRAND: "samsung", FINGERPRINT: "samsung/y2q/y2q:11/RP1A.200720.011/G980FXXU1ATJ1:user/release-keys",
            HARDWARE: "y2q", HOST: "lgefx02", USER: "dpi", DISPLAY: "RP1A.200720.011",
            ID: "RP1A.200720.011", TAGS: "release-keys", TYPE: "user", BOARD: "y2q",
            BOOTLOADER: "unknown", RADIO: "unknown",
            DEVICE_NAME: "Galaxy S20", DEVICE_FULL_NAME: "Samsung Galaxy S20",
            PRODUCT_NAME: "y2q"
        }
    },
    "xiaomi": {
        "mi_11": {
            DEVICE: "venus", PRODUCT: "venus", MODEL: "M2011J18C", MANUFACTURER: "Xiaomi",
            BRAND: "xiaomi", FINGERPRINT: "Xiaomi/venus/venus:12/S1S1.211211.010/22.1.18:user/release-keys",
            HARDWARE: "venus", HOST: "xmkbuild22", USER: "android-build", DISPLAY: "S1S1.211211.010",
            ID: "S1S1.211211.010", TAGS: "release-keys", TYPE: "user", BOARD: "venus",
            BOOTLOADER: "unknown", RADIO: "unknown",
            DEVICE_NAME: "Mi 11", DEVICE_FULL_NAME: "Xiaomi Mi 11",
            PRODUCT_NAME: "venus"
        },
        "redmi_note_11": {
            DEVICE: "saikal", PRODUCT: "saikal", MODEL: "2201117TG", MANUFACTURER: "Xiaomi",
            BRAND: "xiaomi", FINGERPRINT: "Xiaomi/saikal/saikal:12/S1S1.211211.010/22.1.18:user/release-keys",
            HARDWARE: "saikal", HOST: "xmkbuild22", USER: "android-build", DISPLAY: "S1S1.211211.010",
            ID: "S1S1.211211.010", TAGS: "release-keys", TYPE: "user", BOARD: "saikal",
            BOOTLOADER: "unknown", RADIO: "unknown",
            DEVICE_NAME: "Redmi Note 11", DEVICE_FULL_NAME: "Xiaomi Redmi Note 11",
            PRODUCT_NAME: "saikal"
        }
    },
    "oppo": {
        "a54": {
            DEVICE: "kiara", PRODUCT: "kiara", MODEL: "CPH2347", MANUFACTURER: "OPPO",
            BRAND: "oppo", FINGERPRINT: "OPPO/CPH2347/kiara:12/SP1A.210812.016/1631459200:user/release-keys",
            HARDWARE: "kiara", HOST: "localhost", USER: "builder", DISPLAY: "SP1A.210812.016",
            ID: "SP1A.210812.016", TAGS: "release-keys", TYPE: "user", BOARD: "kiara",
            BOOTLOADER: "unknown", RADIO: "unknown",
            DEVICE_NAME: "A54", DEVICE_FULL_NAME: "OPPO A54",
            PRODUCT_NAME: "kiara"
        }
    },
    "realme": {
        "gt": {
            DEVICE: "galileo", PRODUCT: "RMX2200", MODEL: "RMX2200", MANUFACTURER: "realme",
            BRAND: "realme", FINGERPRINT: "realme/RMX2200/RMX2200:11/RP1A.200720.011/1609459200:user/release-keys",
            HARDWARE: "galileo", HOST: "localhost", USER: "builder", DISPLAY: "RP1A.200720.011",
            ID: "RP1A.200720.011", TAGS: "release-keys", TYPE: "user", BOARD: "galileo",
            BOOTLOADER: "unknown", RADIO: "unknown",
            DEVICE_NAME: "Realme GT", DEVICE_FULL_NAME: "realme GT",
            PRODUCT_NAME: "RMX2200"
        }
    },
    "vivo": {
        "v23": {
            DEVICE: "star", PRODUCT: "star", MODEL: "V2134", MANUFACTURER: "vivo",
            BRAND: "vivo", FINGERPRINT: "vivo/star/star:12/SP1A.210812.016/1631459200:user/release-keys",
            HARDWARE: "star", HOST: "localhost", USER: "builder", DISPLAY: "SP1A.210812.016",
            ID: "SP1A.210812.016", TAGS: "release-keys", TYPE: "user", BOARD: "star",
            BOOTLOADER: "unknown", RADIO: "unknown",
            DEVICE_NAME: "Vivo V23", DEVICE_FULL_NAME: "vivo V23",
            PRODUCT_NAME: "star"
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

/* ========== AGGRESSIVE SYSTEM PROPERTIES HOOKING ========== */

function hookAllSystemProperties(deviceData) {
    logInfo("Hooking ALL system properties (aggressive)...");
    
    try {
        var System = Java.use("java.lang.System");
        
        var propertyMap = {
            "ro.product.device": deviceData.DEVICE,
            "ro.product.model": deviceData.MODEL,
            "ro.product.manufacturer": deviceData.MANUFACTURER,
            "ro.product.brand": deviceData.BRAND,
            "ro.product.product": deviceData.PRODUCT,
            "ro.product.name": deviceData.PRODUCT_NAME,
            "ro.build.display.id": deviceData.DISPLAY,
            "ro.build.fingerprint": deviceData.FINGERPRINT,
            "ro.hardware": deviceData.HARDWARE,
            "ro.board.platform": deviceData.BOARD,
            "ro.build.id": deviceData.ID,
            "ro.build.tags": deviceData.TAGS,
            "ro.build.type": deviceData.TYPE,
            "ro.build.host": deviceData.HOST,
            "ro.build.user": deviceData.USER,
            "ro.product.board": deviceData.BOARD,
            "ro.bootloader": deviceData.BOOTLOADER,
            "ro.baseband": deviceData.RADIO,
            "ro.device": deviceData.DEVICE,
            "net.hostname": deviceData.DEVICE
        };
        
        System.getProperty.overload("java.lang.String").implementation = function(key) {
            if (propertyMap[key] !== undefined) {
                logDebug("System.getProperty(\"" + key + "\") -> " + propertyMap[key]);
                return propertyMap[key];
            }
            return this.getProperty(key);
        };
        
        logSuccess("System properties hooked (aggressive)");
        
    } catch (err) {
        logError("Error hooking System properties: " + err.message);
    }
}

/* ========== BUILD CLASS DEEP HOOKING ========== */

function deepSpoofBuildProperties(deviceData) {
    logInfo("Deep spoofing Build class properties...");
    
    try {
        var Build = Java.use("android.os.Build");
        
        var buildFields = [
            "DEVICE", "PRODUCT", "MODEL", "MANUFACTURER", "BRAND", "FINGERPRINT",
            "HARDWARE", "HOST", "USER", "DISPLAY", "ID", "TAGS", "TYPE", "BOARD",
            "BOOTLOADER", "RADIO"
        ];
        
        for (var i = 0; i < buildFields.length; i++) {
            var fieldName = buildFields[i];
            var fieldValue = deviceData[fieldName];
            
            if (fieldValue !== undefined) {
                try {
                    var field = Build.class.getDeclaredField(fieldName);
                    field.setAccessible(true);
                    
                    try {
                        var modifiersField = Java.use("java.lang.reflect.Field").class.getDeclaredField("modifiers");
                        modifiersField.setAccessible(true);
                        modifiersField.setInt(field, field.getModifiers() & ~Java.use("java.lang.reflect.Modifier").FINAL);
                    } catch (e) {}
                    
                    field.set(null, fieldValue);
                    logDebug("✓ Build." + fieldName + " = " + fieldValue);
                } catch (e) {
                    logDebug("✗ Build." + fieldName + ": " + e.message);
                }
            }
        }
        
        logSuccess("Build properties deep spoofed");
        
    } catch (err) {
        logError("Error deep spoofing Build properties: " + err.message);
    }
}

/* ========== DEVICE SETTINGS HOOKING ========== */

function hookDeviceSettings(deviceData) {
    logInfo("Hooking Device Settings...");
    
    try {
        var Settings = Java.use("android.provider.Settings");
        
        try {
            var SettingsGlobal = Java.use("android.provider.Settings$Global");
            var getString = SettingsGlobal.getString.overload("android.content.ContentResolver", "java.lang.String");
            
            getString.implementation = function(resolver, name) {
                if (name === "device_name" || name === "bluetooth_name") {
                    logDebug("Settings.Global.getString(\"" + name + "\") -> " + deviceData.DEVICE_FULL_NAME);
                    return deviceData.DEVICE_FULL_NAME;
                }
                return this.getString(resolver, name);
            };
            logDebug("✓ Settings.Global hooked");
        } catch (e) {
            logDebug("Settings.Global: " + e.message);
        }
        
        logSuccess("Device Settings hooked");
        
    } catch (err) {
        logDebug("Settings hooking: " + err.message);
    }
}

/* ========== TELEPHONY SPOOFING ========== */

function spoofTelephony() {
    logInfo("Spoofing Telephony properties...");
    
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
        var Settings = Java.use("android.provider.Settings$Secure");
        Settings.getString.overload("android.content.ContentResolver", "java.lang.String").implementation = function(context, name) {
            if (name === Settings.ANDROID_ID.value) {
                return android_id;
            }
            return this.getString(context, name);
        };
        
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
        logError("Telephony error: " + err.message);
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
        logError("MAC error: " + err.message);
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
        logError("GSF error: " + err.message);
    }
}

/* ========== MAIN EXECUTION ========== */

Java.perform(function () {
    console.log("\n");
    console.log("\x1b[1m\x1b[34m╔══════════════════════════════════════════════════════════╗\x1b[0m");
    console.log("\x1b[1m\x1b[34m║      FRIDA ULTIMATE DEVICE SPOOFING SCRIPT v4.0          ║\x1b[0m");
    console.log("\x1b[1m\x1b[34m║     FINAL - AGGRESSIVE ALL-LEVEL HOOKING               ║\x1b[0m");
    console.log("\x1b[1m\x1b[34m║     Target: Complete POCO F3 to Random Device Spoof    ║\x1b[0m");
    console.log("\x1b[1m\x1b[34m║           Timestamp: " + getTimestamp() + "           ║\x1b[0m");
    console.log("\x1b[1m\x1b[34m╚══════════════════════════════════════════════════════════╝\x1b[0m\n");
    
    try {
        var randomDevice = _getRandomDevice();
        var deviceData = randomDevice.data;
        
        console.log("\x1b[1m\x1b[33m[DEVICE SELECTED]\x1b[0m " + randomDevice.brand.toUpperCase() + " - " + randomDevice.model + "\n");
        
        deepSpoofBuildProperties(deviceData);
        console.log("");
        
        hookAllSystemProperties(deviceData);
        console.log("");
        
        hookDeviceSettings(deviceData);
        console.log("");
        
        spoofTelephony();
        console.log("");
        
        spoofMACAddress();
        console.log("");
        
        hideGSFID();
        console.log("");
        
        console.log("\x1b[1m\x1b[32m╔══════════════════════════════════════════════════════════╗\x1b[0m");
        console.log("\x1b[1m\x1b[32m║        ✓ ALL SPOOFING HOOKS INSTALLED SUCCESSFULLY!       ║\x1b[0m");
        console.log("\x1b[1m\x1b[32m║    Device Completely Transformed (POCO F3 -> " + randomDevice.brand.toUpperCase().padEnd(13) + ")║\x1b[0m");
        console.log("\x1b[1m\x1b[32m║     Force Stop & Restart App to See Complete Changes    ║\x1b[0m");
        console.log("\x1b[1m\x1b[32m╚══════════════════════════════════════════════════════════╝\x1b[0m\n");
        
    } catch (err) {
        logError("CRITICAL ERROR: " + err.message);
        console.error(err);
    }
});
