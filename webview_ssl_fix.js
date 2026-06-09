<<<<<<< SEARCH
    // Bypass HttpsURLConnection HostnameVerifier
    try {
        var HttpsURLConnection = Java.use("javax.net.ssl.HttpsURLConnection");
        HttpsURLConnection.setDefaultHostnameVerifier.implementation = function(hostnameVerifier) {
            logDebug("HttpsURLConnection.setDefaultHostnameVerifier() bypassed");
            return;
        };
        HttpsURLConnection.setHostnameVerifier.implementation = function(hostnameVerifier) {
            logDebug("HttpsURLConnection.setHostnameVerifier() bypassed");
            return;
        };
        logSuccess("HttpsURLConnection HostnameVerifier bypassed");
    } catch (e) {
        logError("HttpsURLConnection HostnameVerifier bypass failed: " + e);
    }
=======
    // Bypass HttpsURLConnection HostnameVerifier
    try {
        var HttpsURLConnection = Java.use("javax.net.ssl.HttpsURLConnection");
        HttpsURLConnection.setDefaultHostnameVerifier.implementation = function(hostnameVerifier) {
            logDebug("HttpsURLConnection.setDefaultHostnameVerifier() bypassed");
            return;
        };
        HttpsURLConnection.setHostnameVerifier.implementation = function(hostnameVerifier) {
            logDebug("HttpsURLConnection.setHostnameVerifier() bypassed");
            return;
        };
        logSuccess("HttpsURLConnection HostnameVerifier bypassed");
    } catch (e) {
        logError("HttpsURLConnection HostnameVerifier bypass failed: " + e);
    }

    // Bypass Android WebViewClient SslErrorHandler
    try {
        var WebViewClient = Java.use("android.webkit.WebViewClient");
        WebViewClient.onReceivedSslError.overload("android.webkit.WebView", "android.webkit.SslErrorHandler", "android.net.http.SslError").implementation = function(view, handler, error) {
            logDebug("WebViewClient.onReceivedSslError() (SslErrorHandler) bypassed");
            handler.proceed();
        };
        logSuccess("WebViewClient SslErrorHandler bypassed");
    } catch (e) {
        logDebug("WebViewClient SslErrorHandler bypass failed or not found");
    }

    try {
        var WebViewClient2 = Java.use("android.webkit.WebViewClient");
        WebViewClient2.onReceivedSslError.overload("android.webkit.WebView", "android.webkit.WebResourceRequest", "android.webkit.WebResourceError").implementation = function(view, request, error) {
            logDebug("WebViewClient.onReceivedSslError() (WebResourceError) bypassed");
        };
        logSuccess("WebViewClient WebResourceError bypassed");
    } catch (e) {
        logDebug("WebViewClient WebResourceError bypass failed or not found");
    }

    // Bypass Apache Cordova WebViewClient
    try {
        var CordovaWebViewClient = Java.use("org.apache.cordova.CordovaWebViewClient");
        CordovaWebViewClient.onReceivedSslError.overload("android.webkit.WebView", "android.webkit.SslErrorHandler", "android.net.http.SslError").implementation = function(view, handler, error) {
            logDebug("CordovaWebViewClient.onReceivedSslError() bypassed");
            handler.proceed();
        };
        logSuccess("CordovaWebViewClient bypassed");
    } catch (e) {
        logDebug("CordovaWebViewClient not found, skipping");
    }

    // Bypass Boye AbstractVerifier
    try {
        var BoyeAbstractVerifier = Java.use("ch.boye.httpclientandroidlib.conn.ssl.AbstractVerifier");
        BoyeAbstractVerifier.verify.implementation = function(host, ssl) {
            logDebug("Boye AbstractVerifier bypassed for host: " + host);
        };
        logSuccess("Boye AbstractVerifier bypassed");
    } catch (e) {
        logDebug("Boye AbstractVerifier not found, skipping");
    }
>>>>>>> REPLACE
