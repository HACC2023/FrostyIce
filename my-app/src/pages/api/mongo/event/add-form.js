import connectDB from '@/lib/mongodb';
import Event from '@/models/event';
import { sendEmail } from '@/server/mailService';
import { findCloseIsland } from "@/utils/findCloseIsland";
import Thread from "@/models/threads/thread";

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const {
        publicType,
        publicTypeDesc,
        publicContainerFullness,
        publicClaimBoat,
        publicBiofoulingRating,
        publicLocationDesc,
        publicLatLongOrPositionDesc,
        mapLat,
        mapLong,
        publicDebrisEnvDesc,
        publicDebrisEnvAdditionalDesc,
        imageUrl,
        firstName,
        lastName,
        email,
        phoneNumber,
      } = await req.body;

      let derivedClosetIsland;

      if (mapLat && mapLong) {
        derivedClosetIsland = findCloseIsland(mapLat, mapLong);
      }

      await connectDB();

      const created = await Event.create({
        status: 'Reported',
        publicType,
        publicTypeDesc,
        reportedDate: new Date(),
        publicContainerFullness,
        publicClaimBoat,
        publicBiofoulingRating,
        publicLocationDesc,
        publicLatLongOrPositionDesc,
        mapLat,
        mapLong,
        closestIsland: derivedClosetIsland,
        publicDebrisEnvDesc,
        publicDebrisEnvAdditionalDesc,
        imageUrl,
        publicContact: {
          firstName,
          lastName,
          email,
          phoneNumber,
        },
      });

      const newThread = await Thread.create({
        eventId: created._id,
      });

      await Event.findByIdAndUpdate(created._id, { threadId: newThread._id });

      const containerFullness = publicContainerFullness ? `<b>Container Fullness:</b> ${publicContainerFullness}<br/>` : '';
      const claimBoat = publicClaimBoat ? `<b>Intend to Claim Boat:</b> ${publicClaimBoat}<br/>` : '';
      const latLongOrPositionDescription = publicLatLongOrPositionDesc ? `<b>Position Description:</b> ${publicLatLongOrPositionDesc}<br/>` : '';
      const additionalDesc = publicDebrisEnvAdditionalDesc ? `<b>Additional Description:</b> ${publicDebrisEnvAdditionalDesc}<br/>` : '';

      const emailMessage = `
        Aloha,
        <br/><br/>
        We received a new debris report! Details:
        <br/><br/>
        <b>Type:</b> ${publicType !== 'Other' ? publicType : `Other - ${publicTypeDesc}`}<br/>
        ${containerFullness}
        ${claimBoat}
        <b>Lat:</b> ${mapLat}<br/
        <b>Long:</b> ${mapLong}<br/>
        <b>Nearest Island:</b> ${derivedClosetIsland}<br/>
        ${latLongOrPositionDescription}
        <b>Location Description:</b> ${publicLocationDesc}<br/>
        <b>Debris Description:</b> ${publicDebrisEnvDesc}<br/>
        ${additionalDesc}
        <b>Biofouling Rating:</b> ${publicBiofoulingRating} / 10<br/>
        <br/>
        <b>Reporter Name:</b> ${lastName}, ${firstName}<br/>
        <b>Reporter Email:</b> ${email}<br/>
        <b>Reporter Phone:</b> ${phoneNumber}<br/>
        <b>Report Method:</b> Online Form<br/>
        <br/>
        <a href="https://makai-marine.vercel.app/event/${created._id}">See more details</a>
        <br/><br/>
        Mahalo!<br/><br/>
        Center for Marine Debris Research
        <br/><br/><hr/>
        <i>This is an automated message. Please do not reply to this email.</i>
      `;
      await sendEmail('New Debris Report', null, emailMessage);
      res.status(201).json({msg: 'Event reported'});
    } catch (error) {
      console.log(error);
      res.status(500).json({error: 'Unable to report event'});
    }
  } else {
    res.status(405).json({error: 'Method not allowed'});
  }
}
