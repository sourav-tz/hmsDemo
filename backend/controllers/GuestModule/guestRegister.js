const { guestInfo } = require("../../models");
const { users } = require("../../models");
const { Sequelize } = require('sequelize');

const guestRegister = async (req, res) => {
  try {
    const {
      first_name,
      last_name,
      guest_email,
      referrer_email,
      id_proof_no,
      hostel_no,
      contact_number,
      address,
      checkin_date,
      checkout_date,
      gender,
      city,
      state,
      pincode,
      number_of_guests,
      additional_requests,
      purpose_of_visit,
    } = req.body;
    console.log(req.body);
    console.log(referrer_email)
    // Validate required fields
    if (!guest_email) {
      return res.status(400).json({ message: "Guest email is required." });
    }
    if (!first_name) {
      return res.status(400).json({ message: "First name is required." });
    }
    if (!last_name) {
      return res.status(400).json({ message: "Last name is required." });
    }
    if (!id_proof_no) {
      return res.status(400).json({ message: "ID proof number is required." });
    }
    if (!contact_number) {
      return res.status(400).json({ message: "Contact number is required." });
    }
    if (!checkin_date) {
      return res.status(400).json({ message: "Check-in date is required." });
    }
    if (!checkout_date) {
      return res.status(400).json({ message: "Check-out date is required." });
    }
    if (!gender) {
      return res.status(400).json({ message: "Gender is required." });
    }
    if (!city) {
      return res.status(400).json({ message: "City is required." });
    }
    if (!state) {
      return res.status(400).json({ message: "State is required." });
    }
    if (!pincode) {
      return res.status(400).json({ message: "Pincode is required." });
    }
    if (!number_of_guests) {
      return res.status(400).json({ message: "Number of guests is required." });
    }
    if (!purpose_of_visit) {
      return res.status(400).json({ message: "Purpose of visit is required." });
    }

    // Check if a pending entry for the same guest_email already exists
    const existingGuest = await guestInfo.findOne({
      where: {
        guest_email,
        [Sequelize.Op.or]: [
          { status: "pendingAtReferrer" },
          { status: "pendingAtAdmin" },
        ],
      },
    });
    

    if (existingGuest) {
      return res.status(409).json({
        message: "A pending application already exists for this guest.",
        application_id: existingGuest.application_id,
      });
    }

    // Validate referrer email exists in users table if provided
    if (referrer_email) {
      const referrer = await users.findOne({
        where: { email: referrer_email },
      });
      if (!referrer) {
        return res
          .status(404)
          .json({ message: "Referrer email not found in users table." });
      }
    }

    // Insert guest info into the database
    const newGuestInfo = await guestInfo.create({
      status: "pendingAtReferrer",
      first_name,
      last_name,
      guest_email,
      referrer_email,
      id_proof_no,
      hostel_no,
      contact_number,
      address,
      checkin_date,
      checkout_date,
      gender,
      city,
      state,
      pincode,
      number_of_guests,
      additional_requests,
      purpose_of_visit,
    });

    // Return the created application ID
    res.status(201).json({
      message: "Guest information created successfully.",
      application_id: newGuestInfo.application_id,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "An error occurred while creating guest information." });
  }
};

module.exports = guestRegister;
