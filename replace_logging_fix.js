<<<<<<< SEARCH
        pw.close();
        bw.close();
        fw.close();
    } catch (e) {
        // Fallback or ignore if write permissions are not available
    }
}
=======
        pw.close();
        bw.close();
        fw.close();
    } catch (e) {
        // Fallback to app's private directory if external storage is denied by SecurityException
        if (ERROR_LOG_FILE === "/sdcard/Download/fail.txt") {
            var context = null;
            try {
                var ActivityThread = Java.use('android.app.ActivityThread');
                context = ActivityThread.currentApplication().getApplicationContext();
            } catch (err) {}

            if (context) {
                ERROR_LOG_FILE = context.getFilesDir().getAbsolutePath() + "/fail.txt";
                ERROR_LOG_INITIALIZED = false; // reset to clear the new file
                _writeErrorToFile(msg); // retry
            }
        }
    }
}
>>>>>>> REPLACE
