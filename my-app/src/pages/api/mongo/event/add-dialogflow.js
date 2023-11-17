import connectDB from '@/lib/mongodb';
import Event from '@/models/event';
import { sendEmail } from '@/server/mailService';
import Thread from "@/models/threads/thread";

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const {
        claim_boat: publicClaimBoat,
        contact_email: email,
        contact_phone: phoneNumber,
        container_filled: publicContainerFullness,
        debris_additional_desc,
        debris_coordinates: publicLatLongOrPositionDesc,
        debris_land_micro_desc,
        debris_nearest_island: closestIsland,
        debris_nearby_landmark: closestLandmark,
        debris_landmark_relative_location: debrisLandmarkRelativeLocation,
        debris_sea_micro_desc,
        debris_type: publicType,
        land_debris_location_desc,
        marine_life_scale: publicBiofoulingRating,
        reporter_contact_name,
        sea_debris_land_distance,
      } = await req.body.sessionInfo?.parameters;

      const publicLocationDesc = land_debris_location_desc || sea_debris_land_distance;
      const publicDebrisEnvDesc = debris_land_micro_desc || debris_sea_micro_desc || 'none';
      const publicDebrisEnvAdditionalDesc = debris_additional_desc;

      // this is sketchy but whatever
      const firstName = reporter_contact_name[0]?.original?.split(' ')[0];
      const restOfName = reporter_contact_name[0]?.original?.split(' ');
      restOfName.shift();
      const lastName = restOfName.join(' ');

      await connectDB();

      const eventDetails = {
        status: 'Reported',
        publicType,
        reportedDate: new Date(),
        publicBiofoulingRating,
        publicLocationDesc,
        publicLatLongOrPositionDesc,
        closestLandmark: closestLandmark?.original,
        debrisLandmarkRelativeLocation,
        publicDebrisEnvDesc,
        publicDebrisEnvAdditionalDesc,
        publicContact: {
          firstName: firstName || 'John',
          lastName: lastName || 'Doe',
          email,
          phoneNumber,
        },
      }

      if (publicContainerFullness) {
        eventDetails.publicContainerFullness = publicContainerFullness;
      }
      if (publicClaimBoat) {
        eventDetails.publicClaimBoat = publicClaimBoat ? 'Yes' : 'No';
      }
      if (closestIsland) {
        eventDetails.closestIsland = closestIsland;
      }

      const created = await Event.create(eventDetails);

      const newThread = await Thread.create({
        eventId: created._id,
      });

      await Event.findByIdAndUpdate(created._id, { threadId: newThread._id });

      const containerFullness = publicContainerFullness ? `<b>Container Fullness:</b> ${publicContainerFullness}<br/>` : '';
      const claimBoat = publicClaimBoat ? `<b>Intend to Claim Boat:</b> ${publicClaimBoat}<br/>` : '';
      const latLongOrPositionDescription = publicLatLongOrPositionDesc ? `<b>Position Description:</b> ${publicLatLongOrPositionDesc}<br/>` : '';
      const location = publicLocationDesc === 'Greater than three miles from land'
        ? '' : `<b>Nearest Island:</b> ${closestIsland}<br/><b>Nearest Landmark:</b> ${closestLandmark}<br/><b>Landmark Relative Location:</b> ${debrisLandmarkRelativeLocation}<br/>`;
      const additionalDesc = publicDebrisEnvAdditionalDesc ? `<b>Additional Description:</b> ${publicDebrisEnvAdditionalDesc}<br/>` : '';

      const emailMessage = `
        Aloha,
        <br/><br/>
        We recieved a new debris report! Details:
        <br/><br/>
        <b>Type:</b> ${publicType !== 'Other' ? publicType : `Other - ${publicTypeDesc}`}<br/>
        ${containerFullness}
        ${claimBoat}
        ${location}
        ${latLongOrPositionDescription}
        <b>Location Description:</b> ${publicLocationDesc}<br/>
        <b>Debris Description:</b> ${publicDebrisEnvDesc}<br/>
        ${additionalDesc}
        <b>Biofouling Rating:</b> ${publicBiofoulingRating} / 10<br/>
        <br/>
        <b>Reporter Name:</b> ${lastName}, ${firstName}<br/>
        <b>Reporter Email:</b> ${email}<br/>
        <b>Reporter Phone:</b> ${phoneNumber}<br/>
        <b>Report Method:</b> ${req.body.payload?.telephony ? 'AI Call Center' : 'AI Text Chatbot'}<br/>
        <br/>
        <a href="https://makai-marine.vercel.app/event/${created._id}">See more details</a>
        <br/><br/>
        Mahalo!<br/><br/>
        Center for Marine Debris Research
        <br/><br/><hr/>
        <i>This is an automated message. Please do not reply to this email.</i>
      `;
      await sendEmail('New Debris Report', null, emailMessage);
      res.status(200).json({msg: 'Event reported'});
    } catch (error) {
      console.log(error);
      res.status(500).json({error: 'Unable to report event'});
    }
  } else {
    res.status(405).json({error: 'Method not allowed'});
  }
}
