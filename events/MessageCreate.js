const { Events } = require('discord.js');

// Imports the Google Cloud client library
const vision = require('@google-cloud/vision');

module.exports = {
	name: Events.MessageCreate,
	async execute(message) {

        try {

            // Creates a client
            const client = new vision.ImageAnnotatorClient();

            if (message.attachments) {
                if(message.attachments.size > 0) {
    
                    const imageAttachmentFlags = await Promise.all(message.attachments.map(async function (attachment){
                        var contentDetected = [];

                        const contentType = attachment.contentType;
                        if(contentType) {
                            if(contentType.includes("image")){
                                const fileName = attachment.proxyURL;
                                await client.safeSearchDetection(fileName).then(response => {
                                    const detections = response[0].safeSearchAnnotation;

                                    if(detections) {
                                        const adultContent = detections.adult;
                                        if (adultContent) {
                                            if (adultContent == 'UNKNOWN' || adultContent == "LIKELY" || adultContent == "VERY_LIKELY") {
                                                contentDetected.push('adult');
                                            }
                                        }
                                        const medicalContent = detections.medical;
                                        if (medicalContent) {
                                            if (medicalContent == 'UNKNOWN' || medicalContent == "LIKELY" || medicalContent == "VERY_LIKELY") {
                                                contentDetected.push('medical');
                                            }
                                        }
                                        const violentContent = detections.violence;
                                        if (violentContent) {
                                            if (violentContent == 'UNKNOWN' || violentContent == "LIKELY" || violentContent == "VERY_LIKELY") {
                                                contentDetected.push('violence');
                                            }
                                        }
                                        const racyContent = detections.racy;
                                        if (racyContent) {
                                            if (racyContent == 'UNKNOWN' || racyContent == "LIKELY" || racyContent == "VERY_LIKELY") {
                                                contentDetected.push('racy');
                                            }
                                        }
                                    } else {
                                        // Possible issue reading thing?
                                        contentDetected.push('none');
                                    }
                                })
                                .catch(err => {
                                    console.error(err);
                                    contentDetected.push('error');
                                });
                            }
                        }
                        return contentDetected;
                    }));

                    const flagSet = new Set(imageAttachmentFlags.reduce((accumulator, currentValue) => [...accumulator,...currentValue]));
 
                    console.log(flagSet)
    
                }       
            }
     
            if (message.embeds){
                if(message.embeds.length > 0){
                    console.log(message.embeds);
                }
            }

        } catch (e) {

            // Hide message?

            console.log(e);
        }

	},
};