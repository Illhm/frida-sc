<<<<<<< SEARCH
                var package_name = "";
                try {
                    package_name = package_info.packageName.value ? String(package_info.packageName.value) : String(package_info.packageName);
                } catch(e) {
                    try { package_name = String(package_info.packageName); } catch(err) {}
                }
=======
                var package_name = "";
                try {
                    package_name = String(package_info.packageName.value);
                } catch(e) {
                    try { package_name = String(package_info.packageName); } catch(err) {}
                }
>>>>>>> REPLACE
<<<<<<< SEARCH
                var package_name = "";
                try {
                    package_name = app_info.packageName.value ? String(app_info.packageName.value) : String(app_info.packageName);
                } catch(e) {
                    try { package_name = String(app_info.packageName); } catch(err) {}
                }
=======
                var package_name = "";
                try {
                    package_name = String(app_info.packageName.value);
                } catch(e) {
                    try { package_name = String(app_info.packageName); } catch(err) {}
                }
>>>>>>> REPLACE
