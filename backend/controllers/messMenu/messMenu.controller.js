const db = require('../../models');

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

exports.getMessMenu = async (req, res) => {
  try {
    const hostelNo = req.query.hostelNo || req.body.tokenHostelNo || req.user?.hostelNo;

    if (!hostelNo) {
      return res.status(400).json({ message: 'hostelNo is required.' });
    }

    const rows = await db.messMenu.findAll({
      where: { hostelNo },
      order: db.Sequelize.literal(`FIELD(day, 'Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday')`),
    });

    const menu = DAYS.map(day => {
      const row = rows.find(r => r.day === day);
      return {
        day,
        breakfast: row?.breakfast || '',
        lunch: row?.lunch || '',
        snacks: row?.snacks || '',
        dinner: row?.dinner || '',
      };
    });

    return res.json({ success: true, hostelNo, menu });
  } catch (error) {
    console.error('getMessMenu error:', error);
    return res.status(500).json({ message: error.message });
  }
};

exports.setMessMenu = async (req, res) => {
  try {
    const hostelNo = req.body.tokenHostelNo || req.user?.hostelNo;
    const { menu } = req.body;

    if (!hostelNo) {
      return res.status(400).json({ message: 'hostelNo missing from token.' });
    }

    if (!Array.isArray(menu) || menu.length === 0) {
      return res.status(400).json({ message: 'menu must be a non-empty array.' });
    }

    for (const entry of menu) {
      if (!DAYS.includes(entry.day)) {
        return res.status(400).json({ message: `Invalid day: ${entry.day}` });
      }

      await db.messMenu.upsert({
        hostelNo,
        day: entry.day,
        breakfast: entry.breakfast || null,
        lunch: entry.lunch || null,
        snacks: entry.snacks || null,
        dinner: entry.dinner || null,
      });
    }

    return res.json({ success: true, message: 'Mess menu updated successfully.' });
  } catch (error) {
    console.error('setMessMenu error:', error);
    return res.status(500).json({ message: error.message });
  }
};
