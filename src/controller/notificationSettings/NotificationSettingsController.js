export const getNotificationSettings = async (req, res) => {
  try {
    const applicants = await applicants.find();
    const favourites = await favourites.find().populate("applicantId");
    const reminders = await reminders.find().populate("applicantId");

    res.json({
      applicants,
      favourites,
      reminders
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
