import connectDB from '@/lib/mongodb';
import Event from '@/models/event';
import Organization from "@/models/organization";
import Thread from "@/models/threads/thread";
import { findCloseIsland } from "@/utils/findCloseIsland";

/*

this is a development endpoint to easily add events to the database

 */

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const {
        status,
        publicType,
        publicTypeDesc,
        publicContainerFullness,
        publicClaimBoat,
        publicBiofoulingRating,
        publicLocationDesc,
        mapLat,
        mapLong,
        publicDebrisEnvDesc,
        imageUrl,
        firstName,
        lastName,
        email,
        phoneNumber,
        removalStartDate,
        removalEndDate,
        debrisSize,
        debrisMass,
        tempStorage,
      } = await req.body;

      const derivedClosetIsland = findCloseIsland(mapLat, mapLong);

      await connectDB();

      const matchingOrgs = await Organization.find({ location: derivedClosetIsland });

      const newEvent = await Event.create({
        status,
        publicType,
        publicTypeDesc,
        reportedDate: new Date(),
        publicContainerFullness,
        publicClaimBoat,
        publicBiofoulingRating,
        publicLocationDesc,
        publicDebrisEnvDesc,
        mapLat,
        mapLong,
        removalOrgId: status === 'Reported' ? null : matchingOrgs[Math.floor(Math.random() * matchingOrgs.length)]._id,
        closestIsland: derivedClosetIsland,
        imageUrl,
        removalStartDate: removalStartDate ? new Date(removalStartDate) : null,
        removalEndDate: removalStartDate ? new Date(removalEndDate): null,
        debrisSize,
        debrisMass,
        tempStorage,
        publicContact: {
          firstName,
          lastName,
          email,
          phoneNumber,
        },
      });

      const newThread = await Thread.create({
        eventId: newEvent._id,
      });

      await Event.findByIdAndUpdate(newEvent._id, { threadId: newThread._id });

      res.status(201).json({msg: 'Event reported'});
    } catch (error) {
      console.log(error);
      res.status(500).json({error: 'Unable to report event'});
    }
  } else {
    res.status(405).json({error: 'Method not allowed'});
  }
}
