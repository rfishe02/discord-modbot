const { Events } = require('discord.js');
const sharp = require('sharp');
const axios = require('axios');

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
                                
                                // Convert the image to buffer and resize it
                                const fileName = attachment.proxyURL;
                                const response = await axios.get(fileName,  { responseType: 'arraybuffer' })
                                const buffer = Buffer.from(response.data, "utf-8")

                                const resizedImage = await sharp(buffer)
                                .resize(640, 480, {
                                    fit: sharp.fit.contain,
                                    withoutEnlargement: true
                                })
                                .toFormat('jpeg')
                                .toBuffer();

                                // Run safe search detection and build an array of flags
                                await client.safeSearchDetection(resizedImage).then(response => {
                                    const detections = response[0].safeSearchAnnotation;
                                    console.log(detections);

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
                                            if (racyContent == 'UNKNOWN' || racyContent == "VERY_LIKELY") {
                                                contentDetected.push('racy');
                                            }
                                        }
                                    } else {
                                        // Possible issue reading thing?
                                        contentDetected.push('none-detected');
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

                    // Squish the detected flags, for output / judgement purposes
                    const flagSet = new Set(imageAttachmentFlags.reduce((accumulator, currentValue) => [...accumulator,...currentValue]));
                    console.log(flagSet)

                    if (flagSet.size > 0) {
                        message.delete()
                        .then(msg => console.log(`Deleted message from ${msg.author.username}`))
                        .catch(console.error);
                        
                        message.channel.send(`Removed low quality post. Sorry ${message.author}.`)
                        .then(msg => console.log(`Sent message: ${msg.content}`))
                        .catch(console.error);

                    }
    
                }       
            }
     
            if (message.embeds){
                if(message.embeds.length > 0){
                    //console.log(message.embeds);
                }
            }

        } catch (e) {

            // Hide message?

            console.log(e);
        }

	},
};