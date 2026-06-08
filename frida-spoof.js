/* ============================================
   FRIDA SPOOF SCRIPT - ULTIMATE DEVICE SPOOFING
   All Build Properties & Deep System Hooks
   Version: 4.2 - REAL NEW DEVICE COMPLETE
   Target: POCO F3 Complete Spoof + Full New Device
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
    return _pad(_randomInt(0, Math.pow(10, length) - 1), length);
}

function _randomSerialNo() {
    var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    var result = "";
    for (var i = 0; i < 8; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
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

/* ========== DEVICE DATABASE EXTENDED ========== */

var DEVICE_DATABASE = {
    "samsung": {
        "s21": {
            DEVICE: "d1", PRODUCT: "d1q", MODEL: "SM-G991B", MANUFACTURER: "Samsung",
            BRAND: "samsung", FINGERPRINT: "samsung/d1q/d1:12/SPB1/G991BXXU1AUC2:user/release-keys",
            HARDWARE: "d1", HOST: "lgefx02", USER: "dpi", DISPLAY: "SPB1.201120.019",
            ID: "SPB1.201120.019", TAGS: "release-keys", TYPE: "user", BOARD: "d1",
            BOOTLOADER: "G991BXXU1AUC2", RADIO: "exynos9830",
            DEVICE_NAME: "Galaxy S21", DEVICE_FULL_NAME: "Samsung Galaxy S21",
            PRODUCT_NAME: "d1q", SDK_INT: 31, RELEASE: "12",
            FIRST_API_LEVEL: "31", SECURITY_PATCH: "2021-12-05", VNDK_VERSION: "31"
        },
        "s20": {
            DEVICE: "y2q", PRODUCT: "y2q", MODEL: "SM-G980F", MANUFACTURER: "Samsung",
            BRAND: "samsung", FINGERPRINT: "samsung/y2q/y2q:11/RP1A.200720.011/G980FXXU1ATJ1:user/release-keys",
            HARDWARE: "y2q", HOST: "lgefx02", USER: "dpi", DISPLAY: "RP1A.200720.011",
            ID: "RP1A.200720.011", TAGS: "release-keys", TYPE: "user", BOARD: "y2q",
            BOOTLOADER: "G980FXXU1ATJ1", RADIO: "exynos990",
            DEVICE_NAME: "Galaxy S20", DEVICE_FULL_NAME: "Samsung Galaxy S20",
            PRODUCT_NAME: "y2q", SDK_INT: 30, RELEASE: "11",
            FIRST_API_LEVEL: "29", SECURITY_PATCH: "2020-07-20", VNDK_VERSION: "30"
        }
    },
    "xiaomi": {
        "mi_11": {
            DEVICE: "venus", PRODUCT: "venus", MODEL: "M2011J18C", MANUFACTURER: "Xiaomi",
            BRAND: "xiaomi", FINGERPRINT: "Xiaomi/venus/venus:12/S1S1.211211.010/22.1.18:user/release-keys",
            HARDWARE: "venus", HOST: "xmkbuild22", USER: "android-build", DISPLAY: "S1S1.211211.010",
            ID: "S1S1.211211.010", TAGS: "release-keys", TYPE: "user", BOARD: "venus",
            BOOTLOADER: "unknown", RADIO: "msm",
            DEVICE_NAME: "Mi 11", DEVICE_FULL_NAME: "Xiaomi Mi 11",
            PRODUCT_NAME: "venus", SDK_INT: 31, RELEASE: "12",
            FIRST_API_LEVEL: "30", SECURITY_PATCH: "2021-12-10", VNDK_VERSION: "31"
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

function _randomUuid() {
    var hex = _randomHex(32);
    return hex.substring(0, 8) + "-" + hex.substring(8, 12) + "-" + hex.substring(12, 16) + "-" + hex.substring(16, 20) + "-" + hex.substring(20);
}

function _randomImei() {
    var base = _randomPaddedInt(14);
    return base + _luhn_getcheck(base);
}

function _randomIccid() {
    var base = "89" + _randomPaddedInt(16);
    return base + _luhn_getcheck(base);
}

function _randomMacBytes() {
    var mac = [];
    for (var i = 0; i < 6; i++) {
        mac.push(_randomInt(0, 255));
    }

    // Locally administered unicast MAC: realistic for randomized Android Wi-Fi MACs.
    mac[0] = (mac[0] | 0x02) & 0xfe;
    return mac;
}

function _macBytesToString(mac) {
    return mac.map(function(x) { return _pad(x.toString(16), 2); }).join(":").toUpperCase();
}

function createSpoofProfile(deviceData) {
    var serialNo = _randomSerialNo();
    var androidId = _randomHex(16);
    var phone = _randomPaddedInt(10);
    var imei = _randomImei();
    var imsi = _randomPaddedInt(15);
    var iccid = _randomIccid();
    var macBytes = _randomMacBytes();

    return {
        serialNo: serialNo,
        androidId: androidId,
        phone: phone,
        imei: imei,
        imsi: imsi,
        iccid: iccid,
        macBytes: macBytes,
        macString: _macBytesToString(macBytes),
        advertisingId: _randomUuid(),
        bootTime: Date.now() - _randomInt(3600000, 604800000),
        firstInstallTime: Date.now() - _randomInt(86400000, 604800000),
        lastUpdateTime: Date.now(),
        deviceName: deviceData.DEVICE_NAME || deviceData.DEVICE_FULL_NAME || deviceData.MODEL
    };
}

/* ========== EXTENDED SYSTEM PROPERTIES HOOKING ========== */

function hookExtendedSystemProperties(deviceData, spoofProfile) {
    logInfo("Hooking EXTENDED system properties (real new device)...");

    try {
        var System = Java.use("java.lang.System");
        var serialNo = spoofProfile.serialNo;

        var propertyMap = {
            // Standard Device Properties
            "ro.product.device": deviceData.DEVICE,
            "ro.product.model": deviceData.MODEL,
            "ro.product.manufacturer": deviceData.MANUFACTURER,
            "ro.product.brand": deviceData.BRAND,
            "ro.product.product": deviceData.PRODUCT,
            "ro.product.name": deviceData.PRODUCT_NAME,

            // Build/Fingerprint Properties
            "ro.build.display.id": deviceData.DISPLAY,
            "ro.build.fingerprint": deviceData.FINGERPRINT,
            "ro.build.id": deviceData.ID,
            "ro.build.tags": deviceData.TAGS,
            "ro.build.type": deviceData.TYPE,
            "ro.build.host": deviceData.HOST,
            "ro.build.user": deviceData.USER,
            "ro.build.version.sdk": String(deviceData.SDK_INT),
            "ro.build.version.release": deviceData.RELEASE,
            "ro.build.version.security_patch": deviceData.SECURITY_PATCH,

            // Hardware Properties
            "ro.hardware": deviceData.HARDWARE,
            "ro.hardware.keystore": "msm8998",
            "ro.board.platform": deviceData.BOARD,
            "ro.bootloader": deviceData.BOOTLOADER,
            "ro.baseband": deviceData.RADIO,

            // Serial/Unique Identifiers
            "ro.serialno": serialNo,
            "ro.boot.serialno": serialNo,
            "persist.sys.serial": serialNo,
            "ro.vendor.product.serial": serialNo,

            // First API Level (critical for new device detection)
            "ro.product.first_api_level": String(deviceData.FIRST_API_LEVEL),
            "ro.board.first_api_level": String(deviceData.FIRST_API_LEVEL),

            // VNDK Version
            "ro.product.vndk.version": String(deviceData.VNDK_VERSION),

            // Security Properties
            "ro.secure": "1",
            "ro.debuggable": "0",
            "ro.boot.verifiedbootstate": "green",
            "ro.boot.flash.locked": "1",

            // Market/device names often used by Device Info apps and OEM SDKs
            "ro.product.marketname": deviceData.DEVICE_NAME,
            "ro.vendor.product.marketname": deviceData.DEVICE_NAME,
            "ro.product.vendor.marketname": deviceData.DEVICE_NAME,
            "ro.config.marketing_name": deviceData.DEVICE_NAME,
            "ro.product.system.model": deviceData.MODEL,
            "ro.product.vendor.model": deviceData.MODEL,
            "ro.product.odm.model": deviceData.MODEL,
            "ro.product.system.device": deviceData.DEVICE,
            "ro.product.vendor.device": deviceData.DEVICE,
            "ro.product.odm.device": deviceData.DEVICE,
            "ro.product.system.brand": deviceData.BRAND,
            "ro.product.vendor.brand": deviceData.BRAND,
            "ro.product.odm.brand": deviceData.BRAND,
            "ro.product.system.manufacturer": deviceData.MANUFACTURER,
            "ro.product.vendor.manufacturer": deviceData.MANUFACTURER,
            "ro.product.odm.manufacturer": deviceData.MANUFACTURER,

            // Network Hostname
            "net.hostname": deviceData.DEVICE,
            "net.change": _randomHex(16)
        };

        System.getProperty.overload("java.lang.String").implementation = function(key) {
            if (propertyMap[key] !== undefined) {
                logDebug("System.getProperty(\"" + key + "\") -> " + propertyMap[key]);
                return propertyMap[key];
            }
            return this.getProperty(key);
        };

        try {
            var SystemProperties = Java.use("android.os.SystemProperties");

            SystemProperties.get.overload("java.lang.String").implementation = function(key) {
                if (propertyMap[key] !== undefined) {
                    logDebug("SystemProperties.get(\"" + key + "\") -> " + propertyMap[key]);
                    return propertyMap[key];
                }
                return this.get(key);
            };

            SystemProperties.get.overload("java.lang.String", "java.lang.String").implementation = function(key, def) {
                if (propertyMap[key] !== undefined) {
                    logDebug("SystemProperties.get(\"" + key + "\", def) -> " + propertyMap[key]);
                    return propertyMap[key];
                }
                return this.get(key, def);
            };

            try {
                SystemProperties.native_get.overload("java.lang.String").implementation = function(key) {
                    if (propertyMap[key] !== undefined) {
                        logDebug("SystemProperties.native_get(\"" + key + "\") -> " + propertyMap[key]);
                        return propertyMap[key];
                    }
                    return this.native_get(key);
                };
            } catch (nativeOneArgErr) {
                logDebug("SystemProperties.native_get 1-arg hook skipped: " + nativeOneArgErr.message);
            }

            try {
                SystemProperties.native_get.overload("java.lang.String", "java.lang.String").implementation = function(key, def) {
                    if (propertyMap[key] !== undefined) {
                        logDebug("SystemProperties.native_get(\"" + key + "\", def) -> " + propertyMap[key]);
                        return propertyMap[key];
                    }
                    return this.native_get(key, def);
                };
            } catch (nativeTwoArgErr) {
                logDebug("SystemProperties.native_get 2-arg hook skipped: " + nativeTwoArgErr.message);
            }
        } catch (e) {
            logDebug("SystemProperties hook skipped: " + e.message);
        }

        logSuccess("Extended system properties hooked");

    } catch (err) {
        logError("Error hooking extended properties: " + err.message);
    }
}

/* ========== BUILD CLASS DEEP HOOKING ========== */

function deepSpoofBuildProperties(deviceData, spoofProfile) {
    logInfo("Deep spoofing ALL Build class fields...");

    try {
        var Build = Java.use("android.os.Build");
        var serialNo = spoofProfile.serialNo;

        var buildFields = {
            "DEVICE": deviceData.DEVICE,
            "PRODUCT": deviceData.PRODUCT,
            "MODEL": deviceData.MODEL,
            "MANUFACTURER": deviceData.MANUFACTURER,
            "BRAND": deviceData.BRAND,
            "FINGERPRINT": deviceData.FINGERPRINT,
            "HARDWARE": deviceData.HARDWARE,
            "HOST": deviceData.HOST,
            "USER": deviceData.USER,
            "DISPLAY": deviceData.DISPLAY,
            "ID": deviceData.ID,
            "TAGS": deviceData.TAGS,
            "TYPE": deviceData.TYPE,
            "BOARD": deviceData.BOARD,
            "BOOTLOADER": deviceData.BOOTLOADER,
            "RADIO": deviceData.RADIO,
            "SERIAL": serialNo,
            "IS_DEBUGGABLE": false
        };

        for (var fieldName in buildFields) {
            var fieldValue = buildFields[fieldName];

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
                logDebug("Build." + fieldName + ": " + e.message);
            }
        }

        try {
            Build.getSerial.overload().implementation = function() {
                logDebug("Build.getSerial() -> " + serialNo);
                return serialNo;
            };
        } catch (e) {
            logDebug("Build.getSerial hook skipped: " + e.message);
        }

        logSuccess("Build properties deep spoofed");

    } catch (err) {
        logError("Error in Build spoofing: " + err.message);
    }
}

/* ========== BUILD VERSION HOOKING ========== */

function spoofBuildVersion(deviceData) {
    logInfo("Spoofing Build.VERSION & Build.VERSION_CODES...");

    try {
        var Version = Java.use("android.os.Build$VERSION");

        Version.SDK_INT.value = deviceData.SDK_INT;
        logDebug("✓ SDK_INT = " + deviceData.SDK_INT);

        Version.RELEASE.value = deviceData.RELEASE;
        logDebug("✓ RELEASE = " + deviceData.RELEASE);

        Version.SECURITY_PATCH.value = deviceData.SECURITY_PATCH;
        logDebug("✓ SECURITY_PATCH = " + deviceData.SECURITY_PATCH);

        Version.PREVIEW_SDK_INT.value = 0;
        logDebug("✓ PREVIEW_SDK_INT = 0");

        logSuccess("Build.VERSION spoofed");
    } catch (err) {
        logError("Error spoofing Build.VERSION: " + err.message);
    }
}

/* ========== DEVICE SETTINGS HOOKING ========== */

function hookDeviceSettings(deviceData, spoofProfile) {
    logInfo("Hooking Device Settings...");

    var spoofedDeviceName = spoofProfile.deviceName;
    var deviceNameSettings = {
        "device_name": spoofedDeviceName,
        "bluetooth_name": spoofedDeviceName,
        "wifi_p2p_device_name": spoofedDeviceName,
        "lock_screen_owner_info": "",
        "lock_screen_owner_info_enabled": "0"
    };

    function hookSettingsClass(className) {
        try {
            var SettingsClass = Java.use(className);

            try {
                SettingsClass.getString.overload("android.content.ContentResolver", "java.lang.String").implementation = function(resolver, name) {
                    if (deviceNameSettings[name] !== undefined) {
                        logDebug(className + ".getString(" + name + ") -> " + deviceNameSettings[name]);
                        return deviceNameSettings[name];
                    }
                    return this.getString(resolver, name);
                };
            } catch (e) {
                logDebug(className + ".getString hook skipped: " + e.message);
            }

            try {
                SettingsClass.getStringForUser.overload("android.content.ContentResolver", "java.lang.String", "int").implementation = function(resolver, name, userHandle) {
                    if (deviceNameSettings[name] !== undefined) {
                        logDebug(className + ".getStringForUser(" + name + ") -> " + deviceNameSettings[name]);
                        return deviceNameSettings[name];
                    }
                    return this.getStringForUser(resolver, name, userHandle);
                };
            } catch (e) {
                logDebug(className + ".getStringForUser hook skipped: " + e.message);
            }
        } catch (err) {
            logDebug(className + " hook unavailable: " + err.message);
        }
    }

    hookSettingsClass("android.provider.Settings$Global");
    hookSettingsClass("android.provider.Settings$Secure");
    hookSettingsClass("android.provider.Settings$System");

    try {
        var BluetoothAdapter = Java.use("android.bluetooth.BluetoothAdapter");
        BluetoothAdapter.getName.overload().implementation = function() {
            logDebug("BluetoothAdapter.getName() -> " + spoofedDeviceName);
            return spoofedDeviceName;
        };
    } catch (err) {
        logDebug("Bluetooth name hook unavailable: " + err.message);
    }

    try {
        var Build = Java.use("android.os.Build");
        Build.getRadioVersion.overload().implementation = function() {
            logDebug("Build.getRadioVersion() -> " + deviceData.RADIO);
            return deviceData.RADIO;
        };
    } catch (err) {
        logDebug("Build radio hook unavailable: " + err.message);
    }

    logSuccess("Device Settings hooked");
}

/* ========== SECURE SETTINGS SPOOFING ========== */

function spoofSecureSettings(deviceData, spoofProfile) {
    logInfo("Spoofing Secure Settings (android_id)...");

    try {
        var SettingsSecure = Java.use("android.provider.Settings$Secure");
        var android_id = spoofProfile.androidId;
        var secureSpoofMap = {
            "android_id": android_id
        };

        if (deviceData) {
            var spoofedDeviceName = spoofProfile.deviceName;
            secureSpoofMap.device_name = spoofedDeviceName;
            secureSpoofMap.bluetooth_name = spoofedDeviceName;
            secureSpoofMap.wifi_p2p_device_name = spoofedDeviceName;
        }

        SettingsSecure.getString.overload("android.content.ContentResolver", "java.lang.String").implementation = function(resolver, name) {
            if (secureSpoofMap[name] !== undefined) {
                logDebug(name + " -> " + secureSpoofMap[name]);
                return secureSpoofMap[name];
            }
            return this.getString(resolver, name);
        };

        try {
            SettingsSecure.getStringForUser.overload("android.content.ContentResolver", "java.lang.String", "int").implementation = function(resolver, name, userHandle) {
                if (secureSpoofMap[name] !== undefined) {
                    logDebug("Secure.getStringForUser(" + name + ") -> " + secureSpoofMap[name]);
                    return secureSpoofMap[name];
                }
                return this.getStringForUser(resolver, name, userHandle);
            };
        } catch (e) {
            logDebug("Secure.getStringForUser hook skipped: " + e.message);
        }

        logSuccess("Secure settings spoofed");

    } catch (err) {
        logDebug("Secure settings: " + err.message);
    }
}

/* ========== TELEPHONY SPOOFING ========== */

function spoofTelephony(spoofProfile) {
    logInfo("Spoofing Telephony (IMEI, IMSI, etc)...");

    var phone = spoofProfile.phone;
    var imei = spoofProfile.imei;
    var imsi = spoofProfile.imsi;
    var iccid = spoofProfile.iccid;

    logSuccess("Telephony IDs: IMEI=" + imei + ", IMSI=" + imsi);

    try {
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

function spoofMACAddress(spoofProfile) {
    logInfo("Spoofing MAC address...");

    var mac = spoofProfile.macBytes;
    var mac_str = spoofProfile.macString;

    logSuccess("MAC Address: " + mac_str);

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
    logInfo("Hiding GSF ID (Google Services Framework)...");

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

        logSuccess("GSF ID hidden");

    } catch (err) {
        logDebug("GSF hiding: " + err.message);
    }
}

/* ========== ADVERTISING ID SPOOFING ========== */

function spoofAdvertisingId(spoofProfile) {
    logInfo("Spoofing Advertising ID...");

    try {
        var AdvertisingIdClient = Java.use("com.google.android.gms.ads.identifier.AdvertisingIdClient");
        var Info = Java.use("com.google.android.gms.ads.identifier.AdvertisingIdClient$Info");
        var adid = spoofProfile.advertisingId;

        AdvertisingIdClient.getAdvertisingIdInfo.overload("android.content.Context").implementation = function(context) {
            logDebug("Advertising ID -> " + adid);
            return Info.$new(adid, false);
        };

        logSuccess("Advertising ID spoofed: " + adid);
    } catch (err) {
        logDebug("Advertising ID (GMS not available): " + err.message);
    }
}

/* ========== BOOT TIMESTAMP SPOOFING ========== */

function spoofBootTimestamps(spoofProfile) {
    logInfo("Spoofing boot timestamps (first setup)...");

    try {
        var System = Java.use("java.lang.System");
        var firstBootTime = spoofProfile.bootTime;

        // Spoof via system property
        var Build = Java.use("android.os.Build");
        try {
            var field = Build.class.getDeclaredField("TIME");
            field.setAccessible(true);
            var modifiersField = Java.use("java.lang.reflect.Field").class.getDeclaredField("modifiers");
            modifiersField.setAccessible(true);
            modifiersField.setInt(field, field.getModifiers() & ~Java.use("java.lang.reflect.Modifier").FINAL);
            field.set(null, firstBootTime);
            logDebug("✓ Build.TIME = " + firstBootTime);
        } catch(e) {
            logDebug("Build.TIME: " + e.message);
        }

        logSuccess("Boot timestamps spoofed");
    } catch (err) {
        logDebug("Boot timestamp error: " + err.message);
    }
}

/* ========== PACKAGE MANAGER SPOOFING (NEW) ========== */

function spoofPackageManager(spoofProfile) {
    logInfo("Spoofing Package Manager (installation dates)...");

    try {
        var PackageManager = Java.use("android.content.pm.PackageManager");
        var getPackageInfo = PackageManager.getPackageInfo;

        getPackageInfo.overload("java.lang.String", "int").implementation = function(packageName, flags) {
            var info = this.getPackageInfo(packageName, flags);

            // Spoof first install time to appear as pre-installed
            try {
                info.firstInstallTime = spoofProfile.firstInstallTime;
                info.lastUpdateTime = spoofProfile.lastUpdateTime;
            } catch(e) {}

            return info;
        };

        logSuccess("Package Manager spoofed");
    } catch (err) {
        logDebug("PackageManager spoof: " + err.message);
    }
}

/* ========== INITIALIZATION (NEW DEVICE MARKER) ========== */

function createNewDeviceMarker() {
    logInfo("Creating NEW DEVICE markers...");

    try {
        var File = Java.use("java.io.File");
        var Settings = Java.use("android.provider.Settings$Secure");

        // Spoof setup wizard completion flag
        try {
            Settings.putString.overload("android.content.ContentResolver", "java.lang.String", "java.lang.String").implementation = function(resolver, name, value) {
                if (name === "setup_wizard_completed") {
                    return 1;
                }
                return this.putString(resolver, name, value);
            };
            logDebug("Setup wizard marked as complete");
        } catch(e) {}

        logSuccess("New device markers created");
    } catch (err) {
        logDebug("Device marker error: " + err.message);
    }
}


/* ========== ANDROID 13+/14 DYNAMIC RECEIVER COMPATIBILITY ========== */

function hookDynamicReceiverFlags() {
    logInfo("Hooking dynamic BroadcastReceiver flags...");

    // Android 13 introduced explicit receiver visibility flags and Android 14
    // enforces them for apps targeting newer SDKs. Some target apps/libraries still
    // call the legacy 2-arg/4-arg registerReceiver overloads, which crashes with:
    // "One of RECEIVER_EXPORTED or RECEIVER_NOT_EXPORTED should be specified".
    var RECEIVER_NOT_EXPORTED = 0x4;

    function installHooks(className) {
        try {
            var Klass = Java.use(className);

            try {
                var legacyTwoArg = Klass.registerReceiver.overload(
                    "android.content.BroadcastReceiver",
                    "android.content.IntentFilter"
                );
                var flaggedThreeArg = Klass.registerReceiver.overload(
                    "android.content.BroadcastReceiver",
                    "android.content.IntentFilter",
                    "int"
                );

                legacyTwoArg.implementation = function(receiver, filter) {
                    logDebug(className + ".registerReceiver(receiver, filter) -> RECEIVER_NOT_EXPORTED");
                    return flaggedThreeArg.call(this, receiver, filter, RECEIVER_NOT_EXPORTED);
                };
            } catch (e) {
                logDebug(className + " 2-arg receiver hook skipped: " + e.message);
            }

            try {
                var legacyFourArg = Klass.registerReceiver.overload(
                    "android.content.BroadcastReceiver",
                    "android.content.IntentFilter",
                    "java.lang.String",
                    "android.os.Handler"
                );
                var flaggedFiveArg = Klass.registerReceiver.overload(
                    "android.content.BroadcastReceiver",
                    "android.content.IntentFilter",
                    "java.lang.String",
                    "android.os.Handler",
                    "int"
                );

                legacyFourArg.implementation = function(receiver, filter, broadcastPermission, scheduler) {
                    logDebug(className + ".registerReceiver(receiver, filter, permission, scheduler) -> RECEIVER_NOT_EXPORTED");
                    return flaggedFiveArg.call(this, receiver, filter, broadcastPermission, scheduler, RECEIVER_NOT_EXPORTED);
                };
            } catch (e) {
                logDebug(className + " 4-arg receiver hook skipped: " + e.message);
            }
        } catch (err) {
            logDebug(className + " receiver hook unavailable: " + err.message);
        }
    }

    installHooks("android.content.ContextWrapper");
    installHooks("android.app.ContextImpl");

    logSuccess("Dynamic BroadcastReceiver flags hooked");
}

/* ========== MAIN EXECUTION ========== */

Java.perform(function () {
    console.log("\n");
    console.log("\x1b[1m\x1b[34m╔════════════════════════════════════════════════════════════════╗\x1b[0m");
    console.log("\x1b[1m\x1b[34m║  FRIDA ULTIMATE DEVICE SPOOFING SCRIPT v4.2 - REAL NEW DEVICE ║\x1b[0m");
    console.log("\x1b[1m\x1b[34m║     Extended Properties + First Boot Detection Spoofing       ║\x1b[0m");
    console.log("\x1b[1m\x1b[34m║    Target: POCO F3 → Complete Random Device Transformation   ║\x1b[0m");
    console.log("\x1b[1m\x1b[34m║              " + getTimestamp() + "              ║\x1b[0m");
    console.log("\x1b[1m\x1b[34m╚════════════════════════════════════════════════════════════════╝\x1b[0m");

    try {
        var randomDevice = _getRandomDevice();
        var deviceData = randomDevice.data;
        var spoofProfile = createSpoofProfile(deviceData);

        console.log("\x1b[1m\x1b[33m[DEVICE SELECTED]\x1b[0m " + randomDevice.brand.toUpperCase() + " > " + randomDevice.model + "\n");

        hookDynamicReceiverFlags();
        console.log("");

        deepSpoofBuildProperties(deviceData, spoofProfile);
        console.log("");

        spoofBuildVersion(deviceData);
        console.log("");

        hookExtendedSystemProperties(deviceData, spoofProfile);
        console.log("");

        hookDeviceSettings(deviceData, spoofProfile);
        console.log("");

        spoofSecureSettings(deviceData, spoofProfile);
        console.log("");

        spoofTelephony(spoofProfile);
        console.log("");

        spoofMACAddress(spoofProfile);
        console.log("");

        spoofBootTimestamps(spoofProfile);
        console.log("");

        spoofAdvertisingId(spoofProfile);
        console.log("");

        spoofPackageManager(spoofProfile);
        console.log("");

        createNewDeviceMarker();
        console.log("");

        hideGSFID();
        console.log("");

        console.log("\x1b[1m\x1b[32m╔════════════════════════════════════════════════════════════════╗\x1b[0m");
        console.log("\x1b[1m\x1b[32m║    ✓✓✓ REAL NEW DEVICE HOOKS INSTALLED SUCCESSFULLY ✓✓✓      ║\x1b[0m");
        console.log("\x1b[1m\x1b[32m║                                                                ║\x1b[0m");
        console.log("\x1b[1m\x1b[32m║  Device Transformation: POCO F3 → " + randomDevice.brand.toUpperCase().padEnd(22) + "║\x1b[0m");
        console.log("\x1b[1m\x1b[32m║  Model: " + randomDevice.model.padEnd(57) + "║\x1b[0m");
        console.log("\x1b[1m\x1b[32m║                                                                ║\x1b[0m");
        console.log("\x1b[1m\x1b[32m║  ✓ Build properties spoofed (all fields)                      ║\x1b[0m");
        console.log("\x1b[1m\x1b[32m║  ✓ Serial numbers randomized                                 ║\x1b[0m");
        console.log("\x1b[1m\x1b[32m║  ✓ Telephony IDs spoofed (IMEI/IMSI/ICCID)                   ║\x1b[0m");
        console.log("\x1b[1m\x1b[32m║  ✓ First boot detection markers created                      ║\x1b[0m");
        console.log("\x1b[1m\x1b[32m║  ✓ Package manager install dates spoofed                     ║\x1b[0m");
        console.log("\x1b[1m\x1b[32m║  ✓ Appears as COMPLETELY NEW DEVICE                          ║\x1b[0m");
        console.log("\x1b[1m\x1b[32m║                                                                ║\x1b[0m");
        console.log("\x1b[1m\x1b[32m║  → Force Stop & Restart target app to activate all hooks     ║\x1b[0m");
        console.log("\x1b[1m\x1b[32m╚════════════════════════════════════════════════════════════════╝\x1b[0m");

    } catch (err) {
        logError("CRITICAL ERROR: " + err.message);
        console.error(err);
    }
});
