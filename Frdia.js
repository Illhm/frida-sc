Java.perform(function() {
    console.log("[*] Starting Android Build Spoofing...");

    var Build = Java.use("android.os.Build");
    var Version = Java.use("android.os.Build$VERSION");

    var spoofedValues = {
        BOARD: "spoofed_board",
        BRAND: "spoofed_brand",
        DEVICE: "spoofed_device",
        HARDWARE: "spoofed_hardware",
        MANUFACTURER: "spoofed_manufacturer",
        MODEL: "spoofed_model",
        PRODUCT: "spoofed_product"
    };

    // Spoof Build fields using reflection
    for (var key in spoofedValues) {
        try {
            var field = Build.class.getDeclaredField(key);
            field.setAccessible(true);

            try {
                var modifiersField = Java.use("java.lang.reflect.Field").class.getDeclaredField("modifiers");
                modifiersField.setAccessible(true);
                // Remove the final modifier
                modifiersField.setInt(field, field.getModifiers() & ~Java.use("java.lang.reflect.Modifier").FINAL.value);
            } catch (e) {
                // Ignore modifier changes error
            }

            field.set(null, spoofedValues[key]);
            console.log("[+] Spoofed Build." + key + " = " + spoofedValues[key]);
        } catch (e) {
            console.log("[-] Failed to spoof Build." + key + ": " + e.message);
        }
    }

    // Spoof Build.VERSION.RELEASE and SDK_INT
    try {
        Version.RELEASE.value = "13";
        console.log("[+] Spoofed Build.VERSION.RELEASE = 13");
    } catch (e) {
        console.log("[-] Failed to spoof Build.VERSION.RELEASE: " + e.message);
    }

    try {
        Version.SDK_INT.value = 33;
        console.log("[+] Spoofed Build.VERSION.SDK_INT = 33");
    } catch (e) {
        console.log("[-] Failed to spoof Build.VERSION.SDK_INT: " + e.message);
    }

    console.log("[*] Android Build Spoofing Completed.");
});
