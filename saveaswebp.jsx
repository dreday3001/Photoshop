function saveWebP(compType, compValue, xmpData, exifData, psData, asCopy, fileName) {
 
    var versionNumber = app.version.split(".");
    var versionCheck = parseInt(versionNumber);
    // Fail
    if (versionCheck < 23) {
        alert("You must use Photoshop 2022 or later to save using native WebP format...");
    // Pass
    } else {
        // Doc and path save variables
        var WebPDocName = activeDocument.name.replace(/\.[^\.]+$/, ''); // Remove file extension
        var WebPSavePath = "~/Desktop" + "/" + WebPDocName + fileName + ".webp" // Change path as needed
        var WebPFile = new File(WebPSavePath); // Create the file object
        
        /*
        // Check for existing file object
        if (WebPFile.exists) {
            // true = 'No' as default active button
            if (!confirm("File exists, overwrite: Yes or No?", true))
                // throw alert("Script cancelled!");
                throw null;
        }
        */

        function s2t(s) {
            return app.stringIDToTypeID(s);
        }
        var descriptor = new ActionDescriptor();
        var descriptor2 = new ActionDescriptor();

        // Compression parameters = "compressionLossless" | "compressionLossy"
        descriptor2.putEnumerated(s2t("compression"), s2t("WebPCompression"), s2t(compType)); // string variable
        var WebPCompIsLossless = false; // set the default flag for compression
        if (WebPCompIsLossless == false) {
            // 0 (lowest lossy quality) - 100 (highest lossy quality)
            descriptor2.putInteger(s2t("quality"), compValue); //  number variable
        }
        
        // Metadata options
        descriptor2.putBoolean(s2t("includeXMPData"), xmpData); // Boolean param moved to function call
        descriptor2.putBoolean(s2t("includeEXIFData"), exifData); // Boolean param moved to function call
        descriptor2.putBoolean(s2t("includePsExtras"), psData); // Boolean param moved to function call
        
        // WebP format and save path
        descriptor.putObject(s2t("as"), s2t("WebPFormat"), descriptor2);
        descriptor.putPath(s2t("in"), WebPFile); // Save path variable
        
        // Save As = false | Save As a Copy = true
        descriptor.putBoolean(s2t("copy"), asCopy); // Boolean param moved to function call
        
        // The extension
        descriptor.putBoolean(s2t("lowerCase"), true);

        // If the doc isn't in RGB mode, convert to sRGB
        if (activeDocument.mode !== DocumentMode.RGB) {
            activeDocument.convertProfile("sRGB IEC61966-2.1", Intent.RELATIVECOLORIMETRIC, true, false);
            activeDocument.changeMode(ChangeMode.RGB);
        }

        // If the doc is in RGB mode, convert to sRGB
        //activeDocument.convertProfile("sRGB IEC61966-2.1", Intent.RELATIVECOLORIMETRIC, true, false);

        // Convert to 8 bpc
        activeDocument.bitsPerChannel = BitsPerChannelType.EIGHT;
        
        // Execute the save
        executeAction(s2t("save"), descriptor, DialogModes.NO); // Change NO to ALL for dialog
    }
}

function hideAll(document) {
    for(var i = 0 ; i < document.layers.length; i++) {
        document.layers[i].visible = false;
    }
}

function showAll(document) {
    for(var i = 0 ; i < document.layers.length; i++) {
        document.layers[i].visible = true;
    }
}

var doc = app.activeDocument;
var layerName = "";

for(var i = 0 ; i < doc.layers.length; i++) {
    hideAll(doc);
    doc.layers[i].visible = true;
    layerName = doc.layers[i].name;
    saveWebP("compressionLossy", 75, true, true, true, false, layerName + " " + i);
    doc.layers[1].visible = false;
}
showAll(doc);
saveWebP("compressionLossy", 75, true, true, true, false, " - all");