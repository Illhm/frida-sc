<<<<<<< SEARCH
        try {
            PackageManager.getInstallerPackageName.overload("java.lang.String").implementation = function(packageName) {
                logDebug("PackageManager.getInstallerPackageName(" + packageName + ") -> " + installSource);
                return installSource;
            };
        } catch (e) {
            logDebug("PackageManager.getInstallerPackageName hook skipped: " + e.message);
        }
=======
        try {
            PackageManager.getInstallerPackageName.overload("java.lang.String").implementation = function(packageName) {
                logDebug("PackageManager.getInstallerPackageName(" + packageName + ") -> " + installSource);
                return installSource;
            };
        } catch (e) {
            logDebug("PackageManager.getInstallerPackageName hook skipped: " + e.message);
        }

        try {
            var ApplicationPackageManager = Java.use("android.app.ApplicationPackageManager");
            ApplicationPackageManager.getInstallerPackageName.overload('java.lang.String').implementation = function(Str) {
                logDebug("ApplicationPackageManager.getInstallerPackageName(" + Str + ") -> " + installSource);
                return installSource;
            };
        } catch (e) {
            logDebug("ApplicationPackageManager.getInstallerPackageName hook skipped: " + e.message);
        }
>>>>>>> REPLACE
