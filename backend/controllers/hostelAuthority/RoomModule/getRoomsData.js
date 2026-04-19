const db = require("../../../models");

const getRoomsData = async (req, res) => {
    try {
        const hostelNo = req.user?.hostelNo;

        console.log("ROOM DATA FETCHED FOR HOSTEL:", hostelNo);

        if (!hostelNo) {
            return res.status(400).json({
                success: false,
                message: "hostelNo missing in token"
            });
        }

        // 📊 Counts
        const allRoomsData = await db.rooms.findAll({
            where: { hostelNo }
        });

        const totalRooms = allRoomsData.length;

        let fullyFilledCount = 0;
        let partiallyFilledCount = 0;
        let vacantCount = 0;

        allRoomsData.forEach((room) => {
            const status = room.currentOccupancy;

            if (status === "vacant") vacantCount++;
            else if (status === "Partially-Filled") partiallyFilledCount++;
            else if (status === "Fully-Filled") fullyFilledCount++;
        });

        // ✅ SAFE FILTERS
        const filters = {
            hostelNo,
            ...(req.query.roomNo !== undefined && req.query.roomNo !== "" && {
                roomNo: req.query.roomNo
            }),
            ...(req.query.status !== undefined && req.query.status !== "" && {
                currentOccupancy: req.query.status
            }),
            ...(req.query.floorNo !== undefined && req.query.floorNo !== "" && {
                floorNo: req.query.floorNo
            }),
        };

        console.log("FILTERS:", filters);

        // 🔄 Sorting
        const sortField = req.query.sortField || "roomNo";
        const sortOrder = req.query.sortOrder === "desc" ? "DESC" : "ASC";

        // 📄 Pagination
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;

        const totalCount = await db.rooms.count({ where: filters });
        const totalPages = Math.ceil(totalCount / limit);

        if (totalPages === 0) {
            return res.json({
                success: true,
                roomsData: [],
                totalRooms: 0,
                totalPages: 0,
                message: "No rooms found"
            });
        }

        if (page > totalPages || page < 1) {
            return res.status(400).json({
                success: false,
                message: `Page out of range. Total pages: ${totalPages}`
            });
        }

        const offset = (page - 1) * limit;

        const roomsData = await db.rooms.findAll({
            where: filters,
            offset,
            limit,
            order: [[sortField, sortOrder]],
            include: [
                {
                    model: db.roomsStudentMappings,
                    required: false,
                    where: { checkOutDate: null },
                    include: [{ model: db.students }]
                }
            ]
        });

        const pagination = {
            previous: {
                page: page > 1 ? page - 1 : 1,
                limit,
                totalPages
            },
            next: {
                page: page < totalPages ? page + 1 : totalPages,
                limit,
                totalPages
            }
        };

        return res.json({
            success: true,
            roomsData,
            pagination,
            totalRooms,
            vacantCount,
            partiallyFilledCount,
            fullyFilledCount
        });

    } catch (error) {
        console.error("ERROR in getRoomsData:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch rooms data",
            error: error.message
        });
    }
};

module.exports = getRoomsData;