<<<<<<< SEARCH
            for (var i = 0; i < packages.size(); i++) {
                var package_info = packages.get(i);
                var package_name = package_info.packageName.value;

                var is_suspicious = false;
                for (var j = 0; j < suspicious_packages.length; j++) {
                    if (package_name === suspicious_packages[j]) {
                        logDebug("Hidden suspicious package in getInstalledPackages: " + package_name);
                        is_suspicious = true;
                        break;
                    }
                }

                if (!is_suspicious) {
                    filtered_packages.push(package_info);
                }
            }
=======
            for (var i = 0; i < packages.size(); i++) {
                var package_info = packages.get(i);
                if (!package_info) continue;

                var package_name = "";
                try {
                    package_name = package_info.packageName.value ? String(package_info.packageName.value) : String(package_info.packageName);
                } catch(e) {
                    try { package_name = String(package_info.packageName); } catch(err) {}
                }

                var is_suspicious = false;
                if (package_name) {
                    for (var j = 0; j < suspicious_packages.length; j++) {
                        if (package_name === suspicious_packages[j]) {
                            logDebug("Hidden suspicious package in getInstalledPackages: " + package_name);
                            is_suspicious = true;
                            break;
                        }
                    }
                }

                if (!is_suspicious) {
                    filtered_packages.push(package_info);
                }
            }
>>>>>>> REPLACE
<<<<<<< SEARCH
            for (var i = 0; i < apps.size(); i++) {
                var app_info = apps.get(i);
                var package_name = app_info.packageName.value;

                var is_suspicious = false;
                for (var j = 0; j < suspicious_packages.length; j++) {
                    if (package_name === suspicious_packages[j]) {
                        logDebug("Hidden suspicious package in getInstalledApplications: " + package_name);
                        is_suspicious = true;
                        break;
                    }
                }

                if (!is_suspicious) {
                    filtered_apps.push(app_info);
                }
            }
=======
            for (var i = 0; i < apps.size(); i++) {
                var app_info = apps.get(i);
                if (!app_info) continue;

                var package_name = "";
                try {
                    package_name = app_info.packageName.value ? String(app_info.packageName.value) : String(app_info.packageName);
                } catch(e) {
                    try { package_name = String(app_info.packageName); } catch(err) {}
                }

                var is_suspicious = false;
                if (package_name) {
                    for (var j = 0; j < suspicious_packages.length; j++) {
                        if (package_name === suspicious_packages[j]) {
                            logDebug("Hidden suspicious package in getInstalledApplications: " + package_name);
                            is_suspicious = true;
                            break;
                        }
                    }
                }

                if (!is_suspicious) {
                    filtered_apps.push(app_info);
                }
            }
>>>>>>> REPLACE
